import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsInternationalServiceStandardParams,
  UspsInternationalServiceStandardResponse,
} from "./types.js";

export const getInternationalServiceStandard = async (
  clientName: string,
  params: UspsInternationalServiceStandardParams
): Promise<UspsInternationalServiceStandardResponse> => {
  const res = await tryHandleRequest<UspsInternationalServiceStandardResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.internationalServiceStandards.getInternationalServiceStandard",
      method: "GET",
      url: "/international-service-standard/v3/international-service-standard",
      params: { ...params },
    },
    "USP_0046",
    "Failed to get USPS international service standard"
  );
  return res.data;
};
