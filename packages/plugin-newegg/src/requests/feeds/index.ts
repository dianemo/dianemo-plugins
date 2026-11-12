import { neweggSubClient, neweggSucceeded } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { RequestError } from "@dianemo/core";
import {
  NeweggFeedResponse,
  NeweggFeedResult,
  NeweggGetFeedStatusData,
  NeweggSubmitFeedResponse,
} from "./types.js";

export const getFeedStatus = async (
  clientName: string,
  feedId: string
): Promise<NeweggFeedResponse> => {
  const data: NeweggGetFeedStatusData = {
    OperationType: "GetFeedStatusRequest",
    RequestBody: {
      GetRequestStatus: { RequestIDList: [{ RequestID: feedId }] },
    },
  };
  const res = await tryHandleRequest<NeweggSubmitFeedResponse>(
    {
      clientName: neweggSubClient(clientName, "getFeedStatus"),
      requestName: "newegg.feeds.getStatus",
      url: `/datafeedmgmt/feeds/status`,
      method: "PUT",
      data,
    },
    "NWG_0007",
    "Failed to get Newegg feed status"
  );
  const resData = res.data;
  const feedData = resData.ResponseBody.ResponseList[0];
  if (!feedData || !neweggSucceeded(resData)) {
    throw new RequestError("NWG_0008", "Newegg feed status request failed", {
      metadata: {
        context: `${feedData?.RequestStatus ?? "No request status"} | MEMO: ${resData.Memo || "N/A"}`,
      },
    });
  }
  return feedData;
};

/**
 * The per-row outcome of a finished feed, which `getFeedStatus` does not carry:
 * status reports only that processing ended, not which rows failed or why.
 */
export const getFeedResult = async (
  clientName: string,
  feedId: string
): Promise<NeweggFeedResult> => {
  const res = await tryHandleRequest<NeweggFeedResult>(
    {
      clientName: neweggSubClient(clientName, "getFeedResult"),
      requestName: "newegg.feeds.getResult",
      url: `/datafeedmgmt/feeds/result/${feedId}`,
      method: "GET",
    },
    "NWG_0015",
    "Failed to get Newegg feed result"
  );
  return res.data;
};

export const submitFeed = async (
  clientName: string,
  requestType: string,
  data: object
): Promise<NeweggFeedResponse> => {
  const res = await tryHandleRequest<NeweggSubmitFeedResponse>(
    {
      clientName: neweggSubClient(clientName, "submitFeed"),
      requestName: "newegg.feeds.submit",
      url: `/datafeedmgmt/feeds/submitfeed`,
      method: "POST",
      params: { requesttype: requestType },
      data,
    },
    "NWG_0005",
    "Failed to submit Newegg feed"
  );
  const resData = res.data;
  const feedData = resData.ResponseBody.ResponseList[0];
  if (!feedData || !neweggSucceeded(resData)) {
    throw new RequestError("NWG_0006", "Newegg feed submission failed", {
      metadata: {
        context: `${feedData?.RequestStatus ?? "No request status"} | MEMO: ${resData.Memo || "N/A"}`,
      },
    });
  }
  return feedData;
};
