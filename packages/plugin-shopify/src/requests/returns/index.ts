import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { GetOrdersWithReturnsResponse } from "./types.js";

/**
 * Orders carrying formal Return objects (RMAs), paginated updatedAt-ascending
 * so callers can advance an incremental watermark page by page.
 *
 * Requires the `read_returns` access scope on the store's custom app — the
 * `returns` connection is ACCESS_DENIED without it.
 *
 * Page size and nested `first` args are small on purpose: Shopify prices a
 * query by its *requested* connection sizes (orders × returns × line items),
 * and the single-query cost cap is 1,000 points.
 */

const RETURN_SEARCH_FILTER =
  "(return_status:return_requested OR return_status:in_progress" +
  " OR return_status:inspection_complete OR return_status:returned)";

const QUERY = `query OrdersWithReturns($first: Int!, $after: String, $query: String) {
  orders(first: $first, after: $after, query: $query, sortKey: UPDATED_AT) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        name
        updatedAt
        cancelledAt
        returnStatus
        originalTotalPriceSet {
          shopMoney {
            amount
          }
        }
        returns(first: 10) {
          edges {
            node {
              id
              name
              status
              totalQuantity
              returnLineItems(first: 25) {
                edges {
                  node {
                    ... on ReturnLineItem {
                      returnReason
                      returnReasonNote
                      customerNote
                      quantity
                      fulfillmentLineItem {
                        lineItem {
                          sku
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export const getOrdersWithReturns = async (
  clientName: string,
  options?: {
    updatedAtMin?: string;
    updatedAtMax?: string;
    after?: string | null;
    first?: number;
  }
) => {
  const clauses = [RETURN_SEARCH_FILTER];
  if (options?.updatedAtMin)
    clauses.unshift(`updated_at:>'${options.updatedAtMin}'`);
  if (options?.updatedAtMax)
    clauses.unshift(`updated_at:<='${options.updatedAtMax}'`);
  return await handleGraphQLRequest<GetOrdersWithReturnsResponse>(
    clientName,
    "SHO_0058",
    "Failed to fetch Shopify orders with returns",
    800,
    "shopify.returns.getOrdersWithReturns",
    QUERY,
    {
      first: options?.first ?? 5,
      after: options?.after ?? null,
      query: clauses.join(" AND "),
    }
  );
};
