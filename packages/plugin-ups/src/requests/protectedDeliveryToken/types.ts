/** `X-UserToken` is the token `generateProtectedDeliveryToken` returned. */
export interface UpsProtectedDeliveryPinByTokenParams {
  userToken: string;
}

/**
 * The spec makes `trackingNumber` and `Authorization` required *headers* and `action`
 * and `epra` optional, on a GET — see docs/ups-api.md#protected-delivery-token.
 */
export interface UpsProtectedDeliveryEpraParams {
  trackingNumber: string;
  authorization: string;
  action?: string;
  epra?: string;
}

export interface UpsProtectedDeliveryGenerateTokenRequest {
  pin: string;
}

export interface UpsProtectedDeliveryGenerateTokenResponse {
  token: string;
}

export interface UpsProtectedDeliveryGetPinByTokenResponse {
  pin: string;
}

export interface UpsProtectedDeliveryGetPinsForTrackingNumberListRequest {
  trackingNumbers: string[];
}

export interface UpsProtectedDeliveryGetPinsForTrackingNumberListResponse {
  results: {
    trackingNumber: string;
    pin: string;
  }[];
}

export interface UpsProtectedDeliveryEpraResponse {
  response: UpsProtectedDeliveryEpraElement;
}

export interface UpsProtectedDeliveryEpraElement {
  epraCode?: string;
  epraRequired?: string;
  epraMatch?: string;
  epraKiala?: string;
}

export interface UpsProtectedDeliveryErrorResponse {
  errors: UpsProtectedDeliveryError[];
}

export interface UpsProtectedDeliveryError {
  code: string;
  message: string;
}

export interface UpsProtectedDeliveryWarningResponse {
  response: UpsProtectedDeliveryWarning;
}

export interface UpsProtectedDeliveryWarning {
  code?: string;
  message?: string;
}
