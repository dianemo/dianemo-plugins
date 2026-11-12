import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";
import {
  lookupSmartyUsZipcode,
  lookupSmartyUsZipcodeBatch,
} from "../src/requests/usZipcode/index.js";

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: [{ input_index: 0 }] } as never);
  handler.use(smarty);
  return spy;
};

describe("usZipcode", () => {
  it("looks up one ZIP as query parameters, dropping empties", async () => {
    const spy = setup();
    await lookupSmartyUsZipcode(
      "smarty:_:production",
      { zipcode: "84601", city: undefined, state: "" },
      { license: "us-zipcode-cloud" }
    );
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:usZipcode");
    expect(config.requestName).toBe("smarty.usZipcode.lookupSmartyUsZipcode");
    expect(config.method).toBe("GET");
    expect(config.url).toBe("/lookup");
    expect(config.params).toEqual({
      zipcode: "84601",
      license: "us-zipcode-cloud",
    });
    expect(config.data).toBeUndefined();
  });

  it("posts an array of lookups as the body, license stays a query parameter", async () => {
    const spy = setup();
    const lookups = [{ city: "North Pole", state: "AK" }, { zipcode: "12345" }];
    const out = await lookupSmartyUsZipcodeBatch(
      "smarty:_:production",
      lookups,
      {
        license: "us-zipcode-cloud",
      }
    );
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:usZipcode");
    expect(config.requestName).toBe(
      "smarty.usZipcode.lookupSmartyUsZipcodeBatch"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/lookup");
    expect(config.data).toEqual(lookups);
    expect(config.params).toEqual({ license: "us-zipcode-cloud" });
    expect(out).toEqual([{ input_index: 0 }]);
  });
});
