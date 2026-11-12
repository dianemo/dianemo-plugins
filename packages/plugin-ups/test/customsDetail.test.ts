import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  getCustomsDetailRequirements,
  submitCustomsDetail,
} from "../src/requests/customsDetail/index.js";

const CLIENT = "ups:_:production";

const setup = (data: unknown = { ok: true }) => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data } as never);
  handler.use(ups);
  return spy;
};

afterEach(() => resetBinding());

describe("customsDetail", () => {
  it("getCustomsDetailRequirements sends snake_case query keys, comma-joined arrays", async () => {
    const spy = setup();
    await getCustomsDetailRequirements(CLIENT, {
      importCountryCode: "US",
      exportCountryCode: "IT",
      commodityCodes: ["2926400000", "3003395000"],
      userRoles: ["Importer", "Exporter"],
      shipmentWeight: 0,
      commerceModel: "B2B",
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.customsDetail.getCustomsDetailRequirements"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe(
      "/api/trade/compliance/v2/content/fields/customs-detail"
    );
    expect(config.params).toEqual({
      import_country_code: "US",
      export_country_code: "IT",
      commodity_codes: "2926400000,3003395000",
      user_roles: "Importer,Exporter",
      shipment_weight: "0",
      commerce_model: "B2B",
    });
  });

  it("getCustomsDetailRequirements works with no parameters", async () => {
    const spy = setup();
    await getCustomsDetailRequirements(CLIENT);
    expect(spy.mock.calls[0][0].params).toEqual({});
  });

  it("submitCustomsDetail posts the body and sends registrationId as a header", async () => {
    const spy = setup();
    const data = { actionType: "validate" as const, shipperNumber: "123456" };
    await submitCustomsDetail(CLIENT, data, { registrationId: "3DA1" });
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe("ups.customsDetail.submitCustomsDetail");
    expect(config.method).toBe("POST");
    expect(config.url).toBe(
      "/api/trade/compliance/v2/content/fields/customs-detail"
    );
    expect(config.data).toEqual(data);
    expect(config.headers).toEqual({ registrationId: "3DA1" });
  });

  it("submitCustomsDetail sets no headers without a registrationId", async () => {
    const spy = setup();
    await submitCustomsDetail(CLIENT, { actionType: "save" });
    expect(spy.mock.calls[0][0].headers).toBeUndefined();
  });
});
