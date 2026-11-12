/**
 * Pickup Rate's `pickuptype` path parameter. `oncall` is a scheduled one-off
 * collection, `smart` a UPS Smart Pickup, and `both` asks for the two side by
 * side — see docs/ups-api.md#pickup-path-segments. Pending Status shares the
 * same segment.
 */
export type UpsPickupType = "oncall" | "smart" | "both";

export interface UpsPickupRateRequest {
  PickupRateRequest: UpsPickupRateRequestBody;
}

export interface UpsPickupRateResponse {
  PickupRateResponse: UpsPickupRateResponseBody;
}

export interface UpsPickupCancelResponse {
  PickupCancelResponse: UpsPickupCancelResponseBody;
}

export interface UpsPickupCreationRequest {
  PickupCreationRequest: UpsPickupCreationRequestBody;
}

export interface UpsPickupCreationResponse {
  PickupCreationResponse: UpsPickupCreationResponseBody;
}

export interface UpsPickupTriggerGWNRequest {
  PickupTriggerGWNRequest: UpsPickupTriggerGWNRequestBody;
}

export interface UpsPickupTriggerGWNResponse {
  PickupTriggerGWNResponse: UpsPickupTriggerGWNResponseBody;
}

export interface UpsPickupGetPoliticalDivision1ListResponse {
  PickupGetPoliticalDivision1ListResponse: UpsPickupGetPoliticalDivision1ListResponseBody;
}

export interface UpsPickupGetServiceCenterFacilitiesRequest {
  PickupGetServiceCenterFacilitiesRequest: UpsPickupGetServiceCenterFacilitiesRequestBody;
}

export interface UpsPickupGetServiceCenterFacilitiesResponse {
  PickupGetServiceCenterFacilitiesResponse: UpsPickupGetServiceCenterFacilitiesResponseBody;
}

export interface UpsPickupPendingStatusResponse {
  PickupPendingStatusResponse: UpsPickupPendingStatusResponseBody;
}

export interface UpsPickupRateRequestBody {
  Request: UpsPickupRateRequestRequest;
  ShipperAccount?: UpsPickupRateRequestShipperAccount;
  PickupAddress: UpsPickupRateRequestPickupAddress;
  // Indicates if the pickup address is different than the address specified in the customer's profile. Valid values: Y = Alternate address N = Original pickup address (default)
  AlternateAddressIndicator: string;
  // Indicates the pickup timeframe. - 01 = Same-Day Pickup - 02 = Future-Day Pickup - 03 = A Specific-Day Pickup If 03 is selected, then PickupDate, EarliestReadyTime, and LatestClosetime must be specified.
  ServiceDateOption: string;
  PickupDateInfo?: UpsPickupRateRequestPickupDateInfo;
  RateChartType?: string;
  // Indicates whether to return detailed taxes for on-callpickups. Valid values: - Y = Rate this pickup with taxes - N = Do not rate this pickup with taxes (default)
  TaxInformationIndicator?: string;
  // Indicates whether to return user level promo discount for the on-callpickups. Valid values: Y = Rate this pickup with user level promo discount N = Do not rate this pickup with user level promo discount(default)
  UserLevelDiscountIndicator?: string;
}

export interface UpsPickupRateResponseBody {
  Response: UpsPickupRateResponseResponse;
  RateResult: UpsPickupRateResponseRateResult;
  WeekendServiceTerritoryIndicator?: string;
  WeekendServiceTerritory?: UpsPickupRateResponseWeekendServiceTerritory;
}

export interface UpsPickupCancelResponseBody {
  Response: UpsPickupCancelResponseResponse;
  // The type of pickup that has been cancelled. - 01 = On-Call Pickup
  PickupType: string;
  GWNStatus?: UpsPickupCancelResponseGWNStatus;
}

export interface UpsPickupCreationRequestBody {
  Request: UpsPickupCreationRequestRequest;
  // Indicates whether to rate the on-callpickup or not. Valid values: Y = Rate this pickup N = Do not rate this pickup (default)
  RatePickupIndicator: string;
  RateChartType?: string;
  // Indicates whether to return detailed taxes for the on-callpickups. Valid values: Y = Rate this pickup with taxes N = Do not rate this pickup with taxes (default)
  TaxInformationIndicator?: string;
  // Indicates whether to return user level promo discount for the on-callpickups. Valid values: Y = Rate this pickup with user level promo discount N = Do not rate this pickup with user level promo discount(default)
  UserLevelDiscountIndicator?: string;
  Shipper?: UpsPickupCreationRequestShipper;
  PickupDateInfo: UpsPickupCreationRequestPickupDateInfo;
  PickupAddress: UpsPickupCreationRequestPickupAddress;
  // Indicates if pickup address is a different address than that specified in a customer's profile. Valid values: Y = Alternate address N = Original pickup address (default)
  AlternateAddressIndicator: string;
  PickupPiece: UpsPickupCreationRequestPickupPiece[];
  TotalWeight?: UpsPickupCreationRequestTotalWeight;
  // Indicates if at least any package is over 70 lbs or 32 kgs. Valid values: Y = Over weight N = Not over weight (default) Not required for WWEF service.
  OverweightIndicator?: string;
  TrackingData?: UpsPickupCreationRequestTrackingData[];
  TrackingDataWithReferenceNumber?: UpsPickupCreationRequestTrackingDataWithReferenceNumber;
  // The payment method to pay for this on call pickup. 00 = No payment needed 01 = Pay by shipper account 03 = Pay by charge card 04 = Pay by 1Z tracking number 05 = Pay by check or money order 06 = Cash(applicable only for these coun
  PaymentMethod: string;
  SpecialInstruction?: string;
  // Information entered by a customer for Privileged reference
  ReferenceNumber?: string;
  FreightOptions?: UpsPickupCreationRequestFreightOptions;
  // Service Category. Applicable to the following countries: BE, FR, DE, IT, MX, NL, PL, ES, GB Valid values: 01 - domestic (default) 02 - international 03 - transborder
  ServiceCategory?: string;
  // Describes the type of cash funds that the driver will collect. Applicable to the following countries: BE,FR,DE,IT,MX,NL,PL,ES,GB Valid values: 01 - Pickup only (default) 02 - Transportation only 03 - Pickup and Transportation
  CashType?: string;
  ShippingLabelsAvailable?: string;
  PremierIndicator?: string;
  Notification?: UpsPickupCreationRequestNotification;
}

export interface UpsPickupCreationResponseBody {
  Response: UpsPickupCreationResponseResponse;
  PRN?: string;
  WeekendServiceTerritory?: UpsPickupCreationResponseWeekendServiceTerritory;
  WeekendServiceTerritoryIndicator?: string;
  RateStatus: UpsPickupCreationResponseRateStatus;
  RateResult?: UpsPickupCreationResponseRateResult;
}

export interface UpsPickupTriggerGWNRequestBody {
  Request: UpsPickupCreationRequestRequest;
  AccountNumber: string;
  // Specifies when the pickup should be scheduled. - 01 -- Same Day - Request pickup for today - 02 -- Future Day - Request pickup for next available business day If same-day is requested but cutoff time has passed,the pickup will be
  ServiceDateOption: string;
}

export interface UpsPickupTriggerGWNResponseBody {
  Response?: UpsPickupCreationResponseResponse;
  ServiceDate?: string;
  NextBusinessDayIndicator?: string;
  PRN?: string;
  TriggerStatus?: UpsPickupTriggerGWNResponseTriggerStatus;
}

export interface UpsPickupGetPoliticalDivision1ListResponseBody {
  Response: UpsPickupGetPoliticalDivision1ListResponseResponse;
  PoliticalDivision1?: string[];
}

export interface UpsPickupGetServiceCenterFacilitiesRequestBody {
  Request: UpsPickupGetServiceCenterFacilitiesRequestRequest;
  PickupPiece: UpsPickupGetServiceCenterFacilitiesRequestPickupPiece[];
  OriginAddress?: UpsPickupGetServiceCenterFacilitiesRequestOriginAddress;
  DestinationAddress?: UpsPickupGetServiceCenterFacilitiesRequestDestinationAddress;
  Locale: string;
  ProximitySearchIndicator?: string;
}

export interface UpsPickupGetServiceCenterFacilitiesResponseBody {
  Response: UpsPickupGetServiceCenterFacilitiesResponseResponse;
  ServiceCenterLocation: UpsPickupGetServiceCenterFacilitiesResponseServiceCenterLocation;
}

export interface UpsPickupPendingStatusResponseBody {
  Response: UpsPickupPendingStatusResponseResponse;
  PendingStatus: UpsPickupPendingStatusResponsePendingStatus[];
}

export interface UpsPickupRateRequestRequest {
  RequestOption?: string;
  // When UPS introduces new elements in the response that are not associated with new request elements, Subversion is used. This ensures backward compatibility. To get such elements you need to have the right Subversion. The value of
  SubVersion?: string;
  TransactionReference?: UpsPickupRequestTransactionReference;
}

export interface UpsPickupRateRequestShipperAccount {
  AccountNumber: string;
  AccountCountryCode: string;
}

export interface UpsPickupRateRequestPickupAddress {
  AddressLine?: string;
  City: string;
  StateProvince?: string;
  PostalCode: string;
  CountryCode: string;
  // Indicates if the pickup address is commerical or residential. Valid values: Y = Residential address N = Non-residential (Commercial) address (default)
  ResidentialIndicator: string;
}

export interface UpsPickupRateRequestPickupDateInfo {
  // The latest local close time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  CloseTime: string;
  // The earliest local ready Time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  ReadyTime: string;
  // The specific local pickup date. Format: yyyyMMdd - yyyy = Year Applicable - MM = 01-12 - dd = 01-31
  PickupDate: string;
}

export interface UpsPickupRateResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupRateResponseRateResult {
  Disclaimer?: UpsPickupRateResultDisclaimer;
  RateType?: string;
  CurrencyCode: string;
  ChargeDetail?: UpsPickupRateResultChargeDetail[];
  TaxCharges?: UpsPickupRateResultTaxCharges[];
  TotalTax?: string;
  GrandTotalOfAllCharge?: string;
  GrandTotalOfAllIncentedCharge?: string;
  PreTaxTotalCharge?: string;
  PreTaxTotalIncentedCharge?: string;
}

export interface UpsPickupRateResponseWeekendServiceTerritory {
  SatWST: string;
  SunWST: string;
}

export interface UpsPickupCancelResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupCancelResponseGWNStatus {
  Code: string;
  Description?: string;
}

export interface UpsPickupCreationRequestRequest {
  // When UPS introduces new elements in the response that are not associated with new request elements, Subversion is used. This ensures backward compatibility. To get such elements you need to have the right Subversion. The value of
  SubVersion?: string;
  TransactionReference?: UpsPickupRequestTransactionReference;
}

export interface UpsPickupCreationRequestShipper {
  Account?: UpsPickupShipperAccount;
  ChargeCard?: UpsPickupShipperChargeCard;
}

export interface UpsPickupCreationRequestPickupDateInfo {
  // Pickup location's local close time. - User provided Close Time must be later than the Earliest Allowed Customer Close Time. - Earliest Allowed Customer Close Time is defined by UPS pickup operation system. - CloseTime minus ReadyT
  CloseTime: string;
  // Pickup location's local ready time. ReadyTime means the time when your shipment(s) can be ready for UPS to pick up. - User provided ReadyTime must be earlier than CallByTime. - CallByTime is determined by UPS pickup operation syst
  ReadyTime: string;
  // Local pickup date of the location. Format: yyyyMMdd - yyyy = Year Appliable - MM = 01–12 - dd = 01–31
  PickupDate: string;
}

export interface UpsPickupCreationRequestPickupAddress {
  CompanyName: string;
  ContactName: string;
  AddressLine: string[];
  Room?: string;
  Floor?: string;
  City: string;
  StateProvince?: string;
  Urbanization?: string;
  PostalCode?: string;
  CountryCode: string;
  // Indicates if the pickup address is commercial or residential. Valid values: Y = Residential address N = Non-residential (Commercial) address (default)
  ResidentialIndicator: string;
  PickupPoint?: string;
  Phone: UpsPickupAddressPhone;
}

export interface UpsPickupCreationRequestPickupPiece {
  ServiceCode: string;
  Quantity: string;
  DestinationCountryCode: string;
  // Container type. Valid values: - 01 = PACKAGE - 02 = UPS LETTER - 03 = PALLET Note: 03 is used for only WWEF services
  ContainerCode: string;
}

export interface UpsPickupCreationRequestTotalWeight {
  Weight: string;
  UnitOfMeasurement: string;
}

export interface UpsPickupCreationRequestTrackingData {
  TrackingNumber?: string;
}

export interface UpsPickupCreationRequestTrackingDataWithReferenceNumber {
  TrackingNumber: string;
  ReferenceNumber?: string[];
}

export interface UpsPickupCreationRequestFreightOptions {
  ShipmentServiceOptions?: UpsPickupFreightOptionsShipmentServiceOptions;
  OriginServiceCenterCode?: string;
  OriginServiceCountryCode?: string;
  DestinationAddress?: UpsPickupFreightOptionsDestinationAddress;
  ShipmentDetail: UpsPickupFreightOptionsShipmentDetail;
}

export interface UpsPickupCreationRequestNotification {
  ConfirmationEmailAddress?: string;
  UndeliverableEmailAddress?: string;
}

export interface UpsPickupCreationResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupCreationResponseWeekendServiceTerritory {
  SatWST: string;
  SunWST: string;
}

export interface UpsPickupCreationResponseRateStatus {
  // The rating status. - 01 = Rate available - 02 = Rate not available - 03 = Rate not apply - 04 = Rate not requested - If 01 is returned, then OnCallPickupRateResult will also be returned with rate details. - If 02 is returned, then
  Code: string;
  Description?: string;
}

export interface UpsPickupCreationResponseRateResult {
  Disclaimer?: UpsPickupRateResultDisclaimer;
  RateType?: string;
  CurrencyCode?: string;
  ChargeDetail?: UpsPickupRateResultChargeDetail[];
  TaxCharges?: UpsPickupRateResultTaxCharges[];
  TotalTax?: string;
  GrandTotalOfAllCharge: string;
  GrandTotalOfAllIncentedCharge?: string;
  PreTaxTotalCharge?: string;
  PreTaxTotalIncentedCharge?: string;
}

export interface UpsPickupTriggerGWNResponseTriggerStatus {
  // Status code indicating the result. - 01 -- NEW - New pickup scheduled - 02 -- EXISTING - Pickup already exists for this date
  Code?: string;
  Description?: string;
}

export interface UpsPickupGetPoliticalDivision1ListResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupGetServiceCenterFacilitiesRequestRequest {
  TransactionReference?: UpsPickupRequestTransactionReference;
}

export interface UpsPickupGetServiceCenterFacilitiesRequestPickupPiece {
  ServiceCode: string;
  // The container type 03 = PALLET Required for WWEF shipments.
  ContainerCode: string;
}

export interface UpsPickupGetServiceCenterFacilitiesRequestOriginAddress {
  // Indicates the address of the shipper to allow for the nearest Drop off facility Search. Conditionally required if proximitySearchIndicator is present.
  StreetAddress?: string;
  // Indicates the address of the shipper to allow for the nearest Drop off facility Search Conditionally required if proximitySearchIndicator is present.
  City?: string;
  // Indicates the address of the shipper to allow for the nearest Drop off facility Search. Conditionally required if proximitySearchIndicator is present and if country or territory is US/CA/IE/HK. Required for Vietnam (VN). For Vietn
  StateProvince?: string;
  // Indicates the address of the shipper to allow for the nearest Drop off facility Search Conditionally required if proximitySearchIndicator is present and if country or territory has postal code.It does not apply to non-postal count
  PostalCode?: string;
  CountryCode: string;
  OriginSearchCriteria?: UpsPickupOriginAddressOriginSearchCriteria;
}

export interface UpsPickupGetServiceCenterFacilitiesRequestDestinationAddress {
  City?: string;
  StateProvince?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsPickupGetServiceCenterFacilitiesResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupGetServiceCenterFacilitiesResponseServiceCenterLocation {
  DropOffFacilities?: UpsPickupServiceCenterLocationDropOffFacilities[];
  PickupFacilities?: UpsPickupServiceCenterLocationPickupFacilities;
}

export interface UpsPickupPendingStatusResponseResponse {
  ResponseStatus: UpsPickupResponseResponseStatus;
  Alert?: UpsPickupResponseAlert[];
  TransactionReference?: UpsPickupResponseTransactionReference;
}

export interface UpsPickupPendingStatusResponsePendingStatus {
  // Specify the type of pending pickup. - 01 = on-callPickup
  PickupType: string;
  // Local service date. Format: yyyyMMdd - yyyy = Year applicable - MM = 01-12 - dd = 01-31
  ServiceDate: string;
  PRN: string;
  GWNStatusCode?: string;
  OnCallStatusCode?: string;
  PickupStatusMessage: string;
  // Pickup billing classification for on call - 01 = Regular - 02 = Return - 03 = Alternate Address (Not supported for now)
  BillingCode?: string;
  ContactName?: string;
  ReferenceNumber?: string;
}

export interface UpsPickupRequestTransactionReference {
  // The CustomerContext information that is echoed back during response.
  CustomerContext?: string;
}

export interface UpsPickupResponseResponseStatus {
  Code: string;
  Description: string;
}

export interface UpsPickupResponseAlert {
  Code: string;
  Description: string;
}

export interface UpsPickupResponseTransactionReference {
  // The CustomerContext information that is echoed back during response.
  CustomerContext?: string;
}

export interface UpsPickupRateResultDisclaimer {
  // Disclaimer code. Valid values: - 01 = Taxes are included in the shipping cost and apply to the transportation charges but additional duties/taxes may apply and are not reflected in the total amount due. - 02 = Additional duties/ta
  Code: string;
  Description: string;
}

export interface UpsPickupRateResultChargeDetail {
  ChargeCode: string;
  ChargeDescription?: string;
  ChargeAmount: string;
  IncentedAmount?: string;
  TaxAmount?: string;
}

export interface UpsPickupRateResultTaxCharges {
  // Type of Tax code. Valid values: ALV, BTW, DDS, DDV, DPH, FPA, GST, IVA, IVA1, IVA2, IVA3, KM, MOMS, MWST, PDV, PST, PVM, PVN, QST, TVA, VAT, VSK.
  Type: string;
  MonetaryValue: string;
}

export interface UpsPickupShipperAccount {
  AccountNumber: string;
  AccountCountryCode: string;
}

export interface UpsPickupShipperChargeCard {
  CardHolderName?: string;
  // Charge card type. Valid values: - 01 = American Express - 03 = Discover - 04 = Mastercard - 06 = VISA Discover card Pickup country US only.
  CardType: string;
  CardNumber: string;
  // Credit card expiration date. Format: yyyyMM yyyy = 4 digit year, valid value current year - 10 years. MM = 2 digit month, valid values 01-12
  ExpirationDate: string;
  // Three or four digits that can be found either on top of credit card number or on the back of credit card. Number of digits varies for different type of credit card. Valid values are 3 or 4 digits. Security code is required if cred
  SecurityCode: string;
  CardAddress: UpsPickupChargeCardCardAddress;
}

export interface UpsPickupAddressPhone {
  Number: string;
  Extension?: string;
}

export interface UpsPickupFreightOptionsShipmentServiceOptions {
  // Presence indicates OriginLiftGateRequiredIndicator is present. Conditionally requirements. Must not be present if DropOffAtUPSFacilityIndicator is true
  OriginLiftGateIndicator?: string;
  // Identifies service center location information for Origin List of UPS Facilities.
  DropoffAtUPSFacilityIndicator?: string;
  // Identifies service center location information for Destination of UPS Facilities.
  HoldForPickupIndicator?: string;
}

export interface UpsPickupFreightOptionsDestinationAddress {
  City?: string;
  StateProvince?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsPickupFreightOptionsShipmentDetail {
  HazmatIndicator?: string;
  PalletInformation?: UpsPickupShipmentDetailPalletInformation;
}

export interface UpsPickupOriginAddressOriginSearchCriteria {
  SearchRadius?: string;
  // Unit of Measure Required if ProximitySearchIndicator is present. Example: MI or KM
  DistanceUnitOfMeasure: string;
  MaximumLocation?: string;
}

export interface UpsPickupServiceCenterLocationDropOffFacilities {
  Name: string;
  Address: UpsPickupDropOffFacilitiesAddress;
  SLIC: string;
  Type: string;
  // Facility's Timezone. Format: - America/New_York - Asia/Hong_Kong - Europe/London
  Timezone: string;
  Phone: string;
  Fax: string;
  FacilityTime?: UpsPickupDropOffFacilitiesFacilityTime;
  OriginOrDestination: string;
  LocalizedInstruction?: UpsPickupDropOffFacilitiesLocalizedInstruction[];
  Distance?: UpsPickupDropOffFacilitiesDistance;
}

export interface UpsPickupServiceCenterLocationPickupFacilities {
  Name: string;
  Address: UpsPickupFacilitiesAddress;
  SLIC: string;
  Type: string;
  // Facility's Timezone. Format: - America/New_York - Asia/Hong_Kong - Europe/London
  Timezone: string;
  Phone: string;
  Fax: string;
  FacilityTime?: UpsPickupFacilitiesFacilityTime;
  AirportCode?: string;
  SortCode?: string;
}

export interface UpsPickupChargeCardCardAddress {
  AddressLine?: string[];
  City?: string;
  StateProvince?: string;
  PostalCode?: string;
  CountryCode: string;
}

export interface UpsPickupShipmentDetailPalletInformation {
  Dimensions?: UpsPickupPalletInformationDimensions;
}

export interface UpsPickupDropOffFacilitiesAddress {
  AddressLine: string[] | string;
  City: string;
  StateProvince: string;
  PostalCode: string;
  CountryCode: string;
  ResidentialIndicator: string;
}

export interface UpsPickupDropOffFacilitiesFacilityTime {
  DayOfWeek: UpsPickupFacilityTimeDayOfWeek[];
}

export interface UpsPickupDropOffFacilitiesLocalizedInstruction {
  Locale?: string;
  Last50ftInstruction?: string;
}

export interface UpsPickupDropOffFacilitiesDistance {
  Value?: string;
  UnitOfMeasurement?: string;
}

export interface UpsPickupFacilitiesAddress {
  AddressLine: string;
  City: string;
  StateProvince: string;
  PostalCode: string;
  CountryCode: string;
  // Indicates if the pickup location is commerical or residential. Valid values: Y = Residential address N = Non-residential (Commercial) address (default)
  ResidentialIndicator: string;
}

export interface UpsPickupFacilitiesFacilityTime {
  DayOfWeek: UpsPickupFacilitiesFacilityTimeDayOfWeek[];
}

export interface UpsPickupPalletInformationDimensions {
  UnitOfMeasurement: UpsPickupDimensionsUnitOfMeasurement;
  Length: string;
  Width: string;
  Height: string;
}

export interface UpsPickupFacilityTimeDayOfWeek {
  Day: string;
  EarliestDropOfforPickup?: string;
  LatestDropOfforPickup?: string;
  // Facility Open Hours. The latest local open time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  OpenHours: string;
  // Facility Close Hours. The latest local close time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  CloseHours: string;
  PrepTime?: string;
  LastDrop?: string;
}

export interface UpsPickupFacilitiesFacilityTimeDayOfWeek {
  Day: string;
  EarliestDropOfforPickup?: string;
  LatestDropOfforPickup?: string;
  // Facility Open Hours. The latest local open time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  OpenHours: string;
  // Facility Close Hours. The latest local close time. Format: HHmm - Hour: 0-23 - Minute: 0-59
  CloseHours: string;
  // Preparation time for hold for pickup Conditionally required if request is for hold for pickup.
  PrepTime?: string;
  LastDrop?: string;
}

export interface UpsPickupDimensionsUnitOfMeasurement {
  Code: string;
  Description?: string;
}

export interface UpsPickupPendingStatusOptions {
  accountNumber: string;
  pickupType: UpsPickupType;
}

export interface UpsPickupPoliticalDivisionsOptions {
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
}
