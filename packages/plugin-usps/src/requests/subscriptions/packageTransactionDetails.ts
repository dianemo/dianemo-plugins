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
  UspsSubscriptionPackageTransactionDetails,
  UspsSubscriptionPackageTransactionDetailsList,
  UspsSubscriptionResult,
  UspsSubscriptionTarget,
  UspsSubscriptionVersionedTarget,
  UspsSubscriptionWritable,
} from "./types.js";

const BASE = "/subscriptions-package-transaction-details/v3";

export const listUspsPackageTransactionDetailsSubscriptions = async (
  clientName: string,
  params: UspsSubscriptionCridListParams
): Promise<UspsSubscriptionPackageTransactionDetailsList> => {
  const res =
    await tryHandleRequest<UspsSubscriptionPackageTransactionDetailsList>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName:
          "usps.subscriptions.listUspsPackageTransactionDetailsSubscriptions",
        method: "GET",
        url: subscriptionsUrl(BASE),
        params: listParams(params),
      },
      "USP_0120",
      "Failed to list USPS package transaction details subscriptions"
    );
  return res.data;
};

export const createUspsPackageTransactionDetailsSubscription = async (
  clientName: string,
  data: UspsSubscriptionWritable<UspsSubscriptionPackageTransactionDetails>
): Promise<
  UspsSubscriptionCreated<UspsSubscriptionPackageTransactionDetails>
> => {
  const res = await tryHandleRequest<UspsSubscriptionPackageTransactionDetails>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.subscriptions.createUspsPackageTransactionDetailsSubscription",
      method: "POST",
      url: subscriptionsUrl(BASE),
      data,
    },
    "USP_0121",
    "Failed to create USPS package transaction details subscription"
  );
  return subscriptionCreated(res);
};

export const getUspsPackageTransactionDetailsSubscription = async (
  clientName: string,
  { subscriptionId }: UspsSubscriptionTarget
): Promise<
  UspsSubscriptionResult<UspsSubscriptionPackageTransactionDetails>
> => {
  const res = await tryHandleRequest<UspsSubscriptionPackageTransactionDetails>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.subscriptions.getUspsPackageTransactionDetailsSubscription",
      method: "GET",
      url: subscriptionsUrl(BASE, subscriptionId),
    },
    "USP_0122",
    "Failed to get USPS package transaction details subscription"
  );
  return subscriptionResult(res);
};

export const updateUspsPackageTransactionDetailsSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget,
  data: UspsSubscriptionWritable<UspsSubscriptionPackageTransactionDetails>
): Promise<
  UspsSubscriptionResult<UspsSubscriptionPackageTransactionDetails>
> => {
  const res = await tryHandleRequest<UspsSubscriptionPackageTransactionDetails>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.subscriptions.updateUspsPackageTransactionDetailsSubscription",
      method: "PUT",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
      data,
    },
    "USP_0123",
    "Failed to update USPS package transaction details subscription"
  );
  return subscriptionResult(res);
};

export const deleteUspsPackageTransactionDetailsSubscription = async (
  clientName: string,
  { subscriptionId, ifMatch }: UspsSubscriptionVersionedTarget
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.subscriptions.deleteUspsPackageTransactionDetailsSubscription",
      method: "DELETE",
      url: subscriptionsUrl(BASE, subscriptionId),
      headers: { "If-Match": ifMatch },
    },
    "USP_0124",
    "Failed to delete USPS package transaction details subscription"
  );
};
