import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsPickupPointsPickupPointOrderRequest,
  UpsPickupPointsPickupPointOrderResponse,
  UpsPickupPointsSessionOptions,
  UpsPickupPointsSiteDetailsDateRange,
  UpsPickupPointsSiteDetailsFilters,
  UpsPickupPointsSiteDetailsOptions,
  UpsPickupPointsSiteDetailsQueryOptions,
  UpsPickupPointsSiteDetailsRequest,
  UpsPickupPointsSiteDetailsResponse,
  UpsPickupPointsSubscriptionSitesResponse,
  UpsPickupPointsTrackingRequest,
  UpsPickupPointsTrackingResponse,
  UpsPickupPointsUserOptions,
} from "./types.js";

/**
 * See docs/ups-api.md#version-pins; this spec lists `v1` as its only value. Its
 * `servers` block gives "Not Available" for the test environment, so every call
 * here goes to production — docs/ups-api.md#ups-pickup-points.
 */
const PICKUP_POINTS_VERSION = "v1";
const PICKUP_POINTS_PATH = `/api/uppmanage/${PICKUP_POINTS_VERSION}`;

/** `Authorization`, `transId` and `transactionSrc` come from the client. */
const sessionHeaders = ({
  clientId,
  locale,
  sessionId,
}: UpsPickupPointsSessionOptions) => ({
  clientId,
  locale,
  ...(sessionId && { sessionid: sessionId }),
});

const userHeaders = ({
  cookie,
  username,
  uuid,
}: UpsPickupPointsUserOptions) => ({
  Cookie: cookie,
  Username: username,
  ...(uuid && { UUID: uuid }),
});

const siteDetailsPath = ({
  startDate,
  endDate,
}: UpsPickupPointsSiteDetailsDateRange) =>
  `${PICKUP_POINTS_PATH}/sites/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`;

/** Query string shared by the GET and POST site-details operations. */
const siteDetailsQuery = (filters: UpsPickupPointsSiteDetailsFilters) => {
  const query = new URLSearchParams();
  const { offset, limit, sort, locationIdentifier } = filters;
  if (offset !== undefined) query.set("offset", offset);
  if (limit !== undefined) query.set("limit", limit);
  if (sort !== undefined) query.set("sort", sort);
  if (locationIdentifier !== undefined) {
    query.set("location_identifier", locationIdentifier);
  }
  return query;
};

const withQuery = (path: string, query: URLSearchParams) =>
  query.size > 0 ? `${path}?${query}` : path;

/** Confirm a pickup order at a pickup point. */
export const confirmPickupPointsOrder = async (
  clientName: string,
  options: UpsPickupPointsSessionOptions,
  data: UpsPickupPointsPickupPointOrderRequest
): Promise<UpsPickupPointsPickupPointOrderResponse> => {
  const res = await tryHandleRequest<UpsPickupPointsPickupPointOrderResponse>(
    {
      clientName,
      requestName: "ups.pickupPoints.confirmPickupPointsOrder",
      method: "POST",
      url: `${PICKUP_POINTS_PATH}/orders`,
      headers: sessionHeaders(options),
      data,
    },
    "UPS_0038",
    "Failed to confirm UPS pickup points order"
  );
  return res.data;
};

/** Inbound tracking numbers for a pickup point location. */
export const getPickupPointsInboundTrackingNumbers = async (
  clientName: string,
  options: UpsPickupPointsSessionOptions,
  data: UpsPickupPointsTrackingRequest
): Promise<UpsPickupPointsTrackingResponse> => {
  const res = await tryHandleRequest<UpsPickupPointsTrackingResponse>(
    {
      clientName,
      requestName: "ups.pickupPoints.getPickupPointsInboundTrackingNumbers",
      method: "POST",
      url: `${PICKUP_POINTS_PATH}/locations/inbound/tracking-numbers`,
      headers: sessionHeaders(options),
      data,
    },
    "UPS_0039",
    "Failed to get UPS pickup points inbound tracking numbers"
  );
  return res.data;
};

/**
 * Site details for a date range, looked up by inbound token. The spec names
 * this POST `getSiteDetailsByDateRange`; it reads, it does not update — the
 * name is this plugin's, kept for the POST/GET pair — see
 * docs/ups-api.md#ups-pickup-points.
 */
export const updatePickupPointsSiteDetails = async (
  clientName: string,
  options: UpsPickupPointsSiteDetailsOptions,
  data: UpsPickupPointsSiteDetailsRequest
): Promise<UpsPickupPointsSiteDetailsResponse> => {
  const res = await tryHandleRequest<UpsPickupPointsSiteDetailsResponse>(
    {
      clientName,
      requestName: "ups.pickupPoints.updatePickupPointsSiteDetails",
      method: "POST",
      url: withQuery(siteDetailsPath(options), siteDetailsQuery(options)),
      headers: { ...sessionHeaders(options), ...userHeaders(options) },
      data,
    },
    "UPS_0040",
    "Failed to update UPS pickup points site details"
  );
  return res.data;
};

/** Site details for a date range, filtered by location. */
export const getPickupPointsSiteDetails = async (
  clientName: string,
  options: UpsPickupPointsSiteDetailsQueryOptions
): Promise<UpsPickupPointsSiteDetailsResponse> => {
  const query = siteDetailsQuery(options);
  const { locationIdentifierCategoryCode, city, state, country } = options;
  if (locationIdentifierCategoryCode !== undefined) {
    query.set("location_id_category_code", locationIdentifierCategoryCode);
  }
  if (city !== undefined) query.set("city", city);
  if (state !== undefined) query.set("state", state);
  if (country !== undefined) query.set("country", country);
  const res = await tryHandleRequest<UpsPickupPointsSiteDetailsResponse>(
    {
      clientName,
      requestName: "ups.pickupPoints.getPickupPointsSiteDetails",
      method: "GET",
      url: withQuery(siteDetailsPath(options), query),
      headers: { ...sessionHeaders(options), ...userHeaders(options) },
    },
    "UPS_0041",
    "Failed to get UPS pickup points site details"
  );
  return res.data;
};

/** The caller's pickup point subscriptions. */
export const getPickupPointsSubscriptions = async (
  clientName: string,
  options: UpsPickupPointsSessionOptions & UpsPickupPointsUserOptions
): Promise<UpsPickupPointsSubscriptionSitesResponse> => {
  const res = await tryHandleRequest<UpsPickupPointsSubscriptionSitesResponse>(
    {
      clientName,
      requestName: "ups.pickupPoints.getPickupPointsSubscriptions",
      method: "GET",
      url: `${PICKUP_POINTS_PATH}/subscriptions/sites`,
      headers: { ...sessionHeaders(options), ...userHeaders(options) },
    },
    "UPS_0042",
    "Failed to get UPS pickup points subscriptions"
  );
  return res.data;
};

export type * from "./types.js";
