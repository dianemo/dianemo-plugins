import { createServer, type IncomingHttpHeaders, type Server } from "node:http";
import RequestHandler, { buildClientName, memoryBackend } from "@dianemo/core";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { generateKeyPairSync, verify } from "node:crypto";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { afterEach, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import google from "../src/index.js";

/**
 * The template tests read the built config; these run it through a real
 * `RequestHandler` and a local server, so they see whether core actually runs
 * the refresh interceptor (docs/google-api.md#service-account-jwt-bearer-flow).
 */

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

let server: Server | undefined;
let handler: RequestHandler | undefined;

afterEach(async () => {
  resetBinding();
  await handler?.stop();
  handler = undefined;
  await new Promise((r) => (server ? server.close(r) : r(undefined)));
  server = undefined;
});

interface Seen {
  url?: string;
  headers: IncomingHttpHeaders;
  body: string;
}

describe("google service account over the wire", () => {
  it("signs a fresh assertion at the token endpoint and sends the token", async () => {
    const seen: Seen[] = [];
    server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => {
        seen.push({
          url: req.url,
          headers: req.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        });
        res.setHeader("content-type", "application/json");
        res.end(
          req.url === "/token"
            ? JSON.stringify({ access_token: "sa-token", expires_in: 3600 })
            : JSON.stringify({ ok: true })
        );
      });
    });
    await new Promise<void>((r) => server?.listen(0, "127.0.0.1", r));
    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    handler.use(google);
    const creds = {
      instanceId: "sa",
      serviceAccountEmail: "sa@project.iam.gserviceaccount.com",
      privateKey: pem,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      tokenUrl: `${base}/token`,
      baseUrl: base,
    };
    await handler.addTemplateClient("google", creds);

    await handler.handleRequest({
      clientName: buildClientName("google", creds),
      requestName: "google.test.ping",
      method: "GET",
      url: "/ping",
    });

    const token = seen.find((s) => s.url === "/token");
    const api = seen.find((s) => s.url === "/ping");
    expect(token).toBeDefined();
    const form = new URLSearchParams(token?.body);
    expect(form.get("grant_type")).toBe(
      "urn:ietf:params:oauth:grant-type:jwt-bearer"
    );
    const assertion = form.get("assertion") ?? "";
    expect(assertion).not.toBe("");
    const [header, claims, signature] = assertion.split(".");
    const body = JSON.parse(Buffer.from(claims, "base64url").toString());
    expect(body.iss).toBe(creds.serviceAccountEmail);
    expect(body.aud).toBe(creds.tokenUrl);
    expect(body.scope).toBe(creds.scopes.join(" "));
    expect(
      verify(
        "RSA-SHA256",
        Buffer.from(`${header}.${claims}`),
        publicKey,
        Buffer.from(signature, "base64url")
      )
    ).toBe(true);
    expect(api?.headers.authorization).toBe("Bearer sa-token");
  });
});
