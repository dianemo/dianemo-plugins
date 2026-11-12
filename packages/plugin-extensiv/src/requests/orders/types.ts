import { ExtensivAddress } from "../types.js";

export type OrderItemDetailOptions =
  "None" | "SavedElements" | "Allocations" | "All" | "AllocationsWithDetail";

export interface UpdateOrderOptions {
  /** Which sections the *response* carries. The request body is always whole. */
  detail?: string;
  /** Re-runs the customer's auto-charge rules against the updated order. */
  recalcautocharges?: boolean;
}

/**
 * `ReadOnly.Status` on an order. Extensiv sends the number; these are the three
 * it uses. A canceled order also carries `IsClosed: true` and a `-CANCELED-`
 * suffix on its reference number — see
 * docs/extensiv-api.md#a-canceled-order-reports-as-closed
 */
export enum ExtensivOrderStatus {
  OPEN = 0,
  CLOSED = 1,
  CANCELED = 2,
}

export interface NewOrderData {
  CustomerIdentifier?: { Name?: string; Id: number };
  FacilityIdentifier?: { Name?: string; Id: number };
  ReferenceNum: string;
  Notes: string;
  ShippingNotes?: string;
  AsnNumber?: string;
  BillingCode: string;
  RoutingInfo?: ShipmentRoutingInfo;
  ShipTo: ExtensivAddress;
  PoNum?: string;
  OrderItems: OrderItem[];
}

export interface Order {
  ReadOnly: OrderInfo;
  ReferenceNum: string;
  Notes: string;
  TotalWeight: number;
  TotalVolume: number;
  BillingCode: string;
  AddFreightToCod: boolean;
  UpsIsResidential: boolean;
  FulfillInvinfo: FulfillInvInfo;
  RoutingInfo: RoutingInfo;
  OrderItems: ExtensivOrderItem[];
  _links: Array<object>;
}

interface OrderInfo {
  OrderId: number;
  AsnCandidate: number;
  RouteCandidate: number;
  FullyAllocated: boolean;
  DeferNotification: boolean;
  IsClosed: boolean;
  ProcessDate: string;
  PickStarted: boolean;
  PickDoneDate: string;
  PickTicketPrintDate: string;
  PackStarted: boolean;
  PackDoneDate: string;
  LoadedState: number;
  RouteSent: boolean;
  AsnSent: boolean;
  Packages: ExtensivPackage[];
  ParcelLabelType: number;
  CustomIdentifier: { Name: string; Id: number };
  FacilityIdentifier: { Name: string; Id: number };
  WarehouseTransactionSourceType: number;
  TransactionEntryType: number;
  CreationDate: string;
  CreatedByIdentifier: { Name: string; Id: number };
  LastModifiedDate: string;
  LastModifiedByIdentifier: { Name: string; Id: number };
  Status: ExtensivOrderStatus;
}

interface ExtensivPackage {
  PackageId: number;
  PackageTypeId: number;
  Length: number;
  Width: number;
  Height: number;
  Weight: number;
  CodAmount: number;
  InsuredAmount: number;
  TrackingNumber: string;
  CreateDate: string;
  Oversize: boolean;
  Cod: boolean;
  Ucc128: number;
  CartonId: string;
  PackageContents: ExtensivPackageContents[];
}

interface ExtensivPackageContents {
  PackageContentId: number;
  PackageId: number;
  OrderItemId: number;
  ReceiveItemId: number;
  Qty: number;
  CreateDate: string;
  SerialNumbers: string[];
}

export interface ExtensivOrderItem {
  ReadOnly: {
    OrderItemId: number;
    FullyAllocated: boolean;
    UnitIdentifier: {
      Name: string;
      Id: number;
    };
    OriginalPrimaryQty: number;
    IsOrderQtySecondary: boolean;
    Allocations: [
      {
        ReceiveItemId: number;
        Qty: number;
        ProperlyPickedPrimary: number;
        ProperlyPickedSecondary: number;
        LoadedOut: boolean;
        RowVersion: string;
      },
    ];
    IsInsert: boolean;
    MaxToAllocateFromPickLine: number;
    RowVersion: string;
  };
  ItemIdentifier: {
    Sku: string;
    Id: number;
  };
  Qualifier: string;
  Qty: number;
  WeightImperial: number;
  WeightMetric: number;
  SavedElements: [];
  IsInsert: boolean;
  _links: string[];
}

export interface OrderList {
  TotalResults: number;
  ResourceList: Order[];
}

export interface OrderItem {
  ItemIdentifier: { Sku: string };
  Qty: number;
}

interface RoutingInfo {
  IsCod: boolean;
  IsInsurance: boolean;
  RequiresDeliveryConf: boolean;
  RequiresReturnReceipt: boolean;
  Carrier: string;
  Mode: string;
  TrackingNumber: string;
}

export interface ShipmentRoutingInfo {
  IsCod?: boolean;
  IsInsurance?: boolean;
  RequiresDeliveryConf?: boolean;
  RequiresReturnReceipt?: boolean;
  Carrier?: string;
  Mode?: string;
  ScacCode?: string;
  Account?: string;
  ShipPointZip?: string;
}

interface FulfillInvInfo {
  FulfillInvShippingAndHandling: number;
  FulfillInvTax: number;
  FulfillInvDiscountCode: string;
  FullfillInvDiscountAmount: number;
  FulfillInvGiftMessage: string;
}

/** Not `_embedded`: see docs/extensiv-api.md#collections-arrive-as-resourcelist */
export interface UpdateOrderItemResponse {
  ResourceList: ExtensivOrderItem[];
}
