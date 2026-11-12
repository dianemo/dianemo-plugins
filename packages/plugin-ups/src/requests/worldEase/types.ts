/** Eleven alphanumerics; UPS also calls it the GCCN. */
export interface UpsWorldEaseMasterShipmentRef {
  shipmentGccn: string;
}

export interface UpsWorldEaseChildShipmentRef extends UpsWorldEaseMasterShipmentRef {
  /** The 1Z tracking number of the child shipment. */
  trackingNumber: string;
}

/** Body of both closeout and master delete. */
export interface UpsWorldEaseShipperRequest {
  shipperAccountNumber: string;
}

export type UpsWorldEaseLabelFormat =
  "PNG" | "GIF" | "PDF" | "ZPL" | "EPL" | "STAR" | "SPL";

export interface UpsWorldEaseCloseoutResponse {
  transId: string;
  /** The spec requires the object but none of its members. */
  label: {
    opTyp?: UpsWorldEaseLabelFormat;
    lblNmbr?: string;
    /** Base64. */
    lblData?: string;
  };
}

/** `code` is `"1"` on success per the spec. */
export interface UpsWorldEaseDeleteResponse {
  code: string;
  message: string;
}

export interface UpsWorldEaseError {
  code?: string;
  message?: string;
}

/** Unlike TradeDirect and Customs Detail, not wrapped in `response`. */
export interface UpsWorldEaseErrorResponse {
  errors: UpsWorldEaseError[];
}
