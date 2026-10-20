import { CreateClientData, TokenCredentials } from "@dianemo/core/client/types";
import RequestHandler, { buildClientName } from "@dianemo/core";

declare module "@dianemo/core" {
  interface ClientTemplates {
    mainfreight: TokenCredentials;
  }
}

export async function registerMainfreightTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "mainfreight",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("mainfreight", creds),
        // This repo's own ceiling, NOT a Mainfreight figure: they publish no
        // rate limit at all — docs/mainfreight-api.md#rate-limit-unpublished-and-100min-is-this-repos-own-ceiling
        rateLimit: [
          {
            type: "requestLimit",
            tokensToAdd: 100,
            maxTokens: 100,
            interval: 60000,
          },
        ],
        requestOptions: {
          defaults: {
            baseURL: creds.baseUrl,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        },
        authentication: {
          type: "token",
          token: creds.token,
          customPrefix: "Secret",
        },
      },
    ]
  );
}
