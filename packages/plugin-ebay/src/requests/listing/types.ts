export interface EbayMigrateBulkListingsResponses {
  responses: EbayMigrateBulkListingsResponse[];
}
export interface EbayMigrateBulkListingsResponse {
  statusCode: number;
  listingId: string;
  marketplaceId: string;
  inventoryItems: {
    sku: string;
    offerId: string;
  }[];
}
