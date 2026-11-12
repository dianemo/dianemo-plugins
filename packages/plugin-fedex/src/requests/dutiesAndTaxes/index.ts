import { FedExDutiesTaxesRequest, FedExDutiesTaxesResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";

export const estimateDutiesAndTaxes = async (
  clientName: string,
  data: FedExDutiesTaxesRequest
): Promise<FedExDutiesTaxesResponse> => {
  const url = "/dutytax/v1/estimate";
  const res = await tryHandleRequest<FedExDutiesTaxesResponse>(
    {
      clientName,
      requestName: "fedex.dutiesAndTaxes.estimateDutiesAndTaxes",
      method: "POST",
      url,
      data,
      // Required by the spec on this endpoint, alongside content-type.
      headers: { "x-content-type": "application/json" },
    },
    "FDX_0080",
    "Failed to estimate FedEx duties and taxes"
  );
  return res.data;
};
