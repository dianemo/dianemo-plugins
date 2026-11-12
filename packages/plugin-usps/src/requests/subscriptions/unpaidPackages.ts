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
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionUnpaidPackages,
  UspsSubscriptionUnpaidPackagesList,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-unpaid-packages/v3";

export const listUspsUnpaidPackagesSubscriptions = async (
  clientName: string,
  params: UspsSubscriptionCridListParams
): Promise<UspsSubscriptionUnpaidPackagesList> => {
  const res = await tryHandleRequest<UspsSubscriptionUnpaidPackagesList>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.listUspsUnpaidPackagesSubscriptions",
      method: "GET",
      url: subscriptionsUrl(BASE),
      params: listParams(params),
    },
    "USP_0135",
    "Failed to list USPS unpaid packages subscriptions"
  );
  return res.data;
};

export const createUspsUnpaidPackagesSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionUnpaidPackages>
): Promise<UspsSubscriptionCreated<UspsSubscriptionUnpaidPackages>> => {
  const res = await tryHandleRequest<UspsSubscriptionUnpaidPackages>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.createUspsUnpaidPackagesSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0136",
    "Failed to create USPS unpaid packages subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsUnpaidPackagesSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<UspsSubscriptionResult<UspsSubscriptionUnpaidPackages>> => {
  const res = await tryHandleRequest<UspsSubscriptionUnpaidPackages>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.getUspsUnpaidPackagesSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0137",
    "Failed to get USPS unpaid packages subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsUnpaidPackagesSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionUnpaidPackages>
): Promise<UspsSubscriptionResult<UspsSubscriptionUnpaidPackages>> => {
  const res = await tryHandleRequest<UspsSubscriptionUnpaidPackages>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.updateUspsUnpaidPackagesSubscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0138",
    "Failed to update USPS unpaid packages subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsUnpaidPackagesSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.subscriptions.deleteUspsUnpaidPackagesSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0139",
    "Failed to delete USPS unpaid packages subscription"
  );
};
