import { tryHandleRequest } from "@dianemo/plugin-kit";
import { readIndiciaBody } from "./utils.js";
import { uspsSubClient } from "../utils.js";
import type {
  UspsLabelAccountOptions,
  UspsLabelImbCancelResponse,
  UspsLabelImbOptions,
  UspsLabelIndiciaImbRequest,
  UspsLabelIndiciaImbResponse,
  UspsLabelIndiciaRequest,
  UspsLabelIndiciaResponse,
} from "./types.js";

// Every success content type of the indicia operations has the same schema;
// plain JSON is asked for because the spec lists multipart/form-data first, but
// USPS's own example shows multipart anyway, so the body is requested as bytes
// and read by `readIndiciaBody`. A failure status therefore reaches the caller
// with a `Buffer` body — see docs/usps-api.md#labels.
const JSON_ACCEPT = { Accept: "application/json" };

export const createLabelIndicia = async (
  clientName: string,
  data: UspsLabelIndiciaRequest,
  options: UspsLabelAccountOptions
): Promise<UspsLabelIndiciaResponse> => {
  const res = await tryHandleRequest<Buffer>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.createLabelIndicia",
      method: "POST",
      url: "/labels/v3/indicia",
      data,
      headers: JSON_ACCEPT,
      responseType: "arraybuffer",
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0023",
    "Failed to create USPS indicia"
  );
  return readIndiciaBody<UspsLabelIndiciaResponse>(
    res.data,
    res.headers?.["content-type"] as string | undefined
  );
};

export const createLabelIndiciaImb = async (
  clientName: string,
  data: UspsLabelIndiciaImbRequest,
  options: UspsLabelAccountOptions
): Promise<UspsLabelIndiciaImbResponse> => {
  const res = await tryHandleRequest<Buffer>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.createLabelIndiciaImb",
      method: "POST",
      url: "/labels/v3/indicia/imb",
      data,
      headers: JSON_ACCEPT,
      responseType: "arraybuffer",
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0024",
    "Failed to create USPS IMB indicia"
  );
  return readIndiciaBody<UspsLabelIndiciaImbResponse>(
    res.data,
    res.headers?.["content-type"] as string | undefined
  );
};

export const cancelLabelIndiciaImb = async (
  clientName: string,
  options: UspsLabelImbOptions
): Promise<UspsLabelImbCancelResponse> => {
  const res = await tryHandleRequest<UspsLabelImbCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.cancelLabelIndiciaImb",
      method: "DELETE",
      url: `/labels/v3/indicia/imb/${encodeURIComponent(options.imb)}`,
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0025",
    "Failed to cancel USPS IMB indicia"
  );
  return res.data;
};
