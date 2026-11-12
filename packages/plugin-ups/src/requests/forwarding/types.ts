export interface UpsForwardingAirFreightRateRequestV1 {
  shipper: UpsForwardingPartyV1;
  consignee: UpsForwardingPartyV1;
  thirdParty?: UpsForwardingPartyV1 | null;
  shipment: {
    shipmentNumber?: UpsForwardingShipmentNumberV1;
    serviceType?:
      "AMG" | "AM" | "D2G" | "D2" | "DFG" | "DF" | "CX" | "CA" | "EC" | null;
    paymentType: "PPD" | "COL" | "OTH/THD";
    pickupDate?: UpsForwardingDateV1;
    readyTime?: UpsForwardingTimeV1;
    closeTime?: UpsForwardingTimeV1;
    dropoffTime?: UpsForwardingTimeV1;
    weight?: number;
    freightType: "PALLET" | "LOOSE";
    isMetric?: boolean;
    orderDescription?: string;
    shipperReference?: string;
    consigneeReference?: string;
    currencyCode?: string;
    requestPickup?: boolean;
    requestBoL?: boolean;
    countryOfManufacture?: UpsForwardingApolloCountryCodeV1[];
    items: {
      description?: string;
      count: number;
      length: UpsForwardingDimensionV1;
      width: UpsForwardingDimensionV1;
      height: UpsForwardingDimensionV1;
      weight: number;
      details?: UpsForwardingCustomArrayV1;
    }[];
    details?: UpsForwardingCustomArrayV1;
  };
  language?: string;
  transactionId?: string;
}

export interface UpsForwardingAirFreightRateResponseV1 {
  response: {
    rates: {
      serviceType: string;
      guaranteedDelivery: boolean;
      deliveryTime: UpsForwardingDateTimeV1;
      holdAtAirportTime: UpsForwardingDateTimeV1;
      totalCharge: UpsForwardingChargeAmountV1;
      billableWeight: UpsForwardingWeightV1;
      weightUnit: "LBS" | "KGS";
      dimensionalWeight: UpsForwardingWeightV1;
      minimumBillableWeightApplied: boolean;
      contractRate: boolean;
      charges: {
        code?: string;
        description?: string;
        amount?: number;
        currencyCode?: string;
        includedInd?: string | null;
      }[];
    }[];
  };
}

export interface UpsForwardingOrderRequestV1 {
  shipper: UpsForwardingShipmentPartyV1;
  consignee: UpsForwardingShipmentPartyV1;
  thirdParty?: UpsForwardingShipmentPartyV1 | null;
  shipment: {
    shipmentNumber?: UpsForwardingShipmentNumberV1;
    serviceType:
      | "AMG"
      | "AM"
      | "D2G"
      | "D2"
      | "DFG"
      | "DF"
      | "CX"
      | "CA"
      | "EC"
      | "MEXDF"
      | "SAT"
      | "SATG"
      | "GOLDP"
      | "CXD"
      | "CXC"
      | "CXCD"
      | "CAD"
      | "CAC"
      | "CACD"
      | "ECD"
      | "ECC"
      | "ECCD"
      | "EG"
      | "EA"
      | null;
    paymentType: "PPD" | "COL" | "OTH/THD" | null;
    pickupDate?: UpsForwardingDateV1;
    readyTime?: UpsForwardingTimeV1;
    closeTime?: UpsForwardingTimeV1;
    dropoffTime?: UpsForwardingTimeV1;
    weight?: number;
    freightType: "PALLET" | "LOOSE";
    orderDescription: string | null;
    shipperReference?: string | null;
    consigneeReference?: string | null;
    currency?: string | null;
    isMetric: boolean | null;
    items: UpsForwardingItemV1[];
    countryOfManufacture?: (string | null)[];
    details?: UpsForwardingCustomArrayV1;
  };
  label?: {
    layout?: string | null;
    format: "PDF" | "PNG" | "JPG" | "BMP" | "TIFF" | "SVG" | "DATA" | null;
    details?: UpsForwardingCustomArrayV1;
  };
  language?: string;
  transId?: string;
}

export interface UpsForwardingOrderResponseV1 {
  response: UpsForwardingLabelV1 & {
    shipmentNumber: UpsForwardingShipmentNumberV1;
    orderNumber: UpsForwardingOrderNumberV1;
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
    [key: string]: unknown;
  };
}

export interface UpsForwardingCancelOrderRequestV1 {
  account?: string | null;
  orderNumber: UpsForwardingOrderNumberV1;
  language?: string;
}

export interface UpsForwardingCancelOrderResponseV1 {
  response: {
    shipmentNumber: UpsForwardingShipmentNumberV1;
    orderNumber: UpsForwardingOrderNumberV1;
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
  };
}

export interface UpsForwardingOrderPrintLabelRequestV1 {
  orderNumber?: UpsForwardingOrderNumberV1;
  shipmentNumber?: string | null;
  format?: "PDF" | "PNG" | "JPG" | "SVG" | "TIFF" | "BMP" | "DATA" | null;
  layout?: string | null;
  language?: string | null;
  details?: string;
}

export interface UpsForwardingOrderSetDateResponseV1 {
  response: {
    shipmentNumber: UpsForwardingShipmentNumberV1;
    orderNumber: UpsForwardingOrderNumberV1 | null;
    newDate: UpsForwardingDateV1;
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
  } | null;
}

export interface UpsForwardingOrderSearchRequestV1 {
  shipperAccountNumber: UpsForwardingShipperAccountNumberV1;
  criteriaList:
    | ({
        criteriaField: string | null;
        criteriaOperator: string | null;
        criteriaValue: string | null;
        criteriaValue2?: string | null;
      } | null)[]
    | null;
  language?: string | null;
}

export interface UpsForwardingOrderSearchResponseV1 {
  response: {
    orders: ({
      shipmentNumber: UpsForwardingShipmentNumberV1;
      orderNumber: UpsForwardingOrderNumberV1;
      consignee: UpsForwardingShipmentPartyV1;
      shipDate: UpsForwardingDateV1;
      statusCode: number;
      status: string | null;
      description: string | null;
      manifestNumber: string | null;
      shipperReference: string | null;
      consigneeReference: string | null;
      isMetric: boolean;
      items: {
        totalWeight: number;
        weightUnit: "LB" | null;
        totalPieceCount: number;
        item?: ({
          count: number;
          length: number;
          width: number;
          height: number;
          weight: number;
        } | null)[];
      };
    } | null)[];
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
    [key: string]: unknown;
  };
}

/**
 * The 200 examples embedded in UPS's OpenAPI spec for PATCH /shipments put
 * these fields in `response` (or, in two, beside a `response` that is `null` or
 * carries only a warning) and the success `message` at the top level, so the
 * body is declared once and admitted in both places —
 * docs/ups-api.md#forwarding-response-nesting
 */
export interface UpsForwardingAirShipmentDataBody {
  account: UpsForwardingShipperAccountNumberV1;
  pickupDate: UpsForwardingDateV1;
  shipmentCount: number;
  pieceCount: number;
  weight: number;
  weightUnit: string | null;
  manifest?: {
    manifestNumber: string | null;
    manifestFormat: string | null;
    shipper: UpsForwardingShipmentAddressV1;
    shipments:
      | ({
          number: number;
          shipmentNumber: UpsForwardingShipmentNumberV1;
          serviceType: string | null;
          paymentType: string | null;
          weight: number;
          orderDescription?: string | null;
          currency: string | null;
          shipperReference?: string | null;
          consigneeReference?: string | null;
          consignee: UpsForwardingShipmentAddressV1;
        } | null)[]
      | null;
    summary?: {
      services:
        | ({
            shipmentCount: number;
            itemCount: number;
            totalWeight: number;
            freightChargesAmount: UpsForwardingAmountV1;
            surchargesAmount: UpsForwardingAmountV1;
            addedChargesAmount: UpsForwardingAmountV1;
            billedAmount: UpsForwardingAmountV1;
            serviceCode:
              | "AMG"
              | "AM"
              | "D2G"
              | "D2"
              | "DFG"
              | "DF"
              | "CX"
              | "CA"
              | "EC"
              | "MEXDF"
              | "SAT"
              | "SATG"
              | "GOLDP"
              | "CXD"
              | "CXC"
              | "CXCD"
              | "CAD"
              | "CAC"
              | "CACD"
              | "ECD"
              | "ECC"
              | "ECCD"
              | "EG"
              | "EA"
              | null;
            serviceName: string | null;
            pieceCount: number;
          } | null)[]
        | null;
      serviceTotal: {
        shipmentCount: number;
        itemCount: number;
        pieceCount: number;
        totalWeight: number;
        freightChargesAmount: number;
        surchargesAmount: number;
        addedChargesAmount: number;
        billedAmount: number;
      };
      dailyPickupTotals: UpsForwardingPickupTotalV1;
      currentPickupTotals: UpsForwardingPickupTotalV1;
    };
  };
  manifestNumber?: string | null;
  manifestFormat?: string | null;
  manifestPDF?: string | null;
  warnings?: UpsForwardingWarningArrayV1;
  code?: string | number | null;
  message?: string;
}

export interface UpsForwardingAirShipmentDataResponseV1 extends Partial<UpsForwardingAirShipmentDataBody> {
  // Partial: one 200 example's `response` holds only `warnings`, `code`, `message`
  response: Partial<UpsForwardingAirShipmentDataBody> | null;
}

export interface UpsForwardingAirShipmentCancelRequestV1 {
  shipperAccountNumber: UpsForwardingShipperAccountNumberV1;
  shipmentNumber: UpsForwardingShipmentNumberV1;
  language?: string;
}

export interface UpsForwardingAirShipmentCancelResponseV1 {
  response: {
    shipperAccountNumber: UpsForwardingShipperAccountNumberV1;
    shipmentNumber: UpsForwardingShipmentNumberV1;
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
  };
}

export interface UpsForwardingGetCityResponseV1 {
  response: {
    cityDetails: ({
      stateProvinceCode: string | null;
      cityName?: string | null;
      majorAirportCity?: string | null;
      tariffDestination?: string | null;
      sortCode?: string | null;
      standardService?: string | null;
    } | null)[];
    warnings?: UpsForwardingWarningArrayV1;
    message?: string;
  };
}

export interface UpsForwardingPrintManifestRequestV1 {
  accountNumber?: UpsForwardingShipperAccountNumberV1;
  manifestNumber: string | null;
  manifestFormat?: "PDF" | "DATA" | null;
  language?: string;
}

export type UpsForwardingAmountV1 = number | null;

export interface UpsForwardingChargeAmountV1 {
  amount: string | null;
  currencyCode: string | null;
}

export interface UpsForwardingChargeV1 {
  code: string | null;
  description?: string | null;
  amount: string | null;
  currencyCode: string | null;
  includedInd?: string | null;
}

export type UpsForwardingApolloCountryCodeV1 = string;

export interface UpsForwardingCustomArrayV1Item {
  key?: string;
  value?: string;
}

export type UpsForwardingCustomArrayV1 = UpsForwardingCustomArrayV1Item[];

export type UpsForwardingDateV1 = string;

export type UpsForwardingDateTimeV1 = string;

export type UpsForwardingDimensionV1 = number;

export interface UpsForwardingWarningArrayV1Item {
  code: string;
  message: string;
}

// Null entries appear in the PATCH /shipments examples (`"warnings": [null]`)
export type UpsForwardingWarningArrayV1 =
  (UpsForwardingWarningArrayV1Item | null)[];

export interface UpsForwardingErrorResponseV1 {
  response: {
    errors: {
      code: string;
      message: string;
    }[];
  };
}

export interface UpsForwardingItemV1 {
  itemDescription: string | null;
  count: number | null;
  length: number;
  width: number;
  height: number;
  weight: number;
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingLabelV1 {
  labelFormat: string | null;
  shipmentNumber: UpsForwardingShipmentNumberV1;
  orderNumber?: UpsForwardingOrderNumberV1;
  charges?: {
    shipperCharges?: UpsForwardingChargeV1[] | null;
    consigneeCharges?: UpsForwardingChargeV1[] | null;
    thirdPartyCharges?: UpsForwardingChargeV1[] | null;
  };
  labelData?: {
    shipper: UpsForwardingShipmentPartyV1;
    consignee: UpsForwardingShipmentPartyV1;
    thirdParty?: UpsForwardingShipmentPartyV1 | null;
    shipment: {
      shipmentNumber?: UpsForwardingShipmentNumberV1;
      serviceType?: string | null;
      paymentType?: string | null;
      pickupDate?: UpsForwardingDateV1;
      readyTime?: UpsForwardingTimeV1;
      closeTime?: UpsForwardingTimeV1;
      dropoffTime?: UpsForwardingTimeV1;
      weight?: number;
      freightType?: "PALLET" | "LOOSE";
      orderDescription?: string | null;
      shipperReference?: string | null;
      consigneeReference?: string | null;
      currency?: string | null;
      isMetric?: string | null;
      items?: UpsForwardingItemV1[] | null;
      countryOfManufacture?: (string | null)[];
      details?: UpsForwardingCustomArrayV1;
      rates?: {
        amount?: UpsForwardingAmountV1;
        currencyCode?: string | null;
      };
      sortCode?: string | null;
      gateway?: string | null;
      count?: number;
      labelService?: string | null;
      serviceDesc?: string | null;
    };
  };
  labelImage?: string | null;
  warnings?: UpsForwardingWarningArrayV1;
  message?: string;
}

export type UpsForwardingOrderNumberV1 = string;

export interface UpsForwardingPartyV1 {
  company?: string | null;
  account?: string | null;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: UpsForwardingApolloCountryCodeV1;
  serviceCenterCode?: string;
  partyCode?: string;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingPickupTotalV1 {
  shipmentCount: number;
  itemCount: number;
  pieceCount: number;
  totalWeight: number;
}

export type UpsForwardingShipmentNumberV1 = string | null;

export type UpsForwardingShipmentPartyV1 = UpsForwardingShipmentAddressV1 & {
  account?: string | null;
  serviceCenterCode?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  details?: UpsForwardingCustomArrayV1;
};

export interface UpsForwardingShipmentAddressV1 {
  operationId?:
    | "orderCreate"
    | "orderCancel"
    | "orderSetDate"
    | "orderSearch"
    | "printLabel"
    | "submitAirShipment"
    | "cancelAirShipment"
    | "printAirManifest"
    | "airFreightRating"
    | "getCity"
    | null;
  partyCode?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  cityStateCountryZip?: string | null;
}

export type UpsForwardingShipperAccountNumberV1 = string | null;

export type UpsForwardingTimeV1 = string;

export type UpsForwardingWeightV1 = number;

export type UpsForwardingPatchReplaceReqV1 = {
  op: "replace" | null;
  path: string | null;
  value?: string | null;
}[];

export interface UpsForwardingCharges {
  code?: string;
  description?: string;
  amount?: number;
  currencyCode?: string;
  includedInd?: string;
}

export interface UpsForwardingAirShipRequestV1 {
  shipper: UpsForwardingPartyDetails;
  consignee: UpsForwardingPartyDetails;
  thirdParty?: UpsForwardingPartyDetailsV1 | null;
  shipment: UpsForwardingShipmentDetail;
  label?: UpsForwardingLabelRequest | null;
  language?: string;
  transactionId?: string;
}

export interface UpsForwardingPartyDetails {
  account: string | null;
  address1: string;
  city: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  serviceCenterCode?: string;
  partyCode?: string;
  company: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  partySectionDetails?: UpsForwardingCustomArrayV1;
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingPartyDetailsV1 {
  account: string | null;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  serviceCenterCode?: string;
  partyCode?: string;
  company?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  partySectionDetails?: UpsForwardingCustomArrayV1;
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingShipmentDetail {
  shipmentNumber?: string;
  serviceType: "AM" | "AMG" | "D2" | "D2G" | "DF" | "DFG" | "CA" | "EC" | "CX";
  paymentType: "PPD" | "COL" | "OTH/THD";
  pickupDate: string;
  readyTime?: string;
  closeTime?: string;
  dropoffTime?: string;
  weight?: number;
  freightType: "PALLET" | "LOOSE";
  isMetric?: boolean;
  orderDescription?: string;
  shipperReference?: string;
  consigneeReference?: string;
  currencyCode?: string;
  requestPickup?: boolean;
  requestBoL?: boolean;
  countryOfManufacture?: string[];
  items: UpsForwardingItem[];
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingItem {
  description?: string;
  count: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  details?: UpsForwardingCustomArrayV1;
}

export interface UpsForwardingLabelRequest {
  layout?: string;
  format?: string;
  details?: Record<string, string>;
}

/**
 * The schema (`ApolloAirShipResponseV1`) declares `response` as a bare object
 * and puts these fields beside it; all ten 200 examples embedded in UPS's
 * OpenAPI spec put them inside `response` and nothing at the top level, so both
 * placements are typed — docs/ups-api.md#forwarding-response-nesting
 */
export interface UpsForwardingAirShipResponseBody {
  shipmentNumber?: string;
  prqNumber?: string;
  prqStatus?: string;
  originServiceCenter?: string;
  destinationServiceCenter?: string;
  paymentType?: string;
  rates?: UpsForwardingRateDetail[];
  airWaybillDocument?: string | null;
  label?: UpsForwardingLabelResponse | null;
}

export interface UpsForwardingAirShipResponseV1 extends UpsForwardingAirShipResponseBody {
  response: UpsForwardingAirShipResponseBody;
}

export interface UpsForwardingRateDetail {
  serviceType?: string;
  guaranteedDelivery?: boolean;
  deliveryTime?: string;
  holdAtAirportTime?: string;
  // The schema says string | null; the POST /shipments examples have a number
  totalCharge?: {
    amount?: string | number | null;
    currencyCode?: string | null;
  };
  currency?: string;
  billableWeight?: number;
  weightUnit?: string;
  dimensionalWeight?: number;
  minimumBillableWeightApplied?: boolean;
  contractRate?: boolean;
  charges?: UpsForwardingCharges[];
}

export interface UpsForwardingLabelResponse {
  format?: string;
  layout?: string | null;
  image?: string | null;
}

export interface UpsForwardingUtilityAirportDetailResponseV1 {
  response: {
    airportDetails: UpsForwardingAirportResponseDetailsV1[];
  };
}

export interface UpsForwardingAirportResponseDetailsV1 {
  city?: string;
  airportCode?: string;
  postalCode?: string;
  stateProvince?: string;
}

/**
 * The schema is unwrapped; every example embedded in UPS's OpenAPI spec for
 * /info/countries, /info/currencies and /info/payment-types is wrapped in
 * `response`, so both are typed — docs/ups-api.md#forwarding-response-nesting
 */
export interface UpsForwardingCountryCodeResponseBody {
  countries?: UpsForwardingCountryCodeV1[];
  warnings?: UpsForwardingWarningArrayV1;
  message?: string;
}

export interface UpsForwardingCountryCodeResponseV1 extends UpsForwardingCountryCodeResponseBody {
  response?: UpsForwardingCountryCodeResponseBody;
}

export interface UpsForwardingCountryCodeV1 {
  countryCode?: string;
  countryName?: string;
}

export interface UpsForwardingPaymentTermInfoV1 {
  code?: string;
  type?: string;
  description?: string;
  incoTermCode?: string;
  movementTypeCode?: string;
  serviceGroupName?: string;
  serviceLine?: string;
}

/** The example's list is `paymentTypes`; the schema's are the three party keys. */
export interface UpsForwardingPaymentTypeResponseBody {
  paymentTypes?: UpsForwardingPaymentTermInfoV1[];
  shipper?: UpsForwardingPaymentTermInfoV1[];
  consignee?: UpsForwardingPaymentTermInfoV1[];
  thirdParty?: UpsForwardingPaymentTermInfoV1[];
  warnings?: UpsForwardingWarningArrayV1;
  message?: string;
}

export interface UpsForwardingPaymentTypeResponseV1 extends UpsForwardingPaymentTypeResponseBody {
  response?: UpsForwardingPaymentTypeResponseBody;
}

export interface UpsForwardingCurrenciesResponseBody {
  currencies?: UpsForwardingCurrencyDataV1[];
  warnings?: UpsForwardingWarningArrayV1;
  message?: string;
}

export interface UpsForwardingCurrenciesResponseV1 extends UpsForwardingCurrenciesResponseBody {
  response?: UpsForwardingCurrenciesResponseBody;
}

export interface UpsForwardingCurrencyDataV1 {
  currencyCode?: string;
  currencyName?: string;
  currencySymbol?: string;
}

export interface UpsForwardingServiceTypeSearchResponseV1 {
  response: {
    serviceTypes: UpsForwardingServiceTypeInfo[];
  };
}

export interface UpsForwardingServiceTypeInfo {
  code: string;
  description: string;
}

export interface UpsForwardingQuoteDetailRequestV1 {
  requestType: string;
  quoteData: UpsForwardingQuoteData;
  routing: UpsForwardingRouting;
  shipmentDetails: UpsForwardingShipmentDetails;
  shipmentPartyDetail: UpsForwardingShipmentPartyDetail[];
}

export interface UpsForwardingQuoteData {
  serviceType: string;
  serviceLine: string;
  currencyCode: string;
  movementTypeCode: string;
  incoTermType: string;
  importCustomsBrokerageFee?: string;
  exportCustomsBrokerageFee?: string;
  paymentTerm: UpsForwardingPaymentTerm;
}

export interface UpsForwardingPaymentTerm {
  type: "SHPR" | "CONS" | "THRD";
  code: "PPD" | "COL" | "OTH/CON";
}

/**
 * Response side of `paymentTerm`: the GET /quotes example returns `COL` under
 * `type` and `CONS` under `code`, the reverse of what the request enums pair, so
 * the response admits any string — docs/ups-api.md#forwarding-response-nesting
 */
export interface UpsForwardingPaymentTermResponse {
  type?: UpsForwardingPaymentTerm["type"] | (string & {}) | null;
  code?: UpsForwardingPaymentTerm["code"] | (string & {}) | null;
}

export interface UpsForwardingRouting {
  origin?: UpsForwardingPortDetail;
  destination?: UpsForwardingPortDetail;
  specialHandlings?: UpsForwardingSpecialHandling[];
}

export interface UpsForwardingPortDetail {
  portCode?: string;
}

export interface UpsForwardingSpecialHandling {
  type?: string;
  message?: string;
  temperatureControl?: string;
}

export interface UpsForwardingShipmentDetails {
  insuredValueCurrency?: string;
  insuredValue?: number;
  customsValueCurrency?: string;
  customsValue?: number;
  commodityName?: string;
  cargoItems?: UpsForwardingCargoItem[];
  isHazmat?: boolean;
  isReefer?: boolean;
  isLithium?: boolean;
  isRestricted?: boolean;
  isStackable?: string;
  isForkliftable?: string;
  isTiltable?: string;
}

export interface UpsForwardingCargoItem {
  quantity: number;
  packageType?: string;
  packageTypeCode?: string;
  weight: UpsForwardingWeightDetail;
  dimensions: UpsForwardingDimensions;
  fclCargoItems?: UpsForwardingFclCargoItem[];
}

export interface UpsForwardingWeightDetail {
  weight?: number;
  unitOfMeasurement?: string;
}

export interface UpsForwardingDimensions {
  length?: number;
  width?: number;
  height?: number;
  unitOfMeasurement?: string;
}

export interface UpsForwardingFclCargoItem {
  equipmentCode?: string;
  noOfContainers?: number;
}

export interface UpsForwardingShipmentPartyDetail {
  type?: string;
  accountNumber?: string | null;
  contactDetail?: UpsForwardingContactDetail;
  address?: UpsForwardingPartyAddress;
}

export interface UpsForwardingContactDetail {
  name?: string;
  emailAddress?: string;
  faxNumber?: string;
  phoneNumber?: string;
  referenceNumber?: string;
}

export interface UpsForwardingPartyAddress {
  companyName1?: string;
  companyName2?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  stateCode?: string;
  postalCode?: string;
  countryCode?: string;
  isLoadingDockAvailable?: string;
  isResidentialAddress?: string;
}

export interface UpsForwardingQuoteDetailsResponseV1 {
  response: UpsForwardingQuoteDetailsResponse;
}

export interface UpsForwardingQuoteDetailsResponse {
  quoteSummary: UpsForwardingQuoteSummary;
}

export interface UpsForwardingQuoteSummary {
  quoteId: string;
  status: string;
  serviceType: string;
  transitTime: number;
  serviceLine: string;
  serviceGroup: string;
  confirmationId: string;
  createDate: string;
  netTotal: number;
  validTill: string;
  originPort: UpsForwardingPortInfo;
  destinationPort: UpsForwardingPortInfo;
  nonConformalReasons: string[];
  pricingDetail: UpsForwardingPricingDetail;
  estimateChargableWeight: number;
  estimateChargableWeightUnit: string;
  chargeDetails: UpsForwardingChargeDetails[];
}

export interface UpsForwardingPortInfo {
  code?: string;
  name?: string;
}

export interface UpsForwardingPricingDetail {
  rateType?: string;
  message?: string;
  currencyCode?: string;
  actualTotalPrice?: number;
  netTotalPrice?: number;
  discountDetail?: UpsForwardingDiscountDetail;
}

export interface UpsForwardingDiscountDetail {
  discount?: number;
  discountPercent?: number;
  discountValidTill?: string;
}

export interface UpsForwardingChargeDetails {
  shipmentPartyType: string;
  charges: UpsForwardingQuoteCharges[];
}

export interface UpsForwardingQuoteCharges {
  chargeType?: string;
  chargeAmount?: number;
  currency?: string;
}

export interface UpsForwardingQuoteBookingRequestV1 {
  quoteId: string;
  specialInstructions?: string;
  pickupDetails?: UpsForwardingAirOceanPickupDetail;
  requestType: string;
}

export interface UpsForwardingAirOceanPickupDetail {
  date: string;
  startTime?: string;
  endTime?: string;
}

export interface UpsForwardingBookingResponseV1 {
  response?: UpsForwardingAirOceanBookingResponse;
}

export interface UpsForwardingAirOceanBookingResponse {
  quoteBookSummary?: UpsForwardingBookingResponse;
}

export interface UpsForwardingBookingResponse {
  quoteId?: string;
  status?: string;
  shipmentNumber?: string;
  confirmationId?: string;
  bookingReference?: string;
  createDate?: string;
  cargoDetails?: UpsForwardingAirOceanBookCargoDetails;
}

export interface UpsForwardingAirOceanBookCargoDetails {
  isStackable?: string;
  isForkliftable?: string;
  isTiltable?: string;
}

export interface UpsForwardingQuoteDataResponseV1 {
  response: {
    quoteSummary: UpsForwardingQuoteSummaryV1;
  };
}

export interface UpsForwardingQuoteSummaryV1 {
  quoteId?: string | null;
  status?: string | null;
  confirmationId?: string | null;
  shipmentNumber?: string | null;
  serviceType?: string | null;
  transitTime?: number | null;
  serviceLine?: string | null;
  serviceGroup?: string | null;
  movementTypeCode?: string | null;
  incoTermType?: string | null;
  createDate?: string | null;
  netTotal?: number | null;
  validTill?: string | null;
  validity?: number | null;
  originPort?: UpsForwardingLocation | null;
  destinationPort?: UpsForwardingLocation | null;
  portOfLoad?: string | null;
  portOfDischarge?: string | null;
  pricingDetail?: UpsForwardingPricingDetailV1 | null;
  estimateChargableWeight?: number | null;
  estimateChargableWeightUnit?: string | null;
  chargeDetails?: UpsForwardingChargeDetail[] | null;
  paymentTerm?: UpsForwardingPaymentTermResponse | null;
  shipmentPartyDetail?: UpsForwardingShipmentPartyDetailV1[] | null;
  shipmentDetails?: UpsForwardingQuoteShipmentDetails | null;
}

export interface UpsForwardingLocation {
  portCode?: string | null;
  portName?: string | null;
  serviceType?: string | null;
  serviceCenterCode?: string | null;
  serviceRatedOverCode?: string | null;
}

export interface UpsForwardingPricingDetailV1 {
  rateType?: string | null;
  rateDescription?: string | null;
  currencyCode?: string | null;
  actualTotalPrice?: number | null;
  netTotalPrice?: number | null;
  discountDetail?: UpsForwardingDiscountDetailV1 | null;
}

export interface UpsForwardingDiscountDetailV1 {
  discount?: number | null;
  discountPercent?: number | null;
  eligibleDiscount?: number | null;
  eligibleDiscountPercent?: number | null;
  discountAdjustedFor?: string | null;
  discountValidTill?: string | null;
}

export interface UpsForwardingChargeDetail {
  shipmentPartyType?: string | null;
  charges?: UpsForwardingBookChargeV1[] | null;
}

export interface UpsForwardingBookChargeV1 {
  chargeType?: string | null;
  description?: string | null;
  chargeAmount?: number | null;
  currency?: string | null;
  originalChargeAmount?: string | null;
}

export interface UpsForwardingShipmentPartyDetailV1 {
  type?: string | null;
  accountNumber?: string | null;
  contactDetail?: UpsForwardingContactDetailV1 | null;
  address?: UpsForwardingAddress | null;
}

export interface UpsForwardingAddress {
  companyName1?: string | null;
  companyName2?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  city?: string | null;
  stateCode?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  isLoadingDockAvailable?: string | null;
  isResidentialAddress?: string | null;
}

export interface UpsForwardingQuoteShipmentDetails {
  insuredValueCurrency?: string | null;
  insuredValue?: number | null;
  customsValueCurrency?: string | null;
  customsValue?: number | null;
  commodityName?: string | null;
  fclCargoItems?: UpsForwardingCargoItem[] | null;
  lclCargoItems?: UpsForwardingLclCargoItem[] | null;
  airCargoItems?: UpsForwardingAirCargoItem[] | null;
  location?: UpsForwardingLocation[] | null;
}

/**
 * The schema's `LclCargoItem` is the FCL `CargoItem` (`weight`); the GET /quotes
 * examples carry `weightDetail`, as the sibling `LclCargoItemV1` does, so both
 * are typed.
 */
export interface UpsForwardingLclCargoItem {
  quantity?: number;
  packageType?: string | null;
  packageTypeCode?: string | null;
  weight?: UpsForwardingWeightDetail;
  weightDetail?: UpsForwardingWeightDetail;
  dimensions?: UpsForwardingDimensions;
  fclCargoItems?: UpsForwardingFclCargoItem[] | null;
}

export interface UpsForwardingAirCargoItem {
  quantity?: number | null;
  weight?: UpsForwardingWeightDetail | null;
  dimensions?: UpsForwardingDimensions | null;
}

export interface UpsForwardingShipmentDetailResponseV1 {
  response: {
    shipmentSummary: UpsForwardingShipmentSummary;
  };
}

export interface UpsForwardingShipmentSummary {
  shipmentNumber?: string | null;
  confirmationId?: string | null;
  quoteIdentificationNumber?: string | null;
  status?: string;
  serviceLine?: string;
  serviceType?:
    | "CAD"
    | "AM"
    | "D2G"
    | "D2"
    | "DFG"
    | "DF"
    | "CX"
    | "CA"
    | "EC"
    | "PF"
    | "PA"
    | "EL"
    | "SA";
  serviceGroup?: string | null;
  movementType?: "DTD" | "DTP" | "PTD" | "PTP";
  movementTypeCode?: "DTD" | "DTA" | "ATD" | "ATA" | null;
  rateType?: "Market" | "Negotiated";
  transitTime?: number;
  validTill?: string | null;
  validity?: number;
  portOfLoad?: string | null;
  portOfDischarge?: string | null;
  createdDate?: string;
  incoTermType?: string | null;
  originPort?: UpsForwardingPortInfo;
  destinationPort?: UpsForwardingPortInfo;
  paymentTerm?: UpsForwardingPaymentTermResponse | null;
  partyDetails?: UpsForwardingPartyDetail[];
  cargoDetails?: UpsForwardingCargoDetails;
  pickupDetail?: UpsForwardingPickupDetail;
  chargeDetails?: UpsForwardingChargeDetailV1[];
}

export interface UpsForwardingPartyDetail {
  type?: string;
  accountNumber?: string | null;
  isPayor?: boolean;
  contactDetail?: UpsForwardingContactDetailV1;
  address?: UpsForwardingAddressDetail;
}

export interface UpsForwardingContactDetailV1 {
  name?: string | null;
  emailAddress?: string | null;
  faxNumber?: string | null;
  phoneNumber?: string | null;
  referenceNumber?: string | null;
}

export interface UpsForwardingAddressDetail {
  companyName1?: string | null;
  companyName2?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  city?: string | null;
  stateCode?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  companyName?: string | null;
  fullAddress?: string | null;
}

export interface UpsForwardingCargoDetails {
  insuredValueCurrency?: string;
  insuredValue?: number;
  customsValueCurrency?: string;
  customsValue?: number;
  commodityName?: string;
  fclCargoItems?: UpsForwardingFclCargoItem[];
  cargoItems?: UpsForwardingLclCargoItemV1[];
}

export interface UpsForwardingPickupDetail {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
}

export interface UpsForwardingChargeDetailV1 {
  shipmentPartyType: string;
  charges: UpsForwardingChargeV2[];
}

export interface UpsForwardingChargeV2 {
  chargeType?: string;
  description?: string;
  chargeAmount?: number;
  currency?: string;
}

export interface UpsForwardingLclCargoItemV1 {
  quantity: number;
  packageType: string;
  packageTypeCode: string;
  weightDetail: UpsForwardingWeightDetail;
  dimensions: UpsForwardingDimensions;
}

export interface UpsForwardingAirUtilityAccessorialsRequestV1 {
  shipper: UpsForwardingShipmentPartyDetails;
  consignee: UpsForwardingShipmentPartyDetails;
  serviceCode?:
    | "AMG"
    | "AM"
    | "D2G"
    | "D2"
    | "DFG"
    | "DF"
    | "CX"
    | "CA"
    | "EC"
    | "MEXDF"
    | "SAT"
    | "SATG"
    | "GOLDP"
    | "CXD"
    | "CXC"
    | "CXCD"
    | "CAD"
    | "CAC"
    | "CACD"
    | "ECD"
    | "ECC"
    | "ECCD"
    | "EG"
    | "EA";
  pickupDateTime: string;
  dropOffTime?: UpsForwardingTimeV1;
}

export interface UpsForwardingShipmentPartyDetails {
  city: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  isResidential: string;
}

export interface UpsForwardingAirUtilityValidAccessorialsResponseV1 {
  response: {
    accessorials: UpsForwardingAccessorialsResponseDetailsV1[];
    paymentTerms: UpsForwardingAccessorialPaymentTermResponseV1[];
    nextAvailPUDate: string;
  };
}

export interface UpsForwardingAccessorialsResponseDetailsV1 {
  code?: "CC" | "CV" | "DDU" | "DLV" | "DV" | "DDP" | "LIFTGT";
  // In the example, absent from the schema
  name?: string;
}

export interface UpsForwardingAccessorialPaymentTermResponseV1 {
  code: "PPD" | "COL" | "THD";
  desc: string;
}

export interface UpsForwardingFullTrackingDetailsResponseV1 {
  response: {
    primaryInformation?: UpsForwardingPrimaryInformation;
    // The "no match" 200 example answers `errors: null, code: -1001` here
    errors?: unknown[] | null;
    code?: string | number | null;
    message?: string;
  };
}

export interface UpsForwardingPrimaryInformation {
  id?: string;
  shipmentNumber?: string;
  upsFileNumber?: string;
  upsOffice?: string;
  upsDatasource?: string;
  shipper?: string;
  destinationConsignee?: string;
  principal?: string;
  proofOfDelivery?: string;
  podDateTime?: string;
  shipmentType?: string;
  shipmentServiceLevel?: string;
  modeOfTransportCode?: string;
  modeOfTransportName?: string;
  primaryException?: string;
  shipmentBookedDateTime?: string;
  shipmentCreateDateTime?: string;
  originalScheduledDeliveryDateTime?: string;
  latestScheduledDeliveryDateTime?: string;
  product?: string;
  actualDeliveryDateTime?: string;
  milestoneStatus?: string;
  shipmentLatestStatusDateTime?: string;
  lastKnownLocation?: string;
  consigneeReferenceNumber?: UpsForwardingCustomerReferenceInfo[];
  customerPONumber?: UpsForwardingCustomerReferenceInfo[];
  references?: UpsForwardingReference[];
  shipmentAdditionalInformation?: UpsForwardingAdditionalInformation;
  shipmentOrigin?: UpsForwardingShipmentAddress;
  shipmentDestination?: UpsForwardingShipmentAddress;
  flightVoyageInformation?: UpsForwardingFlightVoyageInfo[];
  milestones?: UpsForwardingMilestone;
  shipmentExceptionDetails?: UpsForwardingShipmentExceptionDetails;
  containerInformation?: UpsForwardingContainerInfo[];
  contactInfo?: UpsForwardingContactInfo[];
}

export interface UpsForwardingCustomerReferenceInfo {
  referenceType?: string;
  referenceNumber?: string;
}

export interface UpsForwardingReference {
  code?: string;
  type?: string;
  number?: string;
  createdDate?: string;
}

export interface UpsForwardingAdditionalInformation {
  shipmentCategory?: string;
  quantity?: string;
  itemDescription?: string;
  incoterms?: string;
  freightPaymentTerm?: string;
  actualWeight?: UpsForwardingWeightMeasurement;
  chargeableWeight?: UpsForwardingWeightMeasurement;
  shipmentVolume?: UpsForwardingVolumeMeasurement;
}

export interface UpsForwardingWeightMeasurement {
  weight?: string;
  uomCode?: string;
  uomLabel?: string;
}

export interface UpsForwardingVolumeMeasurement {
  volume?: string;
  uomCode?: string;
  uomLabel?: string;
}

export interface UpsForwardingShipmentAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  unloc?: string;
}

export interface UpsForwardingFlightVoyageInfo {
  leg?: string;
  displayDepartureLocation?: string;
  displayArrivalLocation?: string;
  carrierCode?: string;
  carrierName?: string;
  vessel?: string;
  flightVoyageNumber?: string;
  estimateDepartureDateTime?: string;
  confirmedDepartureDateTime?: string;
  estimatedArrivalDateTime?: string;
  confirmedArrivalDateTime?: string;
  masterBill?: string;
}

export interface UpsForwardingMilestone {
  shipmentMilestones?: UpsForwardingShipmentMilestone[];
}

export interface UpsForwardingShipmentMilestone {
  id?: string;
  label?: string;
  milestoneCompletionDateTime?: string;
  milestoneUNLOC?: string;
}

export interface UpsForwardingShipmentExceptionDetails {
  exceptionCount?: string;
  exceptionList?: UpsForwardingShipmentException[];
}

export interface UpsForwardingShipmentException {
  exceptionType?: string;
  exceptionReason?: string;
  exceptionDateTime?: string;
  exceptionResolvedDateTime?: string;
  isException?: string;
}

export interface UpsForwardingContainerInfo {
  containerNumber?: string;
  containerType?: string;
  containerDescription?: string;
  seal?: string;
  quantity?: string;
  containerWeight?: UpsForwardingWeightMeasurement;
  containerVolume?: UpsForwardingVolumeMeasurement;
}

export interface UpsForwardingContactInfo {
  role?: string;
  roleName?: string;
  account?: string;
  businessId?: string;
  name?: string;
  phone?: string;
  attention?: string;
  address?: UpsForwardingContactAddress;
}

export interface UpsForwardingContactAddress {
  street?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  unloc?: string;
}

export type UpsForwardingDocumentType =
  | "PackingList"
  | "CommercialInvoice"
  | "SLI"
  | "ExportDeclaration"
  | "AirWaybill"
  | "Quote"
  | "Booking"
  | "DomesticAirWaybill"
  | "HAZMAT"
  | "CERT_ORIGIN"
  | "MSC";

export interface UpsForwardingUploadDocumentResponseV1 {
  response: {
    accountNumber?: string;
    shipmentNumber?: UpsForwardingShipmentNumberV1;
    message?: string;
  };
}

/**
 * Hand-written below the generated wire types: the headers and query parameters
 * the spec declares on every operation. Names are camelCased here and mapped to
 * the wire spelling (`X-BusinessGUID`, `shipper_account_number`, ...) in the
 * request functions.
 */

/** Required on every operation; `transId` and `transactionSrc` come from the client. */
export interface UpsForwardingHeaders {
  /** 36-character GUID, hyphens optional. */
  businessGuid: string;
  clientId: string;
}

export type UpsForwardingRequestType = "Air" | "Ocean";

export interface UpsForwardingSetOrderDateParams extends UpsForwardingHeaders {
  shipperAccountNumber: string;
  /** 13 digits. Omit to change every active order of the shipper. */
  orderNumber?: string;
  oldDate?: UpsForwardingDateV1;
  language?: string;
}

export interface UpsForwardingSearchOrdersParams extends UpsForwardingHeaders {
  criteria: UpsForwardingOrderSearchRequestV1;
}

export interface UpsForwardingSubmitShipmentsParams extends UpsForwardingHeaders {
  shipperAccountNumber: string;
  pickupDate?: UpsForwardingDateV1;
  /** Spec default `true`. */
  requestManifest?: boolean;
  /** Spec default `PDF`. */
  manifestFormat?: "DATA" | "PDF";
}

export interface UpsForwardingShipmentDetailsParams extends UpsForwardingHeaders {
  requestType: UpsForwardingRequestType;
  shipmentId: string;
}

export interface UpsForwardingMilestonesParams extends UpsForwardingHeaders {
  businessId: string;
  upsFileNumber?: string;
  upsOffice?: string;
  upsShipmentNumber: string;
}

export interface UpsForwardingCitiesParams extends UpsForwardingHeaders {
  shipperAccountNumber?: string;
  country: string;
  /** Required unless `country` is `US` or `CA`. */
  city?: string;
  /** `STARTS_WITH` (default) or `CONTAINS`. */
  criteriaOperator?: string;
  /** Required when `country` is `US` or `CA`. */
  postal?: string;
}

export interface UpsForwardingAccountParams extends UpsForwardingHeaders {
  shipperAccountNumber?: string;
}

export interface UpsForwardingPaymentTypesParams extends UpsForwardingHeaders {
  shipperAccountNumber: string;
  code?: string;
  incotermCode?: string;
  movementTypeCode?: string;
  originCountryCode?: string;
  destinationCountryCode?: string;
  serviceLine?: string;
}

export interface UpsForwardingAirportsParams extends UpsForwardingHeaders {
  /** Two uppercase letters. */
  countryCode: string;
}

export interface UpsForwardingServiceTypesParams extends UpsForwardingHeaders {
  shipperCity?: string;
  shipperStateCode?: string;
  shipperPostalCode?: string;
  shipperCountryCode?: string;
  consigneeCity?: string;
  consigneeStateCode?: string;
  consigneePostalCode?: string;
  consigneeCountryCode: string;
  shipperAccountNumber?: string;
}

export interface UpsForwardingGetQuoteParams extends UpsForwardingHeaders {
  requestType: UpsForwardingRequestType;
  quoteId: string;
}

export interface UpsForwardingGetDocumentsParams extends UpsForwardingHeaders {
  shipmentNumber: string;
  shipmentAccountNumber: string;
  shipmentType: UpsForwardingRequestType;
  /** Spec default `All`; the spec lists no other values for this query parameter. */
  docType: string;
}

export interface UpsForwardingUploadDocumentRequest extends UpsForwardingHeaders {
  accountNumber: string;
  shipmentNumber: string;
  documentType: UpsForwardingDocumentType;
  /** The spec says PDF only. */
  document: Uint8Array | Blob;
  fileName?: string;
}

/** The label 200 body is an inline schema in the spec, not a named component. */
export interface UpsForwardingPrintLabelResponse {
  response: UpsForwardingLabelV1;
}
