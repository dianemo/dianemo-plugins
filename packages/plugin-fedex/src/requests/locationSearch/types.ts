export interface FedExLocationFindLocationsRequest {
  locationsSummaryRequestControlParameters?: FedExLocationLocationsSummaryRequestControlParameters;
  constraints?: FedExLocationSearchLocationConstraints;
  /** Specify the criteria to be used to search for FedEx locations. Default value is ADDRESS if no value is passed.Valid values: ADDRESS - Search by address. Location detail data is required.GEOGRAPHIC_COORDINATES - Search... */
  locationSearchCriterion?:
    "ADDRESS" | "GEOGRAPHIC_COORDINATES" | "PHONE_NUMBER";
  location: FedExLocationLocation;
  phoneNumber?: string;
  multipleMatchesAction?: "RETURN_ALL" | "RETURN_ERROR" | "RETURN_FIRST";
  sort?: FedExLocationSort;
  trackingInfo?: FedExLocationTrackingInfo;
  sameState?: boolean;
  sameCountry?: boolean;
  redirectToHoldType?:
    "FEDEX_EXPRESS" | "FEDEX_GROUND" | "FEDEX_GROUND_HOME_DELIVERY";
  locationAttrTypes?: (
    | "ACCEPTS_CASH"
    | "FEDEX_RETURNS_TECHNOLOGY"
    | "ALREADY_OPEN"
    | "COPY_AND_PRINT_SERVICES"
    | "DANGEROUS_GOODS_SERVICES"
    | "DIRECT_MAIL_SERVICES"
    | "LOCATION_IS_IN_AIRPORT"
    | "NOTARY_SERVICES"
    | "OPEN_TWENTY_FOUR_HOURS"
    | "PACK_AND_SHIP"
    | "PACKAGING_SUPPLIES"
    | "PASSPORT_PHOTO_SERVICES"
    | "RETURNS_SERVICES"
    | "SIGNS_AND_BANNERS_SERVICE"
    | "SONY_PICTURE_STATION"
    | "DROP_BOX"
    | "DOMESTIC_SHIPPING_SERVICES"
    | "INTERNATIONAL_SHIPPING_SERVICES"
    | "CLEARANCE_SERVICES"
  )[];
  locationCapabilities?: FedExLocationLocationCapabilities[];
  packageAttributes?: FedExLocationPackageAttribute[];
  locationTypes?: (
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_ONSITE"
    | "FEDEX_EXPRESS_STATION"
    | "FEDEX_SHIPSITE"
    | "FEDEX_SHIP_AND_GET"
  )[];
  includeHoliday?: boolean;
  /** Specifies the latest time by which you can drop-off a package at a location to process the shipment the same day. This limits the results to locations that support a specific drop-off time. The format is an ISO 8601 s... */
  dropoffTime?: string;
  dropOffServiceType?: string;
  carrierCodes?: ("FDXE" | "FDXG")[];
  getCall?: boolean;
  packagingType?: string;
  totalDeclaredValue?: FedExLocationAmounts;
  totalCustomsValue?: FedExLocationAmounts;
  paymentType?: "SENDER" | "THIRD_PARTY" | "RECIPIENT" | "COLLECT";
}

export interface FedExLocationFindLocationsResponse {
  transactionId?: string;
  customerTransactionId?: string;
  output?: FedExLocationLocationSummaryOutputVO;
}

export interface FedExLocationLocationsSummaryRequestControlParameters {
  /** Specify the unit of measurement and the radius around the address to search FedEx locations. */
  distance?: FedExLocationDistance;
  maxResults?: number;
}

export interface FedExLocationSearchLocationConstraints {
  /** Specify the information to be included in the location results. */
  locationContentOptions?: (
    "HOLIDAYS" | "LOCATION_DROPOFF_TIMES" | "TIMEZONE_OFFSET"
  )[];
  dropOffTimeNeeded?: string;
  excludeUnavailableLocations?: string;
}

export interface FedExLocationLocation {
  address: FedExLocationAddress;
  longLat?: FedExLocationGeoCode;
}

export interface FedExLocationSort {
  criteria?:
    | "DISTANCE"
    | "LATEST_EXPRESS_DROPOFF_TIME"
    | "LATEST_GROUND_DROPOFF_TIME"
    | "LOCATION_TYPE";
  /** Specify the sort order of the location search results, either ascending or descending. Defaults to ascending order. */
  order?: "ASCENDING" | "DESCENDING";
}

/** Information uniquely identifying a shipment such as Tracking number, ShipDate, and Tracking number uniqueId. This tracking information helps to return the correct list of locations when REDIRECT_TO_HOLD_AT_LOCATION is... */
export interface FedExLocationTrackingInfo {
  uniqueTrackingId?: string;
  trackingNumber?: string;
  shipDate?: string;
}

export interface FedExLocationLocationCapabilities {
  serviceType?: string;
  carrierCode?: "FDXE" | "FDXG";
  transferOfPossessionType?:
    "DROPOFF" | "HOLD_AT_LOCATION" | "REDIRECT_TO_HOLD_AT_LOCATION";
  serviceCategory?:
    "EXPRESS_FREIGHT" | "EXPRESS_PARCEL" | "GROUND_HOME_DELIVERY";
  daysOfWeek?: string[];
}

export interface FedExLocationPackageAttribute {
  weight?: FedExLocationWeight;
  dimensions?: FedExLocationDimensions;
  serviceOptions?: string[];
}

export interface FedExLocationAmounts {
  amount?: number;
  currency?: string;
}

export interface FedExLocationLocationSummaryOutputVO {
  totalResults?: number;
  resultsReturned?: number;
  matchedAddress?: FedExLocationAddress;
  /** Identifies the geographic coordinates corresponding to the address specified. It is specified in ISO 6709 format. */
  matchedAddressGeoCoord?: FedExLocationGeoPositionalCoordinates;
  locationDetailList?: FedExLocationLocationDetail[];
  alerts?: FedExLocationAlert[];
  nearestLocation?: FedExLocationLocationDetail;
  latestLocation?: FedExLocationLocationDetail;
  ambiguousAddress?: FedExLocationLocationDetail[];
  ambiguousLocationsReturned?: boolean;
  nearestLocationReturned?: boolean;
  latestLocationReturned?: boolean;
  lockerAvailabilityCode?: number;
  lockerAvailabilityMessage?: string;
  location?: FedExLocationLocation;
  phoneNumber?: string;
  multipleMatchesAction?: "RETURN_ALL" | "RETURN_ERROR" | "RETURN_FIRST";
  sort?: FedExLocationSort;
  trackingInfo?: FedExLocationTrackingInfo;
  sameState?: boolean;
  sameCountry?: boolean;
  redirectToHoldType?:
    "FEDEX_EXPRESS" | "FEDEX_GROUND" | "FEDEX_GROUND_HOME_DELIVERY";
  locationAttrTypes?: (
    | "ACCEPTS_CASH"
    | "ALREADY_OPEN"
    | "COPY_AND_PRINT_SERVICES"
    | "DANGEROUS_GOODS_SERVICES"
    | "DIRECT_MAIL_SERVICES"
    | "LOCATION_IS_IN_AIRPORT"
    | "NOTARY_SERVICES"
    | "OBSERVES_DAY_LIGHT_SAVING_TIMES"
    | "OPEN_TWENTY_FOUR_HOURS"
    | "PACK_AND_SHIP"
    | "PACKAGING_SUPPLIES"
    | "PASSPORT_PHOTO_SERVICES"
    | "RETURNS_SERVICES"
    | "SIGNS_AND_BANNERS_SERVICE"
    | "SONY_PICTURE_STATION"
    | "DROP_BOX"
    | "DOMESTIC_SHIPPING_SERVICES"
    | "INTERNATIONAL_SHIPPING_SERVICES"
    | "CLEARANCE_SERVICES"
  )[];
  locationCapabilities?: FedExLocationLocationCapabilities[];
  packageMaximumLimits?: FedExLocationPackageAttribute[];
  locationTypes?: (
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_ONSITE"
    | "FEDEX_EXPRESS_STATION"
    | "FEDEX_SHIPSITE"
    | "FEDEX_FREIGHT_SERVICE_CENTER"
    | "FEDEX_HOME_DELIVERY_STATION"
    | "FEDEX_SMART_POST_HUB"
  )[];
  includeHoliday?: boolean;
  /** Specifies the latest time by which you can drop-off a package at a location to process the shipment the same day. This limits the results to locations that support a specific drop-off time. The format is an ISO 8601 s... */
  dropoffTime?: string;
  dropOffServiceType?: string;
  searchBy?: string;
  contentOptions?: string;
  carrierCodes?: ("FDXE" | "FDXG")[];
  getCall?: boolean;
}

/** Specifies value and unit of distance between the FedEx locations and the address specified. */
export interface FedExLocationDistance {
  /** Indicates the unit of measure for the distance. */
  units?: "KM" | "MI";
  value?: number;
}

export interface FedExLocationAddress {
  streetLines?: string[];
  city?: string;
  stateOrProvinceCode?: string;
  postalCode?: string;
  countryCode: string;
  residential?: boolean;
  addressVerificationId?: string;
  addressClassification?: "MIXED" | "UNKNOWN" | "BUSINESS" | "RESIDENTIAL";
  addressClassificationConfidence?: "POTENTIAL" | "PERMANENT";
}

export interface FedExLocationGeoCode {
  latitude?: string;
  longitude?: string;
}

export interface FedExLocationWeight {
  /** Specify the weighing unit of the package. */
  units?: "KG" | "LB";
  value?: number;
}

export interface FedExLocationDimensions {
  length?: number;
  width?: number;
  height?: number;
  units?: "CM" | "IN";
}

export interface FedExLocationGeoPositionalCoordinates {
  latitude?: number;
  longitude?: number;
}

export interface FedExLocationLocationDetail {
  /** Specifies value and unit of distance between the FedEx locations and the address specified. */
  distance?: FedExLocationDistance;
  contactAndAddress?: FedExLocationContactAndAddress;
  locationId?: string;
  storeHours?: FedExLocationLocationHours[];
  carrierDetailList?: FedExLocationFASTCarrierDetails[];
  geoPositionalCoordinates?: FedExLocationGeoPositionalCoordinates;
  locationType?:
    | "FEDEX_AUTHORIZED_SHIP_CENTER"
    | "FEDEX_OFFICE"
    | "FEDEX_SELF_SERVICE_LOCATION"
    | "FEDEX_EXPRESS_STATION"
    | "FEDEX_STAFFED"
    | "FEDEX_GROUND_TERMINAL"
    | "FEDEX_HOME_DELIVERY_STATION"
    | "FEDEX_ONSITE"
    | "FEDEX_SHIPSITE"
    | "FEDEX_FACILITY"
    | "FEDEX_FREIGHT_SERVICE_CENTER"
    | "FEDEX_SMART_POST_HUB";
  locationAttributeTypes?: (
    | "ACCEPTS_CASH"
    | "ALREADY_OPEN"
    | "COPY_AND_PRINT_SERVICES"
    | "DANGEROUS_GOODS_SERVICES"
    | "DIRECT_MAIL_SERVICES"
    | "EXPRESS_FREIGHT_DROPOFFS"
    | "EXPRESS_PARCEL_DROPOFFS"
    | "FEDEX_FREIGHT_DROPOFFS"
    | "GROUND_DROPOFFS"
    | "GROUND_HOME_DELIVERY_DROPOFFS"
    | "LOCATION_IS_IN_AIRPORT"
    | "NOTARY_SERVICES"
    | "OBSERVES_DAY_LIGHT_SAVING_TIMES"
    | "OPEN_TWENTY_FOUR_HOURS"
    | "PACK_AND_SHIP"
    | "PACKAGING_SUPPLIES"
    | "PASSPORT_PHOTO_SERVICES"
    | "RETURNS_SERVICES"
    | "SATURDAY_DROPOFFS"
    | "SIGNS_AND_BANNERS_SERVICE"
    | "WEEKDAY_EXPRESS_HOLD_AT_LOCATION"
    | "WEEKDAY_GROUND_HOLD_AT_LOCATION"
    | "SONY_PICTURE_STATION"
    | "EXPANDED_OFFICE_SUPPLIES_AND_TECHNOLOGY_PRODUCTS"
    | "VIDEO_CONFERENCING"
    | "SATURDAY_EXPRESS_HOLD_AT_LOCATION"
    | "KIOSK_LOCATION"
    | "STAFFED_LOCATION"
    | "SAME_DAY_DROPOFFS"
    | "SAME_DAY_CITY_DROPOFFS"
    | "DROP_BOX"
    | "DOMESTIC_SHIPPING_SERVICES"
    | "INTERNATIONAL_SHIPPING_SERVICES"
  )[];
  lockerAvailability?: boolean;
  packageMaximumLimits?: FedExLocationPackageAttribute;
  specialInstructions?: string;
  rthservice?: string;
  locationCapabilities?: FedExLocationLocationCapabilities;
}

export interface FedExLocationAlert {
  code?: string;
  alertType?: "NOTE" | "WARNING";
  message?: string;
}

/** The contact and address information for a location. */
export interface FedExLocationContactAndAddress {
  address?: FedExLocationAddress;
  contact?: FedExLocationContact;
  addressAncillaryDetail?: FedExLocationAddressAncillaryDetail;
}

export interface FedExLocationLocationHours {
  dayofweek?:
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";
  operationalHoursType?: "CLOSED_ALL_DAY" | "OPEN_ALL_DAY" | "OPEN_BY_HOURS";
  operationalHours?: FedExLocationTimeRange[];
  exceptionalHoursType?: "CLOSED_ALL_DAY" | "OPEN_ALL_DAY" | "OPEN_BY_HOURS";
  exceptionalHours?: FedExLocationTimeRange[];
}

export interface FedExLocationFASTCarrierDetails {
  serviceType?: string;
  serviceCategory?:
    | "EXPRESS"
    | "GROUND"
    | "EXPRESS_FREIGHT"
    | "FREIGHT"
    | "SMARTPOST"
    | "EXPRESS_PARCEL"
    | "NULL";
}

export interface FedExLocationContact {
  personName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  phoneExtension?: string;
  faxNumber?: string;
  companyName?: string;
  stateTaxId?: string;
  fedralTaxId?: string;
}

export interface FedExLocationAddressAncillaryDetail {
  /** This is the subdivision or community within a city for the given address. */
  locationInCity: string;
  /** This is the suite information for the given address. */
  suite?: string;
  adderssVerificationOverrideReason?: string;
  displayName: string;
  locationInProperty?: string;
  /** Specify additional information about the given address. */
  addtionalDescriptions?: string;
  department?: string;
  /** This is to specify the room or floor information for the given address. */
  roomFloor?: string;
  /** This is the cross street information for the given address. */
  crossStreet?: string;
  /** This is the building information for the given address. */
  building?: string;
  /** This is the apartment information for the given address. */
  apartment?: string;
  /** This is room specific information for the given address. */
  room?: string;
}

export interface FedExLocationTimeRange {
  begins?: string;
  ends?: string;
}
