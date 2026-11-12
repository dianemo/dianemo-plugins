import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExHarmonizedCodeSearchRequest,
  FedExHarmonizedCodeSearchResponse,
} from "./types.js";

export const searchHarmonizedCodes = async (
  clientName: string,
  data: FedExHarmonizedCodeSearchRequest
): Promise<FedExHarmonizedCodeSearchResponse> => {
  const url = "/commodity/v2/hscodes/search";
  const res = await tryHandleRequest<FedExHarmonizedCodeSearchResponse>(
    {
      clientName,
      requestName: "fedex.harmonizedCode.searchHarmonizedCodes",
      method: "POST",
      url,
      data,
      // Required by the spec on this endpoint, alongside content-type.
      headers: { "x-content-type": "application/json" },
    },
    "FDX_0082",
    "Failed to search FedEx harmonized codes"
  );
  return res.data;
};
