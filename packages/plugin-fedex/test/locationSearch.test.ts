import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as familyRequests from "../src/requests/locationSearch/index.js";
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

describe("fedex locationSearch", () => {
  it("findLocations POSTs the body to /location/v1/locations", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    const { fedex: requests } = handler.use(fedex);
    const body = {
      location: { address: { postalCode: "38127", countryCode: "US" } },
      locationSearchCriterion: "ADDRESS" as const,
    };

    const res = await requests.findLocations("fedex:_:production", body);

    expect(res).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.locationSearch.findLocations");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/location/v1/locations");
    expect(config.data).toBe(body);
  });
});
