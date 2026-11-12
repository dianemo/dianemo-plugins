import handleGraphQLRequest from "../handleGraphQLRequest.js";
import {
  AcceptOrderParams,
  AcceptWayfairOrderResponse,
  WayfairAcceptOrderData,
  WayfairGetOrdersData,
  WayfairGetOrdersParams,
  WayfairGetOrdersResponse,
} from "./types.js";

/**
 * Dropship purchase orders.
 *
 * `getDropshipPurchaseOrders` rather than `purchaseOrders`: the two are separate
 * root fields, and only this one carries the warehouse, addresses, shipping
 * method and per-product cancellation state an order importer needs, or the
 * `hasResponse` / `poNumbers` / `sortOrder` filters it selects on. See
 * docs/wayfair-api.md#getdropshippurchaseorders-is-the-order-read
 *
 * Wayfair caps `limit` at 25, and pagination only holds under `sortOrder: "ASC"`.
 */
export const getOrders = async (
  clientName: string,
  params: WayfairGetOrdersParams = { limit: 25, hasResponse: false }
): Promise<WayfairGetOrdersResponse> => {
  return await handleGraphQLRequest<WayfairGetOrdersData>(
    clientName,
    "wayfair.orders.list",
    "WFR_0001",
    "Failed to fetch Wayfair dropship purchase orders",
    `query getDropshipPurchaseOrders($limit: Int32, $hasResponse: Boolean, $fromDate: IsoDateTime, $poNumbers: [String], $sortOrder: SortOrder) {
        getDropshipPurchaseOrders(limit: $limit, hasResponse: $hasResponse, fromDate: $fromDate, poNumbers: $poNumbers, sortOrder: $sortOrder) {
          id
          storePrefix
          poNumber
          poDate
          orderId
          supplierId
          supplierName
          supplierAddress1
          supplierAddress2
          supplierAddress3
          supplierCity
          supplierState
          supplierPostalCode
          estimatedShipDate
          scheduledDeliveryDate
          deliveryMethodCode
          customerName
          customerAddress1
          customerAddress2
          customerCity
          customerState
          customerPostalCode
          customerCountry
          customerEmail
          salesChannelName
          orderType
          shippingInfo {
            shipSpeed
            carrierCode
            poolPointAgent {
              id
              name
            }
            crossDockAgent {
              id
              name
            }
            deliveryAgent {
              id
              name
            }
          }
          packingSlipUrl
          warehouse {
            id
            name
            address {
              name
              address1
              address2
              address3
              city
              state
              country
              postalCode
              phoneNumber
            }
            supplier {
              id
              name
              shortName
              status
              websiteURL
              currency
            }
          }
          products {
            partNumber
            quantity
            price
            pieceCount
            totalCost
            name
            weight
            totalWeight
            estShipDate
            fillDate
            sku
            isCancelled
            isTscaCompliant
            twoDayGuaranteeDeliveryDeadline
            event {
              id
              type
              name
              startDate
              endDate
            }
            customComment
          }
          shipTo {
            name
            address1
            address2
            address3
            city
            state
            country
            postalCode
            phoneNumber
          }
          billTo {
            name
            address1
            address2
            address3
            city
            state
            country
            postalCode
            phoneNumber
          }
          billingInfo {
            vatNumber
          }
        }
    }`,
    { ...params }
  );
};

/**
 * Accepts a purchase order at the given ship speed. Wayfair answers with a feed
 * handle rather than a result: `status` is the state of the submission, not of
 * the acceptance, and `errors` fills in asynchronously as the feed processes.
 */
export const acceptOrder = async (
  clientName: string,
  params: AcceptOrderParams
): Promise<AcceptWayfairOrderResponse> => {
  return await handleGraphQLRequest<WayfairAcceptOrderData>(
    clientName,
    "wayfair.orders.accept",
    "WFR_0006",
    "Failed to accept Wayfair purchase order",
    `mutation accept($poNumber: String!, $shipSpeed: ShipSpeed!, $lineItems: [AcceptedLineItemInput!]!) {
      purchaseOrders {
        accept(poNumber: $poNumber, shipSpeed: $shipSpeed, lineItems: $lineItems) {
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
    { ...params }
  );
};
