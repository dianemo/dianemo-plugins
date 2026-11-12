import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsGuaranteedQuoteOptions,
  UpsGuaranteedQuoteRequest,
  UpsGuaranteedQuoteResponse,
} from "./types.js";

/** `v1` is the only value the spec's server variable allows — see docs/ups-api.md#version-pins */
const BROKERAGE_VERSION = "v1";

/** Request a Global Checkout guaranteed landed cost quote. */
export const createGuaranteedQuote = async (
  clientName: string,
  data: UpsGuaranteedQuoteRequest,
  { registrationId }: UpsGuaranteedQuoteOptions = {}
): Promise<UpsGuaranteedQuoteResponse> => {
  const res = await tryHandleRequest<UpsGuaranteedQuoteResponse>(
    {
      clientName,
      requestName: "ups.guaranteedQuote.createGuaranteedQuote",
      method: "POST",
      url: `/api/brokerage/${BROKERAGE_VERSION}/content/glc/request-quote`,
      headers: registrationId
        ? { "registration-id": registrationId }
        : undefined,
      data,
    },
    "UPS_0066",
    "Failed to create UPS guaranteed quote"
  );
  return res.data;
};
