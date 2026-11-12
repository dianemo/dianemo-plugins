import { fedexSubClient, FEDEX_DOCUMENTS_CLIENT } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { buildMultipartForm } from "./multipart.js";
import {
  FedExUploadEncodedImageRequest,
  FedExUploadEncodedImageResponse,
  FedExUploadEtdDocumentRequest,
  FedExUploadEtdDocumentResponse,
  FedExUploadImageRequest,
  FedExUploadImageResponse,
  FedExUploadMultipleEncodedEtdDocumentsRequest,
  FedExUploadMultipleEncodedEtdDocumentsResponse,
  FedExUploadMultipleEtdDocumentsRequest,
  FedExUploadMultipleEtdDocumentsResponse,
} from "./types.js";

// Multipart bodies carry no Content-Type of ours: axios derives it from the
// FormData, boundary included, and a hand-written header would lack the boundary.

export const uploadEtdDocument = async (
  clientName: string,
  data: FedExUploadEtdDocumentRequest
): Promise<FedExUploadEtdDocumentResponse> => {
  const url = "/documents/v1/etds/upload";
  const res = await tryHandleRequest<FedExUploadEtdDocumentResponse>(
    {
      clientName: fedexSubClient(clientName, FEDEX_DOCUMENTS_CLIENT),
      requestName: "fedex.tradeDocuments.uploadEtdDocument",
      method: "POST",
      url,
      data: buildMultipartForm({
        json: { document: data.document },
        files: [
          {
            field: "attachment",
            bytes: data.attachment,
            name: data.document.name,
            type: data.document.contentType,
          },
        ],
      }),
    },
    "FDX_0090",
    "Failed to upload FedEx ETD document"
  );
  return res.data;
};

export const uploadImage = async (
  clientName: string,
  data: FedExUploadImageRequest
): Promise<FedExUploadImageResponse> => {
  const url = "/documents/v1/lhsimages/upload";
  const res = await tryHandleRequest<FedExUploadImageResponse>(
    {
      clientName: fedexSubClient(clientName, FEDEX_DOCUMENTS_CLIENT),
      requestName: "fedex.tradeDocuments.uploadImage",
      method: "POST",
      url,
      data: buildMultipartForm({
        // One `document` part holding both, not three siblings:
        // docs/fedex-api.md#trade-documents-upload-multipart-body.
        json: { document: { document: data.document, rules: data.rules } },
        files: [
          {
            field: "attachment",
            bytes: data.attachment,
            name: data.document.name,
            type: data.document.contentType,
          },
        ],
      }),
    },
    "FDX_0091",
    "Failed to upload FedEx letterhead or signature image"
  );
  return res.data;
};

export const uploadEncodedImage = async (
  clientName: string,
  data: FedExUploadEncodedImageRequest
): Promise<FedExUploadEncodedImageResponse> => {
  const url = "/documents/v1/lhsimages/encodedupload";
  const res = await tryHandleRequest<FedExUploadEncodedImageResponse>(
    {
      clientName: fedexSubClient(clientName, FEDEX_DOCUMENTS_CLIENT),
      requestName: "fedex.tradeDocuments.uploadEncodedImage",
      method: "POST",
      url,
      data,
    },
    "FDX_0092",
    "Failed to upload FedEx base64 letterhead or signature image"
  );
  return res.data;
};

export const uploadMultipleEtdDocuments = async (
  clientName: string,
  data: FedExUploadMultipleEtdDocumentsRequest
): Promise<FedExUploadMultipleEtdDocumentsResponse> => {
  const url = "/documents/v1/etds/multiupload";
  const res = await tryHandleRequest<FedExUploadMultipleEtdDocumentsResponse>(
    {
      clientName: fedexSubClient(clientName, FEDEX_DOCUMENTS_CLIENT),
      requestName: "fedex.tradeDocuments.uploadMultipleEtdDocuments",
      method: "POST",
      url,
      data: buildMultipartForm({
        json: { documentInformation: data.documentInformation },
        files: data.fileAttachments.map((bytes, i) => ({
          field: "fileAttachments",
          bytes,
          name:
            data.documentInformation.metaData[i]?.fileName ?? `file${i + 1}`,
          type: data.documentInformation.metaData[i]?.contentType,
        })),
      }),
    },
    "FDX_0093",
    "Failed to upload multiple FedEx ETD documents"
  );
  return res.data;
};

export const uploadMultipleEncodedEtdDocuments = async (
  clientName: string,
  data: FedExUploadMultipleEncodedEtdDocumentsRequest
): Promise<FedExUploadMultipleEncodedEtdDocumentsResponse> => {
  const url = "/documents/v1/etds/encodedmultiupload";
  const res =
    await tryHandleRequest<FedExUploadMultipleEncodedEtdDocumentsResponse>(
      {
        clientName: fedexSubClient(clientName, FEDEX_DOCUMENTS_CLIENT),
        requestName: "fedex.tradeDocuments.uploadMultipleEncodedEtdDocuments",
        method: "POST",
        url,
        data,
      },
      "FDX_0094",
      "Failed to upload multiple FedEx base64 ETD documents"
    );
  return res.data;
};
