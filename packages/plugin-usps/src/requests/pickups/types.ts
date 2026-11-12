import type { UspsAddress } from "../types.js";

export interface UspsPickupEligibilityParams {
  streetAddress: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  urbanization?: string;
}

export type UspsPackageType =
  | "FIRST-CLASS_PACKAGE_SERVICE"
  | "PRIORITY_MAIL_EXPRESS"
  | "PRIORITY_MAIL"
  | "RETURNS"
  | "USPS_GROUND_ADVANTAGE"
  | "INTERNATIONAL"
  | "OTHER";

export type UspsPickupLocationType =
  | "FRONT_DOOR"
  | "BACK_DOOR"
  | "SIDE_DOOR"
  | "KNOCK_ON_DOOR"
  | "MAIL_ROOM"
  | "OFFICE"
  | "PORCH"
  | "RECEPTION"
  | "MAILBOX"
  | "OTHER";

export type UspsPickupContact = { email: string } | { cellNumber: string };

/** The domestic address as USPS returns it; the abbreviations are read-only. */
export type UspsPickupDomesticAddress = Omit<UspsAddress, "ZIPPlus4"> & {
  ZIPPlus4?: string | null;
  streetAddressAbbreviation?: string;
  cityAbbreviation?: string;
};

export interface UspsPickupAddress {
  firstName: string;
  lastName: string;
  firm?: string;
  address: UspsPickupDomesticAddress;
  /** One or two contact methods. */
  contact: UspsPickupContact[];
}

export interface UspsPickupPackage {
  packageType: UspsPackageType;
  packageCount: number;
  averageLength?: number;
  averageWidth?: number;
  averageHeight?: number;
  trackingNumbers?: string[];
}

export interface UspsPickupLocation {
  packageLocation: UspsPickupLocationType;
  specialInstructions?: string;
  dogPresent?: boolean;
}

export interface UspsSchedulePickupRequest {
  /** YYYY-MM-DD */
  pickupDate: string;
  pickupAddress: UspsPickupAddress;
  packages: UspsPickupPackage[];
  estimatedWeight: number;
  pickupLocation: UspsPickupLocation;
  nextAvailablePickup?: boolean;
}

export type UspsPickupEligibilityResponse = UspsPickupAddress;

export interface UspsPickupConfirmation {
  confirmationNumber?: string;
  pickupDate?: string;
  carrierPickupRequest?: UspsSchedulePickupRequest;
}

export type UspsPickupDetails = UspsPickupConfirmation;

export interface UspsPickupGetOptions {
  /**
   * A 304 has no body and is likely to reject as an error; see
   * docs/usps-api.md before relying on it.
   */
  ifNoneMatch?: string;
}

export interface UspsPickupUpdateOptions {
  confirmationNumber: string;
  /** ETag from getPickup; valid one hour or until a PUT or DELETE uses it. */
  ifMatch: string;
}

export interface UspsPickupUpdateResult {
  pickup: UspsPickupConfirmation;
  etag: string;
}
