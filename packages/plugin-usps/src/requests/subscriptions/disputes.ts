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
  UspsSubscriptionCridListParams,
  UspsSubscriptionDisputes,
  UspsSubscriptionDisputesList,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-disputes/v3";

export const listUspsDisputesSubscriptions = async (
  clientName: string,
  params: UspsSubscriptionCridListParams
): Promise<UspsSubscriptionDisputesList> => {
  const res = await tryHandleRequest<UspsSubscriptionDisputesList>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.listUspsDisputesSubscriptions",
      method: "GET",
      url: subscriptionsUrl(BASE),
      params: listParams(params),
    },
    "USP_0110",
    "Failed to list USPS disputes subscriptions"
  );
  return res.data;
};

export const createUspsDisputesSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionDisputes>
): Promise<UspsSubscriptionCreated<UspsSubscriptionDisputes>> => {
  const res = await tryHandleRequest<UspsSubscriptionDisputes>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsDisputesSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0111",
    "Failed to create USPS disputes subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsDisputesSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionDisputes>> => {
  const res = await tryHandleRequest<UspsSubscriptionDisputes>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsDisputesSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0112",
    "Failed to get USPS disputes subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsDisputesSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionDisputes>
): Promise<UspsSubscriptionResult<UspsSubscriptionDisputes>> => {
  const res = await tryHandleRequest<UspsSubscriptionDisputes>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.updateUspsDisputesSubscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0113",
    "Failed to update USPS disputes subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsDisputesSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsDisputesSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0114",
    "Failed to delete USPS disputes subscription"
  );
};
