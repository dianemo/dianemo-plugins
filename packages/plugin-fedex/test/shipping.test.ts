import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "fedex:_:production";

const compose = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  return { requests: handler.use(fedex).fedex, spy };
};

describe("fedex shipping family", () => {
  it("cancelShipment PUTs the body to /ship/v1/shipments/cancel", async () => {
    const { requests, spy } = compose();
    const data = {
      accountNumber: { value: "123456789" },
      trackingNumber: "794953555571",
      deletionControl: "DELETE_ALL_PACKAGES",
    } as const;
    await requests.cancelShipment(CLIENT, data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("fedex.shipping.cancelShipment");
    expect(config.method).toBe("PUT");
    expect(config.url).toBe("/ship/v1/shipments/cancel");
    expect(config.data).toBe(data);
  });

  it("getShipmentAsyncResults POSTs to /ship/v1/shipments/results", async () => {
    const { requests, spy } = compose();
    const data = { accountNumber: { value: "123456789" }, jobId: "job1" };
    await requests.getShipmentAsyncResults(CLIENT, data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("fedex.shipping.getShipmentAsyncResults");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/ship/v1/shipments/results");
    expect(config.data).toBe(data);
  });

  it("validateShipment POSTs to /ship/v1/shipments/packages/validate", async () => {
    const { requests, spy } = compose();
    const data = { requestedShipment: {} } as never;
    await requests.validateShipment(CLIENT, data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("fedex.shipping.validateShipment");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/ship/v1/shipments/packages/validate");
    expect(config.data).toBe(data);
  });

  it("createTag POSTs to /ship/v1/shipments/tag", async () => {
    const { requests, spy } = compose();
    const data = { requestedShipment: {}, accountNumber: {} } as never;
    await requests.createTag(CLIENT, data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("fedex.shipping.createTag");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/ship/v1/shipments/tag");
    expect(config.data).toBe(data);
  });

  it("cancelTag PUTs the body and puts shipmentId in the path", async () => {
    const { requests, spy } = compose();
    const data = {
      accountNumber: { value: "123456789" },
      serviceType: "PRIORITY_OVERNIGHT",
      completedTagDetail: {
        confirmationNumber: "275",
        location: "NQAA",
        dispatchDate: "2019-08-03",
      },
    } as never;
    await requests.cancelTag(CLIENT, { shipmentId: "a/b 1" }, data);

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("fedex.shipping.cancelTag");
    expect(config.method).toBe("PUT");
    expect(config.url).toBe("/ship/v1/shipments/tag/cancel/a%2Fb%201");
    expect(config.data).toBe(data);
  });
});
