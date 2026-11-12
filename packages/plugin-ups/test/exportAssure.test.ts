import { UpsExportAssureRequest } from "../src/requests/exportAssure/types.js";
import { submitExportAssure } from "../src/requests/exportAssure/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

const CLIENT = "ups:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return spy;
};

afterEach(() => resetBinding());

const body = { transID: "t-1" } as UpsExportAssureRequest;

describe("ups exportAssure", () => {
  it("posts to the brokerage exportassure path", async () => {
    const spy = setup();
    await submitExportAssure(CLIENT, body);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.exportAssure.submitExportAssure");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/brokerage/v1/importexport/exportassure");
    expect(config.data).toBe(body);
    // The spec marks Accept required
    expect(config.headers).toEqual({ Accept: "application/json" });
  });

  it("sends the lower-camel accountNumber header only when given", async () => {
    const spy = setup();
    await submitExportAssure(CLIENT, body, { accountNumber: "985123" });
    expect(spy.mock.calls[0][0].headers).toEqual({
      Accept: "application/json",
      accountNumber: "985123",
    });
  });
});
