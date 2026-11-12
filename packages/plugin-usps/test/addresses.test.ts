import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import {
  getUspsCityState,
  getUspsZipCode,
  validateAddress,
} from "../src/requests/addresses/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";

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

describe("usps addresses", () => {
  it("validateAddress sends the query to the default group", async () => {
    const spy = setup();
    await validateAddress(CLIENT, { streetAddress: "1 Main St", state: "IA" });
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe("usps:_:main:default");
    expect(req.requestName).toBe("usps.addresses.validate");
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/addresses/v3/address");
    expect(req.params).toEqual({ streetAddress: "1 Main St", state: "IA" });
    expect(req.data).toBeUndefined();
  });

  it("validateAddress state is optional", async () => {
    const spy = setup();
    await validateAddress(CLIENT, {
      streetAddress: "1 Main St",
      ZIPCode: "50314",
    });
    expect(spy.mock.calls[0][0].params).toEqual({
      streetAddress: "1 Main St",
      ZIPCode: "50314",
    });
  });

  it("getUspsCityState looks up by ZIP Code", async () => {
    const spy = setup();
    await getUspsCityState(CLIENT, { ZIPCode: "50314" });
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe("usps:_:main:default");
    expect(req.requestName).toBe("usps.addresses.getUspsCityState");
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/addresses/v3/city-state");
    expect(req.params).toEqual({ ZIPCode: "50314" });
  });

  it("getUspsZipCode passes every documented query parameter", async () => {
    const spy = setup();
    await getUspsZipCode(CLIENT, {
      firm: "Acme",
      streetAddress: "1 Main St",
      secondaryAddress: "STE 2",
      city: "Des Moines",
      state: "IA",
      ZIPCode: "50314",
      ZIPPlus4: "1234",
    });
    const req = spy.mock.calls[0][0];
    expect(req.clientName).toBe("usps:_:main:default");
    expect(req.requestName).toBe("usps.addresses.getUspsZipCode");
    expect(req.method).toBe("GET");
    expect(req.url).toBe("/addresses/v3/zipcode");
    expect(req.params).toEqual({
      firm: "Acme",
      streetAddress: "1 Main St",
      secondaryAddress: "STE 2",
      city: "Des Moines",
      state: "IA",
      ZIPCode: "50314",
      ZIPPlus4: "1234",
    });
  });
});
