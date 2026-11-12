import { CurrencyCodes } from "@dianemo/plugin-kit";

/**
 * Sell Fulfillment answers a user token only, and one application's credentials
 * serve every seller who authorised it, so `grantId` — not the client — is what
 * decides whose orders are read. Seed it with the refresh token
 * `exchangeAuthCodeForAccessToken` returns, via `handler.setGrantTokens`.
 */
export interface EbayRequestOptions {
  grantId: string;
}

// ========================================
// Common eBay Types - Shared Across APIs
// ========================================

// ============ Marketplace & Locale ============
export type EbayLocale =
  | "en_US"
  | "en_CA"
  | "fr_CA"
  | "es_ES"
  | "fr_FR"
  | "it_IT"
  | "de_DE"
  | "nl_NL"
  | "zh_HK"
  | "zh_TW"
  | "ja_JP"
  | "en_AU"
  | "en_GB";

// ============ Monetary & Measurements ============
export interface EbayAmount {
  convertedFromCurrency?: CurrencyCodes;
  convertedFromValue?: string;
  currency: CurrencyCodes;
  value: string;
}

export type EbayTimeUnit =
  "YEAR" | "MONTH" | "WEEK" | "DAY" | "HOUR" | "MINUTE" | "SECOND";

export type EbayDimensionUnit =
  "INCH" | "FEET" | "CENTIMETER" | "METER" | "MILLIMETER";

export type EbayItemWeightUnit = "POUND" | "KILOGRAM" | "OUNCE" | "GRAM";

// ============ Address & Contact ============
export interface EbayAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countryCode: string;
  county?: string;
  postalCode?: string;
  stateOrProvince?: string;
}

// ============ Common Item Properties ============
export type EbayItemCondition =
  | "NEW"
  | "NEW_OTHER"
  | "NEW_WITH_DEFECTS"
  | "CERTIFIED_REFURBISHED"
  | "EXCELLENT_REFURBISHED"
  | "VERY_GOOD_REFURBISHED"
  | "GOOD_REFURBISHED"
  | "SELLER_REFURBISHED"
  | "LIKE_NEW"
  | "USED_EXCELLENT"
  | "USED_VERY_GOOD"
  | "USED_GOOD"
  | "USED_ACCEPTABLE"
  | "FOR_PARTS_OR_NOT_WORKING";

export type EbayItemAvailability =
  "IN_STOCK" | "OUT_OF_STOCK" | "SHIP_TO_STORE";

export type EbayPackageType =
  "LETTER" | "BULKY_GOODS" | "CARAVAN" | "LARGE_FORMAT" | "PARCEL" | "ROLL";

// ============ Error Handling ============
export interface EbayErrorParameterV3 {
  name: string;
  value: string;
}

export interface EbayErrorDetailV3 {
  category: string;
  domain: string;
  errorId: number;
  inputRefIds?: string[];
  longMessage?: string;
  message: string;
  outputRefIds?: string[];
  parameters?: EbayErrorParameterV3[];
  subdomain?: string;
}

// ============ Pagination ============
export interface EbayPaginationResponse {
  href: string;
  limit: number;
  offset: number;
  total: number;
  next?: string;
  prev?: string;
}
// ============ Taxonomy / Aspects ============
export interface EbayAspectValue<TValue extends string = string> {
  localizedValue: TValue;
}

export interface EbayAspectConstraint<
  TMode extends "FREE_TEXT" | "SELECTION_ONLY" = "FREE_TEXT" | "SELECTION_ONLY",
> {
  aspectDataType: string;
  itemToAspectCardinality: "SINGLE" | "MULTI";
  aspectMode: TMode;
  aspectRequired: boolean;
  aspectUsage: string;
  aspectEnabledForVariations: boolean;
  aspectApplicableTo?: string[];
}

export interface EbayAspectDefinition<
  TValues extends string = string,
  TMode extends "FREE_TEXT" | "SELECTION_ONLY" = "FREE_TEXT" | "SELECTION_ONLY",
> {
  localizedAspectName: string;
  aspectConstraint: EbayAspectConstraint<TMode>;
  aspectValues?: EbayAspectValue<TValues>[];
}

export interface EbayGetItemAspectsForCategoryResponse {
  aspects: EbayAspectDefinition[];
}
