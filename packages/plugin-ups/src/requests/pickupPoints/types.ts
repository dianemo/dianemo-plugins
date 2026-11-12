export interface UpsPickupPointsPickupPointOrderRequest {
  locationIdentifier: string;
  locationIdentifierCategoryCode: "01" | "02";
  pickupPointAddress: UpsPickupPointsPickupPointAddress;
  serviceCode: string;
  geoPoliticalUnit: string;
  pickupRequestOrderAction: string;
  // Pickup date in yyyyMMdd format.
  pickupDate: string;
  closeTime: string;
  readyTime: string;
}

export interface UpsPickupPointsPickupPointOrderResponse {
  response: UpsPickupPointsOrderResponseEnvelope;
  pickupPoint: UpsPickupPointsPickupPoint;
  prn: string;
}

export interface UpsPickupPointsTrackingRequest {
  locationIdentifier: string;
  inboundToken: string[];
  // Start date in yyyyMMdd format.
  startDate: string;
  // End date in yyyyMMdd format.
  endDate: string;
}

export interface UpsPickupPointsTrackingResponse {
  response: UpsPickupPointsOrderResponseEnvelope;
  locationIdentifier: string;
  inboundTrackingList: UpsPickupPointsInboundTrackingItem[];
}

export interface UpsPickupPointsSiteDetailsRequest {
  locationIdentifierCategoryCode: "01" | "02";
  inboundToken: string[];
}

export interface UpsPickupPointsSiteDetailsResponse {
  inquiryResponse: UpsPickupPointsInquiryResponseEnvelope;
  pickupPointList: UpsPickupPointsPickupPoint[];
}

export interface UpsPickupPointsSubscriptionSitesResponse {
  response: UpsPickupPointsOrderResponseEnvelope;
  subscriptionResponse: UpsPickupPointsSubscriptionResponse;
}

export interface UpsPickupPointsPickupPointAddress {
  pickupPointName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UpsPickupPointsOrderResponseEnvelope {
  transactionref: UpsPickupPointsTransactionRef;
}

export interface UpsPickupPointsPickupPoint {
  locationIdentifier: string;
  locationIdentifierCategoryCode: string;
  daySpecificDetails: UpsPickupPointsDaySpecificDetail[];
  pickupPointAddress: UpsPickupPointsPickupPointAddress;
  pickupPointType?: string;
  pickupPointClassificationCode?: string;
  pickupPointStatus?: string;
  gmtOffset?: number;
  daylightSavingsTimeIndicator?: string;
  timeZoneShort?: string;
  timeZoneLong?: string;
  communicationMediaTypeList?: UpsPickupPointsCommunicationMediaType[];
  subscriptionType?: string;
  numberOfTrackingIds?: number;
}

export interface UpsPickupPointsInboundTrackingItem {
  inboundToken: string;
  trackingNumbersList: string[];
}

export interface UpsPickupPointsInquiryResponseEnvelope {
  transactionref: UpsPickupPointsTransactionRef;
  offset: string;
  recordsPerPage: string;
  totalRecords: string;
}

export interface UpsPickupPointsSubscriptionResponse {
  locale: string;
  emailID?: string;
  smsPhonePrefix?: string;
  smsPhone?: string;
  subscriptionType: string;
  emailSubscribedPlacardIDs?: string[];
  smsSubscribedPlacardIDs?: string[];
  isEmailSubscribed: boolean;
  isSMSSubscribed: boolean;
}

export interface UpsPickupPointsTransactionRef {
  transactionID: string;
  client: string;
  locale: string;
  informationSourceCode: string;
  sessionID: string;
}

export interface UpsPickupPointsDaySpecificDetail {
  date?: string;
  dayOfWeek?: string;
  pickupOption?: string;
  scheduledPickupTime?: string;
  closeHour?: string;
  pickupRequestOrderType?: string;
  pickupRequestStatus?: string;
  pickupRequestOrderAction?: string;
  pickupStatusDisplayCode?: string;
  pickupStatusDisplayText?: string;
  howServicedDisplayCode?: string;
  howServicedDisplayText?: string;
  timeZoneNameShort?: string;
  timeZoneNameFull?: string;
}

export interface UpsPickupPointsCommunicationMediaType {
  mediaTypeValue: UpsPickupPointsMediaTypeValue[];
  type: string;
}

export interface UpsPickupPointsMediaTypeValue {
  value: string;
  prefix?: string;
}

export interface UpsPickupPointsSessionOptions {
  clientId: string;
  /** `xx_XX`, for example `en_US` */
  locale: string;
  sessionId?: string;
}

/** QVMC session context; the spec requires it on site details and subscriptions only. */
export interface UpsPickupPointsUserOptions {
  /** For example `session_ups_com=...` */
  cookie: string;
  /** The username from XOLT Gateway. */
  username: string;
  uuid?: string;
}

export interface UpsPickupPointsSiteDetailsDateRange {
  /** `yyyyMMdd` */
  startDate: string;
  /** `yyyyMMdd` */
  endDate: string;
}

/** Pagination and filters the spec documents for both site-details operations. */
export interface UpsPickupPointsSiteDetailsFilters {
  /** Defaults to `"0"` */
  offset?: string;
  /** Defaults to `"25"` */
  limit?: string;
  /** For example `+locationidentifier` */
  sort?: string;
  locationIdentifier?: string;
}

export type UpsPickupPointsSiteDetailsOptions = UpsPickupPointsSessionOptions &
  UpsPickupPointsUserOptions &
  UpsPickupPointsSiteDetailsDateRange &
  UpsPickupPointsSiteDetailsFilters;

export type UpsPickupPointsSiteDetailsQueryOptions =
  UpsPickupPointsSiteDetailsOptions & {
    locationIdentifierCategoryCode?: "01" | "02";
    city?: string;
    state?: string;
    /** ISO 3166-1 alpha-2 */
    country?: string;
  };
