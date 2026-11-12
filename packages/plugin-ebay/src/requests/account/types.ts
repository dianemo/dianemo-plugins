// Ebay Fulfillment Policies Types
interface EbayGetPolicyBaseResponse {
  count: number;
}
export interface EbayGetFulfillmentPoliciesResponse extends EbayGetPolicyBaseResponse {
  fulfillmentPolicies: EbayFulfillmentPolicy[];
}

interface EbayFulfillmentPolicyCurrencyAmount {
  value: string;
  currency: string;
}

interface EbayFulfillmentPolicyRegion {
  regionName: string;
}

interface EbayFulfillmentPolicyShipToLocations {
  regionIncluded?: EbayFulfillmentPolicyRegion[];
  regionExcluded?: EbayFulfillmentPolicyRegion[];
}

interface EbayFulfillmentPolicyShippingService {
  sortOrder: number;
  shippingCarrierCode: string;
  shippingServiceCode: string;
  shippingCost: EbayFulfillmentPolicyCurrencyAmount;
  additionalShippingCost: EbayFulfillmentPolicyCurrencyAmount;
  freeShipping: boolean;
  buyerResponsibleForShipping: boolean;
  buyerResponsibleForPickup: boolean;
  shipToLocations?: EbayFulfillmentPolicyShipToLocations;
}

interface EbayFulfillmentPolicyShippingOption {
  optionType: string;
  costType: string;
  shippingServices: EbayFulfillmentPolicyShippingService[];
  rateTableId?: string;
  shippingDiscountProfileId: string;
  shippingPromotionOffered: boolean;
}

interface EbayFulfillmentPolicy {
  name: string;
  description?: string;
  marketplaceId: string;
  categoryTypes: { name: string; default: boolean }[];
  handlingTime: { value: number; unit: string };
  shipToLocations: EbayFulfillmentPolicyShipToLocations;
  shippingOptions: EbayFulfillmentPolicyShippingOption[];
  globalShipping: boolean;
  pickupDropOff: boolean;
  freightShipping: boolean;
  fulfillmentPolicyId: string;
}

// Ebay Payment Polcies Types
export interface EbayGetPaymentPoliciesResponse extends EbayGetPolicyBaseResponse {
  paymentPolicies: EbayPaymentPolicy[];
}

interface EbayPaymentPolicy {
  name: string;
  marketplaceId: string;
  categoryTypes: { name: string; default: boolean }[];
  paymentMethods: unknown[];
  immediatePay: boolean;
  paymentPolicyId: string;
}

// Ebay Return Policies Types
export interface EbayGetReturnPoliciesResponse extends EbayGetPolicyBaseResponse {
  returnPolicies: EbayReturnPolicy[];
}

interface EbayReturnPolicyPeriod {
  value: number;
  unit: string;
}

interface EbayReturnPolicyInternationalOverride {
  returnsAccepted: boolean;
  returnMethod: string;
  returnPeriod: EbayReturnPolicyPeriod;
  returnShippingCostPayer: string;
}

interface EbayReturnPolicy {
  name: string;
  description?: string;
  marketplaceId: string;
  categoryTypes: { name: string }[];
  returnsAccepted: boolean;
  returnPeriod: EbayReturnPolicyPeriod;
  refundMethod: string;
  returnMethod: string;
  returnShippingCostPayer: string;
  internationalOverride?: EbayReturnPolicyInternationalOverride;
  returnPolicyId: string;
}
