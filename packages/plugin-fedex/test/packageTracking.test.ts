import type { FedExTrackReferencesRequest } from "../src/requests/packageTracking/types.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import fedex from "../src/index.js";

afterEach(() => resetBinding());

const CLIENT = "fedex:_:production";

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  const { fedex: requests } = handler.use(fedex);
  return { spy, requests };
};

const trackingNumberInfo = { trackingNumber: "123456789012" };

describe("plugin-fedex packageTracking", () => {
  const cases = [
    {
      fn: "trackPackages",
      requestName: "fedex.packageTracking.track",
      url: "/track/v1/trackingnumbers",
      body: {
        includeDetailedScans: true,
        trackingInfo: [{ trackingNumberInfo }],
      },
    },
    {
      fn: "trackMultiplePieceShipment",
      requestName: "fedex.packageTracking.trackMultiplePieceShipment",
      url: "/track/v1/associatedshipments",
      body: {
        masterTrackingNumberInfo: { trackingNumberInfo },
        associatedType: "STANDARD_MPS",
      },
    },
    {
      fn: "sendTrackingNotification",
      requestName: "fedex.packageTracking.sendTrackingNotification",
      url: "/track/v1/notifications",
      body: {
        senderContactName: "Sender",
        senderEMailAddress: "sender@example.com",
        trackingNumberInfo,
        trackingEventNotificationDetail: {
          trackingNotifications: [
            {
              notificationDetail: {
                localization: { languageCode: "en" },
                emailDetail: { emailAddress: "to@example.com" },
                notificationType: "HTML",
              },
              notificationEventTypes: ["ON_DELIVERY"],
            },
          ],
        },
      },
    },
    {
      fn: "trackByReferences",
      requestName: "fedex.packageTracking.trackByReferences",
      url: "/track/v1/referencenumbers",
      body: {
        referencesInformation: {
          value: "56754674567546754",
          accountNumber: "697561862",
          shipDateBegin: "2019-02-13",
          shipDateEndDate: "2019-02-14",
        },
      },
    },
    {
      fn: "trackByTrackingControlNumber",
      requestName: "fedex.packageTracking.trackByTrackingControlNumber",
      url: "/track/v1/tcn",
      body: { tcnInfo: { value: "N552428361Y555XXX" } },
    },
    {
      fn: "getTrackingDocuments",
      requestName: "fedex.packageTracking.getTrackingDocuments",
      url: "/track/v1/trackingdocuments",
      body: {
        trackDocumentDetail: { documentType: "SIGNATURE_PROOF_OF_DELIVERY" },
        trackDocumentSpecification: [{ trackingNumberInfo }],
      },
    },
  ] as const;

  it.each(cases)(
    "$fn posts to $url",
    async ({ fn, requestName, url, body }) => {
      const { spy, requests } = setup();
      const call = requests[fn] as (c: string, d: unknown) => Promise<unknown>;

      const result = await call(CLIENT, body);

      expect(result).toEqual({ ok: true });
      expect(spy).toHaveBeenCalledOnce();
      const config = spy.mock.calls[0][0];
      expect(config.clientName).toBe(CLIENT);
      expect(config.requestName).toBe(requestName);
      expect(config.method).toBe("POST");
      expect(config.url).toBe(url);
      expect(config.data).toBe(body);
    }
  );
});

describe("plugin-fedex trackByReferences end date", () => {
  const base = {
    value: "56754674567546754",
    accountNumber: "697561862",
    shipDateBegin: "2019-02-13",
  };

  it.each([
    ["shipDateEndDate", { ...base, shipDateEndDate: "2019-02-14" }],
    ["shipDateEnd", { ...base, shipDateEnd: "2019-02-14" }],
  ] as const)("accepts %s and sends it unchanged", async (_, info) => {
    const { spy, requests } = setup();
    await requests.trackByReferences(CLIENT, { referencesInformation: info });
    expect(spy.mock.calls[0][0].data).toEqual({ referencesInformation: info });
  });

  it("rejects both spellings together and neither, at the type level", () => {
    const both: FedExTrackReferencesRequest = {
      // @ts-expect-error exactly one spelling is allowed
      referencesInformation: {
        ...base,
        shipDateEnd: "a",
        shipDateEndDate: "b",
      },
    };
    const neither: FedExTrackReferencesRequest = {
      // @ts-expect-error one spelling is required
      referencesInformation: { ...base },
    };
    expect([both, neither]).toHaveLength(2);
  });
});
