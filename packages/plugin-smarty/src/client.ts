import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  BaseCredentialsData,
  CreateClientData,
  DeclaredRateLimit,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    smarty: SmartyCredentials;
  }
}

export interface SmartyCredentials extends BaseCredentialsData {
  /** Rides in the query string, where core's redaction cannot reach it — see
   * docs/smarty-api.md#authid-is-logged-in-plaintext-on-any-error */
  authId: string;
  authToken: string;
}

const perSecond = (n: number): DeclaredRateLimit[] => [
  { type: "requestLimit", interval: 1_000, tokensToAdd: n, maxTokens: n },
];

/**
 * Professional-tier figures, checked 2026-08-25, and wrong for every other tier
 * — docs/smarty-api.md#each-surface-is-its-own-subscription
 */
const RATE_LIMIT_OPTIONS: Record<
  string,
  Record<string, DeclaredRateLimit[]>
> = {
  professional: { us: perSecond(25_000), intl: perSecond(3_500) },
};

/**
 * One key pair, but two subscriptions metered separately, so one bucket across
 * both would cap US traffic against a budget it does not share — see
 * docs/smarty-api.md#each-surface-is-its-own-subscription
 */
export async function registerSmartyTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate(
    "smarty",
    (creds): CreateClientData[] => [
      {
        name: buildClientName("smarty", creds),
        // No `baseURL` and no rate limit: the parent owns only the auth, so a
        // call reaching it fails on the URL rather than going out unmetered.
        requestOptions: {
          // Inherited: both sub-clients override `defaults` and nothing else.
          requestInterceptor: (config) => ({
            ...config,
            params: {
              "auth-id": creds.authId,
              "auth-token": creds.authToken,
              ...(config.params ?? {}),
            },
          }),
        },
        // Limits come from the chosen plan, which core applies by sub-client name.
        subClients: [
          {
            name: "us",
            requestOptions: {
              defaults: { baseURL: "https://us-street.api.smarty.com" },
            },
          },
          {
            name: "intl",
            requestOptions: {
              defaults: {
                baseURL: "https://international-street.api.smarty.com",
              },
            },
          },
        ],
      },
    ],
    {
      rateLimitOptions: RATE_LIMIT_OPTIONS,
      defaultRateLimitOption: "professional",
    }
  );
}
