import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExServiceAvailabilityPackageAndServiceOptionsRequest,
  FedExServiceAvailabilityPackageAndServiceOptionsResponse,
  FedExServiceAvailabilitySpecialServiceOptionsRequest,
  FedExServiceAvailabilitySpecialServiceOptionsResponse,
  FedExServiceAvailabilityTransitTimesRequest,
  FedExServiceAvailabilityTransitTimesResponse,
} from "./types.js";

export const getServicesAndTransitTimes = async (
  clientName: string,
  data: FedExServiceAvailabilityTransitTimesRequest
): Promise<FedExServiceAvailabilityTransitTimesResponse> => {
  const url = "/availability/v1/transittimes";
  const res =
    await tryHandleRequest<FedExServiceAvailabilityTransitTimesResponse>(
      {
        clientName,
        requestName: "fedex.serviceAvailability.getServicesAndTransitTimes",
        method: "POST",
        url,
        data,
      },
      "FDX_0070",
      "Failed to get FedEx services and transit times"
    );
  return res.data;
};

export const getPackageAndServiceOptions = async (
  clientName: string,
  data: FedExServiceAvailabilityPackageAndServiceOptionsRequest
): Promise<FedExServiceAvailabilityPackageAndServiceOptionsResponse> => {
  const url = "/availability/v1/packageandserviceoptions";
  const res =
    await tryHandleRequest<FedExServiceAvailabilityPackageAndServiceOptionsResponse>(
      {
        clientName,
        requestName: "fedex.serviceAvailability.getPackageAndServiceOptions",
        method: "POST",
        url,
        data,
      },
      "FDX_0071",
      "Failed to get FedEx package and service options"
    );
  return res.data;
};

export const getSpecialServiceOptions = async (
  clientName: string,
  data: FedExServiceAvailabilitySpecialServiceOptionsRequest
): Promise<FedExServiceAvailabilitySpecialServiceOptionsResponse> => {
  const url = "/availability/v1/specialserviceoptions";
  const res =
    await tryHandleRequest<FedExServiceAvailabilitySpecialServiceOptionsResponse>(
      {
        clientName,
        requestName: "fedex.serviceAvailability.getSpecialServiceOptions",
        method: "POST",
        url,
        data,
      },
      "FDX_0072",
      "Failed to get FedEx special service options"
    );
  return res.data;
};
