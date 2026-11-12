import * as subs from "../src/requests/subscriptions/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = `${CLIENT}:default`;
const ID = "abc/123";
const ENC = "abc%2F123";
const target = { subscriptionId: ID };
const versioned = { subscriptionId: ID, ifMatch: "etag-1" };
const body = {
  listenerURL: "https://myserver.com/listener",
  secret: "SecretKeyPhraseThatIs32CharsLong",
  adminNotification: [{ email: "user@example.com" }],
};

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi.spyOn(handler, "handleRequest").mockResolvedValue({
    data: { subscriptionId: "s1" },
    headers: { etag: "etag-2", location: "https://apis.usps.com/x/s1" },
  } as never);
  handler.use(usps);
  return spy;
};

const CASES: Array<{
  product: string;
  fnNoun: string;
  base: string;
  first: number;
  full: boolean;
  filter: unknown;
}> = [
  {
    product: "addresses",
    fnNoun: "Address",
    base: "/subscriptions-address/v3",
    first: 100,
    full: false,
    filter: { CRID: "1", address: { streetAddress: "1 Main" } },
  },
  {
    product: "adjustments",
    fnNoun: "Adjustments",
    base: "/subscriptions-adjustments/v3",
    first: 105,
    full: true,
    filter: { CRID: "123456" },
  },
  {
    product: "disputes",
    fnNoun: "Disputes",
    base: "/subscriptions-disputes/v3",
    first: 110,
    full: true,
    filter: { CRID: "123456" },
  },
  {
    product: "ncoa",
    fnNoun: "Ncoa",
    base: "/subscriptions-ncoa/v3",
    first: 115,
    full: false,
    filter: { CRID: "1" },
  },
  {
    product: "packageTransactionDetails",
    fnNoun: "PackageTransactionDetails",
    base: "/subscriptions-package-transaction-details/v3",
    first: 120,
    full: true,
    filter: { CRID: "123456" },
  },
  {
    product: "tracking",
    fnNoun: "Tracking",
    base: "/subscriptions-tracking/v3",
    first: 125,
    full: true,
    filter: { MID: "123456" },
  },
  {
    product: "trackingV3r2",
    fnNoun: "TrackingV3r2",
    base: "/subscriptions-tracking/v3r2",
    first: 130,
    full: true,
    filter: { MID: "123456", includeVeriPoint: true },
  },
  {
    product: "unpaidPackages",
    fnNoun: "UnpaidPackages",
    base: "/subscriptions-unpaid-packages/v3",
    first: 135,
    full: true,
    filter: { CRID: "123456" },
  },
];

const fn = (name: string) =>
  (subs as unknown as Record<string, (...a: unknown[]) => Promise<unknown>>)[
    name
  ];
const code = (n: number) => `USP_${String(n).padStart(4, "0")}`;

describe.each(CASES)("usps subscriptions $product", (c) => {
  const create = `createUsps${c.fnNoun}Subscription`;
  const get = `getUsps${c.fnNoun}Subscription`;
  const del = `deleteUsps${c.fnNoun}Subscription`;
  const payload = { ...body, filterProperties: c.filter };

  it("creates with the body, and returns the ETag and Location", async () => {
    const spy = setup();
    const result = await fn(create)(CLIENT, payload);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: `usps.subscriptions.${create}`,
      method: "POST",
      url: `${c.base}/subscriptions`,
      data: payload,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
    expect(result).toEqual({
      subscription: { subscriptionId: "s1" },
      etag: "etag-2",
      location: "https://apis.usps.com/x/s1",
    });
  });

  it("gets by encoded id and returns the ETag", async () => {
    const spy = setup();
    const result = await fn(get)(CLIENT, target);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: `usps.subscriptions.${get}`,
      method: "GET",
      url: `${c.base}/subscriptions/${ENC}`,
    });
    expect(result).toEqual({
      subscription: { subscriptionId: "s1" },
      etag: "etag-2",
    });
  });

  it("deletes with If-Match", async () => {
    const spy = setup();
    await fn(del)(CLIENT, versioned);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: `usps.subscriptions.${del}`,
      method: "DELETE",
      url: `${c.base}/subscriptions/${ENC}`,
      headers: { "If-Match": "etag-1" },
    });
  });

  it("uses one code per function, in list/create/get/update/delete order", async () => {
    const spy = setup();
    spy.mockRejectedValue(new Error("boom"));
    const calls: Array<[string, unknown[], number]> = [
      [create, [CLIENT, payload], c.first + 1],
      [get, [CLIENT, target], c.first + 2],
      [del, [CLIENT, versioned], c.first + 4],
    ];
    for (const [name, args, n] of calls) {
      await expect(fn(name)(...args)).rejects.toMatchObject({
        code: code(n),
      });
    }
  });

  if (c.full) {
    const update = `updateUsps${c.fnNoun}Subscription`;
    const list = `listUsps${c.fnNoun}Subscriptions`;
    const isTracking = c.product.startsWith("tracking");

    it("updates with If-Match and the body", async () => {
      const spy = setup();
      const result = await fn(update)(CLIENT, versioned, payload);
      expect(spy.mock.calls[0][0]).toMatchObject({
        clientName: GROUP,
        requestName: `usps.subscriptions.${update}`,
        method: "PUT",
        url: `${c.base}/subscriptions/${ENC}`,
        headers: { "If-Match": "etag-1" },
        data: payload,
      });
      expect(result).toEqual({
        subscription: { subscriptionId: "s1" },
        etag: "etag-2",
      });
    });

    it("lists with comma-joined array filters and no unset params", async () => {
      const spy = setup();
      const params = isTracking
        ? { MID: ["123456", "654321"], limit: 50 }
        : { CRID: ["11111111", "22222222"], offset: 20 };
      await fn(list)(CLIENT, params);
      const sent = spy.mock.calls[0][0];
      expect(sent).toMatchObject({
        clientName: GROUP,
        requestName: `usps.subscriptions.${list}`,
        method: "GET",
        url: `${c.base}/subscriptions`,
      });
      expect(sent.params).toEqual(
        isTracking
          ? { MID: "123456,654321", limit: 50 }
          : { CRID: "11111111,22222222", offset: 20 }
      );
    });

    it("codes list and update", async () => {
      const spy = setup();
      spy.mockRejectedValue(new Error("boom"));
      const params = isTracking ? {} : { CRID: ["1"] };
      await expect(fn(list)(CLIENT, params)).rejects.toMatchObject({
        code: code(c.first),
      });
      await expect(
        fn(update)(CLIENT, versioned, payload)
      ).rejects.toMatchObject({
        code: code(c.first + 3),
      });
    });
  } else {
    it("has no list or update function", () => {
      expect(fn(`listUsps${c.fnNoun}Subscriptions`)).toBeUndefined();
      expect(fn(`updateUsps${c.fnNoun}Subscription`)).toBeUndefined();
    });
  }
});
