import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

interface EbayCredentials extends OAuth2Credentials {
  /**
   * Space-delimited OAuth scopes the sellers' user grants were issued for, which
   * eBay wants back on every refresh of one. `sell.fulfillment` belongs here: it
   * is a user scope, so only a user grant can carry it.
   */
  scopeList: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    ebay: EbayCredentials;
  }
}

/**
 * The base scope eBay's own client-credentials example asks for. Core requires a
 * `refreshConfig`, but nothing in this package uses the token it mints — orders
 * are the seller's, so every function here goes through `grantRefreshConfig`.
 *
 * Deliberately not `creds.scopeList`, and deliberately not derived from
 * `baseUrl`: see docs/ebay-api.md#scopes.
 */
const APPLICATION_SCOPE = "https://api.ebay.com/oauth/api_scope";

/**
 * eBay meters this API per **day**, not per minute. 69/min is a derived smoothing
 * of the Fulfillment Order resource's 100,000 calls/day, not a rate eBay
 * publishes — see docs/ebay-api.md#call-limits-are-daily-the-per-minute-rate-is-derived.
 */
const rateLimit = {
  type: "requestLimit",
  interval: 60000,
  tokensToAdd: 69,
  maxTokens: 69,
} as const;

export async function registerEbayTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("ebay", (creds): CreateClientData[] => [
    {
      name: buildClientName("ebay", creds),
      rateLimit: [rateLimit],
      requestOptions: {
        defaults: {
          baseURL: creds.baseUrl,
          headers: { "content-type": "application/json" },
        },
      },
      authentication: {
        type: "oauth2",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        // One grant per seller who authorised the application. Seed it with what
        // `exchangeAuthCodeForAccessToken` returns, via `handler.setGrantTokens`;
        // core renews it from here, keyed by the `grantId` the order functions
        // pass. The body is eBay's documented refresh request verbatim, optional
        // `scope` included — see docs/ebay-api.md#refreshing-a-sellers-grant.
        grantRefreshConfig: {
          url: `${creds.baseUrl}/identity/v1/oauth2/token`,
          useBasicAuth: true,
          dataLocation: "urlEncodedForm",
          data: {
            grant_type: "refresh_token",
            refresh_token: "{{refreshToken}}",
            scope: creds.scopeList,
          },
        },
        // Every seller's grant draws on the one bucket above: whether eBay counts
        // the 100,000/day per application or per application-user is unpublished,
        // and sharing is the only reading that cannot overspend either — see
        // docs/ebay-api.md#per-application-or-per-application-user-is-unpublished.
        // Left unstated rather than configured, because declaring it enforces
        // nothing: /docs/core-behaviour.md#grantratelimitbehavior-shared-configures-nothing.
        refreshConfig: {
          url: `${creds.baseUrl}/identity/v1/oauth2/token`,
          useBasicAuth: true,
          dataLocation: "urlEncodedForm",
          data: {
            grant_type: "client_credentials",
            scope: APPLICATION_SCOPE,
          },
        },
      },
    },
  ]);
}
