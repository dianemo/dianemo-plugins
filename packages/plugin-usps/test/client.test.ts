import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const BASE = "https://apis-tem.usps.com";

// The built client is core's own shape, read loosely on purpose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;
type Built = Loose[];
type Interceptor = (config: Record<string, unknown>) => Promise<{
  headers?: Record<string, string>;
}>;

const TOKEN = "header.body.signature";

async function build(creds: Record<string, unknown> = {}) {
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
  // The mint path dispatches authorizePayment through the handler; no network.
  const spy = vi.spyOn(handler, "handleRequest").mockResolvedValue({
    data: { paymentAuthorizationToken: TOKEN, roles: [] },
  } as never);
  resetBinding();
  handler.use(usps);
  await usps.registerTemplate(handler);
  const [account] = builder?.({
    instanceId: "main",
    clientId: "id",
    clientSecret: "secret",
    baseUrl: BASE,
    crid: "12345678",
    mid: "123456789",
    ...creds,
  }) as Built;
  const labels = account.subClients.find((c: Loose) => c.name === "labels");
  return {
    account,
    spy,
    intercept: labels.requestOptions.requestInterceptor as Interceptor,
  };
}

const labelsConfig = (
  requestName: string,
  metadata?: Record<string, unknown>
) => ({ requestName, headers: { a: "b" }, metadata });

describe("usps client template", () => {
  it("names the account client and its two sub-clients", async () => {
    const { account } = await build();
    expect(account.name).toBe("usps:_:main");
    expect(account.subClients.map((c: Loose) => c.name)).toEqual([
      "default",
      "labels",
    ]);
    expect(account.rateLimit).toBeUndefined();
  });

  it("meters default at one call a minute and labels at 10 a second", async () => {
    const { account } = await build();
    const [def, labels] = account.subClients;
    expect(def.rateLimit).toEqual([
      { type: "requestLimit", interval: 60_000, tokensToAdd: 1, maxTokens: 1 },
    ]);
    expect(labels.rateLimit).toEqual([
      { type: "requestLimit", interval: 1000, tokensToAdd: 10, maxTokens: 10 },
    ]);
  });

  it("owns the base URL, JSON content type and muted 503s on the account", async () => {
    const { account } = await build();
    expect(account.requestOptions.defaults).toEqual({
      baseURL: BASE,
      headers: { "Content-Type": "application/json" },
    });
    expect(account.httpStatusCodesToMute).toEqual([503]);
  });

  it("gets its token from /oauth2/v3/token with a client_credentials JSON body", async () => {
    const { account } = await build();
    expect(account.authentication).toEqual({
      type: "oauth2",
      clientId: "id",
      clientSecret: "secret",
      refreshConfig: {
        url: `${BASE}/oauth2/v3/token`,
        dataLocation: "jsonBody",
        data: {
          grant_type: "client_credentials",
          client_id: "{{clientId}}",
          client_secret: "{{clientSecret}}",
        },
      },
    });
  });

  it("carries a credentials fingerprint that follows crid, mid and account type", async () => {
    const a = (await build()).account.metadata.credsFingerprint;
    expect((await build()).account.metadata.credsFingerprint).toBe(a);
    for (const change of [
      { crid: "87654321" },
      { mid: "999999" },
      { manifestMid: "111111" },
      { paymentAccountType: "PERMIT" },
    ]) {
      expect((await build(change)).account.metadata.credsFingerprint).not.toBe(
        a
      );
    }
    // The default account type reads as omitted.
    expect(
      (await build({ paymentAccountType: "EPS" })).account.metadata
        .credsFingerprint
    ).toBe(a);
  });
});

describe("payment-token interceptor", () => {
  it("mints and attaches the token for any request name that sets the account number", async () => {
    const { intercept, spy } = await build();
    const out = await intercept(
      labelsConfig("usps.internationalLabels.create", {
        uspsAccountNumber: "1000000000",
      })
    );
    expect(out.headers).toEqual({
      a: "b",
      "X-Payment-Authorization-Token": TOKEN,
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:labels",
      requestName: "usps.payments.authorize",
      method: "POST",
      url: "/payments/v3/payment-authorization",
    });
  });

  it("mints PAYER and LABEL_OWNER roles from the credentials", async () => {
    const { intercept, spy } = await build({ manifestMid: "555555" });
    await intercept(
      labelsConfig("usps.labels.create", { uspsAccountNumber: "1000000000" })
    );
    expect(spy.mock.calls[0][0].data).toEqual({
      roles: [
        {
          roleName: "PAYER",
          CRID: "12345678",
          MID: "123456789",
          manifestMID: "555555",
          accountType: "EPS",
          accountNumber: "1000000000",
        },
        {
          roleName: "LABEL_OWNER",
          CRID: "12345678",
          MID: "123456789",
          manifestMID: "555555",
        },
      ],
    });
  });

  it("mints once per account and serves the cached token afterwards", async () => {
    const { intercept, spy } = await build();
    const meta = { uspsAccountNumber: "1000000000" };
    await intercept(labelsConfig("usps.labels.create", meta));
    const again = await intercept(labelsConfig("usps.pmod.create", meta));
    expect(again.headers?.["X-Payment-Authorization-Token"]).toBe(TOKEN);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("leaves a request without the account number untouched when it never needed the token", async () => {
    const { intercept, spy } = await build();
    for (const name of ["usps.payments.account", "usps.pmod.list"]) {
      const out = await intercept(labelsConfig(name));
      expect(out.headers).toEqual({ a: "b" });
      expect(
        (await intercept(labelsConfig(name, { other: 1 }))).headers
      ).toEqual({ a: "b" });
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it.each(["usps.labels.create", "usps.labels.void", "usps.labels.reprint"])(
    "still throws loudly when %s arrives without the account number",
    async (name) => {
      const { intercept, spy } = await build();
      await expect(intercept(labelsConfig(name))).rejects.toThrow(
        `${name} requires metadata.uspsAccountNumber to mint X-Payment-Authorization-Token`
      );
      expect(spy).not.toHaveBeenCalled();
    }
  );

  it("throws when the account number is present but empty or not a string", async () => {
    const { intercept } = await build();
    for (const bad of ["", 42]) {
      await expect(
        intercept(labelsConfig("usps.pmod.create", { uspsAccountNumber: bad }))
      ).rejects.toThrow("usps.pmod.create requires metadata.uspsAccountNumber");
    }
  });

  it("never mints for the payment authorization itself, even with the metadata set", async () => {
    const { intercept, spy } = await build();
    const out = await intercept(
      labelsConfig("usps.payments.authorize", {
        uspsAccountNumber: "1000000000",
      })
    );
    expect(out.headers).toEqual({ a: "b" });
    expect(spy).not.toHaveBeenCalled();
  });
});
