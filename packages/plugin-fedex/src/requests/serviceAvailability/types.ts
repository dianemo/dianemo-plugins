export interface FedExServiceAvailabilityTransitTimesRequest {
  requestedShipment?: FedExServiceAvailabilityTransitTimeRequestedShipment;
  carrierCodes?: ("FDXE" | "FDXG" | "FXSP")[];
  version?: FedExServiceAvailabilityVersion;
}

export interface FedExServiceAvailabilityPackageAndServiceOptionsRequest {
  requestedShipment: FedExServiceAvailabilityPackageAndOptionsRequestedShipment;
  carrierCodes?: ("FDXE" | "FDXG" | "FXFR" | "FXSP")[];
  accountNumber?: FedExServiceAvailabilityAccountNumber1;
  systemOfMeasureType?: "IMPERIAL" | "METRIC";
  version?: FedExServiceAvailabilityVersion;
}

export interface FedExServiceAvailabilitySpecialServiceOptionsRequest {
  requestedShipment: FedExServiceAvailabilitySpecialServicesRequestedShipment;
  accountNumber?: FedExServiceAvailabilityAccountNumber1;
  carrierCodes?: ("FDXE" | "FDXG" | "FXSP" | "FXFR")[];
  version?: FedExServiceAvailabilityVersion;
}

export interface FedExServiceAvailabilityTransitTimesResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExServiceAvailabilityTransitTimeOutput;
}

export interface FedExServiceAvailabilityPackageAndServiceOptionsResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExServiceAvailabilityPackageAndServiceOptionsOutputVO;
}

export interface FedExServiceAvailabilitySpecialServiceOptionsResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExServiceAvailabilitySpecialServicesOptionsOutputVO;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipment {
  shipper: FedExServiceAvailabilityTransitTimeRequestedShipmentShipper;
  recipients: FedExServiceAvailabilityTransitTimeRecipient[];
  serviceType?: string;
  packagingType: string;
  /** This is the Shipment date. Required for future ship date rates.Default is current date if not indicated or date is in the past. Required Format is YYYY-MM-DD example : 2019-09-01 */
  shipDatestamp?: string;
  pickupType?:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  shippingChargesPayment?: FedExServiceAvailabilityTransitTimeShippingChargesPayment;
  smartPostInfoDetail?: FedExServiceAvailabilitySmartPostInfoDetail;
  requestedPackageLineItems: FedExServiceAvailabilityTransitTimeRequestedPackageLineItem[];
  shipmentSpecialServices?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServices;
  customsClearanceDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentCustomsClearanceDetail;
}

export interface FedExServiceAvailabilityVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface FedExServiceAvailabilityPackageAndOptionsRequestedShipment {
  shipper: FedExServiceAvailabilityPartyShipper;
  recipients: FedExServiceAvailabilityParty[];
  /** Required. Specify the Shipment date. Required for future ship date. Default is current date if not indicated or date is in the past. Format is YYYY-MM-DD. */
  shipDateStamp?: string;
  requestedPackageLineItems?: FedExServiceAvailabilityRequestedPackageLineItem[];
  freightShipmentDetail?: FedExServiceAvailabilityRequestedShipmentFreightShipmentDetail;
  specialServicesRequested?: FedExServiceAvailabilityRequestShipmentSpecialServicesRequested;
  /** Conditional Required for Express and Ground, but optional for FREIGHT or SMARTPOST. Indicate the pickup type method by which the shipment yo be tendered to FedEx. Note: The value of this element does not specify dispa... */
  pickupType?:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
}

export interface FedExServiceAvailabilityAccountNumber1 {
  value?: string;
}

export type FedExServiceAvailabilitySpecialServicesRequestedShipment =
  FedExServiceAvailabilityRequestedShipment;

export interface FedExServiceAvailabilityTransitTimeOutput {
  alerts?: FedExServiceAvailabilityAlert[];
  transitTimes?: FedExServiceAvailabilityTransitTime[];
  encoded?: boolean;
}

export interface FedExServiceAvailabilityPackageAndServiceOptionsOutputVO {
  /** The available packaging options for the shipment. This also includes the applicable rate types, the weight limit, or any other information related to the shipment. Valid values for the weight limit are: -maxMetricWeig... */
  packageOptions?: FedExServiceAvailabilityPackageTypeDetail[];
  oneRate?: boolean;
  /** The information for advanced regulatory packages. */
  advancedRegulatoryPackages?: FedExServiceAvailabilityKeyDisplayTextVO1[];
  serviceOptions?: FedExServiceAvailabilityKeyDisplayTextVO1[];
  alerts?: FedExServiceAvailabilityAlert[];
}

export interface FedExServiceAvailabilitySpecialServicesOptionsOutputVO {
  alerts?: FedExServiceAvailabilityAlert[];
  serviceOptionsList?: FedExServiceAvailabilityOptionalServices[];
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipper {
  address: FedExServiceAvailabilityTransitTimeShipper;
}

export interface FedExServiceAvailabilityTransitTimeRecipient {
  address: FedExServiceAvailabilityTransitTimeRecipientAddress;
}

export interface FedExServiceAvailabilityTransitTimeShippingChargesPayment {
  payor?: FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayor;
  paymentType?: "SENDER" | "RECIPIENT" | "THIRD_PARTY" | "COLLECT";
}

export interface FedExServiceAvailabilitySmartPostInfoDetail {
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

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItem {
  declaredValue?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemDeclaredValue;
  weight: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemWeight;
  dimensions?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemDimensions;
  packageSpecialServices?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServices;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServices {
  specialServiceTypes?: string[];
  codDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesCodDetail;
  internationalControlledExportDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesInternationalControlledExportDetail;
  homeDeliveryPremiumDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHomeDeliveryPremiumDetail;
  holdAtLocationDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetail;
  shipmentDryIceDetail?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesShipmentDryIceDetail;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentCustomsClearanceDetail {
  commodities: FedExServiceAvailabilityTransitTimeCommodity[];
}

export interface FedExServiceAvailabilityPartyShipper {
  address: FedExServiceAvailabilityAddress;
  contact?: FedExServiceAvailabilityContact;
  accountNumber?: FedExServiceAvailabilityAccountNumber;
  /** optional information aboutsender/recipient including Address, Contact, Account, TIN, Piece, ProductInfo. */
  productInfo?: FedExServiceAvailabilityProductInfo;
}

/** optional information about sender/recipient including Address, Contact, Account number. */
export interface FedExServiceAvailabilityParty {
  address: FedExServiceAvailabilityAddress;
  contact?: FedExServiceAvailabilityContact1;
  accountNumber?: FedExServiceAvailabilityAccountNumber;
}

export interface FedExServiceAvailabilityRequestedPackageLineItem {
  physicalPackaging?: string;
  groupPackageCount?: number;
  itemDescriptionForClearance?: string;
  customerReferences?: FedExServiceAvailabilityCustomerReference[];
  contentRecord?: FedExServiceAvailabilityRequestedPackageLineItemContentRecord;
  declaredValue?: FedExServiceAvailabilityInsuredValue;
  weight: FedExServiceAvailabilityWeightWithLink;
  dimensions?: FedExServiceAvailabilityDimensions;
  packageSpecialServices?: FedExServiceAvailabilityPackageSpecialServicesRequested;
}

export type FedExServiceAvailabilityRequestedShipmentFreightShipmentDetail =
  FedExServiceAvailabilityFreightShipmentDetail;

export type FedExServiceAvailabilityRequestShipmentSpecialServicesRequested =
  FedExServiceAvailabilityShipmentSpecialServicesRequested;

/** shipment information for the shipment being requested */
export interface FedExServiceAvailabilityRequestedShipment {
  shipper: FedExServiceAvailabilityParty;
  recipient: FedExServiceAvailabilityParty;
  serviceType?: string;
  packagingType: string;
  /** Conditional. Used to filter results to a specific ship date if populated on the request. Value will be defaulted to the current date/time. Format: [YYYY-MM-DDThh:mm:ssTZD] */
  shipDateStamp?: string;
  /** Conditional. Specifies the packaging type, weight, and dimensions of the package. Applicable for EXPRESS and GROUND but not for FREIGHT shipments. */
  requestedPackageLineItems: FedExServiceAvailabilityRequestedPackageLineItem[];
  /** Conditional Required for Express and Ground, but optional for FREIGHT or SMARTPOST */
  dropoffType?:
    | "REGULAR_PICKUP"
    | "REQUEST_COURIER"
    | "DROP_BOX"
    | "BUSINESS_SERVICE_CENTER"
    | "STATION";
  variableHandlingChargeDetail?: FedExServiceAvailabilityRequestedShipmentVariableHandlingChargeDetail;
  freightShipmentDetail?: FedExServiceAvailabilityRequestedShipmentFreightShipmentDetail;
  specialServicesRequested?: FedExServiceAvailabilityRequestShipmentSpecialServicesRequested;
  pickupType?:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  shippingDocumentSpecification?: string;
}

export interface FedExServiceAvailabilityAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

export interface FedExServiceAvailabilityTransitTime {
  transitTimeDetails?: FedExServiceAvailabilityTransitTimeDetail[];
}

export interface FedExServiceAvailabilityPackageTypeDetail {
  serviceType?: FedExServiceAvailabilityKeyDisplayTextVO;
  oneRateMaxWeightAllowed?: FedExServiceAvailabilityWeight;
  maxWeightAllowed?: FedExServiceAvailabilityWeight;
  rateTypes?: string[];
  packagingInfoList?: FedExServiceAvailabilitySubPackageInfo[];
  packageType?: FedExServiceAvailabilityKeyDisplayTextVO;
  maxMetricWeightAllowed?: FedExServiceAvailabilityWeight;
  oneRateMaxMetricWeightAllowed?: FedExServiceAvailabilityWeight;
  maxDeclaredValue?: FedExServiceAvailabilityMoney;
}

export interface FedExServiceAvailabilityKeyDisplayTextVO1 {
  displayText?: string;
  key?: string;
}

export interface FedExServiceAvailabilityOptionalServices {
  serviceType?: string;
  issEnabled?: boolean;
  signatureOptionsList?: FedExServiceAvailabilityCodeDisplayTextVO[];
  packageSpecialServicesList?: FedExServiceAvailabilityPackageSpecialServiceOption[];
  returnShipmentList?: (
    "FEDEX_TAG" | "PENDING" | "PRINT_RETURN_LABEL" | "EMAIL_LABEL"
  )[];
  carrierCode?: "FDXE" | "FDXG" | "FXSP" | "FXFR";
  batteryOptionList?: FedExServiceAvailabilityBatteryDetail[];
  alertList?: FedExServiceAvailabilityKeyDisplayTextVO[];
  shipmentSpecialServicesList?: FedExServiceAvailabilityShipmentSpecialServiceOption[];
  alerts?: FedExServiceAvailabilityAlert[];
}

/** Descriptive data on physical location. May be used as an actual physical address (place where one could go), or as a container of address parts, which should be handled as a unit (such as a city-state-ZIP combination... */
export interface FedExServiceAvailabilityTransitTimeShipper {
  city?: string;
  /** Identifying abbreviation for US state, canada Province. Format and presence of this field will vary, depending on the country. State code is required for US, CA, PR and not required for other countries. Conditional. N... */
  stateOrProvinceCode?: string;
  /** Identification of a region for mail/package delivery. Format and presence of this field will vary, depending on the country. Optional for non postal-aware countries. Maximum length is 10. */
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

/** Descriptive data on physical location. May be used as an actual physical address (place where one could go), or as a container of address parts, which should be handled as a unit (such as a city-state-ZIP combination... */
export interface FedExServiceAvailabilityTransitTimeRecipientAddress {
  city?: string;
  /** Identifying abbreviation for US state, canada Province. Format and presence of this field will vary, depending on the country. State code is required for US, CA, PR and not required for other countries. Conditional. N... */
  stateOrProvinceCode?: string;
  /** Identification of a region for mail/package delivery. Format and presence of this field will vary, depending on the country.Optional for non postal-aware countries. Max length is 10. */
  postalCode: string;
  countryCode: string;
  residential?: boolean;
}

/** Information about the person who is paying for the shipment. Not applicable for credit card payment. */
export interface FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayor {
  responsibleParty?: FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayorResponsibleParty;
}

/** This is the Declared Value - represents FedEx Maximum liability in connection with a shipment of that Package, including but not limited to, any loss, damage, delay, misdelivery, any failure to provide information, or... */
export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemDeclaredValue {
  amount?: number;
  currency?: string;
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemWeight {
  /** Specify the unit of measurement used to weigh. */
  units: "KG" | "LB";
  value: number;
}

/** Specify the dimensions of this package and the unit type used for the measurements. Valid measurements are whole numbers greater than zero. */
export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServices {
  specialServiceTypes?: string[];
  codDetail?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesCodDetail;
  dryIceWeight?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesDryIceWeight;
  dangerousGoodsDetail?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesDangerousGoodsDetail;
  alcoholDetail?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesAlcoholDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesBatteryDetails;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesCodDetail {
  codCollectionAmount?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesCodDetailCodCollectionAmount;
  codCollectionType?:
    "ANY" | "CASH" | "COMPANY_CHECK" | "GUARANTEED_FUNDS" | "PERSONAL_CHECK";
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesInternationalControlledExportDetail {
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
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHomeDeliveryPremiumDetail {
  homedeliveryPremiumType?: "APPOINTMENT" | "DATE_CERTAIN" | "EVENING";
}

/** Use this object to specify required information of a shipment to be held at FedEx destination location. Note: This object HoldAtLocationDetail is REQUIRED, when HOLD_AT_LOCATION is chosen in the specialServiceTypes. */
export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetail {
  locationId: string;
  locationType?:
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_STAFFED"
    | "RETAIL_ALLICANCE_LOCATION"
    | "FEDEX_GROUND_TERMINAL"
    | "FEDEX_ONSITE";
  locationContactAndAddress?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetailLocationContactAndAddress;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesShipmentDryIceDetail {
  totalWeight?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesShipmentDryIceDetailTotalWeight;
  packageCount?: number;
}

export interface FedExServiceAvailabilityTransitTimeCommodity {
  description: string;
  /** Specify the total number of units (using quantityUnits as the unit of measure) of this commodity present in the shipment. This element is used to estimate duties and taxes. */
  quantity?: number;
  unitPrice?: FedExServiceAvailabilityTransitTimeCommodityUnitPrice;
  weight?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesShipmentDryIceDetailTotalWeight;
  customsValue: FedExServiceAvailabilityTransitTimeCommodityUnitPrice;
  numberOfPieces: number;
  countryOfManufacture?: string;
  /** Indicate unit quantity used to estimate duties and taxes. */
  quantityUnits?: string;
  name?: string;
  harmonizedCode?: string;
  partNumber?: string;
}

/** This is detailed information on physical location. May be used as an actual physical address (place to which one could go), or as a container of address parts which should be handled as a unit (such as a city-state-ZI... */
export interface FedExServiceAvailabilityAddress {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
}

export interface FedExServiceAvailabilityContact {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
}

export type FedExServiceAvailabilityAccountNumber =
  FedExServiceAvailabilityAccountNumber1;

/** Information about the contents of the shipment. */
export interface FedExServiceAvailabilityProductInfo {
  customsValueAndWeightSpecifiedAsUnit?: boolean;
  quantity?: number;
  customsValue?: number;
  /** Weight measurement unit code of the product in the package/shipment. */
  weightUnitOfMeasureCode?: string;
  description?: string;
  weight?: FedExServiceAvailabilityPackageWeight;
  sedRequired?: boolean;
  productType?: "DOCUMENTS" | "COMMODITIES";
  unitOfMeasureCode?: string;
  countryOfManufactureCode?: string;
}

export interface FedExServiceAvailabilityContact1 {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
}

export interface FedExServiceAvailabilityCustomerReference {
  /** This is a customer reference type. Note: Use type as RMA_ASSOCIATION and value as the RMA Number to associate Ground Call Tag shipments to the outbound shipment. For more information, click here for Cutsomer References */
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

export type FedExServiceAvailabilityRequestedPackageLineItemContentRecord =
  FedExServiceAvailabilityContentRecord;

export type FedExServiceAvailabilityInsuredValue =
  FedExServiceAvailabilityMoney;

export interface FedExServiceAvailabilityWeightWithLink {
  /** Specifies the package weight unit type. */
  units: "KG" | "LB";
  value: number;
}

export interface FedExServiceAvailabilityDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExServiceAvailabilityPackageSpecialServicesRequested {
  signatureOptionType?:
    | "SERVICE_DEFAULT"
    | "NO_SIGNATURE_REQUIRED"
    | "INDIRECT"
    | "DIRECT"
    | "ADULT";
  alcoholDetail?: FedExServiceAvailabilityAlcoholDetail;
  dangerousGoodsDetail?: FedExServiceAvailabilityDangerousGoodsDetail;
  pieceCountVerificationBoxCount?: number;
  batteryDetails?: FedExServiceAvailabilityBatteryDetail[];
  specialServiceTypes?: string[];
  codDetail: FedExServiceAvailabilityPackageSpecialServicesRequestedCodDetail;
  dryIceWeight?: FedExServiceAvailabilityWeightWithoutLink;
  standaloneBatteryDetails?: FedExServiceAvailabilityStandaloneBatteryDetails[];
}

/** Conditional Details specific to a FedEx Freight LTL shipment (i.e. FedEx Priority and Economy Freight). If freight shipment detail is applicable, then the following fields are required. 'aliasID', 'clientDiscountPerce... */
export interface FedExServiceAvailabilityFreightShipmentDetail {
  shipmentDimensions?: FedExServiceAvailabilityShipmentDimensions;
  alternateBilling?: boolean;
  lineItem?: FedExServiceAvailabilityFreightShipmentLineItem[];
  role?: "CONSIGNEE" | "SHIPPER";
  /** Conditional This is only used for anonymous rate requests */
  clientDiscountPercent?: number;
  fedExFreightBillingContactAndAddress?: FedExServiceAvailabilityFedExFreightBillingContactAndAddress;
  /** Conditional. This is bill to alias identifier. */
  aliasID?: string;
  liabilityCoverageDetail?: FedExServiceAvailabilityFreightShipmentLiabilityCoverageDetail;
  fedExFreightAccountNumber?: FedExServiceAvailabilityFedExFreightAccountNumber;
  /** Optional Total number of individual handling units in the entire shipment (for unit pricing). May not be negative */
  totalHandlingUnits?: number;
}

export interface FedExServiceAvailabilityShipmentSpecialServicesRequested {
  internationalControlledExportDetail?: FedExServiceAvailabilityInternationalControlledExportDetail;
  returnShipmentDetail?: FedExServiceAvailabilityReturnShipmentDetail;
  homeDeliveryPremiumDetail?: FedExServiceAvailabilityHomeDeliveryPremiumDetail;
  returnEmailDetail?: FedExServiceAvailabilityReturnEmailDetail;
  specialServiceTypes?: string[];
  saturdayDeliveryDetail?: FedExServiceAvailabilitySaturdayDeliveryDetail;
  holdAtLocationDetail?: FedExServiceAvailabilityHoldAtLocationDetail;
  codDetail?: FedExServiceAvailabilityCodDetail;
  shipmentDryIceDetail?: FedExServiceAvailabilityShipmentDryIceDetail;
  freightDirectDetail?: FedExServiceAvailabilityFreightDirectDetail;
}

export type FedExServiceAvailabilityRequestedShipmentVariableHandlingChargeDetail =
  FedExServiceAvailabilityVariableHandlingChargeDetail;

export interface FedExServiceAvailabilityTransitTimeDetail {
  serviceType?: string;
  customerMessages?: FedExServiceAvailabilityCustomerMessage[];
  distance?: FedExServiceAvailabilityDistance;
  commit?: FedExServiceAvailabilityCommitDetail;
  destinationLocation?: FedExServiceAvailabilityLocationDetail;
  serviceName?: string;
}

export interface FedExServiceAvailabilityKeyDisplayTextVO {
  displayText: string;
  key: string;
}

export interface FedExServiceAvailabilityWeight {
  units: string;
  value: number;
}

export interface FedExServiceAvailabilitySubPackageInfo {
  dimension?: string;
  description?: string;
}

export interface FedExServiceAvailabilityMoney {
  amount?: number;
  currency?: string;
}

export interface FedExServiceAvailabilityCodeDisplayTextVO {
  displayText?: string;
  code?: string;
}

export interface FedExServiceAvailabilityPackageSpecialServiceOption {
  customerIntegrationMode?: string;
  subType?: string;
  specialServiceType?: string;
}

export interface FedExServiceAvailabilityBatteryDetail {
  batteryPackingType?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
  batteryRegulatoryType?: "IATA_SECTION_II";
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExServiceAvailabilityShipmentSpecialServiceOption {
  customerIntegrationMode?: string;
  astraDescription?: string;
  ltlPaymentTerms?: (
    | "PREPAID"
    | "COLLECT"
    | "COLLECT_SECTION_7_SIGNED"
    | "COLLECT_SECTION_9_SIGNED"
  )[];
  subType?: string;
  value?: string;
  specialServiceType?: string;
}

/** Conditional. The descriptive data for the payor of the shipment and their physical address, contact and account number information. */
export interface FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayorResponsibleParty {
  address?: FedExServiceAvailabilityTransitTimeShipper;
  accountNumber?: FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayorResponsiblePartyAccountNumber;
}

/** Package COD Detail. COD main information is set in shipment level. */
export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesCodDetail {
  codCollectionAmount?: FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesCodDetailCodCollectionAmount;
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesDryIceWeight {
  /** Specify the unit of measurement used to weigh the dry ice used in packaging. */
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesDangerousGoodsDetail {
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

/** Provides information about the RecipientType and ShipperAgreementType. This object is manadatory if alcohol special service is selected. */
export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesAlcoholDetail {
  alcoholRecipientType: "LICENSEE" | "CONSUMER";
  shipperAgreementType?: string;
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesBatteryDetails {
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
  batteryPackingType?: "CONTAINED_IN_EQUIPMENT" | "PACKED_WITH_EQUIPMENT";
  batteryRegulatoryType?: "IATA_SECTION_II";
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesCodDetailCodCollectionAmount {
  amount?: number;
  currency?: string;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetailLocationContactAndAddress {
  contact?: FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetailLocationContactAndAddressContact;
  address?: FedExServiceAvailabilityTransitTimeShipper;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesShipmentDryIceDetailTotalWeight {
  /** Specify the unit of measurement used to weigh the package. For Dry Ice the unit of measure is KG. */
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExServiceAvailabilityTransitTimeCommodityUnitPrice {
  amount?: number;
  currency?: string;
}

export type FedExServiceAvailabilityPackageWeight =
  FedExServiceAvailabilityWeight;

export interface FedExServiceAvailabilityContentRecord {
  itemNumber?: string;
  receivedQuantity?: number;
  description?: string;
  partNumber?: string;
}

export interface FedExServiceAvailabilityAlcoholDetail {
  alcoholRecipientType: "LICENSEE" | "CONSUMER";
  shipperAgreementType?: string;
}

export interface FedExServiceAvailabilityDangerousGoodsDetail {
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

export type FedExServiceAvailabilityPackageSpecialServicesRequestedCodDetail =
  FedExServiceAvailabilityCodDetail;

export interface FedExServiceAvailabilityWeightWithoutLink {
  /** Specifies the package weight unit type. */
  units: "KG" | "LB";
  value: number;
}

export interface FedExServiceAvailabilityStandaloneBatteryDetails {
  batteryMaterialType?: "LITHIUM_METAL" | "LITHIUM_ION";
}

export interface FedExServiceAvailabilityShipmentDimensions {
  length: number;
  width: number;
  height: number;
  units: string;
}

export interface FedExServiceAvailabilityFreightShipmentLineItem {
  pieces?: number;
  volume?: FedExServiceAvailabilityVolume;
  /** Optional Number of individual handling units to which this line applies. (NOTE - Total of line-item-level handling units may not balance to shipment-level total handling units) */
  handlingUnits?: number;
  /** Specify the freight class based on the item to be shipped and its weight measured per unit volume( */
  freightClass:
    | "CLASS_050"
    | "CLASS_055"
    | "CLASS_060"
    | "CLASS_065"
    | "CLASS_070"
    | "CLASS_077_5"
    | "CLASS_085"
    | "CLASS_092_5"
    | "CLASS_100"
    | "CLASS_110"
    | "CLASS_125"
    | "CLASS_150"
    | "CLASS_175"
    | "CLASS_200"
    | "CLASS_250"
    | "CLASS_300"
    | "CLASS_400"
    | "CLASS_500";
  description?: string;
  weight: FedExServiceAvailabilityWeightWithoutLink;
  packaging?: string;
  classProvidedByCustomer?: boolean;
  hazardousMaterials?:
    | "HAZARDOUS_MATERIALS"
    | "BATTERY"
    | "ORM_D"
    | "REPORTABLE_QUANTITIES"
    | "SMALL_QUANTITY_EXCEPTION"
    | "LIMITED_QUANTITIES_COMMODITIES";
  /** Individual line item dimensions. Conditionally required. Need volume for intra mexico rates. */
  dimensions?: FedExServiceAvailabilityDimensions;
}

/** Conditional Required if a FedEx Freight account number is specified */
export interface FedExServiceAvailabilityFedExFreightBillingContactAndAddress {
  contact: FedExServiceAvailabilityContact;
  contactAncillaryDetail?: FedExServiceAvailabilityContactAncillaryDetail;
  address: FedExServiceAvailabilityAddress;
  addressAncillaryDetail?: FedExServiceAvailabilityAddressAncillaryDetail;
}

export type FedExServiceAvailabilityFreightShipmentLiabilityCoverageDetail =
  FedExServiceAvailabilityLiabilityCoverageDetail;

export type FedExServiceAvailabilityFedExFreightAccountNumber =
  FedExServiceAvailabilityAccountNumber1;

export interface FedExServiceAvailabilityInternationalControlledExportDetail {
  type:
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
}

export interface FedExServiceAvailabilityReturnShipmentDetail {
  returnType:
    | "FEDEX_TAG"
    | "NET_RETURN"
    | "PENDING"
    | "PRINT_RETURN_LABEL"
    | "EMAIL_LABEL"
    | "VOICE_CALL_TAG";
}

export interface FedExServiceAvailabilityHomeDeliveryPremiumDetail {
  homedeliveryPremiumType?: "APPOINTMENT" | "DATE_CERTAIN" | "EVENING";
}

export interface FedExServiceAvailabilityReturnEmailDetail {
  merchantPhoneNumber?: string;
  allowedSpecialService?: ("SATURDAY_DELIVERY" | "SATURDAY_PICKUP")[];
}

export interface FedExServiceAvailabilitySaturdayDeliveryDetail {
  locationContactAndAddress?: FedExServiceAvailabilityParsedContactAndAddress;
}

/** Use this object to specify required information of a shipment to be held at FedEx destination location. Note: This object HoldAtLocationDetail is REQUIRED, when HOLD_AT_LOCATION is chosen in the specialServiceTypes. */
export interface FedExServiceAvailabilityHoldAtLocationDetail {
  locationId?: string;
  locationContactAndAddress?: FedExServiceAvailabilityContactAndAddress;
  locationType:
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_STAFFED"
    | "RETAIL_ALLICANCE_LOCATION"
    | "FEDEX_GROUND_TERMINAL"
    | "FEDEX_ONSITE"
    | "FEDEX_SHIP_AND_GET";
}

/** Conditional For Express-only COD, populate this object for COD detail information at the shipment level. When data is provided in this object, the related COD enum will be populated automatically by RATC */
export interface FedExServiceAvailabilityCodDetail {
  codCollectionType?:
    "COMPANY_CHECK" | "ANY" | "CASH" | "GUARANTEED_FUNDS" | "PERSONAL_CHECK";
  codCollectionAmount: FedExServiceAvailabilityMoney;
}

/** This is the descriptive data required for the FedEx shipment containing dangerous materials. This element is required when SpecialServicetype DRY_ICE is selected in SpecialServicetype collection. */
export interface FedExServiceAvailabilityShipmentDryIceDetail {
  totalWeight: FedExServiceAvailabilityShipmentDryIceDetailTotalWeight;
  packageCount: number;
}

export interface FedExServiceAvailabilityFreightDirectDetail {
  freightDirectDataDetails?: FedExServiceAvailabilityFreightDirectDataDetails[];
}

export interface FedExServiceAvailabilityVariableHandlingChargeDetail {
  percentValue?: number;
  fixedValue?: FedExServiceAvailabilityFixedValue;
  rateElementBasis?:
    "NET_CHARGE" | "NET_FREIGHT" | "BASE_CHARGE" | "NET_CHARGE_EXCLUDING_TAXES";
  rateTypeBasis?: "ACCOUNT" | "ACTUAL" | "CURRENT" | "CUSTOM" | "LIST";
}

/** Messages concerning the ability to provide an accurate delivery commitment on an International commit quote. These could be messages providing information about why a commitment could not be returned or a successful m... */
export interface FedExServiceAvailabilityCustomerMessage {
  code?: string;
  message?: string;
}

export interface FedExServiceAvailabilityDistance {
  /** Indicates the unit of measure for the distance value. */
  units?: "KM" | "MI";
  value?: number;
}

export interface FedExServiceAvailabilityCommitDetail {
  /** The delivery commitment date/time the shipment will arrive at the border. format [YYYY-MM-DDTHH:MM:SS:00Z] */
  brokerCommitTimestamp?: string;
  /** Identifies the latest allowed ready time for the pickup option. The time is local to the pickup postal code. It includes a TZD (time zone designator) for FedEx Freight requests. Format: HH:MM:SS */
  cutOffTime?: string;
  commodityName?: string;
  transitDays?: FedExServiceAvailabilityCommitDetailTransitDays;
  /** This is a message concerning the ability to provide an accurate delivery commitment on an International commit quote. These could be messages providing information about why a commitment could not be returned or a suc... */
  commitMessageDetails?: string;
  derivedDestinationDetail?: FedExServiceAvailabilityCleansedAddressandLocationDetail;
  dateDetail?: FedExServiceAvailabilityCommitDetailDateDetail;
}

export interface FedExServiceAvailabilityLocationDetail {
  geoPositionalCoordinates?: FedExServiceAvailabilityLocationDetailGeoPositionalCoordinates;
}

/** Specifies the FedEx customer account information of the responsible paty. */
export interface FedExServiceAvailabilityTransitTimeShippingChargesPaymentPayorResponsiblePartyAccountNumber {
  /** Conditionally required. Account number is required for ACCOUNT based rates. Account number value max length is 9. */
  value: string;
}

export interface FedExServiceAvailabilityTransitTimeRequestedPackageLineItemPackageSpecialServicesCodDetailCodCollectionAmount {
  amount?: number;
  currency?: string;
}

export interface FedExServiceAvailabilityTransitTimeRequestedShipmentShipmentSpecialServicesHoldAtLocationDetailLocationContactAndAddressContact {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
}

export type FedExServiceAvailabilityVolume = FedExServiceAvailabilityVolume1;

/** Indicate additional contact details such as email and phone information. */
export interface FedExServiceAvailabilityContactAncillaryDetail {
  emailAddresses?: FedExServiceAvailabilityEMailDetail[];
  prefix?: string;
  phoneNumberDetails?: FedExServiceAvailabilityPhoneNumberDetail[];
  companyName?: FedExServiceAvailabilityCompanyName;
  title?: string;
}

export interface FedExServiceAvailabilityAddressAncillaryDetail {
  /** This is the Subdivision or community within a city for the given address. Forester subdivision */
  locationInCity?: string;
  /** This is the suite information for the given address. */
  suite?: string;
  addressVerificationOverrideReason?: string;
  locationInProperty?: string;
  /** Specifies any additional information about the given address. */
  addtionalDescriptions?: string;
  department?: string;
  /** This is to specify the room or floor information for the given address. */
  roomFloor?: string;
  /** This is the cross street information for the given address. */
  crossStreet?: string;
  /** This is the building information for the given address. */
  building?: string;
  /** This is the apartment information for the given address. */
  apartment?: string;
  /** This is room specific information for the given address. */
  room?: string;
}

export interface FedExServiceAvailabilityLiabilityCoverageDetail {
  coverageType?: "NEW" | "USED_OR_RECONDITIONED";
  coverageAmount?: FedExServiceAvailabilityCoverageAmount;
}

export interface FedExServiceAvailabilityParsedContactAndAddress {
  address?: FedExServiceAvailabilityAddress;
  contact?: FedExServiceAvailabilityContact;
}

export interface FedExServiceAvailabilityContactAndAddress {
  contact?: FedExServiceAvailabilityContact;
  contactAncillaryDetail?: FedExServiceAvailabilityContactAncillaryDetail;
  address?: FedExServiceAvailabilityAddress;
  addressAncillaryDetail?: FedExServiceAvailabilityAddressAncillaryDetail;
}

export interface FedExServiceAvailabilityShipmentDryIceDetailTotalWeight {
  /** Identifies the unit of measure associated with a weight value. */
  units: string;
  value: number;
}

export interface FedExServiceAvailabilityFreightDirectDataDetails {
  type?: "BASIC" | "BASIC_BY_APPOINTMENT" | "PREMIUM" | "STANDARD";
  transportationType?: "DELIVERY" | "PICKUP";
  eMailAddress?: string;
  phoneNumberDetails?: FedExServiceAvailabilityFreightPhoneNumberDetail[];
}

export type FedExServiceAvailabilityFixedValue = FedExServiceAvailabilityMoney;

export interface FedExServiceAvailabilityCommitDetailTransitDays {
  description?: string;
  minimumTransitTime?:
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
  maximumTransitTime?: string;
}

export interface FedExServiceAvailabilityCleansedAddressandLocationDetail {
  serviceArea?: string;
  countryCode?: string;
  locationId?: string;
  airportId?: string;
  postalCode?: string;
  stateOrProvinceCode?: string;
  locationNumber?: number;
}

export interface FedExServiceAvailabilityCommitDetailDateDetail {
  /** This is a day of week in a shorter day format */
  dayOfWeek?: string;
  /** This is time in a day. Format: [HH:MM:SS] example: 09:30:00 */
  time?: string;
  /** This is the day in format [MM-DD-YYYY] example: Apr-13-2021 */
  day?: string;
}

export interface FedExServiceAvailabilityLocationDetailGeoPositionalCoordinates {
  latitude?: number;
  longitude?: number;
}

/** Optional Individual line item volume. Conditional Need Volume or Rate for intra mexico rates */
export interface FedExServiceAvailabilityVolume1 {
  /** The unit is in Cubic Feet or Cubic Meters. */
  units?: "CUBIC_FT" | "CUBIC_M";
  value?: number;
}

export interface FedExServiceAvailabilityEMailDetail {
  /** These are email notification format type. */
  emailNotificationFormatType?: "TEXT" | "HTML";
  address?: string;
  permissions?: Record<string, "GRANT" | "DENY">;
}

export interface FedExServiceAvailabilityPhoneNumberDetail {
  number?: FedExServiceAvailabilityPhoneNumber;
  permissions?: Record<string, "GRANT" | "DENY">;
  usage?: "PRIMARY" | "SECONDARY";
  type?: "FAX" | "HOME" | "MOBILE" | "PAGER" | "WORK";
}

export interface FedExServiceAvailabilityCompanyName {
  division?: string;
  companyCd?: string;
  name?: string;
  department?: string;
  storeId?: string;
}

export type FedExServiceAvailabilityCoverageAmount =
  FedExServiceAvailabilityMoney;

export interface FedExServiceAvailabilityFreightPhoneNumberDetail {
  phoneNumberType?: "FAX" | "HOME" | "MOBILE" | "PAGER" | "TOLL_FREE" | "WORK";
  phoneNumber?: string;
}

export interface FedExServiceAvailabilityPhoneNumber {
  areaCode?: string;
  extension?: string;
  countryCode?: string;
  personalIdentificationNumber?: string;
  localNumber?: string;
}
