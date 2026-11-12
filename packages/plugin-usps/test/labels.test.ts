import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import * as labels from "../src/requests/labels/index.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import type {
  UspsCreateLabelRequest,
  UspsLabelCreateReturnRequest,
  UspsLabelEditOperation,
  UspsLabelIndiciaImbRequest,
  UspsLabelIndiciaRequest,
} from "../src/requests/labels/types.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = `${CLIENT}:labels`;
const ACCT = "1000123456";
const KEY = "8be4df61-93ca-11d2-aa0d-00e098032b8c";
const VENDOR = { Accept: "application/vnd.usps.labels+json" };

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(usps);
  return spy;
};

const address = {
  streetAddress: "1 Main St",
  city: "Reston",
  state: "VA",
  ZIPCode: "20190",
};
const labelBody: UspsCreateLabelRequest = {
  toAddress: address,
  fromAddress: address,
  packageDescription: {
    mailClass: "USPS_GROUND_ADVANTAGE",
    processingCategory: "MACHINABLE",
    rateIndicator: "SP",
    destinationEntryFacilityType: "NONE",
    weight: 1,
    length: 5,
    width: 4,
    height: 3,
    mailingDate: "2026-11-12",
  },
};
const returnBody: UspsLabelCreateReturnRequest = {
  toAddress: address,
  fromAddress: address,
  packageDescription: {
    mailClass: "USPS_GROUND_ADVANTAGE_RETURN_SERVICE",
    processingCategory: "MACHINABLE",
    rateIndicator: "SP",
    weight: 1,
    length: 5,
    width: 4,
    height: 3,
  },
};

describe("usps labels", () => {
  it("createLabel keeps its wire shape", async () => {
    const spy = setup();
    await labels.createLabel(CLIENT, labelBody, ACCT, KEY);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.create",
      method: "POST",
      url: "/labels/v3/label",
      data: labelBody,
      headers: { "X-Idempotency-Key": KEY, ...VENDOR },
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("createLabel and createReturnLabel default the idempotency key to a UUID", async () => {
    const spy = setup();
    await labels.createLabel(CLIENT, labelBody, ACCT);
    await labels.createReturnLabel(CLIENT, returnBody, { accountNumber: ACCT });
    const uuid = /^[0-9a-f-]{36}$/;
    expect(spy.mock.calls[0][0].headers?.["X-Idempotency-Key"]).toMatch(uuid);
    expect(spy.mock.calls[1][0].headers?.["X-Idempotency-Key"]).toMatch(uuid);
  });

  it("voidLabel and reprintLabel encode the tracking number", async () => {
    const spy = setup();
    await labels.voidLabel(CLIENT, "9400 1/2", ACCT);
    await labels.reprintLabel(CLIENT, "9400 1/2", ACCT);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.void",
      method: "DELETE",
      url: "/labels/v3/label/9400%201%2F2",
      metadata: { uspsAccountNumber: ACCT },
    });
    expect(spy.mock.calls[1][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.reprint",
      method: "POST",
      url: "/labels/v3/label-reprint/9400%201%2F2",
      data: {},
      headers: VENDOR,
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("cancelLabelByIdempotencyKey sends the key as a header with no body", async () => {
    const spy = setup();
    await labels.cancelLabelByIdempotencyKey(CLIENT, {
      accountNumber: ACCT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.cancelLabelByIdempotencyKey",
      method: "DELETE",
      url: "/labels/v3/label",
      headers: { "X-Idempotency-Key": KEY },
      metadata: { uspsAccountNumber: ACCT },
    });
    expect(spy.mock.calls[0][0].data).toBeUndefined();
  });

  it("createReturnLabel posts to /return-label", async () => {
    const spy = setup();
    await labels.createReturnLabel(CLIENT, returnBody, {
      accountNumber: ACCT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.createReturnLabel",
      method: "POST",
      url: "/labels/v3/return-label",
      data: returnBody,
      headers: { "X-Idempotency-Key": KEY, ...VENDOR },
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("editLabel sends the patch array as the body", async () => {
    const spy = setup();
    const ops: UspsLabelEditOperation[] = [
      { op: "replace", path: "/packageDescription/weight", value: 2 },
    ];
    await labels.editLabel(
      CLIENT,
      { accountNumber: ACCT, trackingNumber: "9400111" },
      ops
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.editLabel",
      method: "PATCH",
      url: "/labels/v3/label/9400111",
      data: ops,
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("reprintLabelByIdempotencyKey sends the key and an empty body by default", async () => {
    const spy = setup();
    await labels.reprintLabelByIdempotencyKey(CLIENT, {
      accountNumber: ACCT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.reprintLabelByIdempotencyKey",
      method: "POST",
      url: "/labels/v3/label-reprint",
      data: {},
      headers: { "X-Idempotency-Key": KEY, ...VENDOR },
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("indicia operations post to their own paths", async () => {
    const spy = setup();
    const indicia: UspsLabelIndiciaRequest = {
      indiciaDescription: {
        processingCategory: "LETTERS",
        weight: 1,
        mailingDate: "2026-11-12",
        length: 9,
        height: 4,
        thickness: 0.1,
      },
    };
    const imb: UspsLabelIndiciaImbRequest = {
      indiciaDescription: indicia.indiciaDescription,
      toAddress: address,
      returnAddress: address,
    };
    spy
      .mockResolvedValueOnce({
        data: Buffer.from(JSON.stringify({ indiciaMetadata: { SKU: "S" } })),
        headers: { "content-type": "application/json" },
      } as never)
      .mockResolvedValueOnce({
        data: Buffer.from(JSON.stringify({ indiciaMetadata: { imb: "1" } })),
        headers: { "content-type": "application/json" },
      } as never);
    const created = await labels.createLabelIndicia(CLIENT, indicia, {
      accountNumber: ACCT,
    });
    expect(created).toEqual({ indiciaMetadata: { SKU: "S" } });
    await labels.createLabelIndiciaImb(CLIENT, imb, { accountNumber: ACCT });
    await labels.cancelLabelIndiciaImb(CLIENT, {
      accountNumber: ACCT,
      imb: "00700123456000000001200669998",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.createLabelIndicia",
      method: "POST",
      url: "/labels/v3/indicia",
      data: indicia,
      responseType: "arraybuffer",
      metadata: { uspsAccountNumber: ACCT },
    });
    expect(spy.mock.calls[1][0]).toMatchObject({
      requestName: "usps.labels.createLabelIndiciaImb",
      method: "POST",
      url: "/labels/v3/indicia/imb",
      data: imb,
      responseType: "arraybuffer",
      metadata: { uspsAccountNumber: ACCT },
    });
    expect(spy.mock.calls[2][0]).toMatchObject({
      requestName: "usps.labels.cancelLabelIndiciaImb",
      method: "DELETE",
      url: "/labels/v3/indicia/imb/00700123456000000001200669998",
      metadata: { uspsAccountNumber: ACCT },
    });
  });

  it("createLabelIndicia folds USPS's multipart example into the nested shape", async () => {
    const spy = setup();
    const pdf = Buffer.from(
      "%PDF-1.4\r\n\u00e2\u00e3\u0000\u00ff trailer",
      "latin1"
    );
    const b = "Ah2SYTymfbGnSStJLSpLScnK";
    // The README example: no Content-Type on the response we can rely on, a flat
    // metadata part, then two PDF parts.
    const body = Buffer.concat([
      Buffer.from(
        `--${b}\r\nContent-Type: application/json\r\n` +
          `Content-Disposition: form-data; name="indiciaMetadata"\r\n\r\n` +
          `{"SKU":"DFLL0XXXXR00035","postage":1.36,"fees":[{"name":"Nonmachinable letter fee","SKU":"N/A","price":0.4}],"weight":3.5}\r\n` +
          `--${b}\r\nContent-Type: application/pdf\r\n` +
          `Content-Disposition: form-data; filename="receiptImage.pdf"; name="receiptImage"\r\n\r\n`
      ),
      pdf,
      Buffer.from(
        `\r\n--${b}\r\nContent-Type: application/pdf\r\n` +
          `Content-Disposition: form-data; filename="indiciaImage.pdf"; name="indiciaImage"\r\n\r\n`
      ),
      Buffer.from(pdf.toString("base64")),
      Buffer.from(`\r\n--${b}--\r\n`),
    ]);
    spy.mockResolvedValueOnce({ data: body, headers: {} } as never);
    const res = await labels.createLabelIndicia(
      CLIENT,
      {
        indiciaDescription: {
          processingCategory: "LETTERS",
          weight: 3.5,
          mailingDate: "2024-07-11",
          length: 6,
          height: 4,
          thickness: 0.25,
        },
        imageInfo: { imageType: "PDF", receiptOption: "SEPARATE_PAGE" },
      },
      { accountNumber: ACCT }
    );
    expect(res.indiciaMetadata).toMatchObject({
      SKU: "DFLL0XXXXR00035",
      postage: 1.36,
      weight: 3.5,
    });
    // A raw binary part and a base64 text part both end up as base64 strings.
    expect(res.receiptImage).toBe(pdf.toString("base64"));
    expect(res.indiciaImage).toBe(pdf.toString("base64"));
  });

  it("createLabelIndicia throws USP_0095 for a body it cannot read", async () => {
    const spy = setup();
    spy.mockResolvedValueOnce({
      data: Buffer.from("<html>"),
      headers: {},
    } as never);
    await expect(
      labels.createLabelIndicia(
        CLIENT,
        {
          indiciaDescription: {
            processingCategory: "LETTERS",
            weight: 1,
            mailingDate: "2026-11-12",
            length: 9,
            height: 4,
            thickness: 0.1,
          },
        },
        { accountNumber: ACCT }
      )
    ).rejects.toMatchObject({ code: "USP_0095" });
  });

  it("branding operations use the JSON upload and drop unset list params", async () => {
    const spy = setup();
    const upload = { imageName: "Logo", imageData: "PHN2Zz4=" };
    await labels.uploadLabelBranding(CLIENT, upload, { accountNumber: ACCT });
    await labels.listLabelBranding(
      CLIENT,
      { accountNumber: ACCT },
      { limit: 5, orderBy: "asc", offset: undefined }
    );
    await labels.getLabelBranding(CLIENT, {
      accountNumber: ACCT,
      imageUUID: "u/1",
    });
    await labels.deleteLabelBranding(CLIENT, {
      accountNumber: ACCT,
      imageUUID: "u1",
    });
    await labels.renameLabelBranding(CLIENT, {
      accountNumber: ACCT,
      imageUUID: "u1",
      imageName: "New",
    });
    const calls = spy.mock.calls.map((c) => c[0]);
    expect(calls[0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.labels.uploadLabelBranding",
      method: "POST",
      url: "/labels/v3/branding",
      data: upload,
      metadata: { uspsAccountNumber: ACCT },
    });
    expect(calls[1]).toMatchObject({
      requestName: "usps.labels.listLabelBranding",
      method: "GET",
      url: "/labels/v3/branding",
      params: { limit: 5, orderBy: "asc" },
    });
    expect(calls[1].params).not.toHaveProperty("offset");
    expect(calls[2]).toMatchObject({
      requestName: "usps.labels.getLabelBranding",
      method: "GET",
      url: "/labels/v3/branding/u%2F1",
    });
    expect(calls[3]).toMatchObject({
      requestName: "usps.labels.deleteLabelBranding",
      method: "DELETE",
      url: "/labels/v3/branding/u1",
    });
    expect(calls[4]).toMatchObject({
      requestName: "usps.labels.renameLabelBranding",
      method: "PATCH",
      url: "/labels/v3/branding/u1",
      data: [{ op: "replace", path: "/imageName", value: "New" }],
    });
    for (const c of calls) {
      expect(c.clientName).toBe(GROUP);
      expect(c.metadata).toMatchObject({ uspsAccountNumber: ACCT });
    }
  });
});
