const LF = 0x0a;
// Whitespace is allowed anywhere: the README's own example has a stray space
// mid-string, and Node's decoder skips it.
const BASE64_BODY = /^[A-Za-z0-9+/\s]+={0,2}\s*$/;

export interface MultipartPart {
  name: string | undefined;
  filename: string | undefined;
  contentType: string | undefined;
  transferEncoding: string | undefined;
  body: Buffer;
}

/**
 * Whatever axios handed back as one byte buffer. The request asks for
 * `arraybuffer`, so this is a `Buffer`; the other two arms cover a caller who
 * hands a recorded body to the parser. A string is read as latin1 so each
 * character stays one byte and nothing is re-encoded.
 */
export const toBuffer = (body: unknown): Buffer | undefined => {
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof ArrayBuffer) return Buffer.from(body);
  if (ArrayBuffer.isView(body))
    return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  if (typeof body === "string") return Buffer.from(body, "latin1");
  return undefined;
};

export const boundaryOf = (contentType: string | undefined, body: Buffer) => {
  const fromHeader = contentType?.match(/boundary="?([^";\s]+)"?/i)?.[1];
  if (fromHeader) return fromHeader;
  // USPS's published example is a bare body, so with no header the first line
  // is the delimiter.
  const firstLine = body.toString("latin1", 0, 200).split(/\r?\n/, 1)[0] ?? "";
  return firstLine.startsWith("--") ? firstLine.slice(2).trim() : undefined;
};

/** Delimiter lines only count at the start of a line, never inside a body. */
const delimiterOffsets = (body: Buffer, delimiter: Buffer): number[] => {
  const offsets: number[] = [];
  let from = 0;
  for (;;) {
    const at = body.indexOf(delimiter, from);
    if (at === -1) return offsets;
    if (at === 0 || body[at - 1] === LF) offsets.push(at);
    from = at + delimiter.length;
  }
};

const headerEnd = (part: Buffer) => {
  const crlf = part.indexOf("\r\n\r\n");
  const lf = part.indexOf("\n\n");
  if (crlf !== -1 && (lf === -1 || crlf < lf)) return { at: crlf, length: 4 };
  return lf === -1 ? undefined : { at: lf, length: 2 };
};

const parsePart = (raw: Buffer): MultipartPart | undefined => {
  const end = headerEnd(raw);
  if (!end) return undefined;
  const headers = new Map<string, string>();
  for (const line of raw.toString("latin1", 0, end.at).split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon > 0)
      headers.set(
        line.slice(0, colon).trim().toLowerCase(),
        line.slice(colon + 1).trim()
      );
  }
  const disposition = headers.get("content-disposition") ?? "";
  return {
    // `name=` must not match inside `filename=`.
    name: disposition.match(/(?:^|;)\s*name="([^"]*)"/i)?.[1],
    filename: disposition.match(/(?:^|;)\s*filename="([^"]*)"/i)?.[1],
    contentType: headers.get("content-type"),
    transferEncoding: headers.get("content-transfer-encoding"),
    body: raw.subarray(end.at + end.length),
  };
};

export const splitParts = (body: Buffer, boundary: string): MultipartPart[] => {
  const delimiter = Buffer.from(`--${boundary}`, "latin1");
  const offsets = delimiterOffsets(body, delimiter);
  const parts: MultipartPart[] = [];
  for (let i = 0; i < offsets.length - 1; i++) {
    // Skip the rest of the delimiter line, then drop the line break that
    // belongs to the next delimiter rather than to this body.
    let start = body.indexOf(LF, offsets[i]) + 1;
    let end = offsets[i + 1];
    if (body[end - 1] === LF) end -= 1;
    if (body[end - 1] === 0x0d) end -= 1;
    if (start > end) start = end;
    const part = parsePart(body.subarray(start, end));
    if (part) parts.push(part);
  }
  return parts;
};

/**
 * USPS's example shows the PDF part as base64 text with no
 * `Content-Transfer-Encoding`, which a raw-binary part would never look like:
 * a PDF starts with `%PDF`, a PNG with 0x89, ZPL with `^`, none of them base64
 * characters. Anything else is kept as it arrived.
 */
export const imageBytes = (part: MultipartPart): Buffer => {
  const declared = part.transferEncoding?.toLowerCase() === "base64";
  const looksBase64 = BASE64_BODY.test(part.body.toString("latin1"));
  return declared || looksBase64
    ? Buffer.from(part.body.toString("latin1"), "base64")
    : part.body;
};
