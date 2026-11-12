export interface UspsMailCampaign {
  campaignID?: string;
  /** A01 NON-SEQ, A02 MID, A03 SEQ, A04 SAT. */
  campaignType: string;
  /** LT, CD or FL. */
  mailpieceShape: string;
  MID: string;
  submitterName: string;
  submitterCRID?: string;
  mailOwnerCRID: string;
  mailOwnerName: string;
  campaignCode: string;
  campaignTitle: string;
  brandDisplayName: string;
  startDate: string;
  endDate: string;
  startSerial?: string;
  endSerial?: string;
  targetUrl: string;
  campaignSource?: string;
  hasUrlParams?: boolean;
  isShareable?: boolean;
  postalOneSaturationJobID?: string;
  /** Base64-encoded image. */
  rideAlong: string;
  /** Base64-encoded image; required when mailpieceShape is FL. */
  replacementImage?: string;
  addBarcode?: boolean;
  barcodeCount?: number;
  cancel?: boolean;
  createdDatetime?: string;
  delete?: boolean;
  fullEdit?: boolean;
  lastModifiedDatetime?: string;
  lastModifiedSource?: string;
  lastModifiedUsername?: string;
  limitedEdit?: boolean;
  noEdit?: boolean;
  status?: string;
  submittedDatetime?: string;
}

/** The edit schema describes campaignType as LETTER, CARD, FLAT or PACKAGE, unlike create. */
export interface UspsMailCampaignEdit {
  campaignType?: string;
  mailpieceShape?: string;
  MID?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  campaignCode?: string;
  campaignTitle?: string;
  brandDisplayName?: string;
  startDate?: string;
  endDate?: string;
  startSerial?: string;
  endSerial?: string;
  targetUrl?: string;
  rideAlong?: string;
  replacementImage?: string;
  isShareable?: boolean;
  hasUrlParams?: boolean;
}

export interface UspsMailCampaignEditResponse {
  campaignID?: string;
  campaignType?: string;
  mailpieceShape?: string;
  MID?: string;
  submitterName?: string;
  submitterCRID?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  campaignCode?: string;
  campaignTitle?: string;
  brandDisplayName?: string;
  startDate?: string;
  endDate?: string;
  startSerial?: string;
  endSerial?: string;
  targetUrl?: string;
  campaignSource?: string;
  postalOneSaturationJobID?: string;
  rideAlong?: string;
  replacementImage?: string;
  addBarcode?: boolean;
  barcodeCount?: number;
  cancel?: boolean;
  createdDatetime?: string;
  delete?: boolean;
  fullEdit?: boolean;
  lastModifiedDatetime?: string;
  lastModifiedSource?: string;
  lastModifiedUsername?: string;
  limitedEdit?: boolean;
  noEdit?: boolean;
  status?: string;
  submittedDatetime?: string;
  isShareable?: boolean;
  hasUrlParams?: boolean;
}

export interface UspsMailCampaignSearchResponse {
  campaigns?: Array<{
    campaignID?: string;
    campaignType?: string;
    mailpieceShape?: string;
    MID?: string;
    submitterName?: string;
    submitterCRID?: string;
    mailOwnerCRID?: string;
    mailOwnerName?: string;
    campaignCode?: string;
    campaignTitle?: string;
    brandDisplayName?: string;
    startDate?: string;
    endDate?: string;
    startSerial?: string;
    endSerial?: string;
    campaignSource?: string;
    postalOneSaturationJobID?: string;
    addBarcode?: boolean;
    barcodeCount?: number;
    cancel?: boolean;
    createdDatetime?: string;
    delete?: boolean;
    fullEdit?: boolean;
    lastModifiedDatetime?: string;
    lastModifiedSource?: string;
    lastModifiedUsername?: string;
    limitedEdit?: boolean;
    noEdit?: boolean;
    status?: string;
    submittedDatetime?: string;
    isShareable?: boolean;
    hasUrlParams?: boolean;
  }>;
  metadata?: {
    totalCount?: number;
    page?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
  };
}

export interface UspsMailCampaignErrorMessage {
  apiVersion: string;
  error?: {
    code?: string;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  };
}

export interface UspsMailCampaignImbsRequest {
  /** The spec types this as one string and says nothing about its delimiter. */
  IMBs: string;
}

export interface UspsMailCampaignImbsAddedResponse {
  IMBs?: Array<{
    IMB?: string;
    pieceID?: number;
  }>;
}

export interface UspsMailCampaignImbsQueuedResponse {
  callbackKey?: string;
  status?: string;
}

export interface UspsMailCampaignImbsPartialSuccess {
  IMBs?: Array<{
    IMB?: string;
    pieceID?: number | null;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  }>;
}

export interface UspsMailCampaignImbsErrorMessage {
  IMBs: Array<{
    IMB?: string;
    pieceID?: number | null;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  }>;
}

export interface UspsMailCampaignCallbackSummary {
  campaignID?: string;
  totalBarcodes?: number;
  totalBarcodesAdded?: number;
  totalBarcodesFailed?: number;
  errors?: Array<{
    detail?: string;
    quantity?: number;
  }>;
}

export interface UspsMailCampaignCallbackDetail {
  errors?: Array<{
    IMB?: string;
    title?: string;
    detail?: string;
  }>;
  metadata?: {
    totalCount?: number;
    page?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
  };
}

export interface UspsMailCampaignQueryErrorResponse {
  apiVersion?: string;
  error?: {
    code?: string;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  };
}

export interface UspsMailCampaignCallbackKeySearchResponse {
  callbackKeys?: Array<{
    callbackKey?: string;
    campaignID?: string;
    submitterCRID?: string;
    submitterTransactionID?: string;
    submittedDatetime?: string;
    totalBarcodes?: number;
    totalBarcodesAdded?: number;
    totalBarcodesFailed?: number;
    expirationDatetime?: string;
    processingStatus?: string;
    active?: boolean;
  }>;
  metadata?: {
    totalCount?: number;
    page?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
  };
}

export interface UspsMailCampaignSearchParams {
  offset?: number;
  limit?: number;
  sort?: string;
  ezsearch?: string;
  barcodeCount?: number;
  brandDisplayName?: string;
  campaignCode?: string;
  MID?: string;
  mailpieceShape?: string;
  campaignTitle?: string;
  campaignType?: string;
  createdDatetime?: string;
  campaignSource?: string;
  endDate?: string;
  endSerial?: string;
  lastModifiedDatetime?: string;
  lastModifiedSource?: string;
  lastModifiedUsername?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  postalOneSaturationJobID?: string;
  isShareable?: boolean;
  startDate?: string;
  startSerial?: string;
  status?:
    | "SUBMITTED"
    | "ACTIVE"
    | "COMPLETE"
    | "CANCELLED"
    | "DELETED"
    | "DRAFT"
    | "INACTIVE";
  submittedDatetime?: string;
  hasUrlParams?: boolean;
}

export interface UspsMailCampaignCallbackKeySearchParams {
  offset?: number;
  limit?: number;
  sort?: string;
  campaignID?: string;
  submittedDatetime?: string;
  totalBarcodes?: number;
  totalBarcodesAdded?: number;
  totalBarcodesFailed?: number;
}

export interface UspsMailCampaignCallbackDetailParams {
  offset?: number;
  limit?: number;
  sort?: string;
  errorMessage?: string;
}

export interface UspsMailCampaignSubmitter {
  CRID: string;
}

export interface UspsMailCampaignRef extends UspsMailCampaignSubmitter {
  campaignID: string;
}

export interface UspsMailCampaignCallbackRef extends UspsMailCampaignSubmitter {
  callbackKey: string;
}

/** 201 with 25 or fewer IMBs, 202 with more (queued, poll by callback key), 207 partial success. */
export type UspsMailCampaignImbsResponse =
  | UspsMailCampaignImbsAddedResponse
  | UspsMailCampaignImbsQueuedResponse
  | UspsMailCampaignImbsPartialSuccess;
