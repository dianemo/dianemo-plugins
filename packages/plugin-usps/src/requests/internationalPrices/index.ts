import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsInternationalPriceBaseRatesQuery,
  UspsInternationalPriceExtraServiceRateDetails,
  UspsInternationalPriceExtraServiceRateQuery,
  UspsInternationalPriceLetterRatesOption,
  UspsInternationalPriceLetterRatesQuery,
  UspsInternationalPriceRateListQuery,
  UspsInternationalPriceRateListQueryResult,
  UspsInternationalPriceRateOption,
  UspsInternationalPriceTotalRatesQuery,
  UspsInternationalPriceTotalRatesQueryResult,
} from "./types.js";

// No payment token is required here, and the spec states no quota; the
// conservative `default` group applies by this repo's decision.

export const searchInternationalBaseRates = async (
  clientName: string,
  data: UspsInternationalPriceBaseRatesQuery
): Promise<UspsInternationalPriceRateOption> => {
  const res = await tryHandleRequest<UspsInternationalPriceRateOption>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.internationalPrices.searchInternationalBaseRates",
      method: "POST",
      url: "/international-prices/v3/base-rates/search",
      data,
    },
    "USP_0041",
    "Failed to search USPS international base rates"
  );
  return res.data;
};

export const searchInternationalExtraServiceRates = async (
  clientName: string,
  data: UspsInternationalPriceExtraServiceRateQuery
): Promise<UspsInternationalPriceExtraServiceRateDetails> => {
  const res =
    await tryHandleRequest<UspsInternationalPriceExtraServiceRateDetails>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName:
          "usps.internationalPrices.searchInternationalExtraServiceRates",
        method: "POST",
        url: "/international-prices/v3/extra-service-rates/search",
        data,
      },
      "USP_0042",
      "Failed to search USPS international extra service rates"
    );
  return res.data;
};

export const searchInternationalBaseRatesList = async (
  clientName: string,
  data: UspsInternationalPriceRateListQuery
): Promise<UspsInternationalPriceRateListQueryResult> => {
  const res = await tryHandleRequest<UspsInternationalPriceRateListQueryResult>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.internationalPrices.searchInternationalBaseRatesList",
      method: "POST",
      url: "/international-prices/v3/base-rates-list/search",
      data,
    },
    "USP_0043",
    "Failed to search USPS international base rates list"
  );
  return res.data;
};

export const searchInternationalTotalRates = async (
  clientName: string,
  data: UspsInternationalPriceTotalRatesQuery
): Promise<UspsInternationalPriceTotalRatesQueryResult> => {
  const res =
    await tryHandleRequest<UspsInternationalPriceTotalRatesQueryResult>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName: "usps.internationalPrices.searchInternationalTotalRates",
        method: "POST",
        url: "/international-prices/v3/total-rates/search",
        data,
      },
      "USP_0044",
      "Failed to search USPS international total rates"
    );
  return res.data;
};

export const searchInternationalLetterRates = async (
  clientName: string,
  data: UspsInternationalPriceLetterRatesQuery
): Promise<UspsInternationalPriceLetterRatesOption> => {
  const res = await tryHandleRequest<UspsInternationalPriceLetterRatesOption>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.internationalPrices.searchInternationalLetterRates",
      method: "POST",
      url: "/international-prices/v3/letter-rates/search",
      data,
    },
    "USP_0045",
    "Failed to search USPS international letter rates"
  );
  return res.data;
};
