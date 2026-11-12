import { FedExResponse } from "../types.js";

export interface FedExValidateAddressRequest {
  /** YYYY-MM-DD */
  inEffectAsOfTimestamp?: string;
  validateAddressControlParameters?: {
    includeResolutionTokens?: boolean;
  };
  /** At most 100 per request. */
  addressesToValidate: FedExValidateAddressAddress[];
}

export interface FedExValidateAddressAddress {
  address: FedExValidateAddressInput;
  clientReferenceId?: string;
}

export interface FedExValidateAddressInput {
  /** At most three lines are read; the spec recommends 35 characters per line. */
  streetLines: string[];
  city: string;
  stateOrProvinceCode?: string;
  postalCode: string;
  countryCode?: string;
}

export type FedExValidateAddressResponse =
  FedExResponse<FedExValidateAddressOutput>;

export interface FedExValidateAddressOutput {
  resolvedAddresses?: FedExResolvedAddress[];
}

export interface FedExResolvedAddress {
  streetLinesToken?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  countryCode?: string;
  /** The spec leaves the element type unset; its description lists message codes such as INVALID.SUITE.NUMBER. */
  customerMessage?: string[];
  cityToken?: FedExResolutionToken[];
  /** Not in the spec; kept from v1.0.0, source unknown. */
  postalCode?: string;
  parsedPostalCode?: {
    base?: string;
    addOn?: string;
    deliveryPoint?: string;
  };
  postalCodeToken?: FedExResolutionToken;
  classification?: "MIXED" | "UNKNOWN" | "RESIDENTIAL" | "BUSINESS";
  postOfficeBox?: FedExAddressFlag;
  normalizedStatusNameDPV?: boolean;
  standardizedStatusNameMatchSource?: string;
  resolutionMethodName?:
    | "USPS_VALIDATE"
    | "CA_VALIDATE"
    | "GENERIC_VALIDATE"
    | "NAVTEQ_GEO_VALIDATE"
    | "TELEATLAS_GEO_VALIDATE";
  ruralRouteHighwayContract?: boolean;
  generalDelivery?: boolean;
  attributes?: FedExResolvedAddressAttributes;
}

export interface FedExResolutionToken {
  changed?: boolean;
  value?: string;
}

export interface FedExResolvedAddressAttributes {
  POBox?: FedExAddressFlag;
  POBoxOnlyZIP?: FedExAddressFlag;
  SplitZip?: FedExAddressFlag;
  /** The spec types these two as strings with the example "false". */
  SuiteRequiredButMissing?: string;
  InvalidSuiteNumber?: string;
  ResolutionInput?: string;
  DPV?: FedExAddressFlag;
  ResolutionMethod?: string;
  DataVintage?: string;
  MatchSource?: string;
  CountrySupported?: FedExAddressFlag;
  ValidlyFormed?: FedExAddressFlag;
  Matched?: FedExAddressFlag;
  /** Documented in the spec but absent from responses seen when v1.0.0 was written; do not rely on it. */
  Resolved?: FedExAddressFlag;
  Inserted?: FedExAddressFlag;
  MultiUnitBase?: FedExAddressFlag;
  ZIP11Match?: FedExAddressFlag;
  ZIP4Match?: FedExAddressFlag;
  UniqueZIP?: FedExAddressFlag;
  StreetAddress?: FedExAddressFlag;
  RRConversion?: FedExAddressFlag;
  ValidMultiUnit?: FedExAddressFlag;
  /** The spec types this as a free string and lists these values in prose. */
  AddressType?: "RAW" | "NORMALIZED" | "STANDARDIZED";
  /** The spec types this as a free string and lists these values in prose. */
  AddressPrecision?:
    | "MULTI_TENANT_UNIT"
    | "MULTI_TENANT_BASE"
    | "PO_BOX"
    | "UNIQUE_ZIP"
    | "STREET_ADDRESS"
    | "Street"
    | "StreetBuilding"
    | "StreetOrganization"
    | "StreetName";
  MultipleMatches?: FedExAddressFlag;
}

export type BooleanString = "true" | "false";

/**
 * The spec types these flags as booleans. v1.0.0 typed most of them as the
 * strings "true" and "false", apparently from observed responses; that is
 * unverified, so both are accepted until a real account settles it.
 */
export type FedExAddressFlag = boolean | BooleanString;
