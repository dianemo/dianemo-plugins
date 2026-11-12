import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";
import {
  getSmartyIntlAutocompleteAddress,
  suggestSmartyIntlAddresses,
} from "../src/requests/intlAutocomplete/index.js";

afterEach(() => resetBinding());

const bind = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { candidates: [] } } as never);
  handler.use(smarty);
  return spy;
};

describe("intlAutocomplete", () => {
  it("suggests via GET /v2/lookup with params", async () => {
    const spy = bind();
    await suggestSmartyIntlAddresses("smarty:_:production", {
      country: "FRA",
      search: "Louis",
      include_only_locality: "Paris",
      max_results: undefined,
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:intlAutocomplete");
    expect(config.requestName).toBe(
      "smarty.intlAutocomplete.suggestSmartyIntlAddresses"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/v2/lookup");
    expect(config.params).toEqual({
      country: "FRA",
      search: "Louis",
      include_only_locality: "Paris",
    });
  });

  it("fetches an address by id in the path, keeping the id out of params", async () => {
    const spy = bind();
    await getSmartyIntlAutocompleteAddress("smarty:_:production", {
      address_id: "PD4D/PC8=",
      country: "CAN",
    });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:intlAutocomplete");
    expect(config.requestName).toBe(
      "smarty.intlAutocomplete.getSmartyIntlAutocompleteAddress"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/v2/lookup/PD4D%2FPC8%3D");
    expect(config.params).toEqual({ country: "CAN" });
  });
});
