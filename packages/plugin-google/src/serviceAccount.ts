import type { OAuthRefreshConfig } from "@dianemo/core/client/types";
import { createSign } from "node:crypto";

const JWT_BEARER_GRANT = "urn:ietf:params:oauth:grant-type:jwt-bearer";

/**
 * `exp` may be at most an hour past `iat`; Google rejects more, so this is a
 * ceiling rather than a tunable — docs/google-api.md#service-account-jwt-bearer-flow
 */
const ASSERTION_TTL_SECONDS = 3600;

const base64Url = (value: string) => Buffer.from(value).toString("base64url");

export interface ServiceAccountInput {
  serviceAccountEmail: string;
  privateKey: string;
  scopes: string[];
  tokenUrl: string;
  now?: Date;
}

/**
 * Signs the RS256 assertion Google's JWT-bearer grant takes in place of a client
 * secret. `node:crypto` rather than a JWT library: the format is a dozen lines
 * and no JWT library is a runtime dependency here.
 */
export function signServiceAccountAssertion(
  input: ServiceAccountInput
): string {
  const issuedAt = Math.floor((input.now ?? new Date()).getTime() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: input.serviceAccountEmail,
      scope: input.scopes.join(" "),
      aud: input.tokenUrl,
      iat: issuedAt,
      exp: issuedAt + ASSERTION_TTL_SECONDS,
    })
  );

  // A key lifted out of the service-account JSON by hand, or passed through an
  // env var, arrives with escaped newlines, which createSign rejects as a
  // malformed PEM.
  const privateKey = input.privateKey.replace(/\\n/g, "\n");

  const signingInput = `${header}.${claims}`;
  const signature = createSign("RSA-SHA256")
    .update(signingInput)
    .end()
    .sign(privateKey, "base64url");
  return `${signingInput}.${signature}`;
}

export interface ServiceAccountCredentials {
  serviceAccountEmail?: string;
  privateKey?: string;
  scopes?: string[];
  tokenUrl?: string;
}

/**
 * The client-level refresh for a service account: the JWT-bearer grant, the one
 * Google grant that mints a first token from the registered credentials alone.
 *
 * The assertion lives an hour, so it is signed per refresh by
 * `requestInterceptor`. That is an ordinary **enumerable** property: core 2.1.1
 * deep-copies the config with `deepCloneWithFunctions`, which copies enumerable
 * keys (a non-enumerable one would be dropped and never run) and then calls the
 * interceptor on the copy — docs/google-api.md#service-account-jwt-bearer-flow
 */
export function serviceAccountRefreshConfig(
  creds: ServiceAccountCredentials,
  defaultTokenUrl: string
): OAuthRefreshConfig {
  const tokenUrl = creds.tokenUrl ?? defaultTokenUrl;
  return {
    url: tokenUrl,
    dataLocation: "urlEncodedForm",
    data: { grant_type: JWT_BEARER_GRANT, assertion: "" },
    requestInterceptor: (config: OAuthRefreshConfig): OAuthRefreshConfig => ({
      ...config,
      data: {
        ...config.data,
        assertion: signServiceAccountAssertion({
          serviceAccountEmail: creds.serviceAccountEmail ?? "",
          privateKey: creds.privateKey ?? "",
          scopes: creds.scopes ?? [],
          tokenUrl,
        }),
      },
    }),
  };
}
