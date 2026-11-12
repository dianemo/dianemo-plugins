import * as familyRequests from "../src/requests/postalCodeValidation/index.js";
import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerFedexTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";

// Composes only this family so the test holds whether or not the package barrel
// has been wired to export it yet.
const fedex = definePlugin({
  name: "fedex",
  registerTemplate: registerFedexTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return familyRequests;
  },
});

afterEach(() => resetBinding());

describe("fedex postalCodeValidation", () => {
  it("validatePostalCode POSTs the body to /country/v1/postal/validate", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    const { fedex: requests } = handler.use(fedex);
    const body = {
      carrierCode: "FDXE" as const,
      countryCode: "US",
      stateOrProvinceCode: "TN",
      postalCode: "38127",
      shipDate: "2026-11-20",
    };

    const res = await requests.validatePostalCode("fedex:_:production", body);

    expect(res).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe(
      "fedex.postalCodeValidation.validatePostalCode"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/country/v1/postal/validate");
    expect(config.data).toBe(body);
  });
});
