import { FedExPackageType, FedExResponse } from "../types.js";

/** The pickup specs accept only these two operating companies. */
export type FedExPickupCarrierCode = "FDXE" | "FDXG";

export type CheckPickupAvailabilityResponse =
  FedExResponse<FedExPickupAvailabilityOutput>;

export type CreatePickupResponse = FedExResponse<FedExPickupCreateOutput>;

export type CancelPickupResponse = FedExResponse<FedExPickupCancelOutput>;

export interface CreatePickupData {
  associatedAccountNumber: FedExPickupAccountNumber;
  originDetail: FedExPickupOriginDetail;
  associatedAccountNumberType?: string;
  totalWeight?: FedExPickupWeight;
  packageCount?: number;
  carrierCode: FedExPickupCarrierCode;
  requestedExpressPickupDetail?: FedExPickupRequestedExpressPickupDetail;
  accountAddressOfRecord?: FedExPickupAddress1;
  remarks?: string;
  countryRelationships?: "DOMESTIC" | "INTERNATIONAL";
  pickupType?: "ON_CALL" | "PACKAGE_RETURN_PROGRAM" | "REGULAR_STOP";
  trackingNumber?: string;
  commodityDescription?: string;
  expressFreightDetail?: FedExPickupExpressFreightPickupDetail;
  oversizePackageCount?: number;
  pickupNotificationDetail?: FedExPickupPickupNotificationdetail;
  pickupChargesPayment?: FedExPickupPickupChargesPayment;
  version?: FedExPickupVersion;
}

export interface FedExPickupAccountNumber {
  value?: string;
}

export interface FedExPickupOriginDetail {
  pickupAddressType?: "ACCOUNT" | "SHIPPER" | "OTHER";
  pickupLocation: FedExPickupPickupLocationParty;
  /** YYYY-MM-DDTHH:MM:SS, local to the pickup postal code; no time zone designator. */
  readyDateTimestamp: string;
  /** HH:MM:SS, local to the pickup postal code. */
  customerCloseTime: string;
  pickupDateType?: "SAME_DAY" | "FUTURE_DAY";
  packageLocation?: "FRONT" | "NONE" | "REAR" | "SIDE";
  buildingPart?: FedExPickupBuildingPart;
  buildingPartDescription?: string;
  earlyPickup?: boolean;
  suppliesRequested?: string;
  geographicalPostalCode?: string;
}

export interface FedExPickupPickupLocationParty {
  contact: FedExPickupContactCreatePickup;
  address: FedExPickupAddress;
  accountNumber?: FedExPickupAccountNumber;
  deliveryInstructions?: string;
}

export interface FedExPickupContactCreatePickup {
  companyName?: string;
  personName?: string;
  phoneNumber?: string;
  phoneExtension?: string;
}

export interface FedExPickupAddress {
  streetLines: string[];
  urbanizationCode?: string;
  city: string;
  stateOrProvinceCode: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
  addressClassification?: "MIXED" | "UNKNOWN" | "BUSINESS" | "RESIDENTIAL";
}

export interface FedExPickupWeight {
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExPickupRequestedExpressPickupDetail {
  serviceType?: string;
}

export interface FedExPickupAddress1 {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode?: string;
  residential?: boolean;
  addressClassification?: "MIXED" | "UNKNOWN" | "BUSINESS" | "RESIDENTIAL";
}

export interface FedExPickupExpressFreightPickupDetail {
  truckType?: "DROP_TRAILER_AGREEMENT" | "LIFTGATE" | "TRACTOR_TRAILER_ACCESS";
  service?: string;
  trailerLength?: "TRAILER_28_FT" | "TRAILER_48_FT" | "TRAILER_53_FT";
  bookingNumber?: string;
  dimensions?: FedExPickupDimensions;
}

export interface FedExPickupDimensions {
  length?: number;
  width?: number;
  units?: "CM" | "IN";
  height?: number;
}

export interface FedExPickupPickupNotificationdetail {
  emailDetails?: FedExPickupEmailDetail[];
  format?: "HTML" | "TEXT";
  userMessage?: string;
}

export interface FedExPickupEmailDetail {
  address?: string;
  locale?: string;
}

export interface FedExPickupPickupChargesPayment {
  paymentType?: FedExPickupPaymentType;
  payor?: FedExPickupPayor;
  payorType?: "RECIPIENT" | "SENDER" | "THIRD_PARTY";
}

export interface FedExPickupPayor {
  responsibleParty?: FedExPickupResponsibleParty;
}

export interface FedExPickupResponsibleParty {
  accountNumber?: FedExPickupAccountNumber2;
}

export interface FedExPickupAccountNumber2 {
  value?: string;
  key?: string;
}

export interface FedExPickupVersion {
  major?: number;
  minor?: number;
  patch?: number;
}

export interface CheckPickupAvailabilityData {
  pickupAddress: FedExPickupPickupAddress;
  /** YYYY-MM-DD; defaults to the current date when omitted. */
  dispatchDate?: string;
  /** HH:MM:SS in the pickup location's timezone. */
  packageReadyTime?: string;
  /** HH:MM:SS in the pickup location's timezone. */
  customerCloseTime?: string;
  pickupType?: "ON_CALL" | "TAG";
  pickupRequestType: ("SAME_DAY" | "FUTURE_DAY")[];
  shipmentAttributes?: FedExPickupShipmentAttributes;
  numberOfBusinessDays?: number;
  packageDetails?: FedExPickupRequestedPickupPackageDetail[];
  associatedAccountNumber?: string;
  associatedAccountNumberType?: "FEDEX_EXPRESS" | "FEDEX_GROUND";
  carriers: FedExPickupCarrierCode[];
  countryRelationship: "DOMESTIC" | "INTERNATIONAL";
  version?: FedExPickupVersion;
}

export interface FedExPickupPickupAddress {
  streetLines?: string[];
  urbanizationCode?: string;
  city?: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode: string;
  residential?: boolean;
  addressClassification?: "MIXED" | "UNKNOWN" | "BUSINESS" | "RESIDENTIAL";
}

export interface FedExPickupShipmentAttributes {
  serviceType?: string;
  weight?: FedExPickupWeight;
  packagingType?: FedExPackageType;
  dimensions?: FedExPickupDimensions;
}

export interface FedExPickupRequestedPickupPackageDetail {
  packageSpecialServices?: FedExPickupPackageSpecialServices;
}

export interface FedExPickupPackageSpecialServices {
  specialServiceTypes?: string[];
}

export interface CancelPickupData {
  associatedAccountNumber: FedExPickupAccountNumber;
  pickupConfirmationCode: string;
  remarks?: string;
  carrierCode?: FedExPickupCarrierCode;
  /** YYYY-MM-DD */
  scheduledDate: string;
  /** Express location identifier, for example `LOSA`; Express pickups only. */
  location?: string;
  version?: FedExPickupVersion;
}

export interface FedExPickupCreateOutput {
  /** Not in the spec; kept from v1.0.0, source unknown. */
  message?: string;
  pickupConfirmationCode?: string;
  /** Express location identifier, for example `LOSA`; Express pickups only. */
  location?: string;
}

export interface FedExPickupAvailabilityOutput {
  /** YYYY-MM-DDTHH:MM:SS, local to the pickup postal code. */
  requestTimestamp?: string;
  options?: FedExPickupPickupScheduleOption[];
}

export interface FedExPickupPickupScheduleOption {
  carrier?: "FDXE" | "FDXG" | "FXSP" | "FXFR";
  available?: boolean;
  /** YYYY-MM-DD */
  pickupDate?: string;
  /** HH:MM:SS */
  cutOffTime?: string;
  accessTime?: FedExPickupDuration;
  residentialAvailable?: boolean;
  countryRelationship?: "DOMESTIC" | "INTERNATIONAL";
  scheduleDay?: "SAME_DAY" | "FUTURE_DAY";
  /** HH:MM:SS */
  defaultReadyTime?: string;
  /** The spec leaves this untyped; its description gives HH:MM:SS, so a single string is an inference. */
  defaultLatestTimeOptions?: string;
  earlyCutOffTime?: string;
  earlyAccessTime?: FedExPickupDuration;
  earlyPickupLocationId?: string;
  readyTimeOptions?: string[];
  latestTimeOptions?: string[];
}

export interface FedExPickupDuration {
  hours?: number;
  minutes?: number;
}

export interface FedExPickupCancelOutput {
  pickupConfirmationCode?: string;
  cancelConfirmationMessage?: string;
}

export type FedExPickupBuildingPart =
  "APARTMENT" | "BUILDING" | "DEPARTMENT" | "FLOOR" | "ROOM" | "SUITE";

export type FedExPickupPaymentType =
  | "ACCOUNT"
  | "CASH"
  | "COLLECT"
  | "CHECK"
  | "CREDIT_CARD"
  | "RECIPIENT"
  | "SENDER"
  | "THIRD_PARTY";
