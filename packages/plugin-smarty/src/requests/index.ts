import { tryHandleRequest } from "@dianemo/plugin-kit";
import { buildClientName } from "@dianemo/core";
import {
  smartyQueryParams,
  smartySubClient,
  type SmartySubClient,
} from "./utils.js";
import type {
  SmartyIntlCandidate,
  SmartyIntlRequest,
  SmartyUsCandidate,
  SmartyUsRequest,
} from "./types.js";

export interface SmartyCallOptions {
  /** Organization scope — must match the `organizationId` the
   * Smarty credentials were registered under. */
  organizationId: string | null;
  /** Per-environment integration alias, e.g. `production` or `sandbox`. */
  alias?: string;
  /**
   * US Street only: sent as the `license` query parameter (never in the
   * body), comma-separated and applied left to right. International takes its
   * own `license` on the request.
   */
  license?: string;
}

/** Options for the batch call, which takes the parent client name directly. */
export interface SmartyUsBatchOptions {
  license?: string;
}

function smartyClient(
  opts: SmartyCallOptions,
  sub: Extract<SmartySubClient, "us" | "intl">
): string {
  const alias = opts.alias ?? "production";
  const parent = buildClientName("smarty", {
    organizationId: opts.organizationId,
    instanceId: alias,
  });
  return smartySubClient(parent, sub);
}

const licenseParams = (license?: string) => (license ? { license } : undefined);

/**
 * Defaults to one strict candidate. `body` is spread last, so a caller can
 * override either — `match: "enhanced"` adds Smarty's non-USPS dataset to the
 * USPS results, and is billed as a separate lookup type.
 */
export const verifySmartyUs = async (
  body: SmartyUsRequest,
  options: SmartyCallOptions
): Promise<SmartyUsCandidate[]> => {
  const res = await tryHandleRequest<SmartyUsCandidate[]>(
    {
      clientName: smartyClient(options, "us"),
      requestName: "smarty.us.verify",
      method: "POST",
      url: "/street-address",
      params: licenseParams(options.license),
      data: [
        {
          candidates: 1,
          match: "strict",
          ...body,
        },
      ],
    },
    "SMT_0001",
    "Smarty US verification failed"
  );
  return res.data ?? [];
};

/**
 * The multi-address form of POST /street-address: up to 100 lookups or 32 KB
 * per request. No defaults are injected, so Smarty's own apply per lookup
 * (`candidates` 1, `match` strict). Candidates from every lookup come back
 * flattened; `input_index` says which lookup each belongs to.
 */
export const verifySmartyUsBatch = async (
  clientName: string,
  lookups: SmartyUsRequest[],
  { license }: SmartyUsBatchOptions = {}
): Promise<SmartyUsCandidate[]> => {
  const res = await tryHandleRequest<SmartyUsCandidate[]>(
    {
      clientName: smartySubClient(clientName, "us"),
      requestName: "smarty.us.verifyBatch",
      method: "POST",
      url: "/street-address",
      params: licenseParams(license),
      data: lookups,
    },
    "SMT_0010",
    "Smarty US batch verification failed"
  );
  return res.data ?? [];
};

/** The international endpoint is GET-only, and takes one address per request. */
export const verifySmartyIntl = async (
  params: SmartyIntlRequest,
  options: SmartyCallOptions
): Promise<SmartyIntlCandidate[]> => {
  const cleaned = smartyQueryParams({
    license: options.license,
    ...params,
  });

  const res = await tryHandleRequest<SmartyIntlCandidate[]>(
    {
      clientName: smartyClient(options, "intl"),
      requestName: "smarty.intl.verify",
      method: "GET",
      url: "/verify",
      params: cleaned,
    },
    "SMT_0002",
    "Smarty International verification failed"
  );
  return res.data ?? [];
};

export * from "./intlAutocomplete/index.js";
export * from "./usAutocomplete/index.js";
export * from "./usExtract/index.js";
export * from "./usReverseGeo/index.js";
export * from "./usZipcode/index.js";
