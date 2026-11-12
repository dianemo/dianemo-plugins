import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsTotalRatesQuery,
  UspsTotalRatesResult,
  UspsBaseRatesListQuery,
  UspsBaseRatesListResult,
  UspsRateBaseRatesQuery,
  UspsRateBaseRatesResult,
  UspsRateExtraServiceQuery,
  UspsRateExtraServiceResult,
  UspsRateExtraServiceSearchQuery,
  UspsRateExtraServiceSingleQuery,
  UspsRateExtraServiceSingleResult,
  UspsRateLetterQuery,
  UspsRateLetterResult,
} from "./types.js";

export const getTotalRates = async (
  clientName: string,
  data: UspsTotalRatesQuery
): Promise<UspsTotalRatesResult> => {
  const res = await tryHandleRequest<UspsTotalRatesResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.totalSearch",
      method: "POST",
      url: "/prices/v3/total-rates/search",
      data,
    },
    "USP_0002",
    "Failed to get USPS domestic rates"
  );
  return res.data;
};

export const getBaseRatesList = async (
  clientName: string,
  data: UspsBaseRatesListQuery
): Promise<UspsBaseRatesListResult> => {
  const res = await tryHandleRequest<UspsBaseRatesListResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.baseListSearch",
      method: "POST",
      url: "/prices/v3/base-rates-list/search",
      data,
    },
    "USP_0009",
    "Failed to get USPS base rates list"
  );
  return res.data;
};

export const searchBaseRates = async (
  clientName: string,
  data: UspsRateBaseRatesQuery
): Promise<UspsRateBaseRatesResult> => {
  const res = await tryHandleRequest<UspsRateBaseRatesResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.searchBaseRates",
      method: "POST",
      url: "/prices/v3/base-rates/search",
      data,
    },
    "USP_0053",
    "Failed to search USPS base rates"
  );
  return res.data;
};

export function searchExtraServiceRates(
  clientName: string,
  data: UspsRateExtraServiceQuery
): Promise<UspsRateExtraServiceResult>;
export function searchExtraServiceRates(
  clientName: string,
  data: UspsRateExtraServiceSingleQuery
): Promise<UspsRateExtraServiceSingleResult>;
export function searchExtraServiceRates(
  clientName: string,
  data: UspsRateExtraServiceSearchQuery
): Promise<UspsRateExtraServiceSingleResult>;
export async function searchExtraServiceRates(
  clientName: string,
  data: UspsRateExtraServiceSearchQuery
): Promise<UspsRateExtraServiceSingleResult> {
  const res = await tryHandleRequest<UspsRateExtraServiceSingleResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.searchExtraServiceRates",
      method: "POST",
      url: "/prices/v3/extra-service-rates/search",
      data,
    },
    "USP_0054",
    "Failed to search USPS extra service rates"
  );
  return res.data;
}

export const searchLetterRates = async (
  clientName: string,
  data: UspsRateLetterQuery
): Promise<UspsRateLetterResult> => {
  const res = await tryHandleRequest<UspsRateLetterResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.rates.searchLetterRates",
      method: "POST",
      url: "/prices/v3/letter-rates/search",
      data,
    },
    "USP_0055",
    "Failed to search USPS letter rates"
  );
  return res.data;
};
