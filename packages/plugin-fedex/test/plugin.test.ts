import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";

const newHandler = () =>
  new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });

afterEach(() => resetBinding());

describe("plugin-fedex", () => {
  it("registers under the fedex name", () => {
    const handler = newHandler();
    handler.use(fedex);
    expect(handler.getRegisteredPlugins()).toEqual(["fedex"]);
  });

  it("exposes every request function on the namespace", () => {
    const { fedex: requests } = newHandler().use(fedex);
    expect(Object.keys(requests).sort()).toEqual([
      "cancelPickup",
      "cancelShipment",
      "checkPickupAvailability",
      "createPickup",
      "getFedexRatesAndTransitTimes",
      "makeFedexPurchaseRequest",
      "trackPackages",
      "validateFedExAddress",
    ]);
  });

  it("routes a request through the handler it was composed onto", async () => {
    const handler = newHandler();
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { ok: true } } as never);

    const { fedex: requests } = handler.use(fedex);
    await requests.cancelShipment("fedex:_:production", {
      accountNumber: { value: "123" },
      trackingNumber: "123456789012",
    } as never);

    expect(spy).toHaveBeenCalledOnce();
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.shipping.cancelShipment");
    expect(config.method).toBe("PUT");
  });

  it("does not register its template until start() drains the hooks", async () => {
    const handler = newHandler();
    handler.use(fedex);

    const registerClientTemplate = vi
      .spyOn(handler, "registerClientTemplate")
      .mockResolvedValue();
    expect(registerClientTemplate).not.toHaveBeenCalled();

    await fedex.registerTemplate(handler);
    expect(registerClientTemplate).toHaveBeenCalledWith(
      "fedex",
      expect.any(Function)
    );
  });

  it("builds a client carrying FedEx's calibrated rate limit", async () => {
    const handler = newHandler();
    let builder: ((creds: unknown) => unknown) | undefined;
    vi.spyOn(handler, "registerClientTemplate").mockImplementation(
      async (_name, b) => {
        builder = b as (creds: unknown) => unknown;
      }
    );

    await fedex.registerTemplate(handler);
    const clients = builder?.({
      instanceId: "production",
      clientId: "id",
      clientSecret: "secret",
      baseUrl: "https://apis.fedex.com",
    }) as Array<Record<string, unknown>>;

    expect(clients).toHaveLength(1);
    expect(clients[0].name).toBe("fedex:_:production");
    // The calibration is the plugin's real content — a change here is a
    // deliberate decision about what FedEx tolerates, not a refactor.
    expect(clients[0].rateLimit).toEqual([
      {
        type: "requestLimit",
        interval: 10000,
        tokensToAdd: 1400,
        maxTokens: 1400,
      },
    ]);
  });

  it("builds a client that can actually obtain a token", async () => {
    const handler = newHandler();
    let builder: ((creds: unknown) => unknown) | undefined;
    vi.spyOn(handler, "registerClientTemplate").mockImplementation(
      async (_name, b) => {
        builder = b as (creds: unknown) => unknown;
      }
    );

    await fedex.registerTemplate(handler);
    const clients = builder?.({
      instanceId: "production",
      clientId: "id",
      clientSecret: "secret",
      baseUrl: "https://apis.fedex.com",
    }) as Array<Record<string, unknown>>;

    // Asserted whole, not field by field: composing a client proves nothing if
    // the auth block cannot mint a token, and an extra or missing key here is
    // exactly what breaks that.
    expect(clients[0].authentication).toEqual({
      type: "oauth2",
      clientId: "id",
      clientSecret: "secret",
      refreshConfig: {
        url: "https://apis.fedex.com/oauth/token",
        dataLocation: "urlEncodedForm",
        data: {
          grant_type: "client_credentials",
          client_id: "{{clientId}}",
          client_secret: "{{clientSecret}}",
        },
      },
    });

    // Only core's own placeholders survive interpolation; anything else reaches
    // FedEx as a literal `{{…}}` and the token exchange fails at runtime.
    const auth = clients[0].authentication as {
      refreshConfig: { url: string; data: Record<string, string> };
    };
    for (const value of Object.values(auth.refreshConfig.data)) {
      const placeholder = /^\{\{(.+)\}\}$/.exec(value);
      if (!placeholder) continue;
      expect(["clientId", "clientSecret", "refreshToken"]).toContain(
        placeholder[1]
      );
    }
    expect(auth.refreshConfig.url).not.toMatch(/\{\{|undefined/);
    expect(
      (clients[0].requestOptions as { defaults: { baseURL?: string } }).defaults
        .baseURL
    ).toBe("https://apis.fedex.com");
  });

  it("fails loudly if a request runs before registration", async () => {
    const { cancelShipment } = await import("../src/requests/index.js");
    await expect(
      cancelShipment("fedex:_:production", {} as never)
    ).rejects.toThrow(/before registration/);
  });

  it("refuses to bind to a second handler", () => {
    newHandler().use(fedex);
    // A silent rebind would route the first handler's traffic through the
    // second handler's rate-limit budget — successful requests, wrong bucket.
    expect(() => newHandler().use(fedex)).toThrow(/different RequestHandler/);
  });
});
