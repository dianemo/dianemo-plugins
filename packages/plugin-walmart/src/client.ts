import RequestHandler, { buildClientName } from "@dianemo/core";
import crypto from "node:crypto";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

interface WalmartCredentials extends OAuth2Credentials {
  partnerId: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    walmart: WalmartCredentials;
  }
}

export async function registerWalmartTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "walmart",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("walmart", creds),
        rateLimit: [
          {
            // One shared bucket at the floor of the endpoints this package
            // calls — 60/min — see docs/walmart-api.md#rate-limits.
            //
            // It deliberately cannot protect the price paths: PUT /v3/price is
            // 100/hour and the PRICE_AND_PROMOTION feed 10/hour shared, and one
            // requestLimit cannot express a second, much slower budget. A caller
            // looping over price feeds has to pace itself.
            type: "requestLimit",
            interval: 60_000,
            tokensToAdd: 60,
            maxTokens: 60,
          },
        ],
        requestOptions: {
          defaults: {
            baseURL: creds.baseUrl,
            headers: { "WM_SVC.NAME": "Walmart Marketplace" },
          },
          requestInterceptor: (config) => ({
            ...config,
            headers: {
              ...config.headers,
              "WM_QOS.CORRELATION_ID": config.requestId,
            },
          }),
        },
        authentication: {
          type: "oauth2",
          clientId: creds.clientId,
          clientSecret: creds.clientSecret,
          excludePrefix: true,
          customHeaderName: "WM_SEC.ACCESS_TOKEN",
          refreshConfig: {
            url: `${creds.baseUrl}/v3/token`,
            useBasicAuth: true,
            customHeaders: {
              "WM_PARTNER.ID": creds.partnerId,
              "WM_SVC.NAME": "Walmart Marketplace",
              // A literal, not one per refresh: a refresh config cannot hold
              // a function — see
              // /docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function.
              // Walmart accepts the repeat; it only coarsens its own trace logs
              // for token refreshes. Per-request IDs are still unique, from
              // `requestOptions.requestInterceptor` above.
              "WM_QOS.CORRELATION_ID": crypto.randomUUID(),
            },
            dataLocation: "urlEncodedForm",
            data: { grant_type: "client_credentials" },
          },
        },
      },
    ]
  );
}
