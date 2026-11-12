import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsForwardingCancelOrderRequestV1,
  UpsForwardingCancelOrderResponseV1,
  UpsForwardingHeaders,
  UpsForwardingOrderPrintLabelRequestV1,
  UpsForwardingOrderRequestV1,
  UpsForwardingOrderResponseV1,
  UpsForwardingOrderSearchResponseV1,
  UpsForwardingOrderSetDateResponseV1,
  UpsForwardingPatchReplaceReqV1,
  UpsForwardingPrintLabelResponse,
  UpsForwardingSearchOrdersParams,
  UpsForwardingSetOrderDateParams,
} from "./types.js";
import {
  deepObjectParams,
  forwardingClient,
  forwardingHeaders,
  forwardingUrl,
} from "./utils.js";

export const createForwardingOrder = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingOrderRequestV1
): Promise<UpsForwardingOrderResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingOrderResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.createForwardingOrder",
      method: "POST",
      url: forwardingUrl("/orders"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0101",
    "Failed to create UPS Forwarding order"
  );
  return res.data;
};

/** A DELETE that carries a JSON body, as the spec defines it. */
export const cancelForwardingOrder = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingCancelOrderRequestV1
): Promise<UpsForwardingCancelOrderResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingCancelOrderResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.cancelForwardingOrder",
      method: "DELETE",
      url: forwardingUrl("/orders"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0102",
    "Failed to cancel UPS Forwarding order"
  );
  return res.data;
};

export const setForwardingOrderDate = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingSetOrderDateParams,
  data: UpsForwardingPatchReplaceReqV1
): Promise<UpsForwardingOrderSetDateResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingOrderSetDateResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.setForwardingOrderDate",
      method: "PATCH",
      url: forwardingUrl("/orders"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: {
        shipper_account_number: q.shipperAccountNumber,
        order_number: q.orderNumber,
        old_date: q.oldDate,
        language: q.language,
      },
      data,
    },
    "UPS_0103",
    "Failed to set UPS Forwarding order date"
  );
  return res.data;
};

export const searchForwardingOrders = async (
  clientName: string,
  { businessGuid, clientId, criteria }: UpsForwardingSearchOrdersParams
): Promise<UpsForwardingOrderSearchResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingOrderSearchResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.searchForwardingOrders",
      method: "GET",
      url: forwardingUrl("/orders"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: deepObjectParams("criteria", criteria),
    },
    "UPS_0104",
    "Failed to search UPS Forwarding orders"
  );
  return res.data;
};

export const createForwardingLabel = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingOrderPrintLabelRequestV1
): Promise<UpsForwardingPrintLabelResponse> => {
  const res = await tryHandleRequest<UpsForwardingPrintLabelResponse>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.createForwardingLabel",
      method: "POST",
      url: forwardingUrl("/documents/labels"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0105",
    "Failed to create UPS Forwarding label"
  );
  return res.data;
};
