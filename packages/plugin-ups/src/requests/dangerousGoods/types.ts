// Generated shape of the UPS "Dangerous Goods Utility" OpenAPI spec; see docs/ups-api.md.

export interface UpsDangerousGoodsChemicalReferenceDataRequestWrapper {
  ChemicalReferenceDataRequest: UpsDangerousGoodsChemicalReferenceDataRequest;
}

export interface UpsDangerousGoodsChemicalReferenceDataResponseWrapper {
  ChemicalReferenceDataResponse: UpsDangerousGoodsChemicalReferenceDataResponse;
}

export interface UpsDangerousGoodsChemicalReferenceDataRequest {
  Request: UpsDangerousGoodsChemicalReferenceDataRequestRequest;
  IDNumber?: string;
  /** The Proper Shipping Name assigned by ADR, CFR or IATA. At least one of the information - IDNumber or ProperShippingName should be provided to retrieve Chemical Reference Data. */
  ProperShippingName?: string;
  ShipperNumber: string;
}

export interface UpsDangerousGoodsChemicalReferenceDataRequestRequest {
  RequestOption?: string[];
  SubVersion?: string;
  TransactionReference?: UpsDangerousGoodsRequestTransactionReference;
}

export interface UpsDangerousGoodsRequestTransactionReference {
  /** The CustomerContext information which will be echoed during response. */
  CustomerContext?: string;
}

export interface UpsDangerousGoodsChemicalReferenceDataResponse {
  Response: UpsDangerousGoodsChemicalReferenceDataResponseResponse;
  /** Container to hold Chemical Data information. */
  ChemicalData?: UpsDangerousGoodsChemicalReferenceDataResponseChemicalData[];
}

export interface UpsDangerousGoodsChemicalReferenceDataResponseResponse {
  ResponseStatus: UpsDangerousGoodsResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsDangerousGoodsResponseAlert[];
  TransactionReference?: UpsDangerousGoodsResponseTransactionReference;
}

export interface UpsDangerousGoodsResponseResponseStatus {
  /** Identifies the success or failure of the transaction. Valid values: 0 = Failed and 1 = Successful. */
  Code: string;
  /** Describes Response Status Code. Returns text of "Success" or "Failure". */
  Description: string;
}

/** Alert Container. There can be zero to many alert containers with code and description. */
export interface UpsDangerousGoodsResponseAlert {
  /** Warning code returned by the system. */
  Code: string;
  Description: string;
}

export interface UpsDangerousGoodsResponseTransactionReference {
  /** The CustomerContext information which will be echoed during response. */
  CustomerContext?: string;
}

export interface UpsDangerousGoodsChemicalReferenceDataResponseChemicalData {
  ChemicalDetail?: UpsDangerousGoodsChemicalDataChemicalDetail;
  ProperShippingNameDetail?: UpsDangerousGoodsChemicalDataProperShippingNameDetail;
  /** Container to hold Package Quantity Limit Detail information. It will be returned if applies for a given chemical record. */
  PackageQuantityLimitDetail?: UpsDangerousGoodsChemicalDataPackageQuantityLimitDetail[];
}

export interface UpsDangerousGoodsChemicalDataChemicalDetail {
  RegulationSet?: string;
  IDNumber?: string;
  HazardousMaterialsDescription?: string;
  ClassDivisionNumber?: string;
  SubRiskClass?: string;
  /** This is the packing group category associated to the specified commodity. This code represents the potential degree of danger represented by a regulated commodity being transported. It will be returned if applies for a given chemical record. */
  PackagingGroupType?: string;
  /** Indicates whether or not related entity requires special permit in order to transport the chemical. It will be returned if applies for a given chemical record. Valid values: AIR GND BOTH */
  SpecialPermit?: string;
  TechnicalNameRequiredIndicator?: string;
  AdditionalShippingInformationRequiredIndicator?: string;
  TunnelRestrictionCode?: string;
  TransportCategory?: string;
  TransportMultiplierQuantity?: string;
  ChannelTunnelAcceptedIndicator?: string;
  ChemicalType?: string;
  CAToUSShipmentAllowedIndicator?: string;
}

/** Container to hold Proper Shipping Name Detail information. It will be returned if applies for a given chemical record. */
export interface UpsDangerousGoodsChemicalDataProperShippingNameDetail {
  /** The spec declares this array without `items`; strings are inferred from the name. */
  ProperShippingName: string[];
}

export interface UpsDangerousGoodsChemicalDataPackageQuantityLimitDetail {
  PackageQuantityLimitTypeCode?: string;
  Quantity?: string;
  /** The unit of measure used for the mass capacity of the regulated good. It will be returned if applies for a given chemical record. Example: ml, L, g, mg, kg, cylinder, pound, pint, quart, gallon, ounce etc. */
  UOM?: string;
  PackagingInstructionCode?: string;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckRequestWrapper {
  AcceptanceAuditPreCheckRequest: UpsDangerousGoodsAcceptanceAuditPreCheckRequest;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckResponseWrapper {
  AcceptanceAuditPreCheckResponse: UpsDangerousGoodsAcceptanceAuditPreCheckResponse;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckRequest {
  Request: UpsDangerousGoodsAcceptanceAuditPreCheckRequestRequest;
  OriginRecordTransactionTimestamp?: string;
  Shipment: UpsDangerousGoodsAcceptanceAuditPreCheckRequestShipment;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckRequestRequest {
  RequestOption?: string;
  /** Not Used. */
  SubVersion?: string;
  TransactionReference?: UpsDangerousGoodsRequestTransactionReference;
}

/** Contains shipment information. */
export interface UpsDangerousGoodsAcceptanceAuditPreCheckRequestShipment {
  ShipperNumber: string;
  ShipFromAddress: UpsDangerousGoodsShipmentShipFromAddress;
  ShipToAddress: UpsDangerousGoodsShipmentShipToAddress;
  Service: UpsDangerousGoodsShipmentService;
  RegulationSet?: string;
  Package: UpsDangerousGoodsShipmentPackage[];
}

export interface UpsDangerousGoodsShipmentShipFromAddress {
  AddressLine?: string;
  City?: string;
  StateProvinceCode?: string;
  /** The Ship From locations postal code. 9 characters are accepted. */
  PostalCode?: string;
  /** The Ship From locations country or territory code. */
  CountryCode: string;
}

export interface UpsDangerousGoodsShipmentShipToAddress {
  AddressLine?: string;
  City?: string;
  StateProvinceCode?: string;
  /** The Ship To locations postal code. 9 characters are accepted. */
  PostalCode?: string;
  /** The Ship To locations country or territory code. */
  CountryCode: string;
}

export interface UpsDangerousGoodsShipmentService {
  /** UPS service type code. */
  Code: string;
  Description?: string;
}

/** Package Information container. */
export interface UpsDangerousGoodsShipmentPackage {
  PackageIdentifier: string;
  PackageWeight: UpsDangerousGoodsPackagePackageWeight;
  /** This is required when a HazMat shipment specifies AllPackedInOneIndicator and the regulation set for that shipment is IATA. Valid values: 0.1; 0.2; 0.3; 0.4; 0.5; 0.6; 0.7; 0.8; 0.9; 1.0 */
  QValue?: string;
  OverPackedIndicator?: string;
  /** The method of transport by which a shipment is approved to move and the regulations associated with that method. Only required when the CommodityRegulatedLevelCode is FR or LQ. Valid entries include: GND, CAO, and PAX. */
  TransportationMode?: string;
  EmergencyPhone?: string;
  EmergencyContact?: string;
  ChemicalRecord: UpsDangerousGoodsPackageChemicalRecord[];
}

/** Container to hold package weight information. */
export interface UpsDangerousGoodsPackagePackageWeight {
  Weight: string;
  UnitOfMeasurement: UpsDangerousGoodsPackageWeightUnitOfMeasurement;
}

/** Container to hold UnitOfMeasurement information for package weight. */
export interface UpsDangerousGoodsPackageWeightUnitOfMeasurement {
  /** Package weight unit of measurement code. Valid values: LBS = Pounds KGS = Kilograms */
  Code: string;
  /** Description of the unit of measurement for package weight. */
  Description?: string;
}

/** Container to hold Chemical Record information. */
export interface UpsDangerousGoodsPackageChemicalRecord {
  ChemicalRecordIdentifier: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR and if the field applies to the material by regulation. If reportable quantity is met, RQ should be entered. */
  ReportableQuantity?: string;
  /** This is the hazard class associated to the specified commodity. Required if CommodityRegulatedLevelCode is 'LQ' or 'FR' */
  ClassDivisionNumber?: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR and if the field applies to the material by regulation. Secondary hazardous characteristics of a package. (There can be more than one – separate each with a comma). */
  SubRiskClass?: string;
  IDNumber?: string;
  /** This is the packing group category associated to the specified commodity. Required if CommodityRegulatedLevelCode = LQ or FR and if the field applies to the material by regulation. Must be shown in Roman Numerals. Valid values are: I II III blank */
  PackagingGroupType?: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR. The numerical value of the mass capacity of the regulated good. */
  Quantity?: string;
  /** Required if CommodityRegulatedLevelCode = LQ or FR. The unit of measure used for the mass capacity of the regulated good. Example: ml, L, g, mg, kg, cylinder, pound, pint, quart, gallon, ounce etc. */
  UOM?: string;
  /** The packing instructions related to the chemical record. Required if CommodityRegulatedLevelCode = LQ or FR and if the field applies to the material by regulation. */
  PackagingInstructionCode?: string;
  /** The Proper Shipping Name assigned by ADR, CFR or IATA. Required if CommodityRegulatedLevelCode = LR, LQ or FR. */
  ProperShippingName?: string;
  /** The technical name (when required) for the specified commodity. Required if CommodityRegulatedLevelCode = LQ or FR and if the field applies to the material by regulation. */
  TechnicalName?: string;
  AdditionalDescription?: string;
  /** The package type code identifying the type of packaging used for the commodity. (Ex: Fiberboard Box). Required if CommodityRegulatedLevelCode = LQ or FR. */
  PackagingType?: string;
  /** Defines the type of label that is required on the package for the commodity. Not applicable if CommodityRegulatedLevelCode = LR or EQ. */
  HazardLabelRequired?: string;
  /** The number of pieces of the specific commodity. Required if CommodityRegulatedLevelCode = LQ or FR. Valid values: 1 to 999 */
  PackagingTypeQuantity?: string;
  /** Indicates the type of commodity. Valid values: LR, FR, LQ, EQ FR = Fully Regulated LQ = Limited Quantity EQ = Excepted Quantity LR = Lightly Regulated */
  CommodityRegulatedLevelCode: string;
  /** Transport Category. Valid values: 0 to 4 */
  TransportCategory?: string;
  TunnelRestrictionCode?: string;
  AllPackedInOneIndicator?: string;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckResponse {
  Response: UpsDangerousGoodsAcceptanceAuditPreCheckResponseResponse;
  ShipperNumber?: string;
  Service?: UpsDangerousGoodsAcceptanceAuditPreCheckResponseService;
  /** The Regulatory set associated with every regulated shipment. This is same Regulation set present in the request that is played back in response. Valid values: ADR 49CFR IATA TDG */
  RegulationSet?: string;
  PackageResults?: UpsDangerousGoodsAcceptanceAuditPreCheckResponsePackageResults[];
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckResponseResponse {
  ResponseStatus: UpsDangerousGoodsResponseResponseStatus;
  /** Alert Container. There can be zero to many alert containers with code and description. */
  Alert?: UpsDangerousGoodsResponseAlert[];
  AlertDetail?: UpsDangerousGoodsResponseAlertDetail[];
  TransactionReference?: UpsDangerousGoodsResponseTransactionReference;
}

export interface UpsDangerousGoodsResponseAlertDetail {
  /** Warning code returned by the system. */
  Code: string;
  Description: string;
  ElementLevelInformation?: UpsDangerousGoodsAlertDetailElementLevelInformation;
}

/** Provides more information about the element that represents the alert. */
export interface UpsDangerousGoodsAlertDetailElementLevelInformation {
  Level: string;
  ElementIdentifier?: UpsDangerousGoodsElementLevelInformationElementIdentifier[];
}

/** Contains more information about the type of element. Returned if Level is P or C. */
export interface UpsDangerousGoodsElementLevelInformationElementIdentifier {
  Code: string;
  Value: string;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckResponseService {
  /** UPS service type code. */
  Code: string;
}

export interface UpsDangerousGoodsAcceptanceAuditPreCheckResponsePackageResults {
  PackageIdentifier: string;
  AccessibleIndicator?: string;
  /** Indicates if origin country or territory is in the Europe Business Unit. Y = Origin country or territory is in the Europe Business Unit. N = Origin country or territory is not in the Europe Business Unit. */
  EuropeBUIndicator?: string;
  ChemicalRecordResults?: UpsDangerousGoodsPackageResultsChemicalRecordResults[];
}

export interface UpsDangerousGoodsPackageResultsChemicalRecordResults {
  ChemicalRecordIdentifier: string;
  ADRPoints?: string;
  /** Transport Category. Valid values: 0 to 4 */
  TransportCategory?: string;
  TunnelRestrictionCode?: string;
  /** Number of ADR Units (Liters/Kg) Format: 9999.99 */
  ADRUnits?: string;
}
