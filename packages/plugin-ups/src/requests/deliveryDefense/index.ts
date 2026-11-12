import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsDeliveryDefenseAddressScoreRequest,
  UpsDeliveryDefenseAddressScoreResponse,
} from "./types.js";

/**
 * The version lives in the server URL (`/v1.0`), not a path parameter, and is
 * the only one the spec lists — see docs/ups-api.md#version-pins
 */
const DELIVERY_DEFENSE_PATH = "/api/deliverydefense/external/v1.0";

/**
 * Address Confidence score for a street address. Despite being a lookup it
 * is a POST; UPS also answers 204 with no body when it has nothing to score,
 * so the result may be empty.
 */
export const getDeliveryDefenseAddressScore = async (
  clientName: string,
  data: UpsDeliveryDefenseAddressScoreRequest
): Promise<UpsDeliveryDefenseAddressScoreResponse> => {
  const res = await tryHandleRequest<UpsDeliveryDefenseAddressScoreResponse>(
    {
      clientName,
      requestName: "ups.deliveryDefense.getDeliveryDefenseAddressScore",
      method: "POST",
      url: `${DELIVERY_DEFENSE_PATH}/address/score`,
      data,
    },
    "UPS_0050",
    "Failed to get UPS Delivery Defense address score"
  );
  return res.data;
};
