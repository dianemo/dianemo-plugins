interface EbayFulfillmentLineItem {
  lineItemId: string;
  quantity?: number;
}
export interface EbayFulfillOrderData {
  // The date the order was shipped in ISO 8601 format.
  shippedDate?: string;
  shippingCarrierCode: string;
  trackingNumber: string;
  lineItems: EbayFulfillmentLineItem[];
}

export interface EbayGetFulfillmentResponse extends Omit<
  EbayFulfillOrderData,
  "trackingNumber"
> {
  fulfillmentId: string;
  shipmentTrackingNumber: string;
  lineItems: Required<EbayFulfillmentLineItem>[];
}
