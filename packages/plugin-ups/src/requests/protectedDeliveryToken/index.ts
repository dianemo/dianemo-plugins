import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsProtectedDeliveryEpraParams,
  UpsProtectedDeliveryEpraResponse,
  UpsProtectedDeliveryGenerateTokenRequest,
  UpsProtectedDeliveryGenerateTokenResponse,
  UpsProtectedDeliveryGetPinByTokenResponse,
  UpsProtectedDeliveryGetPinsForTrackingNumberListRequest,
  UpsProtectedDeliveryGetPinsForTrackingNumberListResponse,
  UpsProtectedDeliveryPinByTokenParams,
} from "./types.js";

/** `v1` is the only valid value and the default — see docs/ups-api.md#version-pins */
const PROTECTED_DELIVERY_VERSION = "v1";

const BASE = `/api/pin-mgmt-sys/${PROTECTED_DELIVERY_VERSION}/pins`;

/** Exchange a shipper-chosen PIN for a token that can be handed on without exposing the PIN. */
export const generateProtectedDeliveryToken = async (
  clientName: string,
  data: UpsProtectedDeliveryGenerateTokenRequest
): Promise<UpsProtectedDeliveryGenerateTokenResponse> => {
  const res = await tryHandleRequest<UpsProtectedDeliveryGenerateTokenResponse>(
    {
      clientName,
      requestName: "ups.protectedDeliveryToken.generateProtectedDeliveryToken",
      method: "POST",
      url: `${BASE}/token`,
      data,
    },
    "UPS_0092",
    "Failed to generate UPS protected delivery token"
  );
  return res.data;
};

/** Redeem a token from `generateProtectedDeliveryToken` for the PIN behind it. */
export const getProtectedDeliveryPinByToken = async (
  clientName: string,
  { userToken }: UpsProtectedDeliveryPinByTokenParams
): Promise<UpsProtectedDeliveryGetPinByTokenResponse> => {
  const res = await tryHandleRequest<UpsProtectedDeliveryGetPinByTokenResponse>(
    {
      clientName,
      requestName: "ups.protectedDeliveryToken.getProtectedDeliveryPinByToken",
      method: "GET",
      url: `${BASE}/token`,
      headers: { "X-UserToken": userToken },
    },
    "UPS_0093",
    "Failed to get UPS protected delivery PIN by token"
  );
  return res.data;
};

/** Look up the PINs for a list of tracking numbers. */
export const getProtectedDeliveryPins = async (
  clientName: string,
  data: UpsProtectedDeliveryGetPinsForTrackingNumberListRequest
): Promise<UpsProtectedDeliveryGetPinsForTrackingNumberListResponse> => {
  const res =
    await tryHandleRequest<UpsProtectedDeliveryGetPinsForTrackingNumberListResponse>(
      {
        clientName,
        requestName: "ups.protectedDeliveryToken.getProtectedDeliveryPins",
        method: "POST",
        url: `${BASE}/retrieve`,
        data,
      },
      "UPS_0094",
      "Failed to get UPS protected delivery PINs"
    );
  return res.data;
};

/**
 * The EPRA release code and follow-up actions for a package. The spec puts the
 * tracking number and an `Authorization` header in the request headers of a GET.
 * The `Authorization` is the client's own bearer token, which core sets after
 * every request-level header, so there is nothing for a caller to pass — see
 * docs/ups-api.md#protected-delivery-token.
 */
export const getProtectedDeliveryEpraCode = async (
  clientName: string,
  { trackingNumber, action, epra }: UpsProtectedDeliveryEpraParams
): Promise<UpsProtectedDeliveryEpraResponse> => {
  const query = action ? `?action=${encodeURIComponent(action)}` : "";
  const res = await tryHandleRequest<UpsProtectedDeliveryEpraResponse>(
    {
      clientName,
      requestName: "ups.protectedDeliveryToken.getProtectedDeliveryEpraCode",
      method: "GET",
      url: `${BASE}/epra${query}`,
      headers: {
        trackingNumber,
        ...(epra ? { epra } : {}),
      },
    },
    "UPS_0095",
    "Failed to get UPS protected delivery EPRA code"
  );
  return res.data;
};
