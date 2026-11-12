import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsLabelAccountOptions,
  UspsLabelBrandingDeleteResponse,
  UspsLabelBrandingGetResponse,
  UspsLabelBrandingImageOptions,
  UspsLabelBrandingListParams,
  UspsLabelBrandingListResponse,
  UspsLabelBrandingRenameOptions,
  UspsLabelBrandingRenameResponse,
  UspsLabelBrandingUploadRequest,
  UspsLabelBrandingUploadResponse,
} from "./types.js";

const imageUrl = (imageUUID: string) =>
  `/labels/v3/branding/${encodeURIComponent(imageUUID)}`;

/** The SVG travels base64-encoded inside a JSON body, not as a multipart file. */
export const uploadLabelBranding = async (
  clientName: string,
  data: UspsLabelBrandingUploadRequest,
  options: UspsLabelAccountOptions
): Promise<UspsLabelBrandingUploadResponse> => {
  const res = await tryHandleRequest<UspsLabelBrandingUploadResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.uploadLabelBranding",
      method: "POST",
      url: "/labels/v3/branding",
      data,
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0026",
    "Failed to upload USPS label branding image"
  );
  return res.data;
};

export const listLabelBranding = async (
  clientName: string,
  options: UspsLabelAccountOptions,
  params?: UspsLabelBrandingListParams
): Promise<UspsLabelBrandingListResponse> => {
  const res = await tryHandleRequest<UspsLabelBrandingListResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.listLabelBranding",
      method: "GET",
      url: "/labels/v3/branding",
      params: Object.fromEntries(
        Object.entries(params ?? {}).filter(([, v]) => v !== undefined)
      ),
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0027",
    "Failed to list USPS label branding images"
  );
  return res.data;
};

export const getLabelBranding = async (
  clientName: string,
  options: UspsLabelBrandingImageOptions
): Promise<UspsLabelBrandingGetResponse> => {
  const res = await tryHandleRequest<UspsLabelBrandingGetResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.getLabelBranding",
      method: "GET",
      url: imageUrl(options.imageUUID),
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0028",
    "Failed to get USPS label branding image"
  );
  return res.data;
};

export const deleteLabelBranding = async (
  clientName: string,
  options: UspsLabelBrandingImageOptions
): Promise<UspsLabelBrandingDeleteResponse> => {
  const res = await tryHandleRequest<UspsLabelBrandingDeleteResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.deleteLabelBranding",
      method: "DELETE",
      url: imageUrl(options.imageUUID),
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0029",
    "Failed to delete USPS label branding image"
  );
  return res.data;
};

/** The only operation the spec allows is replacing `/imageName`. */
export const renameLabelBranding = async (
  clientName: string,
  options: UspsLabelBrandingRenameOptions
): Promise<UspsLabelBrandingRenameResponse> => {
  const res = await tryHandleRequest<UspsLabelBrandingRenameResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.renameLabelBranding",
      method: "PATCH",
      url: imageUrl(options.imageUUID),
      data: [{ op: "replace", path: "/imageName", value: options.imageName }],
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0030",
    "Failed to rename USPS label branding image"
  );
  return res.data;
};
