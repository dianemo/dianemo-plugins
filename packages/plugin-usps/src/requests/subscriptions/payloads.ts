import type { UspsSubscriptionLinks } from "./types.js";

export interface UspsSubscriptionAdjustmentsDetails {
  trackingNumber?: string;
  manifestNumber?: string;
  adjustmentSubtype?: "CENSUS" | "DUPLICATES" | "UNMANIFESTED";
  details?: Array<
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
  >;
  /** @deprecated */
  rootCause?: Array<
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
  >;
  pricingCharacteristics?: Array<{
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
  }>;
  USPSPackagingBarcode?: string;
  packaging?:
    | "APO_FPO_DPO_LARGE_FLAT_RATE_BOX"
    | "CUBIC_TIER_1"
    | "CUBIC_TIER_2"
    | "CUBIC_TIER_3"
    | "CUBIC_TIER_4"
    | "CUBIC_TIER_5"
    | "FLAT_RATE_ENVELOPE"
    | "GIFT_CARD_FLAT_RATE_ENVELOPE"
    | "LARGE_FLAT_RATE_BOX"
    | "LEGAL_FLAT_RATE_ENVELOPE"
    | "MEDIUM_FLAT_RATE_BOX"
    | "PADDED_FLAT_RATE_ENVELOPE"
    | "REGIONAL_RATE_BOX_A"
    | "REGIONAL_RATE_BOX_B"
    | "SMALL_FLAT_RATE_BOX"
    | "SMALL_FLAT_RATE_ENVELOPE"
    | "WINDOW_FLAT_RATE_ENVELOPE";
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
  fees?: Array<{
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
  }>;
  hazmatNoncomplianceErrorMessage?: string;
  accountNumber?: string;
  transactionID?: string;
  earliestScanDate?: string;
  MID?: string;
  CRID?: string;
  adjustmentStatus?: "PENDING" | "CHARGED" | "REMOVED";
  extraServices?: Array<{
    extraServiceName?: string;
    extraServiceSku?: string;
    extraServiceAmount?: number;
    extraServiceCode?: string;
  }>;
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

export interface UspsSubscriptionDisputesDispute {
  requestType?: "DISPUTE";
  requestStatus?: "CREATED" | "ACCEPTED" | "APPROVED" | "REJECTED";
  CRID?: string;
  manifestPackageID?: string;
  EPSAccountNumber?: string;
  mailClass?: string;
  mailerID?: string;
  originalDisputeAmount?: number;
  transactionAmount?: number;
  disputeID?: string;
  disputeCloseoutID?: string;
  disputeReason?: string;
  resolutionStatus?: string;
  resolutionDate?: string;
}

export interface UspsSubscriptionDisputesJointReview {
  requestType?: "JOINT_REVIEW";
  requestStatus?: "CREATED" | "ACCEPTED" | "REJECTED";
  CRID?: string;
  manifestPackageID?: string;
  EPSAccountNumber?: string;
  mailClass?: string;
  mailerID?: string;
  originalDisputeAmount?: number;
  transactionAmount?: number;
  disputeID?: string;
  disputeCloseoutID?: string;
  disputeReason?: string;
  resolutionStatus?: string;
  resolutionDate?: string;
}

export interface UspsSubscriptionDisputesUnusedLabel {
  requestType?: "UNUSED_LABEL";
  requestStatus?: "APPROVED" | "CREATED" | "ACCEPTED" | "PENDING" | "REJECTED";
  CRID?: number;
  recordType?: string;
  MID?: number;
  usageIndicator?: string;
  PIC?: string;
  customerReferenceNumber?: string;
  EFN?: string;
  dateOfMailing?: string;
  packageScanDate?: string;
  manifestDestinationZIPCode?: number;
  scanZIPCode?: number;
  manifestMailClass?: string;
  manifestProcessingCategory?: string;
  manifestRoutingBarCode?: string;
  manifestWeight?: number;
  manifestRateIndicator?: string;
  unusedLabelRefundAmount?: number;
  extraServiceCode1?: string;
  extraService1Amount?: number;
  extraServiceCode2?: string;
  extraService2Amount?: number;
  extraServiceCode3?: string;
  extraService3Amount?: number;
  extraServiceCode4?: string;
  extraService4Amount?: number;
  extraServiceCode5?: string;
  extraService5Amount?: number;
  rejectionReason?: string;
  transactionID?: number;
  ACHWithdrawalID?: number;
  MRDisputeID?: string;
}

export interface UspsSubscriptionDisputesLettersAndFlats {
  id?: {
    subscriptionId?: string;
    subscrType?: "DISPUTES";
    subscrSubType?: "ALL";
    status?: "ACCEPTED" | "REJECTED";
    APIRequestId?: string;
  };
  indiciaEMASId?: string;
  CRIDOfMailOwner?: string;
  label?: string;
  disputeId?: string;
  submissionDate?: string;
  rejectionReason?: "IR" | "NM" | "SE" | "RE";
  unusedLabelFeeAmt?: number;
  unusedLabelFeeType?: "CUSTOM" | "DEFAULT";
  refundAmount?: number;
  paymentLabel?: string;
  paymentFound?: "N" | "Y";
  refundFound?: "N" | "Y";
  statusCode?: string;
  statusMessage?: string;
  paymentEPSTranId?: string;
  paymentTransactionTime?: string;
  paymentTotalPostage?: number;
  compositeVersion?: string;
  indiciaAccountNumber?: string;
  indiciaAccountZIPCode?: string;
  indiciaAIC?: string;
  indiciaGLA?: string;
  indiciaProcessingCategory?: string;
  indiciaMailingDate?: string;
  indiciaIMB?: string;
  indiciaWeight?: number;
  indiciaPostage?: number;
  indiciaTotalPostage?: number;
  indiciaSKU?: string;
  indiciaMailClass?: string;
  LFManifestVersion?: string;
  LFManifestCreateDateTime?: string;
}

export interface UspsSubscriptionPackageTransactionDetailsPackage {
  transmissionDate?: string;
  mailingDate?: string;
  masterMID?: string;
  manifestTransactionID?: string;
  EFN?: string;
  IMpb?: string;
  PIC?: string;
  mailerID?: string;
  serviceTypeCode?: string;
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
  captWt?: number;
  uspsDimensionalWeight?: number;
  captDimLen?: number;
  captDimWd?: number;
  captDimHt?: number;
  entryFacilityZipcode?: string;
  destinationZipCode?: string;
  destntnRateInd?: string;
  rateIndicator?: string;
  sku?: string;
  basePostage?: number;
  publishedPrice?: number;
  manifestNonstndrdLengthFee1?: number;
  manifestNonstndrdLengthFee2?: number;
  manifestNonstndrdVolumeFee?: number;
  manNonstndrdCharFee?: number;
  extraServiceCode1?: string;
  extraServiceCode2?: string;
  extraServiceCode3?: string;
  extraServiceCode4?: string;
  extraServiceCode5?: string;
  extraService1Amount?: number;
  extraService2Amount?: number;
  extraService3Amount?: number;
  extraService4Amount?: number;
  extraService5Amount?: number;
  extraService1Sku?: string;
  extraService2Sku?: string;
  extraService3Sku?: string;
  extraService4Sku?: string;
  extraService5Sku?: string;
  srchSku?: string;
  warnings?: string;
  manifestPackageId?: string;
  manifestDimensionalWeight?: number;
  manifestDri?: string;
  manifestRateIndicator?: string;
  isTpb?: string;
  tpbShipperCrid?: string;
  tpbShipperName?: string;
  destinationCountryCode?: string;
  foreignPostalCode?: string;
  priceGroup?: string;
  custRefNum1?: string;
  custRefNum2?: string;
  permitFinanceNo?: string;
  permitType?: string;
  permitNo?: string;
  priceType?: string;
  claimedPostage?: number;
  assessedPostage?: number;
  paymentMethod?: string;
  epsTranType?: string;
  transactionDescription?: string;
  shipTranAmt?: number;
  pieceCount?: number;
  epsAccountNickname?: string;
  epsAccNum?: string;
  shipTranDt?: string;
  displayTranId?: string;
  achWithdrawalId?: string;
  weight?: number;
  dimLength?: number;
  dimWidth?: number;
  dimHeight?: number;
  totalVariance?: number;
  manifestZone?: string;
  censusReason?: string;
  assessmentType?: string;
  adminFeeType?: string;
  disputeId?: number;
  dtsFirst?: string;
  assdMcCode?: string;
  assessedLength?: number;
  assessedWeight?: number;
  assessedHeight?: number;
  assessedWidth?: number;
  assessedZone?: string;
  packaging?: string;
  upcCode?: string;
  scanNonstndrdLengthFee1?: number;
  scanNonstndrdLengthFee2?: number;
  scanNonstndrdVolumeFee?: number;
  scanNonstndrdCharFee?: number;
  noncomplianceFee?: number;
  assessmentYear?: string;
  assessedMailClass?: string;
  merchantRateCharged?: number;
  grossCommission?: number;
  platformRate?: number;
  ccWithdrawalId?: number;
  midOwnerName?: string;
  midUserName?: string;
  invoiceId?: number;
  assessmentDetails?: string;
  assessmentMonth?: string;
  achWithdrawalDate?: string;
  ccWithdrawalDate?: string;
  invoiceDate?: string;
  CRID?: string;
  platformUserId?: string;
  externalRefId?: string;
  pkgGrpId?: string;
}

export interface UspsSubscriptionPackageTransactionDetailsNonLabelFee {
  description?: string;
  idempotencyKey?: string;
  transactionType?: "FEE";
  paymentTransactionType?: "ADJUSTMENT" | "PURCHASE" | "REFUND";
  feeType?: string;
  accountNumber?: string;
  transmissionDate?: string;
  transactionDateTime?: string;
  transactionAmount?: number;
}

export interface UspsSubscriptionPackageTransactionDetailsReturnLabel {
  description?: string;
  idempotencyKey?: string;
  paymentTransactionType?: "ADJUSTMENT" | "PURCHASE" | "REFUND";
  labelType?: string;
  trackingNumber?: string;
  PIC?: string;
  CRID?: string;
  MID?: string;
  accountNumber?: string;
  mailingDate?: string;
  firstScanDate?: string;
  transactionDateTime?: string;
  originAddress?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  destinationAddress?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    countryCode?: string;
  };
  assessedPackage?: {
    mailClass?: string;
    packaging?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  assessedPostage?: {
    totalPostage?: number;
  };
  transactionAmount?: number;
  basePostage?: number;
  fees?: Array<{
    name?:
      | "NONSTANDARD_DIMENSION_LENGTH_LT_22"
      | "NONSTANDARD_DIMENSION_LENGTH_GT_30"
      | "NONSTANDARD_DIMENSION_VOLUME_GT_2_CUBIC_FEET"
      | "NONSTANDARD_DIMENSION_NON_COMPLIANCE";
    claimedPostage?: number;
    assessedPostage?: number;
  }>;
  extraServices?: Array<{
    extraServiceName?: string;
    extraServiceSku?: string;
    extraServiceAmount?: number;
    extraServiceCode?: string;
  }>;
}

export interface UspsSubscriptionUnpaidPackagesDetails {
  PIC?: string;
  CRID?: string;
  MID?: string;
  serviceTypeCode?: string;
  scanDateTime?: string;
}

export interface UspsSubscriptionAddressPayload {
  ZIPCode?: string;
  ZIPPlus4?: string;
  carrierRoute?: string;
  DPVBusiness?: string;
  DPVCMRA?: string;
  DPVDrop?: string;
  DPVDropCount?: string;
  DPVEducational?: string;
  DPVLACS?: string;
  DPVNoDoorDelivery?: string;
  DPVNostat?: string;
  DPVNostatReasonCode?: string;
  DPVSeasonal?: "Y" | "N";
  DPVThrowback?: "Y" | "N";
  DPVNoSecureLocation?: "Y" | "N";
  DPVVacant?: "Y" | "N";
  DPVNonDeliveryDays?: string;
  DPVUsageCode?: "A" | "B" | "C" | "D" | "G" | " ";
}

export interface UspsSubscriptionTrackingV3r2CoreDetail {
  trackingNumber?: string;
  associatedTrackingNumber?: string;
  destinationCity?: string;
  destinationCountry?: string;
  destinationState?: string;
  destinationZIPCode?: string;
  kahalaIndicator?: boolean;
  mailClass?: string;
  mailClassCode?: string;
  mailingDate?: string;
  mailType?: string;
  originCity?: string;
  originCountry?: string;
  originState?: string;
  originZIPCode?: string;
  services?: Array<string>;
  serviceTypeCode?: string;
  status?: string;
  statusCategory?: string;
  statusSummary?: string;
  uniqueTrackingID?: string;
}

export interface UspsSubscriptionTrackingV3r2DeliveryDateExpectation {
  endOfDay?: string;
  expectedDeliveryDate?: string;
  guaranteedDeliveryDate?: string;
  guaranteedDetails?: string;
  predictedDeliveryDate?: string;
  predictedDeliverySource?: string;
  predictedDeliveryWindowStartTime?: string;
  predictedDeliveryWindowEndTime?: string;
}

export interface UspsSubscriptionTrackingV3r2ServicesEligibility {
  proofOfDeliveryEnabled: boolean;
  RREEnabled: boolean;
  trackingProofOfDeliveryEnabled: boolean;
}

export interface UspsSubscriptionTrackingV3r2Event {
  acceptanceTypeCategory?: string;
  acceptanceTypeCategoryCode?: string;
  actionCode?: string;
  CODAmountDue?: string;
  eventCity?: string;
  eventCode?: string;
  eventCountry?: string;
  eventPartner?: string;
  eventState?: string;
  eventTimestamp?: string;
  eventType?: string;
  eventZIPCode?: string;
  firm?: string;
  GMTTimestamp?: string;
  GMTOffset?: string;
  reasonCode?: string;
  recipientName?: string;
  veriPoint?: boolean;
}

export interface UspsSubscriptionTrackingV3r2Container {
  containerID?: string;
  containerType?: string;
}

export type UspsSubscriptionTrackingV3r2ScanEventExtractEvent =
  UspsSubscriptionTrackingV3r2Event & {
    barcodeInputMethod?: string;
    containers?: Array<UspsSubscriptionTrackingV3r2Container>;
    eSOL?: boolean;
    scanEventExtractEventName?: string;
  };

export type UspsSubscriptionTrackingV3r2ScanEventDetails =
  UspsSubscriptionTrackingV3r2CoreDetail & {
    addressStandardizedCode?: string;
    addressServiceParticipantCode?: string;
    ancillaryServiceEndorsement?: string;
    customerReferenceNumber?: Array<string>;
    deliveryAddress?: string;
    destinationZIPCodePlus4?: string;
    electronicFileNumber?: string;
    impbComplianceReportCode?: string;
    logisticsManagerMailerID?: string;
    mailerID?: string;
    mailerName?: string;
    mailOwnerMailerID?: string;
    originalTrackingNumber?: string;
    postalCode?: string;
    productWeight?: string;
    startTheClockTimestamp?: string;
  };

export type UspsSubscriptionTrackingV3r2ScanEventExtractDeliveryDateExpectation =
  UspsSubscriptionTrackingV3r2DeliveryDateExpectation & {
    deliveryDateModifiedIndicator?: string;
  };

export type UspsSubscriptionTrackingV3r2Payload =
  UspsSubscriptionTrackingV3r2CoreDetail & {
    deliveryDateExpectation?: UspsSubscriptionTrackingV3r2DeliveryDateExpectation;
  } & {
    servicesEligibility?: UspsSubscriptionTrackingV3r2ServicesEligibility;
  } & {
    trackingEvents?: UspsSubscriptionTrackingV3r2Event[];
  };

export type UspsSubscriptionTrackingV3r2ScanEventExtractPayload =
  UspsSubscriptionTrackingV3r2ScanEventDetails & {
    deliveryDateExpectation?: UspsSubscriptionTrackingV3r2ScanEventExtractDeliveryDateExpectation;
  } & {
    servicesEligibility?: UspsSubscriptionTrackingV3r2ServicesEligibility;
  } & {
    trackingEvent?: UspsSubscriptionTrackingV3r2ScanEventExtractEvent;
  } & {
    /** The schema says `trackingEvent`; the spec's own example sends this array. */
    trackingEvents?: UspsSubscriptionTrackingV3r2ScanEventExtractEvent[];
  } & {
    links?: UspsSubscriptionLinks;
  };

export interface UspsSubscriptionNcoaName {
  firstName?: string;
  middleInital?: string;
  lastName?: string;
  businessName?: string;
}

export interface UspsSubscriptionNcoaStreetAddress {
  streetAddress: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
}

export interface UspsSubscriptionNcoaAddress extends UspsSubscriptionNcoaStreetAddress {
  fullName: string;
  city: string;
  state: string;
  ZIPCode: string;
  urbanization?: string;
}

export type UspsSubscriptionNcoaPayload = UspsSubscriptionNcoaName & {
  originalAddress?: UspsSubscriptionNcoaAddress;
  newAddress?: UspsSubscriptionNcoaAddress;
};
