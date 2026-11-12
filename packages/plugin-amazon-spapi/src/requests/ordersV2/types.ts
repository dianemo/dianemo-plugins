/** Amazon Orders API v2026-01-01 Types */

export type V2IncludedData =
  | "BUYER"
  | "RECIPIENT"
  | "PROCEEDS"
  | "EXPENSE"
  | "PROMOTION"
  | "CANCELLATION"
  | "FULFILLMENT"
  | "PACKAGES";

export type V2FulfillmentStatus =
  | "PENDING_AVAILABILITY"
  | "PENDING"
  | "UNSHIPPED"
  | "PARTIALLY_SHIPPED"
  | "SHIPPED"
  | "CANCELLED"
  | "UNFULFILLABLE";

export type V2FulfilledBy = "AMAZON" | "MERCHANT";

export type V2FulfillmentServiceLevel =
  | "EXPEDITED"
  | "FREE_ECONOMY"
  | "NEXT_DAY"
  | "PRIORITY"
  | "SAME_DAY"
  | "SECOND_DAY"
  | "SCHEDULED"
  | "STANDARD";

export type V2ConstraintType = "MANDATORY";

export type V2SubstitutionType =
  "CUSTOMER_PREFERENCE" | "AMAZON_RECOMMENDED" | "DO_NOT_SUBSTITUTE";

export type V2PackageStatusValue =
  | "PENDING"
  | "IN_TRANSIT"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "UNDELIVERABLE";

export type V2AddressType = "RESIDENTIAL" | "COMMERCIAL" | "PICKUP_POINT";

export type V2MeasurementUnit =
  | "OUNCES"
  | "POUNDS"
  | "KILOGRAMS"
  | "GRAMS"
  | "MILLIGRAMS"
  | "INCHES"
  | "FEET"
  | "METERS"
  | "CENTIMETERS"
  | "MILLIMETERS"
  | "SQUARE_METERS"
  | "SQUARE_CENTIMETERS"
  | "SQUARE_FEET"
  | "SQUARE_INCHES"
  | "GALLONS"
  | "PINTS"
  | "QUARTS"
  | "FLUID_OUNCES"
  | "LITERS"
  | "CUBIC_METERS"
  | "CUBIC_FEET"
  | "CUBIC_INCHES"
  | "CUBIC_CENTIMETERS"
  | "COUNT";

export type V2ConditionType =
  "NEW" | "USED" | "COLLECTIBLE" | "REFURBISHED" | "PREORDER" | "CLUB";

export type V2ConditionSubtype =
  | "NEW"
  | "MINT"
  | "VERY_GOOD"
  | "GOOD"
  | "ACCEPTABLE"
  | "POOR"
  | "CLUB"
  | "OEM"
  | "WARRANTY"
  | "REFURBISHED_WARRANTY"
  | "REFURBISHED"
  | "OPEN_BOX"
  | "ANY"
  | "OTHER";

export type V2ProceedsBreakdownType =
  "ITEM" | "SHIPPING" | "GIFT_WRAP" | "COD_FEE" | "OTHER" | "TAX" | "DISCOUNT";

export type V2ProceedsDetailedBreakdownSubtype =
  "ITEM" | "SHIPPING" | "GIFT_WRAP" | "COD_FEE" | "OTHER" | "DISCOUNT";

export type V2DayOfWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

export type V2ExceptionDateType = "CLOSED" | "OPEN";

export type V2ChannelName = "AMAZON" | "NON_AMAZON";

export type V2AssociationType =
  "REPLACEMENT_ORIGINAL_ID" | "EXCHANGE_ORIGINAL_ID";

export type V2AliasType = "SELLER_ORDER_ID";

// --- Core value types ---

export interface V2Money {
  amount: string;
  currencyCode: string;
}

export interface V2DateTimeRange {
  earliestDateTime?: string;
  latestDateTime?: string;
}

export interface V2Measurement {
  unit: V2MeasurementUnit;
  value: number;
}

export interface V2Pagination {
  nextToken?: string;
}

// --- Order-level types ---

export interface V2OrderAlias {
  aliasId: string;
  aliasType: V2AliasType;
}

export interface V2AssociatedOrder {
  orderId?: string;
  associationType?: V2AssociationType;
}

export interface V2SalesChannel {
  channelName: V2ChannelName;
  marketplaceId?: string;
  marketplaceName?: string;
}

export interface V2Buyer {
  buyerName?: string;
  buyerEmail?: string;
  buyerCompanyName?: string;
  buyerPurchaseOrderNumber?: string;
}

export interface V2AddressExtendedFields {
  streetName?: string;
  streetNumber?: string;
  complement?: string;
  neighborhood?: string;
}

export interface V2CustomerAddress {
  name?: string;
  companyName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  districtOrCounty?: string;
  stateOrRegion?: string;
  municipality?: string;
  postalCode?: string;
  countryCode?: string;
  phone?: string;
  extendedFields?: V2AddressExtendedFields;
  addressType?: V2AddressType;
}

export interface V2HourMinute {
  hour: number;
  minute: number;
}

export interface V2TimeWindow {
  startTime?: V2HourMinute;
  endTime?: V2HourMinute;
}

export interface V2BusinessHour {
  dayOfWeek?: V2DayOfWeek;
  timeWindows?: V2TimeWindow[];
}

export interface V2ExceptionDate {
  exceptionDate?: string;
  exceptionDateType?: V2ExceptionDateType;
  timeWindows?: V2TimeWindow[];
}

export interface V2PreferredDeliveryTime {
  businessHours?: V2BusinessHour[];
  exceptionDates?: V2ExceptionDate[];
}

export type V2PreferredDeliveryCapability =
  "HAS_ACCESS_POINT" | "PALLET_ENABLED" | "PALLET_DISABLED";

export interface V2DeliveryPreference {
  dropOffLocation?: string;
  addressInstruction?: string;
  deliveryTime?: V2PreferredDeliveryTime;
  deliveryCapabilities?: V2PreferredDeliveryCapability[];
}

export interface V2Recipient {
  deliveryAddress?: V2CustomerAddress;
  deliveryPreference?: V2DeliveryPreference;
}

export interface V2OrderProceeds {
  grandTotal?: V2Money;
}

export interface V2OrderFulfillment {
  fulfillmentStatus: V2FulfillmentStatus;
  fulfilledBy?: V2FulfilledBy;
  fulfillmentServiceLevel?: V2FulfillmentServiceLevel;
  shipByWindow?: V2DateTimeRange;
  deliverByWindow?: V2DateTimeRange;
}

// --- Order Item types ---

export interface V2ItemCondition {
  conditionType?: V2ConditionType;
  conditionSubtype?: V2ConditionSubtype;
  conditionNote?: string;
}

export interface V2ItemPrice {
  unitPrice?: V2Money;
  priceDesignation?: string;
}

export interface V2ItemCustomization {
  customizedUrl?: string;
}

export interface V2ItemProduct {
  asin?: string;
  title?: string;
  sellerSku?: string;
  condition?: V2ItemCondition;
  price?: V2ItemPrice;
  serialNumbers?: string[];
  customization?: V2ItemCustomization;
}

export interface V2ItemProceedsDetailedBreakdown {
  subtype?: V2ProceedsDetailedBreakdownSubtype;
  value?: V2Money;
}

export interface V2ItemProceedsBreakdown {
  type?: V2ProceedsBreakdownType;
  subtotal?: V2Money;
  detailedBreakdowns?: V2ItemProceedsDetailedBreakdown[];
}

export interface V2ItemProceeds {
  proceedsTotal?: V2Money;
  breakdowns?: V2ItemProceedsBreakdown[];
}

export interface V2PointsGranted {
  pointsNumber?: number;
  pointsMonetaryValue?: V2Money;
}

export interface V2ItemPointsCost {
  pointsGranted?: V2PointsGranted;
}

export interface V2ItemExpense {
  pointsCost?: V2ItemPointsCost;
}

export interface V2ItemPromotionBreakdown {
  promotionId?: string;
}

export interface V2ItemPromotion {
  breakdowns?: V2ItemPromotionBreakdown[];
}

export interface V2ItemCancellationRequest {
  requester?: string;
  cancelReason?: string;
}

export interface V2ItemCancellation {
  cancellationRequest?: V2ItemCancellationRequest;
}

export interface V2ItemSubstitutionOption {
  asin?: string;
  quantityOrdered?: number;
  sellerSku?: string;
  title?: string;
  measurement?: V2Measurement;
}

export interface V2ItemSubstitutionPreference {
  substitutionType: V2SubstitutionType;
  substitutionOptions?: V2ItemSubstitutionOption[];
}

export interface V2ItemPicking {
  substitutionPreference?: V2ItemSubstitutionPreference;
}

export interface V2GiftOption {
  giftMessage?: string;
  giftWrapLevel?: string;
}

export interface V2ItemPacking {
  giftOption?: V2GiftOption;
}

export interface V2ItemShippingConstraints {
  palletDelivery?: V2ConstraintType;
  cashOnDelivery?: V2ConstraintType;
  signatureConfirmation?: V2ConstraintType;
  recipientIdentityVerification?: V2ConstraintType;
  recipientAgeVerification?: V2ConstraintType;
}

export interface V2ItemInternationalShipping {
  iossNumber?: string;
}

export interface V2ItemShipping {
  scheduledDeliveryWindow?: V2DateTimeRange;
  shippingConstraints?: V2ItemShippingConstraints;
  internationalShipping?: V2ItemInternationalShipping;
}

export interface V2ItemFulfillment {
  quantityFulfilled?: number;
  quantityUnfulfilled?: number;
  picking?: V2ItemPicking;
  packing?: V2ItemPacking;
  shipping?: V2ItemShipping;
}

export interface V2OrderItem {
  orderItemId: string;
  quantityOrdered: number;
  measurement?: V2Measurement;
  programs?: string[];
  product: V2ItemProduct;
  proceeds?: V2ItemProceeds;
  expense?: V2ItemExpense;
  promotion?: V2ItemPromotion;
  cancellation?: V2ItemCancellation;
  fulfillment?: V2ItemFulfillment;
}

// --- Package types ---

export interface V2MerchantAddress {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  districtOrCounty?: string;
  stateOrRegion?: string;
  municipality?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface V2PackageStatus {
  status: V2PackageStatusValue;
  detailedStatus?: string;
}

export interface V2PackageItem {
  orderItemId: string;
  quantity: number;
  transparencyCodes?: string[];
}

export interface V2OrderPackage {
  packageReferenceId: string;
  createdTime?: string;
  packageStatus?: V2PackageStatus;
  carrier?: string;
  shipTime?: string;
  shippingService?: string;
  trackingNumber?: string;
  shipFromAddress?: V2MerchantAddress;
  packageItems?: V2PackageItem[];
}

// --- Top-level Order ---

export interface V2Order {
  orderId: string;
  orderAliases?: V2OrderAlias[];
  createdTime: string;
  lastUpdatedTime: string;
  programs?: string[];
  associatedOrders?: V2AssociatedOrder[];
  salesChannel: V2SalesChannel;
  buyer?: V2Buyer;
  recipient?: V2Recipient;
  proceeds?: V2OrderProceeds;
  fulfillment?: V2OrderFulfillment;
  orderItems: V2OrderItem[];
  packages?: V2OrderPackage[];
}

// --- Response types ---

export interface V2SearchOrdersResponse {
  orders: V2Order[];
  pagination?: V2Pagination;
  lastUpdatedBefore?: string;
  createdBefore?: string;
}

export interface V2GetOrderResponse {
  order: V2Order;
}
