/** Master shipment id: ten digits, or nine digits then `T`. */
export interface UpsTradeDirectMasterShipmentRef {
  usiNumber: string;
}

/** `shipperAccountNumber` is six upper-case alphanumerics. */
export interface UpsTradeDirectDeleteMasterParams extends UpsTradeDirectMasterShipmentRef {
  shipperAccountNumber: string;
}

export interface UpsTradeDirectChildShipmentRef extends UpsTradeDirectMasterShipmentRef {
  /** 1Z tracking number, eighteen upper-case alphanumerics. */
  trackingNumber: string;
}

export interface UpsTradeDirectLtlChildShipmentRef extends UpsTradeDirectMasterShipmentRef {
  subProNumber: string;
}

export type UpsTradeDirectHandlingUnitType =
  | "BAGS"
  | "BOXES"
  | "CARTONS"
  | "CRATES"
  | "DRUMS"
  | "PALLET_SKIDS"
  | "ROLLS"
  | "TUBES";

export type UpsTradeDirectFreightClass =
  | 50
  | 55
  | 60
  | 65
  | 70
  | 77.5
  | 85
  | 92.5
  | 100
  | 110
  | 125
  | 150
  | 175
  | 200
  | 250
  | 300
  | 400
  | 500;

export interface UpsTradeDirectDimensions {
  /** 1.0 to 99.99 for each of length, width and height. */
  length: number;
  width: number;
  height: number;
  unitOfMeasurement: "IN" | "CM";
}

export interface UpsTradeDirectPackageWeight {
  /** 0.01 to 5000. */
  weight: number;
  unitOfMeasurement: "KGS" | "LBS";
}

/** Each count is 0 to 999, and at least one of the two must be 1 or more. */
export interface UpsTradeDirectTransportationService {
  airService: number;
  groundService: number;
}

export interface UpsTradeDirectHandlingUnits {
  type: UpsTradeDirectHandlingUnitType;
  dimensions: UpsTradeDirectDimensions;
  packageWeight: UpsTradeDirectPackageWeight;
  freightClass: UpsTradeDirectFreightClass;
  transportationService: UpsTradeDirectTransportationService;
}

export interface UpsTradeDirectPackage {
  /** 1 to 200. */
  numberOfIdenticalUnits: number;
  handlingUnits: UpsTradeDirectHandlingUnits;
}

export interface UpsTradeDirectCloseoutRequest {
  shipment: {
    shipper: {
      /** Six upper-case alphanumerics. */
      accountNumber: string;
    };
    /** At most 200. */
    packages?: UpsTradeDirectPackage[];
  };
}

export type UpsTradeDirectImageFormat =
  "ZPL" | "EPL" | "STARPL" | "SPL" | "PNG" | "PDF" | "GIF";

export interface UpsTradeDirectDocFile {
  /** Base64. */
  data: string;
  fileFormat: string;
  referenceId: string;
}

/** The spec's `oneOf` says exactly one of `warning` and `files` is present. */
export interface UpsTradeDirectDocGenerationResponse {
  warning?: string;
  files?: UpsTradeDirectDocFile[];
}

export interface UpsTradeDirectLabelDetails {
  opTyp: UpsTradeDirectImageFormat;
  lblNmbr: string;
  /** Base64. */
  lblData: string;
}

/** One of `warning` and `files` is present. */
export interface UpsTradeDirectLabelResponse {
  warning?: string;
  files?: UpsTradeDirectLabelDetails[];
}

export interface UpsTradeDirectCloseoutResponse {
  invoiceLabelResponse: UpsTradeDirectDocGenerationResponse;
  bolLabelResponse: UpsTradeDirectDocGenerationResponse;
  /** Documented as a list in its description but typed as one object. */
  palletLabelResponses: UpsTradeDirectLabelResponse;
  /** Present only on the 207 variant. */
  message?: string;
}

export type UpsTradeDirectRequestedDoc =
  "CCI" | "CBOL" | "BOL" | "PLT" | "PKGPLT";

export interface UpsTradeDirectDocumentRequest {
  requestedDoc: UpsTradeDirectRequestedDoc;
  docFormat: UpsTradeDirectImageFormat;
  usiNumber: string;
  shipperAccountNumber: string;
  /** 15 to 20 upper-case alphanumerics; for LTL shipments. */
  subproNumber?: string;
}

/** PDF documents are base64; labels use the requested `docFormat`, base64. */
export interface UpsTradeDirectDocumentResponse {
  documents?: {
    cci?: string;
    cbol?: string;
    bol?: string;
    plt?: string[];
    pkgplt?: string[];
  };
}

export interface UpsTradeDirectError {
  code: string;
  message: string;
}

export interface UpsTradeDirectErrorResponse {
  response: { errors: UpsTradeDirectError[] };
}
