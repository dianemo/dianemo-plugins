import RequestHandler, { memoryBackend } from "@dianemo/core";
import * as api from "../src/requests/mailCampaigns/index.js";
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

const BASE = "/informed-delivery-campaigns/campaigns/CR%2F1";
const ref = { CRID: "CR/1", campaignID: "c 1" };
const campaign = {
  campaignType: "A01",
  mailpieceShape: "LT",
  MID: "123456",
  submitterName: "Acme",
  mailOwnerCRID: "999",
  mailOwnerName: "Acme",
  campaignCode: "code",
  campaignTitle: "title",
  brandDisplayName: "brand",
  startDate: "2026-12-01",
  endDate: "2026-12-31",
  targetUrl: "https://example.com",
  rideAlong: "aGVsbG8=",
};

describe("usps mailCampaigns", () => {
  it("createMailCampaign posts the campaign as JSON to /campaigns/{CRID}", async () => {
    const spy = setup();
    await api.createMailCampaign(CLIENT, { CRID: "CR/1" }, campaign);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.createMailCampaign",
      method: "POST",
      url: BASE,
      data: campaign,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });

  it("searchMailCampaigns passes the documented query parameters", async () => {
    const spy = setup();
    await api.searchMailCampaigns(
      CLIENT,
      { CRID: "CR/1" },
      { limit: 10, offset: 10, status: "ACTIVE", ezsearch: "x" }
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.searchMailCampaigns",
      method: "GET",
      url: BASE,
      params: { limit: 10, offset: 10, status: "ACTIVE", ezsearch: "x" },
    });
  });

  it("getMailCampaign GETs one campaign", async () => {
    const spy = setup();
    await api.getMailCampaign(CLIENT, ref);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.getMailCampaign",
      method: "GET",
      url: `${BASE}/c%201`,
    });
  });

  it("cancelMailCampaign DELETEs with no body", async () => {
    const spy = setup();
    await api.cancelMailCampaign(CLIENT, ref);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.cancelMailCampaign",
      method: "DELETE",
      url: `${BASE}/c%201`,
    });
    expect(spy.mock.calls[0][0].data).toBeUndefined();
  });

  it("editMailCampaign PUTs the changed fields", async () => {
    const spy = setup();
    await api.editMailCampaign(CLIENT, ref, { campaignTitle: "new" });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.editMailCampaign",
      method: "PUT",
      url: `${BASE}/c%201`,
      data: { campaignTitle: "new" },
    });
  });

  it("addMailCampaignImbs posts the IMB string to /pieces", async () => {
    const spy = setup();
    await api.addMailCampaignImbs(CLIENT, ref, {
      IMBs: "0027129806626075690370630330150",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.addMailCampaignImbs",
      method: "POST",
      url: `${BASE}/c%201/pieces`,
      data: { IMBs: "0027129806626075690370630330150" },
    });
  });

  it("searchMailCampaignCallbackKeys GETs /callback with filters", async () => {
    const spy = setup();
    await api.searchMailCampaignCallbackKeys(
      CLIENT,
      { CRID: "CR/1" },
      { campaignID: "7", totalBarcodesFailed: 2 }
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.searchMailCampaignCallbackKeys",
      method: "GET",
      url: `${BASE}/callback`,
      params: { campaignID: "7", totalBarcodesFailed: 2 },
    });
  });

  it("getMailCampaignCallbackSummary GETs /{callbackKey}/summary", async () => {
    const spy = setup();
    await api.getMailCampaignCallbackSummary(CLIENT, {
      CRID: "CR/1",
      callbackKey: "k 1",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.getMailCampaignCallbackSummary",
      method: "GET",
      url: `${BASE}/k%201/summary`,
    });
  });

  it("getMailCampaignCallbackDetail GETs /{callbackKey}/detail with paging", async () => {
    const spy = setup();
    await api.getMailCampaignCallbackDetail(
      CLIENT,
      { CRID: "CR/1", callbackKey: "k" },
      { limit: 50, errorMessage: "bad" }
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.mailCampaigns.getMailCampaignCallbackDetail",
      method: "GET",
      url: `${BASE}/k/detail`,
      params: { limit: 50, errorMessage: "bad" },
    });
  });
});
