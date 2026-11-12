// Generated shape of the UPS "Quantum View" OpenAPI spec; see docs/ups-api.md.

export interface UpsQuantumViewRequestWrapper {
  QuantumViewRequest: UpsQuantumViewRequest;
}

export interface UpsQuantumViewResponseWrapper {
  QuantumViewResponse: UpsQuantumViewResponse;
}

/** Container for QuantumView request information. */
export interface UpsQuantumViewRequest {
  Request: UpsQuantumViewRequestRequest;
  SubscriptionRequest?:
    | UpsQuantumViewRequestSubscriptionRequest
    | UpsQuantumViewRequestSubscriptionRequest[];
  Bookmark?: string;
}

export interface UpsQuantumViewRequestRequest {
  TransactionReference?: UpsQuantumViewRequestTransactionReference;
  RequestAction: string;
}

export interface UpsQuantumViewRequestTransactionReference {
  /** The CustomerContext Information which will be echoed during response. */
  CustomerContext?: string;
}

/** Subscription requested by user to retrieve Inbound or/and Outbound XML formed subscription information. */
export interface UpsQuantumViewRequestSubscriptionRequest {
  /** Name of subscription requested by user, as one type of request criteria. Required when the customer wants to request data for a specific subscription name. Subscription name consists of up to 21 alphanumerics. */
  Name?: string;
  DateTimeRange?: UpsQuantumViewSubscriptionRequestDateTimeRange;
  /** File name of specific subscription requested by user. Format: YYMMDD_HHmmssnnn. (nnn - sequence number: usually = 001) */
  FileName?: string | string[];
  /** UPS's example nests it here; the schema puts it on `QuantumViewRequest`. Either is accepted. */
  Bookmark?: string;
}

export interface UpsQuantumViewSubscriptionRequestDateTimeRange {
  /** Beginning date time for the retrieval criteria of the subscriptions. It is required for date time request criteria. Format: YYYYMMDDHHmmss. */
  BeginDateTime?: string;
  /** Ending date time for the retrieval criteria of the subscriptions. Format: YYYYMMDDHHmmss. When a null or empty EndDateTime is passed in the request, it is defaulted to 7 days from the given begin date. */
  EndDateTime?: string;
}

/** Container for QuantumView response information. */
export interface UpsQuantumViewResponse {
  Response: UpsQuantumViewResponseResponse;
  QuantumViewEvents: UpsQuantumViewResponseQuantumViewEvents;
  Bookmark?: string;
}

/** Contains Errors information tags along with the success/fail status of the QuantumView request. */
export interface UpsQuantumViewResponseResponse {
  TransactionReference: UpsQuantumViewResponseTransactionReference;
  ResponseStatusCode: string;
  ResponseStatusDescription?: string;
  /** If an error is encountered during the interchange, the Response contains an error. If the error is present, then the ErrorSeverity and ErrorCodes are required. */
  Error?: UpsQuantumViewResponseError[];
}

export interface UpsQuantumViewResponseTransactionReference {
  /** The CustomerContext Information which will be echoed during response. */
  CustomerContext?: string;
  XpciVersion?: string;
  ToolVersion?: string;
  /** In UPS's v1 samples and spec examples, though not in the spec's schema. */
  TransactionIdentifier?: string;
}

export interface UpsQuantumViewResponseError {
  /** Describes the severity of the error. Required if the error is present. */
  ErrorSeverity?: string;
  /** A numeric value that describes the error. Each tool defines a range of error codes. Required if the error is present. */
  ErrorCode?: string;
  /** Describes the error code. */
  ErrorDescription?: string;
  MinimumRetrySeconds?: string;
  ErrorLocation: UpsQuantumViewErrorErrorLocation[];
  ErrorDigest?: string[];
}

export interface UpsQuantumViewErrorErrorLocation {
  ErrorLocationElementName?: string;
  ErrorLocationAttributeName?: string;
}

export type UpsQuantumViewErrorErrorDigest = string;

export interface UpsQuantumViewResponseQuantumViewEvents {
  SubscriberID: string;
  /** The event that a user receives a subset of Tracking information specific to either packages coming or packages going, after subscription request is made. */
  SubscriptionEvents: UpsQuantumViewEventsSubscriptionEvents[];
}

export interface UpsQuantumViewEventsSubscriptionEvents {
  /** A name uniquely defined associated to the Subscription ID, for each subscription. Required if the SubscriptionEvents container is present. */
  Name?: string;
  /** A number uniquely defined associated to the Subscriber ID, for each subscription. Required if the SubscriptionEvents container is present. */
  Number?: string;
  SubscriptionStatus: UpsQuantumViewSubscriptionEventsSubscriptionStatus;
  DateRange?: UpsQuantumViewSubscriptionEventsDateRange;
  SubscriptionFile?: UpsQuantumViewSubscriptionEventsSubscriptionFile[];
}

export interface UpsQuantumViewSubscriptionEventsSubscriptionStatus {
  /** Status types of subscription. Valid values: - UN – Unknown - AT – Activate - P – Pending - A –Active - I – Inactive - S - Suspended */
  Code: string;
  Description?: string;
}

export interface UpsQuantumViewSubscriptionEventsDateRange {
  /** Beginning date time of subscription requested by user. Format: MM-DD-YYYY-HH-MM */
  BeginDate: string;
  /** Ending date time of subscription requested by user. Format: MM-DD-YYYY-HH-MM */
  EndDate?: string;
}

export interface UpsQuantumViewSubscriptionEventsSubscriptionFile {
  /** File name belonging to specific subscription requested by user. Format: YYMMDD_HHmmssnnn */
  FileName: string;
  StatusType: UpsQuantumViewSubscriptionFileStatusType;
  Manifest?: UpsQuantumViewSubscriptionFileManifest[];
  /** Information about shipment's origin. */
  Origin?: UpsQuantumViewSubscriptionFileOrigin[];
  Exception?: UpsQuantumViewSubscriptionFileException[];
  /** Container for delivery information. */
  Delivery?: UpsQuantumViewSubscriptionFileDelivery[];
  /** Container for generic record information. */
  Generic?: UpsQuantumViewSubscriptionFileGeneric[];
}

export interface UpsQuantumViewSubscriptionFileStatusType {
  /** Status types of subscription file. Valid values: - R – Read - U - Unread */
  Code: string;
  Description: string;
}

export interface UpsQuantumViewSubscriptionFileManifest {
  Shipper: UpsQuantumViewManifestShipper;
  ShipTo: UpsQuantumViewManifestShipTo;
  ReferenceNumber?: UpsQuantumViewManifestReferenceNumber[];
  Service?: UpsQuantumViewManifestService;
  /** Should be set equal to the date on while the packages were picked up (may be prior days date if the transmission occurs after midnight). Formatted as YYYYMMDD. */
  PickupDate?: string;
  /** The date the shipment originally was scheduled for delivery. Formatted as YYYYMMDD. */
  ScheduledDeliveryDate?: string;
  /** Schedule delivery time. Time format is HHMMSS */
  ScheduledDeliveryTime?: string;
  /** If the tag is present then the shipment is a document, otherwise the shipment is a non-document. Valid values: - 1 = Letter - 2 = Document (Non-Letter Document) - 3 = Non-Document - 4 = Pallet */
  DocumentsOnly?: string;
  Package?: UpsQuantumViewManifestPackage[];
  ShipmentServiceOptions?: UpsQuantumViewManifestShipmentServiceOptions;
  ManufactureCountry?: string;
  /** Harmonized code of the package. */
  HarmonizedCode?: string;
  CustomsValue?: UpsQuantumViewManifestCustomsValue;
  SpecialInstructions?: string;
  /** Shipment charge type. Valid values: C/F - Cost and Freight C/B - Consignee Billed Package F/C - Freight Collect DDP - Delivered Duty Paid VAT Unpaid FOB - Free On Board P/P - Prepaid F/D - Free Domicile T/P - Third Party Billing */
  ShipmentChargeType?: string;
  BillToAccount?: UpsQuantumViewManifestBillToAccount;
  ConsigneeBillIndicator: string;
  CollectBillIndicator: string;
  LocationAssured?: string;
  ImportControl?: string;
  LabelDeliveryMethod?: string;
  CommercialInvoiceRemoval?: string;
  PostalServiceTrackingID?: string;
  ReturnsFlexibleAccess?: string;
  UPScarbonneutral?: string;
  Product?: string;
  UPSReturnsExchange?: string;
  LiftGateOnDelivery?: string;
  LiftGateOnPickUp?: string;
  PickupPreference?: string;
  DeliveryPreference?: string;
  HoldForPickupAtUPSAccessPoint?: string;
  UAPAddress?: UpsQuantumViewManifestUAPAddress;
  DeliverToAddresseeOnlyIndicator?: string;
  UPSAccessPointCODIndicator?: string;
  ClinicalTrialIndicator?: string;
  ClinicalTrialIndicationNumber?: string;
  CategoryAHazardousIndicator?: string;
  DirectDeliveryIndicator?: string;
  /** "Y" indicates Shipment has PackageReleaseCode Accessorial. */
  PackageReleaseCodeIndicator?: string;
  ProactiveResponseIndicator?: string;
  WhiteGloveDeliveryIndicator?: string;
  RoomOfChoiceIndicator?: string;
  InstallationDeliveryIndicator?: string;
  ItemDisposalIndicator?: string;
  LeadShipmentTrackingNumber?: string;
  SaturdayNonPremiumCommercialDeliveryIndicator?: string;
  SundayNonPremiumCommercialDeliveryIndicator?: string;
  UPSPremierAccessorialIndicator?: string;
  /** Indicates the UPS Premier category applied to the package Valid values: - 'PRS' – UPS Premier Silver - 'PRG' – UPS Premier Gold - 'PRP' - UPS Premier Platinum */
  UPSPremierCategoryCode?: string;
}

export interface UpsQuantumViewManifestShipper {
  Name: string;
  AttentionName?: string;
  TaxIdentificationNumber?: string;
  /** Shipper's Phone Number. US Phone numbers must be 10 digits. No formatting is allowed. Required if origin and destination countries or territories are different. */
  PhoneNumber?: string;
  /** Shipper's Fax Number. US Fax numbers must be 10 digits. No formatting is allowed. Required if origin and destination countries or territories are different. */
  FaxNumber?: string;
  ShipperNumber?: string;
  EMailAddress?: string;
  Address?: UpsQuantumViewShipperAddress;
}

/** Information that specifies a physical location. */
export interface UpsQuantumViewShipperAddress {
  AddressLine1?: string;
  /** Address Line 2 of the Shipper. Usually room/floor information. */
  AddressLine2?: string;
  /** Address Line 3 of the shipper. Usually department information. */
  AddressLine3?: string;
  City?: string;
  /** Shipper's state or province code. Must be valid US state. If the Shipper's country or territory is US or CA a two character code is required, otherwise the StateProvinceCode is optional. */
  StateProvinceCode?: string;
  PostalCode?: string;
  /** Shipper's country or territory code. Valid values: CA,MX, PR, US, AT, BE, DE, DK, ES, FI, FR, GB, IE, IT, NL, PT, SE, MC and VA */
  CountryCode?: string;
  ResidentialAddressIndicator?: string;
}

/** Address and contact information describing the location where a return is to be delivered. */
export interface UpsQuantumViewManifestShipTo {
  ShipperAssignedIdentificationNumber?: string;
  CompanyName?: string;
  AttentionName?: string;
  /** Consignee's Phone Number. US Phone numbers must be 10 digits. No formatting is allowed. Required if origin and destination countries or territories are different. */
  PhoneNumber?: string;
  TaxIdentificationNumber?: string;
  /** Consignee's Fax Number. US Fax numbers must be 10 digits. No formatting is allowed. Required if origin and destination countries or territories are different. */
  FaxNumber?: string;
  EMailAddress?: string;
  Address?: UpsQuantumViewShipToAddress;
  LocationID?: string;
  ReceivingAddressName?: string;
}

/** Information that specifies a physical location. */
export interface UpsQuantumViewShipToAddress {
  ConsigneeName?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  AddressLine3?: string;
  City?: string;
  /** Consignee's state or province code. Must be valid US state. If the consignee's country or territory is US or CA a two character code is required. Otherwise, the StateProvinceCode is optional. */
  StateProvinceCode?: string;
  PostalCode?: string;
  /** Consignee's country or territory code. Valid values: CA,MX, PR, US, AT, BE, DE, DK, ES, FI, FR, GB, IE, IT, NL, PT, SE, MC and VA */
  CountryCode?: string;
}

export interface UpsQuantumViewManifestReferenceNumber {
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

/** Container for service code and description. */
export interface UpsQuantumViewManifestService {
  /** For addition information, refer to the Service Codes table in the Appendix. */
  Code: string;
  /** Description of the service code. Examples are Next Day Air, Worldwide Express, and Ground. */
  Description?: string;
}

export interface UpsQuantumViewManifestPackage {
  /** Information about package delivery activity. */
  Activity?: UpsQuantumViewPackageActivity[];
  Description?: string;
  Dimensions?: UpsQuantumViewPackageDimensions;
  DimensionalWeight?: UpsQuantumViewPackageDimensionalWeight;
  PackageWeight?: UpsQuantumViewPackagePackageWeight;
  LargePackage?: string;
  TrackingNumber?: string;
  /** Container tag for information about the package-level reference number. */
  ReferenceNumber?: UpsQuantumViewPackageReferenceNumber[];
  PackageServiceOptions?: UpsQuantumViewPackagePackageServiceOptions;
  UPSPremiumCareIndicator?: string;
}

export interface UpsQuantumViewPackageActivity {
  /** Date of package delivery activity. Date format: YYYYMMDD. */
  Date?: string;
  /** Time of package delivery activity. Time format: HHMMSS */
  Time?: string;
}

/** Container tag for package dimension information. Length + 2 * (Width + Height) must be less than or equal to 130 IN or 330 CM. */
export interface UpsQuantumViewPackageDimensions {
  /** Package length. Valid values: 0 to 108 IN and 0 to 270 CM */
  Length: string;
  Width: string;
  Height: string;
}

export interface UpsQuantumViewPackageDimensionalWeight {
  UnitOfMeasurement: UpsQuantumViewDimensionalWeightUnitOfMeasurement;
  Weight: string;
}

/** Container tag for package dimensional weight measurement units. */
export interface UpsQuantumViewDimensionalWeightUnitOfMeasurement {
  /** The code representing the unit of measure associated with the shipment's dimensional weight. Valid values: LBS - Pounds (default) KGS - Kilograms Defaults Unit of Measurement used in the shipper's country or territory. */
  Code: string;
  /** A text description of the code representing the unit of measure associated with the package weight. */
  Description?: string;
}

export type UpsQuantumViewDimensionalWeightWeight = string;

/** Container tag for package weight. Required when the package type is not UPS Letter. */
export interface UpsQuantumViewPackagePackageWeight {
  Weight: string;
}

export type UpsQuantumViewPackageLargePackage = string;

export type UpsQuantumViewPackageTrackingNumber = string;

export interface UpsQuantumViewPackageReferenceNumber {
  Number?: string;
  /** Reference number type code for entire shipment, two-character alphanumeric. The code specifies the Reference name. Valid if the origin/destination pair is US/US or PR/PR. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewPackagePackageServiceOptions {
  COD?: UpsQuantumViewPackageServiceOptionsCOD;
  InsuredValue?: UpsQuantumViewPackageServiceOptionsInsuredValue;
  /** Earliest delivery time. Time format is HHMMSS. */
  EarliestDeliveryTime?: string;
  /** Indicates if the package contains hazardous materials. Valid values: - 1 - Hazardous Material - 2 - Electronically billed hazardous material. If present, only one package may exist in the shipment. */
  HazardousMaterialsCode?: string;
  HoldForPickup: string;
  AddShippingChargesToCODIndicator?: string;
}

/** Container for cash on delivery (COD) information. */
export interface UpsQuantumViewPackageServiceOptionsCOD {
  /** The code associated with the type of COD. Valid values: 1 - Regular COD 2 - Express COD 3 - Tagless COD */
  CODCode?: string;
  CODAmount?: UpsQuantumViewCODCODAmount;
}

/** The code associated with the type of COD. Valid values: 1 - Regular COD 2 - Express COD 3 - Tagless COD */
export type UpsQuantumViewCODCODCode = string;

export interface UpsQuantumViewCODCODAmount {
  /** The IATA currency code associated with the COD amount for the package. Required if the value for COD amount exists in MonetaryValue tag. Must match one of the IATA currency codes. For addition information, refer to the Currency Codes table in the Appendix. */
  CurrencyCode?: string;
  /** The COD value for the package. Required if CODCode is 1.Absolute maximum value is 21474836.47 (limited by the maximum value of a 32-bit integer). */
  MonetaryValue?: string;
}

export interface UpsQuantumViewPackageServiceOptionsInsuredValue {
  CurrencyCode?: string;
  MonetaryValue: string;
}

export interface UpsQuantumViewManifestShipmentServiceOptions {
  SaturdayPickup: string;
  SaturdayDelivery: string;
  CallTagARS?: UpsQuantumViewShipmentServiceOptionsCallTagARS;
}

export interface UpsQuantumViewShipmentServiceOptionsCallTagARS {
  /** A reference number associated with the Call Tag service. Required if CallTagARS/Code is 1. */
  Number?: string;
  Code?: string;
}

/** Information about shipment's customs value. */
export interface UpsQuantumViewManifestCustomsValue {
  MonetaryValue: string;
}

/** The information provided within this container identifies the shipper number and billing option the user specified to view during the subscription process. */
export interface UpsQuantumViewManifestBillToAccount {
  /** Indicates how shipping charges for the package were billed. Valid values: - 01 - Shipper - 02 - Consignee Billing - 03 - Third Party - 04 - Freight Collect */
  Option: string;
  Number: string;
}

/** Information about Hold for Pickup UPS Access Point Address */
export interface UpsQuantumViewManifestUAPAddress {
  CompanyName?: string;
  AttentionName?: string;
  Address?: UpsQuantumViewUAPAddressAddress;
  /** UPS Access Point's Phone Number. US Phone numbers must be 10 digits. No formatting is allowed. Required if origin and destination countries or territories are different. */
  PhoneNumber?: string;
}

/** Information that specifies a physical location. */
export interface UpsQuantumViewUAPAddressAddress {
  AddressLine1?: string;
  /** Address Line 2 of the UPS Access Point. Usually room/floor information. */
  AddressLine2?: string;
  /** Address Line 3 of the UPS Access Point. Usually department information. */
  AddressLine3?: string;
  City?: string;
  /** UPS Access Point's state or province code. Must be valid US state. If the UPS Access Point country or territory is US or CA a two character code is required, otherwise, the StateProvinceCode is optional. */
  StateProvinceCode?: string;
  PostalCode?: string;
  /** UPS Access Point's country or territory code. Valid values: CA,MX, PR, US, AT, BE, DE, DK, ES, FI, FR, GB, IE, IT, NL, PT, SE, MC, and VA */
  CountryCode?: string;
}

export interface UpsQuantumViewSubscriptionFileOrigin {
  PackageReferenceNumber?: UpsQuantumViewOriginPackageReferenceNumber[];
  ShipmentReferenceNumber?: UpsQuantumViewOriginShipmentReferenceNumber[];
  ShipperNumber: string;
  TrackingNumber: string;
  /** Date that the package is picked up at the origin. Date format is YYYYMMDD. */
  Date: string;
  /** Time that the package is picked up at the origin. Time format is HHMMSS. */
  Time: string;
  ActivityLocation?: UpsQuantumViewOriginActivityLocation;
  BillToAccount?: UpsQuantumViewOriginBillToAccount;
  /** Scheduled delivery date for destination address. Date format is YYYYMMDD. */
  ScheduledDeliveryDate?: string;
  /** Scheduled delivery time for destination address. Time format is HHMMSS. */
  ScheduledDeliveryTime?: string;
}

export interface UpsQuantumViewOriginPackageReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewOriginShipmentReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewOriginActivityLocation {
  AddressArtifactFormat: UpsQuantumViewActivityLocationAddressArtifactFormat;
}

/** Information that specifies a physical location where package delivery activity occurs. */
export interface UpsQuantumViewActivityLocationAddressArtifactFormat {
  PoliticalDivision2?: string;
  /** State or province code of an activity occurred during a package shipment. Must be valid US state. If the country or territory is US or CA a two character code is required, otherwise, the StateProvinceCode is optional. */
  PoliticalDivision1?: string;
  /** Country or Territory code of an activity occurred during a package shipment. Valid values: CA, MX, PR, US, AT, BE, DE, DK, ES, FI, FR, GB, IE, IT, NL, PT, SE, MC, and VA */
  CountryCode?: string;
}

/** The information provided within this container identifies the shipper number and billing option the user specified to view during the subscription process. */
export interface UpsQuantumViewOriginBillToAccount {
  /** Indicates how shipping charges for the package were billed. Valid Values: - 01 - Shipper - 02 - Consignee Billing - 03 - Third Party - 04 - Freight Collect */
  Option: string;
  Number: string;
}

export interface UpsQuantumViewSubscriptionFileException {
  PackageReferenceNumber?: UpsQuantumViewExceptionPackageReferenceNumber[];
  ShipmentReferenceNumber?: UpsQuantumViewExceptionShipmentReferenceNumber[];
  ShipperNumber: string;
  TrackingNumber: string;
  /** Date that the package is delivered. Date format is YYYYMMDD. */
  Date: string;
  /** Time that the package is delivered. Time format is HHMMSS */
  Time: string;
  UpdatedAddress?: UpsQuantumViewExceptionUpdatedAddress;
  /** Code for status of updating shipping address issue. */
  StatusCode?: string;
  StatusDescription?: string;
  /** Code for reason of updating shipping address issue. */
  ReasonCode?: string;
  ReasonDescription?: string;
  Resolution?: UpsQuantumViewExceptionResolution;
  /** Rescheduled delivery date for updated shipping address. Date format is YYYYMMDD. */
  RescheduledDeliveryDate?: string;
  /** Rescheduled delivery time for updated shipping address. Time format is HHMMSS */
  RescheduledDeliveryTime?: string;
  ActivityLocation?: UpsQuantumViewExceptionActivityLocation;
  BillToAccount?: UpsQuantumViewExceptionBillToAccount;
  AccessPointLocationID?: string;
}

export interface UpsQuantumViewExceptionPackageReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewExceptionShipmentReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

/** Contains information about updated shipping address. */
export interface UpsQuantumViewExceptionUpdatedAddress {
  ConsigneeName?: string;
  StreetNumberLow?: string;
  StreetPrefix?: string;
  StreetName?: string;
  StreetType?: string;
  StreetSuffix?: string;
  /** Container for information about updated shipping address. It will be returned if there is any update due to exception. */
  AddressExtendedInformation?: UpsQuantumViewUpdatedAddressAddressExtendedInformation[];
  PoliticalDivision3?: string;
  PoliticalDivision2?: string;
  PoliticalDivision1?: string;
  CountryCode?: string;
  /** Postal Code of updated shipping address. It will be returned if there is any update due to exception. */
  PostcodePrimaryLow?: string;
}

export interface UpsQuantumViewUpdatedAddressAddressExtendedInformation {
  /** Allows for secondary address information such as s suite or apartment. It will be returned if there is any update due to exception. */
  Type?: string;
  Low?: string;
  High?: string;
}

export interface UpsQuantumViewExceptionResolution {
  Code: string;
  Description?: string;
}

export interface UpsQuantumViewExceptionActivityLocation {
  AddressArtifactFormat: UpsQuantumViewActivityLocationAddressArtifactFormat;
}

/** The information provided within this container identifies the shipper number and billing option the user specified to view during the subscription process. */
export interface UpsQuantumViewExceptionBillToAccount {
  /** Indicates how shipping charges for the package were billed. Valid Values: - 01 - Shipper - 02 - Consignee Billing - 03 - Third Party - 04 - Freight Collect */
  Option: string;
  Number: string;
}

export interface UpsQuantumViewSubscriptionFileDelivery {
  PackageReferenceNumber?: UpsQuantumViewDeliveryPackageReferenceNumber[];
  ShipmentReferenceNumber?: UpsQuantumViewDeliveryShipmentReferenceNumber[];
  ShipperNumber: string;
  TrackingNumber: string;
  /** Date that the package is delivered. Date format is YYYYMMDD. */
  Date: string;
  /** Time that the package is delivered. Time format is HHMMSS */
  Time: string;
  /** Information about driver release note / signature. */
  DriverRelease?: string;
  ActivityLocation?: UpsQuantumViewDeliveryActivityLocation;
  DeliveryLocation?: UpsQuantumViewDeliveryDeliveryLocation;
  COD?: UpsQuantumViewDeliveryCOD;
  BillToAccount?: UpsQuantumViewDeliveryBillToAccount;
  LastPickupDate?: string;
  AccessPointLocationID?: string;
}

export interface UpsQuantumViewDeliveryPackageReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewDeliveryShipmentReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For additional information, refer to the Reference Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewDeliveryActivityLocation {
  AddressArtifactFormat: UpsQuantumViewActivityLocationAddressArtifactFormat;
}

/** Information about the location where package is delivered. */
export interface UpsQuantumViewDeliveryDeliveryLocation {
  AddressArtifactFormat: UpsQuantumViewDeliveryLocationAddressArtifactFormat;
  /** Location Code for delivered package. */
  Code?: string;
  Description?: string;
  SignedForByName?: string;
}

/** Information that specifies a physical location where package is delivered. */
export interface UpsQuantumViewDeliveryLocationAddressArtifactFormat {
  ConsigneeName?: string;
  StreetNumberLow?: string;
  StreetPrefix?: string;
  StreetName?: string;
  StreetType?: string;
  StreetSuffix?: string;
  BuildingName?: string;
  /** Container tag for additional address information where package is delivered. */
  AddressExtendedInformation?: UpsQuantumViewAddressArtifactFormatAddressExtendedInformation[];
  PoliticalDivision3?: string;
  PoliticalDivision2?: string;
  PoliticalDivision1?: string;
  CountryCode?: string;
  /** Postal Code where package is delivered. Required if the user does not submit the City, Alphanumeric State/Province address combination. */
  PostcodePrimaryLow?: string;
  /** 4 Digit postal code extension where package is delivered. Valid for US only. */
  PostcodeExtendedLow?: string;
  ResidentialAddressIndicator?: string;
}

export interface UpsQuantumViewAddressArtifactFormatAddressExtendedInformation {
  /** Allows for secondary address information such as a suite or apartment. */
  Type?: string;
  Low?: string;
  High?: string;
}

/** Container for cash on delivery (COD) information. */
export interface UpsQuantumViewDeliveryCOD {
  CODAmount?: UpsQuantumViewCODCODAmount;
}

/** The information provided within this container identifies the shipper number and billing option the user specified to view during the subscription process. */
export interface UpsQuantumViewDeliveryBillToAccount {
  /** Indicates how shipping charges for the package were billed. Valid Values: - 01 - Shipper - 02 - Consignee Billing - 03 - Third Party - 04 - Freight Collect */
  Option: string;
  Number: string;
}

export interface UpsQuantumViewSubscriptionFileGeneric {
  ActivityType: string;
  TrackingNumber: string;
  ShipperNumber?: string;
  ShipmentReferenceNumber?: UpsQuantumViewGenericShipmentReferenceNumber[];
  PackageReferenceNumber?: UpsQuantumViewGenericPackageReferenceNumber[];
  Service?: UpsQuantumViewGenericService;
  Activity?: UpsQuantumViewGenericActivity;
  BillToAccount?: UpsQuantumViewGenericBillToAccount;
  ShipTo?: UpsQuantumViewGenericShipTo;
  RescheduledDeliveryDate?: string;
  FailureNotification?: UpsQuantumViewGenericFailureNotification;
}

export interface UpsQuantumViewGenericShipmentReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For addition information, refer to the Service Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

export interface UpsQuantumViewGenericPackageReferenceNumber {
  /** Not used. */
  BarCodeIndicator?: string;
  Number?: string;
  /** Reflects what will go on the label as the name of the reference. For addition information, refer to the Service Codes table in the Appendix. */
  Code?: string;
  Value: string;
}

/** Container for service code and description. */
export interface UpsQuantumViewGenericService {
  /** For addition information, refer to the Service Codes table in the Appendix. */
  Code: string;
  /** Not used. */
  Description?: string;
}

/** Information about package activity. */
export interface UpsQuantumViewGenericActivity {
  /** Date of package activity (i.e. YYYYMMDD). If generic record ActivityType is TC then event date is the date of first USPS scan. */
  Date?: string;
  /** Time of package activity(i.e. HHMMSS). If generic record ActivityType is TC then event time is the time of first USPS scan. */
  Time?: string;
}

/** The information provided within this container identifies the shipper number and billing option the user specified to view during the subscription process. */
export interface UpsQuantumViewGenericBillToAccount {
  /** Indicates how shipping charges for the package were billed. Valid Values: 01, 02, 03, 04, 99 Value Definitions: 01 Shipper 02 Consignee Billing 03 Third Party 04 Freight Collect 99 International Bill Option */
  Option: string;
  Number: string;
}

/** Address and contact information describing the location where a return is to be delivered. */
export interface UpsQuantumViewGenericShipTo {
  LocationID?: string;
  ReceivingAddressName?: string;
  Bookmark?: string;
}

/** Failure notification information containing email address and Notification code */
export interface UpsQuantumViewGenericFailureNotification {
  FailedEmailAddress?: string;
  FailureNotificationCode?: UpsQuantumViewFailureNotificationFailureNotificationCode;
}

/** Failure notification code information describing code. */
export interface UpsQuantumViewFailureNotificationFailureNotificationCode {
  Code?: string;
  /** Not used. */
  Description?: string;
}
