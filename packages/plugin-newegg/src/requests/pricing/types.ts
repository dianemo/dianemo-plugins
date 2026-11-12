import {
  NeweggBoolean,
  NeweggFeedWrapper,
  NeweggItemCondition,
  NeweggItemUpdateType,
  NeweggNumericBoolean,
} from "../types.js";

export enum NeweggItemPriceActive {
  Inactive = 0,
  Active = 1,
}

export enum NeweggShippingOption {
  Default = 0,
  FreeShipping = 1,
}

export interface NeweggGetItemPricingData {
  Type: NeweggItemUpdateType;
  Value: string;
  Condition?: NeweggItemCondition;
  CountryCode?: string;
}

export interface NeweggGetItemPricingResponse {
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  PriceList: NeweggDetailedItemPricing[];
}

export interface NeweggDetailedItemPricing {
  CountryCode: string;
  Currency: string;
  MSRP?: number;
  Active: NeweggItemPriceActive;
  MAP: number;
  CheckoutMAP: NeweggNumericBoolean;
  SellingPrice: number;
  EnableFreeShipping: NeweggShippingOption;
  OnPromotion?: string;
  LimitQuantity?: number;
}

export interface NeweggSubmitPricingFeedData extends NeweggFeedWrapper<NeweggPricingFeedMessage> {}

export interface NeweggPricingFeedMessage {
  Price: NeweggPricingFeedItemData[];
}

export interface NeweggPricingFeedItemData {
  Item: {
    SellerPartNumber: string;
    CountryCode: string;
    Currency: string;
    SellingPrice: number;
    Shipping: "Default" | "Free";
    NeweggItemNumber?: string;
    MSRP?: number;
    MAP?: number;
    CheckoutMAP?: number;
    LimitQuantity?: string;
    ActivationMark?: NeweggBoolean;
  };
}

export interface NeweggUpdateItemPricingData {
  Type: NeweggItemUpdateType;
  Value: string;
  PriceList: {
    Price: NeweggItemPriceUpdate[];
  };
}

export interface NeweggItemPriceUpdate {
  CountryCode: string;
  Currency: string;
  Active?: NeweggItemPriceActive;
  MSRP?: number;
  MAP?: number;
  CheckoutMAP?: NeweggNumericBoolean;
  SellingPrice?: number;
  EnableFreeShipping?: NeweggShippingOption;
  LimitQuantity?: number;
}

export interface NeweggUpdateItemPricingResponse {
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  PriceList: {
    Price: NeweggItemPriceUpdate[];
  };
}

export interface NeweggUpdateInventoryAndPriceData {
  Type: NeweggItemUpdateType;
  Value: string;
  Inventory?: number;
  SellingPrice?: number;
  MAP?: number;
  CheckoutMAP?: NeweggNumericBoolean;
  EnableFreeShipping?: NeweggShippingOption;
  Active?: NeweggItemPriceActive;
  FulfillmentOption?: number;
  LimitQuantity?: number;
}

export interface NeweggUpdateInventoryAndPriceResponse {
  /** 1 = success, 0 = failure. */
  Result: number;
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  ShipByNewegg: string;
  Active: string;
  AvailableQuantity: number;
  SellingPrice: number;
  EnableFreeShipping: number;
  Memo: string;
}
