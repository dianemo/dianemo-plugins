import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsPackageCampaign,
  UspsPackageCampaignCancelResponse,
  UspsPackageCampaignDetail,
  UspsPackageCampaignEdit,
  UspsPackageCampaignEditResponse,
  UspsPackageCampaignRef,
  UspsPackageCampaignSearchParams,
  UspsPackageCampaignSearchResponse,
  UspsPackageCampaignSubmitter,
  UspsPackageCampaignTrackingNumbersRequest,
  UspsPackageCampaignTrackingNumbersResponse,
} from "./types.js";

export const createPackageCampaign = async (
  clientName: string,
  { CRID }: UspsPackageCampaignSubmitter,
  data: UspsPackageCampaign
): Promise<UspsPackageCampaign> => {
  const res = await tryHandleRequest<UspsPackageCampaign>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.packageCampaigns.createPackageCampaign",
      method: "POST",
      url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}`,
      data,
    },
    "USP_0149",
    "Failed to create USPS Informed Delivery package campaign"
  );
  return res.data;
};

export const searchPackageCampaigns = async (
  clientName: string,
  { CRID }: UspsPackageCampaignSubmitter,
  params?: UspsPackageCampaignSearchParams
): Promise<UspsPackageCampaignSearchResponse> => {
  const res = await tryHandleRequest<UspsPackageCampaignSearchResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.packageCampaigns.searchPackageCampaigns",
      method: "GET",
      url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}`,
      params,
    },
    "USP_0150",
    "Failed to search USPS Informed Delivery package campaigns"
  );
  return res.data;
};

export const getPackageCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsPackageCampaignRef
): Promise<UspsPackageCampaignDetail> => {
  const res = await tryHandleRequest<UspsPackageCampaignDetail>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.packageCampaigns.getPackageCampaign",
      method: "GET",
      url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
    },
    "USP_0151",
    "Failed to get USPS Informed Delivery package campaign"
  );
  return res.data;
};

export const editPackageCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsPackageCampaignRef,
  data: UspsPackageCampaignEdit
): Promise<UspsPackageCampaignEditResponse> => {
  const res = await tryHandleRequest<UspsPackageCampaignEditResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.packageCampaigns.editPackageCampaign",
      method: "PUT",
      url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
      data,
    },
    "USP_0152",
    "Failed to edit USPS Informed Delivery package campaign"
  );
  return res.data;
};

export const cancelPackageCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsPackageCampaignRef
): Promise<UspsPackageCampaignCancelResponse> => {
  const res = await tryHandleRequest<UspsPackageCampaignCancelResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.packageCampaigns.cancelPackageCampaign",
      method: "DELETE",
      url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
    },
    "USP_0153",
    "Failed to cancel USPS Informed Delivery package campaign"
  );
  return res.data;
};

export const addPackageCampaignTrackingNumbers = async (
  clientName: string,
  { CRID, campaignID }: UspsPackageCampaignRef,
  data: UspsPackageCampaignTrackingNumbersRequest
): Promise<UspsPackageCampaignTrackingNumbersResponse> => {
  const res =
    await tryHandleRequest<UspsPackageCampaignTrackingNumbersResponse>(
      {
        clientName: uspsSubClient(clientName, "default"),
        requestName: "usps.packageCampaigns.addPackageCampaignTrackingNumbers",
        method: "POST",
        url: `/informed-delivery-package-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}/pieces`,
        data,
      },
      "USP_0154",
      "Failed to add tracking numbers to USPS Informed Delivery package campaign"
    );
  return res.data;
};
