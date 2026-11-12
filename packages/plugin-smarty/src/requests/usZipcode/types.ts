/**
 * Smarty US ZIP Code API shapes.
 * Request: Smarty Postman collection (supplied 2026-11-12) plus
 * https://www.smarty.com/docs/apis/us-zipcode-api/reference (checked 2026-11-12).
 */

export interface SmartyUsZipcodeLookup {
  /** At least one of `zipcode` or `city` + `state` must be given (max 64 chars). */
  city?: string;
  /** Name or two-letter abbreviation (max 32 chars). */
  state?: string;
  /** Max 16 chars; leading zeros dropped by spreadsheets are restored. */
  zipcode?: string;
  /** Max 36 chars; echoed back unchanged and does not affect results. */
  input_id?: string;
}

export interface SmartyUsZipcodeOptions {
  /** Plan license name; the collection shows it on both GET and POST. */
  license?: string;
}

export type SmartyUsZipcodeStatus =
  "blank" | "invalid_state" | "invalid_city" | "invalid_zipcode" | "conflict";

export type SmartyUsZipcodeType = "S" | "M" | "P" | "U";

export type SmartyUsZipcodePrecision =
  "None" | "Zip5" | "Zip6" | "Zip7" | "Zip8" | "Zip9";

export interface SmartyUsZipcodeCityState {
  city?: string;
  state_abbreviation?: string;
  state?: string;
  /** Whether USPS approves the city name for mailing. */
  mailable_city?: boolean;
}

export interface SmartyUsZipcodeAlternateCounty {
  county_fips?: string;
  county_name?: string;
  state_abbreviation?: string;
  state?: string;
}

export interface SmartyUsZipcodeEntry {
  zipcode?: string;
  /** S standard, M military (incl. DPO), P PO box, U unique. */
  zipcode_type?: SmartyUsZipcodeType;
  default_city?: string;
  county_fips?: string;
  county_name?: string;
  state_abbreviation?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  /** `None` means the coordinates are unknown. */
  precision?: SmartyUsZipcodePrecision;
  alternate_counties?: SmartyUsZipcodeAlternateCounty[];
}

/** One element per submitted lookup. */
export interface SmartyUsZipcodeResult {
  input_index?: number;
  input_id?: string;
  city_states?: SmartyUsZipcodeCityState[];
  zipcodes?: SmartyUsZipcodeEntry[];
  /** Present only when the lookup matched nothing. */
  status?: SmartyUsZipcodeStatus;
  reason?: string;
}
