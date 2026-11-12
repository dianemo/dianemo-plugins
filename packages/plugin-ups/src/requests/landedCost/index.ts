import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsLandedCostOptions,
  UpsLandedCostRequest,
  UpsLandedCostResponse,
} from "./types.js";

/** The spec documents `v1` as its default and names no other — see docs/ups-api.md#version-pins */
const LANDED_COST_VERSION = "v1";

/** Estimate duties, taxes and brokerage fees for an international shipment. */
export const getLandedCostQuote = async (
  clientName: string,
  data: UpsLandedCostRequest,
  { accountNumber }: UpsLandedCostOptions = {}
): Promise<UpsLandedCostResponse> => {
  const res = await tryHandleRequest<UpsLandedCostResponse>(
    {
      clientName,
      requestName: "ups.landedCost.getLandedCostQuote",
      method: "POST",
      url: `/api/landedcost/${LANDED_COST_VERSION}/quotes`,
      headers: accountNumber ? { AccountNumber: accountNumber } : undefined,
      data,
    },
    "UPS_0065",
    "Failed to get UPS landed cost quote"
  );
  return res.data;
};
