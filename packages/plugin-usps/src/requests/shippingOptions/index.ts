import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsShippingOptionRequest,
  UspsShippingOptionResponse,
} from "./types.js";

export const searchShippingOptions = async (
  clientName: string,
  data: UspsShippingOptionRequest
): Promise<UspsShippingOptionResponse> => {
  const res = await tryHandleRequest<UspsShippingOptionResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.shippingOptions.searchShippingOptions",
      method: "POST",
      url: "/shipments/v3/options/search",
      data,
    },
    "USP_0056",
    "Failed to search USPS shipping options"
  );
  return res.data;
};
