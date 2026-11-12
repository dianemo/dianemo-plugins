import * as pins from "../src/requests/protectedDeliveryToken/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

afterEach(() => resetBinding());

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

describe("ups protectedDeliveryToken", () => {
  it("generateProtectedDeliveryToken posts the PIN to /pins/token", async () => {
    const spy = setup();
    await pins.generateProtectedDeliveryToken(CLIENT, { pin: "123456" });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.protectedDeliveryToken.generateProtectedDeliveryToken",
      method: "POST",
      url: "/api/pin-mgmt-sys/v1/pins/token",
      data: { pin: "123456" },
    });
  });

  it("getProtectedDeliveryPinByToken sends the token as X-UserToken on a body-less GET", async () => {
    const spy = setup();
    await pins.getProtectedDeliveryPinByToken(CLIENT, {
      userToken: "6e01c1d5-3ee4-49ad-bc3a-b6b787670f71",
    });
    const config = spy.mock.calls[0][0];
    expect(config).toMatchObject({
      requestName: "ups.protectedDeliveryToken.getProtectedDeliveryPinByToken",
      method: "GET",
      url: "/api/pin-mgmt-sys/v1/pins/token",
      headers: { "X-UserToken": "6e01c1d5-3ee4-49ad-bc3a-b6b787670f71" },
    });
    expect(config.data).toBeUndefined();
  });

  it("getProtectedDeliveryPins posts the tracking numbers to /pins/retrieve", async () => {
    const spy = setup();
    const data = { trackingNumbers: ["1Z999AA10123456784"] };
    await pins.getProtectedDeliveryPins(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      requestName: "ups.protectedDeliveryToken.getProtectedDeliveryPins",
      method: "POST",
      url: "/api/pin-mgmt-sys/v1/pins/retrieve",
      data,
    });
  });

  it("getProtectedDeliveryEpraCode puts tracking number and Authorization in headers, action in the query", async () => {
    const spy = setup();
    await pins.getProtectedDeliveryEpraCode(CLIENT, {
      trackingNumber: "1Z999AA10123456784",
      authorization: "Bearer abc",
      action: "release",
      epra: "E1",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      requestName: "ups.protectedDeliveryToken.getProtectedDeliveryEpraCode",
      method: "GET",
      url: "/api/pin-mgmt-sys/v1/pins/epra?action=release",
      headers: {
        trackingNumber: "1Z999AA10123456784",
        Authorization: "Bearer abc",
        epra: "E1",
      },
    });
  });

  it("getProtectedDeliveryEpraCode omits the optional action and epra when unset", async () => {
    const spy = setup();
    await pins.getProtectedDeliveryEpraCode(CLIENT, {
      trackingNumber: "1Z999AA10123456784",
      authorization: "Bearer abc",
    });
    const config = spy.mock.calls[0][0];
    expect(config.url).toBe("/api/pin-mgmt-sys/v1/pins/epra");
    expect(config.headers).not.toHaveProperty("epra");
  });
});
