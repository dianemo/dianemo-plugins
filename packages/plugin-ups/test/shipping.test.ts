import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  recoverLabel,
  requestShipment,
  voidShipment,
} from "../src/requests/shipping/index.js";
import type {
  UpsShippingRecoverLabelRequest,
  UpsShipmentRequest,
} from "../src/requests/shipping/types.js";

const CLIENT = "ups:_:production";

afterEach(() => resetBinding());

const bound = () => {
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

const shipment = {
  ShipmentRequest: {
    Request: { RequestOption: "nonvalidate" },
    Shipment: {
      Shipper: {
        Name: "Shipper",
        ShipperNumber: "A1B2C3",
        Address: {
          AddressLine: ["1 Main St"],
          City: "Atlanta",
          PostalCode: "30301",
          CountryCode: "US",
        },
      },
      ShipTo: {
        Name: "Receiver",
        Address: {
          AddressLine: ["2 Side St"],
          City: "Boston",
          PostalCode: "02101",
          CountryCode: "US",
        },
      },
      Service: { Code: "03" },
      Package: [
        {
          Packaging: { Code: "02" },
          PackageWeight: {
            UnitOfMeasurement: { Code: "LBS" },
            Weight: "2",
          },
        },
      ],
    },
  },
} satisfies UpsShipmentRequest;

describe("shipping", () => {
  it("requestShipment posts the body to the pinned ship path", async () => {
    const spy = bound();
    await requestShipment(CLIENT, shipment);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.shipping.createShipment");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/shipments/v2409/ship");
    expect(config.data).toBe(shipment);
    expect(config.params).toBeUndefined();
  });

  it("requestShipment sends additionaladdressvalidation as a query parameter", async () => {
    const spy = bound();
    await requestShipment(CLIENT, shipment, {
      additionalAddressValidation: "city",
    });
    const config = spy.mock.calls[0][0];
    expect(config.url).toBe("/api/shipments/v2409/ship");
    expect(config.params).toEqual({ additionaladdressvalidation: "city" });
  });

  it("voidShipment puts the shipment id in the path and sends no body", async () => {
    const spy = bound();
    await voidShipment(CLIENT, "1Z999AA10123456784");
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe("ups.shipping.voidShipment");
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe(
      "/api/shipments/v2409/void/cancel/1Z999AA10123456784"
    );
    expect(config.params).toBeUndefined();
    expect(config.headers).toBeUndefined();
    expect(config.data).toBeUndefined();
  });

  it("voidShipment narrows to one package with the trackingnumber query parameter", async () => {
    const spy = bound();
    await voidShipment(CLIENT, "1Z999AA10123456784", "1Z999AA10123456785");
    const config = spy.mock.calls[0][0];
    expect(config.url).toBe(
      "/api/shipments/v2409/void/cancel/1Z999AA10123456784"
    );
    expect(config.params).toEqual({ trackingnumber: "1Z999AA10123456785" });
  });

  it("voidShipment sends shipperNumber as a header", async () => {
    const spy = bound();
    await voidShipment(CLIENT, "1Z999AA10123456784", undefined, {
      shipperNumber: "A1B2C3",
    });
    expect(spy.mock.calls[0][0].headers).toEqual({ shipperNumber: "A1B2C3" });
  });

  it("recoverLabel posts the body to the label recovery path", async () => {
    const spy = bound();
    const data: UpsShippingRecoverLabelRequest = {
      LabelRecoveryRequest: {
        Request: {},
        TrackingNumber: "1Z999AA10123456784",
      },
    };
    await recoverLabel(CLIENT, data);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.shipping.recoverLabel");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/labels/v1/recovery");
    expect(config.data).toBe(data);
  });
});
