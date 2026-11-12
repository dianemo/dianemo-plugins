import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import { locationQuery } from "./utils.js";
import type {
  UspsLocationDropoffLocations,
  UspsLocationDropoffParams,
  UspsLocationFileParams,
  UspsLocationFiles,
  UspsLocationParcelLockerLocations,
  UspsLocationParcelLockerParams,
  UspsLocationPostOfficeParams,
  UspsLocationPostOfficeResponse,
  UspsLocationSignedURLResponse,
} from "./types.js";

export const getDropoffLocations = async (
  clientName: string,
  params: UspsLocationDropoffParams
): Promise<UspsLocationDropoffLocations> => {
  const res = await tryHandleRequest<UspsLocationDropoffLocations>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.locations.getDropoffLocations",
      method: "GET",
      url: "/locations/v3/dropoff-locations",
      params: locationQuery(params),
    },
    "USP_0071",
    "Failed to get USPS drop-off locations"
  );
  return res.data;
};

export const getPostOfficeLocations = async (
  clientName: string,
  params: UspsLocationPostOfficeParams = {}
): Promise<UspsLocationPostOfficeResponse> => {
  const res = await tryHandleRequest<UspsLocationPostOfficeResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.locations.getPostOfficeLocations",
      method: "GET",
      url: "/locations/v3/post-office-locations",
      params: locationQuery(params),
    },
    "USP_0072",
    "Failed to get USPS Post Office locations"
  );
  return res.data;
};

export const getParcelLockerLocations = async (
  clientName: string,
  params: UspsLocationParcelLockerParams = {}
): Promise<UspsLocationParcelLockerLocations> => {
  const res = await tryHandleRequest<UspsLocationParcelLockerLocations>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.locations.getParcelLockerLocations",
      method: "GET",
      url: "/locations/v3/parcel-locker-locations",
      params: locationQuery(params),
    },
    "USP_0073",
    "Failed to get USPS parcel locker locations"
  );
  return res.data;
};

export const listLocationFiles = async (
  clientName: string
): Promise<UspsLocationFiles> => {
  const res = await tryHandleRequest<UspsLocationFiles>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.locations.listFiles",
      method: "GET",
      url: "/locations/v3/files",
    },
    "USP_0074",
    "Failed to list USPS location files"
  );
  return res.data;
};

export const generateLocationFileSignedUrl = async (
  clientName: string,
  { fileID }: UspsLocationFileParams
): Promise<UspsLocationSignedURLResponse> => {
  const res = await tryHandleRequest<UspsLocationSignedURLResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.locations.generateFileSignedUrl",
      method: "GET",
      url: `/locations/v3/files/${encodeURIComponent(fileID)}/generate-signed-url`,
    },
    "USP_0075",
    "Failed to generate USPS location file signed URL"
  );
  return res.data;
};
