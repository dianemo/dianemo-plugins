export interface UspsInternationalLabelCreateOptions {
  /** Payer's account number; the labels sub-client mints the payment token from it. */
  accountNumber: string;
  /**
   * Stable value derived from your own shipment id. Reprint and cancel by key
   * find the label through it, and USPS states the create call itself is not
   * idempotent. Defaults to a fresh UUID.
   */
  idempotencyKey?: string;
}

export interface UspsInternationalLabelByTrackingOptions {
  accountNumber: string;
  trackingNumber: string;
}

export interface UspsInternationalLabelByKeyOptions {
  accountNumber: string;
  /** The `X-Idempotency-Key` sent when the label was created. */
  idempotencyKey: string;
}

export interface UspsInternationalLabelIndiciaOptions {
  accountNumber: string;
}

export interface UspsInternationalLabelRequest {
  imageInfo?: UspsInternationalLabelImageInfo;
  toAddress: UspsInternationalLabelRequestLabelAddress;
  fromAddress: UspsInternationalLabelRequestDomesticLabelAddress;
  senderAddress?: UspsInternationalLabelRequestDomesticLabelSenderAddress;
  packageDescription: UspsInternationalLabelInternationalPackageDescription;
  customsForm: UspsInternationalLabelInternationalCustomsForm;
}

export interface UspsInternationalLabelResponse {
  labelMetadata?: UspsInternationalLabelMetadata;
  labelImage?: string;
  labelBrokerQR?: string;
  prepaidDutiesTaxesFees?: {
    packageFee?: number;
    itemCosts?: Array<{
      dutyPrice?: number;
      taxPrice?: number;
      itemDescription?: string;
    }>;
  };
}

export type UspsInternationalLabelVendorResponse =
  UspsInternationalLabelMetadata & {
    labelImage?: string;
    labelBrokerQR?: string;
  };

export interface UspsInternationalLabelCancelResponse {
  trackingNumber?: string;
  status?: "CANCELED" | "DISPUTED";
  disputeId?: string;
}

export interface UspsInternationalLabelReprintRequest {
  imageInfo?: UspsInternationalLabelReprintImageInfo;
}

export interface UspsInternationalLabelReprintInternationalMultipartResponse {
  labelMetadata?: UspsInternationalLabelMetadata;
  labelImage?: string;
  reprintInfo?: UspsInternationalLabelReprintInfo;
}

export interface UspsInternationalLabelReprintInternationalResponse {
  labelMetadata?: UspsInternationalLabelMetadata;
  labelImage?: string;
  reprintInfo?: UspsInternationalLabelReprintInfo;
}

export interface UspsInternationalLabelIndiciaRequest {
  indiciaDescription: UspsInternationalLabelIndiciaRequestDescription;
  imageInfo?: {
    receiptOption?: "SEPARATE_PAGE" | "NONE";
    imageType?: "PDF" | "TIFF" | "JPG" | "PNG" | "GIF" | "SVG";
    labelType?: "2X1.5LABEL";
  };
}

export interface UspsInternationalLabelIndiciaResponse {
  indiciaMetadata?: {
    SKU?: string;
    postage?: number;
    fees?: Array<{
      name?: string;
      SKU?: string;
      price?: number;
    }>;
    weight?: number;
    indiciaIMI?: UspsInternationalLabelIndiciaIMI;
  };
  indiciaImage?: string;
  receiptImage?: string;
}

export interface UspsInternationalLabelImageInfo {
  imageType?:
    "LABEL_BROKER" | "PDF" | "TIFF" | "ZPL203DPI" | "ZPL300DPI" | "NONE";
  labelType?: "4X6LABEL";
  holdForManifest?: boolean;
  suppressPostage?: boolean;
  includeLabelBrokerPDF?: boolean;
  addZPLComments?: boolean;
  /** In USPS's Postman example (`5` of `50`); not declared in this spec's schema. */
  packageNumber?: number;
  totalPackages?: number;
}

export type UspsInternationalLabelLabelAddress =
  UspsInternationalLabelInternationalAddress &
    UspsInternationalLabelAddressee & {
      phone?: UspsInternationalLabelPhone;
      provinceISOAlpha2Code?: UspsInternationalLabelProvinceISOAlpha2Code;
    };

export type UspsInternationalLabelDomesticLabelAddress =
  UspsInternationalLabelDomesticAddress &
    UspsInternationalLabelAddressee & {
      phone?: UspsInternationalLabelPhone;
      email?: UspsInternationalLabelEmail;
      ignoreBadAddress?: boolean;
    };

export type UspsInternationalLabelDomesticLabelSenderAddress =
  UspsInternationalLabelDomesticLabelAddress &
    UspsInternationalLabelAddressee & {
      platformUserId?: string;
    };

/**
 * The spec's `required` lists on `InternationalLabelAddress`,
 * `DomesticLabelAddress` and `DomesticLabelSenderAddress` sit beside their
 * `allOf`. They apply to a response's `labelAddress` too, but the response
 * types above stay lenient: a missing field in what USPS sends back should not
 * fail a caller's type check, whereas a request without them is refused.
 */
export type UspsInternationalLabelRequestLabelAddress =
  UspsInternationalLabelLabelAddress & {
    streetAddress: string;
    city: string;
    country: string;
    countryISOAlpha2Code: string;
  };

export type UspsInternationalLabelRequestDomesticLabelAddress =
  UspsInternationalLabelDomesticLabelAddress & {
    streetAddress: string;
    city: string;
    state: UspsInternationalLabelState;
    ZIPCode: string;
  };

export type UspsInternationalLabelRequestDomesticLabelSenderAddress =
  UspsInternationalLabelDomesticLabelSenderAddress &
    UspsInternationalLabelRequestDomesticLabelAddress;

export type UspsInternationalLabelInternationalPackageDescription =
  UspsInternationalLabelPackageDescription & {
    weight: number;
    length: number;
    width: number;
    height: number;
    mailClass:
      | "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE"
      | "PRIORITY_MAIL_INTERNATIONAL"
      | "PRIORITY_MAIL_EXPRESS_INTERNATIONAL";
    rateIndicator?:
      "E4" | "E6" | "FA" | "FB" | "FE" | "FP" | "FS" | "PA" | "PL" | "SP";
    packagingType?:
      | "FLAT_RATE_ENVELOPE"
      | "LEGAL_FLAT_RATE_ENVELOPE"
      | "PADDED_FLAT_RATE_ENVELOPE"
      | "SM_FLAT_RATE_BOX"
      | "MD_FLAT_RATE_BOX"
      | "LG_FLAT_RATE_BOX"
      | "VARIABLE";
    diameter?: number;
    shape?: "RECTANGLE";
    processingCategory:
      "LETTERS" | "FLATS" | "MACHINABLE" | "NON_MACHINABLE" | "NONSTANDARD";
    destinationEntryFacilityType: "NONE" | "INTERNATIONAL_SERVICE_CENTER";
    mailingDate: string;
    packageOptions?: UspsInternationalLabelInternationalPackageOptions;
    customerReference?: UspsInternationalLabelCustomerReference[];
    extraServices?: UspsInternationalLabelExtraService[];
    inductionZIPCode?: string;
    mailOwnerMID?: string;
    logisticsManagerMID?: string;
    prepayDutiesTaxesFees?: boolean;
  };

export type UspsInternationalLabelInternationalCustomsForm =
  UspsInternationalLabelCustomsForm & {
    customsContentType:
      | "MERCHANDISE"
      | "GIFT"
      | "DOCUMENT"
      | "COMMERCIAL_SAMPLE"
      | "RETURNED_GOODS"
      | "OTHER"
      | "HUMANITARIAN_DONATIONS"
      | "DANGEROUS_GOODS"
      | "CREMATED_REMAINS"
      | "NON_NEGOTIABLE_DOCUMENT"
      | "MEDICAL_SUPPLIES"
      | "PHARMACEUTICALS";
    importersReference?: UspsInternationalLabelCustomsReference;
    exportersReference?: UspsInternationalLabelCustomsReference;
    incoterm?: ("1" | "2") | null;
    AESITN: string;
    contents: UspsInternationalLabelInternationalShippingContents[];
  };

export interface UspsInternationalLabelMetadata {
  labelAddress?: UspsInternationalLabelLabelAddress;
  internationalTrackingNumber?: string;
  constructCode?: string;
  SKU?: string;
  postage?: number;
  extraServices?: UspsInternationalLabelExtraServiceResponse;
  internationalPriceGroup?: string;
  weightUOM?: "lb";
  weight?: UspsInternationalLabelWeight;
  dimensionalWeight?: string;
  mailingDate?: string;
  fees?: Array<{
    name?: string;
    SKU?: string;
    price?: number;
  }>;
  labelBrokerID?: string;
  links?: UspsInternationalLabelLinks;
}

export interface UspsInternationalLabelReprintImageInfo {
  imageType?: "PDF" | "TIFF" | "ZPL203DPI" | "ZPL300DPI";
  labelType?: "4X6LABEL";
  suppressPostage?: boolean;
}

export interface UspsInternationalLabelReprintInfo {
  reprintNumber?: number;
  reprintLimit?: number;
}

export interface UspsInternationalLabelIndiciaRequestDescription {
  processingCategory: "LETTERS" | "FLATS" | "CARDS";
  weight: number;
  mailingDate: UspsInternationalLabelMailingDateIndiciaOptions;
  length: number;
  height: number;
  thickness: number;
  destinationCountryCode: string;
  nonMachinableIndicators?: {
    isPolybagged?: boolean;
    hasClosureDevices?: boolean;
    hasLooseItems?: boolean;
    isRigid?: boolean;
    isSelfMailer?: boolean;
    isBooklet?: boolean;
  };
}

export type UspsInternationalLabelIndiciaIMI = string;

export type UspsInternationalLabelInternationalAddress =
  UspsInternationalLabelAddress & {
    city?: string;
    postalCode?: string;
    province?: string;
    provinceISOAlpha2Code?: UspsInternationalLabelProvinceISOAlpha2Code;
    country?: string;
    countryISOAlpha2Code?: string;
  };

export interface UspsInternationalLabelAddressee {
  firstName?: string;
  lastName?: string;
  firm?: string;
}

export type UspsInternationalLabelPhone = string;

export type UspsInternationalLabelProvinceISOAlpha2Code = string;

export type UspsInternationalLabelDomesticAddress =
  UspsInternationalLabelAddress & {
    city?: string;
    state?: UspsInternationalLabelState;
    ZIPCode?: string;
    ZIPPlus4?: string | null;
    urbanization?: string;
  };

export type UspsInternationalLabelEmail = string;

export interface UspsInternationalLabelPackageDescription {
  weightUOM?: "lb";
  weight?: number;
  dimensionsUOM?: "in";
  length?: number;
  height?: number;
  width?: number;
  girth?: number;
  destinationEntryFacilityAddress?: UspsInternationalLabelDomesticAddress;
}

export type UspsInternationalLabelInternationalPackageOptions =
  UspsInternationalLabelPackageOptions & {
    redirectAddress?: UspsInternationalLabelRequestDomesticLabelAddress & {
      email?: UspsInternationalLabelEmail;
    };
    originalPackage?: {
      originalTrackingNumber: string;
      originalConstructCode: "G01" | "I01";
    };
    generateGXEvent?: boolean;
    immediateManifest?: boolean;
  };

export interface UspsInternationalLabelCustomerReference {
  referenceNumber?: string;
}

export type UspsInternationalLabelExtraService =
  | 480
  | 481
  | 482
  | 483
  | 484
  | 486
  | 487
  | 488
  | 813
  | 820
  | 826
  | 857
  | 930
  | 931
  | 955;

export interface UspsInternationalLabelCustomsForm {
  contentComments?: string;
  restrictionType?:
    "QUARANTINE" | "SANITARY_INSPECTION" | "PHYTOSANITARY_INSPECTION" | "OTHER";
  restrictionComments?: string;
  AESITN?: string;
  invoiceNumber?: string;
  licenseNumber?: string;
  certificateNumber?: string;
}

export interface UspsInternationalLabelCustomsReference {
  referenceType?: "TAX_CODE" | "VAT_NUMBER" | "IMPORTER_CODE";
  reference?: string;
  contact?: {
    phone?: UspsInternationalLabelPhone;
    fax?: UspsInternationalLabelPhone;
    email?: UspsInternationalLabelEmail;
  };
}

export type UspsInternationalLabelInternationalShippingContents = Required<
  Pick<
    UspsInternationalLabelShippingContents,
    "countryofOrigin" | "itemDescription" | "itemQuantity"
  >
> &
  UspsInternationalLabelShippingContents;

export type UspsInternationalLabelExtraServiceResponse = Array<{
  serviceID?: string;
  serviceName?: string;
  sku?: string;
  price?: number;
  warnings?: Array<{
    warningCode?: string;
    warningDescription?: string;
  }>;
}>;

export type UspsInternationalLabelWeight = number;

export type UspsInternationalLabelLinks = Array<{
  rel: string[];
  title?: string;
  href: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  submissionMediaType?: string;
  targetMediaType?: string;
}>;

export type UspsInternationalLabelMailingDateIndiciaOptions =
  | UspsInternationalLabelMailingDateIndicia
  | UspsInternationalLabelMailingDateTimeIndicia;

export interface UspsInternationalLabelAddress {
  streetAddress?: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  cityAbbreviation?: string;
}

export type UspsInternationalLabelState = string;

export interface UspsInternationalLabelPackageOptions {
  packageValue?: number;
  nonDeliveryOption?: "RETURN" | "REDIRECT" | "ABANDON";
}

export interface UspsInternationalLabelShippingContents {
  itemDescription?: string;
  itemQuantity?: number;
  itemValue?: number;
  itemTotalValue?: number;
  weightUOM?: "lb";
  itemWeight?: number;
  itemTotalWeight?: number;
  HSTariffNumber?: string;
  countryofOrigin?: string;
  itemCategory?: string;
  itemSubcategory?: string;
  europeanUnionProductID?: UspsInternationalLabelEUProductIDFields;
}

export type UspsInternationalLabelMailingDateIndicia = string;

export type UspsInternationalLabelMailingDateTimeIndicia = string;

export interface UspsInternationalLabelEUProductIDFields {
  merchantProductIdentifier: string;
  nonstandardizedManufacturerProductIdentifier: string;
  standardizedManufacturerProductIdentifier?: string;
}
