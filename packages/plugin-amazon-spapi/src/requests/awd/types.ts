export interface AwdInventoryListing {
  inventory: AwdInventorySummary[];
  nextToken?: string;
}

export interface AwdInventorySummary {
  sku: string;
  totalOnhandQuantity?: number;
  totalInboundQuantity?: number;
  inventoryDetails?: AwdInventoryDetails;
  expirationDetails?: AwdExpirationDetails[];
}

export interface AwdInventoryDetails {
  availableDistributableQuantity?: number;
  reservedDistributableQuantity?: number;
  replenishmentQuantity?: number;
}

export interface AwdExpirationDetails {
  expiration?: string;
  onhandQuantity?: number;
}
