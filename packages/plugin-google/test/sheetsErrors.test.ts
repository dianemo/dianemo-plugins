import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import type { CellData, Spreadsheet } from "../src/index.js";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { registerGoogleTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import type { Server } from "node:http";
import google from "../src/index.js";
import { AxiosError } from "axios";
import {
  pem,
  startServer,
  serviceAccountCreds,
} from "./support/serviceAccountServer.js";
import RequestHandler, {
  buildClientName,
  memoryBackend,
  RequestError,
} from "@dianemo/core";

const CLIENT = "google:_:main";

let server: Server | undefined;
let handler: RequestHandler | undefined;

afterEach(async () => {
  resetBinding();
  await handler?.stop();
  handler = undefined;
  await new Promise((r) => (server ? server.close(r) : r(undefined)));
  server = undefined;
});

const mocked = () => {
  const h = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
  const spy = vi
    .spyOn(h, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { google: requests } = h.use(google);
  return { spy, requests };
};

const failWith = (status: number, body: unknown) => {
  const { spy, requests } = mocked();
  const error = new AxiosError("failed");
  error.response = {
    status,
    statusText: "x",
    headers: {},
    config: {} as never,
    data: body,
  };
  spy.mockRejectedValue(error);
  return requests;
};

const caught = async (p: Promise<unknown>) =>
  (await p.catch((e: unknown) => e)) as RequestError;

describe("insufficient scope", () => {
  it.each([
    [
      "ErrorInfo details",
      {
        error: {
          code: 403,
          status: "PERMISSION_DENIED",
          details: [{ reason: "ACCESS_TOKEN_SCOPE_INSUFFICIENT" }],
        },
      },
    ],
    [
      "errors[]",
      {
        error: {
          code: 403,
          errors: [{ reason: "insufficientPermissions" }],
        },
      },
    ],
  ])("maps a 403 with %s to GGL_0012 naming the scope", async (_n, body) => {
    const err = await caught(failWith(403, body).getSpreadsheet(CLIENT, "abc"));
    expect(err.code).toBe("GGL_0012");
    expect(err.statusCode).toBe(403);
    expect(err.message).toContain("auth/spreadsheets");
    expect(err.message).toContain("spreadsheets.readonly");
  });

  it("leaves a plain 403 as GGL_0009", async () => {
    const err = await caught(
      failWith(403, { error: { status: "PERMISSION_DENIED" } }).getSpreadsheet(
        CLIENT,
        "abc"
      )
    );
    expect(err.code).toBe("GGL_0009");
  });
});

describe("a failed sign-in", () => {
  const signIn = async (status: number, body: unknown) => {
    const s = await startServer({ token: () => ({ status, body }) });
    server = s.server;
    handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    const { google: requests } = handler.use(google);
    const creds = serviceAccountCreds(s.base);
    await handler.addTemplateClient("google", creds);
    const err = await caught(
      requests.getSpreadsheet(buildClientName("google", creds), "abc")
    );
    return { err, hits: s.hits };
  };

  it("reports a token 400 invalid_grant as GGL_0013, not a Sheets error", async () => {
    const { err, hits } = await signIn(400, {
      error: "invalid_grant",
      error_description: "Invalid JWT Signature.",
    });
    expect(err.code).toBe("GGL_0013");
    expect(err.message).toBe("Google sign-in failed");
    expect(err.metadata?.oauthError).toBe("invalid_grant");
    expect(err.metadata?.oauthErrorDescription).toBe("Invalid JWT Signature.");
    expect(hits.some((h) => h.url?.startsWith("/v4/"))).toBe(false);
    // Nothing of the signed request or the key travels with the error.
    const dump = JSON.stringify(err.metadata);
    expect(dump).not.toContain("assertion");
    expect(dump).not.toContain("PRIVATE KEY");
    expect(dump).not.toContain(pem.slice(40, 80));
  });

  it("reports a token 401 invalid_client as GGL_0013", async () => {
    const { err } = await signIn(401, { error: "invalid_client" });
    expect(err.code).toBe("GGL_0013");
    expect(err.metadata?.oauthError).toBe("invalid_client");
    expect(err.metadata?.oauthErrorDescription).toBeUndefined();
  });
});

describe("zeteo's path", () => {
  it("signs in at the token URL, then getSpreadsheet through sheetsRead carries the bearer", async () => {
    const s = await startServer({
      api: () => ({ status: 200, body: { spreadsheetId: "abc" } }),
    });
    server = s.server;
    handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    const { google: requests } = handler.use(google);
    const creds = serviceAccountCreds(s.base, "zeteo");
    await handler.addTemplateClient("google", creds);

    const res = await requests.getSpreadsheet(
      buildClientName("google", creds),
      "abc",
      { fields: "spreadsheetId" }
    );
    expect(res).toEqual({ spreadsheetId: "abc" });
    const api = s.hits.find((h) => h.url?.startsWith("/v4/spreadsheets/abc"));
    expect(api?.url).toBe("/v4/spreadsheets/abc?fields=spreadsheetId");
    expect(api?.headers.authorization).toBe("Bearer sa-token");
  });

  it("signs a new assertion (a later iat) on a second refresh", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      let n = 0;
      const s = await startServer({
        // Already expired on arrival, so the next call must refresh again.
        token: () => ({
          status: 200,
          body: { access_token: `t${++n}`, expires_in: 1 },
        }),
      });
      server = s.server;
      handler = new RequestHandler({
        key: TEST_KEY,
        backend: memoryBackend(),
      });
      const { google: requests } = handler.use(google);
      const creds = serviceAccountCreds(s.base, "twice");
      await handler.addTemplateClient("google", creds);
      const client = buildClientName("google", creds);

      await requests.getSpreadsheet(client, "abc");
      vi.setSystemTime(new Date("2026-01-01T01:00:00Z"));
      await requests.getSpreadsheet(client, "abc");

      const assertions = s.hits
        .filter((h) => h.url === "/token")
        .map((h) => new URLSearchParams(h.body).get("assertion") ?? "");
      expect(assertions).toHaveLength(2);
      const iat = assertions.map(
        (a) =>
          JSON.parse(Buffer.from(a.split(".")[1], "base64url").toString()).iat
      );
      expect(iat[1]).toBeGreaterThan(iat[0]);
      expect(assertions[1]).not.toBe(assertions[0]);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("registration", () => {
  const build = async (creds: Record<string, unknown>) => {
    const h = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });
    let builder: ((c: unknown) => unknown) | undefined;
    vi.spyOn(h, "registerClientTemplate").mockImplementation(async (_n, b) => {
      builder = b as (c: unknown) => unknown;
    });
    await registerGoogleTemplate(h);
    return () =>
      builder?.({ instanceId: "main", ...creds }) as {
        subClients: { name: string }[];
      }[];
  };

  it("refuses a private key that is not PEM, without echoing it", async () => {
    const secret = "not-a-pem-SECRET-material";
    const run = await build({
      serviceAccountEmail: "sa@p.iam.gserviceaccount.com",
      privateKey: secret,
      scopes: ["s"],
      baseUrl: "https://example.test",
    });
    expect(run).toThrow("privateKey is not a valid PEM private key");
    expect(run).not.toThrow(/SECRET/);
  });

  it("accepts a key with escaped newlines", async () => {
    const run = await build({
      serviceAccountEmail: "sa@p.iam.gserviceaccount.com",
      privateKey: pem.replace(/\n/g, "\\n"),
      scopes: ["s"],
      baseUrl: "https://example.test",
    });
    expect(run).not.toThrow();
  });

  it("registers the Sheets sub-clients for a service account or OAuth, not an API key", async () => {
    const names = async (creds: Record<string, unknown>) =>
      (
        await build({ baseUrl: "https://example.test", ...creds })
      )()[0].subClients.map((s) => s.name);
    expect(await names({ apiKey: "k" })).toEqual(["addressValidation"]);
    expect(await names({ clientId: "i", clientSecret: "s" })).toEqual(
      expect.arrayContaining(["profile", "sheetsRead", "sheetsWrite"])
    );
    expect(
      await names({
        serviceAccountEmail: "sa@p.iam.gserviceaccount.com",
        privateKey: pem,
        scopes: ["s"],
      })
    ).toEqual(expect.arrayContaining(["sheetsRead", "sheetsWrite"]));
  });
});

describe("fields and commentsViewMode", () => {
  const FIELDS = { fields: "a" };
  const last = (spy: ReturnType<typeof mocked>["spy"]) => spy.mock.calls[0][0];

  it.each([
    [
      "batchGetValuesByDataFilter",
      (r: Req) => r.batchGetValuesByDataFilter(CLIENT, "x", {}, FIELDS),
    ],
    [
      "searchDeveloperMetadata",
      (r: Req) => r.searchDeveloperMetadata(CLIENT, "x", {}, FIELDS),
    ],
    [
      "getDeveloperMetadata",
      (r: Req) => r.getDeveloperMetadata(CLIENT, "x", 1, FIELDS),
    ],
    [
      "batchUpdateSpreadsheet",
      (r: Req) => r.batchUpdateSpreadsheet(CLIENT, "x", {}, FIELDS),
    ],
    [
      "batchUpdateValues",
      (r: Req) => r.batchUpdateValues(CLIENT, "x", {}, FIELDS),
    ],
    [
      "batchUpdateValuesByDataFilter",
      (r: Req) => r.batchUpdateValuesByDataFilter(CLIENT, "x", {}, FIELDS),
    ],
    ["clearValues", (r: Req) => r.clearValues(CLIENT, "x", "A1", FIELDS)],
    [
      "batchClearValues",
      (r: Req) => r.batchClearValues(CLIENT, "x", {}, FIELDS),
    ],
    [
      "batchClearValuesByDataFilter",
      (r: Req) => r.batchClearValuesByDataFilter(CLIENT, "x", {}, FIELDS),
    ],
    ["copySheetTo", (r: Req) => r.copySheetTo(CLIENT, "x", 0, {}, FIELDS)],
  ])("%s sends fields", async (_name, call) => {
    const { spy, requests } = mocked();
    await call(requests);
    expect(last(spy).params).toEqual(FIELDS);
  });

  it("getSpreadsheet sends commentsViewMode", async () => {
    const { spy, requests } = mocked();
    await requests.getSpreadsheet(CLIENT, "x", {
      commentsViewMode: "COMMENTS_VIEW_MODE_INCLUDED",
    });
    expect(last(spy).params).toEqual({
      commentsViewMode: "COMMENTS_VIEW_MODE_INCLUDED",
    });
  });
});

type Req = ReturnType<typeof mocked>["requests"];

describe("schema types from the package root", () => {
  it("exports Spreadsheet and CellData", () => {
    expectTypeOf<Spreadsheet["spreadsheetId"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<CellData["formattedValue"]>().toEqualTypeOf<
      string | undefined
    >();
  });
});
