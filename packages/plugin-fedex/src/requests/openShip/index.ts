import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExOpenShipAddOpenShipmentPackagesData,
  FedExOpenShipAddOpenShipmentPackagesResponse,
  FedExOpenShipConfirmOpenShipmentData,
  FedExOpenShipConfirmOpenShipmentResponse,
  FedExOpenShipCreateOpenShipmentData,
  FedExOpenShipCreateOpenShipmentResponse,
  FedExOpenShipDeleteOpenShipmentData,
  FedExOpenShipDeleteOpenShipmentPackagesData,
  FedExOpenShipDeleteOpenShipmentPackagesResponse,
  FedExOpenShipDeleteOpenShipmentResponse,
  FedExOpenShipGetOpenShipmentResultsData,
  FedExOpenShipGetOpenShipmentResultsResponse,
  FedExOpenShipModifyOpenShipmentData,
  FedExOpenShipModifyOpenShipmentPackagesData,
  FedExOpenShipModifyOpenShipmentPackagesResponse,
  FedExOpenShipModifyOpenShipmentResponse,
  FedExOpenShipRetrieveOpenShipmentData,
  FedExOpenShipRetrieveOpenShipmentPackagesData,
  FedExOpenShipRetrieveOpenShipmentPackagesResponse,
  FedExOpenShipRetrieveOpenShipmentResponse,
} from "./types.js";

// FedEx writes some URLs with a trailing slash (modify and confirm share
// "/ship/v1/openshipments/", told apart only by PUT vs POST). Kept exactly as the
// spec has them: see docs/fedex-api.md#open-ship.
export const createOpenShipment = async (
  clientName: string,
  data: FedExOpenShipCreateOpenShipmentData
): Promise<FedExOpenShipCreateOpenShipmentResponse> => {
  const url = "/ship/v1/openshipments/create";
  const res = await tryHandleRequest<FedExOpenShipCreateOpenShipmentResponse>(
    {
      clientName,
      requestName: "fedex.openShip.createOpenShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0030",
    "Failed to create an open shipment with FedEx"
  );
  return res.data;
};

export const modifyOpenShipment = async (
  clientName: string,
  data: FedExOpenShipModifyOpenShipmentData
): Promise<FedExOpenShipModifyOpenShipmentResponse> => {
  const url = "/ship/v1/openshipments/";
  const res = await tryHandleRequest<FedExOpenShipModifyOpenShipmentResponse>(
    {
      clientName,
      requestName: "fedex.openShip.modifyOpenShipment",
      method: "PUT",
      url,
      data,
    },
    "FDX_0031",
    "Failed to modify an open shipment with FedEx"
  );
  return res.data;
};

export const confirmOpenShipment = async (
  clientName: string,
  data: FedExOpenShipConfirmOpenShipmentData
): Promise<FedExOpenShipConfirmOpenShipmentResponse> => {
  const url = "/ship/v1/openshipments/";
  const res = await tryHandleRequest<FedExOpenShipConfirmOpenShipmentResponse>(
    {
      clientName,
      requestName: "fedex.openShip.confirmOpenShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0032",
    "Failed to confirm an open shipment with FedEx"
  );
  return res.data;
};

export const modifyOpenShipmentPackages = async (
  clientName: string,
  data: FedExOpenShipModifyOpenShipmentPackagesData
): Promise<FedExOpenShipModifyOpenShipmentPackagesResponse> => {
  const url = "/ship/v1/openshipments/packages";
  const res =
    await tryHandleRequest<FedExOpenShipModifyOpenShipmentPackagesResponse>(
      {
        clientName,
        requestName: "fedex.openShip.modifyOpenShipmentPackages",
        method: "PUT",
        url,
        data,
      },
      "FDX_0033",
      "Failed to modify open shipment packages with FedEx"
    );
  return res.data;
};

export const addOpenShipmentPackages = async (
  clientName: string,
  data: FedExOpenShipAddOpenShipmentPackagesData
): Promise<FedExOpenShipAddOpenShipmentPackagesResponse> => {
  const url = "/ship/v1/openshipments/packages";
  const res =
    await tryHandleRequest<FedExOpenShipAddOpenShipmentPackagesResponse>(
      {
        clientName,
        requestName: "fedex.openShip.addOpenShipmentPackages",
        method: "POST",
        url,
        data,
      },
      "FDX_0034",
      "Failed to add open shipment packages with FedEx"
    );
  return res.data;
};

export const deleteOpenShipmentPackages = async (
  clientName: string,
  data: FedExOpenShipDeleteOpenShipmentPackagesData
): Promise<FedExOpenShipDeleteOpenShipmentPackagesResponse> => {
  const url = "/ship/v1/openshipments/packages/delete";
  const res =
    await tryHandleRequest<FedExOpenShipDeleteOpenShipmentPackagesResponse>(
      {
        clientName,
        requestName: "fedex.openShip.deleteOpenShipmentPackages",
        method: "PUT",
        url,
        data,
      },
      "FDX_0035",
      "Failed to delete open shipment packages with FedEx"
    );
  return res.data;
};

export const retrieveOpenShipmentPackages = async (
  clientName: string,
  data: FedExOpenShipRetrieveOpenShipmentPackagesData
): Promise<FedExOpenShipRetrieveOpenShipmentPackagesResponse> => {
  const url = "/ship/v1/openshipments/packages/retrieve";
  const res =
    await tryHandleRequest<FedExOpenShipRetrieveOpenShipmentPackagesResponse>(
      {
        clientName,
        requestName: "fedex.openShip.retrieveOpenShipmentPackages",
        method: "POST",
        url,
        data,
      },
      "FDX_0036",
      "Failed to retrieve open shipment packages with FedEx"
    );
  return res.data;
};

export const deleteOpenShipment = async (
  clientName: string,
  data: FedExOpenShipDeleteOpenShipmentData
): Promise<FedExOpenShipDeleteOpenShipmentResponse> => {
  const url = "/ship/v1/openshipments/delete";
  const res = await tryHandleRequest<FedExOpenShipDeleteOpenShipmentResponse>(
    {
      clientName,
      requestName: "fedex.openShip.deleteOpenShipment",
      method: "PUT",
      url,
      data,
    },
    "FDX_0037",
    "Failed to delete an open shipment with FedEx"
  );
  return res.data;
};

export const retrieveOpenShipment = async (
  clientName: string,
  data: FedExOpenShipRetrieveOpenShipmentData
): Promise<FedExOpenShipRetrieveOpenShipmentResponse> => {
  const url = "/ship/v1/openshipments/retrieve";
  const res = await tryHandleRequest<FedExOpenShipRetrieveOpenShipmentResponse>(
    {
      clientName,
      requestName: "fedex.openShip.retrieveOpenShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0038",
    "Failed to retrieve an open shipment with FedEx"
  );
  return res.data;
};

export const getOpenShipmentResults = async (
  clientName: string,
  data: FedExOpenShipGetOpenShipmentResultsData
): Promise<FedExOpenShipGetOpenShipmentResultsResponse> => {
  const url = "/ship/v1/openshipments/results";
  const res =
    await tryHandleRequest<FedExOpenShipGetOpenShipmentResultsResponse>(
      {
        clientName,
        requestName: "fedex.openShip.getOpenShipmentResults",
        method: "POST",
        url,
        data,
      },
      "FDX_0039",
      "Failed to get open shipment results with FedEx"
    );
  return res.data;
};
