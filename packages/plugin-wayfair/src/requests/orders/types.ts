import { WayfairGraphQLData } from "../types.js";

/**
 * The dropship purchase order as `getDropshipPurchaseOrders` returns it. This is
 * the operation Wayfair's own integrations use; `purchaseOrders` is a different
 * root field with a much narrower shape — see
 * docs/wayfair-api.md#getdropshippurchaseorders-is-the-order-read
 */
export interface WayfairAgent {
  id: string;
  name: string;
}

export interface WayfairGetOrdersParams {
  //Max limit 25
  limit: number;
  hasResponse?: boolean;
  //UTC format date string "2020-04-27 10:16:44.000000 -04:00"
  fromDate?: string;
  poNumbers?: string[];
  sortOrder?: "ASC" | "DESC";
  offset?: number;
}

export interface WayfairShippingInfo {
  shipSpeed: WayfairShipSpeed;
  carrierCode: string;
  poolPointAgent: WayfairAgent | null;
  crossDockAgent: WayfairAgent | null;
  deliveryAgent: WayfairAgent | null;
}

export interface WayfairAddress {
  name: string;
  address1: string;
  address2: string | null;
  address3: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string | null;
}

export interface WayfairSupplier {
  id: string;
  name: string;
  shortName: string;
  status: string;
  websiteURL: string;
  currency: string;
}

export interface WayfairWarehouse {
  id: string;
  name: string;
  address: WayfairAddress;
  supplier: WayfairSupplier;
}

export interface WayfairEvent {
  id: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface WayfairProduct {
  partNumber: string;
  quantity: string;
  price: number;
  pieceCount: number;
  totalCost: number;
  name: string;
  weight: number | null;
  totalWeight: number;
  estShipDate: string | null;
  fillDate: string | null;
  sku: string;
  isCancelled: boolean;
  isTscaCompliant: boolean;
  twoDayGuaranteeDeliveryDeadline: string | null;
  event: WayfairEvent | null;
  customComment: string;
}

export interface WayfairBillingInfo {
  vatNumber: string;
}

export interface WayfairOrderResponse {
  id: number;
  storePrefix: string | null;
  poNumber: string;
  poDate: string;
  orderId: number;
  supplierId: number;
  supplierName: string;
  supplierAddress1: string | null;
  supplierAddress2: string | null;
  supplierAddress3: string | null;
  supplierCity: string | null;
  supplierState: string | null;
  supplierPostalCode: string;
  estimatedShipDate: string;
  scheduledDeliveryDate: string | null;
  deliveryMethodCode: string;
  customerName: string;
  customerAddress1: string;
  customerAddress2: string;
  customerCity: string;
  customerState: string;
  customerPostalCode: string;
  customerCountry: string;
  customerEmail: string;
  salesChannelName: string;
  orderType: string | null;
  shippingInfo: WayfairShippingInfo;
  packingSlipUrl: string;
  warehouse: WayfairWarehouse;
  products: WayfairProduct[];
  shipTo: WayfairAddress;
  billTo: WayfairAddress;
  billingInfo: WayfairBillingInfo;
}

export interface WayfairGetOrdersData {
  getDropshipPurchaseOrders: WayfairOrderResponse[];
}

export type WayfairGetOrdersResponse = WayfairGraphQLData<WayfairGetOrdersData>;

export type WayfairShipSpeed =
  | "SECOND_DAY_AIR"
  | "SECOND_DAY_AIR_FREE"
  | "FIVE_DAY_DIRECT"
  | "THREE_DAY"
  | "CONTAINER"
  | "EMAIL"
  | "FEDEX_HOME"
  | "GROUND"
  | "PAKETVERSAND"
  | "IMPERIAL_POOL_FREIGHT"
  | "NEXT_DAY"
  | "NEXT_DAY_OVERSEAS"
  | "NEXT_MORNING"
  | "NEXT_DAY_BEFORE_NINE"
  | "WILL_CALL"
  | "SATURDAY_DELIVERY"
  | "TRUCK_FREIGHT_CASKETS_ONE_DAY"
  | "TRUCK_FREIGHT_CASKETS_TWO_DAY"
  | "CURBSIDE_WITH_UNLOAD"
  | "TRUCK_LOAD"
  | "CURBSIDE"
  | "WHITE_GLOVE_BRONZE"
  | "WHITE_GLOVE_GOLD"
  | "WHITE_GLOVE_TWO_MAN"
  | "WHITE_GLOVE_PLATINUM"
  | "WHITE_GLOVE_SILVER"
  | "TRUCK_FREIGHT_THRESHOLD"
  | "STANDARD_VERSAND_SPERRGUT"
  | "ALMO"
  | "LARGE_PARCEL_COURIER"
  | "EUROPEAN_LINE_HAUL"
  | "ECONOMY"
  | "WHITE_GLOVE_ROOM_OF_CHOICE"
  | "TINY_PARCEL"
  | "GROUND_OVERSEA"
  | "LOW_COST_CARRIER"
  | "WHITE_GLOVE_INNOVEL"
  | "BACKYARD"
  | "CURBSIDE_DELIVERY"
  | "INSIDE_DELIVERY_PACKAGING_REMOVAL_REMOVAL_OF_OLD_APPLIANCE"
  | "ONE_MAN_PREMIUM"
  | "INSIDE_DELIVERY_PACKAGING_REMOVAL"
  | "THRESHOLD_DELIVERY"
  | "UK_1_MAN_48HRS"
  | "ALLIED_ROAD_EXPRESS"
  | "HUNTER_ROAD_EXPRESS"
  | "WHITE_GLOVE_CAPITAL_CITIES"
  | "SPEDITION_FREI_BORDSTEINKANTE"
  | "UK_1_MAN_LONG_DELIVERY"
  | "IN_HOME_MATTRESS_SET_UP_REMOVAL"
  | "WHITE_GLOVE_DELIVERY_ROOM_OF_CHOICE_W_INSTALLATION"
  | "WHITE_GLOVE_DELIVERY_ROOM_OF_CHOICE_W_INSTALLATION_HAUL_AWAY"
  | "WHITE_GLOVE_DELIVERY_ROOM_OF_CHOICE_W_HAUL_AWAY"
  | "ROOM_OF_CHOICE_DELIVERY_W_MOVE_TO_ANOTHER_ROOM"
  | "ROOM_OF_CHOICE_DELIVERY_W_INSTALL_MOVE_TO_ANOTHER_ROOM"
  | "GE_WG_DELIVERY"
  | "SAMSUNG_WG_DELIVERY"
  | "WAYFAIR_LARGE_APPLIANCES_DELIVERY"
  | "WAYFAIR_OFF_THE_SHELF";

export interface WayfairAcceptedLineItem {
  partNumber: string;
  quantity: number;
  unitPrice: number;
  estimatedShipDate: string;
}

export interface AcceptOrderParams {
  poNumber: string;
  shipSpeed: WayfairShipSpeed;
  lineItems: WayfairAcceptedLineItem[];
}

/** The async-feed envelope every `purchaseOrders` mutation answers with. */
export interface WayfairMutationResult {
  id: string;
  handle: string;
  status: string;
  submittedAt: string;
  completedAt: string;
  itemCount: number;
  errorCount: number;
  errors: WayfairMutationMessage[];
  completedCount: number;
  completed: WayfairMutationMessage[];
  processingCount: number;
  processing: WayfairMutationMessage[];
}

export interface WayfairMutationMessage {
  key: string;
  message: string;
}

export interface WayfairAcceptOrderData {
  purchaseOrders: {
    accept: WayfairMutationResult;
  };
}

export type AcceptWayfairOrderResponse =
  WayfairGraphQLData<WayfairAcceptOrderData>;
