export type UspsAdjustmentEventType = "CENSUS" | "DUPLICATES" | "UNMANIFESTED";

export interface UspsAdjustmentsParams {
  CRID: string;
  trackingNumber: string;
  eventType: UspsAdjustmentEventType;
  destinationZIPCode?: string;
}

export interface UspsAdjustmentReconciliationParams {
  CRID: string;
  eventType: UspsAdjustmentEventType;
  /** `YYYYMMDD`. */
  startDate: string;
  /** `HHMMSS`. */
  startTime: string;
  /** `YYYYMMDD`. */
  endDate: string;
  /** `HHMMSS`. */
  endTime: string;
  /** 1 to 100. */
  pageNum?: number;
  /** 1 to 100. */
  pageSize?: number;
}

export type UspsAdjustmentList = UspsAdjustmentDetails[];

export interface UspsAdjustmentDetails {
  trackingNumber?: string;
  manifestNumber?: string;
  adjustmentSubtype?: "CENSUS" | "DUPLICATES" | "UNMANIFESTED";
  details?: (
    | "WEIGHT"
    | "DIMENSIONAL"
    | "PACKAGING"
    | "ZONE"
    | "MISSHIPPED"
    | "DESTINATION_ENTRY"
    | "USED_REFUNDED_LABEL"
    | "HAZMAT"
    | "NONMAILABLE_DIMENSIONS"
    | "NONMAILABLE_WEIGHT"
  )[];
  /** @deprecated */
  rootCause?: (
    | "CENSUS"
    | "WEIGHT"
    | "DIMENSIONAL"
    | "PACKAGING"
    | "ZONE"
    | "MISSHIPPED"
    | "DESTINATION_ENTRY"
    | "UNMANIFESTED"
    | "DUPLICATES"
    | "USED_REFUNDED_LABEL"
    | "HAZMAT"
    | "NONMAILABLE_DIMENSIONS"
    | "NONMAILABLE_WEIGHT"
  )[];
  pricingCharacteristics?: {
    pricingCharacteristic?:
      | "WEIGHT"
      | "DIM_WEIGHT"
      | "LENGTH"
      | "WIDTH"
      | "HEIGHT"
      | "ORIGIN_ZIP_CODE"
      | "DESTINATION_ZIP_CODE"
      | "ZONE"
      | "DESTINATION_ENTRY_FACILITY_TYPE"
      | "RATE_INDICATOR"
      | "MAIL_CLASS";
    claimed?: string;
    assessed?: string;
  }[];
  USPSPackagingBarcode?: string;
  postageAdjustment?: number;
  assessedDateTime?: string;
  adjustmentTotalPostage?: {
    claimed?: number;
    assessed?: number;
  };
  adjustmentBasePostage?: {
    claimed?: number;
    assessed?: number;
  };
  /** @deprecated */
  totalPostage?: {
    claimed?: number;
    assessed?: number;
  };
  /** @deprecated */
  basePostage?: {
    claimed?: number;
    assessed?: number;
  };
  fees?: {
    name?:
      | "Nonstandard Dimension: Length > 22"
      | "Nonstandard Dimension: Length > 30"
      | "Nonstandard Dimension: Volume > 2 cubic feet"
      | "Nonstandard Dimension: Non-Compliance"
      | "NONSTANDARD_DIMENSION_LENGTH_LT_22"
      | "NONSTANDARD_DIMENSION_LENGTH_GT_30"
      | "NONSTANDARD_DIMENSION_VOLUME_GT_2_CUBIC_FEET"
      | "NONSTANDARD_DIMENSION_NON_COMPLIANCE"
      | "NONSTANDARD_CHARACTERISTICS_FEE"
      | "HAZMAT_NONCOMPLIANCE_FEE";
    claimedPostage?: number;
    assessedPostage?: number;
  }[];
  hazmatNoncomplianceErrorMessage?: string;
  accountNumber?: string;
  transactionID?: string;
  earliestScanDate?: string;
  MID?: string;
  CRID?: string;
  adjustmentStatus?: "PENDING" | "CHARGED" | "REMOVED";
  extraServices?: {
    extraServiceName?: string;
    extraServiceSku?: string;
    extraServiceAmount?: number;
    extraServiceCode?: string;
  }[];
  originAddress?: string;
  originCity?: string;
  originState?: string;
  originZipCode?: string;
  destinationAddress?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZipCode?: string;
  destinationCountryCode?: string;
  packageScanGroupingId?: string;
  manifestPackageId?: string;
  processingCategory?: string;
  processingCategoryName?:
    | "CARDS"
    | "LETTERS"
    | "FLATS"
    | "MACHINABLE_PARCEL"
    | "IRREGULAR_PARCEL"
    | "NONSTANDARD_PARCEL"
    | "CATALOGS"
    | "OPEN_AND_DISTRIBUTE"
    | "RETURNS"
    | "SOFT_PACK_MACHINABLE"
    | "SOFT_PACK_NON_MACHINABLE";
  mailingDate?: string;
  mailClassName?: string;
  primaryDeliveryAddress?: string;
  secondaryDeliveryAddress?: string;
}

export type UspsAdjustmentReconciliationList =
  UspsAdjustmentReconciliationDetails[];

export interface UspsAdjustmentReconciliationDetails {
  trackingNumber?: string;
  manifestNumber?: string;
  adjustmentSubtype?: "CENSUS" | "DUPLICATES" | "UNMANIFESTED";
  details?: (
    | "WEIGHT"
    | "DIMENSIONAL"
    | "PACKAGING"
    | "ZONE"
    | "MISSHIPPED"
    | "DESTINATION_ENTRY"
    | "USED_REFUNDED_LABEL"
    | "HAZMAT"
    | "NONMAILABLE_DIMENSIONS"
    | "NONMAILABLE_WEIGHT"
  )[];
  /** @deprecated */
  rootCause?: (
    | "CENSUS"
    | "WEIGHT"
    | "DIMENSIONAL"
    | "PACKAGING"
    | "ZONE"
    | "MISSHIPPED"
    | "DESTINATION_ENTRY"
    | "UNMANIFESTED"
    | "DUPLICATES"
    | "USED_REFUNDED_LABEL"
    | "HAZMAT"
    | "NONMAILABLE_DIMENSIONS"
    | "NONMAILABLE_WEIGHT"
  )[];
  pricingCharacteristics?: {
    pricingCharacteristic?:
      | "WEIGHT"
      | "DIM_WEIGHT"
      | "LENGTH"
      | "WIDTH"
      | "HEIGHT"
      | "ORIGIN_ZIP_CODE"
      | "DESTINATION_ZIP_CODE"
      | "ZONE"
      | "DESTINATION_ENTRY_FACILITY_TYPE"
      | "RATE_INDICATOR"
      | "MAIL_CLASS";
    claimed?: string;
    assessed?: string;
  }[];
  USPSPackagingBarcode?: string;
  postageAdjustment?: number;
  assessedDateTime?: string;
  adjustmentTotalPostage?: {
    claimed?: number;
    assessed?: number;
  };
  adjustmentBasePostage?: {
    claimed?: number;
    assessed?: number;
  };
  /** @deprecated */
  totalPostage?: {
    claimed?: number;
    assessed?: number;
  };
  /** @deprecated */
  basePostage?: {
    claimed?: number;
    assessed?: number;
  };
  fees?: {
    name?:
      | "NONSTANDARD_DIMENSION_LENGTH_LT_22"
      | "NONSTANDARD_DIMENSION_LENGTH_GT_30"
      | "NONSTANDARD_DIMENSION_VOLUME_GT_2_CUBIC_FEET"
      | "NONSTANDARD_DIMENSION_NON_COMPLIANCE"
      | "NONSTANDARD_CHARACTERISTICS_FEE"
      | "HAZMAT_NONCOMPLIANCE_FEE";
    claimedPostage?: number;
    assessedPostage?: number;
  }[];
  hazmatNoncomplianceErrorMessage?: string;
  accountNumber?: string;
  transactionID?: string;
  earliestScanDate?: string;
  MID?: string;
  CRID?: string;
  adjustmentStatus?: "PENDING" | "CHARGED" | "REMOVED";
  extraServices?: {
    extraServiceName?: string;
    extraServiceSku?: string;
    extraServiceAmount?: number;
    extraServiceCode?: string;
  }[];
  originAddress?: string;
  originCity?: string;
  originState?: string;
  originZIPCode?: string;
  destinationAddress?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZipCode?: string;
  destinationCountryCode?: string;
  packageScanGroupingId?: string;
  manifestPackageId?: string;
  processingCategory?: string;
  processingCategoryName?:
    | "CARDS"
    | "LETTERS"
    | "FLATS"
    | "MACHINABLE_PARCEL"
    | "IRREGULAR_PARCEL"
    | "NONSTANDARD_PARCEL"
    | "CATALOGS"
    | "OPEN_AND_DISTRIBUTE"
    | "RETURNS"
    | "SOFT_PACK_MACHINABLE"
    | "SOFT_PACK_NON_MACHINABLE";
  mailingDate?: string;
  mailClassName?: string;
  primaryDeliveryAddress?: string;
  secondaryDeliveryAddress?: string;
}

export interface UspsAdjustmentReconciliationPageMetadata {
  totalRecordCount?: number;
  pageNum?: number;
  totalPages?: number;
  pageSize: number;
}

/**
 * `items` is typed as the spec writes it: each element is itself the
 * `ReconciliationAdjustments` array, so the response nests two arrays deep.
 */
export interface UspsAdjustmentReconciliationResponse {
  items?: UspsAdjustmentReconciliationList[];
  metadata?: UspsAdjustmentReconciliationPageMetadata;
}
