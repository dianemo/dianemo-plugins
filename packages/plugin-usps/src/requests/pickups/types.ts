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

/**
 * `{ email }` or `{ cellNumber }` per the spec and Postman collection. USPS's
 * README create example (dated 2023) sends `{ phone }` instead, and the README
 * responses echo `{ phone, extension }`, so that form is accepted too.
 */
export type UspsPickupContact =
  | { email: string }
  | { cellNumber: string }
  | { phone: string; extension?: string };

/**
 * One contact as USPS answers it. Each README response entry carries one
 * method, with `null` for the rest, and the eligibility example spells the
 * address `eMail`.
 */
export interface UspsPickupResponseContact {
  email?: string | null;
  /** Only in the README eligibility response. */
  eMail?: string | null;
  cellNumber?: string | null;
  phone?: string | null;
  extension?: string | null;
}

/**
 * The domestic address as USPS returns it; the abbreviations are read-only.
 * The README requests also send `postalCode` and `province`, and its update
 * response has `streetAdress` and `ZIPLus4` (sic) where the other examples
 * have `streetAddress` and `ZIPPlus4`; USPS's examples are not consistent
 * with each other, so the misspellings are admitted rather than trusted.
 */
export type UspsPickupDomesticAddress = Omit<
  UspsAddress,
  "ZIPPlus4" | "secondaryAddress" | "urbanization"
> & {
  secondaryAddress?: string | null;
  urbanization?: string | null;
  ZIPPlus4?: string | null;
  streetAddressAbbreviation?: string;
  cityAbbreviation?: string;
  postalCode?: string;
  province?: string;
  streetAdress?: string;
  ZIPLus4?: string | null;
};

export interface UspsPickupAddress {
  firstName: string;
  lastName: string;
  firm?: string;
  address: UspsPickupDomesticAddress;
  /** One or two contact methods. */
  contact: UspsPickupContact[];
}

/** Responses carry the counts as strings (`"1"`), requests as numbers. */
export interface UspsPickupResponsePackage extends Omit<
  UspsPickupPackage,
  "packageCount"
> {
  packageCount: number | string;
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

/** The address block of a response: README examples return `null` for absent names. */
export interface UspsPickupResponseAddress {
  firstName?: string | null;
  lastName?: string | null;
  firm?: string | null;
  address?: UspsPickupDomesticAddress;
  contact?: UspsPickupResponseContact[];
}

/**
 * The spec says eligibility answers with a `PickupAddress`; USPS's README
 * example wraps it as `{ pickupAddress: { ... } }`. Both are readable: the
 * fields directly, or under `pickupAddress`.
 */
export interface UspsPickupEligibilityResponse extends UspsPickupResponseAddress {
  pickupAddress?: UspsPickupResponseAddress;
}

/**
 * The spec's `PickupConfirmation` nests the pickup under
 * `carrierPickupRequest`, and the Postman PUT example sends it that way.
 * USPS's README create, get and update examples are flat: the same fields sit
 * beside `confirmationNumber`, with counts and weight as strings. A response
 * can therefore be read either way, and the PUT body may be either.
 */
export interface UspsPickupConfirmation {
  confirmationNumber?: string;
  pickupDate?: string;
  carrierPickupRequest?: UspsSchedulePickupRequest;
  pickupAddress?: UspsPickupResponseAddress | UspsPickupAddress;
  packages?: UspsPickupResponsePackage[];
  estimatedWeight?: number | string;
  pickupLocation?: UspsPickupLocation;
  nextAvailablePickup?: boolean;
}

/** One pickup. `getPickup` returns this, not an array — see docs/usps-api.md#pickups. */
export type UspsPickupDetails = UspsPickupConfirmation;

export interface UspsPickupGetOptions {
  /**
   * An ETag from an earlier `getPickup`. When it still matches, USPS answers
   * 304 with no body and the call resolves to `UspsPickupNotModified` instead
   * of failing — see docs/usps-api.md#pickups.
   */
  ifNoneMatch?: string;
}

/** What `getPickup` resolves to when `ifNoneMatch` still matched (a 304). */
export interface UspsPickupNotModified {
  notModified: true;
  /** The `ETag` header of the 304, else the `ifNoneMatch` that was sent. */
  etag: string;
}

export interface UspsPickupGetResult {
  pickup: UspsPickupDetails;
  etag: string;
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
