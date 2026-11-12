import type { MultipartPart } from "../multipart.js";
import { RequestError } from "@dianemo/core";
import {
  boundaryOf,
  findMetadataPart,
  imageBytes,
  splitParts,
  toBuffer,
} from "../multipart.js";
import type {
  UspsContainerLabelImage,
  UspsContainerLabelResult,
  UspsContainerResponse,
} from "./types.js";

const toImage = (part: MultipartPart): UspsContainerLabelImage => ({
  bytes: imageBytes(part),
  contentType: part.contentType ?? "application/octet-stream",
  ...(part.filename ? { filename: part.filename } : {}),
});

const parseFailure = (reason: string, contentType: string | undefined) =>
  new RequestError("USP_0094", `Unreadable USPS container label: ${reason}`, {
    metadata: { contentType },
  });

/**
 * A boundary-splitting parser for the shape USPS documents for
 * `POST /containers`: a JSON part `containerMetadata` and an image part
 * `labelImage`. The metadata part is found by that name or by its JSON content
 * type; the image is the part named `labelImage`, else the first part that is
 * not the metadata. The fallback is an inference: the spec's own header example
 * for the image part carries no `name` — see docs/usps-api.md#multipart-parts.
 * Not a general multipart parser. A body that is a plain JSON object (no
 * boundary) is read as metadata alone, since USPS documents no such form.
 * `expectImage` is false when the request asked for `imageType: "NONE"`;
 * otherwise a multipart body with no image part is USP_0159, not a result.
 */
export const parseContainerLabelResponse = (
  body: unknown,
  contentType: string | undefined,
  expectImage = true
): UspsContainerLabelResult => {
  const bytes = toBuffer(body);
  if (!bytes) throw parseFailure("the body was not bytes", contentType);

  const boundary = boundaryOf(contentType, bytes);
  if (!boundary) {
    try {
      const metadata = JSON.parse(
        bytes.toString("utf8")
      ) as UspsContainerResponse;
      return { metadata };
    } catch {
      throw parseFailure("no multipart boundary and not JSON", contentType);
    }
  }

  const parts = splitParts(bytes, boundary);
  const metadataPart = findMetadataPart(parts, "containerMetadata");
  if (!metadataPart)
    throw parseFailure("no containerMetadata part", contentType);

  let metadata: UspsContainerResponse;
  try {
    metadata = JSON.parse(
      metadataPart.body.toString("utf8")
    ) as UspsContainerResponse;
  } catch {
    throw parseFailure("containerMetadata is not JSON", contentType);
  }

  const imagePart =
    parts.find((p) => p.name === "labelImage") ??
    parts.find((p) => p !== metadataPart);
  if (!imagePart && !expectImage) return { metadata };
  if (!imagePart)
    throw new RequestError(
      "USP_0159",
      "USPS container response had no label image part",
      { metadata: { contentType, parts: parts.length } }
    );
  return { metadata, labelImage: toImage(imagePart) };
};
