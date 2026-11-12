import * as familyRequests from "../src/requests/addressValidation/index.js";
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

describe("fedex addressValidation", () => {
  it("validateFedExAddress POSTs the body to /address/v1/addresses/resolve", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    const { fedex: requests } = handler.use(fedex);
    const body = {
      validateAddressControlParameters: { includeResolutionTokens: true },
      addressesToValidate: [
        {
          address: {
            streetLines: ["7372 PARKRIDGE BLVD", "APT 286"],
            city: "IRVING",
            stateOrProvinceCode: "TX",
            postalCode: "75063-8659",
            countryCode: "US",
          },
        },
      ],
    };

    const res = await requests.validateFedExAddress("fedex:_:production", body);

    expect(res).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.addressValidation.resolve");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/address/v1/addresses/resolve");
    expect(config.data).toBe(body);
  });
});
