import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsServiceStandardDirectoryRequest,
  UspsServiceStandardDirectoryResponse,
  UspsServiceStandardEstimatesParams,
  UspsServiceStandardEstimatesResponse,
  UspsServiceStandardFilesResponse,
  UspsServiceStandardSignedUrlParams,
  UspsServiceStandardSignedUrlResponse,
  UspsServiceStandardsParams,
  UspsServiceStandardsResponse,
  UspsServiceStandardZip5CodesResponse,
} from "./types.js";

// Three USPS APIs, three server prefixes: one family because they answer one
// question (how long does it take).
const STANDARDS = "/service-standards/v3";
const DIRECTORY = "/service-standards-directory/v3";
const FILES = "/service-standards-files/v3";

export const getServiceStandardsEstimates = async (
  clientName: string,
  params: UspsServiceStandardEstimatesParams
): Promise<UspsServiceStandardEstimatesResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardEstimatesResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.serviceStandards.getServiceStandardsEstimates",
      method: "GET",
      url: `${STANDARDS}/estimates`,
      params,
    },
    "USP_0057",
    "Failed to get USPS service standard estimates"
  );
  return res.data;
};

export const getServiceStandards = async (
  clientName: string,
  params: UspsServiceStandardsParams
): Promise<UspsServiceStandardsResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardsResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.serviceStandards.getServiceStandards",
      method: "GET",
      url: `${STANDARDS}/standards`,
      params,
    },
    "USP_0058",
    "Failed to get USPS service standards"
  );
  return res.data;
};

export const getServiceStandardsDirectoryZip5Codes = async (
  clientName: string
): Promise<UspsServiceStandardZip5CodesResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardZip5CodesResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.serviceStandards.getServiceStandardsDirectoryZip5Codes",
      method: "GET",
      url: `${DIRECTORY}/zip5Codes`,
    },
    "USP_0059",
    "Failed to get USPS service standards directory ZIP5 codes"
  );
  return res.data;
};

export const getServiceStandardsDirectory = async (
  clientName: string,
  data: UspsServiceStandardDirectoryRequest
): Promise<UspsServiceStandardDirectoryResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardDirectoryResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.serviceStandards.getServiceStandardsDirectory",
      method: "POST",
      url: `${DIRECTORY}/reporter`,
      data,
    },
    "USP_0060",
    "Failed to get USPS service standards directory"
  );
  return res.data;
};

export const listServiceStandardsFiles = async (
  clientName: string
): Promise<UspsServiceStandardFilesResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardFilesResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.serviceStandards.listServiceStandardsFiles",
      method: "GET",
      url: `${FILES}/files`,
    },
    "USP_0061",
    "Failed to list USPS service standards files"
  );
  return res.data;
};

export const generateServiceStandardsFileSignedUrl = async (
  clientName: string,
  { fileID }: UspsServiceStandardSignedUrlParams
): Promise<UspsServiceStandardSignedUrlResponse> => {
  const res = await tryHandleRequest<UspsServiceStandardSignedUrlResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName:
        "usps.serviceStandards.generateServiceStandardsFileSignedUrl",
      method: "GET",
      url: `${FILES}/files/${encodeURIComponent(fileID)}/generate-signed-url`,
    },
    "USP_0062",
    "Failed to generate USPS service standards file signed URL"
  );
  return res.data;
};
