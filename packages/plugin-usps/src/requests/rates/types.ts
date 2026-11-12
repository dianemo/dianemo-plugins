export type UspsRatePriceType = "RETAIL" | "COMMERCIAL" | "CONTRACT" | "NSA";

/** What a rate row reports; the request side never accepts the two COMMERCIAL_ tiers. */
export type UspsRateResultPriceType =
  UspsRatePriceType | "COMMERCIAL_BASE" | "COMMERCIAL_PLUS";

/** `ALL` is accepted only where a mail class is optional (the rate-list and total-rates queries). */
export type UspsRateMailClass =
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "PRIORITY_MAIL_EXPRESS"
  | "PRIORITY_MAIL"
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_MAIL"
  | "USPS_CONNECT_REGIONAL"
  | "USPS_GROUND_ADVANTAGE"
  | "USPS_GROUND_ADVANTAGE_RETURN_SERVICE"
  | "USPS_RETAIL_GROUND"
  | "GROUND_RETURN_SERVICE"
  | "FIRST-CLASS_PACKAGE_RETURN_SERVICE"
  | "PRIORITY_MAIL_RETURN_SERVICE"
  | "PRIORITY_MAIL_EXPRESS_RETURN_SERVICE"
  | "MARKETING_MAIL_PARCELS";

export type UspsRateListMailClass =
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "PRIORITY_MAIL_EXPRESS"
  | "PRIORITY_MAIL"
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_MAIL"
  | "USPS_CONNECT_REGIONAL"
  | "USPS_GROUND_ADVANTAGE"
  | "USPS_RETAIL_GROUND"
  | "MARKETING_MAIL_PARCELS"
  | "ALL";

export type UspsRateExtraServiceCode =
  | 415
  | 480
  | 481
  | 482
  | 483
  | 484
  | 485
  | 486
  | 487
  | 488
  | 489
  | 498
  | 500
  | 501
  | 502
  | 810
  | 811
  | 812
  | 813
  | 814
  | 815
  | 816
  | 817
  | 818
  | 819
  | 820
  | 821
  | 822
  | 823
  | 824
  | 825
  | 826
  | 827
  | 828
  | 829
  | 830
  | 831
  | 832
  | 853
  | 856
  | 857
  | 858
  | 910
  | 911
  | 912
  | 913
  | 915
  | 917
  | 920
  | 921
  | 922
  | 923
  | 924
  | 925
  | 930
  | 931
  | 934
  | 940
  | 941
  | 955
  | 957
  | 972
  | 981
  | 984
  | 986
  | 991;

/** `YYYY-MM-DD`, today through seven days ahead. */
export type UspsRateMailingDate = string;

/** `METER` is for PC Postage providers; `MID` only exists on the base-rates and extra-service queries. */
export type UspsRateAccountType = "EPS" | "PERMIT" | "METER" | "MID";

/** Five digits, optionally `-` or a space then four. */
export type UspsRateZipCode = string;

export interface UspsRateListQueryBase {
  originZIPCode: UspsRateZipCode;
  destinationZIPCode: UspsRateZipCode;
  /** Pounds. */
  weight: number;
  /** Inches; the longest dimension. */
  length: number;
  width: number;
  height: number;
  /** Deprecated by USPS in favour of `mailClasses`. */
  mailClass?: UspsRateListMailClass;
  mailClasses?: UspsRateListMailClass[];
  /** With an `accountNumber`, USPS returns CONTRACT rates whatever this says. */
  priceType?: UspsRatePriceType;
  mailingDate?: UspsRateMailingDate;
  /** `MID` is not accepted here, unlike `UspsRateBaseRatesQuery`. */
  accountType?: Exclude<UspsRateAccountType, "MID">;
  accountNumber?: string;
  hasNonstandardCharacteristics?: boolean;
}

export type UspsBaseRatesListQuery = UspsRateListQueryBase;

export interface UspsTotalRatesQuery extends UspsRateListQueryBase {
  /** Insurance, Registered Mail and COD prices vary with this. */
  itemValue?: number;
  /** Omitted means every available extra service is returned. */
  extraServices?: UspsRateExtraServiceCode[];
}

export type UspsRateProcessingCategory =
  | "CARDS"
  | "LETTERS"
  | "FLATS"
  | "MACHINABLE"
  | "IRREGULAR"
  | "NON_MACHINABLE"
  | "NONSTANDARD"
  | "CATALOGS"
  | "OPEN_AND_DISTRIBUTE"
  | "RETURNS"
  | "SOFT_PACK_MACHINABLE"
  | "SOFT_PACK_NON_MACHINABLE";

export type UspsRateEntryFacilityType =
  | "NONE"
  | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
  | "DESTINATION_SECTIONAL_CENTER_FACILITY"
  | "DESTINATION_DELIVERY_UNIT"
  | "DESTINATION_SERVICE_HUB"
  | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";

/** Two-character USPS rate indicator code from Publication 205. */
export type UspsRateIndicator =
  | "3D"
  | "3N"
  | "3R"
  | "5D"
  | "BA"
  | "BB"
  | "BM"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "C5"
  | "CP"
  | "CM"
  | "DC"
  | "DE"
  | "DF"
  | "DN"
  | "DR"
  | "E4"
  | "E6"
  | "E7"
  | "FA"
  | "FB"
  | "FE"
  | "FP"
  | "FS"
  | "LC"
  | "LF"
  | "LL"
  | "LO"
  | "LS"
  | "NN"
  | "NP"
  | "O1"
  | "O2"
  | "O3"
  | "O4"
  | "O5"
  | "O6"
  | "O7"
  | "OS"
  | "PN"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "P9"
  | "Q6"
  | "Q7"
  | "Q8"
  | "Q9"
  | "Q0"
  | "PA"
  | "PL"
  | "PM"
  | "PR"
  | "SB"
  | "SN"
  | "SP"
  | "SR";

export interface UspsRateBaseRatesQuery {
  originZIPCode: UspsRateZipCode;
  destinationZIPCode: UspsRateZipCode;
  weight: number;
  length: number;
  width: number;
  height: number;
  mailClass: UspsRateMailClass;
  /** `IRREGULAR` and `NON_MACHINABLE` are deprecated aliases of `NONSTANDARD`. */
  processingCategory:
    | "LETTERS"
    | "FLATS"
    | "MACHINABLE"
    | "IRREGULAR"
    | "NON_MACHINABLE"
    | "NONSTANDARD";
  rateIndicator: UspsRateIndicator;
  destinationEntryFacilityType: UspsRateEntryFacilityType;
  priceType: UspsRatePriceType;
  mailingDate?: UspsRateMailingDate;
  accountType?: UspsRateAccountType;
  accountNumber?: string;
  hasNonstandardCharacteristics?: boolean;
}

interface UspsRateExtraServiceQueryBase {
  mailClass: UspsRateMailClass;
  priceType: UspsRatePriceType;
  /** Insurance, Registered Mail and COD prices vary with this. */
  itemValue?: number;
  weight?: number;
  originZIPCode?: UspsRateZipCode;
  destinationZIPCode?: UspsRateZipCode;
  mailingDate?: UspsRateMailingDate;
  accountType?: UspsRateAccountType;
  accountNumber?: string;
}

export interface UspsRateExtraServiceQuery extends UspsRateExtraServiceQueryBase {
  extraServices?: UspsRateExtraServiceCode[];
}

/** Deprecated by USPS and, per the spec, removed in June 2025: send an array. */
export interface UspsRateExtraServiceSingleQuery extends UspsRateExtraServiceQueryBase {
  extraServices?: UspsRateExtraServiceCode;
}

export type UspsRateExtraServiceSearchQuery =
  UspsRateExtraServiceQuery | UspsRateExtraServiceSingleQuery;

export type UspsRateLetterExtraServiceCode =
  910 | 911 | 930 | 931 | 934 | 940 | 941 | 955 | 957 | 985;

export interface UspsRateLetterQuery {
  /** Ounces, unlike every other rate query. */
  weight: number;
  /** Inches; for letters and cards, parallel to the address as read. */
  length: number;
  height: number;
  /** Inches; always the smallest dimension. */
  thickness: number;
  processingCategory: "LETTERS" | "FLATS" | "CARDS";
  mailingDate?: UspsRateMailingDate;
  nonMachinableIndicators?: {
    isPolybagged?: boolean;
    hasClosureDevices?: boolean;
    hasLooseItems?: boolean;
    isRigid?: boolean;
    isSelfMailer?: boolean;
    isBooklet?: boolean;
  };
  extraServices?: UspsRateLetterExtraServiceCode[];
  itemValue?: number;
}

export interface UspsRateFee {
  name?: string;
  SKU?: string;
  price?: number;
}

export interface UspsRateWarning {
  warningCode?: string;
  warningDescription?: string;
}

export interface UspsRateDetail {
  SKU?: string;
  description?: string;
  priceType?: UspsRateResultPriceType;
  price?: number;
  weight?: number;
  dimWeight?: number;
  fees?: UspsRateFee[];
  startDate?: string;
  /** Empty string or `YYYY-MM-DD`; `null` is the v1.0.0 typing, not in the spec. */
  endDate?: string | null;
  mailClass?: string;
  zone?: string;
  productName?: string;
  productDefinition?: string;
  processingCategory?: UspsRateProcessingCategory;
  rateIndicator?: string;
  destinationEntryFacilityType?:
    | UspsRateEntryFacilityType
    | "AREA_DISTRIBUTION_CENTER"
    | "AUXILIARY_SERVICE_FACILITY";
  /** Documented on base-rates rows only, kept optional here for the shared shape. */
  warnings?: UspsRateWarning[];
}

export interface UspsRateOption {
  totalBasePrice?: number;
  rates?: UspsRateDetail[];
}

export interface UspsBaseRatesListResult {
  rateOptions?: UspsRateOption[];
}

export interface UspsExtraServiceDetail {
  extraService?: string;
  name?: string;
  SKU?: string;
  priceType?: UspsRatePriceType;
  price?: number;
  warnings?: UspsRateWarning[];
}

export interface UspsTotalRatesOption extends UspsRateOption {
  totalPrice?: number;
  extraServices?: UspsExtraServiceDetail[];
}

export interface UspsTotalRatesResult {
  rateOptions?: UspsTotalRatesOption[];
}

export type UspsRateBaseRatesResult = UspsRateOption;

export type UspsRateExtraServiceResult = UspsExtraServiceDetail[];

export interface UspsRateLetterDetail {
  SKU?: string;
  priceType?: "RETAIL";
  price?: number;
  /** Ounces. */
  weight?: number;
  fees?: UspsRateFee[];
  startDate?: string;
  endDate?: string;
  mailClass?: "FIRST-CLASS_MAIL";
  extraServices?: UspsExtraServiceDetail[];
  /** Plain strings here, unlike the object warnings elsewhere. */
  warnings?: string[];
}

export interface UspsRateLetterResult {
  totalBasePrice?: number;
  rates?: UspsRateLetterDetail[];
}
