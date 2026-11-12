import { forwardingClient, forwardingHeaders, forwardingUrl } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import {
  UpsForwardingGetDocumentsParams,
  UpsForwardingUploadDocumentRequest,
  UpsForwardingUploadDocumentResponseV1,
} from "./types.js";

const PDF_MAGIC = "%PDF";

/**
 * Core redacts an error body by replacing a Buffer with `[Buffer N bytes]`
 * (`redactBody` in `@dianemo/core`), which would discard UPS's JSON error, so a
 * non-2xx body is decoded here, before core sees it. Safe for a binary success
 * body because axios hands this function the status and it returns the data
 * untouched for anything below 300 — docs/ups-api.md#forwarding-documents-bytes
 */
const decodeErrorBody = (data: unknown, _headers: unknown, status?: number) => {
  if (status === undefined || status < 300) return data;
  if (!Buffer.isBuffer(data) && !(data instanceof ArrayBuffer)) return data;
  const text = Buffer.from(data as ArrayBuffer).toString("utf8");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

/** Raw `%PDF` bytes, or the example's JSON wrapper carrying base64 in `response.pdfFile`. */
const pdfBytes = (data: Buffer): Buffer => {
  if (data.subarray(0, PDF_MAGIC.length).toString("latin1") === PDF_MAGIC)
    return data;
  let pdfFile: unknown;
  try {
    pdfFile = (
      JSON.parse(data.toString("utf8")) as {
        response?: { pdfFile?: unknown };
      } | null
    )?.response?.pdfFile;
  } catch {
    // Not JSON either; falls through to the error below
  }
  if (typeof pdfFile === "string" && pdfFile.length > 0)
    return Buffer.from(pdfFile, "base64");
  throw new RequestError(
    "UPS_0130",
    "UPS Forwarding documents response was neither PDF bytes nor JSON with response.pdfFile",
    { metadata: { context: `${data.length} bytes` } }
  );
};

/**
 * The spec's 200 is `application/pdf`, but its one example is JSON with the PDF
 * base64-encoded in `response.pdfFile`, so both are accepted and the caller
 * always gets PDF bytes — docs/ups-api.md#forwarding-documents-bytes
 */
export const getForwardingDocuments = async (
  clientName: string,
  {
    businessGuid,
    clientId,
    shipmentNumber,
    shipmentAccountNumber,
    shipmentType,
    docType,
  }: UpsForwardingGetDocumentsParams
): Promise<Buffer> => {
  const res = await tryHandleRequest<Buffer>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingDocuments",
      method: "GET",
      url: forwardingUrl("/documents"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      responseType: "arraybuffer",
      transformResponse: decodeErrorBody,
      params: {
        shipment_number: shipmentNumber,
        shipment_account_number: shipmentAccountNumber,
        shipment_type: shipmentType,
        doc_type: docType,
      },
    },
    "UPS_0122",
    "Failed to get UPS Forwarding documents"
  );
  return pdfBytes(Buffer.from(res.data));
};

/**
 * Multipart, per the spec (`multipart/form-data`, not JSON base64). No
 * `Content-Type` of ours: axios derives it from the FormData with the boundary.
 */
export const uploadForwardingDocument = async (
  clientName: string,
  {
    businessGuid,
    clientId,
    accountNumber,
    shipmentNumber,
    documentType,
    document,
    fileName,
  }: UpsForwardingUploadDocumentRequest
): Promise<UpsForwardingUploadDocumentResponseV1> => {
  const form = new FormData();
  form.append("AccountNumber", accountNumber);
  form.append("ShipmentNumber", shipmentNumber);
  form.append("DocumentType", documentType);
  const blob =
    document instanceof Blob
      ? document
      : new Blob([document] as ConstructorParameters<typeof Blob>[0], {
          type: "application/pdf",
        });
  form.append("DocumentToUpload", blob, fileName ?? "document.pdf");

  const res = await tryHandleRequest<UpsForwardingUploadDocumentResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.uploadForwardingDocument",
      method: "POST",
      url: forwardingUrl("/documents"),
      headers: forwardingHeaders({ businessGuid, clientId }, false),
      data: form,
    },
    "UPS_0123",
    "Failed to upload UPS Forwarding document"
  );
  return res.data;
};
