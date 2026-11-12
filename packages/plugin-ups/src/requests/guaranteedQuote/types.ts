/** Optional `registration-id` header on request-quote; see docs/ups-api.md#global-checkout-guaranteed-quote */
export interface UpsGuaranteedQuoteOptions {
  /** A GUID; when omitted UPS derives it from the OAuth token's UUID. */
  registrationId?: string;
}

export interface UpsGuaranteedQuoteRequest {
  buyerCurrencyCode?: string;
  shipperCurrencyCode: string;
  serviceLevelCode?:
    | "01"
    | "02"
    | "03"
    | "07"
    | "08"
    | "11"
    | "12"
    | "13"
    | "17"
    | "54"
    | "65"
    | "M2"
    | "M3"
    | "M4"
    | "M5"
    | "M6"
    | "M7"
    | "71"
    | "72"
    | "74"
    | "75"
    | "82"
    | "83"
    | "84"
    | "85"
    | "86"
    | "96";
  referenceNumber?: string;
  shipperAccountNumber: string;
  shipment: UpsGuaranteedQuoteShipment;
}

export interface UpsGuaranteedQuoteShipment {
  importCountryCode: string;
  importProvince?: string;
  shipDate?: string;
  exportCountryCode: string;
  transModes?:
    | "DOM_AIR"
    | "DOM_OCEAN"
    | "DOM_RAIL"
    | "DOM_TRUCK"
    | "INT_AIR"
    | "INT_OCEAN"
    | "INT_RAIL"
    | "INT_TRUCK";
  transportCost?: UpsGuaranteedQuoteChargeDetail;
  insuranceCost?: UpsGuaranteedQuoteChargeDetail;
  shipmentType?: string;
  shipperAddress: UpsGuaranteedQuoteAddress;
  shipToAddress: UpsGuaranteedQuoteAddress & {
    residentialAddressIndicator?: boolean;
  };
  shipmentItems: UpsGuaranteedQuoteShipmentItemRequest[];
}

export interface UpsGuaranteedQuoteShipmentItemRequest {
  grossWeight?: {
    value?: number;
    unitOfMeasure?: "kg" | "lb" | "oz" | "KG" | "LB" | "OZ";
  };
  unitPrice: UpsGuaranteedQuoteChargeDetail;
  quantity: {
    value: number;
    unitOfMeasure: string;
  };
  partNumber: string;
  description?: string;
  originCountryCode: string;
  dimension?: {
    length: number;
    width: number;
    height: number;
    unitOfMeasure: "in" | "cm" | "IN" | "CM";
  };
}

export interface UpsGuaranteedQuoteResponse {
  quoteId: string;
  quoteCreationTimestamp: string;
  referenceNumber?: string;
  quoteExpirationDate: string;
  gcTotal: UpsGuaranteedQuoteTotalResponse[];
}

export type UpsGuaranteedQuoteTotalResponse = UpsGuaranteedQuoteChargeDetail & {
  type: "Shipper" | "Buyer";
};

export interface UpsGuaranteedQuoteChargeDetail {
  value: number;
  currencyCode: string;
}

export interface UpsGuaranteedQuoteAddress {
  name?: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  countryCode: string;
  stateProvinceCode?: string;
}

export interface UpsGuaranteedQuoteErrorResponse {
  response: {
    errors: UpsGuaranteedQuoteError[];
  };
}

export interface UpsGuaranteedQuoteError {
  code: string;
  description?: string;
  message: string;
  value?: string;
  field?: string;
}
