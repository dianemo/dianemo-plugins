import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsNcoaChangeOfAddressSearchRequest,
  UspsNcoaSearchResponse,
} from "./types.js";

export const searchUspsChangeOfAddress = async (
  clientName: string,
  data: UspsNcoaChangeOfAddressSearchRequest
): Promise<UspsNcoaSearchResponse> => {
  const res = await tryHandleRequest<UspsNcoaSearchResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.ncoaDataServices.searchUspsChangeOfAddress",
      method: "POST",
      url: "/ncoa-data-services/v3/search",
      data,
    },
    "USP_0093",
    "Failed to search USPS change of address"
  );
  return res.data;
};
