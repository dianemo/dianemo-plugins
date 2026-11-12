export interface UspsUserInfoPermit {
  permitNumber?: string;
  permitZIP?: string;
}

export interface UspsUserInfoPaymentAccounts {
  /** One string, comma-and-space separated: `"1000000690, 1000013781"`. */
  accounts?: string;
  permits?: UspsUserInfoPermit[];
}

export interface UspsUserInfoMailOwner {
  /** Eight to sixteen characters. */
  crid?: string;
  /** One string, comma-and-space separated. */
  mids?: string;
}

/**
 * Which claims appear depends on the OAuth scopes granted to the app:
 * `usps:payment_methods` gates `payment_accounts`, `usps:MIDs` gates
 * `mail_owners`. The spec lists `profile`, `address`, `email` and
 * `usps:contract_rates` claims as not currently returned, so they are not
 * modelled; the index signature is the spec's `additionalProperties: true`.
 */
export interface UspsUserInfoResponse {
  sub: string;
  /** `YYYY-MM-DD`. */
  updated_at?: string;
  payment_accounts?: UspsUserInfoPaymentAccounts;
  mail_owners?: UspsUserInfoMailOwner[];
  [claim: string]: unknown;
}
