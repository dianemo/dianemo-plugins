import type { UspsContainerCreateRequest } from "../src/requests/containers/types.js";
import * as containers from "../src/requests/containers/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const LABELS = "usps:_:main:labels";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { containerID: "99M1" } } as never);
  handler.use(usps);
  return spy;
};

describe("usps containers", () => {
  it("addUspsContainerPackages posts the packages to the container", async () => {
    const spy = setup();
    const data = { trackingNumbers: ["9400"], allowManifestedLabels: false };
    const res = await containers.addUspsContainerPackages(
      CLIENT,
      { containerId: "99M/1" },
      data
    );
    expect(res).toEqual({ containerID: "99M1" });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.addUspsContainerPackages",
      method: "POST",
      url: "/containers/v3/containers/99M%2F1/packages",
      data,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });

  it("removeAllUspsContainerPackages deletes every package", async () => {
    const spy = setup();
    await containers.removeAllUspsContainerPackages(CLIENT, {
      containerId: "C1",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.removeAllUspsContainerPackages",
      method: "DELETE",
      url: "/containers/v3/containers/C1/packages",
    });
  });

  it("removeUspsContainerPackage deletes one package by tracking number", async () => {
    const spy = setup();
    await containers.removeUspsContainerPackage(CLIENT, {
      containerId: "C1",
      trackingNumber: "9400",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.removeUspsContainerPackage",
      method: "DELETE",
      url: "/containers/v3/containers/C1/packages/9400",
    });
  });

  it("createUspsContainerLabel posts the container", async () => {
    const spy = setup();
    const data: UspsContainerCreateRequest = {
      MID: "123456",
      mailerName: "Acme",
      mailClass: "PARCEL_SELECT",
      sortType: "PALLET",
      processingCategory: "MACHINABLE",
      destinationEntryFacilityType: "DESTINATION_DELIVERY_UNIT",
      destinationZIPCode: "20260",
      originAddress: {
        streetAddress: "1 Main St",
        city: "Memphis",
        state: "TN",
        ZIPCode: "38188",
      },
    };
    await containers.createUspsContainerLabel(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.createUspsContainerLabel",
      method: "POST",
      url: "/containers/v3/containers",
      data,
    });
  });

  it("closeUspsContainerManifest posts the container ids", async () => {
    const spy = setup();
    await containers.closeUspsContainerManifest(CLIENT, {
      containers: ["C1", "C2"],
      mailingDate: "2026-11-13",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: LABELS,
      requestName: "usps.containers.closeUspsContainerManifest",
      method: "POST",
      url: "/containers/v3/containers/manifest",
      data: { containers: ["C1", "C2"], mailingDate: "2026-11-13" },
    });
  });
});
