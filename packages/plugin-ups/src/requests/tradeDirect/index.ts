import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsTradeDirectChildShipmentRef,
  UpsTradeDirectCloseoutRequest,
  UpsTradeDirectCloseoutResponse,
  UpsTradeDirectDeleteMasterParams,
  UpsTradeDirectDocumentRequest,
  UpsTradeDirectDocumentResponse,
  UpsTradeDirectLtlChildShipmentRef,
  UpsTradeDirectMasterShipmentRef,
} from "./types.js";

/**
 * `v1` is the only value the spec's `version` variable allows, and the spec
 * lists only the production host — see docs/ups-api.md#version-pins
 */
const TRADE_DIRECT_VERSION = "v1";
const BASE = `/api/ship/tradedirect/${TRADE_DIRECT_VERSION}/master-shipments`;

const masterPath = (usiNumber: string) =>
  `${BASE}/${encodeURIComponent(usiNumber)}`;

/** Delete a TradeDirect master shipment. UPS answers 204 with no body. */
export const deleteTradeDirectMasterShipment = async (
  clientName: string,
  { usiNumber, shipperAccountNumber }: UpsTradeDirectDeleteMasterParams
): Promise<void> => {
  await tryHandleRequest<void>(
    {
      clientName,
      requestName: "ups.tradeDirect.deleteTradeDirectMasterShipment",
      method: "DELETE",
      url: masterPath(usiNumber),
      params: { shipper_account_number: shipperAccountNumber },
    },
    "UPS_0077",
    "Failed to delete UPS TradeDirect master shipment"
  );
};

/** Delete one child shipment from a master. UPS answers 204 with no body. */
export const deleteTradeDirectChildShipment = async (
  clientName: string,
  { usiNumber, trackingNumber }: UpsTradeDirectChildShipmentRef
): Promise<void> => {
  await tryHandleRequest<void>(
    {
      clientName,
      requestName: "ups.tradeDirect.deleteTradeDirectChildShipment",
      method: "DELETE",
      url: `${masterPath(usiNumber)}/child-shipments/${encodeURIComponent(trackingNumber)}`,
    },
    "UPS_0078",
    "Failed to delete UPS TradeDirect child shipment"
  );
};

/**
 * Close out a master shipment and receive its invoice, BOL and pallet labels.
 * UPS answers 207 rather than 200 when it completed with warnings; both carry
 * the same body, plus a `message` on 207.
 */
export const closeoutTradeDirectMasterShipment = async (
  clientName: string,
  { usiNumber }: UpsTradeDirectMasterShipmentRef,
  data: UpsTradeDirectCloseoutRequest
): Promise<UpsTradeDirectCloseoutResponse> => {
  const res = await tryHandleRequest<UpsTradeDirectCloseoutResponse>(
    {
      clientName,
      requestName: "ups.tradeDirect.closeoutTradeDirectMasterShipment",
      method: "POST",
      url: `${masterPath(usiNumber)}/closeout`,
      data,
    },
    "UPS_0079",
    "Failed to close out UPS TradeDirect master shipment"
  );
  return res.data;
};

/** Delete one LTL child shipment from a master. UPS answers 204 with no body. */
export const deleteTradeDirectLtlChildShipment = async (
  clientName: string,
  { usiNumber, subProNumber }: UpsTradeDirectLtlChildShipmentRef
): Promise<void> => {
  await tryHandleRequest<void>(
    {
      clientName,
      requestName: "ups.tradeDirect.deleteTradeDirectLtlChildShipment",
      method: "DELETE",
      url: `${masterPath(usiNumber)}/ltl-child-shipments/${encodeURIComponent(subProNumber)}`,
    },
    "UPS_0080",
    "Failed to delete UPS TradeDirect LTL child shipment"
  );
};

/** Generate CCI, CBOL, BOL or pallet-label documents for a closed-out shipment. */
export const generateTradeDirectDocuments = async (
  clientName: string,
  data: UpsTradeDirectDocumentRequest
): Promise<UpsTradeDirectDocumentResponse> => {
  const res = await tryHandleRequest<UpsTradeDirectDocumentResponse>(
    {
      clientName,
      requestName: "ups.tradeDirect.generateTradeDirectDocuments",
      method: "POST",
      url: `${BASE}/documents`,
      data,
    },
    "UPS_0081",
    "Failed to generate UPS TradeDirect documents"
  );
  return res.data;
};
