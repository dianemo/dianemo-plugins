import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

interface ExtensivCredentials extends OAuth2Credentials {
  /** The 3PL Central user the token is issued for. */
  userLogin: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    extensiv: ExtensivCredentials;
  }
}

export async function registerExtensivTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "extensiv",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("extensiv", creds),
        // This repo's own ceiling, NOT an Extensiv figure: they publish no rate
        // limit. At 1,200/min it is also the most permissive guess in the
        // catalogue — docs/extensiv-api.md#rate-limit-unpublished-and-20s-is-this-repos-own-ceiling
        rateLimit: [
          {
            type: "requestLimit",
            interval: 1000,
            tokensToAdd: 20,
            maxTokens: 20,
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
          type: "oauth2",
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          refreshConfig: {
            url: `${creds.baseUrl}/AuthServer/api/Token`,
            useBasicAuth: true,
            dataLocation: "jsonBody",
            data: {
              grant_type: "client_credentials",
              user_login: creds.userLogin,
            },
          },
        },
      },
    ]
  );
}
