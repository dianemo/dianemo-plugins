import { FedExGlobalTradeRequest, FedExGlobalTradeResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const retrieveRegulatoryDetails = async (
  clientName: string,
  data: FedExGlobalTradeRequest
): Promise<FedExGlobalTradeResponse> => {
  const url = "/globaltrade/v1/shipments/regulatorydetails/retrieve";
  const res = await tryHandleRequest<FedExGlobalTradeResponse>(
    {
      clientName,
      requestName: "fedex.globalTrade.retrieveRegulatoryDetails",
      method: "POST",
      url,
      data,
    },
    "FDX_0081",
    "Failed to retrieve FedEx regulatory details"
  );
  return res.data;
};
