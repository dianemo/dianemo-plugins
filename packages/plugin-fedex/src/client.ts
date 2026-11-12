import { FEDEX_DOCUMENTS_CLIENT } from "./requests/tradeDocuments/utils.js";
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

// Host mapping read off the Trade Documents Upload spec's per-operation `servers`
// blocks — docs/fedex-api.md#trade-documents-upload-host. A base URL that is
// neither of FedEx's two (a proxy, a mock) is passed through unchanged, because
// guessing a FedEx host for it would send documents somewhere the caller never
// configured.
const DOCUMENT_HOSTS: Record<string, string> = {
  "apis.fedex.com": "https://documentapi.prod.fedex.com",
  "apis-sandbox.fedex.com": "https://documentapitest.prod.fedex.com/sandbox",
};

function documentsBaseUrl(baseUrl: string): string {
  try {
    return DOCUMENT_HOSTS[new URL(baseUrl).host] ?? baseUrl;
  } catch {
    return baseUrl;
  }
}

export async function registerFedexTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("fedex", (creds): CreateClientData[] => [
    {
      // Still a usable client in its own right: every request function except
      // the trade-document uploads dispatches against this name, as in v1.0.0.
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
      subClients: [
        {
          name: FEDEX_DOCUMENTS_CLIENT,
          // The spec states no quota for the document host, so it draws on the
          // project's 1,400 per 10 s rather than a bucket of its own: sharing can
          // under-use a separate quota but cannot overrun a shared one —
          // docs/fedex-api.md#trade-documents-upload-host.
          rateLimit: [
            {
              type: "sharedLimit",
              clientName: buildClientName("fedex", creds),
            },
          ],
          requestOptions: {
            defaults: { baseURL: documentsBaseUrl(creds.baseUrl) },
          },
        },
      ],
    },
  ]);
}
