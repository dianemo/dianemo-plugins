import { WayfairMutationResult } from "../orders/types.js";
import { WayfairGraphQLData } from "../types.js";

export interface WayfairShipmentAddress {
  name: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
}

export interface WayfairSmallParcelShipment {
  package: {
    code: { type: "TRACKING_NUMBER"; value: string };
    weight?: number;
  };
  items: {
    partNumber: string;
    quantity: number;
  }[];
}

export interface ShipOrderParams {
  poNumber: string;
  supplierId: number;
  packageCount: number;
  weight?: number;
  volume?: number;
  carrierCode: string;
  shipSpeed: string;
  trackingNumber: string;
  shipDate: string;
  smallParcelShipments: WayfairSmallParcelShipment[];
  destinationAddress: WayfairShipmentAddress;
  sourceAddress: WayfairShipmentAddress;
}

export interface WayfairShipOrderData {
  purchaseOrders: {
    shipment: WayfairMutationResult;
  };
}

export type ShipWayfairOrderResponse = WayfairGraphQLData<WayfairShipOrderData>;
