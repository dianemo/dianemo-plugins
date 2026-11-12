import * as locations from "../src/requests/locations/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = "usps:_:main:default";

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

describe("usps locations", () => {
  it("getDropoffLocations sends every set filter and drops unset ones", async () => {
    const spy = setup();
    await locations.getDropoffLocations(CLIENT, {
      destinationZIPCode: "90210",
      mailClass: "PARCEL_SELECT",
      palletized: "BOTH",
      mailingDate: "2026-11-20",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.locations.getDropoffLocations",
      method: "GET",
      url: "/locations/v3/dropoff-locations",
      params: {
        destinationZIPCode: "90210",
        mailClass: "PARCEL_SELECT",
        palletized: "BOTH",
        mailingDate: "2026-11-20",
      },
    });
    expect(spy.mock.calls[0][0].params).not.toHaveProperty(
      "processingCategory"
    );
  });

  it("drops an empty array filter instead of sending `key=`", async () => {
    const spy = setup();
    await locations.getPostOfficeLocations(CLIENT, {
      ZIPCode: "90210",
      postOfficeType: [],
      passportService: ["PASSPORT_PHOTO"],
    });
    const { params } = spy.mock.calls[0][0];
    expect(params).toEqual({
      ZIPCode: "90210",
      passportService: "PASSPORT_PHOTO",
    });
    expect(params).not.toHaveProperty("postOfficeType");
  });

  it("getPostOfficeLocations stringifies numbers and comma-joins array filters", async () => {
    const spy = setup();
    await locations.getPostOfficeLocations(CLIENT, {
      ZIPCode: "90210",
      LAT: 34.07,
      LONG: -118.4,
      radius: 25,
      postOfficeType: ["POST_OFFICE", "SELF_SERVICE_KIOSK"],
      passportService: ["PASSPORT_PHOTO"],
      hours: "SATURDAY_HOURS",
      limit: 10,
      offset: 0,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.locations.getPostOfficeLocations",
      method: "GET",
      url: "/locations/v3/post-office-locations",
      params: {
        ZIPCode: "90210",
        LAT: "34.07",
        LONG: "-118.4",
        radius: "25",
        postOfficeType: "POST_OFFICE,SELF_SERVICE_KIOSK",
        passportService: "PASSPORT_PHOTO",
        hours: "SATURDAY_HOURS",
        limit: "10",
        offset: "0",
      },
    });
  });

  it("getParcelLockerLocations sends its filters", async () => {
    const spy = setup();
    await locations.getParcelLockerLocations(CLIENT, {
      city: "Austin",
      state: "TX",
      limit: 5,
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.locations.getParcelLockerLocations",
      method: "GET",
      url: "/locations/v3/parcel-locker-locations",
      params: { city: "Austin", state: "TX", limit: "5" },
    });
  });

  it("listLocationFiles GETs /files", async () => {
    const spy = setup();
    await locations.listLocationFiles(CLIENT);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.locations.listFiles",
      method: "GET",
      url: "/locations/v3/files",
    });
  });

  it("generateLocationFileSignedUrl encodes the file id", async () => {
    const spy = setup();
    await locations.generateLocationFileSignedUrl(CLIENT, {
      fileID: "a/b c",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.locations.generateFileSignedUrl",
      method: "GET",
      url: "/locations/v3/files/a%2Fb%20c/generate-signed-url",
    });
  });
});
