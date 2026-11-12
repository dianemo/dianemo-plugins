import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as family from "../src/requests/smartPickup/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";

const plugin = definePlugin({
  name: "ups",
  registerTemplate: async () => {},
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return family;
  },
});

const CASES = [
  ["manageSmartPickupTrigger", "/smart-trigger"],
  ["viewSmartPickupInfo", "/view"],
  ["updateSmartPickupInfo", "/update"],
] as const;

describe("plugin-ups smartPickup family", () => {
  it.each(CASES)("%s posts the body to %s", async (name, path) => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);
    const { ups } = handler.use(plugin);
    const body = { any: "body" };
    const result = await (
      ups[name] as (c: string, d: unknown) => Promise<unknown>
    )(CLIENT, body);

    expect(result).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(`ups.smartPickup.${name}`);
    expect(config.method).toBe("POST");
    expect(config.url).toBe(`/api/account/pickup-info/v1${path}`);
    expect(config.data).toBe(body);
  });

  it("exposes exactly three functions", () => {
    expect(Object.keys(family).sort()).toEqual(CASES.map(([n]) => n).sort());
  });
});
