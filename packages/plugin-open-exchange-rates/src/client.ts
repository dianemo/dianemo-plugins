import { CreateClientData, TokenCredentials } from "@dianemo/core/client/types";
import RequestHandler, { buildClientName } from "@dianemo/core";

declare module "@dianemo/core" {
  interface ClientTemplates {
    openExchangeRates: TokenCredentials;
  }
}

/**
 * `creds.token` is the OXR `app_id`. Sent as a header, not the `app_id` query
 * parameter OXR also accepts: core's redaction does not recognise that parameter, so
 * the query form logged the App ID in plaintext on every 4xx/5xx. Nothing may put it
 * back into `params` — OXR treats the parameter as overriding the header.
 * docs/open-exchange-rates-api.md#the-app-id-goes-in-the-header-not-the-query-string
 */
export async function registerOpenExchangeRatesTemplate(
  handler: RequestHandler
) {
  await handler.registerClientTemplate(
    "openExchangeRates",
    (creds): CreateClientData => ({
      name: buildClientName("openExchangeRates", creds),
      rateLimit: [
        {
          // Free tier is 1000 req/month, so a polite 60/min only catches a runaway
          // loop — a daily-refresh consumer is far below it. docs/open-exchange-rates-api.md#rate-limits
          type: "requestLimit",
          interval: 60_000,
          tokensToAdd: 60,
          maxTokens: 60,
        },
      ],
      requestOptions: {
        defaults: { baseURL: creds.baseUrl },
      },
      authentication: {
        type: "token",
        token: creds.token,
        customPrefix: "Token",
      },
    })
  );
}
