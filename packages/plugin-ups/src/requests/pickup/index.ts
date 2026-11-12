import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPickupCreationRequest,
  UpsPickupCreationResponse,
  UpsPickupCancelResponse,
  UpsPickupGetPoliticalDivision1ListResponse,
  UpsPickupGetServiceCenterFacilitiesRequest,
  UpsPickupGetServiceCenterFacilitiesResponse,
  UpsPickupPendingStatusResponse,
  UpsPickupPendingStatusOptions,
  UpsPickupPoliticalDivisionsOptions,
  UpsPickupRateRequest,
  UpsPickupRateResponse,
  UpsPickupTriggerGWNRequest,
  UpsPickupTriggerGWNResponse,
  UpsPickupType,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const PICKUP_VERSION = "v2409";

/**
 * Schedule a UPS on-call pickup. Returns the PRN (Pickup Request Number).
 *
 * The same endpoint also takes a `PickupTriggerGWNRequest`, which triggers a
 * Smart Pickup instead of creating an on-call one; the response is that
 * trigger's own shape — see docs/ups-api.md#pickup-operations.
 */
export async function createPickup(
  clientName: string,
  data: UpsPickupCreationRequest
): Promise<UpsPickupCreationResponse>;
export async function createPickup(
  clientName: string,
  data: UpsPickupTriggerGWNRequest
): Promise<UpsPickupTriggerGWNResponse>;
export async function createPickup(
  clientName: string,
  data: UpsPickupCreationRequest | UpsPickupTriggerGWNRequest
): Promise<UpsPickupCreationResponse | UpsPickupTriggerGWNResponse> {
  const res = await tryHandleRequest<
    UpsPickupCreationResponse | UpsPickupTriggerGWNResponse
  >(
    {
      clientName,
      requestName: "ups.pickup.create",
      method: "POST",
      url: `/api/pickupcreation/${PICKUP_VERSION}/pickup`,
      data,
    },
    "UPS_0010",
    "Failed to create UPS pickup"
  );
  return res.data;
}

/**
 * Cancel a UPS on-call pickup by PRN.
 *
 * The trailing `02` is Cancel's `CancelBy` — `01` cancels by account number
 * instead (see `cancelPickupByAccountNumber`). It is a different enum from the
 * one on the Rate path below; see docs/ups-api.md#pickup-path-segments.
 */
export const cancelPickup = async (
  clientName: string,
  prn: string
): Promise<UpsPickupCancelResponse> => {
  const res = await tryHandleRequest<UpsPickupCancelResponse>(
    {
      clientName,
      requestName: "ups.pickup.cancel",
      method: "DELETE",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/02`,
      headers: { Prn: prn },
    },
    "UPS_0011",
    "Failed to cancel UPS pickup"
  );
  return res.data;
};

/**
 * Cancel by account number (`CancelBy` = `01`): the spec sends no `Prn` header
 * and no account number on this path, so which account is cancelled is not
 * visible from the request — see docs/ups-api.md#pickup-operations. Has its
 * own code: `UPS_0011` stays on `cancelPickup`, which predates this function.
 */
export const cancelPickupByAccountNumber = async (
  clientName: string
): Promise<UpsPickupCancelResponse> => {
  const res = await tryHandleRequest<UpsPickupCancelResponse>(
    {
      clientName,
      requestName: "ups.pickup.cancelByAccountNumber",
      method: "DELETE",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/01`,
    },
    "UPS_0043",
    "Failed to cancel UPS pickup"
  );
  return res.data;
};

/**
 * Get a pickup rate estimate without scheduling.
 *
 * The trailing segment is `pickuptype` and takes a name, not a code. It used to
 * send `01` — a value from Cancel's `CancelBy` enum — so this endpoint had never
 * worked, which is why the fix looks arbitrary:
 * docs/ups-api.md#pickup-path-segments.
 */
export const getPickupRate = async (
  clientName: string,
  data: UpsPickupRateRequest,
  pickupType: UpsPickupType = "oncall"
): Promise<UpsPickupRateResponse> => {
  const res = await tryHandleRequest<UpsPickupRateResponse>(
    {
      clientName,
      requestName: "ups.pickup.getRate",
      method: "POST",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/${pickupType}`,
      data,
    },
    "UPS_0012",
    "Failed to get UPS pickup rate"
  );
  return res.data;
};

/** Pending pickups on an account. `pickuptype` is the same enum as Rate's. */
export const getPickupPendingStatus = async (
  clientName: string,
  { accountNumber, pickupType }: UpsPickupPendingStatusOptions
): Promise<UpsPickupPendingStatusResponse> => {
  const res = await tryHandleRequest<UpsPickupPendingStatusResponse>(
    {
      clientName,
      requestName: "ups.pickup.getPendingStatus",
      method: "GET",
      url: `/api/shipments/${PICKUP_VERSION}/pickup/${pickupType}`,
      headers: { AccountNumber: accountNumber },
    },
    "UPS_0030",
    "Failed to get UPS pickup pending status"
  );
  return res.data;
};

/** The Political Division 1 (state / province) list for a country. */
export const getPickupPoliticalDivisions = async (
  clientName: string,
  { countryCode }: UpsPickupPoliticalDivisionsOptions
): Promise<UpsPickupGetPoliticalDivision1ListResponse> => {
  const res =
    await tryHandleRequest<UpsPickupGetPoliticalDivision1ListResponse>(
      {
        clientName,
        requestName: "ups.pickup.getPoliticalDivisions",
        method: "GET",
        url: `/api/pickup/${PICKUP_VERSION}/countries/${encodeURIComponent(countryCode)}`,
      },
      "UPS_0031",
      "Failed to get UPS pickup political divisions"
    );
  return res.data;
};

/** Drop-off and pickup service centre facilities near an origin address. */
export const getPickupServiceCenterFacilities = async (
  clientName: string,
  data: UpsPickupGetServiceCenterFacilitiesRequest
): Promise<UpsPickupGetServiceCenterFacilitiesResponse> => {
  const res =
    await tryHandleRequest<UpsPickupGetServiceCenterFacilitiesResponse>(
      {
        clientName,
        requestName: "ups.pickup.getServiceCenterFacilities",
        method: "POST",
        url: `/api/pickup/${PICKUP_VERSION}/servicecenterlocations`,
        data,
      },
      "UPS_0032",
      "Failed to get UPS pickup service center facilities"
    );
  return res.data;
};

export type * from "./types.js";
