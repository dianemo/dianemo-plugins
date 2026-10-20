import { sampleCredentials } from "./fixtures/sampleCredentials.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import type { RequestHandlerPlugin } from "@dianemo/core";
import { readdirSync, readFileSync } from "node:fs";
import { TEST_KEY } from "./fixtures/key.js";
import { join } from "node:path";

const PACKAGES = join(import.meta.dirname, "..", "packages");

const pluginDirs = readdirSync(PACKAGES)
  .filter((d) => d.startsWith("plugin-") && d !== "plugin-kit")
  .sort();

const newHandler = () =>
  new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });

const load = async (dir: string): Promise<RequestHandlerPlugin> => {
  const mod = await import(join(PACKAGES, dir, "src", "index.ts"));
  return mod.default as RequestHandlerPlugin;
};

afterEach(() => resetBinding());

describe("plugin catalogue", () => {
  it("found every plugin package", () => {
    expect(pluginDirs.length).toBe(21);
  });

  it("gives each plugin a name matching its package", () => {
    // Guards against a copy-paste port: two packages claiming one template name
    // would be refused at use() time, but only once someone composed both.
    const names = pluginDirs.map((d) => {
      const pkg = JSON.parse(
        readFileSync(join(PACKAGES, d, "package.json"), "utf8")
      );
      return pkg.name;
    });
    expect(new Set(names).size).toBe(names.length);
  });

  describe.each(pluginDirs)("%s", (dir) => {
    it("exports a plugin with a name and both halves", async () => {
      const plugin = await load(dir);
      expect(typeof plugin.name).toBe("string");
      expect(plugin.name.length).toBeGreaterThan(0);
      // A template name occupies the first `:`-delimited segment of a client
      // name, so a colon would shift every later segment.
      expect(plugin.name).not.toContain(":");
      expect(typeof plugin.registerTemplate).toBe("function");
      expect(typeof plugin.createRequests).toBe("function");
    });

    it("composes onto a handler and yields a namespace", async () => {
      const plugin = await load(dir);
      const handler = newHandler();
      const namespaces = handler.use(plugin) as Record<string, unknown>;

      expect(handler.getRegisteredPlugins()).toEqual([plugin.name]);
      expect(namespaces[plugin.name]).toBeDefined();
    });

    it("has sample credentials", () => {
      // A new plugin cannot skip the build check below by omitting its entry.
      expect(sampleCredentials[dir]).toBeDefined();
    });

    it("builds a client from sample credentials", async () => {
      const plugin = await load(dir);
      const handler = newHandler();
      handler.use(plugin);
      await handler.start();
      try {
        // The JSON round-trip path: the same one a stored credential takes.
        await handler.addTemplateClient(
          plugin.name as never,
          sampleCredentials[dir] as never
        );
        const clients = handler
          .getLoadedClients()
          .filter((c) => c.name.startsWith(`${plugin.name}:`));
        expect(clients.length).toBeGreaterThan(0);
        for (const client of clients) {
          expect(Array.isArray(client.rateLimit)).toBe(true);
        }
      } finally {
        await handler.stop();
      }
    });

    it("registers at least one client template", async () => {
      const plugin = await load(dir);
      const handler = newHandler();
      const registered: string[] = [];
      vi.spyOn(handler, "registerClientTemplate").mockImplementation(
        async (name) => {
          registered.push(name as string);
        }
      );

      await plugin.registerTemplate(handler);
      expect(registered.length).toBeGreaterThan(0);
      // The plugin's declared name must be one of the templates it registers,
      // otherwise credentials filed under that name reach no builder.
      expect(registered).toContain(plugin.name);
    });
  });

  it("registers every plugin onto one handler without collision", async () => {
    const plugins = await Promise.all(pluginDirs.map(load));
    const handler = newHandler();
    const namespaces = handler.use(...plugins) as Record<string, unknown>;

    expect(handler.getRegisteredPlugins().sort()).toEqual(
      plugins.map((p) => p.name).sort()
    );
    for (const plugin of plugins) {
      expect(namespaces[plugin.name]).toBeDefined();
    }
  });
});
