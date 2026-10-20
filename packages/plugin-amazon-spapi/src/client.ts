import RequestHandler, { buildClientName, RequestError } from "@dianemo/core";
import { accountClientNameOf, PII_SEGMENT } from "./requests/clientName.js";
import { RestrictedResource } from "./requests/auth/types.js";
import { RequestConfig } from "@dianemo/core/request/types";
import { getRdt } from "./requests/index.js";
import { DateTime } from "luxon";
import { Method } from "axios";
import {
  CreateClientData,
  OAuth2Credentials,
  RateLimitChange,
} from "@dianemo/core/client/types";
import {
  spapiRegions,
  AwsRegion,
  SPAPIEndpointName,
  spapiEndpoints,
} from "./utils/amazonSpapiData.js";

/**
 * SP-API credentials, plus an optional User-Agent.
 *
 * Amazon asks that the User-Agent identify the calling application and its
 * version so they can attribute traffic. Set `userAgent` to your own
 * application's; the default identifies this plugin, which Amazon accepts but
 * which tells them nothing about who is actually calling.
 */
export interface AmazonSpapiCredentials extends OAuth2Credentials {
  userAgent?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    amazonSpapi: AmazonSpapiCredentials;
  }
}

const DEFAULT_USER_AGENT =
  "dianemo-plugin-amazon-spapi/1.0.0 (Language=JavaScript)";

/**
 * One account client with a `<region>:<endpoint>` sub-client under it, rather
 * than the 528 top-level clients this template used to emit.
 *
 * The names come out byte-identical either way — `mergeChildParentClients`
 * joins parent to child with `:` — but the structure decides where credentials
 * live. A top-level client owns its own credential entry, so a host that ran
 * `getRefreshToken` had nowhere to put the result: there was no
 * `amazonSpapi:<org>:<seller>` to call `setGrantTokens` on, and seeding all 528
 * individually would mean 528 LWA refreshes per seller. As sub-clients they
 * inherit the account's `authentication` and `authOwnerName` points every one of
 * them at the account, so one seeding and one refresh serve the whole fleet.
 */
export async function registerAmazonSpapiTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "amazonSpapi",
    (creds): CreateClientData[] => {
      const accountName = buildClientName("amazonSpapi", creds);
      return [
        {
          name: accountName,
          // Deliberately no `baseURL` and no `rateLimit`: the account client
          // holds the credentials and never carries traffic, since every request
          // resolves a `<region>:<endpoint>` sub-client whose budget is the one
          // Amazon actually meters. A request that somehow addressed this client
          // fails on the missing base URL rather than going out unmetered.
          requestOptions: { requestInterceptor: dateInterceptor },
          httpStatusCodesToMute: [429],
          axiosOptions: { timeout: 60000 },
          authentication: {
            type: "oauth2",
            clientId: creds.clientId,
            clientSecret: creds.clientSecret,
            customHeaderName: "x-amz-access-token",
            excludePrefix: true,
            grantRefreshConfig: {
              url: `${creds.baseUrl}/auth/o2/token`,
              dataLocation: "urlEncodedForm",
              data: {
                grant_type: "refresh_token",
                client_id: "{{clientId}}",
                client_secret: "{{clientSecret}}",
                refresh_token: "{{refreshToken}}",
              },
            },
            grantRateLimitBehavior: "isolated",
            refreshConfig: {
              url: `${creds.baseUrl}/auth/o2/token`,
              dataLocation: "urlEncodedForm",
              data: {
                grant_type: "client_credentials",
                client_id: "{{clientId}}",
                client_secret: "{{clientSecret}}",
              },
            },
          },
          rateLimitChange,
          subClients: (Object.keys(spapiRegions) as AwsRegion[]).map((r) => ({
            name: r,
            requestOptions: {
              // Set here rather than on the account client because
              // `requestOptions.defaults` merges key by key: a `headers` object
              // on a child replaces the parent's outright, so the headers every
              // request needs are restated alongside the region's `host`.
              defaults: {
                baseURL: `https://${spapiRegions[r].host}`,
                headers: {
                  "Content-Type": "application/json",
                  "User-Agent": creds.userAgent ?? DEFAULT_USER_AGENT,
                  host: spapiRegions[r].host,
                },
              },
            },
            subClients: (
              Object.keys(spapiEndpoints) as SPAPIEndpointName[]
            ).map((e) => buildEndpointClient(accountName, r, e)),
          })),
        },
      ];
    }
  );
}

/**
 * One client per endpoint, carrying that endpoint's published quota. Amazon
 * meters per operation, and the rates span three orders of magnitude, so a
 * shared bucket would be wrong in both directions at once — see
 * docs/amazon-spapi-api.md#rate-limits-are-per-operation-so-there-is-one-client-per-endpoint.
 */
const buildEndpointClient = (
  accountName: string,
  region: AwsRegion,
  endpoint: SPAPIEndpointName
): CreateClientData => ({
  name: endpoint,
  rateLimit: [
    {
      type: "requestLimit",
      maxTokens: spapiEndpoints[endpoint].burstLimit,
      tokensToAdd: spapiEndpoints[endpoint].rateLimit,
      interval: 1000,
    },
  ],
  subClients: spapiEndpoints[endpoint].restricted
    ? [
        {
          name: PII_SEGMENT,
          // Load-bearing, do not delete: without it the sub-client merge
          // inherits the account's credential, and core's auth header lands
          // *after* `restrictedDataInterceptor` and overwrites the restricted
          // data token — see
          // /docs/core-behaviour.md#the-auth-header-is-merged-after-requestinterceptor.
          // Amazon then answers 200 with the unrestricted view and nothing in
          // the response says PII was withheld, so the bug is silent.
          authentication: undefined,
          requestOptions: { requestInterceptor: restrictedDataInterceptor },
          // Amazon meters the operation, not the token, so a restricted call
          // spends the same quota as an unrestricted one. Sharing also keeps
          // grant isolation intact: a `sharedLimit` client reads that off the
          // budget owner, which still has the account's `authentication`.
          rateLimit: [
            {
              type: "sharedLimit",
              clientName: `${accountName}:${region}:${endpoint}`,
            },
          ],
        },
      ]
    : undefined,
});

/**
 * Amazon asks for the request date on every SP-API call. Inherited by every
 * sub-client; the restricted-data leaf replaces it with the interceptor below,
 * which sets the same header.
 */
const dateInterceptor = async (config: RequestConfig) => ({
  ...config,
  headers: { ...config.headers, "x-amz-date": requestDate() },
});

/**
 * Exchanges the call for a restricted data token scoped to exactly this path,
 * method and set of data elements, and sends that instead of an LWA token.
 *
 * Amazon scopes an RDT to one resource, so it has to be minted per request
 * rather than cached on the client.
 */
const restrictedDataInterceptor = async (config: RequestConfig) => {
  const dataElements = config.metadata?.dataElements as
    RestrictedResource["dataElements"] | undefined;
  // `handleSpapiRequest` only routes here when there are data elements to ask
  // for. Reached only by a caller addressing the `:pii` client directly, which
  // would otherwise send no credential at all and collect a 403 from Amazon.
  if (!dataElements?.length) {
    throw new RequestError(
      "AMZ_0073",
      `Client "${config.clientName}" carries restricted-data traffic only and has no credential of its own. Call the request function with its \`pii\` argument instead of addressing the ":${PII_SEGMENT}" client.`,
      { metadata: { clientName: config.clientName } }
    );
  }
  // clientName: `amazonSpapi:<orgId|"_">:<alias>:<region>:<endpoint>:pii`
  const awsRegion = config.clientName!.split(":")[3] as AwsRegion;
  const rdt = await getRdt(accountClientNameOf(config.clientName!), awsRegion, [
    {
      method: config.method!.toUpperCase() as Method,
      path: config.url!.split("?")[0],
      dataElements,
    },
  ]);
  return {
    ...config,
    headers: {
      ...config.headers,
      "x-amz-date": requestDate(),
      "x-amz-access-token": rdt.restrictedDataToken,
    },
  };
};

const requestDate = () => DateTime.utc().toFormat("yyyyMMdd'T'HHmmss.SSS'Z'");

export const rateLimitChange: RateLimitChange = async (
  rateLimits,
  response
) => {
  const limit = Number(response.headers["x-amzn-ratelimit-limit"]);
  if (!limit) return undefined;
  // A `sharedLimit` descriptor names no budget to restate, so a restricted-data
  // response cannot recalibrate the endpoint. Its unrestricted sibling spends
  // the same bucket and does carry the header, so the budget still tracks.
  let changed = false;
  const next = rateLimits.map((rateLimit) => {
    if (rateLimit.type !== "requestLimit" || rateLimit.tokensToAdd === limit) {
      return rateLimit;
    }
    changed = true;
    return { ...rateLimit, tokensToAdd: limit };
  });
  return changed ? next : undefined;
};
