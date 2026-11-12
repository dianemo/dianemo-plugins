import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsValidateAddressParams,
  UspsAddressResponse,
  UspsAddressCityStateParams,
  UspsAddressCityStateResponse,
  UspsAddressZipCodeParams,
  UspsAddressZipCodeResponse,
} from "./types.js";

export const validateAddress = async (
  clientName: string,
  params: UspsValidateAddressParams
): Promise<UspsAddressResponse> => {
  const res = await tryHandleRequest<UspsAddressResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.addresses.validate",
      method: "GET",
      url: "/addresses/v3/address",
      params,
    },
    "USP_0004",
    "Failed to validate USPS address"
  );
  return res.data;
};

export const getUspsCityState = async (
  clientName: string,
  params: UspsAddressCityStateParams
): Promise<UspsAddressCityStateResponse> => {
  const res = await tryHandleRequest<UspsAddressCityStateResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.addresses.getUspsCityState",
      method: "GET",
      url: "/addresses/v3/city-state",
      params,
    },
    "USP_0051",
    "Failed to look up USPS city and state"
  );
  return res.data;
};

export const getUspsZipCode = async (
  clientName: string,
  params: UspsAddressZipCodeParams
): Promise<UspsAddressZipCodeResponse> => {
  const res = await tryHandleRequest<UspsAddressZipCodeResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.addresses.getUspsZipCode",
      method: "GET",
      url: "/addresses/v3/zipcode",
      params,
    },
    "USP_0052",
    "Failed to look up USPS ZIP Code"
  );
  return res.data;
};
