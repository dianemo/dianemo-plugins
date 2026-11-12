import { getUspsUserInfo } from "../src/requests/userInfo/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

describe("usps userInfo", () => {
  it("getUspsUserInfo GETs /oauth2-oidc/v3/userinfo on the default group", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: { sub: "1234567" } } as never);
    handler.use(usps);
    const out = await getUspsUserInfo("usps:_:main");
    expect(out).toEqual({ sub: "1234567" });
    expect(spy.mock.calls[0][0]).toEqual({
      clientName: "usps:_:main:default",
      requestName: "usps.userInfo.get",
      method: "GET",
      url: "/oauth2-oidc/v3/userinfo",
    });
  });
});
