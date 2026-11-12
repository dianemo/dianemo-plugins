import type { UspsAuthorizePaymentRequest } from "../src/requests/payments/types.js";
import RequestHandler, { memoryBackend } from "@dianemo/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resetBinding } from "@dianemo/plugin-kit/testing";
import { TEST_KEY } from "../../../test/fixtures/key.js";
import usps from "../src/index.js";
import {
  authorizePayment,
  getUspsPaymentAccount,
} from "../src/requests/payments/index.js";

afterEach(() => resetBinding());

const CLIENT = "usps:_:main";

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

describe("usps payments", () => {
  it("authorizePayment posts the roles on the labels group with no token metadata", async () => {
    const spy = setup();
    const data: UspsAuthorizePaymentRequest = {
      roles: [{ roleName: "LABEL_OWNER", CRID: "12345678", MID: "123456" }],
    };
    await authorizePayment(CLIENT, data);
    expect(spy.mock.calls[0][0]).toEqual({
      clientName: "usps:_:main:labels",
      requestName: "usps.payments.authorize",
      method: "POST",
      url: "/payments/v3/payment-authorization",
      data,
    });
    expect(spy.mock.calls[0][0].metadata).toBeUndefined();
  });

  it("getUspsPaymentAccount sends accountType and drops unset query parameters", async () => {
    const spy = setup();
    await getUspsPaymentAccount(CLIENT, {
      accountNumber: "1000/0",
      accountType: "EPS",
    });
    const config = spy.mock.calls[0][0];
    expect(config).toMatchObject({
      clientName: "usps:_:main:labels",
      requestName: "usps.payments.account",
      method: "GET",
      url: "/payments/v3/payment-account/1000%2F0",
      params: { accountType: "EPS" },
    });
    expect(config.params).not.toHaveProperty("amount");
    expect(config.params).not.toHaveProperty("permitZIPCode");
    expect(config.metadata).toBeUndefined();
  });

  it("getUspsPaymentAccount passes permitZIPCode and amount, keeping a zero amount", async () => {
    const spy = setup();
    await getUspsPaymentAccount(CLIENT, {
      accountNumber: "3001",
      accountType: "PERMIT",
      permitZIPCode: "22012",
      amount: 0,
    });
    expect(spy.mock.calls[0][0].params).toEqual({
      accountType: "PERMIT",
      permitZIPCode: "22012",
      amount: 0,
    });
  });
});
