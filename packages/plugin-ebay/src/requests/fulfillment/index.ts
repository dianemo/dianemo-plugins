import { EbayFulfillOrderData, EbayGetFulfillmentResponse } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import { RequestError } from "@dianemo/core";

/**
 * Creates a shipping fulfillment and returns its id.
 *
 * The id is only in the `Location` response header — eBay answers 201 with an
 * empty body — so a proxy that strips the header leaves the fulfillment created
 * and unaddressable. That case is raised rather than returned as undefined.
 */
export const createShippingFulfillment = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  orderId: string,
  payload: EbayFulfillOrderData
): Promise<string> => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.fulfillment.create",
      grantId,
      method: "POST",
      url: `/sell/fulfillment/v1/order/${orderId}/shipping_fulfillment`,
      data: payload,
    },
    "EBY_0015",
    "Failed to create the eBay shipping fulfillment"
  );
  const location = res.headers["location"];
  const fulfillmentId = location?.split("/").pop();
  if (!fulfillmentId) {
    throw new RequestError(
      "EBY_0016",
      "eBay returned no fulfillment id for the created shipping fulfillment",
      {
        metadata: {
          context: `Order: ${orderId}. The fulfillment id arrives only in the Location header, which was ${location ? `"${location}"` : "absent"}.`,
        },
      }
    );
  }
  return fulfillmentId;
};

export const getShippingFulfillment = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  orderId: string,
  fulfillmentId: string
): Promise<EbayGetFulfillmentResponse> => {
  const res = await tryHandleRequest<EbayGetFulfillmentResponse>(
    {
      clientName,
      requestName: "ebay.fulfillment.get",
      grantId,
      method: "GET",
      url: `/sell/fulfillment/v1/order/${orderId}/shipping_fulfillment/${fulfillmentId}`,
    },
    "EBY_0017",
    "Failed to fetch the eBay shipping fulfillment"
  );
  return res.data;
};

export const getShippingFulfillments = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  orderId: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.fulfillment.list",
      grantId,
      method: "GET",
      url: `/sell/fulfillment/v1/order/${orderId}/shipping_fulfillment`,
    },
    "EBY_0018",
    "Failed to fetch eBay shipping fulfillments"
  );
  return res.data;
};
