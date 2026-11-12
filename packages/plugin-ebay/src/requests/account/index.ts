import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import * as types from "./types.js";

/**
 * `Content-Language` is sent on every policy read: eBay uses it to decide which
 * localised policy fields come back, and omits them without it.
 */
const POLICY_HEADERS = { "Content-Language": "en-US" };

export const getFulfillmentPolicies = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  marketplaceId: string
): Promise<types.EbayGetFulfillmentPoliciesResponse> => {
  const res = await tryHandleRequest<types.EbayGetFulfillmentPoliciesResponse>(
    {
      clientName,
      requestName: "ebay.account.getFulfillmentPolicies",
      grantId,
      method: "GET",
      url: `/sell/account/v1/fulfillment_policy`,
      params: { marketplace_id: marketplaceId },
      headers: POLICY_HEADERS,
    },
    "EBY_0019",
    "Failed to fetch eBay fulfillment policies"
  );
  return res.data;
};

export const getPaymentPolicies = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  marketplaceId: string
): Promise<types.EbayGetPaymentPoliciesResponse> => {
  const res = await tryHandleRequest<types.EbayGetPaymentPoliciesResponse>(
    {
      clientName,
      requestName: "ebay.account.getPaymentPolicies",
      grantId,
      method: "GET",
      url: `/sell/account/v1/payment_policy`,
      params: { marketplace_id: marketplaceId },
      headers: POLICY_HEADERS,
    },
    "EBY_0020",
    "Failed to fetch eBay payment policies"
  );
  return res.data;
};

export const getReturnPolicies = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  marketplaceId: string
): Promise<types.EbayGetReturnPoliciesResponse> => {
  const res = await tryHandleRequest<types.EbayGetReturnPoliciesResponse>(
    {
      clientName,
      requestName: "ebay.account.getReturnPolicies",
      grantId,
      method: "GET",
      url: `/sell/account/v1/return_policy`,
      params: { marketplace_id: marketplaceId },
      headers: POLICY_HEADERS,
    },
    "EBY_0021",
    "Failed to fetch eBay return policies"
  );
  return res.data;
};
