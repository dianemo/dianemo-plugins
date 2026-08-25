import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  CatalogSearchRequest,
  GetItemParams,
  GetItemsParams,
  GetSpecBody,
  GetSpecResponse,
  GetTaxonomyParams,
  GetTaxonomyResponse,
  ItemResponseItem,
  ItemsResponse,
  WalmartMarket,
} from "./types.js";

/**
 * `WM_GLOBAL_VERSION` travels with `WM_MARKET` — Walmart rejects the market
 * header on its own.
 */
const globalHeaders = (market?: WalmartMarket) => {
  if (!market) return undefined;
  return { WM_MARKET: market, WM_GLOBAL_VERSION: 3.1 };
};

export const getItems = async (
  clientName: string,
  params: GetItemsParams,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<ItemsResponse>(
    {
      clientName,
      requestName: "walmart.items.list",
      url: `/v3/items`,
      method: "GET",
      params,
      headers: globalHeaders(market),
    },
    "WMT_0018",
    "Failed to fetch Walmart items"
  );
  return res.data;
};

/**
 * Undefined rather than a throw when nothing matches: Walmart answers an
 * unknown identifier with 200 and an empty `ItemResponse`, so absence is a
 * normal result here and not a transport failure.
 */
export const getItem = async (
  clientName: string,
  id: string,
  params?: GetItemParams
): Promise<ItemResponseItem | undefined> => {
  const res = await tryHandleRequest<ItemsResponse>(
    {
      clientName,
      requestName: "walmart.items.get",
      url: `/v3/items/${id}`,
      method: "GET",
      params,
    },
    "WMT_0020",
    "Failed to fetch Walmart item"
  );
  return res.data.ItemResponse[0];
};

/** Walmart's Product Type taxonomy, which `getSpec` classifies against. */
export const getTaxonomy = async (
  clientName: string,
  params?: GetTaxonomyParams
): Promise<GetTaxonomyResponse> => {
  const res = await tryHandleRequest<GetTaxonomyResponse>(
    {
      clientName,
      requestName: "walmart.items.getTaxonomy",
      url: `/v3/items/taxonomy`,
      method: "GET",
      params,
    },
    "WMT_0021",
    "Failed to fetch Walmart taxonomy"
  );
  return res.data;
};

/**
 * The JSON schema for a set of Product Types, capped by Walmart at 20 per
 * request. `POST` for a read is Walmart's choice — the product-type list
 * travels in the body.
 */
export const getSpec = async (
  clientName: string,
  body: GetSpecBody
): Promise<GetSpecResponse> => {
  const res = await tryHandleRequest<GetSpecResponse>(
    {
      clientName,
      requestName: "walmart.items.getSpec",
      url: `/v3/items/spec`,
      method: "POST",
      data: body,
    },
    "WMT_0022",
    "Failed to fetch Walmart item spec"
  );
  return res.data;
};

/** Searches Walmart's catalog by SKU, GTIN, UPC and the other identifiers. */
export const catalogSearch = async (
  clientName: string,
  search: CatalogSearchRequest
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "walmart.items.catalogSearch",
      url: `/v3/items/catalog/search`,
      method: "POST",
      data: search.body,
      params: search.params,
      headers: { Accept: "application/json" },
    },
    "WMT_0023",
    "Failed to search the Walmart catalog"
  );
  return res.data;
};

/**
 * Retires an item: it stops being visible or purchasable on Walmart.com.
 * Whether the SKU can be re-listed afterwards was not established — treat it as
 * one-way until it is.
 */
export const retireItem = async (
  clientName: string,
  sku: string,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "walmart.items.retire",
      url: `/v3/items/${sku}`,
      method: "DELETE",
      headers: globalHeaders(market),
    },
    "WMT_0024",
    "Failed to retire Walmart item"
  );
  return res.data;
};
