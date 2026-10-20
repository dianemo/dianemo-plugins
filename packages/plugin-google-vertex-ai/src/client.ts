import RequestHandler, { buildClientName } from "@dianemo/core";
import crypto from "node:crypto";
import {
  AuthDataOAuth2,
  BaseCredentialsData,
  CreateClientData,
  OAuthRefreshConfig,
} from "@dianemo/core/client/types";

/**
 * Google Vertex AI Search (Discovery Engine) credentials.
 *
 * A **service account** is the credential this API is built around, and the only
 * one that can bootstrap a token from what is registered here:
 * `serviceAccountEmail` is the `client_email` from the service-account JSON key
 * and `privateKey` its `private_key`, PEM and all. It needs
 * `roles/discoveryengine.viewer` on the project owning the engine, or
 * `roles/discoveryengine.editor` to write session state —
 * docs/vertex-ai-api.md#authentication
 *
 * `clientId`/`clientSecret` are additive, enabling per-user delegated calls with
 * a refresh token per `grantId`. They cannot replace the service account: no
 * Google grant mints a first token from an id and secret alone
 * (docs/vertex-ai-api.md#authentication), which is the trap this template
 * shipped with.
 */
export interface GoogleVertexAiCredentials extends BaseCredentialsData {
  serviceAccountEmail: string;
  privateKey: string;
  scope?: string;
  clientId?: string;
  clientSecret?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    googleVertexAi: GoogleVertexAiCredentials;
  }
}

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DEFAULT_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

const JWT_BEARER_GRANT = "urn:ietf:params:oauth:grant-type:jwt-bearer";

/**
 * A documented ceiling, not a tunable: Google caps the assertion at one hour and
 * rejects an `exp` more than 65 minutes past `iat`.
 * docs/vertex-ai-api.md#authentication
 */
const ASSERTION_TTL_SECONDS = 3600;

function base64Url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

/**
 * Signs the RS256 assertion Google's JWT-bearer grant takes in place of a client
 * secret. Header, claim set and algorithm are as documented —
 * docs/vertex-ai-api.md#authentication
 *
 * `node:crypto` rather than a JWT library: this is the only JWT in the package,
 * and `jsonwebtoken` is not a runtime dependency anywhere in this repo.
 */
function signServiceAccountAssertion(creds: GoogleVertexAiCredentials) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: creds.serviceAccountEmail,
      scope: creds.scope ?? DEFAULT_SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + ASSERTION_TTL_SECONDS,
    })
  );

  // A private key lifted out of the service-account JSON by hand, or passed
  // through an env var, usually arrives with its newlines escaped, and
  // createSign rejects that as a malformed PEM.
  const privateKey = creds.privateKey?.includes("\\n")
    ? creds.privateKey.replace(/\\n/g, "\n")
    : creds.privateKey;

  const signingInput = `${header}.${claims}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .end()
    .sign(privateKey, "base64url");

  return `${signingInput}.${signature}`;
}

/**
 * The client-level grant: JWT-bearer, the only Google grant that can mint a
 * first token from nothing but the credentials registered here. `{{refreshToken}}`
 * deliberately does **not** appear at this level — it resolves only on a grant
 * config, and otherwise the literal placeholder goes out on the wire
 * (/docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh).
 *
 * The assertion has to be minted per refresh, since it lives an hour, and
 * `requestInterceptor` is the only hook that runs then. Keep it
 * **non-enumerable**: core `structuredClone`s the config that holds it and
 * `DataCloneError`s on an enumerable function property
 * (/docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function).
 */
function serviceAccountRefreshConfig(
  creds: GoogleVertexAiCredentials
): OAuthRefreshConfig {
  const config: OAuthRefreshConfig = {
    url: TOKEN_URL,
    dataLocation: "urlEncodedForm",
    data: { grant_type: JWT_BEARER_GRANT, assertion: "" },
  };

  Object.defineProperty(config, "requestInterceptor", {
    value: (intercepted: OAuthRefreshConfig): OAuthRefreshConfig => ({
      ...intercepted,
      data: {
        ...intercepted.data,
        assertion: signServiceAccountAssertion(creds),
      },
    }),
    enumerable: false,
    writable: true,
    configurable: true,
  });

  return config;
}

/**
 * Registered only when an OAuth client was. `{{refreshToken}}` is correct here: a
 * `grantId` routes core to the per-grant key `setGrantTokens` writes.
 */
function grantRefreshConfig(): OAuthRefreshConfig {
  return {
    url: TOKEN_URL,
    dataLocation: "urlEncodedForm",
    data: {
      grant_type: "refresh_token",
      client_id: "{{clientId}}",
      client_secret: "{{clientSecret}}",
      refresh_token: "{{refreshToken}}",
    },
  };
}

function buildAuth(creds: GoogleVertexAiCredentials): AuthDataOAuth2 {
  const auth: AuthDataOAuth2 = {
    type: "oauth2",
    // Only ever interpolated into `{{clientId}}`/`{{clientSecret}}`, which the
    // JWT-bearer body does not use — the assertion is the identity there — so
    // these matter only to the delegated grant below.
    clientId: creds.clientId ?? creds.serviceAccountEmail,
    clientSecret: creds.clientSecret ?? "",
    refreshConfig: serviceAccountRefreshConfig(creds),
  };

  // No `grantRateLimitBehavior`: every grant sharing the client's bucket is
  // both what we want and already the behaviour —
  // /docs/core-behaviour.md#grantratelimitbehavior-shared-configures-nothing
  if (creds.clientId && creds.clientSecret) {
    auth.grantRefreshConfig = grantRefreshConfig();
  }

  return auth;
}

export async function registerGoogleVertexAiTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "googleVertexAi",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("googleVertexAi", creds),
        rateLimit: [
          {
            // `getAnswer` is an LLM query request, the tightest of the methods
            // this package calls. The quota is per *project*, so two clients
            // pointed at one project each meter to 60 and overrun it together —
            // docs/vertex-ai-api.md#quotas
            type: "requestLimit",
            interval: 60_000,
            tokensToAdd: 60,
            maxTokens: 60,
          },
        ],
        authentication: buildAuth(creds),
        requestOptions: {
          defaults: {
            baseURL: creds.baseUrl,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        },
      },
    ]
  );
}
