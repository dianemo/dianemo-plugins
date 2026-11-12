import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import {
  EbayGetCategoryItemConditionPoliciesResponse,
  EbayGetDefaultCategoryTreeIdResponse,
} from "./types.js";

export const getDefaultCategoryTreeId = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  marketplaceId: string
): Promise<EbayGetDefaultCategoryTreeIdResponse> => {
  const res = await tryHandleRequest<EbayGetDefaultCategoryTreeIdResponse>(
    {
      clientName,
      requestName: "ebay.taxonomy.getDefaultCategoryTreeId",
      grantId,
      method: "GET",
      url: `/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=${marketplaceId}`,
    },
    "EBY_0010",
    "Failed to fetch the eBay default category tree id"
  );
  return res.data;
};

export const getItemAspectsForCategory = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  categoryTreeId: string,
  categoryId: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "ebay.taxonomy.getItemAspectsForCategory",
      grantId,
      method: "GET",
      url: `/commerce/taxonomy/v1/category_tree/${categoryTreeId}/get_item_aspects_for_category?category_id=${categoryId}`,
    },
    "EBY_0011",
    "Failed to fetch eBay item aspects for category"
  );
  return res.data;
};

/**
 * The `filter` value carries literal braces — `categoryIds:{123}` — which eBay
 * requires unencoded, so it is built into the URL rather than passed through
 * query-parameter serialisation.
 */
export const getItemConditionPolicies = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  marketplaceId: string,
  categoryId: string
): Promise<EbayGetCategoryItemConditionPoliciesResponse> => {
  const res =
    await tryHandleRequest<EbayGetCategoryItemConditionPoliciesResponse>(
      {
        clientName,
        requestName: "ebay.taxonomy.getItemConditionPolicies",
        grantId,
        method: "GET",
        url: `/sell/metadata/v1/marketplace/${marketplaceId}/get_item_condition_policies?filter=categoryIds:{${categoryId}}`,
      },
      "EBY_0012",
      "Failed to fetch eBay item condition policies"
    );
  return res.data;
};
