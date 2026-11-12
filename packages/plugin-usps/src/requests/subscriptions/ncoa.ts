import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import {
  subscriptionCreated,
  subscriptionResult,
  subscriptionsUrl,
} from "./utils.js";
import type {
  UspsSubscriptionCreated,
  UspsSubscriptionNcoa,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-ncoa/v3";

export const createUspsNcoaSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionNcoa>
): Promise<UspsSubscriptionCreated<UspsSubscriptionNcoa>> => {
  const res = await tryHandleRequest<UspsSubscriptionNcoa>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsNcoaSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0116",
    "Failed to create USPS NCOA subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsNcoaSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionNcoa>> => {
  const res = await tryHandleRequest<UspsSubscriptionNcoa>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsNcoaSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0117",
    "Failed to get USPS NCOA subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsNcoaSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsNcoaSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0119",
    "Failed to delete USPS NCOA subscription"
  );
};
