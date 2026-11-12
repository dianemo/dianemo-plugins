import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  trackByReferenceNumber,
  trackPackage,
  trackShipmentPackages,
} from "../src/requests/packageTracking/index.js";

const CLIENT = "ups:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return spy;
};

afterEach(() => resetBinding());

describe("ups packageTracking", () => {
  it("keeps v1.0.0 behaviour for a bare trackPackage call", async () => {
    const spy = setup();
    await trackPackage(CLIENT, "1Z999AA10123456784");
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.packageTracking.track");
    expect(config.method).toBe("GET");
    expect(config.url).toBe(
      "/api/track/v1/details/1Z999AA10123456784?returnSignature=false&locale=en_US"
    );
  });

  it("sends every documented query parameter of trackPackage", async () => {
    const spy = setup();
    await trackPackage(CLIENT, "1Z999AA10123456784", {
      locale: "fr_CA",
      returnSignature: true,
      returnMilestones: true,
      returnPOD: false,
    });
    expect(spy.mock.calls[0][0].url).toBe(
      "/api/track/v1/details/1Z999AA10123456784?returnSignature=true&locale=fr_CA&returnMilestones=true&returnPOD=false"
    );
  });

  it("looks up by reference number with no query when none is given", async () => {
    const spy = setup();
    await trackByReferenceNumber(CLIENT, { referenceNumber: "PO 123" });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.packageTracking.trackByReferenceNumber"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/api/track/v1/reference/details/PO%20123");
  });

  it("sends reference-number filters under UPS's parameter names", async () => {
    const spy = setup();
    await trackByReferenceNumber(CLIENT, {
      referenceNumber: "REF1",
      fromPickUpDate: "20261101",
      toPickUpDate: "20261110",
      destCountry: "US",
      destZip: "30068",
      shipperNum: "A1B2C3",
      refNumType: "fgv",
      locale: "en_US",
    });
    const url = new URL(spy.mock.calls[0][0].url ?? "", "https://x");
    expect(url.pathname).toBe("/api/track/v1/reference/details/REF1");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      fromPickUpDate: "20261101",
      toPickUpDate: "20261110",
      destCountry: "US",
      destZip: "30068",
      shipperNum: "A1B2C3",
      refNumType: "fgv",
      locale: "en_US",
    });
  });

  it("pages a shipment with offset and count, keeping zero", async () => {
    const spy = setup();
    await trackShipmentPackages(CLIENT, {
      inquiryNumber: "1Z1",
      offset: 0,
      count: 10,
    });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.packageTracking.trackShipmentPackages"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe(
      "/api/track/v1/shipment/details/1Z1?offset=0&count=10"
    );
  });

  it("omits the query when shipment paging is not requested", async () => {
    const spy = setup();
    await trackShipmentPackages(CLIENT, { inquiryNumber: "1Z1" });
    expect(spy.mock.calls[0][0].url).toBe("/api/track/v1/shipment/details/1Z1");
  });
});
