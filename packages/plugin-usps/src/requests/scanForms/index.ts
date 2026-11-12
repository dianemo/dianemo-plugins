import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsScanFormOptions,
  UspsScanFormRequest,
  UspsScanFormResponse,
} from "./types.js";

export const createScanForm = async (
  clientName: string,
  data: UspsScanFormRequest,
  options: UspsScanFormOptions = {}
): Promise<UspsScanFormResponse> => {
  const res = await tryHandleRequest<UspsScanFormResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.scanForms.createScanForm",
      method: "POST",
      url: "/scan-forms/v3/scan-form",
      data,
      headers: {
        // The default multipart response splits metadata from the image; the
        // vendor type is the one that returns a single JSON body.
        Accept: "application/vnd.usps.labels+json",
        ...(options.idempotencyKey
          ? { "X-Idempotency-Key": options.idempotencyKey }
          : {}),
      },
    },
    "USP_0087",
    "Failed to create USPS SCAN Form"
  );
  return res.data;
};
