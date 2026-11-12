import type { UspsErrorResponse } from "../types.js";

// Package Tracking and Notification v3.2.9 at server /tracking/v3r2.

export interface UspsTrackingV3r2RequestBody {
  /** 4 to 34 alphanumeric characters. */
  trackingNumber: string;
  /** YYYY-MM-DD; disambiguates a reused tracking number. */
  mailingDate?: string;
  destinationZIPCode?: string;
  /** Only for VeriPoint-eligible users. */
  includeVeriPoint?: boolean;
}

/** One to 35 items. */
export type UspsTrackingV3r2Request = UspsTrackingV3r2RequestBody[];

export interface UspsTrackingV3r2Target {
  trackingNumber: string;
}

export type UspsTrackingV3r2State = string;

export interface UspsTrackingV3r2SharedDetail {
  trackingNumber?: string;
  associatedTrackingNumber?: string;
  destinationCity?: string;
  destinationCountry?: string;
  /** No longer available as of June 2025, per the spec. */
  destinationState?: UspsTrackingV3r2State;
  destinationZIPCode?: string;
  kahalaIndicator?: boolean;
  mailClass?: string;
  mailClassCode?: string;
  mailingDate?: string;
  mailType?: string;
  originCity?: string;
  originCountry?: string;
  originState?: UspsTrackingV3r2State;
  originZIPCode?: string;
  services?: string[];
  serviceTypeCode?: string;
  status?: string;
  statusCategory?: string;
  statusSummary?: string;
  /** Feeds the notification and proof-of-delivery requests. */
  uniqueTrackingID?: string;
  accessControl?: "FREE" | "IP_AGREEMENT";
}

/** A date (YYYY-MM-DD), a date-time, or text such as "3 Business Days". */
export type UspsTrackingV3r2GuaranteedDelivery = string;

export interface UspsTrackingV3r2DeliveryDateExpectation {
  endOfDay?: string;
  expectedDeliveryDate?: string;
  guaranteedDeliveryDate?: UspsTrackingV3r2GuaranteedDelivery;
  guaranteedDetails?: string;
  predictedDeliveryDate?: string;
  predictedDeliverySource?: string;
  predictedDeliveryWindowStartTime?: string;
  predictedDeliveryWindowEndTime?: string;
}

export interface UspsTrackingV3r2ServicesEligibility {
  proofOfDeliveryEnabled: boolean;
  RREEnabled: boolean;
  trackingProofOfDeliveryEnabled: boolean;
}

export interface UspsTrackingV3r2Event {
  acceptanceTypeCategory?: string;
  acceptanceTypeCategoryCode?: string;
  actionCode?: string;
  CODAmountDue?: string;
  eventCity?: string;
  eventCode?: string;
  eventCountry?: string;
  eventPartner?: string;
  eventState?: string;
  /** A date or a date-time. */
  eventTimestamp?: string;
  eventType?: string;
  eventZIPCode?: string;
  firm?: string;
  GMTTimestamp?: string;
  GMTOffset?: string;
  reasonCode?: string;
  recipientName?: string;
  veriPoint?: boolean;
}

export type UspsTrackingV3r2Detail = UspsTrackingV3r2SharedDetail & {
  deliveryDateExpectation?: UspsTrackingV3r2DeliveryDateExpectation;
  servicesEligibility?: UspsTrackingV3r2ServicesEligibility;
  trackingEvents?: UspsTrackingV3r2Event[];
};

/** 200 body: one entry per requested tracking number. */
export type UspsTrackingV3r2Details = UspsTrackingV3r2Detail[];

export type UspsTrackingV3r2SuccessResponse = UspsTrackingV3r2Detail & {
  statusCode?: string;
};

export type UspsTrackingV3r2FailureResponse = UspsErrorResponse & {
  statusCode?: string;
  trackingNumber?: string;
};

/** 207 body, returned when some tracking numbers resolve and others do not. */
export type UspsTrackingV3r2MultiStatusResponse = (
  UspsTrackingV3r2FailureResponse | UspsTrackingV3r2SuccessResponse
)[];

export type UspsTrackingV3r2NotifyEventType =
  "EXPECTED_DELIVERY" | "DELIVERY_ACTIVITY" | "ALL_UPDATES";

export interface UspsTrackingV3r2Recipient {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UspsTrackingV3r2NotificationRequest {
  uniqueTrackingID: string;
  /** YYYY-MM-DD */
  mailingDate?: string;
  notifyEventTypes: UspsTrackingV3r2NotifyEventType[];
  /** One to three recipients. */
  recipients: UspsTrackingV3r2Recipient[];
}

export interface UspsTrackingV3r2NotificationAcknowledgement {
  transactionMessage?: string;
}

export interface UspsTrackingV3r2ProofOfDeliveryRecipient extends UspsTrackingV3r2Recipient {
  firstName: string;
  lastName: string;
}

export interface UspsTrackingV3r2ProofOfDeliveryRequest {
  uniqueTrackingID: string;
  /** YYYY-MM-DD */
  mailingDate?: string;
  /** Defaults to PROOF_OF_DELIVERY. */
  letterType?: "PROOF_OF_DELIVERY" | "RETURN_RECEIPT_ELECTRONIC";
  /** One to three recipients. */
  recipients: UspsTrackingV3r2ProofOfDeliveryRecipient[];
  CRID?: string;
}

export interface UspsTrackingV3r2ProofOfDeliveryAcknowledgement {
  transactionMessage?: string;
}
