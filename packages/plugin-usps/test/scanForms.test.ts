import type { UspsScanFormRequest } from "../src/requests/scanForms/types.js";
import * as scanForms from "../src/requests/scanForms/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const data: UspsScanFormRequest = {
  mailingDate: "2026-11-13",
  entryFacilityZIPCode: "20260",
  destinationEntryFacilityType: "NONE",
  shipment: { MID: "123456" },
  fromAddress: {
    firm: "Acme",
    streetAddress: "1 Main St",
    city: "Memphis",
    state: "TN",
    ZIPCode: "38188",
  },
};

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { manifestNumber: "EFN1" } } as never);
  handler.use(usps);
  return spy;
};

describe("usps scanForms", () => {
  it("createScanForm asks for the single-body vendor response and sends no key by default", async () => {
    const spy = setup();
    const res = await scanForms.createScanForm(CLIENT, data);
    expect(res).toEqual({ manifestNumber: "EFN1" });
    const call = spy.mock.calls[0][0];
    expect(call).toMatchObject({
      clientName: "usps:_:main:labels",
      requestName: "usps.scanForms.createScanForm",
      method: "POST",
      url: "/scan-forms/v3/scan-form",
      data,
      headers: { Accept: "application/vnd.usps.labels+json" },
    });
    expect(call.headers).not.toHaveProperty("X-Idempotency-Key");
    expect(call.metadata).toBeUndefined();
  });

  it("createScanForm forwards a caller's idempotency key", async () => {
    const spy = setup();
    await scanForms.createScanForm(CLIENT, data, { idempotencyKey: "k-1" });
    expect(spy.mock.calls[0][0].headers).toMatchObject({
      "X-Idempotency-Key": "k-1",
    });
  });
});
