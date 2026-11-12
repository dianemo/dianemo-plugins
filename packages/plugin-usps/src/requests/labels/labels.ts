import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import { randomUUID } from "node:crypto";
import type {
  UspsCancelResponse,
  UspsCreateLabelRequest,
  UspsLabelCreateOptions,
  UspsLabelCreateReturnRequest,
  UspsLabelEditOperation,
  UspsLabelIdempotencyOptions,
  UspsLabelMetadata,
  UspsLabelReprintRequest,
  UspsLabelReprintResponse,
  UspsLabelResponse,
  UspsLabelReturnResponse,
  UspsLabelTrackingOptions,
} from "./types.js";

// Vendor JSON is requested because the spec lists multipart/form-data first and
// that is not a body a JSON-parsing handler can return as `data`. Inference:
// the default Accept was never observed.
const VENDOR_JSON = { Accept: "application/vnd.usps.labels+json" };

/**
 * @param idempotencyKey Pass a stable value derived from your own order or
 * shipment id so a retry after a timeout returns the original label instead of
 * buying a second one. The default is a fresh UUID, which makes every call a
 * distinct purchase.
 */
export const createLabel = async (
  clientName: string,
  data: UspsCreateLabelRequest,
  accountNumber: string,
  idempotencyKey: string = randomUUID()
): Promise<UspsLabelResponse> => {
  const res = await tryHandleRequest<UspsLabelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.create",
      method: "POST",
      url: "/labels/v3/label",
      data,
      headers: { "X-Idempotency-Key": idempotencyKey, ...VENDOR_JSON },
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0001",
    "Failed to create USPS label"
  );
  return res.data;
};

export const voidLabel = async (
  clientName: string,
  trackingNumber: string,
  accountNumber: string
): Promise<UspsCancelResponse> => {
  const res = await tryHandleRequest<UspsCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.void",
      method: "DELETE",
      url: `/labels/v3/label/${encodeURIComponent(trackingNumber)}`,
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0003",
    "Failed to void USPS label"
  );
  return res.data;
};

export const reprintLabel = async (
  clientName: string,
  trackingNumber: string,
  accountNumber: string,
  data?: UspsLabelReprintRequest
): Promise<UspsLabelReprintResponse> => {
  const res = await tryHandleRequest<UspsLabelReprintResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.reprint",
      method: "POST",
      url: `/labels/v3/label-reprint/${encodeURIComponent(trackingNumber)}`,
      data: data ?? {},
      headers: VENDOR_JSON,
      metadata: { uspsAccountNumber: accountNumber },
    },
    "USP_0008",
    "Failed to reprint USPS label"
  );
  return res.data;
};

/** Cancels, or requests a refund for, the label created under this key. */
export const cancelLabelByIdempotencyKey = async (
  clientName: string,
  options: UspsLabelIdempotencyOptions
): Promise<UspsCancelResponse> => {
  const res = await tryHandleRequest<UspsCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.cancelLabelByIdempotencyKey",
      method: "DELETE",
      url: "/labels/v3/label",
      headers: { "X-Idempotency-Key": options.idempotencyKey },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0020",
    "Failed to cancel USPS label by idempotency key"
  );
  return res.data;
};

export const createReturnLabel = async (
  clientName: string,
  data: UspsLabelCreateReturnRequest,
  options: UspsLabelCreateOptions
): Promise<UspsLabelReturnResponse> => {
  const res = await tryHandleRequest<UspsLabelReturnResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.createReturnLabel",
      method: "POST",
      url: "/labels/v3/return-label",
      data,
      headers: {
        "X-Idempotency-Key": options.idempotencyKey ?? randomUUID(),
        ...VENDOR_JSON,
      },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0021",
    "Failed to create USPS return label"
  );
  return res.data;
};

/**
 * USPS says edits change rate ingredients and so can change the price, which
 * is why this carries the payment token. Not allowed on a label created with
 * `suppressPostage: false`, or on Cubic Soft Pack dimensions.
 */
export const editLabel = async (
  clientName: string,
  options: UspsLabelTrackingOptions,
  data: UspsLabelEditOperation[]
): Promise<UspsLabelMetadata> => {
  const res = await tryHandleRequest<UspsLabelMetadata>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.editLabel",
      method: "PATCH",
      url: `/labels/v3/label/${encodeURIComponent(options.trackingNumber)}`,
      data,
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0022",
    "Failed to edit USPS label"
  );
  return res.data;
};

export const reprintLabelByIdempotencyKey = async (
  clientName: string,
  options: UspsLabelIdempotencyOptions,
  data?: UspsLabelReprintRequest
): Promise<UspsLabelReprintResponse> => {
  const res = await tryHandleRequest<UspsLabelReprintResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.labels.reprintLabelByIdempotencyKey",
      method: "POST",
      url: "/labels/v3/label-reprint",
      data: data ?? {},
      headers: { "X-Idempotency-Key": options.idempotencyKey, ...VENDOR_JSON },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0031",
    "Failed to reprint USPS label by idempotency key"
  );
  return res.data;
};
