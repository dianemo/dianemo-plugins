import { FedExResponse } from "../types.js";

export interface FedExConsolidationAddress {
  streetLines: string[];
  city?: string;
  stateOrProvinceCode?: string;
  /** This is placeholder for postal code. Note: The postal code is required for postal-aware countries. */
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExConsolidationAddressAncillaryDetail {
  locationInCity?: string;
  suite?: string;
  addressVerificationOverrideReason?: string;
  locationInProperty?: string;
  addtionalDescriptions?: string;
  department?: string;
  roomFloor?: string;
  crossStreet?: string;
  building?: string;
  apartment?: string;
  room?: string;
}

export interface FedExConsolidationAddressV2 {
  /**
   * Combination of number, street name, etc. Max Length is 35. The schema requires this
   * and `city`, but the payor address in the spec's shipment samples sends only
   * `countryCode`: docs/fedex-api.md#consolidation-api.
   */
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
  /** Not in the schema; `printedLabelOrigin.address` in the sync IDF sample sends `"POTENTIAL"`. */
  addressClassificationConfidence?: string;
}

export interface FedExConsolidationAdrLicenseDetail {
  licenseOrPermitDetail?: FedExConsolidationLicenseOrPermitDetail;
}

export interface FedExConsolidationAlcoholDetail {
  alcoholRecipientType?: "LICENSEE" | "CONSUMER";
  shipperAgreementType?: string;
}

export interface FedExConsolidationAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

export interface FedExConsolidationAncillaryFeeAndTax {
  type?:
    | "CLEARANCE_ENTRY_FEE"
    | "GOODS_AND_SERVICES_TAX"
    | "HARMONIZED_SALES_TAX"
    | "OTHER";
  description?: string;
  amount?: FedExConsolidationMoney;
}

export interface FedExConsolidationAssociatedFreightLineItemDetail {
  id: string;
}

export interface FedExConsolidationAssociatedTrackingDetails {
  trackingIds?: FedExConsolidationTrackingIds[];
  type?:
    | "COD_AND_DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN"
    | "COD_RETURN"
    | "CONSOLIDATION_DOCUMENTS"
    | "CONSOLIDATION_MASTER"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN";
}

export interface FedExConsolidationConfirmResultsOutput {
  jobId?: string;
  processingOptionType?: string;
  transactionConsolidations?: FedExConsolidationTransactionConsolidationOutput[];
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationShipmentResultsOutput {
  transactionShipments?: FedExConsolidationTransactionCreateConsolidationShipmentResultsOutput[];
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationRetrieveOutput {
  retrievedConsolidation?: FedExConsolidationRetrievedConsolidation;
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationBatteryDetail {
  batteryPackingType?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
  batteryRegulatoryType?: "IATA_SECTION_II";
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExConsolidationBinaryBarcode {
  type?: string;
  value?: string[];
}

export interface FedExConsolidationBrokerDetail {
  broker?: {
    address: FedExConsolidationPartyAddress;
    contact: FedExConsolidationPartyContact;
    accountNumber?: FedExConsolidationPartyAccountNumber;
    tins?: FedExConsolidationTaxpayerIdentification[];
    deliveryInstructions?: string;
  };
  type?: string;
}

export interface FedExConsolidationBrokerDetailV2 {
  broker?: {
    address: FedExConsolidationPartyAddressV2;
    contact: FedExConsolidationPartyContact;
    accountNumber?: FedExConsolidationPartyAccountNumber;
    tins?: FedExConsolidationTaxpayerIdentificationV2[];
  };
  type?: string;
}

export type FedExConsolidationCarrierCode = string;

export interface FedExConsolidationClearanceItemDetail {
  role?: "MANUFACTURER";
  id?: string;
  contact?: FedExConsolidationContact;
  address?: FedExConsolidationAddressV3;
}

export interface FedExConsolidationAddressV3 {
  /** Combination of number, street name, etc. At least one line is required for a valid physical address. Empty lines should not be included. */
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
}

export interface FedExConsolidationContact {
  companyName?: string;
}

export interface FedExConsolidationCommodity {
  /** Not in the schema; the sync IPD sample sends it. */
  partNumber?: string;
  /** Not in the schema; the sync IGD sample sends it. */
  harmonizedCode?: string;
  name?: string;
  numberOfPieces: number;
  description: string;
  cIMarksAndNumbers?: string;
  /** This is commodity country of manufacture. This is required for International shipments. Maximum allowed length is 4. */
  countryOfManufacture?: string;
  weight?: FedExConsolidationWeight;
  quantity?: number;
  quantityUnits?: string;
  unitPrice?: FedExConsolidationMoneyV2;
  customsValue?: FedExConsolidationMoneyV2;
  commodityId?: string;
  clearanceItemDetail?: FedExConsolidationClearanceItemDetail[];
}

export interface FedExConsolidationCommodityClarificationDetail {
  commodityIndex?: number;
  suggestions?: FedExConsolidationSuggestedCommodityDetail[];
}

export interface FedExConsolidationCommodityV2 {
  name: string;
  numberOfPieces: number;
  description: string;
  /** This is commodity country of manufacture. This is required for International shipments. Maximum allowed length is 4. */
  countryOfManufacture?: string;
  weight?: FedExConsolidationWeight;
  quantity?: number;
  quantityUnits?: string;
  unitPrice?: FedExConsolidationMoneyV2;
  customsValue?: FedExConsolidationMoneyV2;
  commodityId?: string;
  clearanceItemDetail?: FedExConsolidationClearanceItemDetail[];
}

export interface FedExConsolidationCompletedEtdDetail {
  folderId?: string;
  type?: string;
  uploadDocumentReferenceDetails?: FedExConsolidationUploadDocumentReferenceDetail[];
}

export interface FedExConsolidationCompletedHazardousPackageDetail {
  regulation?: string;
  accessibility?: string;
  labelType?: string;
  containers?: FedExConsolidationValidatedHazardousContainer[];
  cargoAircraftOnly?: boolean;
  referenceId?: string;
  radioactiveTransportIndex?: number;
}

export interface FedExConsolidationCompletedHazardousShipmentDetail {
  hazardousSummaryDetail?: FedExConsolidationCompletedHazardousSummaryDetail;
  adrLicense?: FedExConsolidationAdrLicenseDetail;
  dryIceDetail?: FedExConsolidationShipmentDryIceDetail;
}

export interface FedExConsolidationCompletedHazardousSummaryDetail {
  smallQuantityExceptionPackageCount?: number;
}

export interface FedExConsolidationCompletedHoldAtLocationDetail {
  holdingLocationType?: string;
  holdingLocation?: FedExConsolidationHoldingLocation;
}

export interface FedExConsolidationHoldingLocation {
  address?: FedExConsolidationAddress;
  contact?: FedExConsolidationContactV2;
}

export interface FedExConsolidationCompletedPackageDetail {
  sequenceNumber?: number;
  operationalDetail?: FedExConsolidationPackageOperationalDetail;
  signatureOption?: string;
  trackingIds?: FedExConsolidationTrackingId[];
  groupNumber?: number;
  oversizeClass?: string;
  packageRating?: FedExConsolidationPackageRating;
  dryIceWeight?: FedExConsolidationWeight;
  hazardousPackageDetail?: FedExConsolidationCompletedHazardousPackageDetail;
}

export interface FedExConsolidationConfirmOutput {
  processingOptionType?: string;
  jobId?: string;
  completedConsolidationDetail?: FedExConsolidationCompletedConsolidationDetail;
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationCompletedConsolidationDetail {
  consolidationShipments?: FedExConsolidationConsolidationShipments;
}

export interface FedExConsolidationConsolidationCustomsDeclarationStatementDetail {
  types?: string[];
}

export type FedExConsolidationConsolidationDataSources =
  FedExConsolidationInner[];

export interface FedExConsolidationInner {
  consolidationDataType?: FedExConsolidationConsolidationDataType;
  consolidationDataSourceType?: FedExConsolidationConsolidationDataSourceType;
}

export interface FedExConsolidationConsolidationDocumentSpec {
  consolidationDocumentTypes?: string[];
  consolidatedCommercialInvoiceDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  customsPackingListDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  crnReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  condensedCrnReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  consolidatedCustomsLinehaulReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  consolidatedPartyReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  consolidatedSoldToSummaryReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  commoditiesByTrackingNumberDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetail;
  customDocumentDetails?: FedExConsolidationFormats[];
}

export interface FedExConsolidationConsolidationDocumentSpecV2 {
  consolidationDocumentTypes?: string[];
  consolidatedCommercialInvoiceDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  customsPackingListDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  crnReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  condensedCrnReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  consolidatedCustomsLinehaulReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  consolidatedPartyReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  consolidatedSoldToSummaryReportDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  commoditiesByTrackingNumberDetail?: FedExConsolidationConsolidatedCommercialInvoiceDetailV2;
  customDocumentDetails?: FedExConsolidationFormatsV2[];
}

export interface FedExConsolidationConsolidatedCommercialInvoiceDetailV2 {
  format?: FedExConsolidationFormatsV2;
}

export interface FedExConsolidationConsolidatedCommercialInvoiceDetail {
  format?: FedExConsolidationFormats;
}

export type FedExConsolidationType =
  | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
  | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
  | "INTERNATIONAL_GROUND_DISTRIBUTION"
  | "TRANSBORDER_DISTRIBUTION"
  | "INTERNATIONAL_PRIORITY_DISTRIBUTION";

/**
 * The schema's spelling is `date` and `type`; the retrieve and delete samples send
 * `shipDatestamp` and `consolidationType` instead, so either pair is accepted:
 * docs/fedex-api.md#consolidation-api.
 */
export type FedExConsolidationConsolidationKey = { index: string } & (
  | { date: string; type: FedExConsolidationType }
  | { shipDatestamp: string; consolidationType: FedExConsolidationType }
);

export interface FedExConsolidationConsolidationProcessingOptionsRequested {
  options?: "REQUIRE_PRE_EPIC_BARCODE"[];
}

export interface FedExConsolidationShipmentResultsRequest {
  jobId: string;
  accountNumber: FedExConsolidationPartyAccountNumber;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationConsolidationShipments {
  shipmentRoleType?:
    | "CONSOLIDATION_DOCUMENTS_SHIPMENT"
    | "CRN_SHIPMENT"
    | "MASTER_AIRWAYBILL_SHIPMENT";
  consolidationRequestedShipments?: FedExConsolidationConsolidationRequestedShipments;
  completedShipmentDetail?: FedExConsolidationCreateConsolidationCompletedShipmentDetail;
}

export interface FedExConsolidationConsolidationRequestedShipments {
  shipDatestamp?: string;
  dropOffType?:
    | "BUSINESS_SERVICE_CENTER"
    | "DROP_BOX"
    | "REGULAR_PICKUP"
    | "REQUEST_COURIER"
    | "STATION";
  recipientLocationNumber?: string;
  serviceType?: string;
  packagingType?: string;
  totalWeight?: FedExConsolidationWeight;
  totalDimensions?: FedExConsolidationDimensions;
  shipper?: FedExConsolidationShipperParty;
  origin?: FedExConsolidationRecipientParty;
  recipient?: FedExConsolidationSoldToParty;
  processingOptionsRequested?: FedExConsolidationProcessingOptionsRequested;
  consolidationDetail?: FedExConsolidationConsolidationDetail;
  customsClearanceDetail?: FedExConsolidationCustomsClearanceDetail;
  blockinsightVisibility?: boolean;
  labelSpecification?: FedExConsolidationLabelSpecification;
  rateRequestTypes?:
    | "ACCOUNT"
    | "CUSTOM"
    | "INCENTIVE"
    | "LIST"
    | "NONE"
    | "PREFERRED"
    | "RATED"
    | "RETAIL";
  edtRequestTypes?: "ALL" | "NONE";
  requestedPackageLineItems?: FedExConsolidationRequestedPackageLineItems;
  completedShipmentDetail?: FedExConsolidationCompletedShipmentDetail;
}

export interface FedExConsolidationCompletedShipmentDetail {
  usDomestic?: boolean;
  carrierCode?: "FDXC" | "FDXE" | "FDXG" | "FDXO" | "FXCC" | "FXFR" | "FXSP";
  masterTrackingId?: FedExConsolidationTrackingIds;
  serviceDescription?: FedExConsolidationServiceDescription;
  packageDescription?: FedExConsolidationPackageDescription;
  specialServiceDescription?: FedExConsolidationSpecialServiceDescription;
  operationalDetail?: FedExConsolidationShipmentOperationalDetail;
  consolidationDetail?: FedExConsolidationConsolidationDetailV2;
  exportComplianceStatement?: string;
  documentRequirements?: FedExConsolidationDocumentRequirements;
  completedPackageDetail?: FedExConsolidationCompletedPackageDetailV2;
}

export interface FedExConsolidationCompletedPackageDetailV2 {
  sequenceNumber?: number;
  trackingId?: FedExConsolidationTrackingIds;
  groupNumber?: number;
  operationalDetail?: FedExConsolidationOperationalDetail;
  label?: FedExConsolidationLabel;
  packageDocuments?: FedExConsolidationShippingDocument[];
  signatureOptions?:
    | "ADULT"
    | "DIRECT"
    | "INDIRECT"
    | "NO_SIGNATURE_REQUIRED"
    | "SERVICE_DEFAULT";
}

export interface FedExConsolidationOperationalDetail {
  operationalInstructions?: FedExConsolidationOperationalInstructions;
  barcodes?: FedExConsolidationPackageBarcodes;
}

export interface FedExConsolidationConsolidationDetailV2 {
  type?:
    | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
    | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
    | "INTERNATIONAL_GROUND_DISTRIBUTION"
    | "INTERNATIONAL_PRIORITY_DISTRIBUTION"
    | "TRANSBORDER_DISTRIBUTION";
  role?:
    | "CONSOLIDATION_DOCUMENTS_SHIPMENT"
    | "CRN_SHIPMENT"
    | "MASTER_AIRWAYBILL_SHIPMENT";
}

export interface FedExConsolidationDocumentRequirements {
  requiredDocuments?:
    | "AIR_WAYBILL"
    | "CERTIFICATE_OF_ORIGIN"
    | "COMMERCIAL_INVOICE"
    | "COMMERCIAL_OR_PRO_FORMA_INVOICE"
    | "COMMERCIAL_OR_PRO_FORMA_INVOICE_OR_USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
    | "PRO_FORMA_INVOICE";
  generationDetails?: FedExConsolidationGenerationDetails;
}

export interface FedExConsolidationGenerationDetails {
  type?:
    | "AIR_WAYBILL"
    | "CERTIFICATE_OF_ORIGIN"
    | "COMMERCIAL_INVOICE"
    | "PRO_FORMA_INVOICE"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN";
  minimumCopiesRequired?: number;
}

export interface FedExConsolidationSpecialServiceDescription {
  identifier?: FedExConsolidationIdentifier;
  names?: FedExConsolidationProductName;
}

export interface FedExConsolidationIdentifier {
  id?: string;
  type?: string;
  code?: string;
}

export interface FedExConsolidationConsolidationDetail {
  relationshipTimeStamp?: string;
  type?:
    | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
    | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
    | "INTERNATIONAL_GROUND_DISTRIBUTION"
    | "INTERNATIONAL_PRIORITY_DISTRIBUTION"
    | "TRANSBORDER_DISTRIBUTION";
  role?:
    | "CONSOLIDATION_DOCUMENTS_SHIPMENT"
    | "CRN_SHIPMENT"
    | "MASTER_AIRWAYBILL_SHIPMENT";
  internationalDistribtuionDetail?: FedExConsolidationInternationalDistribtuionDetail;
  transborderDistributionDetail?: FedExConsolidationTransborderDistributionDetail;
}

export interface FedExConsolidationInternationalDistribtuionDetail {
  summaryDetail?: FedExConsolidationSummaryDetail;
}

export interface FedExConsolidationSummaryDetail {
  totalWeight?: FedExConsolidationTotalWeight;
  totalPackageCount?: number;
  totalUniqueAddressCount?: number;
  totalCustomsValue?: FedExConsolidationTotalCustomsValue;
}

export interface FedExConsolidationTotalCustomsValue {
  currency?: string;
  amount?: string;
}

export interface FedExConsolidationTotalWeight {
  units?: "KG" | "LB";
  value?: string;
}

export interface FedExConsolidationLabelSpecification {
  labelFormatType?:
    | "COMMON2D"
    | "ERROR"
    | "LABEL_DATA_ONLY"
    | "MAILROOM"
    | "NO_LABEL"
    | "OPERATIONAL_LABEL"
    | "PRE_COMMON2D";
  labelStockType?:
    | "PAPER_4X6"
    | "PAPER_4X675"
    | "PAPER_4X8"
    | "PAPER_4X9"
    | "PAPER_7X475"
    | "PAPER_85X11_BOTTOM_HALF_LABEL"
    | "PAPER_85X11_TOP_HALF_LABEL"
    | "PAPER_LETTER"
    | "STOCK_4X675_LEADING_DOC_TAB"
    | "STOCK_4X8"
    | "STOCK_4X9_LEADING_DOC_TAB"
    | "STOCK_4X6"
    | "STOCK_4X675_TRAILING_DOC_TAB"
    | "STOCK_4X9_TRAILING_DOC_TAB"
    | "STOCK_4X675"
    | "STOCK_4X9"
    | "STOCK_4X8.5_TRAILING_DOC_TAB"
    | "STOCK_4X10.5_TRAILING_DOC_TAB";
  imageType?: "ZPLII" | "EPL2" | "PDF" | "PNG";
  labelPrintingOrientation?:
    "BOTTOM_EDGE_OF_TEXT_FIRST" | "TOP_EDGE_OF_TEXT_FIRST";
}

/** One value, or an array: the spec's samples send `["BYPASS_REGULATORY_VALIDATION"]`, its schema a single string. */
export type FedExConsolidationProcessingOptionValue =
  | "ALLOW_PREVIOUS_SHIP_DATE"
  | "BYPASS_REGULATORY_VALIDATION"
  | "CONVENIENCE_MULTIPLE_PACKAGES"
  | "CUSTOM_TRANSIT_TIME"
  | "FUTURE_DAY_SHIPMENT"
  | "IATA_CLASS_AND_AIRCRAFT_ONLY"
  | "MANUAL_AIRBILL"
  | "NO_COMMITMENT_DATE_REQUESTED"
  | "PACKAGE_LEVEL_COMMODITIES"
  | "PRE_EIG_PROCESSING"
  | "PRE_ETD_ENHANCEMENTS"
  | "PRE_FXF2020_HANDLING_UNIT_DETAILS"
  | "PRE_GPR"
  | "PRE_GRAPE2_SHIPMENT"
  | "PRE_MULTIPLIER_PROCESSING"
  | "REQUEST_LEGACY_GROUND_ECONOMY_LABEL"
  | "REQUEST_LEGACY_SMARTPOST_LABEL"
  | "REQUIRE_PRE_EPIC_BARCODE"
  | "REQUIRE_PRE_EPIC_BARCODEx";

export interface FedExConsolidationProcessingOptionsRequested {
  options?:
    | FedExConsolidationProcessingOptionValue
    | FedExConsolidationProcessingOptionValue[];
}

export interface FedExConsolidationRequestedPackageLineItems {
  sequenceNumber?: string;
  groupNumber?: string;
  groupPackageCount?: string;
  trackingId?: FedExConsolidationTrackingIdV2;
  weights?: FedExConsolidationWeight;
  dimensions?: FedExConsolidationDimensions;
  customerReferences?: FedExConsolidationCustomerReferences;
}

export interface FedExConsolidationCustomerReferences {
  customerReferenceType?:
    | "BILL_OF_LADING"
    | "CUSTOMER_REFERENCE"
    | "DEPARTMENT_NUMBER"
    | "ELECTRONIC_PRODUCT_CODE"
    | "INTRACOUNTRY_REGULATORY_REFERENCE"
    | "INVOICE_NUMBER"
    | "P_O_NUMBER"
    | "PACKING_SLIP_NUMBER"
    | "RMA_ASSOCIATION"
    | "SHIPMENT_INTEGRITY"
    | "STORE_NUMBER";
  value?: string;
}

export interface FedExConsolidationTrackingIdV2 {
  trackindIdType?:
    | "EXPRESS"
    | "FEDEX"
    | "FREIGHT"
    | "GROUND"
    | "INTERNAL"
    | "UNKNOWN"
    | "USPS";
  formId?: string;
  trackingNumber?: string;
}

export interface FedExConsolidationContactV2 {
  personName?: string;
  tollFreePhoneNumber?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  companyName?: string;
  pagerNumber?: string;
  faxNumber?: string;
  title?: string;
}

export interface FedExConsolidationContactAncillaryDetail {
  emailAddresses?: FedExConsolidationEMailDetail[];
}

export interface FedExConsolidationContactAndAddress {
  contact?: FedExConsolidationContactV3;
  contactAncillaryDetail?: FedExConsolidationContactAncillaryDetail;
  address?: FedExConsolidationAddressV2;
  addressAncillaryDetail?: FedExConsolidationAddressAncillaryDetail;
}

export interface FedExConsolidationContactAndAddressV2 {
  contact?: FedExConsolidationContactV4;
  contactAncillaryDetail?: FedExConsolidationContactAncillaryDetail;
  address?: FedExConsolidationAddressV3;
  addressAncillaryDetail?: FedExConsolidationAddressAncillaryDetail;
}

export interface FedExConsolidationContactV3 {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber?: string;
  faxNumber?: string;
  companyName?: string;
  stateTaxId?: string;
  fedralTaxId?: string;
}

export interface FedExConsolidationContactV4 {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
  stateTaxId?: string;
  fedralTaxId?: string;
}

export interface FedExConsolidationContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface FedExConsolidationCreateConsolidationCompletedShipmentDetail {
  completedPackageDetails?: FedExConsolidationCompletedPackageDetail[];
  operationalDetail?: FedExConsolidationShipmentOperationalDetail;
  carrierCode?: string;
  completedHoldAtLocationDetail?: FedExConsolidationCompletedHoldAtLocationDetail;
  completedEtdDetail?: FedExConsolidationCompletedEtdDetail;
  packagingDescription?: string;
  masterTrackingId?: FedExConsolidationTrackingId;
  serviceDescription?: FedExConsolidationServiceDescription;
  usDomestic?: boolean;
  hazardousShipmentDetail?: FedExConsolidationCompletedHazardousShipmentDetail;
  shipmentRating?: FedExConsolidationShipmentRating;
  documentRequirements?: FedExConsolidationDocumentRequirementsDetail;
  exportComplianceStatement?: string;
  accessDetail?: FedExConsolidationPendingShipmentAccessDetail;
  shipmentConsolidationDetail?: FedExConsolidationShipmentConsolidationDetail;
  completedCodDetail?: FedExConsolidationPackageCODDetail;
}

export interface FedExConsolidationCreateOutput {
  trackingIds?: FedExConsolidationTrackingIds[];
  consolidationKey?: FedExConsolidationConsolidationKey;
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationCreateShipmentOutput {
  transactionShipments?: FedExConsolidationTransactionCreateConsolidationShipmentResultsOutput[];
}

export interface FedExConsolidationCurrencyExchangeRate {
  rate?: number;
  fromCurrency?: string;
  intoCurrency?: string;
}

export interface FedExConsolidationCustomerReference {
  customerReferenceType?:
    | "BILL_OF_LADING"
    | "CUSTOMER_REFERENCE"
    | "DEPARTMENT_NUMBER"
    | "INVOICE_NUMBER"
    | "P_O_NUMBER"
    | "SHIPMENT_INTEGRITY"
    | "INTRACOUNTRY_REGULATORY_REFERENCE"
    | "STORE_NUMBER"
    | "RMA_ASSOCIATION"
    | "SHIPPER_ID1"
    | "SHIPPER_ID2";
  value?: string;
}

export type FedExConsolidationCustomerReferencesV2 =
  FedExConsolidationInnerV2[];

export interface FedExConsolidationInnerV2 {
  customerReferenceType?: FedExConsolidationCustomerReferenceType;
  value?: FedExConsolidationCarrierCode;
}

export interface FedExConsolidationCustomerSpecifiedLabelDetail {
  maskedData?: (
    | "CUSTOMS_VALUE"
    | "DIMENSIONS"
    | "DUTIES_AND_TAXES_PAYOR_ACCOUNT_NUMBER"
    | "FREIGHT_PAYOR_ACCOUNT_NUMBER"
    | "INSURED_VALUE"
    | "PACKAGE_SEQUENCE_AND_COUNT"
    | "SECONDARY_BARCODE"
    | "SHIPPER_ACCOUNT_NUMBER"
    | "SHIPPER_INFORMATION"
    | "SUPPLEMENTAL_LABEL_DOC_TAB"
    | "TERMS_AND_CONDITIONS"
    | "TOTAL_WEIGHT"
    | "TRANSPORTATION_CHARGES_PAYOR_ACCOUNT_NUMBER"
  )[];
  regulatoryLabels?: FedExConsolidationRegulatoryLabelContentDetail[];
  docTabContent?: FedExConsolidationDocTabContent;
}

export interface FedExConsolidationCustomsClearanceDetail {
  customsOption?: FedExConsolidationCustomsOptionDetail;
  importerOfRecord?: FedExConsolidationParty;
  recipientCustomsId?: FedExConsolidationRecipientCustomsId;
  dutiesPayment?: FedExConsolidationPayment1;
  documentContent?: "DOCUMENTS_ONLY" | "NON_DOCUMENTS" | "DERIVED";
  totalCustomsValue?: FedExConsolidationMoneyV2;
  regulatoryControls?: (
    | "FOOD_OR_PERISHABLE"
    | "USMCA"
    | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
    | "NOT_IN_FREE_CIRCULATION"
  )[];
  insuranceCharges?: FedExConsolidationMoneyV2;
  declarationStatementDetail?: FedExConsolidationConsolidationCustomsDeclarationStatementDetail;
  commercialInvoice?: FedExConsolidationCommercialInvoice;
  exportDetail?: FedExConsolidationExportDetail;
  commodities?: FedExConsolidationCommodity[];
  brokers?: FedExConsolidationBrokerDetail[];
  clearanceBrokerage?:
    | "BROKER_INCLUSIVE"
    | "BROKER_INCLUSIVE_NON_RESIDENT_IMPORTER"
    | "BROKER_SELECT"
    | "BROKER_SELECT_NON_RESIDENT_IMPORTER"
    | "BROKER_UNASSIGNED";
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
}

export interface FedExConsolidationCustomsClearanceDetailV2 {
  customsOption?: FedExConsolidationCustomsOptionDetail;
  importerOfRecord?: FedExConsolidationImporterOfRecord;
  recipientCustomsId?: FedExConsolidationRecipientCustomsId;
  dutiesPayment?: FedExConsolidationPayment;
  documentContent?: "DOCUMENTS_ONLY" | "NON_DOCUMENTS" | "DERIVED";
  totalCustomsValue?: FedExConsolidationMoneyV2;
  regulatoryControls?: (
    | "FOOD_OR_PERISHABLE"
    | "USMCA"
    | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
    | "NOT_IN_FREE_CIRCULATION"
  )[];
  insuranceCharges?: FedExConsolidationMoneyV2;
  declarationStatementDetail?: FedExConsolidationConsolidationCustomsDeclarationStatementDetail;
  commercialInvoice?: FedExConsolidationCommercialInvoiceV2;
  exportDetail?: FedExConsolidationExportDetailV2;
  commodities?: FedExConsolidationCommodityV2[];
  brokers?: FedExConsolidationBrokerDetailV2[];
  clearanceBrokerage?:
    | "BROKER_INCLUSIVE"
    | "BROKER_INCLUSIVE_NON_RESIDENT_IMPORTER"
    | "BROKER_SELECT"
    | "BROKER_SELECT_NON_RESIDENT_IMPORTER"
    | "BROKER_UNASSIGNED";
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
}

export interface FedExConsolidationCommercialInvoiceV2 {
  termsOfSale?: string;
  comments?: string[];
  shipmentPurpose?:
    | "GIFT"
    | "NOT_SOLD"
    | "PERSONAL_EFFECTS"
    | "REPAIR_AND_RETURN"
    | "SAMPLE"
    | "SOLD";
  freightCharge?: FedExConsolidationMoneyV2;
  taxesOrMiscellaneousCharge?: FedExConsolidationMoneyV2;
  taxesOrMiscellaneousChargeType?:
    | "COMMISSIONS"
    | "DISCOUNTS"
    | "HANDLING_FEES"
    | "OTHER"
    | "ROYALTIES_AND_LICENSE_FEES"
    | "TAXES";
  packingCosts?: FedExConsolidationMoneyV2;
  handlingCosts?: FedExConsolidationMoneyV2;
  specialInstructions?: string;
  declarationStatement?: string;
  paymentTerms?: string;
  purposeOfShipmentDescription?: string;
  customerReferences?: FedExConsolidationCustomerReferencesV2;
  originatorName?: string;
}

export interface FedExConsolidationCommercialInvoice {
  termsOfSale?: string;
  comments?: string[];
  shipmentPurpose?:
    | "GIFT"
    | "NOT_SOLD"
    | "PERSONAL_EFFECTS"
    | "REPAIR_AND_RETURN"
    | "SAMPLE"
    | "SOLD";
  freightCharge?: FedExConsolidationMoneyV2;
  taxesOrMiscellaneousCharge?: FedExConsolidationMoneyV2;
  taxesOrMiscellaneousChargeType?:
    | "COMMISSIONS"
    | "DISCOUNTS"
    | "HANDLING_FEES"
    | "OTHER"
    | "ROYALTIES_AND_LICENSE_FEES"
    | "TAXES";
  packingCosts?: FedExConsolidationMoneyV2;
  handlingCosts?: FedExConsolidationMoneyV2;
  specialInstructions?: string;
  declarationStatement?: string;
  paymentTerms?: string;
  purposeOfShipmentDescription?:
    | "GIFT"
    | "NOT_SOLD"
    | "PERSONAL_EFFECTS"
    | "REPAIR_AND_RETURN"
    | "SAMPLE"
    | "SOLD";
  customerReferences?: FedExConsolidationInnerV2;
  originatorName?: string;
}

export interface FedExConsolidationCustomsOptionDetail {
  description?: string;
  type?:
    | "COURTESY_RETURN_LABEL"
    | "EXHIBITION_TRADE_SHOW"
    | "FAULTY_ITEM"
    | "FOLLOWING_REPAIR"
    | "FOR_REPAIR"
    | "ITEM_FOR_LOAN"
    | "OTHER"
    | "REJECTED"
    | "REPLACEMENT"
    | "TRIAL";
}

export interface FedExConsolidationDangerousGoodsDetail {
  /** This is an optional element and used to identify an uploaded dangerous goods handling unit.This element is required only if you have already validated DG data using a FedEx DG Ready solution. */
  trackingNumber?: string;
  accessibility?: "ACCESSIBLE" | "INACCESSIBLE";
  cargoAircraftOnly?: boolean;
}

export interface FedExConsolidationDeleteShipmentsOutput {
  cancelledShipment?: boolean;
  message?: string;
  alerts?: FedExConsolidationAlert[];
}

export interface FedExConsolidationDestinationControlDetail {
  /** Specify End User name. Its is required if StatementTypes is entered as DEPARTMENT_OF_STATE. */
  endUser?: string;
  statementTypes: "DEPARTMENT_OF_COMMERCE" | "DEPARTMENT_OF_STATE";
  destinationCountries?: string[];
}

export interface FedExConsolidationDestinationControlDetailV2 {
  /** Specify End User name. Its is required if StatementTypes is entered as DEPARTMENT_OF_STATE. */
  endUser?: string;
  statementTypes:
    | "DEPARTMENT_OF_COMMERCE"
    | "DEPARTMENT_OF_STATE"
    | "DEPARTMENT_OF_COMMERCE_AND_DEPARTMENT_OF_STATE";
  destinationCountries?: string[];
}

export interface FedExConsolidationDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExConsolidationDistributionLocations {
  type?:
    | "CUSTOMER_SPECIFIED"
    | "FEDEX_EXPRESS_FREIGHT_RAMP"
    | "FEDEX_EXPRESS_STATION"
    | "FEDEX_GROUND_TERMINAL";
  locationNumber?: number;
  id?: string;
  locationId?: string;
  locationContactAndAddress?: FedExConsolidationContactAndAddress;
  clearanceNumber?: string;
  inclusionSpecifications?: string[];
}

export interface FedExConsolidationDistributionLocationsV2 {
  type?:
    | "CUSTOMER_SPECIFIED"
    | "FEDEX_EXPRESS_FREIGHT_RAMP"
    | "FEDEX_EXPRESS_STATION"
    | "FEDEX_GROUND_TERMINAL";
  locationNumber?: number;
  id?: string;
  locationId?: string;
  locationContactAndAddress?: FedExConsolidationContactAndAddressV2;
  clearanceNumber?: string;
  inclusionSpecifications?: string[];
}

export interface FedExConsolidationDocTabContent {
  docTabContentType?:
    "BARCODED" | "CUSTOM" | "MINIMUM" | "STANDARD" | "ZONE001";
  zone001?: FedExConsolidationDocTabContentZone001;
  barcoded?: FedExConsolidationDocTabContentBarcoded;
}

export interface FedExConsolidationDocTabContentBarcoded {
  symbology?:
    | "CODABAR"
    | "CODE128"
    | "CODE128_WIDEBAR"
    | "CODE128B"
    | "CODE128C"
    | "CODE39"
    | "CODE93"
    | "I2OF5"
    | "MANUAL"
    | "PDF417"
    | "POSTNET"
    | "QR_CODE"
    | "UCC128";
  specification?: FedExConsolidationDocTabZoneSpecification;
}

export interface FedExConsolidationDocTabContentZone001 {
  docTabZoneSpecifications?: FedExConsolidationDocTabZoneSpecification[];
}

export interface FedExConsolidationDocTabZoneSpecification {
  zoneNumber?: number;
  header?: string;
  dataField?: string;
  literalValue?: string;
  justification?: "LEFT" | "RIGHT";
}

export interface FedExConsolidationDocumentGenerationDetail {
  letterhead?: string;
  electronicSignature?: string;
  minimumCopiesRequired?: number;
  type?: string;
}

export interface FedExConsolidationDocumentRequirementsDetail {
  requiredDocuments?: string[];
  prohibitedDocuments?: string[];
  generationDetails?: FedExConsolidationDocumentGenerationDetail[];
}

export interface FedExConsolidationEMailDetail {
  emailNotificationFormatType?: "SMS_TEXT_MESSAGE" | "TEXT" | "HTML";
  address?: string;
  permissions?: Record<string, "GRANT" | "DENY">;
}

export interface FedExConsolidationEdtCommodityTax {
  harmonizedCode?: string;
  taxes?: FedExConsolidationEdtTaxDetail;
  total?: FedExConsolidationMoney;
}

export interface FedExConsolidationEdtTaxDetail {
  taxType?:
    | "ADDITIONAL_TAXES"
    | "CONSULAR_INVOICE_FEE"
    | "CUSTOMS_SURCHARGES"
    | "DUTY"
    | "EXCISE_TAX"
    | "FOREIGN_EXCHANGE_TAX"
    | "GENERAL_SALES_TAX"
    | "IMPORT_LICENSE_FEE"
    | "INTERNAL_ADDITIONAL_TAXES"
    | "INTERNAL_SENSITIVE_PRODUCTS_TAX"
    | "OTHER"
    | "SENSITIVE_PRODUCTS_TAX"
    | "STAMP_TAX"
    | "STATISTICAL_TAX"
    | "TRANSPORT_FACILITIES_TAX";
  taxcode?: string;
  /** Estimated duties and taxes effective date. Format [YYYY-MM-DD]. */
  effectiveDate?: string;
  name?: string;
  taxableValue?: FedExConsolidationMoney;
  description?: string;
  formula?: string;
  amount?: FedExConsolidationMoney;
  taxRates?: {
    value?: string;
    currency?: string;
    quantity?: number;
    unitOfMeasure?: string;
  }[];
  appliedPreferentialTradeAgreement?: {
    id?: string;
    name?: string;
    description?: string;
  };
}

export interface FedExConsolidationEmailNotificationDetail {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExConsolidationEmailNotificationRecipient[];
  personalMessage?: string;
}

export interface FedExConsolidationEmailNotificationRecipient {
  name?: string;
  emailNotificationRecipientType:
    "BROKER" | "OTHER" | "RECIPIENT" | "SHIPPER" | "THIRD_PARTY";
  emailAddress?: string;
  notificationFormatType?: "HTML" | "TEXT";
  notificationType?: "EMAIL";
  locale?: string;
  notificationEventType?: (
    | "ON_DELIVERY"
    | "ON_EXCEPTION"
    | "ON_SHIPMENT"
    | "ON_TENDER"
    | "ON_ESTIMATED_DELIVERY"
    | "ON_BILL_OF_LADING"
    | "ON_PICKUP_DRIVER_ARRIVED"
    | "ON_PICKUP_DRIVER_ASSIGNED"
    | "ON_PICKUP_DRIVER_DEPARTED"
    | "ON_PICKUP_DRIVER_EN_ROUTE"
  )[];
}

export interface FedExConsolidationExportDetail {
  destinationControlDetail?: FedExConsolidationDestinationControlDetail;
  /** Specify the filing option being exercised. Required for non-document shipments originating in Canada destinated for any country other than Canada, the United States, Puerto Rico, or the U.S. Virgin Islands. */
  b13AFilingOption:
    | "NOT_REQUIRED"
    | "MANUALLY_ATTACHED"
    | "FILED_ELECTRONICALLY"
    | "SUMMARY_REPORTING"
    | "FEDEX_TO_STAMP";
  exportComplianceStatement?: string;
  permitNumber?: string;
}

export interface FedExConsolidationExportDetailV2 {
  destinationControlDetail?: FedExConsolidationDestinationControlDetailV2;
  /** Specify the filing option being exercised. Required for non-document shipments originating in Canada destinated for any country other than Canada, the United States, Puerto Rico, or the U.S. Virgin Islands. */
  b13AFilingOption:
    | "NOT_REQUIRED"
    | "MANUALLY_ATTACHED"
    | "FILED_ELECTRONICALLY"
    | "SUMMARY_REPORTING"
    | "FEDEX_TO_STAMP";
  exportComplianceStatement?: string;
  permitNumber: string;
}

export interface FedExConsolidationFormats {
  docType?: "PDF" | "PNG";
  stockType?: "PAPER_LETTER";
}

export interface FedExConsolidationFormatsV2 {
  docType?:
    | "ZPLII"
    | "EPL2"
    | "PDF"
    | "PNG"
    | "DIB"
    | "DOC"
    | "DPL"
    | "GIF"
    | "RTF"
    | "TEXT";
  stockType?:
    | "OP_900_LG"
    | "OP_900_LG_B"
    | "OP_900_LL"
    | "OP_900_LL_B"
    | "OP_950_PAPER_4_PER_PAGE_PORTRAIT"
    | "PAPER_4X6"
    | "PAPER_LETTER"
    | "STOCK_4X6"
    | "STOCK_4X675_LEADING_DOC_TAB"
    | "STOCK_4X675_TRAILING_DOC_TAB"
    | "STOCK_4X8"
    | "STOCK_4X9_LEADING_DOC_TAB"
    | "STOCK_4X9_TRAILING_DOC_TAB";
}

export interface FedExConsolidationDeleteShipmentsRequest {
  accountNumber: FedExConsolidationPartyAccountNumber;
  deletionControl?: "DELETE_ALL_PACKAGES" | "DELETE_ONE_PACKAGE";
  trackingNumber: string;
  resourceKey?: string;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationConfirmRequest {
  edtRequestType?: "ALL" | "NONE";
  rateRequestType?:
    | "ACCOUNT"
    | "CUSTOM"
    | "INCENTIVE"
    | "LIST"
    | "NONE"
    | "PREFERRED"
    | "RATED"
    | "RETAIL";
  labelSpecification: FedExConsolidationLabelSpecificationV2;
  consolidationKey: FedExConsolidationConsolidationKey;
  processingOptionType: "ALLOW_ASYNCHRONOUS";
  accountNumber: FedExConsolidationPartyAccountNumber;
  consolidationDocumentSpecification?: FedExConsolidationConsolidationDocumentSpec;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationConfirmResultsRequest {
  accountNumber: FedExConsolidationPartyAccountNumber;
  jobId: string;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationCreateRequest {
  consolidationIndex?: string;
  requestedConsolidation: FedExConsolidationRequestedConsolidation;
  accountNumber: FedExConsolidationPartyAccountNumber;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationCreateShipmentRequest {
  accountNumber: FedExConsolidationPartyAccountNumber;
  consolidationKey: FedExConsolidationConsolidationKey;
  processingOptionType?: "ALLOW_ASYNCHRONOUS";
  index?: string;
  shipAction?: "CONFIRM" | "TRANSFER";
  requestedShipment: FedExConsolidationRequestedConsolidationShipment;
  processingOptions?: "INCLUDE_PICKUPRATES"[];
  labelResponseOptions?: FedExConsolidationLableResponseOptions;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationModifyRequest {
  consolidationKey: FedExConsolidationConsolidationKey;
  requestedConsolidation: FedExConsolidationRequestedConsolidation;
  accountNumber: FedExConsolidationPartyAccountNumber;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationRetrieveRequest {
  accountNumber: FedExConsolidationPartyAccountNumber;
  consolidationKey: FedExConsolidationConsolidationKey;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationDeleteRequest {
  accountNumber: FedExConsolidationPartyAccountNumber;
  consolidationKey: FedExConsolidationConsolidationKey;
  trackingId: FedExConsolidationTrackingIds;
  version?: FedExConsolidationVersion;
}

export interface FedExConsolidationHazardousCommodityContent001 {
  quantity?: FedExConsolidationHazardousCommodityQuantityDetail;
  innerReceptacles?: FedExConsolidationHazardousCommodityInnerReceptacleDetail01[];
  options?: FedExConsolidationHazardousCommodityOptionDetail01;
  description?: FedExConsolidationHazardousCommodityDescription01;
}

export interface FedExConsolidationHazardousCommodityDescription01 {
  sequenceNumber?: number;
  processingOptions?: "INCLUDE_SPECIAL_PROVISIONS"[];
  subsidiaryClasses?: string[];
  labelText?: string;
  technicalName?: string;
  packingDetails?: FedExConsolidationHazardousCommodityPackingDetail01;
  authorization?: string;
  reportableQuantity: boolean;
  percentage?: number;
  id?: string;
  packingGroup: "DEFAULT" | "I" | "II" | "III";
  properShippingName?: string;
  hazardClass?: string;
}

export interface FedExConsolidationHazardousCommodityInnerReceptacleDetail01 {
  quantity?: FedExConsolidationHazardousCommodityQuantityDetail;
}

export interface FedExConsolidationHazardousCommodityOptionDetail01 {
  labelTextOption?: "APPEND" | "OVERRIDE" | "STANDARD";
  customerSuppliedLabelText?: string;
}

export interface FedExConsolidationHazardousCommodityPackingDetail01 {
  packingInstructions?: string;
  cargoAircraftOnly: boolean;
}

export interface FedExConsolidationHazardousCommodityQuantityDetail {
  quantityType: "GROSS" | "NET";
  amount: number;
  units?: string;
}

export interface FedExConsolidationHoldAtLocationDetail {
  locationId: string;
}

export interface FedExConsolidationImporterOfRecord {
  address: FedExConsolidationPartyAddressV2;
  contact: FedExConsolidationPartyContact;
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationInternationalControlledExportDetail {
  type?:
    | "DEA_036"
    | "DEA_236"
    | "DEA_486"
    | "DSP_05"
    | "DSP_61"
    | "DSP_73"
    | "DSP_85"
    | "DSP_94"
    | "DSP_LICENSE_AGREEMENT"
    | "FROM_FOREIGN_TRADE_ZONE"
    | "WAREHOUSE_WITHDRAWAL";
  foreignTradeZoneCode?: string;
  entryNumber?: string;
  licenseOrPermitNumber?: string;
  /** Indicates the State Department License or DEA Permit expiration date. Format: YYYY-MM-DD */
  licenseOrPermitExpirationDate?: string;
}

export interface FedExConsolidationInternationalDistributionDetail {
  dropOffType?:
    | "BUSINESS_SERVICE_CENTER"
    | "DROP_BOX"
    | "REGULAR_PICKUP"
    | "REQUEST_PICKUP"
    | "STATION";
  totalDimensions: FedExConsolidationDimensions;
  totalInsuredValue?: FedExConsolidationMoneyV2;
  unitSystem?: "ENGLISH" | "METRIC";
  declarationCurrencies: FedExConsolidationMoney[];
  /** Required by the schema; the sync IDF sample omits it. */
  clearanceFacilityLocationId?: string;
}

export interface FedExConsolidationLabel {
  type?:
    | "AUXILIARY_LABEL"
    | "CERTIFICATE_OF_ORIGIN"
    | "COD_AND_DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_2_D_BARCODE"
    | "COD_AND_DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_LABEL"
    | "COD_RETURN_2_D_BARCODE"
    | "COD_RETURN_LABEL"
    | "COMMERCIAL_INVOICE"
    | "CUSTOM_PACKAGE_DOCUMENT"
    | "CUSTOM_SHIPMENT_DOCUMENT"
    | "DANGEROUS_GOODS_SHIPPERS_DECLARATION"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_2_D_BARCODE"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_LABEL"
    | "ETD_LABEL"
    | "EXPORT_DECLARATION"
    | "FEDEX_FREIGHT_STRAIGHT_BILL_OF_LADING"
    | "FREIGHT_ADDRESS_LABEL"
    | "GENERAL_AGENCY_AGREEMENT"
    | "GROUND_BARCODE"
    | "OP_900"
    | "OUTBOUND_2_D_BARCODE"
    | "OUTBOUND_LABEL"
    | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
    | "PRO_FORMA_INVOICE"
    | "RECIPIENT_ADDRESS_BARCODE"
    | "RECIPIENT_POSTAL_BARCODE"
    | "RETURN_INSTRUCTIONS"
    | "TERMS_AND_CONDITIONS"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
    | "USPS_BARCODE"
    | "VICS_BILL_OF_LADING";
  /** Use this object to provide all data required for additional (non-label) shipping documents to be produced. */
  shippingDocumentDisposition?:
    | "CONFIRMED"
    | "DEFERRED_QUEUED"
    | "DEFERRED_RETURNED"
    | "DEFERRED_STORED"
    | "EMAILED"
    | "QUEUED"
    | "RETURNED"
    | "STORED";
  imageType?:
    | "DIB"
    | "DOC"
    | "DPL"
    | "EPL2"
    | "GIF"
    | "PDF"
    | "PNG"
    | "RTF"
    | "TEXT"
    | "ZPLII";
  resolution?: number;
  copiesToPrint?: number;
  parts?: FedExConsolidationParts;
}

export interface FedExConsolidationLabelResponse {
  copiesToPrint?: number;
  contentType?:
    | "LABEL"
    | "BILL_OF_LADING"
    | "GAA_FORM"
    | "HAZMAT_LABEL"
    | "END_OF_DAY_HAZMAT_REPORT"
    | "MANIFEST_REPORT"
    | "MULTIWEIGHT_REPORT"
    | "MERGED_LABEL_DOCUMENTS"
    | "AUXILIARY"
    | "RETURN_INSTRUCTIONS"
    | "ACCEPTANCE_LABEL"
    | "COMMERCIAL_INVOICE"
    | "PROFORMA_INVOICE"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "CERTIFICATE_OF_ORIGIN"
    | "MERGED_LABELS_ONLY";
  trackingNumber?: string;
  docType?: string;
  encodedLabel?: string;
  url?: string;
}

export interface FedExConsolidationLabelSpecificationV2 {
  labelFormatType?:
    | "COMMON2D"
    | "ERROR"
    | "LABEL_DATA_ONLY"
    | "MAILROOM"
    | "NO_LABEL"
    | "OPERATIONAL_LABEL"
    | "PRE_COMMON2D";
  labelStockType?:
    | "PAPER_4X6"
    | "PAPER_4X675"
    | "PAPER_4X8"
    | "PAPER_4X9"
    | "PAPER_7X475"
    | "PAPER_85X11_BOTTOM_HALF_LABEL"
    | "PAPER_85X11_TOP_HALF_LABEL"
    | "PAPER_LETTER"
    | "STOCK_4X675_LEADING_DOC_TAB"
    | "STOCK_4X8"
    | "STOCK_4X9_LEADING_DOC_TAB"
    | "STOCK_4X6"
    | "STOCK_4X675_TRAILING_DOC_TAB"
    | "STOCK_4X9_TRAILING_DOC_TAB"
    | "STOCK_4X675"
    | "STOCK_4X9"
    | "STOCK_4X8.5_TRAILING_DOC_TAB"
    | "STOCK_4X10.5_TRAILING_DOC_TAB";
  imageType?: "ZPLII" | "EPL2" | "PDF" | "PNG";
  processingOptionsRequested?: FedExConsolidationProcessingOptionsRequestedV2;
  dispositions?: FedExConsolidationShippingDocumentDispositionDetail[];
  labelPrintingOrientation?:
    "BOTTOM_EDGE_OF_TEXT_FIRST" | "TOP_EDGE_OF_TEXT_FIRST";
  labelRotation?: "LEFT" | "RIGHT" | "UPSIDE_DOWN" | "NONE";
  labelOrder?: "SHIPPING_LABEL_FIRST" | "SHIPPING_LABEL_LAST";
  /** Required by the schema; several of the spec's own samples omit it. */
  printedLabelOrigin?: FedExConsolidationContactAndAddress;
  /** Not in the schema; the sync IDF sample sends `"PDF"`. */
  printerType?: string;
  /** Not in the schema; the sync IDF sample sends `"LETTER"`. */
  paperType?: string;
  customerSpecifiedDetail?: FedExConsolidationCustomerSpecifiedLabelDetail;
  resolution?: number;
}

export interface FedExConsolidationLabelSpecificationV3 {
  labelFormatType?:
    | "COMMON2D"
    | "ERROR"
    | "LABEL_DATA_ONLY"
    | "MAILROOM"
    | "NO_LABEL"
    | "OPERATIONAL_LABEL"
    | "PRE_COMMON2D";
  labelStockType?:
    | "PAPER_4X6"
    | "PAPER_4X675"
    | "PAPER_4X8"
    | "PAPER_4X9"
    | "PAPER_7X475"
    | "PAPER_85X11_BOTTOM_HALF_LABEL"
    | "PAPER_85X11_TOP_HALF_LABEL"
    | "PAPER_LETTER"
    | "STOCK_4X675_LEADING_DOC_TAB"
    | "STOCK_4X8"
    | "STOCK_4X9_LEADING_DOC_TAB"
    | "STOCK_4X6"
    | "STOCK_4X675_TRAILING_DOC_TAB"
    | "STOCK_4X9_TRAILING_DOC_TAB"
    | "STOCK_4X675"
    | "STOCK_4X9"
    | "STOCK_4X8.5_TRAILING_DOC_TAB"
    | "STOCK_4X10.5_TRAILING_DOC_TAB";
  imageType?:
    | "ZPLII"
    | "EPL2"
    | "PDF"
    | "PNG"
    | "DIB"
    | "DOC"
    | "DPL"
    | "GIF"
    | "RTF"
    | "TEXT";
  processingOptionsRequested?: FedExConsolidationProcessingOptionsRequestedV2;
  dispositions?: FedExConsolidationShippingDocumentDispositionDetail[];
  resolution?: number;
  labelPrintingOrientation?:
    "BOTTOM_EDGE_OF_TEXT_FIRST" | "TOP_EDGE_OF_TEXT_FIRST";
  labelRotation?: "LEFT" | "RIGHT" | "UPSIDE_DOWN" | "NONE";
  labelOrder?: "SHIPPING_LABEL_FIRST" | "SHIPPING_LABEL_LAST";
  /** Required by the schema; the spec's create-consolidation samples omit it. */
  printedLabelOrigin?: FedExConsolidationContactAndAddressV2;
  customerSpecifiedDetail?: FedExConsolidationCustomerSpecifiedLabelDetail;
}

export interface FedExConsolidationProcessingOptionsRequestedV2 {
  options?: "INCLUDE_DOC_TAB_ON_ALL_LABELS" | "PRE_EACI_LABEL";
}

export interface FedExConsolidationParts {
  documentPartSequenceNumber?: number;
  image?: Record<string, never>;
}

export type FedExConsolidationLableResponseOptions = "URL_ONLY" | "LABEL";

export interface FedExConsolidationLicenseOrPermitDetail {
  number?: string;
  /** Specifies Effective Date. Format [YYYY-MM-DD] */
  effectiveDate?: string;
  /** Specifies Expiration Date. Format [YYYY-MM-DD] */
  expirationDate?: string;
}

export interface FedExConsolidationLocale {
  country?: string;
  language?: string;
}

export interface FedExConsolidationMessage {
  code?: string;
  text?: string;
  parameters?: FedExConsolidationMessageParameter[];
  localizedText?: string;
}

export interface FedExConsolidationMessageParameter {
  id?: string;
  value?: string;
}

export interface FedExConsolidationModifyOutput {
  modifyConsolidation?: FedExConsolidationRetrievedConsolidation;
}

export interface FedExConsolidationMoneyV2 {
  amount?: number;
  currency: string;
}

export interface FedExConsolidationMoney {
  currency?: string;
  value: "CUSTOMS_VALUE" | "INSURED_VALUE";
}

export interface FedExConsolidationNetExplosiveDetail {
  amount?: number;
  units?: string;
  type?: string;
}

export interface FedExConsolidationOperationalInstructions {
  number?: number;
  content?: string;
}

export interface FedExConsolidationOrigin {
  address?: FedExConsolidationPartyAddressV2;
  contact?: FedExConsolidationPartyContact;
}

export interface FedExConsolidationPackageBarcodes {
  binaryBarcodes?: FedExConsolidationBinaryBarcode[];
  stringBarcodes?: FedExConsolidationStringBarcode[];
}

export interface FedExConsolidationPackageCODDetail {
  codCollectionAmount?: FedExConsolidationMoneyV2;
}

export interface FedExConsolidationPackageDescription {
  packagingType?: string;
  code?: string;
  names?: FedExConsolidationProductName[];
  astraDescription?: string;
  description?: string;
}

export interface FedExConsolidationPackageOperationalDetail {
  astraHandlingText?: string;
  barcodes?: FedExConsolidationPackageBarcodes;
  operationalInstructions?: FedExConsolidationOperationalInstructions[];
}

export interface FedExConsolidationPackageRateDetail {
  ratedWeightMethod?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  minimumChargeType?: string;
  baseCharge?: number;
  totalRebates?: number;
  rateType?: string;
  billingWeight?: FedExConsolidationWeight;
  netFreight?: number;
  surcharges?: FedExConsolidationSurcharge[];
  totalSurcharges?: number;
  netFedExCharge?: number;
  netCharge?: number;
  currency?: string;
}

export interface FedExConsolidationPackageRating {
  effectiveNetDiscount?: number;
  actualRateType?: string;
  packageRateDetails?: FedExConsolidationPackageRateDetail[];
}

export interface FedExConsolidationPackageSpecialServicesRequested {
  specialServiceTypes?: string[];
  priorityAlertDetail?: FedExConsolidationPriorityAlertDetail;
  signatureOptionType?:
    | "SERVICE_DEFAULT"
    | "NO_SIGNATURE_REQUIRED"
    | "INDIRECT"
    | "DIRECT"
    | "ADULT";
  signatureOptionDetail?: FedExConsolidationSignatureOptionDetail;
  alcoholDetail?: FedExConsolidationAlcoholDetail;
  dangerousGoodsDetail?: FedExConsolidationDangerousGoodsDetail;
  packageCODDetail?: FedExConsolidationPackageCODDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExConsolidationBatteryDetail[];
  dryIceWeight?: FedExConsolidationWeight;
}

export interface FedExConsolidationPartyV2 {
  address?: FedExConsolidationAddressV2;
  contact?: FedExConsolidationContactV3;
  accountNumber: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationParty1 {
  address?: FedExConsolidationAddressV3;
  contact?: FedExConsolidationContactV3;
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationPartyAccountNumber {
  /** Conditional. The account number value. Value is required if the paymentType is RECIPIENT, THIRD_PARTY or COLLECT. */
  value?: string;
}

export interface FedExConsolidationPartyAddress {
  /** Combination of number, street name, etc. At least one line is required for a valid physical address. Empty lines should not be included. Max Length is 35. */
  streetLines: string[];
  city: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExConsolidationPartyAddressV2 {
  streetLines: string[];
  city: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  /** Not in the schema; every shipper and importer address in the spec's samples sends it. */
  residential?: boolean;
}

export interface FedExConsolidationSoldTo {
  /** Combination of number, street name, etc. At least one line is required for a valid physical address. Empty lines should not be included. Max Length is 35. */
  streetLines: string[];
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExConsolidationSoldToV2 {
  streetLines: string[];
  /** This is a placeholder for City Name. Note: This is conditional and not required in all the requests. Note: It is recommended for Express shipments for the most accurate ODA and OPA surcharges. */
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExConsolidationPartyContact {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber: string;
  companyName?: string;
}

export interface FedExConsolidationSoldToV3 {
  personName: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber: string;
  companyName: string;
}

export interface FedExConsolidationSoldToV4 {
  personName: string;
  emailAddress?: string;
  phoneNumber: string;
  companyName: string;
}

export interface FedExConsolidationParty {
  address?: FedExConsolidationPartyAddress;
  contact?: FedExConsolidationPartyContact;
  accountNumber?: FedExConsolidationPartyAccountNumber;
  tins?: FedExConsolidationTaxpayerIdentification[];
  deliveryInstructions?: string;
}

export interface FedExConsolidationPartyV3 {
  address?: FedExConsolidationPartyAddressV2;
  contact?: FedExConsolidationPartyContact;
  accountNumber?: FedExConsolidationPartyAccountNumber;
  tins?: FedExConsolidationTaxpayerIdentificationV2[];
}

export interface FedExConsolidationPartyV4 {
  address: FedExConsolidationAddressV3;
  contact?: FedExConsolidationContactV4;
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationPaymentV2 {
  payor?: FedExConsolidationPayor;
  /** Specify the payment Type. Note: This is required for Express, Ground and SmartPost shipments. The payment type COLLECT is applicable only for Ground shipments. */
  paymentType?: "SENDER" | "RECIPIENT" | "THIRD_PARTY";
}

export interface FedExConsolidationPayment1 {
  payor?: FedExConsolidationPayor1;
  /** Specify the payment Type. Note: This is required for Express, Ground and SmartPost shipments. The payment type COLLECT is applicable only for Ground shipments. */
  paymentType?: "SENDER" | "THIRD_PARTY";
  /** Not in the schema; the async IED sample sends `{ accountNumber }`. */
  billingDetails?: { accountNumber?: string };
}

export interface FedExConsolidationPayment {
  payor?: FedExConsolidationPayorV2;
  /** Specify the payment Type. Note: This is required for Express, Ground and SmartPost shipments. The payment type COLLECT is applicable only for Ground shipments. */
  paymentType?:
    | "SENDER"
    | "RECIPIENT"
    | "THIRD_PARTY"
    | "BILL_ANONYMOUSLY"
    | "COLLECT"
    | "CASH"
    | "ACCOUNT"
    | "CONSIGNEE";
}

export interface FedExConsolidationPayor {
  responsibleParty: FedExConsolidationPartyV2;
}

export interface FedExConsolidationPayor1 {
  responsibleParty?: FedExConsolidationParty1;
}

export interface FedExConsolidationPayorV2 {
  responsibleParty?: FedExConsolidationPartyV4;
}

export interface FedExConsolidationPendingShipmentAccessDetail {
  accessorDetails?: FedExConsolidationPendingShipmentAccessorDetail[];
}

export interface FedExConsolidationPendingShipmentAccessorDetail {
  password?: string;
  role?: string;
  emailLabelUrl?: string;
  userId?: string;
}

export interface FedExConsolidationPickupDetail {
  /** Pickup ready date in YYYY-MM-DD format */
  readyDateTime?: string;
  /** Latest pickup date in YYYY-MM-DD format */
  latestPickupDateTime?: string;
  courierInstructions?: string;
  requestType?: FedExConsolidationPickupRequestType;
  requestSource?: FedExConsolidationPickupRequestSourceType;
}

export type FedExConsolidationPickupRequestSourceType =
  "AUTOMATION" | "CUSTOMER_SERVICE";

export type FedExConsolidationPickupRequestType = "FUTURE_DAY" | "SAME_DAY";

export interface FedExConsolidationPieceResponse {
  packageDocuments?: FedExConsolidationPieceResponses[];
}

export interface FedExConsolidationPieceResponses {
  masterTrackingNumber?: string;
  trackingNumber?: string;
  additionalChargesDiscount?: number;
  netRateAmount?: number;
  netChargeAmount?: number;
  netDiscountAmount?: number;
  packageDocuments?: FedExConsolidationLabelResponse[];
  customerReferences?: FedExConsolidationCustomerReference[];
  codcollectionAmount?: number;
  baseRateAmount?: number;
}

export interface FedExConsolidationPriorityAlertDetail {
  enhancementTypes?: string[];
  content?: string[];
}

export interface FedExConsolidationProductName {
  type?: string;
  encoding?: string;
  value?: string;
}

export interface FedExConsolidationRateDiscount {
  amount?: number;
  rateDiscountType?: string;
  percent?: number;
  description?: string;
}

export interface FedExConsolidationRateDiscountV2 {
  rateDiscountType?:
    "BONUS" | "COUPON" | "EARNED" | "INCENTIVE" | "OTHER" | "VOLUME";
  description?: string;
  amount?: FedExConsolidationMoney;
  percent?: number;
}

export interface FedExConsolidationRebate {
  rebateType?: "BONUS" | "EARNED" | "OTHER";
  description?: string;
  amount?: FedExConsolidationMoney;
  percent?: number;
}

export interface FedExConsolidationRecipientCustomsId {
  type?: "COMPANY" | "INDIVIDUAL" | "PASSPORT";
  value?: string;
}

export interface FedExConsolidationRecipientParty {
  address?: FedExConsolidationPartyAddress;
  contact?: FedExConsolidationPartyContact;
}

export interface FedExConsolidationRegulatoryAdvisoryDetail {
  commodityClarifications?: FedExConsolidationCommodityClarificationDetail[];
  prohibitions?: FedExConsolidationRegulatoryProhibition[];
}

export interface FedExConsolidationRegulatoryLabelContentDetail {
  generationOptions?:
    | "CONTENT_ON_SHIPPING_LABEL_PREFERRED"
    | "CONTENT_ON_SUPPLEMENTAL_LABEL_ONLY"
    | "CONTENT_ON_SHIPPING_LABEL_ONLY";
  type?: "ALCOHOL_SHIPMENT_LABEL";
}

export interface FedExConsolidationRegulatoryProhibition {
  derivedHarmonizedCode?: string;
  advisory?: FedExConsolidationMessage;
  commodityIndex?: number;
  source?: string;
  categories?: string[];
  type?: string;
  waiver?: FedExConsolidationRegulatoryWaiver;
  status?: string;
}

export interface FedExConsolidationRegulatoryWaiver {
  advisories?: FedExConsolidationMessage[];
  description?: string;
  id?: string;
}

export interface FedExConsolidationRequestedConsolidation {
  consolidationType:
    | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
    | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
    | "INTERNATIONAL_GROUND_DISTRIBUTION"
    | "TRANSBORDER_DISTRIBUTION"
    | "INTERNATIONAL_PRIORITY_DISTRIBUTION";
  /** This is the ship date for the outbound shipment associated with a return shipment. The format is YYYY-MM-DD. */
  shipDatestamp?: string;
  shipper: FedExConsolidationShipperPartyV2;
  origin?: FedExConsolidationOrigin;
  soldTo?: FedExConsolidationSoldToPartyV2;
  bookingNumber?: string;
  distributionLocation?: FedExConsolidationDistributionLocationsV2;
  /** Not in the schema; the sync IGD create sample sends an array under this plural name. */
  distributionLocations?: FedExConsolidationDistributionLocationsV2[];
  consolidationDataSources?: FedExConsolidationConsolidationDataSources;
  customerReferences?: FedExConsolidationCustomerReferencesV2;
  labelSpecification?: FedExConsolidationLabelSpecificationV3;
  /** Required by the schema; the spec's TD create and modify samples omit it. */
  internationalDistributionDetail?: FedExConsolidationInternationalDistributionDetail;
  transborderDistributionDetail?: FedExConsolidationTransborderDistributionDetail;
  customsClearanceDetail: FedExConsolidationCustomsClearanceDetailV2;
  consolidationDocumentSpecification?: FedExConsolidationConsolidationDocumentSpecV2;
  shippingChargesPayment?: FedExConsolidationPayment;
  description?: string;
  specialServicesRequested?: FedExConsolidationSpecialServicesRequested;
  processingOption?: FedExConsolidationConsolidationProcessingOptionsRequested;
  crnShippingDocumentTypes?: FedExConsolidationRequestedShippingDocumentType;
}

export interface FedExConsolidationRequestedConsolidationShipment {
  specialServicesRequested?: FedExConsolidationSpecialServicesRequestedV2;
  /** Required by the schema; every create-shipment sample in the spec omits it. */
  shipDatestamp?: string;
  dropOffType?:
    | "BUSINESS_SERVICE_CENTER"
    | "DROP_BOX"
    | "REGULAR_PICKUP"
    | "REQUEST_COURIER"
    | "STATION";
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  /** The schema enumerates the five consolidation types; the sync IGD and TD samples send `"FEDEX_GROUND"`. */
  serviceType: FedExConsolidationType | "FEDEX_GROUND" | (string & {});
  /** Spelled `dropoffType` in the spec's sync IPD, IED and IDF samples; `dropOffType` in the schema. */
  dropoffType?: FedExConsolidationRequestedConsolidationShipment["dropOffType"];
  /** The schema puts `shipAction` at the top level; the sync IDF sample sends it here. */
  shipAction?: "CONFIRM" | "TRANSFER";
  packagingType: string;
  totalWeight?: FedExConsolidationWeight;
  shipper: FedExConsolidationShipperParty;
  recipients?: FedExConsolidationRecipientParty[];
  pickupDetail?: FedExConsolidationPickupDetail;
  emailNotificationDetail?: FedExConsolidationEmailNotificationDetail;
  shippingChargesPayment: FedExConsolidationPaymentV2;
  processingOption?: FedExConsolidationProcessingOption;
  customsClearanceDetail?: FedExConsolidationCustomsClearanceDetail;
  labelSpecification: FedExConsolidationLabelSpecificationV2;
  rateRequestTypes?: "LIST" | "NONE" | "PREFERRED";
  /** Required by the schema; every create-shipment sample in the spec omits it. */
  packageCount?: number;
  requestedPackageLineItems: FedExConsolidationRequestedPackageLineItem[];
}

export interface FedExConsolidationProcessingOption {
  options?:
    | FedExConsolidationProcessingOptionValue
    | FedExConsolidationProcessingOptionValue[];
}

export interface FedExConsolidationSpecialServicesRequestedV2 {
  holdAtLocationDetail?: FedExConsolidationHoldAtLocationDetail;
}

export interface FedExConsolidationSpecialServicesRequested {
  specialServiceTypes?:
    "BROKER_SELECT_OPTION" | "PRIORITY_ALERT" | "SATURDAY_PICKUP";
  priorityAlertDetail?: FedExConsolidationPriorityAlertDetail;
}

export interface FedExConsolidationRequestedPackageLineItem {
  sequenceNumber?: number;
  subPackagingType?: string;
  customerReferences?: FedExConsolidationInnerV2[];
  declaredValue?: FedExConsolidationMoneyV2;
  weight: FedExConsolidationWeight;
  dimensions?: FedExConsolidationDimensions;
  physicalPackaging?: string;
  groupPackageCount?: number;
  /** Package description used for clearance. The value is required for intra-UAE. and is optional for intra-EU. */
  itemDescriptionForClearance?: string;
  contentRecord?: FedExConsolidationContentRecord[];
  /** Required for Email Label return shipments. This is the item description for the package. */
  itemDescription?: string;
  variableHandlingChargeDetail?: FedExConsolidationVariableHandlingChargeDetail;
  packageSpecialServices?: FedExConsolidationPackageSpecialServicesRequested;
  associatedFreightLineItems?: FedExConsolidationAssociatedFreightLineItemDetail[];
  commodities?: FedExConsolidationCommodity[];
}

export type FedExConsolidationRequestedShippingDocumentType =
  | "CERTIFICATE_OF_ORIGIN"
  | "COMMERCIAL_INVOICE"
  | "CUSTOM_PACKAGE_DOCUMENT"
  | "CUSTOM_SHIPMENT_DOCUMENT"
  | "CUSTOMER_SPECIFIED_LABELS"
  | "EXPORT_DECLARATION"
  | "DANGEROUS_GOODS_SHIPPERS_DECLARATION"
  | "FREIGHT_ADDRESS_LABEL"
  | "GENERAL_AGENCY_AGREEMENT"
  | "LABEL"
  | "USMCA_CERTIFICATION_OF_ORIGIN"
  | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
  | "OP_900"
  | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
  | "PRO_FORMA_INVOICE"
  | "RETURN_INSTRUCTIONS"
  | "FEDEX_FREIGHT_STRAIGHT_BILL_OF_LADING"
  | "VICS_BILL_OF_LADING";

export interface FedExConsolidationRetrievedConsolidation {
  consolidationType?:
    | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
    | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
    | "INTERNATIONAL_GROUND_DISTRIBUTION"
    | "TRANSBORDER_DISTRIBUTION"
    | "INTERNATIONAL_PRIORITY_DISTRIBUTION";
  shipDatestamp?: string;
  trackingIds?: FedExConsolidationTrackingIds[];
  shipper?: FedExConsolidationShipperParty;
  origin?: FedExConsolidationRecipientParty;
  soldTo?: FedExConsolidationSoldToParty;
  bookingNumber?: string;
  consolidationDataSources?: FedExConsolidationInner;
  customerReferences?: FedExConsolidationInnerV2[];
  labelSpecification?: FedExConsolidationLabelSpecificationV2;
  internationalDistributionDetail?: FedExConsolidationInternationalDistributionDetail;
  transborderDistributionDetail?: FedExConsolidationTransborderDistributionDetail;
  customsClearanceDetail?: FedExConsolidationCustomsClearanceDetail;
  consolidationDocumentSpecification?: FedExConsolidationConsolidationDocumentSpec;
  distributionLocations?: FedExConsolidationDistributionLocations;
  shippingChargesPayment?: FedExConsolidationPaymentV2;
  specialServicesRequested?: FedExConsolidationSpecialServicesRequestedV3;
}

export interface FedExConsolidationServiceDescription {
  serviceType?: string;
  code?: string;
  names?: FedExConsolidationProductName[];
  operatingOrgCodes?: string[];
  astraDescription?: string;
  description?: string;
  serviceId?: string;
  serviceCategory?: string;
}

export interface FedExConsolidationShipmentAdvisoryDetails {
  regulatoryAdvisory?: FedExConsolidationRegulatoryAdvisoryDetail;
}

export interface FedExConsolidationShipmentConsolidationDetail {
  type?:
    | "INTERNATIONAL_DISTRIBUTION_FREIGHT"
    | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
    | "INTERNATIONAL_GROUND_DISTRIBUTION"
    | "INTERNATIONAL_PRIORITY_DISTRIBUTION"
    | "TRANSBORDER_DISTRIBUTION";
  role?:
    | "CONSOLIDATION_DOCUMENTS_SHIPMENT"
    | "CRN_SHIPMENT"
    | "MASTER_AIRWAYBILL_SHIPMENT";
  associatedTrackingIds?: FedExConsolidationAssociatedTrackingDetails[];
}

export interface FedExConsolidationShipmentDryIceDetail {
  totalWeight: FedExConsolidationWeight;
  packageCount: number;
  processingOptions?: FedExConsolidationShipmentDryIceProcessingOptionsRequested;
}

export interface FedExConsolidationShipmentDryIceProcessingOptionsRequested {
  options?: string[];
}

export interface FedExConsolidationShipmentLegRateDetail {
  rateZone?: string;
  pricingCode?: string;
  taxes?: FedExConsolidationTax[];
  totalDimWeight?: FedExConsolidationWeight;
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExConsolidationCurrencyExchangeRate;
  dimDivisor?: number;
  rateType?: string;
  legDestinationLocationId?: string;
  dimDivisorType?: string;
  totalBaseCharge?: number;
  ratedWeightMethod?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  minimumChargeType?: string;
  totalDutiesAndTaxes?: number;
  totalNetFreight?: number;
  totalNetFedExCharge?: number;
  surcharges?: FedExConsolidationSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExConsolidationWeight;
  freightDiscounts?: FedExConsolidationRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExConsolidationShipmentOperationalDetail {
  originServiceArea?: string;
  serviceCode?: string;
  airportId?: string;
  postalCode?: string;
  scac?: string;
  deliveryDay?: string;
  originLocationId?: string;
  countryCode?: string;
  astraDescription?: string;
  originLocationNumber?: number;
  /** Specifies delivery date for the shipment. Format [YYYY-MM-DD] */
  deliveryDate?: string;
  deliveryEligibilities?: string[];
  ineligibleForMoneyBackGuarantee?: boolean;
  maximumTransitTime?: string;
  destinationLocationStateOrProvinceCode?: string;
  astraPlannedServiceLevel?: string;
  destinationLocationId?: string;
  transitTime?: string;
  stateOrProvinceCode?: string;
  destinationLocationNumber?: number;
  packagingCode?: string;
  commitDate?: string;
  publishedDeliveryTime?: string;
  ursaSuffixCode?: string;
  ursaPrefixCode?: string;
  destinationServiceArea?: string;
  commitDay?: string;
  customTransitTime?: string;
}

export interface FedExConsolidationShipmentRateDetail {
  rateZone?: string;
  ratedWeightMethod?: string;
  totalDutiesTaxesAndFees?: number;
  pricingCode?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  totalDutiesAndTaxes?: number;
  totalAncillaryFeesAndTaxes?: number;
  taxes?: FedExConsolidationTax[];
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExConsolidationCurrencyExchangeRate;
  totalNetFreight?: number;
  totalNetFedExCharge?: number;
  shipmentLegRateDetails?: FedExConsolidationShipmentLegRateDetail[];
  dimDivisor?: number;
  rateType?: string;
  surcharges?: FedExConsolidationSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExConsolidationWeight;
  freightDiscounts?: FedExConsolidationRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalBaseCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExConsolidationShipmentRating {
  actualRateType?: string;
  shipmentRateDetails?: FedExConsolidationShipmentRateDetail[];
  totalNetTransportationAndPickupCharge?: FedExConsolidationMoney;
  totalNetFedExTransportationAndPickupCharge?: FedExConsolidationMoney;
  pickupRateDetail?: {
    rateType?:
      | "INCENTIVE"
      | "NEGOTIATED"
      | "PAYOR_ACCOUNT_PACKAGE"
      | "PAYOR_ACCOUNT_SHIPMENT"
      | "PAYOR_CUSTOM_PACKAGE"
      | "PAYOR_CUSTOM_SHIPMENT"
      | "PAYOR_LIST_PACKAGE"
      | "PAYOR_LIST_SHIPMENT"
      | "PAYOR_RETAIL_PACKAGE"
      | "PAYOR_RETAIL_SHIPMENT"
      | "PREFERRED_ACCOUNT_PACKAGE"
      | "PREFERRED_ACCOUNT_SHIPMENT"
      | "PREFERRED_CUSTOM_PACKAGE"
      | "PREFERRED_CUSTOM_SHIPMENT"
      | "PREFERRED_INCENTIVE"
      | "PREFERRED_LIST_PACKAGE"
      | "PREFERRED_LIST_SHIPMENT"
      | "PREFERRED_NEGOTIATED"
      | "PREFERRED_RETAIL_PACKAGE"
      | "PREFERRED_RETAIL_SHIPMENT"
      | "RATED_ACCOUNT_PACKAGE"
      | "RATED_ACCOUNT_SHIPMENT"
      | "RATED_CUSTOM_PACKAGE"
      | "RATED_CUSTOM_SHIPMENT"
      | "RATED_LIST_PACKAGE"
      | "RATED_LIST_SHIPMENT"
      | "RATED_RETAIL_PACKAGE"
      | "RATED_RETAIL_SHIPMENT"
      | "UNKNOWN";
    rateScale?: string;
    rateZone?: string;
    ratingBasis?:
      | "SHIPMENT_WEIGHT_BASED"
      | "FLAT_RATE_PER_PAK"
      | "PACK_WEIGHT_BASED"
      | "UNKNOWN";
    pricingCode?:
      | "ACTUAL"
      | "ALTERNATE"
      | "BASE"
      | "HUNDREDWEIGHT"
      | "HUNDREDWEIGHT_ALTERNATE"
      | "INTERNATIONAL_DISTRIBUTION"
      | "INTERNATIONAL_ECONOMY_SERVICE"
      | "LTL_FREIGHT"
      | "PACKAGE"
      | "SHIPMENT"
      | "SHIPMENT_FIVE_POUND_OPTIONAL"
      | "SHIPMENT_OPTIONAL"
      | "SPECIAL"
      | "UNKNOWN";
    minimumChargeType?:
      | "CUSTOMER"
      | "CUSTOMER_FREIGHT_WEIGHT"
      | "EARNED_DISCOUNT"
      | "MIXED"
      | "RATE_SCALE"
      | "UNKNOWN";
    currencyExchangeRate?: FedExConsolidationCurrencyExchangeRate;
    specialRatingApplied?: (
      "FEDEX_ONE_RATE" | "FIXED_FUEL_SURCHARGE" | "IMPORT_PRICING"
    )[];
    fuelSurchargePercent?: number;
    pickupBaseChargeDescription?:
      | "Regularly Scheduled Pickup Mon-Fri"
      | "Automated Pickup Mon-Fri"
      | "Same Day OC Pickup Mon-Fri (CS)"
      | "Same Day OC Pickup Mon-Fri (Online)"
      | "Fut. Day OC Pickup Mon-Fri (CS)"
      | "Fut. Day OC Pickup Mon-Fri (Online)"
      | "Regularly Scheduled Pickup Sat"
      | "Automated Pickup Sat"
      | "Same Day OC Pickup Sat (CS)"
      | "Same Day OC Pickup Sat (Online)"
      | "Fut. Day OC Pickup Sat (CS)"
      | "Fut. Day OC Pickup Sat (Online)"
      | "Regularly Scheduled Pickup Sun"
      | "Automated Pickup Sun"
      | "Same Day OC Pickup Sun (CS)"
      | "Same Day OC Pickup Sun (Online)"
      | "Fut. Day OC Pickup Sun (CS)"
      | "Fut. Day OC Pickup Sun (Online)"
      | "Residential On-Call Pickup Surcharge"
      | "Pickup Area Surcharge"
      | "Extended Pickup Area Surcharge"
      | "Remote Pickup Area Surcharge"
      | "Fuel Surcharge";
    totalBaseCharge?: FedExConsolidationMoney;
    totalFreightDiscounts?: FedExConsolidationMoney;
    totalNetFreight?: FedExConsolidationMoney;
    totalSurcharges?: FedExConsolidationMoney;
    totalNetFedExCharge?: FedExConsolidationMoney;
    totalTaxes?: FedExConsolidationMoney;
    totalNetCharge?: FedExConsolidationMoney;
    totalRebates?: FedExConsolidationMoney;
    totalDutiesAndTaxes?: FedExConsolidationMoney;
    totalAncillaryFeesAndTaxes?: FedExConsolidationMoney;
    totalDutiesTaxesAndFees?: FedExConsolidationMoney;
    totalNetChargeWithDutiesAndTaxes?: FedExConsolidationMoney;
    freightDiscounts?: FedExConsolidationRateDiscountV2[];
    rebates?: FedExConsolidationRebate[];
    surcharges?: FedExConsolidationSurchargeV2[];
    taxes?: FedExConsolidationTaxV2[];
    dutiesAndTaxes?: FedExConsolidationEdtCommodityTax[];
    ancillaryFeesAndTaxes?: FedExConsolidationAncillaryFeeAndTax[];
    variableHandlingCharges?: FedExConsolidationVariableHandlingCharges;
    totalVariableHandlingCharges?: FedExConsolidationVariableHandlingCharges;
  };
}

export interface FedExConsolidationShipperParty {
  address: FedExConsolidationPartyAddress;
  contact: FedExConsolidationPartyContact;
  tins?: FedExConsolidationTaxpayerIdentification[];
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationShipperPartyV2 {
  address: FedExConsolidationPartyAddressV2;
  contact: FedExConsolidationPartyContact;
  tins?: FedExConsolidationTaxpayerIdentificationV2[];
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationShippingDocument {
  type?:
    | "AUXILIARY_LABEL"
    | "CERTIFICATE_OF_ORIGIN"
    | "COD_AND_DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_2_D_BARCODE"
    | "COD_AND_DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_LABEL"
    | "COD_RETURN_2_D_BARCODE"
    | "COD_RETURN_LABEL"
    | "COMMERCIAL_INVOICE"
    | "CUSTOM_PACKAGE_DOCUMENT"
    | "CUSTOM_SHIPMENT_DOCUMENT"
    | "DANGEROUS_GOODS_SHIPPERS_DECLARATION"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_2_D_BARCODE"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE_RETURN_LABEL"
    | "ETD_LABEL"
    | "EXPORT_DECLARATION"
    | "FEDEX_FREIGHT_STRAIGHT_BILL_OF_LADING"
    | "FREIGHT_ADDRESS_LABEL"
    | "GENERAL_AGENCY_AGREEMENT"
    | "GROUND_BARCODE"
    | "OP_900"
    | "OUTBOUND_2_D_BARCODE"
    | "OUTBOUND_LABEL"
    | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
    | "PRO_FORMA_INVOICE"
    | "RECIPIENT_ADDRESS_BARCODE"
    | "RECIPIENT_POSTAL_BARCODE"
    | "RETURN_INSTRUCTIONS"
    | "TERMS_AND_CONDITIONS"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
    | "USPS_BARCODE"
    | "VICS_BILL_OF_LADING";
  /** Use this object to provide all data required for additional (non-label) shipping documents to be produced. */
  shippingDocumentDisposition?:
    | "CONFIRMED"
    | "DEFERRED_QUEUED"
    | "DEFERRED_RETURNED"
    | "DEFERRED_STORED"
    | "EMAILED"
    | "QUEUED"
    | "RETURNED"
    | "STORED";
  imageType?:
    | "DIB"
    | "DOC"
    | "DPL"
    | "EPL2"
    | "GIF"
    | "PDF"
    | "PNG"
    | "RTF"
    | "TEXT"
    | "ZPLII";
  resolution?: number;
  copiesToPrint?: number;
  parts?: FedExConsolidationPartsV2[];
}

export interface FedExConsolidationShippingDocumentDispositionDetail {
  eMailDetail?: FedExConsolidationShippingDocumentEmailDetail;
  dispositionType?:
    | "CONFIRMED"
    | "DEFERRED_QUEUED"
    | "DEFERRED_RETURNED"
    | "DEFERRED_STORED"
    | "EMAILED"
    | "QUEUED"
    | "RETURNED"
    | "STORED";
  grouping?:
    | "CONSOLIDATED_BY_DOCUMENT_TYPE"
    | "CONSOLIDATED_BY_IMAGE_TYPE"
    | "INDIVIDUAL";
  storageDetail?: FedExConsolidationShippingDocumentStorageDetail;
  printDetail?: FedExConsolidationShippingDocumentPrintDetail;
}

export interface FedExConsolidationShippingDocumentEmailDetail {
  eMailRecipients: FedExConsolidationShippingDocumentEmailRecipient[];
  locale?: FedExConsolidationLocale;
  grouping?: "BY_RECIPIENT" | "NONE";
}

export interface FedExConsolidationShippingDocumentEmailRecipient {
  emailAddress?: string;
  recipientType:
    | "BROKER"
    | "OTHER"
    | "RECIPIENT"
    | "SHIPPER"
    | "THRID_PARTY"
    | "OTHER1"
    | "OTHER2";
}

export interface FedExConsolidationShippingDocumentPrintDetail {
  printerId?: string;
}

export interface FedExConsolidationShippingDocumentStorageDetail {
  type?: "ASYNC_SERVICE" | "LOCAL_FILE_SYSTEM";
  filePath?: string;
  fileNaming?: "FAST" | "LEGACY_FXRS";
  fileSuffix?: string;
}

export interface FedExConsolidationPartsV2 {
  documentPartSequenceNumber?: number;
  image?: string;
}

export interface FedExConsolidationSignatureOptionDetail {
  /** Signature Release Number is required for signature option NO_SIGNATURE_REQUIRED. */
  signatureReleaseNumber?: string;
}

export interface FedExConsolidationSoldToParty {
  address?: FedExConsolidationSoldTo;
  contact?: FedExConsolidationSoldToV3;
  tins?: FedExConsolidationTaxpayerIdentification[];
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationSoldToPartyV2 {
  address?: FedExConsolidationSoldToV2;
  contact?: FedExConsolidationSoldToV4;
  tins?: FedExConsolidationTaxpayerIdentificationV2[];
  accountNumber?: FedExConsolidationPartyAccountNumber;
}

export interface FedExConsolidationSpecialServicesRequestedV3 {
  specialServiceTypes?:
    | "BROKER_SELECT_OPTION"
    | "PRIORITY_ALERT"
    | "SATURDAY_PICKUP"
    | "INTERNATIONAL_CONTROLLED_EXPORT_SERVICE";
  priorityAlertDetail?: FedExConsolidationPriorityAlertDetail;
  internationalControlledExportDetail?: FedExConsolidationInternationalControlledExportDetail;
}

export interface FedExConsolidationStringBarcode {
  type?: string;
  value?: string;
}

export interface FedExConsolidationSuggestedCommodityDetail {
  description?: string;
  harmonizedCode?: string;
}

export interface FedExConsolidationSummaryDetailV2 {
  expressPacakgeCount?: number;
  expressTotalPackageWeight?: FedExConsolidationExpressTotalPackageWeight;
  expressTotalPackageAdjustedWeight?: FedExConsolidationExpressTotalPackageWeight;
  expressFreightPackageCount?: number;
  expressTotalFreightWeight?: FedExConsolidationExpressTotalPackageWeight;
  expressTotalFreightAdjustedWeight?: FedExConsolidationExpressTotalPackageWeight;
  groundPackageCount?: number;
  groundTotalPackageWeight?: FedExConsolidationExpressTotalPackageWeight;
  groundTotalPackageAdjustedWeight?: FedExConsolidationExpressTotalPackageWeight;
  numberOfUnconsolidatedCommodities?: number;
}

export interface FedExConsolidationExpressTotalPackageWeight {
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExConsolidationSurcharge {
  amount?: FedExConsolidationMoneyV2;
  surchargeType?: string;
  level?: string;
  description?: string;
}

export interface FedExConsolidationSurchargeV2 {
  surchargeType?:
    | "ACCOUNT_NUMBER_PROCESSING_FEE"
    | "ADDITIONAL_HANDLING"
    | "ADDRESS_CORRECTION"
    | "ANCILLARY_FEE"
    | "APPOINTMENT_DELIVERY"
    | "BLIND_SHIPMENT"
    | "BROKER_SELECT_OPTION"
    | "CANADIAN_DESTINATION"
    | "CHARGEABLE_PALLET_WEIGHT"
    | "COD"
    | "CUT_FLOWERS"
    | "DANGEROUS_GOODS"
    | "DELIVERY_AREA"
    | "DELIVERY_CONFIRMATION"
    | "DELIVERY_ON_INVOICE_ACCEPTANCE"
    | "DEMAND"
    | "DEMAND_ADDITIONAL_HANDLING"
    | "DEMAND_OVERSIZE"
    | "DEMAND_RESIDENTIAL_DELIVERY"
    | "DETENTION"
    | "DOCUMENTATION_FEE"
    | "DRY_ICE"
    | "EMAIL_LABEL"
    | "ENHANCED_SECURITY"
    | "EUROPE_FIRST"
    | "EXCESS_VALUE"
    | "EXCLUSIVE_USE"
    | "EXHIBITION"
    | "EXPEDITED"
    | "EXPORT"
    | "EXTRA_LABOR"
    | "EXTRA_SURFACE_HANDLING_CHARGE"
    | "EXTREME_LENGTH"
    | "FEDEX_INTRACOUNTRY_FEES"
    | "FEDEX_TAG"
    | "FICE"
    | "FLATBED"
    | "FREIGHT_DIRECT_BASIC_BY_APPOINTMENT_DELIVERY"
    | "FREIGHT_DIRECT_BASIC_BY_APPOINTMENT_PICKUP"
    | "FREIGHT_DIRECT_BASIC_DELIVERY"
    | "FREIGHT_DIRECT_BASIC_PICKUP"
    | "FREIGHT_DIRECT_PREMIUM_DELIVERY"
    | "FREIGHT_DIRECT_PREMIUM_PICKUP"
    | "FREIGHT_DIRECT_STANDARD_DELIVERY"
    | "FREIGHT_DIRECT_STANDARD_PICKUP"
    | "FREIGHT_GUARANTEE"
    | "FREIGHT_ON_VALUE"
    | "FREIGHT_TO_COLLECT"
    | "FUEL"
    | "HIGH_COST_SERVICE_AREA_DESTINATION"
    | "HIGH_COST_SERVICE_AREA_ORIGIN"
    | "HIGH_DENSITY"
    | "HOLD_AT_LOCATION"
    | "HOLIDAY_DELIVERY"
    | "HOLIDAY_GUARANTEE"
    | "HOME_DELIVERY_APPOINTMENT"
    | "HOME_DELIVERY_DATE_CERTAIN"
    | "HOME_DELIVERY_EVENING"
    | "INSIDE_DELIVERY"
    | "INSIDE_PICKUP"
    | "INSURED_VALUE"
    | "INTERHAWAII"
    | "LIFTGATE_DELIVERY"
    | "LIFTGATE_PICKUP"
    | "LIMITED_ACCESS_DELIVERY"
    | "LIMITED_ACCESS_PICKUP"
    | "MARKING_OR_TAGGING"
    | "METRO_DELIVERY"
    | "METRO_PICKUP"
    | "MONITORING_AND_INTERVENTION"
    | "NON_BUSINESS_TIME"
    | "NON_MACHINABLE"
    | "OFFSHORE"
    | "ON_CALL_PICKUP"
    | "ON_DEMAND_CARE"
    | "OTHER"
    | "OUT_OF_DELIVERY_AREA"
    | "OUT_OF_PICKUP_AREA"
    | "OVER_DIMENSION"
    | "OVER_LENGTH"
    | "OVERSIZE"
    | "OVERWEIGHT"
    | "PALLET_SHRINKWRAP"
    | "PALLETS_PROVIDED"
    | "PEAK"
    | "PEAK_ADDITIONAL_HANDLING"
    | "PEAK_OVERSIZE"
    | "PEAK_RESIDENTIAL_DELIVERY"
    | "PERMIT"
    | "PIECE_COUNT_VERIFICATION"
    | "PORT"
    | "PRE_DELIVERY_NOTIFICATION"
    | "PRIORITY_ALERT"
    | "PROTECTION_FROM_FREEZING"
    | "REGIONAL_MALL_DELIVERY"
    | "REGIONAL_MALL_PICKUP"
    | "REROUTE"
    | "RESCHEDULE"
    | "RESIDENTIAL_DELIVERY"
    | "RESIDENTIAL_PICKUP"
    | "RETURN_LABEL"
    | "SATURDAY_DELIVERY"
    | "SATURDAY_PICKUP"
    | "SHIPMENT_ASSEMBLY"
    | "SIGNATURE_OPTION"
    | "SINGLE_PIECE"
    | "SORT_AND_SEGREGATE"
    | "SPECIAL_DELIVERY"
    | "SPECIAL_EQUIPMENT"
    | "STORAGE"
    | "SUNDAY_DELIVERY"
    | "TARP"
    | "THIRD_PARTY_BILLING"
    | "THIRD_PARTY_CONSIGNEE"
    | "TRANSMART_SERVICE_FEE"
    | "USPS"
    | "WEIGHING";
  level?: "PACKAGE" | "SHIPMENT";
  description?: string;
  amount?: FedExConsolidationMoney;
}

export interface FedExConsolidationTax {
  amount?: number;
  level?: string;
  description?: string;
  type?: string;
}

export interface FedExConsolidationTaxV2 {
  taxType?:
    "EXPORT" | "GST" | "HST" | "INTRACOUNTRY" | "OTHER" | "PST" | "SST" | "VAT";
  description?: string;
  amount?: FedExConsolidationMoney;
}

export interface FedExConsolidationTaxpayerIdentification {
  number?: string;
  tinType?:
    | "PERSONAL_NATIONAL"
    | "PERSONAL_STATE"
    | "FEDERAL"
    | "BUSINESS_NATIONAL"
    | "BUSINESS_STATE"
    | "BUSINESS_UNION";
  usage?: string;
  effectiveDate?: string;
  expirationDate?: string;
}

export interface FedExConsolidationTaxpayerIdentificationV2 {
  number: string;
  /** Identifies the type of Tax Identification Number in Shipment processing. This is required when the tins array of objects is supplied. */
  tinType?:
    | "PERSONAL_NATIONAL"
    | "PERSONAL_STATE"
    | "BUSINESS_NATIONAL"
    | "BUSINESS_STATE"
    | "BUSINESS_UNION"
    | "FEDERAL";
  usage?: string;
  effectiveDate?: string;
  expirationDate?: string;
}

export interface FedExConsolidationTins {
  tinType?:
    | "BUSINESS_NATIONAL"
    | "BUSINESS_STATE"
    | "BUSINESS_UNION"
    | "PERSONAL_NATIONAL"
    | "PERSONAL_STATE";
  number?: string;
  usage?: string;
  /** Specifies Effective Date. Format YYYY-MM-DD */
  effectiveDate?: string;
  expirationDate?: string;
}

export interface FedExConsolidationTrackingId {
  formId?: string;
  trackingIdType?: string;
  uspsApplicationId?: string;
  trackingNumber?: string;
}

export interface FedExConsolidationTrackingIds {
  trackingIdType: string;
  formId: string;
  trackingNumber: string;
}

export interface FedExConsolidationTransactionConsolidationOutput {
  completedConsolidationDetail?: FedExConsolidationCompletedConsolidationDetailV2;
  pieceResponses?: FedExConsolidationPieceResponse[];
  shipmentDocuments?: FedExConsolidationLabelResponse[];
}

export interface FedExConsolidationCompletedConsolidationDetailV2 {
  consolidationShipments?: FedExConsolidationConsolidationShipments;
  consolidationDocumentTypes?: FedExConsolidationConsolidationDocumentSpec;
}

export interface FedExConsolidationTransactionCreateConsolidationShipmentResultsOutput {
  serviceType?: string;
  /** Specifies shipment date. Format [YYYY-MM-DD] */
  shipDatestamp?: string;
  serviceCategory?: string;
  shipmentDocuments?: FedExConsolidationLabelResponse[];
  pieceResponses?: FedExConsolidationPieceResponse[];
  serviceName?: string;
  completedShipmentDetail?: FedExConsolidationCreateConsolidationCompletedShipmentDetail;
  shipmentAdvisoryDetails?: FedExConsolidationShipmentAdvisoryDetails;
  masterTrackingNumber?: string;
}

export interface FedExConsolidationTransborderDistributionDetail {
  specialServicesRequested?: FedExConsolidationSpecialServicesRequestedV4;
  routing?: "BY_METER" | "BY_ORIGIN" | "CUSTOMER_SPECIFIED";
  summaryDetail?: FedExConsolidationSummaryDetailV2;
}

export interface FedExConsolidationSpecialServicesRequestedV4 {
  /** A single value in the schema, an array in the spec's TD sample (`["FEDEX_LTL"]`). */
  specialServiceTypes?: "FEDEX_LTL" | "FEDEX_LTL"[];
  transborderDistributionLtlDetail?: FedExConsolidationTransborderDistributionLtlDetail;
}

export interface FedExConsolidationTransborderDistributionLtlDetail {
  payment?: FedExConsolidationPaymentV3;
  ltlScacCode?: string;
}

export interface FedExConsolidationPaymentV3 {
  paymentType?:
    | "ACCOUNT"
    | "CASH"
    | "COLLECT"
    | "CREDIT_CARD"
    | "EPAYMENT"
    | "RECIPIENT"
    | "SENDER"
    | "THIRD_PARTY";
  payor?: FedExConsolidationPayorV3;
  ePaymentDetail?: FedExConsolidationEPaymentDetail;
  creditCard?: FedExConsolidationCreditCard;
  creditCardTransactionDetail?: FedExConsolidationCreditCardTransactionDetail;
  amount?: FedExConsolidationAmount;
}

export interface FedExConsolidationCreditCard {
  number?: string;
  creditCardType?:
    "AMEX" | "DANKORT" | "DINERS" | "DISCOVER" | "JCB" | "MASTERCARD" | "VISA";
  expirationDate?: string;
  /** Use date format (MM-dd-yyyy). It is the last time the user has updated their credit card information */
  lastAuthenticationByFedexDate?: string;
  verificationCode?: string;
  creditCardHolder?: FedExConsolidationCreditCardHolder;
}

export interface FedExConsolidationCreditCardHolder {
  contact?: FedExConsolidationContactV5;
  address?: FedExConsolidationAddressV4;
}

export interface FedExConsolidationPayorV3 {
  responsibleParty?: FedExConsolidationResponsibleParty;
  associatedAccounts?: FedExConsolidationAssociatedAccounts[];
}

export interface FedExConsolidationResponsibleParty {
  /** A string in the schema; the TD sample sends `{ value }` like the other account numbers. */
  accountNumber?: string | { value: string };
  tins?: FedExConsolidationTins[];
  contact?: FedExConsolidationContactV6;
  address?: FedExConsolidationAddressV4;
}

export interface FedExConsolidationAddressV4 {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  /** This is placeholder for postal code. Note: The postal code is required for postal-aware countries. */
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
  urbanizationCode?: string;
  countryName?: string;
  geographicCoordinates?: string;
  classification?:
    | "BUSINESS"
    | "MIXED"
    | "RESIDENTIAL"
    | "UNCONFIRMED_BUSINESS"
    | "UNCONFIRMED_RESIDENCE"
    | "UNKOWN";
}

export interface FedExConsolidationCreditCardTransactionDetail {
  authorizationId?: string;
  authorizationType?:
    "AUTHORIZE_NON_ACCOUNT" | "AUTHORIZE_WITH_ACCOUNT" | "VERIFY_WITH_ACCOUNT";
  settlementScheduleType?:
    "SETTLE_IMMEDIATELY" | "SETTLE_NEXT_DAY" | "SETTLE_ON_DELIVERY";
  fraudDetectionDetail?: FedExConsolidationFraudDetectionDetail;
  payorAuthenticationCode?: string;
  payorAuthenticationSessionId?: string;
  attributesDetail?: FedExConsolidationAttributesDetail;
}

export interface FedExConsolidationAttributesDetail {
  types?: (
    | "ORIGINATED_BY_AUTHORIZED_PERSONNEL"
    | "ORIGINATED_BY_UNAUTHORIZED_PERSONNEL"
  )[];
}

export interface FedExConsolidationFraudDetectionDetail {
  ipAddress?: string;
  clientCookiesEnabled?: boolean;
  devicePrint?: string;
}

export interface FedExConsolidationContactV5 {
  personName?: FedExConsolidationPersonName;
  phoneNumberCountryCode?: string;
  phoneNumberAreaCode?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  companyName?: string;
  pagerNumber?: string;
  faxNumber?: string;
  title?: string;
}

export interface FedExConsolidationPersonName {
  prefix?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
}

export interface FedExConsolidationEPaymentDetail {
  epaymentProcessor?: "RETAIL_SINGLE_POINT_OF_SALE";
  ePaymentMode?:
    "APPLE_PAY" | "CASH" | "CHECK" | "CREDIT_CARD" | "GOOGLE_PAY" | "PAYPAL";
  creditCardType?:
    "AMEX" | "DANKORT" | "DINERS" | "DISCOVER" | "JCB" | "MASTERCARD" | "VISA";
  creditCardExpirationDate?: string;
  amount?: FedExConsolidationAmount;
}

export interface FedExConsolidationAmount {
  currency?: string;
  amount?: number;
}

export interface FedExConsolidationAssociatedAccounts {
  type?: "FEDEX_EXPRESS" | "FEDEX_FREIGHT" | "FEDEX_GROUND" | "FEDEX_OFFICE";
  accountNumber?: string;
}

export interface FedExConsolidationContactV6 {
  contactId?: string;
  personName?: string;
  tollFreePhoneNumber?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  companyName?: string;
  faxNumber?: string;
  pagerNumber?: string;
  title?: string;
}

export interface FedExConsolidationUploadDocumentReferenceDetail {
  documentId?: string;
}

export interface FedExConsolidationValidatedHazardousCommodityContent {
  quantity?: FedExConsolidationHazardousCommodityQuantityDetail;
  options?: FedExConsolidationHazardousCommodityContent001;
  description?: FedExConsolidationValidatedHazardousCommodityDescription;
  netExplosiveDetail?: FedExConsolidationNetExplosiveDetail;
  massPoints?: number;
}

export interface FedExConsolidationValidatedHazardousCommodityDescription {
  sequenceNumber?: number;
  packingInstructions?: string;
  subsidiaryClasses?: string[];
  labelText?: string;
  tunnelRestrictionCode?: string;
  specialProvisions?: string;
  properShippingNameAndDescription?: string;
  technicalName?: string;
  symbols?: string;
  authorization?: string;
  attributes?: string[];
  id?: string;
  packingGroup?: string;
  properShippingName?: string;
  hazardClass?: string;
}

export interface FedExConsolidationValidatedHazardousContainer {
  qvalue?: number;
  hazardousCommodities?: FedExConsolidationValidatedHazardousCommodityContent[];
}

export interface FedExConsolidationVariableHandlingChargeDetail {
  rateType?:
    | "ACCOUNT"
    | "ACTUAL"
    | "CURRENT"
    | "CUSTOM"
    | "LIST"
    | "INCENTIVE"
    | "PREFERRED"
    | "PREFERRED_INCENTIVE"
    | "PREFERRED_CURRENCY";
  percentValue?: number;
  rateLevelType?: "BUNDLED_RATE" | "INDIVIDUAL_PACKAGE_RATE";
  fixedValue?: {
    amount: number;
    currency: string;
  };
  rateElementBasis?:
    "NET_CHARGE" | "NET_FREIGHT" | "BASE_CHARGE" | "NET_CHARGE_EXCLUDING_TAXES";
}

export interface FedExConsolidationVariableHandlingCharges {
  variableHandlingCharge?: FedExConsolidationMoney;
  fixedVariableHandlingCharge?: FedExConsolidationMoney;
  percentVariableHandlingCharge?: FedExConsolidationMoney;
  totalCustomerCharge?: FedExConsolidationMoney;
}

export interface FedExConsolidationVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface FedExConsolidationWeight {
  units: string;
  value: number;
}

export type FedExConsolidationConsolidationDataSourceType =
  "ACCUMULATED" | "CLIENT";

export type FedExConsolidationConsolidationDataType =
  | "TOTAL_CUSTOMS_CODE"
  | "TOTAL_FREIGHT_CHARGES"
  | "TOTAL_HANDLING_COSTS"
  | "TOTAL_INSURANCE_CHARGES"
  | "TOTAL_INSURED_VALUE"
  | "TOTAL_PACKING_COSTS"
  | "TOTAL_TAXES_OR_MISCELLANEOUS_CHARGES";

export type FedExConsolidationCustomerReferenceType =
  | "BILL_OF_LANDING"
  | "CUSTOMER_REFERENCE"
  | "DEPARTMENT_NUMBER"
  | "ELECTRONIC_PRODUCT_CODE"
  | "INTRACOUNTRY_REGULATORY_REFERENCE"
  | "INVOICE_NUMBER"
  | "P_O_NUMBER"
  | "PACKING_SLIP_NUMBER"
  | "RMA_ASSOCIATION"
  | "SHIPMENT_INTEGRITY"
  | "STORE_NUMBER";

export interface FedExConsolidationDeleteOutput {
  alerts?: FedExConsolidationAlert[];
}

export type FedExConsolidationModifyResponse =
  FedExResponse<FedExConsolidationModifyOutput>;

export type FedExConsolidationCreateResponse =
  FedExResponse<FedExConsolidationCreateOutput>;

export type FedExConsolidationCreateShipmentResponse =
  FedExResponse<FedExConsolidationCreateShipmentOutput>;

export type FedExConsolidationShipmentResultsResponse =
  FedExResponse<FedExConsolidationShipmentResultsOutput>;

export interface FedExConsolidationConfirmResponse {
  output: FedExConsolidationConfirmOutput;
}

export type FedExConsolidationConfirmResultsResponse =
  FedExResponse<FedExConsolidationConfirmResultsOutput>;

export type FedExConsolidationRetrieveResponse =
  FedExResponse<FedExConsolidationRetrieveOutput>;

export type FedExConsolidationDeleteShipmentsResponse =
  FedExResponse<FedExConsolidationDeleteShipmentsOutput>;

export type FedExConsolidationDeleteResponse =
  FedExResponse<FedExConsolidationDeleteOutput>;
