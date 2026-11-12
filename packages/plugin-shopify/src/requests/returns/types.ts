/** Shopify Admin GraphQL ReturnReason enum values (API 2025-10). */
export type ShopifyReturnReason =
  | "COLOR"
  | "DEFECTIVE"
  | "NOT_AS_DESCRIBED"
  | "OTHER"
  | "SIZE_TOO_LARGE"
  | "SIZE_TOO_SMALL"
  | "STYLE"
  | "UNKNOWN"
  | "UNWANTED"
  | "WRONG_ITEM";

/** Shopify Admin GraphQL ReturnStatus enum values (API 2025-10). */
export type ShopifyReturnStatus =
  "CANCELED" | "CLOSED" | "DECLINED" | "OPEN" | "REQUESTED";

export type ShopifyReturnLineItem = {
  returnReason: ShopifyReturnReason;
  returnReasonNote: string | null;
  customerNote: string | null;
  quantity: number;
  fulfillmentLineItem: {
    lineItem: {
      sku: string | null;
    } | null;
  } | null;
};

export type ShopifyOrderReturn = {
  id: string;
  name: string;
  status: ShopifyReturnStatus;
  totalQuantity: number;
  returnLineItems: {
    edges: { node: ShopifyReturnLineItem }[];
  };
};

export type ShopifyOrderWithReturns = {
  id: string;
  name: string;
  updatedAt: string;
  cancelledAt: string | null;
  returnStatus: string | null;
  /** As-placed order total — deliberately NOT currentTotalPriceSet, which is
   * post-refund and reads $0 once a refund (e.g. TikTok-side) completes. */
  originalTotalPriceSet: {
    shopMoney: {
      amount: string;
    };
  } | null;
  returns: {
    edges: { node: ShopifyOrderReturn }[];
  };
};

export type GetOrdersWithReturnsResponse = {
  orders: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: { node: ShopifyOrderWithReturns }[];
  };
};
