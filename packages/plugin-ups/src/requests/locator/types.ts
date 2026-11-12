// Generated shape of the UPS "Locator" OpenAPI spec; see docs/ups-api.md.

export interface UpsLocatorRequestWrapper {
  LocatorRequest: UpsLocatorRequest;
}

export interface UpsLocatorResponseWrapper {
  LocatorResponse: UpsLocatorResponse;
}

export interface UpsLocatorRequest {
  Request: UpsLocatorRequestRequest;
  OriginAddress: UpsLocatorRequestOriginAddress;
  Translate: UpsLocatorRequestTranslate;
  UnitOfMeasurement?: UpsLocatorRequestUnitOfMeasurement;
  LocationID?: string[];
  LocationSearchCriteria?: UpsLocatorRequestLocationSearchCriteria;
  SortCriteria?: UpsLocatorRequestSortCriteria;
  AllowAllConfidenceLevels?: string;
  /** Valid values: 01-Proximity Search Details 02-Address Search Details 03-Proximity Search Summary 04-Address Search Summary 05-Freight Will Call Search. Either OptionType 03 or 04 is required. */
  SearchOptionCode?: string;
  ServiceGeoUnit?: UpsLocatorRequestServiceGeoUnit;
  FreightIndicator?: string;
}

export interface UpsLocatorRequestRequest {
  TransactionReference?: UpsLocatorRequestTransactionReference;
  RequestAction: string;
}

export interface UpsLocatorRequestTransactionReference {
  /** The client uses CustomerContext to synchronize request/response pairs. The client establishes CustomerContext, which can contain any information client want, as long as it is valid XML; it is echoed back by the server */
  CustomerContext?: string;
}

/** Container for origin address information. */
export interface UpsLocatorRequestOriginAddress {
  Geocode?: UpsLocatorOriginAddressGeocode;
  AddressKeyFormat: UpsLocatorOriginAddressAddressKeyFormat;
  /** If present, indicates the maximum number of locations the client wishes to receive in an address candidate response where the provided origin information is insufficient to accurately establish location. Valid values: 1-50, default 10 */
  MaximumListSize?: string;
}

/** Geocode is the latitude and longitude of the origin address. */
export interface UpsLocatorOriginAddressGeocode {
  /** The latitude of the origin address or the center point of the area code. */
  Latitude: string;
  /** The longitude of the origin address or the center point of the area code. */
  Longitude: string;
}

/** Contains all of the basic information about the origin such as: Address Lines, City, State/Province, Postal Code and Country or Territory Code. The element CountryCode is required. */
export interface UpsLocatorOriginAddressAddressKeyFormat {
  ConsigneeName?: string;
  /** Address Line Information. The user may submit street level address information or provide Intersection information. */
  AddressLine: string;
  /** Additional Address Line Information. */
  AddressLine2?: string;
  /** Additional Address Line Information. */
  AddressLine3?: string;
  PoliticalDivision3?: string;
  PoliticalDivision2: string;
  PoliticalDivision1: string;
  /** Main postal code. Required if the user does not submit the City, State/Province address combination. */
  PostcodePrimaryLow: string;
  /** 4 Digit postal code extension. Valid for US only. */
  PostcodeExtendedLow?: string;
  CountryCode: string;
  SingleLineAddress?: string;
}

/** Contains the locale information for the request. */
export interface UpsLocatorRequestTranslate {
  Locale?: string;
}

/** Distance unit of measurement. This is required for location requests (request option 1). */
export interface UpsLocatorRequestUnitOfMeasurement {
  /** Valid values are: - MI-Miles - KM-Kilometers */
  Code: string;
}

export interface UpsLocatorRequestLocationSearchCriteria {
  SearchOption?: UpsLocatorLocationSearchCriteriaSearchOption[];
  MaximumListSize?: string;
  /** Defines the maximum radius the user wishes to search for a UPS location. If the user does not specify, the default value is 100 miles. Whole numbers only. Valid values are: 5-100 for UnitOfMeasure MI 5-150 for UnitOfMesaure KM */
  SearchRadius?: string;
  ServiceSearch?: UpsLocatorLocationSearchCriteriaServiceSearch;
  FreightWillCallSearch?: UpsLocatorLocationSearchCriteriaFreightWillCallSearch;
  AccessPointSearch?: UpsLocatorLocationSearchCriteriaAccessPointSearch;
  OpenTimeCriteria?: UpsLocatorLocationSearchCriteriaOpenTimeCriteria;
  BrexitFilter?: string;
}

export interface UpsLocatorLocationSearchCriteriaSearchOption {
  OptionType: UpsLocatorSearchOptionOptionType;
  OptionCode: UpsLocatorSearchOptionOptionCode[];
  Relation?: UpsLocatorSearchOptionRelation;
}

export interface UpsLocatorSearchOptionOptionType {
  /** Code for Option type valid values are: - 01-Location - 02-Retail Location - 03-Additional Services - 04-Program Type - 05-Service Level Option. - 06-End Point Service Offering */
  Code: string;
}

export interface UpsLocatorSearchOptionOptionCode {
  Code: string;
}

export interface UpsLocatorSearchOptionRelation {
  /** Applicable for Additional Services and Program Types. Valid values: - 01 - And (Default) - 02 - Or */
  Code: string;
}

export interface UpsLocatorLocationSearchCriteriaServiceSearch {
  /** Scheduled Local Drop-off Time. Format: HHMM */
  Time?: string;
  ServiceCode?: UpsLocatorServiceSearchServiceCode[];
  ServiceOptionCode?: UpsLocatorServiceSearchServiceOptionCode[];
}

/** Container that contains the service information such as Ground/Air. Required if the customer provides ServiceSearch Time. */
export interface UpsLocatorServiceSearchServiceCode {
  /** Code indicating the different services. Valid values are: 01-Ground. 02-Air. 03-Express 04-Standard 05-International (Only avialable July 17) */
  Code: string;
}

/** Container for the optional service information such as Saturday Pick up. */
export interface UpsLocatorServiceSearchServiceOptionCode {
  /** Code that defines the optional service. Valid values: - 01 - Saturday pickup. Only valid for air service. */
  Code: string;
}

/** Freight Will Call Search Container. Required if SearchOption is '05-Freight Will Call Search' */
export interface UpsLocatorLocationSearchCriteriaFreightWillCallSearch {
  FreightWillCallRequestType: string;
  FacilityAddress: UpsLocatorFreightWillCallSearchFacilityAddress[];
  /** OriginOrDestination is required for FreightWillCallRequestType 1 and type 3 . Valid values: 01-Origin facilities 02-Destination facilities. */
  OriginOrDestination: string;
  /** FormatPostalCode would be required in the request when FreightWillCallRequestType is 1. Valid values are: NFR-No format requested FR-format requested FS-format and search NVR-No validation requested. */
  FormatPostalCode: string;
  /** Day Of week Code. Valid Values are 1 to 7. 1-Sunday 2-Monday 3-Tuesday 4-Wednesday 5-Thursday 6-Friday 7-Saturday. */
  DayOfWeekCode?: string;
}

export interface UpsLocatorFreightWillCallSearchFacilityAddress {
  SLIC?: string;
  AddressLine?: string[];
  City?: string;
  /** Postal code. Required for Freight Will call search if FreightWillCallRequestType is 1. */
  PostalCodePrimaryLow?: string;
  /** 4 Digit postal code extension. Valid for US only. */
  PostalCodeExtendedLow?: string;
  /** State. Required if FrieghtWillCallRequestType is 3 if State is available. */
  State?: string;
  /** Country or territory code. */
  CountryCode: string;
}

export interface UpsLocatorLocationSearchCriteriaAccessPointSearch {
  /** The Public Access Point ID to use for UPS Access Point Search. Once this parameter is present , address or geocode search is ignored. It cannot be combined with AccountNumber search parameter. */
  PublicAccessPointID?: string;
  /** Status of UPS Access Point. Valid values are: 01-Active-available 07-Active-unavailable. */
  AccessPointStatus?: string;
  AccountNumber?: string;
  IncludeCriteria?: UpsLocatorAccessPointSearchIncludeCriteria;
  ExcludeFromResult?: UpsLocatorAccessPointSearchExcludeFromResult;
  ExactMatchIndicator?: string;
  ExistIndicator?: string;
}

/** This contains elements to refine (include) UPS Access point address or geocode Search. */
export interface UpsLocatorAccessPointSearchIncludeCriteria {
  MerchantAccountNumberList?: UpsLocatorIncludeCriteriaMerchantAccountNumberList;
  SearchFilter?: UpsLocatorIncludeCriteriaSearchFilter;
  ServiceOfferingList?: UpsLocatorIncludeCriteriaServiceOfferingList;
}

export interface UpsLocatorIncludeCriteriaMerchantAccountNumberList {
  /** Account number to be used for a private network access point search where a UPS access point candidate list is obtained in search by address or geocode search. */
  MerchantAccountNumber: string[];
}

/** Container to hold one or more search criteria for UPS Access Points that allow DCR, Shipping and ClickAndCollect access. Only applicable when the UPS access point candidate list is obtained in search by address or geocode search. */
export interface UpsLocatorIncludeCriteriaSearchFilter {
  DCRIndicator?: string;
  ShippingAvailabilityIndicator?: string;
  ShipperPreparationDelay?: string;
  /** This contains the distance (in given UnitOfMeasurement) wherin to sort the click and collect access point locations above other access point locations when a UPS Access Point candidate list is obtained in search by address or geocode search. */
  ClickAndCollectSortWithDistance?: string;
}

/** Container to hold end point service offering List for UPS Access point. Applicable only when a UPS Access Point candidate list is obtained in search by address or geocode search. */
export interface UpsLocatorIncludeCriteriaServiceOfferingList {
  ServiceOffering: UpsLocatorServiceOfferingListServiceOffering[];
}

export interface UpsLocatorServiceOfferingListServiceOffering {
  Code: string;
  Description: string;
}

/** This contains elements to exclude from UPS Access Point address or geocode search. */
export interface UpsLocatorAccessPointSearchExcludeFromResult {
  /** This contains the business classification code to exclude from UPS Access Point Search by address or geocode. Multiple codes can are possible in separate elements. Please refer to Appendix D for detailed business codes. */
  BusinessClassificationCode?: string[];
  /** This contains the business name to exclude from UPS Access Point Search by address or geocode. Partial names are accepted. */
  BusinessName?: string;
  /** Public Access points within Radius (in specified Unit of Measure) of any included private access points will be excluded from the results. Valid only if at least one IncludeCriteria/MerchantAccountNumber is provided. */
  Radius?: string;
  PostalCodeList?: UpsLocatorExcludeFromResultPostalCodeList;
}

/** Container to hold a list of postal codes to exclude from the access point address or geocode search. */
export interface UpsLocatorExcludeFromResultPostalCodeList {
  PostalCode: UpsLocatorPostalCodeListPostalCode[];
}

/** Container to hold the postal code . */
export interface UpsLocatorPostalCodeListPostalCode {
  /** Primary postal code. */
  PrimaryPostalCode: string;
  /** Secondary postal code. */
  SecondaryPostalCode?: string;
}

export interface UpsLocatorLocationSearchCriteriaOpenTimeCriteria {
  /** Day Of week Code. Valid values: 1-Sunday 2-Monday 3-Tuesday 4-Wednesday 5-Thursday 6-Friday 7-Saturday */
  DayOfWeekCode?: string;
  /** From time. Time Format HHMM. */
  FromTime?: string;
  /** To Time. Time Format HHMM */
  ToTime?: string;
}

export interface UpsLocatorRequestSortCriteria {
  /** For different sort type. Valid values: 01-Closest Location 02-Deadline for Drop-off by Air/Express 03-Deadline for Drop-off by Ground/Standard 04-Latest Close Time 05-Earliest Open Time. */
  SortType?: string;
}

/** ServiceGeoUnit Container. Required to search for the freight facility information */
export interface UpsLocatorRequestServiceGeoUnit {
  /** Service Code. Required if ServiceGeoUnit Container present. Valid value is '096' . */
  ServiceCode: string;
  /** GeoPoliticalUnit. Required if ServiceGeoUnit container present. Valid value is '002' . */
  GeoPoliticalUnit: string;
}

export interface UpsLocatorResponse {
  Response: UpsLocatorResponseResponse;
  Geocode?: UpsLocatorResponseGeocode;
  SearchResults: UpsLocatorResponseSearchResults;
  /** Confidence level. Valid values: True or False */
  AllowAllConfidenceLevels: string;
}

export interface UpsLocatorResponseResponse {
  TransactionReference?: UpsLocatorResponseTransactionReference;
  ResponseStatusCode: string;
  /** Describes the Response Status Code. */
  ResponseStatusDescription?: string;
  Error?: UpsLocatorResponseError;
}

export interface UpsLocatorResponseTransactionReference {
  CustomerContext?: string;
  XpciVersion?: string;
}

/** If an error is encountered during the interchange, the Response contains an error. If the error is present, then the ErrorSeverity and ErrorCode are required. */
export interface UpsLocatorResponseError {
  /** Describes the severity of the error. For additional information, refer to Locator Error Codes in the Appendix. */
  ErrorSeverity: string;
  /** A numeric value that describes the error. Each tool defines a range of error codes. For additional information, refer to Locator Error Codes in the Appendix. */
  ErrorCode: string;
  /** Describes the error code. */
  ErrorDescription?: string;
  MinimumRetrySeconds?: string;
  ErrorLocation?: UpsLocatorErrorErrorLocation[];
  ErrorDigest?: string[];
}

export interface UpsLocatorErrorErrorLocation {
  ErrorLocationElementName?: string;
  ErrorLocationAttributeName?: string;
}

/** Geocode is the latitude and longitude of the origin address. The Geocode is provided in the first successful response. Required to be returned when the origin address or phone number is submitted in the request.Will not be returned when the requestoption =64 */
export interface UpsLocatorResponseGeocode {
  /** The latitude of the origin address, center point of the exchange, center point of the postal code, or center point of the city. */
  Latitude: string;
  /** The longitude of the origin address, center point of the exchange, center point of the postal code, or center point of the city. */
  Longitude: string;
}

export interface UpsLocatorResponseSearchResults {
  /** If the origin address provided in the location request document does not have a match, a list of candidate addresses, geocodes and optionally a landmark will be returned. */
  GeocodeCandidate?: UpsLocatorSearchResultsGeocodeCandidate[];
  Disclaimer?: string;
  DropLocation?: UpsLocatorSearchResultsDropLocation[];
  /** This container contains the information about the currently existing Retail Locations or Additional Services or Program types. */
  AvailableLocationAttributes?: UpsLocatorSearchResultsAvailableLocationAttributes[];
  ActiveAvailableAccessPointIndicator?: string;
}

export interface UpsLocatorSearchResultsGeocodeCandidate {
  AddressKeyFormat: UpsLocatorGeocodeCandidateAddressKeyFormat;
  Geocode: UpsLocatorGeocodeCandidateGeocode;
  /** If a Landmark code was provided in the request, a candidate list of Landmark Names will be returned along with the corresponding address and Geocode. */
  LandmarkName?: string;
}

/** Contains all of the basic information about candidate address. */
export interface UpsLocatorGeocodeCandidateAddressKeyFormat {
  ConsigneeName?: string;
  /** Address Line Information. The address level or Intersection information must be returned if provided in the request. The AddressLine will be a combination of up to 3 separate address lines, each separated by a new line character. */
  AddressLine: string;
  PoliticalDivision3?: string;
  PoliticalDivision2: string;
  PoliticalDivision1: string;
  /** Postal Code. */
  PostcodePrimaryLow: string;
  /** 4 Digit postal code extension. Valid for US only. */
  PostcodeExtendedLow?: string;
  /** A country or territory code. Valid values for candidates to be returned are: US-United States (meaning US 50) */
  CountryCode: string;
}

/** Geocode is the latitude and longitude of the origin candidate. */
export interface UpsLocatorGeocodeCandidateGeocode {
  /** The latitude of the origin address, center point of the exchange, center point of the postal code, or center point of the city. */
  Latitude: string;
  /** The longitude of the origin address, center point of the exchange, center point of the postal code, or center point of the city. */
  Longitude: string;
}

export interface UpsLocatorSearchResultsDropLocation {
  LocationID: string;
  OriginOrDestination: string;
  IVR: UpsLocatorDropLocationIVR;
  Geocode: UpsLocatorDropLocationGeocode;
  AddressKeyFormat: UpsLocatorDropLocationAddressKeyFormat;
  PhoneNumber: string[];
  FaxNumber?: string;
  EMailAddress?: string;
  LocationAttribute: UpsLocatorDropLocationLocationAttribute[];
  Distance: UpsLocatorDropLocationDistance;
  SpecialInstructions?: UpsLocatorDropLocationSpecialInstructions[];
  LatestGroundDropOffTime?: string[];
  LatestAirDropOffTime?: string[];
  AdditionalChargeIndicator?: string;
  StandardHoursOfOperation?: string;
  NonStandardHoursOfOperation?: string;
  WillCallHoursOfOperation?: string;
  Number?: string;
  HomePageURL?: string;
  Comments?: string;
  AdditionalComments?: UpsLocatorDropLocationAdditionalComments;
  Disclaimer?: string[];
  SLIC?: string;
  Timezone: string;
  FacilityType?: string;
  OperatingHours?: UpsLocatorDropLocationOperatingHours;
  /** LocalizedInstruction container. Applicable for SearchOptionCode 01, 02, 03. */
  LocalizedInstruction?: UpsLocatorDropLocationLocalizedInstruction[];
  PromotionInformation?: UpsLocatorDropLocationPromotionInformation[];
  SortCode?: UpsLocatorDropLocationSortCode;
  ServiceOfferingList?: UpsLocatorDropLocationServiceOfferingList;
  /** Valid Values: 0-Do not display phone number 1-Display phone number. This indicator will be returned only for the contact type Telephone number. This indicator is used by the clients to determine whether to display the telephone number to the end user. */
  DisplayPhoneNumberIndicator?: string;
  AccessPointInformation?: UpsLocatorDropLocationAccessPointInformation;
  LocationImage?: UpsLocatorDropLocationLocationImage;
  LocationNewIndicator?: string;
  PromotionalLinkURL?: string;
  FeaturedRank?: string;
  WillCallLocationIndicator?: string;
}

/** Integrated Voice Response information. ONLY FOR IVR. */
export interface UpsLocatorDropLocationIVR {
  /** Contains the name of the IVR file that relates to this drop location. The file is an audio recording of information related to the location. ONLY FOR IVR. */
  PhraseID: string;
  /** Indicates to the response recipient that the information has changed, and a new audio file should be produced. ONLY FOR IVR. */
  TextToSpeechIndicator?: string;
}

/** Geocode is the latitude and longitude of the location address. The Geocode for the location address will be returned when Location is requested in the Request Option. */
export interface UpsLocatorDropLocationGeocode {
  /** The latitude of the location address or the center point of the area code. */
  Latitude: string;
  /** The longitude of the location address or the center point of the area code. */
  Longitude: string;
}

/** Contains all of the basic information about a location, Consignee Name, Building Name, Address Lines, City, State/Province, Postal Code and Country or Terriotry Code. */
export interface UpsLocatorDropLocationAddressKeyFormat {
  ConsigneeName?: string;
  /** Address Line Information of the UPS location The address level or Intersection information. Only two address lines will be returned. The second line may contain such information as the building name, the suite, and room. */
  AddressLine: string;
  PoliticalDivision3?: string;
  PoliticalDivision2: string;
  PoliticalDivision1: string;
  /** Postal Code. */
  PostcodePrimaryLow: string;
  /** 4 Digit postal code extension. Valid for US only. */
  PostcodeExtendedLow?: string;
  /** A country or territory code. Valid values to be returned are: US-United States (meaning US 50). */
  CountryCode: string;
}

/** LocationAttribute is a container that contains the information about the location's Location Type, Retail Location Type, Additional Services, or Program Type. */
export interface UpsLocatorDropLocationLocationAttribute {
  OptionType: UpsLocatorLocationAttributeOptionType;
  OptionCode: UpsLocatorLocationAttributeOptionCode[];
}

export interface UpsLocatorLocationAttributeOptionType {
  /** Code for Option type. Valid values: - 01 - Location - 02 - Retail Location - 03 - Additional Services - 04 - Program Type */
  Code: string;
  Description: string;
}

export interface UpsLocatorLocationAttributeOptionCode {
  /** Only applicabe for OptionType = 03 (Additional Services). Valid values: - 06 - Non transportation - 07 - Transportation */
  Category?: string;
  Code: string;
  Description: string;
  /** Name will indicate the name of any Additional Services/ Program Types depending on the option code. Text will be displayed in the locale selected. */
  Name?: string;
  TransportationPickUpSchedule?: UpsLocatorOptionCodeTransportationPickUpSchedule;
}

export interface UpsLocatorOptionCodeTransportationPickUpSchedule {
  PickUp: UpsLocatorTransportationPickUpSchedulePickUp[];
}

export interface UpsLocatorTransportationPickUpSchedulePickUp {
  DayOfWeek: string;
  PickUpDetails: UpsLocatorPickUpPickUpDetails;
}

export interface UpsLocatorPickUpPickUpDetails {
  /** Pickup time of transportation service for a location in military format (HHMM) e.g. 0930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  PickUpTime?: string;
  NoPickUpIndicator: string;
}

export interface UpsLocatorDropLocationDistance {
  Value: string;
  UnitOfMeasurement: UpsLocatorDistanceUnitOfMeasurement;
}

/** The unit of measurement the user will see for the distance is based on the user input provided in the search request. */
export interface UpsLocatorDistanceUnitOfMeasurement {
  /** The distance unit of measurement code. The unit of measurement used in the search request is returned. Valid values: MI-Miles or KM-Kilometers */
  Code: string;
  /** May return the description of the unit of measure specified in the request. */
  Description?: string;
}

export interface UpsLocatorDropLocationSpecialInstructions {
  Segment: string[];
}

export interface UpsLocatorDropLocationAdditionalComments {
  /** Container for CommentType Code and Text. */
  CommentType: UpsLocatorAdditionalCommentsCommentType[];
}

export interface UpsLocatorAdditionalCommentsCommentType {
  /** Comment code is 01 for AccessPoint LCO pickup time comment. */
  Code: string;
  Text: string;
}

export interface UpsLocatorDropLocationOperatingHours {
  StandardHours?: UpsLocatorOperatingHoursStandardHours[];
}

export interface UpsLocatorOperatingHoursStandardHours {
  /** Hours Type. Valid values: 10-Regular Operating Hours 11-Will Call Hours 12-Same Day Will Call Hours 14-Customer PickUp 50-Drop Off Hours 51-Prep Hours */
  HoursType: string;
  DayOfWeek: UpsLocatorStandardHoursDayOfWeek[];
}

export interface UpsLocatorStandardHoursDayOfWeek {
  /** Day of week. Valid values: 1-Sunday 2-Monday 3-Tuesday 4-Wednesday 5-Thursday 6-Friday 7-Saturday. */
  Day: string;
  /** Open time of a location in military format (HHMM) e.g. 930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  OpenHours?: string;
  /** Close time of a location in military format (HHMM) e.g. 930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  CloseHours?: string;
  /** LatestDropOffHours for Hour Type 50. Latest Drop Off time of a location in military format (HHMM) e.g. 930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  LatestDropOffHours?: string;
  /** PrepHours for Hour Type 51. Prep Hours of a location in military format (HHMM) e.g. 930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  PrepHours?: string;
  ClosedIndicator?: string;
  Open24HoursIndicator?: string;
}

export interface UpsLocatorDropLocationLocalizedInstruction {
  Locale: string;
  Last50ftInstruction: string;
}

export interface UpsLocatorDropLocationPromotionInformation {
  /** Locale (language/ dialect) for the promotion code. */
  Locale: string;
  Promotion: string;
}

export interface UpsLocatorDropLocationSortCode {
  /** Holds the value of the hub sort code or airport code */
  HubSortCode?: string;
  /** Holds the value of the facility location code. */
  FreightSortFacilityCode?: string;
}

export interface UpsLocatorDropLocationServiceOfferingList {
  /** Container for Service offering code. */
  ServiceOffering: UpsLocatorServiceOfferingListServiceOffering[];
}

export interface UpsLocatorDropLocationAccessPointInformation {
  PublicAccessPointID?: string;
  ImageURL?: string;
  BusinessClassificationList?: UpsLocatorAccessPointInformationBusinessClassificationList;
  AccessPointStatus?: UpsLocatorAccessPointInformationAccessPointStatus;
  FacilitySLIC?: string;
  PrivateNetworkList?: UpsLocatorAccessPointInformationPrivateNetworkList;
  Availability?: UpsLocatorAccessPointInformationAvailability;
}

export interface UpsLocatorAccessPointInformationBusinessClassificationList {
  BusinessClassification: UpsLocatorBusinessClassificationListBusinessClassification[];
}

export interface UpsLocatorBusinessClassificationListBusinessClassification {
  /** Business Classification code of UPS Access Point. Please refer to appendix D for a list of business classification. */
  Code: string;
  Description: string;
}

export interface UpsLocatorAccessPointInformationAccessPointStatus {
  Code: string;
  /** Description of status code. */
  Description: string;
}

export interface UpsLocatorAccessPointInformationPrivateNetworkList {
  PrivateNetwork: UpsLocatorPrivateNetworkListPrivateNetwork[];
}

export interface UpsLocatorPrivateNetworkListPrivateNetwork {
  NetworkID: string;
  NetworkDescription: string;
}

export interface UpsLocatorAccessPointInformationAvailability {
  ShippingAvailability?: UpsLocatorAvailabilityShippingAvailability;
  DCRAvailability?: UpsLocatorAvailabilityDCRAvailability;
}

export interface UpsLocatorAvailabilityShippingAvailability {
  AvailableIndicator?: string;
  UnavailableReason?: UpsLocatorShippingAvailabilityUnavailableReason;
}

export interface UpsLocatorShippingAvailabilityUnavailableReason {
  /** Code for shipping unavailability. Code for DCR/DCO unavailability. Valid values: - 01 - Temporarily Unavailable - 02 - Location Full - 03 - Unavailable - 04 - Weather */
  Code: string;
  Description: string;
}

export interface UpsLocatorAvailabilityDCRAvailability {
  AvailableIndicator?: string;
  UnavailableReason?: UpsLocatorDCRAvailabilityUnavailableReason;
}

export interface UpsLocatorDCRAvailabilityUnavailableReason {
  /** Code for DCR/DCO unavailability. Valid values: 01-Temporarily Unavailable 02-Location Full 03-Unavailable 04-Weather */
  Code: string;
  Description: string;
}

export interface UpsLocatorDropLocationLocationImage {
  SecureURL?: string;
  NonSecureURL?: string;
}

export interface UpsLocatorSearchResultsAvailableLocationAttributes {
  OptionType: UpsLocatorAvailableLocationAttributesOptionType;
  OptionCode: UpsLocatorAvailableLocationAttributesOptionCode;
}

/** OptionType is a container that indicates the type of the location attribute that are available. For example if the Option Type is RetailLocation the list of all available retail locations will be returned in 1 or many corresponding OptionCodes. */
export interface UpsLocatorAvailableLocationAttributesOptionType {
  /** Code for Option type. */
  Code: string;
  Description: string;
}

export type UpsLocatorAvailableLocationAttributesOptionCode =
  UpsLocatorAvailableLocationAttributesOptionCodeElement[];

export interface UpsLocatorAvailableLocationAttributesOptionCodeElement {
  /** The valid list of codes and description for Retail Locations or Additional Services or Pro-gram Types that are currently available in the database. This can be obtained by a separate type of request (Request Option 8, 16, 24, 32, 40, 48 and 56). */
  Code: string;
  Description: string;
  /** Name will indicate the name of Location/Retail Location or Additional Services or Program Types depending on the option code. Text will be displayed in the locale requested. */
  Name?: string;
  Category?: string;
  TransportationPickUpSchedule?: UpsLocatorAvailableLocationAttributesOptionCodeTransportationPickUpSchedule;
}

/** Container to hold information regarding pickup details for each day of the week. */
export interface UpsLocatorAvailableLocationAttributesOptionCodeTransportationPickUpSchedule {
  /** Container to hold information regarding pickup day of the week and details. */
  PickUp: UpsLocatorAvailableLocationAttributesTransportationPickUpSchedulePickUp[];
}

export interface UpsLocatorAvailableLocationAttributesTransportationPickUpSchedulePickUp {
  /** Day of the week for scheduled pickup. Valid values are: - 1 - Sunday - 2 - Monday - 3 - Tuesday - 4 - Wednesday - 5 - Thursday - 6 - Friday - 7 - Saturday. */
  DayOfWeek: string;
  PickUpDetails: UpsLocatorAvailableLocationAttributesPickUpPickUpDetails;
}

/** Container to hold information regarding pickup time and pickup availability indicator. */
export interface UpsLocatorAvailableLocationAttributesPickUpPickUpDetails {
  /** Time of pickup in military format (HHMM) e.g. 0930, 1700, 1845 etc. with exception for midnight. For midnight the time will be returned as 0. */
  PickUpTime?: string;
  /** Indicates whether or not there is a pickup time for the specified day of the week. Valid values: - True-there is a pickup time - False-there is not a pickup time. */
  NoPickUpIndicator: string;
}

/**
 * The `reqOption` path segment, a bitmask-shaped code: 1 locations, 8 additional
 * services, 16 program types, 32 retail locations, 64 Access Points; the
 * others are sums the spec lists individually.
 */
export type UpsLocatorRequestOption =
  "1" | "8" | "16" | "24" | "32" | "40" | "48" | "56" | "64";

export interface UpsLocatorSearchParams {
  reqOption: UpsLocatorRequestOption;
  /** Spec default `en_US`; unset omits the `Locale` query parameter. */
  locale?: string;
}
