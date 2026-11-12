import {
  NeweggFeedWrapper,
  NeweggItemCondition,
  NeweggItemFulfillmentOption,
  NeweggItemUpdateType,
} from "../types.js";

export interface NeweggGetInventoryData {
  Type: NeweggItemUpdateType;
  Value: string;
  Condition?: NeweggItemCondition;
  WarehouseLocation?: string;
}

export interface NeweggGetInventoryResponse {
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  InventoryAllocation: NeweggDetailedItemInventory[];
}

/**
 * The business marketplace answers a flat record rather than the international
 * endpoint's `InventoryAllocation` array, and sends `FulfillmentOption` and
 * `Active` as **strings** where the rest of this package models them as numeric
 * enums. Typed as the wire sends them rather than as the enums they resemble —
 * docs/newegg-api.md#the-business-marketplace-has-its-own-inventory-endpoint
 */
export interface NeweggBusinessInventoryResponse {
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  /** A string, not the enum. Only `"0"` has been observed. */
  FulfillmentOption: string;
  /** `"1"` active, `"0"` inactive — both observed. A string, not the enum. */
  Active: string;
  AvailableQuantity: number;
}

export interface NeweggDetailedItemInventory {
  WarehouseLocation: string;
  FulfillmentOption: NeweggItemFulfillmentOption;
  AvailableQuantity: number;
}

export interface NeweggSubmitInventoryFeedData extends NeweggFeedWrapper<NeweggInventoryFeedMessage> {}

export interface NeweggInventoryFeedMessage {
  Inventory: {
    Item: NeweggInventoryFeedItemData[];
  };
}

export interface NeweggInventoryFeedItemData {
  SellerPartNumber: string;
  WarehouseLocation: string;
  Inventory: number;
  FulfillmentOption?: "Seller";
  NeweggItemNumber?: string;
}

export interface NeweggUpdateItemInventoryData {
  Type: NeweggItemUpdateType;
  Value: string;
  InventoryList: {
    Inventory: NeweggItemInventory[];
  };
}

export interface NeweggItemInventory {
  WarehouseLocation: string;
  AvailableQuantity: number;
  Condition?: NeweggItemCondition;
}

export interface NeweggUpdateItemInventoryResponse {
  SellerID: string;
  ItemNumber: string;
  SellerPartNumber: string;
  InventoryList: {
    Inventory: NeweggItemInventory[];
  };
}

export interface NeweggGetBatchInventoryData {
  Type?: NeweggItemUpdateType;
  /** Newegg caps this at 100 SKUs. */
  Values: string[];
  WarehouseList?: string[];
}

export interface NeweggGetBatchInventoryResponse {
  ItemList: {
    ItemNumber: string;
    SellerPartNumber: string;
    Condition: number;
    InventoryAllocation: NeweggDetailedItemInventory[];
  }[];
  TotalCount: number;
}

export interface NeweggBusinessInventoryFeedItemData {
  SellerPartNumber: string;
  Inventory: number;
  /** `"Default"` uses the seller's portal rate. */
  Shipping: "Default" | "Free";
  SellingPrice?: number;
  NeweggItemNumber?: string;
}

export interface NeweggSubmitBusinessInventoryFeedData {
  NeweggEnvelope: {
    Header: { DocumentVersion: "1.0" };
    MessageType: "Inventory";
    /** `"No"` leaves items absent from this feed untouched. */
    Overwrite: "Yes" | "No";
    Message: {
      Inventory: { Item: NeweggBusinessInventoryFeedItemData[] };
    };
  };
}
