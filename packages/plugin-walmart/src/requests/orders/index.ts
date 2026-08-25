import { tryHandleRequest } from "@dianemo/plugin-kit";
import { WalmartMarket } from "../items/types.js";
import globalHeaders from "../globalHeaders.js";
import {
  AcknowledgeWalmartOrderResponse,
  GetWalmartOrderData,
  GetWalmartOrderResponse,
  GetWalmartOrdersData,
  GetWalmartOrdersResponse,
  GetWalmartReleasedOrdersData,
  WalmartCancelOrderData,
  WalmartRefundOrderData,
  WalmartShipOrderData,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  filters?: GetWalmartOrdersData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<GetWalmartOrdersResponse>(
    {
      clientName,
      requestName: "walmart.orders.list",
      url: `/v3/orders`,
      method: "GET",
      headers: globalHeaders(market),
      params: filters,
    },
    "WMT_0001",
    "Failed to fetch Walmart orders"
  );
  return res.data;
};

export const getReleasedOrders = async (
  clientName: string,
  filters?: GetWalmartReleasedOrdersData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<GetWalmartOrdersResponse>(
    {
      clientName,
      requestName: "walmart.orders.listReleased",
      url: `/v3/orders/released`,
      method: "GET",
      headers: globalHeaders(market),
      params: filters,
    },
    "WMT_0019",
    "Failed to fetch Walmart released orders"
  );
  return res.data;
};

export const getOrder = async (
  clientName: string,
  purchaseOrderId: string,
  filters?: GetWalmartOrderData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<GetWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.get",
      url: `/v3/orders/${purchaseOrderId}`,
      method: "GET",
      headers: globalHeaders(market),
      params: filters,
    },
    "WMT_0002",
    "Failed to fetch Walmart order"
  );
  return res.data;
};

export const acknowledgeOrder = async (
  clientName: string,
  purchaseOrderId: string,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.acknowledge",
      url: `/v3/orders/${purchaseOrderId}/acknowledge`,
      method: "POST",
      headers: globalHeaders(market),
    },
    "WMT_0005",
    "Failed to acknowledge Walmart order"
  );
  return res.data;
};

export const shipOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartShipOrderData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.ship",
      url: `/v3/orders/${purchaseOrderId}/shipping`,
      method: "POST",
      headers: globalHeaders(market),
      data,
    },
    "WMT_0006",
    "Failed to ship Walmart order lines"
  );
  return res.data;
};

export const cancelOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartCancelOrderData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.cancel",
      url: `/v3/orders/${purchaseOrderId}/cancel`,
      method: "POST",
      headers: globalHeaders(market),
      data,
    },
    "WMT_0007",
    "Failed to cancel Walmart order lines"
  );
  return res.data;
};

export const refundOrderLines = async (
  clientName: string,
  purchaseOrderId: string,
  data: WalmartRefundOrderData,
  market?: WalmartMarket
) => {
  const res = await tryHandleRequest<AcknowledgeWalmartOrderResponse>(
    {
      clientName,
      requestName: "walmart.orders.refund",
      url: `/v3/orders/${purchaseOrderId}/refund`,
      method: "POST",
      headers: globalHeaders(market),
      data,
    },
    "WMT_0008",
    "Failed to refund Walmart order lines"
  );
  return res.data;
};
