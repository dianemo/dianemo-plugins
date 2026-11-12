import { UpsLandedCostRequest } from "../src/requests/landedCost/types.js";
import { getLandedCostQuote } from "../src/requests/landedCost/index.js";
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

const body = { currencyCode: "GBP" } as UpsLandedCostRequest;

describe("ups landedCost", () => {
  it("posts the quote to the v1 landedcost path", async () => {
    const spy = setup();
    await getLandedCostQuote(CLIENT, body);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.landedCost.getLandedCostQuote");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/landedcost/v1/quotes");
    expect(config.data).toBe(body);
    expect(config.headers).toBeUndefined();
  });

  it("sends AccountNumber only when given", async () => {
    const spy = setup();
    await getLandedCostQuote(CLIENT, body, { accountNumber: "A1B2C3" });
    expect(spy.mock.calls[0][0].headers).toEqual({ AccountNumber: "A1B2C3" });
  });
});
