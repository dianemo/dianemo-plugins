import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    helpscout: OAuth2Credentials;
  }
}

export async function registerHelpscoutTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "helpscout",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("helpscout", creds),
        // The documented Standard-plan figure, which is the floor: Plus is 400
        // and Pro 800, and the quota is per account rather than per client. Raise
        // it with `rateLimitOverrides` rather than here —
        // docs/helpscout-api.md#rate-limit-200min-is-the-standard-plan-and-the-plan-is-the-variable
        rateLimit: [
          {
            type: "requestLimit",
            interval: 60000,
            tokensToAdd: 200,
            maxTokens: 200,
          },
        ],
        authentication: {
          type: "oauth2",
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          refreshConfig: {
            url: `${creds.baseUrl}/v2/oauth2/token`,
            dataLocation: "urlEncodedForm",
            data: {
              grant_type: "client_credentials",
              client_id: "{{clientId}}",
              client_secret: "{{clientSecret}}",
            },
          },
        },
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
