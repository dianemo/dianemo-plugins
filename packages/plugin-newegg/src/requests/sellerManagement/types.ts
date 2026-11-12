export interface NeweggGetIndustryListParams {
  industrycode?: string;
}

export interface NeweggIndustry {
  IndustryCode: string;
  IndustryName: string;
}

export interface NeweggGetIndustryListResponse {
  IsSuccess: boolean;
  OperationType: string;
  SellerID: string;
  ResponseBody: {
    IndustryList: NeweggIndustry[];
  };
}

/**
 * Numeric, and not the same set as `NeweggFeedType` in `feeds/types.ts`: the
 * schema endpoint identifies a feed by code while the datafeed endpoints name
 * it by string, and the two vocabularies do not line up member for member.
 */
export enum NeweggFeedSchemaType {
  ITEM_DATA = 1,
  INVENTORY_AND_PRICE_DATA = 2,
  ORDER_SHIP_NOTICE_DATA = 3,
  ITEM_BATCH_UPDATE = 4,
  MULTICHANNEL_ORDER_DATA = 5,
  ITEM_DATA_UPCMATCH = 6,
  ITEM_PROMOTION_DATA = 7,
  VOLUME_DISCOUNT_DATA = 8,
  INVENTORY_DATA = 10,
  PRICE_DATA = 11,
}

export interface NeweggGetSchemaBody {
  FeedType: NeweggFeedSchemaType;
  IndustryCode?: string;
}
