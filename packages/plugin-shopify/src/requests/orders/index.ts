import { GetManyBasicOptions, ShopifyRecordTypes } from "../types.js";
import shopifyIdFormatter from "../utils/shopifyIdFormatter.js";
import handleGraphQLRequest from "../handleGraphQLRequest.js";
import shopify from "../index.js";
import {
  basicListArgumentTypes,
  buildListArguments,
  listPageSize,
} from "../utils/listArguments.js";
import {
  ShopifyMetafieldCreateAndUpdateData,
  ShopifyMetafieldCreateDefinition,
  ShopifyMetafieldType,
  UpdateMetafieldInput,
} from "../metafields/types.js";
import {
  MUTATION_COST,
  OBJECT_COST,
  connectionCost,
} from "../utils/queryCost.js";
import {
  GetManyOrdersResponse,
  GetOneOrderResponse,
  ShopifyOrderGetRisksResponse,
  ShopifyTransactionsResponse,
} from "./types.js";

export interface OrderFieldPages {
  discountApplications: number;
  events: number;
  lineItems: number;
  metafields: number;
}

/**
 * `app`, `billingAddress`, `customer`, `paymentTerms`, `shippingAddress`,
 * `shippingLine` and its `discountedPriceSet.shopMoney`, and the four
 * `total*Set.shopMoney` pairs.
 */
const ORDER_OBJECT_COST = 16;

/**
 * One `lineItems` node: the line item, `originalUnitPriceSet.shopMoney` and
 * `originalTotalSet.shopMoney`, `discountAllocations` with both of its money
 * objects, `taxLines.priceSet.shopMoney`, and `variant`.
 */
const LINE_ITEM_COST = 13;

/** Reading one order in full — see docs/shopify-api.md#order-node-cost. */
const ORDER_DETAIL_PAGES: OrderFieldPages = {
  discountApplications: 100,
  events: 100,
  lineItems: 25,
  metafields: 50,
};

/**
 * Reading a page of orders. Shopify will not return two full-detail orders in one
 * query at any plan level, so something has to give, and the nested collections
 * are the safer half to shrink: a smaller page is more round trips, whereas a
 * caller who needs an order's 30th line item can read it with `getOne`. Arithmetic
 * in docs/shopify-api.md#order-node-cost.
 */
const ORDER_LIST_PAGES: OrderFieldPages = {
  discountApplications: 10,
  events: 10,
  lineItems: 10,
  metafields: 10,
};

const orderCost = (pages: OrderFieldPages) =>
  OBJECT_COST +
  ORDER_OBJECT_COST +
  connectionCost(pages.discountApplications, OBJECT_COST) +
  connectionCost(pages.events, OBJECT_COST) +
  connectionCost(pages.lineItems, LINE_ITEM_COST) +
  connectionCost(pages.metafields, OBJECT_COST);

const orderFields = (pages: OrderFieldPages) => `{
  app {
    name
  }
  id
  billingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    lastName
    phone
    province
    zip
  }
  cancelReason
  cancelledAt
  canMarkAsPaid
  closed
  closedAt
  confirmed
  createdAt
  currencyCode
  customer {
    id
    displayName
    tags
  }
  discountApplications(first: ${pages.discountApplications}) {
    edges {
      node {
        value
      }
    }
  }
  displayFinancialStatus
  displayFulfillmentStatus
  discountCodes
  dutiesIncluded
  edited
  email
  events(first: ${pages.events}, reverse: true) {
    edges {
      node {
        __typename
        action
        createdAt
        id
      }
    }
  }
  fullyPaid
  lineItems(first: ${pages.lineItems}) {
    edges {
      node {
        id
        sku
        quantity
        originalUnitPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        originalTotalSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        discountAllocations {
          allocatedAmountSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          allocatedAmount {
            amount
            currencyCode
          }
        }
        taxLines {
          priceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
        variant {
          id
          sku
        }
      }
    }
  }
  metafields(first: ${pages.metafields}) {
    edges {
      node {
        id
        namespace
        key
        value
        type
        description
        compareDigest
        createdAt
        updatedAt
      }
    }
  }
  name
  paymentTerms {
    dueInDays
    paymentTermsName
    paymentTermsType
  }
  phone
  poNumber
  processedAt
  shippingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    lastName
    phone
    province
    zip
  }
  shippingLine {
    title
    discountedPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
  }
  statusPageUrl
  tags
  taxExempt
  taxesIncluded
  totalOutstandingSet{
    shopMoney {
      amount
      currencyCode
    }
  }
  totalPriceSet {
    shopMoney {
      amount
      currencyCode
    }
  }
  totalShippingPriceSet {
    shopMoney {
      amount
      currencyCode
    }
  }
  totalTaxSet {
    shopMoney {
      amount
      currencyCode
    }
  }
  test
  updatedAt
  unpaid

}`;

const recordType: ShopifyRecordTypes = "ORDER";

/**
 * Lists orders. Nested collections are read ten deep; use `getOne` for an order
 * in full. `first: 7` is refused locally as a budget error naming the client
 * rather than coming back `MAX_COST_EXCEEDED` a round trip later.
 */
/**
 * A page of orders, at nested sizes chosen to stay inside the 1,000-point
 * single-query cap on a standard plan.
 *
 * `pages` raises them. A Shopify Plus store has a 10x cost allowance, so it can
 * ask for the same nested detail `getOne` returns and still fit — but a plugin
 * cannot assume the plan, so the larger read is opt-in rather than the default.
 * See docs/shopify-api.md#order-node-cost.
 */
export const getMany = async (
  clientName: string,
  options?: GetManyBasicOptions,
  pages?: Partial<OrderFieldPages>
) => {
  const listPages: OrderFieldPages = { ...ORDER_LIST_PAGES, ...pages };
  const defaultOptions = { first: 5 };
  const mergedOptions = { ...defaultOptions, ...options };
  const args = buildListArguments(
    mergedOptions,
    basicListArgumentTypes("OrderSortKeys")
  );
  const query = `query orders${args.declarations} {
    orders${args.arguments} {
      edges {
        node ${orderFields(listPages)}
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }`;

  return await handleGraphQLRequest<GetManyOrdersResponse>(
    clientName,
    "SHO_0034",
    "Failed to fetch Shopify orders",
    connectionCost(listPageSize(mergedOptions), orderCost(listPages)),
    "shopify.orders.list",
    query,
    args.variables
  );
};

export const getOne = async (clientName: string, id: string | number) => {
  const idFormatted = shopifyIdFormatter(id, recordType);
  const query = `query order($id: ID!) {
    order(id: $id) ${orderFields(ORDER_DETAIL_PAGES)}
  }`;
  const res = await handleGraphQLRequest<GetOneOrderResponse>(
    clientName,
    "SHO_0032",
    "Failed to fetch Shopify order",
    orderCost(ORDER_DETAIL_PAGES),
    "shopify.orders.get",
    query,
    { id: idFormatted }
  );
  if (res.data.order) return res.data.order;
};

export const markAsPaid = async (clientName: string, id: string) => {
  const idFormatted = shopifyIdFormatter(id, recordType);
  const query = `
    mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        userErrors {
          field
          message
        }
      }
    }`;

  const variables = {
    input: {
      id: idFormatted,
    },
  };

  return await handleGraphQLRequest<GetOneOrderResponse>(
    clientName,
    "SHO_0035",
    "Failed to mark Shopify order as paid",
    MUTATION_COST + 2 * OBJECT_COST,
    "shopify.orders.markAsPaid",
    query,
    variables
  );
};

/**
 * Looks an order up by its name — Shopify has no PO-number field, so this matches
 * whatever order-number convention the store writes into `name`.
 */
export const getByPO = async (clientName: string, poNumber: string) => {
  const query = `query orderByName($query: String) {
    orders(first: 1, query: $query) {
      edges {
        node ${orderFields(ORDER_DETAIL_PAGES)}
      }
    }
  }`;

  const res = await handleGraphQLRequest<GetManyOrdersResponse>(
    clientName,
    "SHO_0033",
    "Failed to fetch Shopify order by PO number",
    connectionCost(1, orderCost(ORDER_DETAIL_PAGES)),
    "shopify.orders.getByPoNumber",
    query,
    { query: `name:${poNumber}` }
  );

  if (res.data.orders.edges.length) return res.data.orders.edges[0].node;
  return null;
};

export const updateMetafields = async (
  clientName: string,
  ownerId: string,
  metafields: UpdateMetafieldInput[]
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);

  const res = await shopify.metafields.update(
    clientName,
    formattedOwnerId,
    recordType,
    metafields
  );
  return res;
};

export const getMetafields = async (
  clientName: string,
  ownerId: string | number
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);
  const res = await shopify.metafields.get(
    clientName,
    formattedOwnerId,
    recordType
  );
  return res;
};

export const createMetafield = async (
  clientName: string,
  definition: Omit<ShopifyMetafieldCreateDefinition, "ownerType">
) => {
  const fullDefinition: ShopifyMetafieldCreateDefinition = {
    ...definition,
    ownerType: recordType,
  };
  const res = await shopify.metafields.create(clientName, fullDefinition);
  return res;
};

export const getRisk = async (clientName: string, orderId: string | number) => {
  const formattedOrderId = shopifyIdFormatter(orderId, recordType);
  const query = `query orderRisk($id: ID!) {
    node(id: $id) {
      ... on Order {
        risk {
          assessments {
            facts {
              description
              sentiment
            }
            riskLevel
          }
          recommendation
        }
      }
    }
  }`;

  const res = await handleGraphQLRequest<ShopifyOrderGetRisksResponse>(
    clientName,
    "SHO_0001",
    "Failed to fetch Shopify order risk assessment",
    4 * OBJECT_COST,
    "shopify.orders.getRisk",
    query,
    { id: formattedOrderId }
  );

  if (res.data.node?.risk) return res.data.node;

  return null;
};

export const getTransactions = async (
  clientName: string,
  orderId: number | string
) => {
  const formattedOrderId = shopifyIdFormatter(orderId, recordType);
  const query = `query orderTransactions($id: ID!) {
    node(id: $id) {
      ... on Order {
        transactions(first: 100) {
          accountNumber
          amountSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          authorizationCode
          createdAt
          fees {
            amount {
              amount
              currencyCode
            }
            type
          }
          gateway
          kind
          paymentId
          processedAt
          receiptJson
          status
          test
        }
      }
    }
  }`;

  const res = await handleGraphQLRequest<ShopifyTransactionsResponse>(
    clientName,
    "SHO_0002",
    "Failed to fetch Shopify order transactions",
    // `transactions` is a list rather than a connection, so its `first: 100` does
    // not multiply through — see docs/shopify-api.md#query-cost.
    6 * OBJECT_COST,
    "shopify.orders.getTransactions",
    query,
    { id: formattedOrderId }
  );
  return res.data.node?.transactions || null;
};

export const createAndUpdateMetafield = async <T extends ShopifyMetafieldType>(
  clientName: string,
  ownerId: string | number,
  definition: Omit<ShopifyMetafieldCreateAndUpdateData<T>, "ownerType">
) => {
  const formattedOwnerId = shopifyIdFormatter(ownerId, recordType);
  return await shopify.metafields.createAndUpdate(
    clientName,
    formattedOwnerId,
    recordType,
    { ...definition, ownerType: recordType }
  );
};
