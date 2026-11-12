import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import {
  subscriptionCreated,
  subscriptionResult,
  subscriptionsUrl,
} from "./utils.js";
import type {
  UspsSubscriptionAddress,
  UspsSubscriptionCreated,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-address/v3";

export const createUspsAddressSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionAddress>
): Promise<UspsSubscriptionCreated<UspsSubscriptionAddress>> => {
  const res = await tryHandleRequest<UspsSubscriptionAddress>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsAddressSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0101",
    "Failed to create USPS address subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsAddressSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionAddress>> => {
  const res = await tryHandleRequest<UspsSubscriptionAddress>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsAddressSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0102",
    "Failed to get USPS address subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsAddressSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsAddressSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0104",
    "Failed to delete USPS address subscription"
  );
};
