import type {
  UspsSubscriptionDisputesDispute,
  UspsSubscriptionDisputesJointReview,
  UspsSubscriptionDisputesLettersAndFlats,
  UspsSubscriptionDisputesUnusedLabel,
  UspsSubscriptionNcoaAddress,
  UspsSubscriptionNcoaPayload,
  UspsSubscriptionPackageTransactionDetailsNonLabelFee,
  UspsSubscriptionPackageTransactionDetailsPackage,
  UspsSubscriptionPackageTransactionDetailsReturnLabel,
  UspsSubscriptionUnpaidPackagesDetails,
} from "./payloads.js";

export * from "./payloads.js";

// Shared shapes. The eight specs repeat these schemas with only wording and
// max-length drift (see docs/usps-api.md#subscriptions), so they are one type.

export type UspsSubscriptionStatus = "DISABLED" | "ENABLED" | "SUSPENDED";

export interface UspsSubscriptionEmailNotification {
  email?: string;
}

export type UspsSubscriptionLinks = Array<{
  rel: string[];
  title?: string;
  href: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  submissionMediaType?: string;
  targetMediaType?: string;
}>;

export interface UspsSubscriptionPagination {
  totalCount?: number;
  page?: number;
  totalPages?: number;
  limit: number;
  offset: number;
  links?: UspsSubscriptionLinks;
}

/** The fields every product's subscription has, minus its filter. */
export interface UspsSubscriptionBase {
  subscriptionId?: string;
  /** At most 200 characters. */
  listenerURL: string;
  /** Exactly 32 characters; USPS keys the notification HMAC with it. */
  secret: string;
  status?: UspsSubscriptionStatus;
  statusReason?: string;
  /** One to three recipients. */
  adminNotification: UspsSubscriptionEmailNotification[];
  creationTimestamp?: string;
  statusChangeTimestamp?: string;
  expirationTimestamp?: string;
}

/** Server-assigned fields, which a create or update body leaves out. */
export type UspsSubscriptionWritable<S> = Omit<
  S,
  | "subscriptionId"
  | "SubscriptionId"
  | "subscriptionType"
  | "statusReason"
  | "creationTimestamp"
  | "statusChangeTimestamp"
  | "expirationTimestamp"
  | "accessControl"
>;

export interface UspsSubscriptionList<S> {
  subscriptions?: S[];
  metadata?: UspsSubscriptionPagination;
}

export interface UspsSubscriptionTarget {
  subscriptionId: string;
}

/** `ifMatch` is the ETag a get, create or update returned; good for one hour. */
export interface UspsSubscriptionVersionedTarget extends UspsSubscriptionTarget {
  ifMatch: string;
}

export interface UspsSubscriptionResult<S> {
  subscription: S;
  etag: string;
}

export interface UspsSubscriptionCreated<S> extends UspsSubscriptionResult<S> {
  location: string;
}

export interface UspsSubscriptionPageParams {
  offset?: number;
  limit?: number;
}

/** Adjustments, disputes, package transaction details and unpaid packages. */
export interface UspsSubscriptionCridListParams extends UspsSubscriptionPageParams {
  CRID: string[];
}

/** Both tracking versions. Neither filter is required by the spec. */
export interface UspsSubscriptionTrackingListParams extends UspsSubscriptionPageParams {
  MID?: string[];
  trackingNumber?: string[];
}

// Webhook envelopes: USPS POSTs these to the subscriber's listenerURL. There is
// no request function for that endpoint.

export interface UspsSubscriptionNotificationEnvelope<P = string> {
  subscriptionId: string;
  subscriptionType: string;
  timestamp: string;
  /** A JSON-encoded string: `JSON.parse` it into the product's payload type. */
  payload: P;
  links?: UspsSubscriptionLinks;
}

export interface UspsSubscriptionOptionalNotification<P> {
  subscriptionId?: string;
  subscriptionType?: string;
  timestamp?: string;
  payload?: P;
  links?: UspsSubscriptionLinks;
}

// Addresses

/** The spec names this `address` in the schema and `Address` in its example. */
export interface UspsSubscriptionAddressFilter {
  subscriptionTTL?: number;
  CRID?: string;
  address?: UspsSubscriptionAddressLocation;
  Address?: UspsSubscriptionAddressLocation;
}

export interface UspsSubscriptionAddressLocation {
  streetAddress?: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  urbanization?: string;
}

/** The spec's schema spells the id `SubscriptionId`; its example uses `subscriptionId`. */
export interface UspsSubscriptionAddress extends Omit<
  UspsSubscriptionBase,
  "subscriptionId"
> {
  subscriptionId?: string;
  SubscriptionId?: string;
  filterProperties: UspsSubscriptionAddressFilter;
}

/** Declared in the spec but referenced by no operation. */
export interface UspsSubscriptionAddressConfirmation extends UspsSubscriptionBase {
  filterProperties: {
    subscriptionEligible?: "Y" | "N";
    /** 1 address not found, 2 fails DPV, 3 secondary missing, 4 ineligible, 5 other. */
    subscriptionNotEligibleCode?: "1" | "2" | "3" | "4" | "5";
  };
}

export type UspsSubscriptionAddressNotification =
  UspsSubscriptionNotificationEnvelope<string>;

// Adjustments

export type UspsSubscriptionAdjustmentsEventType =
  "ALL" | "CENSUS" | "DUPLICATES" | "UNMANIFESTED";

export interface UspsSubscriptionAdjustmentsFilter {
  CRID?: string;
  eventTypes?: UspsSubscriptionAdjustmentsEventType[];
}

export interface UspsSubscriptionAdjustments extends UspsSubscriptionBase {
  subscriptionType?: "ADJUSTMENT";
  filterProperties: UspsSubscriptionAdjustmentsFilter;
}

export type UspsSubscriptionAdjustmentsList =
  UspsSubscriptionList<UspsSubscriptionAdjustments>;

export type UspsSubscriptionAdjustmentsNotification =
  UspsSubscriptionOptionalNotification<string>;

// Disputes

export type UspsSubscriptionDisputesEventType =
  "ALL" | "DISPUTE" | "JOINT_REVIEW" | "UNUSED_LABEL";

export interface UspsSubscriptionDisputesFilter {
  CRID?: string;
  eventTypes?: UspsSubscriptionDisputesEventType[];
}

export interface UspsSubscriptionDisputes extends UspsSubscriptionBase {
  subscriptionType?: "DISPUTES";
  filterProperties: UspsSubscriptionDisputesFilter;
}

export type UspsSubscriptionDisputesList =
  UspsSubscriptionList<UspsSubscriptionDisputes>;

export type UspsSubscriptionDisputesPayload =
  | UspsSubscriptionDisputesDispute
  | UspsSubscriptionDisputesJointReview
  | UspsSubscriptionDisputesUnusedLabel
  | UspsSubscriptionDisputesLettersAndFlats;

/** The schema types `payload` as an object here, as a string in sibling specs. */
export type UspsSubscriptionDisputesNotification =
  UspsSubscriptionOptionalNotification<
    UspsSubscriptionDisputesPayload | string
  >;

// NCOA

export interface UspsSubscriptionNcoaFilter {
  subscriptionTTL?: number;
  CRID?: string;
  /** Required of full-service providers, to name who they subscribe for. */
  mailerListId?: string;
  nameAddress?: UspsSubscriptionNcoaAddress;
}

export interface UspsSubscriptionNcoa extends UspsSubscriptionBase {
  filterProperties: UspsSubscriptionNcoaFilter;
}

export interface UspsSubscriptionNcoaNotification extends UspsSubscriptionNotificationEnvelope<string> {
  payloadDetails?: UspsSubscriptionNcoaPayload;
}

// Package transaction details

export type UspsSubscriptionPackageTransactionDetailsEventType =
  "NON_LABEL_FEE" | "RETURN_LABEL";

export interface UspsSubscriptionPackageTransactionDetailsFilter {
  CRID?: string;
  /** One or two entries. */
  eventTypes?: UspsSubscriptionPackageTransactionDetailsEventType[];
}

export interface UspsSubscriptionPackageTransactionDetails extends UspsSubscriptionBase {
  subscriptionType?: "PACKAGE_TRANSACTION_DETAILS";
  filterProperties: UspsSubscriptionPackageTransactionDetailsFilter;
}

export type UspsSubscriptionPackageTransactionDetailsList =
  UspsSubscriptionList<UspsSubscriptionPackageTransactionDetails>;

export type UspsSubscriptionPackageTransactionDetailsPayload =
  | UspsSubscriptionPackageTransactionDetailsPackage
  | UspsSubscriptionPackageTransactionDetailsNonLabelFee
  | UspsSubscriptionPackageTransactionDetailsReturnLabel;

export type UspsSubscriptionPackageTransactionDetailsNotification =
  UspsSubscriptionOptionalNotification<string>;

// Tracking v3 (legacy)

export type UspsSubscriptionTrackingEventType =
  | "ALL"
  | "PACKAGE_DELIVERED"
  | "AVAILABLE_FOR_PICKUP"
  | "DELIVERY_EXCEPTION_UPDATES"
  | "PACKAGE_IN_TRANSIT_UPDATES"
  | "PACKAGE_DELAYED"
  | "DEFAULT";

export type UspsSubscriptionTrackingFilter =
  | { MID: string; trackingEventTypes?: UspsSubscriptionTrackingEventType[] }
  | {
      trackingNumber: string;
      trackingEventTypes?: UspsSubscriptionTrackingEventType[];
    };

export interface UspsSubscriptionTracking extends UspsSubscriptionBase {
  accessControl?: "FREE" | "IP_AGREEMENT";
  filterProperties: UspsSubscriptionTrackingFilter;
}

export type UspsSubscriptionTrackingList =
  UspsSubscriptionList<UspsSubscriptionTracking>;

/** The spec gives only an example of the payload (a `TrackInfo` object), no schema. */
export type UspsSubscriptionTrackingNotification =
  UspsSubscriptionNotificationEnvelope<string>;

// Tracking v3r2

export type UspsSubscriptionTrackingV3r2EventType =
  | "ALL_UPDATES"
  | "DELIVERY_ACTIVITY"
  | "PACKAGE_DELAYED"
  | "SCAN_EVENT_EXTRACT";

export type UspsSubscriptionTrackingV3r2Filter =
  | {
      MID: string;
      trackingEventTypes?: UspsSubscriptionTrackingV3r2EventType[];
      includeVeriPoint?: boolean;
    }
  | {
      trackingNumber: string;
      /** The tracking-number filter does not accept SCAN_EVENT_EXTRACT. */
      trackingEventTypes?: Array<
        Exclude<UspsSubscriptionTrackingV3r2EventType, "SCAN_EVENT_EXTRACT">
      >;
      includeVeriPoint?: boolean;
    };

export interface UspsSubscriptionTrackingV3r2 extends UspsSubscriptionBase {
  accessControl?: "FREE" | "IP_AGREEMENT";
  filterProperties: UspsSubscriptionTrackingV3r2Filter;
}

export type UspsSubscriptionTrackingV3r2List =
  UspsSubscriptionList<UspsSubscriptionTrackingV3r2>;

export type UspsSubscriptionTrackingV3r2Notification =
  UspsSubscriptionNotificationEnvelope<string>;

/** Same envelope; the payload is a ScanEventExtractPayload for SCAN_EVENT_EXTRACT subscriptions. */
export type UspsSubscriptionTrackingV3r2ScanEventExtractNotification =
  UspsSubscriptionNotificationEnvelope<string>;

// Unpaid packages

export interface UspsSubscriptionUnpaidPackagesFilter {
  CRID: string;
}

export interface UspsSubscriptionUnpaidPackages extends UspsSubscriptionBase {
  subscriptionType?: "UNPAID_PACKAGES";
  filterProperties: UspsSubscriptionUnpaidPackagesFilter;
}

/** The JSON schema is a bare array; the XML one is the usual object. */
export type UspsSubscriptionUnpaidPackagesList =
  | UspsSubscriptionUnpaidPackages[]
  | UspsSubscriptionList<UspsSubscriptionUnpaidPackages>;

/** As in disputes, the schema types `payload` as an object. */
export type UspsSubscriptionUnpaidPackagesNotification =
  UspsSubscriptionOptionalNotification<
    UspsSubscriptionUnpaidPackagesDetails | string
  >;
