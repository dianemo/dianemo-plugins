import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import * as qr from "../src/requests/qrCode/index.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

describe("usps qrCode", () => {
  it("searchUspsQrCode posts the tracking number and ZIP on the default group", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const body = {
      trackingNumber: "9400",
      ZIPCode: "20260123456",
      alert: "none",
    };
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: body } as never);
    handler.use(usps);

    const data = { trackingNumber: "9400", ZIPCode: "20260123456" };
    const res = await qr.searchUspsQrCode("usps:_:main", data);
    expect(res).toEqual(body);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.qrCode.searchUspsQrCode",
      method: "POST",
      url: "/qr-code/v3/search",
      data,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });
});
