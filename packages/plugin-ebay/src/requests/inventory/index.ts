import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import { RequestError } from "@dianemo/core";
import * as types from "./types.js";

/**
 * eBay reads localised fields off `Content-Language`, and omits or rejects them
 * without it, so every write carries it.
 */
const WRITE_HEADERS = {
  "Content-Language": "en-US",
  "Content-Type": "application/json",
};

/** eBay rejects a bulk inventory read carrying more than 25 SKUs. */
const MAX_BULK_SKUS = 25;

export const getBulkInventoryItems = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  skus: string[]
): Promise<types.EbayGetBulkInventoryItemsResponses> => {
  if (skus.length > MAX_BULK_SKUS) {
    throw new RequestError("EBY_0023", "Too many SKUs for one eBay bulk read", {
      metadata: {
        context: `eBay accepts at most ${MAX_BULK_SKUS} SKUs per request, got ${skus.length}`,
      },
    });
  }
  const res = await tryHandleRequest<types.EbayGetBulkInventoryItemsResponses>(
    {
      clientName,
      requestName: "ebay.inventory.getBulkItems",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/bulk_get_inventory_item`,
      data: { requests: skus.map((sku) => ({ sku })) },
    },
    "EBY_0024",
    "Failed to bulk fetch eBay inventory items"
  );
  return res.data;
};

export const getInventoryItem = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  sku: string
): Promise<types.EbayGetInventoryItemResponse> => {
  const res = await tryHandleRequest<types.EbayGetInventoryItemResponse>(
    {
      clientName,
      requestName: "ebay.inventory.getItem",
      grantId,
      method: "GET",
      url: `/sell/inventory/v1/inventory_item/${sku}`,
    },
    "EBY_0022",
    "Failed to fetch the eBay inventory item"
  );
  return res.data;
};

export const bulkUpdatePriceQuantity = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  data: types.EbayBulkUpdateRequest[]
): Promise<types.EbayBulkUpdateResponse> => {
  const res = await tryHandleRequest<types.EbayBulkUpdateResponse>(
    {
      clientName,
      requestName: "ebay.inventory.bulkUpdatePriceQuantity",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/bulk_update_price_quantity`,
      data: { requests: data },
      headers: WRITE_HEADERS,
    },
    "EBY_0025",
    "Failed to bulk update eBay price and quantity"
  );
  return res.data;
};

export const createOrUpdateInventoryItem = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  sku: string,
  data: types.EbayCreateInventoryItemRequest
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.inventory.createOrUpdateItem",
      grantId,
      method: "PUT",
      url: `/sell/inventory/v1/inventory_item/${sku}`,
      data: data,
      headers: WRITE_HEADERS,
    },
    "EBY_0026",
    "Failed to create or update the eBay inventory item"
  );
  return res.data;
};

export const deleteInventoryItem = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  sku: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.inventory.deleteItem",
      grantId,
      method: "DELETE",
      url: `/sell/inventory/v1/inventory_item/${sku}`,
    },
    "EBY_0027",
    "Failed to delete the eBay inventory item"
  );
  return res.data;
};

export const getOffers = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  params: types.EbayGetOffersRequest
): Promise<types.EbayGetOffersResponse> => {
  const res = await tryHandleRequest<types.EbayGetOffersResponse>(
    {
      clientName,
      requestName: "ebay.inventory.getOffers",
      grantId,
      method: "GET",
      url: `/sell/inventory/v1/offer`,
      params: params,
    },
    "EBY_0028",
    "Failed to fetch eBay offers"
  );
  return res.data;
};

export const createOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  data: types.EbayOffer
): Promise<types.EbayCreateOfferResponse> => {
  const res = await tryHandleRequest<types.EbayCreateOfferResponse>(
    {
      clientName,
      requestName: "ebay.inventory.createOffer",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/offer`,
      data: data,
      headers: WRITE_HEADERS,
    },
    "EBY_0029",
    "Failed to create the eBay offer"
  );
  return res.data;
};

export const getOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  offerId: string
): Promise<types.EbayOffer> => {
  const res = await tryHandleRequest<types.EbayOffer>(
    {
      clientName,
      requestName: "ebay.inventory.getOffer",
      grantId,
      method: "GET",
      url: `/sell/inventory/v1/offer/${offerId}`,
    },
    "EBY_0030",
    "Failed to fetch the eBay offer"
  );
  return res.data;
};

export const updateOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  offerId: string,
  data: types.EbayOffer
): Promise<types.EbayOffer> => {
  const res = await tryHandleRequest<types.EbayOffer>(
    {
      clientName,
      requestName: "ebay.inventory.updateOffer",
      grantId,
      method: "PUT",
      url: `/sell/inventory/v1/offer/${offerId}`,
      data: data,
      headers: WRITE_HEADERS,
    },
    "EBY_0031",
    "Failed to update the eBay offer"
  );
  return res.data;
};

export const deleteOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  offerId: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.inventory.deleteOffer",
      grantId,
      method: "DELETE",
      url: `/sell/inventory/v1/offer/${offerId}`,
    },
    "EBY_0032",
    "Failed to delete the eBay offer"
  );
  return res.data;
};

/**
 * Publishing converts the offer into a live listing; the listing id comes back
 * in the response, not from the offer.
 */
export const publishOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  offerId: string
): Promise<types.EbayPublishOfferResponse> => {
  const res = await tryHandleRequest<types.EbayPublishOfferResponse>(
    {
      clientName,
      requestName: "ebay.inventory.publishOffer",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/offer/${offerId}/publish`,
    },
    "EBY_0033",
    "Failed to publish the eBay offer"
  );
  return res.data;
};

/**
 * Ends the listing but keeps the offer, so it can be published again.
 */
export const withdrawOffer = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  offerId: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.inventory.withdrawOffer",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/offer/${offerId}/withdraw`,
    },
    "EBY_0034",
    "Failed to withdraw the eBay offer"
  );
  return res.data;
};

export const getInventoryLocations = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  limit?: number,
  offset?: number
): Promise<types.EbayGetInventoryLocationsResponse> => {
  const res = await tryHandleRequest<types.EbayGetInventoryLocationsResponse>(
    {
      clientName,
      requestName: "ebay.inventory.getInventoryLocations",
      grantId,
      method: "GET",
      url: `/sell/inventory/v1/location`,
      params: { limit, offset },
    },
    "EBY_0035",
    "Failed to fetch eBay inventory locations"
  );
  return res.data;
};

export const getInventoryItems = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  limit: number,
  offset: number
): Promise<types.EbayGetInventoryItemsResponse> => {
  const res = await tryHandleRequest<types.EbayGetInventoryItemsResponse>(
    {
      clientName,
      requestName: "ebay.inventory.getInventoryItems",
      grantId,
      method: "GET",
      url: `/sell/inventory/v1/inventory_item`,
      params: { limit, offset },
    },
    "EBY_0036",
    "Failed to fetch eBay inventory items"
  );
  return res.data;
};
