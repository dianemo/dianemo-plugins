import { smartyQueryParams, smartySubClient } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyIntlCandidate,
  SmartyIntlRequest,
  SmartyUsCandidate,
  SmartyUsRequest,
} from "./types.js";

export interface SmartyUsOptions {
  /** Sent as a query parameter even on the POST, comma-separated and applied left to right. */
  license?: string;
}

const licenseParams = (license?: string) => (license ? { license } : undefined);

/**
 * Defaults to one strict candidate. `body` is spread last, so a caller can
 * override either — `match: "enhanced"` adds Smarty's non-USPS dataset to the
 * USPS results, and is billed as a separate lookup type.
 */
export const verifySmartyUs = async (
  clientName: string,
  body: SmartyUsRequest,
  { license }: SmartyUsOptions = {}
): Promise<SmartyUsCandidate[]> => {
  const res = await tryHandleRequest<SmartyUsCandidate[]>(
    {
      clientName: smartySubClient(clientName, "us"),
      requestName: "smarty.us.verify",
      method: "POST",
      url: "/street-address",
      params: licenseParams(license),
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
  { license }: SmartyUsOptions = {}
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
  clientName: string,
  params: SmartyIntlRequest
): Promise<SmartyIntlCandidate[]> => {
  const res = await tryHandleRequest<SmartyIntlCandidate[]>(
    {
      clientName: smartySubClient(clientName, "intl"),
      requestName: "smarty.intl.verify",
      method: "GET",
      url: "/verify",
      params: smartyQueryParams(params),
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
