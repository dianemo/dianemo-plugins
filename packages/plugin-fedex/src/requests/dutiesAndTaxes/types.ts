import { FedExResponse } from "../types.js";

export interface FedExDutiesTaxesParty {
  countryCode: string;
  postalCode?: string;
  stateOrProvinceCode?: string;
}

export interface FedExDutiesTaxesCommodity {
  commodityName?: string;
  /** 2-letter country code, max length 2. */
  countryOfManufacture?: string;
  description: string;
  /** Example from the spec is dotted: `6404.11.2030`. */
  harmonizedCode?: string;
  quantity: number;
  unitPrice: FedExDutiesTaxesUnitPrice;
}

export interface FedExDutiesTaxesUnitPrice {
  amount: number;
  currencyCode: string;
}

export interface FedExDutiesTaxesShippingCost {
  amount?: number;
  currency?: string;
}

export type FedExDutiesTaxesShipmentPurpose =
  "DOCUMENTS" | "FOR_RESALE" | "NOT_FOR_RESALE" | "GIFT" | "RETURN";

export interface FedExDutiesTaxesRequest {
  shipper: FedExDutiesTaxesParty;
  recipient: FedExDutiesTaxesParty;
  commodities: FedExDutiesTaxesCommodity[];
  shipmentPurpose?: FedExDutiesTaxesShipmentPurpose;
  /** Free string in the spec, e.g. `INTERNATIONAL_PRIORITY`. */
  serviceType?: string;
  shippingCost?: FedExDutiesTaxesShippingCost;
  /** Currency the estimate is returned in, e.g. `USD`. */
  preferredCurrency?: string;
}

export interface FedExDutiesTaxesCostDetail {
  amount?: number;
  currency?: string;
  description?: string;
  formula?: string;
  note?: string;
}

export interface FedExDutiesTaxesSummary {
  totalDuty?: number;
  totalFees?: number;
  totalShippingCosts?: number;
  totalTaxes?: number;
  totalLandedCost?: number;
  currency?: string;
}

export interface FedExDutiesTaxesDetails {
  duties?: FedExDutiesTaxesCostDetail[];
  fees?: FedExDutiesTaxesCostDetail[];
  taxes?: FedExDutiesTaxesCostDetail[];
  summary?: FedExDutiesTaxesSummary;
}

export type FedExDutiesTaxesResponse = FedExResponse<{
  edtDetails?: FedExDutiesTaxesDetails[];
}>;
