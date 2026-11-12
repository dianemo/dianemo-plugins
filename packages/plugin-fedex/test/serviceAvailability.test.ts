import * as familyRequests from "../src/requests/serviceAvailability/index.js";
import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
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

const CLIENT = "fedex:_:production";

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

describe("fedex serviceAvailability", () => {
  it("getServicesAndTransitTimes POSTs the body to /availability/v1/transittimes", async () => {
    const { spy, requests } = setup();
    const body = {
      requestedShipment: {
        shipper: { address: { postalCode: "38017", countryCode: "US" } },
        recipients: [{ address: { postalCode: "38127", countryCode: "US" } }],
        packagingType: "YOUR_PACKAGING",
        requestedPackageLineItems: [
          { weight: { units: "LB" as const, value: 10 } },
        ],
      },
      carrierCodes: ["FDXG" as const],
    };
    const res = await requests.getServicesAndTransitTimes(CLIENT, body);

    expect(res).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "fedex.serviceAvailability.getServicesAndTransitTimes"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/availability/v1/transittimes");
    expect(config.data).toBe(body);
  });

  it("getPackageAndServiceOptions POSTs the body to /availability/v1/packageandserviceoptions", async () => {
    const { spy, requests } = setup();
    const body = {
      requestedShipment: {
        shipper: { address: { countryCode: "US" } },
        recipients: [{ address: { countryCode: "CA" } }],
      },
    };
    await requests.getPackageAndServiceOptions(CLIENT, body);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "fedex.serviceAvailability.getPackageAndServiceOptions"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/availability/v1/packageandserviceoptions");
    expect(config.data).toBe(body);
  });

  it("getSpecialServiceOptions POSTs the body to /availability/v1/specialserviceoptions", async () => {
    const { spy, requests } = setup();
    const body = {
      requestedShipment: {
        shipper: { address: { countryCode: "US" } },
        recipient: { address: { countryCode: "US" } },
        packagingType: "YOUR_PACKAGING",
        requestedPackageLineItems: [],
      },
    };
    await requests.getSpecialServiceOptions(CLIENT, body);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "fedex.serviceAvailability.getSpecialServiceOptions"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/availability/v1/specialserviceoptions");
    expect(config.data).toBe(body);
  });
});
