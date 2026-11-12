import { getDeliveryDefenseAddressScore } from "../src/requests/deliveryDefense/index.js";
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

describe("ups deliveryDefense", () => {
  it("posts the address to the score path under the v1.0 server prefix", async () => {
    const spy = setup();
    const data = {
      street: "1173 CLARENDON DR",
      city: "MARIETTA",
      state: "GA",
      zipCode: "30068",
    };
    await getDeliveryDefenseAddressScore(CLIENT, data);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.deliveryDefense.getDeliveryDefenseAddressScore"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/deliverydefense/external/v1.0/address/score");
    expect(config.data).toBe(data);
  });
});
