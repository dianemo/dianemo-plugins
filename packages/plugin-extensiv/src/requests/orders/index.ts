import { tryHandleRequest } from "@dianemo/plugin-kit";
import { ExtensivListOptions } from "../types.js";
import {
  OrderList,
  Order,
  NewOrderData,
  OrderItemDetailOptions,
  ExtensivOrderItem,
  UpdateOrderItemResponse,
  UpdateOrderOptions,
} from "./types.js";

export const getOrders = async (
  clientName: string,
  options?: ExtensivListOptions
): Promise<OrderList> => {
  const res = await tryHandleRequest<OrderList>(
    {
      clientName,
      requestName: "extensiv.orders.list",
      method: "GET",
      url: `/orders`,
      params: options,
    },
    "EXT_0009",
    "Failed to fetch Extensiv orders"
  );
  return res.data;
};

/**
 * Returns the ETag alongside the body: `cancelOrder` cannot be called without
 * one, and this is the only call that yields one for an order.
 */
export const getOrder = async (
  clientName: string,
  orderId: string
): Promise<{ data: Order; etag: string }> => {
  const res = await tryHandleRequest<Order>(
    {
      clientName,
      requestName: "extensiv.orders.get",
      method: "GET",
      url: `/orders/${orderId}`,
      params: {
        detail: "All",
        itemdetail: "All",
      },
    },
    "EXT_0010",
    "Failed to fetch Extensiv order"
  );
  return {
    data: res.data,
    etag: res.headers.etag,
  };
};

export const createOrder = async (
  clientName: string,
  data: NewOrderData
): Promise<Order> => {
  const res = await tryHandleRequest<Order>(
    {
      clientName,
      requestName: "extensiv.orders.create",
      method: "POST",
      url: `/orders`,
      data,
    },
    "EXT_0011",
    "Failed to create Extensiv order"
  );
  return res.data;
};

/**
 * A whole-order replace, so `order` must be a complete body — read it with
 * `getOrder`, which is also the only source of the `If-Match` ETag Extensiv
 * requires here.
 *
 * Members absent from the body are dropped rather than left unchanged, and the
 * narrower reads do not carry them all — see
 * docs/extensiv-api.md#put-ordersid-is-a-whole-order-replace
 */
export const updateOrder = async (
  clientName: string,
  orderId: number | string,
  order: Order,
  etag: string,
  options?: UpdateOrderOptions
): Promise<Order> => {
  const res = await tryHandleRequest<Order>(
    {
      clientName,
      requestName: "extensiv.orders.update",
      method: "PUT",
      url: `/orders/${orderId}`,
      params: options,
      headers: { "If-Match": etag },
      data: order,
    },
    "EXT_0025",
    "Failed to update Extensiv order"
  );
  return res.data;
};

/**
 * `etag` comes from `getOrder` — see
 * docs/extensiv-api.md#if-match-on-the-mutating-endpoints.
 */
export const cancelOrder = async (
  clientName: string,
  orderId: number,
  etag: string,
  reason: string
) => {
  const res = await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.orders.cancel",
      method: "POST",
      url: `/orders/${orderId}/canceler`,
      data: { reason },
      headers: { "If-Match": etag },
    },
    "EXT_0012",
    "Failed to cancel Extensiv order"
  );
  return res.data;
};

/**
 * Returns the ETag alongside the body: `updateOrderItem` and `deleteOrderItem`
 * have no other source for it.
 */
export const getOrderItems = async (
  clientName: string,
  orderId: number,
  orderItemId: number,
  detail?: OrderItemDetailOptions
): Promise<{ data: ExtensivOrderItem; etag: string }> => {
  const res = await tryHandleRequest<ExtensivOrderItem>(
    {
      clientName,
      requestName: "extensiv.orders.getItem",
      method: "GET",
      url: `/orders/${orderId}/items/${orderItemId}${
        detail ? `?detail=${detail}` : ""
      }`,
    },
    "EXT_0013",
    "Failed to fetch Extensiv order items"
  );
  return {
    data: res.data,
    etag: res.headers.etag,
  };
};

/** `etag` comes from `getOrderItems`. */
export const updateOrderItem = async (
  clientName: string,
  orderId: number,
  orderItemId: number,
  etag: string,
  data: ExtensivOrderItem
): Promise<UpdateOrderItemResponse> => {
  const res = await tryHandleRequest<UpdateOrderItemResponse>(
    {
      clientName,
      requestName: "extensiv.orders.updateItem",
      method: "PUT",
      url: `/orders/${orderId}/items/${orderItemId}`,
      data,
      headers: { "If-Match": etag },
    },
    "EXT_0014",
    "Failed to update Extensiv order item"
  );
  return res.data;
};

/** `etag` comes from `getOrderItems`. */
export const deleteOrderItem = async (
  clientName: string,
  orderId: number,
  orderItemId: number,
  etag: string
) => {
  await tryHandleRequest(
    {
      clientName,
      requestName: "extensiv.orders.deleteItem",
      method: "DELETE",
      url: `/orders/${orderId}/items/${orderItemId}`,
      headers: { "If-Match": etag },
    },
    "EXT_0015",
    "Failed to delete Extensiv order item"
  );
};
