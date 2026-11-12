/** `partnerId` is required; `transSrc` (not `transactionSrc`) is optional. */
export interface UpsCommerceGuardOptions {
  partnerId: string;
  transSrc?: string;
}

export interface UpsCommerceGuardChargebackVerifyRequestV1 {
  userInformation: {
    email: string;
    ipAddress: string;
  };
  billingContact: UpsCommerceGuardChargebackContactInformationV1;
  shippingContact: UpsCommerceGuardChargebackContactInformationV1;
  paymentInformation?: {
    txnId?: string;
    method?: string;
    issuerIdNumber?: number;
    lastDigits?: number;
    issuer?: string;
  } | null;
  products: {
    sku: string;
    name: string;
  }[];
  orderValue: number;
  currencyCode: string;
  orderId: string;
  orderCreatedAt: string;
}

export interface UpsCommerceGuardChargebackVerifyResponseV1 {
  superScore?: number;
  decision?: "reject" | "review" | "undecided";
  categoryScores?: {
    addressReliabilityScore?: UpsCommerceGuardChargebackScoreRankV1;
    digitalIdentityScore?: UpsCommerceGuardChargebackScoreRankV1;
    proxyScore?: UpsCommerceGuardChargebackScoreRankV1;
    paymentReliabilityScore?: UpsCommerceGuardChargebackScoreRankV1;
  };
}

export interface UpsCommerceGuardChargebackContactInformationV1 {
  name: {
    firstName: string;
    lastName: string;
  };
  phone: {
    countryCode: string;
    number: string;
  };
  address: {
    addressLine: string[];
    city: string;
    stateProvinceCode: string;
    postalCode: string;
    countryCode: string;
  };
}

export interface UpsCommerceGuardChargebackScoreRankV1 {
  score?: number;
  rank?: "no_risk" | "low" | "medium" | "high";
}

export interface UpsCommerceGuardChargebackErrorResponseV1 {
  response: {
    errors: {
      code:
        | "INVALID_REQUEST"
        | "UNAUTHORIZED"
        | "RATE_LIMIT_EXCEEDED"
        | "INTERNAL_SERVER_ERROR"
        | "DEPENDENCY_VALIDATION_FAILED"
        | "MISSING_FIELD"
        | "INVALID_FIELD"
        | "UNSUPPORTED"
        | "SERVER_ERROR";
      message: string;
    }[];
  };
}
