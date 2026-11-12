import { getTimeInTransit } from "../src/requests/timeInTransit/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";

const CLIENT = "ups:_:test";

afterEach(() => resetBinding());

describe("getTimeInTransit", () => {
  it("posts the request body to the versioned transittimes path", async () => {
    const handler = new RequestHandler({
      key: TEST_KEY,
      backend: memoryBackend(),
    });
    const response = { emsResponse: { numberOfServices: 0 } };
    const spy = vi
      .spyOn(handler, "handleRequest")
      .mockResolvedValue({ data: response } as never);
    handler.use(ups);

    const data = {
      originCountryCode: "US",
      originPostalCode: "21093",
      destinationCountryCode: "US",
      destinationPostalCode: "30005",
      residentialIndicator: "02" as const,
      shipDate: "2026-11-20",
    };
    const result = await getTimeInTransit(CLIENT, data);

    expect(spy).toHaveBeenCalledOnce();
    const config = spy.mock.calls[0][0];
    expect(config.clientName).toBe(CLIENT);
    expect(config.requestName).toBe("ups.timeInTransit.getTimeInTransit");
    expect(config.method).toBe("POST");
    expect(config.url).toBe("/api/shipments/v1/transittimes");
    expect(config.data).toBe(data);
    expect(result).toBe(response);
  });
});
