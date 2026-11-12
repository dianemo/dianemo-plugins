/** `standard` returns the base event; `enhanced` adds `eventPreferences`, delivery photo and `receivedBy`. */
export type UpsTrackAlertSubscriptionType = "standard" | "enhanced";

/** Delivery, In-progress, Manifest, Exception. */
export type UpsTrackAlertEventPreference = "D" | "I" | "M" | "X";

/** `en_US` is the only locale UPS currently supports. */
interface UpsTrackAlertSubscriptionBase {
  /** ISO 639 language, underscore, ISO 3166 country: `^[a-z]{2}_[A-Z]{2}$`. */
  locale: string;
  /** ISO 3166 alpha-2, upper case. */
  countryCode?: string;
  /** 1Z (18 chars) or 1R (16 or 28 chars) numbers; at most 100 per request. */
  trackingNumberList: string[];
}

export interface UpsTrackAlertStandardSubscriptionRequest extends UpsTrackAlertSubscriptionBase {}

export interface UpsTrackAlertEnhancedSubscriptionRequest extends UpsTrackAlertSubscriptionBase {
  /** 1 to 4 entries; all event types are sent when omitted. */
  eventPreferences?: UpsTrackAlertEventPreference[];
}

/** The subscription type picks the body shape, so the two travel together. */
export type UpsTrackAlertSubscriptionParams =
  | {
      type: "standard";
      request: UpsTrackAlertStandardSubscriptionRequest;
    }
  | {
      type: "enhanced";
      request: UpsTrackAlertEnhancedSubscriptionRequest;
    };

export interface UpsTrackAlertSubscriptionResponse {
  validTrackingNumbers?: string[];
  /** Numbers UPS rejected; the response is still a 200. */
  invalidTrackingNumbers?: string[];
}

export interface UpsTrackAlertError {
  code: string;
  message: string;
}

/** Error body shared by 400, 401, 404 and 500; the 400 also carries `invalidTrackingNumbers`. */
export interface UpsTrackAlertErrorResponse {
  invalidTrackingNumbers?: string[];
  response: { errors: UpsTrackAlertError[] };
}

/**
 * D delivery, I on the way, M manifest, MV manifest void, U updated delivery
 * date or time, X exception.
 */
export type UpsTrackAlertActivityStatusType =
  "D" | "I" | "M" | "MV" | "U" | "X";

/**
 * Body UPS POSTs to the subscriber's webhook for each tracking event. It is
 * not a request this plugin makes; it is exported so a webhook handler can
 * type what it receives.
 */
export interface UpsTrackAlertEvent {
  trackingNumber: string;
  /** YYYYMMDD */
  localActivityDate?: string;
  /** HHMMSS (24 hr) */
  localActivityTime?: string;
  activityLocation?: {
    city?: string;
    stateProvince?: string;
    /** Blank until the delivery event. */
    postalCode?: string;
    country?: string;
  };
  activityStatus: {
    type?: UpsTrackAlertActivityStatusType;
    code?: string;
    description?: string;
    /** Appears in the spec's examples but not in its schema. */
    descriptionCode?: string;
  };
  /** YYYYMMDD */
  scheduledDeliveryDate?: string;
  /** YYYYMMDD; blank until delivery. */
  actualDeliveryDate?: string;
  /** HHMMSS; blank until delivery. */
  actualDeliveryTime?: string;
  gmtActivityDate?: string;
  gmtActivityTime?: string;
  /** `(-/+)HH.MM`, how local time was derived. */
  gmtOffset?: string;
  deliveryStartTime?: string;
  deliveryEndTime?: string;
  deliveryTimeDescription?: string;
  /** Base64; enhanced subscriptions only, blank until the photo exists. */
  deliveryPhoto?: string;
  alternateTrackingNumber?: string;
  /** Enhanced subscriptions only. */
  receivedBy?: string;
}

/**
 * Headers on the webhook POST. `x-api-key` carries the client id of the OAuth
 * token and is required for OAuth clients.
 */
export interface UpsTrackAlertWebhookHeaders {
  "x-api-key"?: string;
  /** Always `UPSPubSubTrackingService`. */
  "User-Agent": string;
}
