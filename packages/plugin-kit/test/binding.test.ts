import RequestHandler, { memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { afterEach, describe, expect, it } from "vitest";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import * as dist from "@dianemo/plugin-kit";
import {
  acquireLock,
  backend,
  bindTryHandleRequest,
  currentHandler,
  LOCK_TTL_MS,
  pluginKey,
  releaseLock,
  tryHandleRequest,
} from "../src/index.js";

const newHandler = (keyPrefix?: string) =>
  new RequestHandler({ key: TEST_KEY, backend: memoryBackend(), keyPrefix });

/** What a plugin's `createRequests` receives, minus the fields kit ignores. */
const ctx = (handler: RequestHandler) =>
  ({
    handler,
    backend: memoryBackend(),
    tryHandleRequest: async () => ({ ok: true }),
    logger: { info() {}, warn() {}, error() {}, debug() {} },
  }) as never;

afterEach(() => resetBinding());

describe("bindTryHandleRequest", () => {
  it("refuses a second handler", () => {
    const first = newHandler();
    bindTryHandleRequest(ctx(first));
    expect(() => bindTryHandleRequest(ctx(newHandler()))).toThrow(
      /different RequestHandler/
    );
    expect(currentHandler()).toBe(first);
  });

  it("accepts a rebind to the same handler", () => {
    // One handler composing 21 plugins binds 21 times.
    const handler = newHandler();
    bindTryHandleRequest(ctx(handler));
    expect(() => bindTryHandleRequest(ctx(handler))).not.toThrow();
  });

  it("keeps its binding in the v2 slot", () => {
    const slots = globalThis as unknown as Record<symbol, unknown>;
    bindTryHandleRequest(ctx(newHandler()));
    expect(slots[Symbol.for("@dianemo/plugin-kit.binding.v2")]).toBeDefined();
    expect(slots[Symbol.for("@dianemo/plugin-kit.binding.v1")]).toBeUndefined();
  });

  it("refuses a second handler across two copies of this package", () => {
    // `../src` and the resolved `@dianemo/plugin-kit` are genuinely distinct
    // module instances, so this exercises two real copies rather than a mock of
    // two. Under the old module-scoped binding each copy held its own state and
    // the guard failed open — the silent misrouting it promises to refuse.
    expect(dist.bindTryHandleRequest).not.toBe(bindTryHandleRequest);

    const first = newHandler();
    bindTryHandleRequest(ctx(first));
    expect(() => dist.bindTryHandleRequest(ctx(newHandler()))).toThrow(
      /different RequestHandler/
    );
    expect(dist.currentHandler()).toBe(first);
  });
});

describe("before registration", () => {
  it("fails loudly on tryHandleRequest", () => {
    expect(() => tryHandleRequest({} as never, "code", "message")).toThrow(
      /before registration/
    );
  });

  it("fails loudly on backend", () => {
    expect(() => backend()).toThrow(/before registration/);
  });

  it("fails loudly on pluginKey", () => {
    expect(() => pluginKey("usps", "token")).toThrow(/before registration/);
  });
});

describe("pluginKey", () => {
  it("namespaces by plugin so two plugins cannot collide", () => {
    bindTryHandleRequest(ctx(newHandler()));
    expect(pluginKey("usps", "paymentToken")).not.toBe(
      pluginKey("ups", "paymentToken")
    );
  });

  it("folds in the handler's keyPrefix", () => {
    // Staging and production on one Redis, separated only by `keyPrefix`: keys
    // ignoring it shared the USPS mint lock and each other's payment tokens.
    const staging = newHandler("staging");
    bindTryHandleRequest(ctx(staging));
    const stagingKey = pluginKey("usps", "paymentToken");
    expect(stagingKey).toContain("staging");

    resetBinding();
    bindTryHandleRequest(ctx(newHandler("production")));
    expect(pluginKey("usps", "paymentToken")).not.toBe(stagingKey);
  });
});

describe("locks", () => {
  it("grants one holder and refuses the rest", async () => {
    bindTryHandleRequest(ctx(newHandler()));
    const tokens = await Promise.all(
      Array.from({ length: 5 }, () => acquireLock("usps", "mint"))
    );
    expect(tokens.filter((t) => t !== null)).toHaveLength(1);
  });

  it("releases only for the holder's own token", async () => {
    bindTryHandleRequest(ctx(newHandler()));
    const token = await acquireLock("usps", "mint");
    expect(token).not.toBeNull();

    expect(await releaseLock("usps", "mint", "not-the-token")).toBe(false);
    expect(await releaseLock("usps", "mint", token!)).toBe(true);
    expect(await acquireLock("usps", "mint")).not.toBeNull();
  });

  it("scopes a lock to its plugin", async () => {
    bindTryHandleRequest(ctx(newHandler()));
    expect(await acquireLock("usps", "mint")).not.toBeNull();
    expect(await acquireLock("ups", "mint")).not.toBeNull();
  });

  it("exports its TTL so callers need not duplicate the literal", () => {
    // plugin-usps sizes its wait deadline against this; a copy would drift.
    expect(LOCK_TTL_MS).toBeGreaterThan(0);
  });
});
