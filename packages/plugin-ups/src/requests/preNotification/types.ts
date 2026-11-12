// Generated shape of the UPS "PreNotification" OpenAPI spec; see docs/ups-api.md.

export interface UpsPreNotificationRequestWrapper {
  PreNotificationRequest: UpsPreNotificationRequest;
}

export interface UpsPreNotificationResponseWrapper {
  PreNotificationResponse: UpsPreNotificationResponse;
}

export interface UpsPreNotificationRequest {
  Request: UpsPreNotificationRequestRequest;
  Shipment: UpsPreNotificationRequestShipment;
}

export interface UpsPreNotificationRequestRequest {
  TransactionReference?: UpsPreNotificationRequestTransactionReference;
}

export interface UpsPreNotificationRequestTransactionReference {
  /** The CustomerContext information which will be echoed during response. */
  CustomerContext?: string;
}

export interface UpsPreNotificationRequestShipment {
  ShipperNumber: string;
  ShipmentIdentificationNumber: string;
  ShipToAddress: UpsPreNotificationShipmentShipToAddress;
  ShipFromAddress: UpsPreNotificationShipmentShipFromAddress;
  /** Date of the On Call Air Pickup. Format is YYYYMMDD */
  PickupDate: string;
  Service: UpsPreNotificationShipmentService;
  RegulationSet: string;
  Package:
    UpsPreNotificationShipmentPackage | UpsPreNotificationShipmentPackage[];
}

export interface UpsPreNotificationShipmentShipToAddress {
  AddressLine: string | string[];
  City?: string;
  StateProvinceCode?: string;
  /** The Ship To location's postal code. 9 characters are accepted. */
  PostalCode?: string;
  /** The Ship To location's country or territory code. */
  CountryCode: string;
}

export interface UpsPreNotificationShipmentShipFromAddress {
  AddressLine: string | string[];
  City?: string;
  StateProvinceCode?: string;
  /** The Ship From location's postal code. 9 characters are accepted. */
  PostalCode?: string;
  /** The Ship From location's country or territory code. */
  CountryCode: string;
}

export interface UpsPreNotificationShipmentService {
  /** UPS service type code. */
  Code: string;
  /** Description of the service code. Examples are Next Day Air, Worldwide Express, and Ground. */
  Description?: string;
}

/** Package Information container. */
export interface UpsPreNotificationShipmentPackage {
  TrackingNumber: string;
  PackageWeight: UpsPreNotificationPackagePackageWeight;
  /** Declares that a package was prepared according to ground, passenger aircraft, or cargo aircraft only. Only required when the CommodityRegulatedLevelCode is FR or LQ. Valid entries include: GND, CAO, PAX. */
  TransportationMode?: string;
  VoidIndicator?: string;
  PackagePoints?: string;
  ChemicalRecord:
    | UpsPreNotificationPackageChemicalRecord
    | UpsPreNotificationPackageChemicalRecord[];
}

/** Container to hold package weight information. */
export interface UpsPreNotificationPackagePackageWeight {
  UnitOfMeasurement: UpsPreNotificationPackageWeightUnitOfMeasurement;
  Weight: string;
}

/** Container to hold UnitOfMeasurement information for package weight. */
export interface UpsPreNotificationPackageWeightUnitOfMeasurement {
  /** Package weight unit of measurement code. Codes are: LBS = Pounds KGS = Kilograms */
  Code: string;
  /** Description of the unit of measurement for package weight. */
  Description?: string;
}

export interface UpsPreNotificationPackageChemicalRecord {
  ReportableQuantity?: string;
  /** This is the hazard class associated to the specified commodity. Required if CommodityRegulatedLevelCode is 'LQ' or 'FR' */
  ClassDivisionNumber?: string;
  SubRiskClass?: string;
  IDNumber?: string;
  /** This is the packing group category associated to the specified commodity. Must be shown in Roman Numerals. Valid values are: - I - II - III - blank */
  PackagingGroupType?: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR. The numerical value of the mass capacity of the regulated good. */
  Quantity?: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR. The unit of measure used for the mass capacity of the regulated good. */
  UOM?: string;
  PackagingInstructionCode?: string;
  EmergencyPhone?: string;
  /** The emergency information, contact name and/or contract number, required to be communicated when a call is placed to the EmergencyPhoneNumber. */
  EmergencyContact?: string;
  /** The Proper Shipping Name assigned by ADR, CFR or IATA. Required if CommodityRegulatedLevelCode = LQ or FR. */
  ProperShippingName?: string;
  TechnicalName?: string;
  /** Additional remarks or special provision information. */
  AdditionalDescription?: string;
  PackagingType?: string;
  HazardLabelRequired?: string;
  /** The number of pieces of the specific commodity. Required if CommodityRegulatedLevelCode = LQ or FR. Valid values are 1 to 999. */
  PackagingTypeQuantity?: string;
  /** Indicates the type of commodity, Fully Regulated (FR), Limited Quantity (LQ), Lightly Regulated (LR) Valid values are LR, FR and LQ. */
  CommodityRegulatedLevelCode: string;
  /** Transport Category. Valid values are 0 to 4. */
  TransportCategory?: string;
  TunnelRestrictionCode?: string;
  QValue?: string;
  OverPackedIndicator?: string;
  AllPackedInOneIndicator?: string;
}

export interface UpsPreNotificationResponse {
  Response: UpsPreNotificationResponseResponse;
}

export interface UpsPreNotificationResponseResponse {
  ResponseStatus: UpsPreNotificationResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsPreNotificationResponseAlert[];
  TransactionReference?: UpsPreNotificationResponseTransactionReference;
}

export interface UpsPreNotificationResponseResponseStatus {
  /** Identifies the success or failure of the transaction. Valid values 1 = Successful. */
  Code: string;
  /** Describes Response Status Code. Returns text of Success. */
  Description: string;
}

/** Alert Container. There can be zero to many alert containers with code and description. */
export interface UpsPreNotificationResponseAlert {
  /** Warning code returned by the system. */
  Code: string;
  Description: string;
}

export interface UpsPreNotificationResponseTransactionReference {
  /** The CustomerContext information which will be echoed during response. */
  CustomerContext?: string;
  /** In UPS's v1 samples and spec examples, though not in the spec's schema. */
  TransactionIdentifier?: string;
}
