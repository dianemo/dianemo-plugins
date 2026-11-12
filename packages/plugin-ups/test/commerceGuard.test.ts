import { UpsCommerceGuardChargebackVerifyRequestV1 } from "../src/requests/commerceGuard/types.js";
import { verifyCommerceGuardChargebackRisk } from "../src/requests/commerceGuard/index.js";
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

const body = { orderId: "o-1" } as UpsCommerceGuardChargebackVerifyRequestV1;

describe("ups commerceGuard", () => {
  it("posts to the commerce-guard verify path with partnerId", async () => {
    const spy = setup();
    await verifyCommerceGuardChargebackRisk(
      CLIENT,
      { partnerId: "PARTNER_001" },
      body
    );
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.commerceGuard.verifyCommerceGuardChargebackRisk"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/commerce-guard/v1/verify");
    expect(config.headers).toEqual({ partnerId: "PARTNER_001" });
    expect(config.data).toBe(body);
  });

  it("adds transSrc when given", async () => {
    const spy = setup();
    await verifyCommerceGuardChargebackRisk(
      CLIENT,
      { partnerId: "P", transSrc: "webstore" },
      body
    );
    expect(spy.mock.calls[0][0].headers).toEqual({
      partnerId: "P",
      transSrc: "webstore",
    });
  });
});
