import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsCommerceGuardChargebackVerifyRequestV1,
  UpsCommerceGuardChargebackVerifyResponseV1,
  UpsCommerceGuardOptions,
} from "./types.js";

/** The spec's `version` path parameter defaults to `v1` — see docs/ups-api.md#version-pins */
const COMMERCE_GUARD_VERSION = "v1";

/** Score the chargeback risk of an order (UPS Chargeback Protection). */
export const verifyCommerceGuardChargebackRisk = async (
  clientName: string,
  { partnerId, transSrc }: UpsCommerceGuardOptions,
  data: UpsCommerceGuardChargebackVerifyRequestV1
): Promise<UpsCommerceGuardChargebackVerifyResponseV1> => {
  const res =
    await tryHandleRequest<UpsCommerceGuardChargebackVerifyResponseV1>(
      {
        clientName,
        requestName: "ups.commerceGuard.verifyCommerceGuardChargebackRisk",
        method: "POST",
        url: `/api/commerce-guard/${COMMERCE_GUARD_VERSION}/verify`,
        headers: { partnerId, ...(transSrc ? { transSrc } : {}) },
        data,
      },
      "UPS_0071",
      "Failed to verify UPS chargeback risk"
    );
  return res.data;
};
