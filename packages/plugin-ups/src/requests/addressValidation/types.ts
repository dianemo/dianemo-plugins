export interface XAVResponse {
  XAVResponse: UPSValidationResponse;
}

/** Code `1` success, `0` failure. */
export interface UpsAddressValidationResponseStatus {
  Code: string;
  Description: string;
}

export interface UpsAddressValidationAlert {
  Code: string;
  Description: string;
}

export interface UPSValidationResponse {
  Response: {
    ResponseStatus: UpsAddressValidationResponseStatus;
    /** Always an array on v2; v1 collapsed a single alert to an object. */
    Alert?: UpsAddressValidationAlert[];
    TransactionReference?: {
      CustomerContext?: string;
      /** Not in the spec; v1.0.0 typed it, so it is kept optional. */
      TransactionIdentifier?: string;
    };
  };
  /** Address is valid */
  ValidAddressIndicator?: string;
  /** Address was not valid and no possible candidates were found */
  NoCandidatesIndicator?: string;
  /** Address was not valid but possible candidates were found */
  AmbiguousAddressIndicator?: string;
  AddressClassification?: UpsAddressClassification;
  /** Always an array on v2; v1 returned a bare object for a single candidate. */
  Candidate?: AddressCandidate[];
}

export interface UpsAddressClassification {
  /** 0=Unclassified; 1=Commercial; 2=Residential */
  Code: "0" | "1" | "2";
  Description: "Commercial" | "Residential" | "Unknown" | "UnClassified";
}

export interface AddressCandidate {
  AddressClassification?: UpsAddressClassification;
  AddressKeyFormat: {
    ConsigneeName?: string;
    AttentionName?: string;
    /** Street line plus, per the spec, political divisions and postal code. */
    AddressLine?: string[];
    /** City, state and postal code in one entry. */
    Region?: string;
    /** City */
    PoliticalDivision2?: string;
    /** State */
    PoliticalDivision1?: string;
    /** Normal Postal Code */
    PostcodePrimaryLow?: string;
    /** US 10-digit Postal Code */
    PostcodeExtendedLow?: string;
    /** Puerto Rico; Only Returned for PR */
    Urbanization?: string;
    /** Country Code */
    CountryCode: string;
  };
}

export interface XAVRequest {
  XAVRequest: {
    AddressKeyFormat: UpsAddressValidationAddressKeyFormat;
  };
}

/** Only `CountryCode` is required by the spec; the rest depend on `Region`. */
export interface UpsAddressValidationAddressKeyFormat {
  /** Ignored for a regional request. */
  ConsigneeName?: string;
  /** Ignored for a regional request. */
  AttentionName?: string;
  /** At most 3 lines; US and PR only for secondary information. */
  AddressLine?: string[];
  /**
   * US and PR only. When present UPS ignores the two political divisions and
   * both postal code fields.
   */
  Region?: string;
  PoliticalDivision2?: string;
  PoliticalDivision1?: string;
  PostcodePrimaryLow?: string;
  /** US only. */
  PostcodeExtendedLow?: string;
  /** Puerto Rico only. */
  Urbanization?: string;
  CountryCode: string;
}

/** 1 validation, 2 classification, 3 both. */
export type UpsAddressValidationRequestOption = 1 | 2 | 3;

interface UpsAddressValidationBaseOptions {
  /** 0-50; UPS's own default is 15 and this plugin's is 10. */
  maximumCandidateListSize?: number;
}

/**
 * A regional request is rejected with a 400 once classification is requested,
 * so the type only allows it with request option 1 — see
 * docs/ups-api.md#regionalrequestindicator-cannot-be-combined-with-classification
 */
export type UpsAddressValidationOptions = UpsAddressValidationBaseOptions &
  (
    | {
        /** Defaults to 3. */
        requestOption?: 2 | 3;
        regionalRequestIndicator?: never;
      }
    | {
        requestOption: 1;
        regionalRequestIndicator?: boolean;
      }
  );
