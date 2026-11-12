import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as family from "../src/requests/pickupPoints/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";
const BASE = "/api/uppmanage/v1";

const plugin = definePlugin({
  name: "ups",
  registerTemplate: async () => {},
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return family;
  },
});

const session = { clientId: "xolt-ipc", locale: "en_US" };
const user = { cookie: "session_ups_com=abc", username: "test.user" };
const range = { startDate: "20260401", endDate: "20260420" };

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

describe("plugin-ups pickupPoints family", () => {
  it("confirmPickupPointsOrder posts the order with session headers", async () => {
    const body = { locationIdentifier: "1" } as never;
    const config = await run((r) =>
      r.confirmPickupPointsOrder(CLIENT, { ...session, sessionId: "s-1" }, body)
    );
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.pickupPoints.confirmPickupPointsOrder"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`${BASE}/orders`);
    expect(config.headers).toEqual({
      clientId: "xolt-ipc",
      locale: "en_US",
      sessionid: "s-1",
    });
    expect(config.data).toBe(body);
  });

  it("getPickupPointsInboundTrackingNumbers posts the tracking request", async () => {
    const body = { locationIdentifier: "1" } as never;
    const config = await run((r) =>
      r.getPickupPointsInboundTrackingNumbers(CLIENT, session, body)
    );
    expect(config.requestName).toBe(
      "ups.pickupPoints.getPickupPointsInboundTrackingNumbers"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`${BASE}/locations/inbound/tracking-numbers`);
    expect(config.headers).toEqual({ clientId: "xolt-ipc", locale: "en_US" });
    expect(config.data).toBe(body);
  });

  it("updatePickupPointsSiteDetails posts to the date range with paging in the query", async () => {
    const body = { inboundToken: ["t"] } as never;
    const config = await run((r) =>
      r.updatePickupPointsSiteDetails(
        CLIENT,
        {
          ...session,
          ...user,
          ...range,
          limit: "10",
          sort: "+locationidentifier",
        },
        body
      )
    );
    expect(config.requestName).toBe(
      "ups.pickupPoints.updatePickupPointsSiteDetails"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(
      `${BASE}/sites/20260401/20260420?limit=10&sort=%2Blocationidentifier`
    );
    expect(config.headers).toEqual({
      clientId: "xolt-ipc",
      locale: "en_US",
      Cookie: "session_ups_com=abc",
      Username: "test.user",
    });
    expect(config.data).toBe(body);
  });

  it("getPickupPointsSiteDetails gets the range with every filter in the query", async () => {
    const config = await run((r) =>
      r.getPickupPointsSiteDetails(CLIENT, {
        ...session,
        ...user,
        ...range,
        uuid: "u-1",
        offset: "0",
        locationIdentifier: "123",
        locationIdentifierCategoryCode: "01",
        city: "Atlanta",
        state: "GA",
        country: "US",
      })
    );
    expect(config.requestName).toBe(
      "ups.pickupPoints.getPickupPointsSiteDetails"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe(
      `${BASE}/sites/20260401/20260420?offset=0&location_identifier=123&location_id_category_code=01&city=Atlanta&state=GA&country=US`
    );
    expect(config.headers).toMatchObject({
      "Content-Type": "application/json",
      UUID: "u-1",
      Username: "test.user",
    });
    expect(config.data).toBeUndefined();
  });

  it("getPickupPointsSiteDetails adds no query string when no filter is given", async () => {
    const config = await run((r) =>
      r.getPickupPointsSiteDetails(CLIENT, { ...session, ...user, ...range })
    );
    expect(config.url).toBe(`${BASE}/sites/20260401/20260420`);
  });

  it("getPickupPointsSubscriptions gets /subscriptions/sites", async () => {
    const config = await run((r) =>
      r.getPickupPointsSubscriptions(CLIENT, { ...session, ...user })
    );
    expect(config.requestName).toBe(
      "ups.pickupPoints.getPickupPointsSubscriptions"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe(`${BASE}/subscriptions/sites`);
  });
});
