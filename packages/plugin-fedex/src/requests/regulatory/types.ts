export type FedExRegulatoryCode = "CPSC" | "EU_DE_MINIMIS";

export type FedExRegulatoryProductIdType =
  | "SKU"
  | "PART_NUMBER"
  | "REGISTERED_NUMBER"
  | "GTIN"
  | "UPC"
  | "EAN"
  | "MPN"
  | "OTHER";

export interface FedExRegulatoryContact {
  personName?: string;
  emailAddress?: string;
  /** `string | number`: the spec's examples send `"000"`, and a number loses leading zeros. */
  phoneExtension?: string | number;
  /** Includes the country code. */
  phoneNumber?: string;
  companyName?: string;
}

export interface FedExRegulatoryAddress {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface FedExRegulatoryEntityDetails {
  contact?: FedExRegulatoryContact;
  address?: FedExRegulatoryAddress;
}

export interface FedExRegulatoryDisclaimMessageSet {
  disclaimCode?: "A" | "B";
  intendedUseCode?: string;
  intendedUseDescription?: string;
}

export interface FedExRegulatoryReferenceMessageSet {
  productVersion?: string;
  certifierId?: string;
  registryProductId?: string;
}

export interface FedExRegulatoryProductDetails {
  /** True selects FCP (CPC); false selects FGC (GCC). */
  childrensProduct?: boolean;
  skuProductCode?: string;
  /** An integer in the schema, but the examples send `"00012345678905"`; a number drops the leading zeros. */
  gtinUpcCode?: string | number;
  /** SRV is a 14-digit GTIN; AI is a 12-digit UPC. */
  gtinUpcQualifierCode?: "SRV" | "AI";
  serialNumber?: string;
  registeredNumber?: string;
  productName?: string;
  brandName?: string;
  alternateId?: string;
  /** `YYYY-MM-DD`. */
  previousTestDate?: string;
  modelNumber?: string;
  modelColor?: string;
  modelDescription?: string;
  modelStyle?: string;
  /** CPY is certificate yes; CPN is no. */
  declarationCode?: "CPY" | "CPN";
}

export interface FedExRegulatoryManufacturerDetails {
  smallBatchManufacturerRegistryId?: string;
  manufactureDate?: string;
  contact?: FedExRegulatoryContact;
  address?: FedExRegulatoryAddress;
}

export interface FedExRegulatoryLotDetails {
  lotNumber?: string;
  /** 1 is manufacturer, 2 is seller. The schema says integer; `cpscExample3` sends `"1"`. */
  lotNumberQualifier?: 1 | 2 | "1" | "2";
  /** `YYYY-MM-DD`. */
  productionStartDate?: string;
  /** `YYYY-MM-DD`. */
  productionEndDate?: string;
}

export interface FedExRegulatoryTestingDetail {
  citationCode?: string[];
  labType?: "ITL" | "LAB" | "NOL";
  /** `YYYY-MM-DD`. */
  labTestDate?: string;
  labId?: string;
  testReportId?: string;
  testReportUrl?: string;
  testReportAccessKey?: string;
  /** In `cpscExample3` only; the schema does not define it. */
  isNoLabEntry?: boolean;
  componentPartDescription?: string;
  contact?: FedExRegulatoryContact;
  address?: FedExRegulatoryAddress;
}

export interface FedExRegulatoryCitationDetail {
  testingDetails?: FedExRegulatoryTestingDetail[];
}

export interface FedExRegulatoryFullMessageSet {
  productDetails?: FedExRegulatoryProductDetails;
  manufacturerDetails?: FedExRegulatoryManufacturerDetails;
  lotDetails?: FedExRegulatoryLotDetails;
  certifierEntity?: FedExRegulatoryEntityDetails;
  pointOfContact?: FedExRegulatoryEntityDetails;
  citationDetails?: FedExRegulatoryCitationDetail[];
}

export interface FedExRegulatoryDetail {
  disclaimMessageSet?: FedExRegulatoryDisclaimMessageSet;
  referenceMessageSet?: FedExRegulatoryReferenceMessageSet;
  fullMessageSet?: FedExRegulatoryFullMessageSet;
  standardManufacturerProductId?: string;
  /** Max length 70 per the spec's description. */
  nonStandardManufacturerProductId?: string;
  /** Max length 70 per the spec's description. */
  merchantProductId?: string;
}

export interface FedExRegulatoryProfileEntry {
  regulationCode: FedExRegulatoryCode;
  productId: string;
  productIdType: FedExRegulatoryProductIdType;
  /** 2-letter country code. */
  countryOfImport: string;
  details: FedExRegulatoryDetail[];
}

/** The request body is a bare JSON array, not an object. */
export type FedExRegulatoryProfileRequest = FedExRegulatoryProfileEntry[];

export interface FedExRegulatoryProfileResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: {
    message?: string;
  };
}
