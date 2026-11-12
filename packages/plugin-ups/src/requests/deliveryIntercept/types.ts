/**
 * Path and query inputs shared by every Delivery Intercept operation. The tracking
 * number is the path segment, so it travels here rather than as a second bare string.
 */
export interface UpsDeliveryInterceptParams {
  /** `1Z` plus 16 alphanumerics; UPS shipper-initiated intercepts take 1Z numbers only */
  trackingNumber: string;
  /** Response locale such as `en_US`, so translated text comes back in the caller's language */
  loc?: string;
  /**
   * 3 to 14 characters. Generated when unset; UPS's test environment answers
   * only for fixed values — see docs/ups-api.md#delivery-intercept
   */
  transId?: string;
}

/** WC will call, SC same-day will call, FD future delivery, AA alternate address, RS return to sender, AL all (charges only) */
export type UpsDeliveryInterceptOption =
  "WC" | "SC" | "FD" | "AA" | "RS" | "AL";

export type UpsDeliveryInterceptRequestType = Exclude<
  UpsDeliveryInterceptOption,
  "AL"
>;

export interface UpsDeliveryInterceptChargesRequestV2 {
  clientIP?: string;
  ratingRequest: {
    redirectAddress?: {
      addressNickName: string;
      /** Address object, include line1, line2, line 3 state, postal code and country code. Required when processing a request if imsAddressIdentifier is not present. */
      addressInfo: UpsDeliveryInterceptAddressV2;
      /** The name of the company or person customer address.(Required When calling submitAddress() API Empty String can be passed) */
      nameOrCompanyName: string;
      contactName: string;
      /** The contact phone number at the customer address.(Required When calling submitAddress() API Empty String can be passed) */
      phoneNumber: string;
      /** The phone extension number at the customer address.(Required When calling submitAddress() API Empty String can be passed) */
      phoneExt?: string;
      emailAddress?: string;
    };
    fromAddress: UpsDeliveryInterceptAddressV2 &
      UpsDeliveryInterceptAdditionalAddressV2;
    toAddress: UpsDeliveryInterceptAddressV2 &
      UpsDeliveryInterceptAdditionalAddressV2;
    trackInfo: {
      interceptOption: UpsDeliveryInterceptOption;
    };
  }[];
}

export interface UpsDeliveryInterceptChargesResponseV2 {
  response: UpsDeliveryInterceptCommonResponseV2 & {
    chargeInfo: {
      trackingNumber: UpsDeliveryInterceptTrackingNumberV2;
      accessorialCharge: UpsDeliveryInterceptChargeV2;
      interceptCharge: UpsDeliveryInterceptChargeV2;
      transportationCharge: UpsDeliveryInterceptChargeV2;
      totalCharge: UpsDeliveryInterceptChargeV2;
      /** The ISO 4217 currency code */
      chargeCurrency: string;
      /** Estimate Delivery Date (YYYYMMDD). */
      estDeliveryDate: UpsDeliveryInterceptDateV2;
      residentialIndicator?: boolean;
      additionalHandlingIndicator?: boolean;
      downgradeServiceCode?: string | null;
      oversizeCode?: string | null;
      serviceCode: string;
      serviceDesc: string;
      packageWeight: string;
      packageWeightUOM: "LBS" | "KGS";
      packagingType: string;
      shipperName: string;
      displayShipperPaidInterceptCharges?: boolean;
      shipperPaidInterceptCharges?: boolean;
      shipperPaidTransportationCharges?: boolean;
      displayShipperPaidTransportationCharges?: boolean;
      chargesPaidByThirdPartyShipper?: boolean;
      taxes?: {
        tax?: string;
        taxAmount?: UpsDeliveryInterceptChargeV2;
      }[];
      totalTax?: UpsDeliveryInterceptChargeV2;
      preTaxTotalCharge: UpsDeliveryInterceptChargeV2;
      taxDisclaimerIndicator: "NTC" | "NTA" | "TA" | "TE" | "TU";
      interceptChargeDetail?: UpsDeliveryInterceptChargeDetailV2[];
    }[];
  };
}

export interface UpsDeliveryInterceptChargeDetailV2 {
  accessorialCharge?: string;
  interceptCharge?: string;
  transportationCharge?: string;
  totalCharge?: string;
  interceptOption?: string;
  displayShipperPaidInterceptCharges?: boolean;
  shipperPaidInterceptCharges?: boolean;
  successful?: boolean;
  currencyCode: string;
}

/**
 * The schema describes `commonEligibilityMap` as a single object, but every example
 * returns an array of them, one per feature — see docs/ups-api.md#delivery-intercept.
 */
export interface UpsDeliveryInterceptEligibilityEntry {
  interceptFeature?: "SDWC" | "RTS" | "WC" | "FD" | "RD";
  eligibilityValue?: {
    createEligibility: UpsDeliveryInterceptEligibilityValueV2;
    modifyEligibility: UpsDeliveryInterceptEligibilityValueV2;
    cancelEligibility: UpsDeliveryInterceptEligibilityValueV2;
    dateOptionsforFutureDelivery?: {
      /** `YYYYMMDD`; the schema says string, the example shows a bare number */
      date?: UpsDeliveryInterceptDateV2 | number;
      /** The schema lists Sunday to Friday only; Saturday is added by inference from `dayOfWeekNumber` 07 */
      dayOfWeekText?:
        | "Sunday"
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday";
      /** The schema says `"01"` to `"07"`; the example shows a bare number */
      dayOfWeekNumber?: "01" | "02" | "03" | "04" | "05" | "06" | "07" | number;
    }[];
    reasonOptionsForRTS?: {
      id: UpsDeliveryInterceptReturnReason;
      value: string;
    }[];
  };
}

export interface UpsDeliveryInterceptEligibilityOptionsResponseV2 {
  response: UpsDeliveryInterceptCommonResponseV2 & {
    commonEligibilityMap:
      | UpsDeliveryInterceptEligibilityEntry
      | UpsDeliveryInterceptEligibilityEntry[];
  };
}

/** AM cancelled, AN duplicate, AQ no COD, AR too expensive, AS shipped late, FA bad address, KR refused, KS not ordered, KV other */
export type UpsDeliveryInterceptReturnReason =
  "AM" | "AN" | "AQ" | "AR" | "AS" | "FA" | "KR" | "KS" | "KV";

export interface UpsDeliveryInterceptRequestV2 {
  requestType?: UpsDeliveryInterceptRequestType;
  requesterContactInfo: {
    name: string;
    telephone: string;
    phoneExt?: string;
    emailAddress?: string;
    altTelephone?: string;
    altPhoneExt?: string;
    displayPhoneNumber?: boolean;
  };
  reasonForReturn?: UpsDeliveryInterceptReturnReason;
  deliveryDate?: string;
  specialInstructions: string | null;
  newDeliveryAddress?: {
    addressNickName?: string;
    /** Address object, include line1, line2, line 3 state, postal code and country code. Required when processing a request if imsAddressIdentifier is not present. */
    addressInfo?: {
      /** Line 1 of the street address. Required if streetAddressParsedIndicator is FALSE; Required when setting Billing Address. */
      addressLine1: string;
      addressLine2?: string;
      addressLine3?: string;
      city: string;
      state: string;
      postalCode: string;
      /** The ISO country code of the address */
      countryCode: string;
    };
    /** The name of the company or person customer address.(Required When calling submitAddress() API Empty String can be passed) */
    nameOrCompanyName?: string;
    contactName?: string;
    /** The contact phone number at the customer address.(Required When calling submitAddress() API Empty String can be passed) */
    phoneNumber?: string;
    /** The phone extension number at the customer address.(Required When calling submitAddress() API Empty String can be passed) */
    phoneExt?: string;
    emailAddress?: string;
  };
}

export interface UpsDeliveryInterceptResponseV2 {
  transactionId: string;
  statusCode: string;
  statusMsg?: string;
  subStatusCode?: string;
  success: boolean;
  errors?: UpsDeliveryInterceptSuccessErrorV2[] | null;
  warnings?: Record<string, string>;
}

export interface UpsDeliveryInterceptCommonResponseV2 {
  transactionId: string;
  statusCode: string;
  statusMsg?: string;
  subStatusCode?: string;
  success?: boolean;
  warnings?: Record<string, unknown> | null;
  errors?: UpsDeliveryInterceptSuccessErrorV2[] | null;
}

export interface UpsDeliveryInterceptAddressV2 {
  /** Line 1 of the street address. Required if streetAddressParsedIndicator is FALSE; Required when setting Billing Address. */
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  state: string;
  postalCode: string;
  /** The ISO country code of the address */
  countryCode: string;
}

export interface UpsDeliveryInterceptAdditionalAddressV2 {
  buildingFloor?: string;
  publicLocationId?: string;
  /** Required when the user choses to enter a new card providing the Billing address in CreditCardInformation . */
  firstName: string;
  /** Required when the user choses to enter a new card providing the Billing address in CreditCardInformation object. */
  lastName?: string;
  fullName?: string;
  phoneNumber: string;
}

export type UpsDeliveryInterceptChargeV2 = string;

export type UpsDeliveryInterceptDateV2 = string;

export type UpsDeliveryInterceptEligibilityValueV2 =
  "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN";

export type UpsDeliveryInterceptTrackingNumberV2 = string;

export interface UpsDeliveryInterceptErrorResponseV2 {
  response: {
    transactionId?: string;
    statusCode: string;
    subStatusCode?: string;
    success?: boolean;
    errors: {
      code?: string;
      message?: string;
    }[];
  };
}

export interface UpsDeliveryInterceptSuccessErrorV2 {
  errorCode: string;
  errorMessage: string;
  errorSource?: string;
}
