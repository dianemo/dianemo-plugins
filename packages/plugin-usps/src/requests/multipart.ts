const LF = 0x0a;
const CR = 0x0d;
const DASH = 0x2d;

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

/**
 * The `boundary` parameter, quoted or not. A quoted boundary may hold spaces
 * (RFC 2046 allows them inside the value), so it is read to the closing quote
 * rather than to the first space. Anchored to a parameter start so a parameter
 * that merely ends in `boundary` cannot match.
 */
const boundaryParameter = (contentType: string | undefined) => {
  const match = contentType?.match(
    /;\s*boundary\s*=\s*(?:"([^"]*)"|([^;\s]+))/i
  );
  return match?.[1] ?? match?.[2];
};

export const boundaryOf = (contentType: string | undefined, body: Buffer) => {
  const fromHeader = boundaryParameter(contentType);
  if (fromHeader) return fromHeader;
  // USPS's published example is a bare body, so with no header the first line
  // is the delimiter.
  const firstLine = body.toString("latin1", 0, 200).split(/\r?\n/, 1)[0] ?? "";
  return firstLine.startsWith("--") ? firstLine.slice(2).trim() : undefined;
};

interface Delimiter {
  /** Where the `--boundary` text starts. */
  at: number;
  /** Where the next part's headers start: after the delimiter line's break. */
  contentStart: number;
  closing: boolean;
}

const isBlank = (byte: number) => byte === 0x20 || byte === 0x09;

/**
 * What follows `--boundary` decides whether it is a delimiter: a line break,
 * the closing `--`, trailing blanks (RFC 2046 allows transport padding), or the
 * end of the buffer. Anything else is a longer boundary that merely starts the
 * same way (`--XXY` against boundary `XX`) and belongs to a body.
 */
const delimiterAt = (
  body: Buffer,
  at: number,
  length: number
): Delimiter | undefined => {
  let i = at + length;
  const closing = body[i] === DASH && body[i + 1] === DASH;
  if (closing) i += 2;
  while (i < body.length && isBlank(body[i])) i++;
  if (i >= body.length) return { at, contentStart: body.length, closing };
  if (body[i] === LF) return { at, contentStart: i + 1, closing };
  if (body[i] === CR && body[i + 1] === LF)
    return { at, contentStart: i + 2, closing };
  return undefined;
};

/** Delimiter lines only count at the start of a line, never inside a body. */
const findDelimiters = (body: Buffer, delimiter: Buffer): Delimiter[] => {
  const found: Delimiter[] = [];
  let from = 0;
  for (;;) {
    const at = body.indexOf(delimiter, from);
    if (at === -1) return found;
    from = at + delimiter.length;
    if (at !== 0 && body[at - 1] !== LF) continue;
    const delimiterLine = delimiterAt(body, at, delimiter.length);
    if (delimiterLine) found.push(delimiterLine);
  }
};

const headerEnd = (part: Buffer) => {
  // A part with no headers opens with the blank line itself.
  if (part[0] === LF) return { at: 0, length: 1 };
  if (part[0] === CR && part[1] === LF) return { at: 0, length: 2 };
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
  const delimiters = findDelimiters(body, delimiter);
  const parts: MultipartPart[] = [];
  for (let i = 0; i < delimiters.length; i++) {
    const current = delimiters[i];
    if (current.closing) break;
    const next = delimiters[i + 1];
    const start = current.contentStart;
    // The line break before a delimiter belongs to the delimiter, not to the
    // body. A part with no delimiter after it was cut short (a body with no
    // closing `--boundary--`), and nothing says where its body really ends, so
    // its bytes are kept as they arrived.
    let end = next ? next.at : body.length;
    if (next) {
      if (body[end - 1] === LF) end -= 1;
      if (body[end - 1] === CR) end -= 1;
    }
    if (end < start) continue;
    const part = parsePart(body.subarray(start, end));
    if (part) parts.push(part);
  }
  return parts;
};

export const isJsonPart = (part: MultipartPart) =>
  /(?:^|[/+])json\b/i.test(part.contentType ?? "");

/**
 * The JSON metadata part: by name when USPS names it, else by being the JSON
 * one. USPS's spec shows the image part's header as
 * `Content-Disposition: attachment; filename=...` with no `name`, so a part
 * cannot be assumed to carry a name at all.
 */
export const findMetadataPart = (parts: MultipartPart[], name: string) =>
  parts.find((p) => p.name === name) ?? parts.find(isJsonPart);

const BINARY_TYPE = /^(?:application\/(?:pdf|octet-stream)|image\/)/i;
const BINARY_FILENAME = /\.(?:pdf|png|jpe?g|gif|tiff?|svg)$/i;

/**
 * Whether the part says it is a PDF or an image, by type or by file name. A
 * part's bytes happening to fall in the base64 alphabet is not a declaration.
 */
const declaredBinary = (part: MultipartPart) =>
  BINARY_TYPE.test(part.contentType ?? "") ||
  BINARY_FILENAME.test(part.filename ?? "");

/**
 * Whether every byte is base64 text. Whitespace is allowed anywhere (the
 * README's own example has a stray space mid-string, and Node's decoder skips
 * it) and `=` only as trailing padding.
 */
const isBase64Text = (body: Buffer) => {
  let sawData = false;
  let padding = false;
  for (const byte of body) {
    if (byte === 0x20 || byte === 0x09 || byte === CR || byte === LF) continue;
    if (byte === 0x3d) {
      padding = true;
      continue;
    }
    const alphabet =
      (byte >= 0x41 && byte <= 0x5a) ||
      (byte >= 0x61 && byte <= 0x7a) ||
      (byte >= 0x30 && byte <= 0x39) ||
      byte === 0x2b ||
      byte === 0x2f;
    if (!alphabet || padding) return false;
    sawData = true;
  }
  return sawData;
};

/**
 * Decoded only when the part says so: `Content-Transfer-Encoding: base64`, or a
 * PDF/image part whose whole body is base64 text, which is how USPS's README
 * example sends its PDF (no transfer encoding declared). A raw PDF starts with
 * `%PDF`, a PNG with 0x89, a JPEG with 0xFF, none of them base64 characters,
 * so a binary part is never mistaken for text. A part that is neither declared
 * nor typed as binary, such as ZPL, stays as it arrived.
 */
export const imageBytes = (part: MultipartPart): Buffer => {
  const declared = part.transferEncoding?.toLowerCase() === "base64";
  const decode = declared || (declaredBinary(part) && isBase64Text(part.body));
  return decode
    ? Buffer.from(part.body.toString("latin1"), "base64")
    : part.body;
};
