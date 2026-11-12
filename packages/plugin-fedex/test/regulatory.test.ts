import { getRegulatoryProfile } from "../src/requests/regulatory/index.js";
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

describe("fedex regulatory", () => {
  it("getRegulatoryProfile sends POST /regulatory/v1/profiles", async () => {
    const { spy } = setup();
    const data = [
      {
        regulationCode: "CPSC",
        productId: "SKU-1",
        productIdType: "SKU",
        countryOfImport: "US",
        details: [],
      },
    ];
    const result = await getRegulatoryProfile(
      "fedex:_:production",
      data as never
    );

    expect(result).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.regulatory.getRegulatoryProfile");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/regulatory/v1/profiles");
    expect(config.data).toBe(data);
    expect(Array.isArray(config.data)).toBe(true);
  });
});
