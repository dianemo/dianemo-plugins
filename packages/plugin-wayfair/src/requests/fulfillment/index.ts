import handleGraphQLRequest from "../handleGraphQLRequest.js";
import {
  ShipOrderParams,
  ShipWayfairOrderResponse,
  WayfairShipOrderData,
} from "./types.js";

/**
 * Sends the advance shipment notice for a purchase order.
 *
 * Like `acceptOrder`, this answers with a feed handle rather than a result:
 * `status` reports whether the notice was submitted, and per-item `errors` fill
 * in asynchronously as Wayfair processes it.
 */
export const shipOrder = async (
  clientName: string,
  notice: ShipOrderParams
): Promise<ShipWayfairOrderResponse> => {
  return await handleGraphQLRequest<WayfairShipOrderData>(
    clientName,
    "wayfair.fulfillment.ship",
    "WFR_0007",
    "Failed to send Wayfair shipment notice",
    `mutation shipment($notice: ShipNoticeInput!) {
      purchaseOrders {
        shipment(notice: $notice) {
          id
          handle
          status
          submittedAt
          completedAt
          itemCount
          errorCount
          errors {
            key
            message
          }
          completedCount
          completed {
            key
            message
          }
          processingCount
          processing {
            key
            message
          }
        }
      }
    }`,
    { notice }
  );
};
