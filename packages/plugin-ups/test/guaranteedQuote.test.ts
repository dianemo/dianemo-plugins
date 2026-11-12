import { UpsGuaranteedQuoteRequest } from "../src/requests/guaranteedQuote/types.js";
import { createGuaranteedQuote } from "../src/requests/guaranteedQuote/index.js";
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

const body = { shipperCurrencyCode: "USD" } as UpsGuaranteedQuoteRequest;

describe("ups guaranteedQuote", () => {
  it("posts to the brokerage request-quote path", async () => {
    const spy = setup();
    await createGuaranteedQuote(CLIENT, body);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.guaranteedQuote.createGuaranteedQuote"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/brokerage/v1/content/glc/request-quote");
    expect(config.data).toBe(body);
    // The spec marks Accept required
    expect(config.headers).toEqual({ Accept: "application/json" });
  });

  it("sends registration-id only when given", async () => {
    const spy = setup();
    await createGuaranteedQuote(CLIENT, body, {
      registrationId: "643F7EAC-DC06-19E3-84C9-0274164A04E9",
    });
    expect(spy.mock.calls[0][0].headers).toEqual({
      Accept: "application/json",
      "registration-id": "643F7EAC-DC06-19E3-84C9-0274164A04E9",
    });
  });
});
