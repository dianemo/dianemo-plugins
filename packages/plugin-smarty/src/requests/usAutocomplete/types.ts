/**
 * Smarty US Autocomplete API (v2) shapes. Source: Smarty reference page
 * https://www.smarty.com/docs/apis/us-autocomplete/reference, checked
 * 2026-11-12. The page states parameter types and limits in a table; response
 * field types are stated in a table too, but optionality is read from its
 * "presence" column and example, so treat that as inference where noted.
 */

export interface SmartyUsAutocompleteRequest {
  /** Max 32 characters; required unless `selected` is sent (the page documents `selected` with no `search`). */
  search?: string;
  /** Plan license name; absent from the reference page (carried over from the Pro request, inference). */
  license?: string;
  /** 1 to 10; Smarty's default is 10. */
  max_results?: number;
  /** `CITY,ST;CITY,ST`, up to 100, each entry ending in a state; do not repeat those states in `include_only_states`. */
  include_only_cities?: string;
  /** Semicolon-separated codes (`UT;ID`), or alone `CONTIGUOUS` / `ALLSTATES`, which need `include_only_cities` empty. */
  include_only_states?: string;
  /** Semicolon-separated 5-digit ZIPs, max 100; cannot combine with other include/exclude/prefer parameters, and `prefer_geolocation` must not be `city`. */
  include_only_zip_codes?: string;
  /** Semicolon-separated state codes; cannot combine with `include_*`; set `prefer_geolocation: "none"` if the user is in an excluded state. */
  exclude_states?: string;
  /** Same format as `include_only_cities`. */
  prefer_cities?: string;
  /** Semicolon-separated state codes; the keywords are not accepted. */
  prefer_states?: string;
  /** Semicolon-separated 5-digit ZIPs; needs `prefer_geolocation: "none"` and no other include/exclude/prefer. */
  prefer_zip_codes?: string;
  /** 0 to 100, default 100: share of suggestions drawn from the preferred set. */
  prefer_ratio?: number;
  /** Smarty defaults to `city`, which geolocates by the sender's IPv4 address (behind a proxy, send `X-Forwarded-For`). */
  prefer_geolocation?: "city" | "none";
  /** An `entry_id` from a collapsed suggestion; expands up to 100 secondaries and ignores every parameter but `search`. */
  selected?: string;
  /** Smarty defaults to `postal`; sending either makes each suggestion carry `source`. */
  source?: "postal" | "all";
  /** Comma-separated address types to drop from the results. */
  exclude?: SmartyUsAutocompleteExclude | string;
}

export type SmartyUsAutocompleteExclude =
  | "base-address"
  | "undeliverable-base-address"
  | "commercial"
  | "residential"
  | "po-box"
  | "cmra"
  | "military";

export interface SmartyUsAutocompleteSuggestion {
  street_line: string;
  /** Empty string when there is none. */
  secondary: string;
  city: string;
  state: string;
  zipcode: string;
  /** Secondaries in a collapsed group; 0 when not a group, above 1 means the address is incomplete. */
  entries: number;
  /** Final addresses only. */
  smarty_key?: string;
  /** Collapsed groups only; pass it as `selected` to expand. */
  entry_id?: string;
  /** Puerto Rico only. */
  urbanization?: string;
  /** Only when the `source` parameter was sent. */
  source?: "postal" | "other";
}

export interface SmartyUsAutocompleteResponse {
  suggestions?: SmartyUsAutocompleteSuggestion[];
}
