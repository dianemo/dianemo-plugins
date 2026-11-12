import { FedExPackageType, FedExResponse, FedExServiceType } from "../types.js";

// Wire types mirror the FedEx Developer Portal OpenAPI spec "Ship API" v1.0.0
// (downloaded 2026-11-12). Required vs optional follows the spec's `required`
// arrays; the spec marks almost every response field optional. Two deliberate
// departures, both in /docs/fedex-api.md: `serviceType`/`packagingType` use the
// plugin's string unions (the spec types them as plain strings), and the
// top-level `output.alerts` comes from the shared `FedExResponse` envelope.

export type FedexShippingRequest = FedExShipCreateShipmentRequest;

export type FedexShippingResponse =
  FedExResponse<FedExShipCreateShipmentOutput>;

// The names below shipped in v1.0.0 and stay as aliases of the spec-derived types.
export type FedExAddress = FedExShipShipperParty;
export type FedExPackage = FedExShipRequestedPackageLineItem;
export type CustomsClearanceDetail = FedExShipCustomsClearanceDetail;
export type CustomsClearanceDetailCommodity = FedExShipCommodity;
export type PackageSpecialServicesDetail =
  FedExShipPackageSpecialServicesRequested;
export type CustomerReference = FedExShipCustomerReference;
export type TransactionShipments = FedExShipCreatedTransactionShipment;
export type PieceResponse = FedExShipPieceResponse;
export type PackageDocument = FedExShipShipmentDocument;
export type ShipmentDocument = FedExShipShipmentDocument;
export type FedExCompleteShipmentDetail =
  FedExShipCompletedCreateShipmentDetail;
export type CompletedPackageDetail = FedExShipCompletedPackageDetail;

export interface FedExShipContactDetail {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
}

export interface FedExShipPartyAddress {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
}

export interface FedExShipContactAndAddress {
  contact?: FedExShipContactDetail;
  address?: FedExShipPartyAddress;
}

export interface FedExShipPartyAccountNumber {
  value?: string;
}

export interface FedExShipWeight {
  units: "KG" | "LB";
  value: number;
}

export interface FedExShipMoney {
  amount?: number;
  currency?: string;
}

export interface FedExShipPartyAddress2 {
  streetLines: string[];
  city: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExShipPartyContact {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber: string;
  companyName?: string;
}

export interface FedExShipTaxpayerIdentification {
  number: string;
  tinType:
    | "PERSONAL_NATIONAL"
    | "PERSONAL_STATE"
    | "FEDERAL"
    | "BUSINESS_NATIONAL"
    | "BUSINESS_STATE"
    | "BUSINESS_UNION";
  usage?: string;
  /** Format: YYYY-MM-DD */
  effectiveDate?: string;
  /** Format: YYYY-MM-DD */
  expirationDate?: string;
}

export interface FedExShipShipperParty {
  address: FedExShipPartyAddress2;
  contact: FedExShipPartyContact;
  tins?: FedExShipTaxpayerIdentification[];
}

export interface FedExShipContactRegulatoryReferences {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber?: string;
  companyName?: string;
}

export interface FedExShipRegulatoryReferencesRegisteredParty {
  address?: FedExShipPartyAddress;
  contact?: FedExShipContactRegulatoryReferences;
}

export interface FedExShipRegulatoryReferences {
  regulatoryID?: "IOSS";
  responsibleParty?: "SHIPPER";
  identifier?: string;
  registeredParty?: FedExShipRegulatoryReferencesRegisteredParty;
}

export interface FedExShipRecipientsParty {
  address: FedExShipPartyAddress2;
  contact: FedExShipPartyContact;
  tins?: FedExShipTaxpayerIdentification[];
  deliveryInstructions?: string;
}

export interface FedExShipPickupDetail {
  /** Format: YYYY-MM-DD */
  readyPickupDateTime?: string;
  /** Format: YYYY-MM-DD */
  latestPickupDateTime?: string;
  courierInstructions?: string;
  requestType?: "FUTURE_DAY" | "SAME_DAY";
  requestSource?: "AUTOMATION" | "CUSTOMER_SERVICE";
}

export interface FedExShipSoldToParty {
  address?: FedExShipPartyAddress;
  contact?: FedExShipPartyContact;
  tins?: FedExShipTaxpayerIdentification[];
  accountNumber?: FedExShipPartyAccountNumber;
}

export interface FedExShipResponsiblePartyParty {
  address?: FedExShipPartyAddress;
  contact?: FedExShipPartyContact;
  accountNumber: FedExShipPartyAccountNumber;
}

export interface FedExShipPayor {
  responsibleParty: FedExShipResponsiblePartyParty;
}

export interface FedExShipPayment {
  paymentType: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
  payor?: FedExShipPayor;
}

export interface FedExShipUploadDocumentReferenceDetail {
  documentType?:
    | "CERTIFICATE_OF_ORIGIN"
    | "NET_RATE_SHEET"
    | "COMMERCIAL_INVOICE"
    | "ETD_LABEL"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "OTHER"
    | "PRO_FORMA_INVOICE"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN";
  documentReference?: string;
  description?: string;
  documentId?: string;
}

export interface FedExShipETDDetail {
  attributes?: "POST_SHIPMENT_UPLOAD_REQUESTED"[];
  attachedDocuments?: FedExShipUploadDocumentReferenceDetail[];
  requestedDocumentTypes?: (
    | "CERTIFICATE_OF_ORIGIN"
    | "COMMERCIAL_INVOICE"
    | "CUSTOM_PACKAGE_DOCUMENT"
    | "CUSTOM_SHIPMENT_DOCUMENT"
    | "CUSTOMER_SPECIFIED_LABELS"
    | "EXPORT_DECLARATION"
    | "GENERAL_AGENCY_AGREEMENT"
    | "LABEL"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "OP_900"
    | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
    | "PRO_FORMA_INVOICE"
    | "RETURN_INSTRUCTIONS"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
  )[];
}

export interface FedExShipReturnEmailDetail {
  merchantPhoneNumber: string;
  allowedSpecialService: ("SATURDAY_DELIVERY" | "SATURDAY_PICKUP")[];
}

export interface FedExShipReturnMerchandiseAuthorization {
  reason?: string;
}

export interface FedExShipReturnAssociationDetail {
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  trackingNumber: string;
}

export interface FedExShipReturnShipmentDetail {
  returnEmailDetail?: FedExShipReturnEmailDetail;
  rma?: FedExShipReturnMerchandiseAuthorization;
  returnAssociationDetail?: FedExShipReturnAssociationDetail;
  returnType: "PENDING" | "PRINT_RETURN_LABEL";
}

export interface FedExShipDeliveryOnInvoiceAcceptanceDetail {
  recipient?: {
    address: {
      streetLines: string[];
      city: string;
      stateOrProvinceCode?: string;
      postalCode?: string;
      countryCode: string;
      residential?: boolean;
    };
    contact: {
      personName: string;
      emailAddress?: string;
      phoneExtension?: string;
      phoneNumber: string;
      companyName: string;
    };
    tins?: FedExShipTaxpayerIdentification[];
    deliveryInstructions?: string;
  };
}

export interface FedExShipInternationalTrafficInArmsRegulationsDetail {
  licenseOrExemptionNumber: string;
}

export interface FedExShipPendingShipmentProcessingOptionsRequested {
  options?: "ALLOW_MODIFICATIONS"[];
}

export interface FedExShipRecommendedDocumentSpecification {
  types: (
    | "ANTIQUE_STATEMENT_EUROPEAN_UNION"
    | "ANTIQUE_STATEMENT_UNITED_STATES"
    | "ASSEMBLER_DECLARATION"
    | "BEARING_WORKSHEET"
    | "CERTIFICATE_OF_SHIPMENTS_TO_SYRIA"
    | "COMMERCIAL_INVOICE_FOR_THE_CARIBBEAN_COMMON_MARKET"
    | "CONIFEROUS_SOLID_WOOD_PACKAGING_MATERIAL_TO_THE_PEOPLES_REPUBLIC_OF_CHINA"
    | "DECLARATION_FOR_FREE_ENTRY_OF_RETURNED_AMERICAN_PRODUCTS"
    | "DECLARATION_OF_BIOLOGICAL_STANDARDS"
    | "DECLARATION_OF_IMPORTED_ELECTRONIC_PRODUCTS_SUBJECT_TO_RADIATION_CONTROL_STANDARD"
    | "ELECTRONIC_INTEGRATED_CIRCUIT_WORKSHEET"
    | "FILM_AND_VIDEO_CERTIFICATE"
    | "INTERIM_FOOTWEAR_INVOICE"
    | "USMCA_CERTIFICATION_OF_ORIGIN_CANADA_ENGLISH"
    | "USMCA_CERTIFICATION_OF_ORIGIN_CANADA_FRENCH"
    | "USMCA_CERTIFICATION_OF_ORIGIN_SPANISH"
    | "USMCA_CERTIFICATION_OF_ORIGIN_UNITED_STATES"
    | "PACKING_LIST"
    | "PRINTED_CIRCUIT_BOARD_WORKSHEET"
    | "REPAIRED_WATCH_BREAKOUT_WORKSHEET"
    | "STATEMENT_REGARDING_THE_IMPORT_OF_RADIO_FREQUENCY_DEVICES"
    | "TOXIC_SUBSTANCES_CONTROL_ACT"
    | "UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_TEXTILES"
    | "UNITED_STATES_CARIBBEAN_BASIN_TRADE_PARTNERSHIP_ACT_CERTIFICATE_OF_ORIGIN_NON_TEXTILES"
    | "UNITED_STATES_NEW_WATCH_WORKSHEET"
    | "UNITED_STATES_WATCH_REPAIR_DECLARATION"
  )[];
}

export interface FedExShipEmailOptionsRequested {
  options?: (
    | "PRODUCE_PAPERLESS_SHIPPING_FORMAT"
    | "SUPPRESS_ADDITIONAL_LANGUAGES"
    | "SUPPRESS_ACCESS_EMAILS"
  )[];
}

export interface FedExShipEmailRecipient {
  emailAddress: string;
  optionsRequested?: FedExShipEmailOptionsRequested;
  role: "SHIPMENT_COMPLETOR" | "SHIPMENT_INITIATOR";
  locale?: string;
}

export interface FedExShipEmailLabelDetail {
  recipients?: FedExShipEmailRecipient[];
  message?: string;
}

export interface FedExShipUploadDocumentReferenceDetail1 {
  documentType?:
    | "CERTIFICATE_OF_ORIGIN"
    | "COMMERCIAL_INVOICE"
    | "ETD_LABEL"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "NET_RATE_SHEET"
    | "OTHER"
    | "PRO_FORMA_INVOICE"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN";
  documentReference?: string;
  description?: string;
  documentId?: string;
}

export interface FedExShipPendingShipmentDetail {
  pendingShipmentType: "EMAIL";
  processingOptions?: FedExShipPendingShipmentProcessingOptionsRequested;
  recommendedDocumentSpecification?: FedExShipRecommendedDocumentSpecification;
  emailLabelDetail: FedExShipEmailLabelDetail;
  attachedDocuments?: FedExShipUploadDocumentReferenceDetail1[];
  /** Format: YYYY-MM-DD */
  expirationTimeStamp?: string;
}

export interface FedExShipHoldAtLocationDetail {
  locationId: string;
  locationContactAndAddress?: FedExShipContactAndAddress;
  locationType?:
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_STAFFED"
    | "RETAIL_ALLICANCE_LOCATION"
    | "FEDEX_GROUND_TERMINAL"
    | "FEDEX_ONSITE";
}

export interface FedExShipCODTransportationChargesDetail {
  rateType?: "ACCOUNT" | "LIST" | "ACTUAL" | "CURRENT" | "CUSTOM";
  rateLevelType?: "BUNDLED_RATE" | "INDIVIDUAL_PACKAGE_RATE";
  chargeLevelType?: "CURRENT_PACKAGE" | "SUM_OF_PACKAGES";
  chargeType?:
    "COD_SURCHARGE" | "NET_CHARGE" | "NET_FREIGHT" | "TOTAL_CUSTOMER_CHARGE";
}

export interface FedExShipParty1 {
  address?: FedExShipPartyAddress;
  contact: FedExShipPartyContact;
  accountNumber?: FedExShipPartyAccountNumber;
  tins?: FedExShipTaxpayerIdentification[];
}

export interface FedExShipShipmentCODDetail {
  addTransportationChargesDetail?: FedExShipCODTransportationChargesDetail;
  codRecipient?: FedExShipParty1;
  remitToName?: string;
  codCollectionType:
    "ANY" | "CASH" | "GUARANTEED_FUNDS" | "COMPANY_CHECK" | "PERSONAL_CHECK";
  financialInstitutionContactAndAddress?: FedExShipContactAndAddress;
  codCollectionAmount?: FedExShipMoney;
  returnReferenceIndicatorType?: "INVOICE" | "PO" | "REFERENCE" | "TRACKING";
  shipmentCodAmount?: FedExShipMoney;
}

export interface FedExShipWeight1 {
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExShipShipmentDryIceDetail1 {
  totalWeight?: FedExShipWeight1;
  packageCount?: number;
}

export interface FedExShipInternationalControlledExportDetail {
  /** Format: YYYY-MM-DD */
  licenseOrPermitExpirationDate?: string;
  licenseOrPermitNumber?: string;
  entryNumber?: string;
  foreignTradeZoneCode?: string;
  type:
    | "DEA_036"
    | "DEA_236"
    | "DSP_05"
    | "DSP_61"
    | "DSP_73"
    | "DSP_85"
    | "DSP_LICENSE_AGREEMENT"
    | "WAREHOUSE_WITHDRAWAL"
    | "FROM_FOREIGN_TRADE_ZONE"
    | "DEA_486"
    | "DSP_94";
}

export interface FedExShipPhoneNumber1 {
  areaCode?: string;
  localNumber?: string;
  extension?: string;
  personalIdentificationNumber?: string;
}

export interface FedExShipHomeDeliveryPremiumDetail {
  phoneNumber?: FedExShipPhoneNumber1;
  deliveryDate?: string;
  homedeliveryPremiumType?: "APPOINTMENT" | "DATE_CERTAIN" | "EVENING";
}

export interface FedExShipShipmentSpecialServicesRequested {
  specialServiceTypes?: string[];
  etdDetail?: FedExShipETDDetail;
  returnShipmentDetail?: FedExShipReturnShipmentDetail;
  deliveryOnInvoiceAcceptanceDetail?: FedExShipDeliveryOnInvoiceAcceptanceDetail;
  internationalTrafficInArmsRegulationsDetail?: FedExShipInternationalTrafficInArmsRegulationsDetail;
  pendingShipmentDetail?: FedExShipPendingShipmentDetail;
  holdAtLocationDetail?: FedExShipHoldAtLocationDetail;
  shipmentCODDetail?: FedExShipShipmentCODDetail;
  shipmentDryIceDetail?: FedExShipShipmentDryIceDetail1;
  internationalControlledExportDetail?: FedExShipInternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: FedExShipHomeDeliveryPremiumDetail;
}

export interface FedExShipShipShipmentEmailNotificationRecipient {
  name?: string;
  emailNotificationRecipientType:
    "BROKER" | "OTHER" | "RECIPIENT" | "SHIPPER" | "THIRD_PARTY";
  emailAddress: string;
  notificationFormatType?: "HTML" | "TEXT";
  notificationType?: "EMAIL";
  locale?: string;
  notificationEventType?: (
    | "ON_DELIVERY"
    | "ON_EXCEPTION"
    | "ON_SHIPMENT"
    | "ON_TENDER"
    | "ON_ESTIMATED_DELIVERY"
    | "ON_PICKUP"
    | "ON_PICKUP_DRIVER_ARRIVED"
    | "ON_PICKUP_DRIVER_ASSIGNED"
    | "ON_PICKUP_DRIVER_DEPARTED"
    | "ON_PICKUP_DRIVER_EN_ROUTE"
  )[];
}

export interface FedExShipShipShipmentEMailNotificationDetail {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExShipShipShipmentEmailNotificationRecipient[];
  personalMessage?: string;
}

export interface FedExShipExpressFreightDetail {
  bookingConfirmationNumber?: string;
  shippersLoadAndCount?: number;
  packingListEnclosed?: boolean;
}

export interface FedExShipVariableHandlingChargeDetail {
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

export interface FedExShipBrokerDetail {
  broker?: {
    address: FedExShipPartyAddress;
    contact: FedExShipPartyContact;
    accountNumber?: FedExShipPartyAccountNumber;
    tins?: FedExShipTaxpayerIdentification[];
  };
  type?: "IMPORT";
}

export interface FedExShipCustomerReference {
  customerReferenceType?:
    | "CUSTOMER_REFERENCE"
    | "DEPARTMENT_NUMBER"
    | "INVOICE_NUMBER"
    | "P_O_NUMBER"
    | "INTRACOUNTRY_REGULATORY_REFERENCE"
    | "RMA_ASSOCIATION";
  value?: string;
}

export interface FedExShipShipEmailDispositionDetail {
  emailAddress?: string;
  type?: string;
  recipientType?: string;
}

export interface FedExShipCommercialInvoice {
  originatorName?: string;
  paymentTerms?: string;
  comments?: string[];
  customerReferences?: FedExShipCustomerReference[];
  taxesOrMiscellaneousCharge?: FedExShipMoney;
  taxesOrMiscellaneousChargeType?:
    | "COMMISSIONS"
    | "DISCOUNTS"
    | "HANDLING_FEES"
    | "OTHER"
    | "ROYALTIES_AND_LICENSE_FEES"
    | "TAXES";
  freightCharge?: FedExShipMoney;
  packingCosts?: FedExShipMoney;
  handlingCosts?: FedExShipMoney;
  declarationStatement?: string;
  termsOfSale?: string;
  specialInstructions?: string;
  shipmentPurpose?:
    | "GIFT"
    | "NOT_SOLD"
    | "PERSONAL_EFFECTS"
    | "REPAIR_AND_RETURN"
    | "SAMPLE"
    | "SOLD";
  emailNotificationDetail?: FedExShipShipEmailDispositionDetail;
}

export interface FedExShipDutiesParty {
  address?: FedExShipPartyAddress;
  contact?: FedExShipContactDetail;
  accountNumber?: FedExShipPartyAccountNumber;
  tins?: FedExShipTaxpayerIdentification[];
}

export interface FedExShipDutiesPayor {
  responsibleParty?: FedExShipDutiesParty;
}

export interface FedExShipBillingDetails {
  billingCode?: string;
  billingType?: string;
  aliasId?: string;
  accountNickname?: string;
  accountNumber?: string;
  accountNumberCountryCode?: string;
}

export interface FedExShipDutiesPayment {
  payor?: FedExShipDutiesPayor;
  billingDetails?: FedExShipBillingDetails;
  paymentType?: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
}

export interface FedExShipClearanceItemDetail {
  role?: "MANUFACTURER";
  id?: string;
  contact?: {
    companyName?: string;
  };
  address?: {
    streetLines?: string[];
    city?: string;
    stateOrProvinceCode?: string;
    postalCode?: string;
    countryCode?: string;
    residential?: boolean;
  };
}

export interface FedExShipAdditionalMeasures {
  quantity?: number;
  units?: string;
}

export interface FedExShipDisclaimMessageSet {
  disclaimCode?: "A" | "B";
  intendedUseCode?: string;
  intendedUseDescription?: string;
}

export interface FedExShipReferenceMessageSet {
  productVersion?: string;
  certifierId?: string;
  registryProductId?: string;
}

export interface FedExShipRegulatoryDetailInfo {
  disclaimMessageSet?: FedExShipDisclaimMessageSet;
  referenceMessageSet?: FedExShipReferenceMessageSet;
  standardManufacturerProductId?: string;
  nonStandardManufacturerProductId?: string;
  merchantProductId?: string;
}

export interface FedExShipRegulatoryDetail {
  regulationCode: "CPSC" | "EU_DE_MINIMIS";
  productId: string;
  productIdType:
    "SKU" | "MODEL_NUMBER" | "SERIAL_NUMBER" | "ALTERNATE_ID" | "GTIN" | "UPC";
  details?: FedExShipRegulatoryDetailInfo;
}

export interface FedExShipUsmcaDetail {
  originCriterion?: "A" | "B" | "C" | "D" | "E";
}

export interface FedExShipCommodity {
  clearanceItemDetail?: FedExShipClearanceItemDetail[];
  unitPrice?: FedExShipMoney;
  additionalMeasures?: FedExShipAdditionalMeasures[];
  regulatoryDetails?: FedExShipRegulatoryDetail[];
  numberOfPieces?: number;
  quantity?: number;
  quantityUnits?: string;
  customsValue?: FedExShipMoney;
  countryOfManufacture?: string;
  cIMarksAndNumbers?: string;
  harmonizedCode?: string;
  description: string;
  name?: string;
  weight?: FedExShipWeight;
  exportLicenseNumber?: string;
  /** Format: YYYY-MM-DD */
  exportLicenseExpirationDate?: string;
  partNumber?: string;
  purpose?: "BUSINESS" | "CONSUMER";
  usmcaDetail?: FedExShipUsmcaDetail;
}

export interface FedExShipRecipientCustomsId {
  type?: "COMPANY" | "INDIVIDUAL" | "PASSPORT";
  value?: string;
}

export interface FedExShipCustomsOptionDetail {
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

export interface FedExShipDestinationControlDetail {
  endUser?: string;
  statementTypes: "DEPARTMENT_OF_COMMERCE" | "DEPARTMENT_OF_STATE";
  destinationCountries?: string[];
}

export interface FedExShipExportDetail {
  destinationControlDetail?: FedExShipDestinationControlDetail;
  b13AFilingOption?:
    | "NOT_REQUIRED"
    | "MANUALLY_ATTACHED"
    | "FILED_ELECTRONICALLY"
    | "SUMMARY_REPORTING"
    | "FEDEX_TO_STAMP";
  exportComplianceStatement?: string;
  permitNumber?: string;
}

export interface FedExShipUsmcaLowValueStatementDetail {
  countryOfOriginLowValueDocumentRequested?: boolean;
  customsRole: "EXPORTER" | "IMPORTER";
}

export interface FedExShipCustomsDeclarationStatementDetail {
  usmcaLowValueStatementDetail: FedExShipUsmcaLowValueStatementDetail;
}

export interface FedExShipCustomsClearanceDetail {
  regulatoryControls?: (
    | "FOOD_OR_PERISHABLE"
    | "USMCA"
    | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
    | "NOT_IN_FREE_CIRCULATION"
  )[];
  brokers?: FedExShipBrokerDetail[];
  commercialInvoice: FedExShipCommercialInvoice;
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
  dutiesPayment?: FedExShipDutiesPayment;
  commodities: FedExShipCommodity[];
  isDocumentOnly?: boolean;
  recipientCustomsId?: FedExShipRecipientCustomsId;
  customsOption?: FedExShipCustomsOptionDetail;
  importerOfRecord?: FedExShipParty1;
  generatedDocumentLocale?: string;
  exportDetail?: FedExShipExportDetail;
  totalCustomsValue?: FedExShipMoney;
  partiesToTransactionAreRelated?: boolean;
  declarationStatementDetail?: FedExShipCustomsDeclarationStatementDetail;
  insuranceCharge?: FedExShipMoney;
}

export interface FedExShipSmartPostInfoDetail {
  ancillaryEndorsement?:
    | "ADDRESS_CORRECTION"
    | "CARRIER_LEAVE_IF_NO_RESPONSE"
    | "CHANGE_SERVICE"
    | "FORWARDING_SERVICE"
    | "RETURN_SERVICE";
  hubId: string;
  indicia:
    | "MEDIA_MAIL"
    | "PARCEL_RETURN"
    | "PARCEL_SELECT"
    | "PRESORTED_BOUND_PRINTED_MATTER"
    | "PRESORTED_STANDARD";
  specialServices?: "USPS_DELIVERY_CONFIRMATION";
}

export interface FedExShipRegulatoryLabelContentDetail {
  generationOptions?:
    | "CONTENT_ON_SHIPPING_LABEL_PREFERRED"
    | "CONTENT_ON_SUPPLEMENTAL_LABEL_ONLY"
    | "CONTENT_ON_SHIPPING_LABEL_ONLY";
  type?: "ALCOHOL_SHIPMENT_LABEL";
}

export interface FedExShipAdditionalLabelsDetail {
  type?:
    | "BROKER"
    | "CONSIGNEE"
    | "CUSTOMS"
    | "DESTINATION"
    | "DESTINATION_CONTROL_STATEMENT"
    | "FREIGHT_REFERENCE"
    | "MANIFEST"
    | "ORIGIN"
    | "RECIPIENT"
    | "SECOND_ADDRESS"
    | "SHIPPER";
  count?: number;
}

export interface FedExShipDocTabZoneSpecification {
  zoneNumber?: number;
  header?: string;
  dataField?: string;
  literalValue?: string;
  justification?: "LEFT" | "RIGHT";
}

export interface FedExShipDocTabContentZone001 {
  docTabZoneSpecifications?: FedExShipDocTabZoneSpecification[];
}

export interface FedExShipDocTabContentBarcoded {
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
  specification?: FedExShipDocTabZoneSpecification;
}

export interface FedExShipDocTabContent {
  docTabContentType?:
    "BARCODED" | "CUSTOM" | "MINIMUM" | "STANDARD" | "ZONE001";
  zone001?: FedExShipDocTabContentZone001;
  barcoded?: FedExShipDocTabContentBarcoded;
}

export interface FedExShipCustomerSpecifiedLabelDetail {
  maskedData?: (
    | "CUSTOMS_VALUE"
    | "SHIPPER_ACCOUNT_NUMBER"
    | "DIMENSIONS"
    | "DUTIES_AND_TAXES_PAYOR_ACCOUNT_NUMBER"
    | "INSURED_VALUE"
    | "SECONDARY_BARCODE"
    | "SHIPPER_INFORMATION"
    | "TERMS_AND_CONDITIONS"
    | "TOTAL_WEIGHT"
    | "TRANSPORTATION_CHARGES_PAYOR_ACCOUNT_NUMBER"
  )[];
  regulatoryLabels?: FedExShipRegulatoryLabelContentDetail[];
  additionalLabels?: FedExShipAdditionalLabelsDetail[];
  docTabContent?: FedExShipDocTabContent;
}

export interface FedExShipLabelSpecification {
  labelFormatType?: "COMMON2D" | "LABEL_DATA_ONLY";
  labelOrder?: "SHIPPING_LABEL_FIRST" | "SHIPPING_LABEL_LAST";
  customerSpecifiedDetail?: FedExShipCustomerSpecifiedLabelDetail;
  printedLabelOrigin?: FedExShipContactAndAddress;
  labelStockType:
    | "PAPER_4X6"
    | "STOCK_4X675"
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
    | "STOCK_4X9"
    | "STOCK_4X85_TRAILING_DOC_TAB"
    | "STOCK_4X105_TRAILING_DOC_TAB";
  labelRotation?: "LEFT" | "RIGHT" | "UPSIDE_DOWN" | "NONE";
  imageType: "ZPLII" | "EPL2" | "PDF" | "PNG";
  labelPrintingOrientation?:
    "BOTTOM_EDGE_OF_TEXT_FIRST" | "TOP_EDGE_OF_TEXT_FIRST";
  returnedDispositionDetail?: string;
  resolution?: number;
}

export interface FedExShipDocumentFormatOptionsRequested {
  options?: (
    | "SHIPPING_LABEL_FIRST"
    | "SHIPPING_LABEL_LAST"
    | "SUPPRESS_ADDITIONAL_LANGUAGES"
  )[];
}

export interface FedExShipShippingDocumentEmailRecipient {
  emailAddress?: string;
  recipientType:
    | "BROKER"
    | "OTHER"
    | "RECIPIENT"
    | "SHIPPER"
    | "THIRD_PARTY"
    | "OTHER1"
    | "OTHER2";
}

export interface FedExShipShippingDocumentEmailDetail {
  eMailRecipients: FedExShipShippingDocumentEmailRecipient[];
  locale?: string;
  grouping?: "BY_RECIPIENT" | "NONE";
}

export interface FedExShipShippingDocumentDispositionDetail {
  eMailDetail?: FedExShipShippingDocumentEmailDetail;
  dispositionType?:
    | "CONFIRMED"
    | "DEFERRED_QUEUED"
    | "DEFERRED_RETURNED"
    | "DEFERRED_STORED"
    | "EMAILED"
    | "QUEUED"
    | "RETURNED"
    | "STORED";
}

export interface FedExShipShippingDocumentFormat {
  provideInstructions?: boolean;
  optionsRequested?: FedExShipDocumentFormatOptionsRequested;
  stockType?: "PAPER_LETTER";
  dispositions?: FedExShipShippingDocumentDispositionDetail[];
  locale?: string;
  docType?: "PDF";
}

export interface FedExShipGeneralAgencyAgreementDetail {
  documentFormat?: FedExShipShippingDocumentFormat;
}

export interface FedExShipReturnShippingDocumentFormat {
  provideInstructions?: boolean;
  optionsRequested?: FedExShipDocumentFormatOptionsRequested;
  stockType?: "PAPER_LETTER";
  dispositions?: FedExShipShippingDocumentDispositionDetail[];
  locale?: string;
  docType?: "PNG" | "PDF";
}

export interface FedExShipReturnInstructionsDetail {
  customText?: string;
  documentFormat?: FedExShipReturnShippingDocumentFormat;
}

export interface FedExShipCustomerImageUsage {
  id?: "IMAGE_1" | "IMAGE_2" | "IMAGE_3" | "IMAGE_4" | "IMAGE_5";
  type?: "SIGNATURE" | "LETTER_HEAD";
  providedImageType?: "LETTER_HEAD" | "SIGNATURE";
}

export interface FedExShipOp900Detail {
  customerImageUsages?: FedExShipCustomerImageUsage[];
  signatureName?: string;
  documentFormat?: FedExShipShippingDocumentFormat;
}

export interface FedExShipPartyAddress1 {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
  geographicCoordinates?: string;
}

export interface FedExShipPartyContact1 {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber?: string;
  companyName?: string;
  faxNumber?: string;
}

export interface FedExShipParty3 {
  address?: FedExShipPartyAddress1;
  contact?: FedExShipPartyContact1;
  tins?: FedExShipTaxpayerIdentification[];
}

export interface FedExShipRetrieveDateRange {
  begins?: string;
  ends?: string;
}

export interface FedExShipUsmcaCertificationOfOriginDetail {
  customerImageUsages?: FedExShipCustomerImageUsage[];
  documentFormat?: FedExShipShippingDocumentFormat;
  certifierSpecification?: "EXPORTER" | "IMPORTER" | "PRODUCER";
  importerSpecification?: "UNKNOWN" | "VARIOUS";
  producerSpecification?:
    "AVAILABLE_UPON_REQUEST" | "VARIOUS" | "SAME_AS_EXPORTER";
  producer?: FedExShipParty3;
  blanketPeriod?: FedExShipRetrieveDateRange;
  certifierJobTitle?: string;
}

export interface FedExShipUsmcaCommercialInvoiceCertificationOfOriginDetail {
  customerImageUsages?: FedExShipCustomerImageUsage[];
  documentFormat?: FedExShipShippingDocumentFormat;
  certifierSpecification?: "EXPORTER" | "IMPORTER" | "PRODUCER";
  importerSpecification?: "UNKNOWN" | "VARIOUS";
  producerSpecification?:
    "AVAILABLE_UPON_REQUEST" | "VARIOUS" | "SAME_AS_EXPORTER";
  producer?: FedExShipParty3;
  certifierJobTitle?: string;
}

export interface FedExShipCertificateOfOriginDetail {
  customerImageUsages?: FedExShipCustomerImageUsage[];
  documentFormat?: FedExShipShippingDocumentFormat;
}

export interface FedExShipShippingDocumentSpecification {
  generalAgencyAgreementDetail?: FedExShipGeneralAgencyAgreementDetail;
  returnInstructionsDetail?: FedExShipReturnInstructionsDetail;
  op900Detail?: FedExShipOp900Detail;
  usmcaCertificationOfOriginDetail?: FedExShipUsmcaCertificationOfOriginDetail;
  usmcaCommercialInvoiceCertificationOfOriginDetail?: FedExShipUsmcaCommercialInvoiceCertificationOfOriginDetail;
  shippingDocumentTypes?: (
    | "CERTIFICATE_OF_ORIGIN"
    | "COMMERCIAL_INVOICE"
    | "CUSTOM_PACKAGE_DOCUMENT"
    | "CUSTOM_SHIPMENT_DOCUMENT"
    | "CUSTOMER_SPECIFIED_LABELS"
    | "EXPORT_DECLARATION"
    | "GENERAL_AGENCY_AGREEMENT"
    | "LABEL"
    | "USMCA_CERTIFICATION_OF_ORIGIN"
    | "OP_900"
    | "PENDING_SHIPMENT_EMAIL_NOTIFICATION"
    | "PRO_FORMA_INVOICE"
    | "RETURN_INSTRUCTIONS"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN"
  )[];
  certificateOfOrigin?: FedExShipCertificateOfOriginDetail;
  commercialInvoiceDetail?: FedExShipCertificateOfOriginDetail;
}

export interface FedExShipMasterTrackingId {
  formId?: string;
  trackingIdType?: string;
  uspsApplicationId?: string;
  trackingNumber?: string;
}

export interface FedExShipVariationOptions {
  id?: string;
  values?: string[];
}

export interface FedExShipDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExShipContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface FedExShipPriorityAlertDetail {
  enhancementTypes?: string[];
  content?: string[];
}

export interface FedExShipSignatureOptionDetail {
  signatureReleaseNumber?: string;
}

export interface FedExShipAlcoholDetail {
  alcoholRecipientType?: "LICENSEE" | "CONSUMER";
  shipperAgreementType?: string;
}

export interface FedExShipDangerousGoodsDetail {
  cargoAircraftOnly?: boolean;
  regulation?: "ADR" | "DOT" | "IATA" | "ORMD";
  accessibility?: "ACCESSIBLE" | "INACCESSIBLE";
  options?: (
    | "HAZARDOUS_MATERIALS"
    | "BATTERY"
    | "ORM_D"
    | "REPORTABLE_QUANTITIES"
    | "SMALL_QUANTITY_EXCEPTION"
    | "LIMITED_QUANTITIES_COMMODITIES"
  )[];
}

export interface FedExShipPackageCODDetail {
  codCollectionAmount?: FedExShipMoney;
}

export interface FedExShipBatteryDetail {
  batteryPackingType?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
  batteryRegulatoryType?: "IATA_SECTION_II";
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExShipStandaloneBatteryDetails {
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExShipPackageSpecialServicesRequested {
  specialServiceTypes?: string[];
  signatureOptionType?:
    | "SERVICE_DEFAULT"
    | "NO_SIGNATURE_REQUIRED"
    | "INDIRECT"
    | "DIRECT"
    | "ADULT";
  priorityAlertDetail?: FedExShipPriorityAlertDetail;
  signatureOptionDetail?: FedExShipSignatureOptionDetail;
  alcoholDetail?: FedExShipAlcoholDetail;
  dangerousGoodsDetail?: FedExShipDangerousGoodsDetail;
  packageCODDetail?: FedExShipPackageCODDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExShipBatteryDetail[];
  dryIceWeight?: FedExShipWeight;
  standaloneBatteryDetails?: FedExShipStandaloneBatteryDetails[];
}

export interface FedExShipRequestedPackageLineItem {
  sequenceNumber?: number;
  subPackagingType?: string;
  customerReferences?: FedExShipCustomerReference[];
  declaredValue?: FedExShipMoney;
  weight: FedExShipWeight;
  dimensions?: FedExShipDimensions;
  groupPackageCount?: number;
  itemDescriptionForClearance?: string;
  contentRecord?: FedExShipContentRecord[];
  itemDescription?: string;
  variableHandlingChargeDetail?: FedExShipVariableHandlingChargeDetail;
  packageSpecialServices?: FedExShipPackageSpecialServicesRequested;
}

export interface FedExShipRequestedShipment {
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  totalDeclaredValue?: FedExShipMoney;
  shipper: FedExShipShipperParty;
  regulatoryReferences?: FedExShipRegulatoryReferences;
  recipients: FedExShipRecipientsParty[];
  pickupDetail?: FedExShipPickupDetail;
  soldTo?: FedExShipSoldToParty;
  recipientLocationNumber?: string;
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  serviceType: FedExServiceType;
  packagingType: FedExPackageType;
  totalWeight: number;
  origin?: FedExShipContactAndAddress;
  shippingChargesPayment: FedExShipPayment;
  shipmentSpecialServices?: FedExShipShipmentSpecialServicesRequested;
  emailNotificationDetail?: FedExShipShipShipmentEMailNotificationDetail;
  expressFreightDetail?: FedExShipExpressFreightDetail;
  variableHandlingChargeDetail?: FedExShipVariableHandlingChargeDetail;
  customsClearanceDetail?: FedExShipCustomsClearanceDetail;
  smartPostInfoDetail?: FedExShipSmartPostInfoDetail;
  blockInsightVisibility?: boolean;
  labelSpecification: FedExShipLabelSpecification;
  shippingDocumentSpecification?: FedExShipShippingDocumentSpecification;
  rateRequestType?: (
    "LIST" | "NONE" | "PREFERRED" | "ACCOUNT" | "INCENTIVE" | "RETAIL"
  )[];
  preferredCurrency?: string;
  totalPackageCount?: number;
  masterTrackingId?: FedExShipMasterTrackingId;
  variationOptions?: FedExShipVariationOptions[];
  requestedPackageLineItems: FedExShipRequestedPackageLineItem[];
}

export interface FedExShipShipperAccountNumber {
  value: string;
}

export interface FedExShipVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface FedExShipCreateShipmentRequest {
  mergeLabelDocOption?: "NONE" | "LABELS_AND_DOCS" | "LABELS_ONLY";
  requestedShipment: FedExShipRequestedShipment;
  labelResponseOptions: "URL_ONLY" | "LABEL";
  accountNumber: FedExShipShipperAccountNumber;
  shipAction?: "CONFIRM" | "TRANSFER";
  processingOptionType?: "SYNCHRONOUS_ONLY" | "ALLOW_ASYNCHRONOUS";
  oneLabelAtATime?: boolean;
  version?: FedExShipVersion;
  processingOptions?: "INCLUDE_PICKUPRATES"[];
}

export interface FedExShipAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

export interface FedExShipShipmentDocument {
  contentKey?: string;
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
    | "MERGED_LABELS_ONLY"
    | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN";
  trackingNumber?: string;
  docType?: string;
  alerts?: FedExShipAlert[];
  encodedLabel?: string;
  url?: string;
}

export interface FedExShipPieceResponse {
  netChargeAmount?: number;
  packageDocuments?: FedExShipShipmentDocument[];
  acceptanceTrackingNumber?: string;
  serviceCategory?:
    | "EXPRESS"
    | "GROUND"
    | "EXPRESS_FREIGHT"
    | "FREIGHT"
    | "SMARTPOST"
    | "EXPRESS_PARCEL"
    | "NULL";
  listCustomerTotalCharge?: string;
  deliveryTimestamp?: string;
  trackingIdType?: string;
  additionalChargesDiscount?: number;
  listRateAmount?: number;
  baseRateAmount?: number;
  packageSequenceNumber?: number;
  netDiscountAmount?: number;
  codCollectionAmount?: number;
  masterTrackingNumber?: string;
  acceptanceType?: string;
  trackingNumber?: string;
  customerReferences?: FedExShipCustomerReference[];
}

export interface FedExShipAlert3P {
  code?: string;
  message?: string;
}

export interface FedExShipBarcode {
  type?: string;
  value?: string;
}

export interface FedExShipPackageBarcodes {
  binaryBarcodes?: FedExShipBarcode[];
  stringBarcodes?: FedExShipBarcode[];
}

export interface FedExShipOperationalInstructions {
  number?: number;
  content?: string;
}

export interface FedExShipPackageOperationalDetail {
  astraHandlingText?: string;
  barcodes?: FedExShipPackageBarcodes;
  operationalInstructions?: FedExShipOperationalInstructions[];
}

export interface FedExShipSurcharge {
  amount?: number;
  surchargeType?: string;
  level?: string;
  description?: string;
}

export interface FedExShipPackageRateDetail {
  ratedWeightMethod?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  minimumChargeType?: string;
  baseCharge?: number;
  totalRebates?: number;
  rateType?: string;
  billingWeight?: FedExShipWeight;
  netFreight?: number;
  surcharges?: FedExShipSurcharge[];
  totalSurcharges?: number;
  netFedExCharge?: number;
  netCharge?: number;
  currency?: string;
}

export interface FedExShipPackageRating {
  effectiveNetDiscount?: number;
  actualRateType?: string;
  packageRateDetails?: FedExShipPackageRateDetail[];
}

export interface FedExShipHazardousCommodityQuantityDetail {
  quantityType: "GROSS" | "NET";
  amount: number;
  units?: string;
  value?: number;
}

export interface FedExShipHazardousCommodityOptionDetail {
  labelTextOption?: "APPEND" | "OVERRIDE" | "STANDARD";
  customerSuppliedLabelText?: string;
}

export interface FedExShipValidatedHazardousCommodityDescription {
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

export interface FedExShipNetExplosiveDetail {
  amount?: number;
  units?: string;
  type?: string;
}

export interface FedExShipValidatedHazardousCommodityContent {
  quantity?: FedExShipHazardousCommodityQuantityDetail;
  options?: FedExShipHazardousCommodityOptionDetail;
  description?: FedExShipValidatedHazardousCommodityDescription;
  netExplosiveDetail?: FedExShipNetExplosiveDetail;
  massPoints?: number;
}

export interface FedExShipValidatedHazardousContainer {
  QValue?: number;
  hazardousCommodities?: FedExShipValidatedHazardousCommodityContent[];
}

export interface FedExShipCompletedHazardousPackageDetail {
  regulation?: string;
  accessibility?: string;
  labelType?: string;
  containers?: FedExShipValidatedHazardousContainer[];
  cargoAircraftOnly?: boolean;
  referenceId?: string;
  radioactiveTransportIndex?: number;
}

export interface FedExShipCompletedPackageDetail {
  sequenceNumber?: number;
  operationalDetail?: FedExShipPackageOperationalDetail;
  signatureOption?: string;
  trackingIds?: FedExShipMasterTrackingId[];
  groupNumber?: number;
  oversizeClass?: string;
  packageRating?: FedExShipPackageRating;
  dryIceWeight?: FedExShipWeight;
  hazardousPackageDetail?: FedExShipCompletedHazardousPackageDetail;
}

export interface FedExShipShipmentOperationalDetail {
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
  /** Format: YYYY-MM-DD */
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

export interface FedExShipContact {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  companyName?: string;
}

export interface FedExShipJustContactAndAddress {
  address?: FedExShipPartyAddress;
  contact?: FedExShipContact;
}

export interface FedExShipCompletedHoldAtLocationDetail {
  holdingLocationType?: string;
  holdingLocation?: FedExShipJustContactAndAddress;
}

export interface FedExShipCompletedEtdDetail {
  folderId?: string;
  type?: string;
  uploadDocumentReferenceDetails?: FedExShipUploadDocumentReferenceDetail[];
}

export interface FedExShipProductName {
  type?: string;
  encoding?: string;
  value?: string;
}

export interface FedExShipServiceDescription {
  serviceType?: string;
  code?: string;
  names?: FedExShipProductName[];
  operatingOrgCodes?: string[];
  astraDescription?: string;
  description?: string;
  serviceId?: string;
  serviceCategory?: string;
}

export interface FedExShipCompletedHazardousSummaryDetail {
  smallQuantityExceptionPackageCount?: number;
}

export interface FedExShipLicenseOrPermitDetail {
  number?: string;
  /** Format: YYYY-MM-DD */
  effectiveDate?: string;
  /** Format: YYYY-MM-DD */
  expirationDate?: string;
}

export interface FedExShipAdrLicenseDetail {
  licenseOrPermitDetail?: FedExShipLicenseOrPermitDetail;
}

export interface FedExShipShipmentDryIceProcessingOptionsRequested {
  options?: string[];
}

export interface FedExShipShipmentDryIceDetail {
  totalWeight?: FedExShipWeight;
  packageCount: number;
  processingOptions?: FedExShipShipmentDryIceProcessingOptionsRequested;
}

export interface FedExShipCompletedHazardousShipmentDetail {
  hazardousSummaryDetail?: FedExShipCompletedHazardousSummaryDetail;
  adrLicense?: FedExShipAdrLicenseDetail;
  dryIceDetail?: FedExShipShipmentDryIceDetail;
}

export interface FedExShipTax {
  amount?: number;
  level?: string;
  description?: string;
  type?: string;
}

export interface FedExShipCurrencyExchangeRate {
  rate?: number;
  fromCurrency?: string;
  intoCurrency?: string;
}

export interface FedExShipRateDiscount {
  amount?: number;
  rateDiscountType?: string;
  percent?: number;
  description?: string;
}

export interface FedExShipShipmentLegRateDetail {
  rateZone?: string;
  pricingCode?: string;
  taxes?: FedExShipTax[];
  totalDimWeight?: FedExShipWeight;
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExShipCurrencyExchangeRate;
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
  surcharges?: FedExShipSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExShipWeight;
  freightDiscounts?: FedExShipRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExShipShipmentRateDetail {
  rateZone?: string;
  ratedWeightMethod?: string;
  totalDutiesTaxesAndFees?: number;
  pricingCode?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  totalDutiesAndTaxes?: number;
  totalAncillaryFeesAndTaxes?: number;
  taxes?: FedExShipTax[];
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExShipCurrencyExchangeRate;
  totalNetFreight?: number;
  totalNetFedExCharge?: number;
  shipmentLegRateDetails?: FedExShipShipmentLegRateDetail[];
  dimDivisor?: number;
  rateType?: string;
  surcharges?: FedExShipSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExShipWeight;
  freightDiscounts?: FedExShipRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalBaseCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExShipMoney1 {
  currency?: string;
  value: "CUSTOMS_VALUE" | "INSURED_VALUE";
}

export interface FedExShipRateDiscount2 {
  rateDiscountType?:
    "BONUS" | "COUPON" | "EARNED" | "INCENTIVE" | "OTHER" | "VOLUME";
  description?: string;
  amount?: FedExShipMoney1;
  percent?: number;
}

export interface FedExShipRebate {
  rebateType?: "BONUS" | "EARNED" | "OTHER";
  description?: string;
  amount?: FedExShipMoney1;
  percent?: number;
}

export interface FedExShipSurcharge2 {
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
  amount?: FedExShipMoney1;
}

export interface FedExShipTax2 {
  taxType?:
    "EXPORT" | "GST" | "HST" | "INTRACOUNTRY" | "OTHER" | "PST" | "SST" | "VAT";
  description?: string;
  amount?: FedExShipMoney1;
}

export interface FedExShipEdtTaxDetail1 {
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
  /** Format: YYYY-MM-DD */
  effectiveDate?: string;
  name?: string;
  taxableValue?: FedExShipMoney1;
  description?: string;
  formula?: string;
  amount?: FedExShipMoney1;
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

export interface FedExShipEdtCommodityTax {
  harmonizedCode?: string;
  taxes?: FedExShipEdtTaxDetail1;
  total?: FedExShipMoney1;
}

export interface FedExShipAncillaryFeeAndTax {
  type?:
    | "CLEARANCE_ENTRY_FEE"
    | "GOODS_AND_SERVICES_TAX"
    | "HARMONIZED_SALES_TAX"
    | "OTHER";
  description?: string;
  amount?: FedExShipMoney1;
}

export interface FedExShipVariableHandlingCharges1 {
  variableHandlingCharge?: FedExShipMoney1;
  fixedVariableHandlingCharge?: FedExShipMoney1;
  percentVariableHandlingCharge?: FedExShipMoney1;
  totalCustomerCharge?: FedExShipMoney1;
}

export interface FedExShipCreateShipmentRating {
  actualRateType?: string;
  shipmentRateDetails?: FedExShipShipmentRateDetail[];
  totalNetTransportationAndPickupCharge?: FedExShipMoney1;
  totalNetFedExTransportationAndPickupCharge?: FedExShipMoney1;
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
    currencyExchangeRate?: FedExShipCurrencyExchangeRate;
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
    totalBaseCharge?: FedExShipMoney1;
    totalFreightDiscounts?: FedExShipMoney1;
    totalNetFreight?: FedExShipMoney1;
    totalSurcharges?: FedExShipMoney1;
    totalNetFedExCharge?: FedExShipMoney1;
    totalTaxes?: FedExShipMoney1;
    totalNetCharge?: FedExShipMoney1;
    totalRebates?: FedExShipMoney1;
    totalDutiesAndTaxes?: FedExShipMoney1;
    totalAncillaryFeesAndTaxes?: FedExShipMoney1;
    totalDutiesTaxesAndFees?: FedExShipMoney1;
    totalNetChargeWithDutiesAndTaxes?: FedExShipMoney1;
    freightDiscounts?: FedExShipRateDiscount2[];
    rebates?: FedExShipRebate[];
    surcharges?: FedExShipSurcharge2[];
    taxes?: FedExShipTax2[];
    dutiesAndTaxes?: FedExShipEdtCommodityTax[];
    ancillaryFeesAndTaxes?: FedExShipAncillaryFeeAndTax[];
    variableHandlingCharges?: FedExShipVariableHandlingCharges1;
    totalVariableHandlingCharges?: FedExShipVariableHandlingCharges1;
  };
}

export interface FedExShipDocumentGenerationDetail {
  letterhead?: string;
  electronicSignature?: string;
  minimumCopiesRequired?: number;
  type?: string;
}

export interface FedExShipDocumentRequirementsDetail {
  requiredDocuments?: string[];
  prohibitedDocuments?: string[];
  generationDetails?: FedExShipDocumentGenerationDetail[];
}

export interface FedExShipPendingShipmentAccessorDetail {
  password?: string;
  role?: string;
  emailLabelUrl?: string;
  userId?: string;
}

export interface FedExShipPendingShipmentAccessDetail {
  accessorDetails?: FedExShipPendingShipmentAccessorDetail[];
}

export interface FedExShipCompletedCreateShipmentDetail {
  completedPackageDetails?: FedExShipCompletedPackageDetail[];
  operationalDetail?: FedExShipShipmentOperationalDetail;
  carrierCode?: string;
  completedHoldAtLocationDetail?: FedExShipCompletedHoldAtLocationDetail;
  completedEtdDetail?: FedExShipCompletedEtdDetail;
  packagingDescription?: string;
  masterTrackingId?: FedExShipMasterTrackingId;
  serviceDescription?: FedExShipServiceDescription;
  usDomestic?: boolean;
  hazardousShipmentDetail?: FedExShipCompletedHazardousShipmentDetail;
  shipmentRating?: FedExShipCreateShipmentRating;
  documentRequirements?: FedExShipDocumentRequirementsDetail;
  exportComplianceStatement?: string;
  accessDetail?: FedExShipPendingShipmentAccessDetail;
}

export interface FedExShipMessageParameter {
  id?: string;
  value?: string;
}

export interface FedExShipMessage {
  code?: string;
  text?: string;
  parameters?: FedExShipMessageParameter[];
  localizedText?: string;
}

export interface FedExShipRegulatoryWaiver {
  advisories?: FedExShipMessage[];
  description?: string;
  id?: string;
}

export interface FedExShipRegulatoryProhibition {
  derivedHarmonizedCode?: string;
  advisory?: FedExShipMessage;
  commodityIndex?: number;
  source?: string;
  categories?: string[];
  type?: string;
  waiver?: FedExShipRegulatoryWaiver;
  status?: string;
}

export interface FedExShipRegulatoryAdvisoryDetail {
  prohibitions?: FedExShipRegulatoryProhibition[];
}

export interface FedExShipShipmentAdvisoryDetails {
  regulatoryAdvisory?: FedExShipRegulatoryAdvisoryDetail;
}

export interface FedExShipCreatedTransactionShipment {
  serviceType?: FedExServiceType;
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  serviceCategory?: string;
  shipmentDocuments?: FedExShipShipmentDocument[];
  pieceResponses?: FedExShipPieceResponse[];
  serviceName?: string;
  alerts?: FedExShipAlert3P[];
  completedShipmentDetail?: FedExShipCompletedCreateShipmentDetail;
  shipmentAdvisoryDetails?: FedExShipShipmentAdvisoryDetails;
  masterTrackingNumber?: string;
}

export interface FedExShipCreateShipmentOutput {
  transactionShipments?: FedExShipCreatedTransactionShipment[];
  jobId?: string;
}
