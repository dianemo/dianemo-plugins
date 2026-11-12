import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  continueDescriptionGuidanceSession,
  startDescriptionGuidanceSession,
  submitDescriptionGuidanceFeedback,
} from "../src/requests/descriptionGuidance/index.js";
import {
  UpsDescriptionGuidanceFeedback,
  UpsDescriptionGuidanceIterateRequest,
  UpsDescriptionGuidanceStartRequest,
} from "../src/requests/descriptionGuidance/types.js";

const CLIENT = "ups:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return spy;
};

afterEach(() => resetBinding());

describe("ups descriptionGuidance", () => {
  it("starts a session", async () => {
    const spy = setup();
    const body = {
      commodityDescription: "shirts",
    } as UpsDescriptionGuidanceStartRequest;
    await startDescriptionGuidanceSession(CLIENT, body);
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe(
      "ups.descriptionGuidance.startDescriptionGuidanceSession"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/export-assure/v1/interactive");
    expect(config.data).toBe(body);
  });

  it("continues a session by id", async () => {
    const spy = setup();
    const body: UpsDescriptionGuidanceIterateRequest = {
      questions: [{ id: "q1", selected: 0 }],
    };
    await continueDescriptionGuidanceSession(
      CLIENT,
      { sessionId: "s/1" },
      body
    );
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.descriptionGuidance.continueDescriptionGuidanceSession"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/export-assure/v1/interactive/s%2F1");
    expect(config.data).toBe(body);
  });

  it("submits feedback for a session and returns nothing", async () => {
    const spy = setup();
    const body: UpsDescriptionGuidanceFeedback = { id: "f1", sentiment: true };
    const result = await submitDescriptionGuidanceFeedback(
      CLIENT,
      { sessionId: "abc" },
      body
    );
    const config = spy.mock.calls[0][0];
    expect(config.requestName).toBe(
      "ups.descriptionGuidance.submitDescriptionGuidanceFeedback"
    );
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/export-assure/v1/interactive/feedback/abc");
    expect(config.data).toBe(body);
    expect(result).toBeUndefined();
  });
});
