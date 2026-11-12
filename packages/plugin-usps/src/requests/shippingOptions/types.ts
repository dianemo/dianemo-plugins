/** `destinationZIPCode` makes it domestic, `destinationCountryCode` international. */
export type UspsShippingOptionRequest =
  UspsShippingOptionDomesticRequest | UspsShippingOptionInternationalRequest;
export interface UspsShippingOptionDomesticRequest {
  pricingOptions: UspsShippingOptionDomesticPricingOption[];
  originZIPCode: string;
  destinationZIPCode: string;
  destinationEntryFacilityType?:
    | "NONE"
    | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
    | "DESTINATION_SECTIONAL_CENTER_FACILITY"
    | "DESTINATION_DELIVERY_UNIT"
    | "DESTINATION_SERVICE_HUB"
    | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";
  packageDescription: UspsShippingOptionDomesticPackageDescription;
  shippingFilter?: "PRICE" | "SERVICE_STANDARDS";
}
export interface UspsShippingOptionInternationalRequest {
  pricingOptions: UspsShippingOptionInternationalPricingOption[];
  originZIPCode: string;
  foreignPostalCode?: string;
  destinationCountryCode: string;
  packageDescription: UspsShippingOptionInternationalPackageDescription;
  shippingFilter?: "PRICE";
  requestDutiesTaxesFees?: boolean;
  destinationCity?: string;
  destinationState?: string;
  items?: UspsShippingOptionLandedCostItem[];
}
export interface UspsShippingOptionLandedCostItem {
  itemId: string;
  itemValue: number;
  itemQuantity: number;
  itemWeight?: number;
  countryOfOrigin?: string;
  HSTariffNumber?: string;
}
export type UspsShippingOptionResponse =
  UspsShippingOptionDomesticResponse | UspsShippingOptionInternationalResponse;
export interface UspsShippingOptionDomesticResponse {
  originZIPCode?: string;
  destinationZIPCode?: string;
  pricingOptions?: UspsShippingOptionDomesticPricingOption[];
}
export interface UspsShippingOptionInternationalResponse {
  originZIPCode?: string;
  foreignPostalCode?: string;
  destinationCountryCode?: string;
  pricingOptions?: UspsShippingOptionInternationalPricingOption[];
}
export interface UspsShippingOptionDomesticOptions {
  mailClass?: UspsShippingOptionDomesticMailClass;
  rateOptions?: UspsShippingOptionDomesticRateOptions[];
}
export interface UspsShippingOptionInternationalOptions {
  mailClass?: UspsShippingOptionInternationalMailClass;
  rateOptions?: UspsShippingOptionInternationalRateOptions[];
}
export type UspsShippingOptionInternationalRateOptions = {
  dutiesTaxesFeesQuote?: UspsShippingOptionDutiesTaxesFeesQuote;
} & UspsShippingOptionRateOption;
export type UspsShippingOptionDomesticRateOptions = {
  commitment?: UspsShippingOptionCommitment;
} & UspsShippingOptionRateOption;
export interface UspsShippingOptionRateOption {
  totalPrice?: number;
  totalBasePrice?: number;
  rates?: Array<{
    description?: string;
    startDate?: string;
    endDate?: string;
    SKU?: string;
    price?: number;
    zone?: string;
    weight?: number;
    dimWeight?: number;
    dimensionalWeight?: number;
    priceType?: UspsShippingOptionPriceType;
    fees?: {
      name?: string;
      SKU?: string;
      price?: number;
    }[];
    productName?: string;
    productDefinition?: string;
    processingCategory?:
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
    rateIndicator?: string;
    destinationEntryFacilityType?:
      | "NONE"
      | "AREA_DISTRIBUTION_CENTER"
      | "AUXILIARY_SERVICE_FACILITY"
      | "DESTINATION_DELIVERY_UNIT"
      | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
      | "DESTINATION_SECTIONAL_CENTER_FACILITY"
      | "DESTINATION_SERVICE_HUB"
      | "INTERNATIONAL_SERVICE_CENTER"
      | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";
    mailClass?: UspsShippingOptionAllMailClasses;
  }>;
  extraServices?: {
    name?: string;
    SKU?: string;
    price?: number;
    extraService?: string;
    priceType?: UspsShippingOptionPriceType;
    warnings?: {
      warningCode?: string;
      warningDescription?: string;
    }[];
  }[];
}
export type UspsShippingOptionDomesticPackageDescription =
  UspsShippingOptionPackageDescription & {
    mailClass:
      | "PARCEL_SELECT"
      | "PARCEL_SELECT_LIGHTWEIGHT"
      | "USPS_CONNECT_LOCAL"
      | "USPS_CONNECT_REGIONAL"
      | "USPS_CONNECT_MAIL"
      | "USPS_GROUND_ADVANTAGE"
      | "USPS_GROUND_ADVANTAGE_RETURN_SERVICE"
      | "PRIORITY_MAIL_EXPRESS"
      | "PRIORITY_MAIL_EXPRESS_RETURN_SERVICE"
      | "PRIORITY_MAIL"
      | "PRIORITY_MAIL_RETURN_SERVICE"
      | "FIRST-CLASS_PACKAGE_SERVICE"
      | "LIBRARY_MAIL"
      | "MEDIA_MAIL"
      | "BOUND_PRINTED_MATTER"
      | "MARKETING_MAIL_PARCELS"
      | "ALL"
      | "ALL_OUTBOUND"
      | "ALL_RETURNS";
    extraServices?: UspsShippingOptionExtraService[];
    packageValue?: number;
    /** RFC 3339 full-date or date-time. */
    mailingDate?: string;
  };
export type UspsShippingOptionInternationalPackageDescription =
  UspsShippingOptionPackageDescription & {
    mailClass:
      | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
      | "PRIORITY_MAIL_INTERNATIONAL"
      | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
      | "GLOBAL_EXPRESS_GUARANTEED"
      | "ALL";
    extraServices?: UspsShippingOptionInternationalExtraService[];
    packageValue?: number;
    /** RFC 3339 full-date or date-time. */
    mailingDate?: string;
  };
export interface UspsShippingOptionDutiesTaxesFeesQuote {
  packageFee?: number;
  itemQuotes?: {
    dutyPrice?: number;
    taxPrice?: number;
    itemId?: string;
  }[];
}
export type UspsShippingOptionExtraService =
  | 365
  | 415
  | 452
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
export type UspsShippingOptionInternationalExtraService =
  370 | 813 | 820 | 826 | 857 | 930 | 931 | 955;
export interface UspsShippingOptionCommitment {
  name?: string;
  scheduleDeliveryDate?: string;
  expectedDeliveryDate?: string;
  effectiveAcceptanceDate?: string;
  /** Typed `number` by the spec although its pattern is a four-digit HHMM string. */
  cutOffTime?: number;
  guaranteedDelivery?: boolean;
  isPriorityMailNextDay?: boolean;
}
export interface UspsShippingOptionDomesticPricingOption {
  shippingOptions?: UspsShippingOptionDomesticOptions[];
  priceType?: UspsShippingOptionPriceTypeRequest;
  paymentAccount?: UspsShippingOptionPaymentAccount & {
    CRID?: string;
  };
}
export interface UspsShippingOptionInternationalPricingOption {
  shippingOptions?: UspsShippingOptionInternationalOptions[];
  priceType?: UspsShippingOptionPriceTypeRequest;
  paymentAccount?: UspsShippingOptionPaymentAccount;
}
export interface UspsShippingOptionPaymentAccount {
  accountType?: "EPS" | "PERMIT" | "METER" | "MID";
  accountNumber?: string;
}
export type UspsShippingOptionPriceTypeRequest =
  "RETAIL" | "COMMERCIAL" | "CONTRACT";
export interface UspsShippingOptionPackageDescription {
  weight: number;
  length: number;
  height: number;
  width: number;
  girth?: number;
  hasNonstandardCharacteristics?: boolean;
}
export type UspsShippingOptionDomesticMailClass =
  | "PARCEL_SELECT"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_REGIONAL"
  | "USPS_CONNECT_MAIL"
  | "USPS_GROUND_ADVANTAGE"
  | "USPS_GROUND_ADVANTAGE_RETURN_SERVICE"
  | "PRIORITY_MAIL_EXPRESS"
  | "PRIORITY_MAIL_EXPRESS_RETURN_SERVICE"
  | "PRIORITY_MAIL"
  | "PRIORITY_MAIL_RETURN_SERVICE"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER"
  | "MARKETING_MAIL_PARCELS";
export type UspsShippingOptionInternationalMailClass =
  | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
  | "PRIORITY_MAIL_INTERNATIONAL"
  | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
  | "GLOBAL_EXPRESS_GUARANTEED";
export type UspsShippingOptionAllMailClasses =
  | UspsShippingOptionDomesticMailClass
  | UspsShippingOptionInternationalMailClass;
export type UspsShippingOptionPriceType =
  "RETAIL" | "COMMERCIAL" | "COMMERCIAL_BASE" | "COMMERCIAL_PLUS" | "CONTRACT";
