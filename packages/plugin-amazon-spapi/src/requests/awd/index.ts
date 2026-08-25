import { AwsRegion } from "../../utils/amazonSpapiData.js";
import handleSpapiRequest from "../handleSpapiRequest.js";
import { AwdInventoryListing } from "./types.js";
import { QueryData } from "../types.js";

/**
 * Amazon Warehousing and Distribution inventory, which is a separate pool from
 * FBA — an AWD sku does not appear in `fbaInventoryGetInventorySummaries`.
 *
 * Paged by `nextToken`, and the tightest budget in this plugin: two requests
 * per second with no burst above it.
 */
export const getAwdInventory = async (
  clientName: string,
  awsRegion: AwsRegion,
  queryData?: QueryData
): Promise<AwdInventoryListing> => {
  const res = await handleSpapiRequest<AwdInventoryListing>(
    clientName,
    awsRegion,
    "AMZ_0075",
    "Failed to get Amazon AWD inventory",
    {
      endpoint: "awdListInventory",
      url: `/awd/2024-05-09/inventory`,
      params: queryData,
    },
    "amazonSpapi.awd.listInventory"
  );
  return res.data;
};
