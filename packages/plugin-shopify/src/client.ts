import { throttleAwareTransformResponse } from "./throttling.js";
import RequestHandler, { buildClientName } from "@dianemo/core";
import { GraphQLResponse } from "./requests/types.js";
import {
  CreateClientData,
  RateLimitChange,
  TokenCredentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    shopify: TokenCredentials;
  }
}

/**
 * Admin API version every GraphQL request is pinned to. **Stops being accessible
 * on 2026-10-16**, after which requests are silently redirected to the oldest
 * version still supported — see docs/shopify-api.md#api-version.
 */
const API_VERSION = "2025-10";

/**
 * The bucket a shop starts on. The restore rate is Shopify's published
 * Standard-plan figure; the capacity is **inferred**, because no per-plan
 * capacity is published anywhere. `adoptShopThrottleStatus` below replaces both
 * from the first response onwards, so this governs exactly one request per client
 * — see docs/shopify-api.md#rate-limits-and-the-leaky-bucket.
 */
const STANDARD_PLAN_BUCKET = {
  type: "requestLimit",
  interval: 1000,
  tokensToAdd: 100,
  maxTokens: 1000,
} as const;

/**
 * Every GraphQL response carries `extensions.cost.throttleStatus`, naming the
 * shop's real `maximumAvailable` and `restoreRate`, which is what makes the
 * inferred capacity above tolerable and picks up a plan change without a redeploy.
 *
 * Returns `undefined` — "no change" — unless the numbers actually differ: every
 * returned limit is a fleet-wide broadcast, and the steady state is one response
 * per request.
 */
export const adoptShopThrottleStatus: RateLimitChange = (
  oldRateLimits,
  response
) => {
  const index = oldRateLimits.findIndex(
    (limit) => limit.type === "requestLimit"
  );
  const oldRateLimit = oldRateLimits[index];
  if (!oldRateLimit || oldRateLimit.type !== "requestLimit") return undefined;
  const body = response.data as GraphQLResponse<unknown> | undefined;
  const throttleStatus = body?.extensions?.cost?.throttleStatus;
  if (!throttleStatus) return undefined;
  const { maximumAvailable, restoreRate } = throttleStatus;
  // A shop reporting nonsense keeps the configured default rather than a bucket
  // of NaN tokens, which admits everything.
  if (
    !Number.isFinite(maximumAvailable) ||
    !Number.isFinite(restoreRate) ||
    maximumAvailable <= 0 ||
    restoreRate <= 0
  ) {
    return undefined;
  }
  if (
    oldRateLimit.maxTokens === maximumAvailable &&
    oldRateLimit.tokensToAdd === restoreRate
  ) {
    return undefined;
  }
  // The returned list replaces the client's whole list, so every other
  // entry (a consumer's rateLimitOverrides) has to come back untouched.
  return oldRateLimits.map((limit, i) =>
    i === index
      ? {
          name: oldRateLimit.name,
          type: "requestLimit",
          interval: 1000,
          tokensToAdd: restoreRate,
          maxTokens: maximumAvailable,
        }
      : limit
  );
};

export async function registerShopifyTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "shopify",
    (creds): CreateClientData[] => [
      {
        // The account client carries the credentials and nothing else: the
        // metered `:graph-ql` sub-client is the only thing that reaches Shopify.
        // Leaving the parent without a `baseURL` is deliberate — a direct call
        // to it fails loudly with `Invalid URL` rather than quietly sending
        // unmetered traffic.
        name: buildClientName("shopify", creds),
        // The Admin API takes the bare token with no scheme prefix, and there is
        // no refresh flow because a custom app's token does not expire — see
        // docs/shopify-api.md#authentication.
        authentication: {
          type: "token",
          token: creds.token,
          excludePrefix: true,
          customHeaderName: "X-Shopify-Access-Token",
        },
        requestOptions: {
          defaults: { headers: { "content-type": "application/json" } },
        },
        subClients: [
          {
            name: "graph-ql",
            rateLimit: [STANDARD_PLAN_BUCKET],
            rateLimitChange: adoptShopThrottleStatus,
            axiosOptions: {
              // Turns a body-level `THROTTLED` on an HTTP 200 into a 429 that
              // core can retry. See ./throttling.ts.
              transformResponse: [throttleAwareTransformResponse],
            },
            requestOptions: {
              defaults: {
                baseURL: `https://${creds.baseUrl}/admin/api/${API_VERSION}/graphql.json`,
              },
            },
          },
        ],
      },
    ]
  );
}
