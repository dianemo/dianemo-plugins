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
  UspsSubscriptionTracking,
  UspsSubscriptionTrackingList,
  UspsSubscriptionTrackingListParams,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-tracking/v3";

export const listUspsTrackingSubscriptions = async (
  clientName: string,
  params: UspsSubscriptionTrackingListParams = {}
): Promise<UspsSubscriptionTrackingList> => {
  const res = await tryHandleRequest<UspsSubscriptionTrackingList>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.listUspsTrackingSubscriptions",
      method: "GET",
      url: subscriptionsUrl(BASE),
      params: listParams(params),
    },
    "USP_0125",
    "Failed to list USPS tracking subscriptions"
  );
  return res.data;
};

export const createUspsTrackingSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionTracking>
): Promise<UspsSubscriptionCreated<UspsSubscriptionTracking>> => {
  const res = await tryHandleRequest<UspsSubscriptionTracking>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsTrackingSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0126",
    "Failed to create USPS tracking subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsTrackingSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionTracking>> => {
  const res = await tryHandleRequest<UspsSubscriptionTracking>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsTrackingSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0127",
    "Failed to get USPS tracking subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsTrackingSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionTracking>
): Promise<UspsSubscriptionResult<UspsSubscriptionTracking>> => {
  const res = await tryHandleRequest<UspsSubscriptionTracking>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.updateUspsTrackingSubscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0128",
    "Failed to update USPS tracking subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsTrackingSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsTrackingSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0129",
    "Failed to delete USPS tracking subscription"
  );
};
