import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsSmartPickupRequestV1,
  UpsSmartPickupResponseV1,
  UpsSmartPickupUpdatePickupInfoRequestV1,
  UpsSmartPickupUpdatePickupInfoResponseV1,
  UpsSmartPickupViewPickupInfoRequestV1,
  UpsSmartPickupViewPickupInfoResponseV1,
} from "./types.js";

/** See docs/ups-api.md#version-pins; this spec lists `v1` as its only value. */
const SMART_PICKUP_VERSION = "v1";
const SMART_PICKUP_PATH = `/api/account/pickup-info/${SMART_PICKUP_VERSION}`;

/** Inquire, add or update an account's Smart Pickup trigger (`Action` I / A / U). */
export const manageSmartPickupTrigger = async (
  clientName: string,
  data: UpsSmartPickupRequestV1
): Promise<UpsSmartPickupResponseV1> => {
  const res = await tryHandleRequest<UpsSmartPickupResponseV1>(
    {
      clientName,
      requestName: "ups.smartPickup.manageSmartPickupTrigger",
      method: "POST",
      url: `${SMART_PICKUP_PATH}/smart-trigger`,
      data,
    },
    "UPS_0035",
    "Failed to manage UPS Smart Pickup trigger"
  );
  return res.data;
};

/** View an account's Smart Pickup information. A POST, though it only reads. */
export const viewSmartPickupInfo = async (
  clientName: string,
  data: UpsSmartPickupViewPickupInfoRequestV1
): Promise<UpsSmartPickupViewPickupInfoResponseV1> => {
  const res = await tryHandleRequest<UpsSmartPickupViewPickupInfoResponseV1>(
    {
      clientName,
      requestName: "ups.smartPickup.viewSmartPickupInfo",
      method: "POST",
      url: `${SMART_PICKUP_PATH}/view`,
      data,
    },
    "UPS_0036",
    "Failed to view UPS Smart Pickup info"
  );
  return res.data;
};

/** Update an account's Smart Pickup information. */
export const updateSmartPickupInfo = async (
  clientName: string,
  data: UpsSmartPickupUpdatePickupInfoRequestV1
): Promise<UpsSmartPickupUpdatePickupInfoResponseV1> => {
  const res = await tryHandleRequest<UpsSmartPickupUpdatePickupInfoResponseV1>(
    {
      clientName,
      requestName: "ups.smartPickup.updateSmartPickupInfo",
      method: "POST",
      url: `${SMART_PICKUP_PATH}/update`,
      data,
    },
    "UPS_0037",
    "Failed to update UPS Smart Pickup info"
  );
  return res.data;
};

export type * from "./types.js";
