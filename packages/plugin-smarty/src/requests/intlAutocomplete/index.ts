import { smartyQueryParams, smartySubClient } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyIntlAutocompleteAddressParams,
  SmartyIntlAutocompleteAddressResponse,
  SmartyIntlAutocompleteParams,
  SmartyIntlAutocompleteSuggestResponse,
} from "./types.js";

/**
 * Typeahead suggestions; summary lookups are not charged. `/v2/lookup`, not the
 * collection's unversioned `/lookup` — see docs/smarty-api.md#international-address-autocomplete
 */
export const suggestSmartyIntlAddresses = async (
  clientName: string,
  params: SmartyIntlAutocompleteParams
): Promise<SmartyIntlAutocompleteSuggestResponse> => {
  const res = await tryHandleRequest<SmartyIntlAutocompleteSuggestResponse>(
    {
      clientName: smartySubClient(clientName, "intlAutocomplete"),
      requestName: "smarty.intlAutocomplete.suggestSmartyIntlAddresses",
      method: "GET",
      url: "/v2/lookup",
      params: smartyQueryParams(params),
    },
    "SMT_0008",
    "Smarty international address autocomplete failed"
  );
  return res.data;
};

/** Step 2 of the same flow. A single-address id returns one charged detail result. */
export const getSmartyIntlAutocompleteAddress = async (
  clientName: string,
  { address_id, ...query }: SmartyIntlAutocompleteAddressParams
): Promise<SmartyIntlAutocompleteAddressResponse> => {
  const res = await tryHandleRequest<SmartyIntlAutocompleteAddressResponse>(
    {
      clientName: smartySubClient(clientName, "intlAutocomplete"),
      requestName: "smarty.intlAutocomplete.getSmartyIntlAutocompleteAddress",
      method: "GET",
      url: `/v2/lookup/${encodeURIComponent(address_id)}`,
      params: smartyQueryParams(query),
    },
    "SMT_0009",
    "Smarty international autocomplete address lookup failed"
  );
  return res.data;
};
