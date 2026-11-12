import * as labels from "../src/requests/internationalLabels/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import type {
  UspsInternationalLabelIndiciaRequest,
  UspsInternationalLabelRequest,
} from "../src/requests/internationalLabels/types.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const LABELS = "usps:_:main:labels";
const ACCOUNT = "1234567890";
const TRACKING = "EZ000012162US";
const KEY = "8be4df61-93ca-11d2-aa0d-00e098032b8c";
const VND = "application/vnd.usps.labels+json";

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

const label: UspsInternationalLabelRequest = {
  toAddress: {
    streetAddress: "1 Rue",
    city: "Paris",
    country: "France",
    countryISOAlpha2Code: "FR",
  },
  fromAddress: {
    streetAddress: "1 Main",
    city: "Boston",
    state: "MA",
    ZIPCode: "02110",
  },
  packageDescription: {
    weight: 1,
    length: 9,
    width: 6,
    height: 2,
    mailClass: "PRIORITY_MAIL_INTERNATIONAL",
    processingCategory: "MACHINABLE",
    destinationEntryFacilityType: "NONE",
    mailingDate: "2026-11-20",
  },
  customsForm: {
    AESITN: "NO EEI 30.37(a)",
    customsContentType: "GIFT",
    contents: [
      { countryofOrigin: "US", itemDescription: "Hat", itemQuantity: 1 },
    ],
  },
};
const indicia: UspsInternationalLabelIndiciaRequest = {
  indiciaDescription: {
    processingCategory: "LETTERS",
    weight: 1,
    mailingDate: "2026-11-20",
    length: 9,
    height: 4,
    thickness: 0.1,
    destinationCountryCode: "FR",
  },
};

describe("usps internationalLabels", () => {
  it("createInternationalLabel posts the body with a generated key and the account", async () => {
    const spy = setup();
    await labels.createInternationalLabel(CLIENT, label, {
      accountNumber: ACCOUNT,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.internationalLabels.createInternationalLabel",
      method: "POST",
      url: "/international-labels/v3/international-label",
      data: label,
      headers: { Accept: VND },
      metadata: { uspsAccountNumber: ACCOUNT },
    });
    expect(spy.mock.calls[0][0].headers?.["X-Idempotency-Key"]).toMatch(
      /^[0-9a-f-]{36}$/
    );
  });

  it("createInternationalLabel honours a caller-supplied key", async () => {
    const spy = setup();
    await labels.createInternationalLabel(CLIENT, label, {
      accountNumber: ACCOUNT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0].headers?.["X-Idempotency-Key"]).toBe(KEY);
  });

  it("cancelInternationalLabelByIdempotencyKey deletes with the key header and no body", async () => {
    const spy = setup();
    await labels.cancelInternationalLabelByIdempotencyKey(CLIENT, {
      accountNumber: ACCOUNT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName:
        "usps.internationalLabels.cancelInternationalLabelByIdempotencyKey",
      method: "DELETE",
      url: "/international-labels/v3/international-label",
      headers: { "X-Idempotency-Key": KEY },
      metadata: { uspsAccountNumber: ACCOUNT },
    });
    expect(spy.mock.calls[0][0].data).toBeUndefined();
  });

  it("reprintInternationalLabel posts to the tracking-number path", async () => {
    const spy = setup();
    await labels.reprintInternationalLabel(
      CLIENT,
      { accountNumber: ACCOUNT, trackingNumber: "EZ 1/2" },
      { imageInfo: { imageType: "PDF" } }
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.internationalLabels.reprintInternationalLabel",
      method: "POST",
      url: "/international-labels/v3/international-label-reprint/EZ%201%2F2",
      data: { imageInfo: { imageType: "PDF" } },
      headers: { Accept: VND },
      metadata: { uspsAccountNumber: ACCOUNT },
    });
  });

  it("reprintInternationalLabelByIdempotencyKey posts with the key header", async () => {
    const spy = setup();
    await labels.reprintInternationalLabelByIdempotencyKey(CLIENT, {
      accountNumber: ACCOUNT,
      idempotencyKey: KEY,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName:
        "usps.internationalLabels.reprintInternationalLabelByIdempotencyKey",
      method: "POST",
      url: "/international-labels/v3/international-label-reprint",
      data: {},
      headers: { "X-Idempotency-Key": KEY, Accept: VND },
      metadata: { uspsAccountNumber: ACCOUNT },
    });
  });

  it("cancelInternationalLabel deletes by tracking number", async () => {
    const spy = setup();
    await labels.cancelInternationalLabel(CLIENT, {
      accountNumber: ACCOUNT,
      trackingNumber: TRACKING,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.internationalLabels.cancelInternationalLabel",
      method: "DELETE",
      url: `/international-labels/v3/international-label/${TRACKING}`,
      metadata: { uspsAccountNumber: ACCOUNT },
    });
    expect(spy.mock.calls[0][0].data).toBeUndefined();
  });

  it("createInternationalIndicia posts the body to /indicia", async () => {
    const spy = setup();
    await labels.createInternationalIndicia(CLIENT, indicia, {
      accountNumber: ACCOUNT,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.internationalLabels.createInternationalIndicia",
      method: "POST",
      url: "/international-labels/v3/indicia",
      data: indicia,
      headers: { Accept: VND },
      metadata: { uspsAccountNumber: ACCOUNT },
    });
  });
});
