import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsMailCampaign,
  UspsMailCampaignCallbackDetail,
  UspsMailCampaignCallbackDetailParams,
  UspsMailCampaignCallbackKeySearchParams,
  UspsMailCampaignCallbackKeySearchResponse,
  UspsMailCampaignCallbackRef,
  UspsMailCampaignCallbackSummary,
  UspsMailCampaignEdit,
  UspsMailCampaignEditResponse,
  UspsMailCampaignImbsRequest,
  UspsMailCampaignImbsResponse,
  UspsMailCampaignRef,
  UspsMailCampaignSearchParams,
  UspsMailCampaignSearchResponse,
  UspsMailCampaignSubmitter,
} from "./types.js";

export const createMailCampaign = async (
  clientName: string,
  { CRID }: UspsMailCampaignSubmitter,
  data: UspsMailCampaign
): Promise<UspsMailCampaign> => {
  const res = await tryHandleRequest<UspsMailCampaign>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.createMailCampaign",
      method: "POST",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}`,
      data,
    },
    "USP_0140",
    "Failed to create USPS Informed Delivery mail campaign"
  );
  return res.data;
};

export const searchMailCampaigns = async (
  clientName: string,
  { CRID }: UspsMailCampaignSubmitter,
  params?: UspsMailCampaignSearchParams
): Promise<UspsMailCampaignSearchResponse> => {
  const res = await tryHandleRequest<UspsMailCampaignSearchResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.searchMailCampaigns",
      method: "GET",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}`,
      params,
    },
    "USP_0141",
    "Failed to search USPS Informed Delivery mail campaigns"
  );
  return res.data;
};

export const getMailCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsMailCampaignRef
): Promise<UspsMailCampaign> => {
  const res = await tryHandleRequest<UspsMailCampaign>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.getMailCampaign",
      method: "GET",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
    },
    "USP_0142",
    "Failed to get USPS Informed Delivery mail campaign"
  );
  return res.data;
};

export const cancelMailCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsMailCampaignRef
): Promise<void> => {
  await tryHandleRequest(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.cancelMailCampaign",
      method: "DELETE",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
    },
    "USP_0143",
    "Failed to cancel USPS Informed Delivery mail campaign"
  );
};

export const editMailCampaign = async (
  clientName: string,
  { CRID, campaignID }: UspsMailCampaignRef,
  data: UspsMailCampaignEdit
): Promise<UspsMailCampaignEditResponse> => {
  const res = await tryHandleRequest<UspsMailCampaignEditResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.editMailCampaign",
      method: "PUT",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}`,
      data,
    },
    "USP_0144",
    "Failed to edit USPS Informed Delivery mail campaign"
  );
  return res.data;
};

export const addMailCampaignImbs = async (
  clientName: string,
  { CRID, campaignID }: UspsMailCampaignRef,
  data: UspsMailCampaignImbsRequest
): Promise<UspsMailCampaignImbsResponse> => {
  const res = await tryHandleRequest<UspsMailCampaignImbsResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.addMailCampaignImbs",
      method: "POST",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(campaignID)}/pieces`,
      data,
    },
    "USP_0145",
    "Failed to add IMBs to USPS Informed Delivery mail campaign"
  );
  return res.data;
};

export const searchMailCampaignCallbackKeys = async (
  clientName: string,
  { CRID }: UspsMailCampaignSubmitter,
  params?: UspsMailCampaignCallbackKeySearchParams
): Promise<UspsMailCampaignCallbackKeySearchResponse> => {
  const res = await tryHandleRequest<UspsMailCampaignCallbackKeySearchResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.searchMailCampaignCallbackKeys",
      method: "GET",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/callback`,
      params,
    },
    "USP_0146",
    "Failed to search USPS Informed Delivery callback keys"
  );
  return res.data;
};

export const getMailCampaignCallbackSummary = async (
  clientName: string,
  { CRID, callbackKey }: UspsMailCampaignCallbackRef
): Promise<UspsMailCampaignCallbackSummary> => {
  const res = await tryHandleRequest<UspsMailCampaignCallbackSummary>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.getMailCampaignCallbackSummary",
      method: "GET",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(callbackKey)}/summary`,
    },
    "USP_0147",
    "Failed to get USPS Informed Delivery callback key summary"
  );
  return res.data;
};

export const getMailCampaignCallbackDetail = async (
  clientName: string,
  { CRID, callbackKey }: UspsMailCampaignCallbackRef,
  params?: UspsMailCampaignCallbackDetailParams
): Promise<UspsMailCampaignCallbackDetail> => {
  const res = await tryHandleRequest<UspsMailCampaignCallbackDetail>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.mailCampaigns.getMailCampaignCallbackDetail",
      method: "GET",
      url: `/informed-delivery-campaigns/campaigns/${encodeURIComponent(CRID)}/${encodeURIComponent(callbackKey)}/detail`,
      params,
    },
    "USP_0148",
    "Failed to get USPS Informed Delivery callback key detail"
  );
  return res.data;
};
