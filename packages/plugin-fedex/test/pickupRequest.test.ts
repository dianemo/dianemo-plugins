import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as familyRequests from "../src/requests/pickupRequest/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerFedexTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";

// Composes only this family so the test holds whether or not the package barrel
// has been wired to export it yet.
const fedex = definePlugin({
  name: "fedex",
  registerTemplate: registerFedexTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return familyRequests;
  },
});

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { fedex: requests } = handler.use(fedex);
  return { spy, requests };
};

describe("fedex pickupRequest", () => {
  it("checkPickupAvailability POSTs the body to /pickup/v1/pickups/availabilities", async () => {
    const { spy, requests } = setup();
    const body = {
      pickupAddress: { postalCode: "38127", countryCode: "US" },
      pickupRequestType: ["SAME_DAY" as const],
      carriers: ["FDXE" as const],
      countryRelationship: "DOMESTIC" as const,
    };

    const res = await requests.checkPickupAvailability(
      "fedex:_:production",
      body
    );

    expect(res).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.pickup.checkAvailability");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/pickup/v1/pickups/availabilities");
    expect(config.data).toBe(body);
  });

  it("createPickup POSTs the body to /pickup/v1/pickups", async () => {
    const { spy, requests } = setup();
    const body = {
      associatedAccountNumber: { value: "123456789" },
      carrierCode: "FDXE" as const,
      originDetail: {
        pickupLocation: {
          contact: { personName: "Jane Shipper" },
          address: {
            streetLines: ["10 FedEx Parkway"],
            city: "Memphis",
            stateOrProvinceCode: "TN",
            postalCode: "38127",
            countryCode: "US",
          },
        },
        readyDateTimestamp: "2026-11-20T09:00:00",
        customerCloseTime: "17:00:00",
      },
    };

    await requests.createPickup("fedex:_:production", body);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.pickup.create");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/pickup/v1/pickups");
    expect(config.data).toBe(body);
  });

  it("cancelPickup PUTs the body to /pickup/v1/pickups/cancel", async () => {
    const { spy, requests } = setup();
    const body = {
      associatedAccountNumber: { value: "123456789" },
      pickupConfirmationCode: "3001",
      scheduledDate: "2026-11-20",
    };

    await requests.cancelPickup("fedex:_:production", body);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.pickup.cancel");
    expect(config.method).toBe("PUT");
    expect(config.url).toBe("/pickup/v1/pickups/cancel");
    expect(config.data).toBe(body);
  });
});
