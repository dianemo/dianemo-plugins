import { tryHandleRequest } from "@dianemo/plugin-kit";
import { neweggSubClient } from "../utils.js";
import {
  NeweggGetIndustryListParams,
  NeweggGetIndustryListResponse,
  NeweggGetSchemaBody,
} from "./types.js";

/**
 * Industry codes gate which feed schemas exist, so this is the lookup that
 * makes `getFeedSchema`'s `IndustryCode` answerable.
 */
export const getIndustryList = async (
  clientName: string,
  params?: NeweggGetIndustryListParams
): Promise<NeweggGetIndustryListResponse> => {
  const res = await tryHandleRequest<NeweggGetIndustryListResponse>(
    {
      clientName: neweggSubClient(clientName, "getIndustryList"),
      requestName: "newegg.sellerManagement.getIndustryList",
      url: `/sellermgmt/seller/industry`,
      method: "GET",
      params,
    },
    "NWG_0017",
    "Failed to get Newegg industry list"
  );
  return res.data;
};

/**
 * Answers with the XSD itself rather than JSON, hence the ArrayBuffer: the
 * caller is expected to hand it to a validator or write it to disk.
 *
 * `PUT` for a read is Newegg's choice, not a mistake — the feed identifier
 * travels in the body.
 */
export const getFeedSchema = async (
  clientName: string,
  data: NeweggGetSchemaBody
): Promise<ArrayBuffer> => {
  const res = await tryHandleRequest<ArrayBuffer>(
    {
      clientName: neweggSubClient(clientName, "getFeedSchema"),
      requestName: "newegg.sellerManagement.getFeedSchema",
      url: `/sellermgmt/seller/feedschema`,
      method: "PUT",
      data: {
        OperationType: "GetFeedSchemaRequest",
        RequestBody: { GetFeedSchema: data },
      },
      responseType: "arraybuffer",
    },
    "NWG_0018",
    "Failed to get Newegg feed schema"
  );
  return res.data;
};
