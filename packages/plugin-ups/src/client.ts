import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

/**
 * `transactionSrc` names the *application*, not the merchant — see
 * docs/ups-api.md#transactionsrc. `merchantId` is the UPS account number the app
 * bills against, and is not `clientId`; unset omits the `x-merchant-id` header
 * rather than sending a value known to be wrong — see
 * docs/ups-api.md#x-merchant-id.
 */
export interface UpsCredentials extends OAuth2Credentials {
  transactionSrc?: string;
  merchantId?: string;
}

declare module "@dianemo/core" {
  interface ClientTemplates {
    ups: UpsCredentials;
  }
}

const DEFAULT_TRANSACTION_SRC = "dianemo";

export async function registerUpsTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("ups", (creds): CreateClientData[] => [
    {
      name: buildClientName("ups", creds),
      // UNSOURCED, and deliberately labelled as such: UPS publishes no rate
      // limit for its REST APIs, so 5/s is a placeholder to calibrate against
      // your own 429s — see docs/ups-api.md#no-published-rate-limit
      rateLimit: [
        {
          type: "requestLimit",
          interval: 1000,
          tokensToAdd: 5,
          maxTokens: 5,
        },
      ],
      requestOptions: {
        defaults: {
          baseURL: creds.baseUrl,
          headers: {
            transactionSrc: creds.transactionSrc ?? DEFAULT_TRANSACTION_SRC,
          },
        },
        // Required by Track, optional everywhere else, and worth sending
        // regardless: UPS support searches their logs by it. Hyphens come out
        // to fit UPS's 32-character cap on a 36-character UUID — see
        // docs/ups-api.md#the-transid-header
        requestInterceptor: (config) => ({
          ...config,
          headers: {
            ...config.headers,
            transId: config.requestId?.replace(/-/g, ""),
          },
        }),
      },
      authentication: {
        type: "oauth2",
        clientId: creds.clientId,
        clientSecret: creds.clientSecret,
        refreshConfig: {
          url: `${creds.baseUrl}/security/v1/oauth/token`,
          // A 6-digit account number, not the 32-character `clientId` that
          // used to be sent here — see docs/ups-api.md#x-merchant-id
          customHeaders: creds.merchantId
            ? { "x-merchant-id": creds.merchantId }
            : undefined,
          useBasicAuth: true,
          dataLocation: "urlEncodedForm",
          data: { grant_type: "client_credentials" },
        },
      },
    },
  ]);
}
