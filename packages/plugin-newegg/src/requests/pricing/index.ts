import { tryHandleRequest } from "@dianemo/plugin-kit";
import { NeweggItemUpdateType } from "../types.js";
import { submitFeed } from "../feeds/index.js";
import { neweggSubClient } from "../utils.js";
import {
  NeweggDetailedItemPricing,
  NeweggGetItemPricingData,
  NeweggGetItemPricingResponse,
  NeweggItemPriceUpdate,
  NeweggPricingFeedItemData,
  NeweggSubmitPricingFeedData,
  NeweggUpdateInventoryAndPriceData,
  NeweggUpdateInventoryAndPriceResponse,
  NeweggUpdateItemPricingData,
  NeweggUpdateItemPricingResponse,
} from "./types.js";

export const getItemPricing = async (
  clientName: string,
  data: NeweggGetItemPricingData
): Promise<NeweggDetailedItemPricing[]> => {
  const res = await tryHandleRequest<NeweggGetItemPricingResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemPricing"),
      requestName: "newegg.pricing.get",
      url: `/contentmgmt/item/international/price`,
      method: "PUT",
      data,
    },
    "NWG_0011",
    "Failed to get Newegg item pricing"
  );
  return res.data.PriceList;
};

export const submitPricingFeed = async (
  clientName: string,
  pricing: NeweggPricingFeedItemData[]
) => {
  const data: NeweggSubmitPricingFeedData = {
    NeweggEnvelope: {
      Header: { DocumentVersion: "2.0" },
      MessageType: "Price",
      Message: { Price: pricing },
    },
  };
  return await submitFeed(clientName, "PRICE_DATA", data);
};

export const updateItemPricing = async (
  clientName: string,
  sku: string,
  pricing: NeweggItemPriceUpdate[]
): Promise<NeweggUpdateItemPricingResponse> => {
  const data: NeweggUpdateItemPricingData = {
    Type: NeweggItemUpdateType.SellerPartNumber,
    Value: sku,
    PriceList: { Price: pricing },
  };
  const res = await tryHandleRequest<NeweggUpdateItemPricingResponse>(
    {
      clientName: neweggSubClient(clientName, "updateItemPricing"),
      requestName: "newegg.pricing.update",
      url: `/contentmgmt/item/international/price`,
      method: "POST",
      data,
    },
    "NWG_0012",
    "Failed to update Newegg item pricing"
  );
  return res.data;
};

/**
 * Writes inventory and price in one call. The separate `updateItemInventory`
 * and `updateItemPricing` are two calls against two per-endpoint budgets, and
 * a failure between them leaves the item priced but not stocked.
 */
export const updateItemInventoryAndPrice = async (
  clientName: string,
  data: NeweggUpdateInventoryAndPriceData
): Promise<NeweggUpdateInventoryAndPriceResponse> => {
  const res = await tryHandleRequest<NeweggUpdateInventoryAndPriceResponse>(
    {
      clientName: neweggSubClient(clientName, "updateItemInventoryAndPrice"),
      requestName: "newegg.pricing.updateInventoryAndPrice",
      url: `/contentmgmt/item/inventoryandprice`,
      method: "PUT",
      data,
    },
    "NWG_0016",
    "Failed to update Newegg item inventory and price"
  );
  return res.data;
};
