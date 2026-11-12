import * as adjustments from "../src/requests/adjustments/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: [] } as never);
  handler.use(usps);
  return spy;
};

describe("usps adjustments", () => {
  it("getUspsAdjustments puts CRID, tracking number and event type in the path", async () => {
    const spy = setup();
    await adjustments.getUspsAdjustments(CLIENT, {
      CRID: "123",
      trackingNumber: "9400",
      eventType: "CENSUS",
    });
    const call = spy.mock.calls[0][0];
    expect(call).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.adjustments.getUspsAdjustments",
      method: "GET",
      url: "/adjustments/v3/adjustments/123/9400/CENSUS",
    });
    expect(call.params).toBeUndefined();
    expect(call.metadata).toBeUndefined();
  });

  it("getUspsAdjustments sends destinationZIPCode as a query parameter", async () => {
    const spy = setup();
    await adjustments.getUspsAdjustments(CLIENT, {
      CRID: "123",
      trackingNumber: "9400",
      eventType: "DUPLICATES",
      destinationZIPCode: "20260",
    });
    expect(spy.mock.calls[0][0].params).toEqual({
      destinationZIPCode: "20260",
    });
  });

  it("getUspsReconciliationAdjustments builds the six-segment path and omits unset paging", async () => {
    const spy = setup();
    await adjustments.getUspsReconciliationAdjustments(CLIENT, {
      CRID: "123",
      eventType: "UNMANIFESTED",
      startDate: "20261101",
      startTime: "000000",
      endDate: "20261102",
      endTime: "235959",
    });
    const call = spy.mock.calls[0][0];
    expect(call).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.adjustments.getUspsReconciliationAdjustments",
      method: "GET",
      url: "/reconciliation-adjustments/v3/reconciliation-adjustments/123/UNMANIFESTED/20261101/000000/20261102/235959",
    });
    expect(call.params).toBeUndefined();
  });

  it("getUspsReconciliationAdjustments passes paging as query parameters", async () => {
    const spy = setup();
    await adjustments.getUspsReconciliationAdjustments(CLIENT, {
      CRID: "123",
      eventType: "CENSUS",
      startDate: "20261101",
      startTime: "000000",
      endDate: "20261102",
      endTime: "235959",
      pageNum: 2,
      pageSize: 50,
    });
    expect(spy.mock.calls[0][0].params).toEqual({ pageNum: 2, pageSize: 50 });
  });
});
