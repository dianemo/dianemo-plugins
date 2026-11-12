import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import { singlePickup } from "./utils.js";
import type {
  UspsPickupEligibilityParams,
  UspsPickupEligibilityResponse,
  UspsSchedulePickupRequest,
  UspsPickupConfirmation,
  UspsPickupDetails,
  UspsPickupGetOptions,
  UspsPickupGetResult,
  UspsPickupNotModified,
  UspsPickupUpdateOptions,
  UspsPickupUpdateResult,
} from "./types.js";

export const checkEligibility = async (
  clientName: string,
  params: UspsPickupEligibilityParams
): Promise<UspsPickupEligibilityResponse> => {
  const res = await tryHandleRequest<UspsPickupEligibilityResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.eligibility",
      method: "GET",
      url: "/pickup/v3/carrier-pickup/eligibility",
      params,
    },
    "USP_0010",
    "Failed to check USPS pickup eligibility"
  );
  return res.data;
};

export const schedulePickup = async (
  clientName: string,
  data: UspsSchedulePickupRequest
): Promise<UspsPickupConfirmation> => {
  const res = await tryHandleRequest<UspsPickupConfirmation>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.schedule",
      method: "POST",
      url: "/pickup/v3/carrier-pickup",
      data,
    },
    "USP_0006",
    "Failed to schedule USPS pickup"
  );
  return res.data;
};

const isSuccessOrNotModified = (status: number) =>
  (status >= 200 && status < 300) || status === 304;

/**
 * `pickup` is one object, as v2.0.0 returned and as USPS's example shows. The
 * spec's schema says array, so an array body is unwrapped to its only element;
 * more than one is not something a confirmation number can mean, and is
 * rejected rather than silently trimmed. See docs/usps-api.md#pickups.
 *
 * With `ifNoneMatch` a 304 resolves to `UspsPickupNotModified`. Axios rejects a
 * 304 by default, so the per-request `validateStatus` is set only in that case:
 * passing it as `undefined` would make axios accept every status.
 */
export async function getPickup(
  clientName: string,
  confirmationNumber: string,
  options?: { ifNoneMatch?: undefined }
): Promise<UspsPickupGetResult>;
export async function getPickup(
  clientName: string,
  confirmationNumber: string,
  options: UspsPickupGetOptions
): Promise<UspsPickupGetResult | UspsPickupNotModified>;
export async function getPickup(
  clientName: string,
  confirmationNumber: string,
  options: UspsPickupGetOptions = {}
): Promise<UspsPickupGetResult | UspsPickupNotModified> {
  const res = await tryHandleRequest<UspsPickupDetails | UspsPickupDetails[]>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.get",
      method: "GET",
      url: `/pickup/v3/carrier-pickup/${encodeURIComponent(confirmationNumber)}`,
      headers: options.ifNoneMatch
        ? { "If-None-Match": options.ifNoneMatch }
        : undefined,
      ...(options.ifNoneMatch
        ? { validateStatus: isSuccessOrNotModified }
        : {}),
    },
    "USP_0011",
    "Failed to get USPS pickup details"
  );
  const etag = (res.headers?.["etag"] as string | undefined) ?? "";
  if (res.status === 304)
    return { notModified: true, etag: etag || (options.ifNoneMatch ?? "") };
  return {
    pickup: singlePickup(res.data, confirmationNumber),
    etag,
  };
}

export const cancelPickup = async (
  clientName: string,
  confirmationNumber: string,
  etag: string
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.cancel",
      method: "DELETE",
      url: `/pickup/v3/carrier-pickup/${encodeURIComponent(confirmationNumber)}`,
      headers: {
        "If-Match": etag,
      },
    },
    "USP_0007",
    "Failed to cancel USPS pickup"
  );
};

export const updatePickup = async (
  clientName: string,
  { confirmationNumber, ifMatch }: UspsPickupUpdateOptions,
  data: UspsPickupConfirmation
): Promise<UspsPickupUpdateResult> => {
  const res = await tryHandleRequest<UspsPickupConfirmation>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.pickups.update",
      method: "PUT",
      url: `/pickup/v3/carrier-pickup/${encodeURIComponent(confirmationNumber)}`,
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0070",
    "Failed to update USPS pickup"
  );
  return {
    pickup: res.data,
    etag: (res.headers?.["etag"] as string) ?? "",
  };
};
