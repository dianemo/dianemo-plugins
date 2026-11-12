export type FedExWeightUnit = "KG" | "LB";

export type FedExDimensionUnit = "CM" | "IN";

/**
 * No FedEx spec marks any response field required, so none is here:
 * docs/fedex-api.md#response-envelope.
 */
export interface FedExResponse<T extends object> {
  transactionId?: string;
  customerTransactionId?: string;
  /** `T` owns `alerts` when it declares one, so the two array types are not intersected. */
  output?: Omit<{ alerts?: FedExAlert[] }, keyof T> & T;
}

export type FedExAlert = {
  code?: string;
  message?: string;
  alertType?: "NOTE" | "WARNING";
};

export interface FedExWeight {
  units: FedExWeightUnit;
  value: number;
}

export interface FedExDimensions {
  length: number;
  width: number;
  height: number;
  units: FedExDimensionUnit;
}

export type FedExPackageType =
  /**
   * Customer Packaging, FedEx Express® Services
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 150 lbs/68 KG
   */
  | "YOUR_PACKAGING"
  /**
   * Customer Packaging, FedEx Ground® Economy (Formerly known as FedEx SmartPost®) Services
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 70 lbs/32 KG
   */
  | "YOUR_PACKAGING_GROUND"
  /**
   * FedEx® Letters
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 1 lb/0.45 KG
   */
  | "FEDEX_ENVELOPE"
  /**
   * FedEx® Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_BOX"
  /**
   * FedEx® Small Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_SMALL_BOX"
  /**
   * FedEx® Medium Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_MEDIUM_BOX"
  /**
   * FedEx® Large Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_LARGE_BOX"
  /**
   * FedEx® Extra Large Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_EXTRA_LARGE_BOX"
  /**
   * FedEx® 10kg Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 22 lbs/10 KG
   */
  | "FEDEX_10KG_BOX"
  /**
   * FedEx® 25kg Box
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 55 lbs/25 KG
   */
  | "FEDEX_25KG_BOX"
  /**
   * FedEx® Pak
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_PAK"
  /**
   * FedEx® Tube
   *
   * SINGLE PACKAGE MAXIMUM WEIGHT: 20 lbs/9 KG
   */
  | "FEDEX_TUBE";

export enum FedExSubPackagingType {
  BAG = "BAG",
  BARREL = "BARREL",
  BASKET = "BASKET",
  BOX = "BOX",
  BUCKET = "BUCKET",
  BUNDLE = "BUNDLE",
  CAGE = "CAGE",
  CARTON = "CARTON",
  CASE = "CASE",
  CHEST = "CHEST",
  CONTAINER = "CONTAINER",
  CRATE = "CRATE",
  CYLINDER = "CYLINDER",
  DRUM = "DRUM",
  ENVELOPE = "ENVELOPE",
  HAMPER = "HAMPER",
  OTHER = "OTHER",
  PACKAGE = "PACKAGE",
  PAIL = "PAIL",
  PALLET = "PALLET",
  PARCEL = "PARCEL",
  PIECE = "PIECE",
  REEL = "REEL",
  ROLL = "ROLL",
  SACK = "SACK",
  SHRINKWRAPPED = "SHRINKWRAPPED",
  SKID = "SKID",
  TANK = "TANK",
  TOTEBIN = "TOTEBIN",
  TUBE = "TUBE",
  UNIT = "UNIT",
}

export type FedExServiceType =
  | "FEDEX_2_DAY"
  | "FEDEX_2_DAY_AM"
  | "FEDEX_CUSTOM_CRITICAL_CHARTER_AIR"
  | "FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE"
  | "FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE_EXCLUSIVE_USE"
  | "FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE_NETWORK"
  | "FEDEX_CUSTOM_CRITICAL_POINT_TO_POINT"
  | "FEDEX_CUSTOM_CRITICAL_SURFACE_EXPEDITE"
  | "FEDEX_CUSTOM_CRITICAL_SURFACE_EXPEDITE_EXCLUSIVE_USE"
  | "FEDEX_DISTANCE_DEFERRED"
  | "EUROPE_FIRST_INTERNATIONAL_PRIORITY"
  | "FEDEX_EXPRESS_SAVER"
  | "FIRST_OVERNIGHT"
  | "FEDEX_FIRST_OVERNIGHT_EXTRA_HOURS"
  | "FEDEX_GROUND"
  | "GROUND_HOME_DELIVERY"
  | "FEDEX_CARGO_AIRPORT_TO_AIRPORT"
  | "FEDEX_INTERNATIONAL_CONNECT_PLUS"
  | "INTERNATIONAL_ECONOMY"
  | "INTERNATIONAL_ECONOMY_DISTRIBUTION"
  | "INTERNATIONAL_FIRST"
  | "FEDEX_CARGO_MAIL"
  | "FEDEX_CARGO_INTERNATIONAL_PREMIUM"
  | "INTERNATIONAL_PRIORITY_DISTRIBUTION"
  | "FEDEX_INTERNATIONAL_PRIORITY_EXPRESS"
  | "FEDEX_INTERNATIONAL_PRIORITY"
  | "FEDEX_INTERNATIONAL_PRIORITY_PLUS"
  | "PRIORITY_OVERNIGHT"
  | "PRIORITY_OVERNIGHT_EXTRA_HOURS"
  | "SAME_DAY"
  | "SAME_DAY_CITY"
  | "SMART_POST"
  | "FEDEX_STANDARD_OVERNIGHT_EXTRA_HOURS"
  | "STANDARD_OVERNIGHT"
  | "TRANSBORDER_DISTRIBUTION_CONSOLIDATION"
  | "FEDEX_CUSTOM_CRITICAL_TEMP_ASSURE_AIR"
  | "FEDEX_CUSTOM_CRITICAL_TEMP_ASSURE_VALIDATED_AIR"
  | "FEDEX_CUSTOM_CRITICAL_WHITE_GLOVE_SERVICES"
  | "FEDEX_REGIONAL_ECONOMY"
  | "FEDEX_REGIONAL_ECONOMY_FREIGHT"
  | "INTERNATIONAL_PRIORITY"
  | "FEDEX_1_DAY_FREIGHT"
  | "FEDEX_2_DAY_FREIGHT"
  | "FEDEX_3_DAY_FREIGHT"
  | "FIRST_OVERNIGHT_FREIGHT"
  | "FEDEX_NEXT_DAY_AFTERNOON"
  | "FEDEX_NEXT_DAY_EARLY_MORNING"
  | "FEDEX_NEXT_DAY_END_OF_DAY"
  | "FEDEX_NEXT_DAY_MID_MORNING"
  | "FEDEX_NEXT_DAY_FREIGHT"
  | "INTERNATIONAL_ECONOMY_FREIGHT"
  | "INTERNATIONAL_PRIORITY_FREIGHT";

export type FedexCarrierCodes =
  | "FDXE"
  | "FDXG"
  | "FXSP"
  | "FXFR"
  | "FDXC"
  | "FXCC"
  | "FEDEX_CARGO"
  | "FEDEX_CUSTOM_CRITICAL"
  | "FEDEX_EXPRESS"
  | "FEDEX_FREIGHT"
  | "FEDEX_GROUND"
  | "FEDEX_OFFICE"
  | "FEDEX_KINKOS"
  | "FX"
  | "FDFR"
  | "FDEG"
  | "FXK"
  | "FDC"
  | "FDCC";
