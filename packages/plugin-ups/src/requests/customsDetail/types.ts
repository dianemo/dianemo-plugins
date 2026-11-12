export type UpsCustomsDetailShipmentType =
  "Gift" | "Commercial" | "Sale" | "Sample" | "Repair" | "Return" | "Other";

export type UpsCustomsDetailWeightUnit = "LBS" | "KGS";

export type UpsCustomsDetailUserRole = "Importer" | "Exporter";

export type UpsCustomsDetailCommerceModel = "B2B" | "B2C" | "C2B" | "C2C";

/** Every field is optional; omitting both countries returns every country's fields. */
export interface UpsCustomsDetailRequirementsParams {
  /** ISO 3166 alpha-2, upper case. */
  importCountryCode?: string;
  /** ISO 3166 alpha-2, upper case. */
  exportCountryCode?: string;
  /** IETF BCP 47 tag of the form `xx-XX` per the schema; defaults to `en-US`. */
  locale?: string;
  /** Tariff codes, sent comma-joined. */
  commodityCodes?: string[];
  shipmentType?: UpsCustomsDetailShipmentType;
  shipmentWeight?: number;
  shipmentWeightUnit?: UpsCustomsDetailWeightUnit;
  shipmentValue?: number;
  /** ISO 4217, upper case. */
  shipmentValueCurrency?: string;
  /** Sent comma-joined. */
  userRoles?: UpsCustomsDetailUserRole[];
  commerceModel?: UpsCustomsDetailCommerceModel;
}

export interface UpsCustomsDetailRegulationSection {
  sectionKey?: string;
  sectionName?: string;
}

export interface UpsCustomsDetailCommodityRegulation {
  regulation: string;
  regulationSections?: UpsCustomsDetailRegulationSection[];
}

export interface UpsCustomsDetailCommodityEntry {
  commodityCode: string;
  regulations: UpsCustomsDetailCommodityRegulation[];
}

/** Y = yes, N = no, C = conditional on `requirementConditions`. */
export type UpsCustomsDetailRequired = "Y" | "N" | "C";

export type UpsCustomsDetailLogicalOperator = "AND" | "OR";

export interface UpsCustomsDetailRequirementCondition {
  logicalOperator?: UpsCustomsDetailLogicalOperator;
  fieldKey: string | null;
  operator: "=" | ">" | "<" | "!=" | null;
  value: string | null;
}

export interface UpsCustomsDetailDisplayCondition {
  ruleType?: "request" | "fieldInput";
  logicalOperator?: UpsCustomsDetailLogicalOperator;
  fieldKey: string | null;
  operator: "=" | ">" | "<" | "!=" | "Contains" | null;
  value: string | null;
  unit?: string | null;
}

export type UpsCustomsDetailFieldType =
  "textbox" | "list" | "date" | "radio" | "checkbox" | "textarea";

export type UpsCustomsDetailDataType =
  "Custom" | "List" | "Email" | "Text" | "Alphanumeric" | "Number" | "Date";

export interface UpsCustomsDetailListValue {
  displayText: string;
  internalValue: string;
}

export interface UpsCustomsDetailFieldValidation {
  minLength: number | null;
  maxLength: number | null;
  errorMessage: string | null;
  dataType: UpsCustomsDetailDataType;
  regexPattern?: string | null;
  listValues?: UpsCustomsDetailListValue[];
}

export interface UpsCustomsDetailField {
  sectionKey: string;
  label: string;
  /** Up to three characters; a string, not a number. */
  order: string;
  /** The field's help text; the schema's type is `[string, "null"]`. */
  tooltip: string | null;
  isRequired: UpsCustomsDetailRequired;
  requirementConditions?: UpsCustomsDetailRequirementCondition[] | null;
  displayConditions?: UpsCustomsDetailDisplayCondition[] | null;
  fieldType: UpsCustomsDetailFieldType;
  /** 1 to 99, default 1. */
  allowedValueCount: number;
  validation: UpsCustomsDetailFieldValidation;
  regulationSections?: UpsCustomsDetailRegulationSection[];
  keyAlias?: string | null;
  level?: "Shipment" | "Product" | null;
  includeOnInvoice?: boolean;
}

export interface UpsCustomsDetailValidationRule {
  rule?: string;
  errorMessage?: string;
}

export interface UpsCustomsDetailFieldGroup {
  countryCode: string;
  countryName?: string;
  /** Which movement the group's fields apply to. */
  shipmentType: "Import" | "Export" | "Both";
  groupKey: string;
  details: string;
  regulation?: string;
  regulationSections?: UpsCustomsDetailRegulationSection[];
  validationRules?: UpsCustomsDetailValidationRule[];
  fields: UpsCustomsDetailField[];
}

export interface UpsCustomsDetailRequirementsResponse {
  commodityCodes: UpsCustomsDetailCommodityEntry[];
  fieldGroups?: UpsCustomsDetailFieldGroup[];
}

export interface UpsCustomsDetailMetaDataField {
  fieldKey: string;
  regulationSections?: UpsCustomsDetailRegulationSection[];
  /** At most 500 characters; may be empty. */
  fieldValue: string;
}

export interface UpsCustomsDetailMetaDataGroup {
  groupKey?: string;
  fields: UpsCustomsDetailMetaDataField[];
}

export interface UpsCustomsDetailProduct {
  /** 1 to 50 characters. */
  productId: string;
  /** 1 to 105 characters. */
  productDescription: string;
  lineNumber?: number;
  commodityCode?: string;
  productMetaData: UpsCustomsDetailMetaDataGroup[];
}

/** `validate` checks the values; `save` submits them for merging into the shipment. */
export type UpsCustomsDetailActionType = "validate" | "save";

export interface UpsCustomsDetailSubmission {
  actionType: UpsCustomsDetailActionType;
  /** Six characters. */
  shipperNumber?: string;
  /** `1Z` plus sixteen upper-case alphanumerics. */
  trackingNumber?: string;
  invoiceFormGroupId?: string;
  shipmentType?: UpsCustomsDetailShipmentType;
  shipmentWeight?: number;
  shipmentWeightUnit?: UpsCustomsDetailWeightUnit;
  shipmentValue?: number;
  shipmentValueCurrency?: string;
  userRoles?: UpsCustomsDetailUserRole[];
  commerceModel?: UpsCustomsDetailCommerceModel;
  importCountryCode?: string;
  exportCountryCode?: string;
  shipmentMetaData?: UpsCustomsDetailMetaDataGroup[];
  products?: UpsCustomsDetailProduct[];
}

/**
 * Header for the submit call. The spec says it is required for EWS, FWS and
 * WorldShip callers and optional otherwise.
 */
export interface UpsCustomsDetailSubmitOptions {
  registrationId?: string;
}

export interface UpsCustomsDetailError {
  code: string;
  message: string;
  /** A symbolic name such as `VALUE_REQUIRED`; the 401 example has `null`. */
  description?: string | null;
  field?: string | null;
  value?: string | null;
}

export interface UpsCustomsDetailErrorResponse {
  response: { errors: UpsCustomsDetailError[] };
}
