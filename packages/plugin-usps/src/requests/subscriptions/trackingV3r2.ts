import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import {
  listParams,
  subscriptionCreated,
  subscriptionResult,
  subscriptionsUrl,
} from "./utils.js";
import type {
  UspsSubscriptionCreated,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionTrackingListParams,
  UspsSubscriptionTrackingV3r2,
  UspsSubscriptionTrackingV3r2List,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-tracking/v3r2";

export const listUspsTrackingV3r2Subscriptions = async (
  clientName: string,
  params: UspsSubscriptionTrackingListParams = {}
): Promise<UspsSubscriptionTrackingV3r2List> => {
  const res = await tryHandleRequest<UspsSubscriptionTrackingV3r2List>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.listUspsTrackingV3r2Subscriptions",
      method: "GET",
      url: subscriptionsUrl(BASE),
      params: listParams(params),
    },
    "USP_0130",
    "Failed to list USPS tracking v3r2 subscriptions"
  );
  return res.data;
};

export const createUspsTrackingV3r2Subscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionTrackingV3r2>
): Promise<UspsSubscriptionCreated<UspsSubscriptionTrackingV3r2>> => {
  const res = await tryHandleRequest<UspsSubscriptionTrackingV3r2>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsTrackingV3r2Subscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0131",
    "Failed to create USPS tracking v3r2 subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsTrackingV3r2Subscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionTrackingV3r2>> => {
  const res = await tryHandleRequest<UspsSubscriptionTrackingV3r2>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsTrackingV3r2Subscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0132",
    "Failed to get USPS tracking v3r2 subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsTrackingV3r2Subscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionTrackingV3r2>
): Promise<UspsSubscriptionResult<UspsSubscriptionTrackingV3r2>> => {
  const res = await tryHandleRequest<UspsSubscriptionTrackingV3r2>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.updateUspsTrackingV3r2Subscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0133",
    "Failed to update USPS tracking v3r2 subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsTrackingV3r2Subscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsTrackingV3r2Subscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0134",
    "Failed to delete USPS tracking v3r2 subscription"
  );
};
