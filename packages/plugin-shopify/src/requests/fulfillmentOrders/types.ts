type FulfillmentOrderStatus =
  | "CANCELLED"
  | "CLOSED"
  | "IN_PROGRESS"
  | "INCOMPLETE"
  | "ON_HOLD"
  | "OPEN"
  | "SCHEDULED";

interface FulfillmentsLineItemNode {
  id: string;
  lineItem: {
    id: string;
  };
}
interface FulfillmentsLineItemResponse {
  edges: { node: FulfillmentsLineItemNode }[];
}

interface FulfillmentsNode {
  id: string;
  fulfillmentLineItems: FulfillmentsLineItemResponse;
  totalQuantity: number;
  trackingInfo: { company: string; number: string }[];
}
interface FulfillmentsResponse {
  edges: { node: FulfillmentsNode }[];
}

interface LineItemsNode {
  id: string;
  remainingQuantity: number;
  lineItem: {
    id: string;
    sku: string;
  };
}
interface LineItemsResponse {
  edges: { node: LineItemsNode }[];
}

export interface FulfillmentOrdersNode {
  /** Which location Shopify expects to fulfil from. */
  assignedLocation: {
    location: {
      id: string;
    };
  };
  id: string;
  status: FulfillmentOrderStatus;
  fulfillments: FulfillmentsResponse;
  lineItems: LineItemsResponse;
}

interface FulfillmentOrdersResponse {
  edges: { node: FulfillmentOrdersNode }[];
}

export interface FulfillmentOrderByOrderIdResponse {
  order: {
    id: string;
    name: string;
    fulfillmentOrders: FulfillmentOrdersResponse;
  };
}

/**
 * `notifyCustomer` and the tracking `url` used to sit at the top level, as
 * siblings of `fulfillment`, where the mutation declares neither. GraphQL ignores
 * an undeclared variable rather than rejecting it, so `notifyCustomer: true` sent
 * no notification and raised no error — the caller had every reason to believe
 * the customer had been emailed. Both belong inside `FulfillmentInput`.
 */
export interface ShopifyFulfillmentCreateConfig {
  fulfillment: {
    trackingInfo: { company: string; number: string; url?: string };
    /** Defaults to the shop's notification setting. */
    notifyCustomer?: boolean;
    lineItemsByFulfillmentOrder: {
      fulfillmentOrderId: string;
      fulfillmentOrderLineItems: {
        id: string;
        quantity: number;
      }[];
    }[];
  };
  message?: string;
}

interface ShopifyFulfillmentOrderRef {
  id: string;
  status: string;
}

export interface ShopifyFulfillmentMoveData {
  fulfillmentOrderMove: {
    movedFulfillmentOrder: ShopifyFulfillmentOrderRef | null;
    originalFulfillmentOrder: ShopifyFulfillmentOrderRef | null;
    /** Non-null when the destination could not take every line. */
    remainingFulfillmentOrder: ShopifyFulfillmentOrderRef | null;
    userErrors: { field: string[]; message: string }[];
  };
}
