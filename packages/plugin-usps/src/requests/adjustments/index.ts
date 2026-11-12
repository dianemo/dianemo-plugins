import { tryHandleRequest } from "@dianemo/plugin-kit";
import { uspsSubClient } from "../utils.js";
import type {
  UspsAdjustmentList,
  UspsAdjustmentReconciliationParams,
  UspsAdjustmentReconciliationResponse,
  UspsAdjustmentsParams,
} from "./types.js";

export const getUspsAdjustments = async (
  clientName: string,
  params: UspsAdjustmentsParams
): Promise<UspsAdjustmentList> => {
  const { CRID, trackingNumber, eventType, destinationZIPCode } = params;
  const res = await tryHandleRequest<UspsAdjustmentList>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.adjustments.getUspsAdjustments",
      method: "GET",
      url: `/adjustments/v3/adjustments/${encodeURIComponent(CRID)}/${encodeURIComponent(trackingNumber)}/${eventType}`,
      ...(destinationZIPCode ? { params: { destinationZIPCode } } : {}),
    },
    "USP_0091",
    "Failed to get USPS adjustments"
  );
  return res.data;
};

export const getUspsReconciliationAdjustments = async (
  clientName: string,
  params: UspsAdjustmentReconciliationParams
): Promise<UspsAdjustmentReconciliationResponse> => {
  const { CRID, eventType, startDate, startTime, endDate, endTime } = params;
  const { pageNum, pageSize } = params;
  const query = {
    ...(pageNum !== undefined ? { pageNum } : {}),
    ...(pageSize !== undefined ? { pageSize } : {}),
  };
  const res = await tryHandleRequest<UspsAdjustmentReconciliationResponse>(
    {
      clientName: uspsSubClient(clientName, "default"),
      requestName: "usps.adjustments.getUspsReconciliationAdjustments",
      method: "GET",
      url: `/reconciliation-adjustments/v3/reconciliation-adjustments/${encodeURIComponent(CRID)}/${eventType}/${encodeURIComponent(startDate)}/${encodeURIComponent(startTime)}/${encodeURIComponent(endDate)}/${encodeURIComponent(endTime)}`,
      ...(Object.keys(query).length > 0 ? { params: query } : {}),
    },
    "USP_0092",
    "Failed to get USPS reconciliation adjustments"
  );
  return res.data;
};
