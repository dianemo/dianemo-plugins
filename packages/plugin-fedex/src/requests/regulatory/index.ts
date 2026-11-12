import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExRegulatoryProfileRequest,
  FedExRegulatoryProfileResponse,
} from "./types.js";

export const getRegulatoryProfile = async (
  clientName: string,
  data: FedExRegulatoryProfileRequest
): Promise<FedExRegulatoryProfileResponse> => {
  const url = "/regulatory/v1/profiles";
  const res = await tryHandleRequest<FedExRegulatoryProfileResponse>(
    {
      clientName,
      requestName: "fedex.regulatory.getRegulatoryProfile",
      method: "POST",
      url,
      data,
    },
    "FDX_0083",
    "Failed to submit FedEx regulatory profile"
  );
  return res.data;
};
