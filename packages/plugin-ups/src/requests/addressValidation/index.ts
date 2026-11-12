import { tryHandleRequest } from "@dianemo/plugin-kit";
import {
  UpsAddressValidationOptions,
  XAVRequest,
  XAVResponse,
} from "./types.js";

/** Not a dated version, unlike the rest of UPS — see docs/ups-api.md#version-pins */
const XAV_VERSION = "v2";

/**
 * Validation *and* classification in one call: the candidate list plus whether
 * the address is residential or commercial. `1` is validation only, `2`
 * classification only.
 */
const XAV_DEFAULT_REQUEST_OPTION = 3;

/** A narrowing, not the default (15) — see docs/ups-api.md#address-validation-query-parameters */
const XAV_DEFAULT_MAX_CANDIDATES = 10;

export const makeUpsAddressValidationRequest = async (
  clientName: string,
  data: XAVRequest,
  options: UpsAddressValidationOptions = {}
): Promise<XAVResponse> => {
  // Query names are all lowercase and unknown ones are ignored silently —
  // docs/ups-api.md#address-validation-query-parameters
  const query = new URLSearchParams({
    maximumcandidatelistsize: String(
      options.maximumCandidateListSize ?? XAV_DEFAULT_MAX_CANDIDATES
    ),
  });
  if (options.regionalRequestIndicator !== undefined) {
    query.set(
      "regionalrequestindicator",
      String(options.regionalRequestIndicator)
    );
  }
  const requestOption = options.requestOption ?? XAV_DEFAULT_REQUEST_OPTION;
  const res = await tryHandleRequest<XAVResponse>(
    {
      clientName,
      requestName: "ups.addressValidation.validate",
      method: "POST",
      url: `/api/addressvalidation/${XAV_VERSION}/${requestOption}?${query}`,
      data,
    },
    "UPS_0004",
    "Failed to validate UPS address"
  );
  return res.data;
};
