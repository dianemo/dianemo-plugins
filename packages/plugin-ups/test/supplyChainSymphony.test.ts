import * as scs from "../src/requests/supplyChainSymphony/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { isCompleted: true } } as never);
  handler.use(ups);
  return spy;
};

describe("ups supplyChainSymphony", () => {
  it("ingestScsInventory posts to /inventory/v1/inventory, outside /api", async () => {
    const spy = setup();
    const data = {
      apiVersion: "1.0",
      request: {
        sourceSystem: "wmsinventory",
        partnerId: "1052",
        docFlow: "Inbound",
        docType: "InventorySnapshot",
        inventoryInformation: [],
      },
    };
    await scs.ingestScsInventory(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.supplyChainSymphony.ingestScsInventory",
      method: "POST",
      url: "/inventory/v1/inventory",
      data,
    });
  });

  it("ingestScsLogistics posts to /logistics/v1/logistics-data, outside /api", async () => {
    const spy = setup();
    const data = {
      apiVersion: "1.0",
      request: { docId: "d1", docType: "Order", sourceSystem: "WMS" },
    };
    await scs.ingestScsLogistics(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      requestName: "ups.supplyChainSymphony.ingestScsLogistics",
      method: "POST",
      url: "/logistics/v1/logistics-data",
      data,
    });
  });

  it("ingestScsTransportation posts to the transaction-visibility-dashboard Ingest path", async () => {
    const spy = setup();
    const data = {
      apiVersion: "v1.0" as const,
      request: {
        docType: "Order" as const,
        sourceSystem: "TMS",
        orderDetails: [],
      },
    };
    await scs.ingestScsTransportation(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      requestName: "ups.supplyChainSymphony.ingestScsTransportation",
      method: "POST",
      url: "/api/transaction-visibility-dashboard/v1/Ingest",
      data,
    });
  });
});
