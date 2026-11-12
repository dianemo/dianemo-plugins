import { smartyQueryParams, smartySubClient } from "../utils.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import type {
  SmartyUsReverseGeoParams,
  SmartyUsReverseGeoResponse,
} from "./types.js";

/** Returns the addresses nearest a coordinate. */
export const reverseGeocodeSmartyUs = async (
  clientName: string,
  params: SmartyUsReverseGeoParams
): Promise<SmartyUsReverseGeoResponse> => {
  const res = await tryHandleRequest<SmartyUsReverseGeoResponse>(
    {
      clientName: smartySubClient(clientName, "usReverseGeo"),
      requestName: "smarty.usReverseGeo.reverseGeocodeSmartyUs",
      method: "GET",
      url: "/lookup",
      params: smartyQueryParams(params),
    },
    "SMT_0007",
    "Smarty US reverse geocoding failed"
  );
  return res.data;
};
