export type UspsPaymentRoleName =
  | "PAYER"
  | "RATE_HOLDER"
  | "LABEL_OWNER"
  | "SHIPPER"
  | "MAIL_OWNER"
  | "PLATFORM"
  | "RETURN_LABEL_PAYER"
  | "RETURN_LABEL_RATE_HOLDER"
  | "RETURN_LABEL_OWNER"
  | "LABEL_PROVIDER";

export type UspsPaymentAccountType = "EPS" | "PERMIT" | "METER" | "OMAS";

/**
 * `accountNumber` is required for `EPS` and `METER`; `permitNumber` and
 * `permitZIP` for `PERMIT` and `OMAS` — the spec states this in prose, not as a
 * schema constraint, so nothing here enforces it.
 */
export interface UspsPaymentAccount {
  accountType?: UspsPaymentAccountType;
  accountNumber?: string;
  permitNumber?: string;
  /** Five digits. */
  permitZIP?: string;
  /** Permits only; read-only, so it appears on responses. */
  nonProfitStatus?: boolean;
  /** Only when the inquiry carried `amount`; read-only. */
  sufficientFunds?: boolean;
}

export interface UspsPaymentRole extends UspsPaymentAccount {
  roleName: UspsPaymentRoleName;
  CRID?: string;
  /** Six or nine digits. */
  MID?: string;
  /** Six or nine digits. */
  manifestMID?: string;
}

/** The inquiry endpoint accepts these two only; `METER` and `OMAS` are token-only. */
export type UspsPaymentInquiryAccountType = "EPS" | "PERMIT";

export interface UspsPaymentAccountParams {
  accountNumber: string;
  accountType: UspsPaymentInquiryAccountType;
  /** Required by USPS when `accountType` is `PERMIT`. Five digits. */
  permitZIPCode?: string;
  /** When set, the response carries `sufficientFunds` for this amount. */
  amount?: number;
}

export interface UspsAuthorizePaymentRequest {
  roles: UspsPaymentRole[];
}

export interface UspsAuthorizePaymentResponse {
  /** Not in the spec's `required` list; the token mint fails if it is absent. */
  paymentAuthorizationToken?: string;
  roles: UspsPaymentRole[];
}
