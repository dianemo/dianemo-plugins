import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";

afterEach(() => resetBinding());

describe("fedex purchaser family", () => {
  it("makeFedexPurchaseRequest POSTs the body to /ship/v1/shipments", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    const { fedex: requests } = handler.use(fedex);
    const data = {
      accountNumber: { value: "123456789" },
      labelResponseOptions: "URL_ONLY",
      requestedShipment: {},
    } as never;
    await requests.makeFedexPurchaseRequest("fedex:_:production", data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.shipping.createShipment");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/ship/v1/shipments");
    expect(config.data).toBe(data);
  });
});
