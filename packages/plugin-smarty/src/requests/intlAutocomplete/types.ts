/** Sources and the v1/v2 question: docs/smarty-api.md#international-address-autocomplete */

export interface SmartyIntlAutocompleteParams {
  /** ISO3 alpha-3, uppercase. */
  country: string;
  /** Partial address typed so far; the reference caps it at 32 characters. */
  search: string;
  /** Reference range 1-10, default 5. */
  max_results?: number;
  /** In the collection only; its meaning is not on the v2 reference page. */
  distance?: number;
  /** Reference: only `on` is valid, supported for CAN, AUS and DEU. */
  geolocation?: "on";
  /** In the collection only; absent from the v2 reference page. */
  include_only_administrative_area?: string;
  /** Comma-separated. Cannot be combined with `include_only_postal_code`. */
  include_only_locality?: string;
  /** Comma-separated. Cannot be combined with `include_only_locality`. */
  include_only_postal_code?: string;
  /** In the collection only; absent from the v2 reference page. */
  latitude?: number;
  /** In the collection only; absent from the v2 reference page. */
  longitude?: number;
  /** Not in the collection; the v2 reference page lists `native` and `latin`. */
  language?: "native" | "latin";
  /** Comma-separated license names; the collection sends it. */
  license?: string;
}

export interface SmartyIntlAutocompleteAddressParams {
  /** From a suggestion; not persistent, valid only for the current session. */
  address_id: string;
  country: string;
  /** Reference range 1-100, default 100: suggestions returned when expanding a group. */
  max_group_results?: number;
  license?: string;
}

/** A suggestion, or a subunit summary when expanding a group. */
export interface SmartyIntlAutocompleteSummary {
  /** Above 1 means more lookups under this id, which is free; 1 means a charged detail lookup. */
  entries: number;
  address_text: string;
  address_id: string;
}

export interface SmartyIntlAutocompleteDetail {
  street?: string;
  locality?: string;
  administrative_area?: string;
  administrative_area_short?: string;
  administrative_area_long?: string;
  postal_code?: string;
  country_iso3?: string;
}

export interface SmartyIntlAutocompleteSuggestResponse {
  candidates: SmartyIntlAutocompleteSummary[];
}

/** Summaries when the id covers several addresses, one detail when it covers one. */
export interface SmartyIntlAutocompleteAddressResponse {
  candidates: Array<
    SmartyIntlAutocompleteSummary | SmartyIntlAutocompleteDetail
  >;
}
