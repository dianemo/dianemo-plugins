import type { UspsContainerCreateRequest } from "../src/requests/containers/types.js";
import { parseContainerLabelResponse } from "../src/requests/containers/utils.js";
import * as containers from "../src/requests/containers/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const LABELS = "usps:_:main:labels";

const BOUNDARY = "XkxytuhvSSXDz-aV1q2YverB";
const METADATA = {
  containerID: "99M900066875EMA000052",
  sortType: "SACK",
  mailClass: "PARCEL_SELECT",
  warnings: [],
  MID: "XXXXXXXXX",
};

/** Every byte value, with CRLF and the boundary text inside, as a worst case. */
const BINARY_IMAGE = Buffer.concat([
  Buffer.from("%PDF-1.4\r\n"),
  Buffer.from(Array.from({ length: 256 }, (_, i) => i)),
  Buffer.from(`\r\n--${BOUNDARY.slice(0, 8)}\r\n--x\n`),
  Buffer.from([0xff, 0xd8, 0x00, 0x0d, 0x0a]),
]);

const multipart = (
  image: Buffer | undefined,
  { eol = "\r\n", imageHeaders = "" } = {}
) =>
  Buffer.concat([
    Buffer.from(
      `--${BOUNDARY}${eol}Content-Type: application/json${eol}` +
        `Content-Disposition: form-data; name="containerMetadata"${eol}${eol}` +
        `${JSON.stringify(METADATA)}${eol}`
    ),
    ...(image
      ? [
          Buffer.from(
            `--${BOUNDARY}${eol}Content-Type: application/pdf${eol}` +
              `Content-Disposition: form-data; filename="labelImage.pdf"; name="labelImage"${eol}` +
              `${imageHeaders}${eol}`
          ),
          image,
          Buffer.from(eol),
        ]
      : []),
    Buffer.from(`--${BOUNDARY}--${eol}`),
  ]);

const setup = (
  response: { data: unknown; headers?: Record<string, string> } = {
    data: { containerID: "99M1" },
  }
) => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue(response as never);
  handler.use(usps);
  return spy;
};

describe("usps containers", () => {
  it("addUspsContainerPackages posts the packages to the container", async () => {
    const spy = setup();
    const data = { trackingNumbers: ["9400"], allowManifestedLabels: false };
    const res = await containers.addUspsContainerPackages(
      CLIENT,
      { containerId: "99M/1" },
      data
    );
    expect(res).toEqual({ containerID: "99M1" });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.addUspsContainerPackages",
      method: "POST",
      url: "/containers/v3/containers/99M%2F1/packages",
      data,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });

  it("removeAllUspsContainerPackages deletes every package", async () => {
    const spy = setup();
    await containers.removeAllUspsContainerPackages(CLIENT, {
      containerId: "C1",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.removeAllUspsContainerPackages",
      method: "DELETE",
      url: "/containers/v3/containers/C1/packages",
    });
  });

  it("removeUspsContainerPackage deletes one package by tracking number", async () => {
    const spy = setup();
    await containers.removeUspsContainerPackage(CLIENT, {
      containerId: "C1",
      trackingNumber: "9400",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.removeUspsContainerPackage",
      method: "DELETE",
      url: "/containers/v3/containers/C1/packages/9400",
    });
  });

  it("createUspsContainerLabel posts the container and requests bytes", async () => {
    const spy = setup({
      data: multipart(BINARY_IMAGE),
      headers: { "content-type": `multipart/form-data; boundary=${BOUNDARY}` },
    });
    const data: UspsContainerCreateRequest = {
      MID: "123456",
      mailerName: "Acme",
      mailClass: "PARCEL_SELECT",
      sortType: "PALLET",
      processingCategory: "MACHINABLE",
      destinationEntryFacilityType: "DESTINATION_DELIVERY_UNIT",
      destinationZIPCode: "20260",
      originAddress: {
        streetAddress: "1 Main St",
        city: "Memphis",
        state: "TN",
        ZIPCode: "38188",
      },
    };
    const res = await containers.createUspsContainerLabel(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.createUspsContainerLabel",
      method: "POST",
      url: "/containers/v3/containers",
      data,
      headers: { Accept: "multipart/form-data" },
      responseType: "arraybuffer",
    });
    expect(res.metadata).toEqual(METADATA);
    expect(res.labelImage?.contentType).toBe("application/pdf");
    expect(res.labelImage?.filename).toBe("labelImage.pdf");
    expect(res.labelImage?.bytes.equals(BINARY_IMAGE)).toBe(true);
  });

  it("parseContainerLabelResponse keeps a binary part intact with LF line ends and no header", () => {
    const res = parseContainerLabelResponse(
      multipart(BINARY_IMAGE, { eol: "\n" }),
      undefined
    );
    expect(res.metadata).toEqual(METADATA);
    expect(res.labelImage?.bytes.equals(BINARY_IMAGE)).toBe(true);
  });

  it("parseContainerLabelResponse decodes a base64 image part, as USPS's example shows", () => {
    const pdf = Buffer.from("%PDF-1.4\n%\u00e2\u00e3 trailer\n", "latin1");
    // A stray space mid-string, as in the README's own example.
    const base64 = pdf
      .toString("base64")
      .replace(/(.{40})/g, "$1\r\n")
      .replace(/^(.{10})/, "$1 ");
    const res = parseContainerLabelResponse(
      multipart(Buffer.from(base64)),
      `multipart/form-data; boundary="${BOUNDARY}"`
    );
    expect(res.labelImage?.bytes.equals(pdf)).toBe(true);
    const declared = parseContainerLabelResponse(
      multipart(Buffer.from(pdf.toString("base64")), {
        imageHeaders: `Content-Transfer-Encoding: base64\r\n`,
      }),
      undefined
    );
    expect(declared.labelImage?.bytes.equals(pdf)).toBe(true);
  });

  it("parseContainerLabelResponse accepts a string or ArrayBuffer body and a metadata-only body", () => {
    const body = multipart(Buffer.from("%PDF-1.4 plain"));
    const fromString = parseContainerLabelResponse(
      body.toString("latin1"),
      undefined
    );
    expect(fromString.labelImage?.bytes.toString()).toBe("%PDF-1.4 plain");
    const fromArrayBuffer = parseContainerLabelResponse(
      body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
      undefined
    );
    expect(fromArrayBuffer.metadata).toEqual(METADATA);
    const metadataOnly = parseContainerLabelResponse(
      multipart(undefined),
      undefined,
      false
    );
    expect(metadataOnly).toEqual({ metadata: METADATA });
    const json = parseContainerLabelResponse(
      Buffer.from(JSON.stringify(METADATA)),
      "application/json"
    );
    expect(json).toEqual({ metadata: METADATA });
  });

  it("parseContainerLabelResponse throws USP_0094 when the body is unreadable", () => {
    const missingMetadata = Buffer.from(
      `--${BOUNDARY}\r\nContent-Disposition: form-data; name="other"\r\n\r\nx\r\n--${BOUNDARY}--\r\n`
    );
    for (const body of [missingMetadata, Buffer.from("not json"), 42]) {
      expect(() => parseContainerLabelResponse(body, undefined)).toThrow(
        expect.objectContaining({ code: "USP_0094" })
      );
    }
  });

  it("parseContainerLabelResponse throws USP_0159 for multipart with no image part", () => {
    expect(() =>
      parseContainerLabelResponse(multipart(undefined), undefined)
    ).toThrow(expect.objectContaining({ code: "USP_0159" }));
  });

  it("parseContainerLabelResponse finds an image part with no name, and metadata by JSON type", () => {
    const body = Buffer.concat([
      Buffer.from(
        `--${BOUNDARY}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(METADATA)}\r\n` +
          `--${BOUNDARY}\r\nContent-Disposition: attachment; filename="label-image.jpg"\r\n\r\n`
      ),
      BINARY_IMAGE,
      Buffer.from(`\r\n--${BOUNDARY}--\r\n`),
    ]);
    const res = parseContainerLabelResponse(body, undefined);
    expect(res.metadata).toEqual(METADATA);
    expect(res.labelImage?.filename).toBe("label-image.jpg");
    expect(res.labelImage?.bytes.equals(BINARY_IMAGE)).toBe(true);
  });

  it("closeUspsContainerManifest posts the container ids", async () => {
    const spy = setup();
    await containers.closeUspsContainerManifest(CLIENT, {
      containers: ["C1", "C2"],
      mailingDate: "2026-11-13",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.closeUspsContainerManifest",
      method: "POST",
      url: "/containers/v3/containers/manifest",
      data: { containers: ["C1", "C2"], mailingDate: "2026-11-13" },
    });
  });
});
