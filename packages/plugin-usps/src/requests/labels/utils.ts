import { boundaryOf, imageBytes, splitParts, toBuffer } from "../multipart.js";
import { RequestError } from "@dianemo/core";

const IMAGE_PARTS = ["indiciaImage", "receiptImage"] as const;

const unreadable = (reason: string, contentType: string | undefined) =>
  new RequestError("USP_0095", `Unreadable USPS indicia response: ${reason}`, {
    metadata: { contentType },
  });

const parseJson = (bytes: Buffer, contentType: string | undefined) => {
  try {
    return JSON.parse(bytes.toString("utf8")) as object;
  } catch {
    throw unreadable("not JSON and no multipart boundary", contentType);
  }
};

/**
 * Reads an indicia response whichever way USPS sent it. The spec says one
 * nested JSON document, but USPS's own example is `multipart/form-data` (an
 * `indiciaMetadata` JSON part, then PDF parts `indiciaImage` and
 * `receiptImage`), and the spec says `Accept: application/json` changes only
 * the metadata part of that. Parts are folded into the nested shape with the
 * images as base64, so a caller sees one type either way.
 */
export const readIndiciaBody = <T extends object>(
  body: unknown,
  contentType: string | undefined
): T => {
  const bytes = toBuffer(body);
  if (!bytes) throw unreadable("the body was not bytes", contentType);

  const looksMultipart =
    /multipart\//i.test(contentType ?? "") ||
    bytes.subarray(0, 2).toString() === "--";
  const boundary = looksMultipart ? boundaryOf(contentType, bytes) : undefined;
  if (!boundary) return parseJson(bytes, contentType) as T;

  const parts = splitParts(bytes, boundary);
  const metadataPart = parts.find((p) => p.name === "indiciaMetadata");
  if (!metadataPart) throw unreadable("no indiciaMetadata part", contentType);

  const result: Record<string, unknown> = {
    indiciaMetadata: parseJson(metadataPart.body, contentType),
  };
  for (const name of IMAGE_PARTS) {
    const part = parts.find((p) => p.name === name);
    if (part) result[name] = imageBytes(part).toString("base64");
  }
  return result as T;
};
