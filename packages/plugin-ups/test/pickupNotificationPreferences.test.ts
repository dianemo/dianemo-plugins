import * as family from "../src/requests/pickupNotificationPreferences/index.js";
import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";

const plugin = definePlugin({
  name: "ups",
  registerTemplate: async () => {},
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return family;
  },
});

async function run(call: (r: typeof family) => Promise<unknown>) {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { ups } = handler.use(plugin);
  expect(await call(ups)).toEqual({ ok: true });
  expect(spy).toHaveBeenCalledOnce();
  return spy.mock.calls[0][0];
}

describe("plugin-ups pickupNotificationPreferences family", () => {
  it("getPickupNotificationPreferences puts account_number in the query", async () => {
    const config = await run((r) =>
      r.getPickupNotificationPreferences(CLIENT, { accountNumber: "A1B2C3" })
    );
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.pickupNotificationPreferences.getPickupNotificationPreferences"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe(
      "/api/digital-experience/preferences/v1/account-pickup?account_number=A1B2C3"
    );
    expect(config.headers).toEqual({});
    expect(config.data).toBeUndefined();
  });

  it("sends UUID and id_token only when given", async () => {
    const config = await run((r) =>
      r.getPickupNotificationPreferences(CLIENT, {
        accountNumber: "A1B2C3",
        uuid: "u-1",
        idToken: "tok",
      })
    );
    expect(config.headers).toEqual({ UUID: "u-1", id_token: "tok" });
  });

  it("updatePickupNotificationPreferences puts the preference as the body", async () => {
    const body = { locale: "en_US", notificationIndicators: {} } as never;
    const config = await run((r) =>
      r.updatePickupNotificationPreferences(
        CLIENT,
        { accountNumber: "A1B2C3" },
        body
      )
    );
    expect(config.requestName).toBe(
      "ups.pickupNotificationPreferences.updatePickupNotificationPreferences"
    );
    expect(config.method).toBe("PUT");
    expect(config.url).toBe(
      "/api/digital-experience/preferences/v1/account-pickup?account_number=A1B2C3"
    );
    expect(config.data).toBe(body);
  });
});
