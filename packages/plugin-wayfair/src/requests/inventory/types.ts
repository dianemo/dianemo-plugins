import { WayfairGraphQLData } from "../types.js";

export interface WayfairInventoryData {
  inventory: WayfairInventory[];
}

export type GetWayfairInventoryResponse =
  WayfairGraphQLData<WayfairInventoryData>;

interface WayfairInventory {
  supplierPartNumber: string;
  quantityOnHand: number;
  quantityBackordered: number;
  quantityOnOrder: number;
  discontinued: boolean;
}

export type WayfairInventoryFeedKind = "DIFFERENTIAL" | "TRUE_UP";

export type WayfairFeedStatus = "NEW" | "PROCESSING" | "COMPLETE" | "ERROR";

export interface WayfairFeedItemInput {
  supplierId: number;
  supplierPartNumber: string;
  quantityOnHand: number;
  quantityBackordered?: number;
  quantityOnOrder?: number;
  itemNextAvailabilityDate?: string;
  productNameAndOptions?: string;
  discontinued?: boolean;
}

export interface SaveInventoryParams {
  inventory: WayfairFeedItemInput[];
  feedKind: WayfairInventoryFeedKind;
  /** Validates the feed without writing it. */
  dryRun?: boolean;
}

export interface WayfairSaveInventoryData {
  inventory: {
    save: {
      handle: string;
      status: WayfairFeedStatus;
      itemCount: number;
      errorCount: number;
      errors: { key: string; message: string }[];
    };
  };
}

export type SaveWayfairInventoryResponse =
  WayfairGraphQLData<WayfairSaveInventoryData>;
