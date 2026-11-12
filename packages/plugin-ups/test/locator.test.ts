import { searchUpsLocations } from "../src/requests/locator/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

const CLIENT = "ups:_:production";

const spy = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const handleRequest = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return handleRequest;
};

afterEach(() => resetBinding());

describe("locator", () => {
  it("puts reqOption in the path and omits Locale when unset", async () => {
    const handleRequest = spy();
    const body = { LocatorRequest: {} } as never;
    await searchUpsLocations(CLIENT, { reqOption: "64" }, body);
    const config = handleRequest.mock.calls[0][0];
    expect(config).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.locator.searchUpsLocations",
      method: "POST",
      url: "/api/locations/v3/search/availabilities/64",
      data: body,
    });
    expect(config.params).toBeUndefined();
  });

  it("sends Locale as a query parameter when given", async () => {
    const handleRequest = spy();
    await searchUpsLocations(
      CLIENT,
      { reqOption: "1", locale: "fr_CA" },
      {} as never
    );
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      url: "/api/locations/v3/search/availabilities/1",
      params: { Locale: "fr_CA" },
    });
  });
});
