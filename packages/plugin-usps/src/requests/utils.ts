import { toBuffer } from "./multipart.js";

export type UspsRateGroup = "default" | "labels";

/**
 * Names the sub-client carrying an endpoint's rate limit — see
 * docs/usps-api.md#rate-limits for why there are two.
 *
 * Each request appends its own segment rather than the caller doing it: which
 * group an endpoint belongs to is USPS's business, and appending the wrong one
 * would silently meter a label purchase against the 60/hour bucket.
 */
export const uspsSubClient = (clientName: string, group: UspsRateGroup) =>
  `${clientName}:${group}`;

/**
 * The one request the payment-token interceptor must never touch: minting the
 * token dispatches it on the same sub-client the interceptor guards.
 */
export const USPS_PAYMENT_AUTHORIZE_REQUEST_NAME = "usps.payments.authorize";

const isSuccess = (status: number | undefined) =>
  status !== undefined && status >= 200 && status < 300;

/**
 * For a request made with `responseType: "arraybuffer"`. Core redacts an error
 * body before the caller or the log sees it, and replaces a `Buffer` with
 * `"[Buffer n bytes]"`, so USPS's JSON error text would be lost. A 2xx body is
 * returned untouched (the very `Buffer` axios built, so a PDF cannot be
 * altered); only a non-2xx body is decoded, as UTF-8, and parsed when it is
 * JSON. See docs/usps-api.md#binary-responses-and-error-bodies.
 */
export const bytesOnSuccess = (
  data: unknown,
  _headers: unknown,
  status?: number
): unknown => {
  if (isSuccess(status)) return data;
  const bytes = toBuffer(data);
  if (!bytes) return data;
  const text = bytes.toString("utf8");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};
