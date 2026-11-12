import { FedExResponse } from "../types.js";

export interface FedExHarmonizedCodeUnitPrice {
  amount?: number;
  currency?: string;
}

/** The spec caps this object at 10 properties (`maxProperties`). */
export interface FedExHarmonizedCodeClassify {
  /** Max length 256. */
  commodityName?: string;
  /** Max length 512. */
  commodityDescription: string;
  /** 2-letter codes. The spec's field descriptions say either this or `originCountryCode` is mandatory, but its `required` array lists both. */
  destinationCountryCodes: string[];
  /** 2-letter code. See `destinationCountryCodes` for the contradiction. */
  originCountryCode: string;
  /** 2-letter code. */
  countryOfManufacture?: string;
  /** Max length 100. */
  productId?: string;
  categories?: string[];
  material?: string;
  unitPrice?: FedExHarmonizedCodeUnitPrice;
}

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
