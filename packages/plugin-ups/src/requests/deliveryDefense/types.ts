export interface UpsDeliveryDefenseAddressScoreRequest {
  /** Street address and unit number, if any. */
  street: string;
  city: string;
  state: string;
  /** `^[0-9]{5}(?:-[0-9]{4})?$` */
  zipCode: string;
}

export interface UpsDeliveryDefenseAddressScoreResponse {
  status?: { message?: string };
  data?: {
    /** Cleaned address as UPS read it. */
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    /** 100-1000; 900+ is low risk of loss, each lower band multiplies the likelihood of loss (4x at 700-899, up to 21x at 100-299). */
    score?: number;
    /** "Residential" or "Commercial". */
    resiComFlag?: string;
  };
}

export interface UpsDeliveryDefenseError {
  errorCode: string;
  errorMessage: string;
}

export interface UpsDeliveryDefenseValidationError {
  type?: string;
  title?: string;
  status?: number;
  traceId?: string;
  errors?: Record<string, unknown>;
}
