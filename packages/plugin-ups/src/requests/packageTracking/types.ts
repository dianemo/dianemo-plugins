const _UPSTrackingActivityStatusTypeEnum = {
  D: "Delivered",
  I: "In Transit",
  M: "Billing Information Received",
  MV: "Billing Information Voided",
  P: "Pickup",
  X: "Exception",
  RS: "Returned to Shipper",
  DO: "Delivered Origin CFS (Freight Only)",
  DD: "Delivered Destination CFS (Freight Only)",
  W: "Warehousing (Freight Only)",
  NA: "Not Available",
  O: "Out for Delivery",
} as const;

const _UPSTrackingActivityStatusCodeEnum = {
  MP: "Shipper created a label, UPS has not received the package yet.",
  OR: "Origin Scan",
  DS: "Processing at UPS Facility",
  YP: "Processing at UPS Facility",
  YI: "Out For Delivery to UPS Access Point",
  DP: "Departed from Facility",
  AR: "Arrived at Facility",
  OF: "Loaded on Delivery Vehicle",
  OT: "Out For Delivery Today",
  KB: "Signature obtained",
  FS: "DELIVERED",
  IP: "Import Scan",
  "2W": "DELIVERED",
  "8Q": "DELIVERED",
  "9E": "DELIVERED",
  VP: "Voided Information Received ",
  ZA: "The package will be delivered to the recipient's preferred UPS Access Point™ location.",
  ZC: "The package will be delivered to the recipient's preferred UPS Access Point™ location.",
  ZP: "UPS Access Point™ possession ",
} as const;

/** Known values are listed for autocomplete; UPS may return others. */
type OpenString<T extends string> = T | (string & {});

export type UpsTrackingStatusType = OpenString<
  keyof typeof _UPSTrackingActivityStatusTypeEnum
>;

export type UpsTrackingStatusCode = OpenString<
  keyof typeof _UPSTrackingActivityStatusCodeEnum
>;

/**
 * Query parameters of `GET /track/v1/details/{inquiryNumber}` other than the
 * inquiry number itself. UPS declares them as strings; booleans here are sent
 * as `"true"` / `"false"`.
 */
export interface UpsTrackingDetailsOptions {
  /** Defaults to `en_US`. */
  locale?: string;
  /** Includes the delivery signature image (base64) in the response. */
  returnSignature?: boolean;
  /** Includes the milestone list on each package. */
  returnMilestones?: boolean;
  /** Includes proof of delivery content; only for users UPS permits. */
  returnPOD?: boolean;
}

/** `refNumType` of the reference-number lookup. */
export type UpsTrackingReferenceNumberType = "SmallPackage" | "fgv";

export interface UpsTrackingReferenceOptions {
  locale?: string;
  /** YYYYMMDD; UPS defaults to 14 days before today. */
  fromPickUpDate?: string;
  /** YYYYMMDD; UPS defaults to today. */
  toPickUpDate?: string;
  destCountry?: string;
  destZip?: string;
  /** Shipper (account) number the reference number belongs to. */
  shipperNum?: string;
  refNumType?: UpsTrackingReferenceNumberType;
}

export interface UpsTrackingReferenceRequest extends UpsTrackingReferenceOptions {
  referenceNumber: string;
}

export interface UpsTrackingShipmentOptions {
  locale?: string;
  /** 0-based index of the first package to return; UPS defaults to 0. */
  offset?: number;
  /** Maximum packages to return; UPS defaults to 50. */
  count?: number;
}

export interface UpsTrackingShipmentRequest extends UpsTrackingShipmentOptions {
  inquiryNumber: string;
}

export interface UpsTrackingError {
  code?: string;
  message?: string;
}

/** Body of the 400/403/404/500/503 responses. */
export interface UpsTrackingErrorResponse {
  response?: { errors?: UpsTrackingError[] };
}

/**
 * Shared by the details, reference and shipment lookups. Nothing in the
 * schema is `required`, so every field is optional.
 */
export interface TrackPackageResponse {
  trackResponse?: {
    shipment?: UpsShipment[];
  };
}

export interface UpsShipment {
  inquiryNumber?: string;
  package?: UpsTrackingPackage[];
  /** MYC_HOME, MYC_BUS_OUTBOUND, MYC_BUS_INBOUND or SHIPPER. */
  userRelation?: string[];
  warnings?: UpsTrackingWarning[];
}

export interface UpsTrackingStatus {
  code?: string;
  /** Translated to the request locale, so not a closed set. */
  description?: string;
  simplifiedTextDescription?: string;
  statusCode?: UpsTrackingStatusCode;
  type?: UpsTrackingStatusType;
}

export interface UpsTrackingAddress {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  stateProvince?: string;
}

export interface UpsTrackingWarning {
  code?: string;
  message?: string;
}

export interface UpsTrackingPackage {
  accessPointInformation?: { pickupByDate?: string };
  activity?: Activity[];
  additionalAttributes?: string[];
  additionalServices?: string[];
  /** v1.0.0 typed this as `alternativeTrackingNumber`, which UPS never sent. */
  alternateTrackingNumber?: UpsTrackingAlternateNumber[];
  currentStatus?: UpsTrackingStatus;
  deliveryDate?: UpsTrackingDeliveryDate[];
  deliveryInformation?: UpsTrackingDeliveryInformation;
  deliveryTime?: UpsTrackingDeliveryTime;
  dimension?: UpsTrackingDimension;
  isSmartPackage?: boolean;
  milestones?: UpsTrackingMilestone[];
  packageAddress?: UpsTrackingPackageAddress[];
  /** May exceed the packages returned; page with `offset`/`count` on the shipment lookup. */
  packageCount?: number;
  paymentInformation?: UpsTrackingPaymentInformation[];
  referenceNumber?: UpsTrackingReferenceNumber[];
  service?: UpsTrackingService;
  statusCode?: string;
  statusDescription?: string;
  suppressionIndicators?: string[];
  trackingNumber?: string;
  /** `O` open, `C` closed. */
  ucixStatus?: string;
  weight?: UpsTrackingWeight;
}

export interface UpsTrackingAlternateNumber {
  number?: string;
  type?: string;
}

export interface UpsTrackingDeliveryDate {
  /** YYYYMMDD */
  date?: string;
  /**
   * RDD: Rescheduled Delivery Date
   * SDD: Scheduled Delivery Date
   * DEL: Delivery Date
   */
  type?: "RDD" | "SDD" | "DEL";
}

export interface UpsTrackingDeliveryInformation {
  deliveryPhoto?: UpsTrackingDeliveryPhoto;
  location?: string;
  receivedBy?: string;
  signature?: { image?: string };
  pod?: { content?: string };
}

export interface UpsTrackingDeliveryPhoto {
  isNonPostalCodeCountry?: boolean;
  photo?: string;
  /** `Y` captured, `N` not captured. */
  photoCaptureInd?: string;
  /** `V` viewable, `N` not viewable, `U` not stored. */
  photoDispositionCode?: string;
}

export interface UpsTrackingDeliveryTime {
  /** HHMMSS; only for types EDW, CDW, IDW, CMT and DEL. */
  endTime?: string;
  /** HHMMSS; only for types EDW, CDW and IDW. */
  startTime?: string;
  /** EOD, CMT, EDW, CDW, IDW or DEL. */
  type?: string;
}

export interface UpsTrackingDimension {
  height?: string;
  length?: string;
  unitOfDimension?: string;
  width?: string;
}

export interface UpsTrackingMilestone {
  category?: string;
  code?: string;
  current?: boolean;
  description?: string;
  /** 0-based index into `activity`; only on completed milestones. */
  linkedActivity?: string;
  state?: string;
  subMilestone?: { category?: string };
}

export interface UpsTrackingPackageAddress {
  address?: UpsTrackingAddress;
  attentionName?: string;
  name?: string;
  type?: string;
}

export interface UpsTrackingPaymentInformation {
  amount?: string;
  currency?: string;
  id?: string;
  paid?: boolean;
  paymentMethod?: string;
  type?: string;
}

export interface UpsTrackingReferenceNumber {
  number?: string;
  type?: string;
}

export interface UpsTrackingService {
  code?: string;
  description?: string;
  levelCode?: string;
}

export interface UpsTrackingWeight {
  /** `LBS` or `KGS`. */
  unitOfMeasurement?: string;
  weight?: string;
}

export interface Activity {
  /** YYYYMMDD, in the local time of the place the activity occurred. */
  date?: string;
  gmtDate?: string;
  gmtOffset?: string;
  gmtTime?: string;
  location?: {
    address?: UpsTrackingAddress;
    /** Site Location Indicator Code. */
    slic?: string;
  };
  status?: UpsTrackingStatus;
  /** HHMMSS (24 hr), in the local time of the place the activity occurred. */
  time?: string;
  /** `true` for a logical event, `false` for a physical scan. */
  logicalScan?: boolean;
}
