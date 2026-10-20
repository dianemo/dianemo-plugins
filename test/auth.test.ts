import { sampleCredentials } from "./fixtures/sampleCredentials.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import type { RequestHandlerPlugin } from "@dianemo/core";
import { afterEach, describe, expect, it } from "vitest";
import { TEST_KEY } from "./fixtures/key.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a client this catalogue builds can actually obtain a token — the seam
 * the other three checks leave open. `allPlugins` proves a template registers,
 * `requestClientNames` stubs `handleRequest` before any token exchange, and
 * `verify:pack` composes without ever calling; all three stayed green through
 * six auth blockers.
 *
 * Assertions read the *resolved* client rather than any plugin's source, which
 * is the only level where a parent/`subClients` restructure and a flat client
 * look alike — so a refactor of either cannot quietly disarm them.
 */

const PACKAGES = join(import.meta.dirname, "..", "packages");

/**
 * Grants each vendor accepts at its token endpoint — a table rather than a
 * generic allowlist, because that is vendor knowledge and cannot be derived
 * from the config. eBay's client-credentials flow mints a real token that
 * simply cannot carry `sell.fulfillment`, and Google's endpoint rejects
 * `client_credentials` outright; a shape-only assertion passed both.
 *
 * A vendor absent here is asserted only against the generic rules below.
 * Adding or changing an entry is a claim about a vendor's OAuth service —
 * cite it in docs/oauth-grants.md, which holds the evidence for every row.
 */
const JWT_BEARER = "urn:ietf:params:oauth:grant-type:jwt-bearer";

const ACCEPTED_GRANTS: Record<string, string[]> = {
  google: ["authorization_code", "refresh_token", JWT_BEARER],
  googleVertexAi: ["authorization_code", "refresh_token", JWT_BEARER],
  ebay: ["client_credentials", "authorization_code", "refresh_token"],
  wayfair: ["client_credentials"],
  fedex: ["client_credentials"],
  extensiv: ["client_credentials"],
  helpscout: ["client_credentials"],
  ups: ["client_credentials"],
  usps: ["client_credentials"],
  walmart: ["client_credentials"],
};

/** The only placeholders core substitutes. Anything else ships as a literal. */
const CORE_PLACEHOLDERS = new Set(["clientId", "clientSecret", "refreshToken"]);

interface Registered {
  name: string;
  data: {
    name?: string;
    requestOptions?: { defaults?: { baseURL?: string } };
    authentication?: {
      type?: string;
      refreshConfig?: { url?: string; data?: Record<string, string> };
      grantRefreshConfig?: { url?: string; data?: Record<string, string> };
    };
    rateLimit?: { type?: string };
  };
}

interface Case {
  dir: string;
  template: string;
  credentials: Record<string, unknown>;
}

const TEMPLATES: Record<string, string> = {
  "plugin-amazon-spapi": "amazonSpapi",
  "plugin-channel-advisor": "channelAdvisor",
  "plugin-ebay": "ebay",
  "plugin-extensiv": "extensiv",
  "plugin-fedex": "fedex",
  "plugin-google": "google",
  "plugin-google-vertex-ai": "googleVertexAi",
  "plugin-helpscout": "helpscout",
  "plugin-labelary": "labelary",
  "plugin-mainfreight": "mainfreight",
  "plugin-newegg": "newegg",
  "plugin-open-exchange-rates": "openExchangeRates",
  "plugin-printnode": "printNode",
  "plugin-shopify": "shopify",
  "plugin-smarty": "smarty",
  "plugin-stripe": "stripe",
  "plugin-unis": "unis",
  "plugin-ups": "ups",
  "plugin-usps": "usps",
  "plugin-walmart": "walmart",
  "plugin-wayfair": "wayfair",
};

const CASES: Case[] = Object.entries(TEMPLATES).map(([dir, template]) => ({
  dir,
  template,
  credentials: sampleCredentials[dir],
}));

async function register(testCase: Case): Promise<Registered[]> {
  const mod = await import(join(PACKAGES, testCase.dir, "src", "index.ts"));
  const plugin = mod.default as RequestHandlerPlugin;

  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  handler.use(plugin);
  await handler.addTemplateClient(
    testCase.template as never,
    testCase.credentials as never
  );

  const clients = (handler as unknown as { clients: Map<string, unknown> })
    .clients;
  return [...clients.entries()]
    .filter(([name]) => name !== "default")
    .map(([name, client]) => ({
      name,
      data: (client as { sourceClientData: Registered["data"] })
        .sourceClientData,
    }));
}

afterEach(() => resetBinding());

describe("every plugin can obtain a token", () => {
  it("covers every plugin package", () => {
    const dirs = readdirSync(PACKAGES).filter(
      (d) => d.startsWith("plugin-") && d !== "plugin-kit"
    );
    expect(CASES.map((c) => c.dir).sort()).toEqual(dirs.sort());
  });

  describe.each(CASES.map((c) => [c.dir, c] as const))("%s", (_dir, tc) => {
    it("builds at least one client", async () => {
      expect((await register(tc)).length).toBeGreaterThan(0);
    });

    it("puts no unresolved placeholder on the wire", async () => {
      // An unsubstituted `{{…}}` reaches the vendor as a literal, and the
      // exchange then fails complaining about a malformed request rather than
      // about the config that caused it.
      for (const { name, data } of await register(tc)) {
        const placeholders = [
          ...JSON.stringify(data).matchAll(/\{\{([^}]*)\}\}/g),
        ].map((m) => m[1]);
        for (const placeholder of placeholders) {
          expect(
            CORE_PLACEHOLDERS.has(placeholder),
            `${name} ships "{{${placeholder}}}", which core does not substitute`
          ).toBe(true);
        }
      }
    });

    it("does not bootstrap a client-level refresh from {{refreshToken}}", async () => {
      // Legitimate in `grantRefreshConfig`, unseedable at the client level —
      // see docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh.
      // Two separate attempts at fixing other packages reproduced this, which
      // is why it is asserted rather than documented.
      for (const { name, data } of await register(tc)) {
        const clientLevel = JSON.stringify(
          data.authentication?.refreshConfig ?? {}
        );
        expect(
          clientLevel.includes("{{refreshToken}}"),
          `${name} uses {{refreshToken}} in a client-level refreshConfig, which ` +
            `nothing can seed. Put refresh_token in grantRefreshConfig and pass a grantId.`
        ).toBe(false);
      }
    });

    it("sends a grant type the vendor accepts", async () => {
      for (const { name, data } of await register(tc)) {
        const auth = data.authentication;
        if (auth?.type !== "oauth2") continue;
        for (const config of [auth.refreshConfig, auth.grantRefreshConfig]) {
          if (!config?.data) continue;

          // A missing `grant_type` is not a defect: unis drives a
          // username/password login through core's oauth2 refresh. An empty
          // body, however, mints nothing.
          expect(
            Object.keys(config.data).length,
            `${name} declares a refresh with an empty body`
          ).toBeGreaterThan(0);

          const grant = config.data.grant_type;
          const accepted = ACCEPTED_GRANTS[tc.template];
          if (grant && accepted) {
            expect(
              accepted,
              `${name} sends grant_type=${grant}, which ${tc.template} does not accept`
            ).toContain(grant);
          }
        }
      }
    });

    it("resolves every token URL", async () => {
      for (const { name, data } of await register(tc)) {
        const auth = data.authentication;
        if (auth?.type !== "oauth2") continue;
        for (const config of [auth.refreshConfig, auth.grantRefreshConfig]) {
          if (!config?.url) continue;
          expect(config.url, `${name} has an unresolved token URL`).not.toMatch(
            /\{\{|undefined/
          );
          expect(() => new URL(config.url!)).not.toThrow();
        }
      }
    });

    it("gives every leaf client a usable baseURL", async () => {
      // A parent owning auth for its children legitimately has no baseURL; a
      // leaf that requests dispatch against never does. Registered is not the
      // same as usable — `shopify:_:acme-store` was registered, and every call
      // against it died on `Invalid URL`.
      const clients = await register(tc);
      const names = clients.map((c) => c.name);
      for (const { name, data } of clients) {
        const isParent = names.some(
          (n) => n !== name && n.startsWith(`${name}:`)
        );
        if (isParent) continue;
        const baseURL = data.requestOptions?.defaults?.baseURL;
        expect(
          baseURL,
          `${name} is a leaf client with no baseURL, so every request against ` +
            `it fails with Invalid URL before dispatch`
        ).toBeTruthy();
        expect(() => new URL(baseURL!)).not.toThrow();
      }
    });

    it("meters every leaf client", async () => {
      // `noLimit` is allowed; silently defaulting to it is not. An unmetered
      // client in a rate-limiting library is a package whose reason to exist
      // is inert.
      const clients = await register(tc);
      const names = clients.map((c) => c.name);
      for (const { name, data } of clients) {
        const isParent = names.some(
          (n) => n !== name && n.startsWith(`${name}:`)
        );
        if (isParent) continue;
        expect(
          data.rateLimit,
          `${name} declares no rateLimit, so it silently defaults to noLimit`
        ).toBeDefined();
      }
    });
  });
});
