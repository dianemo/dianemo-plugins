/** `YYYY-MM-DD` or an RFC 3339 date-time; today plus 0 to 7 days. */
export type UspsContainerMailingDate = string;

export type UspsContainerSortType = "TRUCK_BEDLOAD" | "PALLET" | "SACK";

export type UspsContainerMailClass =
  "PARCEL_SELECT" | "USPS_GROUND_ADVANTAGE" | "PRIORITY_MAIL";

export type UspsContainerProcessingCategory =
  "MACHINABLE" | "MIXED" | "NON_MACHINABLE" | "NONSTANDARD";

export type UspsContainerDestinationEntryFacilityType =
  | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
  | "DESTINATION_SECTIONAL_CENTER_FACILITY"
  | "DESTINATION_DELIVERY_UNIT"
  | "DESTINATION_SERVICE_HUB"
  | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER"
  | "NONE";

export interface UspsContainerImageInfo {
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
  labelType?: "6X4LABEL";
  addZPLComments?: boolean;
}

export interface UspsContainerOriginAddress {
  streetAddress: string;
  /** `null` in USPS's add-packages example response, `""` in its requests. */
  secondaryAddress?: string | null;
  city: string;
  state: string;
  ZIPCode: string;
  ZIPPlus4?: string | null;
  urbanization?: string;
}

/** A response's address: USPS adds the two `readOnly` abbreviations. */
export interface UspsContainerResponseOriginAddress extends UspsContainerOriginAddress {
  streetAddressAbbreviation?: string;
  cityAbbreviation?: string;
}

export interface UspsContainerWarning {
  warningCode?: string;
  warningDescription?: string;
}

export interface UspsContainerCreateRequest {
  MID: string;
  mailerName: string;
  mailClass: UspsContainerMailClass;
  sortType: UspsContainerSortType;
  processingCategory: UspsContainerProcessingCategory;
  destinationEntryFacilityType: UspsContainerDestinationEntryFacilityType;
  originAddress: UspsContainerOriginAddress;
  /** Required when `mailClass` is `PARCEL_SELECT`. */
  destinationZIPCode?: string;
  /** NASS code; only with `PRIORITY_MAIL` or `USPS_GROUND_ADVANTAGE`. */
  originFacility?: string;
  containerTopology?: "NESTED";
  imageInfo?: UspsContainerImageInfo;
  allowManifestedLabels?: boolean;
  trackingNumbers?: string[];
  mailingDate?: UspsContainerMailingDate;
}

/**
 * The `Container` schema minus its write-only fields. The create response is
 * multipart, so `createUspsContainerLabel` parses it into
 * `UspsContainerLabelResult` — see docs/usps-api.md#containers.
 */
export interface UspsContainerResponse {
  containerID?: string;
  MID: string;
  mailerName: string;
  mailClass: UspsContainerMailClass;
  sortType: UspsContainerSortType;
  processingCategory: UspsContainerProcessingCategory;
  destinationEntryFacilityType: UspsContainerDestinationEntryFacilityType;
  originAddress: UspsContainerResponseOriginAddress;
  destinationZIPCode?: string;
  originFacility?: string;
  containerTopology?: "NESTED";
  mailingDate?: UspsContainerMailingDate;
  warnings?: UspsContainerWarning[];
}

export interface UspsContainerLabelImage {
  bytes: Buffer;
  /** The part's own `Content-Type`, `application/pdf` in USPS's example. */
  contentType: string;
  filename?: string;
}

/** The two parts of the `POST /containers` multipart response. */
export interface UspsContainerLabelResult {
  metadata: UspsContainerResponse;
  /** Absent only when the request asked for `imageType: "NONE"`; otherwise a missing image is USP_0159. */
  labelImage?: UspsContainerLabelImage;
}

export interface UspsContainerParams {
  containerId: string;
}

export interface UspsContainerPackageParams extends UspsContainerParams {
  trackingNumber: string;
}

export interface UspsContainerAddPackagesRequest {
  allowManifestedLabels?: boolean;
  trackingNumbers?: string[];
}

export interface UspsContainerManifestRequest {
  /** At least one container ID. */
  containers: string[];
  mailingDate?: UspsContainerMailingDate;
}
