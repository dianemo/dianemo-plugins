import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  TrackPackageResponse,
  UpsTrackingDetailsOptions,
  UpsTrackingReferenceRequest,
  UpsTrackingShipmentRequest,
} from "./types.js";

/**
 * Written into every Tracking path rather than being a path parameter; UPS
 * lists no other value — see docs/ups-api.md#tracking.
 */
const TRACKING_PATH = "/api/track/v1";

/**
 * Looks up one tracking number.
 *
 * `returnSignature` and `locale` are always sent, with UPS's own defaults,
 * because v1.0.0 did; `returnMilestones` and `returnPOD` are sent only when set.
 * Activity dates and times are in the local time of the place the activity
 * happened, not the caller's — see docs/ups-api.md#tracking.
 */
export const trackPackage = async (
  clientName: string,
  trackingNumber: string,
  options?: UpsTrackingDetailsOptions
): Promise<TrackPackageResponse> => {
  const query = new URLSearchParams({
    returnSignature: options?.returnSignature ? "true" : "false",
    locale: options?.locale ?? "en_US",
  });
  if (options?.returnMilestones !== undefined) {
    query.set("returnMilestones", String(options.returnMilestones));
  }
  if (options?.returnPOD !== undefined) {
    query.set("returnPOD", String(options.returnPOD));
  }
  const res = await tryHandleRequest<TrackPackageResponse>(
    {
      clientName,
      requestName: "ups.packageTracking.track",
      method: "GET",
      url: `${TRACKING_PATH}/details/${encodeURIComponent(trackingNumber)}?${query}`,
    },
    "UPS_0006",
    "Failed to track UPS package"
  );
  return res.data;
};

/** Looks up packages by a shipper-assigned reference number instead of a tracking number. */
export const trackByReferenceNumber = async (
  clientName: string,
  { referenceNumber, ...options }: UpsTrackingReferenceRequest
): Promise<TrackPackageResponse> => {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(options)) {
    if (value !== undefined) query.set(name, value);
  }
  const suffix = query.size > 0 ? `?${query}` : "";
  const res = await tryHandleRequest<TrackPackageResponse>(
    {
      clientName,
      requestName: "ups.packageTracking.trackByReferenceNumber",
      method: "GET",
      url: `${TRACKING_PATH}/reference/details/${encodeURIComponent(referenceNumber)}${suffix}`,
    },
    "UPS_0045",
    "Failed to track UPS packages by reference number"
  );
  return res.data;
};

/** Pages through the packages of a multi-package shipment with `offset` and `count`. */
export const trackShipmentPackages = async (
  clientName: string,
  { inquiryNumber, ...options }: UpsTrackingShipmentRequest
): Promise<TrackPackageResponse> => {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(options)) {
    if (value !== undefined) query.set(name, String(value));
  }
  const suffix = query.size > 0 ? `?${query}` : "";
  const res = await tryHandleRequest<TrackPackageResponse>(
    {
      clientName,
      requestName: "ups.packageTracking.trackShipmentPackages",
      method: "GET",
      url: `${TRACKING_PATH}/shipment/details/${encodeURIComponent(inquiryNumber)}${suffix}`,
    },
    "UPS_0046",
    "Failed to track UPS shipment packages"
  );
  return res.data;
};
