import * as enrollment from "../src/requests/shipEnrollment/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

describe("usps shipEnrollment", () => {
  it("getShipEnrollmentStatus posts the MID list on the default group", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const body = { MIDs: [{ MID: "123456789", program: "Outbound" }] };
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: body } as never);
    handler.use(usps);

    const res = await enrollment.getShipEnrollmentStatus("usps:_:main", {
      MIDs: ["123456789"],
    });
    expect(res).toEqual(body);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:default",
      requestName: "usps.shipEnrollment.getShipEnrollmentStatus",
      method: "POST",
      url: "/ship-enrollment/v3/enrollment",
      data: { MIDs: ["123456789"] },
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });
});
