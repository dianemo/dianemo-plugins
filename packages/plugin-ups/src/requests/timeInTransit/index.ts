import { UpsTimeInTransitRequest, UpsTimeInTransitResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

/** The only version the Time In Transit spec documents — see docs/ups-api.md#version-pins */
const TIME_IN_TRANSIT_VERSION = "v1";

/** Estimated delivery dates for each UPS service between two locations. */
export const getTimeInTransit = async (
  clientName: string,
  data: UpsTimeInTransitRequest
): Promise<UpsTimeInTransitResponse> => {
  const res = await tryHandleRequest<UpsTimeInTransitResponse>(
    {
      clientName,
      requestName: "ups.timeInTransit.getTimeInTransit",
      method: "POST",
      url: `/api/shipments/${TIME_IN_TRANSIT_VERSION}/transittimes`,
      data,
    },
    "UPS_0025",
    "Failed to get UPS time in transit"
  );
  return res.data;
};
