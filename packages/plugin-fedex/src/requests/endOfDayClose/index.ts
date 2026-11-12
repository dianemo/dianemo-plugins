import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  FedExCloseGroundRequest,
  FedExCloseReprintRequest,
  FedExCloseResponse,
} from "./types.js";

// The spec writes this path with a trailing slash; it is kept verbatim.
const END_OF_DAY_URL = "/ship/v1/endofday/";

export const groundEndOfDayClose = async (
  clientName: string,
  data: FedExCloseGroundRequest
): Promise<FedExCloseResponse> => {
  const url = END_OF_DAY_URL;
  const res = await tryHandleRequest<FedExCloseResponse>(
    {
      clientName,
      requestName: "fedex.endOfDayClose.groundEndOfDayClose",
      method: "PUT",
      url,
      data,
    },
    "FDX_0084",
    "Failed to close FedEx Ground end of day"
  );
  return res.data;
};

export const reprintEndOfDayClose = async (
  clientName: string,
  data: FedExCloseReprintRequest
): Promise<FedExCloseResponse> => {
  const url = END_OF_DAY_URL;
  const res = await tryHandleRequest<FedExCloseResponse>(
    {
      clientName,
      requestName: "fedex.endOfDayClose.reprintEndOfDayClose",
      method: "POST",
      url,
      data,
    },
    "FDX_0085",
    "Failed to reprint FedEx Ground end of day close"
  );
  return res.data;
};
