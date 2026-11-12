import { getQuantumViewEvents } from "../src/requests/quantumView/index.js";
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

describe("quantumView", () => {
  it("posts the events request to the v3 path with the body as data", async () => {
    const handleRequest = spy();
    const body = {
      QuantumViewRequest: { Request: { RequestAction: "QVEvents" } },
    } as never;
    await getQuantumViewEvents(CLIENT, body);
    expect(handleRequest.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.quantumView.getQuantumViewEvents",
      method: "POST",
      url: "/api/quantumview/v3/events",
      data: body,
    });
  });
});
