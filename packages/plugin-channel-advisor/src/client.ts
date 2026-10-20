import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    channelAdvisor: OAuth2Credentials;
  }
}

export async function registerChannelAdvisorTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "channelAdvisor",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("channelAdvisor", creds),
        rateLimit: [
          {
            /**
             * ChannelAdvisor's per-profile quota over a one-minute window. Neither
             * the 5-concurrent integration limit nor the per-endpoint limits are
             * expressible alongside it — see
             * docs/channel-advisor-api.md#request-limits.
             */
            type: "requestLimit",
            interval: 60_000,
            tokensToAdd: 2000,
            maxTokens: 2000,
          },
        ],
        requestOptions: { defaults: { baseURL: creds.baseUrl } },
        authentication: {
          type: "oauth2",
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          /**
           * The only grant type ChannelAdvisor accepts for renewing access, and
           * the reason every request carries a `grantId` — see
           * docs/channel-advisor-api.md#refreshing-the-access-token.
           */
          grantRefreshConfig: {
            url: `${creds.baseUrl}/oauth2/token`,
            useBasicAuth: true,
            dataLocation: "urlEncodedForm",
            data: {
              grant_type: "refresh_token",
              refresh_token: "{{refreshToken}}",
            },
          },
          /**
           * Reached only by a request carrying no `grantId` — a caller reaching
           * past the request functions. `client_credentials` is unsupported by
           * ChannelAdvisor, but it is the better of two failures: a client-level
           * `{{refreshToken}}` would go out unresolved
           * (/docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh),
           * whereas this fails at the token endpoint with the vendor naming the
           * reason.
           */
          refreshConfig: {
            url: `${creds.baseUrl}/oauth2/token`,
            useBasicAuth: true,
            dataLocation: "urlEncodedForm",
            data: { grant_type: "client_credentials" },
          },
        },
      },
    ]
  );
}
