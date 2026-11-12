export interface UspsShipEnrollmentRequest {
  /** Exactly one MID: USPS accepts a single entry for now. */
  MIDs: [string];
}

export interface UspsShipEnrollmentStatus {
  MID?: string;
  /**
   * `Outbound` and `USPS Returns` are what the API returns today; the
   * upper-case values and `NONE` are documented as obsolete.
   */
  program?: "Outbound" | "USPS Returns" | "OUTBOUND" | "RETURNS" | "NONE";
  /** `YYYY-MM-DD`. */
  startDate?: string;
  epsAccountNumber?: string | null;
}

export interface UspsShipEnrollmentStatuses {
  MIDs?: UspsShipEnrollmentStatus[];
}
