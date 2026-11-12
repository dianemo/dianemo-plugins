// Three UPS Supply Chain Symphony ingest specs share one family. Their schema names collide
// (Error, ErrorResponse, ActivityInformation, ...) with different shapes, so each spec's types
// carry their own segment: UpsScsInventory*, UpsScsLogistics*, UpsScsTransportation*.

// --- Ingest Inventory API v1 ---

export interface UpsScsInventoryError {
  code: string;
  message: string;
}

export interface UpsScsInventoryResponseErrorsArr {
  errors: UpsScsInventoryError[];
}

export interface UpsScsInventoryErrorResponse {
  response?: UpsScsInventoryResponseErrorsArr;
}

export interface UpsScsIngestInventoryRequest {
  apiVersion: string;
  request: UpsScsInventoryRequestData;
}

export interface UpsScsInventoryRequestData {
  sourceSystem: string;
  partnerId: string;
  sbMessageId?: string;
  docFlow: string;
  docId?: string;
  docDateTime?: string;
  docType: string;
  transactionType?: string;
  docVer?: string;
  inventorySnapshotId?: string;
  inventorySnapshotDate?: string;
  inventoryInformation: UpsScsInventoryInformation[];
}

export interface UpsScsInventoryInformation {
  customerAccountNumber: string;
  warehouseInformation?: UpsScsInventoryWarehouseInformation;
  availableQuantity?: string;
  nonAvailableQuantity?: string;
  qcHoldQuantity?: string;
  inTransitQuantity?: string;
  reservedQuantity?: string;
  references?: UpsScsInventoryReferenceInformation[];
  dpOrgEntityKey?: string | null;
  lpnNumber?: string | null;
  designator?: string | null;
  vendorSerialNumber?: string | null;
  vendorLotNumber?: string | null;
  batchStatus?: string;
  expirationDate?: string | null;
  batchHoldReason?: string;
  holdDescription?: string | null;
  businessUnit?: string | null;
  dispositionCode?: string;
  palletId?: string;
  itemNumber: string;
  itemDescription?: string;
  itemWeight?: string;
  itemWeightUOM?: string;
  itemDimensions?: UpsScsInventoryItemDimensions;
  hazardClass?: string;
  hazmatClass?: string;
  strategicGoodsFlag?: string;
  unCode?: string;
  category?: string;
}

export interface UpsScsInventoryWarehouseInformation {
  warehouseCode?: string;
  warehouseName?: string;
  warehouseTimeZone?: string;
  address?: UpsScsInventoryWarehouseAddress;
}

export interface UpsScsInventoryWarehouseAddress {
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface UpsScsInventoryReferenceInformation {
  referenceCode?: string;
  referenceType?: string;
  referenceValue?: string;
}

export interface UpsScsInventoryItemDimensions {
  height?: string;
  length?: string;
  width?: string;
  dimensionUOM?: string;
}

export interface UpsScsIngestInventorySuccessResponse {
  isCompleted: boolean;
  isFaulted: boolean;
  errors: Record<string, unknown>[];
  result: UpsScsInventoryResult[];
}

export interface UpsScsInventoryResult {
  messageId?: string;
  orderNumber?: string;
  shipmentNumber?: string;
  shipmentUniquekey?: string;
  docId?: string;
  docType?: string;
  isCompleted?: boolean;
}

export interface UpsScsIngestInventoryErrorResponse {
  isCompleted: boolean;
  isFaulted: boolean;
  errors: UpsScsInventoryOperationError[];
  result: string;
}

export interface UpsScsInventoryOperationError {
  code: string;
  message: string;
  source: string;
}

export interface UpsScsInventoryUnauthorizedResponse {
  apiName: string;
  faultName: string;
  errorCode: string;
  errorDate: string;
  errorTime: string;
  errorDescription: string;
}
// --- Ingest Logistics API v1 ---

export interface UpsScsLogisticsDataRequest {
  apiVersion: string;
  request: UpsScsLogisticsRequestPayload;
}

export interface UpsScsLogisticsRequestPayload {
  /** ISO 8601 date-time */
  docDateTime?: string;
  docFlow?: string;
  docId: string;
  docType: string;
  docVer?: string;
  originalDocId?: string;
  sourceSystem: string;
  orderDetails?: UpsScsLogisticsOrderDetail[];
}

export interface UpsScsLogisticsOrderDetail {
  customerAccountNumber?: string;
  orderNumber?: string;
  /** ISO 8601 date */
  orderPlacedDate?: string;
  shipmentDetails?: UpsScsLogisticsShipmentDetail[];
}

export interface UpsScsLogisticsShipmentDetail {
  activityInformation?: UpsScsLogisticsActivityInformation;
  /** ISO 8601 date-time */
  actualPickupDateTime?: string;
  billingInformation?: UpsScsLogisticsBillingInformation;
  carrier?: UpsScsLogisticsCarrier;
  carrierShipmentNumber?: string[];
  collectOnDeliveryAmount?: string;
  collectOnDeliveryCurrency?: string;
  /** ISO 8601 date-time */
  earliestDeliveryDateTime?: string;
  internationalShipment?: UpsScsLogisticsInternationalShipment;
  /** ISO 8601 date-time */
  latestDeliveryDateTime?: string;
  leadShipmentNumber?: string;
  loadId?: string;
  partyDetails?: UpsScsLogisticsPartyDetail[];
  /** ISO 8601 date-time */
  rescheduledDeliveryDateTime?: string;
  /** ISO 8601 date-time */
  scheduledDeliveryDateTime?: string;
  /** ISO 8601 date-time */
  scheduledPickupDateTime?: string;
  service?: UpsScsLogisticsService;
  shipmentDescription?: string;
  shipmentNumber: string;
  /** ISO 8601 date */
  shipmentPlacedDate?: string;
  shipmentReferences?: UpsScsLogisticsShipmentReference[];
  shipmentUniquekey: string;
  shipUnits?: UpsScsLogisticsShipUnit[];
  specialInformation?: UpsScsLogisticsSpecialInformation;
}

export interface UpsScsLogisticsActivityInformation {
  activityID?: string;
  activityLocation?: UpsScsLogisticsActivityLocation;
  activitySubType?: string;
  activitySubTypeDescription?: string;
  deliveryInformation?: UpsScsLogisticsDeliveryInformation;
  description?: string;
  exceptionInformation?: UpsScsLogisticsExceptionInformation[];
  /** ISO 8601 date-time */
  gmtDateTime?: string;
  gmtOffset?: string;
  /** ISO 8601 date-time */
  localDateTime?: string;
  sensorEvent?: boolean;
  type?: string;
}

export interface UpsScsLogisticsActivityLocation {
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  stateProvince?: string;
}

export interface UpsScsLogisticsDeliveryInformation {
  /** ISO 8601 date-time */
  actualDeliveryDateTime?: string;
  actualDeliveryDateTimegmtOffset?: string;
  podSignatureImage?: string;
  podSignatureText?: string;
}

export interface UpsScsLogisticsExceptionInformation {
  /** ISO 8601 date-time */
  exceptionCreatedDateGmt?: string;
  exceptionCreatedDateGmtOffset?: string;
  exceptionType?: string;
  reasonCode?: string;
  reasonDescription?: string;
  resolutionCode?: string;
  resolutionDescription?: string;
  statusCode?: string;
  statusDescription?: string;
}

export interface UpsScsLogisticsBillingInformation {
  billingTermCode?: string;
  billingTermDescription?: string;
}

export interface UpsScsLogisticsCarrier {
  carrierCode?: string;
  carrierName?: string;
  carrierType?: string;
}

export interface UpsScsLogisticsInternationalShipment {
  harmonizedCommodityCode?: string;
  shipmentExportCountryCode?: string;
  specialInstructions?: string;
}

export interface UpsScsLogisticsPartyDetail {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  attentionName?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  county?: string;
  email?: string;
  fax?: string;
  name?: string;
  phone?: string;
  postalCode?: string;
  stateCode?: string;
  type?: string;
}

export interface UpsScsLogisticsService {
  carrierServiceCode?: string;
  carrierServiceDescription?: string;
  handlingCode?: string;
  handlingDescription?: string;
  saturdayDeliveryFlag?: string;
  serviceCode?: string;
  serviceDescription?: string;
}

export interface UpsScsLogisticsShipmentReference {
  referenceType?: string;
  referenceValue?: string;
}

export interface UpsScsLogisticsShipUnit {
  dimensionWeight?: string;
  dimensionWeightUOM?: string;
  height?: string;
  heightUOM?: string;
  itemDesciption?: string;
  length?: string;
  lengthUOM?: string;
  shipmentQuantity?: string;
  volume?: string;
  volumeUOM?: string;
  weight?: string;
  weightUOM?: string;
  width?: string;
  widthUOM?: string;
}

export interface UpsScsLogisticsSpecialInformation {
  hazmatCategoryCode?: string;
  hazmatCategoryDescription?: string;
  hazmatFlag?: string;
}

export interface UpsScsLogisticsSC360ResponseListServiceResponse {
  errors?: UpsScsLogisticsServiceError[];
  isCompleted?: boolean;
  isFaulted?: boolean;
  result?: UpsScsLogisticsProcessingResult[];
}

export interface UpsScsLogisticsObjectServiceResponse {
  errors?: UpsScsLogisticsServiceError[];
}

export interface UpsScsLogisticsServiceError {
  code?: string;
  /** Error message. Includes source context in the format "(source: )" to identify where the error was thrown. */
  message?: string;
}

export interface UpsScsLogisticsProcessingResult {
  messageId?: string;
  orderNumber?: string;
  shipmentNumber?: string;
  shipmentUniquekey?: string;
  docId?: string;
  docType?: string;
  isCompleted?: boolean;
}
// --- UPS Partner Transportation Data Ingestion API v1.0 ---

export interface UpsScsTransportationActivityInformation {
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  activityID?: string | null;
  activityLocation?: UpsScsTransportationActivityLocation;
  activitySubType?: string | null;
  activitySubTypeDescription?: string | null;
  deliveryInformation?: UpsScsTransportationDeliveryInformation;
  description?: string;
  /** ISO 8601 date-time */
  localDateTime?: string;
  sensorEvent?: boolean | null;
  type?: string;
}

export interface UpsScsTransportationActivityLocation {
  city?: string;
  country?: string;
  latitude?: string | null;
  longitude?: string | null;
  postalCode?: string | null;
  stateProvince?: string | null;
}

export interface UpsScsTransportationBillingInformation {
  billingTermCode?: string | null;
  billingTermDescription?: string | null;
}

export interface UpsScsTransportationCarrier {
  carrierCode?: string | null;
  carrierName?: string | null;
  carrierType?: string | null;
}

export interface UpsScsTransportationDeliveryInformation {
  /** ISO 8601 date-time */
  actualDeliveryDateTime?: string | null;
  actualDeliveryDateTimegmtOffset?: string | null;
  podSignatureImage?: string | null;
  podSignatureText?: string | null;
  podSignedBy?: string | null;
  /** ISO 8601 date-time */
  podSignedOn?: string | null;
}

export interface UpsScsTransportationError {
  code?: string | null;
  message?: string | null;
  source?: string | null;
}

export interface UpsScsTransportationExceptionInformation {
  exceptionType?: string;
  reasonCode?: string | null;
  reasonDescription?: string | null;
  resolutionCode?: string;
  resolutionDescription?: string | null;
  statusCode?: string | null;
  statusDescription?: string | null;
  /** ISO 8601 date-time */
  exceptionCreatedDate?: string | null;
  /** ISO 8601 date-time */
  exceptionCreatedDateGmt?: string | null;
  exceptionCreatedDateGmtOffset?: string | null;
}

export interface UpsScsTransportationGps {
  city?: string | null;
  country?: string | null;
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  latitude?: string | null;
  /** ISO 8601 date-time */
  localDateTime?: string | null;
  longitude?: string | null;
}

export interface UpsScsTransportationHumidityLevel {
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  humidity?: string | null;
  humidityUOM?: string | null;
  /** ISO 8601 date-time */
  localDateTime?: string | null;
}

export interface UpsScsTransportationInternationalShipment {
  harmonizedCommodityCode?: string | null;
  shipmentExportCountryCode?: string | null;
  specialInstructions?: string | null;
}

export interface UpsScsTransportationLightStrength {
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  light?: string | null;
  lightUOM?: "lux" | "candles" | "lumens" | "footcandles" | null;
  /** ISO 8601 date-time */
  localDateTime?: string | null;
}

export interface UpsScsTransportationObjectServiceResponse {
  errors?: UpsScsTransportationError[] | null;
  isCompleted?: boolean;
  isFaulted?: boolean;
  result?: Record<string, unknown> | null;
}

export interface UpsScsTransportationOrderDetails {
  customerAccountNumber: string;
  orderNumber?: string | null;
  customerPONumber?: string | null;
  /** ISO 8601 date-time */
  orderPlacedDate?: string;
  shipmentDetails: UpsScsTransportationShipmentDetail[];
}

export interface UpsScsTransportationPartyDetail {
  city?: string;
  countryCode?: string;
  stateCode?: string | null;
  type?: "Shipper" | "Consignee";
}

export interface UpsScsTransportationSC360Interface {
  sbMessageId?: string | null;
  docFlow?: "Inbound" | "Outbound";
  docId?: string;
  /** Current Date/Time when message is generated in UTC format */
  docTime?: string;
  docType: "OrderStatus" | "Order";
  docVer?: string;
  transactionType?: string | null;
  orderDetails: UpsScsTransportationOrderDetails[];
  originalDocId?: string | null;
  sourceSystem: string;
  partnerId?: string | null;
}

export interface UpsScsTransportationSC360InterfaceSC360IngestRequest {
  request: UpsScsTransportationSC360Interface;
  apiVersion: "v1.0";
}

export interface UpsScsTransportationSC360Response {
  messageId: string;
  orderNumber: string;
  shipmentNumber: string;
  shipmentUniquekey: string;
  docId: string;
  docType: "OrderStatus" | "Order";
  isCompleted?: boolean;
}

export interface UpsScsTransportationSC360ResponseListServiceResponse {
  errors?: UpsScsTransportationError[] | null;
  isCompleted?: boolean;
  isFaulted?: boolean;
  result?: UpsScsTransportationSC360Response[] | null;
}

export interface UpsScsTransportationSensorData {
  gps?: UpsScsTransportationGps;
  humidityLevel?: UpsScsTransportationHumidityLevel;
  lightStrength?: UpsScsTransportationLightStrength;
  shockForce?: UpsScsTransportationShockForce;
  temperature?: UpsScsTransportationTemperature;
}

export interface UpsScsTransportationService {
  carrierServiceCode?: string;
  carrierServiceDescription?: string | null;
  handlingCode?: string | null;
  handlingDescription?: string | null;
  saturdayDeliveryFlag?: "Y" | "N" | null;
  serviceCode?: string | null;
  serviceDescription?: string | null;
}

export interface UpsScsTransportationShipUnit {
  dimensionWeight?: string | null;
  dimensionWeightUOM?: string | null;
  height?: string | null;
  heightUOM?: string | null;
  itemDesciption?: string | null;
  length?: string | null;
  lengthUOM?: string | null;
  weight?: string | null;
  weightUOM?: string | null;
  width?: string | null;
  widthUOM?: string | null;
  shipmentQuantity?: number | null;
  volume?: string | null;
  volumeUOM?: string | null;
}

export interface UpsScsTransportationShipmentDetail {
  activityInformation?: UpsScsTransportationActivityInformation;
  /** ISO 8601 date-time */
  actualPickupDateTime?: string | null;
  billingInformation?: UpsScsTransportationBillingInformation;
  carrier?: UpsScsTransportationCarrier;
  collectOnDeliveryAmount?: string | null;
  collectOnDeliveryCurrency?: string | null;
  /** ISO 8601 date-time */
  earliestDeliveryDateTime?: string | null;
  internationalShipment?: UpsScsTransportationInternationalShipment;
  /** ISO 8601 date-time */
  latestDeliveryDateTime?: string | null;
  leadShipmentNumber?: string | null;
  partyDetails?: UpsScsTransportationPartyDetail[] | null;
  /** ISO 8601 date-time */
  rescheduledDeliveryDateTime?: string | null;
  /** ISO 8601 date-time */
  scheduledDeliveryDateTime?: string | null;
  /** ISO 8601 date-time */
  scheduledPickupDateTime?: string | null;
  sensorData?: UpsScsTransportationSensorData;
  service?: UpsScsTransportationService;
  shipUnits?: UpsScsTransportationShipUnit[] | null;
  shipmentDescription?: string | null;
  shipmentNumber: string;
  shipmentReferences?: UpsScsTransportationShipmentReference[] | null;
  specialInformation?: UpsScsTransportationSpecialInformation;
  temperatureCondition?: string | null;
  /** ISO 8601 date-time */
  shipmentPlacedDate: string;
  carrierShipmentNumber?: string[] | null;
  shipmentUniqueKey: string;
  /** ISO 8601 date-time */
  shipmentBookedDate?: string | null;
  exceptionInformation?: UpsScsTransportationExceptionInformation;
}

export interface UpsScsTransportationShipmentReference {
  referenceCode?: string | null;
  referenceType?: string;
  referenceValue?: string;
}

export interface UpsScsTransportationShockForce {
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  /** ISO 8601 date-time */
  localDateTime?: string | null;
  shock?: string | null;
  shockUOM?: string | null;
}

export interface UpsScsTransportationSpecialInformation {
  hazmatCategoryCode?: string | null;
  hazmatCategoryDescription?: string | null;
  hazmatFlag?: "Y" | "N" | null;
}

export interface UpsScsTransportationTemperature {
  /** ISO 8601 date-time */
  gmtDateTime?: string | null;
  gmtOffset?: string | null;
  /** ISO 8601 date-time */
  localDateTime?: string | null;
  temperatureInfo?: string | null;
  temperatureUOM?: "C" | "F" | null;
}
