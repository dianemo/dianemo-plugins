import {
  ExtensivDimensions,
  ExtensivItemId,
  ExtensivNamedId,
} from "../types.js";

export interface InventoryList {
  TotalResults: number;
  ResourceList: Inventory[];
}

export interface Inventory {
  ReceiverId: number;
  ReceivedDate: Date;
  ReceiveItemId: number;
  CustomerIdentifier: ExtensivNamedId;
  FacilityIdentifier: ExtensivNamedId;
  ItemIdentifier: ExtensivItemId;
  ItemDescription: string;
  Upc: string;
  Qualifier: string;
  InventoryUnitOfMeasure: ExtensivNamedId;
  ReceivedQty: number;
  OnHandQty: number;
  AvailableQty: number;
  OnHoldQty: number;
  SecondaryReceivedQty: number;
  WeightImperial: number;
  WeightImperialOnHand: number;
  WeightImperialAvailable: number;
  WeightMetric: number;
  WeightMetricOnHand: number;
  WeightMetricAvailable: number;
  PackagingUnitOfMeasureIdentifier: ExtensivNamedId;
  PrimaryUnitsPerPackagingUnit: number;
  AvailablePackaging: number;
  OnHandPackaging: number;
  InventroyAgeDays: number;
  LotNumber: string;
  ExpirationDate: Date;
  LocationIdentifier: LocationId;
  PalletIdentifier: PalletId;
  PalletTypeIdentifier: ExtensivNamedId;
  Imperial: ExtensivDimensions;
  OnHold: boolean;
  Quarantined: boolean;
  RowVersion: string;
  StockRowVersion: string;
  ReferenceNum: string;
  PONUmber: string;
  _links: Array<Record<string, Record<"href", string>>>;
}

interface LocationId {
  NameKey: { FacilityIdentifier: ExtensivNamedId; Name: string };
  Id: number;
}

interface PalletId {
  NameKey: { FacilityIdentifier: ExtensivNamedId; Name: string };
  Id: number;
}
