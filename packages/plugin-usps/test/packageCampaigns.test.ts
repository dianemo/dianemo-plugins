import * as api from "../src/requests/packageCampaigns/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = "usps:_:main:default";

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

const BASE = "/informed-delivery-package-campaigns/campaigns/CR%2F1";
const ref = { CRID: "CR/1", campaignID: "c 1" };
const campaign = {
  MID: "123456",
  submitterName: "Acme",
  mailOwnerCRID: "999",
  mailOwnerName: "Acme",
  campaignCode: "code",
  campaignGroupingCode: "group",
  campaignTitle: "title",
  brandDisplayName: "brand",
  startDate: "2026-12-01",
  endDate: "2026-12-31",
  targetUrl: "https://example.com",
  rideAlong: "aGVsbG8=",
};

describe("usps packageCampaigns", () => {
  it("createPackageCampaign posts the campaign", async () => {
    const spy = setup();
    await api.createPackageCampaign(CLIENT, { CRID: "CR/1" }, campaign);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.createPackageCampaign",
      method: "POST",
      url: BASE,
      data: campaign,
    });
  });

  it("searchPackageCampaigns passes the documented query parameters", async () => {
    const spy = setup();
    await api.searchPackageCampaigns(
      CLIENT,
      { CRID: "CR/1" },
      { campaignGroupingCode: "g", status: "COMPLETE", limit: 5 }
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.searchPackageCampaigns",
      method: "GET",
      url: BASE,
      params: { campaignGroupingCode: "g", status: "COMPLETE", limit: 5 },
    });
  });

  it("getPackageCampaign GETs one campaign", async () => {
    const spy = setup();
    await api.getPackageCampaign(CLIENT, ref);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.getPackageCampaign",
      method: "GET",
      url: `${BASE}/c%201`,
    });
  });

  it("editPackageCampaign PUTs the changed fields", async () => {
    const spy = setup();
    await api.editPackageCampaign(CLIENT, ref, { campaignTitle: "new" });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.editPackageCampaign",
      method: "PUT",
      url: `${BASE}/c%201`,
      data: { campaignTitle: "new" },
    });
  });

  it("cancelPackageCampaign DELETEs with no body", async () => {
    const spy = setup();
    await api.cancelPackageCampaign(CLIENT, ref);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.cancelPackageCampaign",
      method: "DELETE",
      url: `${BASE}/c%201`,
    });
    expect(spy.mock.calls[0][0].data).toBeUndefined();
  });

  it("addPackageCampaignTrackingNumbers posts to /pieces", async () => {
    const spy = setup();
    await api.addPackageCampaignTrackingNumbers(CLIENT, ref, {
      trackingNumbers: "9400111899223197428490",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.packageCampaigns.addPackageCampaignTrackingNumbers",
      method: "POST",
      url: `${BASE}/c%201/pieces`,
      data: { trackingNumbers: "9400111899223197428490" },
    });
  });
});
