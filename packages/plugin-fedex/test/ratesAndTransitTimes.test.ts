import type { GetRatesAndTransitTimesData } from "../src/requests/ratesAndTransitTimes/types.js";
import * as familyRequests from "../src/requests/ratesAndTransitTimes/index.js";
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

describe("fedex ratesAndTransitTimes", () => {
  it("getFedexRatesAndTransitTimes POSTs data.body to /rate/v1/rates/quotes", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi.spyOn(handler, "handleRequest").mockResolvedValue({
      data: { output: { rateReplyDetails: [] } },
    } as never);
    const { fedex: requests } = handler.use(fedex);
    const data: GetRatesAndTransitTimesData = {
      body: {
        accountNumber: { value: "123456789" },
        requestedShipment: {
          shipper: { address: { postalCode: "38127", countryCode: "US" } },
          recipient: { address: { postalCode: "75063", countryCode: "US" } },
          pickupType: "DROPOFF_AT_FEDEX_LOCATION",
          requestedPackageLineItems: [{ weight: { units: "LB", value: 10 } }],
        },
      },
    };

    const res = await requests.getFedexRatesAndTransitTimes(
      "fedex:_:production",
      data
    );

    expect(res).toEqual({ output: { rateReplyDetails: [] } });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.rates.getQuotes");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/rate/v1/rates/quotes");
    // The wrapper is unwrapped: FedEx receives the body itself.
    expect(config.data).toBe(data.body);
  });
});
