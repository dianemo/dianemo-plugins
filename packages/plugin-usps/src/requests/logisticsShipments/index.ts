import type { UspsLogisticsShipmentTrackingEvent } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";

export const createShipmentTrackingEvent = async (
  clientName: string,
  data: UspsLogisticsShipmentTrackingEvent
): Promise<UspsLogisticsShipmentTrackingEvent> => {
  const res = await tryHandleRequest<UspsLogisticsShipmentTrackingEvent>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.logisticsShipments.createShipmentTrackingEvent",
      method: "POST",
      url: "/logistics/v3/shipment-tracking",
      data,
    },
    "USP_0088",
    "Failed to create USPS shipment tracking event"
  );
  return res.data;
};
