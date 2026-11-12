/** 01 residential, 02 commercial; UPS's own sample sends an empty string. */
export type UpsTimeInTransitResidentialIndicator = "" | "01" | "02";

/** 02 document, 03 non-document, 04 WWEF pallet. */
export type UpsTimeInTransitBillType = "02" | "03" | "04";

export type UpsTimeInTransitWeightUnit = "LBS" | "KGS";

export interface UpsTimeInTransitRequest {
  /** ISO 3166 two-letter code. */
  originCountryCode: string;
  /** Two-letter code for US addresses; the full name elsewhere. */
  originStateProvince?: string;
  /** Required for international requests from countries without postal codes. */
  originCityName?: string;
  originTownName?: string;
  /** Required for domestic requests. */
  originPostalCode?: string;
  destinationCountryCode?: string;
  destinationStateProvince?: string;
  /** Required for international requests to countries without postal codes. */
  destinationCityName?: string;
  destinationTownName?: string;
  /** Required for domestic requests. */
  destinationPostalCode?: string;
  /** Required for domestic requests; international requests default to commercial. */
  residentialIndicator?: UpsTimeInTransitResidentialIndicator;
  /** YYYY-MM-DD, from 35 days back to 60 days ahead. */
  shipDate?: string;
  /** HH:MM:SS; defaults to now. */
  shipTime?: string;
  /** Required for international requests; rounded to tenths, at most 70 kg / 150 lb. */
  weight?: number | string;
  /** Required for international requests and whenever `weight` is sent. */
  weightUnitOfMeasure?: UpsTimeInTransitWeightUnit;
  /** Required when origin and destination countries differ and billType is 03 or 04. */
  shipmentContentsValue?: number | string;
  /** ISO currency code; required when `shipmentContentsValue` is sent. */
  shipmentContentsCurrencyCode?: string;
  /** Required for international requests. */
  billType?: UpsTimeInTransitBillType;
  /** The spec says this is not to be exposed to external customers. Defaults to true. */
  avvFlag?: boolean;
  /** Defaults to 1. */
  numberOfPackages?: number | string;
  /** 0 pickup by UPS, 1 dropped off by the shipper; billType 04 only. */
  dropOffAtFacilityIndicator?: 0 | 1;
  /** 0 delivery by UPS, 1 pickup by consignee; billType 04 only. */
  holdForPickupIndicator?: 0 | 1;
  /** Bypasses the rule that drops US domestic services slower than Ground. Defaults to false. */
  returnUnfilterdServices?: boolean;
  /** Candidate-list limit; defaults to 200. */
  maxList?: number;
  /** "00" non-premier (default), "01" premier. */
  premierIndicator?: "00" | "01";
}

export interface UpsTimeInTransitResponse {
  validationList?: UpsTimeInTransitValidationList;
  /** Returned when the destination address is ambiguous. */
  destinationPickList?: UpsTimeInTransitCandidateAddress[];
  /** Returned when the origin address is ambiguous. */
  originPickList?: UpsTimeInTransitCandidateAddress[];
  emsResponse?: UpsTimeInTransitEmsResponse;
}

export interface UpsTimeInTransitValidationList {
  invalidFieldList?: string[];
  invalidFieldListCodes?: string[];
  destinationAmbiguous?: boolean;
  originAmbiguous?: boolean;
}

export interface UpsTimeInTransitCandidateAddress {
  countryName: string;
  /** Optional: the spec's `required` list spells it `CountryCode`, which is no property; the property is optional. */
  countryCode?: string;
  stateProvince?: string;
  city?: string;
  town?: string;
  postalCode?: string;
  postalCodeLow?: string;
  postalCodeHigh?: string;
}

/** Dates are YYYY-MM-DD and times HH:MM:SS throughout. */
export interface UpsTimeInTransitEmsResponse {
  shipDate: string;
  shipTime: string;
  /** "A" for all service levels; blank is the default. */
  serviceLevel: string;
  billType: string;
  /** International only: 01 dutiable through 09 low value. */
  dutyType?: string;
  residentialIndicator: string;
  destinationCountryName: string;
  destinationCountryCode: string;
  destinationPostalCode?: string;
  destinationPostalCodeLow?: string;
  destinationPostalCodeHigh?: string;
  destinationStateProvince?: string;
  destinationCityName?: string;
  originCountryName: string;
  originCountryCode: string;
  originPostalCode?: string;
  originPostalCodeLow?: string;
  originPostalCodeHigh?: string;
  originStateProvince?: string;
  originCityName?: string;
  /** Returned as a string, defaulting to "0.0". */
  weight?: string;
  weightUnitOfMeasure?: string;
  shipmentContentsValue?: string;
  shipmentContentsCurrencyCode?: string;
  /** True inside a peak date range, and then for every service in the response. */
  guaranteeSuspended: boolean;
  numberOfServices: number;
  services?: UpsTimeInTransitService[];
}

export interface UpsTimeInTransitService {
  /** Domestic "1DMS", "1DAS", "1DM", "1DA", "1DP", "2DM", "2DA", "3DS", "GND"; international two-digit codes. */
  serviceLevel: string;
  serviceLevelDescription: string;
  shipDate: string;
  deliveryDate: string;
  commitTime: string;
  /** May be later than `commitTime`. */
  deliveryTime: string;
  /** MON through SAT. */
  deliveryDayOfWeek: string;
  /** "1" when the requested ship date was moved; international only. */
  nextDayPickupIndicator: string;
  /** "1" when Saturday pickup is available at extra charge. */
  saturdayPickupIndicator: string;
  saturdayDeliveryDate?: string;
  saturdayDeliveryTime?: string;
  serviceRemarksText?: string;
  /** "1" guaranteed; "0" not guaranteed, always so while `guaranteeSuspended`. */
  guaranteeIndicator: string;
  /** Optional: the spec lists it only in `required` and defines no such property. */
  saturdayDeliveryIndicator?: string;
  /** Business days plus rest days plus holidays; international only. */
  totalTransitDays: number;
  businessTransitDays: number;
  restDaysCount: number;
  holidayCount: number;
  delayCount: number;
  /** May differ from the requested ship date. */
  pickupDate: string;
  /** International only; the guarantee lapses if UPS has not collected by then. */
  pickupTime: string;
  /** Latest time to notify UPS customer service of a pickup; international only. */
  cstccutoffTime: string;
  /** Date proof of delivery becomes available; international only. */
  poddate?: string;
  poddays?: number;
}
