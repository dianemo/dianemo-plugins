import RequestHandler, { buildClientName } from "@dianemo/core";
import type { SmartySubClient } from "./requests/utils.js";
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

/** `api.smarty.com`, not the collection's `api.smartystreets.com` — see docs/smarty-api.md#hosts */
const SUB_CLIENT_HOSTS: Record<SmartySubClient, string> = {
  us: "us-street",
  intl: "international-street",
  usZipcode: "us-zipcode",
  usAutocomplete: "us-autocomplete",
  usExtract: "us-extract",
  usReverseGeo: "us-reverse-geo",
  intlAutocomplete: "international-autocomplete",
};

/**
 * Smarty states no limit for US Autocomplete, so declaring one would invent a
 * figure — see docs/smarty-api.md#default-rate-limits
 */
const UNLIMITED: DeclaredRateLimit[] = [{ type: "noLimit" }];

/**
 * Smarty's default limits per API, checked 2026-11-12. An account on a custom
 * plan has other figures — docs/smarty-api.md#default-rate-limits
 */
const RATE_LIMIT_OPTIONS: Record<
  string,
  Record<SmartySubClient, DeclaredRateLimit[]>
> = {
  professional: {
    us: perSecond(25_000),
    usZipcode: perSecond(25_000),
    usExtract: perSecond(25_000),
    usReverseGeo: perSecond(3_500),
    usAutocomplete: UNLIMITED,
    intl: perSecond(3_500),
    intlAutocomplete: perSecond(400),
  },
};

/**
 * One key pair, but each surface is metered separately, so one bucket across
 * them would cap US traffic against a budget it does not share — see
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
          // Inherited: every sub-client overrides `defaults` and nothing else.
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
        subClients: Object.entries(SUB_CLIENT_HOSTS).map(([name, host]) => ({
          name,
          requestOptions: {
            defaults: { baseURL: `https://${host}.api.smarty.com` },
          },
        })),
      },
    ],
    {
      rateLimitOptions: RATE_LIMIT_OPTIONS,
      defaultRateLimitOption: "professional",
    }
  );
}
