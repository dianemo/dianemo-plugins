import { signServiceAccountAssertion } from "../src/serviceAccount.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { generateKeyPairSync, verify } from "node:crypto";
import { registerGoogleTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { describe, expect, it, vi } from "vitest";

const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const TOKEN_URL = "https://oauth2.example.test/token";
const EMAIL = "sa@project.iam.gserviceaccount.com";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const decode = (part: string) =>
  JSON.parse(Buffer.from(part, "base64url").toString("utf8"));

// The built client is core's own shape, read loosely on purpose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;

async function build(creds: Record<string, unknown>): Promise<Loose[]> {
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
  await registerGoogleTemplate(handler);
  return builder?.({ instanceId: "main", ...creds }) as Loose[];
}

describe("signServiceAccountAssertion", () => {
  it("signs an RS256 assertion Google accepts", () => {
    const jwt = signServiceAccountAssertion({
      serviceAccountEmail: EMAIL,
      privateKey: pem,
      scopes: [SCOPE],
      tokenUrl: TOKEN_URL,
    });
    const [header, claims, signature] = jwt.split(".");
    expect(decode(header)).toEqual({ alg: "RS256", typ: "JWT" });
    const body = decode(claims);
    expect(body.iss).toBe(EMAIL);
    expect(body.scope).toBe(SCOPE);
    expect(body.aud).toBe(TOKEN_URL);
    expect(body.exp - body.iat).toBe(3600);
    expect(
      verify(
        "RSA-SHA256",
        Buffer.from(`${header}.${claims}`),
        publicKey,
        Buffer.from(signature, "base64url")
      )
    ).toBe(true);
  });

  it("pins iat and exp to the given time", () => {
    const jwt = signServiceAccountAssertion({
      serviceAccountEmail: EMAIL,
      privateKey: pem,
      scopes: [SCOPE],
      tokenUrl: TOKEN_URL,
      now: new Date("2026-01-01T00:00:00Z"),
    });
    const body = decode(jwt.split(".")[1]);
    expect(body.iat).toBe(1767225600);
    expect(body.exp).toBe(1767229200);
  });

  it("joins several scopes with a space", () => {
    const jwt = signServiceAccountAssertion({
      serviceAccountEmail: EMAIL,
      privateKey: pem,
      scopes: ["a", "b"],
      tokenUrl: TOKEN_URL,
    });
    expect(decode(jwt.split(".")[1]).scope).toBe("a b");
  });

  it("unescapes \\n in a private key copied from JSON", () => {
    const escaped = pem.replace(/\n/g, "\\n");
    expect(escaped).not.toContain("\n");
    const jwt = signServiceAccountAssertion({
      serviceAccountEmail: EMAIL,
      privateKey: escaped,
      scopes: [SCOPE],
      tokenUrl: TOKEN_URL,
    });
    const [header, claims, signature] = jwt.split(".");
    expect(
      verify(
        "RSA-SHA256",
        Buffer.from(`${header}.${claims}`),
        publicKey,
        Buffer.from(signature, "base64url")
      )
    ).toBe(true);
  });
});

describe("google template with a service account", () => {
  it("template refuses a service account combined with an OAuth pair", async () => {
    await expect(
      build({
        serviceAccountEmail: EMAIL,
        privateKey: pem,
        scopes: [SCOPE],
        clientId: "id",
        clientSecret: "secret",
      })
    ).rejects.toThrow(/service account/i);
  });

  it.each([
    ["no scopes", { scopes: undefined }],
    ["empty scopes", { scopes: [] }],
  ])("refuses a service account with %s", async (_n, extra) => {
    await expect(
      build({ serviceAccountEmail: EMAIL, privateKey: pem, ...extra })
    ).rejects.toThrow("a service account needs at least one scope");
  });

  it.each([
    ["email only", { serviceAccountEmail: EMAIL }],
    ["key only", { privateKey: pem }],
  ])("refuses a partial service account (%s)", async (_n, part) => {
    await expect(build({ scopes: [SCOPE], ...part })).rejects.toThrow(
      "serviceAccountEmail and privateKey must be given together"
    );
  });

  it("template with a service account has no grantRefreshConfig and no profile sub-client", async () => {
    const [client] = await build({
      serviceAccountEmail: EMAIL,
      privateKey: pem,
      scopes: [SCOPE],
      tokenUrl: TOKEN_URL,
      baseUrl: "https://example.test",
    });
    const auth = client.authentication;
    expect(auth.type).toBe("oauth2");
    expect(auth.clientId).toBe(EMAIL);
    expect(auth.clientSecret).toBe("");
    expect(auth.grantRefreshConfig).toBeUndefined();
    expect(auth.refreshConfig.url).toBe(TOKEN_URL);
    expect(auth.refreshConfig.dataLocation).toBe("urlEncodedForm");
    expect(Object.keys(auth.refreshConfig)).toContain("requestInterceptor");
    const names = client.subClients.map((s: Loose) => s.name);
    expect(names).not.toContain("profile");
    expect(names).toContain("addressValidation");
  });
});
