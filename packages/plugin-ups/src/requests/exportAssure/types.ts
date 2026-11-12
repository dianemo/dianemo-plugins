/** Optional `accountNumber` header on Export Assure — see docs/ups-api.md#export-assure */
export interface UpsExportAssureOptions {
  accountNumber?: string;
}

export type UpsExportAssureAccountNumber = string | null;

export type UpsExportAssureCommodityId = string;

export interface UpsExportAssureComplianceDetails {
  categoryType: "Import" | "Export";
  controlTypes: UpsExportAssureControlTypes[];
}

export interface UpsExportAssureControlDetails {
  controlDetailName: string;
  controlDetailDescription: string;
}

export interface UpsExportAssureControlTypes {
  controlType: string;
  controlTypeCode: string;
  isRequired?: "Yes" | "Maybe" | "Applicable";
  controlTypeMessage: string;
  controlDetails: UpsExportAssureControlDetails[];
}

export type UpsExportAssureCountryCodes = string;

export type UpsExportAssureCurrencyCodes =
  | "ARS"
  | "AUD"
  | "BRL"
  | "CAD"
  | "CHF"
  | "CLP"
  | "CNY"
  | "CRC"
  | "DKK"
  | "DOP"
  | "EUR"
  | "GBP"
  | "HKD"
  | "INR"
  | "JPY"
  | "KRW"
  | "MXN"
  | "MYR"
  | "NOK"
  | "NZD"
  | "PEN"
  | "PHP"
  | "PLN"
  | "SEK"
  | "SGD"
  | "THB"
  | "TWD"
  | "USD"
  | "VEB";

export interface UpsExportAssureDescriptionGuidanceResponse {
  isMatched?: boolean;
  message?: string;
  sourceListName?: string;
  matchedKeyword?: string;
}

export interface UpsExportAssureErrorResponse {
  response: UpsExportAssureErrorResponseWrapper;
  perfStats: UpsExportAssureALPerfStats;
}

export interface UpsExportAssureErrorResponseWrapper {
  errors: UpsExportAssureErrorCode[];
}

export interface UpsExportAssureErrorCode {
  code?: string;
  description?: string;
  message?: string;
  field?: string;
  value?: string;
  type?: "DG" | "IEC" | "POA";
}

export type UpsExportAssureEvaluationCriteria =
  | "NonConditional"
  | "Description"
  | "FTA"
  | "Value"
  | "HTS"
  | "Quantity"
  | "Weight"
  | "HTS PGA";

export interface UpsExportAssureRequest {
  transID: string;
  evaluateDescriptions?: boolean;
  evaluatePoaRequirements?: boolean;
  evaluateAdvancedImportExportRequirements?: boolean;
  evaluateImportExportRequirements?: boolean;
  shipment: UpsExportAssureShipmentRequest;
}

export interface UpsExportAssureResponse {
  transID: UpsExportAssureTransactionID;
  shipment: UpsExportAssureShipmentResponse;
  perfStats: UpsExportAssureALPerfStats;
}

export interface UpsExportAssurePartialResponse {
  transID: UpsExportAssureTransactionID;
  shipment: UpsExportAssureShipmentResponse;
  response: UpsExportAssureErrorResponseWrapper;
  perfStats: UpsExportAssureALPerfStats;
}

export type UpsExportAssureHsCode = string;

export interface UpsExportAssureImportExportShipmentLevelResponse {
  shipmentValue?: number;
  shipmentCurrencyCode: UpsExportAssureCurrencyCodes;
  translationLocale?: UpsExportAssureTranslationLocale;
  hasShipmentWarnings: boolean;
  hasCommodityWarnings: boolean;
  commodityWarningsMessage?: string;
  isShipmentOverGiftValueThreshold: boolean;
  shipmentOverGiftValueThresholdMessage?: string;
  isShipmentOverGiftWeightThreshold: boolean;
  shipmentOverGiftWeightThresholdMessage?: string;
}

export interface UpsExportAssureImportExportItemLevelResponse {
  isUpsProhibited: boolean;
  upsProhibitedMessage?: null | string;
  isTranslatedIndicator: boolean;
  complianceOutput?: UpsExportAssureComplianceDetails[];
}

export interface UpsExportAssurePowerOfAttorneyResponse {
  importerPoaRequiredFlag: boolean;
  importerEvaluationCriteria?: UpsExportAssureEvaluationCriteria;
  /** `boolean` only in the spec's `cieResponseExample`; the schema says `Yes`/`No`. */
  importerPoaOnFileIndicator?: "Yes" | "No" | boolean | null;
  importerCommodityId?: UpsExportAssureCommodityId;
  importerCommodityDescription?: string;
  exporterPoaRequiredFlag: boolean;
  exporterEvaluationCriteria?: UpsExportAssureEvaluationCriteria;
  exporterPoaOnFileIndicator?: "Yes" | "No" | boolean | null;
  exporterCommodityId?: UpsExportAssureCommodityId;
  exporterCommodityDescription?: string;
  exporterOnlineFormFlag: boolean;
  exporterDocuSignTemplateId?: string;
}

export interface UpsExportAssureShipmentRequest {
  importerName?: string;
  importerCity?: string;
  importerZipcode?: string;
  importerAccountNumber?: string | null;
  exporterName?: string;
  exporterCity?: string;
  exporterZipcode?: string;
  exporterAccountNumber?: string;
  id: UpsExportAssureShipmentId;
  importCountryCode: UpsExportAssureCountryCodes;
  exportCountryCode: UpsExportAssureCountryCodes;
  translationLocale?: UpsExportAssureTranslationLocale;
  transModes?:
    | "INT_AIR"
    | "INT_OCEAN"
    | "INT_RAIL"
    | "INT_TRUCK"
    | "DOM_AIR"
    | "DOM_OCEAN"
    | "DOM_RAIL"
    | "DOM_TRUCK";
  shipmentType: "GIFT" | "COMM" | "OTHR" | "PERS";
  shipmentDescription?: string;
  grossWeight?: number;
  grossWeightUnit: "KG" | "LB" | null;
  shipmentItems: UpsExportAssureShipmentItemsRequest[];
}

export interface UpsExportAssureShipmentResponse {
  id: UpsExportAssureShipmentId;
  hasCommodityWarnings: boolean;
  descriptionGuidance?: UpsExportAssureDescriptionGuidanceResponse;
  poaCompliance?: UpsExportAssurePowerOfAttorneyResponse;
  importExportCompliance?: UpsExportAssureImportExportShipmentLevelResponse;
  shipmentItems: UpsExportAssureShipmentItemsResponse[];
}

export type UpsExportAssureShipmentId = string;

export interface UpsExportAssureShipmentItemsRequest {
  commodityId: UpsExportAssureCommodityId;
  eccn?: string;
  hsCode?: UpsExportAssureHsCode;
  description: string;
  originCountryCode: UpsExportAssureCountryCodes;
  amountValue: number;
  currencyCode: UpsExportAssureCurrencyCodes;
  quantity: number;
  UOM:
    | "Bag"
    | "Barrel"
    | "Bolt"
    | "Box"
    | "Bunch"
    | "Bundle"
    | "Butt"
    | "Canister"
    | "Carton"
    | "Case"
    | "Centimeter"
    | "Container"
    | "Crate"
    | "Cylinder"
    | "Dozen"
    | "Each"
    | "Envelope"
    | "Feet"
    | "Kilogram"
    | "Liter"
    | "Meter"
    | "Number"
    | "Package"
    | "Packet"
    | "Pairs"
    | "Pallet"
    | "Pieces"
    | "Pounds"
    | "ProofLiter"
    | "Roll"
    | "Set"
    | "Square Meters"
    | "Square Yards"
    | "Tube"
    | "Yard";
}

export interface UpsExportAssureShipmentItemsResponse {
  commodityId: UpsExportAssureCommodityId;
  hsCode?: UpsExportAssureHsCode;
  description: string;
  descriptionGuidance?: UpsExportAssureDescriptionGuidanceResponse;
  importExportCompliance?: UpsExportAssureImportExportItemLevelResponse;
}

export type UpsExportAssureTransactionID = string;

export type UpsExportAssureTranslationLocale =
  "EN" | "DE" | "PL" | "FR" | "IT" | "NL" | "ES" | "ZH";

export interface UpsExportAssureALPerfStats {
  absLayerTime: string;
  fulfillTime: string;
  receiptTime: string;
}
