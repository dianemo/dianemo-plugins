import { makeUpsAddressValidationRequest } from "../src/requests/addressValidation/index.js";
import { XAVRequest } from "../src/requests/addressValidation/types.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

const CLIENT = "ups:_:production";

const setup = () => {
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

afterEach(() => resetBinding());

const body: XAVRequest = {
  XAVRequest: {
    AddressKeyFormat: {
      AddressLine: ["1 Main St"],
      PoliticalDivision2: "Albany",
      PoliticalDivision1: "NY",
      PostcodePrimaryLow: "12207",
      CountryCode: "US",
    },
  },
};

describe("ups addressValidation", () => {
  it("keeps today's defaults: option 3 and ten candidates", async () => {
    const spy = setup();
    await makeUpsAddressValidationRequest(CLIENT, body);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.addressValidation.validate");
    expect(config.method).toBe("POST");
    expect(config.url).toBe(
      "/api/addressvalidation/v2/3?maximumcandidatelistsize=10"
    );
    expect(config.data).toBe(body);
  });

  it("takes the request option and candidate cap from options", async () => {
    const spy = setup();
    await makeUpsAddressValidationRequest(CLIENT, body, {
      requestOption: 2,
      maximumCandidateListSize: 0,
    });
    expect(spy.mock.calls[0][0].url).toBe(
      "/api/addressvalidation/v2/2?maximumcandidatelistsize=0"
    );
  });

  it("sends regionalrequestindicator in lower case on option 1", async () => {
    const spy = setup();
    await makeUpsAddressValidationRequest(CLIENT, body, {
      requestOption: 1,
      regionalRequestIndicator: true,
    });
    expect(spy.mock.calls[0][0].url).toBe(
      "/api/addressvalidation/v2/1?maximumcandidatelistsize=10&regionalrequestindicator=true"
    );
  });

  it("refuses a regional request alongside classification at compile time", () => {
    const bad: Parameters<typeof makeUpsAddressValidationRequest>[2] = {
      requestOption: 3,
      // @ts-expect-error UPS answers 400 for regional + classification
      regionalRequestIndicator: true,
    };
    expect(bad).toBeDefined();
  });
});
