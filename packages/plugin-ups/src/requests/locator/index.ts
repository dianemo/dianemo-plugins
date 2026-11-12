import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsLocatorRequestWrapper,
  UpsLocatorResponseWrapper,
  UpsLocatorSearchParams,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const LOCATOR_VERSION = "v3";

export const searchUpsLocations = async (
  clientName: string,
  { reqOption, locale }: UpsLocatorSearchParams,
  data: UpsLocatorRequestWrapper
): Promise<UpsLocatorResponseWrapper> => {
  const res = await tryHandleRequest<UpsLocatorResponseWrapper>(
    {
      clientName,
      requestName: "ups.locator.searchUpsLocations",
      method: "POST",
      url: `/api/locations/${LOCATOR_VERSION}/search/availabilities/${reqOption}`,
      ...(locale && { params: { Locale: locale } }),
      data,
    },
    "UPS_0062",
    "Failed to search UPS locations"
  );
  return res.data;
};
