export type UspsInternationalServiceStandardMailClass =
  | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
  | "PRIORITY_MAIL_INTERNATIONAL"
  | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL";

export interface UspsInternationalServiceStandardParams {
  /** ISO 3166-1 alpha-2 country code, two letters. */
  countryCode: string;
  mailClass: UspsInternationalServiceStandardMailClass;
}

export interface UspsInternationalServiceStandardResponse {
  countryCode?: string;
  mailClass?: string;
  serviceStandardMessage?: string;
}
