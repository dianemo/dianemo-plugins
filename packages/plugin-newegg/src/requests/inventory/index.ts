import { tryHandleRequest } from "@dianemo/plugin-kit";
import { NeweggItemUpdateType } from "../types.js";
import { submitFeed } from "../feeds/index.js";
import { neweggSubClient } from "../utils.js";
import {
  NeweggBusinessInventoryResponse,
  NeweggDetailedItemInventory,
  NeweggGetBatchInventoryData,
  NeweggGetBatchInventoryResponse,
  NeweggGetInventoryData,
  NeweggGetInventoryResponse,
  NeweggBusinessInventoryFeedItemData,
  NeweggInventoryFeedItemData,
  NeweggItemInventory,
  NeweggSubmitBusinessInventoryFeedData,
  NeweggSubmitInventoryFeedData,
  NeweggUpdateItemInventoryData,
  NeweggUpdateItemInventoryResponse,
} from "./types.js";

export const getItemInventory = async (
  clientName: string,
  data: NeweggGetInventoryData
): Promise<NeweggDetailedItemInventory[]> => {
  const res = await tryHandleRequest<NeweggGetInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemInventory"),
      requestName: "newegg.inventory.get",
      url: `/contentmgmt/item/international/inventory`,
      method: "PUT",
      data,
    },
    "NWG_0009",
    "Failed to get Newegg item inventory"
  );
  return res.data.InventoryAllocation;
};

/**
 * Deliberately the same `getItemInventory` sub-client: it is the same logical
 * operation against the same published budget, so the two share one bucket.
 */
export const getBusinessItemInventory = async (
  clientName: string,
  data: NeweggGetInventoryData
): Promise<NeweggBusinessInventoryResponse> => {
  const res = await tryHandleRequest<NeweggBusinessInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "getItemInventory"),
      requestName: "newegg.inventory.getBusiness",
      url: `/contentmgmt/item/inventory`,
      method: "POST",
      params: { version: 304 },
      data,
    },
    "NWG_0014",
    "Failed to get Newegg business item inventory"
  );
  return res.data;
};

/**
 * Resolves up to 100 SKUs in one call, which is what makes a seller part number
 * recoverable from a Newegg item number on a feed-error report.
 *
 * `/international/` is the consumer marketplace here, not a non-US one — the
 * same inversion the single-item reads above already carry. See
 * docs/newegg-api.md#international-names-the-platform-not-the-marketplace
 */
export const getBatchItemInventory = async (
  clientName: string,
  data: NeweggGetBatchInventoryData
): Promise<NeweggGetBatchInventoryResponse> => {
  const res = await tryHandleRequest<{
    ResponseBody: NeweggGetBatchInventoryResponse;
  }>(
    {
      clientName: neweggSubClient(clientName, "getBatchItemInventory"),
      requestName: "newegg.inventory.getBatch",
      url: `/contentmgmt/item/international/inventorylist`,
      method: "POST",
      data,
    },
    "NWG_0019",
    "Failed to get Newegg batch item inventory"
  );
  return res.data.ResponseBody;
};

export const getBusinessBatchItemInventory = async (
  clientName: string,
  data: NeweggGetBatchInventoryData
): Promise<NeweggGetBatchInventoryResponse> => {
  const res = await tryHandleRequest<{
    ResponseBody: NeweggGetBatchInventoryResponse;
  }>(
    {
      clientName: neweggSubClient(clientName, "getBatchItemInventory"),
      requestName: "newegg.inventory.getBusinessBatch",
      url: `/contentmgmt/item/inventorylist`,
      method: "POST",
      data,
    },
    "NWG_0020",
    "Failed to get Newegg business batch item inventory"
  );
  return res.data.ResponseBody;
};

export const submitInventoryFeed = async (
  clientName: string,
  inventory: NeweggInventoryFeedItemData[]
) => {
  const data: NeweggSubmitInventoryFeedData = {
    NeweggEnvelope: {
      Header: { DocumentVersion: "2.0" },
      MessageType: "Inventory",
      Message: { Inventory: { Item: inventory } },
    },
  };
  return await submitFeed(clientName, "INVENTORY_DATA", data);
};

/**
 * The business marketplace runs on Newegg's domestic platform, which has no
 * standalone inventory feed — quantity updates go through
 * `INVENTORY_AND_PRICE_DATA` instead.
 *
 * Price is omitted so this stays inventory-only, and `Overwrite: "No"` leaves
 * items absent from the feed untouched rather than zeroing them. See
 * docs/newegg-api.md#the-business-marketplace-has-no-standalone-inventory-feed
 */
export const submitBusinessInventoryFeed = async (
  clientName: string,
  inventory: NeweggBusinessInventoryFeedItemData[]
) => {
  const data: NeweggSubmitBusinessInventoryFeedData = {
    NeweggEnvelope: {
      Header: { DocumentVersion: "1.0" },
      MessageType: "Inventory",
      Overwrite: "No",
      Message: { Inventory: { Item: inventory } },
    },
  };
  return await submitFeed(clientName, "INVENTORY_AND_PRICE_DATA", data);
};

export const updateItemInventory = async (
  clientName: string,
  sku: string,
  inventory: NeweggItemInventory[]
): Promise<NeweggUpdateItemInventoryResponse> => {
  const data: NeweggUpdateItemInventoryData = {
    Type: NeweggItemUpdateType.SellerPartNumber,
    Value: sku,
    InventoryList: { Inventory: inventory },
  };
  const res = await tryHandleRequest<NeweggUpdateItemInventoryResponse>(
    {
      clientName: neweggSubClient(clientName, "updateItemInventory"),
      requestName: "newegg.inventory.update",
      url: `/contentmgmt/item/international/inventory`,
      method: "POST",
      data,
    },
    "NWG_0010",
    "Failed to update Newegg item inventory"
  );
  return res.data;
};
