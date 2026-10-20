import RequestHandler, { buildClientName, memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import type { RequestHandlerPlugin } from "@dianemo/core";
import { afterEach, describe, expect, it } from "vitest";
import { TEST_KEY } from "./fixtures/key.js";
import { join } from "node:path";

/**
 * `allPlugins.test.ts` proves a plugin registers a template; it never proves a
 * request function targets a client that template actually built. Three plugins
 * shipped names from an earlier convention — `newegg:getOrders` where the client
 * is `newegg:_:main:getOrders` — and every call raised ClientNotFoundError while
 * the suite stayed green.
 */

const PACKAGES = join(import.meta.dirname, "..", "packages");

interface Case {
  /** Package directory under packages/. */
  dir: string;
  /** Template to register credentials against. */
  template: string;
  credentials: Record<string, unknown>;
  /** Drives one request function. `client` is the name a caller would build. */
  call: (requests: any, client: string) => unknown;
}

const base = { instanceId: "main", baseUrl: "https://example.invalid" };
const oauth = { ...base, clientId: "id", clientSecret: "secret" };
const token = { ...base, token: "tok" };

const CASES: Case[] = [
  {
    dir: "plugin-amazon-spapi",
    template: "amazonSpapi",
    credentials: oauth,
    call: (r, c) =>
      r.getOrders(c, "us-east-1", { marketplaceIds: "ATVPDKIKX0DER" }),
  },
  {
    dir: "plugin-channel-advisor",
    template: "channelAdvisor",
    credentials: oauth,
    call: (r, c) => r.getOrders(c),
  },
  {
    dir: "plugin-ebay",
    template: "ebay",
    credentials: {
      ...oauth,
      scopeList: "https://api.ebay.com/oauth/api_scope",
    },
    call: (r, c) => r.getOrders(c, { grantId: "g" }),
  },
  {
    dir: "plugin-extensiv",
    template: "extensiv",
    credentials: { ...oauth, userLogin: "user" },
    call: (r, c) => r.getOrders(c),
  },
  {
    dir: "plugin-fedex",
    template: "fedex",
    credentials: oauth,
    call: (r, c) => r.cancelShipment(c, { trackingNumber: "1" }),
  },
  {
    dir: "plugin-google",
    template: "google",
    credentials: oauth,
    call: (r, c) =>
      r.validateAddress(c, { address: { addressLines: ["1 Main St"] } }),
  },
  {
    dir: "plugin-google-vertex-ai",
    template: "googleVertexAi",
    credentials: oauth,
    call: (r, c) => r.getAnswer(c, "hello", { grantId: "g" }),
  },
  {
    dir: "plugin-helpscout",
    template: "helpscout",
    credentials: oauth,
    call: (r, c) => r.getConversation(c, 1),
  },
  {
    dir: "plugin-labelary",
    template: "labelary",
    credentials: base,
    call: (r, c) => r.convertZPL(c, { zpl: "^XA^XZ" }),
  },
  {
    dir: "plugin-mainfreight",
    template: "mainfreight",
    credentials: token,
    call: (r, c) => r.getInventory(c, "nz", {}),
  },
  {
    dir: "plugin-newegg",
    template: "newegg",
    credentials: { ...token, secretKey: "s", sellerId: "A1" },
    call: (r, c) => r.getOrders(c, {}),
  },
  {
    dir: "plugin-open-exchange-rates",
    template: "openExchangeRates",
    credentials: token,
    call: (r) => r.getLatestRates({ alias: "main" }, {}),
  },
  {
    dir: "plugin-printnode",
    template: "printNode",
    credentials: token,
    call: (r, c) => r.getAllPrinters(c),
  },
  {
    dir: "plugin-shopify",
    template: "shopify",
    credentials: token,
    call: (r, c) => r.orders.getMany(c, {}),
  },
  {
    dir: "plugin-smarty",
    template: "smarty",
    credentials: { ...base, authId: "id", authToken: "tok" },
    call: (r) => r.verifySmartyUs({ street: "1 Main St" }, { alias: "main" }),
  },
  {
    dir: "plugin-stripe",
    template: "stripe",
    credentials: { ...base, apiKey: "sk_test", webhookSecret: "whsec" },
    call: (r, c) => r.customers.retrieve(c, "cus_1"),
  },
  {
    dir: "plugin-unis",
    template: "unis",
    credentials: {
      ...base,
      username: "u",
      password: "p",
      companyId: "c",
      customerId: "cu",
    },
    call: (r, c) => r.getOrdersHeadLevel(c, {}),
  },
  {
    dir: "plugin-ups",
    template: "ups",
    credentials: oauth,
    call: (r, c) => r.getUpsRate(c, { RateRequest: { Shipment: {} } }),
  },
  {
    dir: "plugin-usps",
    template: "usps",
    credentials: { ...oauth, crid: "1", mid: "2" },
    call: (r, c) => r.getBaseRatesList(c, {}),
  },
  {
    dir: "plugin-walmart",
    template: "walmart",
    credentials: { ...oauth, partnerId: "p" },
    call: (r, c) => r.getItems(c, {}),
  },
  {
    dir: "plugin-wayfair",
    template: "wayfair",
    credentials: oauth,
    call: (r, c) => r.getInventory(c),
  },
];

const STUB = "__client-name-probe__";

afterEach(() => resetBinding());

describe("request functions target registered clients", () => {
  it("covers every plugin that exposes request functions", async () => {
    // Every plugin ships request functions, so this tracks the package count
    // exactly. A template-only plugin — one that registers a client and lets
    // callers drive it through the handler's generic surface — is exempt, and
    // then these two numbers differ. Say so here rather than skipping silently.
    expect(CASES.length).toBe(21);
  });

  it.each(CASES.map((c) => [c.dir, c] as const))(
    "%s",
    async (_dir, testCase) => {
      const mod = await import(join(PACKAGES, testCase.dir, "src", "index.ts"));
      const plugin = mod.default as RequestHandlerPlugin;

      const handler = new RequestHandler({
        key: TEST_KEY,
        backend: memoryBackend(),
      });
      const namespaces = handler.use(plugin) as Record<string, any>;
      await handler.addTemplateClient(
        testCase.template as never,
        testCase.credentials as never
      );

      const clients = (handler as any).clients as Map<string, any>;
      const registered = new Set(clients.keys() as Iterable<string>);

      // Intercepted where the name resolves, so nothing leaves the process and
      // the assertion is about the name rather than a vendor response.
      const seen: string[] = [];
      (handler as any).handleRequest = async (config: {
        clientName: string;
      }) => {
        seen.push(config.clientName);
        throw new Error(STUB);
      };

      // Bare, with no sub-client segment: no plugin makes the caller know its
      // sub-client layout any more. google did, and passing `:profile` to
      // `validateAddress` silently sent the request to the wrong host.
      const client = buildClientName(
        testCase.template,
        testCase.credentials as never
      );

      try {
        await testCase.call(namespaces[plugin.name], client);
      } catch (error) {
        if (!String(error).includes(STUB) && seen.length === 0) throw error;
      }

      expect(seen.length).toBeGreaterThan(0);
      for (const name of seen) {
        expect(
          registered.has(name),
          `${plugin.name} requested client "${name}", which no template registered. Registered names look like ${[...registered].filter((n) => n !== "default")[0]}.`
        ).toBe(true);

        // Registered is not usable. `shopify:_:acme-store` was registered — as
        // the parent owning auth for a `:graph-ql` child — and carried neither a
        // baseURL nor a rate limit, so every documented call died on
        // `Invalid URL` and any that survived would have run unmetered.
        const client = clients.get(name);
        const baseURL = client?.sourceClientData?.requestOptions?.defaults
          ?.baseURL as string | undefined;
        expect(
          baseURL,
          `${plugin.name} requested client "${name}", which is registered but has no baseURL — every call against it fails with Invalid URL. It is probably a parent that owns auth for its sub-clients; target the sub-client instead.`
        ).toBeTruthy();
        expect(
          client?.sourceClientData?.rateLimit,
          `${plugin.name} requested client "${name}", which declares no rateLimit and so silently defaults to noLimit.`
        ).toBeDefined();
      }
    }
  );
});
