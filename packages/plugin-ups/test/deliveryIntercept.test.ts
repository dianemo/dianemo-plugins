import * as intercept from "../src/requests/deliveryIntercept/index.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import ups from "../src/index.js";
import {
  UpsDeliveryInterceptParams,
  UpsDeliveryInterceptRequestV2,
} from "../src/requests/deliveryIntercept/types.js";

afterEach(() => resetBinding());

const CLIENT = "ups:_:production";
const params: UpsDeliveryInterceptParams = {
  trackingNumber: "1ZA2F8810719086435",
};
const body: UpsDeliveryInterceptRequestV2 = {
  requestType: "WC",
  requesterContactInfo: { name: "John", telephone: "+12010000000" },
  specialInstructions: null,
};
const HEADERS = {
  platformType: "XOLT",
  inquiryType: "U",
  "Content-Type": "application/json",
};

const setup = () => {
  const handler = new RequestHandler({
    key: TEST_KEY,
    backend: memoryBackend(),
  });
  const spy = vi
    .spyOn(handler, "handleRequest")
    .mockResolvedValue({ data: { ok: true } } as never);
  handler.use(ups);
  return spy;
};

describe("ups deliveryIntercept", () => {
  it("sends a transId within this API's 14-character cap", async () => {
    const spy = setup();
    await intercept.getDeliveryInterceptEligibility(CLIENT, params);
    const generated = spy.mock.calls[0][0].headers?.transId as string;
    expect(generated).toMatch(/^[a-zA-Z0-9]{14}$/);

    await intercept.getDeliveryInterceptEligibility(CLIENT, {
      ...params,
      transId: "SUPER14",
    });
    expect(spy.mock.calls[1][0].headers?.transId).toBe("SUPER14");
  });

  it("getDeliveryInterceptCharges posts the rating request to /charges", async () => {
    const spy = setup();
    const data = { ratingRequest: [] };
    await intercept.getDeliveryInterceptCharges(CLIENT, params, data as never);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: "ups.deliveryIntercept.getDeliveryInterceptCharges",
      method: "POST",
      url: "/api/deliveryintercept/v2/charges/1ZA2F8810719086435",
      headers: HEADERS,
      data,
    });
  });

  it("getDeliveryInterceptEligibility is a GET with no body", async () => {
    const spy = setup();
    await intercept.getDeliveryInterceptEligibility(CLIENT, params);
    const config = spy.mock.calls[0][0];
    expect(config).toMatchObject({
      requestName: "ups.deliveryIntercept.getDeliveryInterceptEligibility",
      method: "GET",
      url: "/api/deliveryintercept/v2/eligibility/intercept/1ZA2F8810719086435",
      headers: HEADERS,
    });
    expect(config.data).toBeUndefined();
  });

  it.each([
    ["redirectDeliveryInterceptToAddress", "redirect/address"],
    ["requestDeliveryInterceptWillCall", "willcall"],
    ["requestDeliveryInterceptReturn", "return"],
    ["rescheduleDeliveryIntercept", "reschedule"],
    ["cancelDeliveryIntercept", "cancel"],
  ] as const)("%s posts the intercept body to /%s", async (fn, segment) => {
    const spy = setup();
    await intercept[fn](CLIENT, params, body);
    expect(spy.mock.calls[0][0]).toMatchObject({
      clientName: CLIENT,
      requestName: `ups.deliveryIntercept.${fn}`,
      method: "POST",
      url: `/api/deliveryintercept/v2/${segment}/1ZA2F8810719086435`,
      headers: HEADERS,
      data: body,
    });
  });

  it("appends the optional loc query parameter", async () => {
    const spy = setup();
    await intercept.cancelDeliveryIntercept(
      CLIENT,
      { ...params, loc: "en_US" },
      body
    );
    expect(spy.mock.calls[0][0].url).toBe(
      "/api/deliveryintercept/v2/cancel/1ZA2F8810719086435?loc=en_US"
    );
  });
});
