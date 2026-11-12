import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { upsSubClient } from "../src/requests/utils.js";
import { forwardingBaseUrl } from "../src/client.js";
import ups from "../src/index.js";

afterEach(() => resetBinding());

const PROD = "https://onlinetools.ups.com";
const CIE = "https://wwwcie.ups.com";

// The built client is core's own shape, read loosely on purpose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;
type Built = Array<Record<string, Loose>>;

async function build(creds: Record<string, unknown>): Promise<Built> {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  let builder: ((c: unknown) => unknown) | undefined;
  vi.spyOn(handler, "registerClientTemplate").mockImplementation(
    async (_n, b) => {
      builder = b as (c: unknown) => unknown;
    }
  );
  await ups.registerTemplate(handler);
  return builder?.({
    instanceId: "main",
    clientId: "id",
    clientSecret: "secret",
    baseUrl: PROD,
    ...creds,
  }) as Built;
}

describe("ups client template", () => {
  it("keeps the v1.0.0 client name, base URL and rate limit", async () => {
    const [client] = await build({});
    expect(client.name).toBe("ups:_:main");
    expect(client.requestOptions.defaults.baseURL).toBe(PROD);
    expect(client.rateLimit).toEqual([
      {
        type: "requestLimit",
        interval: 1000,
        tokensToAdd: 5,
        maxTokens: 5,
      },
    ]);
  });

  it("sends transactionSrc, defaulting to dianemo", async () => {
    const [def] = await build({});
    expect(def.requestOptions.defaults.headers.transactionSrc).toBe("dianemo");
    const [own] = await build({ transactionSrc: "acme" });
    expect(own.requestOptions.defaults.headers.transactionSrc).toBe("acme");
  });

  it("derives a 32-character transId from the request id", async () => {
    const [client] = await build({});
    const out = client.requestOptions.requestInterceptor({
      headers: { a: "b" },
      requestId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(out.headers.transId).toBe("123e4567e89b12d3a456426614174000");
    expect(out.headers.transId).toHaveLength(32);
    expect(out.headers.a).toBe("b");
  });

  it("keeps a transId the request set itself", async () => {
    const [client] = await build({});
    const out = client.requestOptions.requestInterceptor({
      headers: { transId: "SUPER14" },
      requestId: "123e4567-e89b-12d3-a456-426614174000",
    });
    // Delivery Intercept caps transId at 14, so its functions send their own.
    expect(out.headers.transId).toBe("SUPER14");
  });

  describe("client_credentials", () => {
    it("posts the documented token request", async () => {
      const [client] = await build({});
      expect(client.authentication).toMatchObject({
        type: "oauth2",
        clientId: "id",
        clientSecret: "secret",
        refreshConfig: {
          url: `${PROD}/security/v1/oauth/token`,
          useBasicAuth: true,
          dataLocation: "urlEncodedForm",
          data: { grant_type: "client_credentials" },
        },
      });
    });

    it("sends x-merchant-id only when a merchantId is supplied", async () => {
      const [without] = await build({});
      expect(
        without.authentication.refreshConfig.customHeaders
      ).toBeUndefined();
      const [withId] = await build({ merchantId: "123456" });
      expect(withId.authentication.refreshConfig.customHeaders).toEqual({
        "x-merchant-id": "123456",
      });
    });

    it("targets the CIE token endpoint for a CIE base URL", async () => {
      const [client] = await build({ baseUrl: CIE });
      expect(client.authentication.refreshConfig.url).toBe(
        `${CIE}/security/v1/oauth/token`
      );
    });
  });

  describe("forwarding sub-client", () => {
    it("is declared on the parent, which keeps its own baseURL", async () => {
      const [client] = await build({});
      expect(client.subClients).toHaveLength(1);
      expect(client.subClients[0].name).toBe("forwarding");
      expect(client.requestOptions.defaults.baseURL).toBe(PROD);
    });

    it("carries its own host and a declared rate limit", async () => {
      const [client] = await build({});
      const [sub] = client.subClients;
      expect(sub.requestOptions.defaults.baseURL).toBe(
        "https://www.onlinetools.ups.com"
      );
      expect(sub.rateLimit).toEqual(client.rateLimit);
    });

    it("maps hosts, leaving unknown ones alone", () => {
      expect(forwardingBaseUrl(PROD)).toBe("https://www.onlinetools.ups.com");
      expect(forwardingBaseUrl(CIE)).toBe("https://www.onlinetoolsuat.ups.com");
      expect(forwardingBaseUrl("https://proxy.example.com")).toBe(
        "https://proxy.example.com"
      );
    });

    it("returns a base URL it cannot parse untouched instead of throwing", () => {
      expect(forwardingBaseUrl("onlinetools.ups.com")).toBe(
        "onlinetools.ups.com"
      );
      expect(forwardingBaseUrl("")).toBe("");
    });

    it("registers with a scheme-less base URL", async () => {
      const [client] = await build({ baseUrl: "onlinetools.ups.com" });
      expect(client.subClients[0].requestOptions.defaults.baseURL).toBe(
        "onlinetools.ups.com"
      );
    });

    it("names the client the way core joins sub-clients", () => {
      expect(upsSubClient("ups:_:main", "forwarding")).toBe(
        "ups:_:main:forwarding"
      );
    });

    it("merges so the sub-client inherits auth, headers and interceptor", async () => {
      const handler = new RequestHandler({
        key: TEST_KEY,
        backend: memoryBackend(),
      });
      await ups.registerTemplate(handler);
      await handler.start();
      await handler.addTemplateClient("ups", {
        instanceId: "main",
        clientId: "id",
        clientSecret: "secret",
        baseUrl: CIE,
      });
      const clients = (handler as Loose).clients as Map<string, Loose>;
      const parent = clients.get("ups:_:main").getSourceClientData();
      const sub = clients.get("ups:_:main:forwarding").getSourceClientData();
      expect(parent.requestOptions.defaults.baseURL).toBe(CIE);
      expect(sub.requestOptions.defaults.baseURL).toBe(
        "https://www.onlinetoolsuat.ups.com"
      );
      expect(sub.requestOptions.defaults.headers.transactionSrc).toBe(
        "dianemo"
      );
      expect(typeof sub.requestOptions.requestInterceptor).toBe("function");
      expect(sub.authentication).toEqual(parent.authentication);
      expect(sub.authOwnerName).toBe("ups:_:main");
      await handler.stop?.();
    });
  });
});
