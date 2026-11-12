import { forwardingClient, forwardingHeaders, forwardingUrl } from "./utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsForwardingAccountParams,
  UpsForwardingAirUtilityAccessorialsRequestV1,
  UpsForwardingAirUtilityValidAccessorialsResponseV1,
  UpsForwardingAirportsParams,
  UpsForwardingCitiesParams,
  UpsForwardingGetCityResponseV1,
  UpsForwardingCountryCodeResponseV1,
  UpsForwardingCurrenciesResponseV1,
  UpsForwardingHeaders,
  UpsForwardingPaymentTypeResponseV1,
  UpsForwardingPaymentTypesParams,
  UpsForwardingServiceTypeSearchResponseV1,
  UpsForwardingServiceTypesParams,
  UpsForwardingUtilityAirportDetailResponseV1,
} from "./types.js";

export const getForwardingCities = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingCitiesParams
): Promise<UpsForwardingGetCityResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingGetCityResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingCities",
      method: "GET",
      url: forwardingUrl("/info/cities"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: {
        shipper_account_number: q.shipperAccountNumber,
        country: q.country,
        city: q.city,
        criteria_operator: q.criteriaOperator,
        postal: q.postal,
      },
    },
    "UPS_0111",
    "Failed to get UPS Forwarding cities"
  );
  return res.data;
};

export const getForwardingCurrencies = async (
  clientName: string,
  { businessGuid, clientId, shipperAccountNumber }: UpsForwardingAccountParams
): Promise<UpsForwardingCurrenciesResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingCurrenciesResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingCurrencies",
      method: "GET",
      url: forwardingUrl("/info/currencies"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: { shipper_account_number: shipperAccountNumber },
    },
    "UPS_0112",
    "Failed to get UPS Forwarding currencies"
  );
  return res.data;
};

export const getForwardingPaymentTypes = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingPaymentTypesParams
): Promise<UpsForwardingPaymentTypeResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingPaymentTypeResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingPaymentTypes",
      method: "GET",
      url: forwardingUrl("/info/payment-types"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: {
        shipper_account_number: q.shipperAccountNumber,
        code: q.code,
        incoterm_code: q.incotermCode,
        movement_type_code: q.movementTypeCode,
        origin_country_code: q.originCountryCode,
        destination_country_code: q.destinationCountryCode,
        service_line: q.serviceLine,
      },
    },
    "UPS_0113",
    "Failed to get UPS Forwarding payment types"
  );
  return res.data;
};

export const getForwardingCountries = async (
  clientName: string,
  { businessGuid, clientId, shipperAccountNumber }: UpsForwardingAccountParams
): Promise<UpsForwardingCountryCodeResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingCountryCodeResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingCountries",
      method: "GET",
      url: forwardingUrl("/info/countries"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: { shipper_account_number: shipperAccountNumber },
    },
    "UPS_0114",
    "Failed to get UPS Forwarding countries"
  );
  return res.data;
};

export const getForwardingAirports = async (
  clientName: string,
  { businessGuid, clientId, countryCode }: UpsForwardingAirportsParams
): Promise<UpsForwardingUtilityAirportDetailResponseV1> => {
  const res =
    await tryHandleRequest<UpsForwardingUtilityAirportDetailResponseV1>(
      {
        clientName: forwardingClient(clientName),
        requestName: "ups.forwarding.getForwardingAirports",
        method: "GET",
        url: forwardingUrl("/info/airports"),
        headers: forwardingHeaders({ businessGuid, clientId }),
        params: { country_code: countryCode },
      },
      "UPS_0115",
      "Failed to get UPS Forwarding airports"
    );
  return res.data;
};

export const getForwardingServiceTypes = async (
  clientName: string,
  { businessGuid, clientId, ...q }: UpsForwardingServiceTypesParams
): Promise<UpsForwardingServiceTypeSearchResponseV1> => {
  const res = await tryHandleRequest<UpsForwardingServiceTypeSearchResponseV1>(
    {
      clientName: forwardingClient(clientName),
      requestName: "ups.forwarding.getForwardingServiceTypes",
      method: "GET",
      url: forwardingUrl("/info/service-types"),
      headers: forwardingHeaders({ businessGuid, clientId }),
      params: {
        shipper_city: q.shipperCity,
        shipper_state_code: q.shipperStateCode,
        shipper_postal_code: q.shipperPostalCode,
        shipper_country_code: q.shipperCountryCode,
        consignee_city: q.consigneeCity,
        consignee_state_code: q.consigneeStateCode,
        consignee_postal_code: q.consigneePostalCode,
        consignee_country_code: q.consigneeCountryCode,
        shipper_account_number: q.shipperAccountNumber,
      },
    },
    "UPS_0116",
    "Failed to get UPS Forwarding service types"
  );
  return res.data;
};

export const getForwardingAccessorials = async (
  clientName: string,
  headers: UpsForwardingHeaders,
  data: UpsForwardingAirUtilityAccessorialsRequestV1
): Promise<UpsForwardingAirUtilityValidAccessorialsResponseV1> => {
  const res =
    await tryHandleRequest<UpsForwardingAirUtilityValidAccessorialsResponseV1>(
      {
        clientName: forwardingClient(clientName),
        requestName: "ups.forwarding.getForwardingAccessorials",
        method: "POST",
        url: forwardingUrl("/info/accessorials"),
        headers: forwardingHeaders(headers),
        data,
      },
      "UPS_0117",
      "Failed to get UPS Forwarding accessorials"
    );
  return res.data;
};
