import { rateLimitChange } from "../src/client.js";
import { describe, expect, it } from "vitest";
import type { AxiosResponse } from "axios";

const respond = (headers: Record<string, string>) =>
  ({ headers }) as unknown as AxiosResponse;

const current = [
  {
    name: "default",
    type: "requestLimit",
    interval: 1000,
    tokensToAdd: 1,
    maxTokens: 2,
  },
] as const;

describe("amazon rateLimitChange", () => {
  it("restates tokensToAdd from x-amzn-ratelimit-limit", async () => {
    const result = await rateLimitChange(
      [...current],
      respond({ "x-amzn-ratelimit-limit": "5" })
    );
    expect(result).toEqual([{ ...current[0], tokensToAdd: 5 }]);
  });

  it("returns undefined when the value is unchanged", async () => {
    expect(
      await rateLimitChange(
        [...current],
        respond({ "x-amzn-ratelimit-limit": "1" })
      )
    ).toBeUndefined();
  });

  it("returns undefined for a sharedLimit descriptor", async () => {
    expect(
      await rateLimitChange(
        [{ name: "default", type: "sharedLimit", clientName: "x" }],
        respond({ "x-amzn-ratelimit-limit": "5" })
      )
    ).toBeUndefined();
  });

  it("returns undefined when the header is absent", async () => {
    expect(await rateLimitChange([...current], respond({}))).toBeUndefined();
  });

  it("restates only the per-second limit and keeps names", async () => {
    const daily = {
      name: "daily",
      type: "requestLimit",
      interval: 86_400_000,
      tokensToAdd: 1000,
      maxTokens: 1000,
    } as const;
    const result = await rateLimitChange(
      [{ ...current[0] }, daily],
      respond({ "x-amzn-ratelimit-limit": "5" })
    );
    expect(result).toEqual([{ ...current[0], tokensToAdd: 5 }, daily]);
  });

  it("returns undefined when only a non-per-second limit differs", async () => {
    const daily = {
      name: "daily",
      type: "requestLimit",
      interval: 86_400_000,
      tokensToAdd: 1000,
      maxTokens: 1000,
    } as const;
    expect(
      await rateLimitChange([daily], respond({ "x-amzn-ratelimit-limit": "5" }))
    ).toBeUndefined();
  });
});
