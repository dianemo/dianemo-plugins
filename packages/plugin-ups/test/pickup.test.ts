import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import * as pickup from "../src/requests/pickup/index.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";

// The family is wired into the plugin entry by the lead; binding it on its own
// keeps this test independent of that.
const plugin = definePlugin({
  name: "ups",
  registerTemplate: async () => {},
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return pickup;
  },
});

async function run(call: (r: typeof pickup) => Promise<unknown>) {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { ups } = handler.use(plugin);
  const result = await call(ups);
  expect(result).toEqual({ ok: true });
  expect(spy).toHaveBeenCalledOnce();
  return spy.mock.calls[0][0];
}

describe("plugin-ups pickup family", () => {
  it("createPickup posts the creation body", async () => {
    const body = { PickupCreationRequest: {} } as never;
    const config = await run((r) => r.createPickup(CLIENT, body));
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.pickup.create");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/pickupcreation/v2409/pickup");
    expect(config.data).toBe(body);
  });

  it("createPickup accepts the Smart Pickup trigger body on the same URL", async () => {
    const body = { PickupTriggerGWNRequest: {} } as never;
    const config = await run((r) => r.createPickup(CLIENT, body));
    expect(config.url).toBe("/api/pickupcreation/v2409/pickup");
    expect(config.data).toBe(body);
  });

  it("cancelPickup deletes by PRN (CancelBy 02) with a Prn header", async () => {
    const config = await run((r) => r.cancelPickup(CLIENT, "2929AA12B3C"));
    expect(config.requestName).toBe("ups.pickup.cancel");
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe("/api/shipments/v2409/pickup/02");
    expect(config.headers).toEqual({ Prn: "2929AA12B3C" });
    expect(config.data).toBeUndefined();
  });

  it("cancelPickupByAccountNumber deletes with CancelBy 01 and no Prn", async () => {
    const config = await run((r) => r.cancelPickupByAccountNumber(CLIENT));
    expect(config.requestName).toBe("ups.pickup.cancelByAccountNumber");
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe("/api/shipments/v2409/pickup/01");
    expect(config.headers).toBeUndefined();
  });

  it("getPickupRate posts to pickuptype, defaulting to oncall", async () => {
    const body = { PickupRateRequest: {} } as never;
    const config = await run((r) => r.getPickupRate(CLIENT, body));
    expect(config.requestName).toBe("ups.pickup.getRate");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/shipments/v2409/pickup/oncall");
    expect(config.data).toBe(body);
  });

  it("getPickupRate honours an explicit pickuptype", async () => {
    const body = { PickupRateRequest: {} } as never;
    const config = await run((r) => r.getPickupRate(CLIENT, body, "both"));
    expect(config.url).toBe("/api/shipments/v2409/pickup/both");
  });

  it("getPickupPendingStatus gets by pickuptype with an AccountNumber header", async () => {
    const config = await run((r) =>
      r.getPickupPendingStatus(CLIENT, {
        accountNumber: "A1B2C3",
        pickupType: "smart",
      })
    );
    expect(config.requestName).toBe("ups.pickup.getPendingStatus");
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/api/shipments/v2409/pickup/smart");
    expect(config.headers).toEqual({ AccountNumber: "A1B2C3" });
  });

  it("getPickupPoliticalDivisions gets the country's list", async () => {
    const config = await run((r) =>
      r.getPickupPoliticalDivisions(CLIENT, { countryCode: "US" })
    );
    expect(config.requestName).toBe("ups.pickup.getPoliticalDivisions");
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/api/pickup/v2409/countries/US");
  });

  it("getPickupServiceCenterFacilities posts the search body", async () => {
    const body = { PickupGetServiceCenterFacilitiesRequest: {} } as never;
    const config = await run((r) =>
      r.getPickupServiceCenterFacilities(CLIENT, body)
    );
    expect(config.requestName).toBe("ups.pickup.getServiceCenterFacilities");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/pickup/v2409/servicecenterlocations");
    expect(config.data).toBe(body);
  });
});
