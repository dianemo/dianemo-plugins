/**
 * Both headers are optional per the spec; `AccountNumber` is the only one the
 * client does not already send — see docs/ups-api.md#landed-cost-quote.
 */
export interface UpsLandedCostOptions {
  accountNumber?: string;
}

export interface UpsLandedCostRequest {
  currencyCode: string;
  transID: string;
  allowPartialLandedCostResult?: boolean;
  alversion: number;
  shipment: UpsLandedCostRequestShipment;
}

export interface UpsLandedCostRequestShipment {
  id: string;
  importCountryCode: string;
  importProvince?: string;
  shipDate?: string;
  incoterms?: string;
  exportCountryCode: string;
  transModes?: string;
  transportCost?: number;
  shipmentType?: string;
  shipmentItems: UpsLandedCostRequestShipmentItems[];
}

export interface UpsLandedCostRequestShipmentItems {
  commodityId: string;
  grossWeight?: number;
  grossWeightUnit?: string;
  priceEach: number;
  commodityCurrencyCode: string;
  quantity: number;
  UOM: string;
  hsCode?: string;
  description?: string;
  originCountryCode: string;
}

export interface UpsLandedCostResponse {
  /** Present in UPS's example response at this level, not in its schema. */
  transID?: string;
  alversion?: number;
  dpversion?: string | null;
  error?: UpsLandedCostErrors | null;
  perfStats?: UpsLandedCostPerfStats;
  shipment: {
    currencyCode: string;
    importCountryCode: string;
    id: string;
    brokerageFeeItems: UpsLandedCostBrokerageFeeItems[];
    totalBrokerageFees: number;
    totalDuties: number;
    totalCommodityLevelTaxesAndFees: number;
    totalShipmentLevelTaxesAndFees: number;
    totalVAT: number;
    totalDutyAndTax: number;
    grandTotal: number;
    shipmentItems: UpsLandedCostResponseShipmentItems[];
    transID?: string;
    perfStats?: UpsLandedCostPerfStats;
    alVersion?: number;
    errors?: UpsLandedCostErrors;
  };
}

export interface UpsLandedCostBrokerageFeeItems {
  chargeName?: string;
  chargeAmount?: number;
}

export interface UpsLandedCostResponseShipmentItems {
  commodityID: string;
  hsCode: string;
  commodityDuty: number;
  totalCommodityTaxAndFee?: number;
  commodityVAT: number;
  totalCommodityDutyAndTax: number;
  commodityCurrencyCode: string;
  isCalculable: boolean;
}

export interface UpsLandedCostErrors {
  code?: string;
  description?: string;
  message?: string;
  value?: string;
  field?: string;
}

export interface UpsLandedCostErrorResponse {
  response?: UpsLandedCostCommonErrorResponse;
}

export interface UpsLandedCostCommonErrorResponse {
  errors?: UpsLandedCostErrorMessage[];
}

export interface UpsLandedCostErrorMessage {
  code?: string;
  message?: string;
}

export interface UpsLandedCostPerfStats {
  absLayerTime: string;
  fulfillTime: string;
  receiptTime: string;
}
