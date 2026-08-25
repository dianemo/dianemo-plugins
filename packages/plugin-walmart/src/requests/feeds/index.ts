import { tryHandleRequest } from "@dianemo/plugin-kit";
import { WalmartMarket } from "../items/types.js";
import globalHeaders from "../globalHeaders.js";
import FormData from "form-data";
import {
  GetFeedStatusParams,
  WalmartFeedResponse,
  WalmartFeedStatusResponse,
} from "./types.js";

export const getFeedStatus = async (
  clientName: string,
  feedId: string,
  params?: GetFeedStatusParams,
  market?: WalmartMarket
): Promise<WalmartFeedStatusResponse> => {
  const res = await tryHandleRequest<WalmartFeedStatusResponse>(
    {
      clientName,
      requestName: "walmart.feeds.getStatus",
      url: `/v3/feeds/${feedId}`,
      method: "GET",
      headers: globalHeaders(market),
      params: params ?? {},
    },
    "WMT_0010",
    "Failed to fetch Walmart feed status"
  );
  return res.data;
};

export const submitFeed = async (
  clientName: string,
  feedType: string,
  data: FormData | object,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<WalmartFeedResponse>(
    {
      clientName,
      requestName: "walmart.feeds.submit",
      url: `/v3/feeds`,
      method: "POST",
      params: { feedType },
      headers: {
        ...globalHeaders(market),
        Accept: "application/json",
        // form-data generates a boundary that must travel with the
        // Content-Type; setting the type by hand drops it and Walmart cannot
        // parse the body.
        ...("append" in data
          ? (data as FormData).getHeaders()
          : { "Content-Type": "application/json" }),
      },
      data,
    },
    "WMT_0009",
    "Failed to submit Walmart feed"
  );
  return res.data;
};
