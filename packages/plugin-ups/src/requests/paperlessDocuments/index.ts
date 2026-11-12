import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPaperlessDeleteResponseWrapper,
  UpsPaperlessDeleteParams,
  UpsPaperlessDocumentParams,
  UpsPaperlessPushToImageRepositoryRequestWrapper,
  UpsPaperlessPushToImageRepositoryResponseWrapper,
  UpsPaperlessUploadRequestWrapper,
  UpsPaperlessUploadResponseWrapper,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const PAPERLESS_VERSION = "v2";

export const uploadPaperlessDocument = async (
  clientName: string,
  { shipperNumber }: UpsPaperlessDocumentParams,
  data: UpsPaperlessUploadRequestWrapper
): Promise<UpsPaperlessUploadResponseWrapper> => {
  const res = await tryHandleRequest<UpsPaperlessUploadResponseWrapper>(
    {
      clientName,
      requestName: "ups.paperlessDocuments.uploadPaperlessDocument",
      method: "POST",
      url: `/api/paperlessdocuments/${PAPERLESS_VERSION}/upload`,
      headers: { ShipperNumber: shipperNumber },
      data,
    },
    "UPS_0058",
    "Failed to upload UPS paperless document"
  );
  return res.data;
};

export const pushPaperlessDocumentImage = async (
  clientName: string,
  { shipperNumber }: UpsPaperlessDocumentParams,
  data: UpsPaperlessPushToImageRepositoryRequestWrapper
): Promise<UpsPaperlessPushToImageRepositoryResponseWrapper> => {
  const res =
    await tryHandleRequest<UpsPaperlessPushToImageRepositoryResponseWrapper>(
      {
        clientName,
        requestName: "ups.paperlessDocuments.pushPaperlessDocumentImage",
        method: "POST",
        url: `/api/paperlessdocuments/${PAPERLESS_VERSION}/image`,
        headers: { ShipperNumber: shipperNumber },
        data,
      },
      "UPS_0059",
      "Failed to push UPS paperless document to the image repository"
    );
  return res.data;
};

/**
 * `DocumentId/ShipperNumber` in the path are literal segments, not
 * placeholders: the spec declares both as required *header* parameters and the
 * path has no template variable for either — see
 * docs/ups-api.md#paperless-document-delete-path
 */
export const deletePaperlessDocument = async (
  clientName: string,
  { shipperNumber, documentId }: UpsPaperlessDeleteParams
): Promise<UpsPaperlessDeleteResponseWrapper> => {
  const res = await tryHandleRequest<UpsPaperlessDeleteResponseWrapper>(
    {
      clientName,
      requestName: "ups.paperlessDocuments.deletePaperlessDocument",
      method: "DELETE",
      url: `/api/paperlessdocuments/${PAPERLESS_VERSION}/DocumentId/ShipperNumber`,
      headers: { ShipperNumber: shipperNumber, DocumentId: documentId },
    },
    "UPS_0060",
    "Failed to delete UPS paperless document"
  );
  return res.data;
};
