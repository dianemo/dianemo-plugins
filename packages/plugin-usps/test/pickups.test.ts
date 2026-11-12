import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as pickups from "../src/requests/pickups/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import type {
  UspsPickupConfirmation,
  UspsPickupEligibilityParams,
  UspsSchedulePickupRequest,
} from "../src/requests/pickups/types.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = "usps:_:main:default";

const setup = (headers?: Record<string, string>) => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true }, headers } as never);
  handler.use(usps);
  return spy;
};

const pickup: UspsSchedulePickupRequest = {
  pickupDate: "2026-11-20",
  pickupAddress: {
    firstName: "A",
    lastName: "B",
    address: { streetAddress: "1 Main St", city: "Austin", state: "TX" },
    contact: [{ email: "a@example.com" }],
  },
  packages: [{ packageType: "PRIORITY_MAIL", packageCount: 2 }],
  estimatedWeight: 4,
  pickupLocation: { packageLocation: "FRONT_DOOR" },
};

describe("usps pickups", () => {
  it("checkEligibility sends the address as query params", async () => {
    const spy = setup();
    const params: UspsPickupEligibilityParams = {
      streetAddress: "1 Main St",
      ZIPCode: "78701",
    };
    await pickups.checkEligibility(CLIENT, params);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.pickups.eligibility",
      method: "GET",
      url: "/pickup/v3/carrier-pickup/eligibility",
      params,
    });
  });

  it("schedulePickup posts the body", async () => {
    const spy = setup();
    await pickups.schedulePickup(CLIENT, pickup);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.pickups.schedule",
      method: "POST",
      url: "/pickup/v3/carrier-pickup",
      data: pickup,
    });
  });

  it("getPickup returns the ETag and sends If-None-Match only when asked", async () => {
    const spy = setup({ etag: '"abc"' });
    const result = await pickups.getPickup(CLIENT, "CN 1");
    expect(result.etag).toBe('"abc"');
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.pickups.get",
      method: "GET",
      url: "/pickup/v3/carrier-pickup/CN%201",
    });
    expect(spy.mock.calls[0][0].headers).toBeUndefined();

    await pickups.getPickup(CLIENT, "CN 1", { ifNoneMatch: '"abc"' });
    expect(spy.mock.calls[1][0].headers).toEqual({ "If-None-Match": '"abc"' });
  });

  it("updatePickup PUTs the body with If-Match and returns the new ETag", async () => {
    const spy = setup({ etag: '"new"' });
    const data: UspsPickupConfirmation = { carrierPickupRequest: pickup };
    const result = await pickups.updatePickup(
      CLIENT,
      { confirmationNumber: "CN 1", ifMatch: '"old"' },
      data
    );
    expect(result.etag).toBe('"new"');
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.pickups.update",
      method: "PUT",
      url: "/pickup/v3/carrier-pickup/CN%201",
      headers: { "If-Match": '"old"' },
      data,
    });
  });

  it("cancelPickup DELETEs with If-Match", async () => {
    const spy = setup();
    await pickups.cancelPickup(CLIENT, "CN 1", '"old"');
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.pickups.cancel",
      method: "DELETE",
      url: "/pickup/v3/carrier-pickup/CN%201",
      headers: { "If-Match": '"old"' },
    });
  });
});
