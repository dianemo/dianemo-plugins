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
  phoneExtension?: number;
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
  /** An integer in the spec, so a 14-digit GTIN can exceed safe-integer range. */
  gtinUpcCode?: number;
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
  /** 1 is manufacturer, 2 is seller. */
  lotNumberQualifier?: 1 | 2;
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

/** The spec's 200 envelope carries no `transactionId`, unlike most FedEx APIs. */
export interface FedExRegulatoryProfileResponse {
  output?: {
    message?: string;
  };
}
