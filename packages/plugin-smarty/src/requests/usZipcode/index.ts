import { smartyQueryParams, smartySubClient } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyUsZipcodeLookup,
  SmartyUsZipcodeOptions,
  SmartyUsZipcodeResult,
} from "./types.js";

// POST is limited to 100 lookups or 16,384 bytes; GET takes one lookup.
// Smarty reference page https://www.smarty.com/docs/apis/us-zipcode-api/reference,
// checked 2026-11-12.

export const lookupSmartyUsZipcode = async (
  clientName: string,
  lookup: SmartyUsZipcodeLookup,
  options: SmartyUsZipcodeOptions = {}
): Promise<SmartyUsZipcodeResult[]> => {
  const params = smartyQueryParams({ ...lookup, ...options });

  const res = await tryHandleRequest<SmartyUsZipcodeResult[]>(
    {
      clientName: smartySubClient(clientName, "usZipcode"),
      requestName: "smarty.usZipcode.lookupSmartyUsZipcode",
      method: "GET",
      url: "/lookup",
      params,
    },
    "SMT_0003",
    "Smarty US ZIP Code lookup failed"
  );
  return res.data ?? [];
};

export const lookupSmartyUsZipcodeBatch = async (
  clientName: string,
  lookups: SmartyUsZipcodeLookup[],
  options: SmartyUsZipcodeOptions = {}
): Promise<SmartyUsZipcodeResult[]> => {
  const res = await tryHandleRequest<SmartyUsZipcodeResult[]>(
    {
      clientName: smartySubClient(clientName, "usZipcode"),
      requestName: "smarty.usZipcode.lookupSmartyUsZipcodeBatch",
      method: "POST",
      url: "/lookup",
      params: options.license ? { license: options.license } : {},
      data: lookups,
    },
    "SMT_0004",
    "Smarty US ZIP Code batch lookup failed"
  );
  return res.data ?? [];
};
