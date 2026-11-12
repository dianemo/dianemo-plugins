// Locations v3.5.7, server /locations/v3.

export type UspsLocationMailClass =
  | "PARCEL_SELECT"
  | "PARCEL_SELECT_LIGHTWEIGHT"
  | "USPS_CONNECT_LOCAL"
  | "USPS_CONNECT_MAIL"
  | "USPS_CONNECT_REGIONAL"
  | "LIBRARY_MAIL"
  | "MEDIA_MAIL"
  | "BOUND_PRINTED_MATTER";

export type UspsLocationProcessingCategory =
  "FLATS" | "MACHINABLE" | "IRREGULAR" | "NON_MACHINABLE" | "NONSTANDARD";

export type UspsLocationDestinationEntryFacilityType =
  | "DESTINATION_NETWORK_DISTRIBUTION_CENTER"
  | "DESTINATION_SECTIONAL_CENTER_FACILITY"
  | "DESTINATION_SERVICE_HUB"
  | "DESTINATION_DELIVERY_UNIT"
  | "DESTINATION_REGIONAL_PROCESSING_DISTRIBUTION_CENTER";

export type UspsLocationPalletized = "PALLETIZED" | "NON_PALLETIZED" | "BOTH";

export type UspsLocationPostOfficeType =
  | "CONTRACT_POSTAL_UNIT"
  | "POST_OFFICE"
  | "SELF_SERVICE_KIOSK"
  | "VILLAGE_POST_OFFICE";

export type UspsLocationMailingService =
  | "CARRIER_SERVICES"
  | "GENERAL_DELIVERY"
  | "GLOBAL_EXPRESS_GUARANTEED"
  | "LABEL_BROKER"
  | "LABEL_BROKER_SELF-SERVICE_KIOSK"
  | "PRIORITY_MAIL_INTERNATIONAL"
  | "PO_BOX"
  | "SELF-SERVICE_KIOSK"
  | "USPS_CONNECT_LOCAL";

export type UspsLocationBusinessService =
  | "BULK_MAIL_ACCEPTANCE"
  | "BUSINESS_REPLY_MAIL_ACCOUNT_BALANCE"
  | "BULK_MAIL_ACCOUNT_BALANCE"
  | "BULK_MAIL_NEW_PERMIT"
  | "BUSINESS_REPLY_MAIL_NEW_PERMIT"
  | "CALL_REFERRAL";

export type UspsLocationPassportService =
  "PASSPORT_APPOINTMENT" | "PASSPORT_PHOTO" | "PASSPORT_WALK-IN";

export type UspsLocationPickupService =
  | "PICKUP_ACCOUNTABLE_MAIL"
  | "PICKUP_HOLD_MAIL"
  | "PICKUP_NOTICE_LEFT_MAIL"
  | "PICKUP_PARCEL_LOCKER"
  | "HOLD_FOR_PICKUP";

export type UspsLocationFinancialService =
  | "BURIAL_FLAG"
  | "DUCK_STAMP"
  | "GIFT_CARDS"
  | "GREETING_CARDS"
  | "MONEY_ORDER_DOMESTIC"
  | "MONEY_ORDER_INQUIRY";

export type UspsLocationHours =
  "WEEKDAY_AFTER_5" | "SATURDAY_HOURS" | "SUNDAY_HOURS" | "24-HOUR_FACILITIES";

export interface UspsLocationDropoffParams {
  destinationZIPCode: string;
  destinationZIPPlus4?: string;
  mailClass?: UspsLocationMailClass;
  processingCategory?: UspsLocationProcessingCategory;
  destinationEntryFacilityType?: UspsLocationDestinationEntryFacilityType;
  palletized?: UspsLocationPalletized;
  /** YYYY-MM-DD */
  mailingDate?: string;
}

/**
 * Each array-valued filter is sent comma-separated (`style: form, explode:
 * false` in the spec), not as repeated or bracketed keys.
 */
export interface UspsLocationPostOfficeParams {
  streetAddress?: string;
  secondaryAddress?: string;
  city?: string;
  state?: string;
  urbanization?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  /** Latitude; sent as `LAT`. */
  LAT?: number;
  /** Longitude; sent as `LONG`. */
  LONG?: number;
  postOfficeType?: UspsLocationPostOfficeType[];
  mailingService?: UspsLocationMailingService[];
  businessService?: UspsLocationBusinessService[];
  passportService?: UspsLocationPassportService[];
  pickupService?: UspsLocationPickupService[];
  financialService?: UspsLocationFinancialService[];
  hours?: UspsLocationHours;
  /** Miles, 1 to 100; USPS defaults to 20. */
  radius?: number;
  /** Package dimensions in inches, each at least 0. */
  length?: number;
  width?: number;
  height?: number;
  /** From 0. */
  offset?: number;
  /** 1 to 100; USPS defaults to 20. */
  limit?: number;
}

export interface UspsLocationParcelLockerParams {
  city?: string;
  state?: string;
  ZIPCode?: string;
  /** 0 to 2000; USPS defaults to 0. */
  offset?: number;
  /** 1 to 100; USPS defaults to 30. */
  limit?: number;
}

export interface UspsLocationFileParams {
  fileID: string;
}

export interface UspsLocationAddress {
  streetAddress?: string;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  cityAbbreviation?: string;
  city?: string;
  state?: string;
  ZIPCode?: string;
  ZIPPlus4?: string;
  urbanization?: string;
}

export type UspsLocationDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface UspsLocationTimeRange {
  openTime?: string;
  closeTime?: string;
}

export interface UspsLocationHoursOfOperation {
  dayOfWeek?: UspsLocationDayOfWeek;
  times?: UspsLocationTimeRange[];
}

export interface UspsLocationSpecialHours {
  date?: string;
  open?: boolean;
  times?: UspsLocationTimeRange[];
}

export interface UspsLocationCutOffTime {
  dayOfWeek?: UspsLocationDayOfWeek | "HOLIDAY";
  cutOffTime?: string;
}

export interface UspsLocationAcceptedPackageTypes {
  mailClass?: UspsLocationMailClass;
  processingCategory?: UspsLocationProcessingCategory;
  palletized?: UspsLocationPalletized;
}

export interface UspsLocationFacilityDetails {
  dock?: { width?: number; depth?: number; height?: number };
  canopyClearance?: number;
  liftTypes?: {
    manualLift?: boolean;
    electricGasLift?: boolean;
    cageStackerLift?: boolean;
    rollerTableExtenderLift?: boolean;
  };
  ramps?: { numberOfRamps?: number; widestRamp?: number };
  truckManeuveringArea?: {
    length?: number;
    width?: number;
    surfaceType?: "ASPHALT" | "DIRT" | "CONCRETE" | "GRAVEL" | "OTHER";
  };
  levelers?: {
    manualLevelers?: number;
    hydraulicLevelers?: number;
    scissorLevelers?: number;
  };
  doorDetails?: {
    height?: number;
    width?: number;
    numberOfSteps?: number;
  };
  overpassDetails?: { numberOfOverpasses?: number; lowestOverpass?: number };
}

export interface UspsLocationUSPSConnect {
  sameDayDelivery?: boolean;
  sameDayPickUp?: string;
  nextDayPickUp?: string;
  SundayDelivery?: boolean;
  sameDayDropOffCutOffTimes?: UspsLocationCutOffTime[];
  sameDayCarrierPickupCutOffTimes?: UspsLocationCutOffTime[];
  nextDayDropOffCutOffTimes?: UspsLocationCutOffTime[];
}

export interface UspsLocationDropShipmentLocation {
  dropShipmentKey?: string;
  facilityName?: string;
  facilityAddress?: { address?: UspsLocationAddress };
  dropSitePhoneNumber?: string;
  destinationZIPCode?: string;
  destinationEntryFacilityType?: UspsLocationDestinationEntryFacilityType;
  acceptedPackageTypes?: UspsLocationAcceptedPackageTypes[];
  dropShipAcceptanceTimes?: UspsLocationHoursOfOperation[];
  dropShipmentFacilityDetails?: UspsLocationFacilityDetails;
  USPSConnectDetails?: UspsLocationUSPSConnect;
  timeZone?: string;
  DSTObserved?: boolean;
}

export type UspsLocationDropoffLocations = UspsLocationDropShipmentLocation[];

export interface UspsLocationPostOfficeLocation {
  facilityName?: string;
  facilityAddress?: UspsLocationAddress;
  facilityID?: string;
  geoCoordinates?: { latitude?: number; longitude?: number };
  postOfficeType?: UspsLocationPostOfficeType;
  /** Distance from the search point. */
  distance?: number;
  phoneNumbers?: { phone?: string; fax?: string };
  services?: {
    service?: string;
    hours?: UspsLocationHoursOfOperation[];
    additionalInformation?: { mailClasses?: string[] };
  }[];
  temporaryClosure?: boolean;
  temporaryClosureDate?: string;
  specialHours?: UspsLocationSpecialHours[];
  parking?: "LOT" | "STREET";
  passports?: {
    phone?: string;
    photoCost?: number;
    appointmentRequired?: boolean;
  };
  timeZone?: string;
  DSTObserved?: boolean;
}

export interface UspsLocationLink {
  rel: string[];
  title?: string;
  href: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  submissionMediaType?: string;
  targetMediaType?: string;
  description?: string;
  publishDate?: string;
}

export interface UspsLocationPaginationMetadata {
  totalCount?: number;
  page?: number;
  totalPages?: number;
  limit: number;
  offset: number;
  links?: UspsLocationLink[];
}

export interface UspsLocationPostOfficeResponse {
  /** Closest first. */
  locations?: UspsLocationPostOfficeLocation[];
  warnings?: { warningCode?: string; warningDescription?: string }[];
  metadata?: UspsLocationPaginationMetadata;
}

export interface UspsLocationParcelLocker {
  facilityID?: string;
  locationName?: string;
  locationAddress?: UspsLocationAddress;
  latitude?: number;
  longitude?: number;
  deliveryAddress?: UspsLocationAddress;
  deliveryPoint?: string;
  lockerStatus?: string;
  lockerOnline?: boolean;
  lockerSizeMaximumLength?: number;
  lockerSizeMaximumWidth?: number;
  lockerSizeMaximumHeight?: number;
  serviceDirectShip?: boolean;
  serviceRedelivery?: boolean;
  servicePOBoxOverflow?: boolean;
  servicePrepaid?: boolean;
  servicePrepaidReturns?: boolean;
  serviceLabelPrinting?: boolean;
}

export type UspsLocationParcelLockerLocations = UspsLocationParcelLocker[];

export type UspsLocationFiles = UspsLocationLink[];

export interface UspsLocationSignedURLResponse {
  signedURL?: string;
  expiry?: string;
  contentLength?: number;
  rangeLimit?: number;
}
