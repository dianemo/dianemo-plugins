import { CurrencyCodes } from "@dianemo/plugin-kit";

/**
 * Wire types for UPS Shipping (Ship, Void, Label Recovery), mirrored from the
 * OpenAPI spec `Shipping.yaml` (UPS-API GitHub, title "Ship", dated 2026-11-05).
 * Vendor documentation, not an observed response: required/optional follows the
 * spec's `required` arrays, with the exceptions in docs/ups-api.md#shipping-spec-quirks.
 * Arrays are typed as arrays throughout because the pinned version (v2409) is
 * past the v2403 cut-over where UPS always returns an array.
 */

/**
 * Neither this nor `UpsBillableWeightCalculationMethod` is returned unless
 * `RatingMethodRequestedIndicator` is present in the request, so absence means
 * "you did not ask" rather than shipment level. Both were declared inside out
 * until 1.0.0 and no comparison against them could ever be true — see
 * docs/ups-api.md#rating-and-billable-weight-enums-were-inverted
 */
export enum UpsRatingMethod {
  ShipmentLevel = "01",
  PackageLevel = "02",
}

export enum UpsBillableWeightCalculationMethod {
  ShipmentBillableWeight = "01",
  PackageBillableWeight = "02",
}

/** Values of the `additionaladdressvalidation` query parameter on Ship. */
export type UpsShippingAdditionalAddressValidation = "city";

/** Optional extras on `requestShipment`. */
export interface UpsShippingRequestOptions {
  /** `city` adds city validation to the address check. */
  additionalAddressValidation?: UpsShippingAdditionalAddressValidation;
}

/** Optional extras on `voidShipment`. */
export interface UpsShippingVoidOptions {
  /** The spec says this header is required only for Roadie shipments. */
  shipperNumber?: string;
}

// Names published in v1.0.0, kept as aliases of the spec-derived types below.
export type UpsShipmentRequest = UpsShippingShipRequest;
export type UpsShipmentResponse = UpsShippingShipResponse;
export type VoidUpsShipmentResponse = UpsShippingVoidResponse;
export type UpsInternationalForm =
  UpsShippingShipmentServiceOptionsInternationalForms;
export type UpsShipper = UpsShippingShipmentShipper;
export type UpsPackage = UpsShippingShipmentPackage;
export type UpsPaymentInformation = UpsShippingShipmentPaymentInformation;
export type UpsShipTo = UpsShippingShipmentShipTo;
export type UpsShipFrom = UpsShippingShipmentShipFrom;
export type UpsAddress = UpsShippingShipToAddress;
export type UpsShipmentResult = UpsShippingShipmentResponseShipmentResults;
export type UpsPackageResult = UpsShippingShipmentResultsPackageResults;
export type UpsShippingLabel = UpsShippingPackageResultsShippingLabel;
export type UpsForm = UpsShippingShipmentResultsForm;
export type UpsAlert = UpsShippingAlert;
export type UpsCode = UpsShippingCode;
export type UpsCurrency = UpsShippingMoney;
export type UpsItemizedCharge = UpsShippingItemizedCharge;
export type UpsTaxCharge = UpsShippingShipmentChargesTaxCharges;
export type UpsDimensions = UpsShippingPackageDimensions;
export type UpsWeight = UpsShippingPackagePackageWeight;

export interface UpsImage {
  ImageFormat: UpsShippingCode;
  GraphicImage: string;
}

export interface UpsShippingShipRequest {
  ShipmentRequest: UpsShippingShipmentRequest;
}

export interface UpsShippingShipResponse {
  ShipmentResponse: UpsShippingShipmentResponse;
}

export interface UpsShippingVoidResponse {
  VoidShipmentResponse: UpsShippingVoidShipmentResponse;
}

export interface UpsShippingRecoverLabelRequest {
  LabelRecoveryRequest: UpsShippingLabelRecoveryRequest;
}

export interface UpsShippingRecoverLabelResponse {
  LabelRecoveryResponse: UpsShippingLabelRecoveryResponse;
}

export interface UpsShippingShipmentRequest {
  Request: UpsShippingShipmentRequestRequest;
  Shipment: UpsShippingShipmentRequestShipment;
  LabelSpecification?: UpsShippingShipmentRequestLabelSpecification;
  ReceiptSpecification?: UpsShippingShipmentRequestReceiptSpecification;
}

export interface UpsShippingShipmentResponse {
  Response: UpsShippingShipmentResponseResponse;
  ShipmentResults: UpsShippingShipmentResponseShipmentResults;
}

export interface UpsShippingVoidShipmentResponse {
  Response: UpsShippingVoidShipmentResponseResponse;
  SummaryResult: UpsShippingVoidShipmentResponseSummaryResult;
  PackageLevelResults?: UpsShippingVoidShipmentResponsePackageLevelResults[];
}

export interface UpsShippingLabelRecoveryRequest {
  Request: UpsShippingLabelRecoveryRequestRequest;
  LabelSpecification?: UpsShippingLabelRecoveryRequestLabelSpecification;
  Translate?: UpsShippingLabelRecoveryRequestTranslate;
  LabelDelivery?: UpsShippingLabelRecoveryRequestLabelDelivery;
  TrackingNumber?: string;
  /**
   * Roadie (1R) tracking numbers. Optional here although the spec's `required`
   * array lists it, along with `ReferenceValues`: each description makes them
   * conditional on the other identifiers — docs/ups-api.md#shipping-spec-quirks
   */
  TrackingNumbers?: string[];
  MailInnovationsTrackingNumber?: string;
  ReferenceValues?: UpsShippingLabelRecoveryRequestReferenceValues;
  Locale?: string;
  UPSPremiumCareForm?: UpsShippingLabelRecoveryRequestUPSPremiumCareForm;
}

export interface UpsShippingLabelRecoveryResponse {
  Response: UpsShippingLabelRecoveryResponseResponse;
  ShipmentIdentificationNumber?: string;
  LabelResults: UpsShippingLabelRecoveryResponseLabelResults[];
  CODTurnInPage?: UpsShippingLabelRecoveryResponseCODTurnInPage;
  Form?: UpsShippingLabelRecoveryResponseForm;
  HighValueReport?: UpsShippingLabelRecoveryResponseHighValueReport;
  TrackingCandidate?: UpsShippingLabelRecoveryResponseTrackingCandidate[];
}

export interface UpsShippingShipmentRequestRequest {
  /** `validate` checks city/state/postal code; `nonvalidate` checks only postal code/state. Neither validates the street. */
  RequestOption: string;
  /** Format: YYMM = Year and month of the release. Example: 1607 = 2016 July Supported values: 1601, 1607, 1701, 1707, 1801, 1807, 2108, 2205 */
  SubVersion?: string;
  TransactionReference?: UpsShippingTransactionReference;
}

export interface UpsShippingShipmentRequestShipment {
  Description?: string;
  ReturnService?: UpsShippingCode;
  DocumentsOnlyIndicator?: string;
  Shipper: UpsShippingShipmentShipper;
  ShipTo: UpsShippingShipmentShipTo;
  AlternateDeliveryAddress?: UpsShippingShipmentAlternateDeliveryAddress;
  ShipFrom?: UpsShippingShipmentShipFrom;
  PaymentInformation?: UpsShippingShipmentPaymentInformation;
  FRSPaymentInformation?: UpsShippingShipmentFRSPaymentInformation;
  GlobalTaxInformation?: UpsShippingShipmentGlobalTaxInformation;
  WorldEase?: UpsShippingShipmentWorldEase;
  FreightShipmentInformation?: UpsShippingShipmentFreightShipmentInformation;
  GoodsNotInFreeCirculationIndicator?: string;
  PromotionalDiscountInformation?: UpsShippingShipmentPromotionalDiscountInformation;
  DGSignatoryInfo?: UpsShippingShipmentDGSignatoryInfo;
  ShipmentRatingOptions?: UpsShippingShipmentShipmentRatingOptions;
  MovementReferenceNumber?: string;
  ReferenceNumber?: UpsShippingShipmentReferenceNumber[];
  Service: UpsShippingCode;
  InvoiceLineTotal?: UpsShippingMoney;
  /** Values: 01 = AT RISK of Entering the EU 02 = NOT AT RISK of Entering the EU 03 = RISK UNKNOWN of Entering the EU */
  ShipmentRiskEnteringEU?: string;
  NumOfPiecesInShipment?: string;
  USPSEndorsement?: string;
  MILabelCN22Indicator?: string;
  /** Valid values: IR = Irregular MA = Machineable SubClass is only required if the customer's contract have them subclass the package not UPS. */
  SubClassification?: string;
  CostCenter?: string;
  CostCenterBarcodeIndicator?: string;
  PackageID?: string;
  PackageIDBarcodeIndicator?: string;
  /** Valid values: 1 = Balloon 2 = Oversize 3 = Not Applicable */
  IrregularIndicator?: string;
  ShipmentIndicationType?: UpsShippingCode[];
  MIDualReturnShipmentKey?: string;
  MIDualReturnShipmentIndicator?: string;
  RatingMethodRequestedIndicator?: string;
  TaxInformationIndicator?: string;
  ShipmentServiceOptions?: UpsShippingShipmentShipmentServiceOptions;
  Locale?: string;
  ShipmentValueThresholdCode?: string;
  ShipperType?: string;
  ConsigneeType?: string;
  MasterCartonID?: string;
  MasterCartonIndicator?: string;
  /** Format: YYYYMMDD */
  ShipmentDate?: string;
  Package: UpsShippingShipmentPackage[];
  QuoteID?: string;
  TradeDirect?: UpsShippingShipmentTradeDirect;
  HealthcareIdentifier?: string;
}

export interface UpsShippingShipmentRequestLabelSpecification {
  LabelImageFormat: UpsShippingCode;
  HTTPUserAgent?: string;
  LabelStockSize: UpsShippingLabelSpecificationLabelStockSize;
  Instruction?: UpsShippingLabelSpecificationInstruction[];
  CharacterSet?: string;
}

export interface UpsShippingShipmentRequestReceiptSpecification {
  ImageFormat: UpsShippingCode;
}

export interface UpsShippingShipmentResponseResponse {
  ResponseStatus: UpsShippingAlert;
  Alert?: UpsShippingAlert[];
  TransactionReference?: UpsShippingTransactionReference;
}

export interface UpsShippingShipmentResponseShipmentResults {
  Disclaimer?: UpsShippingCode[];
  ShipmentCharges?: UpsShippingShipmentResultsShipmentCharges;
  NegotiatedRateCharges?: UpsShippingShipmentResultsNegotiatedRateCharges;
  FRSShipmentData?: UpsShippingShipmentResultsFRSShipmentData;
  RatingMethod?: UpsRatingMethod;
  BillableWeightCalculationMethod?: UpsBillableWeightCalculationMethod;
  BillingWeight: UpsShippingShipmentResultsBillingWeight;
  ShipmentIdentificationNumber?: string;
  MIDualReturnShipmentKey?: string;
  BarCodeImage?: string;
  PackageResults?: UpsShippingShipmentResultsPackageResults[];
  ControlLogReceipt?: UpsShippingShipmentResultsControlLogReceipt[];
  Form?: UpsShippingShipmentResultsForm;
  CODTurnInPage?: UpsShippingShipmentResultsCODTurnInPage;
  HighValueReport?: UpsShippingShipmentResultsHighValueReport;
  LabelURL?: string;
  LocalLanguageLabelURL?: string;
  ReceiptURL?: string;
  LocalLanguageReceiptURL?: string;
  DGPaperImage?: string[];
  MasterCartonID?: string;
  RoarRatedIndicator?: string;
  GCCN?: string;
  USI?: string;
  Message?: string;
  SubProNumber?: string;
  PalletLabel?: UpsShippingShipmentResultsPalletLabel;
  BillOfLading?: string;
}

export interface UpsShippingVoidShipmentResponseResponse {
  ResponseStatus: UpsShippingAlert;
  Alert?: UpsShippingAlert;
  TransactionReference?: UpsShippingTransactionReference;
}

export interface UpsShippingVoidShipmentResponseSummaryResult {
  Status: UpsShippingAlert;
}

export interface UpsShippingVoidShipmentResponsePackageLevelResults {
  TrackingNumber: string;
  Status: UpsShippingAlert;
}

export interface UpsShippingLabelRecoveryRequestRequest {
  /** Format: YYMM = Year and month of the release. Example: 1701 = 2017 January Supported values: 1701, 1707, 1903, 2603 */
  SubVersion?: string;
  RequestOption?: string;
  TransactionReference?: UpsShippingTransactionReference;
}

export interface UpsShippingLabelRecoveryRequestLabelSpecification {
  HTTPUserAgent?: string;
  LabelImageFormat?: UpsShippingCode;
  LabelStockSize?: UpsShippingLabelRecoveryLabelSpecificationLabelStockSize;
}

export interface UpsShippingLabelRecoveryRequestTranslate {
  LanguageCode: string;
  DialectCode: string;
  Code: string;
}

export interface UpsShippingLabelRecoveryRequestLabelDelivery {
  LabelLinkIndicator?: string;
  ResendEMailIndicator?: string;
}

export interface UpsShippingLabelRecoveryRequestReferenceValues {
  ReferenceNumber: UpsShippingReferenceValuesReferenceNumber;
  ShipperNumber: string;
}

export interface UpsShippingLabelRecoveryRequestUPSPremiumCareForm {
  /** Valid values: 01 = A4 Size 02 = Letter Size */
  PageSize: string;
  /** Valid values: 01 = PNG 02 = PDF */
  PrintType: string;
}

export interface UpsShippingLabelRecoveryResponseResponse {
  ResponseStatus: UpsShippingAlert;
  Alert?: UpsShippingAlert[];
  TransactionReference?: UpsShippingTransactionReference;
}

export interface UpsShippingLabelRecoveryResponseLabelResults {
  TrackingNumber?: string;
  LabelImage?: UpsShippingLabelResultsLabelImage;
  MailInnovationsTrackingNumber?: string;
  MailInnovationsLabelImage?: UpsShippingLabelResultsMailInnovationsLabelImage;
  Receipt?: UpsShippingLabelResultsReceipt;
  Form?: UpsShippingLabelResultsForm;
}

export interface UpsShippingLabelRecoveryResponseCODTurnInPage {
  Image: UpsShippingLRCODTurnInPageImage;
}

export interface UpsShippingLabelRecoveryResponseForm {
  Image: UpsShippingLabelRecoveryFormImage;
}

export interface UpsShippingLabelRecoveryResponseHighValueReport {
  Image: UpsShippingHighValueReportImage;
}

export interface UpsShippingLabelRecoveryResponseTrackingCandidate {
  TrackingNumber: string;
  DestinationPostalCode?: string;
  DestinationCountryCode?: string;
  PickupDateRange?: UpsShippingTrackingCandidatePickupDateRange;
}

export interface UpsShippingShipmentShipper {
  Name: string;
  AttentionName?: string;
  CompanyDisplayableName?: string;
  /** @deprecated */
  TaxIdentificationNumber?: string;
  Phone?: UpsShippingPhone;
  ShipperNumber: string;
  FaxNumber?: string;
  EMailAddress?: string;
  Address: UpsShippingShipperAddress;
}

export interface UpsShippingShipmentShipTo {
  Name: string;
  AttentionName?: string;
  CompanyDisplayableName?: string;
  /** @deprecated */
  TaxIdentificationNumber?: string;
  Phone?: UpsShippingPhone;
  FaxNumber?: string;
  EMailAddress?: string;
  Address: UpsShippingShipToAddress;
  LocationID?: string;
}

export interface UpsShippingShipmentAlternateDeliveryAddress {
  Name: string;
  AttentionName: string;
  UPSAccessPointID?: string;
  Address: UpsShippingAlternateDeliveryAddressAddress;
}

export interface UpsShippingShipmentShipFrom {
  Name: string;
  AttentionName?: string;
  CompanyDisplayableName?: string;
  /** @deprecated */
  TaxIdentificationNumber?: string;
  TaxIDType?: UpsShippingShipFromTaxIDType;
  Phone?: UpsShippingPhone;
  FaxNumber?: string;
  Address: UpsShippingShipFromAddress;
  VendorInfo?: UpsShippingShipFromVendorInfo;
}

export interface UpsShippingShipmentPaymentInformation {
  ShipmentCharge: UpsShippingPaymentInformationShipmentCharge[];
  SplitDutyVATIndicator?: string;
}

export interface UpsShippingShipmentFRSPaymentInformation {
  Type: UpsShippingCode;
  AccountNumber: string;
  Address?: UpsShippingFRSPaymentInformationAddress;
}

export interface UpsShippingShipmentGlobalTaxInformation {
  OriginCountryShipmentValue?: string;
  DestinationCountryShipmentValue?: string;
  ShipperTypeValue?: string;
  ConsigneeTypeValue?: string;
  AgentTaxIdentificationNumber?: UpsShippingGlobalTaxInformationAgentTaxIdentificationNumber[];
}

export interface UpsShippingShipmentWorldEase {
  DestinationCountryCode: string;
  DestinationPostalCode?: string;
  GCCN?: string;
  MasterEUConsolidationIndicator?: string;
  MasterHasDocBox?: string;
  MasterShipmentChgType: "CAF" | "COL" | "DDP" | "FOB" | "PRE" | "SDT";
  VendorCollectIDNumberExemptIndicator?: string;
  PortOfEntry: {
    Name: string;
    ClearancePortCode: string;
    Consignee: string;
    Address: UpsShippingAddressPOE;
  };
}

export interface UpsShippingShipmentFreightShipmentInformation {
  FreightDensityInfo?: UpsShippingFreightShipmentInformationFreightDensityInfo;
  DensityEligibleIndicator?: string;
}

export interface UpsShippingShipmentPromotionalDiscountInformation {
  PromoCode: string;
  PromoAliasCode: string;
}

export interface UpsShippingShipmentDGSignatoryInfo {
  Name?: string;
  Title?: string;
  Place?: string;
  Date?: string;
  ShipperDeclaration?: string;
  UploadOnlyIndicator?: string;
}

export interface UpsShippingShipmentShipmentRatingOptions {
  NegotiatedRatesIndicator?: string;
  FRSShipmentIndicator?: string;
  RateChartIndicator?: string;
  TPFCNegotiatedRatesIndicator?: string;
  UserLevelDiscountIndicator?: string;
}

export interface UpsShippingShipmentReferenceNumber {
  BarCodeIndicator?: string;
  Code?: string;
  Value: string;
}

export interface UpsShippingShipmentShipmentServiceOptions {
  SaturdayDeliveryIndicator?: string;
  SaturdayPickupIndicator?: string;
  COD?: UpsShippingShipmentServiceOptionsCOD;
  AccessPointCOD?: UpsShippingMoney;
  DeliverToAddresseeOnlyIndicator?: string;
  DirectDeliveryOnlyIndicator?: string;
  Notification?: UpsShippingShipmentServiceOptionsNotification[];
  LabelDelivery?: UpsShippingShipmentServiceOptionsLabelDelivery;
  InternationalForms?: UpsShippingShipmentServiceOptionsInternationalForms;
  DeliveryConfirmation?: UpsShippingShipmentServiceOptionsDeliveryConfirmation;
  ReturnOfDocumentIndicator?: string;
  ImportControlIndicator?: string;
  LabelMethod?: UpsShippingCode;
  CommercialInvoiceRemovalIndicator?: string;
  UPScarbonneutralIndicator?: string;
  PreAlertNotification?: UpsShippingShipmentServiceOptionsPreAlertNotification[];
  ExchangeForwardIndicator?: string;
  HoldForPickupIndicator?: string;
  DropoffAtUPSFacilityIndicator?: string;
  LiftGateForPickUpIndicator?: string;
  LiftGateForDeliveryIndicator?: string;
  SDLShipmentIndicator?: string;
  EPRAReleaseCode?: string;
  RestrictedArticles?: UpsShippingShipmentServiceOptionsRestrictedArticles;
  InsideDelivery?: string;
  ItemDisposal?: string;
  VerifiedDelivery?: UpsShippingShipmentServiceOptionsVerifiedDelivery;
}

export interface UpsShippingShipmentPackage {
  Description?: string;
  PalletDescription?: string;
  NumOfPieces?: string;
  UnitPrice?: string;
  Packaging: UpsShippingCode;
  Dimensions?: UpsShippingPackageDimensions;
  DimWeight?: UpsShippingPackageDimWeight;
  PackageWeight?: UpsShippingPackagePackageWeight;
  LargePackageIndicator?: string;
  OversizeIndicator?: string;
  MinimumBillableWeightIndicator?: string;
  ReferenceNumber?: UpsShippingPackageReferenceNumber[];
  AdditionalHandlingIndicator?: string;
  SimpleRate?: UpsShippingCode;
  UPSPremier?: UpsShippingPackageUPSPremier;
  PackageServiceOptions?: UpsShippingPackagePackageServiceOptions;
  Commodity?: UpsShippingPackageCommodity;
  HazMatPackageInformation?: UpsShippingPackageHazMatPackageInformation;
}

export interface UpsShippingShipmentTradeDirect {
  Master?: UpsShippingTradeDirectMaster;
  Child?: UpsShippingTradeDirectChild;
  GeneralDescriptionOfGoods?: string;
  ShipmentType:
    "TRADEDIRECTAIR" | "TRADEDIRECTOCEAN" | "TRADEDIRECTCROSSBORDER";
  CurrencyCode: CurrencyCodes;
}

export interface UpsShippingLabelSpecificationLabelStockSize {
  Height: string;
  Width: string;
}

export interface UpsShippingLabelSpecificationInstruction {
  /** value is: 01- EXCHANGE-LIKE ITEM ONLY, 02- EXCHANGE-DRIVER INSTRUCTIONS INSIDE. */
  Code: string;
  Description?: string;
}

export interface UpsShippingShipmentResultsShipmentCharges {
  RateChart?: string;
  BaseServiceCharge?: UpsShippingMoney;
  TransportationCharges: UpsShippingMoney;
  ItemizedCharges?: UpsShippingItemizedCharge[];
  ServiceOptionsCharges: UpsShippingMoney;
  TaxCharges?: UpsShippingShipmentChargesTaxCharges[];
  TotalCharges: UpsShippingMoney;
  TotalChargesWithTaxes?: UpsShippingMoney;
}

export interface UpsShippingShipmentResultsNegotiatedRateCharges {
  ItemizedCharges?: UpsShippingItemizedCharge[];
  TaxCharges?: UpsShippingNegotiatedRateChargesTaxCharges[];
  TotalCharge?: UpsShippingMoney;
  RateModifier?: UpsShippingRateModifier[];
  TotalChargesWithTaxes?: UpsShippingMoney;
}

export interface UpsShippingShipmentResultsFRSShipmentData {
  TransportationCharges: UpsShippingFRSShipmentDataTransportationCharges;
  FreightDensityRate?: UpsShippingFRSShipmentDataFreightDensityRate;
  HandlingUnits?: UpsShippingFRSShipmentDataHandlingUnits[];
}

export interface UpsShippingShipmentResultsBillingWeight {
  UnitOfMeasurement: UpsShippingCode;
  Weight: string;
}

export interface UpsShippingShipmentResultsPackageResults {
  TrackingNumber: string;
  RateModifier?: UpsShippingRateModifier[];
  BaseServiceCharge?: UpsShippingMoney;
  ServiceOptionsCharges?: UpsShippingMoney;
  ShippingLabel?: UpsShippingPackageResultsShippingLabel;
  ShippingReceipt?: UpsShippingPackageResultsShippingReceipt;
  USPSPICNumber?: string;
  CN22Number?: string;
  Accessorial?: UpsShippingCode[];
  SimpleRate?: UpsShippingPackageResultsSimpleRate;
  Form?: UpsShippingPackageResultsForm;
  ItemizedCharges?: UpsShippingItemizedCharge[];
  NegotiatedCharges?: UpsShippingPackageResultsNegotiatedCharges;
}

export interface UpsShippingShipmentResultsControlLogReceipt {
  ImageFormat: UpsShippingCode;
  GraphicImage: string;
}

export interface UpsShippingShipmentResultsForm {
  /** Valid values: 01 - All Requested International Forms. */
  Code?: string;
  Description?: string;
  Image?: UpsShippingShipmentResultsFormImage;
  FormGroupId?: string;
  FormGroupIdName?: string;
}

export interface UpsShippingShipmentResultsCODTurnInPage {
  Image: UpsShippingCODTurnInPageImage;
}

export interface UpsShippingShipmentResultsHighValueReport {
  Image: UpsShippingHighValueReportImage;
}

export interface UpsShippingShipmentResultsPalletLabel {
  PalletLabel?: string;
}

export interface UpsShippingLabelRecoveryLabelSpecificationLabelStockSize {
  Height: string;
  Width: string;
}

export interface UpsShippingReferenceValuesReferenceNumber {
  Value: string;
}

export interface UpsShippingLabelResultsLabelImage {
  LabelImageFormat: UpsShippingLabelImageLabelImageFormat;
  GraphicImage: string;
  HTMLImage?: string;
  PDF417?: string;
  InternationalSignatureGraphicImage?: string;
  URL?: string;
}

export interface UpsShippingLabelResultsMailInnovationsLabelImage {
  LabelImageFormat: UpsShippingMailInnovationsLabelImageLabelImageFormat;
  GraphicImage: string;
  HTMLImage?: string;
  PDF417?: string;
  InternationalSignatureGraphicImage?: string;
  URL?: string;
}

export interface UpsShippingLabelResultsReceipt {
  HTMLImage?: string;
  Image?: UpsShippingReceiptImage;
  URL?: string;
}

export interface UpsShippingLabelResultsForm {
  Image: UpsShippingLRFormImage;
}

export interface UpsShippingLRCODTurnInPageImage {
  ImageFormat: UpsShippingCode;
  GraphicImage: string;
}

export interface UpsShippingLabelRecoveryFormImage {
  ImageFormat: UpsShippingLabelRecoveryImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingHighValueReportImage {
  ImageFormat: UpsShippingHighValueReportImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingTrackingCandidatePickupDateRange {
  /** Format: YYYYMMDD Service is only supported for 30 days */
  BeginDate: string;
  /** Format: YYYYMMDD */
  EndDate: string;
}

export interface UpsShippingShipperAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingShipToAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
  ResidentialAddressIndicator?: string;
  POBoxIndicator?: string;
}

export interface UpsShippingAlternateDeliveryAddressAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingShipFromTaxIDType {
  /** Valid values: EIN, DNS, and FGN. Applies to EEI form only. */
  Code: string;
  Description?: string;
}

export interface UpsShippingShipFromAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingShipFromVendorInfo {
  VendorCollectIDTypeCode: string;
  /** Values: 'IMDEU1234567' (IOSS #), 'VOEC1234567' (VOEC #), 'GB1234567' (HMRC #) Required if the shipment is subject to Vendor Collect ID collection */
  VendorCollectIDNumber: string;
  ConsigneeType?: string;
}

export interface UpsShippingPaymentInformationShipmentCharge {
  Type: string;
  BillShipper?: UpsShippingShipmentChargeBillShipper;
  BillReceiver?: UpsShippingShipmentChargeBillReceiver;
  BillThirdParty?: UpsShippingShipmentChargeBillThirdParty;
  ConsigneeBilledIndicator?: string;
}

export interface UpsShippingFRSPaymentInformationAddress {
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingGlobalTaxInformationAgentTaxIdentificationNumber {
  AgentRole: string;
  TaxIdentificationNumber?: UpsShippingAgentTaxIdentificationNumberTaxIdentificationNumber[];
}

export interface UpsShippingAddressPOE {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingFreightShipmentInformationFreightDensityInfo {
  AdjustedHeightIndicator?: string;
  AdjustedHeight?: UpsShippingFreightDensityInfoAdjustedHeight;
  HandlingUnits?: UpsShippingFreightDensityInfoHandlingUnits[];
}

export interface UpsShippingShipmentServiceOptionsCOD {
  CODFundsCode: string;
  CODAmount: UpsShippingMoney;
}

export interface UpsShippingShipmentServiceOptionsNotification {
  NotificationCode: string;
  EMail: UpsShippingNotificationEMail;
  VoiceMessage?: UpsShippingNotificationVoiceMessage;
  TextMessage?: UpsShippingNotificationTextMessage;
  Locale?: UpsShippingNotificationLocale;
}

export interface UpsShippingShipmentServiceOptionsLabelDelivery {
  EMail?: UpsShippingLabelDeliveryEMail;
  LabelLinksIndicator?: string;
}

export interface UpsShippingShipmentServiceOptionsInternationalForms {
  /** The spec types this as an array; a lone string stays accepted so v1.0.0 callers compile. */
  FormType: string | string[];
  UserCreatedForm?: UpsShippingInternationalFormsUserCreatedForm;
  UPSPremiumCareForm?: UpsShippingInternationalFormsUPSPremiumCareForm;
  CN22Form?: UpsShippingInternationalFormsCN22Form;
  AdditionalDocumentIndicator?: string;
  FormGroupIdName?: string;
  EEIFilingOption?: UpsShippingInternationalFormsEEIFilingOption;
  Contacts?: UpsShippingInternationalFormsContacts;
  Product: UpsShippingInternationalFormsProduct[];
  InvoiceNumber?: string;
  InvoiceDate?: string;
  PurchaseOrderNumber?: string;
  TermsOfShipment?: string;
  ReasonForExport?: string;
  Comments?: string;
  DeclarationStatement?: string;
  Discount?: UpsShippingInternationalFormsDiscount;
  FreightCharges?: UpsShippingInternationalFormsFreightCharges;
  InsuranceCharges?: UpsShippingInternationalFormsInsuranceCharges;
  OtherCharges?: UpsShippingInternationalFormsOtherCharges;
  CurrencyCode?: CurrencyCodes;
  BlanketPeriod?: UpsShippingInternationalFormsBlanketPeriod;
  ExportDate?: string;
  ExportingCarrier?: string;
  CarrierID?: string;
  InBondCode?: string;
  EntryNumber?: string;
  PointOfOrigin?: string;
  PointOfOriginType?: string;
  ModeOfTransport?: string;
  PortOfExport?: string;
  PortOfUnloading?: string;
  LoadingPier?: string;
  PartiesToTransaction?: string;
  RoutedExportTransactionIndicator?: string;
  ContainerizedIndicator?: string;
  OverridePaperlessIndicator?: string;
  ShipperMemo?: string;
  HazardousMaterialsIndicator?: string;
}

export interface UpsShippingShipmentServiceOptionsDeliveryConfirmation {
  /** Valid values: 1 - Delivery Confirmation Signature Required 2 - Delivery Confirmation Adult Signature Required. Valid for forward shipments only. */
  DCISType: string;
  DCISNumber?: string;
}

export interface UpsShippingShipmentServiceOptionsPreAlertNotification {
  EMailMessage?: UpsShippingPreAlertNotificationEMailMessage;
  VoiceMessage?: UpsShippingPreAlertNotificationVoiceMessage;
  TextMessage?: UpsShippingPreAlertNotificationTextMessage;
  Locale: UpsShippingPreAlertNotificationLocale;
}

export interface UpsShippingShipmentServiceOptionsRestrictedArticles {
  DiagnosticSpecimensIndicator?: string;
  AlcoholicBeveragesIndicator?: string;
  PerishablesIndicator?: string;
  PlantsIndicator?: string;
  SeedsIndicator?: string;
  SpecialExceptionsIndicator?: string;
  TobaccoIndicator?: string;
  ECigarettesIndicator?: string;
}

export interface UpsShippingShipmentServiceOptionsVerifiedDelivery {
  /** Valid values: 1 - VDU(UPS Generated PIN) 2 - VDS(Shipper Generated PIN) */
  SecurePINType: string;
  TokenValue: string;
  RecipientEmail: string;
  RecipientPhone?: string;
}

export interface UpsShippingPackageDimensions {
  UnitOfMeasurement: UpsShippingDimensionsUnitOfMeasurement;
  Length: string;
  Width: string;
  Height: string;
}

export interface UpsShippingPackageDimWeight {
  UnitOfMeasurement?: UpsShippingDimWeightUnitOfMeasurement;
  Weight?: string;
}

export interface UpsShippingPackagePackageWeight {
  UnitOfMeasurement: UpsShippingCode;
  Weight: string;
}

export interface UpsShippingPackageReferenceNumber {
  BarCodeIndicator?: string;
  Code?: string;
  Value: string;
}

export interface UpsShippingPackageUPSPremier {
  Category: string;
  SensorID?: string;
  HandlingInstructions: UpsShippingUPSPremierHandlingInstructions[];
}

export interface UpsShippingPackagePackageServiceOptions {
  DeliveryConfirmation?: UpsShippingPackageServiceOptionsDeliveryConfirmation;
  DeclaredValue?: UpsShippingPackageServiceOptionsDeclaredValue;
  COD?: UpsShippingPackageServiceOptionsCOD;
  AccessPointCOD?: UpsShippingMoney;
  ShipperReleaseIndicator?: string;
  Notification?: UpsShippingPackageServiceOptionsNotification;
  HazMat?: UpsShippingPackageServiceOptionsHazMat[];
  HazMatTypeCode?: string;
  DryIce?: UpsShippingPackageServiceOptionsDryIce;
  UPSPremiumCareIndicator?: string;
  ProactiveIndicator?: string;
  PackageIdentifier?: string;
  ClinicalTrialsID?: string;
  RefrigerationIndicator?: string;
  Healthcare?: UpsShippingPackageServiceOptionsHealthcare;
}

export interface UpsShippingPackageCommodity {
  FreightClass: string;
  NMFC?: UpsShippingCommodityNMFC;
}

export interface UpsShippingPackageHazMatPackageInformation {
  AllPackedInOneIndicator?: string;
  OverPackedIndicator?: string;
  /** values: 0.1; 0.2; 0.3; 0.4; 0.5; 0.6; 0.7; 0.8; 0.9; 1.0 */
  QValue?: string;
  OuterPackagingType?: string;
}

export interface UpsShippingTradeDirectMaster {
  SoldToSameAsShipTo?: string;
  SoldTo?: UpsShippingMasterSoldTo;
  Pickup?: UpsShippingMasterPickup;
  TradeComplianceDetails?: UpsShippingMasterTradeComplianceDetails;
  UomType: "Imperial" | "Metric";
  NotificationBeforeDelivery?: UpsShippingTradeDirectNotificationBeforeDelivery;
}

export interface UpsShippingTradeDirectChild {
  USI: string;
  HazMatIndicator?: string;
  Type: "LTL" | "SMALLPACKAGE" | "MI";
  Product: UpsShippingChildProduct;
  LtlPackage: UpsShippingChildLTLPackage;
  LtlCharges?: UpsShippingChildLTLCharges;
}

export interface UpsShippingShipmentChargesTaxCharges {
  Type: string;
  MonetaryValue: string;
}

export interface UpsShippingNegotiatedRateChargesTaxCharges {
  Type: string;
  MonetaryValue: string;
}

export interface UpsShippingFRSShipmentDataTransportationCharges {
  GrossCharge: UpsShippingMoney;
  DiscountAmount: UpsShippingMoney;
  DiscountPercentage: string;
  NetCharge: UpsShippingMoney;
}

export interface UpsShippingFRSShipmentDataFreightDensityRate {
  Density: string;
  TotalCubicFeet: string;
}

export interface UpsShippingFRSShipmentDataHandlingUnits {
  Quantity: string;
  Type: UpsShippingHandlingUnitsType;
  Dimensions: UpsShippingHandlingUnitsDimensions;
  AdjustedHeight?: UpsShippingHandlingUnitsAdjustedHeight;
}

export interface UpsShippingPackageResultsShippingLabel {
  ImageFormat: UpsShippingCode;
  GraphicImage: string;
  GraphicImagePart?: string[];
  InternationalSignatureGraphicImage?: string;
  HTMLImage?: string;
  PDF417?: string;
}

export interface UpsShippingPackageResultsShippingReceipt {
  ImageFormat: UpsShippingShippingReceiptImageFormat;
  GraphicImage: string;
}

export interface UpsShippingPackageResultsSimpleRate {
  /** Valid values: XS - Extra Small S - Small M - Medium L - Large XL - Extra Large */
  Code: string;
}

export interface UpsShippingPackageResultsForm {
  /** Valid values: - 01 - All Requested International Forms. */
  Code?: string;
  /** Possible Values: All Requested International Forms. */
  Description?: string;
  Image?: UpsShippingFormImage;
  FormGroupId?: string;
  FormGroupIdName?: string;
}

export interface UpsShippingPackageResultsNegotiatedCharges {
  ItemizedCharges?: UpsShippingItemizedCharge[];
  RateModifier?: UpsShippingRateModifier[];
}

export interface UpsShippingShipmentResultsFormImage {
  ImageFormat: UpsShippingShipmentResultsImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingCODTurnInPageImage {
  ImageFormat: UpsShippingCODTurnInPageImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingLabelImageLabelImageFormat {
  Code: string;
}

export interface UpsShippingMailInnovationsLabelImageLabelImageFormat {
  Code: string;
}

export interface UpsShippingReceiptImage {
  ImageFormat: UpsShippingReceiptImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingLRFormImage {
  ImageFormat: UpsShippingImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingLabelRecoveryImageImageFormat {
  /** Valid values: PDF = pdf */
  Code: string;
  Description?: string;
}

export interface UpsShippingHighValueReportImageImageFormat {
  /** Valid values: - PDF = pdf. */
  Code: string;
  Description?: string;
}

export interface UpsShippingShipmentChargeBillShipper {
  AccountNumber?: string;
  CreditCard?: UpsShippingBillShipperCreditCard;
  AlternatePaymentMethod?: string;
}

export interface UpsShippingShipmentChargeBillReceiver {
  AccountNumber: string;
  Address?: UpsShippingBillReceiverAddress;
}

export interface UpsShippingShipmentChargeBillThirdParty {
  AccountNumber?: string;
  CertifiedElectronicMail?: string;
  InterchangeSystemCode?: string;
  Address: UpsShippingBillThirdPartyAddress;
}

export interface UpsShippingAgentTaxIdentificationNumberTaxIdentificationNumber {
  IdentificationNumber: string;
  IDNumberCustomerRole: string;
  IDNumberEncryptionIndicator: string;
  /** Values: 'ID' = Indonesia, 'VN' = Vietnam, 'DE' = Germany */
  IDNumberIssuingCntryCd?: string;
  /** Valid values: 00/ Spaces = Unknown 01= Customs/Brokerage (Default) 02= Customs/Brokerage EORI 99= Other */
  IDNumberPurposeCode: string;
  IDNumberRequestingCntryCd?: string;
  IDNumberTypeCode: string;
  IncludeIDNumberOnShippingBrokerageDocs?: string;
}

export interface UpsShippingFreightDensityInfoAdjustedHeight {
  Value: string;
  UnitOfMeasurement: UpsShippingAdjustedHeightUnitOfMeasurement;
}

export interface UpsShippingFreightDensityInfoHandlingUnits {
  Quantity: string;
  Type: UpsShippingHandlingUnitsType;
  Dimensions: UpsShippingHandlingUnitsDimensions;
}

export interface UpsShippingNotificationEMail {
  EMailAddress: string[];
  UndeliverableEMailAddress?: string;
  FromEMailAddress?: string;
  FromName?: string;
  Memo?: string;
}

export interface UpsShippingNotificationVoiceMessage {
  PhoneNumber: string;
}

export interface UpsShippingNotificationTextMessage {
  PhoneNumber: string;
}

export interface UpsShippingNotificationLocale {
  Language: string;
  Dialect: string;
}

export interface UpsShippingLabelDeliveryEMail {
  EMailAddress: string;
}

export interface UpsShippingInternationalFormsUserCreatedForm {
  DocumentID: string[];
}

export interface UpsShippingInternationalFormsUPSPremiumCareForm {
  /** Format: yyyyMMdd */
  ShipmentDate: string;
  /** Valid values: 01 = A4 Size 02 = Letter Size */
  PageSize: string;
  /** Valid values: 01 = PNG 02 = PDF */
  PrintType: string;
  NumOfCopies: string;
  LanguageForUPSPremiumCare: UpsShippingUPSPremiumCareFormLanguageForUPSPremiumCare;
}

export interface UpsShippingInternationalFormsCN22Form {
  /** valid values: 6 = 4X6 1 = 8.5X11 Required if the CN22 form container is present. */
  LabelSize: string;
  PrintsPerPage: string;
  LabelPrintType: string;
  /** Valid values: 1 = GIFT 2 = DOCUMENTS 3 = COMMERCIAL SAMPLE 4 = OTHER Required if the CN22 form container is present. */
  CN22Type: string;
  CN22OtherDescription?: string;
  FoldHereText?: string;
  CN22Content: UpsShippingCN22FormCN22Content[];
}

export interface UpsShippingInternationalFormsEEIFilingOption {
  /** Valid values: 1 - Shipper filed, 2 - AES Direct, 3 - UPS filed. */
  Code: string;
  EMailAddress?: string;
  Description?: string;
  UPSFiled?: UpsShippingEEIFilingOptionUPSFiled;
  ShipperFiled?: UpsShippingEEIFilingOptionShipperFiled;
}

export interface UpsShippingInternationalFormsContacts {
  ForwardAgent?: UpsShippingContactsForwardAgent;
  UltimateConsignee?: UpsShippingContactsUltimateConsignee;
  IntermediateConsignee?: UpsShippingContactsIntermediateConsignee;
  Producer?: UpsShippingContactsProducer;
  SoldTo?: UpsShippingContactsSoldTo;
}

export interface UpsShippingInternationalFormsProduct {
  /** The spec types this as an array; a lone string stays accepted so v1.0.0 callers compile. */
  Description: string | string[];
  Unit?: UpsShippingProductUnit;
  CommodityCode?: string;
  PartNumber?: string;
  OriginCountryCode?: string;
  JointProductionIndicator?: string;
  /** Valid values: - NC - ND - NO */
  NetCostCode?: string;
  NetCostDateRange?: UpsShippingProductNetCostDateRange;
  PreferenceCriteria?: string;
  /** Valid values: Yes, No [1], No [2], and No [3]. */
  ProducerInfo?: string;
  MarksAndNumbers?: string;
  NumberOfPackagesPerCommodity?: string;
  ProductWeight?: UpsShippingProductProductWeight;
  VehicleID?: string;
  ScheduleB?: UpsShippingProductScheduleB;
  /** Valid values: D: Domestic; F: Foreign. */
  ExportType?: string;
  SEDTotalValue?: string;
  TaxesPaid?: string;
  ProductIdentifierExemptIndicator?: boolean;
  ProductIdentifier?: UpsShippingInternationalFormsProductIdentifier[];
  ExcludeFromForm?: UpsShippingProductExcludeFromForm;
  PackingListInfo?: UpsShippingProductPackingListInfo;
  EEIInformation?: UpsShippingProductEEIInformation;
  DDSReferenceNumber?: UpsShippingProductDDSReferenceNumber;
}

export interface UpsShippingInternationalFormsDiscount {
  MonetaryValue: string;
}

export interface UpsShippingInternationalFormsFreightCharges {
  MonetaryValue: string;
}

export interface UpsShippingInternationalFormsInsuranceCharges {
  MonetaryValue: string;
}

export interface UpsShippingInternationalFormsOtherCharges {
  MonetaryValue: string;
  Description: string;
}

export interface UpsShippingInternationalFormsBlanketPeriod {
  BeginDate: string;
  EndDate: string;
}

export interface UpsShippingPreAlertNotificationEMailMessage {
  EMailAddress: string;
  UndeliverableEMailAddress?: string;
}

export interface UpsShippingPreAlertNotificationVoiceMessage {
  PhoneNumber: string;
}

export interface UpsShippingPreAlertNotificationTextMessage {
  PhoneNumber: string;
}

export interface UpsShippingPreAlertNotificationLocale {
  Language: string;
  Dialect: string;
}

export interface UpsShippingDimensionsUnitOfMeasurement {
  Code?: string;
  Description?: string;
}

export interface UpsShippingDimWeightUnitOfMeasurement {
  /** Valid values: - LBS = Pounds (default) - KGS = Kilograms */
  Code: string;
  Description?: string;
}

export interface UpsShippingUPSPremierHandlingInstructions {
  Instruction: string;
}

export interface UpsShippingPackageServiceOptionsDeliveryConfirmation {
  /** Valid values: - 1 - Unsupported - 2 - Delivery Confirmation Signature Required - 3 - Delivery Confirmation Adult Signature Required */
  DCISType: string;
  DCISNumber?: string;
}

export interface UpsShippingPackageServiceOptionsDeclaredValue {
  Type?: UpsShippingCode;
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface UpsShippingPackageServiceOptionsCOD {
  CODFundsCode: string;
  CODAmount: UpsShippingPackageServiceOptionsCODCODAmount;
}

export interface UpsShippingPackageServiceOptionsNotification {
  NotificationCode: string;
  EMail: UpsShippingPackageServiceOptionsNotificationEMail;
}

export interface UpsShippingPackageServiceOptionsHazMat {
  PackagingTypeQuantity?: string;
  RecordIdentifier1?: string;
  RecordIdentifier2?: string;
  RecordIdentifier3?: string;
  SubRiskClass?: string;
  aDRItemNumber?: string;
  /** Valid values: - "1" = "I", - "2" = "II", - "3" = "III", - and blank. */
  aDRPackingGroupLetter?: string;
  TechnicalName?: string;
  HazardLabelRequired?: string;
  ClassDivisionNumber?: string;
  ReferenceNumber?: string;
  Quantity?: string;
  UOM?: string;
  PackagingType?: string;
  IDNumber?: string;
  ProperShippingName: string;
  AdditionalDescription?: string;
  /** Valid values: I II III blank */
  PackagingGroupType?: string;
  PackagingInstructionCode?: string;
  EmergencyPhone?: string;
  EmergencyContact?: string;
  ReportableQuantity?: string;
  RegulationSet: string;
  TransportationMode: string;
  CommodityRegulatedLevelCode?: string;
  TransportCategory?: string;
  TunnelRestrictionCode?: string;
  ChemicalRecordIdentifier?: string;
  LocalTechnicalName?: string;
  LocalProperShippingName?: string;
}

export interface UpsShippingPackageServiceOptionsDryIce {
  RegulationSet: string;
  DryIceWeight: UpsShippingDryIceDryIceWeight;
  MedicalUseIndicator?: string;
}

export interface UpsShippingPackageServiceOptionsHealthcare {
  ProgramIdentifier?: string;
  SubAttribute?: string;
  UniqueIdentifier?: string;
  Text?: string;
}

export interface UpsShippingCommodityNMFC {
  PrimeCode: string;
  SubCode?: string;
}

export interface UpsShippingMasterSoldTo {
  Name: string;
  AttentionName?: string;
  /** @deprecated */
  TaxIdentificationNumber?: string;
  Phone?: UpsShippingPhone;
  Option?: string;
  Address: UpsShippingTradeDirectAddress;
  EmailAddress: string;
  AccountNumber?: string;
}

export interface UpsShippingMasterPickup {
  Name: string;
  AttentionName?: string;
  Phone?: UpsShippingPhone;
  Address: UpsShippingTradeDirectAddress;
  EMailAddress: string;
}

export interface UpsShippingMasterTradeComplianceDetails {
  TermsOfShipment?:
    | "CFR"
    | "CIF"
    | "CIP"
    | "CPT"
    | "DAF"
    | "DAP"
    | "DAT"
    | "DDP"
    | "DDU"
    | "DEQ"
    | "DES"
    | "EXW"
    | "FAS"
    | "FCA"
    | "FOB";
  ReasonForExport?: string;
  Comments?: string;
  DeclarationStatement?: "Invoice" | "USMCA";
}

export interface UpsShippingTradeDirectNotificationBeforeDelivery {
  RequestType?: "001" | "002" | "003";
  MediaTypeCode?: "03" | "04";
  Language?: string;
  Dialect?: string;
  ShipFromCompanyName?: string;
  CompanyName?: string;
  Phone?: UpsShippingPhone;
  SubjectLine?: string;
  Memo?: string;
  Name?: string;
  EMailAddress: string;
  AlternateEmailAddress?: string;
}

export interface UpsShippingChildProduct {
  Description: string;
  UnitPrice: string;
  NumberOfUnits: string;
  ProductNumber: string;
  CountryOriginCode: string;
  UnitOfMeasure:
    | "BA"
    | "BE"
    | "BG"
    | "BH"
    | "BOX"
    | "BT"
    | "LB"
    | "LBS"
    | "L"
    | "M"
    | "NMB"
    | "PA"
    | "BU"
    | "CI"
    | "CM"
    | "CON"
    | "CR"
    | "CS"
    | "CT"
    | "CY"
    | "DOZ"
    | "EA"
    | "EN"
    | "FT"
    | "KG"
    | "KGS"
    | "PAL"
    | "PC"
    | "PCS"
    | "PF"
    | "OTH"
    | "PKG"
    | "PR"
    | "PRS"
    | "RL"
    | "SET"
    | "SME"
    | "SYD"
    | "TU"
    | "YD";
  CommodityCode?: string;
  JointProductionIndicator?: string;
  /** Valid values: - NC - ND - NO */
  NetCostCode?: string;
  NetCostDateRange?: UpsShippingProductNetCostDateRange;
  PreferenceCriteria?: string;
  /** Valid values: Yes, No [1], No [2], and No [3]. */
  ProducerInfo?: string;
  MarksAndNumbers?: string;
  NumberOfPackagesPerCommodity?: string;
  ProductWeight?: UpsShippingProductProductWeight;
  VehicleID?: string;
  ScheduleB?: UpsShippingProductScheduleB;
  /** Valid values: D: Domestic; F: Foreign. */
  ExportType?: string;
  SEDTotalValue?: string;
  TaxesPaid?: string;
  ExcludeFromForm?: UpsShippingProductExcludeFromForm;
  PackingListInfo?: UpsShippingProductPackingListInfo;
  EEIInformation?: UpsShippingProductEEIInformation;
}

export interface UpsShippingChildLTLPackage {
  NumberOfIdenticalUnits: string;
  HandlingUnits: UpsShippingLTLHandlingUnits;
  ReferenceNumber?: UpsShippingLTLReferenceNumber;
}

export interface UpsShippingChildLTLCharges {
  Discount?: string;
  FreightCharges?: string;
  InsuranceCharges?: string;
  OtherCharges?: UpsShippingLTLOtherCharges;
}

export interface UpsShippingHandlingUnitsType {
  /** Valid values: - SKD = Skid - CBY = Carboy - PLT = Pallet - TOT = Totes - LOO = Loose - OTH = Other */
  Code: string;
  Description?: string;
}

export interface UpsShippingHandlingUnitsDimensions {
  UnitOfMeasurement: UpsShippingCode;
  Length: string;
  Width: string;
  Height: string;
}

export interface UpsShippingHandlingUnitsAdjustedHeight {
  Value: string;
  UnitOfMeasurement: UpsShippingAdjustedHeightUnitOfMeasurement;
}

export interface UpsShippingShippingReceiptImageFormat {
  /** Valid values: - HTML = HTML format */
  Code: string;
  Description?: string;
}

export interface UpsShippingFormImage {
  ImageFormat: UpsShippingImageImageFormat;
  GraphicImage: string;
}

export interface UpsShippingShipmentResultsImageImageFormat {
  /** Valid values: - PDF = pdf */
  Code: string;
  Description?: string;
}

export interface UpsShippingCODTurnInPageImageImageFormat {
  /** Valid values: - HTML = HTML format. Only HTML format is supported for COD Turn In Page. */
  Code: string;
  Description?: string;
}

export interface UpsShippingReceiptImageImageFormat {
  /** Valid values: - HTML = HTML format - PDF = pdf */
  Code: string;
  Description?: string;
}

export interface UpsShippingImageImageFormat {
  /** Valid values: PDF = pdf, PNG = png */
  Code: string;
  Description?: string;
}

export interface UpsShippingBillShipperCreditCard {
  Type: string;
  Number: string;
  ExpirationDate: string;
  SecurityCode: string;
  Address?: UpsShippingCreditCardAddress;
}

export interface UpsShippingBillReceiverAddress {
  PostalCode?: string;
}

export interface UpsShippingBillThirdPartyAddress {
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingAdjustedHeightUnitOfMeasurement {
  /** Valid value: IN Unit of measurement code for Adjusted height is validated only when Handling unit type is SKD = Skid or PLT = Pallet. */
  Code: string;
  Description?: string;
}

export interface UpsShippingUPSPremiumCareFormLanguageForUPSPremiumCare {
  /** Valid values: eng = US English fra = Canadian French */
  Language: string[];
}

export interface UpsShippingCN22FormCN22Content {
  CN22ContentQuantity: string;
  CN22ContentDescription: string;
  CN22ContentWeight: UpsShippingCN22ContentCN22ContentWeight;
  CN22ContentTotalValue: string;
  CN22ContentCurrencyCode: string;
  CN22ContentCountryOfOrigin?: string;
  CN22ContentTariffNumber?: string;
  DDSReferenceNumber?: UpsShippingCN22ContentCN22DDSReferenceNumber;
}

export interface UpsShippingEEIFilingOptionUPSFiled {
  POA: UpsShippingCode;
}

export interface UpsShippingEEIFilingOptionShipperFiled {
  /** Valid value is: A- requires the ITN; B- requires the Exemption Legend; C- requires the post departure filing citation. */
  Code: string;
  Description?: string;
  PreDepartureITNNumber?: string;
  ExemptionLegend?: string;
  EEIShipmentReferenceNumber?: string;
}

export interface UpsShippingContactsForwardAgent {
  CompanyName: string;
  /** Valid Values: (Below values are applicable for EEIFilingOption Code =3) 94-308351500 13-168669100 Applicable for EEI form only. */
  TaxIdentificationNumber: string;
  Address: UpsShippingForwardAgentAddress;
}

export interface UpsShippingContactsUltimateConsignee {
  CompanyName: string;
  Address: UpsShippingUltimateConsigneeAddress;
  UltimateConsigneeType?: UpsShippingUltimateConsigneeUltimateConsigneeType;
}

export interface UpsShippingContactsIntermediateConsignee {
  CompanyName: string;
  Address: UpsShippingIntermediateConsigneeAddress;
}

export interface UpsShippingContactsProducer {
  /** Valid values: 01 - AVAILABLE TO CUSTOMS UPON REQUEST 02 - SAME AS EXPORTER 03 - ATTACHED LIST 04 - UNKNOWN */
  Option?: string;
  CompanyName?: string;
  TaxIdentificationNumber?: string;
  Address?: UpsShippingProducerAddress;
  AttentionName?: string;
  Phone?: UpsShippingPhone;
  EMailAddress?: string;
}

export interface UpsShippingContactsSoldTo {
  Name: string;
  AttentionName: string;
  /** @deprecated */
  TaxIdentificationNumber?: string;
  Phone?: UpsShippingPhone;
  Option?: string;
  Address: UpsShippingSoldToAddress;
  EMailAddress?: string;
  AccountNumber?: string;
}

export interface UpsShippingProductUnit {
  Number: string;
  UnitOfMeasurement: UpsShippingCode;
  Value: string;
}

export interface UpsShippingProductNetCostDateRange {
  BeginDate: string;
  EndDate: string;
}

export interface UpsShippingProductProductWeight {
  UnitOfMeasurement: UpsShippingProductWeightUnitOfMeasurement;
  Weight: string;
}

export interface UpsShippingProductScheduleB {
  Number: string;
  Quantity?: string[];
  UnitOfMeasurement: UpsShippingCode[];
}

export interface UpsShippingInternationalFormsProductIdentifier {
  ProductID?: string;
  ProductIDTypeCode?: string;
}

export interface UpsShippingProductExcludeFromForm {
  FormType: string[];
}

export interface UpsShippingProductPackingListInfo {
  PackageAssociated: UpsShippingPackingListInfoPackageAssociated[];
}

export interface UpsShippingProductEEIInformation {
  ExportInformation?: string;
  License?: UpsShippingEEIInformationLicense;
  DDTCInformation?: UpsShippingEEIInformationDDTCInformation;
}

export interface UpsShippingProductDDSReferenceNumber {
  Number?: string;
}

export interface UpsShippingPackageServiceOptionsCODCODAmount {
  CurrencyCode: CurrencyCodes;
  /** Valid values: 0.01 USD to 50000.00 USD */
  MonetaryValue: string;
}

export interface UpsShippingPackageServiceOptionsNotificationEMail {
  Subject?: string;
  SubjectCode?: string;
  EMailAddress: string[];
  UndeliverableEMailAddress?: string;
  FromEMailAddress?: string;
  FromName?: string;
  Memo?: string;
}

export interface UpsShippingDryIceDryIceWeight {
  UnitOfMeasurement: UpsShippingCode;
  Weight: string;
}

export interface UpsShippingTradeDirectAddress {
  AddressLine: string;
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingLTLHandlingUnits {
  Quantity: string;
  Type:
    | "BAGS"
    | "BOXES"
    | "CARTONS"
    | "CRATES"
    | "DRUMS"
    | "PALLET_SKIDS"
    | "ROLLS"
    | "TUBES";
  FreightClass:
    | "50"
    | "55"
    | "60"
    | "65"
    | "70"
    | "77.5"
    | "85"
    | "92.5"
    | "100"
    | "110"
    | "125"
    | "150"
    | "175"
    | "200"
    | "250"
    | "300"
    | "400"
    | "500";
  Dimensions: UpsShippingLTLDimensions;
  PackageWeight: UpsShippingLTLPackageWeightType;
}

export interface UpsShippingLTLReferenceNumber {
  Code: "PO" | "REF" | "INV";
  Value: string;
}

export interface UpsShippingLTLOtherCharges {
  MonetaryValue: string;
  ChargeDescription: string;
}

export interface UpsShippingCreditCardAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingCN22ContentCN22ContentWeight {
  UnitOfMeasurement: UpsShippingCode;
  Weight: string;
}

export interface UpsShippingCN22ContentCN22DDSReferenceNumber {
  Number?: string;
}

export interface UpsShippingForwardAgentAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  Town?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingUltimateConsigneeAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  Town?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingUltimateConsigneeUltimateConsigneeType {
  /** Valid values: D = Direct Consumer G = Government Entity R = Reseller O = Other/Unknown */
  Code: string;
  Description?: string;
}

export interface UpsShippingIntermediateConsigneeAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  Town?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingProducerAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  Town?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingSoldToAddress {
  AddressLine: string[];
  City: string;
  StateProvinceCode?: string;
  Town?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsShippingProductWeightUnitOfMeasurement {
  /** Valid values: - KGS - LBS */
  Code: string;
  Description?: string;
}

export interface UpsShippingPackingListInfoPackageAssociated {
  PackageNumber: string;
  ProductAmount: string;
  ProductNote?: string;
}

export interface UpsShippingEEIInformationLicense {
  Number?: string;
  Code?: string;
  /** Format: Whole numbers only. Applies to EEI form only. Required if EEIFilingOption code 1A (only for SDL shipments) or 3. */
  LicenseLineValue?: string;
  ECCNNumber?: string;
}

export interface UpsShippingEEIInformationDDTCInformation {
  ITARExemptionNumber?: string;
  USMLCategoryCode?: string;
  EligiblePartyIndicator?: string;
  RegistrationNumber?: string;
  Quantity?: string;
  UnitOfMeasurement?: UpsShippingCode;
  SignificantMilitaryEquipmentIndicator?: string;
  ACMNumber?: string;
}

export interface UpsShippingLTLDimensions {
  Length: string;
  Width: string;
  Height: string;
  UnitOfMeasurement: "IN" | "CM";
}

export interface UpsShippingLTLPackageWeightType {
  Weight: string;
  UnitOfMeasurement: "KGS" | "LBS";
}

export interface UpsShippingTransactionReference {
  CustomerContext?: string;
}

export interface UpsShippingCode {
  Code: string;
  Description?: string;
}

export interface UpsShippingMoney {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface UpsShippingAlert {
  Code: string;
  Description: string;
}

export interface UpsShippingPhone {
  Number: string;
  Extension?: string;
}

export interface UpsShippingItemizedCharge {
  Code: string;
  Description?: string;
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
  SubType?: string;
}

export interface UpsShippingRateModifier {
  ModifierType: string;
  ModifierDesc: string;
  Amount: string;
}
