// v3: Package Tracking and Notification v3.2.9, server /tracking/v3.
// v3r2 (types prefixed UspsTrackingV3r2) lives in ./typesV3r2.ts.

export type UspsTrackingExpand = "SUMMARY" | "DETAIL";

export interface UspsTrackingParams<E extends UspsTrackingExpand = "DETAIL"> {
  /** Defaults to DETAIL here; USPS's own default is SUMMARY. */
  expand?: E;
  destinationZIPCode?: string;
  /** YYYY-MM-DD */
  mailingDate?: string;
  /** Sent as X-Forwarded-For. */
  forwardedFor?: string;
}

export interface UspsTrackingTarget {
  trackingNumber: string;
  /** Sent as X-Forwarded-For. */
  forwardedFor?: string;
}

export type UspsTrackingAccessControl = "FREE" | "IP_AGREEMENT";

export interface UspsTrackingSummary {
  /**
   * USPS's own README example shows the summary as a legacy Web Tools
   * envelope, `{ TrackResults: { RequestSeqNumber, TrackInfo: { "@ID",
   * TrackSummary } } }`, with none of the fields below. Which of the two a
   * live account gets is not settled — see docs/usps-api.md#tracking.
   */
  TrackResults?: {
    RequestSeqNumber?: string | null;
    TrackInfo?: { "@ID"?: string; TrackSummary?: string };
  };
  trackingNumber?: string;
  expectedDeliveryDate?: string;
  expectedDeliveryTime?: string;
  guaranteedDeliveryDate?: string;
  eventSummaries?: string[];
  accessControl?: UspsTrackingAccessControl;
}

export type UspsTrackingMailClass =
  | "BOUND_PRINTED_MATTER"
  | "LIBRARY_MAIL"
  | "USPS_RETAIL_GROUND"
  | "MEDIA_MAIL"
  | "CRITICAL_MAIL"
  | "PRIORITY_MAIL_INTERNATIONAL_PARCELS"
  | "DOMESTIC_MATTER_FOR_THE_BLIND"
  | "PRIORITY_MAIL_EXPRESS"
  | "FIRST-CLASS_MAIL"
  | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL"
  | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "PRIORITY_MAIL_GUARANTEED"
  | "GLOBAL_EXPRESS_GUARANTEED"
  | "PRIORITY_MAIL"
  | "PARCEL_SELECT"
  | "USPS_MARKETING_MAIL"
  | "PRIORITY_MAIL_SAME_DAY";

/**
 * The 18 values the spec enumerates, plus any other text: USPS's published
 * example returns display text (`"Priority Mail<SUP>&reg;</SUP>"`), not a
 * constant. Autocomplete still offers the enum.
 */
export type UspsTrackingMailClassValue =
  UspsTrackingMailClass | (string & Record<never, never>);

export interface UspsTrackingAvailableNotificationOptions {
  futureDelivery?: boolean;
  alertDelivery?: boolean;
  todayDelivery?: boolean;
  UP?: boolean;
  DND?: boolean;
}

export interface UspsTrackingEnabledNotificationRequests {
  SMS?: UspsTrackingAvailableNotificationOptions;
  EMail?: UspsTrackingAvailableNotificationOptions & {
    firstDisplayable?: boolean;
    otherActivity?: boolean;
  };
}

export interface UspsTrackingDetails {
  trackingNumber?: string;
  additionalInfo?: string;
  ADPScripting?: string;
  archiveRestoreInfo?: string;
  associatedLabel?: string;
  carrierRelease?: boolean;
  mailClass?: UspsTrackingMailClassValue;
  destinationCity?: string;
  destinationCountryCode?: string;
  destinationState?: string;
  destinationZIP?: string;
  editedLabelId?: string;
  emailEnabled?: string;
  endOfDay?: string;
  eSOFEligible?: boolean;
  expectedDeliveryTimeStamp?: string;
  expectedDeliveryType?: string;
  guaranteedDeliveryTimeStamp?: string;
  guaranteedDetails?: string;
  itemShape?: "LETTER" | "FLAT" | "PARCEL" | "UNKNOWN";
  kahalaIndicator?: string;
  /** The example returns `"DM"`, outside the spec's four-value enum. */
  mailType?:
    | "INTERNATIONAL_INBOUND"
    | "INTERNATIONAL_OUTBOUND"
    | "DOMESTIC_MAIL"
    | "UNKNOWN"
    | (string & Record<never, never>);
  approximateIntakeDate?: string;
  mailPieceIntakeDate?: string;
  uniqueTrackingId?: string;
  uniqueMailPieceId?: string;
  onTime?: boolean;
  originCity?: string;
  originCountry?: string;
  originState?: string;
  originZIP?: string;
  proofOfDeliveryEnabled?: string;
  predictedDeliveryTimeStamp?: string;
  predictedDeliveryDate?: string;
  predictedDeliveryWindowStartTime?: string;
  predictedDeliveryWindowEndTime?: string;
  relatedReturnReceiptID?: string;
  redeliveryEnabled?: boolean;
  enabledNotificationRequests?: UspsTrackingEnabledNotificationRequests;
  restoreEnabled?: string;
  returnDateNotice?: string;
  RRAMenabled?: string;
  /** The README example spells it with a capital E. */
  RRAMEnabled?: string;
  RREEnabled?: string;
  /** An array in the spec; the README's v3 example returns one string. */
  services?: string | string[];
  serviceTypeCode?: string;
  status?: string;
  statusCategory?: string;
  statusSummary?: string;
  tableCode?: string;
  trackingProofOfDeliveryEnabled?: boolean;
  valueofArticle?: string;
  accessControl?: UspsTrackingAccessControl;
  extendRetentionPurchasedCode?: string;
  /** The spec declares the items as objects with no properties. */
  extendRetentionExtraServiceCodeOptions?: Record<string, unknown>[];
  trackingEvents?: UspsTrackingEvent[];
}

export interface UspsTrackingEvent {
  eventType?: string;
  eventTimestamp?: string;
  GMTTimestamp?: string;
  GMTOffset?: string;
  /** The example sends `null` for the country, firm, name and extra fields. */
  eventCountry?: string | null;
  eventCity?: string;
  eventState?: string;
  eventZIP?: string;
  firm?: string | null;
  name?: string | null;
  /** Present in the README example as `null`; not in the spec. */
  additionalProp?: unknown;
  /** A string in the spec, not a boolean; the example sends `"false"`. */
  authorizedAgent?: string;
  eventCode?: string;
  veriPoint?: boolean;
  actionCode?: string;
  reasonCode?: string;
}

export type UspsTrackingMailingEventType =
  | "EMAIL_ALERT"
  | "EMAIL_FUTURE_DELIVERY"
  | "EMAIL_DELIVERY/NON_DELIVERY_ACTIVITY"
  | "EMAIL_TODAY_DELIVERY"
  | "EMAIL_AVAILABLE_FOR_PICKUP"
  | "PACKAGE_ADDRESSED_TO_ME/MYUSPS_ONLY"
  | "OTHER_ACTIVITY";

export interface UspsTrackingEmailNotification {
  email?: string;
}

export interface UspsTrackingSMSNotification {
  cellNumber?: string;
}

export type UspsTrackingNotificationMethod =
  UspsTrackingEmailNotification | UspsTrackingSMSNotification;

export interface UspsTrackingNotificationRequest {
  /** Deprecated in the spec; use uniqueMailPieceId. */
  uniqueTrackingId?: string;
  uniqueMailPieceId?: string;
  /** Deprecated in the spec; use mailPieceIntakeDate. */
  approximateIntakeDate?: string;
  mailPieceIntakeDate?: string;
  notifyEventTypes?: UspsTrackingMailingEventType[];
  firstName?: string;
  lastName?: string;
  /** One to three recipients. */
  notifications: UspsTrackingNotificationMethod[];
}

export interface UspsTrackingNotificationAcknowledgement {
  resultText?: string;
  returnCode?: string;
}

export interface UspsTrackingProofOfDeliveryRequest {
  /** Deprecated in the spec; use uniqueMailPieceID (note the capital ID). */
  uniqueTrackingID?: string;
  uniqueMailPieceID: string;
  approximateIntakeDate?: string;
  /**
   * Accepts `2024-04-04 14:03:12:000`, `2024-04-04`, `04042024` or
   * `04/04/2024`.
   */
  mailPieceIntakeDate: string;
  tableCode: string;
  requestType: "email";
  firstName: string;
  lastName: string;
  /** One to three addresses. */
  email: string[];
  faxNumber?: string;
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  CRID?: string;
}

export interface UspsTrackingProofOfDeliveryResponse {
  resultText?: string;
  returnCode?: string;
}

export type UspsTrackingResult<E extends UspsTrackingExpand> =
  E extends "SUMMARY" ? UspsTrackingSummary : UspsTrackingDetails;

export * from "./typesV3r2.js";
