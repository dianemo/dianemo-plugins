import type { UspsLogisticsShipmentTrackingEvent } from "../src/requests/logisticsShipments/types.js";
import * as logistics from "../src/requests/logisticsShipments/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const event: UspsLogisticsShipmentTrackingEvent = {
  externalLoadNumber: "ELN123456",
  appointmentID: "987654321",
  appointmentDate: "2025-10-17T13:30:00Z",
  trailerID: "TRAILER1234",
  schedulerCRID: "01122445343",
  location: {
    locationType: "USPS",
    dropSiteKey: "KZ11305",
    stopType: "DELIVERY",
    stopSequence: 2,
  },
  currentLocation: {
    latitude: 39.8561,
    longitude: -104.6737,
    currentDateTime: "2025-10-17T10:30:00Z",
  },
  currentEvent: { eventType: "EN_ROUTE" },
  positionalInfo: {
    pingInterval: 1800,
    distance: 120.5,
    speed: null,
    accuracy: null,
  },
};

describe("usps logisticsShipments", () => {
  it("createShipmentTrackingEvent posts the event on the default group", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: event } as never);
    handler.use(usps);

    const res = await logistics.createShipmentTrackingEvent(
      "usps:_:main",
      event
    );
    expect(res).toEqual(event);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.logisticsShipments.createShipmentTrackingEvent",
      method: "POST",
      url: "/logistics/v3/shipment-tracking",
      data: event,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });
});
