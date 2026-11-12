import { FedExResponse } from "../types.js";

export interface FedExHarmonizedCodeUnitPrice {
  amount?: number;
  currency?: string;
}

/** The spec caps this object at 10 properties (`maxProperties`). */
export interface FedExHarmonizedCodeClassifyBase {
  /** Max length 256. */
  commodityName?: string;
  /** Max length 512. */
  commodityDescription: string;
  /** 2-letter code. */
  countryOfManufacture?: string;
  /** Max length 100. */
  productId?: string;
  categories?: string[];
  material?: string;
  unitPrice?: FedExHarmonizedCodeUnitPrice;
}

/**
 * At least one of the two country fields, as the field descriptions and
 * `MinimumSchemaExample1`/`2` say; the `required` array lists both:
 * docs/fedex-api.md#spec-contradictions-schema-chosen.
 */
export interface FedExHarmonizedCodeDestinationCountries {
  /** 2-letter codes. */
  destinationCountryCodes: string[];
  /** 2-letter code. */
  originCountryCode?: string;
}

export interface FedExHarmonizedCodeOriginCountry {
  /** 2-letter codes. */
  destinationCountryCodes?: string[];
  /** 2-letter code. */
  originCountryCode: string;
}

export type FedExHarmonizedCodeClassify = FedExHarmonizedCodeClassifyBase &
  (FedExHarmonizedCodeDestinationCountries | FedExHarmonizedCodeOriginCountry);

export interface FedExHarmonizedCodeSearchRequest {
  hsClassify?: FedExHarmonizedCodeClassify[];
}

export interface FedExHarmonizedCodeTariffAlternate {
  name?: string;
  code?: string;
  description?: string;
}

export interface FedExHarmonizedCodeSubheadingOption {
  name?: string;
  code?: string;
  description?: string;
  confidenceScore?: number;
  /** Spelled `tarriffAlternates` on the wire. */
  tarriffAlternates?: FedExHarmonizedCodeTariffAlternate[];
}

export interface FedExHarmonizedCodeClassification {
  countryCode?: string;
  countryType?: "DESTINATION" | "ORIGIN";
  subheadingOptions?: FedExHarmonizedCodeSubheadingOption[];
}

export type FedExHarmonizedCodeSearchResponse = FedExResponse<{
  hsClassifications?: FedExHarmonizedCodeClassification[];
}>;
