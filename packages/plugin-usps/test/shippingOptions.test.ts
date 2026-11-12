import type { UspsShippingOptionRequest } from "../src/requests/shippingOptions/types.js";
import { searchShippingOptions } from "../src/requests/shippingOptions/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(usps);
  return spy;
};

const domestic: UspsShippingOptionRequest = {
  originZIPCode: "50314",
  destinationZIPCode: "10001",
  pricingOptions: [{ priceType: "RETAIL" }],
  packageDescription: {
    weight: 2,
    length: 10,
    width: 8,
    height: 4,
    mailClass: "PRIORITY_MAIL",
  },
  shippingFilter: "PRICE",
};

describe("usps shippingOptions", () => {
  it("searchShippingOptions posts under the /shipments/v3 prefix", async () => {
    const spy = setup();
    await searchShippingOptions("usps:_:main", domestic);
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe("usps:_:main:default");
    expect(req.requestName).toBe("usps.shippingOptions.searchShippingOptions");
    expect(req.method).toBe("POST");
    expect(req.url).toBe("/shipments/v3/options/search");
    expect(req.data).toEqual(domestic);
    expect(req.metadata?.uspsAccountNumber).toBeUndefined();
  });

  it("accepts the international request shape", async () => {
    const spy = setup();
    const international: UspsShippingOptionRequest = {
      originZIPCode: "50314",
      destinationCountryCode: "CA",
      pricingOptions: [{ priceType: "COMMERCIAL" }],
      packageDescription: {
        weight: 1,
        length: 5,
        width: 5,
        height: 5,
        mailClass: "PRIORITY_MAIL_INTERNATIONAL",
      },
    };
    await searchShippingOptions("usps:_:main", international);
    expect(spy.mock.calls[0][0].data).toEqual(international);
  });
});
