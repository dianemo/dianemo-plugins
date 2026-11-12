import { getInternationalServiceStandard } from "../src/requests/internationalServiceStandards/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

describe("usps internationalServiceStandards", () => {
  it("getInternationalServiceStandard sends the inputs as query params", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    handler.use(usps);
    await getInternationalServiceStandard("usps:_:main", {
      countryCode: "CA",
      mailClass: "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:default",
      requestName:
        "usps.internationalServiceStandards.getInternationalServiceStandard",
      method: "GET",
      url: "/international-service-standard/v3/international-service-standard",
      params: {
        countryCode: "CA",
        mailClass: "FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE",
      },
    });
  });
});
