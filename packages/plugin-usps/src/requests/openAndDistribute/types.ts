/** `YYYY-MM-DD` or an RFC 3339 date-time; today plus 0 to 7 days. */
export type UspsOpenAndDistributeMailingDate = string;

export type UspsOpenAndDistributeImbContainerType =
  | "OPEN_DISTRIBUTE_FULL_POSTAL_PAKS"
  | "OPEN_DISTRIBUTE_HALF_TRAY_BOX"
  | "OPEN_DISTRIBUTE_HALF_POSTAL_PAKS"
  | "OPEN_DISTRIBUTE_FULL_TRAY_BOX"
  | "OPEN_DISTRIBUTE_EMM_TRAY_BOX"
  | "OPEN_DISTRIBUTE_FLAT_TUB_TRAY_BOX"
  | "SACK";

/** The IMpb type additionally allows a pallet, which the IMcb type does not. */
export type UspsOpenAndDistributeImpbContainerType =
  UspsOpenAndDistributeImbContainerType | "OPEN_DISTRIBUTE_PALLET";

export interface UspsOpenAndDistributeImageInfo {
  imageType?:
    | "PDF"
    | "TIFF"
    | "JPG"
    | "PNG"
    | "GIF"
    | "SVG"
    | "ZPL203DPI"
    | "ZPL300DPI"
    | "NONE";
  labelType?: "4X6LABEL";
  imcbLabelType?: "6X4LABEL";
  receiptOption?: "SAME_PAGE" | "SEPARATE_PAGE" | "NONE";
  suppressPostage?: boolean;
  suppressMailDate?: boolean;
  addZPLComments?: boolean;
}

export interface UspsOpenAndDistributeAddress {
  streetAddress: string;
  secondaryAddress?: string;
  city: string;
  state: string;
  ZIPCode: string;
  ZIPPlus4?: string | null;
  urbanization?: string;
}

export interface UspsOpenAndDistributeLabelAddress extends UspsOpenAndDistributeAddress {
  firstName?: string;
  lastName?: string;
  firm?: string;
  phone?: string;
  email?: string;
  ignoreBadAddress?: boolean;
}

export interface UspsOpenAndDistributeCreateRequest {
  originAddress: UspsOpenAndDistributeAddress;
  senderAddress?: UspsOpenAndDistributeLabelAddress;
  /** First and last name, or a firm name, are always required. */
  returnAddress?: UspsOpenAndDistributeLabelAddress;
  destinationZIPCode: string;
  destinationEntryFacilityType:
    | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
    | "DESTINATION_SECTIONAL_CENTER_FACILITY"
    | "DESTINATION_DELIVERY_UNIT"
    | "DESTINATION_AUXILIARY_SERVICE_FACILITY"
    | "DESTINATION_AREA_DISTRIBUTION_CENTER"
    | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";
  containerMailClass?: "PRIORITY_MAIL" | "PRIORITY_MAIL_EXPRESS";
  enclosedMailClass:
    | "PARCEL_SELECT"
    | "PERIODICALS"
    | "PERIODICALS_NEWS"
    | "PACKAGE_SERVICES"
    | "USPS_MARKETING_MAIL"
    | "BOUND_PRINTED_MATTER"
    | "LIBRARY_MAIL"
    | "MEDIA_MAIL"
    | "MARKETING_MAIL_PARCELS";
  mailerName: string;
  /** `MIXED` is only available for `DESTINATION_DELIVERY_UNIT` containers. */
  processingCategory: "MACHINABLE" | "MIXED" | "NONSTANDARD";
  mailingDate: UspsOpenAndDistributeMailingDate;
  trackingNumbers?: string[];
  weightUOM?: "lb";
  /** Pounds; at most 70 unless `impbContainerType` is `OPEN_DISTRIBUTE_PALLET`. */
  weight: number;
  impbContainerType: UspsOpenAndDistributeImpbContainerType;
  /** Defaults to `impbContainerType`; not applicable to a pallet. */
  imcbContainerType?: UspsOpenAndDistributeImbContainerType;
  imageInfo?: UspsOpenAndDistributeImageInfo;
}

export interface UspsOpenAndDistributeWarning {
  warningCode?: string;
  warningDescription?: string;
}

export interface UspsOpenAndDistributeCommitment {
  name?: string;
  /** @deprecated USPS replaced it with `expectedDeliveryDate`. */
  scheduleDeliveryDate?: string;
  expectedDeliveryDate?: string;
}

export interface UspsOpenAndDistributeFacilityInfo {
  label?: string;
  supportedZips?: string;
  address?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
}

export interface UspsOpenAndDistributeFee {
  name?: string;
  SKU?: string;
  price?: number;
}

export interface UspsOpenAndDistributeExtraService {
  name?: string;
  SKU?: string;
  price?: number;
  warnings?: UspsOpenAndDistributeWarning[];
}

export interface UspsOpenAndDistributeContainerMetadata {
  /** The 99M IMcb number. */
  containerID?: string;
  /** The IMpb tracking number. */
  trackingNumber?: string;
  commitment?: UspsOpenAndDistributeCommitment;
  facilityInfo?: UspsOpenAndDistributeFacilityInfo;
  constructCode?: string;
  retailDistributionCode?: string;
  postage?: number;
  fees?: UspsOpenAndDistributeFee[];
  extraServices?: UspsOpenAndDistributeExtraService[];
}

/** Images are Base64-encoded; absent when `imageInfo.imageType` is `NONE`. */
export interface UspsOpenAndDistributeCreateResponse {
  pmodContainerMetadata?: UspsOpenAndDistributeContainerMetadata;
  labelImage?: string;
  imcbImage?: string;
  /** Only with `imageInfo.receiptOption` of `SEPARATE_PAGE` and a non-ZPL image. */
  receiptImage?: string;
  warnings?: UspsOpenAndDistributeWarning[];
}

export interface UspsOpenAndDistributeCloseRequest {
  mailingDate?: UspsOpenAndDistributeMailingDate;
  generateScanForm?: boolean;
  /** Default `PDF`; the spec lists PDF, TIFF, JPG, PNG, GIF, SVG and NONE in prose only. */
  scanFormImageType?: string;
}

export interface UspsOpenAndDistributeCloseMetadata {
  packageCount?: number;
  totalWeight?: number;
}

export interface UspsOpenAndDistributeCloseResponse {
  closePmodMetadata?: UspsOpenAndDistributeCloseMetadata;
  /** Base64; only when `generateScanForm` was requested. */
  SCANFormImage?: string;
}

/** The payer's account number; the payment token is minted from it. */
export interface UspsOpenAndDistributeOptions {
  accountNumber: string;
}

export interface UspsOpenAndDistributeCloseParams extends UspsOpenAndDistributeOptions {
  /** The IMpb tracking number for a pallet; the container ID for any other type. */
  containerId: string;
}
