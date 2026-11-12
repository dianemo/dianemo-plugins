import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getUpsRate } from "../src/requests/rating/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  GetPackageRating,
  UPSAdditionalInfoOptions,
  UPSRequestOption,
} from "../src/requests/rating/types.js";

const CLIENT = "ups:_:test";

const newHandler = () =>
  new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });

afterEach(() => resetBinding());

const shipment = (overrides: Record<string, unknown> = {}) =>
  ({
    RateRequest: {
      Request: {},
      Shipment: {
        Shipper: { Address: { AddressLine: ["1 Main"], CountryCode: "US" } },
        ShipTo: { Address: { AddressLine: ["2 Main"], CountryCode: "US" } },
        Package: [],
        ...overrides,
      },
    },
  }) as unknown as GetPackageRating;

const call = async (
  data: GetPackageRating,
  options?: Parameters<typeof getUpsRate>[2]
) => {
  const handler = newHandler();
  const spy = vi.spyOn(handler, "handleRequest").mockResolvedValue({
    data: { RateResponse: { RatedShipment: [] } },
  } as never);
  handler.use(ups);
  const result = await getUpsRate(CLIENT, data, options);
  return { config: spy.mock.calls[0][0], result };
};

describe("getUpsRate", () => {
  it("rates when the shipment names a service", async () => {
    const { config } = await call(shipment({ Service: { Code: "03" } }));
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.rating.getRate");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/rating/v2409/Rate");
  });

  it("shops when there is no service code", async () => {
    const { config } = await call(shipment());
    expect(config.url).toBe("/api/rating/v2409/Shop");
  });

  it("places the request body unchanged and unwraps RateResponse", async () => {
    const data = shipment();
    const { config, result } = await call(data);
    expect(config.data).toBe(data);
    expect(result).toEqual({ RatedShipment: [] });
  });

  it("appends additionalinfo when DeliveryTimeInformation is present", async () => {
    const { config } = await call(
      shipment({
        Service: { Code: "03" },
        DeliveryTimeInformation: { PackageBillType: "03" },
      })
    );
    expect(config.url).toBe(
      "/api/rating/v2409/Rate?additionalinfo=timeintransit"
    );
  });

  it("appends additionalinfo when the caller asks for it", async () => {
    const { config } = await call(shipment({ Service: { Code: "03" } }), {
      additionalinfo: [UPSAdditionalInfoOptions.timeintransit],
    });
    expect(config.url).toBe(
      "/api/rating/v2409/Rate?additionalinfo=timeintransit"
    );
  });

  it("honours an explicit request option over the derived one", async () => {
    const { config } = await call(shipment({ Service: { Code: "03" } }), {
      requestOption: UPSRequestOption.Shop,
    });
    expect(config.url).toBe("/api/rating/v2409/Shop");
  });

  it.each([
    UPSRequestOption.Ratetimeintransit,
    UPSRequestOption.Shoptimeintransit,
  ])(
    "puts %s in the path without repeating it as additionalinfo",
    async (requestOption) => {
      const { config } = await call(
        shipment({ DeliveryTimeInformation: { PackageBillType: "03" } }),
        { requestOption }
      );
      expect(config.url).toBe(`/api/rating/v2409/${requestOption}`);
    }
  );

  it("rates a Ground Freight Pricing request even without a service code", async () => {
    const { config } = await call(
      shipment({ ShipmentRatingOptions: { FRSShipmentIndicator: "" } })
    );
    expect(config.url).toBe("/api/rating/v2409/Rate");
  });

  it("takes the version from the options", async () => {
    const { config } = await call(shipment({ Service: { Code: "03" } }), {
      version: "v2205",
    });
    expect(config.url).toBe("/api/rating/v2205/Rate");
  });
});
