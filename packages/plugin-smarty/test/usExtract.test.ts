import { extractSmartyUsAddresses } from "../src/requests/usExtract/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import smarty from "../src/index.js";

afterEach(() => resetBinding());

const bind = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { meta: {}, addresses: [] } } as never);
  handler.use(smarty);
  return spy;
};

describe("usExtract", () => {
  it("posts the text raw as text/plain with options as query params", async () => {
    const spy = bind();
    const text = "There are addresses everywhere.\n1109 Ninth 85007";
    await extractSmartyUsAddresses("smarty:_:production", text, {
      match: "enhanced",
      license: "us-extract-cloud",
      aggressive: true,
      html: undefined,
    });

    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("smarty:_:production:usExtract");
    expect(config.requestName).toBe(
      "smarty.usExtract.extractSmartyUsAddresses"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/");
    expect(config.headers).toEqual({
      "Content-Type": "text/plain; charset=utf-8",
    });
    expect(config.data).toBe(text);
    expect(typeof config.data).toBe("string");
    expect(config.params).toEqual({
      match: "enhanced",
      license: "us-extract-cloud",
      aggressive: "true",
    });
  });
});
