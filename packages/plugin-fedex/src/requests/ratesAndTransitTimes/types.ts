import {
  FedExPackageType,
  FedExResponse,
  FedExServiceType,
  FedExSubPackagingType,
  FedexCarrierCodes,
} from "../types.js";

/**
 * The request body is sent as `data.body`. `body` is the name of the spec's
 * request-body schema, carried into this wrapper in v1.0.0; the spec has no
 * such property, so the wrapper adds nothing on the wire.
 */
export interface GetRatesAndTransitTimesData {
  body: FedexBody;
}

export type GetRatesAndTransitTimesResponse =
  FedExResponse<GetRatesAndTransitTimesOutput>;

export type Recipient = Shipper;

export type TotalVariableHandlingCharges = VariableHandlingCharge;

// Wire types generated from the Rates and Transit Times v1.0.0 spec.

export interface FedexBody {
  accountNumber: FedExRateAccountNumber;
  rateRequestControlParameters?: RateRequestControlParameters;
  requestedShipment: RequestedShipment;
  processingOptions?: "INCLUDE_PICKUPRATES"[];
  carrierCodes?: FedexCarrierCodes[];
  version?: FedExRateVersion;
}

export interface FedExRateAccountNumber {
  value?: string;
}

export interface RateRequestControlParameters {
  /** Not in the schema; the spec's freight sample sends it here, the intra-Europe sample at the top level. */
  returnLocalizedDateTime?: boolean;
  returnTransitTimes?: boolean;
  servicesNeededOnRateFailure?: boolean;
  variableOptions?:
    | "SATURDAY_DELIVERY"
    | "FREIGHT_GUARANTEE"
    | "SMART_POST_ALLOWED_INDICIA"
    | "SMARTPOST_HUB_ID";
  rateSortOrder?:
    "COMMITASCENDING" | "SERVICENAMETRADITIONAL" | "COMMITDESCENDING";
}

export interface RequestedShipment {
  shipper: Shipper;
  pickupDetail?: FedExRatePickupDetail;
  recipient: Shipper;
  serviceType?: FedExServiceType;
  preferredCurrency?: string;
  rateRequestType?: ("LIST" | "INCENTIVE" | "ACCOUNT" | "PREFERRED")[];
  /** YYYY-MM-DD. The spec text also says the time portion is used, which contradicts that format; see docs/fedex-api.md. */
  shipDateStamp?: string;
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  requestedPackageLineItems: RequestedPackageLineItem[];
  documentShipment?: boolean;
  variableHandlingChargeDetail?: VariableHandlingChargeDetail;
  packagingType?: string;
  totalPackageCount?: number;
  totalWeight?: number;
  shipmentSpecialServices?: ShipmentSpecialServices;
  customsClearanceDetail?: CustomsClearanceDetail;
  smartPostInfoDetail?: SmartPostInfoDetail;
}

export interface Shipper {
  address: FedexAddress;
}

export interface FedexAddress {
  /** Not in the Shipper/Recipient address schema; the spec's freight and intra-Europe samples send it. */
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExRatePickupDetail {
  /** YYYY-MM-DD despite the name; the spec declares format date. */
  readyDateTime?: string;
  /** YYYY-MM-DD despite the name; the spec declares format date. */
  latestPickupDateTime?: string;
  courierInstructions?: string;
  requestType?: "FUTURE_DAY" | "SAME_DAY";
  requestSource?: "AUTOMATION" | "CUSTOMER_SERVICE";
}

export interface RequestedPackageLineItem {
  /** Not in the schema; the spec's intra-Europe sample sends `"YOUR_PACKAGING"`. */
  physicalPackaging?: string;
  subPackagingType?: FedExSubPackagingType;
  groupPackageCount?: number;
  declaredValue?: FixedValue;
  weight: FedExRateWeight2;
  dimensions?: FedExRateRequestePackageLineItemDimensions;
  variableHandlingChargeDetail?: VariableHandlingChargeDetail;
  packageSpecialServices?: FedExRatePackageSpecialServicesRequested;
}

export interface FixedValue {
  amount?: number;
  currency?: string;
}

export interface FedExRateWeight2 {
  units: "KG" | "LB";
  value: number;
}

export interface FedExRateRequestePackageLineItemDimensions {
  length: number;
  width: number;
  height: number;
  units: "CM" | "IN";
}

export interface VariableHandlingChargeDetail {
  rateType?: FedExRateRateType;
  percentValue?: number;
  rateLevelType?: "BUNDLED_RATE" | "INDIVIDUAL_PACKAGE_RATE";
  fixedValue?: FixedValue;
  rateElementBasis:
    "NET_CHARGE" | "NET_FREIGHT" | "BASE_CHARGE" | "NET_CHARGE_EXCLUDING_TAXES";
}

export interface FedExRatePackageSpecialServicesRequested {
  specialServiceTypes?: string[];
  signatureOptionType?: FedExRateSignatureOptionType;
  alcoholDetail?: FedExRateAlcoholDetail;
  dangerousGoodsDetail?: FedExRateDangerousGoodsDetail;
  packageCODDetail?: FedExRatePackageSpecialServicesRequestedPackageCODDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExRateBatteryClassificationDetail[];
  dryIceWeight?: FedExRateWeight12;
  standaloneBatteryDetails?: FedExRateStandaloneBatteryDetails[];
}

export interface FedExRateAlcoholDetail {
  alcoholRecipientType: "LICENSEE" | "CONSUMER";
  shipperAgreementType?: string;
}

export interface FedExRateDangerousGoodsDetail {
  accessibility?: "ACCESSIBLE" | "INACCESSIBLE";
  options?: FedExRateOption[];
  containers?: FedExRateDangerousGoodsContainer[];
  regulation?: "ADR" | "DOT" | "IATA" | "ORMD";
}

export interface FedExRateDangerousGoodsContainer {
  offeror?: string;
  hazardousCommodities?: FedExRateHazardousCommodityContent[];
  numberOfContainers?: number;
  containerType?: string;
  emergencyContactNumber?: FedExRatePhoneNumber;
  packaging?: FedExRateHazardousCommodityPackagingDetail;
  packingType?: "ALL_PACKED_IN_ONE";
  radioactiveContainerClass?: FedExRateRadioactiveContainerClass;
}

export interface FedExRateHazardousCommodityContent {
  quantity?: FedExRateHazardousCommodityQuantityDetail;
  innerReceptacles?: FedExRateHazardousCommodityInnerReceptacleDetail[];
  options?: FedExRateHazardousCommodityOptionDetail;
  description?: FedExRateHazardousCommodityDescription;
}

export interface FedExRateHazardousCommodityQuantityDetail {
  quantityType?: "GROSS" | "NET";
  amount?: number;
  units?: string;
}

export interface FedExRateHazardousCommodityInnerReceptacleDetail {
  quantity?: FedExRateHazardousCommodityQuantityDetail;
}

export interface FedExRateHazardousCommodityOptionDetail {
  labelTextOption?: "APPEND" | "OVERRIDE" | "STANDARD";
  customerSuppliedLabelText?: string;
}

export interface FedExRateHazardousCommodityDescription {
  sequenceNumber?: number;
  processingOptions?: "INCLUDE_SPECIAL_PROVISIONS"[];
  subsidiaryClasses?: string[];
  labelText?: string;
  technicalName?: string;
  packingDetails?: FedExRateHazardousCommodityPackingDetail;
  authorization?: string;
  reportableQuantity?: boolean;
  percentage?: number;
  id?: string;
  packingGroup?: "DEFAULT" | "I" | "II" | "III";
  properShippingName?: string;
  hazardClass?: string;
}

export interface FedExRateHazardousCommodityPackingDetail {
  packingInstructions?: string;
  cargoAircraftOnly?: boolean;
}

export interface FedExRatePhoneNumber {
  areaCode: string;
  extension?: string;
  countryCode: string;
  personalIdentificationNumber?: string;
  localNumber?: string;
}

export interface FedExRateHazardousCommodityPackagingDetail {
  count?: number;
  units?: string;
}

export interface FedExRatePackageSpecialServicesRequestedPackageCODDetail {
  codCollectionAmount?: FixedValue;
  codCollectionType?: FedExRateCodCollectionType;
}

export interface FedExRateBatteryClassificationDetail {
  material?: "LITHIUM_METAL" | "LITHIUM_ION";
  regulatorySubType?: "IATA_SECTION_II";
  packing?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
}

export interface FedExRateWeight12 {
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExRateStandaloneBatteryDetails {
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface ShipmentSpecialServices {
  returnShipmentDetail?: FedExRateShipmentSpecialServicesRequestedReturnShipmentDetail;
  deliveryOnInvoiceAcceptanceDetail?: FedExRateDeliveryOnInvoiceAcceptanceDetail;
  internationalTrafficInArmsRegulationsDetail?: FedExRateInternationalTrafficInArmsRegulationsDetail;
  holdAtLocationDetail?: FedExRateHoldAtLocationDetail;
  shipmentCODDetail?: FedExRateShipmentSpecialServicesRequestedShipmentCODDetail;
  shipmentDryIceDetail?: FedExRateShipmentDryIceDetail;
  internationalControlledExportDetail?: FedExRateInternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: FedExRateHomeDeliveryPremiumDetail;
  specialServiceTypes?: string[];
}

export interface FedExRateShipmentSpecialServicesRequestedReturnShipmentDetail {
  returnType?: FedExRateReturnType;
}

export interface FedExRateDeliveryOnInvoiceAcceptanceDetail {
  recipient?: FedExRateDeliveryOnInvoiceAcceptanceDetailRecipient;
}

export interface FedExRateDeliveryOnInvoiceAcceptanceDetailRecipient {
  address: FedExRateAddress2;
  contact: FedexContact;
  accountNumber?: FedExRateAccountNumber;
}

export interface FedExRateAddress2 {
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
  streetLines?: string[];
}

export interface FedexContact {
  personName: string;
  emailAddress?: string;
  phoneNumber: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName: string;
}

export interface FedExRateInternationalTrafficInArmsRegulationsDetail {
  licenseOrExemptionNumber?: string;
}

export interface FedExRateHoldAtLocationDetail {
  locationId: string;
  locationContactAndAddress?: FedExRateContactAndAddress;
  locationType?: FedExRateLocationType;
}

export interface FedExRateContactAndAddress {
  contact?: FedExRateContact2;
  address?: FedExRateAddress1;
}

export interface FedExRateContact2 {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
}

export interface FedExRateAddress1 {
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
}

export interface FedExRateShipmentSpecialServicesRequestedShipmentCODDetail {
  addTransportationChargesDetail?: FedExRateCODTransportationChargesDetail;
  codRecipient?: FedExRateParty2;
  remitToName?: string;
  codCollectionType?: FedExRateCodCollectionType;
  financialInstitutionContactAndAddress?: FedExRateContactAndAddress;
  returnReferenceIndicatorType?: "INVOICE" | "PO" | "REFERENCE" | "TRACKING";
}

export interface FedExRateCODTransportationChargesDetail {
  rateType?: FedExRateRateType;
  rateLevelType?: "BUNDLED_RATE" | "INDIVIDUAL_PACKAGE_RATE";
  chargeLevelType?: "CURRENT_PACKAGE" | "SUM_OF_PACKAGES";
  chargeType?:
    "COD_SURCHARGE" | "NET_CHARGE" | "NET_FREIGHT" | "TOTAL_CUSTOMER_CHARGE";
}

export interface FedExRateParty2 {
  address?: FedExRateAddress1;
  contact?: FedExRateContact2;
  accountNumber?: FedExRateAccountNumber;
}

export interface FedExRateShipmentDryIceDetail {
  totalWeight?: FedExRateWeight12;
  packageCount?: number;
}

export interface FedExRateInternationalControlledExportDetail {
  type?: FedExRateType;
}

export interface FedExRateHomeDeliveryPremiumDetail {
  /** YYYY-MM-DD */
  shipTimestamp?: string;
  homedeliveryPremiumType?: "APPOINTMENT" | "DATE_CERTAIN" | "EVENING";
}

export interface CustomsClearanceDetail {
  brokers?: FedExRateBrokerDetail[];
  commercialInvoice?: FedExRateCommercialInvoice;
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
  dutiesPayment?: DutiesPayment;
  commodities: Commodity[];
}

export interface FedExRateBrokerDetail {
  broker: FedExRateBrokerDetailBroker;
  type: "IMPORT";
}

export interface FedExRateBrokerDetailBroker {
  address: FedExRateAddress1;
  accountNumber?: FedExRateAccountNumber;
  /** The spec requires a contact but defines none of its fields, so all are optional (unlike the delivery-on-invoice recipient). */
  contact: FedExRateContact2;
}

export interface FedExRateCommercialInvoice {
  shipmentPurpose?: FedExRateShipmentPurpose;
}

export interface DutiesPayment {
  payor?: FedExRatePayor;
  paymentType?: "SENDER";
}

export interface FedExRatePayor {
  responsibleParty?: FedExRateResponsibleParty;
}

export interface FedExRateResponsibleParty {
  address?: FedExRateAddress1;
  contact?: FedExRateContact2;
  accountNumber: FedExRateAccountNumber;
}

export interface Commodity {
  description?: string;
  weight?: FedExRateWeight2;
  quantity?: number;
  customsValue?: FixedValue;
  unitPrice?: FixedValue;
  numberOfPieces?: number;
  countryOfManufacture?: string;
  quantityUnits?: string;
  name?: string;
  harmonizedCode?: string;
  partNumber?: string;
}

export interface SmartPostInfoDetail {
  ancillaryEndorsement?: FedExRateAncillaryEndorsement;
  hubId?: string;
  indicia?: FedExRateIndicia;
  specialServices?: "USPS_DELIVERY_CONFIRMATION";
}

export interface FedExRateVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface GetRatesAndTransitTimesOutput {
  rateReplyDetails?: RateReplyDetail[];
  quoteDate?: string;
  isEncoded?: boolean;
}

export interface RateReplyDetail {
  serviceType?: FedExServiceType;
  serviceName?: string;
  packagingType?: FedExPackageType;
  customerMessages?: CustomerMessage[];
  ratedShipmentDetails?: RatedShipmentDetails[];
  operationalDetail?: OperationalDetail;
  signatureOptionType?: string;
  serviceDescription?: ServiceDescription;
  brokerDetail?: BrokerDetail;
  commit?: Commit;
  serviceSubOptionDetail?: ServiceSubOptionDetail;
}

export interface CustomerMessage {
  code?: string;
  message?: string;
}

export interface RatedShipmentDetails {
  rateType?: FedExRateRateType;
  totalNetTransportationAndPickupCharge?: FixedValue;
  totalNetFedExTransportationAndPickupCharge?: FixedValue;
  pickupRateDetail?: FedExRatePickupRateDetail;
  ratedWeightMethod?: FedExRateRatedWeightMethod;
  totalDutiesTaxesAndFees?: number;
  totalDiscounts?: number;
  totalDutiesAndTaxes?: number;
  variableHandlingCharges?: VariableHandlingCharge;
  edtCharges?: EdtCharge[];
  totalAncillaryFeesAndTaxes?: number;
  ratedPackages?: RatedPackage[];
  totalNetFedExCharge?: number;
  quoteNumber?: string;
  shipmentLegRateDetails?: ShipmentLegRateDetail[];
  freightChargeBasis?: "CWT" | "FLAT" | "MINIMUM";
  totalVariableHandlingCharges?: VariableHandlingCharge;
  totalVatCharge?: number;
  ancillaryFeesAndTaxes?: FedExRateAncillaryFeesAndTaxes[];
  preferredEdtCharges?: EdtCharge[];
  totalNetCharge?: number;
  totalBaseCharge?: number;
  totalNetChargeWithDutiesAndTaxes?: number;
  shipmentRateDetail?: ShipmentRateDetail;
}

export interface FedExRatePickupRateDetail {
  rateType?: FedExRateRateType2;
  rateScale?: string;
  rateZone?: string;
  ratingBasis?:
    | "SHIPMENT_WEIGHT_BASED"
    | "FLAT_RATE_PER_PAK"
    | "PACK_WEIGHT_BASED"
    | "UNKNOWN";
  pricingCode?: FedExRatePricingCode;
  minimumChargeType?: FedExRateMinimumChargeType;
  currencyExchangeRate?: CurrencyExchangeRate;
  specialRatingApplied?: (
    "FEDEX_ONE_RATE" | "FIXED_FUEL_SURCHARGE" | "IMPORT_PRICING"
  )[];
  fuelSurchargePercent?: number;
  pickupBaseChargeDescription?: FedExRatePickupBaseChargeDescription;
  totalBaseCharge?: FixedValue;
  totalFreightDiscounts?: FixedValue;
  totalNetFreight?: FixedValue;
  totalSurcharges?: FixedValue;
  totalNetFedExCharge?: FixedValue;
  totalTaxes?: FixedValue;
  totalNetCharge?: FixedValue;
  totalRebates?: FixedValue;
  totalDutiesAndTaxes?: FixedValue;
  totalAncillaryFeesAndTaxes?: FixedValue;
  totalDutiesTaxesAndFees?: FixedValue;
  totalNetChargeWithDutiesAndTaxes?: FixedValue;
  freightDiscounts?: FedExRateRateDiscount2[];
  rebates?: FedExRateRebate[];
  surcharges?: FedExRateSurcharge2[];
  taxes?: FedExRateTax2[];
  dutiesAndTaxes?: FedExRateEdtCommodityTax[];
  ancillaryFeesAndTaxes?: AncillaryFeeAndTax[];
  variableHandlingCharges?: FedExRateVariableHandlingCharges1;
  totalVariableHandlingCharges?: FedExRateVariableHandlingCharges1;
}

export interface CurrencyExchangeRate {
  fromCurrency?: string;
  intoCurrency?: string;
  rate?: number;
}

export interface FedExRateRateDiscount2 {
  rateDiscountType?: FedExRateRateDiscountType;
  description?: string;
  amount?: FixedValue;
  percent?: number;
}

export interface FedExRateRebate {
  rebateType?: "BONUS" | "EARNED" | "OTHER";
  description?: string;
  amount?: FixedValue;
  percent?: number;
}

export interface FedExRateSurcharge2 {
  surchargeType?: FedExRateSurchargeType;
  level?: "PACKAGE" | "SHIPMENT";
  description?: string;
  amount?: FixedValue;
}

export interface FedExRateTax2 {
  taxType?: FedExRateTaxType;
  description?: string;
  amount?: FixedValue;
}

export interface FedExRateEdtCommodityTax {
  harmonizedCode?: string;
  taxes?: FedExRateEdtTaxDetail1;
  total?: FixedValue;
}

export interface FedExRateEdtTaxDetail1 {
  taxType?: FedExRateTaxType2;
  taxcode?: string;
  /** YYYY-MM-DD */
  effectiveDate?: string;
  name?: string;
  taxableValue?: FixedValue;
  description?: string;
  formula?: string;
  amount?: FixedValue;
  taxRates?: FedExRateTaxRate[];
  appliedPreferentialTradeAgreement?: FedExRateAppliedPreferentialTradeAgreement;
}

export interface FedExRateTaxRate {
  value?: string;
  currency?: string;
  quantity?: number;
  unitOfMeasure?: string;
}

export interface FedExRateAppliedPreferentialTradeAgreement {
  id?: string;
  name?: string;
  description?: string;
}

export interface AncillaryFeeAndTax {
  type?:
    | "CLEARANCE_ENTRY_FEE"
    | "GOODS_AND_SERVICES_TAX"
    | "HARMONIZED_SALES_TAX"
    | "OTHER";
  description?: string;
  amount?: FixedValue;
}

export interface FedExRateVariableHandlingCharges1 {
  variableHandlingCharge?: FixedValue;
  fixedVariableHandlingCharge?: FixedValue;
  percentVariableHandlingCharge?: FixedValue;
  totalCustomerCharge?: FixedValue;
}

export interface VariableHandlingCharge {
  totalCustomerCharge?: number;
  variableHandlingCharge?: number;
}

export interface EdtCharge {
  edtTaxDetail?: EdtTaxDetail;
  harmonizedCode?: string;
}

export interface EdtTaxDetail {
  edtTaxType?: string;
  amount?: number;
  taxableValue?: number;
  name?: string;
  description?: string;
  formula?: string;
  /** YYYY-MM-DD */
  effectiveDate?: string;
}

export interface RatedPackage {
  effectiveNetDiscount?: number;
  packageRateDetail?: PackageRateDetail;
  groupNumber?: number;
}

export interface PackageRateDetail {
  ratedWeightMethod?: string;
  totalTaxes?: number;
  totalFreightDiscounts?: number;
  baseCharge?: number;
  totalRebates?: number;
  rateType?: string;
  billingWeight?: FedExRateWeight2;
  netFreight?: number;
  surcharges?: Surcharge[];
  totalSurcharges?: number;
  netFedExCharge?: number;
  netCharge?: number;
  freightDiscounts?: Discount[];
}

export interface Surcharge {
  type?: string;
  description?: string;
  amount?: number;
  level?: string;
  name?: string;
}

export interface Discount {
  amount?: number;
  name?: string;
  description?: string;
  type?: string;
  percent?: number;
}

export interface ShipmentLegRateDetail {
  discounts?: Discount[];
  pricingCode?: string;
  legDescription?: string;
  surcharges?: Surcharge[];
  specialRatingApplied?: string[];
  taxes?: Tax[];
  rateScale?: string;
  totalNetCharge?: number;
  totalBaseCharge?: number;
  currencyExchangeRate?: CurrencyExchangeRate;
  totalBillingWeight?: FedExRateWeight12;
  currency?: string;
}

export interface Tax {
  amount?: number;
  name?: string;
  description?: string;
  type?: string;
}

export interface FedExRateAncillaryFeesAndTaxes {
  amount?: number;
  description?: string;
  type?: string;
}

export interface ShipmentRateDetail {
  currencyExchangeRate?: CurrencyExchangeRate;
  currency?: string;
  rateZone?: string;
  ratingBasis?:
    "SHIPMENT_WEIGHT_BASED" | "FLAT_RATE_PER_PACK" | "PACK_WEIGHT_BASED";
  pricingCode?: string;
  totalFreightDiscount?: number;
  specialRatingApplied?: string[];
  totalSurcharges?: number;
  freightDiscount?: Discount[];
  fuelSurchargePercent?: number;
  totalBillingWeight?: FedExRateWeight12;
  totalDimWeight?: FedExRateWeight12;
  dimDivisor?: number;
  surCharges?: Surcharge[];
  taxes?: Tax[];
}

export interface OperationalDetail {
  originLocationIds?: string[];
  commitDays?: string[];
  serviceCode?: string;
  airportId?: string;
  scac?: string;
  originServiceAreas?: string[];
  deliveryDay?: string;
  originLocationNumbers?: number[];
  destinationPostalCode?: string;
  commitDate?: string;
  astraDescription?: string;
  deliveryDate?: string;
  deliveryEligibilities?: string[];
  ineligibleForMoneyBackGuarantee?: boolean;
  MaximumTransitTime?: string;
  astraPlannedServiceLevel?: string;
  destinationLocationIds?: string[];
  destinationLocationStateOrProvinceCodes?: string[];
  transitTime?: string;
  packagingCode?: string;
  destinationLocationNumbers?: number[];
  publishedDeliveryTime?: string;
  countryCodes?: string[];
  stateOrProvinceCodes?: string[];
  ursaPrefixCode?: string;
  ursaSuffixCode?: string;
  destinationServiceAreas?: string[];
  originPostalCodes?: string[];
  customTransitTime?: string;
}

export interface ServiceDescription {
  serviceType?: string;
  code?: string;
  names?: Name[];
  astraDescription?: string;
  description?: string;
  serviceId?: string;
  serviceCategory?: string;
}

export interface Name {
  type?: string;
  encoding?: string;
  value?: string;
}

export interface BrokerDetail {
  broker: Broker;
  type: "EXPORT" | "IMPORT";
  brokerAddress?: FedexAdvancedAddress;
}

export interface Broker {
  address: FedExRateAddress1;
  accountNumber?: FedExRateAccountNumber;
}

export interface FedexAdvancedAddress {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
  classification?: string;
  geographicCoordinates?: string;
  urbanizationCode?: string;
  countryName?: string;
}

export interface Commit {
  daysInTransit?: FedExRateDaysInTransit;
  guaranteedType?: "GUARANTEED_MORNING" | "GUARANTEED_CLOSE_OF_BUSINESS";
  smartPostCommitTime?: string;
  dateDetail?: DateDetail;
  delayDetails?: FedExRateDelayDetail;
  saturdayDelivery?: boolean;
  alternativeCommodityNames?: string[];
  transitDays?: TransitDays;
  label?: string;
  commitMessageDetails?: string;
  commodityName?: string;
}

export interface DateDetail {
  dayOfWeek?: string;
  /** YYYY-MM-DDTHH:mm:ss */
  dayFormat?: string;
}

export interface FedExRateDelayDetail {
  /** YYYY-MM-DD */
  date?: string;
  dayOfWeek?: string;
  level?: string;
  point?: string;
  type?: string;
  description?: string;
}

export interface TransitDays {
  description?: string;
  minimumTransitTime?: FedExRateDaysInTransit;
  maximumTransitTime?: string;
}

export interface ServiceSubOptionDetail {
  smartPostIndiciaType?: FedExRateIndicia;
}

export type FedExRateRateType =
  | "ACCOUNT"
  | "ACTUAL"
  | "CURRENT"
  | "CUSTOM"
  | "LIST"
  | "INCENTIVE"
  | "PREFERRED"
  | "PREFERRED_INCENTIVE"
  | "PREFERRED_CURRENCY";

export type FedExRateSignatureOptionType =
  "SERVICE_DEFAULT" | "NO_SIGNATURE_REQUIRED" | "INDIRECT" | "DIRECT" | "ADULT";

export type FedExRateOption =
  | "HAZARDOUS_MATERIALS"
  | "BATTERY"
  | "ORM_D"
  | "REPORTABLE_QUANTITIES"
  | "SMALL_QUANTITY_EXCEPTION"
  | "LIMITED_QUANTITIES_COMMODITIES";

export type FedExRateRadioactiveContainerClass =
  | "EXCEPTED_PACKAGE"
  | "INDUSTRIAL_IP1"
  | "INDUSTRIAL_IP2"
  | "INDUSTRIAL_IP3"
  | "TYPE_A"
  | "TYPE_B_M"
  | "TYPE_B_U"
  | "TYPE_C";

export type FedExRateCodCollectionType =
  "ANY" | "CASH" | "COMPANY_CHECK" | "GUARANTEED_FUNDS" | "PERSONAL_CHECK";

export type FedExRateReturnType =
  | "FEDEX_TAG"
  | "PENDING"
  | "PRINT_RETURN_LABEL"
  | "EMAIL_LABEL"
  | "NET_RETURN"
  | "VOICE_CALL_TAG";

export type FedExRateLocationType =
  | "FEDEX_AUTHORIZED_SHIP_CENTER"
  | "FEDEX_OFFICE"
  | "FEDEX_SELF_SERVICE_LOCATION"
  | "FEDEX_STAFFED"
  | "RETAIL_ALLICANCE_LOCATION"
  | "FEDEX_GROUND_TERMINAL"
  | "FEDEX_ONSITE";

export type FedExRateType =
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

export type FedExRateShipmentPurpose =
  | "GIFT"
  | "NOT_SOLD"
  | "PERSONAL_EFFECTS"
  | "REPAIR_AND_RETURN"
  | "SAMPLE"
  | "SOLD"
  | "COMMERCIAL"
  | "RETURN_AND_REPAIR"
  | "PERSONAL_USE";

export type FedExRateAncillaryEndorsement =
  | "ADDRESS_CORRECTION"
  | "CARRIER_LEAVE_IF_NO_RESPONSE"
  | "CHANGE_SERVICE"
  | "FORWARDING_SERVICE"
  | "RETURN_SERVICE";

export type FedExRateIndicia =
  | "MEDIA_MAIL"
  | "PARCEL_RETURN"
  | "PARCEL_SELECT"
  | "PRESORTED_BOUND_PRINTED_MATTER"
  | "PRESORTED_STANDARD";

export type FedExRateRateType2 =
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

export type FedExRatePricingCode =
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

export type FedExRateMinimumChargeType =
  | "CUSTOMER"
  | "CUSTOMER_FREIGHT_WEIGHT"
  | "EARNED_DISCOUNT"
  | "MIXED"
  | "RATE_SCALE"
  | "UNKNOWN";

export type FedExRatePickupBaseChargeDescription =
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

export type FedExRateRateDiscountType =
  "BONUS" | "COUPON" | "EARNED" | "INCENTIVE" | "OTHER" | "VOLUME";

export type FedExRateSurchargeType =
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

export type FedExRateTaxType =
  "EXPORT" | "GST" | "HST" | "INTRACOUNTRY" | "OTHER" | "PST" | "SST" | "VAT";

export type FedExRateTaxType2 =
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

export type FedExRateRatedWeightMethod =
  | "ACTUAL"
  | "AVERAGE_PACKAGE_WEIGHT_MINIMUM"
  | "DEFAULT_WEIGHT_APPLIED"
  | "BALLOON"
  | "DIM"
  | "FREIGHT_MINIMUM"
  | "MIXED"
  | "OVERSIZE"
  | "OVERSIZE_1"
  | "OVERSIZE_2"
  | "OVERSIZE_3"
  | "PACKAGING_MINIMUM"
  | "WEIGHT_BREAK";

export type FedExRateDaysInTransit =
  | "EIGHT_DAYS"
  | "EIGHTEEN_DAYS"
  | "ELEVEN_DAYS"
  | "FIFTEEN_DAYS"
  | "FIVE_DAYS"
  | "FOUR_DAYS"
  | "FOURTEEN_DAYS"
  | "NINE_DAYS"
  | "NINETEEN_DAYS"
  | "ONE_DAY"
  | "SEVEN_DAYS"
  | "SEVENTEEN_DAYS"
  | "SIX_DAYS"
  | "SIXTEEN_DAYS"
  | "TEN_DAYS"
  | "THIRTEEN_DAYS"
  | "THREE_DAYS"
  | "TWELVE_DAYS"
  | "TWENTY_DAYS"
  | "TWO_DAYS"
  | "SMARTPOST_TRANSIT_DAYS"
  | "UNKNOWN";

// Exports kept from v1.0.0 so imports keep compiling. Wire fields are now
// string-literal unions, so these enums are no longer referenced by any field
// type (their members still assign to the unions). Several members are not
// values the spec lists; see docs/fedex-api.md.
export enum VariableOption {
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  FREIGHT_GUARANTEE = "FREIGHT_GUARANTEE",
  SMART_POST_ALLOWED_INDICIATOR = "SMART_POST_ALLOWED_INDICIA",
  SMARTPOST_HUB_ID = "SMARTPOST_HUB_ID",
}

export enum RateSortOrder {
  COMMIT_ASCENDING = "COMMITASCENDING",
  SERVICE_NAME_TRADITIONAL = "SERVICENAMETRADITIONAL",
  COMMIT_DESCENDING = "COMMITDESCENDING",
}

export enum NotificationFormatType {
  HTML = "HTML",
  TEXT = "TEXT",
}

export enum EmailNotificationRecipientType {
  BROKER = "BROKER",
  OTHER = "OTHER",
  RECIPIENT = "RECIPIENT",
  SHIPPER = "SHIPPER",
  THIRD_PARTY = "THIRD_PARTY",
  OTHER1 = "OTHER1",
  OTHER2 = "OTHER2",
}

export enum PackageSpecialService {
  ALCOHOL = "ALCOHOL",
  APPOINTMENT = "APPOINTMENT",
  BATTERY = "BATTERY",
  COD = "COD",
  DANGEROUS_GOODS = "DANGEROUS_GOODS",
  DRY_ICE = "DRY_ICE",
  PRIORITY_ALERT = "PRIORITY_ALERT",
  PRIORITY_ALERT_PLUS = "PRIORITY_ALERT_PLUS",
  NON_STANDARD_CONTAINER = "NON_STANDARD_CONTAINER",
  PIECE_COUNT_VERIFICATION = "PIECE_COUNT_VERIFICATION",
  SIGNATURE_OPTION = "SIGNATURE_OPTION",
  EVENING = "EVENING",
  DATE_CERTAIN = "DATE_CERTAIN",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
}

export enum NotificationEventType {
  ON_DELIVERY = "ON_DELIVERY",
  ON_EXCEPTION = "ON_EXCEPTION",
  ON_SHIPMENT = "ON_SHIPMENT",
  ON_TENDER = "ON_TENDER",
  ON_ESTIMATED_DELIVERY = "ON_ESTIMATED_DELIVERY",
  ON_PICKUP = "ON_PICKUP",
  ON_LABEL = "ON_LABEL",
  ON_BILL_OF_LADING = "ON_BILL_OF_LADING",
}

export enum NotificationType {
  EMAIL = "EMAIL",
  SMS = "SMS_TEXT_MESSAGE",
}

export enum Locale {
  ar_AE = "ar_AE",
  bg_BG = "bg_BG",
  zh_CN = "zh_CN",
  zh_HK = "zh_HK",
  zh_TW = "zh_TW",
  cs_CZ = "cs_CZ",
  da_DK = "da_DK",
  nl_NL = "nl_NL",
  en_CA = "en_CA",
  en_GB = "en_GB",
  en_US = "en_US",
  et_EE = "et_EE",
  fi_FI = "fi_FI",
  fr_CA = "fr_CA",
  fr_FR = "fr_FR",
  de_DE = "de_DE",
  de_CH = "de_CH",
  el_GR = "el_GR",
  hu_HU = "hu_HU",
  it_IT = "it_IT",
  ja_JP = "ja_JP",
  ko_KR = "ko_KR",
  lv_LV = "lv_LV",
  lt_LT = "lt_LT",
  no_NO = "no_NO",
  pl_PL = "pl_PL",
  pt_BR = "pt_BR",
  pt_PT = "pt_PT",
  ro_RO = "ro_RO",
  ru_RU = "ru_RU",
  sk_SK = "sk_SK",
  sl_SI = "sl_SI",
  es_AR = "es_AR",
  es_MX = "es_MX",
  es_ES = "es_ES",
  es_US = "es_US",
  sv_SE = "sv_SE",
  th_TH = "th_TH",
  tr_TR = "tr_TR",
  uk_UA = "uk_UA",
  vi_VN = "vi_VN",
}

export enum PrintedReferenceType {
  BILL_OF_LADING = "BILL_OF_LADING",
  CONSIGNEE_ID_NUMBER = "CONSIGNEE_ID_NUMBER",
  INTERLINE_PRO_NUMBER = "INTERLINE_PRO_NUMBER",
  PO_NUMBER = "PO_NUMBER",
  SHIPPER_ID_NUMBER = "SHIPPER_ID_NUMBER",
  SHIPPER_ID1_NUMBER = "SHIPPER_ID1_NUMBER",
  SHIPPER_ID2_NUMBER = "SHIPPER_ID2_NUMBER",
}

/**
 * Indicate the type of rates to be returned.
 * @example ["LIST","PREFERRED"]
 */

export type RateRequestType =
  /** Returns FedEx published list rates in addition to account-specific rates (if applicable). */
  | "LIST"
  /** Returns rates in the preferred currency specified in the element preferredCurrency. */
  | "PREFERRED"
  /** Returns account specific rates (Default). */
  | "ACCOUNT"
  /** This is one-time discount for incentivising the customer. For more information, contact your FedEx representative. */
  | "INCENTIVE";

export type PickupType =
  | "CONTACT_FEDEX_TO_SCHEDULE"
  | "DROPOFF_AT_FEDEX_LOCATION"
  | "USE_SCHEDULED_PICKUP"
  /** Indicates the pickup will be scheduled by calling FedEx. */
  | "ON_CALL"
  /** Indicates the pickup by FedEx Ground Package Returns Program. */
  | "PACKAGE_RETURN_PROGRAM"
  /** Indicates the pickup at the regular pickup schedule. */
  | "REGULAR_STOP"
  /** Indicates the pickup specific to an Express tag or Ground call tag pickup request. */
  | "TAG";

export enum RateType {
  ACCOUNT = "ACCOUNT",
  ACTUAL = "ACTUAL",
  CURRENT = "CURRENT",
  CUSTOM = "CUSTOM",
  LIST = "LIST",
  INCENTIVE = "INCENTIVE",
  PREFERRED = "PREFERRED",
  PREFERRED_INCENTIVE = "PREFERRED_INCENTIVE",
  PREFERRED_CURRENCY = "PREFERRED_CURRENCY",
}

export enum RateLevelType {
  BUNDLED_RATE = "BUNDLED_RATE",
  INDIVIDUAL_PACKAGE_RATE = "INDIVIDUAL_PACKAGE_RATE",
}

export enum RateElementBasis {
  NET_CHARGE = "NET_CHARGE",
  NET_FREIGHT = "NET_FREIGHT",
  BASE_CHARGE = "BASE_CHARGE",
  NET_CHARGE_EXCLUDING_TAXES = "NET_CHARGE_EXCLUDING_TAXES",
}

export enum ShipmentPurpose {
  GIFT = "GIFT",
  NOT_SOLD = "NOT_SOLD",
  PERSONAL_EFFECTS = "PERSONAL_EFFECTS",
  REPAIR_AND_RETURN = "REPAIR_AND_RETURN",
  SAMPLE = "SAMPLE",
  SOLD = "SOLD",
  COMMERCIAL = "COMMERCIAL",
  RETURN_AND_REPAIR = "RETURN_AND_REPAIR",
  PERSONAL_USE = "PERSONAL_USE",
}

export enum FreightOnValue {
  CARRIER_RISK = "CARRIER_RISK",
  OWN_RISK = "OWN_RISK",
}

export enum AncillaryEndorsement {
  ADDRESS_CORRECTION = "ADDRESS_CORRECTION",
  CARRIER_LEAVE_IF_NO_RESPONSE = "CARRIER_LEAVE_IF_NO_RESPONSE",
  CHANGE_SERVICE = "CHANGE_SERVICE",
  FORWARDING_SERVICE = "FORWARDING_SERVICE",
  RETURN_SERVICE = "RETURN_SERVICE",
}

export enum SmartPostHubId {
  NOMA = "5015",
  WICT = "5061",
  EDNJ = "5087",
  NENJ = "5095",
  SBNJ = "5097",
  NENY = "5110",
  PTPA = "5150",
  MAPA = "5183",
  ALPA = "5185",
  SCPA = "5186",
  PHPA = "5194",
  BAMD = "5213",
  MAWV = "5254",
  CHNC = "5281",
  ATGA = "5303",
  ORFL = "5327",
  TAFL = "5345",
  METN = "5379",
  GCOH = "5431",
  GPOH = "5436",
  ININ = "5465",
  DTMI = "5481",
  NBWI = "5531",
  MPMN = "5552",
  WHIL = "5602",
  STMO = "5631",
  KCKS = "5648",
  DLTX = "5751",
  HOTX = "5771",
  DNCO = "5802",
  SCUT = "5843",
  PHAZ = "5854",
  RENV = "5893",
  LACA = "5902",
  COCA = "5929",
  SACA = "5958",
  SEWA = "5983",
}

export enum Indicia {
  PARCEL_SELECT = "PARCEL_SELECT",
  PARCEL_RETURN = "PARCEL_RETURN",
  MEDIA_MAIL = "MEDIA_MAIL",
  PRESORTED_BOUND_PRINTED_MATTER = "PRESORTED_BOUND_PRINTED_MATTER",
  PRESORTED_STANDARD = "PRESORTED_STANDARD",
}

export enum SpecialService {
  /** FedEx Appointment Home Delivery® */
  APPOINTMENT = "APPOINTMENT",
  BROKER_SELECT_OPTION = "BROKER_SELECT_OPTION",
  CALL_BEFORE_DELIVERY = "CALL_BEFORE_DELIVERY",
  /** Collect on Delivery (COD) */
  COD = "COD",
  CUSTOM_DELIVERY_WINDOW = "CUSTOM_DELIVERY_WINDOW",
  CUT_FLOWERS = "CUT_FLOWERS",
  DO_NOT_BREAK_DOWN_PALLETS = "DO_NOT_BREAK_DOWN_PALLETS",
  DO_NOT_STACK_PALLETS = "DO_NOT_STACK_PALLETS",
  DRY_ICE = "DRY_ICE",
  /** East Coast Special Service */
  EAST_COAST_SPECIAL = "EAST_COAST_SPECIAL",
  EXCLUDE_FROM_CONSOLIDATION = "EXCLUDE_FROM_CONSOLIDATION",
  EXTREME_LENGTH = "EXTREME_LENGTH",
  INSIDE_DELIVERY = "INSIDE_DELIVERY",
  INSIDE_PICKUP = "INSIDE_PICKUP",
  INTERNATIONAL_CONTROLLED_EXPORT_SERVICE = "INTERNATIONAL_CONTROLLED_EXPORT_SERVICE",
  FEDEX_ONE_RATE = "FEDEX_ONE_RATE",
  /** FedEx Third Party Consignee International Priority service (TPC) */
  THIRD_PARTY_CONSIGNEE = "THIRD_PARTY_CONSIGNEE",
  ELECTRONIC_TRADE_DOCUMENTS = "ELECTRONIC_TRADE_DOCUMENTS",
  FOOD = "FOOD",
  FUTURE_DAY_SHIPMENT = "FUTURE_DAY_SHIPMENT",
  HOLD_AT_LOCATION = "HOLD_AT_LOCATION",
  /** International Traffic in Arms Regulations(ITAR) */
  INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS = "INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS",
  LIFTGATE_DELIVERY = "LIFTGATE_DELIVERY",
  LIFTGATE_PICKUP = "LIFTGATE_PICKUP",
  LIMITED_ACCESS_DELIVERY = "LIMITED_ACCESS_DELIVERY",
  LIMITED_ACCESS_PICKUP = "LIMITED_ACCESS_PICKUP",
  OVER_LENGTH = "OVER_LENGTH",
  PENDING_SHIPMENT = "PENDING_SHIPMENT",
  PHARMACY_DELIVERY = "PHARMACY_DELIVERY",
  POISON = "POISON",
  /** Premium Home Delivery */
  HOME_DELIVERY_PREMIUM = "HOME_DELIVERY_PREMIUM",
  PROTECTION_FROM_FREEZING = "PROTECTION_FROM_FREEZING",
  RETURNS_CLEARANCE = "RETURNS_CLEARANCE",
  RETURN_SHIPMENT = "RETURN_SHIPMENT",
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
  /** Shipment Event Notification */
  EVENT_NOTIFICATION = "EVENT_NOTIFICATION",
  DELIVERY_ON_INVOICE_ACCEPTANCE = "DELIVERY_ON_INVOICE_ACCEPTANCE",
  TOP_LOAD = "TOP_LOAD",
  FREIGHT_GUARANTEE = "FREIGHT_GUARANTEE",
}

export enum AlertType {
  NOTE = "NOTE",
  WARNING = "WARNING",
}

export enum RatedWeightMethod {
  ACTUAL = "ACTUAL",
  AVERAGE_PACKAGE_WEIGHT_MINIMUM = "AVERAGE_PACKAGE_WEIGHT_MINIMUM",
  DEFAULT_WEIGHT_APPLIED = "DEFAULT_WEIGHT_APPLIED",
  BALLOON = "BALLOON",
  DIM = "DIM",
  FREIGHT_MINIMUM = "FREIGHT_MINIMUM",
  MIXED = "MIXED",
  OVERSIZE = "OVERSIZE",
  OVERSIZE_1 = "OVERSIZE_1",
  OVERSIZE_2 = "OVERSIZE_2",
  OVERSIZE_3 = "OVERSIZE_3",
  PACKAGING_MINIMUM = "PACKAGING_MINIMUM",
  WEIGHT_BREAK = "WEIGHT_BREAK",
}

export enum FreightChargeBasis {
  CWT = "CWT",
  FLAT = "FLAT",
  MINIMUM = "MINIMUM",
}

export enum SurchargeType {
  ACCOUNT_NUMBER_PROCESSING_FEE = "ACCOUNT_NUMBER_PROCESSING_FEE",
  ADDITIONAL_HANDLING = "ADDITIONAL_HANDLING",
  ADDRESS_CORRECTION = "ADDRESS_CORRECTION",
  ANCILLARY_FEE = "ANCILLARY_FEE",
  BLIND_SHIPMENT = "BLIND_SHIPMENT",
  BROKER_SELECT_OPTION = "BROKER_SELECT_OPTION",
  CANADIAN_DESTINATION = "CANADIAN_DESTINATION",
  CHARGEABLE_PALLET_WEIGHT = "CHARGEABLE_PALLET_WEIGHT",
  CLEARANCE_ENTRY_FEE = "CLEARANCE_ENTRY_FEE",
  COD = "COD",
  CUT_FLOWERS = "CUT_FLOWERS",
  DANGEROUS_GOODS = "DANGEROUS_GOODS",
  DELIVERY_AREA = "DELIVERY_AREA",
  DELIVERY_CONFIRMATION = "DELIVERY_CONFIRMATION",
  DELIVERY_ON_INVOICE_ACCEPTANCE = "DELIVERY_ON_INVOICE_ACCEPTANCE",
  DETENTION = "DETENTION",
  DOCUMENTATION_FEE = "DOCUMENTATION_FEE",
  DRY_ICE = "DRY_ICE",
  EMAIL_LABEL = "EMAIL_LABEL",
  EUROPE_FIRST = "EUROPE_FIRST",
  EXCESS_VALUE = "EXCESS_VALUE",
  EXCLUSIVE_USE = "EXCLUSIVE_USE",
  EXHIBITION = "EXHIBITION",
  EXPEDITED = "EXPEDITED",
  EXPORT = "EXPORT",
  EXTRA_LABOR = "EXTRA_LABOR",
  EXTRA_SURFACE_HANDLING_CHARGE = "EXTRA_SURFACE_HANDLING_CHARGE",
  EXTREME_LENGTH = "EXTREME_LENGTH",
  FEDEX_INTRACOUNTRY_FEES = "FEDEX_INTRACOUNTRY_FEES",
  FEDEX_TAG = "FEDEX_TAG",
  FICE = "FICE",
  FLATBED = "FLATBED",
  FUEL = "FUEL",
  HOLD_AT_LOCATION = "HOLD_AT_LOCATION",
  HOLIDAY_DELIVERY = "HOLIDAY_DELIVERY",
  HOLIDAY_GUARANTEE = "HOLIDAY_GUARANTEE",
  HOME_DELIVERY_APPOINTMENT = "HOME_DELIVERY_APPOINTMENT",
  DATE_CERTAIN = "DATE_CERTAIN",
  EVENING = "EVENING",
  INSIDE_DELIVERY = "INSIDE_DELIVERY",
  INSIDE_PICKUP = "INSIDE_PICKUP",
  INSURED_VALUE = "INSURED_VALUE",
  INTERHAWAII = "INTERHAWAII",
  LIFTGATE_DELIVERY = "LIFTGATE_DELIVERY",
  LIFTGATE_PICKUP = "LIFTGATE_PICKUP",
  LIMITED_ACCESS_DELIVERY = "LIMITED_ACCESS_DELIVERY",
  LIMITED_ACCESS_PICKUP = "LIMITED_ACCESS_PICKUP",
  MARKING_OR_TAGGING = "MARKING_OR_TAGGING",
  METRO_DELIVERY = "METRO_DELIVERY",
  METRO_PICKUP = "METRO_PICKUP",
  NON_BUSINESS_TIME = "NON_BUSINESS_TIME",
  NON_MACHINABLE = "NON_MACHINABLE",
  OFFSHORE = "OFFSHORE",
  ON_CALL_PICKUP = "ON_CALL_PICKUP",
  ON_DEMAND_CARE = "ON_DEMAND_CARE",
  OTHER = "OTHER",
  OUT_OF_DELIVERY_AREA = "OUT_OF_DELIVERY_AREA",
  OUT_OF_PICKUP_AREA = "OUT_OF_PICKUP_AREA",
  OVERSIZE = "OVERSIZE",
  OVER_DIMENSION = "OVER_DIMENSION",
  OVER_LENGTH = "OVER_LENGTH",
  PALLETS_PROVIDED = "PALLETS_PROVIDED",
  PALLET_SHRINKWRAP = "PALLET_SHRINKWRAP",
  PEAK = "PEAK",
  PEAK_ADDITIONAL_HANDLING = "PEAK_ADDITIONAL_HANDLING",
  PEAK_OVERSIZE = "PEAK_OVERSIZE",
  PEAK_RESIDENTIAL_DELIVERY = "PEAK_RESIDENTIAL_DELIVERY",
  PIECE_COUNT_VERIFICATION = "PIECE_COUNT_VERIFICATION",
  PORT = "PORT",
  PRE_DELIVERY_NOTIFICATION = "PRE_DELIVERY_NOTIFICATION",
  PRIORITY_ALERT = "PRIORITY_ALERT",
  PROTECTION_FROM_FREEZING = "PROTECTION_FROM_FREEZING",
  REGIONAL_MALL_DELIVERY = "REGIONAL_MALL_DELIVERY",
  REGIONAL_MALL_PICKUP = "REGIONAL_MALL_PICKUP",
  REROUTE = "REROUTE",
  RESCHEDULE = "RESCHEDULE",
  RESIDENTIAL_DELIVERY = "RESIDENTIAL_DELIVERY",
  RESIDENTIAL_PICKUP = "RESIDENTIAL_PICKUP",
  RETURN_LABEL = "RETURN_LABEL",
  SATURDAY_DELIVERY = "SATURDAY_DELIVERY",
  SATURDAY_PICKUP = "SATURDAY_PICKUP",
  SHIPMENT_ASSEMBLY = "SHIPMENT_ASSEMBLY",
  SIGNATURE_OPTION = "SIGNATURE_OPTION",
  SORT_AND_SEGREGATE = "SORT_AND_SEGREGATE",
  SPECIAL_EQUIPMENT = "SPECIAL_EQUIPMENT",
  SPECIAL_DELIVERY = "SPECIAL_DELIVERY",
  SUNDAY_DELIVERY = "SUNDAY_DELIVERY",
  TARP = "TARP",
  THIRD_PARTY_CONSIGNEE = "THIRD_PARTY_CONSIGNEE",
  TRANSMART_SERVICE_FEE = "TRANSMART_SERVICE_FEE",
  USPS = "USPS",
  WEIGHING = "WEIGHING",
}

export enum BrokerType {
  EXPORT = "EXPORT",
  IMPORT = "IMPORT",
}

export enum DaysInTransit {
  ONE_DAY = "ONE_DAY",
  TWO_DAYS = "TWO_DAYS",
  THREE_DAYS = "THREE_DAYS",
  FOUR_DAYS = "FOUR_DAYS",
  FIVE_DAYS = "FIVE_DAYS",
  SIX_DAYS = "SIX_DAYS",
  SEVEN_DAYS = "SEVEN_DAYS",
  EIGHT_DAYS = "EIGHT_DAYS",
  NINE_DAYS = "NINE_DAYS",
  TEN_DAYS = "TEN_DAYS",
  ELEVEN_DAYS = "ELEVEN_DAYS",
  TWELVE_DAYS = "TWELVE_DAYS",
  THIRTEEN_DAYS = "THIRTEEN_DAYS",
  FOURTEEN_DAYS = "FOURTEEN_DAYS",
  FIFTEEN_DAYS = "FIFTEEN_DAYS",
  SIXTEEN_DAYS = "SIXTEEN_DAYS",
  SEVENTEEN_DAYS = "SEVENTEEN_DAYS",
  EIGHTEEN_DAYS = "EIGHTEEN_DAYS",
  NINETEEN_DAYS = "NINETEEN_DAYS",
  TWENTY_DAYS = "TWENTY_DAYS",
  SMARTPOST_TRANSIT_DAYS = "SMARTPOST_TRANSIT_DAYS",
  UNKNOWN = "UNKNOWN",
}

export enum GuaranteedType {
  GUARANTEED_MORNING = "GUARANTEED_MORNING",
  GUARANTEED_CLOSE_OF_BUSINESS = "GUARANTEED_CLOSE_OF_BUSINESS",
}

export enum SmartPostIndiciaType {
  MEDIA_MAIL = "MEDIA_MAIL",
  PARCEL_RETURN = "PARCEL_RETURN",
  PARCEL_SELECT = "PARCEL_SELECT",
  PRESORTED_BOUND_PRINTED_MATTER = "PRESORTED_BOUND_PRINTED_MATTER",
  PRESORTED_STANDARD = "PRESORTED_STANDARD",
}

export interface SmsDetail {
  phoneNumber: string;
  phoneNumberCountryCode: string;
}

export interface EmailNotificationRecipient {
  emailAddress: string;
  notificationEventType?: NotificationEventType[];
  smsDetail?: SmsDetail;
  notificationFormatType?: NotificationFormatType;
  emailNotificationRecipientType?: EmailNotificationRecipientType;
  notificationType?: NotificationType;
  locale?: Locale;
}

export interface PrintedReference {
  printedReferenceType: PrintedReferenceType;
  value: string;
}

export interface EmailNotificationDetail {
  recipients: EmailNotificationRecipient[];
  personalMessage?: string;
  PrintedReference: PrintedReference;
}

export interface ServiceTypeDetail {
  carrierCode?: FedexCarrierCodes;
  description?: string;
  serviceName?: string;
  serviceCategory?: string;
}

export interface ExpressFreightDetail {
  bookingConfirmationNumber?: string;
  shippersLoadAndCount?: string;
}

export interface ContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface Alert {
  code: string;
  alertType: AlertType;
  message: string;
}

export enum FedExCountryCode {
  AF = "AF",
  AL = "AL",
  DZ = "DZ",
  AS = "AS",
  AD = "AD",
  AO = "AO",
  AI = "AI",
  AQ = "AQ",
  AG = "AG",
  AR = "AR",
  AM = "AM",
  AW = "AW",
  AU = "AU",
  AT = "AT",
  AZ = "AZ",
  BS = "BS",
  BH = "BH",
  BD = "BD",
  BB = "BB",
  BY = "BY",
  BE = "BE",
  BZ = "BZ",
  BJ = "BJ",
  BM = "BM",
  BT = "BT",
  BO = "BO",
  BQ = "BQ",
  BA = "BA",
  BW = "BW",
  BV = "BV",
  BR = "BR",
  IO = "IO",
  BN = "BN",
  BG = "BG",
  BF = "BF",
  BI = "BI",
  KH = "KH",
  CM = "CM",
  CA = "CA",
  CV = "CV",
  CF = "CF",
  TD = "TD",
  CL = "CL",
  CN = "CN",
  CX = "CX",
  CC = "CC",
  CO = "CO",
  KM = "KM",
  CG = "CG",
  CD = "CD",
  CK = "CK",
  CR = "CR",
  HR = "HR",
  CU = "CU",
  CW = "CW",
  CY = "CY",
  CZ = "CZ",
  DK = "DK",
  DJ = "DJ",
  DM = "DM",
  DO = "DO",
  TL = "TL",
  EC = "EC",
  EG = "EG",
  SV = "SV",
  GB = "GB",
  GQ = "GQ",
  ER = "ER",
  EE = "EE",
  SZ = "SZ",
  ET = "ET",
  FO = "FO",
  FK = "FK",
  FJ = "FJ",
  FI = "FI",
  FR = "FR",
  GF = "GF",
  TF = "TF",
  GA = "GA",
  GM = "GM",
  GE = "GE",
  DE = "DE",
  GH = "GH",
  GI = "GI",
  KY = "KY",
  VG = "VG",
  GR = "GR",
  GL = "GL",
  GD = "GD",
  GP = "GP",
  GU = "GU",
  GT = "GT",
  GN = "GN",
  GW = "GW",
  GY = "GY",
  HT = "HT",
  HM = "HM",
  HN = "HN",
  HK = "HK",
  HU = "HU",
  IS = "IS",
  IN = "IN",
  ID = "ID",
  IR = "IR",
  IQ = "IQ",
  IE = "IE",
  IL = "IL",
  IT = "IT",
  CI = "CI",
  JM = "JM",
  JP = "JP",
  JO = "JO",
  KZ = "KZ",
  KE = "KE",
  KI = "KI",
  KW = "KW",
  KG = "KG",
  LA = "LA",
  LV = "LV",
  LB = "LB",
  LS = "LS",
  LR = "LR",
  LY = "LY",
  LI = "LI",
  LT = "LT",
  LU = "LU",
  MO = "MO",
  MK = "MK",
  MG = "MG",
  MW = "MW",
  MY = "MY",
  MV = "MV",
  ML = "ML",
  MT = "MT",
  MH = "MH",
  MQ = "MQ",
  MR = "MR",
  MU = "MU",
  YT = "YT",
  MX = "MX",
  FM = "FM",
  MD = "MD",
  MC = "MC",
  MN = "MN",
  ME = "ME",
  MS = "MS",
  MA = "MA",
  MZ = "MZ",
  MM = "MM",
  NA = "NA",
  NR = "NR",
  NP = "NP",
  NL = "NL",
  NC = "NC",
  NZ = "NZ",
  NI = "NI",
  NE = "NE",
  NG = "NG",
  NU = "NU",
  NF = "NF",
  KP = "KP",
  MP = "MP",
  NO = "NO",
  OM = "OM",
  PK = "PK",
  PW = "PW",
  PS = "PS",
  PA = "PA",
  PG = "PG",
  PY = "PY",
  PE = "PE",
  PH = "PH",
  PN = "PN",
  PL = "PL",
  PT = "PT",
  PR = "PR",
  QA = "QA",
  RE = "RE",
  RO = "RO",
  RU = "RU",
  RW = "RW",
  WS = "WS",
  ST = "ST",
  SA = "SA",
  SN = "SN",
  RS = "RS",
  SC = "SC",
  SL = "SL",
  SG = "SG",
  SK = "SK",
  SI = "SI",
  SB = "SB",
  SO = "SO",
  ZA = "ZA",
  GS = "GS",
  KR = "KR",
  ES = "ES",
  LK = "LK",
  BL = "BL",
  KN = "KN",
  VI = "VI",
  SH = "SH",
  LC = "LC",
  SX = "SX",
  MF = "MF",
  PM = "PM",
  VC = "VC",
  SD = "SD",
  SR = "SR",
  SJ = "SJ",
  SE = "SE",
  CH = "CH",
  SY = "SY",
  PF = "PF",
  TW = "TW",
  TJ = "TJ",
  TZ = "TZ",
  TH = "TH",
  TG = "TG",
  TK = "TK",
  TO = "TO",
  TT = "TT",
  TN = "TN",
  TR = "TR",
  TM = "TM",
  TC = "TC",
  TV = "TV",
  UM = "UM",
  UG = "UG",
  UA = "UA",
  AE = "AE",
  US = "US",
  UY = "UY",
  UZ = "UZ",
  VU = "VU",
  VE = "VE",
  VN = "VN",
  WF = "WF",
  EH = "EH",
  YE = "YE",
  ZM = "ZM",
  ZW = "ZW",
}
