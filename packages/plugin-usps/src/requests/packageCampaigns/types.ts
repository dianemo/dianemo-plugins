export interface UspsPackageCampaign {
  campaignID?: string;
  MID: string;
  submitterName: string;
  submitterCRID?: string;
  mailOwnerCRID: string;
  mailOwnerName: string;
  campaignCode: string;
  campaignGroupingCode: string;
  campaignTitle: string;
  brandDisplayName: string;
  startDate: string;
  endDate: string;
  targetUrl: string;
  /** Base64-encoded image. */
  rideAlong: string;
  addBarcode?: boolean;
  barcodeCount?: number;
  cancel?: boolean;
  createdDatetime?: string;
  delete?: boolean;
  fullEdit?: boolean;
  lastModifiedDatetime?: string;
  limitedEdit?: boolean;
  noEdit?: boolean;
  status?: string;
  submittedDatetime?: string;
}

export interface UspsPackageCampaignCancelResponse {
  status?: string;
}

/** The spec types trackingNumbers as one string and says nothing about its delimiter. */
export interface UspsPackageCampaignTrackingNumbersRequest {
  trackingNumbers?: string;
}

export interface UspsPackageCampaignTrackingNumbersAddedResponse {
  trackingNumbers?: Array<{
    trackingNumber?: string;
    pieceID?: number;
  }>;
}

export interface UspsPackageCampaignTrackingNumbersPartialSuccess {
  trackingNumbers?: Array<{
    trackingNumber?: string;
    pieceID?: number | null;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  }>;
}

export interface UspsPackageCampaignEdit {
  MID?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  campaignCode?: string;
  campaignGroupingCode?: string;
  campaignTitle?: string;
  brandDisplayName?: string;
  startDate?: string;
  endDate?: string;
  targetUrl?: string;
  rideAlong?: string;
}

export interface UspsPackageCampaignEditResponse {
  campaignID?: string;
  MID?: string;
  submitterName?: string;
  submitterCRID?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  campaignCode?: string;
  campaignGroupingCode?: string;
  campaignTitle?: string;
  brandDisplayName?: string;
  startDate?: string;
  endDate?: string;
  targetUrl?: string;
  rideAlong?: string;
  addBarcode?: boolean;
  barcodeCount?: number;
  cancel?: boolean;
  createdDatetime?: string;
  delete?: boolean;
  fullEdit?: boolean;
  lastModifiedDatetime?: string;
  limitedEdit?: boolean;
  noEdit?: boolean;
  status?: string;
  submittedDatetime?: string;
}

export interface UspsPackageCampaignSearchResponse {
  campaigns?: Array<{
    campaignID?: string;
    MID?: string;
    submitterName?: string;
    submitterCRID?: string;
    mailOwnerCRID?: string;
    mailOwnerName?: string;
    campaignCode?: string;
    campaignGroupingCode?: string;
    campaignTitle?: string;
    brandDisplayName?: string;
    startDate?: string;
    endDate?: string;
    addBarcode?: boolean;
    barcodeCount?: number;
    cancel?: boolean;
    createdDatetime?: string;
    delete?: boolean;
    fullEdit?: boolean;
    lastModifiedDatetime?: string;
    limitedEdit?: boolean;
    noEdit?: boolean;
    status?: string;
    submittedDatetime?: string;
  }>;
  metadata?: {
    totalCount?: number;
    page?: number;
    totalPages?: number;
    limit?: number;
    offset?: number;
  };
}

export interface UspsPackageCampaignQueryErrorResponse {
  apiVersion?: string;
  error?: {
    code?: string;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  };
}

export interface UspsPackageCampaignDetail {
  campaignID?: string;
  MID?: string;
  submitterName?: string;
  submitterCRID?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  campaignCode?: string;
  campaignGroupingCode?: string;
  campaignTitle?: string;
  brandDisplayName?: string;
  startDate?: string;
  endDate?: string;
  targetUrl?: string;
  rideAlong?: string;
  addBarcode?: boolean;
  barcodeCount?: number;
  cancel?: boolean;
  createdDatetime?: string;
  delete?: boolean;
  fullEdit?: boolean;
  lastModifiedDatetime?: string;
  limitedEdit?: boolean;
  noEdit?: boolean;
  status?: string;
  submittedDatetime?: string;
}

export interface UspsPackageCampaignErrorMessage {
  apiVersion?: string;
  error?: {
    code?: string;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  };
}

export interface UspsPackageCampaignTrackingNumberErrorMessage {
  trackingNumbers?: Array<{
    trackingNumber?: string;
    pieceID?: number | null;
    errors?: Array<{
      title?: string;
      detail?: string;
    }>;
  }>;
}

export interface UspsPackageCampaignSearchParams {
  offset?: number;
  limit?: number;
  sort?: string;
  ezsearch?: string;
  barcodeCount?: number;
  brandDisplayName?: string;
  campaignCode?: string;
  campaignGroupingCode?: string;
  MID?: string;
  campaignTitle?: string;
  createdDatetime?: string;
  endDate?: string;
  lastModifiedDatetime?: string;
  mailOwnerCRID?: string;
  mailOwnerName?: string;
  startDate?: string;
  status?:
    "SUBMITTED" | "ACTIVE" | "COMPLETE" | "CANCELLED" | "DELETED" | "INACTIVE";
  submittedDatetime?: string;
}

export interface UspsPackageCampaignSubmitter {
  CRID: string;
}

export interface UspsPackageCampaignRef extends UspsPackageCampaignSubmitter {
  campaignID: string;
}

/** 201 when every tracking number was added, 207 when only some were. */
export type UspsPackageCampaignTrackingNumbersResponse =
  | UspsPackageCampaignTrackingNumbersAddedResponse
  | UspsPackageCampaignTrackingNumbersPartialSuccess;
