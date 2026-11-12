import handleGraphQLRequest from "../handleGraphQLRequest.js";
import {
  ShopifyAddFixedPricesResponse,
  ShopifyAddFixedPricesVariables,
  ShopifyGetPriceListsResponse,
  ShopifyGetPriceListsVariables,
} from "./types.js";

/**
 * Fetches price lists from Shopify. Each price list is tied to a catalog
 * (market or company location) and holds the country/currency-specific prices.
 *
 * @param variables - `first` (default 1) and `reverse` (default true) paging args
 */
export const getPriceLists = async (
  clientName: string,
  variables: ShopifyGetPriceListsVariables = {}
) => {
  const { first = 1, reverse = true } = variables;
  const query = `
  query priceLists($first: Int!, $reverse: Boolean!) {
      priceLists(first: $first, reverse: $reverse) {
        nodes {
          id
          currency
          fixedPricesCount
          catalog {
            id
            title
          }
        }
      }
    }`;
  const res = await handleGraphQLRequest<ShopifyGetPriceListsResponse>(
    clientName,
    "SHO_0059",
    "Failed to fetch Shopify price lists",
    10,
    "shopify.priceLists.list",
    query,
    { first, reverse }
  );

  return res;
};

/**
 * Creates or updates fixed prices on a price list. Use this to set
 * country-specific prices (the price list is tied to a market/catalog) that
 * override the price list's default percentage-based adjustments.
 *
 * Acts as an add-and-replace operation: an existing fixed price for a variant
 * is replaced. Shopify accepts a maximum of 250 prices per request.
 */
export const addFixedPrices = async (
  clientName: string,
  variables: ShopifyAddFixedPricesVariables
) => {
  const query = `
  mutation priceListFixedPricesAdd($priceListId: ID!, $prices: [PriceListPriceInput!]!) {
      priceListFixedPricesAdd(priceListId: $priceListId, prices: $prices) {
        prices {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
        userErrors {
          field
          code
          message
        }
      }
    }`;
  const res = await handleGraphQLRequest<ShopifyAddFixedPricesResponse>(
    clientName,
    "SHO_0060",
    "Failed to add Shopify fixed prices",
    10,
    "shopify.priceLists.addFixedPrices",
    query,
    variables
  );

  return res;
};
