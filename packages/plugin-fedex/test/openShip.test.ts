import type { FedExOpenShipDeliveryOnInvoiceAcceptanceDetail } from "../src/requests/openShip/types.js";
import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as openShip from "../src/requests/openShip/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { registerFedexTemplate } from "../src/client.js";
import { TEST_KEY } from "../../../test/fixtures/key.js";

const CLIENT = "fedex:_:production";

const CASES = [
  ["createOpenShipment", "POST", "/ship/v1/openshipments/create"],
  ["modifyOpenShipment", "PUT", "/ship/v1/openshipments/"],
  ["confirmOpenShipment", "POST", "/ship/v1/openshipments/"],
  ["modifyOpenShipmentPackages", "PUT", "/ship/v1/openshipments/packages"],
  ["addOpenShipmentPackages", "POST", "/ship/v1/openshipments/packages"],
  [
    "deleteOpenShipmentPackages",
    "PUT",
    "/ship/v1/openshipments/packages/delete",
  ],
  [
    "retrieveOpenShipmentPackages",
    "POST",
    "/ship/v1/openshipments/packages/retrieve",
  ],
  ["deleteOpenShipment", "PUT", "/ship/v1/openshipments/delete"],
  ["retrieveOpenShipment", "POST", "/ship/v1/openshipments/retrieve"],
  ["getOpenShipmentResults", "POST", "/ship/v1/openshipments/results"],
] as const;

// Composes the family on its own, so the test holds whether or not the package
// barrel already re-exports it.
const openShipPlugin = definePlugin({
  name: "fedex",
  registerTemplate: registerFedexTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return openShip;
  },
});

const newHandler = () =>
  new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });

afterEach(() => resetBinding());

describe("plugin-fedex openShip", () => {
  it("covers every function the family exports", () => {
    expect(Object.keys(openShip).sort()).toEqual(
      CASES.map(([name]) => name).sort()
    );
  });

  it.each(CASES)(
    "%s sends %s %s with the payload as the body",
    async (name, method, url) => {
      const handler = newHandler();
      const spy = vi
        .spyOn(handler, "handleRequest")
        .mockResolvedValue({ data: { transactionId: "t" } } as never);
      const { fedex: requests } = handler.use(openShipPlugin);
      const payload = { index: "Test1234" } as never;

      const result = await requests[name](CLIENT, payload);

      expect(spy).toHaveBeenCalledOnce();
      const config = spy.mock.calls[0][0];
      expect(config.clientName).toBe(CLIENT);
      expect(config.requestName).toBe(`fedex.openShip.${name}`);
      expect(config.method).toBe(method);
      expect(config.url).toBe(url);
      expect(config.data).toBe(payload);
      expect(result).toEqual({ transactionId: "t" });
    }
  );

  it("keeps modify and confirm on the same slash-terminated URL, told apart by method", () => {
    const shared = CASES.filter(
      ([, , url]) => url === "/ship/v1/openshipments/"
    );
    expect(shared.map(([, method]) => method).sort()).toEqual(["POST", "PUT"]);
  });
});

describe("plugin-fedex openShip delivery-on-invoice recipient contact", () => {
  it("requires companyName, personName and phoneNumber, as the spec's allOf override does", () => {
    const ok: FedExOpenShipDeliveryOnInvoiceAcceptanceDetail = {
      recipient: {
        address: { streetLines: ["1 Main St"], countryCode: "US" } as never,
        contact: {
          companyName: "FedEx",
          personName: "John Taylor",
          phoneNumber: "9013577890",
        },
      },
    };
    const missing: FedExOpenShipDeliveryOnInvoiceAcceptanceDetail = {
      recipient: {
        address: { streetLines: ["1 Main St"], countryCode: "US" } as never,
        // @ts-expect-error companyName and personName are required on this path
        contact: { phoneNumber: "9013577890" },
      },
    };
    expect([ok, missing]).toHaveLength(2);
  });
});
