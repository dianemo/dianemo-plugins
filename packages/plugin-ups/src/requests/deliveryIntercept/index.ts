import { tryHandleRequest } from "@dianemo/plugin-kit";
import { randomUUID } from "node:crypto";
import {
  UpsDeliveryInterceptChargesRequestV2,
  UpsDeliveryInterceptChargesResponseV2,
  UpsDeliveryInterceptEligibilityOptionsResponseV2,
  UpsDeliveryInterceptParams,
  UpsDeliveryInterceptRequestV2,
  UpsDeliveryInterceptResponseV2,
} from "./types.js";

/** `v2` is the only valid value and the default — see docs/ups-api.md#version-pins */
const INTERCEPT_VERSION = "v2";

/** Delivery Intercept's own cap, tighter than the 32 the rest of UPS allows. */
const INTERCEPT_TRANS_ID_LENGTH = 14;

/**
 * `platformType` and `inquiryType` are required on every operation but each
 * documents a single valid value, so callers are not asked for them: `XOLT`
 * names the calling application and `U` marks a UPS shipper-initiated intercept.
 * `transId` is set here because the client's default is too long for this API —
 * see docs/ups-api.md#delivery-intercept.
 */
const interceptHeaders = ({ transId }: UpsDeliveryInterceptParams) => ({
  platformType: "XOLT",
  inquiryType: "U",
  "Content-Type": "application/json",
  transId:
    transId ??
    randomUUID().replace(/-/g, "").slice(0, INTERCEPT_TRANS_ID_LENGTH),
});

const interceptUrl = (
  path: string,
  { trackingNumber, loc }: UpsDeliveryInterceptParams
): string => {
  const query = loc ? `?loc=${encodeURIComponent(loc)}` : "";
  return `/api/deliveryintercept/${INTERCEPT_VERSION}/${path}/${encodeURIComponent(trackingNumber)}${query}`;
};

/** Quote the accessorial and transportation charges for one or more intercept options. */
export const getDeliveryInterceptCharges = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptChargesRequestV2
): Promise<UpsDeliveryInterceptChargesResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptChargesResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.getDeliveryInterceptCharges",
      method: "POST",
      url: interceptUrl("charges", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0085",
    "Failed to get UPS delivery intercept charges"
  );
  return res.data;
};

/** Which intercept options a package is eligible for, and the dates or return reasons on offer. */
export const getDeliveryInterceptEligibility = async (
  clientName: string,
  params: UpsDeliveryInterceptParams
): Promise<UpsDeliveryInterceptEligibilityOptionsResponseV2> => {
  const res =
    await tryHandleRequest<UpsDeliveryInterceptEligibilityOptionsResponseV2>(
      {
        clientName,
        requestName: "ups.deliveryIntercept.getDeliveryInterceptEligibility",
        method: "GET",
        url: interceptUrl("eligibility/intercept", params),
        headers: interceptHeaders(params),
      },
      "UPS_0086",
      "Failed to get UPS delivery intercept eligibility"
    );
  return res.data;
};

/** Redirect a package to a new delivery address (`requestType` `AA`). */
export const redirectDeliveryInterceptToAddress = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptRequestV2
): Promise<UpsDeliveryInterceptResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.redirectDeliveryInterceptToAddress",
      method: "POST",
      url: interceptUrl("redirect/address", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0087",
    "Failed to redirect UPS delivery intercept to address"
  );
  return res.data;
};

/** Hold a package at a UPS location for pickup (`requestType` `WC`, or `SC` for same day). */
export const requestDeliveryInterceptWillCall = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptRequestV2
): Promise<UpsDeliveryInterceptResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.requestDeliveryInterceptWillCall",
      method: "POST",
      url: interceptUrl("willcall", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0088",
    "Failed to request UPS delivery intercept will call"
  );
  return res.data;
};

/** Return a package to its sender (`requestType` `RS`); `reasonForReturn` is required for it. */
export const requestDeliveryInterceptReturn = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptRequestV2
): Promise<UpsDeliveryInterceptResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.requestDeliveryInterceptReturn",
      method: "POST",
      url: interceptUrl("return", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0089",
    "Failed to request UPS delivery intercept return"
  );
  return res.data;
};

/** Move a delivery to a later date (`requestType` `FD`); `deliveryDate` is required for it. */
export const rescheduleDeliveryIntercept = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptRequestV2
): Promise<UpsDeliveryInterceptResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.rescheduleDeliveryIntercept",
      method: "POST",
      url: interceptUrl("reschedule", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0090",
    "Failed to reschedule UPS delivery intercept"
  );
  return res.data;
};

/** Cancel an intercept previously applied to the package. */
export const cancelDeliveryIntercept = async (
  clientName: string,
  params: UpsDeliveryInterceptParams,
  data: UpsDeliveryInterceptRequestV2
): Promise<UpsDeliveryInterceptResponseV2> => {
  const res = await tryHandleRequest<UpsDeliveryInterceptResponseV2>(
    {
      clientName,
      requestName: "ups.deliveryIntercept.cancelDeliveryIntercept",
      method: "POST",
      url: interceptUrl("cancel", params),
      headers: interceptHeaders(params),
      data,
    },
    "UPS_0091",
    "Failed to cancel UPS delivery intercept"
  );
  return res.data;
};
