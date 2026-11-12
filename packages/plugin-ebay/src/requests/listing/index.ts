import { EbayMigrateBulkListingsResponses } from "./types.js";
import { tryHandleRequest } from "@dianemo/plugin-kit";
import { EbayRequestOptions } from "../types.js";
import { RequestError } from "@dianemo/core";

/** eBay rejects a bulk migrate carrying more than five listings. */
const MAX_LISTINGS = 5;

export const bulkMigrate = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  listingIds: string[]
): Promise<EbayMigrateBulkListingsResponses> => {
  if (listingIds.length > MAX_LISTINGS) {
    throw new RequestError(
      "EBY_0013",
      "Too many eBay listings for one bulk migrate",
      {
        metadata: {
          context: `eBay accepts at most ${MAX_LISTINGS} listings per request, got ${listingIds.length}`,
        },
      }
    );
  }
  const res = await tryHandleRequest<EbayMigrateBulkListingsResponses>(
    {
      clientName,
      requestName: "ebay.listing.bulkMigrate",
      grantId,
      method: "POST",
      url: `/sell/inventory/v1/bulk_migrate_listing`,
      data: { requests: listingIds.map((listingId) => ({ listingId })) },
    },
    "EBY_0014",
    "Failed to migrate eBay listings"
  );
  return res.data;
};
