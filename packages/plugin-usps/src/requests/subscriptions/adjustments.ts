import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import {
  listParams,
  subscriptionCreated,
  subscriptionResult,
  subscriptionsUrl,
} from "./utils.js";
import type {
  UspsSubscriptionAdjustments,
  UspsSubscriptionAdjustmentsList,
  UspsSubscriptionCreated,
  UspsSubscriptionCridListParams,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-adjustments/v3";

export const listUspsAdjustmentsSubscriptions = async (
  clientName: string,
  params: UspsSubscriptionCridListParams
): Promise<UspsSubscriptionAdjustmentsList> => {
  const res = await tryHandleRequest<UspsSubscriptionAdjustmentsList>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.listUspsAdjustmentsSubscriptions",
      method: "GET",
      url: subscriptionsUrl(BASE),
      params: listParams(params),
    },
    "USP_0105",
    "Failed to list USPS adjustments subscriptions"
  );
  return res.data;
};

export const createUspsAdjustmentsSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionAdjustments>
): Promise<UspsSubscriptionCreated<UspsSubscriptionAdjustments>> => {
  const res = await tryHandleRequest<UspsSubscriptionAdjustments>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsAdjustmentsSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0106",
    "Failed to create USPS adjustments subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsAdjustmentsSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionAdjustments>> => {
  const res = await tryHandleRequest<UspsSubscriptionAdjustments>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsAdjustmentsSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0107",
    "Failed to get USPS adjustments subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsAdjustmentsSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionAdjustments>
): Promise<UspsSubscriptionResult<UspsSubscriptionAdjustments>> => {
  const res = await tryHandleRequest<UspsSubscriptionAdjustments>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.updateUspsAdjustmentsSubscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0108",
    "Failed to update USPS adjustments subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsAdjustmentsSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsAdjustmentsSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0109",
    "Failed to delete USPS adjustments subscription"
  );
};
