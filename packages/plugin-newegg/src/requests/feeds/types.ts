export type NeweggFeedType =
  | "ITEM_DATA"
  | "INVENTORY_AND_PRICE_DATA"
  | "INVENTORY_DATA"
  | "PRICE_DATA"
  | "ITEM_COUNTRY_RESTRICTION_DATA"
  | "ORDER_SHIP_NOTICE_DATA"
  | "MULTICHANNEL_ORDER_DATA"
  | "VOLUME_DISCOUNT_DATA"
  | "ITEM_WARRANTY_DATA"
  | "ITEM_CAPROP65_DATA"
  | "ITEM_CHINATAXSETTING_DATA"
  | "ITEM_SAFEGUARD_SETTING_DATA"
  | "VEHICLE_SPECIFIC_ITEM_DATA";

export type NeweggFeedStatus =
  "SUBMITTED" | "IN_PROGRESS" | "FINISHED" | "CANCELLED";

export interface NeweggGetFeedStatusData {
  OperationType: "GetFeedStatusRequest";
  RequestBody: {
    GetRequestStatus: {
      RequestIDList?: { RequestID: string }[];
      RequestType?: NeweggFeedType;
      MaxCount?: string;
      RequestStatus?: "ALL" | NeweggFeedStatus;
      RequestDateFrom?: string;
      RequestDateTo?: string;
    };
  };
}

export interface NeweggSubmitFeedResponse {
  /**
   * A JSON boolean on this endpoint, per Newegg's published sample. Read it
   * through `neweggSucceeded` rather than comparing directly — the same flag is
   * a string on other Newegg endpoints.
   */
  IsSuccess: boolean;
  OperationType: string;
  SellerID: string;
  ResponseBody: { ResponseList: NeweggFeedResponse[] };
  Memo?: string;
}

export interface NeweggFeedResponse {
  /**
   * `RequestId` here, but `RequestIDList.RequestID` in the request body above:
   * Newegg spells the key differently by direction. Both are as published — not
   * a typo to fix. docs/newegg-api.md#requestid-on-the-way-in-requestid-on-the-way-out
   */
  RequestId: string;
  RequestType: NeweggFeedType;
  RequestDate: string;
  RequestStatus: NeweggFeedStatus;
}

interface NeweggFeedResultAdditionalInfo {
  SubCategoryID: string;
  SellerPartNumber: string;
  ManufacturerPartNumber: string;
  UPCOrISBN?: string;
}

interface NeweggFeedResultItem {
  AdditionalInfo: NeweggFeedResultAdditionalInfo;
  ErrorList?: {
    ErrorDescription: string[];
  };
}

/** Counts arrive as strings, not numbers. */
interface NeweggProcessingReport {
  OriginalMessageName: string;
  StatusCode: string;
  ProcessingSummary: {
    ProcessedCount: string;
    SuccessCount: string;
    WithErrorCount: string;
  };
  Result?: NeweggFeedResultItem[];
}

export interface NeweggFeedResult {
  NeweggEnvelope: {
    Header: {
      DocumentVersion: string;
    };
    MessageType: "ProcessingReport";
    Message: {
      ProcessingReport: NeweggProcessingReport;
    };
  };
}
