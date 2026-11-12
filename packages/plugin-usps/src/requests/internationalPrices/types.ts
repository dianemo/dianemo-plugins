export interface UspsInternationalPriceBaseRatesQuery {
  originZIPCode: UspsInternationalPriceOriginZIPCode;
  weight: UspsInternationalPriceWeightPounds;
  length: UspsInternationalPriceLength;
  width: UspsInternationalPriceWidth;
  height: UspsInternationalPriceHeight;
  mailClass:
    | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
    | "PRIORITY_MAIL_INTERNATIONAL"
    | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
    | "GLOBAL_EXPRESS_GUARANTEED";
  processingCategory: "FLATS" | "MACHINABLE" | "NON_MACHINABLE" | "NONSTANDARD";
  rateIndicator:
    | "E4"
    | "E6"
    | "E7"
    | "FA"
    | "FB"
    | "FE"
    | "FP"
    | "FS"
    | "PA"
    | "PL"
    | "SP"
    | "EP"
    | "HA"
    | "HB"
    | "HE"
    | "HL"
    | "HP"
    | "HS"
    | "LE";
  destinationEntryFacilityType: "NONE" | "INTERNATIONAL_SERVICE_CENTER";
  priceType: UspsInternationalPricePriceType;
  mailingDate?: UspsInternationalPriceMailingDate;
  foreignPostalCode?: UspsInternationalPriceForeignPostalCode;
  destinationCountryCode: UspsInternationalPriceDestinationCountryCode;
  accountType?: "EPS" | "PERMIT" | "METER";
  accountNumber?: string;
}

export interface UspsInternationalPriceRateOption {
  totalBasePrice?: number;
  rates?: UspsInternationalPriceRateDetails[];
}

export interface UspsInternationalPriceExtraServiceRateQuery {
  extraServices?: Array<370 | 813 | 820 | 826 | 857 | 930 | 931 | 955>;
  extraService?: 370 | 813 | 820 | 826 | 857 | 930 | 931 | 955;
  mailClass:
    | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
    | "PRIORITY_MAIL_INTERNATIONAL"
    | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
    | "GLOBAL_EXPRESS_GUARANTEED";
  priceType: "RETAIL" | "COMMERCIAL" | "COMMERCIAL_PLUS" | "NSA";
  itemValue?: string;
  weight: UspsInternationalPriceWeightPounds;
  mailingDate?: UspsInternationalPriceMailingDate;
  rateIndicator:
    | "E4"
    | "E6"
    | "E7"
    | "FA"
    | "FB"
    | "FE"
    | "FP"
    | "FS"
    | "PA"
    | "PL"
    | "SP"
    | "EP"
    | "HA"
    | "HB"
    | "HE"
    | "HL"
    | "HP"
    | "HS"
    | "LE";
  destinationCountryCode: UspsInternationalPriceDestinationCountryCode;
  accountType?: "EPS" | "PERMIT" | "METER";
  accountNumber?: string;
}

export interface UspsInternationalPriceExtraServiceRateDetails {
  extraServices?: Array<{
    SKU?: UspsInternationalPriceSKU;
    price?: UspsInternationalPricePrice;
    priceType?: UspsInternationalPricePriceType;
    extraService?: 370 | 813 | 820 | 826 | 857 | 930 | 931 | 955;
    name?: UspsInternationalPriceExtraServiceName;
    warnings?: UspsInternationalPriceWarningsList;
  }>;
}

export interface UspsInternationalPriceRateListQuery {
  originZIPCode: UspsInternationalPriceOriginZIPCode;
  foreignPostalCode?: UspsInternationalPriceForeignPostalCode;
  destinationCountryCode: UspsInternationalPriceDestinationCountryCode;
  weight: UspsInternationalPriceWeightPounds;
  mailingDate?: UspsInternationalPriceMailingDate;
  length: UspsInternationalPriceLength;
  width: UspsInternationalPriceWidth;
  height: UspsInternationalPriceHeight;
  priceType?: UspsInternationalPricePriceType;
  mailClass?:
    | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
    | "PRIORITY_MAIL_INTERNATIONAL"
    | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
    | "GLOBAL_EXPRESS_GUARANTEED"
    | "ALL";
  accountType?: "EPS" | "PERMIT" | "METER";
  accountNumber?: string;
}

export interface UspsInternationalPriceRateListQueryResult {
  rateOptions?: UspsInternationalPriceRateOptions;
}

export type UspsInternationalPriceTotalRatesQuery =
  UspsInternationalPriceRateListQuery & {
    requestDutiesTaxesFees?: boolean;
    destinationCity?: string;
    destinationState?: string;
    items?: UspsInternationalPriceTotalRatesRequestLandedCostItem[];
    itemValue?: number;
    extraServices?: Array<370 | 813 | 820 | 826 | 857 | 930 | 931 | 955>;
  };

export interface UspsInternationalPriceTotalRatesQueryResult {
  rateOptions?: Array<
    UspsInternationalPriceRateOption & {
      dutiesTaxesFeesQuote?: {
        packageFee?: number;
        itemQuotes?: Array<{
          dutyPrice?: number;
          taxPrice?: number;
          itemId?: string;
        }>;
      };
      extraServices?: Array<{
        SKU?: UspsInternationalPriceSKU;
        price?: UspsInternationalPricePrice;
        priceType?: UspsInternationalPricePriceType;
        extraService?: string;
        name?: UspsInternationalPriceExtraServiceName;
        warnings?: UspsInternationalPriceWarningsList;
      }>;
      totalPrice?: number;
    }
  >;
}

export interface UspsInternationalPriceLetterRatesQuery {
  weight: UspsInternationalPriceWeightOunces;
  length: number;
  height: number;
  thickness: number;
  processingCategory: "LETTERS" | "FLATS" | "CARDS";
  mailingDate?: UspsInternationalPriceMailingDate;
  nonMachinableIndicators?: {
    isPolybagged?: boolean;
    hasClosureDevices?: boolean;
    hasLooseItems?: boolean;
    isRigid?: boolean;
    isSelfMailer?: boolean;
    isBooklet?: boolean;
  };
  extraServices?: Array<940 | 955>;
  destinationCountryCode: UspsInternationalPriceDestinationCountryCode;
  itemValue?: number;
}

export interface UspsInternationalPriceLetterRatesOption {
  totalBasePrice?: number;
  rates?: UspsInternationalPriceLettersRateDetails[];
}

export type UspsInternationalPriceOriginZIPCode = string;

export type UspsInternationalPriceWeightPounds = number;

export type UspsInternationalPriceLength = number;

export type UspsInternationalPriceWidth = number;

export type UspsInternationalPriceHeight = number;

export type UspsInternationalPricePriceType =
  "RETAIL" | "COMMERCIAL" | "COMMERCIAL_BASE" | "COMMERCIAL_PLUS" | "CONTRACT";

export type UspsInternationalPriceMailingDate = string;

export type UspsInternationalPriceForeignPostalCode = string;

export type UspsInternationalPriceDestinationCountryCode = string;

export interface UspsInternationalPriceRateDetails {
  SKU?: string;
  description?: string;
  priceType?:
    | "RETAIL"
    | "COMMERCIAL"
    | "COMMERCIAL_BASE"
    | "COMMERCIAL_PLUS"
    | "CONTRACT";
  price?: number;
  weight?: number;
  dimWeight?: number;
  fees?: Array<{
    name?: string;
    SKU?: string;
    price?: number;
  }>;
  startDate?: string;
  endDate?: string;
  mailClass?: string;
  zone?: string;
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
  destinationEntryFacilityType?: "NONE" | "INTERNATIONAL_SERVICE_CENTER";
  warnings?: UspsInternationalPriceWarningsList;
  productName?: string;
  productDefinition?: string;
}

export type UspsInternationalPriceSKU = string;

export type UspsInternationalPricePrice = number;

export type UspsInternationalPriceExtraServiceName = string;

export type UspsInternationalPriceWarningsList = Array<{
  warningCode?: string;
  warningDescription?: string;
}>;

export type UspsInternationalPriceRateOptions =
  UspsInternationalPriceRateOption[];

export interface UspsInternationalPriceTotalRatesRequestLandedCostItem {
  itemId: string;
  itemValue: number;
  itemQuantity: number;
  weight?: number;
  countryOfOrigin?: string;
  HSTariffNumber?: string;
}

export type UspsInternationalPriceWeightOunces = number;

export type UspsInternationalPriceLettersRateDetails =
  UspsInternationalPriceLetterRateDetail & {
    warnings?: string[];
  };

export interface UspsInternationalPriceLetterRateDetail {
  SKU?: string;
  description?: string;
  priceType?: "RETAIL";
  price?: number;
  weight?: number;
  fees?: Array<{
    name?: string;
    SKU?: string;
    price?: number;
  }>;
  startDate?: string;
  endDate?: string;
  mailClass?: "FIRST-CLASS_MAIL";
  extraServices?: Array<{
    SKU?: UspsInternationalPriceSKU;
    price?: UspsInternationalPricePrice;
    priceType?: UspsInternationalPricePriceType;
    extraService?: string;
    name?: UspsInternationalPriceExtraServiceName;
    warnings?: UspsInternationalPriceWarningsList;
  }>;
  zone?: string;
}
