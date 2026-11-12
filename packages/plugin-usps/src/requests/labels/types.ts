// Source: USPS developer portal OpenAPI spec, Labels v18.0 (labels_18_0.yaml),
// downloaded 2026-11-12. Wire types follow the spec's `required` arrays: the
// spec lists none for any response, so every response field is optional.

/** Fields every label operation needs from the caller. */
export interface UspsLabelAccountOptions {
  /**
   * The payer's account number. Never sent as a header: the labels sub-client
   * interceptor uses it to mint the X-Payment-Authorization-Token that USPS
   * requires on every Labels operation.
   */
  accountNumber: string;
}

export interface UspsLabelCreateOptions extends UspsLabelAccountOptions {
  /**
   * Pass a stable value derived from your own order or shipment id so the same
   * key later cancels or reprints the label. USPS documents the label endpoint
   * itself as not idempotent: resubmitting a used UUID buys a new label.
   * Defaults to a fresh UUID.
   */
  idempotencyKey?: string;
}

export interface UspsLabelIdempotencyOptions extends UspsLabelAccountOptions {
  /** The X-Idempotency-Key the label was created with. */
  idempotencyKey: string;
}

export interface UspsLabelTrackingOptions extends UspsLabelAccountOptions {
  trackingNumber: string;
}

export interface UspsLabelImbOptions extends UspsLabelAccountOptions {
  /** Intelligent Mail Barcode, 20 to 31 characters. */
  imb: string;
}

export interface UspsLabelBrandingImageOptions extends UspsLabelAccountOptions {
  imageUUID: string;
}

export type UspsMailClass =
  | "USPS_GROUND_ADVANTAGE"
  | "PRIORITY_MAIL"
  | "PRIORITY_MAIL_EXPRESS"
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER"
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_REGIONAL"
  | "USPS_CONNECT_MAIL"
  | "MARKETING_MAIL_PARCELS";

export type UspsLabelReturnMailClass =
  | "FIRST-CLASS_PACKAGE_RETURN_SERVICE"
  | "GROUND_RETURN_SERVICE"
  | "PRIORITY_MAIL_EXPRESS_RETURN_SERVICE"
  | "PRIORITY_MAIL_RETURN_SERVICE"
  | "USPS_GROUND_ADVANTAGE_RETURN_SERVICE";

export type UspsProcessingCategory =
  | "LETTERS"
  | "FLATS"
  | "MACHINABLE"
  | "IRREGULAR"
  | "NON_MACHINABLE"
  | "NONSTANDARD";

export type UspsLabelRateIndicator =
  | "3D"
  | "3N"
  | "3R"
  | "5D"
  | "BA"
  | "BB"
  | "CP"
  | "CM"
  | "DC"
  | "DE"
  | "DF"
  | "DN"
  | "DR"
  | "E4"
  | "E6"
  | "FA"
  | "FB"
  | "FE"
  | "FP"
  | "FS"
  | "LC"
  | "LF"
  | "LL"
  | "LO"
  | "LS"
  | "NN"
  | "NP"
  | "OS"
  | "PN"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "P9"
  | "Q6"
  | "Q7"
  | "Q8"
  | "Q9"
  | "Q0"
  | "PA"
  | "PL"
  | "PM"
  | "PR"
  | "SN"
  | "SP"
  | "SR";

/** The subset of rate indicators the return-label operation accepts. */
export type UspsLabelReturnRateIndicator =
  | "CP"
  | "DN"
  | "DR"
  | "E4"
  | "E6"
  | "FA"
  | "FB"
  | "FE"
  | "FP"
  | "FS"
  | "OS"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "P9"
  | "PA"
  | "PL"
  | "PM"
  | "Q6"
  | "Q7"
  | "Q8"
  | "Q9"
  | "Q0"
  | "SP";

export type UspsLabelPackagingType =
  | "VARIABLE"
  | "5-DIGIT_PRESORT"
  | "BASIC_PRESORT"
  | "FLAT_RATE_ENVELOPE"
  | "LEGAL_FLAT_RATE_ENVELOPE"
  | "PADDED_FLAT_RATE_ENVELOPE"
  | "SM_FLAT_RATE_BOX"
  | "MD_FLAT_RATE_BOX"
  | "LG_FLAT_RATE_BOX"
  | "CUBIC_PARCELS"
  | "CUBIC_SOFT_PACK"
  | "CONNECT_LOCAL_FLAT_RATE_BOX"
  | "CONNECT_LOCAL_SMALL_FLAT_RATE_BAG"
  | "CONNECT_LOCAL_LARGE_FLAT_RATE_BAG";

/** Extra-service codes the Labels API accepts on a package. */
export type UspsLabelExtraServiceCode =
  | 365
  | 415
  | 480
  | 481
  | 482
  | 483
  | 484
  | 485
  | 486
  | 487
  | 488
  | 489
  | 810
  | 811
  | 812
  | 813
  | 814
  | 815
  | 816
  | 817
  | 818
  | 819
  | 820
  | 821
  | 822
  | 823
  | 824
  | 825
  | 826
  | 827
  | 828
  | 829
  | 830
  | 831
  | 832
  | 857
  | 910
  | 911
  | 912
  | 913
  | 920
  | 921
  | 922
  | 923
  | 924
  | 925
  | 930
  | 931
  | 934
  | 955
  | 957
  | 981
  | 986
  | 991;

export type UspsLabelIndiciaImbExtraServiceCode =
  910 | 911 | 930 | 934 | 940 | 941 | 955 | 957;

export type UspsLabelContentType =
  | "HAZMAT"
  | "CREMATED_REMAINS"
  | "BEES"
  | "DAY_OLD_POULTRY"
  | "ADULT_BIRDS"
  | "OTHER_LIVES"
  | "PERISHABLE"
  | "PHARMACEUTICALS"
  | "MEDICAL_SUPPLIES"
  | "FRUITS"
  | "VEGETABLES"
  | "LIVE_PLANTS";

export type UspsLabelContainerSortType =
  | "TRUCK_BEDLOAD"
  | "OPEN_DISTRIBUTION_FULL_POSTAL_PAKS"
  | "OPEN_DISTRIBUTE_EMM_TRAY_BOX"
  | "OPEN_DISTRIBUTE_FULL_TRAY_BOX"
  | "OPEN_DISTRIBUTE_HALF_TRAY_BOX"
  | "OPEN_DISTRIBUTE_HALF_POSTAL_PAKS"
  | "OPEN_DISTRIBUTE_PALLET"
  | "OPEN_DISTRIBUTE_FLAT_TUB_TRAY_BOX"
  | "PALLET"
  | "RECEPTACLE"
  | "SACK";

export type UspsLabelAncillaryEndorsement =
  | "CHANGE_SERVICE_REQUESTED"
  | "ADDRESS_SERVICE_REQUESTED"
  | "ELECTRONIC_SERVICE_REQUESTED"
  | "RETURN_SERVICE_REQUESTED"
  | "TEMP_RETURN_SERVICE_REQUESTED"
  | "FORWARDING_SERVICE_REQUESTED";

export interface UspsLabelContainer {
  /** At most 34 characters. */
  containerID: string;
  sortType: UspsLabelContainerSortType;
}

/** Street address fields shared by every Labels address object. */
export interface UspsLabelDomesticAddress {
  /** 1 to 50 characters. */
  streetAddress?: string;
  secondaryAddress?: string;
  /** 1 to 28 characters. */
  city?: string;
  /** Two-letter USPS state, territory or military code. */
  state?: string;
  /** Five digits. */
  ZIPCode?: string;
  /** Four digits. */
  ZIPPlus4?: string | null;
  urbanization?: string;
  /** Set by USPS; ignored on a request. */
  streetAddressAbbreviation?: string;
  /** Set by USPS; ignored on a request. */
  cityAbbreviation?: string;
}

export interface UspsLabelAddressee {
  firstName?: string;
  lastName?: string;
  firm?: string;
}

/** `fromAddress`, `returnAddress`, and both addresses of a return label. */
export interface UspsLabelPostalAddress
  extends UspsLabelDomesticAddress, UspsLabelAddressee {
  streetAddress: string;
  city: string;
  state: string;
  ZIPCode: string;
  phone?: string;
  email?: string;
  /** Bypasses street-address validation failures. */
  ignoreBadAddress?: boolean;
}

/**
 * A parcel-locker destination needs only `facilityId`, an email and a name, so
 * the street fields are optional here, unlike every other address.
 */
export interface UspsLabelRecipientAddress
  extends UspsLabelDomesticAddress, UspsLabelAddressee {
  phone?: string;
  email?: string;
  ignoreBadAddress?: boolean;
  parcelLockerDelivery?: boolean;
  /** Also requires `facilityId`, `email` and `phone` here, and name, email and phone on `fromAddress`. */
  holdForPickup?: boolean;
  /** At most 7 characters. */
  facilityId?: string;
}

export interface UspsLabelSenderAddress extends UspsLabelPostalAddress {
  /** Required by USPS when `shipperVisibilityMethod` is `SENDER_INFORMATION`. */
  platformUserId?: string;
}

export interface UspsLabelCustomerReference {
  /** 1 to 30 characters. */
  referenceNumber?: string;
  printReferenceNumber?: boolean;
}

export interface UspsLabelPackageOptions {
  packageValue?: number;
  nonDeliveryOption?: "RETURN" | "REDIRECT" | "ABANDON";
  omas?: { chargebackCode?: string };
  immediateManifest?: boolean;
  /** @deprecated by the spec. */
  redirectAddress?: UspsLabelPostalAddress;
  contentType?: UspsLabelContentType;
  generateGXEvent?: boolean;
  /** At most three. */
  containers?: UspsLabelContainer[];
  ancillaryServiceEndorsements?: UspsLabelAncillaryEndorsement;
}

export interface UspsLabelOutboundPackageOptions extends UspsLabelPackageOptions {
  returnReceiptTracking?: boolean;
  originalPackage?: {
    /** 22 to 34 characters. */
    originalTrackingNumber: string;
    /** Exactly three characters. */
    originalConstructCode: string;
  };
}

/** `YYYY-MM-DD` or an ISO date-time. */
export type UspsLabelMailingDate = string;

interface UspsLabelPackageDescriptionBase {
  weightUOM?: "lb";
  /** Pounds. */
  weight: number;
  dimensionsUOM?: "in";
  /** Inches. */
  length: number;
  width: number;
  height: number;
  girth?: number;
  hasNonstandardCharacteristics?: boolean;
  processingCategory: UspsProcessingCategory;
  customerReference?: UspsLabelCustomerReference[];
  /** At most five. */
  extraServices?: UspsLabelExtraServiceCode[];
  inductionZIPCode?: string;
  carrierRelease?: boolean;
  physicalSignatureRequired?: boolean;
}

interface UspsLabelWithRateIndicator<R extends string> {
  rateIndicator: R;
}

interface UspsLabelWithPackaging {
  shape: "RECTANGULAR" | "NON_RECTANGULAR";
  packagingType: UspsLabelPackagingType;
}

export type UspsPackageDescription = UspsLabelPackageDescriptionBase & {
  mailClass: UspsMailClass;
  mailingDate: UspsLabelMailingDate;
  destinationEntryFacilityType:
    | "NONE"
    | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
    | "DESTINATION_SECTIONAL_CENTER_FACILITY"
    | "DESTINATION_DELIVERY_UNIT"
    | "DESTINATION_SERVICE_HUB"
    | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";
  destinationEntryFacilityAddress?: UspsLabelDomesticAddress;
  packageOptions?: UspsLabelOutboundPackageOptions;
  serialNumberFormat?: "STANDARD" | "EXTENDED";
  shipperVisibilityMethod?: "SENDER_INFORMATION" | "MID_INFORMATION";
  /** Six or nine digits. */
  mailOwnerMID?: string;
  /** Six or nine digits. */
  logisticsManagerMID?: string;
  nonprofit?: boolean;
} & (
    UspsLabelWithRateIndicator<UspsLabelRateIndicator> | UspsLabelWithPackaging
  );

export type UspsLabelReturnPackageDescription =
  UspsLabelPackageDescriptionBase & {
    mailClass: UspsLabelReturnMailClass;
    destinationEntryFacilityAddress?: UspsLabelDomesticAddress;
    packageOptions?: UspsLabelPackageOptions;
    shipperVisibilityMethod?: "SENDER_INFORMATION";
  } & (
      | UspsLabelWithRateIndicator<UspsLabelReturnRateIndicator>
      | (Omit<UspsLabelWithPackaging, "packagingType"> & {
          packagingType: Exclude<
            UspsLabelPackagingType,
            | "CONNECT_LOCAL_FLAT_RATE_BOX"
            | "CONNECT_LOCAL_SMALL_FLAT_RATE_BAG"
            | "CONNECT_LOCAL_LARGE_FLAT_RATE_BAG"
          >;
        })
    );

export type UspsLabelImageType =
  | "PDF"
  | "TIFF"
  | "JPG"
  | "PNG"
  | "GIF"
  | "SVG"
  | "ZPL203DPI"
  | "ZPL300DPI"
  | "EPL300DPI"
  | "LABEL_BROKER"
  | "NONE";

export type UspsLabelSize =
  "4X4LABEL" | "4X5LABEL" | "4X6LABEL" | "6X4LABEL" | "2X7LABEL";

export type UspsLabelBrandingFormat =
  "ONE_SQUARE" | "TWO_SQUARES" | "RECTANGLE" | "NONE";

export interface UspsLabelImageInfo {
  imageType?: UspsLabelImageType;
  labelType?: UspsLabelSize;
  receiptOption?: "SAME_PAGE" | "SEPARATE_PAGE" | "NONE";
  brandingImageFormat?: UspsLabelBrandingFormat;
  /** At most two, each a 36-character UUID from the branding endpoints. */
  brandingImageUUIDs?: string[];
  includeLabelBrokerPDF?: boolean;
  addImageComments?: boolean;
  /** @deprecated by the spec. */
  shipInfo?: boolean;
  /** @deprecated by the spec. */
  addZPLComments?: boolean;
  suppressPostage?: boolean;
  suppressMailDate?: boolean;
  returnLabel?: boolean;
  /** 1 to 9999. */
  packageNumber?: number;
  /** 1 to 9999. */
  totalPackages?: number;
}

export interface UspsLabelReturnImageInfo extends UspsLabelImageInfo {
  /** @deprecated by the spec on this operation. */
  suppressPostage?: boolean;
  /** @deprecated by the spec on this operation. */
  suppressMailDate?: boolean;
  /** @deprecated by the spec on this operation. */
  returnLabel?: boolean;
}

export interface UspsLabelReprintImageInfo {
  imageType?: Exclude<UspsLabelImageType, "LABEL_BROKER" | "NONE">;
  labelType?: UspsLabelSize;
  suppressPostage?: boolean;
  suppressMailDate?: boolean;
  brandingImageFormat?: UspsLabelBrandingFormat;
  brandingImageUUIDs?: string[];
  packageNumber?: number;
  totalPackages?: number;
}

export interface UspsLabelShippingContents {
  /** 1 to 30 characters. */
  itemDescription?: string;
  /** 1 to 9999. */
  itemQuantity?: number;
  /** @deprecated by the spec; use `itemTotalValue`. */
  itemValue?: number;
  itemTotalValue?: number;
  weightUOM?: "lb";
  /** @deprecated by the spec; use `itemTotalWeight`. */
  itemWeight?: number;
  itemTotalWeight?: number;
  /** 6 to 14 characters. */
  HSTariffNumber?: string;
  /** Two uppercase letters. */
  countryofOrigin?: string;
  itemCategory?: string;
  itemSubcategory?: string;
}

export type UspsLabelCustomsContentType =
  | "MERCHANDISE"
  | "GIFT"
  | "DOCUMENT"
  | "COMMERCIAL_SAMPLE"
  | "RETURNED_GOODS"
  | "OTHER"
  | "HUMANITARIAN_DONATIONS"
  | "DANGEROUS_GOODS";

export interface UspsLabelCustomsFormBase {
  /** At most 25 characters. */
  contentComments?: string;
  restrictionType?:
    "QUARANTINE" | "SANITARY_INSPECTION" | "PHYTOSANITARY_INSPECTION" | "OTHER";
  restrictionComments?: string;
  AESITN?: string;
  invoiceNumber?: string;
  licenseNumber?: string;
  certificateNumber?: string;
  /** At most 40 characters. */
  importersReference?: string;
  /** At most 30 characters. */
  importersContact?: string;
  /** At most 40 characters. */
  exportersReference?: string;
  /** At most 30 characters. */
  exportersContact?: string;
}

export interface UspsCustomsForm extends UspsLabelCustomsFormBase {
  customsContentType: UspsLabelCustomsContentType;
  /** 1 to 30 items. */
  contents: Array<
    UspsLabelShippingContents &
      Required<
        Pick<
          UspsLabelShippingContents,
          | "itemDescription"
          | "itemQuantity"
          | "itemTotalValue"
          | "itemTotalWeight"
          | "weightUOM"
        >
      >
  >;
}

export interface UspsLabelReturnsCustomsForm extends UspsLabelCustomsFormBase {
  customsContentType?: UspsLabelCustomsContentType;
  contents?: UspsLabelShippingContents[];
}

export interface UspsCreateLabelRequest {
  toAddress: UspsLabelRecipientAddress;
  fromAddress: UspsLabelPostalAddress;
  senderAddress?: UspsLabelSenderAddress;
  returnAddress?: UspsLabelPostalAddress;
  packageDescription: UspsPackageDescription;
  imageInfo?: UspsLabelImageInfo;
  customsForm?: UspsCustomsForm;
}

export interface UspsLabelCreateReturnRequest {
  toAddress: UspsLabelPostalAddress;
  fromAddress: UspsLabelPostalAddress;
  senderAddress?: UspsLabelSenderAddress;
  returnAddress?: UspsLabelPostalAddress;
  packageDescription: UspsLabelReturnPackageDescription;
  imageInfo?: UspsLabelReturnImageInfo;
  customsForm?: UspsLabelReturnsCustomsForm;
}

export interface UspsLabelReprintRequest {
  imageInfo?: UspsLabelReprintImageInfo;
}

/** One `replace` operation; `value`'s type depends on `path`. */
export type UspsLabelEditOperation =
  | {
      op: "replace";
      path:
        | "/packageDescription/weight"
        | "/packageDescription/length"
        | "/packageDescription/height"
        | "/packageDescription/width"
        | "/packageDescription/girth";
      value: number;
    }
  | {
      op: "replace";
      path: "/packageDescription/processingCategory";
      value: UspsProcessingCategory;
    }
  | {
      op: "replace";
      path: "/packageDescription/rateIndicator";
      value: UspsLabelRateIndicator;
    }
  | {
      op: "replace";
      path: "/packageDescription/containers";
      value: UspsLabelContainer[];
    };

export interface UspsLabelWarning {
  warningCode?: string;
  warningDescription?: string;
}

export interface UspsLabelLink {
  rel: string[];
  href: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  submissionMediaType?: string;
  targetMediaType?: string;
}

export interface UspsLabelCharge {
  name?: string;
  SKU?: string;
  price?: number;
}

export interface UspsLabelExtraServiceCharge extends UspsLabelCharge {
  warnings?: UspsLabelWarning[];
}

export interface UspsLabelCommitment {
  name?: string;
  /** @deprecated by the spec. */
  scheduleDeliveryDate?: string;
  expectedDeliveryDate?: string;
  isPriorityMailNextDay?: boolean;
}

export interface UspsLabelMetadata {
  labelAddress?: UspsLabelPostalAddress;
  routingInformation?: string;
  trackingNumber?: string;
  constructCode?: string;
  SKU?: string;
  postage?: number;
  extraServices?: UspsLabelExtraServiceCharge[];
  serviceTypeCode?: string;
  zone?: string;
  /** ISO date-time. */
  mailingDate?: string;
  commitment?: UspsLabelCommitment;
  weightUOM?: string;
  weight?: number;
  dimensionalWeight?: number;
  fees?: UspsLabelCharge[];
  permitHolderName?: string;
  /** The spec types this as an object with no properties; no example shows a value. */
  inductionType?: Record<string, never>;
  /** At most 10 characters. */
  labelBrokerID?: string;
  bannerText?: string;
  retailDistributionCode?: string;
  returnReceiptTrackingNumber?: string;
  links?: UspsLabelLink[];
  warnings?: UspsLabelWarning[];
}

export interface UspsLabelReturnMetadata {
  labelAddress?: UspsLabelPostalAddress;
  routingInformation?: string;
  trackingNumber?: string;
  SKU?: string;
  /** @deprecated by the spec; use `SKU`. */
  sku?: string;
  postage?: number;
  extraServices?: UspsLabelExtraServiceCharge[];
  serviceTypeCode?: string;
  zone?: string;
  mailingDate?: string;
  weightUOM?: string;
  weight?: number;
  dimensionalWeight?: number;
  fees?: UspsLabelCharge[];
  labelBrokerID?: string;
  bannerText?: string;
  retailDistributionCode?: string;
  links?: UspsLabelLink[];
  warnings?: UspsLabelWarning[];
}

/**
 * `application/vnd.usps.labels+json`, the form `createLabel` requests: metadata
 * at the top level, images base64 alongside.
 */
export interface UspsLabelResponse extends UspsLabelMetadata {
  /** Base64. */
  labelImage?: string;
  receiptImage?: string;
  labelBrokerQR?: string;
  returnLabel?: UspsLabelReturnMetadata & {
    returnLabelImage?: string;
    returnReceiptImage?: string;
    labelBrokerQR?: string;
  };
}

/** `application/vnd.usps.labels+json` from `POST /return-label`. */
export interface UspsLabelReturnResponse extends UspsLabelReturnMetadata {
  returnLabelImage?: string;
  returnReceiptImage?: string;
  labelBrokerQR?: string;
}

export interface UspsLabelReprintInfo {
  reprintNumber?: number;
  reprintLimit?: number;
}

/**
 * Reprints nest metadata under `labelMetadata` / `returnLabelMetadata`, unlike
 * the flat create response, and carry the reprint counter.
 */
export interface UspsLabelReprintResponse {
  labelMetadata?: UspsLabelMetadata;
  returnLabelMetadata?: UspsLabelReturnMetadata;
  labelImage?: string;
  returnLabelImage?: string;
  reprintInfo?: UspsLabelReprintInfo;
}

export interface UspsCancelResponse {
  trackingNumber?: string;
  status?: "CANCELED" | "DISPUTED";
  /** Present when a refund was requested rather than a cancellation. */
  disputeId?: string;
}

export interface UspsLabelImbCancelResponse {
  imb?: string;
  status?: "CANCELED" | "DISPUTED";
  /** Capitalised differently from `UspsCancelResponse.disputeId`, per the spec. */
  disputeID?: string;
}

export type UspsLabelIndiciaImiType = "IMI_MIN" | "IMI_STD" | "IMI_MAX";

export interface UspsLabelNonMachinableIndicators {
  isPolybagged?: boolean;
  hasClosureDevices?: boolean;
  hasLooseItems?: boolean;
  isRigid?: boolean;
  isSelfMailer?: boolean;
  isBooklet?: boolean;
}

interface UspsLabelIndiciaDescriptionBase {
  processingCategory: "LETTERS" | "FLATS" | "CARDS";
  weight: number;
  mailingDate: UspsLabelMailingDate;
  length: number;
  height: number;
  thickness: number;
  nonMachinableIndicators?: UspsLabelNonMachinableIndicators;
  imiType?: UspsLabelIndiciaImiType;
}

export type UspsLabelIndiciaImageType = Exclude<
  UspsLabelImageType,
  "EPL300DPI" | "LABEL_BROKER" | "NONE"
>;

export interface UspsLabelIndiciaRequest {
  indiciaDescription: UspsLabelIndiciaDescriptionBase;
  imageInfo?: {
    receiptOption?: "SEPARATE_PAGE" | "NONE";
    imageType?: UspsLabelIndiciaImageType;
    labelType?: "2X1.5LABEL" | "IMI_DATA_ONLY";
  };
}

export interface UspsLabelIndiciaImbRequest {
  indiciaDescription: UspsLabelIndiciaDescriptionBase & {
    /** 0.01 to 999999.99. */
    itemValue?: number;
    /** At most three. */
    extraServices?: UspsLabelIndiciaImbExtraServiceCode[];
  };
  imageInfo?: {
    imageType?: UspsLabelIndiciaImageType;
    labelType?: "6X4LABEL" | "IMI_DATA_ONLY";
    receiptOption?: "SEPARATE_PAGE" | "NONE";
  };
  toAddress: UspsLabelPostalAddress;
  returnAddress: UspsLabelPostalAddress;
}

export interface UspsLabelIndiciaResponse {
  indiciaMetadata?: {
    SKU?: string;
    postage?: number;
    fees?: UspsLabelCharge[];
    weight?: number;
    /** Base64. */
    indiciaIMI?: string;
  };
  indiciaImage?: string;
  receiptImage?: string;
}

export interface UspsLabelIndiciaImbResponse {
  indiciaMetadata?: {
    imb?: string;
    constructCode?: string;
    trackingNumber?: string;
    SKU?: string;
    totalPrice?: number;
    postage?: number;
    fees?: UspsLabelCharge[];
    weight?: number;
    extraServices?: UspsLabelExtraServiceCharge[];
    serviceTypeCode?: string;
    bannerText?: string;
    mailClass?: "FIRST-CLASS";
    toAddress?: UspsLabelPostalAddress;
    returnAddress?: UspsLabelPostalAddress;
    indiciaIMI?: string;
    warnings?: UspsLabelWarning[];
  };
  indiciaImage?: string;
  receiptImage?: string;
}

export interface UspsLabelBrandingUploadRequest {
  /** 1 to 50 word characters; no spaces or punctuation. */
  imageName?: string;
  /** Base64 of an SVG under 10 KB (at most 13,336 base64 characters). */
  imageData: string;
}

export interface UspsLabelBrandingUploadResponse {
  imageUUID?: string;
  imageName?: string;
}

export interface UspsLabelBrandingDeleteResponse {
  imageName?: string;
  imageUUID?: string;
}

export interface UspsLabelBrandingImage {
  imageUUID?: string;
  imageName?: string;
  /** ISO date-time. */
  createdDateTime?: string;
  imageData?: string;
}

export interface UspsLabelBrandingRenameOptions extends UspsLabelBrandingImageOptions {
  /** 1 to 50 word characters. */
  imageName: string;
}

export type UspsLabelBrandingRenameResponse = UspsLabelBrandingImage;
export type UspsLabelBrandingGetResponse = UspsLabelBrandingImage;

export interface UspsLabelBrandingListParams {
  /** 1 to 100. USPS defaults to 10. */
  limit?: number;
  /** USPS defaults to 0. */
  offset?: number;
  /** USPS defaults to `desc`. */
  orderBy?: "asc" | "desc";
  /** USPS defaults to `createdDateTime`. */
  sortBy?: "imageName" | "createdDateTime";
}

export interface UspsLabelBrandingListResponse {
  images?: UspsLabelBrandingImage[];
  limit?: number;
  offset?: number;
  totalCount?: number;
}
