import { forwardingClient, forwardingHeaders, forwardingUrl } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsForwardingBookingResponseV1,
  UpsForwardingGetQuoteParams,
  UpsForwardingHeaders,
  UpsForwardingQuoteBookingRequestV1,
  UpsForwardingQuoteDataResponseV1,
  UpsForwardingQuoteDetailRequestV1,
  UpsForwardingQuoteDetailsResponseV1,
} from "./types.js";

export const createForwardingQuote = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingQuoteDetailRequestV1
): Promise<UpsForwardingQuoteDetailsResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingQuoteDetailsResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.createForwardingQuote",
      method: "POST",
      url: forwardingUrl("/quotes"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0118",
    "Failed to create UPS Forwarding quote"
  );
  return res.data;
};

export const searchForwardingQuotes = async (
  clientName: string,
  { businessGuid, clientId, requestType, quoteId }: UpsForwardingGetQuoteParams
): Promise<UpsForwardingQuoteDataResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingQuoteDataResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.searchForwardingQuotes",
      method: "GET",
      url: forwardingUrl("/quotes"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: { request_type: requestType, quote_id: quoteId },
    },
    "UPS_0119",
    "Failed to search UPS Forwarding quotes"
  );
  return res.data;
};

export const bookForwardingQuote = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingQuoteBookingRequestV1
): Promise<UpsForwardingBookingResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingBookingResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.bookForwardingQuote",
      method: "PATCH",
      url: forwardingUrl("/quotes"),
      headers: forwardingHeaders(headers),
      data,
    },
    "UPS_0120",
    "Failed to book UPS Forwarding quote"
  );
  return res.data;
};
