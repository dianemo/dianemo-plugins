import { sendDangerousGoodsPreNotification } from "../src/requests/preNotification/index.js";
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

describe("preNotification", () => {
  it("posts the pre-notification to the v2 path with the body as data", async () => {
    const handleRequest = spy();
    const body = { PreNotificationRequest: {} } as never;
    await sendDangerousGoodsPreNotification(CLIENT, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.preNotification.sendDangerousGoodsPreNotification",
      method: "POST",
      url: "/api/dangerousgoods/v2/prenotification",
      data: body,
    });
  });
});
