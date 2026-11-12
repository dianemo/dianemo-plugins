export type UspsScanFormImageType =
  | "PDF"
  | "TIFF"
  | "JPG"
  | "PNG"
  | "GIF"
  | "SVG"
  | "ZPL203DPI"
  | "ZPL300DPI"
  | "NONE";

export interface UspsScanFormImageInfo {
  imageType?: UspsScanFormImageType;
  /** `8.5X11LABEL` produces PS Form 5630, `4X6LABEL` produces 5630-S. */
  labelType?: "8.5X11LABEL" | "4X6LABEL";
}

export type UspsScanFormDestinationEntryFacilityType =
  | "NONE"
  | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
  | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER"
  | "DESTINATION_SECTIONAL_CENTER_FACILITY"
  | "DESTINATION_DELIVERY_UNIT"
  | "DESTINATION_SERVICE_HUB";

export interface UspsScanFormLabelShipment {
  /** 1 to 40,000 tracking numbers. */
  trackingNumbers: string[];
}

export interface UspsScanFormMidShipment {
  /** Must match the `LABEL_OWNER` MID in the payment authorization token. */
  MID: string;
}

export interface UspsScanFormManifestMidShipment {
  /** Must match the `LABEL_OWNER` manifestMID in the payment authorization token. */
  manifestMID: string;
}

export type UspsScanFormShipment =
  | UspsScanFormLabelShipment
  | UspsScanFormMidShipment
  | UspsScanFormManifestMidShipment;

/** USPS notes that first and last name, or a firm name, are always required. */
export interface UspsScanFormAddress {
  firstName?: string;
  lastName?: string;
  firm?: string;
  streetAddress: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  cityAbbreviation?: string;
  city: string;
  state: string;
  ZIPCode: string;
  ZIPPlus4?: string;
  urbanization?: string;
  ignoreBadAddress?: boolean;
}

export interface UspsScanFormRequest {
  imageInfo?: UspsScanFormImageInfo;
  /** `YYYY-MM-DD`. */
  mailingDate: string;
  overwriteMailingDate?: boolean;
  entryFacilityZIPCode: string;
  destinationEntryFacilityType: UspsScanFormDestinationEntryFacilityType;
  shipment: UspsScanFormShipment;
  fromAddress: UspsScanFormAddress;
  /** Matches `^[A-Z]{3}\d{8,12}$`; ties the form to a Carrier Pickup. */
  pickupConfirmationNumber?: string;
  /** @deprecated USPS dictates the form type from `imageInfo.labelType`. */
  form?: "5630";
  /** @deprecated Use `imageInfo.imageType`. */
  imageType?: "PDF" | "TIFF" | "JPG" | "PNG" | "GIF" | "SVG" | "NONE";
  /** @deprecated Use `imageInfo.labelType`. */
  labelType?: "8.5x11LABEL";
}

/** The `application/vnd.usps.labels+json` response: metadata at the top level. */
export interface UspsScanFormResponse {
  imageInfo?: UspsScanFormImageInfo;
  /** `YYYY-MM-DD`. */
  mailingDate?: string;
  overwriteMailingDate?: boolean;
  entryFacilityZIPCode?: string;
  destinationEntryFacilityType?: UspsScanFormDestinationEntryFacilityType;
  shipment?: UspsScanFormShipment;
  /** The Electronic File Number (EFN). */
  manifestNumber?: string;
  trackingNumbers?: string[];
  fromAddress?: UspsScanFormAddress;
  /** @deprecated */
  form?: "5630";
  /** @deprecated */
  imageType?: "PDF" | "TIFF" | "JPG" | "PNG" | "GIF" | "SVG" | "NONE";
  /** @deprecated */
  labelType?: "8.5x11LABEL" | "8.5X11LABEL";
  /** Base64; absent when `imageInfo.imageType` is `NONE`. */
  SCANFormImage?: string;
}

export interface UspsScanFormOptions {
  /**
   * A UUID kept by the caller. USPS returns the existing form for a repeated
   * key on the same customer for 30 days instead of creating another.
   */
  idempotencyKey?: string;
}
