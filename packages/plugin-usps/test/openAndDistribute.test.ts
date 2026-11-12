import type { UspsOpenAndDistributeCreateRequest } from "../src/requests/openAndDistribute/types.js";
import * as od from "../src/requests/openAndDistribute/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const ACCEPT = "application/vnd.usps.pmod+json";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(usps);
  return spy;
};

describe("usps openAndDistribute", () => {
  it("createOpenAndDistributeContainer posts with the payer account in metadata", async () => {
    const spy = setup();
    const data: UspsOpenAndDistributeCreateRequest = {
      originAddress: {
        streetAddress: "1 Main St",
        city: "Memphis",
        state: "TN",
        ZIPCode: "38188",
      },
      destinationZIPCode: "20260",
      destinationEntryFacilityType: "DESTINATION_DELIVERY_UNIT",
      enclosedMailClass: "PARCEL_SELECT",
      mailerName: "Acme",
      processingCategory: "MACHINABLE",
      mailingDate: "2026-11-13",
      weight: 12.5,
      impbContainerType: "OPEN_DISTRIBUTE_PALLET",
    };
    await od.createOpenAndDistributeContainer(CLIENT, data, {
      accountNumber: "1000",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:labels",
      requestName: "usps.openAndDistribute.createOpenAndDistributeContainer",
      method: "POST",
      url: "/pmod/v3/pmod/create",
      data,
      headers: { Accept: ACCEPT },
      metadata: { uspsAccountNumber: "1000" },
    });
  });

  it("closeOpenAndDistributeContainer posts to the encoded container id", async () => {
    const spy = setup();
    const data = { generateScanForm: true, scanFormImageType: "PDF" };
    await od.closeOpenAndDistributeContainer(
      CLIENT,
      { containerId: "99M 1", accountNumber: "1000" },
      data
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: "usps:_:main:labels",
      requestName: "usps.openAndDistribute.closeOpenAndDistributeContainer",
      method: "POST",
      url: "/pmod/v3/pmod/manifest/99M%201",
      data,
      headers: { Accept: ACCEPT },
      metadata: { uspsAccountNumber: "1000" },
    });
  });
});
