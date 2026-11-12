import type { UspsPickupDetails } from "./types.js";
import { RequestError } from "@dianemo/core";

/**
 * The spec's GET schema is an array, USPS's example and v2.0.0 are one object.
 * One element is unwrapped; any other count is a failure of its own.
 */
export const singlePickup = (
  body: UspsPickupDetails | UspsPickupDetails[],
  confirmationNumber: string
): UspsPickupDetails => {
  if (!Array.isArray(body)) return body;
  const [only] = body;
  if (body.length === 1 && only) return only;
  throw new RequestError(
    "USP_0096",
    `Expected one USPS pickup for ${confirmationNumber}, got ${body.length}`,
    { metadata: { confirmationNumber, count: body.length } }
  );
};
