import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  closeoutTradeDirectMasterShipment,
  deleteTradeDirectChildShipment,
  deleteTradeDirectLtlChildShipment,
  deleteTradeDirectMasterShipment,
  generateTradeDirectDocuments,
} from "../src/requests/tradeDirect/index.js";

const CLIENT = "ups:_:production";
const BASE = "/api/ship/tradedirect/v1/master-shipments";

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

describe("tradeDirect", () => {
  it("deleteTradeDirectMasterShipment sends the account as a query parameter", async () => {
    const spy = setup();
    await deleteTradeDirectMasterShipment(CLIENT, {
      usiNumber: "578299028T",
      shipperAccountNumber: "1234WW",
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.tradeDirect.deleteTradeDirectMasterShipment"
    );
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe(`${BASE}/578299028T`);
    expect(config.params).toEqual({ shipper_account_number: "1234WW" });
  });

  it("deleteTradeDirectChildShipment puts both ids in the path", async () => {
    const spy = setup();
    await deleteTradeDirectChildShipment(CLIENT, {
      usiNumber: "578299028T",
      trackingNumber: "1Z1388YY0316063678",
    });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.tradeDirect.deleteTradeDirectChildShipment"
    );
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe(
      `${BASE}/578299028T/child-shipments/1Z1388YY0316063678`
    );
  });

  it("closeoutTradeDirectMasterShipment posts the body to the closeout path", async () => {
    const spy = setup();
    const data = { shipment: { shipper: { accountNumber: "1234WW" } } };
    await closeoutTradeDirectMasterShipment(
      CLIENT,
      { usiNumber: "5782990281" },
      data
    );
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.tradeDirect.closeoutTradeDirectMasterShipment"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`${BASE}/5782990281/closeout`);
    expect(config.data).toEqual(data);
  });

  it("deleteTradeDirectLtlChildShipment targets the ltl-child-shipments path", async () => {
    const spy = setup();
    await deleteTradeDirectLtlChildShipment(CLIENT, {
      usiNumber: "578299028T",
      subProNumber: "SBP12345",
    });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.tradeDirect.deleteTradeDirectLtlChildShipment"
    );
    expect(config.method).toBe("DELETE");
    expect(config.url).toBe(`${BASE}/578299028T/ltl-child-shipments/SBP12345`);
  });

  it("generateTradeDirectDocuments posts to /documents", async () => {
    const spy = setup();
    const data = {
      requestedDoc: "BOL" as const,
      docFormat: "PDF" as const,
      usiNumber: "578299028T",
      shipperAccountNumber: "1234WW",
    };
    await generateTradeDirectDocuments(CLIENT, data);
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.tradeDirect.generateTradeDirectDocuments"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`${BASE}/documents`);
    expect(config.data).toEqual(data);
  });
});
