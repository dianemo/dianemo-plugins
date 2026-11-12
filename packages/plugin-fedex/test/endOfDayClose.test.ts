import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";
import {
  groundEndOfDayClose,
  reprintEndOfDayClose,
} from "../src/requests/endOfDayClose/index.js";

afterEach(() => resetBinding());

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  // Composing binds the plugin-kit singleton the request functions call through.
  handler.use(fedex);
  return { spy };
};

describe("fedex endOfDayClose", () => {
  it("groundEndOfDayClose sends PUT /ship/v1/endofday/", async () => {
    const { spy } = setup();
    const data = {
      closeReqType: "GCDR",
      groundServiceCategory: "GROUND",
      accountNumber: { value: "123456789" },
      closeDate: "2020-05-12",
    };
    const result = await groundEndOfDayClose(
      "fedex:_:production",
      data as never
    );

    expect(result).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.endOfDayClose.groundEndOfDayClose");
    expect(config.method).toBe("PUT");
    expect(config.url).toBe("/ship/v1/endofday/");
    expect(config.data).toBe(data);
  });

  it("reprintEndOfDayClose sends POST /ship/v1/endofday/", async () => {
    const { spy } = setup();
    const data = {
      closeReqType: "RGCDR",
      reprintOption: "BY_SHIP_DATE",
      groundServiceCategory: "GROUND",
      accountNumber: { value: "123456789" },
    };
    const result = await reprintEndOfDayClose(
      "fedex:_:production",
      data as never
    );

    expect(result).toEqual({ ok: true });
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe("fedex:_:production");
    expect(config.requestName).toBe("fedex.endOfDayClose.reprintEndOfDayClose");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/ship/v1/endofday/");
    expect(config.data).toBe(data);
  });
});
