import { BasicCredentials, CreateClientData } from "@dianemo/core/client/types";
import RequestHandler, { buildClientName } from "@dianemo/core";
import { RequestConfig } from "@dianemo/core/request/types";

interface UnisCredentials extends BasicCredentials {
  companyId: string;
  customerId: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    unis: UnisCredentials;
  }
}

const FALLBACK_TOKEN_LIFETIME_SECONDS = 3600;

/**
 * The interceptor below is client-level, so everything sent through
 * `handler.handleRequest` reaches it, not only the request functions this
 * package ships. A string body — which none of them produce, but a caller can
 * send — spreads into `{"0":"{","1":"\"",…}` and ships nonsense, so refuse a
 * non-object here where the cause is still visible.
 */
function requestBody(config: RequestConfig): Record<string, unknown> {
  if (config.data === undefined || config.data === null) return {};
  if (typeof config.data !== "object" || Array.isArray(config.data)) {
    throw new Error(
      `${config.requestName} sent a ${Array.isArray(config.data) ? "array" : typeof config.data} body, but UNIS scopes every call by CompanyID and CustomerID and those merge into a JSON object body`
    );
  }
  return config.data as Record<string, unknown>;
}

/**
 * Core has no 401 handling, so the lifetime reported here is the only thing that
 * expires the cached token: one cut shorter by UNIS keeps being served until our
 * own clock says it lapsed, and every request in that window fails against a
 * dead credential. Both earlier branches are now known to be dead for a real
 * token — a live login returns no lifetime field, and the token is a UUID with
 * no `exp` — so the fallback alone governs, and it is a chosen ceiling rather
 * than anything UNIS states: docs/unis-api.md#token-lifetime.
 */
function tokenLifetimeSeconds(data: Record<string, unknown>, token: string) {
  const stated = Number(data.expires_in ?? data.expiresIn);
  if (Number.isFinite(stated) && stated > 0) return stated;
  return jwtLifetimeSeconds(token) ?? FALLBACK_TOKEN_LIFETIME_SECONDS;
}

function jwtLifetimeSeconds(token: string) {
  if (typeof token !== "string") return;
  const payload = token.split(".")[1];
  if (!payload) return;
  try {
    const { exp } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { exp?: number };
    if (typeof exp !== "number") return;
    const remaining = Math.floor(exp - Date.now() / 1000);
    return remaining > 0 ? remaining : undefined;
  } catch {
    // Not a JWT, or not one whose payload we can read.
    return;
  }
}

export async function registerUnisTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("unis", (creds): CreateClientData[] => {
    // UNIS scopes every call by company and customer, so the pair rides in the
    // JSON body of each request rather than in a header.
    const requestInterceptor = async (config: RequestConfig) => ({
      ...config,
      data: {
        ...requestBody(config),
        CompanyID: creds.companyId,
        CustomerID: creds.customerId,
      },
    });

    return [
      {
        name: buildClientName("unis", creds),
        /**
         * UNIS's stated per-user limit. There is a second, per-**IP** limit of
         * 1,000/min that a per-client budget cannot see: ten clients on one host
         * reach it while each looks compliant — docs/unis-api.md#rate-limit
         */
        rateLimit: {
          type: "requestLimit",
          interval: 60000,
          tokensToAdd: 100,
          maxTokens: 100,
        },
        /**
         * A 404 is retried rather than believed. Which UNIS responses are
         * transient was not established here; this mirrors a configuration that
         * has run in production, where retrying 404 was evidently needed. See
         * docs/unis-api.md#404-is-retried
         */
        retryOptions: { retryStatusCodes: [404] },
        requestOptions: {
          defaults: { baseURL: creds.baseUrl },
          requestInterceptor,
        },
        authentication: {
          type: "oauth2",
          clientId: creds.username,
          clientSecret: creds.password,
          // Not `type: "basic"`, which UNIS also documents and core supports
          // natively: Basic would delete the whole token-lifetime question but
          // puts the account password on every request rather than once per
          // refresh — docs/unis-api.md#basic-auth-is-also-supported-and-would-remove-the-ttl-problem
          excludePrefix: true,
          refreshConfig: {
            url: `${creds.baseUrl}/user/login`,
            dataLocation: "jsonBody",
            data: { username: "{{clientId}}", password: "{{clientSecret}}" },
            responseInterceptor: (res) => {
              const token = res.data.oAuthToken as string;
              return {
                access_token: token,
                expires_in: tokenLifetimeSeconds(res.data, token),
                // Required by core's OAuthResponse, inert on the wire:
                // `excludePrefix: true` sends the token bare, which UNIS's own
                // documented request headers confirm is right, and core never
                // reads a stored token type —
                // docs/unis-api.md#token-type-and-the-bearer-prefix-settled-bare
                token_type: "Bearer",
              };
            },
          },
        },
      },
    ];
  });
}
