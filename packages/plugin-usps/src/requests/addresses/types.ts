export interface UspsValidateAddressParams {
  firm?: string;
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  /** Two-letter USPS code, including AA/AE/AP and territories. */
  state?: string;
  urbanization?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
}

export interface UspsAddressCityStateParams {
  ZIPCode: string;
}

export interface UspsAddressZipCodeParams {
  firm?: string;
  streetAddress: string;
  secondaryAddress?: string;
  city: string;
  state: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
}

export interface UspsAddressResponse {
  /** USPS's examples send `"firm": null` when there is none. */
  firm?: string | null;
  address?: UspsDomesticAddress;
  additionalInfo?: UspsAddressAdditionalInfo;
  corrections?: UspsAddressCorrection[];
  matches?: UspsAddressMatch[];
  warnings?: string[];
}

export interface UspsAddressCityStateResponse {
  city?: string;
  state?: string;
  ZIPCode?: string;
}

export interface UspsAddressZipCodeResponse {
  firm?: string | null;
  address?: UspsDomesticAddress;
}

/**
 * USPS's own examples return every field that does not apply as an explicit
 * `null`, and add four international-style fields (`postalCode`, `province`,
 * `country`, `countryISOCode`) that are always `null` on a domestic address.
 */
export interface UspsDomesticAddress {
  streetAddress?: string;
  streetAddressAbbreviation?: string | null;
  secondaryAddress?: string | null;
  city?: string;
  cityAbbreviation?: string | null;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string | null;
  urbanization?: string | null;
  postalCode?: string | null;
  province?: string | null;
  country?: string | null;
  countryISOCode?: string | null;
  lastline?: string;
  lastlineAbbr?: string;
}

/** Code `32` default match, `22` multiple matches: add a unit number. */
export interface UspsAddressCorrection {
  code?: string;
  text?: string;
}

/** Code `31` is a single exact ZIP+4 match. */
export interface UspsAddressMatch {
  code?: string;
  text?: string;
}

export interface UspsAddressAdditionalInfo {
  deliveryPoint?: string;
  carrierRoute?: string;
  countyName?: string;
  congressDistrict?: string;
  footnotes?: string;
  recordType?: "G" | "P" | "R" | "H" | "F" | "S";
  secondaryInfo?: string;
  returnCode?: 32 | 31 | 22 | 21 | 13 | 12 | 11 | 10;
  returnCodeText?: string;
  DPVConfirmation?: "Y" | "D" | "S" | "N";
  DPVEnhancedConfirmation?: "Y" | "D" | "S" | "R" | "N";
  DPVFootnotes?: string;
  /** Deprecated by USPS in favour of `DPVBusiness`. */
  business?: "Y" | "N";
  DPVBusiness?: "Y" | "N";
  DPVCMRA?: "Y" | "N";
  DPVDrop?: "Y" | "N";
  DPVEducational?: "Y" | "N";
  DPVDropCount?: string;
  DPVLACS?: "Y" | "N";
  DPVNoDoorDelivery?: "Y" | "N";
  DPVPBSA?: "Y" | "N";
  DPVNostatReasonCode?: "1" | "2" | "4" | "5" | "6";
  DPVNostatReasonCodeDesc?:
    | "INTERNAL_DROP_ADDRESS"
    | "CDS_NOSTAT"
    | "CMZ_NOSTAT"
    | "REGULAR_NOSTAT"
    | "SECONDARY_REQUIRED";
  centralDeliveryPoint?: "Y" | "N";
  DPVSeasonal?: "Y" | "N";
  DPVThrowback?: "Y" | "N";
  DPVNoSecureLocation?: "Y" | "N";
  vacant?: "Y" | "N";
  DPVVacant?: "Y" | "N";
  DPVNostat?: "Y" | "N";
  DPVNonDeliveryDaysFlag?: "Y" | "N";
  DPVNonDeliveryDaysSMTWTFS?: string;
  DPVNonDeliveryDaysValues?: string[];
  DPVCurbDelivery?: "Y" | "N";
  DPVCentralBoxDelivery?: "Y" | "N";
  DPVNDCBUDelivery?: "Y" | "N";
  DPVOtherDelivery?: "Y" | "N";
  DPVDeliveryType?: "1" | "2" | "3" | "4";
  DPVUsageCode?: "A" | "B" | "C" | "D" | "G" | " ";
  electricVehicleRoute?: boolean;
  postOfficeCity?: string;
  postOfficeState?: string;
  countyNumber?: string;
  autoZoneIndicator?: "A" | "B" | "C" | "D";
  LACSLinkReturnCode?: "00" | "14" | "A" | "92";
  LACSLinkIndicator?: "Y" | "N" | "S" | "F";
  miscLine?: string;
  ZIP5Valid?: "Y" | "N";
  POBoxOnlyZIP?: "Y" | "N";
  defaultFlag?: "Y" | "N";
  matchedPrimaryNumber?: string;
  matchedSecondaryNumber?: string;
  parsedPMBDesignator?: string;
  parsedPMBNumber?: string;
  suiteLinkIndicator?: "00" | "A";
  financeNumber?: string;
  baseAlternateCode?: "A" | "B";
  LACSIndicator?: "L" | "";
  eLOTCode?: "A" | "D";
  eLOTNumber?: string;
}
