/**
 * Smarty US Extract API shapes. Request options: Smarty Postman collection
 * (supplied 2026-11-12) and https://www.smarty.com/docs/apis/us-extract-api/reference
 * (checked 2026-11-12). Response: the reference page only, whose field types
 * are inferred from its example values.
 */

export interface SmartyUsExtractOptions {
  /** HTML is auto-detected and stripped; set this to override the detection. */
  html?: boolean;
  /** Spends more lookups to find addresses without a state or ZIP and in messy input. */
  aggressive?: boolean;
  /** Reference default `true`. */
  addr_line_breaks?: boolean;
  /** Reference default `0`, meaning no cap. */
  addr_per_line?: number;
  /** Comma-separated license names, tried left to right. */
  license?: string;
  /** Reference default `strict`; the page defers to the US Street API reference for values. */
  match?: "strict" | "invalid" | "enhanced";
}

export interface SmartyUsExtractMeta {
  lines?: number;
  unicode?: boolean;
  address_count?: number;
  verified_count?: number;
  bytes?: number;
  character_count?: number;
}

export interface SmartyUsExtractApiOutput {
  candidate_index?: number;
  delivery_line_1?: string;
  last_line?: string;
  delivery_point_barcode?: string;
  components?: {
    primary_number?: string;
    street_name?: string;
    street_suffix?: string;
    city_name?: string;
    state_abbreviation?: string;
    zipcode?: string;
    plus4_code?: string;
    delivery_point?: string;
    delivery_point_check_digit?: string;
  };
  metadata?: {
    record_type?: string;
    zip_type?: string;
    county_fips?: string;
    county_name?: string;
    carrier_route?: string;
    congressional_district?: string;
    rdi?: string;
    elot_sequence?: string;
    elot_sort?: string;
    latitude?: number;
    longitude?: number;
    precision?: string;
    time_zone?: string;
    utc_offset?: number;
    dst?: boolean;
  };
  analysis?: {
    dpv_match_code?: string;
    dpv_footnotes?: string;
    dpv_cmra?: string;
    dpv_vacant?: string;
    active?: string;
    footnotes?: string;
  };
}

export interface SmartyUsExtractAddress {
  text: string;
  verified: boolean;
  /** Starting line of `text` in the input. */
  line: number;
  /** Character indexes of `text` within the input. */
  start: number;
  end: number;
  api_output?: SmartyUsExtractApiOutput[];
}

export interface SmartyUsExtractResponse {
  meta: SmartyUsExtractMeta;
  addresses: SmartyUsExtractAddress[];
}
