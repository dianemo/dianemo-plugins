import { MultiRecord, GetManyResponse, ShopifyMoneyV2 } from "../types.js";

export interface ShopifyOrder {
  id: string;
  billingAddress: ShopifyAddress | null;
  cancelReason: ShopifyCancelReason | null;
  cancelledAt: string | null;
  canMarkAsPaid: boolean;
  closed: boolean;
  closedAt: string | null;
  confirmed: boolean;
  /** The channel the order came through; absent for orders created by the shop. */
  app: { name: string } | null;
  createdAt: string;
  currencyCode: string;
  customer: {
    id: string;
    displayName: string;
    /** Customer-level tags, not the order's own `tags`. */
    tags: string[];
  };
  discountApplications: MultiRecord<ShopifyDiscountApplications>;
  discountCodes: string[];
  displayFinancialStatus: ShopifyFinancialStatus;
  displayFulfillmentStatus: ShopifyFulfillmentStatus;
  dutiesIncluded: boolean;
  edited: boolean;
  email: string | null;
  events: MultiRecord<OrderEvents>;
  fullyPaid: boolean;
  lineItems: MultiRecord<ShopifyOrderLineItem>;
  metafields: MultiRecord<OrderMetafield>;
  name: string;
  paymentTerms: {
    dueInDays: number | null;
    paymentTermsName: string | null;
    paymentTermsType: ShopifyPaymentTermType;
  };
  phone: string | null;
  poNumber: string | null;
  processedAt: string;
  shippingAddress: ShopifyAddress | null;
  shippingLine: {
    title: string;
    discountedPriceSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
  } | null;
  statusPageUrl: string;
  tags: string[];
  taxExempt: boolean;
  taxesIncluded: boolean;
  totalOutstandingSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalShippingPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  totalTaxSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  test: boolean;
  unpaid: boolean;
  updatedAt: string;
}

interface OrderEvents {
  __typename: string;
  action: string;
  createdAt: string;
  id: string;
}

export interface OrderMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  description: string | null;
  compareDigest: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetOneOrderResponse {
  order: ShopifyOrder;
}

export interface GetManyOrdersResponse {
  orders: GetManyResponse<ShopifyOrder>;
}

type ShopifyOrderRiskRecommendation =
  "ACCEPT" | "CANCEL" | "INVESTIGATE" | "NONE";
export interface ShopifyOrderGetRisksResponse {
  node: {
    risk: {
      assessments: {
        facts: {
          description: string;
          sentiment: string;
        }[];
        riskLevel: string;
      }[];
      recommendation: ShopifyOrderRiskRecommendation;
    };
  };
}

export interface ShopifyTransactionResponse {
  accountNumber: string;
  amountSet: ShopifyMoneyV2;
  authorizationCode: string;
  createdAt: string;
  fees: {
    amount: ShopifyMoneyV2;
    type: string;
  }[];
  gateway: string;
  kind: string;
  paymentId: string;
  processedAt: string;
  receiptJson: string;
  status: string;
  test: boolean;
}
export interface ShopifyTransactionsResponse {
  node: {
    transactions: ShopifyTransactionResponse[];
  };
}

type ShopifyCancelReason =
  "CUSTOMER" | "DECLINED" | "FRAUD" | "INVENTORY" | "OTHER" | "STAFF";

type ShopifyFinancialStatus =
  | "AUTHORIZED"
  | "EXPIRED"
  | "PAID"
  | "PARTIALLY_PAID"
  | "PARTIALLY_REFUNDED"
  | "PENDING"
  | "REFUNDED"
  | "VOIDED";

type ShopifyFulfillmentStatus =
  | "FULFILLED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "OPEN"
  | "PARTIALLY_FULFILLED"
  | "PENDING_FULFILLMENT"
  | "REQUEST_DECLINED"
  | "RESTOCKED"
  | "SCHEDULED"
  | "UNFULFILLED";

type ShopifyPaymentTermType =
  "FIXED" | "FULFILLMENT" | "NET" | "RECEIPT" | "UNKNOWN";

interface ShopifyOrderLineItem {
  id: string;
  sku: string | null;
  quantity: number;
  originalUnitPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  originalTotalSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  discountAllocations: {
    allocatedAmountSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
    allocatedAmount: {
      amount: string;
      currencyCode: string;
    };
  }[];
  taxLines: {
    priceSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
  }[];
  variant: {
    id: string;
    sku: string | null;
  };
}

interface ShopifyAddress {
  address1: string;
  address2: string | null;
  city: string;
  company: string | null;
  countryCodeV2: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  province: string | null;
  provinceCode: string | null;
  zip: string;
}

interface ShopifyDiscountApplications {
  value: {
    amount: string;
    currencyCode: string;
  };
}
