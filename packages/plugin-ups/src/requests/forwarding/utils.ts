import { UpsForwardingHeaders } from "./types.js";
import { upsSubClient } from "../utils.js";

/** Pinned to the only value the spec lists — see docs/ups-api.md#version-pins */
export const FORWARDING_VERSION = "v1";

export const forwardingUrl = (path: string) =>
  `/api/forwarding/${FORWARDING_VERSION}${path}`;

/** Forwarding is served from `www.onlinetools.ups.com`, not the usual host. */
export const forwardingClient = (clientName: string) =>
  upsSubClient(clientName, "forwarding");

/**
 * `Content-Type` is documented as required even on GET, so it is always sent
 * except on the multipart upload, where axios must derive it with the boundary.
 */
export const forwardingHeaders = (
  { businessGuid, clientId }: UpsForwardingHeaders,
  json = true
) => ({
  ...(json && { "Content-Type": "application/json" }),
  "X-BusinessGUID": businessGuid,
  "X-ClientId": clientId,
});

/**
 * Flattens one `style: deepObject` query parameter into bracket-keyed entries,
 * `criteria[criteriaList][0][criteriaField]=…`. The spec gives no array syntax
 * for deepObject, so the indexed form is an inference —
 * docs/ups-api.md#forwarding-order-search-criteria
 */
export const deepObjectParams = (name: string, value: unknown) => {
  const out: Record<string, string | number | boolean> = {};
  const walk = (key: string, v: unknown) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) {
      v.forEach((item, i) => walk(`${key}[${i}]`, item));
    } else if (typeof v === "object") {
      for (const [k, item] of Object.entries(v as Record<string, unknown>))
        walk(`${key}[${k}]`, item);
    } else if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      out[key] = v;
    }
  };
  walk(name, value);
  return out;
};
