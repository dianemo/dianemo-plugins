import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExConsolidationConfirmRequest,
  FedExConsolidationConfirmResponse,
  FedExConsolidationConfirmResultsRequest,
  FedExConsolidationConfirmResultsResponse,
  FedExConsolidationCreateRequest,
  FedExConsolidationCreateResponse,
  FedExConsolidationCreateShipmentRequest,
  FedExConsolidationCreateShipmentResponse,
  FedExConsolidationDeleteRequest,
  FedExConsolidationDeleteResponse,
  FedExConsolidationDeleteShipmentsRequest,
  FedExConsolidationDeleteShipmentsResponse,
  FedExConsolidationModifyRequest,
  FedExConsolidationModifyResponse,
  FedExConsolidationRetrieveRequest,
  FedExConsolidationRetrieveResponse,
  FedExConsolidationShipmentResultsRequest,
  FedExConsolidationShipmentResultsResponse,
} from "./types.js";

export const createConsolidation = async (
  clientName: string,
  data: FedExConsolidationCreateRequest
): Promise<FedExConsolidationCreateResponse> => {
  const url = "/ship/v1/consolidations";
  const res = await tryHandleRequest<FedExConsolidationCreateResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.createConsolidation",
      method: "POST",
      url,
      data,
    },
    "FDX_0050",
    "Failed to create FedEx consolidation"
  );
  return res.data;
};

export const modifyConsolidation = async (
  clientName: string,
  data: FedExConsolidationModifyRequest
): Promise<FedExConsolidationModifyResponse> => {
  const url = "/ship/v1/consolidations";
  const res = await tryHandleRequest<FedExConsolidationModifyResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.modifyConsolidation",
      method: "PUT",
      url,
      data,
    },
    "FDX_0051",
    "Failed to modify FedEx consolidation"
  );
  return res.data;
};

export const createConsolidationShipment = async (
  clientName: string,
  data: FedExConsolidationCreateShipmentRequest
): Promise<FedExConsolidationCreateShipmentResponse> => {
  const url = "/ship/v1/consolidations/shipments";
  const res = await tryHandleRequest<FedExConsolidationCreateShipmentResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.createConsolidationShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0052",
    "Failed to create FedEx consolidation shipment"
  );
  return res.data;
};

export const getConsolidationShipmentResults = async (
  clientName: string,
  data: FedExConsolidationShipmentResultsRequest
): Promise<FedExConsolidationShipmentResultsResponse> => {
  const url = "/ship/v1/consolidations/results";
  const res = await tryHandleRequest<FedExConsolidationShipmentResultsResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.getConsolidationShipmentResults",
      method: "POST",
      url,
      data,
    },
    "FDX_0053",
    "Failed to get FedEx consolidation shipment results"
  );
  return res.data;
};

export const confirmConsolidation = async (
  clientName: string,
  data: FedExConsolidationConfirmRequest
): Promise<FedExConsolidationConfirmResponse> => {
  const url = "/ship/v1/consolidations/confirmations";
  const res = await tryHandleRequest<FedExConsolidationConfirmResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.confirmConsolidation",
      method: "POST",
      url,
      data,
    },
    "FDX_0054",
    "Failed to confirm FedEx consolidation"
  );
  return res.data;
};

export const getConfirmConsolidationResults = async (
  clientName: string,
  data: FedExConsolidationConfirmResultsRequest
): Promise<FedExConsolidationConfirmResultsResponse> => {
  const url = "/ship/v1/consolidations/confirmationresults";
  const res = await tryHandleRequest<FedExConsolidationConfirmResultsResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.getConfirmConsolidationResults",
      method: "POST",
      url,
      data,
    },
    "FDX_0055",
    "Failed to get FedEx confirm consolidation results"
  );
  return res.data;
};

export const retrieveConsolidation = async (
  clientName: string,
  data: FedExConsolidationRetrieveRequest
): Promise<FedExConsolidationRetrieveResponse> => {
  const url = "/ship/v1/consolidations/retrieve";
  const res = await tryHandleRequest<FedExConsolidationRetrieveResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.retrieveConsolidation",
      method: "POST",
      url,
      data,
    },
    "FDX_0056",
    "Failed to retrieve FedEx consolidation"
  );
  return res.data;
};

export const deleteConsolidationShipments = async (
  clientName: string,
  data: FedExConsolidationDeleteShipmentsRequest
): Promise<FedExConsolidationDeleteShipmentsResponse> => {
  const url = "/ship/v1/consolidations/shipments/delete";
  const res = await tryHandleRequest<FedExConsolidationDeleteShipmentsResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.deleteConsolidationShipments",
      method: "PUT",
      url,
      data,
    },
    "FDX_0057",
    "Failed to delete FedEx consolidation shipments"
  );
  return res.data;
};

export const deleteConsolidation = async (
  clientName: string,
  data: FedExConsolidationDeleteRequest
): Promise<FedExConsolidationDeleteResponse> => {
  const url = "/ship/v1/consolidations/delete";
  const res = await tryHandleRequest<FedExConsolidationDeleteResponse>(
    {
      clientName,
      requestName: "fedex.consolidation.deleteConsolidation",
      method: "PUT",
      url,
      data,
    },
    "FDX_0058",
    "Failed to delete FedEx consolidation"
  );
  return res.data;
};
