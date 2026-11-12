import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  USPS_PAYMENT_AUTHORIZE_REQUEST_NAME,
  uspsSubClient,
} from "../utils.js";
import {
  UspsAuthorizePaymentRequest,
  UspsAuthorizePaymentResponse,
  UspsPaymentAccount,
  UspsPaymentAccountParams,
} from "./types.js";

export const authorizePayment = async (
  clientName: string,
  data: UspsAuthorizePaymentRequest
): Promise<UspsAuthorizePaymentResponse> => {
  const res = await tryHandleRequest<UspsAuthorizePaymentResponse>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: USPS_PAYMENT_AUTHORIZE_REQUEST_NAME,
      method: "POST",
      url: "/payments/v3/payment-authorization",
      data,
    },
    "USP_0050",
    "Failed to authorize USPS payment"
  );
  return res.data;
};

/**
 * Group `labels`, like the token mint it sits beside; no payment-token header
 * and no `uspsAccountNumber` metadata, because this endpoint is not
 * token-gated.
 */
export const getUspsPaymentAccount = async (
  clientName: string,
  {
    accountNumber,
    accountType,
    permitZIPCode,
    amount,
  }: UspsPaymentAccountParams
): Promise<UspsPaymentAccount> => {
  const res = await tryHandleRequest<UspsPaymentAccount>(
    {
      clientName: uspsSubClient(clientName, "labels"),
      requestName: "usps.payments.account",
      method: "GET",
      url: `/payments/v3/payment-account/${encodeURIComponent(accountNumber)}`,
      params: {
        accountType,
        ...(permitZIPCode !== undefined && { permitZIPCode }),
        ...(amount !== undefined && { amount }),
      },
    },
    "USP_0014",
    "Failed to get USPS payment account"
  );
  return res.data;
};
