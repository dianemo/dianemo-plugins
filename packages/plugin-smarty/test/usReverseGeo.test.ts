import { reverseGeocodeSmartyUs } from "../src/requests/usReverseGeo/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";

afterEach(() => resetBinding());

describe("usReverseGeo", () => {
  it("sends coordinates as query params to /lookup", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { results: [] } } as never);
    handler.use(smarty);

    await reverseGeocodeSmartyUs("smarty:_:production", {
      latitude: 40.202583,
      longitude: -111.62196,
      source: "all",
    });

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:usReverseGeo");
    expect(config.requestName).toBe(
      "smarty.usReverseGeo.reverseGeocodeSmartyUs"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/lookup");
    expect(config.params).toEqual({
      latitude: "40.202583",
      longitude: "-111.62196",
      source: "all",
    });
    expect(config.data).toBeUndefined();
  });
});
