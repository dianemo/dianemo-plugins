import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExLocationFindLocationsRequest,
  FedExLocationFindLocationsResponse,
} from "./types.js";

export const findLocations = async (
  clientName: string,
  data: FedExLocationFindLocationsRequest
): Promise<FedExLocationFindLocationsResponse> => {
  const url = "/location/v1/locations";
  const res = await tryHandleRequest<FedExLocationFindLocationsResponse>(
    {
      clientName,
      requestName: "fedex.locationSearch.findLocations",
      method: "POST",
      url,
      data,
    },
    "FDX_0073",
    "Failed to find FedEx locations"
  );
  return res.data;
};
