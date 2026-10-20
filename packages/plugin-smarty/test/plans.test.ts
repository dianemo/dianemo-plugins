import RequestHandler, { memoryBackend } from "@dianemo/core";
import { registerSmartyTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { describe, expect, it } from "vitest";

const creds = {
  instanceId: "main",
  baseUrl: "https://example.invalid",
  authId: "id",
  authToken: "token",
};

const limit = (n: number) => ({
  type: "requestLimit",
  interval: 1_000,
  tokensToAdd: n,
  maxTokens: n,
});

async function newHandler() {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  await registerSmartyTemplate(handler);
  return handler;
}

describe("smarty rate-limit plan", () => {
  it("offers the professional tier", async () => {
    const handler = await newHandler();
    expect(handler.getRateLimitOptions("smarty")).toEqual(["professional"]);
  });

  it("meters each surface against its own published limit", async () => {
    const handler = await newHandler();
    await handler.addLocalTemplateClient("smarty", creds);

    const loaded = Object.fromEntries(
      handler.getLoadedClients().map((c) => [c.name, c.rateLimit])
    );
    expect(loaded["smarty:_:main:us"]).toEqual([
      expect.objectContaining(limit(25_000)),
    ]);
    expect(loaded["smarty:_:main:intl"]).toEqual([
      expect.objectContaining(limit(3_500)),
    ]);
    // Core gives a client that declares nothing an unmetered placeholder.
    expect(loaded["smarty:_:main"]).toEqual([
      expect.objectContaining({ type: "noLimit" }),
    ]);
  });

  it("rejects a tier the template does not declare", async () => {
    const handler = await newHandler();
    await expect(
      handler.addLocalTemplateClient("smarty", creds, {
        rateLimitOption: "nope",
      })
    ).rejects.toMatchObject({ code: "unknown_rate_limit_option" });
  });
});
