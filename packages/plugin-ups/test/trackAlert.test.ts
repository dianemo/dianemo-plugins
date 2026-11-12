import { createTrackAlertSubscription } from "../src/requests/trackAlert/index.js";
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

describe("ups trackAlert", () => {
  it("posts a standard subscription to the v2 standard path", async () => {
    const spy = setup();
    const request = {
      locale: "en_US",
      trackingNumberList: ["1ZCIETST0111111114"],
    };
    await createTrackAlertSubscription(CLIENT, { type: "standard", request });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.trackAlert.createTrackAlertSubscription"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/track/v2/subscription/standard/package");
    expect(config.data).toBe(request);
  });

  it("uses the same endpoint with the enhanced segment and event preferences", async () => {
    const spy = setup();
    const request = {
      locale: "en_US",
      countryCode: "US",
      trackingNumberList: ["1ZCIETST0111111114"],
      eventPreferences: ["D", "I"] as ("D" | "I")[],
    };
    await createTrackAlertSubscription(CLIENT, { type: "enhanced", request });
    const config = spy.mock.calls[0][0];
    expect(config.url).toBe("/api/track/v2/subscription/enhanced/package");
    expect(config.data).toBe(request);
  });
});
