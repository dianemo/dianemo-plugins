import type { FedExHarmonizedCodeSearchRequest } from "../src/requests/harmonizedCode/types.js";
import { searchHarmonizedCodes } from "../src/requests/harmonizedCode/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  // Composing binds the plugin-kit singleton the request functions call through.
  handler.use(fedex);
  return { spy };
};

describe("fedex harmonizedCode", () => {
  it("searchHarmonizedCodes sends POST /commodity/v2/hscodes/search", async () => {
    const { spy } = setup();
    const data = { hsClassify: [] };
    const result = await searchHarmonizedCodes(
      "fedex:_:production",
      data as never
    );

    expect(result).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe(
      "fedex.harmonizedCode.searchHarmonizedCodes"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/commodity/v2/hscodes/search");
    expect(config.data).toBe(data);
    expect(config.headers).toEqual({ "x-content-type": "application/json" });
  });
});

describe("fedex harmonizedCode country fields", () => {
  it("accepts the spec's two minimum samples and rejects neither country", async () => {
    const { spy } = setup();
    const destinationOnly: FedExHarmonizedCodeSearchRequest = {
      hsClassify: [
        {
          commodityDescription: "Sports footwear",
          destinationCountryCodes: ["US"],
        },
      ],
    };
    const originOnly: FedExHarmonizedCodeSearchRequest = {
      hsClassify: [
        { commodityDescription: "Sports footwear", originCountryCode: "IN" },
      ],
    };
    const neither: FedExHarmonizedCodeSearchRequest = {
      // @ts-expect-error at least one country field is required
      hsClassify: [{ commodityDescription: "Sports footwear" }],
    };
    await searchHarmonizedCodes("fedex:_:production", destinationOnly);
    await searchHarmonizedCodes("fedex:_:production", originOnly);
    expect(spy.mock.calls[0][0].data).toBe(destinationOnly);
    expect(spy.mock.calls[1][0].data).toBe(originOnly);
    expect(neither).toBeDefined();
  });
});
