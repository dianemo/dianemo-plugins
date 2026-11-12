export interface UspsLogisticsShipmentTrackingEvent {
  externalLoadNumber: string;
  appointmentID: string;
  appointmentDate: string;
  trailerID: string;
  schedulerCRID: string;
  /** Required unless `currentEvent.eventType` is FACILITY_ARRIVE or FACILITY_DEPART. */
  ETA?: string | null;
  /** Same condition as `ETA`; describes the current destination, not the appointment. */
  ETAStatus?:
    | "ON_TIME"
    | "EARLY"
    | "DELAYED"
    | "LATE"
    | "CANCELLED"
    | "REDIRECTED"
    | "RESCHEDULED"
    | null;
  location: UspsLogisticsShipmentTrackingLocation;
  currentLocation: UspsLogisticsShipmentTrackingCurrentLocation;
  currentEvent: UspsLogisticsShipmentTrackingCurrentEvent;
  positionalInfo: UspsLogisticsShipmentTrackingPositionalInfo;
  resourceInfo?: UspsLogisticsShipmentTrackingResourceInfo;
}

export interface UspsLogisticsShipmentTrackingLocation {
  locationType: "USPS" | "CUSTOMER" | "NON_USPS";
  /** Required when `locationType` is USPS. */
  dropSiteKey?: string;
  /** Required when `locationType` is CUSTOMER or NON_USPS. */
  ZIPCode5?: string;
  stopType: "PICKUP" | "DELIVERY";
  stopSequence: number;
}

export interface UspsLogisticsShipmentTrackingCurrentLocation {
  latitude: number;
  longitude: number;
  currentDateTime: string;
}

export interface UspsLogisticsShipmentTrackingCurrentEvent {
  eventType: "EN_ROUTE" | "PRE_ARRIVAL" | "FACILITY_ARRIVE" | "FACILITY_DEPART";
}

export interface UspsLogisticsShipmentTrackingPositionalInfo {
  /** Milliseconds. */
  pingInterval: number;
  /** Kilometres. */
  distance: number;
  /** Metres per second. */
  speed: number | null;
  /** Metres. */
  accuracy: number | null;
}

export interface UspsLogisticsShipmentTrackingResourceInfo {
  submissionType?: "MANUAL" | "AUTOMATIC";
  submissionBy?: "CUSTOMER" | "DRIVER";
  comments?: string;
  rating?: number;
  locationPermission?: "GRANTED" | "DENIED" | "NOT_REQUIRED";
  notificationPermission?: "GRANTED" | "DENIED" | "NOT_REQUIRED";
}
