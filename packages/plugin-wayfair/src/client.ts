import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    wayfair: OAuth2Credentials;
  }
}

export async function registerWayfairTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "wayfair",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("wayfair", creds),
        rateLimit: [
          {
            // Unsourced: Wayfair publishes no rate limit for this API, and 60/min
            // is this repository's own politeness ceiling, never verified against
            // Wayfair. Treat it as a guess, not a documented figure — see
            // docs/wayfair-api.md#rate-limits-are-unpublished.
            type: "requestLimit",
            interval: 60000,
            tokensToAdd: 60,
            maxTokens: 60,
          },
        ],
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
          refreshConfig: {
            url: "https://sso.auth.wayfair.com/oauth/token",
            dataLocation: "jsonBody",
            data: {
              grant_type: "client_credentials",
              client_id: "{{clientId}}",
              client_secret: "{{clientSecret}}",
              // The API host root with its trailing slash, not the GraphQL
              // endpoint: the wrong audience has no Auth0 registration, so every
              // request dies at token acquisition before a query is sent.
              // Derived from `baseUrl` so the sandbox host follows the same rule.
              // See docs/wayfair-api.md#the-token-audience-is-the-api-host-root.
              audience: `${new URL(creds.baseUrl).origin}/`,
            },
          },
        },
      },
    ]
  );
}
