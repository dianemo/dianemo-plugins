import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsOpenAndDistributeCloseParams,
  UspsOpenAndDistributeCloseRequest,
  UspsOpenAndDistributeCloseResponse,
  UspsOpenAndDistributeCreateRequest,
  UspsOpenAndDistributeCreateResponse,
  UspsOpenAndDistributeOptions,
} from "./types.js";

// Asked for explicitly: the spec lists multipart/form-data first, and the
// vendor type is the one that returns the images inline as Base64 — the same
// reason createLabel sends application/vnd.usps.labels+json.
const ACCEPT = "application/vnd.usps.pmod+json";

export const createOpenAndDistributeContainer = async (
  clientName: string,
  data: UspsOpenAndDistributeCreateRequest,
  options: UspsOpenAndDistributeOptions
): Promise<UspsOpenAndDistributeCreateResponse> => {
  const res = await tryHandleRequest<UspsOpenAndDistributeCreateResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.openAndDistribute.createOpenAndDistributeContainer",
      method: "POST",
      url: "/pmod/v3/pmod/create",
      data,
      headers: { Accept: ACCEPT },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0085",
    "Failed to create USPS Open and Distribute container"
  );
  return res.data;
};

export const closeOpenAndDistributeContainer = async (
  clientName: string,
  params: UspsOpenAndDistributeCloseParams,
  data: UspsOpenAndDistributeCloseRequest
): Promise<UspsOpenAndDistributeCloseResponse> => {
  const res = await tryHandleRequest<UspsOpenAndDistributeCloseResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.openAndDistribute.closeOpenAndDistributeContainer",
      method: "POST",
      url: `/pmod/v3/pmod/manifest/${encodeURIComponent(params.containerId)}`,
      data,
      headers: { Accept: ACCEPT },
      metadata: { uspsAccountNumber: params.accountNumber },
    },
    "USP_0086",
    "Failed to close USPS Open and Distribute container"
  );
  return res.data;
};
