import { suggestSmartyUsAutocomplete } from "../src/requests/usAutocomplete/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";

afterEach(() => resetBinding());

describe("usAutocomplete", () => {
  it("sends every parameter as a query parameter, dropping undefined", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { suggestions: [] } } as never);
    handler.use(smarty);

    const out = await suggestSmartyUsAutocomplete("smarty:_:production", {
      search: "123 mai",
      max_results: 5,
      prefer_states: "UT",
      prefer_geolocation: "none",
      exclude: "po-box,cmra",
      source: undefined,
    });

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:usAutocomplete");
    expect(config.requestName).toBe(
      "smarty.usAutocomplete.suggestSmartyUsAutocomplete"
    );
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/v2/lookup");
    expect(config.params).toEqual({
      search: "123 mai",
      max_results: "5",
      prefer_states: "UT",
      prefer_geolocation: "none",
      exclude: "po-box,cmra",
    });
    expect(config.data).toBeUndefined();
    expect(out).toEqual({ suggestions: [] });
  });

  it("expands a group with selected alone", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: undefined } as never);
    handler.use(smarty);

    const out = await suggestSmartyUsAutocomplete("smarty:_:production", {
      selected: "AbcdEfGhiJ123kLmnOP",
    });

    expect(spy.mock.calls[0][0].params).toEqual({
      selected: "AbcdEfGhiJ123kLmnOP",
    });
    expect(out).toEqual({});
  });
});
