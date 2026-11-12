import { forwardingClient, forwardingHeaders, forwardingUrl } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsForwardingGetDocumentsParams,
  UpsForwardingUploadDocumentRequest,
  UpsForwardingUploadDocumentResponseV1,
} from "./types.js";

/** The 200 is `application/pdf` bytes, not JSON. */
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
  return res.data;
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
