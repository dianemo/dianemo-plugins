import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExCancelShipmentRequest,
  FedExCancelShipmentResponse,
  FedExShipCancelTagParams,
  FedExShipCancelTagRequest,
  FedExShipCancelTagResponse,
  FedExShipCreateTagRequest,
  FedExShipCreateTagResponse,
  FedExShipGetShipmentAsyncResultsRequest,
  FedExShipGetShipmentAsyncResultsResponse,
  FedExShipValidateShipmentRequest,
  FedExShipValidateShipmentResponse,
} from "./types.js";

export const cancelShipment = async (
  clientName: string,
  data: FedExCancelShipmentRequest
): Promise<FedExCancelShipmentResponse> => {
  const url = "/ship/v1/shipments/cancel";
  const res = await tryHandleRequest<FedExCancelShipmentResponse>(
    {
      clientName,
      requestName: "fedex.shipping.cancelShipment",
      method: "PUT",
      url,
      data,
    },
    "FDX_0003",
    "Failed to cancel FedEx shipment"
  );
  return res.data;
};

export const getShipmentAsyncResults = async (
  clientName: string,
  data: FedExShipGetShipmentAsyncResultsRequest
): Promise<FedExShipGetShipmentAsyncResultsResponse> => {
  const url = "/ship/v1/shipments/results";
  const res = await tryHandleRequest<FedExShipGetShipmentAsyncResultsResponse>(
    {
      clientName,
      requestName: "fedex.shipping.getShipmentAsyncResults",
      method: "POST",
      url,
      data,
    },
    "FDX_0010",
    "Failed to get FedEx shipment async results"
  );
  return res.data;
};

export const validateShipment = async (
  clientName: string,
  data: FedExShipValidateShipmentRequest
): Promise<FedExShipValidateShipmentResponse> => {
  const url = "/ship/v1/shipments/packages/validate";
  const res = await tryHandleRequest<FedExShipValidateShipmentResponse>(
    {
      clientName,
      requestName: "fedex.shipping.validateShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0011",
    "Failed to validate FedEx shipment"
  );
  return res.data;
};

export const createTag = async (
  clientName: string,
  data: FedExShipCreateTagRequest
): Promise<FedExShipCreateTagResponse> => {
  const url = "/ship/v1/shipments/tag";
  const res = await tryHandleRequest<FedExShipCreateTagResponse>(
    {
      clientName,
      requestName: "fedex.shipping.createTag",
      method: "POST",
      url,
      data,
    },
    "FDX_0012",
    "Failed to create FedEx tag"
  );
  return res.data;
};

export const cancelTag = async (
  clientName: string,
  { shipmentId }: FedExShipCancelTagParams,
  data: FedExShipCancelTagRequest
): Promise<FedExShipCancelTagResponse> => {
  const url = `/ship/v1/shipments/tag/cancel/${encodeURIComponent(shipmentId)}`;
  const res = await tryHandleRequest<FedExShipCancelTagResponse>(
    {
      clientName,
      requestName: "fedex.shipping.cancelTag",
      method: "PUT",
      url,
      data,
    },
    "FDX_0013",
    "Failed to cancel FedEx tag"
  );
  return res.data;
};
