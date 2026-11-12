import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsWorldEaseChildShipmentRef,
  UpsWorldEaseCloseoutResponse,
  UpsWorldEaseDeleteResponse,
  UpsWorldEaseMasterShipmentRef,
  UpsWorldEaseShipperRequest,
} from "./types.js";

/** `v1` is the only value the spec allows — see docs/ups-api.md#version-pins */
const WORLD_EASE_VERSION = "v1";
const BASE = `/api/ship/${WORLD_EASE_VERSION}`;

/**
 * Close out a WorldEase master shipment. UPS answers 202, so the label is
 * returned with the acceptance.
 */
export const closeoutWorldEaseMasterShipment = async (
  clientName: string,
  { shipmentGccn }: UpsWorldEaseMasterShipmentRef,
  data: UpsWorldEaseShipperRequest
): Promise<UpsWorldEaseCloseoutResponse> => {
  const res = await tryHandleRequest<UpsWorldEaseCloseoutResponse>(
    {
      clientName,
      requestName: "ups.worldEase.closeoutWorldEaseMasterShipment",
      method: "POST",
      url: `${BASE}/master-shipment/closeout/${encodeURIComponent(shipmentGccn)}`,
      data,
    },
    "UPS_0082",
    "Failed to close out UPS WorldEase master shipment"
  );
  return res.data;
};

/**
 * Delete a WorldEase master shipment. The spec puts the shipper account
 * number in a request body on a DELETE, which some proxies drop — see
 * docs/ups-api.md#worldease-shipment-management
 */
export const deleteWorldEaseMasterShipment = async (
  clientName: string,
  { shipmentGccn }: UpsWorldEaseMasterShipmentRef,
  data: UpsWorldEaseShipperRequest
): Promise<UpsWorldEaseDeleteResponse> => {
  const res = await tryHandleRequest<UpsWorldEaseDeleteResponse>(
    {
      clientName,
      requestName: "ups.worldEase.deleteWorldEaseMasterShipment",
      method: "DELETE",
      url: `${BASE}/master-shipment/${encodeURIComponent(shipmentGccn)}`,
      data,
    },
    "UPS_0083",
    "Failed to delete UPS WorldEase master shipment"
  );
  return res.data;
};

/**
 * Delete one child shipment. The spec's path template says
 * `{tracking-number}` but its parameter is named `trackingNumber`; the
 * position is unambiguous, so the URL is built from the template.
 */
export const deleteWorldEaseChildShipment = async (
  clientName: string,
  { shipmentGccn, trackingNumber }: UpsWorldEaseChildShipmentRef
): Promise<UpsWorldEaseDeleteResponse> => {
  const res = await tryHandleRequest<UpsWorldEaseDeleteResponse>(
    {
      clientName,
      requestName: "ups.worldEase.deleteWorldEaseChildShipment",
      method: "DELETE",
      url: `${BASE}/child-shipment/${encodeURIComponent(shipmentGccn)}/${encodeURIComponent(trackingNumber)}`,
    },
    "UPS_0084",
    "Failed to delete UPS WorldEase child shipment"
  );
  return res.data;
};
