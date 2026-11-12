/**
 * Smarty US Street API response shapes.
 * See https://www.smarty.com/docs/apis/us-street-api/reference
 */

export interface SmartyUsRequest {
  input_id?: string;
  street?: string;
  street2?: string;
  secondary?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lastline?: string;
  addressee?: string;
  urbanization?: string;
  candidates?: number;
  match?: "strict" | "invalid" | "enhanced";
  format?: "default" | "project-usa";
  county_source?: "postal" | "geographic";
  /** Comma-separated feature flags: `component-analysis`, `iana-timezone`. */
  features?: string;
}

export interface SmartyUsComponents {
  urbanization?: string;
  primary_number?: string;
  street_name?: string;
  street_predirection?: string;
  street_postdirection?: string;
  street_suffix?: string;
  secondary_number?: string;
  secondary_designator?: string;
  extra_secondary_number?: string;
  extra_secondary_designator?: string;
  pmb_designator?: string;
  pmb_number?: string;
  city_name?: string;
  default_city_name?: string;
  state_abbreviation?: string;
  zipcode?: string;
  plus4_code?: string;
  delivery_point?: string;
  delivery_point_check_digit?: string;
}

export interface SmartyUsMetadata {
  record_type?: string;
  zip_type?: string;
  county_fips?: string;
  county_name?: string;
  ews_match?: string;
  carrier_route?: string;
  congressional_district?: string;
  building_default_indicator?: string;
  rdi?: string;
  elot_sequence?: string;
  elot_sort?: string;
  latitude?: number;
  longitude?: number;
  coordinate_license?: number;
  precision?: string;
  time_zone?: string;
  utc_offset?: number;
  dst?: string;
  iana_time_zone?: string;
  iana_utc_offset?: number;
  iana_dst?: string;
}

export interface SmartyUsAnalysis {
  dpv_match_code?: "Y" | "N" | "S" | "D" | "" | null;
  dpv_footnotes?: string;
  dpv_cmra?: "Y" | "N" | "";
  dpv_vacant?: "Y" | "N" | "";
  dpv_no_stat?: "Y" | "N" | "";
  active?: string;
  footnotes?: string;
  lacslink_code?: string;
  lacslink_indicator?: string;
  suitelink_match?: boolean;
  enhanced_match?: string;
}

export interface SmartyUsCandidate {
  input_id?: string;
  input_index?: number;
  candidate_index?: number;
  addressee?: string;
  delivery_line_1?: string;
  delivery_line_2?: string;
  last_line?: string;
  delivery_point_barcode?: string;
  smarty_key?: string;
  smarty_key_ext?: string;
  components: SmartyUsComponents;
  metadata: SmartyUsMetadata;
  analysis: SmartyUsAnalysis;
}

/**
 * Smarty International Street API response shapes.
 * See https://www.smarty.com/docs/apis/international-street-api/reference
 */

export interface SmartyIntlRequest {
  country: string;
  input_id?: string;
  freeform?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  organization?: string;
  locality?: string;
  administrative_area?: string;
  postal_code?: string;
  geocode?: "true" | "false";
  language?: string;
  /** 1 to 10 suggestions; on Smarty's reference page, not in the collection. */
  max_results?: number;
  /** Comma-separated license names (e.g. "international-basic"). */
  license?: string;
  /** Comma-separated feature flags: `occupant-use`, `geocode-classification`,
   * `geocode-precision-enhanced`. */
  features?: string;
}

export type SmartyIntlChangeCode =
  | "Verified-NoChange"
  | "Verified-AliasChange"
  | "Verified-SmallChange"
  | "Verified-LargeChange"
  | "Added"
  | "Identified-NoChange"
  | "Identified-AliasChange"
  | "Identified-ContextChange"
  | "Unrecognized";

export interface SmartyIntlChanges {
  organization?: SmartyIntlChangeCode;
  address1?: SmartyIntlChangeCode;
  address2?: SmartyIntlChangeCode;
  locality?: SmartyIntlChangeCode;
  administrative_area?: SmartyIntlChangeCode;
  postal_code?: SmartyIntlChangeCode;
  country_iso_3?: SmartyIntlChangeCode;
  thoroughfare?: SmartyIntlChangeCode;
  thoroughfare_predirection?: SmartyIntlChangeCode;
  thoroughfare_postdirection?: SmartyIntlChangeCode;
  thoroughfare_name?: SmartyIntlChangeCode;
  thoroughfare_trailing_type?: SmartyIntlChangeCode;
  thoroughfare_type?: SmartyIntlChangeCode;
  premise?: SmartyIntlChangeCode;
  premise_number?: SmartyIntlChangeCode;
  premise_type?: SmartyIntlChangeCode;
  building?: SmartyIntlChangeCode;
  sub_building?: SmartyIntlChangeCode;
  sub_building_number?: SmartyIntlChangeCode;
  post_box?: SmartyIntlChangeCode;
  [key: string]: SmartyIntlChangeCode | undefined;
}

export interface SmartyIntlAnalysis {
  verification_status: "None" | "Partial" | "Ambiguous" | "Verified";
  address_precision:
    | "None"
    | "AdministrativeArea"
    | "Locality"
    | "Thoroughfare"
    | "Premise"
    | "DeliveryPoint";
  max_address_precision?: string;
  changes?: SmartyIntlChanges;
}

export interface SmartyIntlComponents {
  country_iso_3?: string;
  administrative_area?: string;
  administrative_area_iso2?: string;
  locality?: string;
  postal_code?: string;
  postal_code_short?: string;
  postal_code_extra?: string;
  premise?: string;
  premise_number?: string;
  thoroughfare?: string;
  thoroughfare_name?: string;
  building?: string;
  sub_building?: string;
  [key: string]: string | undefined;
}

export interface SmartyIntlMetadata {
  latitude?: number;
  longitude?: number;
  geocode_precision?: string;
  geocode_classification?:
    "single-point" | "multiple-point-average" | "interpolated";
  max_geocode_precision?: string;
  address_format?: string;
  /** "residential" | "commercial" | "residential,commercial" — only on Canada,
   * Australia, Belgium, UK candidates. */
  occupant_use?: string;
}

export interface SmartyIntlCandidate {
  input_id?: string;
  organization?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  address7?: string;
  address8?: string;
  address9?: string;
  address10?: string;
  address11?: string;
  address12?: string;
  components: SmartyIntlComponents;
  metadata: SmartyIntlMetadata;
  analysis: SmartyIntlAnalysis;
}
