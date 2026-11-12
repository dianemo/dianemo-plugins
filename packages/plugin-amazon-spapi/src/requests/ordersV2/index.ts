import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { QueryData } from "../types.js";
import {
  V2GetOrderResponse,
  V2IncludedData,
  V2SearchOrdersResponse,
} from "./types.js";

/**
 * The 2026-01-01 Orders API, which is a different resource from `orders/v0`
 * rather than a revision of it: it pages differently, names its fields
 * differently, and selects optional sections with `includedData` instead of the
 * v0 restricted-data-token dance. Both are live; neither supersedes the other
 * in this plugin.
 */
export const searchOrders = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryData: QueryData,
  includedData?: V2IncludedData[]
): Promise<V2SearchOrdersResponse> => {
  const params: QueryData = { ...queryData };
  if (includedData) params.includedData = includedData;
  const res = await handleSpapiRequest<V2SearchOrdersResponse>(
    clientName,
    awsRegion,
    "AMZ_0076",
    "Failed to search Amazon orders",
    {
      endpoint: "ordersV2SearchOrders",
      url: `/orders/2026-01-01/orders`,
      params,
    },
    "amazonSpapi.ordersV2.searchOrders"
  );
  return res.data;
};

export const getOrder = async (
  clientName: string,
  awsRegion: AwsRegion,
  orderId: string,
  includedData?: V2IncludedData[]
): Promise<V2GetOrderResponse> => {
  const params: QueryData = {};
  if (includedData) params.includedData = includedData;
  const res = await handleSpapiRequest<V2GetOrderResponse>(
    clientName,
    awsRegion,
    "AMZ_0077",
    "Failed to get Amazon order",
    {
      endpoint: "ordersV2GetOrder",
      url: `/orders/2026-01-01/orders/${orderId}`,
      // Omitted rather than passed empty: handleSpapiRequest appends `?` plus
      // the serialised params whenever `params` is set, so `{}` would put a
      // bare `?` on the URL.
      params: Object.keys(params).length ? params : undefined,
    },
    "amazonSpapi.ordersV2.getOrder"
  );
  return res.data;
};
