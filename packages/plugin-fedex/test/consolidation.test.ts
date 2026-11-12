import RequestHandler, { definePlugin, memoryBackend } from "@dianemo/core";
import * as consolidation from "../src/requests/consolidation/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import type {
  FedExConsolidationConsolidationKey,
  FedExConsolidationProcessingOption,
  FedExConsolidationSpecialServicesRequestedV4,
  FedExConsolidationRequestedConsolidationShipment,
  FedExConsolidationRetrieveRequest,
} from "../src/requests/consolidation/types.js";

afterEach(() => resetBinding());

const CLIENT = "fedex:_:production";

// The consolidation family is composed by the lead into the plugin entry; this
// test binds it on its own so it does not depend on that wiring.
const plugin = definePlugin({
  name: "fedex",
  registerTemplate: async () => {},
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return consolidation;
  },
});

const CASES = [
  ["createConsolidation", "POST", "/ship/v1/consolidations"],
  ["modifyConsolidation", "PUT", "/ship/v1/consolidations"],
  ["createConsolidationShipment", "POST", "/ship/v1/consolidations/shipments"],
  [
    "getConsolidationShipmentResults",
    "POST",
    "/ship/v1/consolidations/results",
  ],
  ["confirmConsolidation", "POST", "/ship/v1/consolidations/confirmations"],
  [
    "getConfirmConsolidationResults",
    "POST",
    "/ship/v1/consolidations/confirmationresults",
  ],
  ["retrieveConsolidation", "POST", "/ship/v1/consolidations/retrieve"],
  [
    "deleteConsolidationShipments",
    "PUT",
    "/ship/v1/consolidations/shipments/delete",
  ],
  ["deleteConsolidation", "PUT", "/ship/v1/consolidations/delete"],
] as const;

describe("plugin-fedex consolidation family", () => {
  it.each(CASES)(
    "%s uses %s %s with the body as data",
    async (name, method, url) => {
      const handler = new RequestHandler({
        key: TEST_KEY,
        backend: memoryBackend(),
      });
      const spy = vi
        .spyOn(handler, "handleRequest")
        .mockResolvedValue({ data: { ok: true } } as never);
      const { fedex: requests } = handler.use(plugin);

      const body = { accountNumber: { value: "123456789" } };
      const result = await (
        requests[name] as (c: string, d: unknown) => Promise<unknown>
      )(CLIENT, body);

      expect(result).toEqual({ ok: true });
      expect(spy).toHaveBeenCalledOnce();
      const config = spy.mock.calls[0][0];
      expect(config.clientName).toBe(CLIENT);
      expect(config.requestName).toBe(`fedex.consolidation.${name}`);
      expect(config.method).toBe(method);
      expect(config.url).toBe(url);
      expect(config.data).toBe(body);
    }
  );

  it("exposes exactly the nine consolidation functions", () => {
    expect(Object.keys(consolidation).sort()).toEqual(
      CASES.map(([n]) => n).sort()
    );
  });
});

// The spec's own sample payloads disagree with its schemas in these ways; the
// types accept the samples' shapes too. A compile error here is the failure.
describe("plugin-fedex consolidation types accept the spec's sample shapes", () => {
  it("takes arrays where the schema says a single enum", () => {
    const option: FedExConsolidationProcessingOption = {
      options: ["BYPASS_REGULATORY_VALIDATION"],
    };
    const single: FedExConsolidationProcessingOption = {
      options: "PACKAGE_LEVEL_COMMODITIES",
    };
    const services: FedExConsolidationSpecialServicesRequestedV4 = {
      specialServiceTypes: ["FEDEX_LTL"],
    };
    expect([option, single, services]).toHaveLength(3);
  });

  it("takes the retrieve and delete samples' consolidationKey spelling", () => {
    const sample: FedExConsolidationRetrieveRequest = {
      accountNumber: { value: "XXXXXXXXXXXXXXX" },
      consolidationKey: {
        consolidationType: "INTERNATIONAL_ECONOMY_DISTRIBUTION",
        index: "12345",
        shipDatestamp: "2022-03-21",
      },
    };
    const schema: FedExConsolidationConsolidationKey = {
      date: "2022-11-25",
      index: "794877570602",
      type: "INTERNATIONAL_GROUND_DISTRIBUTION",
    };
    expect([sample, schema]).toHaveLength(2);
  });

  it("takes the shipment samples' extra fields and omitted required ones", () => {
    const shipment: FedExConsolidationRequestedConsolidationShipment = {
      serviceType: "FEDEX_GROUND",
      pickupType: "USE_SCHEDULED_PICKUP",
      dropoffType: "REGULAR_PICKUP",
      shipAction: "CONFIRM",
      packagingType: "YOUR_PACKAGING",
      shipper: {} as never,
      shippingChargesPayment: {
        payor: { responsibleParty: { address: { countryCode: "US" } } },
      } as never,
      labelSpecification: {
        imageType: "PDF",
        printerType: "PDF",
        paperType: "LETTER",
      },
      requestedPackageLineItems: [],
    };
    expect(shipment.serviceType).toBe("FEDEX_GROUND");
  });
});
