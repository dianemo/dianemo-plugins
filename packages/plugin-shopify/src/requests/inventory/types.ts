import { GetManyResponse, ShopifyResponseUserError } from "../types.js";

export type ShopifyProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ShopifyInventoryItem {
  id: string;
  sku: string;
  variant: {
    id: string;
    product: {
      id: string;
      status: ShopifyProductStatus;
    };
  };
}
export interface GetManyInventoryItemsResponse {
  inventoryItems: GetManyResponse<ShopifyInventoryItem>;
}

export interface ShopifySetQuantitiesInput {
  name: string;
  reason: string;
  referenceDocumentUri?: string;
  quantities: {
    inventoryItemId: string;
    locationId: string;
    quantity: number;
    compareQuantity?: number;
  }[];
  ignoreCompareQuantity?: boolean;
}
export interface ShopifySetQuantitiesResponse {
  inventorySetQuantities: {
    inventoryAdjustmentGroup: {
      createdAt: string;
      reason: string;
      referenceDocumentUri: string | null;
      changes: {
        name: string;
        delta: number;
      }[];
    };
    userErrors: ShopifyResponseUserError[];
  };
}

export interface BulkToggleActivationVariables {
  inventoryItemId: string;
  inventoryItemUpdates: {
    locationId: string;
    activate: boolean;
  }[];
}

export interface BulkToggleActivationData {
  inventoryBulkToggleActivation: {
    inventoryItem: { id: string };
    inventoryLevels: {
      id: string;
      quantities: { name: string; quantity: number }[];
      location: { id: string };
    }[];
    userErrors: { field: string[]; message: string; code?: string }[];
  };
}
