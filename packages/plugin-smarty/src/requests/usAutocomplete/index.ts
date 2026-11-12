import { smartyQueryParams, smartySubClient } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyUsAutocompleteRequest,
  SmartyUsAutocompleteResponse,
} from "./types.js";

/** Sending `selected` (an `entry_id`) expands one collapsed group; no second operation is documented. */
export const suggestSmartyUsAutocomplete = async (
  clientName: string,
  params: SmartyUsAutocompleteRequest
): Promise<SmartyUsAutocompleteResponse> => {
  const res = await tryHandleRequest<SmartyUsAutocompleteResponse>(
    {
      clientName: smartySubClient(clientName, "usAutocomplete"),
      requestName: "smarty.usAutocomplete.suggestSmartyUsAutocomplete",
      method: "GET",
      url: "/v2/lookup",
      params: smartyQueryParams(params),
    },
    "SMT_0011",
    "Smarty US Autocomplete lookup failed"
  );
  return res.data ?? {};
};
