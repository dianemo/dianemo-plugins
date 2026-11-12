export interface FedExOpenShipTransactionDetail {
  transactionDetails?: string;
  transactionId?: string;
}

export interface FedExOpenShipAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

export interface FedExOpenShipLabelResponse {
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
    | "MERGED_LABELS_ONLY";
  trackingNumber?: string;
  docType?: string;
  alerts?: FedExOpenShipAlert[];
  encodedLabel?: string;
  url?: string;
}

export interface FedExOpenShipCommercialInvoiceCustomerReference {
  customerReferenceType?: "INVOICE_NUMBER" | "P_O_NUMBER";
  value?: string;
}

export interface FedExOpenShipPieceResponse {
  netChargeAmount?: number;
  transactionDetails?: FedExOpenShipTransactionDetail[];
  packageDocuments?: FedExOpenShipLabelResponse[];
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
  netListRateAmount?: number;
  baseRateAmount?: number;
  packageSequenceNumber?: number;
  netDiscountAmount?: number;
  codcollectionAmount?: number;
  masterTrackingNumber?: string;
  acceptanceType?: string;
  trackingNumber?: string;
  successful?: boolean;
  customerReferences?: FedExOpenShipCommercialInvoiceCustomerReference[];
}

export interface FedExOpenShipBinaryBarcode {
  type?: string;
  value?: string;
}

export interface FedExOpenShipStringBarcode {
  type?: string;
  value?: string;
}

export interface FedExOpenShipPackageBarcodes {
  binaryBarcodes?: FedExOpenShipBinaryBarcode[];
  stringBarcodes?: FedExOpenShipStringBarcode[];
}

export interface FedExOpenShipOperationalInstructions {
  number?: number;
  content?: string;
}

export interface FedExOpenShipPackageOperationalDetail {
  astraHandlingText?: string;
  barcodes?: FedExOpenShipPackageBarcodes;
  operationalInstructions?: FedExOpenShipOperationalInstructions[];
}

export interface FedExOpenShipTrackingId {
  formId?: number;
  trackingIdType?: string;
  uspsApplicationId?: number;
  trackingNumber?: string;
}

export interface FedExOpenShipWeightKg {
  units: "KG";
  value: number;
}

export interface FedExOpenShipSurcharge {
  amount?: string | number;
  surchargeType?: string;
  level?: string;
  description?: string;
}

export interface FedExOpenShipPackageRateDetail {
  ratedWeightMethod?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  minimumChargeType?:
    | "CUSTOMER"
    | "CUSTOMER_FREIGHT_WEIGHT"
    | "EARNED_DISCOUNT"
    | "MIXED"
    | "RATE_SCALE";
  baseCharge?: number;
  totalRebates?: number;
  rateType?: string;
  billingWeight?: FedExOpenShipWeightKg;
  netFreight?: number;
  surcharges?: FedExOpenShipSurcharge[];
  totalSurcharges?: number;
  netFedExCharge?: number;
  netCharge?: number;
  currency?: string;
}

export interface FedExOpenShipPackageRating {
  effectiveNetDiscount?: number;
  actualRateType?: string;
  packageRateDetails?: FedExOpenShipPackageRateDetail[];
}

export interface FedExOpenShipHazardousCommodityQuantityDetail {
  quantityType: "GROSS" | "NET";
  amount: number;
  units?: string;
}

export interface FedExOpenShipHazardousCommodityInnerReceptacleDetail01 {
  quantity?: FedExOpenShipHazardousCommodityQuantityDetail;
}

export interface FedExOpenShipHazardousCommodityOptionDetail01 {
  labelTextOption?: "APPEND" | "OVERRIDE" | "STANDARD";
  customerSuppliedLabelText?: string;
}

export interface FedExOpenShipHazardousCommodityPackingDetail01 {
  packingInstructions?: string;
  cargoAircraftOnly: boolean;
}

export interface FedExOpenShipHazardousCommodityDescription01 {
  sequenceNumber?: number;
  processingOptions?: "INCLUDE_SPECIAL_PROVISIONS"[];
  subsidiaryClasses?: string[];
  labelText?: string;
  technicalName?: string;
  packingDetails?: FedExOpenShipHazardousCommodityPackingDetail01;
  authorization?: string;
  reportableQuantity: boolean;
  percentage?: number;
  id?: string;
  packingGroup: "DEFAULT" | "I" | "II" | "III";
  properShippingName?: string;
  hazardClass?: string;
}

export interface FedExOpenShipHazardousCommodityContent001 {
  quantity?: FedExOpenShipHazardousCommodityQuantityDetail;
  innerReceptacles?: FedExOpenShipHazardousCommodityInnerReceptacleDetail01[];
  options?: FedExOpenShipHazardousCommodityOptionDetail01;
  description?: FedExOpenShipHazardousCommodityDescription01;
}

export interface FedExOpenShipValidatedHazardousCommodityDescription {
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

export interface FedExOpenShipNetExplosiveDetail {
  amount?: number;
  units?: string;
  type?: string;
}

export interface FedExOpenShipValidatedHazardousCommodityContent {
  quantity?: FedExOpenShipHazardousCommodityQuantityDetail;
  options?: FedExOpenShipHazardousCommodityContent001;
  description?: FedExOpenShipValidatedHazardousCommodityDescription;
  netExplosiveDetail?: FedExOpenShipNetExplosiveDetail;
  massPoints?: number;
}

export interface FedExOpenShipValidatedHazardousContainer {
  qvalue?: number;
  hazardousCommodities?: FedExOpenShipValidatedHazardousCommodityContent[];
}

export interface FedExOpenShipCompletedHazardousPackageDetail {
  regulation?: string;
  accessibility?: string;
  labelType?: string;
  containers?: FedExOpenShipValidatedHazardousContainer[];
  cargoAircraftOnly?: boolean;
  referenceId?: string;
  radioactiveTransportIndex?: number;
}

export interface FedExOpenShipCompletedPackageDetail {
  sequenceNumber?: number;
  operationalDetail?: FedExOpenShipPackageOperationalDetail;
  signatureOption?: string;
  trackingIds?: FedExOpenShipTrackingId[];
  groupNumber?: number;
  oversizeClass?: string;
  packageRating?: FedExOpenShipPackageRating;
  /** This element is required when SpecialServiceType DRY_ICE is present in the SpecialServiceTypes collection at the package level */
  dryIceWeight?: FedExOpenShipWeightKg;
  hazardousPackageDetail?: FedExOpenShipCompletedHazardousPackageDetail;
}

export interface FedExOpenShipShipmentOperationalDetail {
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
  /** Format YYYY-MM-DD */
  deliveryDate?: string;
  deliveryEligibilities?: string[];
  ineligibleForMoneyBackGuarantee?: boolean;
  maximumTransitTime?: string;
  destinationLocationStateOrProvinceCode?: string;
  astraPlannedServiceLevel?: string;
  destinationLocationId?: string;
  transitTime?: string;
  /** State code is required for US, CA, PR and not required for other countries */
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

export interface FedExOpenShipAddress {
  /** Note: At least one line is required and streetlines more than 3 will be ignored */
  streetLines: string[];
  /** Note: This is conditional and not required in all the requests */
  city?: string;
  /** State code is required for US, CA, PR and not required for other countries */
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExOpenShipContact {
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

export interface FedExOpenShipJustContactAndAddress {
  address?: FedExOpenShipAddress;
  contact?: FedExOpenShipContact;
}

export interface FedExOpenShipCompletedHoldAtLocationDetail {
  holdingLocationType?: string;
  holdingLocation?: FedExOpenShipJustContactAndAddress;
}

export interface FedExOpenShipCompletedUploadDocumentReferenceDetail {
  documentType?:
    | "CERTIFICATE_OF_ORIGIN"
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

export interface FedExOpenShipCompletedEtdDetail {
  folderId?: string;
  type?: string;
  uploadDocumentReferenceDetails?: FedExOpenShipCompletedUploadDocumentReferenceDetail[];
}

export interface FedExOpenShipProductName {
  type?: string;
  encoding?: string;
  value?: string;
}

export interface FedExOpenShipServiceDescription {
  serviceType?: string;
  code?: string;
  names?: FedExOpenShipProductName[];
  operatingOrgCodes?: string[];
  astraDescription?: string;
  description?: string;
  serviceId?: string;
  serviceCategory?: string;
}

export interface FedExOpenShipCompletedHazardousSummaryDetail {
  smallQuantityExceptionPackageCount?: number;
}

export interface FedExOpenShipLicenseOrPermitDetail {
  number?: string;
  /** Format YYYY-MM-DD */
  effectiveDate?: string;
  /** Format YYYY-MM-DD */
  expirationDate?: string;
}

export interface FedExOpenShipAdrLicenseDetail {
  licenseOrPermitDetail?: FedExOpenShipLicenseOrPermitDetail;
}

export interface FedExOpenShipShipmentDryIceProcessingOptionsRequested {
  options?: string[];
}

export interface FedExOpenShipCompletedShipmentDryIceDetail {
  totalWeight: FedExOpenShipWeightKg;
  packageCount: number;
  processingOptions?: FedExOpenShipShipmentDryIceProcessingOptionsRequested;
}

export interface FedExOpenShipCompletedHazardousShipmentDetail {
  hazardousSummaryDetail?: FedExOpenShipCompletedHazardousSummaryDetail;
  adrLicense?: FedExOpenShipAdrLicenseDetail;
  dryIceDetail?: FedExOpenShipCompletedShipmentDryIceDetail;
}

export interface FedExOpenShipTax {
  amount?: number;
  level?: string;
  description?: string;
  type?: string;
}

export interface FedExOpenShipCurrencyExchangeRate {
  rate?: number;
  fromCurrency?: string;
  intoCurrency?: string;
}

export interface FedExOpenShipRateDiscount {
  amount?: number;
  rateDiscountType?: string;
  percent?: number;
  description?: string;
}

export interface FedExOpenShipShipmentLegRateDetail {
  rateZone?: string;
  pricingCode?: string;
  taxes?: FedExOpenShipTax[];
  totalDimWeight?: FedExOpenShipWeightKg;
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExOpenShipCurrencyExchangeRate;
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
  surcharges?: FedExOpenShipSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExOpenShipWeightKg;
  freightDiscounts?: FedExOpenShipRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExOpenShipShipmentRateDetail {
  rateZone?: string;
  ratedWeightMethod?: string;
  totalDutiesTaxesAndFees?: number;
  pricingCode?: string;
  totalFreightDiscounts?: number;
  totalTaxes?: number;
  totalDutiesAndTaxes?: number;
  totalAncillaryFeesAndTaxes?: number;
  taxes?: FedExOpenShipTax[];
  totalRebates?: number;
  fuelSurchargePercent?: number;
  currencyExchangeRate?: FedExOpenShipCurrencyExchangeRate;
  totalNetFreight?: number;
  totalNetFedExCharge?: number;
  shipmentLegRateDetails?: FedExOpenShipShipmentLegRateDetail[];
  dimDivisor?: number;
  rateType?: string;
  surcharges?: FedExOpenShipSurcharge[];
  totalSurcharges?: number;
  totalBillingWeight?: FedExOpenShipWeightKg;
  freightDiscounts?: FedExOpenShipRateDiscount[];
  rateScale?: string;
  totalNetCharge?: number;
  totalBaseCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  currency?: string;
}

export interface FedExOpenShipShipmentRating {
  actualRateType?: string;
  shipmentRateDetails?: FedExOpenShipShipmentRateDetail[];
}

export interface FedExOpenShipDocumentGenerationDetail {
  letterhead?: string;
  electronicSignature?: string;
  minimumCopiesRequired?: number;
  type?: string;
}

export interface FedExOpenShipDocumentRequirementsDetail {
  requiredDocuments?: string[];
  prohibitedDocuments?: string[];
  generationDetails?: FedExOpenShipDocumentGenerationDetail[];
}

export interface FedExOpenShipPendingShipmentAccessorDetail {
  password?: string;
  role?: string;
  emailLabelUrl?: string;
  userId?: string;
}

export interface FedExOpenShipPendingShipmentAccessDetail {
  accessorDetails?: FedExOpenShipPendingShipmentAccessorDetail[];
}

export interface FedExOpenShipCompletedShipmentDetail {
  completedPackageDetails?: FedExOpenShipCompletedPackageDetail[];
  operationalDetail?: FedExOpenShipShipmentOperationalDetail;
  carrierCode?: string;
  completedHoldAtLocationDetail?: FedExOpenShipCompletedHoldAtLocationDetail;
  completedEtdDetail?: FedExOpenShipCompletedEtdDetail;
  packagingDescription?: string;
  masterTrackingId?: FedExOpenShipTrackingId;
  serviceDescription?: FedExOpenShipServiceDescription;
  usDomestic?: boolean;
  hazardousShipmentDetail?: FedExOpenShipCompletedHazardousShipmentDetail;
  shipmentRating?: FedExOpenShipShipmentRating;
  documentRequirements?: FedExOpenShipDocumentRequirementsDetail;
  exportComplianceStatement?: string;
  accessDetail?: FedExOpenShipPendingShipmentAccessDetail;
}

export interface FedExOpenShipSuggestedCommodityDetail {
  description?: string;
  harmonizedCode?: string;
}

export interface FedExOpenShipCommodityClarificationDetail {
  commodityIndex?: number;
  suggestions?: FedExOpenShipSuggestedCommodityDetail[];
}

export interface FedExOpenShipMessageParameter {
  id?: string;
  value?: string;
}

export interface FedExOpenShipMessage {
  code?: string;
  text?: string;
  parameters?: FedExOpenShipMessageParameter[];
  localizedText?: string;
}

export interface FedExOpenShipRegulatoryWaiver {
  advisories?: FedExOpenShipMessage[];
  description?: string;
  id?: string;
}

export interface FedExOpenShipRegulatoryProhibition {
  derivedHarmonizedCode?: string;
  advisory?: FedExOpenShipMessage;
  commodityIndex?: number;
  source?: string;
  categories?: string[];
  type?: string;
  waiver?: FedExOpenShipRegulatoryWaiver;
  status?: string;
}

export interface FedExOpenShipRegulatoryAdvisoryDetail {
  commodityClarifications?: FedExOpenShipCommodityClarificationDetail[];
  prohibitions?: FedExOpenShipRegulatoryProhibition[];
}

export interface FedExOpenShipShipmentAdvisoryDetails {
  regulatoryAdvisory?: FedExOpenShipRegulatoryAdvisoryDetail;
}

export interface FedExOpenShipTransactionOpenShipmentOutput {
  serviceType?: string;
  /** Format YYYY-MM-DD */
  shipDatestamp?: string;
  serviceCategory?: string;
  pieceResponses?: FedExOpenShipPieceResponse[];
  serviceName?: string;
  alerts?: FedExOpenShipAlert[];
  completedShipmentDetail?: FedExOpenShipCompletedShipmentDetail;
  shipmentAdvisoryDetails?: FedExOpenShipShipmentAdvisoryDetails;
  masterTrackingNumber?: string;
}

export interface FedExOpenShipCreateOpenShipmentOutput {
  asynchronousProcessingResultsDetail?: string;
  jobId?: string;
  transactionShipments?: FedExOpenShipTransactionOpenShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipModifyOpenShipmentOutput {
  asynchronousProcessingResultsDetail?: string;
  jobId?: string;
  transactionShipments?: FedExOpenShipTransactionOpenShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipTransactionShipmentOutput {
  serviceType?: string;
  /** Format YYYY-MM-DD */
  shipDatestamp?: string;
  serviceCategory?: string;
  shipmentDocuments?: FedExOpenShipLabelResponse[];
  pieceResponses?: FedExOpenShipPieceResponse[];
  serviceName?: string;
  alerts?: FedExOpenShipAlert[];
  completedShipmentDetail?: FedExOpenShipCompletedShipmentDetail;
  shipmentAdvisoryDetails?: FedExOpenShipShipmentAdvisoryDetails;
  masterTrackingNumber?: string;
}

export interface FedExOpenShipConfirmOpenShipmentOutput {
  jobId?: string;
  transactionShipments?: FedExOpenShipTransactionShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipModifyOpenShipmentPackagesOutput {
  transactionShipments?: FedExOpenShipTransactionShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipAddOpenShipmentPackagesOutput {
  transactionShipments?: FedExOpenShipTransactionShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipDeleteOpenShipmentPackagesOutput {
  deletedPackagesFromOpenshipment?: boolean;
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipPackageCustomerReference {
  customerReferenceType?:
    | "CUSTOMER_REFERENCE"
    | "DEPARTMENT_NUMBER"
    | "INVOICE_NUMBER"
    | "P_O_NUMBER"
    | "INTRACOUNTRY_REGULATORY_REFERENCE"
    | "RMA_ASSOCIATION";
  value?: string;
}

export interface FedExOpenShipMoney {
  amount?: number;
  currency?: string;
}

export interface FedExOpenShipWeight {
  units: "KG" | "LB";
  value: number;
}

export interface FedExOpenShipDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExOpenShipContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface FedExOpenShipVariableHandlingChargeDetail {
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

export interface FedExOpenShipPriorityAlertDetail {
  enhancementTypes?: string[];
  content?: string[];
}

export interface FedExOpenShipSignatureOptionDetail {
  signatureReleaseNumber?: string;
}

export interface FedExOpenShipAlcoholDetail {
  alcoholRecipientType?: "LICENSEE" | "CONSUMERstomer";
  shipperAgreementType?: string;
}

export interface FedExOpenShipDangerousGoodsDetail {
  accessibility?: "ACCESSIBLE" | "INACCESSIBLE";
  cargoAircraftOnly?: boolean;
  regulation?: "ADR" | "DOT" | "IATA" | "ORMD";
  options?: (
    | "HAZARDOUS_MATERIALS"
    | "BATTERY"
    | "ORM_D"
    | "REPORTABLE_QUANTITIES"
    | "SMALL_QUANTITY_EXCEPTION"
    | "LIMITED_QUANTITIES_COMMODITIES"
  )[];
}

export interface FedExOpenShipPackageCODDetail {
  codCollectionAmount?: FedExOpenShipMoney;
}

export interface FedExOpenShipBatteryDetail {
  batteryPackingType?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
  batteryRegulatoryType?: "IATA_SECTION_II";
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExOpenShipStandaloneBatteryDetails {
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExOpenShipPackageSpecialServicesRequested {
  specialServiceTypes?: string[];
  signatureOptionType?:
    | "SERVICE_DEFAULT"
    | "NO_SIGNATURE_REQUIRED"
    | "INDIRECT"
    | "DIRECT"
    | "ADULT";
  priorityAlertDetail?: FedExOpenShipPriorityAlertDetail;
  signatureOptionDetail?: FedExOpenShipSignatureOptionDetail;
  alcoholDetail?: FedExOpenShipAlcoholDetail;
  dangerousGoodsDetail?: FedExOpenShipDangerousGoodsDetail;
  packageCODDetail?: FedExOpenShipPackageCODDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExOpenShipBatteryDetail[];
  dryIceWeight?: FedExOpenShipWeight;
  standaloneBatteryDetails?: FedExOpenShipStandaloneBatteryDetails[];
}

export interface FedExOpenShipRequestedPackageLineItem {
  sequenceNumber?: string;
  subPackagingType?: string;
  customerReferences?: FedExOpenShipPackageCustomerReference[];
  declaredValue?: FedExOpenShipMoney;
  weight: FedExOpenShipWeight;
  /** Dimensions are required when using a Express freight service */
  dimensions?: FedExOpenShipDimensions;
  groupPackageCount?: number;
  itemDescriptionForClearance?: string;
  contentRecord?: FedExOpenShipContentRecord[];
  /** Note: Item description is required for Email Label return shipments and ground Create tag */
  itemDescription?: string;
  variableHandlingChargeDetail?: FedExOpenShipVariableHandlingChargeDetail;
  packageSpecialServices?: FedExOpenShipPackageSpecialServicesRequested;
}

export interface FedExOpenShipRetrieveOpenShipmentPackagesOutput {
  requestedpackageLineItem?: FedExOpenShipRequestedPackageLineItem;
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipDeleteOpenShipmentOutput {
  deletedOpenshipment?: boolean;
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipPartyAddress {
  /** At least one line is required for a valid physical address */
  streetLines: string[];
  /** Note: This is conditional and not required in all the requests */
  city: string;
  stateOrProvinceCode: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExOpenShipPartyContact {
  personName?: string;
  emailAddress?: string;
  phoneExtension?: string;
  phoneNumber: string;
  companyName?: string;
}

export interface FedExOpenShipTaxpayerIdentification {
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

export interface FedExOpenShipShipperParty {
  address: FedExOpenShipPartyAddress;
  contact: FedExOpenShipPartyContact;
  tins?: FedExOpenShipTaxpayerIdentification[];
}

export interface FedExOpenShipRecipientsParty {
  address: FedExOpenShipPartyAddress;
  contact: FedExOpenShipPartyContact;
  tins?: FedExOpenShipTaxpayerIdentification[];
  deliveryInstructions?: string;
}

export interface FedExOpenShipPartyContactOptional {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
}

export interface FedExOpenShipPartyAddressOptional {
  /** Note: At least one line is required and streetlines more than 3 will be ignored */
  streetLines?: string[];
  /** Note: This is conditional and not required in all the requests */
  city?: string;
  /** State code is required for US, CA, PR and not required for other countries */
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
}

export interface FedExOpenShipContactAndAddress {
  contact?: FedExOpenShipPartyContactOptional;
  address?: FedExOpenShipPartyAddressOptional;
}

export interface FedExOpenShipPartyAccountNumber {
  /** Conditional */
  value?: string;
}

export interface FedExOpenShipResponsiblePartyParty {
  address?: FedExOpenShipPartyAddress;
  contact?: FedExOpenShipPartyContact;
  accountNumber?: FedExOpenShipPartyAccountNumber;
}

export interface FedExOpenShipPayor {
  responsibleParty: FedExOpenShipResponsiblePartyParty;
}

export interface FedExOpenShipPayment {
  /** Note: This is required for Express, Ground and SmartPost shipments */
  paymentType: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
  payor?: FedExOpenShipPayor;
}

export interface FedExOpenShipETDDetail {
  attributes?: "POST_SHIPMENT_UPLOAD_REQUESTED"[];
  /** This object is required if the documents are uploaded Pre-Shipment uploaded documents */
  attachedDocuments?: FedExOpenShipCompletedUploadDocumentReferenceDetail[];
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

export interface FedExOpenShipReturnEmailDetail {
  merchantPhoneNumber: string;
  allowedSpecialService?: ("SATURDAY_DELIVERY" | "SATURDAY_PICKUP")[];
}

export interface FedExOpenShipReturnMerchandiseAuthorization {
  reason?: string;
}

export interface FedExOpenShipReturnAssociationDetail {
  /** Format YYYY-MM-DD */
  shipDatestamp?: string;
  trackingNumber?: string;
}

export interface FedExOpenShipReturnShipmentDetail {
  returnEmailDetail?: FedExOpenShipReturnEmailDetail;
  rma?: FedExOpenShipReturnMerchandiseAuthorization;
  returnAssociationDetail?: FedExOpenShipReturnAssociationDetail;
  returnType: "PENDING" | "PRINT_RETURN_LABEL";
}

/** The spec's `allOf` override on this path requires all three of `companyName`, `personName` and `phoneNumber`. */
export interface FedExOpenShipDeliveryOnInvoiceRecipientContact {
  companyName: string;
  personName: string;
  phoneNumber: string;
  emailAddress?: string;
  phoneExtension?: string;
  faxNumber?: string;
}

export interface FedExOpenShipDeliveryOnInvoiceAcceptanceDetail {
  recipient?: {
    address: FedExOpenShipPartyAddress;
    contact: FedExOpenShipDeliveryOnInvoiceRecipientContact;
    tins?: FedExOpenShipTaxpayerIdentification[];
    deliveryInstructions?: string;
  };
}

export interface FedExOpenShipInternationalTrafficInArmsRegulationsDetail {
  licenseOrExemptionNumber: string;
}

export interface FedExOpenShipPendingShipmentProcessingOptionsRequested {
  options?: "ALLOW_MODIFICATIONS"[];
}

export interface FedExOpenShipRecommendedDocumentSpecification {
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

export interface FedExOpenShipEmailOptionsRequested {
  options?: (
    | "PRODUCE_PAPERLESS_SHIPPING_FORMAT"
    | "SUPPRESS_ADDITIONAL_LANGUAGES"
    | "SUPPRESS_ACCESS_EMAILS"
  )[];
}

export interface FedExOpenShipEmailRecipient {
  emailAddress: string;
  optionsRequested?: FedExOpenShipEmailOptionsRequested;
  role: "SHIPMENT_COMPLETOR" | "SHIPMENT_INITIATOR";
  locale?: string;
}

export interface FedExOpenShipEmailLabelDetail {
  recipients?: FedExOpenShipEmailRecipient[];
  message?: string;
}

export interface FedExOpenShipUploadDocumentReferenceDetail {
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

export interface FedExOpenShipPendingShipmentDetail {
  pendingShipmentType: "EMAIL";
  processingOptions?: FedExOpenShipPendingShipmentProcessingOptionsRequested;
  recommendedDocumentSpecification?: FedExOpenShipRecommendedDocumentSpecification;
  emailLabelDetail: FedExOpenShipEmailLabelDetail;
  attachedDocuments?: FedExOpenShipUploadDocumentReferenceDetail[];
  expirationTimeStamp?: string;
}

export interface FedExOpenShipHoldAtLocationDetail {
  locationId: string;
  locationContactAndAddress?: FedExOpenShipContactAndAddress;
  locationType?:
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_STAFFED"
    | "RETAIL_ALLICANCE_LOCATION"
    | "FEDEX_GROUND_TERMINAL"
    | "FEDEX_ONSITE";
}

export interface FedExOpenShipCODTransportationChargesDetail {
  rateType?: "ACCOUNT" | "CURRENT" | "CUSTOM";
  rateLevelType?: "BUNDLED_RATE" | "INDIVIDUAL_PACKAGE_RATE";
  chargeLevelType?: "CURRENT_PACKAGE" | "SUM_OF_PACKAGES";
  chargeType?:
    "COD_SURCHARGE" | "NET_CHARGE" | "NET_FREIGHT" | "TOTAL_CUSTOMER_CHARGE";
}

export interface FedExOpenShipParty {
  address?: FedExOpenShipPartyAddress;
  contact?: FedExOpenShipPartyContact;
  accountNumber?: FedExOpenShipPartyAccountNumber;
  tins?: FedExOpenShipTaxpayerIdentification[];
}

export interface FedExOpenShipShipmentCODDetail {
  addTransportationChargesDetail?: FedExOpenShipCODTransportationChargesDetail;
  codRecipient?: FedExOpenShipParty;
  remitToName?: string;
  codCollectionType:
    "ANY" | "CASH" | "GUARANTEED_FUNDS" | "COMPANY_CHECK" | "PERSONAL_CHECK";
  financialInstitutionContactAndAddress?: FedExOpenShipContactAndAddress;
  codCollectionAmount?: FedExOpenShipMoney;
  returnReferenceIndicatorType?: "INVOICE" | "PO" | "REFERENCE" | "TRACKING";
  shipmentCodAmount?: FedExOpenShipMoney;
}

export interface FedExOpenShipShipmentDryIceDetail {
  totalWeight?: FedExOpenShipWeight;
  packageCount?: number;
}

export interface FedExOpenShipInternationalControlledExportDetail {
  /** Format YYYY-MM-DD */
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
    | "WAREHOUSE_WITHDRAWAL";
}

export interface FedExOpenShipPhoneNumber {
  areaCode?: string;
  localNumber?: string;
  extension?: string;
  personalIdentificationNumber?: string;
}

export interface FedExOpenShipHomeDeliveryPremiumDetail {
  phoneNumber?: FedExOpenShipPhoneNumber;
  deliveryDate?: string;
  homedeliveryPremiumType?: "APPOINTMENT" | "DATE_CERTAIN" | "EVENING";
}

export interface FedExOpenShipShipmentSpecialServicesRequested {
  specialServiceTypes?: string[];
  etdDetail?: FedExOpenShipETDDetail;
  returnShipmentDetail?: FedExOpenShipReturnShipmentDetail;
  deliveryOnInvoiceAcceptanceDetail?: FedExOpenShipDeliveryOnInvoiceAcceptanceDetail;
  internationalTrafficInArmsRegulationsDetail?: FedExOpenShipInternationalTrafficInArmsRegulationsDetail;
  pendingShipmentDetail?: FedExOpenShipPendingShipmentDetail;
  holdAtLocationDetail?: FedExOpenShipHoldAtLocationDetail;
  shipmentCODDetail?: FedExOpenShipShipmentCODDetail;
  shipmentDryIceDetail?: FedExOpenShipShipmentDryIceDetail;
  internationalControlledExportDetail?: FedExOpenShipInternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: FedExOpenShipHomeDeliveryPremiumDetail;
}

export interface FedExOpenShipRetrievedEmailNotificationRecipient {
  name?: string;
  emailNotificationRecipientType:
    | "BROKER"
    | "OTHER"
    | "RECIPIENT"
    | "SHIPPER"
    | "THIRD_PARTY"
    | "OTHER1"
    | "OTHER2";
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

export interface FedExOpenShipRetrievedEmailNotificationDetail {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExOpenShipRetrievedEmailNotificationRecipient[];
  personalMessage?: string;
}

export interface FedExOpenShipExpressFreightDetail {
  bookingConfirmationNumber?: number;
  shippersLoadAndCount?: number;
  packingListEnclosed?: boolean;
}

export interface FedExOpenShipBrokerDetail {
  broker?: {
    address: FedExOpenShipPartyAddress;
    contact: FedExOpenShipPartyContact;
    accountNumber?: FedExOpenShipPartyAccountNumber;
    tins?: FedExOpenShipTaxpayerIdentification[];
  };
  type?: "IMPORT";
}

export interface FedExOpenShipEmailDispositionDetail {
  emailAddress?: string;
  type?: string;
  recipientType?: string;
}

export interface FedExOpenShipCommercialInvoice {
  originatorName?: string;
  comments?: string[];
  customerReferences?: FedExOpenShipCommercialInvoiceCustomerReference[];
  taxesOrMiscellaneousCharge?: FedExOpenShipMoney;
  taxesOrMiscellaneousChargeType?:
    | "COMMISSIONS"
    | "DISCOUNTS"
    | "HANDLING_FEES"
    | "OTHER"
    | "ROYALTIES_AND_LICENSE_FEES"
    | "TAXES";
  freightCharge?: FedExOpenShipMoney;
  packingCosts?: FedExOpenShipMoney;
  handlingCosts?: FedExOpenShipMoney;
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
  emailNotificationDetail?: FedExOpenShipEmailDispositionDetail;
}

export interface FedExOpenShipDutiesResponsibleParty {
  address?: FedExOpenShipPartyAddressOptional;
  contact?: FedExOpenShipPartyContactOptional;
  accountNumber?: FedExOpenShipPartyAccountNumber;
  tins?: FedExOpenShipTaxpayerIdentification[];
}

export interface FedExOpenShipDutiesPayor {
  responsibleParty?: FedExOpenShipDutiesResponsibleParty;
}

export interface FedExOpenShipBillingDetails {
  billingCode?: string;
  billingType?: string;
  aliasId?: string;
  accountNickname?: string;
  accountNumber?: string;
  accountNumberCountryCode?: string;
}

export interface FedExOpenShipDutiesPayment {
  payor?: FedExOpenShipDutiesPayor;
  billingDetails?: FedExOpenShipBillingDetails;
  paymentType?: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
}

export interface FedExOpenShipAdditionalMeasures {
  quantity?: number;
  units?: string;
}

export interface FedExOpenShipUsmcaDetail {
  originCriterion?: "A" | "B" | "C" | "D" | "E";
}

export interface FedExOpenShipClearanceItemDetailContact {
  companyName?: string;
}

export interface FedExOpenShipClearanceItemDetail {
  role?: "MANUFACTURER";
  id?: string;
  contact?: FedExOpenShipClearanceItemDetailContact;
  address?: FedExOpenShipPartyAddressOptional;
}

export interface FedExOpenShipCommodity {
  unitPrice?: FedExOpenShipMoney;
  additionalMeasures?: FedExOpenShipAdditionalMeasures[];
  numberOfPieces?: number;
  quantity?: number;
  quantityUnits?: string;
  customsValue?: FedExOpenShipMoney;
  /** This is required for International shipments */
  countryOfManufacture?: string;
  cIMarksAndNumbers?: string;
  harmonizedCode?: string;
  description: string;
  name?: string;
  weight?: FedExOpenShipWeight;
  exportLicenseNumber?: string;
  /** Format YYYY-MM-DD */
  exportLicenseExpirationDate?: string;
  partNumber?: string;
  purpose?: "BUSINESS" | "CONSUMER";
  usmcaDetail?: FedExOpenShipUsmcaDetail;
  clearanceItemDetail?: FedExOpenShipClearanceItemDetail[];
}

export interface FedExOpenShipRecipientCustomsId {
  type?: "COMPANY" | "INDIVIDUAL" | "PASSPORT";
  value?: string;
}

export interface FedExOpenShipCustomsOptionDetail {
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

export interface FedExOpenShipDestinationControlDetail {
  /** Its is required if StatementTypes is entered as DEPARTMENT_OF_STATE */
  endUser?: string;
  statementTypes: "DEPARTMENT_OF_COMMERCE" | "DEPARTMENT_OF_STATE";
  destinationCountries?: string[];
}

export interface FedExOpenShipExportDetail {
  destinationControlDetail?: FedExOpenShipDestinationControlDetail;
  b13AFilingOption?:
    | "NOT_REQUIRED"
    | "MANUALLY_ATTACHED"
    | "FILED_ELECTRONICALLY"
    | "SUMMARY_REPORTING"
    | "FEDEX_TO_STAMP";
  exportComplianceStatement?: string;
  permitNumber?: string;
}

export interface FedExOpenShipUsmcaLowValueStatementDetail {
  countryOfOriginLowValueDocumentRequested?: boolean;
  customsRole: "EXPORTER" | "IMPORTER";
}

export interface FedExOpenShipCustomsDeclarationStatementDetail {
  usmcaLowValueStatementDetail: FedExOpenShipUsmcaLowValueStatementDetail;
}

export interface FedExOpenShipCustomsClearanceDetail {
  regulatoryControls?: (
    | "FOOD_OR_PERISHABLE"
    | "USMCA"
    | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
    | "NOT_IN_FREE_CIRCULATION"
  )[];
  brokers?: FedExOpenShipBrokerDetail[];
  commercialInvoice: FedExOpenShipCommercialInvoice;
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
  dutiesPayment?: FedExOpenShipDutiesPayment;
  commodities: FedExOpenShipCommodity[];
  isDocumentOnly?: boolean;
  recipientCustomsId?: FedExOpenShipRecipientCustomsId;
  customsOption?: FedExOpenShipCustomsOptionDetail;
  importerOfRecord?: FedExOpenShipParty;
  generatedDocumentLocale?: string;
  exportDetail?: FedExOpenShipExportDetail;
  totalCustomsValue?: FedExOpenShipMoney;
  partiesToTransactionAreRelated?: boolean;
  declarationStatementDetail?: FedExOpenShipCustomsDeclarationStatementDetail;
  insuranceCharge?: FedExOpenShipMoney;
}

export interface FedExOpenShipSmartPostInfoDetail {
  /** Is required for Presorted Standard but not for returns or parcel select */
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

export interface FedExOpenShipRegulatoryLabelContentDetail {
  generationOptions?:
    | "CONTENT_ON_SHIPPING_LABEL_PREFERRED"
    | "CONTENT_ON_SUPPLEMENTAL_LABEL_ONLY"
    | "CONTENT_ON_SHIPPING_LABEL_ONLY";
  type?: "ALCOHOL_SHIPMENT_LABEL";
}

export interface FedExOpenShipAdditionalLabelsDetail {
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

export interface FedExOpenShipDocTabZoneSpecification {
  zoneNumber?: number;
  header?: string;
  dataField?: string;
  literalValue?: string;
  justification?: "LEFT" | "RIGHT";
}

export interface FedExOpenShipDocTabContentZone001 {
  docTabZoneSpecifications?: FedExOpenShipDocTabZoneSpecification[];
}

export interface FedExOpenShipDocTabContentBarcoded {
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
  specification?: FedExOpenShipDocTabZoneSpecification;
}

export interface FedExOpenShipDocTabContent {
  docTabContentType?:
    "BARCODED" | "CUSTOM" | "MINIMUM" | "STANDARD" | "ZONE001";
  zone001?: FedExOpenShipDocTabContentZone001;
  barcoded?: FedExOpenShipDocTabContentBarcoded;
}

export interface FedExOpenShipCustomerSpecifiedLabelDetail {
  maskedData?: (
    | "CUSTOMS_VALUE"
    | "DIMENSIONS"
    | "DUTIES_AND_TAXES_PAYOR_ACCOUNT_NUMBER"
    | "INSURED_VALUE"
    | "SECONDARY_BARCODE"
    | "SHIPPER_INFORMATION"
    | "TERMS_AND_CONDITIONS"
    | "TOTAL_WEIGHT"
    | "TRANSPORTATION_CHARGES_PAYOR_ACCOUNT_NUMBER"
  )[];
  regulatoryLabels?: FedExOpenShipRegulatoryLabelContentDetail[];
  additionalLabels?: FedExOpenShipAdditionalLabelsDetail[];
  docTabContent?: FedExOpenShipDocTabContent;
}

export interface FedExOpenShipLabelSpecification {
  labelFormatType?: "COMMON2D" | "LABEL_DATA_ONLY";
  labelOrder?: "SHIPPING_LABEL_FIRST" | "SHIPPING_LABEL_LAST";
  customerSpecifiedDetail?: FedExOpenShipCustomerSpecifiedLabelDetail;
  printedLabelOrigin?: FedExOpenShipContactAndAddress;
  labelStockType:
    | "PAPER_4X6"
    | "PAPER_4X675"
    | "PAPER_4X8"
    | "PAPER_4X9"
    | "PAPER_7X475"
    | "PAPER_85X11_BOTTOM_HALF_LABEL"
    | "PAPER_85X11_TOP_HALF_LABEL"
    | "PAPER_LETTER"
    | "STOCK_4X85_TRAILING_DOC_TAB"
    | "STOCK_4X105_TRAILING_DOC_TAB"
    | "STOCK_4X675_LEADING_DOC_TAB"
    | "STOCK_4X8"
    | "STOCK_4X9_LEADING_DOC_TAB"
    | "STOCK_4X6"
    | "STOCK_4X675_TRAILING_DOC_TAB"
    | "STOCK_4X9_TRAILING_DOC_TAB"
    | "STOCK_4X675"
    | "STOCK_4X9";
  labelRotation?: "LEFT" | "RIGHT" | "UPSIDE_DOWN" | "NONE";
  imageType: "ZPLII" | "EPL2" | "PDF" | "PNG";
  labelPrintingOrientation?:
    "BOTTOM_EDGE_OF_TEXT_FIRST" | "TOP_EDGE_OF_TEXT_FIRST";
  returnedDispositionDetail?: boolean;
  resolution?: number;
}

export interface FedExOpenShipDocumentFormatOptionsRequested {
  options?: (
    | "SHIPPING_LABEL_FIRST"
    | "SHIPPING_LABEL_LAST"
    | "SUPPRESS_ADDITIONAL_LANGUAGES"
  )[];
}

export interface FedExOpenShipShippingDocumentEmailRecipient {
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

export interface FedExOpenShipShippingDocumentEmailDetail {
  eMailRecipients: FedExOpenShipShippingDocumentEmailRecipient[];
  locale?: string;
  grouping?: "BY_RECIPIENT" | "NONE";
}

export interface FedExOpenShipShippingDocumentDispositionDetail {
  eMailDetail?: FedExOpenShipShippingDocumentEmailDetail;
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

export interface FedExOpenShipShippingDocumentFormat {
  provideInstructions?: boolean;
  optionsRequested?: FedExOpenShipDocumentFormatOptionsRequested;
  stockType?: "PAPER_LETTER";
  dispositions?: FedExOpenShipShippingDocumentDispositionDetail[];
  locale?: string;
  docType?: "PDF";
}

export interface FedExOpenShipGeneralAgencyAgreementDetail {
  documentFormat?: FedExOpenShipShippingDocumentFormat;
}

export interface FedExOpenShipReturnShippingDocumentFormat {
  provideInstructions?: boolean;
  optionsRequested?: FedExOpenShipDocumentFormatOptionsRequested;
  stockType?: "PAPER_LETTER";
  dispositions?: FedExOpenShipShippingDocumentDispositionDetail[];
  locale?: string;
  docType?: "PNG" | "PDF";
}

export interface FedExOpenShipReturnInstructionsDetail {
  customText?: string;
  documentFormat?: FedExOpenShipReturnShippingDocumentFormat;
}

export interface FedExOpenShipCustomerImageUsage {
  id?: "IMAGE_1" | "IMAGE_2" | "IMAGE_3" | "IMAGE_4" | "IMAGE_5";
  type?: "SIGNATURE";
  providedImageType?: "LETTER_HEAD" | "SIGNATURE";
}

export interface FedExOpenShipOp900Detail {
  customerImageUsages?: FedExOpenShipCustomerImageUsage[];
  signatureName?: string;
  documentFormat?: FedExOpenShipShippingDocumentFormat;
}

export interface FedExOpenShipUsmcaProducerAddress {
  /** Note: At least one line is required */
  streetLines?: string[];
  city?: string;
  /** State code is required for US, CA, PR and not required for other countries */
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
  geographicCoordinates?: string;
}

export interface FedExOpenShipUsmcaProducerParty {
  address?: FedExOpenShipUsmcaProducerAddress;
  contact?: FedExOpenShipPartyContactOptional;
  tins?: FedExOpenShipTaxpayerIdentification[];
}

export interface FedExOpenShipRetrieveDateRange {
  begins?: string;
  ends?: string;
}

export interface FedExOpenShipUsmcaCertificationOfOriginDetail {
  customerImageUsages?: FedExOpenShipCustomerImageUsage[];
  documentFormat?: FedExOpenShipShippingDocumentFormat;
  certifierSpecification?: "EXPORTER" | "IMPORTER" | "PRODUCER";
  importerSpecification?: "UNKNOWN" | "VARIOUS";
  producerSpecification?:
    "AVAILABLE_UPON_REQUEST" | "VARIOUS" | "SAME_AS_EXPORTER";
  producer?: FedExOpenShipUsmcaProducerParty;
  blanketPeriod?: FedExOpenShipRetrieveDateRange;
  certifierJobTitle?: string;
}

export interface FedExOpenShipUsmcaCommercialInvoiceCertificationOfOriginDetail {
  customerImageUsages?: FedExOpenShipCustomerImageUsage[];
  documentFormat?: FedExOpenShipShippingDocumentFormat;
  certifierSpecification?: "EXPORTER" | "IMPORTER" | "PRODUCER";
  importerSpecification?: "UNKNOWN" | "VARIOUS";
  producerSpecification?:
    "AVAILABLE_UPON_REQUEST" | "VARIOUS" | "SAME_AS_EXPORTER";
  producer?: FedExOpenShipUsmcaProducerParty;
  certifierJobTitle?: string;
}

export interface FedExOpenShipCertificateOfOriginDetail {
  customerImageUsages?: FedExOpenShipCustomerImageUsage[];
  documentFormat?: FedExOpenShipShippingDocumentFormat;
}

export interface FedExOpenShipCommercialInvoiceDetail {
  customerImageUsages?: FedExOpenShipCustomerImageUsage[];
  documentFormat?: FedExOpenShipShippingDocumentFormat;
}

export interface FedExOpenShipShippingDocumentSpecification {
  generalAgencyAgreementDetail?: FedExOpenShipGeneralAgencyAgreementDetail;
  returnInstructionsDetail?: FedExOpenShipReturnInstructionsDetail;
  op900Detail?: FedExOpenShipOp900Detail;
  usmcaCertificationOfOriginDetail?: FedExOpenShipUsmcaCertificationOfOriginDetail;
  usmcaCommercialInvoiceCertificationOfOriginDetail?: FedExOpenShipUsmcaCommercialInvoiceCertificationOfOriginDetail;
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
  certificateOfOrigin?: FedExOpenShipCertificateOfOriginDetail;
  commercialInvoiceDetail?: FedExOpenShipCommercialInvoiceDetail;
}

export interface FedExOpenShipMasterTrackingId {
  formId?: string;
  trackingIdType?: string;
  uspsApplicationId?: string;
  trackingNumber?: string;
}

export interface FedExOpenShipRetrievedRequestedShipment {
  /** Format YYYY-MM-DD */
  shipDatestamp?: string;
  totalDeclaredValue?: FedExOpenShipMoney;
  shipper: FedExOpenShipShipperParty;
  recipients: FedExOpenShipRecipientsParty[];
  recipientLocationNumber?: string;
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  serviceType: string;
  packagingType: string;
  totalWeight?: number;
  origin?: FedExOpenShipContactAndAddress;
  shippingChargesPayment: FedExOpenShipPayment;
  shipmentSpecialServices?: FedExOpenShipShipmentSpecialServicesRequested;
  emailNotificationDetail?: FedExOpenShipRetrievedEmailNotificationDetail;
  expressFreightDetail?: FedExOpenShipExpressFreightDetail;
  variableHandlingChargeDetail?: FedExOpenShipVariableHandlingChargeDetail;
  customsClearanceDetail?: FedExOpenShipCustomsClearanceDetail;
  smartPostInfoDetail?: FedExOpenShipSmartPostInfoDetail;
  blockInsightVisibility?: boolean;
  labelSpecification: FedExOpenShipLabelSpecification;
  shippingDocumentSpecification?: FedExOpenShipShippingDocumentSpecification;
  rateRequestType?: (
    "LIST" | "NONE" | "PREFERRED" | "ACCOUNT" | "INCENTIVE" | "RETAIL"
  )[];
  preferredCurrency?: string;
  totalPackageCount?: number;
  masterTrackingId?: FedExOpenShipMasterTrackingId;
  /** At least one instance containing the weight for at least one package is required for EXPRESS and GROUND shipments */
  requestedPackageLineItems: FedExOpenShipRequestedPackageLineItem[];
}

export interface FedExOpenShipRetrieveOpenShipmentOutput {
  requestedShipment?: FedExOpenShipRetrievedRequestedShipment;
  alerts?: FedExOpenShipAlert[];
}

export interface FedExOpenShipGetOpenShipmentResultsOutput {
  transactionShipments?: FedExOpenShipTransactionShipmentOutput[];
  alerts?: FedExOpenShipAlert[];
}

export type FedExOpenShipAccountNumber = FedExOpenShipPartyAccountNumber;

export interface FedExOpenShipSoldToParty {
  address?: FedExOpenShipPartyAddress;
  contact?: FedExOpenShipPartyContact;
  tins?: FedExOpenShipTaxpayerIdentification[];
  accountNumber?: FedExOpenShipAccountNumber;
}

export interface FedExOpenShipOpenShipmentSpecialServicesRequested {
  specialServiceTypes?: string[];
  etdDetail?: FedExOpenShipETDDetail;
  deliveryOnInvoiceAcceptanceDetail?: FedExOpenShipDeliveryOnInvoiceAcceptanceDetail;
  internationalTrafficInArmsRegulationsDetail?: FedExOpenShipInternationalTrafficInArmsRegulationsDetail;
  holdAtLocationDetail?: FedExOpenShipHoldAtLocationDetail;
  shipmentCODDetail?: FedExOpenShipShipmentCODDetail;
  shipmentDryIceDetail?: FedExOpenShipShipmentDryIceDetail;
  internationalControlledExportDetail?: FedExOpenShipInternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: FedExOpenShipHomeDeliveryPremiumDetail;
}

export interface FedExOpenShipEmailNotificationRecipient {
  name?: string;
  emailNotificationRecipientType:
    | "BROKER"
    | "OTHER"
    | "RECIPIENT"
    | "SHIPPER"
    | "THIRD_PARTY"
    | "OTHER1"
    | "OTHER2";
  /** Required when the special service type FEDEX_AUTHENTICATED_DELIVERY is used */
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

export interface FedExOpenShipEmailNotificationDetail {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExOpenShipEmailNotificationRecipient[];
  personalMessage?: string;
}

export interface FedExOpenShipCreateRequestedShipment {
  /** Format YYYY-MM-DD */
  shipDatestamp?: string;
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  serviceType: string;
  packagingType: string;
  totalWeight?: number;
  shipper: FedExOpenShipShipperParty;
  recipients: FedExOpenShipRecipientsParty[];
  soldTo?: FedExOpenShipSoldToParty;
  origin?: FedExOpenShipContactAndAddress;
  shippingChargesPayment: FedExOpenShipPayment;
  shipmentSpecialServices?: FedExOpenShipOpenShipmentSpecialServicesRequested;
  emailNotificationDetail?: FedExOpenShipEmailNotificationDetail;
  expressFreightDetail?: FedExOpenShipExpressFreightDetail;
  variableHandlingChargeDetail?: FedExOpenShipVariableHandlingChargeDetail;
  customsClearanceDetail?: FedExOpenShipCustomsClearanceDetail;
  smartPostInfoDetail?: FedExOpenShipSmartPostInfoDetail;
  blockInsightVisibility?: boolean;
  rateRequestType?: (
    "LIST" | "NONE" | "INCENTIVE" | "ACCOUNT" | "PREFERRED" | "RETAIL"
  )[];
  preferredCurrency?: string;
  /** At least one instance containing the weight for at least one package is required for EXPRESS and GROUND shipments */
  requestedPackageLineItems: FedExOpenShipRequestedPackageLineItem[];
  labelSpecification: FedExOpenShipLabelSpecification;
}

export interface FedExOpenShipVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export type FedExOpenShipOpenShipmentCreateAction =
  | "STRONG_VALIDATION"
  | "WEAK_VALIDATION"
  | "CREATE_PACKAGE"
  | "PROVIDE_DOCUMENTS_INCREMENTALLY";

export interface FedExOpenShipCreateOpenShipmentData {
  requestedShipment: FedExOpenShipCreateRequestedShipment;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  openShipmentAction?: FedExOpenShipOpenShipmentCreateAction;
  index?: string;
}

export type FedExOpenShipOpenShipmentEditAction =
  "STRONG_VALIDATION" | "WEAK_VALIDATION" | "CREATE_PACKAGE";

export interface FedExOpenShipModifyOpenShipmentData {
  index: string;
  requestedShipment: FedExOpenShipCreateRequestedShipment;
  openShipmentAction?: FedExOpenShipOpenShipmentEditAction;
  version?: FedExOpenShipVersion;
  accountNumber: FedExOpenShipAccountNumber;
}

export type FedExOpenShipLABELRESPONSEOPTIONS = "URL_ONLY" | "LABEL";

export interface FedExOpenShipConfirmOpenShipmentData {
  labelResponseOptions: FedExOpenShipLABELRESPONSEOPTIONS;
  edtRequestType?: "ALL" | "NONE";
  labelSpecification: FedExOpenShipLabelSpecification;
  index: string;
  shippingDocumentSpecification?: FedExOpenShipShippingDocumentSpecification;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  openShipmentAction?: "PROVIDE_DOCUMENTS_INCREMENTALLY";
}

export interface FedExOpenShipModifyOpenShipmentPackagesData {
  requestedPackageLineItem: FedExOpenShipRequestedPackageLineItem;
  index: string;
  openShipmentAction?: FedExOpenShipOpenShipmentEditAction;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  trackingId: FedExOpenShipTrackingId;
}

export interface FedExOpenShipAddOpenShipmentPackagesData {
  index: string;
  openShipmentAction?: FedExOpenShipOpenShipmentEditAction;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  requestedPackageLineItems: FedExOpenShipRequestedPackageLineItem[];
}

export interface FedExOpenShipDeleteOpenShipmentPackagesData {
  index: string;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  trackingIds: FedExOpenShipTrackingId[];
}

export interface FedExOpenShipRetrieveOpenShipmentPackagesData {
  index: string;
  accountNumber: FedExOpenShipAccountNumber;
  trackingId: FedExOpenShipTrackingId;
  version?: FedExOpenShipVersion;
}

export interface FedExOpenShipDeleteOpenShipmentData {
  index: string;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
}

export interface FedExOpenShipRetrieveOpenShipmentData {
  index: string;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
  trackingId?: FedExOpenShipTrackingId | string;
}

export interface FedExOpenShipGetOpenShipmentResultsData {
  resultMethodType: "CREATE" | "MODIFY" | "CONFIRM";
  jobId: string;
  accountNumber: FedExOpenShipAccountNumber;
  version?: FedExOpenShipVersion;
}

export interface FedExOpenShipResponse<T extends object> {
  transactionId?: string;
  customerTransactionId?: string;
  output?: T;
}

export type FedExOpenShipCreateOpenShipmentResponse =
  FedExOpenShipResponse<FedExOpenShipCreateOpenShipmentOutput>;

export type FedExOpenShipModifyOpenShipmentResponse =
  FedExOpenShipResponse<FedExOpenShipModifyOpenShipmentOutput>;

export type FedExOpenShipConfirmOpenShipmentResponse =
  FedExOpenShipResponse<FedExOpenShipConfirmOpenShipmentOutput>;

export type FedExOpenShipModifyOpenShipmentPackagesResponse =
  FedExOpenShipResponse<FedExOpenShipModifyOpenShipmentPackagesOutput>;

export type FedExOpenShipAddOpenShipmentPackagesResponse =
  FedExOpenShipResponse<FedExOpenShipAddOpenShipmentPackagesOutput>;

export type FedExOpenShipDeleteOpenShipmentPackagesResponse =
  FedExOpenShipResponse<FedExOpenShipDeleteOpenShipmentPackagesOutput>;

export type FedExOpenShipRetrieveOpenShipmentPackagesResponse =
  FedExOpenShipResponse<FedExOpenShipRetrieveOpenShipmentPackagesOutput>;

export type FedExOpenShipDeleteOpenShipmentResponse =
  FedExOpenShipResponse<FedExOpenShipDeleteOpenShipmentOutput>;

export type FedExOpenShipRetrieveOpenShipmentResponse =
  FedExOpenShipResponse<FedExOpenShipRetrieveOpenShipmentOutput>;

export type FedExOpenShipGetOpenShipmentResultsResponse =
  FedExOpenShipResponse<FedExOpenShipGetOpenShipmentResultsOutput>;
