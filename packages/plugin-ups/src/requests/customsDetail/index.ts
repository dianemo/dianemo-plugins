import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsCustomsDetailRequirementsParams,
  UpsCustomsDetailRequirementsResponse,
  UpsCustomsDetailSubmission,
  UpsCustomsDetailSubmitOptions,
} from "./types.js";

/**
 * The spec's server URL carries a `{version}` with no `variables` block, so the
 * value is inferred from the title and `info.version` — see
 * docs/ups-api.md#version-pins
 */
const CUSTOMS_DETAIL_VERSION = "v2";
const CUSTOMS_DETAIL_PATH = `/api/trade/compliance/${CUSTOMS_DETAIL_VERSION}/content/fields/customs-detail`;

/**
 * Query keys are the spec's snake_case ones; array values are comma-joined
 * because the spec documents them as comma-separated lists, and axios would
 * otherwise send `key[]=a&key[]=b`.
 */
const toQuery = (p: UpsCustomsDetailRequirementsParams) => {
  const entries: [string, string | undefined][] = [
    ["import_country_code", p.importCountryCode],
    ["export_country_code", p.exportCountryCode],
    ["locale", p.locale],
    ["commodity_codes", p.commodityCodes?.join(",")],
    ["shipment_type", p.shipmentType],
    ["shipment_weight", p.shipmentWeight?.toString()],
    ["shipment_weight_unit", p.shipmentWeightUnit],
    ["shipment_value", p.shipmentValue?.toString()],
    ["shipment_value_currency", p.shipmentValueCurrency],
    ["user_roles", p.userRoles?.join(",")],
    ["commerce_model", p.commerceModel],
  ];
  return Object.fromEntries(
    entries.filter((e): e is [string, string] => e[1] !== undefined)
  );
};

/** Fetch the customs data fields a lane or commodity requires. */
export const getCustomsDetailRequirements = async (
  clientName: string,
  params: UpsCustomsDetailRequirementsParams = {}
): Promise<UpsCustomsDetailRequirementsResponse> => {
  const res = await tryHandleRequest<UpsCustomsDetailRequirementsResponse>(
    {
      clientName,
      requestName: "ups.customsDetail.getCustomsDetailRequirements",
      method: "GET",
      url: CUSTOMS_DETAIL_PATH,
      params: toQuery(params),
    },
    "UPS_0075",
    "Failed to get UPS customs detail requirements"
  );
  return res.data;
};

/**
 * Validate or save customs field values. UPS answers 204 with no body, so the
 * resolved value is empty; a failed validation arrives as a 422.
 */
export const submitCustomsDetail = async (
  clientName: string,
  data: UpsCustomsDetailSubmission,
  { registrationId }: UpsCustomsDetailSubmitOptions = {}
): Promise<void> => {
  await tryHandleRequest<void>(
    {
      clientName,
      requestName: "ups.customsDetail.submitCustomsDetail",
      method: "POST",
      url: CUSTOMS_DETAIL_PATH,
      data,
      ...(registrationId && { headers: { registrationId } }),
    },
    "UPS_0076",
    "Failed to submit UPS customs detail"
  );
};
