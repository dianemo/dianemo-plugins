import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  DeclaredRateLimit,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

/**
 * `transactionSrc` names the *application*, not the merchant — see
 * docs/ups-api.md#transactionsrc. `merchantId` is the UPS account number the app
 * bills against, and is not `clientId`; unset omits the `x-merchant-id` header
 * rather than sending a value known to be wrong — see
 * docs/ups-api.md#x-merchant-id.
 */
export interface UpsCredentials extends OAuth2Credentials {
  transactionSrc?: string;
  merchantId?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    ups: UpsCredentials;
  }
}

const DEFAULT_TRANSACTION_SRC = "dianemo";

// UNSOURCED, and deliberately labelled as such: UPS publishes no rate limit for
// its REST APIs, so 5/s is a placeholder to calibrate against your own 429s —
// see docs/ups-api.md#no-published-rate-limit
const rateLimit: DeclaredRateLimit[] = [
  { type: "requestLimit", interval: 1000, tokensToAdd: 5, maxTokens: 5 },
];

/**
 * Forwarding is the one UPS API served from a different host: its spec lists
 * `www.onlinetools.ups.com` and `www.onlinetoolsuat.ups.com` rather than the
 * `onlinetools`/`wwwcie` pair — see docs/ups-api.md#the-forwarding-host. Pairing
 * `wwwcie` with `onlinetoolsuat` is an inference: the spec names the two hosts
 * but never says which belongs to which environment. A base URL that is neither
 * known host (a proxy, say) is returned untouched rather than guessed at.
 */
export function forwardingBaseUrl(baseUrl: string): string {
  const { hostname } = new URL(baseUrl);
  if (hostname === "onlinetools.ups.com")
    return "https://www.onlinetools.ups.com";
  if (hostname === "wwwcie.ups.com")
    return "https://www.onlinetoolsuat.ups.com";
  return baseUrl;
}

export async function registerUpsTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("ups", (creds): CreateClientData[] => [
    {
      name: buildClientName("ups", creds),
      rateLimit,
      requestOptions: {
        defaults: {
          baseURL: creds.baseUrl,
          headers: {
            transactionSrc: creds.transactionSrc ?? DEFAULT_TRANSACTION_SRC,
          },
        },
        // Required by Track, optional everywhere else, and worth sending
        // regardless: UPS support searches their logs by it. Hyphens come out
        // to fit UPS's 32-character cap on a 36-character UUID. A request that
        // sets its own wins, because Delivery Intercept caps it at 14 — see
        // docs/ups-api.md#the-transid-header
        requestInterceptor: (config) => ({
          ...config,
          headers: {
            ...config.headers,
            transId:
              config.headers?.transId ?? config.requestId?.replace(/-/g, ""),
          },
        }),
      },
      authentication: {
        type: "oauth2",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        refreshConfig: {
          url: `${creds.baseUrl}/security/v1/oauth/token`,
          // A 6-digit account number, not the 32-character `clientId` that
          // used to be sent here — see docs/ups-api.md#x-merchant-id
          customHeaders: creds.merchantId
            ? { "x-merchant-id": creds.merchantId }
            : undefined,
          useBasicAuth: true,
          dataLocation: "urlEncodedForm",
          data: { grant_type: "client_credentials" },
        },
      },
      // The parent stays a request target for every API on `creds.baseUrl`.
      // The sub-client inherits its auth (stored under the parent's name, so
      // one token), `transactionSrc` and `transId`; it gets its own bucket.
      subClients: [
        {
          name: "forwarding",
          // The same placeholder as the parent, restated rather than left to
          // inheritance so it reads as a decision: the spec states no limit
          // for Forwarding either.
          rateLimit,
          requestOptions: {
            defaults: { baseURL: forwardingBaseUrl(creds.baseUrl) },
          },
        },
      ],
    },
  ]);
}
