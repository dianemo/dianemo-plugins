import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    fedex: OAuth2Credentials;
  }
}

export async function registerFedexTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("fedex", (creds): CreateClientData[] => [
    {
      name: buildClientName("fedex", creds),
      // FedEx's own figure, verbatim. Scoped to the *project*, not to a set of
      // credentials, so two clients on one FedEx project each meter to 1,400 and
      // overrun it together — docs/fedex-api.md#rate-limit-1400-transactions-per-10-seconds-per-project
      rateLimit: [
        {
          type: "requestLimit",
          interval: 10000,
          tokensToAdd: 1400,
          maxTokens: 1400,
        },
      ],
      httpStatusCodesToMute: [500, 503],
      requestOptions: { defaults: { baseURL: creds.baseUrl } },
      authentication: {
        type: "oauth2",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        refreshConfig: {
          url: `${creds.baseUrl}/oauth/token`,
          dataLocation: "urlEncodedForm",
          data: {
            grant_type: "client_credentials",
            client_id: "{{clientId}}",
            client_secret: "{{clientSecret}}",
          },
        },
      },
    },
  ]);
}
