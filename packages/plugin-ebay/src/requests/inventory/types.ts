import {
  EbayErrorDetailV3,
  EbayPaginationResponse,
  EbayTimeUnit,
  EbayDimensionUnit,
  EbayPackageType,
  EbayItemWeightUnit,
  EbayItemAvailability,
  EbayItemCondition,
  EbayLocale,
} from "../types.js";

export interface EbayGetInventoryItemResponse {
  availability: {
    pickupAtLocationAvailability?: {
      availabilityType: string;
      fulfillmentTime: {
        unit: string;
        value: number;
      };
      merchantLocationKey: string;
      quantity: number;
    }[];
    shipToLocationAvailability?: {
      allocationByFormat?: {
        auction: number;
        fixedPrice: number;
      };
      availabilityDistributions?: {
        fulfillmentTime: {
          unit: string;
          value: number;
        };
        merchantLocationKey: string;
        quantity: number;
      }[];
      quantity: number;
    };
  };
  condition: string;
  conditionDescription?: string;
  conditionDescriptors?: {
    additionalInfo?: string;
    name: string;
    values: string[];
  }[];
  groupIds?: string[];
  inventoryItemGroupKeys?: string[];
  locale: string;
  packageWeightAndSize?: {
    dimensions?: {
      height: number;
      length: number;
      unit: string;
      width: number;
    };
    packageType: EbayPackageType;
    shippingIrregular?: boolean;
    weight?: {
      unit: string;
      value: number;
    };
  };
  product?: {
    aspects?: Record<string, string[]>;
    brand?: string;
    description?: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
  sku: string;
}

export interface EbayGetInventoryItemsResponse extends EbayPaginationResponse {
  size: number;
  inventoryItems: EbayGetInventoryItemResponse[];
}

export interface EbayInventoryItemBulkResponse {
  /* InventoryItemWithSkuLocaleGroupKeys */
  availability: {
    /* AvailabilityWithAll */
    pickupAtLocationAvailability: {
      /* PickupAtLocationAvailability */
      availabilityType: EbayItemAvailability;
      fulfillmentTime: {
        /* TimeDuration */
        unit: EbayTimeUnit;
        value: number;
      };
      merchantLocationKey: string;
      quantity: number;
    }[];
    shipToLocationAvailability: {
      /* ShipToLocationAvailabilityWithAll */
      allocationByFormat: {
        /* FormatAllocation */ auction: number;
        fixedPrice: number;
      };
      availabilityDistributions: {
        /* AvailabilityDistribution */
        fulfillmentTime: {
          /* TimeDuration */
          unit: EbayTimeUnit;
          value: number;
        };
        merchantLocationKey: string;
        quantity: number;
      }[];
      quantity: number;
    };
  };
  condition: EbayItemCondition;
  conditionDescription?: string;
  conditionDescriptors?: {
    /* ConditionDescriptor */ additionalInfo?: string;
    name: string;
    values: string[];
  }[];
  inventoryItemGroupKeys: string[];
  locale: EbayLocale;
  packageWeightAndSize?: {
    /* PackageWeightAndSize */
    dimensions?: {
      /* Dimension */ height: number;
      length: number;
      unit: EbayDimensionUnit;
      width: number;
    };
    packageType: EbayPackageType;
    shippingIrregular: boolean;
    weight?: {
      /* Weight */
      unit: EbayItemWeightUnit;
      value: number;
    };
  };
  product?: {
    /* Product */ aspects?: Record<string, string[]>;
    brand?: string;
    description?: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
}

export interface EbayGetBulkInventoryItemsResponse {
  errors?: EbayErrorDetailV3[];
  inventoryItem?: EbayInventoryItemBulkResponse[];
  sku: string;
  statusCode: number;
  warnings?: EbayErrorDetailV3[];
}

export interface EbayGetBulkInventoryItemsResponses {
  responses: EbayGetBulkInventoryItemsResponse[];
}

export interface EbayBulkUpdateAvailablityDistribution {
  fulfillmentTime?: {
    unit: EbayTimeUnit;
    value: number;
  };
  merchantLocationKey: string;
  quantity: number;
}

export interface EbayBulkUpdateShipToLocationAvailability {
  availabilityDistributions?: EbayBulkUpdateAvailablityDistribution[];
  quantity: number;
}

export interface EbayBulkUpdateRequest {
  sku: string;
  shipToLocationAvailability?: EbayBulkUpdateShipToLocationAvailability;
}

export interface EbayBulkUpdateRequest {
  sku: string;
  shipToLocationAvailability?: EbayBulkUpdateShipToLocationAvailability;
  offers?: {
    availableQuantity: number;
    offerId: string;
    price: {
      currency: string;
      value: string;
    };
  }[];
}

export interface EbayBulkUpdateResponseItem {
  sku: string;
  statusCode: number;
  errors?: EbayErrorDetailV3[];
  warnings?: EbayErrorDetailV3[];
}

export interface EbayBulkUpdateResponse {
  responses: EbayBulkUpdateResponseItem[];
}

// ============ Inventory Item Management ============
export interface EbayCreateInventoryItemRequest {
  availability?: {
    pickupAtLocationAvailability?: {
      availabilityType: EbayItemAvailability;
      fulfillmentTime: {
        unit: EbayTimeUnit;
        value: number;
      };
      merchantLocationKey: string;
      quantity: number;
    }[];
    shipToLocationAvailability?: {
      quantity: number;
    };
  };
  condition: EbayItemCondition;
  conditionDescription?: string;
  conditionDescriptors?: {
    additionalInfo?: string;
    name: string;
    values: string[];
  }[];
  packageWeightAndSize?: {
    dimensions?: {
      height: number;
      length: number;
      unit: EbayDimensionUnit;
      width: number;
    };
    packageType?: EbayPackageType;
    weight?: {
      unit: EbayItemWeightUnit;
      value: number;
    };
  };
  product?: {
    aspects?: Record<string, string[]>;
    brand?: string;
    description?: string;
    ean?: string[];
    epid?: string;
    imageUrls?: string[];
    isbn?: string[];
    mpn?: string;
    subtitle?: string;
    title?: string;
    upc?: string[];
    videoIds?: string[];
  };
}

// ============ Offers Management ============
export type EbayOfferStatus =
  "PUBLISHED" | "UNPUBLISHED" | "OUT_OF_STOCK" | "ENDED";

export interface EbayTax {
  applyTax: boolean;
  thirdPartyTaxCategory?: string;
  vatPercentage?: number;
}

export interface EbayPricingSummary {
  auctionReservePrice?: {
    currency: string;
    value: string;
  };
  auctionStartPrice?: {
    currency: string;
    value: string;
  };
  minimumAdvertisedPrice?: {
    currency: string;
    value: string;
  };
  originallySoldForRetailPriceOn?: "ON_EBAY" | "OFF_EBAY" | "ON_AND_OFF_EBAY";
  originalRetailPrice?: {
    currency: string;
    value: string;
  };
  price: {
    currency: string;
    value: string;
  };
  pricingVisibility?: "PRE_CHECKOUT" | "DURING_CHECKOUT" | "NONE";
}

export interface EbayListingPolicies {
  bestOfferTerms?: {
    autoAcceptPrice?: {
      currency: string;
      value: string;
    };
    autoDeclinePrice?: {
      currency: string;
      value: string;
    };
    bestOfferEnabled?: boolean;
  };
  eBayPlusIfEligible?: boolean;
  fulfillmentPolicyId: string;
  paymentPolicyId: string;
  returnPolicyId: string;
  shippingCostOverrides?: {
    additionalShippingCost?: {
      currency: string;
      value: string;
    };
    priority?: number;
    shippingCost?: {
      currency: string;
      value: string;
    };
    shippingServiceType?: "DOMESTIC" | "INTERNATIONAL";
    surcharge?: {
      currency: string;
      value: string;
    };
  }[];
}

export interface EbayOffer {
  availableQuantity?: number;
  categoryId?: string;
  charity?: {
    charityId: string;
    donationPercentage: string;
  };
  format: "AUCTION" | "FIXED_PRICE";
  hideBuyerDetails?: boolean;
  includeCatalogProductDetails?: boolean;
  listing?: {
    listingId: string;
    listingStatus: EbayOfferStatus;
    soldQuantity: number;
  };
  listingDescription?: string;
  listingDuration?:
    | "DAYS_1"
    | "DAYS_3"
    | "DAYS_5"
    | "DAYS_7"
    | "DAYS_10"
    | "DAYS_21"
    | "DAYS_30"
    | "GTC";
  listingPolicies: EbayListingPolicies;
  listingStartDate?: string;
  lotSize?: number;
  marketplaceId: string;
  merchantLocationKey?: string;
  offerId?: string;
  pricingSummary: EbayPricingSummary;
  quantityLimitPerBuyer?: number;
  secondaryCategoryId?: string;
  sku: string;
  status?: EbayOfferStatus;
  storeCategoryNames?: string[];
  tax?: EbayTax;
}

export interface EbayGetOffersRequest {
  format?: "AUCTION" | "FIXED_PRICE";
  limit?: number;
  marketplaceId?: string;
  offset?: number;
  sku: string;
}

export interface EbayGetOffersResponse {
  href: string;
  limit: number;
  offers: EbayOffer[];
  offset: number;
  size: number;
  total: number;
  next?: string;
  prev?: string;
}

export interface EbayCreateOfferResponse {
  offerId: string;
  warnings?: EbayErrorDetailV3[];
}

export interface EbayPublishOfferResponse {
  listingId: string;
  warnings?: EbayErrorDetailV3[];
}

// ============ Inventory Locations ============
export type EbayLocationType =
  "WAREHOUSE" | "STORE" | "STORAGE_FACILITY" | "FULFILLMENT_CENTER";

export interface EbayInventoryLocation {
  location: {
    address: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      country: string;
      county?: string;
      postalCode: string;
      stateOrProvince: string;
    };
    geoCoordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  locationAdditionalInformation?: string;
  locationInstructions?: string;
  locationTypes?: EbayLocationType[];
  locationWebUrl?: string;
  merchantLocationKey?: string;
  merchantLocationStatus?: "ENABLED" | "DISABLED";
  name: string;
  operatingHours?: {
    dayOfWeekEnum:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    intervals: {
      close: string;
      open: string;
    }[];
  }[];
  phone?: string;
  specialHours?: {
    date: string;
    intervals: {
      close: string;
      open: string;
    }[];
  }[];
}

export interface EbayGetInventoryLocationsResponse {
  href: string;
  limit: number;
  locations: EbayInventoryLocation[];
  offset: number;
  total: number;
  next?: string;
  prev?: string;
}
