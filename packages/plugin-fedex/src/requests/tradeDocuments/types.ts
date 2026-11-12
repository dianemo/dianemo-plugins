/** Raw document bytes. Node's `Buffer` is a `Uint8Array`, so it is accepted as-is. */
export type FedExTradeDocumentBytes = Blob | Uint8Array | ArrayBuffer;

export type FedExTradeDocumentWorkflow = "ETDPreshipment" | "ETDPostshipment";

export type FedExTradeDocumentCarrierCode = "FDXE" | "FDXG";

export type FedExTradeDocumentType =
  | "CERTIFICATE_OF_ORIGIN"
  | "COMMERCIAL_INVOICE"
  | "ETD_LABEL"
  | "OTHER"
  | "PRO_FORMA_INVOICE"
  | "USMCA_CERTIFICATION_OF_ORIGIN"
  | "USMCA_COMMERCIAL_INVOICE_CERTIFICATION_OF_ORIGIN";

export type FedExTradeDocumentContentType =
  | "application/pdf"
  | "application/x-soffice"
  | "application/doc"
  | "text/richtext"
  | "text/rtf"
  | "application/x-rtf"
  | "application/rtf"
  | "application/msword"
  | "text/plain"
  | "image/bmp"
  | "image/png"
  | "image/gif"
  | "image/jpeg"
  | "image/tiff"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-excel";

export type FedExLetterheadImageType = "SIGNATURE" | "LETTERHEAD";

export type FedExLetterheadImageIndex =
  "IMAGE_1" | "IMAGE_2" | "IMAGE_3" | "IMAGE_4" | "IMAGE_5";

export type FedExLetterheadImageContentType = "image/png" | "image/gif";

// ---- Single ETD upload (multipart) ----------------------------------------

export interface FedExEtdDocumentMeta {
  shipDocumentType: FedExTradeDocumentType;
  /** Required when `shipDocumentType` is one of the two USMCA types; then it must be `USMCA`. */
  formCode?: string;
  /** Post-shipment only. */
  trackingNumber?: string;
  /** Post-shipment only. `YYYY-MM-DDThh:mm:ss`. */
  shipmentDate?: string;
  /** Post-shipment only; from the Create Shipment response. */
  originLocationCode?: string;
  originCountryCode: string;
  /** Post-shipment only; from the Create Shipment response. */
  destinationLocationCode?: string;
  destinationCountryCode: string;
}

/** The JSON `document` part of the multipart body. */
export interface FedExEtdDocument {
  workflowName: FedExTradeDocumentWorkflow;
  carrierCode?: FedExTradeDocumentCarrierCode;
  /** File name sent with the `attachment` part. */
  name: string;
  contentType: FedExTradeDocumentContentType;
  meta: FedExEtdDocumentMeta;
}

export interface FedExUploadEtdDocumentRequest {
  document: FedExEtdDocument;
  attachment: FedExTradeDocumentBytes;
}

export interface FedExEtdDocumentMetaOutput {
  /** Short code, e.g. `CI` for COMMERCIAL_INVOICE — not the request enum. */
  documentType?: string;
  /** Quote this in the shipment request for a pre-shipment upload. */
  docId?: string;
  folderId?: string;
}

/** Unlike the other envelopes here it carries no `transactionId`. */
export interface FedExUploadEtdDocumentResponse {
  output?: { meta?: FedExEtdDocumentMetaOutput };
  customerTransactionId?: string;
}

// ---- Letterhead / signature image (multipart) ------------------------------

export interface FedExLetterheadImageMeta {
  imageType: FedExLetterheadImageType;
  imageIndex: FedExLetterheadImageIndex;
}

/** The JSON `document` part of the multipart body. */
export interface FedExLetterheadImageDocument {
  referenceId: string;
  /** File name sent with the `attachment` part. */
  name: string;
  /** A plain string in the multipart schema; its description names these two. The base64 variant has a real enum and stays narrow. */
  contentType: FedExLetterheadImageContentType | (string & {});
  meta: FedExLetterheadImageMeta;
}

export interface FedExUploadImageRequest {
  document: FedExLetterheadImageDocument;
  /** The JSON `rules` part. The spec's only value is `LetterheadSignature`. */
  rules: { workflowName: string };
  attachment: FedExTradeDocumentBytes;
}

export interface FedExUploadImageResponse {
  output?: {
    meta?: {
      imageType?: string;
      imageIndex?: string;
    };
    status?: string;
    documentReferenceId?: string;
  };
  customerTransactionId?: string;
}

// ---- Letterhead / signature image (base64 JSON) -----------------------------

export interface FedExUploadEncodedImageRequest {
  document: {
    referenceId: string;
    contentType: FedExLetterheadImageContentType;
    meta: FedExLetterheadImageMeta & {
      /** Base64 of the image file, no `data:` prefix. */
      fileContentBase64: string;
    };
  };
}

export interface FedExUploadEncodedImageResponse {
  output?: {
    meta?: {
      imageType?: string;
      /** The schema types this as `object`; the multipart variant types it as a string. */
      imageIndex?: string | object;
    };
    status?: "SUCCESS" | "FAILURE" | "ERROR";
    documentReferenceId?: string;
  };
  customerTransactionId?: string;
  transactionId?: string;
}

// ---- Multiple ETD upload (multipart) ----------------------------------------

export interface FedExMultiDocumentMeta {
  /** File name sent with the matching `fileAttachments` part. */
  fileName: string;
  fileReferenceId?: string;
  contentType: FedExTradeDocumentContentType;
  formCode?: string;
  /** Post-shipment only. */
  originLocationCode?: string;
  /** Post-shipment only. */
  destinationLocationCode?: string;
  shipDocumentType: FedExTradeDocumentType;
}

/** The JSON `documentInformation` part of the multipart body. */
export interface FedExMultiDocumentInformation {
  workflowName: FedExTradeDocumentWorkflow;
  carrierCode: FedExTradeDocumentCarrierCode;
  originCountryCode: string;
  destinationCountryCode: string;
  /** Post-shipment only. `YYYY-MM-DDThh:mm:ss`; must match the shipment's timestamp. */
  shipmentDate?: string;
  /** Post-shipment only. For MPS, the master tracking number. */
  trackingNumber?: string;
  /** At most 5, one per entry in `fileAttachments`, in the same order. */
  metaData: FedExMultiDocumentMeta[];
}

export interface FedExUploadMultipleEtdDocumentsRequest {
  documentInformation: FedExMultiDocumentInformation;
  /** At most 5, in the same order as `documentInformation.metaData`. */
  fileAttachments: FedExTradeDocumentBytes[];
}

export interface FedExMultiDocumentResponseMeta {
  formCode?: string;
  documentType?: string;
  docId?: string;
  folderId?: string;
}

export interface FedExUploadMultipleEtdDocumentsResponse {
  customerTransactionId?: string;
  transactionId?: string;
  output?: {
    documentResponses?: Array<{
      fileReferenceId?: string;
      metaData?: FedExMultiDocumentResponseMeta;
    }>;
  };
}

// ---- Multiple ETD upload (base64 JSON) ----------------------------------------

export interface FedExEncodedMultiDocumentMeta {
  fileReferenceId?: string;
  /** A free string here; the multipart variant enumerates it. */
  contentType: string;
  formCode?: string;
  /** Post-shipment only. */
  originLocationCode?: string;
  /** Post-shipment only. */
  destinationLocationCode?: string;
  shipDocumentType: FedExTradeDocumentType;
  /** Base64 of the file, no `data:` prefix. */
  fileContentBase64: string;
}

export interface FedExUploadMultipleEncodedEtdDocumentsRequest {
  workflowName: FedExTradeDocumentWorkflow;
  carrierCode: FedExTradeDocumentCarrierCode;
  originCountryCode: string;
  destinationCountryCode: string;
  /** Post-shipment only. `YYYY-MM-DDThh:mm:ss`; must match the shipment's timestamp. */
  shipmentDate?: string;
  /** Post-shipment only. */
  trackingNumber?: string;
  /** At most 5. */
  metaData: FedExEncodedMultiDocumentMeta[];
}

export type FedExUploadMultipleEncodedEtdDocumentsResponse =
  FedExUploadMultipleEtdDocumentsResponse;
