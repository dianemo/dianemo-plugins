import type { MultipartPart } from "../multipart.js";
import { RequestError } from "@dianemo/core";
import {
  boundaryOf,
  findMetadataPart,
  imageBytes,
  splitParts,
  toBuffer,
} from "../multipart.js";

type IndiciaImageName = "indiciaImage" | "receiptImage";
const IMAGE_NAMES: readonly IndiciaImageName[] = [
  "indiciaImage",
  "receiptImage",
];

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
 * Which part is which image. The spec's header example for an image part has
 * a `filename` and no `name`, so a name cannot be relied on. Rules, in order,
 * for every part not yet assigned: its `name`, then a file name containing the
 * image's name (`receiptImage.pdf`, `receipt-image.jpg`), then document order,
 * indicia first. The last two are inferences, not anything USPS states — see
 * docs/usps-api.md#multipart-parts.
 */
const assignImages = (images: MultipartPart[]) => {
  const assigned = new Map<IndiciaImageName, MultipartPart>();
  const claim = (
    match: (part: MultipartPart, key: IndiciaImageName) => boolean
  ) => {
    for (const part of images) {
      if ([...assigned.values()].includes(part)) continue;
      const key = IMAGE_NAMES.find((k) => !assigned.has(k) && match(part, k));
      if (key) assigned.set(key, part);
    }
  };
  claim((part, key) => part.name === key);
  claim((part, key) => {
    const file = (part.filename ?? "").toLowerCase().replace(/[^a-z]/g, "");
    return file.startsWith(key.slice(0, -"Image".length).toLowerCase());
  });
  claim(() => true);
  return assigned;
};

/**
 * Reads an indicia response whichever way USPS sent it. The spec says one
 * nested JSON document, but USPS's own example is `multipart/form-data` (an
 * `indiciaMetadata` JSON part, then PDF parts `indiciaImage` and
 * `receiptImage`), and the spec says `Accept: application/json` changes only
 * the metadata part of that. Parts are folded into the nested shape with the
 * images as base64, so a caller sees one type either way. A multipart body
 * with no image at all is an error unless the request was `IMI_DATA_ONLY`
 * (`expectImage` false) or the metadata carries `indiciaIMI`, which is what that
 * option returns instead of an image.
 */
export const readIndiciaBody = <T extends object>(
  body: unknown,
  contentType: string | undefined,
  expectImage = true
): T => {
  const bytes = toBuffer(body);
  if (!bytes) throw unreadable("the body was not bytes", contentType);

  const looksMultipart =
    /multipart\//i.test(contentType ?? "") ||
    bytes.subarray(0, 2).toString() === "--";
  const boundary = looksMultipart ? boundaryOf(contentType, bytes) : undefined;
  if (!boundary) return parseJson(bytes, contentType) as T;

  const parts = splitParts(bytes, boundary);
  const metadataPart = findMetadataPart(parts, "indiciaMetadata");
  if (!metadataPart) throw unreadable("no indiciaMetadata part", contentType);

  const indiciaMetadata = parseJson(metadataPart.body, contentType);
  const assigned = assignImages(parts.filter((p) => p !== metadataPart));
  if (
    assigned.size === 0 &&
    expectImage &&
    !(indiciaMetadata as { indiciaIMI?: unknown }).indiciaIMI
  )
    throw new RequestError(
      "USP_0160",
      "USPS indicia response had no image part",
      { metadata: { contentType, parts: parts.length } }
    );

  const result: Record<string, unknown> = { indiciaMetadata };
  for (const [name, part] of assigned)
    result[name] = imageBytes(part).toString("base64");
  return result as T;
};
