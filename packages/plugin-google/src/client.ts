import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  AuthDataOAuth2,
  BaseCredentialsData,
  CreateClientData,
} from "@dianemo/core/client/types";

/**
 * Google credentials, one per API and each optional (the template refuses a
 * registration carrying neither).
 *
 * `apiKey` is a Google Cloud API key, sent as the `key` query parameter, and is
 * what Address Validation documents for server-to-server use.
 * `clientId`/`clientSecret` is an OAuth client for calls on behalf of a
 * signed-in user, which the OIDC userinfo endpoint behind `getGoogleProfile`
 * requires and Address Validation also accepts. There is no `client_credentials`
 * grant: Google offers none, and nothing it does offer bootstraps from an id and
 * secret alone (docs/google-api.md#no-grant-bootstraps-from-a-client-id-and-secret)
 * — which is also why Address Validation gets the API-key path rather than the
 * service-account one (docs/google-api.md#service-account-jwt-bearer-flow).
 *
 * `baseUrl` serves the profile sub-client; Address Validation has its own host.
 */
export interface GoogleCredentials extends BaseCredentialsData {
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  addressValidationBaseUrl?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    google: GoogleCredentials;
  }
}

const DEFAULT_ADDRESS_VALIDATION_BASE_URL =
  "https://addressvalidation.googleapis.com";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

/**
 * The OAuth block for an account that registered an OAuth client, or nothing for
 * an API-key-only one. Every OAuth call must carry a `grantId`: only
 * `grantRefreshConfig` can mint a token, because a grant is the one place
 * `{{refreshToken}}` resolves —
 * /docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh
 *
 * The client-level config therefore omits the token it cannot obtain and exists
 * only because the type mandates one. A grant-less call has to fail; this way it
 * fails at Google with `invalid_request` naming the missing `refresh_token`
 * rather than shipping the literal placeholder as a credential.
 */
function buildOAuth2Auth(creds: GoogleCredentials): AuthDataOAuth2 | undefined {
  const { clientId, clientSecret } = creds;
  if (!clientId || !clientSecret) return undefined;
  return {
    type: "oauth2",
    clientId,
    clientSecret,
    // No `grantRateLimitBehavior`: `"shared"` is already the behaviour, and
    // declaring it configures nothing —
    // /docs/core-behaviour.md#grantratelimitbehavior-shared-configures-nothing
    grantRefreshConfig: {
      url: TOKEN_URL,
      dataLocation: "urlEncodedForm",
      data: {
        grant_type: "refresh_token",
        client_id: "{{clientId}}",
        client_secret: "{{clientSecret}}",
        refresh_token: "{{refreshToken}}",
      },
    },
    refreshConfig: {
      url: TOKEN_URL,
      dataLocation: "urlEncodedForm",
      data: {
        grant_type: "refresh_token",
        client_id: "{{clientId}}",
        client_secret: "{{clientSecret}}",
      },
    },
  };
}

/**
 * With an API key the credential rides in the query string, so the inherited
 * OAuth block is cleared: leaving it would have every call refresh a token it
 * does not send. The key goes on `config.params` and not `config.url` because
 * core re-runs this interceptor per attempt against the config it already
 * modified, so concatenating sends `key=K&key=K` on the first retry — three
 * further failure modes at docs/google-api.md#api-key-injection.
 */
function buildAddressValidationSubClient(
  creds: GoogleCredentials
): CreateClientData {
  const apiKey = creds.apiKey;
  return {
    name: "addressValidation",
    // 6,000 QPM covering the validation methods only, which is all this plugin
    // calls. What that quota is scoped to is an open question —
    // docs/google-api.md#address-validation-quotas
    rateLimit: [
      {
        type: "requestLimit",
        interval: 60_000,
        tokensToAdd: 6000,
        maxTokens: 6000,
      },
    ],
    ...(apiKey ? { authentication: undefined } : {}),
    requestOptions: {
      defaults: {
        baseURL:
          creds.addressValidationBaseUrl ?? DEFAULT_ADDRESS_VALIDATION_BASE_URL,
      },
      ...(apiKey
        ? {
            requestInterceptor: (config) => {
              config.params = { ...(config.params ?? {}), key: apiKey };
              return config;
            },
          }
        : {}),
    },
  };
}

export async function registerGoogleTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "google",
    (creds): CreateClientData[] => {
      const authentication = buildOAuth2Auth(creds);
      if (!authentication && !creds.apiKey) {
        throw new Error(
          "Google credentials need an apiKey, a clientId/clientSecret pair, or both — an account with neither cannot authenticate against either API"
        );
      }
      const parentName = buildClientName("google", creds);

      return [
        {
          name: parentName,
          // The account client owns the credentials: `mergeChildParentClients`
          // points every sub-client's `authOwnerName` here, so one
          // `setGrantTokens(parentName, …)` serves both hosts.
          authentication,
          // A self-imposed backstop, NOT a vendor figure — Google publishes no
          // QPM for the OIDC userinfo endpoint. Do not read it as one:
          // docs/google-api.md#openid-connect-userinfo-has-no-published-quota
          rateLimit: [
            {
              type: "requestLimit",
              interval: 60_000,
              tokensToAdd: 600,
              maxTokens: 600,
            },
          ],
          requestOptions: { defaults: { baseURL: creds.baseUrl } },
          subClients: [
            // Registered only with an OAuth client, so an API-key-only account
            // calling `getGoogleProfile` is told the client does not exist
            // rather than getting a bare 401 back from Google.
            ...(authentication
              ? [
                  {
                    name: "profile",
                    // Same host as the parent's `baseUrl`, so it draws on the
                    // one budget rather than a second bucket for one quota.
                    rateLimit: [
                      {
                        type: "sharedLimit" as const,
                        clientName: parentName,
                      },
                    ],
                  },
                ]
              : []),
            buildAddressValidationSubClient(creds),
          ],
        },
      ];
    }
  );
}
