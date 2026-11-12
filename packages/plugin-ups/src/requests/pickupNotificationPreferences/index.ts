import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPickupNotificationAccountPickupGetResponse,
  UpsPickupNotificationAccountPickupModifyResponse,
  UpsPickupNotificationAccountPickupPreference,
  UpsPickupNotificationOptions,
} from "./types.js";

/** See docs/ups-api.md#version-pins; this spec lists `v1` as its only value. */
const PREFERENCES_VERSION = "v1";
const PREFERENCES_PATH = `/api/digital-experience/preferences/${PREFERENCES_VERSION}`;

/** `UUID` and `id_token` only matter for JWT / Auth0 callers, never for OAuth2. */
const authHeaders = ({ uuid, idToken }: UpsPickupNotificationOptions) => ({
  ...(uuid && { UUID: uuid }),
  ...(idToken && { id_token: idToken }),
});

/** Pickup notification preferences for one shipper account. */
export const getPickupNotificationPreferences = async (
  clientName: string,
  options: UpsPickupNotificationOptions
): Promise<UpsPickupNotificationAccountPickupGetResponse> => {
  const query = new URLSearchParams({ account_number: options.accountNumber });
  const res =
    await tryHandleRequest<UpsPickupNotificationAccountPickupGetResponse>(
      {
        clientName,
        requestName:
          "ups.pickupNotificationPreferences.getPickupNotificationPreferences",
        method: "GET",
        url: `${PREFERENCES_PATH}/account-pickup?${query}`,
        headers: authHeaders(options),
      },
      "UPS_0033",
      "Failed to get UPS pickup notification preferences"
    );
  return res.data;
};

/** Replace the pickup notification preferences of one shipper account. */
export const updatePickupNotificationPreferences = async (
  clientName: string,
  options: UpsPickupNotificationOptions,
  data: UpsPickupNotificationAccountPickupPreference
): Promise<UpsPickupNotificationAccountPickupModifyResponse> => {
  const query = new URLSearchParams({ account_number: options.accountNumber });
  const res =
    await tryHandleRequest<UpsPickupNotificationAccountPickupModifyResponse>(
      {
        clientName,
        requestName:
          "ups.pickupNotificationPreferences.updatePickupNotificationPreferences",
        method: "PUT",
        url: `${PREFERENCES_PATH}/account-pickup?${query}`,
        headers: authHeaders(options),
        data,
      },
      "UPS_0034",
      "Failed to update UPS pickup notification preferences"
    );
  return res.data;
};

export type * from "./types.js";
