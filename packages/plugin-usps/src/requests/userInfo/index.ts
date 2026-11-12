import { tryHandleRequest } from "@dianemo/plugin-kit";
import type { UspsUserInfoResponse } from "./types.js";
import { uspsSubClient } from "../utils.js";

/**
 * The spec also lists `POST /userinfo` with the same security, response and
 * description and no request body; only the GET is implemented, because the
 * POST carries nothing a caller could vary.
 */
export const getUspsUserInfo = async (
  clientName: string
): Promise<UspsUserInfoResponse> => {
  const res = await tryHandleRequest<UspsUserInfoResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.userInfo.get",
      method: "GET",
      url: "/oauth2-oidc/v3/userinfo",
    },
    "USP_0013",
    "Failed to get USPS user info"
  );
  return res.data;
};
