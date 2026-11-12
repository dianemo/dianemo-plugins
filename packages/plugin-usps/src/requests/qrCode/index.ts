import type { UspsQrCodeRequest, UspsQrCodeSearchResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";

export const searchUspsQrCode = async (
  clientName: string,
  data: UspsQrCodeRequest
): Promise<UspsQrCodeSearchResponse> => {
  const res = await tryHandleRequest<UspsQrCodeSearchResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.qrCode.searchUspsQrCode",
      method: "POST",
      url: "/qr-code/v3/search",
      data,
    },
    "USP_0090",
    "Failed to search for USPS locker QR code"
  );
  return res.data;
};
