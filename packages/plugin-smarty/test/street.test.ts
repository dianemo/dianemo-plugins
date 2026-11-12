import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: [] } as never);
  const { smarty: requests } = handler.use(smarty);
  return { spy, requests };
};

describe("verifySmartyUs", () => {
  it("POSTs a one-element array with strict/1 defaults", async () => {
    const { spy, requests } = setup();
    await requests.verifySmartyUs(
      { street: "1 Main St", candidates: 5 },
      { organizationId: null }
    );
    const c = spy.mock.calls[0][0];
    expect(c.clientName).toBe("smarty:_:production:us");
    expect(c.requestName).toBe("smarty.us.verify");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/street-address");
    expect(c.params).toBeUndefined();
    expect(c.data).toEqual([
      { candidates: 5, match: "strict", street: "1 Main St" },
    ]);
  });

  it("sends license as a query parameter, not in the body", async () => {
    const { spy, requests } = setup();
    await requests.verifySmartyUs(
      { street: "1 Main St" },
      { organizationId: "org", alias: "sandbox", license: "us-core-cloud" }
    );
    const c = spy.mock.calls[0][0];
    expect(c.clientName).toBe("smarty:org:sandbox:us");
    expect(c.params).toEqual({ license: "us-core-cloud" });
    expect(JSON.stringify(c.data)).not.toContain("license");
  });
});

describe("verifySmartyUsBatch", () => {
  it("POSTs the lookups as given, with no injected defaults", async () => {
    const { spy, requests } = setup();
    const lookups = [
      { street: "1 Santa Claus", city: "North Pole", state: "AK" },
      { addressee: "Apple Inc", street: "1 infinite loop", candidates: 10 },
    ];
    await requests.verifySmartyUsBatch("smarty:_:production", lookups, {
      license: "us-rooftop-geocoding-cloud",
    });
    const c = spy.mock.calls[0][0];
    expect(c.clientName).toBe("smarty:_:production:us");
    expect(c.requestName).toBe("smarty.us.verifyBatch");
    expect(c.method).toBe("POST");
    expect(c.url).toBe("/street-address");
    expect(c.params).toEqual({ license: "us-rooftop-geocoding-cloud" });
    expect(c.data).toEqual(lookups);
  });
});

describe("verifySmartyIntl", () => {
  it("GETs /verify, stripping empty values and stringifying", async () => {
    const { spy, requests } = setup();
    await requests.verifySmartyIntl(
      {
        country: "Brazil",
        address1: "Rua X 1",
        address2: "",
        geocode: "true",
        max_results: 3,
        license: "international-global-plus-cloud",
      },
      { organizationId: null }
    );
    const c = spy.mock.calls[0][0];
    expect(c.clientName).toBe("smarty:_:production:intl");
    expect(c.requestName).toBe("smarty.intl.verify");
    expect(c.method).toBe("GET");
    expect(c.url).toBe("/verify");
    expect(c.params).toEqual({
      country: "Brazil",
      address1: "Rua X 1",
      geocode: "true",
      max_results: "3",
      license: "international-global-plus-cloud",
    });
    expect(c.data).toBeUndefined();
  });

  it("falls back to options.license when the request has none", async () => {
    const { spy, requests } = setup();
    await requests.verifySmartyIntl(
      { country: "FRA", freeform: "x" },
      { organizationId: null, license: "L" }
    );
    expect(spy.mock.calls[0][0].params).toMatchObject({ license: "L" });
  });
});
