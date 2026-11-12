import RequestHandler, { memoryBackend } from "@dianemo/core";
import * as tracking from "../src/requests/tracking/index.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import type {
  UspsTrackingNotificationRequest,
  UspsTrackingProofOfDeliveryRequest,
  UspsTrackingV3r2NotificationRequest,
  UspsTrackingV3r2ProofOfDeliveryRequest,
  UspsTrackingV3r2Request,
} from "../src/requests/tracking/types.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";
const GROUP = "usps:_:main:default";
const TRACKING = "9400 1/ABC";
const ENCODED = encodeURIComponent(TRACKING);

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

describe("usps tracking v3", () => {
  it("trackPackage asks for DETAIL by default and encodes the number", async () => {
    const spy = setup();
    await tracking.trackPackage(CLIENT, TRACKING);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.get",
      method: "GET",
      url: `/tracking/v3/tracking/${ENCODED}`,
      params: { expand: "DETAIL" },
    });
    expect(spy.mock.calls[0][0].headers).toBeUndefined();
  });

  it("trackPackage forwards the documented query and header options", async () => {
    const spy = setup();
    await tracking.trackPackage(CLIENT, TRACKING, {
      expand: "SUMMARY",
      destinationZIPCode: "90210",
      mailingDate: "2026-11-01",
      forwardedFor: "203.0.113.7",
    });
    expect(spy.mock.calls[0][0]).toMatchObject({
      params: {
        expand: "SUMMARY",
        destinationZIPCode: "90210",
        mailingDate: "2026-11-01",
      },
      headers: { "X-Forwarded-For": "203.0.113.7" },
    });
  });

  it("registerTrackingNotifications posts the body to /notifications", async () => {
    const spy = setup();
    const data: UspsTrackingNotificationRequest = {
      uniqueMailPieceId: "mp1",
      notifyEventTypes: ["EMAIL_ALERT"],
      notifications: [{ email: "a@example.com" }],
    };
    await tracking.registerTrackingNotifications(
      CLIENT,
      { trackingNumber: TRACKING, forwardedFor: "203.0.113.7" },
      data
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.registerNotifications",
      method: "POST",
      url: `/tracking/v3/tracking/${ENCODED}/notifications`,
      data,
      headers: { "X-Forwarded-For": "203.0.113.7" },
    });
  });

  it("requestTrackingProofOfDelivery posts the body to /proof-of-delivery", async () => {
    const spy = setup();
    const data: UspsTrackingProofOfDeliveryRequest = {
      uniqueMailPieceID: "mp1",
      mailPieceIntakeDate: "2026-11-01",
      tableCode: "T",
      requestType: "email",
      firstName: "A",
      lastName: "B",
      email: ["a@example.com"],
    };
    await tracking.requestTrackingProofOfDelivery(
      CLIENT,
      { trackingNumber: TRACKING },
      data
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.requestProofOfDelivery",
      method: "POST",
      url: `/tracking/v3/tracking/${ENCODED}/proof-of-delivery`,
      data,
    });
    expect(spy.mock.calls[0][0].headers).toBeUndefined();
  });
});

describe("usps tracking v3r2", () => {
  it("trackPackagesV3r2 posts the array body to /tracking/v3r2/tracking", async () => {
    const spy = setup();
    const data: UspsTrackingV3r2Request = [
      { trackingNumber: "9400111", includeVeriPoint: true },
      { trackingNumber: "9400222", destinationZIPCode: "90210" },
    ];
    await tracking.trackPackagesV3r2(CLIENT, data);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.trackV3r2",
      method: "POST",
      url: "/tracking/v3r2/tracking",
      data,
    });
  });

  it("registerTrackingNotificationsV3r2 posts to the v3r2 /notifications", async () => {
    const spy = setup();
    const data: UspsTrackingV3r2NotificationRequest = {
      uniqueTrackingID: "u1",
      notifyEventTypes: ["ALL_UPDATES"],
      recipients: [{ email: "a@example.com" }],
    };
    await tracking.registerTrackingNotificationsV3r2(
      CLIENT,
      { trackingNumber: TRACKING },
      data
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.registerNotificationsV3r2",
      method: "POST",
      url: `/tracking/v3r2/tracking/${ENCODED}/notifications`,
      data,
    });
  });

  it("requestTrackingProofOfDeliveryV3r2 posts to the v3r2 /proof-of-delivery", async () => {
    const spy = setup();
    const data: UspsTrackingV3r2ProofOfDeliveryRequest = {
      uniqueTrackingID: "u1",
      recipients: [{ email: "a@example.com", firstName: "A", lastName: "B" }],
    };
    await tracking.requestTrackingProofOfDeliveryV3r2(
      CLIENT,
      { trackingNumber: TRACKING },
      data
    );
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: GROUP,
      requestName: "usps.tracking.requestProofOfDeliveryV3r2",
      method: "POST",
      url: `/tracking/v3r2/tracking/${ENCODED}/proof-of-delivery`,
      data,
    });
  });
});
