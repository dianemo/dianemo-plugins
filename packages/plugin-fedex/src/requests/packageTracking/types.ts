import {
  FedExDimensionUnit,
  FedExWeightUnit,
  FedexCarrierCodes,
} from "../types.js";

export const FedExTrackingStatusCodes = {
  AA: "At Airport",
  AC: "At Canada Post facility",
  AD: "At Delivery",
  AE: "Shipment arriving early",
  AF: "At FedEx Facility",
  AS: "Address corrected",
  AO: "Shipment arriving On-time",
  AP: "At Pickup",
  AR: "Arrived",
  AX: "At USPS facility",
  CA: "Shipment Cancelled",
  CC: "International shipment release",
  CD: "Clearance delay",
  CH: "Location Changed",
  DD: "Delivery Delay",
  DE: "Delivery Exception",
  DL: "Delivered",
  DO: "Delivered (at Original Destination)",
  DP: "Departed",
  DR: "Vehicle furnished but not used",
  DS: "Vehicle Dispatched",
  DY: "Delay",
  EA: "Enroute to Airport",
  ED: "Enroute to Delivery",
  EO: "Enroute to Origin Airport",
  EP: "Enroute to Pickup",
  FD: "At FedEx Destination",
  HA: "Hold at location request accepted",
  HL: "Hold at Location",
  HP: "Ready for recipient pickup",
  IP: "In transit",
  IT: "In Transit",
  IX: "In transit (see Details)",
  LO: "Left Origin",
  OC: "Order Created",
  OD: "Out for Delivery",
  OF: "At FedEx origin facility",
  OX: "Shipment information sent to USPS",
  PD: "Pickup Delay",
  PF: "Plane in Flight",
  PL: "Plane Landed",
  PM: "In Progress",
  PU: "Picked Up",
  PX: "Picked up (see Details)",
  RR: "CDO requested",
  RM: "CDO Modified",
  RC: "CDO Cancelled",
  RS: "Return to Shipper",
  RP: "Return label link emailed to return sender",
  LP: "Return label link cancelled by shipment originator",
  RG: "Return label link expiring soon",
  RD: "Return label link expired",
  SE: "Shipment Exception",
  SF: "At Sort Facility",
  SP: "Split Status",
} as const;

export type FedExTrackingStatusCode = keyof typeof FedExTrackingStatusCodes;

type PackageIdentifierType =
  | "BILL_OF_LADING"
  | "COD_RETURN_TRACKING_NUMBER"
  | "CUSTOMER_AUTHORIZATION_NUMBER"
  | "CUSTOMER_REFERENCE"
  | "DEPARTMENT"
  | "DOCUMENT_AIRWAY_BILL"
  | "EXPRESS_ALTERNATE_REFERENCE"
  | "FEDEX_OFFICE_JOB_ORDER_NUMBER"
  | "FREE_FORM_REFERENCE"
  | "GROUND_INTERNATIONAL"
  | "GROUND_SHIPMENT_ID"
  | "GROUP_MPS"
  | "INTERNATIONAL_DISTRIBUTION"
  | "INVOICE"
  | "JOB_GLOBAL_TRACKING_NUMBER"
  | "ORDER_GLOBAL_TRACKING_NUMBER"
  | "ORDER_TO_PAY_NUMBER"
  | "OUTBOUND_LINK_TO_RETURN"
  | "PART_NUMBER"
  | "PARTNER_CARRIER_NUMBER"
  | "PURCHASE_ORDER"
  | "REROUTE_TRACKING_NUMBER"
  | "RETURN_MATERIALS_AUTHORIZATION"
  | "RETURNED_TO_SHIPPER_TRACKING_NUMBER"
  | "SHIPPER_REFERENCE"
  | "STANDARD_MPS"
  | "TRACKING_CONTROL_NUMBER"
  | "TRACKING_NUMBER_OR_DOORTAG"
  | "TRANSBORDER_DISTRIBUTION"
  | "TRANSPORTATION_CONTROL_NUMBER"
  | "VIRTUAL_CONSOLIDATION";

type FedExTrackDelayType =
  "WEATHER" | "OPERATIONAL" | "LOCAL" | "GENERAL" | "CLEARANCE";

type FedExTrackDelayStatus = "DELAYED" | "ON_TIME" | "EARLY";

type FedExTrackServiceCommitMessageType =
  | "BROKER_DELIVERED_DESCRIPTION"
  | "CANCELLED_DESCRIPTION"
  | "DELIVERY_IN_MULTIPLE_PIECE_SHIPMENT"
  | "ESTIMATED_DELIVERY_DATE_UNAVAILABLE"
  | "EXCEPTION_IN_MULTIPLE_PIECE_SHIPMENT"
  | "FINAL_DELIVERY_ATTEMPTED"
  | "FIRST_DELIVERY_ATTEMPTED"
  | "HELD_PACKAGE_AVAILABLE_FOR_RECIPIENT_PICKUP"
  | "HELD_PACKAGE_AVAILABLE_FOR_RECIPIENT_PICKUP_WITH_ADDRESS"
  | "HELD_PACKAGE_NOT_AVAILABLE_FOR_RECIPIENT_PICKUP"
  | "SHIPMENT_LABEL_CREATED"
  | "SUBSEQUENT_DELIVERY_ATTEMPTED"
  | "USPS_DELIVERED"
  | "USPS_DELIVERING";

type FedExTrackDateAndTimeType =
  | "ACTUAL_DELIVERY"
  | "ACTUAL_PICKUP"
  | "ACTUAL_TENDER"
  | "ANTICIPATED_TENDER"
  | "APPOINTMENT_DELIVERY"
  | "ATTEMPTED_DELIVERY"
  | "COMMITMENT"
  | "ESTIMATED_ARRIVAL_AT_GATEWAY"
  | "ESTIMATED_DELIVERY"
  | "ESTIMATED_PICKUP"
  | "ESTIMATED_RETURN_TO_STATION"
  | "SHIP"
  | "SHIPMENT_DATA_RECEIVED";

type FedExTrackWindowType =
  FedExTrackDateAndTimeType | "TYPICAL" | "PROJECTED" | "PRE_DELIVERY";

type FedExTrackDeliveryOption =
  | "DISPUTE_DELIVERY"
  | "INDIRECT_SIGNATURE_RELEASE"
  | "REDIRECT_TO_HOLD_AT_LOCATION"
  | "REROUTE"
  | "RESCHEDULE"
  | "RETURN_TO_SHIPPER"
  | "SUPPLEMENT_ADDRESS";

type FedExTrackCustomDeliveryOptionType =
  | "REROUTE"
  | "APPOINTMENT"
  | "DATE_CERTAIN"
  | "EVENING"
  | "REDIRECT_TO_HOLD_AT_LOCATION"
  | "ELECTRONIC_SIGNATURE_RELEASE";

type FedExTrackDeliveryLocationType =
  | "RECEPTIONIST_OR_FRONT_DESK"
  | "SHIPPING_RECEIVING"
  | "MAILROOM"
  | "RESIDENCE"
  | "GUARD_OR_SECURITY_STATION"
  | "FEDEX_LOCATION"
  | "IN_BOND_OR_CAGE"
  | "PHARMACY"
  | "GATE_HOUSE"
  | "MANAGER_OFFICE"
  | "MAIN_OFFICE"
  | "LEASING_OFFICE"
  | "RENTAL_OFFICE"
  | "APARTMENT_OFFICE"
  | "OTHER";

type FedExTrackScanLocationType =
  | "AIRPORT"
  | "CUSTOMS_BROKER"
  | "CUSTOMER"
  | "DELIVERY_LOCATION"
  | "DESTINATION_AIRPORT"
  | "DROP_BOX"
  | "DESTINATION_FEDEX_FACILITY"
  | "ENROUTE"
  | "FEDEX_FACILITY"
  | "INTERLINE_CARRIER"
  | "FEDEX_OFFICE_LOCATION"
  | "NON_FEDEX_FACILITY"
  | "ORIGIN_AIRPORT"
  | "ORIGIN_FEDEX_FACILITY"
  | "PORT_OF_ENTRY"
  | "PICKUP_LOCATION"
  | "PLANE"
  | "SORT_FACILITY"
  | "SHIP_AND_GET_LOCATION"
  | "TURNPOINT"
  | "VEHICLE";

type FedExTrackFacilityType =
  | "FEDEX_AUTHORIZED_SHIP_CENTER"
  | "FEDEX_OFFICE"
  | "FEDEX_SELF_SERVICE_LOCATION"
  | "FEDEX_GROUND_TERMINAL"
  | "FEDEX_ONSITE"
  | "FEDEX_EXPRESS_STATION"
  | "FEDEX_FACILITY"
  | "FEDEX_FREIGHT_SERVICE_CENTER"
  | "FEDEX_HOME_DELIVERY_STATION"
  | "FEDEX_SHIP_AND_GET"
  | "FEDEX_SHIPSITE"
  | "FEDEX_SMART_POST_HUB";

export type FedExTrackAssociatedType =
  "OUTBOUND_LINK_TO_RETURN" | "STANDARD_MPS" | "GROUP_MPS";

export type FedExTrackDocumentType =
  "SIGNATURE_PROOF_OF_DELIVERY" | "BILL_OF_LADING" | "FREIGHT_BILLING_DOCUMENT";

/** Envelope for every Track endpoint; unlike FedExResponse, nothing in it is required. */
export interface FedExTrackResponse<T extends object> {
  transactionId?: string;
  customerTransactionId?: string;
  output?: T;
}

export interface FedExTrackAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

export interface FedExTrackingNumberInfo {
  trackingNumber: string;
  carrierCode?: FedexCarrierCodes;
  trackingNumberUniqueId?: string;
}

export interface FedExTrackingInfo {
  /** Format YYYY-MM-DD */
  shipDateBegin?: string;
  /** Format YYYY-MM-DD */
  shipDateEnd?: string;
  trackingNumberInfo: FedExTrackingNumberInfo;
}

export interface TrackPackagesRequest {
  includeDetailedScans: boolean;
  trackingInfo: FedExTrackingInfo[];
}

export interface FedExTrackOutput {
  completeTrackResults?: FedExTrackCompleteResult[];
  alerts?: FedExTrackAlert[];
}

export type TrackPackagesResponse = FedExTrackResponse<FedExTrackOutput>;

export interface FedExTrackCompleteResult {
  trackingNumber?: string;
  trackResults?: TrackResult[];
}

export interface FedExTrackError {
  code?: string;
  parameterList?: { value?: string; key?: string }[];
  message?: string;
}

export interface TrackResult {
  trackingNumberInfo?: Partial<FedExTrackingNumberInfo>;
  additionalTrackingInfo?: AdditionalTrackingInfo;
  distanceToDestination?: FedExTrackDistance;
  consolidationDetail?: ConsolidationDetail[];
  meterNumber?: string;
  returnDetail?: ReturnDetail;
  serviceDetail?: ServiceDetail;
  destinationLocation?: TrackLocation;
  latestStatusDetail?: LatestStatusDetail;
  serviceCommitMessage?: ServiceCommitMessage;
  informationNotes?: InformationNote[];
  error?: FedExTrackError;
  specialHandlings?: SpecialHandling[];
  availableImages?: AvailableImage[];
  deliveryDetails?: DeliveryDetails;
  scanEvents?: ScanEvent[];
  dateAndTimes?: DateAndTime[];
  packageDetails?: PackageDetails;
  goodsClassificationCode?: string;
  holdAtLocation?: TrackLocation;
  customDeliveryOptions?: CustomDeliveryOption[];
  estimatedDeliveryTimeWindow?: TimeWindow;
  pieceCounts?: PieceCount[];
  originLocation?: OriginLocation;
  recipientInformation?: TrackContactAndAddress;
  standardTransitTimeWindow?: TimeWindow;
  shipmentDetails?: ShipmentDetails;
  reasonDetail?: Reason;
  availableNotifications?: string[];
  shipperInformation?: TrackContactAndAddress;
  lastUpdatedDestinationAddress?: TrackAddress;
}

interface FedExTrackDistance {
  units?: "KM" | "MI";
  value?: number;
}

interface Reason {
  description?: string;
  type?: string;
}

interface AdditionalTrackingInfo {
  hasAssociatedShipments?: boolean;
  nickname?: string;
  packageIdentifiers?: PackageIdentifier[];
  shipmentNotes?: string;
}

interface PackageIdentifier {
  type?: PackageIdentifierType;
  /** An array on the wire, although the spec's example is a bare string. */
  value?: string[];
  trackingNumberUniqueId?: string;
}

interface ConsolidationDetail {
  timeStamp?: string;
  consolidationID?: string;
  reasonDetail?: Reason;
  packageCount?: number;
  eventType?: string;
}

interface ReturnDetail {
  authorizationName?: string;
  reasonDetail?: Reason[];
}

interface ServiceDetail {
  description?: string;
  shortDescription?: string;
  type?: string;
}

interface TrackAddress {
  addressClassification?: string;
  residential?: boolean;
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  countryName?: string;
}

interface TrackContactAndAddress {
  address?: TrackAddress;
}

interface TrackLocation {
  locationId?: string;
  locationContactAndAddress?: TrackContactAndAddress;
  locationType?: FedExTrackFacilityType;
}

interface OriginLocation {
  locationId?: string;
  locationContactAndAddress?: TrackContactAndAddress;
}

interface DelayDetail {
  type?: FedExTrackDelayType;
  /** The spec's enum is the illustrative list SNOW, TORNADO, "EARTHQUAKE etc". */
  subType?: string;
  status?: FedExTrackDelayStatus;
}

interface LatestStatusDetail {
  scanLocation?: TrackAddress;
  code?: string;
  derivedCode?: string;
  ancillaryDetails?: {
    reason?: string;
    reasonDescription?: string;
    action?: string;
    actionDescription?: string;
  }[];
  statusByLocale?: string;
  description?: string;
  delayDetail?: DelayDetail;
}

interface ServiceCommitMessage {
  message?: string;
  type?: FedExTrackServiceCommitMessageType;
}

interface InformationNote {
  code?: string;
  description?: string;
}

interface SpecialHandling {
  description?: string;
  type?: string;
  paymentType?: string;
}

interface AvailableImage {
  size?: "SMALL" | "LARGE";
  type?: "SIGNATURE_PROOF_OF_DELIVERY" | "BILL_OF_LADING";
}

interface DeliveryDetails {
  receivedByName?: string;
  destinationServiceArea?: string;
  destinationServiceAreaDescription?: string;
  locationDescription?: string;
  actualDeliveryAddress?: TrackAddress;
  deliveryToday?: boolean;
  locationType?: FedExTrackDeliveryLocationType;
  signedByName?: string;
  officeOrderDeliveryMethod?: string;
  /** A string on the wire, not a number. */
  deliveryAttempts?: string;
  deliveryOptionEligibilityDetails?: {
    option?: FedExTrackDeliveryOption;
    eligibility?: string;
  }[];
}

export interface ScanEvent {
  /** ISO 8601 with offset, e.g. 2018-02-02T12:01:00-07:00 */
  date?: string;
  /** Status text such as "Picked Up", not a code; the code is eventType. */
  derivedStatus?: string;
  scanLocation?: TrackAddress;
  locationId?: string;
  locationType?: FedExTrackScanLocationType;
  exceptionDescription?: string;
  eventDescription?: string;
  /** Scan code such as "PU"; see FedExTrackingStatusCodes for the known ones. */
  eventType?: string;
  derivedStatusCode?: string;
  exceptionCode?: string;
  delayDetail?: DelayDetail;
}

interface DateAndTime {
  dateTime?: string;
  type?: FedExTrackDateAndTimeType;
}

interface TrackWeight {
  unit?: FedExWeightUnit;
  /** A string on the wire, e.g. "22222.0". */
  value?: string;
}

interface TrackDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: FedExDimensionUnit;
}

interface PackageDetails {
  physicalPackagingType?: string;
  sequenceNumber?: string;
  undeliveredCount?: string;
  packagingDescription?: Reason;
  count?: string;
  weightAndDimensions?: {
    weight?: TrackWeight[];
    dimensions?: TrackDimensions[];
  };
  packageContent?: string[];
  contentPieceCount?: string;
  declaredValue?: { currency?: string; value?: number };
}

interface TimeWindow {
  description?: string;
  window?: { begins?: string; ends?: string };
  type?: FedExTrackWindowType;
}

interface CustomDeliveryOption {
  requestedAppointmentDetail?: { date?: string; window?: TimeWindow[] };
  description?: string;
  type?: FedExTrackCustomDeliveryOptionType;
  status?: string;
}

interface PieceCount {
  count?: string;
  description?: string;
  type?: "DESTINATION" | "ORIGIN";
}

interface ShipmentDetails {
  contents?: {
    itemNumber?: string;
    receivedQuantity?: string;
    description?: string;
    partNumber?: string;
  }[];
  beforePossessionStatus?: boolean;
  weight?: TrackWeight[];
  contentPieceCount?: string;
  splitShipments?: {
    pieceCount?: string;
    statusDescription?: string;
    timestamp?: string;
    statusCode?: string;
  }[];
}

export interface FedExTrackAssociatedRequest {
  includeDetailedScans?: boolean;
  masterTrackingNumberInfo: FedExTrackingInfo;
  associatedType: FedExTrackAssociatedType;
  pagingDetails?: {
    resultsPerPage?: number;
    /** Omit on the first request; echo the token from the previous page after. */
    pagingToken?: string;
  };
}

export type FedExTrackAssociatedResponse = FedExTrackResponse<FedExTrackOutput>;

export interface FedExTrackNotificationRequest {
  senderContactName: string;
  senderEMailAddress: string;
  trackingEventNotificationDetail: {
    trackingNotifications: {
      notificationDetail: {
        localization: { languageCode: string; localeCode?: string };
        emailDetail: { emailAddress: string; name?: string };
        /** HTML or TEXT. */
        notificationType: string;
      };
      /** BROKER, OTHER, RECIPIENT or SHIPPER. */
      role?: string;
      /** ON_DELIVERY, ON_ESTIMATED_DELIVERY, ON_EXCEPTION or ON_TENDER. */
      notificationEventTypes: string[];
      currentResultRequestedFlag?: boolean;
    }[];
    personalMessage?: string;
    /** Untyped in the spec; described as a true/false switch. */
    supportHTML?: boolean | "true" | "false";
  };
  trackingNumberInfo: FedExTrackingNumberInfo;
  shipDateBegin?: string;
  shipDateEnd?: string;
}

export interface FedExTrackNotificationOutput {
  /** Capitalised on the wire, unlike every other field here. */
  TrackingNumberInfo?: FedExTrackingNumberInfo;
  destinationAddress?: {
    classification?: string;
    residential?: boolean;
    streetLines: string[];
    city?: string;
    stateOrProvinceCode?: string;
    postalCode?: string;
    countryCode: string;
    countryName?: string;
  };
  /** One inner array of event names per recipient. */
  recipientDetails?: string[][];
  alerts?: FedExTrackAlert[];
}

export type FedExTrackNotificationResponse =
  FedExTrackResponse<FedExTrackNotificationOutput>;

export interface FedExTrackReferencesRequest {
  referencesInformation: {
    carrierCode?: string;
    type?: PackageIdentifierType;
    value: string;
    accountNumber?: string;
    /** Format YYYY-MM-DD */
    shipDateBegin: string;
    /** Format YYYY-MM-DD. Spelled shipDateEndDate in the spec schema only. */
    shipDateEndDate: string;
    destinationCountryCode?: string;
    destinationPostalCode?: string;
  };
  includeDetailedScans?: boolean;
}

export interface FedExTrackReferencesOutput extends FedExTrackOutput {
  cxsErrors?: FedExTrackError[];
  successful?: boolean;
}

export type FedExTrackReferencesResponse =
  FedExTrackResponse<FedExTrackReferencesOutput>;

export interface FedExTrackTcnRequest {
  /** Only one TCN is supported per request. */
  tcnInfo: {
    value: string;
    carrierCode?: string;
    shipDateBegin?: string;
    shipDateEnd?: string;
  };
  includeDetailedScans?: boolean;
}

export type FedExTrackTcnResponse = FedExTrackResponse<FedExTrackOutput>;

export interface FedExTrackDocumentsRequest {
  trackDocumentDetail: {
    documentType: FedExTrackDocumentType;
    /** PDF or PNG, case sensitive; PNG is not offered for BILL_OF_LADING or FREIGHT_BILLING_DOCUMENT. */
    documentFormat?: "PDF" | "PNG";
  };
  /** One to 30 entries. */
  trackDocumentSpecification: {
    trackingNumberInfo: FedExTrackingNumberInfo;
    shipDateBegin?: string;
    shipDateEnd?: string;
    accountNumber?: string;
  }[];
}

export interface FedExTrackDocumentsOutput {
  localization?: { languageCode: string; localeCode?: string };
  documentType?: string;
  documentFormat?: string;
  /** Base64-encoded document bytes inside the JSON body; decode before saving. */
  document?: string[];
  alerts?: FedExTrackAlert[];
}

export type FedExTrackDocumentsResponse =
  FedExTrackResponse<FedExTrackDocumentsOutput>;
