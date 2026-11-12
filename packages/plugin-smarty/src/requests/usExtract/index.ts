import { smartyQueryParams, smartySubClient } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyUsExtractOptions,
  SmartyUsExtractResponse,
} from "./types.js";

/**
 * Finds and verifies addresses inside free text (64 KB limit). The text is sent
 * as the raw body with `Content-Type: text/plain`: axios passes a string `data`
 * through unencoded, so it is never JSON-wrapped.
 */
export const extractSmartyUsAddresses = async (
  clientName: string,
  text: string,
  options: SmartyUsExtractOptions = {}
): Promise<SmartyUsExtractResponse> => {
  const res = await tryHandleRequest<SmartyUsExtractResponse>(
    {
      clientName: smartySubClient(clientName, "usExtract"),
      requestName: "smarty.usExtract.extractSmartyUsAddresses",
      method: "POST",
      url: "/",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      params: smartyQueryParams(options),
      data: text,
    },
    "SMT_0006",
    "Smarty US address extraction failed"
  );
  return res.data;
};
