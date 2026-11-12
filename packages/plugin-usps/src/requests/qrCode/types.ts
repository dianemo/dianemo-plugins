export interface UspsQrCodeRequest {
  trackingNumber: string;
  /** The 11-digit delivery ZIP Code. */
  ZIPCode: string;
}

export interface UspsQrCodeResponse {
  trackingNumber: string;
  ZIPCode: string;
  /** One-time six-character access code for the locker. */
  pickupCode?: string;
  /** Base64 QR code image. */
  QRCode: string;
  /** `YYYY-MM-DD`: the last day to collect before removal from the locker. */
  lockerRemovalDate?: string;
  POName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  POZIPCode?: string;
  POZIPCodePlus4?: string;
}

export interface UspsQrCodeUnavailableResponse {
  trackingNumber: string;
  ZIPCode: string;
  /** Why no QR code is available. */
  alert: string;
}

/** Both arrive with HTTP 200: tell them apart by the presence of `QRCode`. */
export type UspsQrCodeSearchResponse =
  UspsQrCodeResponse | UspsQrCodeUnavailableResponse;
