import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsExportAssureOptions,
  UpsExportAssurePartialResponse,
  UpsExportAssureRequest,
  UpsExportAssureResponse,
} from "./types.js";

/** `v1` is the only value the spec's server variable allows — see docs/ups-api.md#version-pins */
const BROKERAGE_VERSION = "v1";

/**
 * Submit shipment details for description, POA and import/export guidance.
 *
 * UPS answers 207 when some of the requested checks failed; axios treats that
 * as success, so the body may be the partial shape, which carries `response`
 * alongside `shipment` — see docs/ups-api.md#export-assure
 */
export const submitExportAssure = async (
  clientName: string,
  data: UpsExportAssureRequest,
  { accountNumber }: UpsExportAssureOptions = {}
): Promise<UpsExportAssureResponse | UpsExportAssurePartialResponse> => {
  const res = await tryHandleRequest<
    UpsExportAssureResponse | UpsExportAssurePartialResponse
  >(
    {
      clientName,
      requestName: "ups.exportAssure.submitExportAssure",
      method: "POST",
      url: `/api/brokerage/${BROKERAGE_VERSION}/importexport/exportassure`,
      headers: accountNumber ? { accountNumber } : undefined,
      data,
    },
    "UPS_0067",
    "Failed to submit UPS Export Assure request"
  );
  return res.data;
};
