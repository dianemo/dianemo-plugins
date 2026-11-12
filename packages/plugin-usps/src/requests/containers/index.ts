import { bytesOnSuccess, uspsSubClient } from "../utils.js";
import { parseContainerLabelResponse } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  UspsContainerAddPackagesRequest,
  UspsContainerCreateRequest,
  UspsContainerLabelResult,
  UspsContainerManifestRequest,
  UspsContainerPackageParams,
  UspsContainerParams,
  UspsContainerResponse,
} from "./types.js";

const BASE = "/containers/v3/containers";

export const addUspsContainerPackages = async (
  clientName: string,
  params: UspsContainerParams,
  data: UspsContainerAddPackagesRequest
): Promise<UspsContainerResponse> => {
  const res = await tryHandleRequest<UspsContainerResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.containers.addUspsContainerPackages",
      method: "POST",
      url: `${BASE}/${encodeURIComponent(params.containerId)}/packages`,
      data,
    },
    "USP_0080",
    "Failed to add packages to USPS container"
  );
  return res.data;
};

export const removeAllUspsContainerPackages = async (
  clientName: string,
  params: UspsContainerParams
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.containers.removeAllUspsContainerPackages",
      method: "DELETE",
      url: `${BASE}/${encodeURIComponent(params.containerId)}/packages`,
    },
    "USP_0081",
    "Failed to remove all packages from USPS container"
  );
};

export const removeUspsContainerPackage = async (
  clientName: string,
  params: UspsContainerPackageParams
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.containers.removeUspsContainerPackage",
      method: "DELETE",
      url: `${BASE}/${encodeURIComponent(params.containerId)}/packages/${encodeURIComponent(params.trackingNumber)}`,
    },
    "USP_0082",
    "Failed to remove package from USPS container"
  );
};

/**
 * The only documented 201 content type is `multipart/form-data` (JSON
 * `containerMetadata` plus a `labelImage` part), so it is asked for by name and
 * read as bytes: text would corrupt a binary image. `bytesOnSuccess` keeps a
 * failure's body readable — see docs/usps-api.md#binary-responses-and-error-bodies.
 */
export const createUspsContainerLabel = async (
  clientName: string,
  data: UspsContainerCreateRequest
): Promise<UspsContainerLabelResult> => {
  const res = await tryHandleRequest<Buffer>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.containers.createUspsContainerLabel",
      method: "POST",
      url: BASE,
      data,
      headers: { Accept: "multipart/form-data" },
      responseType: "arraybuffer",
      transformResponse: bytesOnSuccess,
    },
    "USP_0083",
    "Failed to create USPS container label"
  );
  const contentType = res.headers?.["content-type"] as string | undefined;
  return parseContainerLabelResponse(
    res.data,
    contentType,
    data.imageInfo?.imageType !== "NONE"
  );
};

export const closeUspsContainerManifest = async (
  clientName: string,
  data: UspsContainerManifestRequest
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.containers.closeUspsContainerManifest",
      method: "POST",
      url: `${BASE}/manifest`,
      data,
    },
    "USP_0084",
    "Failed to close USPS container manifest"
  );
};
