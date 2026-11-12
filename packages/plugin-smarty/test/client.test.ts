import RequestHandler, { memoryBackend } from "@dianemo/core";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import { describe, expect, it, vi } from "vitest";
import smarty from "../src/index.js";

type Interceptor = (c: { params?: Record<string, unknown> }) => {
  params: Record<string, unknown>;
};

interface BuiltClient {
  name: string;
  rateLimit?: unknown;
  requestOptions: {
    defaults?: { baseURL: string };
    requestInterceptor: Interceptor;
  };
  subClients: Array<{
    name: string;
    rateLimit?: unknown;
    requestOptions: { defaults: { baseURL: string } };
  }>;
}

const build = async (): Promise<BuiltClient> => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  let builder: ((creds: unknown) => unknown) | undefined;
  vi.spyOn(handler, "registerClientTemplate").mockImplementation(
    async (_n, b) => {
      builder = b as (creds: unknown) => unknown;
    }
  );
  await smarty.registerTemplate(handler);
  const clients = builder?.({
    instanceId: "production",
    organizationId: null,
    authId: "ID",
    authToken: "TOKEN",
  }) as BuiltClient[];
  return clients[0];
};

const EXPECTED: Record<string, string> = {
  us: "https://us-street.api.smarty.com",
  intl: "https://international-street.api.smarty.com",
  usZipcode: "https://us-zipcode.api.smarty.com",
  usAutocomplete: "https://us-autocomplete.api.smarty.com",
  usExtract: "https://us-extract.api.smarty.com",
  usReverseGeo: "https://us-reverse-geo.api.smarty.com",
  intlAutocomplete: "https://international-autocomplete.api.smarty.com",
};

describe("smarty template", () => {
  it("gives the parent the name and the auth, but no host and no limit", async () => {
    const parent = await build();
    expect(parent.name).toBe("smarty:_:production");
    // A call that reached the parent must fail on the URL, not go out unmetered.
    expect(parent.requestOptions.defaults).toBeUndefined();
    expect(parent.rateLimit).toBeUndefined();
  });

  it("registers exactly the seven sub-clients", async () => {
    const parent = await build();
    expect(parent.subClients.map((s) => s.name).sort()).toEqual(
      Object.keys(EXPECTED).sort()
    );
  });

  it.each(Object.entries(EXPECTED))(
    "%s has its host and leaves its limit to the plan",
    async (name, baseURL) => {
      const parent = await build();
      const sub = parent.subClients.find((s) => s.name === name);
      expect(sub?.requestOptions.defaults.baseURL).toBe(baseURL);
      expect(sub?.rateLimit).toBeUndefined();
    }
  );

  it("injects auth without clobbering caller params", async () => {
    const { requestInterceptor } = (await build()).requestOptions;
    expect(requestInterceptor({}).params).toEqual({
      "auth-id": "ID",
      "auth-token": "TOKEN",
    });
    expect(
      requestInterceptor({ params: { street: "1 Main", "auth-id": "MINE" } })
        .params
    ).toEqual({ "auth-id": "MINE", "auth-token": "TOKEN", street: "1 Main" });
  });
});
