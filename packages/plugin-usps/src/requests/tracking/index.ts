import { tryHandleRequest } from "@dianemo/plugin-kit";
import { forwardedForHeaders } from "./utils.js";
import { uspsSubClient } from "../utils.js";
import type {
  UspsTrackingExpand,
  UspsTrackingNotificationAcknowledgement,
  UspsTrackingNotificationRequest,
  UspsTrackingParams,
  UspsTrackingProofOfDeliveryRequest,
  UspsTrackingProofOfDeliveryResponse,
  UspsTrackingTarget,
  UspsTrackingResult,
  UspsTrackingV3r2Details,
  UspsTrackingV3r2MultiStatusResponse,
  UspsTrackingV3r2NotificationAcknowledgement,
  UspsTrackingV3r2NotificationRequest,
  UspsTrackingV3r2ProofOfDeliveryAcknowledgement,
  UspsTrackingV3r2ProofOfDeliveryRequest,
  UspsTrackingV3r2Request,
  UspsTrackingV3r2Target,
} from "./types.js";

/**
 * Tracking-number path parameter is a bare string after `clientName`, kept from
 * v1.0.0; the other tracking functions take a named options object.
 *
 * The result is the detail shape unless `expand: "SUMMARY"` is passed: USPS
 * defaults to SUMMARY, this function has always asked for DETAIL.
 */
export const trackPackage = async <E extends UspsTrackingExpand = "DETAIL">(
  clientName: string,
  trackingNumber: string,
  options: UspsTrackingParams<E> = {}
): Promise<UspsTrackingResult<E>> => {
  const { forwardedFor, expand, ...query } = options;
  const res = await tryHandleRequest<UspsTrackingResult<E>>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.tracking.get",
      method: "GET",
      url: `/tracking/v3/tracking/${encodeURIComponent(trackingNumber)}`,
      params: { expand: expand ?? "DETAIL", ...query },
      headers: forwardedForHeaders(forwardedFor),
    },
    "USP_0005",
    "Failed to track USPS package"
  );
  return res.data;
};

export const registerTrackingNotifications = async (
  clientName: string,
  { trackingNumber, forwardedFor }: UspsTrackingTarget,
  data: UspsTrackingNotificationRequest
): Promise<UspsTrackingNotificationAcknowledgement> => {
  const res = await tryHandleRequest<UspsTrackingNotificationAcknowledgement>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.tracking.registerNotifications",
      method: "POST",
      url: `/tracking/v3/tracking/${encodeURIComponent(trackingNumber)}/notifications`,
      data,
      headers: forwardedForHeaders(forwardedFor),
    },
    "USP_0065",
    "Failed to register USPS tracking notifications"
  );
  return res.data;
};

export const requestTrackingProofOfDelivery = async (
  clientName: string,
  { trackingNumber, forwardedFor }: UspsTrackingTarget,
  data: UspsTrackingProofOfDeliveryRequest
): Promise<UspsTrackingProofOfDeliveryResponse> => {
  const res = await tryHandleRequest<UspsTrackingProofOfDeliveryResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.tracking.requestProofOfDelivery",
      method: "POST",
      url: `/tracking/v3/tracking/${encodeURIComponent(trackingNumber)}/proof-of-delivery`,
      data,
      headers: forwardedForHeaders(forwardedFor),
    },
    "USP_0066",
    "Failed to request USPS proof of delivery"
  );
  return res.data;
};

/** 207 is a success status; check each entry for a `statusCode`. */
export const trackPackagesV3r2 = async (
  clientName: string,
  data: UspsTrackingV3r2Request
): Promise<UspsTrackingV3r2Details | UspsTrackingV3r2MultiStatusResponse> => {
  const res = await tryHandleRequest<
    UspsTrackingV3r2Details | UspsTrackingV3r2MultiStatusResponse
  >(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.tracking.trackV3r2",
      method: "POST",
      url: "/tracking/v3r2/tracking",
      data,
    },
    "USP_0067",
    "Failed to track USPS packages (v3r2)"
  );
  return res.data;
};

export const registerTrackingNotificationsV3r2 = async (
  clientName: string,
  { trackingNumber }: UspsTrackingV3r2Target,
  data: UspsTrackingV3r2NotificationRequest
): Promise<UspsTrackingV3r2NotificationAcknowledgement> => {
  const res =
    await tryHandleRequest<UspsTrackingV3r2NotificationAcknowledgement>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName: "usps.tracking.registerNotificationsV3r2",
        method: "POST",
        url: `/tracking/v3r2/tracking/${encodeURIComponent(trackingNumber)}/notifications`,
        data,
      },
      "USP_0068",
      "Failed to register USPS tracking notifications (v3r2)"
    );
  return res.data;
};

export const requestTrackingProofOfDeliveryV3r2 = async (
  clientName: string,
  { trackingNumber }: UspsTrackingV3r2Target,
  data: UspsTrackingV3r2ProofOfDeliveryRequest
): Promise<UspsTrackingV3r2ProofOfDeliveryAcknowledgement> => {
  const res =
    await tryHandleRequest<UspsTrackingV3r2ProofOfDeliveryAcknowledgement>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName: "usps.tracking.requestProofOfDeliveryV3r2",
        method: "POST",
        url: `/tracking/v3r2/tracking/${encodeURIComponent(trackingNumber)}/proof-of-delivery`,
        data,
      },
      "USP_0069",
      "Failed to request USPS proof of delivery (v3r2)"
    );
  return res.data;
};
