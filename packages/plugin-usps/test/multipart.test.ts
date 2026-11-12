import type { MultipartPart } from "../src/requests/multipart.js";
import { describe, expect, it } from "vitest";
import {
  boundaryOf,
  findMetadataPart,
  imageBytes,
  splitParts,
} from "../src/requests/multipart.js";

const part = (over: Partial<MultipartPart>): MultipartPart => ({
  name: undefined,
  filename: undefined,
  contentType: undefined,
  transferEncoding: undefined,
  body: Buffer.alloc(0),
  ...over,
});

const bodies = (parts: MultipartPart[]) => parts.map((p) => p.body.toString());

describe("multipart boundary", () => {
  it("reads quoted and unquoted boundaries, spaces included", () => {
    const body = Buffer.alloc(0);
    expect(boundaryOf("multipart/form-data; boundary=abc", body)).toBe("abc");
    expect(boundaryOf('multipart/form-data; boundary="a b-c"', body)).toBe(
      "a b-c"
    );
    expect(
      boundaryOf('multipart/form-data; boundary="a b-c"; charset=utf-8', body)
    ).toBe("a b-c");
    expect(boundaryOf("multipart/form-data; boundary=abc; x=y", body)).toBe(
      "abc"
    );
  });

  it("does not take a parameter that merely ends in boundary", () => {
    const body = Buffer.from("--real\r\n");
    expect(boundaryOf("multipart/form-data; xboundary=nope", body)).toBe(
      "real"
    );
  });

  it("falls back to the first line of a bare body", () => {
    expect(boundaryOf(undefined, Buffer.from("--abc\r\nA: b\r\n\r\nx"))).toBe(
      "abc"
    );
  });

  it("splits a body whose quoted boundary has spaces", () => {
    const boundary = "a b-c";
    const body = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="one"\r\n\r\nfirst\r\n--${boundary}--\r\n`
    );
    expect(splitParts(body, boundary).map((p) => p.name)).toEqual(["one"]);
  });
});

describe("splitParts", () => {
  const header = `Content-Disposition: form-data; name=`;

  it("keeps the last part of a body with no closing delimiter", () => {
    const body = Buffer.from(
      `--B\r\n${header}"a"\r\n\r\nfirst\r\n--B\r\n${header}"b"\r\n\r\nsecond`
    );
    const parts = splitParts(body, "B");
    expect(parts.map((p) => p.name)).toEqual(["a", "b"]);
    expect(bodies(parts)).toEqual(["first", "second"]);
  });

  it("keeps the last part when the body ends after the final line break", () => {
    const body = Buffer.from(`--B\r\n${header}"a"\r\n\r\nonly\r\n`);
    expect(splitParts(body, "B")[0].body.toString()).toBe("only\r\n");
  });

  it("does not take a longer boundary that starts the same way as a delimiter", () => {
    const inner = Buffer.from(`line\r\n--BB\r\nstill the body\r\n--B-\r\n--Bx`);
    const body = Buffer.concat([
      Buffer.from(`--B\r\n${header}"a"\r\n\r\n`),
      inner,
      Buffer.from(`\r\n--B--\r\n`),
    ]);
    const parts = splitParts(body, "B");
    expect(parts).toHaveLength(1);
    expect(parts[0].body.equals(inner)).toBe(true);
  });

  it("accepts transport padding after a delimiter and an LF-only body", () => {
    const body = Buffer.from(
      `--B  \n${header}"a"\n\nfirst\n--B \t\n${header}"b"\n\nsecond\n--B--  \n`
    );
    expect(bodies(splitParts(body, "B"))).toEqual(["first", "second"]);
  });

  it("stops at the closing delimiter and ignores an epilogue", () => {
    const body = Buffer.from(
      `preamble\r\n--B\r\n${header}"a"\r\n\r\nfirst\r\n--B--\r\n--B\r\n${header}"z"\r\n\r\nignored`
    );
    expect(splitParts(body, "B").map((p) => p.name)).toEqual(["a"]);
  });

  it("reads a part with no headers", () => {
    const body = Buffer.from(`--B\r\n\r\nbare\r\n--B--\r\n`);
    expect(bodies(splitParts(body, "B"))).toEqual(["bare"]);
  });

  it("still ignores a delimiter that is not at the start of a line", () => {
    const body = Buffer.from(
      `--B\r\n${header}"a"\r\n\r\nx--B\r\ny\r\n--B--\r\n`
    );
    expect(bodies(splitParts(body, "B"))).toEqual(["x--B\r\ny"]);
  });
});

describe("findMetadataPart", () => {
  it("finds the part by name, else by JSON content type", () => {
    const named = part({ name: "meta", body: Buffer.from("{}") });
    const typed = part({ contentType: "application/json" });
    const image = part({ filename: "label-image.jpg" });
    expect(findMetadataPart([image, named], "meta")).toBe(named);
    expect(findMetadataPart([image, typed], "meta")).toBe(typed);
    expect(
      findMetadataPart(
        [image, part({ contentType: "application/vnd.usps.labels+json" })],
        "meta"
      )
    ).toBeDefined();
    expect(findMetadataPart([image], "meta")).toBeUndefined();
  });
});

describe("imageBytes", () => {
  const pdf = Buffer.from("%PDF-1.4\nâã\u0000 trailer", "latin1");
  const text = Buffer.from(pdf.toString("base64"));

  it("decodes a declared base64 part whatever its type", () => {
    expect(
      imageBytes(part({ transferEncoding: "Base64", body: text })).equals(pdf)
    ).toBe(true);
  });

  it("decodes a PDF or image part whose whole body is base64 text, by type or file name", () => {
    const spaced = Buffer.from(text.toString().replace(/(.{12})/g, "$1\r\n"));
    expect(
      imageBytes(part({ contentType: "application/pdf", body: spaced })).equals(
        pdf
      )
    ).toBe(true);
    expect(
      imageBytes(part({ contentType: "image/png", body: text })).equals(pdf)
    ).toBe(true);
    expect(
      imageBytes(part({ filename: "label-image.jpg", body: text })).equals(pdf)
    ).toBe(true);
  });

  it("does not decode a part only because its bytes are in the base64 alphabet", () => {
    const zpl = Buffer.from("ABCD1234abcd");
    for (const p of [
      part({ body: zpl }),
      part({ contentType: "text/plain", body: zpl }),
      part({
        contentType: "application/zpl",
        filename: "label.zpl",
        body: zpl,
      }),
    ])
      expect(imageBytes(p).equals(zpl)).toBe(true);
  });

  it("does not decode a binary part that contains a non-alphabet byte", () => {
    for (const body of [
      pdf,
      Buffer.from([0x89, 0x50, 0x4e, 0x47]),
      Buffer.from("QUJD=QUJD"),
      Buffer.from("   "),
    ])
      expect(
        imageBytes(part({ contentType: "application/pdf", body })).equals(body)
      ).toBe(true);
  });
});
