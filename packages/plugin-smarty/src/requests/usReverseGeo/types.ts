/**
 * Smarty US Reverse Geocoding API shapes. Request: Smarty Postman collection
 * (supplied 2026-11-12) and the reference page
 * https://www.smarty.com/docs/apis/us-reverse-geocoding-api/reference
 * (checked 2026-11-12). Response: the reference page.
 */

export interface SmartyUsReverseGeoParams {
  /** -90.0 to 90.0. */
  latitude: number;
  /** -180.0 to 180.0. */
  longitude: number;
  /** `all` includes non-postal addresses; reference default `postal`. Each result then carries `address.source`. */
  source?: "all" | "postal";
  /** Not in the reference parameter table; the collection sends it. */
  license?: string;
}

export interface SmartyUsReverseGeoAddress {
  street?: string;
  city?: string;
  state_abbreviation?: string;
  zipcode?: string;
  /** Only returned when the request sent `source`. */
  source?: "postal" | "other";
  smarty_key?: string;
}

export interface SmartyUsReverseGeoCoordinate {
  latitude?: number;
  longitude?: number;
  /** Least to most accurate. */
  accuracy?:
    | "Unknown"
    | "Zip5"
    | "Zip6"
    | "Zip7"
    | "Zip8"
    | "Zip9"
    | "Parcel"
    | "Rooftop";
  /** 0 is open (attribution optional); 1 is Smarty proprietary, limited internal business use. */
  license?: 0 | 1;
}

export interface SmartyUsReverseGeoResult {
  /** The reference page calls the unit meters in one place and decimal degrees in another. */
  distance?: number;
  address: SmartyUsReverseGeoAddress;
  coordinate: SmartyUsReverseGeoCoordinate;
}

export interface SmartyUsReverseGeoResponse {
  results: SmartyUsReverseGeoResult[];
}
