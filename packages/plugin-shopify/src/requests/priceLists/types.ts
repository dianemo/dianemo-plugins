export interface ShopifyGetPriceListsVariables {
  first?: number;
  reverse?: boolean;
}

export interface ShopifyPriceList {
  id: string;
  currency: string;
  fixedPricesCount: number;
  catalog: {
    id: string;
    title: string;
  } | null;
}

export interface ShopifyGetPriceListsResponse {
  priceLists: {
    nodes: ShopifyPriceList[];
  };
}

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceListPriceInput {
  variantId: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
}

export interface ShopifyAddFixedPricesVariables {
  priceListId: string;
  prices: ShopifyPriceListPriceInput[];
}

export interface ShopifyAddFixedPricesResponse {
  priceListFixedPricesAdd: {
    prices: {
      price: ShopifyMoney;
      compareAtPrice: ShopifyMoney | null;
    }[];
    userErrors: {
      field: string[];
      code: string;
      message: string;
    }[];
  };
}
