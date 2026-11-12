export type FedExGlobalTradeCarrierCode = "FDXE" | "FDXG";

export interface FedExGlobalTradeMoney {
  amount?: number;
  currency?: string;
}

export interface FedExGlobalTradeAddress {
  countryCode: string;
  postalCode?: string;
  stateOrProvinceCode?: string;
}

export interface FedExGlobalTradeWeight {
  units: "KG" | "LB";
  value: number;
}

export interface FedExGlobalTradeMeasure {
  uom: string;
  quantity: number;
}

export interface FedExGlobalTradeCommodity {
  /** A string in the spec, e.g. `"1"`. */
  quantity?: string;
  quantityUOM?: string;
  customsValue?: FedExGlobalTradeMoney;
  countryOfManufacture?: string;
  name?: string;
  harmonizedCode: string;
  description?: string;
  weight?: FedExGlobalTradeWeight;
  commodityId?: number;
  additionalMeasures?: FedExGlobalTradeMeasure;
}

export type FedExGlobalTradeRegulatoryControl =
  | "FOOD_OR_PERISHABLE"
  | "USMCA"
  | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
  | "NOT_IN_FREE_CIRCULATION";

export interface FedExGlobalTradeCustomsClearanceDetail {
  regulatoryControls?: FedExGlobalTradeRegulatoryControl[];
  insuranceCharges?: FedExGlobalTradeMoney;
  importerOfRecordAccountNumber?: { accountNumber?: string };
  customsValue: FedExGlobalTradeMoney;
  commercialInvoice?: {
    freightCharge?: FedExGlobalTradeMoney;
    purpose?: string;
  };
  commodities: FedExGlobalTradeCommodity[];
  /** Defaults to COMMODITY; only used for international Express requests. */
  documentContent?: "DOCUMENT" | "COMMODITY";
}

export type FedExGlobalTradeServiceOption =
  | "FEDEX_ONE_RATE"
  | "FREIGHT_GUARANTEE"
  | "SATURDAY_DELIVERY"
  | "SMART_POST_ALLOWED_INDICIA"
  | "SMART_POST_HUB_ID";

/**
 * The spec describes `customsClearanceDetail` and `totalCommodityValue` as
 * "either is required", but its `required` array lists neither.
 */
export interface FedExGlobalTradeRequest {
  /** e.g. `FEDEX_FREIGHT_ECONOMY`. */
  serviceType?: string;
  totalCommodityValue?: FedExGlobalTradeMoney;
  originAddress: FedExGlobalTradeAddress;
  destinationAddress: FedExGlobalTradeAddress;
  serviceOptionType?: FedExGlobalTradeServiceOption[];
  customsClearanceDetail?: FedExGlobalTradeCustomsClearanceDetail;
  /** `YYYY-MM-DD`; the spec says a missing or past date defaults to today. */
  shipDate?: string;
  carrierCode: FedExGlobalTradeCarrierCode;
  totalWeight?: FedExGlobalTradeWeight;
  includeURLReferences?: boolean;
  consolidationType?: string;
  consolidationRole?: string;
  version?: { major?: number; minor?: number; patch?: number };
}

export interface FedExGlobalTradeMessageParameter {
  id?: string;
  value?: string;
}

export interface FedExGlobalTradeMessage {
  code?: string;
  messageParameters?: FedExGlobalTradeMessageParameter[];
  index?: number;
  text?: string;
  localizedText?: string;
}

export interface FedExGlobalTradeLocalizedAttribute {
  localization?: { localization?: string; localeCode?: string };
  name?: string;
  description?: string;
}

export type FedExGlobalTradeSupportType =
  "FEDEX_GENERATED" | "FILLABLE" | "PRINT_ONLY" | "SAMPLE";

export interface FedExGlobalTradeStatement {
  userMessage?: FedExGlobalTradeMessage;
  supportType?: FedExGlobalTradeSupportType;
  allowability?: string;
  fileName?: string;
  agencyUrl?: string;
  documentUrl?: string;
  id?: string;
  completionType?: "COMPLETE" | "REQUIRES_COMPLETION";
  agencyName?: string;
  localizedAttributes?: FedExGlobalTradeLocalizedAttribute;
  documentIds?: string[];
  statementUrl?: string;
}

export interface FedExGlobalTradeDocument {
  userMessage?: FedExGlobalTradeMessage;
  supportType?: FedExGlobalTradeSupportType;
  allowability?: string;
  fileName?: string;
  documentType?: string;
  agencyUrl?: string;
  documentUrl?: string;
  id?: string;
  agencyName?: string;
  localizedAttributes?: FedExGlobalTradeLocalizedAttribute;
}

export interface FedExGlobalTradeAdvisory {
  types?: string;
  messages?: {
    code?: string;
    text?: string;
    parameters?: FedExGlobalTradeMessageParameter[];
    localizedText?: string;
  }[];
}

/** Each of these is a single object in the spec, not an array. */
export interface FedExGlobalTradeShipmentDetail {
  regulatoryStatements?: FedExGlobalTradeStatement;
  requiredCommodityUnitsOfMeasure?: string[];
  level?: string;
  /** 1-based index of the request commodity this detail concerns. */
  commodityIndex?: number;
  regulatoryDocuments?: FedExGlobalTradeDocument;
  regulatoryCountryAdvisories?: FedExGlobalTradeAdvisory;
}

export interface FedExGlobalTradeCountryDetails {
  shipmentDetails: FedExGlobalTradeShipmentDetail;
  countryCode: string;
  category: string;
}

export interface FedExGlobalTradeAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  parameterList?: { value?: string; key?: string }[];
  message?: string;
}

/** The spec's alerts array is named `cxsalerts` here, not `alerts`. */
export interface FedExGlobalTradeOutput {
  userMessages: FedExGlobalTradeMessage[];
  /** A single object in the spec, not an array. */
  countryDetails: FedExGlobalTradeCountryDetails;
  cxsalerts?: FedExGlobalTradeAlert[];
}

export interface FedExGlobalTradeResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExGlobalTradeOutput;
}
