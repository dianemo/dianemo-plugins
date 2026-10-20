import { CreateClientData, TokenCredentials } from "@dianemo/core/client/types";
import RequestHandler, { buildClientName } from "@dianemo/core";

declare module "@dianemo/core" {
  interface ClientTemplates {
    printNode: TokenCredentials;
  }
}

export async function registerPrintNodeTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "printNode",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("printNode", creds),
        // 10/s per account, and maxTokens deliberately equal to tokensToAdd —
        // see docs/printnode-api.md#rate-limiting
        rateLimit: [
          {
            type: "requestLimit",
            interval: 1000,
            tokensToAdd: 10,
            maxTokens: 10,
          },
        ],
        requestOptions: {
          defaults: {
            baseURL: creds.baseUrl,
            headers: { "Content-Type": "application/json" },
          },
        },
        authentication: {
          type: "token",
          customPrefix: "Basic",
          token: creds.token,
          encodeBase64: true,
        },
      },
    ]
  );
}
