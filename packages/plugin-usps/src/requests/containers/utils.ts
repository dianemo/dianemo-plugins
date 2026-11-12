import { boundaryOf, imageBytes, splitParts, toBuffer } from "../multipart.js";
import type { MultipartPart } from "../multipart.js";
import { RequestError } from "@dianemo/core";
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
 * A boundary-splitting parser for exactly the shape USPS documents for
 * `POST /containers`: a JSON part named `containerMetadata` and an image part
 * named `labelImage`. Not a general multipart parser. A body that is a plain
 * JSON object (no boundary) is read as metadata alone.
 */
export const parseContainerLabelResponse = (
  body: unknown,
  contentType: string | undefined
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
  const metadataPart = parts.find((p) => p.name === "containerMetadata");
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

  const imagePart = parts.find((p) => p.name === "labelImage");
  return imagePart
    ? { metadata, labelImage: toImage(imagePart) }
    : { metadata };
};
