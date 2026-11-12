import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  closeoutWorldEaseMasterShipment,
  deleteWorldEaseChildShipment,
  deleteWorldEaseMasterShipment,
} from "../src/requests/worldEase/index.js";

const CLIENT = "ups:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: {} } as never);
  handler.use(ups);
  return spy;
};

afterEach(() => resetBinding());

describe("worldEase", () => {
  it("closeoutWorldEaseMasterShipment posts the shipper body", async () => {
    const spy = setup();
    await closeoutWorldEaseMasterShipment(
      CLIENT,
      { shipmentGccn: "ABC12345678" },
      { shipperAccountNumber: "ISUS01" }
    );
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.worldEase.closeoutWorldEaseMasterShipment"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(
      "/api/ship/v1/master-shipment/closeout/ABC12345678"
    );
    expect(config.data).toEqual({ shipperAccountNumber: "ISUS01" });
  });

  it("deleteWorldEaseMasterShipment sends the shipper body on a DELETE", async () => {
    const spy = setup();
    await deleteWorldEaseMasterShipment(
      CLIENT,
      { shipmentGccn: "ABC12345678" },
      { shipperAccountNumber: "ISUS01" }
    );
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.worldEase.deleteWorldEaseMasterShipment"
    );
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe("/api/ship/v1/master-shipment/ABC12345678");
    expect(config.data).toEqual({ shipperAccountNumber: "ISUS01" });
  });

  it("deleteWorldEaseChildShipment puts gccn then tracking number in the path", async () => {
    const spy = setup();
    await deleteWorldEaseChildShipment(CLIENT, {
      shipmentGccn: "ABC12345678",
      trackingNumber: "1Z1388YY0316063678",
    });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.worldEase.deleteWorldEaseChildShipment"
    );
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe(
      "/api/ship/v1/child-shipment/ABC12345678/1Z1388YY0316063678"
    );
    expect(config.data).toBeUndefined();
  });
});
