export type UspsServiceStandardMailClass =
  | "BOUND_PRINTED_MATTER"
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "CARDS"
  | "FLATS"
  | "LETTERS"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "PRIORITY_MAIL"
  | "PRIORITY_MAIL_EXPRESS"
  | "USPS_GROUND_ADVANTAGE"
  | "ALL";

/** Query parameters shared by both Service Standards operations. */
export interface UspsServiceStandardBaseParams {
  /** 3, 5 or 9 digits. */
  originZIPCode: string;
  /** 5 or 9 digits. */
  destinationZIPCode: string;
  mailClass?: UspsServiceStandardMailClass;
  /** USPS default: `STREET`. */
  destinationType?: "STREET" | "PO_BOX" | "HOLD_FOR_PICKUP";
  /** Service Type Codes, https://postalpro.usps.com/IMPB_Service_Type_Codes. */
  serviceTypeCodes?: string;
  destinationEntryFacilityType?:
    | "NONE"
    | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
    | "DESTINATION_SECTIONAL_CENTER_FACILITY"
    | "DESTINATION_DELIVERY_UNIT"
    | "DESTINATION_SERVICE_HUB";
  /** Pounds. Required for `USPS_GROUND_ADVANTAGE` over one pound. */
  weight?: number;
  /** Inches. Required for Priority Mail Next Day; partial dimensions are an error. */
  length?: number;
  height?: number;
  width?: number;
  /** USPS default: `in`, the only value the spec allows. */
  dimensionsUOM?: "in";
  rateHolderCRID?: string;
  /** Only meaningful for `LETTERS`, `FLATS` and `CARDS`. */
  presort?: boolean;
}

export interface UspsServiceStandardEstimatesParams extends UspsServiceStandardBaseParams {
  /** `YYYY-MM-DD`, up to 30 days ahead; USPS defaults to today. */
  acceptanceDate?: string;
  /** `HHMM`, 24-hour; USPS defaults to 0800. */
  acceptanceTime?: string;
  /** USPS default: `lb`, the only value the spec allows. */
  weightUOM?: "lb";
}

export type UspsServiceStandardsParams = UspsServiceStandardBaseParams;

/** `ZIPCode` and `ZIPPlus4` are JSON numbers in USPS's README example, strings in the spec. */
export interface UspsServiceStandardAddress {
  streetAddress?: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  cityAbbreviation?: string;
  city?: string;
  state?: string;
  ZIPCode?: string | number;
  ZIPPlus4?: string | number;
  urbanization?: string;
}

/**
 * Local close time per weekday as `HHMM`. The README example mixes numbers
 * (`1700`) and strings (`"0000"`) in one object.
 */
export interface UspsServiceStandardFacilityCloseTimes {
  Monday?: string | number;
  Tuesday?: string | number;
  Wednesday?: string | number;
  Thursday?: string | number;
  Friday?: string | number;
  Saturday?: string | number;
  Sunday?: string | number;
  holidays?: string | number;
}

export interface UspsServiceStandardFacility extends UspsServiceStandardAddress {
  facilityName?: string;
  facilityType?:
    | "POST_OFFICE"
    | "EXPRESS_MAIL_COLLECTION_BOX"
    | "AIR_MAIL_FACILITY"
    | "CONTRACT_POSTAL_UNIT"
    /** The README example says `"POST OFFICE"`, with a space. */
    | "POST OFFICE";
  closes?: UspsServiceStandardFacilityCloseTimes;
  /** The README example's key for the same data; the spec says `closes`. */
  closeTimes?: UspsServiceStandardFacilityCloseTimes;
}

export type UspsServiceStandardNote =
  "WEIGHT_LESS_THAN_1_POUND" | "WEIGHT_GREATER_THAN_OR_EQUAL_TO_1_POUND";

export interface UspsServiceStandardEstimateDelivery {
  /** Deprecated by USPS in favour of `expectedDeliveryDateTime`. */
  scheduledDeliveryDateTime?: string;
  expectedDeliveryDateTime?: string;
  guaranteedDelivery?: boolean;
  holdForPickupLocation?: UspsServiceStandardFacility;
}

export interface UspsServiceStandardEstimate {
  mailClass?: string;
  notes?: UspsServiceStandardNote;
  destinationType?: string;
  acceptanceDateTime?: string;
  effectiveAcceptanceDate?: string;
  /** `HHMM`; the README example returns the number `1700`. */
  cutOffTime?: string | number;
  /** Two characters in the spec; the README example returns the number `2`. */
  serviceStandard?: string | number;
  serviceStandardMessage?: string;
  /** A single facility despite the plural name. */
  acceptanceLocations?: UspsServiceStandardFacility;
  delivery?: UspsServiceStandardEstimateDelivery;
  presort?: boolean;
  isPriorityMailNextDay?: boolean;
}

export type UspsServiceStandardEstimatesResponse =
  UspsServiceStandardEstimate[];

export interface UspsServiceStandardResult {
  mailClass?: string;
  notes?: UspsServiceStandardNote;
  /** Numbers in the README example, strings in the spec. */
  originZIPCode?: string | number;
  destinationZIPCode?: string | number;
  days?: number;
  effectiveAcceptanceDate?: string;
  /** Deprecated by USPS in favour of `expectedDeliveryDate`. */
  scheduledDeliveryDate?: string;
  expectedDeliveryDate?: string;
  presort?: boolean;
  isPriorityMailNextDay?: boolean;
}

export type UspsServiceStandardsResponse = UspsServiceStandardResult[];

export interface UspsServiceStandardZip5CodesResponse {
  originZIPCodes?: string[];
  destinationZIPCodes?: string[];
}

/**
 * Every ZIP field takes 3 or 5 digits as a single value, a comma-separated
 * list, or a range (`132-245`); one width per field.
 */
export interface UspsServiceStandardDirectoryRequest {
  originZIPCode?: string;
  destinationZIPCode?: string;
  responseFormat?: "3D_BASE" | "5D_EXPANDED";
  /** A single value or comma-separated values. */
  mailClass?:
    | "PACKAGE_SERVICES"
    | "USPS_GROUND_ADVANTAGE_LIGHTWEIGHT"
    | "FIRST_CLASS_MAIL"
    | "PRIORITY_MAIL"
    | "USPS_GROUND_ADVANTAGE"
    | "PERIODICALS"
    | "MARKETING_MAIL"
    | "PRESORT_FIRST_CLASS";
  offset?: number;
  /** 1 to 20000. */
  limit?: number;
  /** Whether the three unsupported/exempt ZIP lists come back. */
  returnUnsupportedZIPCodes?: boolean;
}

/** A pagination link whose `body` is the request that fetches that page. */
export interface UspsServiceStandardDirectoryLink {
  href?: string;
  method?: "POST";
  body?: object;
}

export interface UspsServiceStandardDirectoryMetadata {
  totalCount?: number;
  page?: number;
  totalPages?: number;
  offset?: number;
  limit?: number;
  links?: {
    self?: UspsServiceStandardDirectoryLink;
    next?: UspsServiceStandardDirectoryLink | null;
    previous?: UspsServiceStandardDirectoryLink | null;
    first?: UspsServiceStandardDirectoryLink | null;
    last?: UspsServiceStandardDirectoryLink | null;
  };
}

/** Per-mail-class service standard in days; the keys are USPS's own. */
export interface UspsServiceStandardDirectoryEntry {
  originZIPCode?: string;
  destinationZIPCode?: string;
  FCMSvcStd?: number;
  GAHSvcStd?: number;
  GALSvcStd?: number;
  MktSvcStd?: number;
  PerSvcStd?: number;
  PkgSvcStd?: number;
  PriSvcStd?: number;
  PFCSvcStd?: number;
}

export interface UspsServiceStandardDirectoryResponse {
  metadata?: UspsServiceStandardDirectoryMetadata;
  publishDate?: string;
  effectiveDate?: string;
  standards?: UspsServiceStandardDirectoryEntry[];
  messages?: { code?: string; detail?: string }[];
  unsupportedZIPCodes?: string[];
  exemptOriginZIPCodes?: string[];
  exemptDestinationZIPCodes?: string[];
}

export interface UspsServiceStandardFileLink {
  rel: string[];
  href: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  submissionMediaType?: string;
  targetMediaType?: string;
  publishDate?: string;
}

export type UspsServiceStandardFilesResponse = UspsServiceStandardFileLink[];

export interface UspsServiceStandardSignedUrlParams {
  /** For example `Combined_Service_Standard_Directory_MKT`. */
  fileID: string;
}

export interface UspsServiceStandardSignedUrlResponse {
  /** SAS URL for the file itself; supports HTTP Range requests. */
  signedURL?: string;
  expiry?: string;
  /** Bytes. */
  contentLength?: number;
  /** Bytes. */
  rangeLimit?: number;
}
