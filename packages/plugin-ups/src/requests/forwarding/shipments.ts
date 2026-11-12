import { forwardingClient, forwardingHeaders, forwardingUrl } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsForwardingAirFreightRateRequestV1,
  UpsForwardingAirFreightRateResponseV1,
  UpsForwardingAirShipRequestV1,
  UpsForwardingAirShipResponseV1,
  UpsForwardingAirShipmentCancelRequestV1,
  UpsForwardingAirShipmentCancelResponseV1,
  UpsForwardingAirShipmentDataResponseV1,
  UpsForwardingFullTrackingDetailsResponseV1,
  UpsForwardingHeaders,
  UpsForwardingMilestonesParams,
  UpsForwardingPatchReplaceReqV1,
  UpsForwardingPrintManifestRequestV1,
  UpsForwardingShipmentDetailResponseV1,
  UpsForwardingShipmentDetailsParams,
  UpsForwardingSubmitShipmentsParams,
} from "./types.js";

export const getForwardingShipmentRates = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingAirFreightRateRequestV1
): Promise<UpsForwardingAirFreightRateResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingAirFreightRateResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingShipmentRates",
      method: "POST",
      url: forwardingUrl("/shipments/rates"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0100",
    "Failed to get UPS Forwarding shipment rates"
  );
  return res.data;
};

export const submitForwardingOrderShipments = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingSubmitShipmentsParams,
  data: UpsForwardingPatchReplaceReqV1
): Promise<UpsForwardingAirShipmentDataResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingAirShipmentDataResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.submitForwardingOrderShipments",
      method: "PATCH",
      url: forwardingUrl("/shipments"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: {
        shipper_account_number: q.shipperAccountNumber,
        pickup_date: q.pickupDate,
        request_manifest: q.requestManifest,
        manifest_format: q.manifestFormat,
      },
      data,
    },
    "UPS_0106",
    "Failed to submit UPS Forwarding order shipments"
  );
  return res.data;
};

/** A DELETE that carries a JSON body, as the spec defines it. */
export const cancelForwardingShipment = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingAirShipmentCancelRequestV1
): Promise<UpsForwardingAirShipmentCancelResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingAirShipmentCancelResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.cancelForwardingShipment",
      method: "DELETE",
      url: forwardingUrl("/shipments"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0107",
    "Failed to cancel UPS Forwarding shipment"
  );
  return res.data;
};

export const createForwardingShipment = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingAirShipRequestV1
): Promise<UpsForwardingAirShipResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingAirShipResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.createForwardingShipment",
      method: "POST",
      url: forwardingUrl("/shipments"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0108",
    "Failed to create UPS Forwarding shipment"
  );
  return res.data;
};

export const getForwardingShipmentDetails = async (
  clientName: string,
  {
    businessGuid,
    clientId,
    requestType,
    shipmentId,
  }: UpsForwardingShipmentDetailsParams
): Promise<UpsForwardingShipmentDetailResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingShipmentDetailResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingShipmentDetails",
      method: "GET",
      url: forwardingUrl("/shipments"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: { request_type: requestType, shipment_id: shipmentId },
    },
    "UPS_0109",
    "Failed to get UPS Forwarding shipment details"
  );
  return res.data;
};

export const createForwardingManifest = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingPrintManifestRequestV1
): Promise<UpsForwardingAirShipmentDataResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingAirShipmentDataResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.createForwardingManifest",
      method: "POST",
      url: forwardingUrl("/documents/manifests"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0110",
    "Failed to create UPS Forwarding manifest"
  );
  return res.data;
};

export const getForwardingShipmentMilestones = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingMilestonesParams
): Promise<UpsForwardingFullTrackingDetailsResponseV1> => {
  const res =
    await tryHandleRequest<UpsForwardingFullTrackingDetailsResponseV1>(
      {
        clientName: forwardingClient(clientName),
        requestName: "ups.forwarding.getForwardingShipmentMilestones",
        method: "GET",
        url: forwardingUrl("/shipments/milestones"),
        headers: forwardingHeaders({ businessGuid, clientId }),
        params: {
          business_id: q.businessId,
          ups_file_number: q.upsFileNumber,
          ups_office: q.upsOffice,
          ups_shipment_number: q.upsShipmentNumber,
        },
      },
      "UPS_0121",
      "Failed to get UPS Forwarding shipment milestones"
    );
  return res.data;
};
