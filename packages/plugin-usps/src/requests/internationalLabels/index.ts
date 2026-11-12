import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import { randomUUID } from "node:crypto";
import type {
  UspsInternationalLabelByKeyOptions,
  UspsInternationalLabelByTrackingOptions,
  UspsInternationalLabelCancelResponse,
  UspsInternationalLabelCreateOptions,
  UspsInternationalLabelIndiciaOptions,
  UspsInternationalLabelIndiciaRequest,
  UspsInternationalLabelIndiciaResponse,
  UspsInternationalLabelRequest,
  UspsInternationalLabelReprintInternationalResponse,
  UspsInternationalLabelReprintRequest,
  UspsInternationalLabelVendorResponse,
} from "./types.js";

// Every operation in this spec requires X-Payment-Authorization-Token, so all
// of them go to `labels` and carry the payer account for the interceptor.
// `Accept: application/vnd.usps.labels+json` is how the domestic createLabel
// avoids the default multipart response, which a JSON client cannot read.
const LABELS_JSON = "application/vnd.usps.labels+json";

export const createInternationalLabel = async (
  clientName: string,
  data: UspsInternationalLabelRequest,
  options: UspsInternationalLabelCreateOptions
): Promise<UspsInternationalLabelVendorResponse> => {
  const res = await tryHandleRequest<UspsInternationalLabelVendorResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.internationalLabels.createInternationalLabel",
      method: "POST",
      url: "/international-labels/v3/international-label",
      data,
      headers: {
        "X-Idempotency-Key": options.idempotencyKey ?? randomUUID(),
        Accept: LABELS_JSON,
      },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0035",
    "Failed to create USPS international label"
  );
  return res.data;
};

export const cancelInternationalLabelByIdempotencyKey = async (
  clientName: string,
  options: UspsInternationalLabelByKeyOptions
): Promise<UspsInternationalLabelCancelResponse> => {
  const res = await tryHandleRequest<UspsInternationalLabelCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName:
        "usps.internationalLabels.cancelInternationalLabelByIdempotencyKey",
      method: "DELETE",
      url: "/international-labels/v3/international-label",
      headers: { "X-Idempotency-Key": options.idempotencyKey },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0036",
    "Failed to cancel USPS international label by idempotency key"
  );
  return res.data;
};

export const reprintInternationalLabel = async (
  clientName: string,
  options: UspsInternationalLabelByTrackingOptions,
  data: UspsInternationalLabelReprintRequest = {}
): Promise<UspsInternationalLabelReprintInternationalResponse> => {
  const res =
    await tryHandleRequest<UspsInternationalLabelReprintInternationalResponse>(
      {
        clientName: uspsSubClient(clientName, "labels"),
        requestName: "usps.internationalLabels.reprintInternationalLabel",
        method: "POST",
        url: `/international-labels/v3/international-label-reprint/${encodeURIComponent(options.trackingNumber)}`,
        data,
        headers: { Accept: LABELS_JSON },
        metadata: { uspsAccountNumber: options.accountNumber },
      },
      "USP_0037",
      "Failed to reprint USPS international label"
    );
  return res.data;
};

export const reprintInternationalLabelByIdempotencyKey = async (
  clientName: string,
  options: UspsInternationalLabelByKeyOptions,
  data: UspsInternationalLabelReprintRequest = {}
): Promise<UspsInternationalLabelReprintInternationalResponse> => {
  const res =
    await tryHandleRequest<UspsInternationalLabelReprintInternationalResponse>(
      {
        clientName: uspsSubClient(clientName, "labels"),
        requestName:
          "usps.internationalLabels.reprintInternationalLabelByIdempotencyKey",
        method: "POST",
        url: "/international-labels/v3/international-label-reprint",
        data,
        headers: {
          "X-Idempotency-Key": options.idempotencyKey,
          Accept: LABELS_JSON,
        },
        metadata: { uspsAccountNumber: options.accountNumber },
      },
      "USP_0038",
      "Failed to reprint USPS international label by idempotency key"
    );
  return res.data;
};

export const cancelInternationalLabel = async (
  clientName: string,
  options: UspsInternationalLabelByTrackingOptions
): Promise<UspsInternationalLabelCancelResponse> => {
  const res = await tryHandleRequest<UspsInternationalLabelCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.internationalLabels.cancelInternationalLabel",
      method: "DELETE",
      url: `/international-labels/v3/international-label/${encodeURIComponent(options.trackingNumber)}`,
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0039",
    "Failed to cancel USPS international label"
  );
  return res.data;
};

export const createInternationalIndicia = async (
  clientName: string,
  data: UspsInternationalLabelIndiciaRequest,
  options: UspsInternationalLabelIndiciaOptions
): Promise<UspsInternationalLabelIndiciaResponse> => {
  const res = await tryHandleRequest<UspsInternationalLabelIndiciaResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.internationalLabels.createInternationalIndicia",
      method: "POST",
      url: "/international-labels/v3/indicia",
      data,
      headers: { Accept: LABELS_JSON },
      metadata: { uspsAccountNumber: options.accountNumber },
    },
    "USP_0040",
    "Failed to create USPS international indicia"
  );
  return res.data;
};
