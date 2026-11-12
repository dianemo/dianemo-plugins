import { FedExTradeDocumentBytes } from "./types.js";

interface MultipartFile {
  field: string;
  bytes: FedExTradeDocumentBytes;
  name: string;
  type?: string;
}

interface MultipartParts {
  /** Each entry becomes a plain text field holding `JSON.stringify(value)`. */
  json: Record<string, unknown>;
  files: MultipartFile[];
}

/**
 * Builds the body with Node's global `FormData`, so callers hand over bytes and
 * metadata and never assemble a form. The JSON parts are plain text fields, not
 * `application/json` blobs: the spec shows `document: {…}` with no part
 * content-type — docs/fedex-api.md#trade-documents-upload-multipart-body.
 */
export function buildMultipartForm({ json, files }: MultipartParts): FormData {
  const form = new FormData();
  for (const [field, value] of Object.entries(json)) {
    form.append(field, JSON.stringify(value));
  }
  for (const { field, bytes, name, type } of files) {
    const blob =
      bytes instanceof Blob
        ? bytes
        : new Blob(
            [bytes] as ConstructorParameters<typeof Blob>[0],
            type ? { type } : undefined
          );
    form.append(field, blob, name);
  }
  return form;
}
