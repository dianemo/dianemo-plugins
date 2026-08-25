import { tryHandleRequest } from "@dianemo/plugin-kit";
import { WalmartMarket } from "../items/types.js";
import globalHeaders from "../globalHeaders.js";
import { submitFeed } from "../feeds/index.js";
import FormData from "form-data";
import {
  AllInventoryResponse,
  GetAllInventoryParams,
  GetInventoryParams,
  GetMultiNodeInventoryParams,
  GetWFSInventoryParams,
  InventoryResponse,
  MultiNodeInventoryResponse,
  UpdateInventoryData,
  UpdateInventoryParams,
  UpdateMultiNodeInventoryData,
  UpdateMultiNodeInventoryResponse,
  WalmartMultiNodeInventoryFeed,
  WFSInventoryResponse,
} from "./types.js";

export const submitMultiNodeInventoryFeed = async (
  clientName: string,
  syncId: string,
  feed: WalmartMultiNodeInventoryFeed,
  market?: WalmartMarket
) => {
  const form = new FormData();
  form.append("file", JSON.stringify(feed), {
    filename: `${syncId}-inventory.json`,
    contentType: "application/json",
  });

  return submitFeed(clientName, "MP_INVENTORY", form, market);
};

export const getInventory = async (
  clientName: string,
  params: GetInventoryParams,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<InventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.get",
      url: `/v3/inventory`,
      method: "GET",
      headers: globalHeaders(market),
      params,
    },
    "WMT_0011",
    "Failed to fetch Walmart inventory"
  );
  return res.data;
};

export const updateInventory = async (
  clientName: string,
  params: UpdateInventoryParams,
  data: UpdateInventoryData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<InventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.update",
      url: `/v3/inventory`,
      method: "PUT",
      headers: globalHeaders(market),
      params,
      data,
    },
    "WMT_0012",
    "Failed to update Walmart inventory"
  );
  return res.data;
};

export const getMultiNodeInventory = async (
  clientName: string,
  sku: string,
  params?: GetMultiNodeInventoryParams,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<MultiNodeInventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.getMultiNode",
      url: `/v3/inventories/${encodeURIComponent(sku)}`,
      method: "GET",
      headers: globalHeaders(market),
      params: params ?? {},
    },
    "WMT_0013",
    "Failed to fetch Walmart multi-node inventory"
  );
  return res.data;
};

export const updateMultiNodeInventory = async (
  clientName: string,
  sku: string,
  data: UpdateMultiNodeInventoryData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<UpdateMultiNodeInventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.updateMultiNode",
      url: `/v3/inventories/${encodeURIComponent(sku)}`,
      method: "PUT",
      headers: globalHeaders(market),
      data,
    },
    "WMT_0014",
    "Failed to update Walmart multi-node inventory"
  );
  return res.data;
};

export const getAllInventory = async (
  clientName: string,
  params?: GetAllInventoryParams,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<AllInventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.listAll",
      url: `/v3/inventories`,
      method: "GET",
      headers: globalHeaders(market),
      params: params ?? {},
    },
    "WMT_0015",
    "Failed to fetch all Walmart inventory"
  );
  return res.data;
};

export const getWFSInventory = async (
  clientName: string,
  params?: GetWFSInventoryParams,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<WFSInventoryResponse>(
    {
      clientName,
      requestName: "walmart.inventory.getWfs",
      url: `/v3/wfs/inventory`,
      method: "GET",
      headers: globalHeaders(market),
      params: params ?? {},
    },
    "WMT_0016",
    "Failed to fetch Walmart WFS inventory"
  );
  return res.data;
};
