import { adoptShopThrottleStatus } from "../src/client.js";
import { describe, expect, it } from "vitest";
import type { AxiosResponse } from "axios";

const respond = (throttleStatus?: unknown) =>
  ({
    data: { extensions: { cost: throttleStatus ? { throttleStatus } : {} } },
  }) as unknown as AxiosResponse;

const current = [
  {
    name: "default",
    type: "requestLimit" as const,
    interval: 1000,
    tokensToAdd: 100,
    maxTokens: 1000,
  },
];

describe("shopify adoptShopThrottleStatus", () => {
  it("adopts the shop's reported bucket", async () => {
    const result = await adoptShopThrottleStatus(
      current,
      respond({ maximumAvailable: 2000, restoreRate: 200 })
    );
    expect(result).toEqual([
      {
        name: "default",
        type: "requestLimit",
        interval: 1000,
        tokensToAdd: 200,
        maxTokens: 2000,
      },
    ]);
  });

  it("returns undefined when nothing differs", async () => {
    expect(
      await adoptShopThrottleStatus(
        current,
        respond({ maximumAvailable: 1000, restoreRate: 100 })
      )
    ).toBeUndefined();
  });

  it("returns undefined for a sharedLimit descriptor", async () => {
    expect(
      await adoptShopThrottleStatus(
        [{ name: "default", type: "sharedLimit", clientName: "x" }],
        respond({ maximumAvailable: 2000, restoreRate: 200 })
      )
    ).toBeUndefined();
  });

  it("returns undefined without throttleStatus", async () => {
    expect(await adoptShopThrottleStatus(current, respond())).toBeUndefined();
  });

  it("returns undefined for nonsense values", async () => {
    expect(
      await adoptShopThrottleStatus(
        current,
        respond({ maximumAvailable: 0, restoreRate: Number.NaN })
      )
    ).toBeUndefined();
  });
});
