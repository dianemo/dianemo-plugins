import { searchHarmonizedCodes } from "../src/requests/harmonizedCode/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { afterEach, describe, expect, it } from "vitest";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import type { AddressInfo } from "node:net";
import { createServer } from "node:http";
import fedex from "../src/index.js";

afterEach(() => resetBinding());

// Goes through a real RequestHandler and a local server: the double slash is
// built in the template and sent by axios, neither of which a handleRequest
// mock would see.
describe("fedex token URL", () => {
  it.each(["", "/", "///"])(
    "requests /oauth/token, not //oauth/token, for a base URL ending in %j",
    async (suffix) => {
      const urls: string[] = [];
      const server = createServer((req, res) => {
        urls.push(req.url ?? "");
        req.resume();
        res.setHeader("content-type", "application/json");
        res.end(
          req.url?.endsWith("/oauth/token")
            ? JSON.stringify({ access_token: "tok", expires_in: 3600 })
            : JSON.stringify({ output: {} })
        );
      });
      await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
      const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}${suffix}`;
      try {
        const handler = new RequestHandler({
          key: TEST_KEY,
          backend: memoryBackend(),
        });
        handler.use(fedex);
        await handler.addTemplateClient(
          "fedex" as never,
          {
            instanceId: "production",
            clientId: "id",
            clientSecret: "secret",
            baseUrl,
          } as never
        );
        await searchHarmonizedCodes("fedex:_:production", {
          hsClassify: [
            { commodityDescription: "Shoes", originCountryCode: "IN" },
          ],
        });
        expect(urls).toContain("/oauth/token");
        expect(urls.filter((u) => u.startsWith("//"))).toEqual([]);
        await handler.stop();
      } finally {
        server.close();
      }
    }
  );
});
