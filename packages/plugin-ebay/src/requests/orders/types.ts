import { CurrencyCodes } from "@dianemo/plugin-kit";

type EbayOrderFulfillmentStatus = "NOT_STARTED" | "IN_PROGRESS" | "FULFILLED";

type EbayTaxIdentifierType =
  "CODICE_FISCALE" | "DNI" | "NIE" | "NIF" | "NIT" | "VATIN";

type EbayFieldGroup = "TAX_BREAKDOWN";

type EbayCancelRequestState = "COMPLETED" | "REJECTED" | "REQUESTED";

type EbayCancelState = "CANCELED" | "IN_PROGRESS" | "NONE_REQUESTED";

type EbayFulfillmentInstructionsType =
  | "DIGITAL"
  | "PREPARE_FOR_PICKUP"
  | "SELLER_DEFINED"
  | "SHIP_TO"
  | "FULFILLED_BY_EBAY";

type EbayLineItemFulfillmentStatus =
  "FULFILLED" | "IN_PROGRESS" | "NOT_STARTED";

type EbayMarketplaceId =
  | "EBAY_AT"
  | "EBAY_AU"
  | "EBAY_BE"
  | "EBAY_CA"
  | "EBAY_CH"
  | "EBAY_CN"
  | "EBAY_CZ"
  | "EBAY_DE"
  | "EBAY_DK"
  | "EBAY_ES"
  | "EBAY_FI"
  | "EBAY_FR"
  | "EBAY_GB"
  | "EBAY_GR"
  | "EBAY_HK"
  | "EBAY_HU"
  | "EBAY_ID"
  | "EBAY_IE"
  | "EBAY_IL"
  | "EBAY_IN"
  | "EBAY_IT"
  | "EBAY_JP"
  | "EBAY_MY"
  | "EBAY_NL"
  | "EBAY_NO"
  | "EBAY_NZ"
  | "EBAY_PE"
  | "EBAY_PH"
  | "EBAY_PL"
  | "EBAY_PR"
  | "EBAY_PT"
  | "EBAY_RU"
  | "EBAY_SE"
  | "EBAY_SG"
  | "EBAY_TH"
  | "EBAY_TW"
  | "EBAY_US"
  | "EBAY_VN"
  | "EBAY_ZA"
  | "EBAY_MOTORS_US";

type EbaySoldFormat =
  "AUCTION" | "FIXED_PRICE" | "OTHER" | "SECOND_CHANCE_OFFER";

type EbayTaxType =
  | "STATE_SALES_TAX"
  | "PROVINCE_SALES_TAX"
  | "REGION"
  | "VAT"
  | "GST"
  | "ELECTRONIC_RECYCLING_FEE"
  | "MATTRESS_RECYCLING_FEE"
  | "ADDITIONAL_FEE"
  | "BATTERY_RECYCLING_FEE"
  | "TIRE_RECYCLING_FEE"
  | "WHITE_GOODS_DISPOSABLE_TAX"
  | "IMPORT_VAT"
  | "SST";

type EbayOrderPaymentStatus =
  "FAILED" | "FULLY_REFUNDED" | "PARTIALLY_REFUNDED" | "PENDING" | "PAID";

type EbayPaymentStatus = "FAILED" | "PENDING" | "PAID";

type PaymentMethodType =
  | "CREDIT_CARD"
  | "PAYPAL"
  | "CASHIER_CHECK"
  | "PERSONAL_CHECK"
  | "CASH_ON_PICKUP"
  | "EFT"
  | "EBAY"
  | "ESCROW";

type EbayRefundStatus = "FAILED" | "PENDING" | "REFUNDED";

type EbayVaultFulfillmentType =
  "SELLER_TO_VAULT" | "VAULT_TO_VAULT" | "VAULT_TO_BUYER";

type EbayAuthenticityVerificationReason =
  | "NOT_AUTHENTIC"
  | "NOT_AS_DESCRIBED"
  | "CUSTOMIZED"
  | "MISCATEGORIZED"
  | "NOT_AUTHENTIC_NO_RETURN";

type EbayAuthenticityVerificationStatus =
  "PENDING" | "PASSED" | "FAILED" | "PASSED_WITH_EXCEPTION";
type EbayCollectionMethod = "INVOICE" | "NET";

interface EbayValue {
  name: string;
  value: string;
}

interface EbayAmount {
  convertedFromCurrency?: CurrencyCodes;
  convertedFromValue?: string;
  currency: CurrencyCodes;
  value: string;
}

interface EbayContact {
  companyName?: string;
  contactAddress: EbayAddress;
  email?: string;
  fullName: string;
  primaryPhone?: {
    phoneNumber: string;
  };
}

interface EbayAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countryCode: string;
  county?: string;
  postalCode?: string;
  stateOrProvince?: string;
}

export interface GetEbayOrdersData {
  /**
   * The opaque `next` URL from a previous response, followed as-is. Every other
   * field here is already baked into it, so it is exclusive with all of them and
   * `getOrders` refuses the combination (`EBY_0004`). See
   * docs/ebay-api.md#paging-follows-the-opaque-next-url.
   */
  next?: string;
  /**
   * Up to 50 order ids. Exclusive with every other field here — eBay ignores the
   * rest when this is set, so `getOrders` refuses the combination (`EBY_0003`).
   * See docs/ebay-api.md#orderids-excludes-every-other-parameter.
   */
  orderIds?: string[];
  filters?: {
    creationDate?: {
      min: string;
      max?: string;
    };
    lastModifiedDate?: {
      min: string;
      max?: string;
    };
    orderFulfillmentStatus?: EbayOrderFulfillmentStatus[];
  };
  /**
   * eBay defaults this to 50 and caps it at 200, which is left to eBay rather
   * than pre-empted here — see docs/ebay-api.md#getorders-paging.
   */
  limit?: number;
  offset?: number;
  fieldGroups?: EbayFieldGroup[];
}

export interface GetEbayOrderData {
  orderId: string;
  fieldGroups?: string[];
}

export interface GetEbayOrdersResponse {
  orders: EbayOrder[];
  total: number;
  href: string;
  limit: number;
  offset: number;
  next?: string;
  prev?: string;
  warnings?: EbayWarning[];
}

interface EbayWarning {
  category?: string;
  domain?: string;
  errorId?: number;
  inputRefIds?: string[];
  longMessage?: string;
  message?: string;
  outputRefIds?: string[];
  parameters?: EbayValue[];
  subdomain?: string;
}

export interface EbayOrder {
  buyer: EbayBuyer;
  buyerCheckoutNotes: string;
  cancelStatus: EbayCancelStatus;
  creationDate: string;
  ebayCollectAndRemitTax?: boolean;
  fulfillmentHrefs?: string[];
  fulfillmentStartInstructions: EbayFulfillmentStartInstruction[];
  lastModifiedDate: string;
  legacyOrderId: string;
  lineItems: EbayLineItem[];
  orderFulfillmentStatus: EbayOrderFulfillmentStatus;
  orderId: string;
  orderPaymentStatus: EbayOrderPaymentStatus;
  paymentSummary: EbayPaymentSummary;
  pricingSummary: EbayPricingSummary;
  program?: EbayProgram;
  salesRecordReference?: string;
  sellerId: string;
  totalFeeBasisAmount: EbayAmount;
  totalMarketplaceFee?: EbayAmount;
}

interface EbayBuyer {
  buyerRegistrationAddress: EbayContact;
  taxAddress: {
    city?: string;
    countryCode?: string;
    postalCode?: string;
    stateOrProvince?: string;
  };
  taxIdentifier?: {
    taxpayerId?: string;
    taxIdentifierType?: EbayTaxIdentifierType;
    issuingCountry?: string;
  };
  username: string;
}

interface EbayCancelStatus {
  cancelledDate?: string;
  cancelRequests: {
    cancelCompletedDate?: string;
    cancelInitiator?: string;
    cancelReason?: string;
    cancelRequestedDate?: string;
    cancelRequestId?: string;
    cancelRequestState?: EbayCancelRequestState;
  }[];
  cancelState: EbayCancelState;
}

interface EbayFulfillmentStartInstruction {
  destinationTimeZone?: string;
  ebaySupportedFulfillment?: boolean;
  finalDestinationAddress?: EbayAddress;
  fulfillmentInstructionsType: EbayFulfillmentInstructionsType;
  maxEstimatedDeliveryDate?: string;
  minEstimatedDeliveryDate?: string;
  pickupStep?: {
    merchantLocationKey?: string;
  };
  shippingStep?: {
    shippingCarrierCode: string;
    shippingServiceCode: string;
    shipTo: EbayContact;
    shipToReferenceId?: string;
  };
}

interface EbayLineItem {
  appliedPromotions: {
    description?: string;
    discountAmount?: EbayAmount;
    promotionId?: string;
  }[];
  deliveryCost: {
    discountAmount?: EbayAmount;
    handlingCost?: EbayAmount;
    importCharges?: EbayAmount;
    shippingCost?: EbayAmount;
    shippingIntermediationFee?: EbayAmount;
  };
  discountedLineItemCost?: EbayAmount;
  ebayCollectAndRemitTaxes?: {
    amount?: EbayAmount;
    ebayReference?: EbayValue;
    taxType?: EbayTaxType;
    collectionMethod?: EbayCollectionMethod;
  }[];
  ebayCollectedCharges?: {
    ebayShipping?: EbayAmount;
  };
  giftDetails?: {
    message?: string;
    recipientEmail?: string;
    senderName?: string;
  };
  itemLocation?: {
    countryCode?: string;
    location?: string;
    postalCode?: string;
  };
  legacyItemId: string;
  legacyVariationId?: string;
  lineItemCost: EbayAmount;
  lineItemFulfillmentInstructions: {
    destinationTimeZone?: string;
    guaranteedDelivery: boolean;
    maxEstimatedDeliveryDate: string;
    minEstimatedDeliveryDate: string;
    shipByDate: string;
    sourceTimeZone?: string;
  };
  lineItemFulfillmentStatus: EbayLineItemFulfillmentStatus;
  lineItemId: string;
  linkedOrderLineItems?: {
    lineItemAspects?: EbayValue[];
    lineItemId?: string;
    maxEstimatedDeliveryDate?: string;
    minEstimatedDeliveryDate?: string;
    orderId?: string;
    sellerId?: string;
    shipments?: {
      shipmentTrackingNumber?: string;
      shippingCarrierCode?: string;
    }[];
    title?: string;
  }[];
  listingMarketplaceId: EbayMarketplaceId;
  properties: {
    buyerProtection: boolean;
    fromBestOffer?: boolean;
    soldViaAdCampaign?: boolean;
  };
  purchaseMarketplaceId: EbayMarketplaceId;
  quantity: number;
  refunds: {
    amount?: EbayAmount;
    refundDate?: string;
    refundId?: string;
    refundReferenceId?: string;
  }[];
  sku?: string;
  soldFormat: EbaySoldFormat;
  taxes: {
    amount?: EbayAmount;
    taxType?: EbayTaxType;
  }[];
  title: string;
  total: EbayAmount;
  variationAspects?: EbayValue[];
}

interface EbayPaymentSummary {
  payments: {
    amount: EbayAmount;
    paymentDate?: string;
    paymentHolds?: {
      expectedReleaseDate?: string;
      holdAmount?: EbayAmount;
      holdReason?: string;
      holdState?: string;
      releaseDate?: string;
      sellerActionsToRelease?: {
        sellerActionToRelease?: string;
      }[];
    }[];
    paymentMethod: PaymentMethodType;
    paymentReferenceId?: string;
    paymentStatus: EbayPaymentStatus;
  }[];
  refunds: {
    amount?: EbayAmount;
    refundDate?: string;
    refundId?: string;
    refundReferenceId?: string;
    refundStatus?: EbayRefundStatus;
  }[];
  totalDueSeller: EbayAmount;
}

interface EbayPricingSummary {
  adjustment?: EbayAmount;
  deliveryCost: EbayAmount;
  deliveryDiscount?: EbayAmount;
  fee?: EbayAmount;
  priceDiscount?: EbayAmount;
  priceSubtotal: EbayAmount;
  tax?: EbayAmount;
  total: EbayAmount;
}

interface EbayProgram {
  authenticityVerification?: {
    outcomeReason?: EbayAuthenticityVerificationReason;
    status?: EbayAuthenticityVerificationStatus;
  };
  ebayShipping?: {
    shippingLabelProvidedBy?: string;
  };
  ebayVault?: {
    fulfillmentType?: EbayVaultFulfillmentType;
  };
  ebayInternationalShipping?: {
    returnsManagedBy?: string;
  };
  fulfillmentProgram?: {
    fulfilledBy?: string;
  };
}
