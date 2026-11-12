import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsDangerousGoodsAcceptanceAuditPreCheckRequestWrapper,
  UpsDangerousGoodsAcceptanceAuditPreCheckResponseWrapper,
  UpsDangerousGoodsChemicalReferenceDataRequestWrapper,
  UpsDangerousGoodsChemicalReferenceDataResponseWrapper,
} from "./types.js";

/** A dated version; a stale pin answers silently — see docs/ups-api.md#version-pins */
const CHEMICAL_REFERENCE_DATA_VERSION = "v2409";

/**
 * Not the spec's `default: v3`, which no other line of that spec supports:
 * the same operation's "Valid values" lists only `v2` — see
 * docs/ups-api.md#dangerous-goods-utility
 */
const ACCEPTANCE_AUDIT_VERSION = "v2";

export const getDangerousGoodsChemicalReferenceData = async (
  clientName: string,
  data: UpsDangerousGoodsChemicalReferenceDataRequestWrapper
): Promise<UpsDangerousGoodsChemicalReferenceDataResponseWrapper> => {
  const res =
    await tryHandleRequest<UpsDangerousGoodsChemicalReferenceDataResponseWrapper>(
      {
        clientName,
        requestName:
          "ups.dangerousGoods.getDangerousGoodsChemicalReferenceData",
        method: "POST",
        url: `/api/dangerousgoods/${CHEMICAL_REFERENCE_DATA_VERSION}/chemicalreferencedata`,
        data,
      },
      "UPS_0055",
      "Failed to get UPS dangerous goods chemical reference data"
    );
  return res.data;
};

export const checkDangerousGoodsAcceptanceAudit = async (
  clientName: string,
  data: UpsDangerousGoodsAcceptanceAuditPreCheckRequestWrapper
): Promise<UpsDangerousGoodsAcceptanceAuditPreCheckResponseWrapper> => {
  const res =
    await tryHandleRequest<UpsDangerousGoodsAcceptanceAuditPreCheckResponseWrapper>(
      {
        clientName,
        requestName: "ups.dangerousGoods.checkDangerousGoodsAcceptanceAudit",
        method: "POST",
        url: `/api/dangerousgoods/${ACCEPTANCE_AUDIT_VERSION}/acceptanceauditprecheck`,
        data,
      },
      "UPS_0056",
      "Failed to run UPS dangerous goods acceptance audit pre-check"
    );
  return res.data;
};
