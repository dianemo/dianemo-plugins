import { WalmartBoolean, WalmartPrice } from "../types.js";

type ItemCondition =
  | "New"
  | "New without box"
  | "New without tags"
  | "Restored Premium"
  | "Restored"
  | "Remanufactured"
  | "Open Box"
  | "Pre-Owned: Like New"
  | "Pre-Owned: Good"
  | "Pre-Owned: Fair"
  | "New with defects";

type ItemAvailability = "In_stock" | "Out_of_stock" | "Preorder";

export interface GetItemsParams {
  nextCursor?: string;
  sku?: string;
  gtin?: string;
  offset?: number;
  limit?: number;
  lifecycleStatus?: "ACTIVE" | "ARCHIVED" | "RETIRED";
  publishedStatus?: "PUBLISHED" | "UNPUBLISHED";
  variantGroupId?: string;
  condition?: ItemCondition;
  availability?: ItemAvailability;
  showDuplicateItemInfo?: WalmartBoolean;
  includeCustomerFavoritesStatus?: WalmartBoolean;
}

export interface ItemsResponse {
  ItemResponse: ItemResponseItem[];
  additionalAttributes?: AdditionalAttributes[];
  totalItems?: number;
  nextCursor?: string;
}

export interface ItemResponseItem {
  mart?: "WALMART_US" | "WALMART_CA" | "ASDA_GM" | "WALMART_MEXICO";
  sku: string;
  condition?: string;
  availability?: string;
  wpid?: string;
  upc?: string;
  gtin?: string;
  productName?: string;
  shelf?: string;
  productType?: string;
  price?: WalmartPrice;
  publishedStatus?:
    | "PUBLISHED"
    | "READY_TO_PUBLISH"
    | "IN_PROGRESS"
    | "UNPUBLISHED"
    | "STAGE"
    | "SYSTEM_PROBLEM";
  additionalAttributes?: AdditionalAttributes;
  unpublishedReasons?: {
    reason?: string[];
  };
  lifecycleStatus?: "ACTIVE" | "ARCHIVED" | "RETIRED";
  variantGroupId?: string;
  variantGroupInfo?: ItemResponseVariantGroupInfo;
  isCustomerFavorite?: boolean;
  isDuplicate?: boolean;
  duplicateItemInfo?: ItemResponseDuplicateItemInfo;
}

export interface AdditionalAttributes {
  name: string;
  type:
    | "LOCALIZABLE_TEXT"
    | "STRING"
    | "BOOLEAN"
    | "INTEGER"
    | "DECIMAL"
    | "DATE"
    | "TIMESTAMP";
  isVariant?: boolean;
  variantResourceType?: string;
  value: {
    value: string;
    group?: string;
    source?: string;
    rank?: number;
    isVariant?: boolean;
  }[];
}

export interface ItemResponseVariantGroupInfo {
  isPrimary?: boolean;
  primary?: boolean;
  groupingAttributes?: {
    name?: string;
    value?: string;
  };
}

export interface ItemResponseDuplicateItemInfo {
  status?: string;
  lastUpdatedDate?: string;
  identifiedDate?: string;
  destinationItem?: {
    mart?: string;
    wpid?: string;
    gtin?: string;
    upc?: string;
    itemId?: string;
    productName?: string;
    productType?: string;
  };
}

type ProductIdType = "GTIN" | "UPC" | "ISBN" | "EAN" | "SKU" | "ITEM_ID";

export interface GetItemParams {
  productIdType?: ProductIdType;
  condition?: ItemCondition;
  availability?: ItemAvailability;
  showDuplicateItemDetails?: WalmartBoolean;
  includeCustomerFavoritesStatus?: WalmartBoolean;
}

/**
 * Not the same set as `WalmartFeedType` in `feeds/types.ts`: that one names a
 * feed you submit, this one names a schema family the taxonomy and spec
 * endpoints classify by. The two have no members in common.
 */
export type WalmartSpecFeedType =
  "MP_ITEM" | "MP_MAINTENANCE" | "MP_WFS_ITEM" | "OMNI_WFS";

export interface GetTaxonomyParams {
  version?: string;
  feedType?: WalmartSpecFeedType;
}

interface TaxonomyCategory {
  categoryName: string;
  categoryId: string;
}

export interface GetTaxonomyResponse {
  success: "SUCCESS";
  payload: TaxonomyCategory[];
}

export interface GetSpecBody {
  feedType: WalmartSpecFeedType;
  version: string;
  /** Walmart rejects more than 20 per request. */
  productTypes: WalmartProductTypes[];
}

interface SchemaProperties {
  $schema: string;
  type: string;
  title: string;
  required: string[];
  items: Record<string, unknown>;
  additionalProperties: boolean;
}

export interface GetSpecResponse {
  schema: {
    $schema: string;
    type: string;
    properties: Record<string, SchemaProperties>;
    title: string;
    required: string[];
  };
  errors?: string[];
}

type CatalogSearchField =
  | "productName"
  | "sku"
  | "gtin"
  | "wpid"
  | "upc"
  | "isbn"
  | "ean"
  | "itemId"
  | "variantGroupId";

export interface CatalogSearchRequest {
  params?: {
    page?: string;
    limit?: number;
    nextCursor?: string;
  };
  body: {
    query?: {
      field?: CatalogSearchField;
      value?: string;
    };
    filters?: Array<{
      field: string;
      publishedStatus?: string[];
    }>;
    sort?: {
      field: string;
    };
  };
}

/** Targets a non-US marketplace through the `WM_MARKET` global header. */
export type WalmartMarket = "us" | "ca" | "mx" | "cl";

export type WalmartProductTypes =
  | "3D Printer Parts"
  | "Acoustic Dampers"
  | "Antenna Mounts & Brackets"
  | "Anti-Fatigue Mats"
  | "Appliance Covers"
  | "Art Easels"
  | "Automotive Safety Parts & Accessories"
  | "Bath Accessories Sets"
  | "Bee Guards"
  | "Bee Houses"
  | "Bicycle Stands"
  | "Book Stands"
  | "Cable Organizers"
  | "Camera & Camcorder Mounts"
  | "Car Mounts"
  | "Casters"
  | "Cat Perches"
  | "Ceiling Tile"
  | "Clamps"
  | "Computer & Machine Carts"
  | "Computer Keyboard Trays"
  | "Computer Racks & Mounts"
  | "Cots"
  | "Cotton Candy Machines"
  | "Desk Chairs"
  | "Desk Lamps"
  | "Desk Pads"
  | "Desk Risers"
  | "Desks"
  | "Desktop Organizers"
  | "Display Cases"
  | "Electrical Fuses"
  | "Electronics Docks & Cradles"
  | "Electronics Stands"
  | "Ergonomic Footrests"
  | "Exercise Bikes"
  | "Exercise Machine Attachments"
  | "File Cabinets, Boxes & Carts"
  | "Floating Shelves"
  | "Food Strainers & Colanders"
  | "Garbage Cans & Wastebaskets"
  | "Golf Club Organizers"
  | "Hardware Brackets"
  | "Hardware Hinges"
  | "Hot Dog Machines"
  | "Hunting Camouflage Accessories"
  | "Keyboard Drawers & Platforms"
  | "Laptop Bags"
  | "Laundry Baskets, Sorters & Hampers"
  | "Lecterns"
  | "Material Handling Securing Straps"
  | "Microphone Stands & Booms"
  | "Mouse Pads"
  | "Music Stands"
  | "Network Cables"
  | "Office Desk Bridges & Connectors"
  | "Overbed Tables"
  | "Partition Panels"
  | "Pegboards"
  | "Pet Strollers"
  | "Photo Studio Backgrounds"
  | "Pipe Fittings & Couplers"
  | "Plant Cages"
  | "Plant Stands & Racks"
  | "Playground Climbers"
  | "Podiums"
  | "Projector Bags & Cases"
  | "Projector Mounts"
  | "Projector Screens"
  | "Remote Controls"
  | "Ring Lights"
  | "Room Dividers & Panel Screens"
  | "Shelves & Shelf Units"
  | "Speaker Mounts & Brackets"
  | "Speaker Stands"
  | "Stools"
  | "Surge Suppressors"
  | "Tool Boxes & Organizers"
  | "TV & Monitor Mounts"
  | "Table Tops"
  | "Tablet Computer Stands"
  | "Television Stands"
  | "Therapeutic Light Boxes"
  | "Toilet Safety Frames"
  | "Towing Receiver Adapters & Hitch Extenders"
  | "Tripods"
  | "Utility Carts"
  | "Vehicle Charging Stations"
  | "Vehicle Covers"
  | "Video Game Accessories"
  | "Video Game Chairs"
  | "Whiteboards"
  | "Window Air Conditioner Supports"
  | "Wire & Cable Organizers"
  | "Work Safety Eye Protection"
  | "Workbenches"
  | "Workstations"
  | "Workwear Overalls & Coveralls"
  | "Workwear Safety Gloves"
  | "Wrist Rests";
