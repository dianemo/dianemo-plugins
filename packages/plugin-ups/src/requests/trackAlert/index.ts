import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsTrackAlertSubscriptionParams,
  UpsTrackAlertSubscriptionResponse,
} from "./types.js";

/** A dated-style pin; v2 is the only value the spec lists — see docs/ups-api.md#version-pins */
const TRACK_ALERT_VERSION = "v2";

/**
 * Subscribes tracking numbers to webhook events. Standard and enhanced
 * subscriptions are the same endpoint with a different `{type}` path
 * segment — see docs/ups-api.md#track-alert. UPS answers 200 even when some
 * numbers were rejected; check `invalidTrackingNumbers`.
 */
export const createTrackAlertSubscription = async (
  clientName: string,
  { type, request }: UpsTrackAlertSubscriptionParams
): Promise<UpsTrackAlertSubscriptionResponse> => {
  const res = await tryHandleRequest<UpsTrackAlertSubscriptionResponse>(
    {
      clientName,
      requestName: "ups.trackAlert.createTrackAlertSubscription",
      method: "POST",
      url: `/api/track/${TRACK_ALERT_VERSION}/subscription/${type}/package`,
      data: request,
    },
    "UPS_0047",
    "Failed to create UPS Track Alert subscription"
  );
  return res.data;
};
