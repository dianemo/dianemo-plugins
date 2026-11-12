import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  RateResponse,
  RateOptions,
  GetPackageRating,
  UPSAdditionalInfoOptions,
  UPSRequestOption,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const DEFAULT_RATING_VERSION = "v2409";

const TIME_IN_TRANSIT_OPTIONS: UPSRequestOption[] = [
  UPSRequestOption.Ratetimeintransit,
  UPSRequestOption.Shoptimeintransit,
];

/**
 * Rate when the shipment names a service, Shop when it does not. Ground Freight
 * Pricing is Rate-only, and the FRS indicator is what marks a request as GFP, so
 * it wins over the missing service code.
 */
const deriveRequestOption = (data: GetPackageRating): UPSRequestOption => {
  const shipment = data.RateRequest?.Shipment;
  const isGfp = shipment?.ShipmentRatingOptions?.FRSShipmentIndicator != null;
  return shipment?.Service?.Code || isGfp
    ? UPSRequestOption.Rate
    : UPSRequestOption.Shop;
};

export const getUpsRate = async (
  clientName: string,
  data: GetPackageRating,
  options: RateOptions = {
    version: DEFAULT_RATING_VERSION,
  }
): Promise<RateResponse> => {
  const version = options.version || DEFAULT_RATING_VERSION;
  const requestOption = options.requestOption ?? deriveRequestOption(data);
  const wantsTimeInTransit =
    options.additionalinfo?.includes(UPSAdditionalInfoOptions.timeintransit) ||
    (data.RateRequest.Shipment.DeliveryTimeInformation &&
      !TIME_IN_TRANSIT_OPTIONS.includes(requestOption));
  const url = `/api/rating/${version}/${requestOption}${
    wantsTimeInTransit ? "?additionalinfo=timeintransit" : ""
  }`;
  const res = await tryHandleRequest<{ RateResponse: RateResponse }>(
    {
      clientName,
      requestName: "ups.rating.getRate",
      method: "POST",
      url,
      data,
    },
    "UPS_0002",
    "Failed to get UPS shipping rate"
  );
  return res?.data.RateResponse;
};
