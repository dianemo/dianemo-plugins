export type FedExCloseRequestType = "GCDR" | "RGCDR";

export type FedExCloseDocumentType = "MANIFEST" | "OP_950";

export type FedExCloseImageType =
  | "DIB"
  | "DOC"
  | "DPL"
  | "EPL2"
  | "GIF"
  | "PDF"
  | "PNG"
  | "RTF"
  | "TEXT"
  | "ZPLII";

export type FedExCloseStockType =
  | "OP_900_LG"
  | "OP_900_LG_B"
  | "OP_900_LL"
  | "OP_900_LL_B"
  | "OP_950"
  | "PAPER_4_PER_PAGE_PORTRAIT"
  | "PAPER_4X6"
  | "PAPER_LETTER"
  | "STOCK_4X6"
  | "STOCK_4X6.75_LEADING_DOC_TAB"
  | "STOCK_4X6.75_TRAILING_DOC_TAB"
  | "STOCK_4X8"
  | "STOCK_4X9_LEADING_DOC_TAB"
  | "STOCK_4X9_TRAILING_DOC_TAB";

export interface FedExCloseAccountNumber {
  value?: string;
}

export interface FedExCloseVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface FedExCloseOp950Format {
  topOfPageOffset?: { value?: string; units?: "CM" | "IN" };
  imageType?: FedExCloseImageType;
  stockType?: FedExCloseStockType;
  /** e.g. `en_US`. */
  locale?: string;
}

export interface FedExCloseDocumentSpecification {
  closeDocumentTypes?: FedExCloseDocumentType[];
  op950Detail?: { format?: FedExCloseOp950Format };
}

/**
 * The spec's `required` array is empty for both close bodies; the minimum
 * samples it ships imply which fields a call needs in practice.
 */
export interface FedExCloseGroundRequest {
  /** `GCDR` for a close; `RGCDR` is the reprint value. */
  closeReqType?: FedExCloseRequestType;
  accountNumber?: FedExCloseAccountNumber;
  groundServiceCategory?: "GROUND";
  /** `YYYY-MM-DD`. */
  closeDate?: string;
  closeDocumentSpecification?: FedExCloseDocumentSpecification;
  version?: FedExCloseVersion;
}

export interface FedExCloseReprintRequest {
  /** `RGCDR` for a reprint. */
  closeReqType?: FedExCloseRequestType;
  accountNumber?: FedExCloseAccountNumber;
  groundServiceCategory?: "GROUND";
  /** `YYYY-MM-DD`; used with `reprintOption: "BY_SHIP_DATE"`. */
  closeDate?: string;
  /** Used with `reprintOption: "BY_TRACKING_NUMBER"`. */
  trackingNumber?: string;
  reprintOption?: "BY_SHIP_DATE" | "BY_TRACKING_NUMBER";
  closeDocumentSpecification?: FedExCloseDocumentSpecification;
  version?: FedExCloseVersion;
}

export interface FedExCloseDocumentPart {
  documentPartSequenceNumber?: number;
  /** Encoded image content. */
  image?: string;
}

export interface FedExCloseDocument {
  type?: FedExCloseDocumentType;
  shippingCycle?: string;
  shippingDocumentDisposition?: string;
  accessReference?: string;
  resolution?: number;
  copiesToPrint?: number;
  parts?: FedExCloseDocumentPart[];
}

/** The spec's 200 envelope has `transactionId` but no `customerTransactionId`. */
export interface FedExCloseResponse {
  transactionId?: string;
  output?: {
    alerts?: {
      code?: string;
      alertType?: "NOTE" | "WARNING";
      message?: string;
    }[];
    closeDocuments?: FedExCloseDocument[];
  };
}
