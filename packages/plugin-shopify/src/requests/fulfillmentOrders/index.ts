import handleGraphQLRequest from "../handleGraphQLRequest.js";
import { RequestError } from "@dianemo/core";
import {
  MUTATION_COST,
  OBJECT_COST,
  connectionCost,
} from "../utils/queryCost.js";
import {
  FulfillmentOrderByOrderIdResponse,
  FulfillmentOrdersNode,
  ShopifyFulfillmentCreateConfig,
  ShopifyFulfillmentMoveData,
} from "./types.js";

export interface FulfillmentOrderFieldPages {
  fulfillments: number;
  fulfillmentLineItems: number;
  lineItems: number;
}

/**
 * Reading one fulfillment order in full. Most of the per-query ceiling already:
 * this selection nests three connections deep, so the multiplication compounds
 * fast — see docs/shopify-api.md#fulfillment-order-node-cost.
 */
const FULFILLMENT_ORDER_DETAIL_PAGES: FulfillmentOrderFieldPages = {
  fulfillments: 20,
  fulfillmentLineItems: 20,
  lineItems: 20,
};

/**
 * Reading an order's fulfillment orders, shallow enough that ten fit alongside
 * the order that owns them. Read at detail depth, `getByOrderId` priced past the
 * ceiling by two orders of magnitude and could not succeed on any shop. The line
 * items are the part callers fulfil against, so they keep the most depth; the
 * `fulfillments` history nested inside each fulfillment order gives up the most.
 * See docs/shopify-api.md#fulfillment-order-node-cost.
 */
const FULFILLMENT_ORDER_LIST_PAGES: FulfillmentOrderFieldPages = {
  fulfillments: 5,
  fulfillmentLineItems: 5,
  lineItems: 10,
};

const FULFILLMENT_ORDERS_PAGE_SIZE = 10;

/**
 * One `fulfillments` node: the fulfillment, its `fulfillmentLineItems`
 * connection (whose nodes are the line item plus its `lineItem`), and the
 * `trackingInfo` list.
 */
const fulfillmentCost = (fulfillmentLineItems: number) =>
  2 * OBJECT_COST + connectionCost(fulfillmentLineItems, 2 * OBJECT_COST);

/** `assignedLocation` and its nested `location` are the two extra objects. */
const fulfillmentOrderCost = (pages: FulfillmentOrderFieldPages) =>
  3 * OBJECT_COST +
  connectionCost(
    pages.fulfillments,
    fulfillmentCost(pages.fulfillmentLineItems)
  ) +
  connectionCost(pages.lineItems, 2 * OBJECT_COST);

const fulfillmentOrderFields = (pages: FulfillmentOrderFieldPages) => `{
    id
    status
    assignedLocation {
      location {
        id
      }
    }
    fulfillments(first: ${pages.fulfillments}) {
      edges {
        node {
          fulfillmentLineItems(first: ${pages.fulfillmentLineItems}) {
            edges {
              node {
                id
                lineItem{
                  id
                }
              }
            }
          }
          id
          totalQuantity
          trackingInfo(first: 100) {
            company
            number
          }
        }
      }
    }
    lineItems(first: ${pages.lineItems}) {
      edges {
        node {
          id
          remainingQuantity
          lineItem {
            id
            sku
          }
        }
      }
    }
  }
  `;

export const getOne = async (clientName: string, id: string) => {
  const query = `query fulfillmentOrder($id: ID!) {
    fulfillmentOrder(id: $id) ${fulfillmentOrderFields(
      FULFILLMENT_ORDER_DETAIL_PAGES
    )}
  }`;
  const res = await handleGraphQLRequest<{
    fulfillmentOrder: FulfillmentOrdersNode | null;
  }>(
    clientName,
    "SHO_0044",
    "Failed to fetch Shopify fulfillment order",
    fulfillmentOrderCost(FULFILLMENT_ORDER_DETAIL_PAGES),
    "shopify.fulfillmentOrders.get",
    query,
    { id }
  );
  if (res.data.fulfillmentOrder) return res.data.fulfillmentOrder;
};

/** Read one with `getOne` instead where its full fulfillment history matters. */
/**
 * `pages` raises the nested sizes. An order with more fulfillment orders, or a
 * fulfillment order with more fulfillments, than the default page returns loses
 * the rest silently — see docs/shopify-api.md#nested-page-sizes-are-a-cost-decision
 */
export const getByOrderId = async (
  clientName: string,
  orderId: string,
  pages?: Partial<FulfillmentOrderFieldPages> & { fulfillmentOrders?: number }
) => {
  const listPages: FulfillmentOrderFieldPages = {
    ...FULFILLMENT_ORDER_LIST_PAGES,
    ...pages,
  };
  const outerPage = pages?.fulfillmentOrders ?? FULFILLMENT_ORDERS_PAGE_SIZE;
  const query = `
    query getFulfillmentData($orderId: ID!) {
      order(id: $orderId) {
        id
        name
        fulfillmentOrders(first: ${outerPage}) {
        edges{
          node
            ${fulfillmentOrderFields(listPages)}
        }

        }
      }
    }
  `;

  const variables = { orderId };
  const res = await handleGraphQLRequest<FulfillmentOrderByOrderIdResponse>(
    clientName,
    "SHO_0045",
    "Failed to fetch Shopify fulfillment orders by order ID",
    OBJECT_COST + connectionCost(outerPage, fulfillmentOrderCost(listPages)),
    "shopify.fulfillmentOrders.getByOrderId",
    query,
    variables
  );

  return res.data;
};

export const fulfill = async (
  clientName: string,
  data: ShopifyFulfillmentCreateConfig
) => {
  const query = `
    mutation fulfillmentCreate($fulfillment: FulfillmentInput!, $message: String) {
    fulfillmentCreate(fulfillment: $fulfillment, message: $message) {
      fulfillment {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`;

  return await handleGraphQLRequest<{
    fulfillmentCreate: {
      fulfillment: { id: string };
      userErrors: { field: string[]; message: string }[];
    };
  }>(
    clientName,
    "SHO_0043",
    "Failed to create Shopify fulfillment",
    MUTATION_COST + 3 * OBJECT_COST,
    "shopify.fulfillmentOrders.fulfillmentCreate",
    query,
    data
  );
};

export default {
  getOne,
  fulfill,
};

/**
 * Moves a fulfillment order to another location.
 *
 * Shopify may split rather than move: when the destination cannot stock every
 * line, it answers with `movedFulfillmentOrder` **and** a
 * `remainingFulfillmentOrder` holding what stayed behind. A caller that reads
 * only the first has silently lost track of the rest.
 *
 * `userErrors` arrives under HTTP 200 and is raised here, because a move that
 * did not happen must not read as one that did.
 */
export const move = async (
  clientName: string,
  fulfillmentOrderId: string,
  newLocationId: string
): Promise<ShopifyFulfillmentMoveData["fulfillmentOrderMove"]> => {
  const query = `mutation fulfillmentOrderMove($id: ID!, $newLocationId: ID!) {
      fulfillmentOrderMove(id: $id, newLocationId: $newLocationId) {
        movedFulfillmentOrder {
          id
          status
        }
        originalFulfillmentOrder {
          id
          status
        }
        remainingFulfillmentOrder {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }`;
  const res = await handleGraphQLRequest<ShopifyFulfillmentMoveData>(
    clientName,
    "SHO_0062",
    "Failed to move Shopify fulfillment order",
    10,
    "shopify.fulfillmentOrders.move",
    query,
    { id: fulfillmentOrderId, newLocationId }
  );
  const move = res.data.fulfillmentOrderMove;
  if (move.userErrors.length) {
    throw new RequestError(
      "SHO_0063",
      "Shopify rejected the fulfillment order move",
      {
        metadata: {
          context: `Failed to move fulfillment order ${fulfillmentOrderId} to location ${newLocationId}: ${move.userErrors.map((e) => e.message).join(", ")}`,
          userErrors: move.userErrors,
        },
      }
    );
  }
  return move;
};
