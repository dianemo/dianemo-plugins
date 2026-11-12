import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExTrackAssociatedRequest,
  FedExTrackAssociatedResponse,
  FedExTrackDocumentsRequest,
  FedExTrackDocumentsResponse,
  FedExTrackNotificationRequest,
  FedExTrackNotificationResponse,
  FedExTrackReferencesRequest,
  FedExTrackReferencesResponse,
  FedExTrackTcnRequest,
  FedExTrackTcnResponse,
  TrackPackagesRequest,
  TrackPackagesResponse,
} from "./types.js";

export const trackPackages = async (
  clientName: string,
  data: TrackPackagesRequest
): Promise<TrackPackagesResponse> => {
  const url = "/track/v1/trackingnumbers";
  const res = await tryHandleRequest<TrackPackagesResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.track",
      method: "POST",
      url,
      data,
    },
    "FDX_0006",
    "Failed to track FedEx packages"
  );

  return res.data;
};

export const trackMultiplePieceShipment = async (
  clientName: string,
  data: FedExTrackAssociatedRequest
): Promise<FedExTrackAssociatedResponse> => {
  const url = "/track/v1/associatedshipments";
  const res = await tryHandleRequest<FedExTrackAssociatedResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.trackMultiplePieceShipment",
      method: "POST",
      url,
      data,
    },
    "FDX_0020",
    "Failed to track FedEx multiple piece shipment"
  );

  return res.data;
};

export const sendTrackingNotification = async (
  clientName: string,
  data: FedExTrackNotificationRequest
): Promise<FedExTrackNotificationResponse> => {
  const url = "/track/v1/notifications";
  const res = await tryHandleRequest<FedExTrackNotificationResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.sendTrackingNotification",
      method: "POST",
      url,
      data,
    },
    "FDX_0021",
    "Failed to send FedEx tracking notification"
  );

  return res.data;
};

export const trackByReferences = async (
  clientName: string,
  data: FedExTrackReferencesRequest
): Promise<FedExTrackReferencesResponse> => {
  const url = "/track/v1/referencenumbers";
  const res = await tryHandleRequest<FedExTrackReferencesResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.trackByReferences",
      method: "POST",
      url,
      data,
    },
    "FDX_0022",
    "Failed to track FedEx packages by reference"
  );

  return res.data;
};

export const trackByTrackingControlNumber = async (
  clientName: string,
  data: FedExTrackTcnRequest
): Promise<FedExTrackTcnResponse> => {
  const url = "/track/v1/tcn";
  const res = await tryHandleRequest<FedExTrackTcnResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.trackByTrackingControlNumber",
      method: "POST",
      url,
      data,
    },
    "FDX_0023",
    "Failed to track FedEx package by tracking control number"
  );

  return res.data;
};

export const getTrackingDocuments = async (
  clientName: string,
  data: FedExTrackDocumentsRequest
): Promise<FedExTrackDocumentsResponse> => {
  const url = "/track/v1/trackingdocuments";
  const res = await tryHandleRequest<FedExTrackDocumentsResponse>(
    {
      clientName,
      requestName: "fedex.packageTracking.getTrackingDocuments",
      method: "POST",
      url,
      data,
    },
    "FDX_0024",
    "Failed to get FedEx tracking documents"
  );

  return res.data;
};

export default trackPackages;
