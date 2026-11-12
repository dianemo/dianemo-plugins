import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsShippingRecoverLabelRequest,
  UpsShippingRecoverLabelResponse,
  UpsShippingRequestOptions,
  UpsShippingVoidOptions,
  VoidUpsShipmentResponse,
  UpsShipmentRequest,
  UpsShipmentResponse,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const SHIPPING_VERSION = "v2409";

/**
 * Not a dated version: Label Recovery's spec defaults to `v1` and describes the
 * value as a subversion list — see docs/ups-api.md#version-pins
 */
const LABEL_RECOVERY_VERSION = "v1";

/**
 * Void a shipment, or one package within it.
 *
 * The path takes the shipment's id, which for a single-package shipment is the
 * same 1Z value as the package's tracking number and on a multi-package shipment
 * is not — hence two separate arguments here, and a bug worth reading up on
 * before collapsing them again: docs/ups-api.md#void-takes-the-shipment-id-not-the-tracking-number
 *
 * @param trackingNumber - Voids only this package, leaving the rest of the
 * shipment intact. Omit it to void the whole shipment. For several packages the
 * spec asks for one value formatted as a bracketed list; see
 * docs/ups-api.md#shipping-spec-quirks
 */
export const voidShipment = async (
  clientName: string,
  shipmentIdentificationNumber: string,
  trackingNumber?: string,
  options: UpsShippingVoidOptions = {}
): Promise<VoidUpsShipmentResponse> => {
  const res = await tryHandleRequest<VoidUpsShipmentResponse>(
    {
      clientName,
      requestName: "ups.shipping.voidShipment",
      method: "DELETE",
      url: `/api/shipments/${SHIPPING_VERSION}/void/cancel/${encodeURIComponent(shipmentIdentificationNumber)}`,
      ...(trackingNumber && { params: { trackingnumber: trackingNumber } }),
      ...(options.shipperNumber && {
        headers: { shipperNumber: options.shipperNumber },
      }),
    },
    "UPS_0003",
    "Failed to void UPS shipment"
  );
  return res.data;
};

/** Purchases a label. */
export const requestShipment = async (
  clientName: string,
  data: UpsShipmentRequest,
  options: UpsShippingRequestOptions = {}
): Promise<UpsShipmentResponse> => {
  const res = await tryHandleRequest<UpsShipmentResponse>(
    {
      clientName,
      requestName: "ups.shipping.createShipment",
      method: "POST",
      url: `/api/shipments/${SHIPPING_VERSION}/ship`,
      ...(options.additionalAddressValidation && {
        params: {
          additionaladdressvalidation: options.additionalAddressValidation,
        },
      }),
      data,
    },
    "UPS_0005",
    "Failed to create UPS shipment"
  );
  return res.data;
};

/** Re-fetches the label, and where UPS holds them the receipt and forms, for a shipment already purchased. */
export const recoverLabel = async (
  clientName: string,
  data: UpsShippingRecoverLabelRequest
): Promise<UpsShippingRecoverLabelResponse> => {
  const res = await tryHandleRequest<UpsShippingRecoverLabelResponse>(
    {
      clientName,
      requestName: "ups.shipping.recoverLabel",
      method: "POST",
      url: `/api/labels/${LABEL_RECOVERY_VERSION}/recovery`,
      data,
    },
    "UPS_0020",
    "Failed to recover UPS label"
  );
  return res.data;
};
