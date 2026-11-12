import { UPSVersion, UpsValidCountryCode, Indicator } from "../types.js";
import { CurrencyCodes } from "@dianemo/plugin-kit";

/** Request types */

export enum UPSRequestOption {
  Rate = "Rate",
  Shop = "Shop",
  Ratetimeintransit = "Ratetimeintransit",
  Shoptimeintransit = "Shoptimeintransit",
}

export interface RateOptions {
  /**
   * Overrides the Rate/Shop choice `getUpsRate` otherwise derives from whether
   * the shipment carries a service code. Rate is the only option valid for
   * Ground Freight Pricing.
   */
  requestOption?: UPSRequestOption;
  /** Sent as `?additionalinfo=`; also implied by `DeliveryTimeInformation`. */
  additionalinfo?: UPSAdditionalInfoOptions[] | undefined;
  version?: UPSVersion;
}

export enum UPSAdditionalInfoOptions {
  timeintransit = "timeintransit",
}

export enum AdjustedHeightUnitOfMeasurementCode {
  IN = "IN",
}

export enum HandlingUnitDimensionsUnitOfMeasurementCode {
  IN = "IN",
}

export enum HandlingUnitTypeCode {
  /** Skid */
  SKD = "SKD",
  /** Carboy */
  CBY = "CBY",
  /** Pallet */
  PLT = "PLT",
  /** Totes */
  TOT = "TOT",
  /** Loose */
  LOO = "LOO",
  /** Other */
  OTH = "OTH",
}

export interface FreightShipmentInformation {
  /** Required if DensityEligibleIndicator is present. */
  FreightDensityInfo?: FreightDensityInfo;
  /**
   * The presence of the tag indicates that the rate request is density based.
   *
   * For Density Based Rating (DBR), the customer must have DBR Contract Service.
   */
  DensityEligibleIndicator?: Indicator;
}

export interface FreightDensityInfo {
  /**
   * The presence of the AdjustedHeightIndicator allows UPS to do height reduction adjustment for density based rate request.
   */
  AdjustedHeightIndicator?: Indicator;
  /** Required if AdjustedHeightIndicator is present */
  AdjustedHeight?: AdjustedHeight;
  HandlingUnits: HandlingUnit[];
}

export interface AdjustedHeight {
  Value: string;
  /** Unit of measurement code for Adjusted height is validated only when Handling unit type is SKD = Skid or PLT = Pallet. */
  UnitOfMeasurement: AdjustedHeightUnitOfMeasurement;
}

export interface AdjustedHeightUnitOfMeasurement {
  Code: AdjustedHeightUnitOfMeasurementCode;
  Description?: string;
}

export interface HandlingUnit {
  Quantity: string;
  Type: HandlingUnitType;
  /** Dimension of the HandlingUnit container for density based pricing. */
  Dimensions: Dimensions;
}

export interface HandlingUnitType {
  Code: HandlingUnitTypeCode;
  Description?: string;
}

export interface Dimensions {
  UnitOfMeasurement: HandlingUnitDimensionsUnitOfMeasurement;
  Length: string;
  Width: string;
  Height: string;
}

export interface HandlingUnitDimensionsUnitOfMeasurement {
  Code: HandlingUnitDimensionsUnitOfMeasurementCode;
  Description?: string;
}

/**
 * Required only for GFP and when the FRSIndicator is present.
 */
export enum FRSPaymentInformationTypeCode {
  /** Prepaid */
  Prepaid = "01",
  /** Freight Collect */
  FreightCollect = "02",
  /** Bill Third Party */
  BillThirdParty = "03",
}

export interface FRSPaymentInformation {
  Type: FRSPaymentInformationType;
  AccountNumber?: string;
  /**
   * Address container may be present for FRS Payment Information type = 02
   * and required when the FRS Payment Information type = 03.
   */
  Address?: FRSPaymentInformationAddress;
}

export interface FRSPaymentInformationType {
  Code: FRSPaymentInformationTypeCode;
  Description?: string;
}

export interface FRSPaymentInformationAddress {
  /**
   * Postal Code may be present when the FRS Payment Information type = 02 and type = 03.
   */
  PostalCode?: string;
  /**
   * Country or Territory Code is required the FRS Payment Information type = 02 and type = 03.
   */
  CountryCode: UpsValidCountryCode;
}

export enum PackagingTypeCode {
  Unknown = "00",
  UpsLetter = "01",
  Package = "02",
  Tube = "03",
  Pak = "04",
  ExpressBox = "21",
  TwentyFiveKgBox = "24",
  TenKgBox = "25",
  Pallet = "30",
  SmallExpressBox = "2a",
  MediumExpressBox = "2b",
  LargeExpressBox = "2c",
}

export enum PackageDimensionsUnitOfMeasurementCode {
  IN = "IN",
  CM = "CM",
}

export enum DimWeightUnitOfMeasurementCode {
  LBS = "LBS",
  KGS = "KGS",
}

export enum PackageWeightUnitOfMeasurementCode {
  LBS = "LBS",
  KGS = "KGS",
  OZS = "OZS",
}

/**
 * Can either be a single object or an array of up to 200 objects.
 */
export interface Package {
  PackagingType?: PackagingType;
  /** This container is not applicable for GFP Rating request. */
  Dimensions?: PackageDimensions;
  DimWeight?: DimWeight;
  PackageWeight?: PackageWeight;
  Commodity?: Commodity;
  LargePackageIndicator?: Indicator;
  PackageServiceOptions?: PackageServiceOptions;
  AdditionalHandlingIndicator?: Indicator;
  UPSPremier?: UPSPremierCategory;
  SimpleRate?: SimpleRate;
  OversizeIndicator?: Indicator;
  MinimumBillableWeightIndicator?: Indicator;
}

export interface UPSPremierCategory {
  Category: UPSPremierCategories;
}

export interface SimpleRate {
  Code: SimpleRateCodes;
  Description?: string;
}

export enum SimpleRateCodes {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export enum UPSPremierCategories {
  UPSPremierSilver = "01",
  UPSPremierGold = "02",
  UPSPremierPlatinum = "03",
}

export interface PackagingType {
  /** For FRS rating requests the only valid value is customer supplied packaging “02”. */
  Code: PackagingTypeCode;
  Description?: string;
}

export interface PackageDimensions {
  UnitOfMeasurement: PackageDimensionsUnitOfMeasurement;
  /**
   * Length of the package used to determine dimensional weight.
   *
   * Required for GB to GB and Poland to Poland shipments.
   */
  Length: string;
  /**
   * Width of the package used to determine dimensional weight.
   *
   * Required for GB to GB and Poland to Poland shipments.
   */
  Width: string;
  /**
   * Height of the package used to determine dimensional weight.
   *
   * Required for GB to GB and Poland to Poland shipments.
   */
  Height: string;
}

export interface PackageDimensionsUnitOfMeasurement {
  Code: PackageDimensionsUnitOfMeasurementCode;
  Description?: string;
}

/**
 * Values in this container are ignored when package dimensions are provided.
 *
 * Only used for non-US/CA/PR shipments.
 */
export interface DimWeight {
  UnitOfMeasurement?: DimWeightUnitOfMeasurement;
  /**
   * Dimensional weight of the package. Decimal values are not accepted, however there is one implied decimal place for values in this field (i.e. 115 = 11.5).
   */
  Weight?: string;
}

export interface DimWeightUnitOfMeasurement {
  Code: DimWeightUnitOfMeasurementCode;
  Description?: string;
}

/**
 * Required for a GFP Rating request. Otherwise optional.
 */
export interface PackageWeight {
  UnitOfMeasurement: PackageWeightUnitOfMeasurement;
  /** Weight accepted for letters/envelopes. */
  Weight: string;
}

export interface PackageWeightUnitOfMeasurement {
  /** Unit of Measurement "OZS" is the only valid UOM for Worldwide Economy DDU Shipments. */
  Code: PackageWeightUnitOfMeasurementCode;
  Description?: string;
}

/**
 * Required only for GFP rating when FRSShipmentIndicator is requested.
 */
export interface Commodity {
  /**
   * Freight class partially determines the freight rate for the article.
   */
  FreightClass: string;
  NMFC?: NMFC;
}

/**
 * For GFP Only.
 */
export interface NMFC {
  /**
   * Value of NMFC Prime.
   *
   * Contact your service representative if you need information concerning NMFC Codes.
   *
   * Required if NMFC Container is present.
   *
   * For GFP Only.
   */
  PrimeCode: string;
  /**
   * Value of NMFC Sub.
   *
   * Contact your service representative if you need information concerning NMFC Codes.
   *
   * Needs to be provided when the SubCode associated with the PrimeCode is other than 00.
   *
   * API defaults the sub value to 00 if not provided.
   *
   * If provided the Sub Code should be associated with the PrimeCode of the NMFC.
   */
  SubCode?: string;
}

export interface PackageServiceOptions {
  /**
   * The spec's package-level DCISType table (1 Unsupported, 2 Signature, 3 Adult
   * Signature) differs from its shipment-level one (1 Signature, 2 Adult) — see
   * docs/ups-api.md.
   */
  DeliveryConfirmation?: UpsRatingPackageDeliveryConfirmation;
  AccessPointCOD?: AccessPointCOD;
  COD?: COD;
  DeclaredValue?: DeclaredValue;
  ShipperDeclaredValue?: ShipperDeclaredValue;
  ShipperReleaseIndicator?: Indicator;
  ProactiveIndicator?: Indicator;
  RefrigerationIndicator?: Indicator;
  Insurance?: Insurance;
  UPSPremiumCareIndicator?: Indicator;
  HazMat?: HazMat;
  DryIce?: DryIce;
}

export interface DryIce {
  RegulationSet: DryIceRegulationSets;
  DryIceWeight: DryIceWeight;
  MedicalUseIndicator?: Indicator;
  AuditRequired?: string;
}

export interface DryIceWeight {
  UnitOfMeasurement: DryIceUnitOfMeasurementCode;
  Weight: string;
}

export interface DryIceUnitOfMeasurementCode {
  Code: DryIceUnitOfMeasurementCodes;
  Description?: string;
}

export enum DryIceUnitOfMeasurementCodes {
  "00" = "00", //KG
  "01" = "01", //LB
}

export interface HazMat {
  PackageIdentifier?: string;
  QValue?: string;
  OverPackedIndicator?: Indicator;
  AllPackedInOneIndicator?: Indicator;
  HazMatChemicalRecord: HazMatChemicalRecord | HazMatChemicalRecord[];
}

export interface HazMatChemicalRecord {
  ChemicalRecordIdentifier?: string;
  ClassDivisionNumber?: string;
  IDNumber?: string;
  TransportationMode: TransportationsModes;
  RegulationSet: RegulationSets;
  EmergencyPhone?: string;
  EmergencyContact?: string;
  ReportableQuantity?: string;
  SubRiskClass?: string;
  /** @deprecated Not a UPS field: the wire name is `PackagingGroupType`. */
  PackingGroupType?: PackingGroupTypes;
  PackagingGroupType?: PackingGroupTypes;
  Quantity?: string;
  UOM?: string;
  PackagingInstructionCode?: string;
  ProperShippingName?: string;
  TechnicalName?: string;
  AdditionalDescription?: string;
  PackagingType?: string;
  HazardLabelRequired?: string;
  PackagingTypeQuantity?: string;
  CommodityRegulatedLevelCode?: CommodityRegulatedLevelCodes;
  TransportCategory?: TransportCategory;
  TunnelRestrictionCode?: string;
}

export enum TransportCategory {
  Category0 = "0",
  Category1 = "1",
  Category2 = "2",
  Category3 = "3",
  Category4 = "4",
}
export enum CommodityRegulatedLevelCodes {
  LigtlyRegulated = "LR",
  FullyRegulated = "FR",
  LimitedQuantity = "LQ",
  ExceptedQuantity = "EQ",
}

export enum PackingGroupTypes {
  I = "I",
  II = "II",
  III = "III",
  " " = " ",
}

export enum DryIceRegulationSets {
  CFR = "CFR", // DOTWithinUSorToCanada
  IATA = "IATA", //WorldwideAirMovement
}

export enum RegulationSets {
  EuropetoEuropeGroundMovement = "ADR",
  DOTWithinUSorToCanada = "CFR",
  WorldwideAirMovement = "IATA",
  CanadaWithinOrToUSStandard = "TDG",
}

export enum TransportationsModes {
  Highway = "01",
  Ground = "02",
  PassengerAircraft = "03",
  CargoAircraftOnly = "04",
}

export interface Insurance {
  BasicFlexibleParcelIndicator?: BasicFlexibleParcelIndicator;
  ExtendedFlexibleParcelIndicator?: ExtendedFlexibleParcelIndicator;
  TimeInTransitFlexibleParcelIndicator?: TimeInTransitFlexibleParcelIndicator;
  PackageProtection?: UpsRatingPackageProtection;
}

export interface UpsRatingPackageProtection {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface TimeInTransitFlexibleParcelIndicator {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}
export interface ExtendedFlexibleParcelIndicator {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface BasicFlexibleParcelIndicator {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface ShipperDeclaredValue {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}
export interface DeclaredValue {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface COD {
  CODFundsCode: CODFundsCodes;
  CODAmount: CODAmount;
}

export enum CODFundsCodes {
  "Check, Cash Cashier's Check Money Order" = "0",
  "Cashier’s Check Money Order" = "8",
  "Personal Check" = "9",
}

export interface CODAmount {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface AccessPointCOD {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface DeliveryConfirmation {
  DCISType: DCISType;
}

export interface UpsRatingPackageDeliveryConfirmation {
  DCISType: DCISType | UpsRatingPackageDCISType;
}

export enum UpsRatingPackageDCISType {
  Unsupported = "1",
  DeliveryConfirmationSignatureRequired = "2",
  DeliveryConfirmationAdultSignatureRequired = "3",
}

export enum DCISType {
  DeliveryConfirmationSignatureRequired = "1",
  DeliveryConfirmationAdultSignatureRequired = "2",
}

export enum ShipmentChargeType {
  /** Transportation */
  "01" = "01",
  /** Duties and Taxes */
  "02" = "02",
}

/**
 * Payment details container for detailed shipment charges.
 *
 * The two shipment charges that are available for specification are
 * - Transportation charges
 * - Duties and Taxes.
 *
 * This container is used for Who Pays What functionality
 */
export interface PaymentDetails {
  /**
   * Either BillShipper, BillReceiver, BillThirdParty, or ConsigneeBilledIndicator must be present but no more than one can be present.
   */
  ShipmentCharge: ShipmentCharge[] | ShipmentCharge;
  /**
   * The presence indicates the payer specified for Transportation Charges will pay transportation charges and any duties that apply to the shipment.
   *
   * The payer specified for Duties and Taxes will pay the VAT (Value-Added Tax) only.
   *
   * The payment method for Transportation charges must be UPS account.
   *
   * The UPS account must be a daily pickup account or an occasional account.
   */
  SplitDutyVATIndicator?: Indicator;
}

/**
 * If Duty and Tax charges are applicable to a shipment and a payer is not specified, the default payer of Duty and Tax charges is Bill to Receiver.
 *
 * There will be no default payer of Duty and Tax charges for DDU and DDP service.
 *
 * **NOTE: ShipmentCharge can either be an Array or 2 objects or a single object.**
 */
export interface ShipmentCharge {
  Type: ShipmentChargeType;
  BillShipper?: BillShipper;
  /**
   * For a return shipment, Bill Receiver is invalid for Transportation charges.
   */
  BillReceiver?: BillReceiver;
  BillThirdParty?: BillThirdParty;
  /**
   * This billing option is valid for a shipment charge type of Transportation only.
   *
   * Only applies to US/PR and PR/US shipment origins and destination.
   */
  ConsigneeBilledIndicator?: Indicator;
}

export interface BillShipper {
  /** Must be the same UPS account number as the one provided in Shipper/ShipperNumber */
  AccountNumber: string;
}

export interface BillReceiver {
  /**
   * The UPS account number.
   *
   * The account must be a valid UPS account number that is active.
   *
   * For US, PR and CA accounts, the account must be a daily pickup account, an occasional account, a customer B.I.N account, or a dropper shipper account.
   * All other accounts must be either a daily pickup account, an occasional account, a drop shipper account, or a nonshipping account.
   */
  AccountNumber: string;
  Address?: BillReceiverAddress;
}

export interface BillReceiverAddress {
  /**
   * The postal code for the UPS account's pickup address.
   * The pickup postal code was entered in the UPS system when the account was set-up.
   */
  PostalCode?: string;
}

export interface BillThirdParty {
  /**
   * The UPS account number.
   *
   * The account must be a valid UPS account number that is active.
   *
   * For US, PR and CA accounts, the account must be a daily pickup account, an occasional account, a customer B.I.N account, or a dropper shipper account.
   * All other accounts must be either a daily pickup account, an occasional account, a drop shipper account, or a nonshipping account.
   */
  AccountNumber: string;
  Address: BillThirdPartyAddress;
}

export interface BillThirdPartyAddress {
  AddressLine?: string[] | string;
  City?: string;
  StateProvinceCode?: string;
  /**
   * The postal code must be the same as the UPS account pickup address postal code.
   *
   * Required for United States and Canadian UPS accounts and/or if the UPS account pickup address has a postal code.
   *
   * If the UPS account's pickup country or territory is US or Puerto Rico, the postal code is 5 or 9 digits.
   *
   * The character '-' may be used to separate the first five digits and the last four digits.
   *
   * If the UPS account's pickup country or territory is CA, the postal code is 6 alphanumeric characters whose format is A#A#A# where A is an uppercase letter and # is a digit.
   */
  PostalCode?: string;
  CountryCode: UpsValidCountryCode;
}

/**
 * Date given to/returned from UPS, always in UTC
 * @example '2016-07-14T12:01:33.999'
 */
export type UpsDate = string;

export enum PickupTypeCode {
  DailyPickup = "01",
  CustomerCounter = "03",
  OneTimePickup = "06",
  LetterCenter = "19",
  AirServiceCenter = "20",
}

export enum CustomerClassificationCode {
  RatesAssociatedWithShipperNumber = "00",
  DailyRates = "01",
  RetailRates = "04",
  RegionalRates = "05",
  GeneralListRates = "06",
  StandardListRates = "53",
}

export interface UpsAddress {
  /**
   * Maximum of 3 lines.
   */
  AddressLine?: string[] | string;
  /**
   * Required if the country or territory does not use postal codes.
   */
  City?: string;
  StateProvinceCode?: string;
  /**
   * Required if the country or territory uses postal codes.
   *
   */
  PostalCode?: string;
  CountryCode: UpsValidCountryCode;
}

export interface GetPackageRating {
  RateRequest: RateRequest;
}

export interface RateRequest {
  Request: Request;
  PickupType?: PickupType;
  CustomerClassification?: CustomerClassification;
  Shipment: Shipment;
}

export interface Request {
  /**
   * The spec's `required` list names RequestOption but defines no such property
   * (the option is the URL's `{requestoption}` segment), while its examples do
   * send it — see docs/ups-api.md.
   */
  RequestOption?: UPSRequestOption;
  TransactionReference?: {
    CustomerContext?: string;
    /** @deprecated Not in the Rating spec. */
    TransactionIdentifier?: string;
  };

  SubVersion?: string;
}

export interface PickupType {
  Code: PickupTypeCode;
  Description?: string;
}

export interface CustomerClassification {
  Code: CustomerClassificationCode;
  Description?: string;
}

export enum CountryCodesISO3166Alpha2 {
  AF = "AF", // "Afghanistan",
  AX = "AX", // "Aland Islands",
  AL = "AL", // "Albania",
  DZ = "DZ", // "Algeria",
  AS = "AS", // "American Samoa",
  AD = "AD", // "Andorra",
  AO = "AO", // "Angola",
  AI = "AI", // "Anguilla",
  AQ = "AQ", // "Antarctica",
  AG = "AG", // "Antigua And Barbuda",
  AR = "AR", // "Argentina",
  AM = "AM", // "Armenia",
  AW = "AW", // "Aruba",
  AU = "AU", // "Australia",
  AT = "AT", // "Austria",
  AZ = "AZ", // "Azerbaijan",
  BS = "BS", // "Bahamas",
  BH = "BH", // "Bahrain",
  BD = "BD", // "Bangladesh",
  BB = "BB", // "Barbados",
  BY = "BY", // "Belarus",
  BE = "BE", // "Belgium",
  BZ = "BZ", // "Belize",
  BJ = "BJ", // "Benin",
  BM = "BM", // "Bermuda",
  BT = "BT", // "Bhutan",
  BO = "BO", // "Bolivia",
  BA = "BA", // "Bosnia And Herzegovina",
  BW = "BW", // "Botswana",
  BV = "BV", // "Bouvet Island",
  BR = "BR", // "Brazil",
  IO = "IO", // "British Indian Ocean Territory",
  BN = "BN", // "Brunei Darussalam",
  BG = "BG", // "Bulgaria",
  BF = "BF", // "Burkina Faso",
  BI = "BI", // "Burundi",
  KH = "KH", // "Cambodia",
  CM = "CM", // "Cameroon",
  CA = "CA", // "Canada",
  CV = "CV", // "Cape Verde",
  KY = "KY", // "Cayman Islands",
  CF = "CF", // "Central African Republic",
  TD = "TD", // "Chad",
  CL = "CL", // "Chile",
  CN = "CN", // "China",
  CX = "CX", // "Christmas Island",
  CC = "CC", // "Cocos (Keeling) Islands",
  CO = "CO", // "Colombia",
  KM = "KM", // "Comoros",
  CG = "CG", // "Congo",
  CD = "CD", // "Congo, Democratic Republic",
  CK = "CK", // "Cook Islands",
  CR = "CR", // "Costa Rica",
  CI = "CI", // "Cote D\"Ivoire",
  HR = "HR", // "Croatia",
  CU = "CU", // "Cuba",
  CY = "CY", // "Cyprus",
  CZ = "CZ", // "Czech Republic",
  DK = "DK", // "Denmark",
  DJ = "DJ", // "Djibouti",
  DM = "DM", // "Dominica",
  DO = "DO", // "Dominican Republic",
  EC = "EC", // "Ecuador",
  EG = "EG", // "Egypt",
  SV = "SV", // "El Salvador",
  GQ = "GQ", // "Equatorial Guinea",
  ER = "ER", // "Eritrea",
  EE = "EE", // "Estonia",
  ET = "ET", // "Ethiopia",
  FK = "FK", // "Falkland Islands (Malvinas)",
  FO = "FO", // "Faroe Islands",
  FJ = "FJ", // "Fiji",
  FI = "FI", // "Finland",
  FR = "FR", // "France",
  GF = "GF", // "French Guiana",
  PF = "PF", // "French Polynesia",
  TF = "TF", // "French Southern Territories",
  GA = "GA", // "Gabon",
  GM = "GM", // "Gambia",
  GE = "GE", // "Georgia",
  DE = "DE", // "Germany",
  GH = "GH", // "Ghana",
  GI = "GI", // "Gibraltar",
  GR = "GR", // "Greece",
  GL = "GL", // "Greenland",
  GD = "GD", // "Grenada",
  GP = "GP", // "Guadeloupe",
  GU = "GU", // "Guam",
  GT = "GT", // "Guatemala",
  GG = "GG", // "Guernsey",
  GN = "GN", // "Guinea",
  GW = "GW", // "Guinea-Bissau",
  GY = "GY", // "Guyana",
  HT = "HT", // "Haiti",
  HM = "HM", // "Heard Island & Mcdonald Islands",
  VA = "VA", // "Holy See (Vatican City State)",
  HN = "HN", // "Honduras",
  HK = "HK", // "Hong Kong",
  HU = "HU", // "Hungary",
  IS = "IS", // "Iceland",
  IN = "IN", // "India",
  ID = "ID", // "Indonesia",
  IR = "IR", // "Iran, Islamic Republic Of",
  IQ = "IQ", // "Iraq",
  IE = "IE", // "Ireland",
  IM = "IM", // "Isle Of Man",
  IL = "IL", // "Israel",
  IT = "IT", // "Italy",
  JM = "JM", // "Jamaica",
  JP = "JP", // "Japan",
  JE = "JE", // "Jersey",
  JO = "JO", // "Jordan",
  KZ = "KZ", // "Kazakhstan",
  KE = "KE", // "Kenya",
  KI = "KI", // "Kiribati",
  KR = "KR", // "Korea",
  KP = "KP", // "North Korea",
  KW = "KW", // "Kuwait",
  KG = "KG", // "Kyrgyzstan",
  LA = "LA", // "Lao People\"s Democratic Republic",
  LV = "LV", // "Latvia",
  LB = "LB", // "Lebanon",
  LS = "LS", // "Lesotho",
  LR = "LR", // "Liberia",
  LY = "LY", // "Libyan Arab Jamahiriya",
  LI = "LI", // "Liechtenstein",
  LT = "LT", // "Lithuania",
  LU = "LU", // "Luxembourg",
  MO = "MO", // "Macao",
  MK = "MK", // "Macedonia",
  MG = "MG", // "Madagascar",
  MW = "MW", // "Malawi",
  MY = "MY", // "Malaysia",
  MV = "MV", // "Maldives",
  ML = "ML", // "Mali",
  MT = "MT", // "Malta",
  MH = "MH", // "Marshall Islands",
  MQ = "MQ", // "Martinique",
  MR = "MR", // "Mauritania",
  MU = "MU", // "Mauritius",
  YT = "YT", // "Mayotte",
  MX = "MX", // "Mexico",
  FM = "FM", // "Micronesia, Federated States Of",
  MD = "MD", // "Moldova",
  MC = "MC", // "Monaco",
  MN = "MN", // "Mongolia",
  ME = "ME", // "Montenegro",
  MS = "MS", // "Montserrat",
  MA = "MA", // "Morocco",
  MZ = "MZ", // "Mozambique",
  MM = "MM", // "Myanmar",
  NA = "NA", // "Namibia",
  NR = "NR", // "Nauru",
  NP = "NP", // "Nepal",
  NL = "NL", // "Netherlands",
  AN = "AN", // "Netherlands Antilles",
  NC = "NC", // "New Caledonia",
  NZ = "NZ", // "New Zealand",
  NI = "NI", // "Nicaragua",
  NE = "NE", // "Niger",
  NG = "NG", // "Nigeria",
  NU = "NU", // "Niue",
  NF = "NF", // "Norfolk Island",
  MP = "MP", // "Northern Mariana Islands",
  NO = "NO", // "Norway",
  OM = "OM", // "Oman",
  PK = "PK", // "Pakistan",
  PW = "PW", // "Palau",
  PS = "PS", // "Palestinian Territory, Occupied",
  PA = "PA", // "Panama",
  PG = "PG", // "Papua New Guinea",
  PY = "PY", // "Paraguay",
  PE = "PE", // "Peru",
  PH = "PH", // "Philippines",
  PN = "PN", // "Pitcairn",
  PL = "PL", // "Poland",
  PT = "PT", // "Portugal",
  PR = "PR", // "Puerto Rico",
  QA = "QA", // "Qatar",
  RE = "RE", // "Reunion",
  RO = "RO", // "Romania",
  RU = "RU", // "Russian Federation",
  RW = "RW", // "Rwanda",
  BL = "BL", // "Saint Barthelemy",
  SH = "SH", // "Saint Helena",
  KN = "KN", // "Saint Kitts And Nevis",
  LC = "LC", // "Saint Lucia",
  MF = "MF", // "Saint Martin",
  PM = "PM", // "Saint Pierre And Miquelon",
  VC = "VC", // "Saint Vincent And Grenadines",
  WS = "WS", // "Samoa",
  SM = "SM", // "San Marino",
  ST = "ST", // "Sao Tome And Principe",
  SA = "SA", // "Saudi Arabia",
  SN = "SN", // "Senegal",
  RS = "RS", // "Serbia",
  SC = "SC", // "Seychelles",
  SL = "SL", // "Sierra Leone",
  SG = "SG", // "Singapore",
  SK = "SK", // "Slovakia",
  SI = "SI", // "Slovenia",
  SB = "SB", // "Solomon Islands",
  SO = "SO", // "Somalia",
  ZA = "ZA", // "South Africa",
  GS = "GS", // "South Georgia And Sandwich Isl.",
  ES = "ES", // "Spain",
  LK = "LK", // "Sri Lanka",
  SD = "SD", // "Sudan",
  SR = "SR", // "Suriname",
  SJ = "SJ", // "Svalbard And Jan Mayen",
  SZ = "SZ", // "Swaziland",
  SE = "SE", // "Sweden",
  CH = "CH", // "Switzerland",
  SY = "SY", // "Syrian Arab Republic",
  TW = "TW", // "Taiwan",
  TJ = "TJ", // "Tajikistan",
  TZ = "TZ", // "Tanzania",
  TH = "TH", // "Thailand",
  TL = "TL", // "Timor-Leste",
  TG = "TG", // "Togo",
  TK = "TK", // "Tokelau",
  TO = "TO", // "Tonga",
  TT = "TT", // "Trinidad And Tobago",
  TN = "TN", // "Tunisia",
  TR = "TR", // "Turkey",
  TM = "TM", // "Turkmenistan",
  TC = "TC", // "Turks And Caicos Islands",
  TV = "TV", // "Tuvalu",
  UG = "UG", // "Uganda",
  UA = "UA", // "Ukraine",
  AE = "AE", // "United Arab Emirates",
  GB = "GB", // "United Kingdom",
  US = "US", // "United States",
  UM = "UM", // "United States Outlying Islands",
  UY = "UY", // "Uruguay",
  UZ = "UZ", // "Uzbekistan",
  VU = "VU", // "Vanuatu",
  VE = "VE", // "Venezuela",
  VN = "VN", // "Vietnam",
  VG = "VG", // "Virgin Islands, British",
  VI = "VI", // "Virgin Islands, U.S.",
  WF = "WF", // "Wallis And Futuna",
  EH = "EH", // "Western Sahara",
  YE = "YE", // "Yemen",
  ZM = "ZM", // "Zambia",
  ZW = "ZW", // "Zimbabwe"
}

/** Alternate Delivery Address information is required for UPS Access Point Delivery. */
export enum ShipmentIndicationTypeCode {
  /** Hold for Pickup at UPS Access Point */
  HoldForPickupUpsAccessPoint = "01",
  /** UPS Access Point™ Delivery */
  UpsAccessPointDelivery = "02",
}

export enum ServiceCode {
  NextDayAir = "01",
  SecondDayAir = "02",
  Ground = "03",
  ThreeDaySelect = "12",
  NextDayAirSaver = "13",
  NextDayAirEarly = "14",
  SecondDayAirAM = "59",
  WorldwideExpress = "07",
  WorldwideExpedited = "08",
  Standard = "11",
  UPSHeavyGoods = "75",
  WorldwideExpressPlus = "54",
  Saver = "65",
  UPSWorldwideExpressFreight = "96",
  UPSWorldwideExpressFreightMidday = "71",
}

export enum ShipmentTotalWeightUnitOfMeasurementCode {
  KGS = "KGS",
  LBS = "LBS",
}

export interface Shipment {
  OriginRecordTransactionTimestamp?: UpsDate;
  Shipper: Shipper;
  ShipTo: ShipTo;
  ShipFrom?: ShipFrom;
  AlternateDeliveryAddress?: AlternateDelivery;
  ShipmentIndicationType?: ShipmentIndicationType | ShipmentIndicationType[];
  PaymentDetails?: PaymentDetails;
  FRSPaymentInformation?: FRSPaymentInformation;
  FreightShipmentInformation?: FreightShipmentInformation;
  GoodsNotInFreeCirculationIndicator?: Indicator /** This indicator is invalid for a package type of UPS Letter and Documents Only. */;
  Service?: Service;
  /**
   * Total number of pieces in all pallets.
   *
   * Required for UPS Worldwide Express Freight and UPS Worldwide Express Freight Midday shipments.
   * */
  NumOfPieces?: string;
  /** ShipmentTotalWeight is required for all international orders.*/
  ShipmentTotalWeight?: ShipmentTotalWeight;
  DocumentsOnlyIndicator?: Indicator /** Not applicable for FRS rating requests. */;
  Package: Package[];
  ShipmentServiceOptions?: ShipmentServiceOptions;
  ShipmentRatingOptions?: ShipmentRatingOptions;
  InvoiceLineTotal?: InvoiceLineTotal;
  RatingMethodRequestedIndicator?: Indicator;
  TaxInformationIndicator?: Indicator;
  PromotionalDiscountInformation?: PromotionalDiscountInformation;
  DeliveryTimeInformation?: DeliveryTimeInformation;
  MasterCartonIndicator?: Indicator;
  WWEShipmentIndicator?: Indicator;
  ShipmentCharges?: ShipmentCharges;
}

/** @deprecated Not in the Rating spec; use `PaymentDetails`. */
export interface ShipmentCharges {
  BillShipper: {
    AccountNumber: string;
  };
}

export interface DeliveryTimeInformation {
  PackageBillType: PackageBillType;
  Pickup?: Pickup;
  ReturnContractServices?: UpsRatingReturnContractService[];
}

export interface UpsRatingReturnContractService {
  /** "01" is Heavy Goods; any other code is ignored. */
  Code: string;
  Description?: string;
}

export interface Pickup {
  Date: string; //YYYYMMDD
  Time?: string; //Military Time Format HHMMSS or HHMM
}

export enum PackageBillType {
  /**Document Only */
  "02" = "02",
  /**Non-document */
  "03" = "03",
  /** WWEFPallet */
  "04" = "04",
  /** DomesticPallet */
  "07" = "07",
}

export interface PromotionalDiscountInformation {
  PromoCode: string;
  PromoAliasCode: string;
}

export interface InvoiceLineTotal {
  CurrencyCode: CurrencyCodes;
  MonetaryValue: string;
}

export interface ShipmentRatingOptions {
  NegotiatedRatesIndicator?: string | null;
  FRSShipmentIndicator?: string | null;
  UserLevelDiscountIndicator?: string | null;
  TPFCNegotiatedRatesIndicator?: string | null;
  RateChartIndicator?: string | null;
}

export interface Shipper {
  /** Name of the customer or company */
  Name?: string;
  AttentionName?: string;
  /**
   * Required to get negotiated rates.
   *
   * Cannot be used when requesting UserLevelDiscount
   */
  ShipperNumber?: string;
  /**
   * If there is no ShipFrom address, this will be used.
   */
  Address: UpsRatingRequiredLineAddress;
}

export interface ShipTo {
  Name?: string;
  AttentionName?: string;
  Address: ShipToAddress;
}

export interface ShipFrom {
  Address: UpsAddress;
  Name?: string;
  AttentionName?: string;
  /** @deprecated Not in the Rating spec; ShipFrom has no such field. */
  ShipperNumber?: string;
}

/**
 * Applies for deliveries to UPS Access Point™ locations.
 *
 * Required for the following ShipmentIndicationType values:
 * - 01 - Hold for Pickup at UPS Access Point™
 * - 02 - UPS Access Point™ Delivery
 */
export interface AlternateDelivery {
  Name?: string;
  Address: AlternateDeliveryAddress;
}

export interface ShipmentIndicationType {
  Code: ShipmentIndicationTypeCode;
  Description?: string;
}

/** Shipper and ShipTo require `AddressLine`; ShipFrom and the others do not. */
export interface UpsRatingRequiredLineAddress extends UpsAddress {
  AddressLine: string[] | string;
}

export interface ShipToAddress extends UpsRatingRequiredLineAddress {
  ResidentialAddressIndicator?: string;
}

export interface AlternateDeliveryAddress extends UpsAddress {
  /** @deprecated Not in the Rating spec; the field is `AddressLine`. */
  AddressLines?: string[];
  ResidentialAddressIndicator?: Indicator;
  /**
   * Not valid with Shipment Indication Types:
   * - 01 Hold forPickup at UPS Access Point
   * - 02 UPS Access Point™ Delivery
   */
  POBoxIndicator?: Indicator;
}

/**
 * Only valid with RequestOption = Rate for both Small package and GFP Rating requests
 */
export interface Service {
  Code: ServiceCode;
  Description?: string;
}

/**
 * This container is only applicable for "ratetimeintransit" and "shoptimeintransit" request options.
 * Required for all international shipments when retreiving time in transit information, including letters and documents shipments.
 */
export interface ShipmentTotalWeight {
  UnitOfMeasurement: ShipmentTotalWeightUnitOfMeasurement;
  Weight: string;
}

export interface ShipmentTotalWeightUnitOfMeasurement {
  Code: ShipmentTotalWeightUnitOfMeasurementCode;
  Description?: string;
}

export interface ShipmentServiceOptions {
  GlobalCheckoutIndicator?: Indicator;
  SaturdayPickupIndicator?: Indicator;
  SaturdayDeliveryIndicator?: Indicator;
  SundayDeliveryIndicator?: Indicator;
  /** Shop only; overrides the Saturday/Sunday indicators. 1 weekday+Sat, 2 weekday+Sun, 3 all. */
  AvailableServicesOption?: "1" | "2" | "3";
  AccessPointCOD?: AccessPointCOD;
  DeliverToAddresseeOnlyIndicator?: Indicator;
  DirectDeliveryOnlyIndicator?: Indicator;
  COD?: COD;
  DeliveryConfirmation?: DeliveryConfirmation;
  ReturnOfDocumentIndicator?: Indicator;
  UPScarbonneutralIndicator?: Indicator;
  CertificateOfOriginIndicator?: Indicator;
  PickupOptions?: PickupOptions;
  DeliveryOptions?: DeliveryOptions;
  RestrictedArticles?: RestrictedArticles;
  ShipperExportDeclarationIndicator?: Indicator;
  CommercialInvoiceRemovalIndicator?: Indicator;
  ImportControl?: ImportControl;
  ReturnService?: ReturnService;
  VerifiedDelivery?: UpsRatingVerifiedDelivery;
  SDLShipmentIndicator?: Indicator;
  EPRAIndicator?: Indicator;
  /** 01 White Glove, 02 Room of Choice, 03 Installation; needs a Heavy Goods contract. */
  InsideDelivery?: "01" | "02" | "03";
  ItemDisposalIndicator?: Indicator;
}

export interface UpsRatingVerifiedDelivery {
  /** "2" is VDS, a shipper-generated PIN — the only documented value. */
  SecurePINType: string;
}

export interface ReturnService {
  Code: ReturnServiceCodes;
  Description?: string;
}

export enum ReturnServiceCodes {
  UPSPrintAndMailReturnLabel = "2",
  UPSOneAttemptReturnLabel = "3",
  UPSThreeAttemptReturnLabel = "5",
  UPSElectronicReturnLabel = "8",
  UPSPrintReturnLabel = "9",
  UPSExchangePrintReturnLabel = "10",
  UPSPackAndCollectService1AttemptBox1 = "11",
  UPSPackAndCollectService1AttemptBox2 = "12",
  UPSPackAndCollectService1AttemptBox3 = "13",
  UPSPackAndCollectService1AttemptBox4 = "14",
  UPSPackAndCollectService1AttemptBox5 = "15",
  UPSPackAndCollectService3AttemptBox1 = "16",
  UPSPackAndCollectService3AttemptBox2 = "17",
  UPSPackAndCollectService3AttemptBox3 = "18",
  UPSPackAndCollectService3AttemptBox4 = "19",
  UPSPackAndCollectService3AttemptBox5 = "20",
}

export interface ImportControl {
  Code: ImportControlCodes;
  Description?: string;
}

export enum ImportControlCodes {
  ImportControlPrintAndMail = "01",
  ImportControlOneAttempt = "02",
  ImportControlThreeAttempt = "03",
  ImportControlElectronicLabel = "04",
  ImportControlPrintLabel = "05",
}

export interface RestrictedArticles {
  AlcoholicBeveragesIndicator?: Indicator;
  DiagnosticSpecimensIndicator?: Indicator;
  PerishablesIndicator?: Indicator;
  PlantsIndicator?: Indicator;
  SeedsIndicator?: Indicator;
  SpecialExceptionsIndicator?: Indicator;
  TobaccoIndicator?: Indicator;
  ECigarettesIndicator?: Indicator;
  HempCBDIndicator?: Indicator;
  /** @deprecated Belongs on `ShipmentServiceOptions`, not here. */
  ShipperExportDeclarationIndicator?: Indicator;
  /** @deprecated Belongs on `ShipmentServiceOptions`, not here. */
  CommercialInvoiceRemovalIndicator?: Indicator;
}

export interface DeliveryOptions {
  LiftGateAtDeliveryIndicator?: Indicator;
  DropOffAtUPSFacilityIndicator?: Indicator;
}
export interface PickupOptions {
  LiftGateAtPickupIndicator?: Indicator;
  HoldForPickupIndicator?: Indicator;
}

/** Response Types */
export interface RateResponseObject {
  status: number;
  statusText: string;
  headers: unknown;
  config: unknown;
  request: unknown;
  data: RateResponse;
}
export interface RateResponse {
  Response: UpsRatingResponse;
  RatedShipment: RatedShipment[];
}

export interface UpsRatingResponse {
  ResponseStatus: UpsRatingCodeDescription;
  Alert?: UpsRatingCodeDescription[];
  AlertDetail?: UpsRatingAlertDetail[];
  TransactionReference?: {
    CustomerContext?: string;
  };
}

export interface UpsRatingCodeDescription {
  Code: string;
  Description: string;
}

export interface UpsRatingAlertDetail extends UpsRatingCodeDescription {
  ElementLevelInformation?: {
    /** H header, S shipment, P package, C commodity. */
    Level: string;
    /** Only returned when Level is P or C. */
    ElementIdentifier?: { Code: string; Value: string }[];
  };
}

export interface UpsRatingMoney {
  CurrencyCode: string;
  MonetaryValue: string;
}

export interface UpsRatingUnitOfMeasurement {
  Code: string;
  Description: string;
}

export interface UpsRatingWeight {
  UnitOfMeasurement: UpsRatingUnitOfMeasurement;
  Weight: string;
}

export interface UpsRatingItemizedCharge extends UpsRatingMoney {
  Code: string;
  Description?: string;
  SubType?: string;
}

export interface UpsRatingTaxCharge {
  Type: string;
  MonetaryValue: string;
}

export interface UpsRatingRateModifier {
  /** Example: "ORM". */
  ModifierType: string;
  ModifierDesc: string;
  /** Signed, e.g. "-1.00". */
  Amount: string;
}

export enum UpsRateMethod {
  ShipmentLevel = "01",
  PackageLevel = "02",
}

export enum UpsRateBillableWeightMethod {
  ShipmentBillableWeight = "01",
  PackageBillableWeight = "02",
}

/**
 * For v2409 UPS always returns the repeating containers as arrays; the spec says
 * earlier versions collapse a single element into a bare object, which these
 * types do not model.
 */
export interface RatedShipment {
  Disclaimer?: UpsRatingCodeDescription[];
  Service: { Code: string; Description?: string };
  /** 1, 3 or 4 for US/Alaska/Hawaii origins; 1, 5 or 6 elsewhere. */
  RateChart?: string;
  /** Only returned for subversion 2409 or later. */
  Zone?: string;
  RatedShipmentAlert?: UpsRatingCodeDescription[];
  /** Only returned when `RatingMethodRequestedIndicator` was sent. */
  BillableWeightCalculationMethod?: UpsRateBillableWeightMethod;
  /** Only returned when `RatingMethodRequestedIndicator` was sent. */
  RatingMethod?: UpsRateMethod;
  BillingWeight: UpsRatingWeight;
  TransportationCharges: UpsRatingMoney;
  BaseServiceCharge?: UpsRatingMoney;
  ItemizedCharges?: UpsRatingItemizedCharge[];
  /** Ground Freight Pricing only. */
  FRSShipmentData?: UpsRatingFRSShipmentData;
  ServiceOptionsCharges: UpsRatingMoney;
  TaxCharges?: UpsRatingTaxCharge[];
  TotalCharges: UpsRatingMoney;
  TotalChargesWithTaxes?: UpsRatingMoney;
  NegotiatedRateCharges?: UpsRatingNegotiatedRateCharges;
  RatedPackage: UpsRatingRatedPackage[];
  /** Only with a `*timeintransit` option and `DeliveryTimeInformation`. */
  TimeInTransit?: UpsRatingTimeInTransit;
  GuaranteedDelivery?: UpsRatingGuaranteedDelivery;
  RoarRatedIndicator?: string;
}

export interface UpsRatingFRSShipmentData {
  TransportationCharges: {
    GrossCharge: UpsRatingMoney;
    DiscountAmount: UpsRatingMoney;
    DiscountPercentage: string;
    NetCharge: UpsRatingMoney;
  };
  FreightDensityRate?: { Density: string; TotalCubicFeet: string };
  HandlingUnits?: {
    Quantity: string;
    Type: { Code: string; Description?: string };
    Dimensions: {
      UnitOfMeasurement: UpsRatingUnitOfMeasurement;
      Length: string;
      Width: string;
      Height: string;
    };
    AdjustedHeight?: {
      Value: string;
      UnitOfMeasurement: UpsRatingUnitOfMeasurement;
    };
  }[];
}

export interface UpsRatingNegotiatedRateCharges {
  BaseServiceCharge?: UpsRatingMoney[];
  RateModifier?: UpsRatingRateModifier[];
  ItemizedCharges?: UpsRatingItemizedCharge[];
  TaxCharges?: UpsRatingTaxCharge[];
  TotalCharge: UpsRatingMoney;
  TotalChargesWithTaxes?: UpsRatingMoney;
}

export interface UpsRatingRatedPackage {
  BaseServiceCharge?: UpsRatingMoney;
  TransportationCharges?: UpsRatingMoney;
  ServiceOptionsCharges?: UpsRatingMoney;
  TotalCharges?: UpsRatingMoney;
  Weight?: string;
  BillingWeight?: UpsRatingWeight;
  /** Only for UPS Worldwide Express Freight (Midday) with dry ice or an oversize pallet. */
  Accessorial?: { Code: string; Description?: string }[];
  ItemizedCharges?: UpsRatingItemizedCharge[];
  NegotiatedCharges?: {
    RateModifier?: UpsRatingRateModifier[];
    ItemizedCharges?: UpsRatingItemizedCharge[];
  };
  SimpleRate?: { Code: string };
  RateModifier?: UpsRatingRateModifier[];
}

export interface UpsRatingTimeInTransit {
  /** YYYYMMDD */
  PickupDate: string;
  DocumentsOnlyIndicator?: string;
  PackageBillType?: string;
  ServiceSummary: UpsRatingServiceSummary;
  /** 01 dutiable through 09 section 321 low value; international requests. */
  AutoDutyCode?: string;
  Disclaimer?: string;
}

export interface UpsRatingServiceSummary {
  Service: { Description?: string };
  GuaranteedIndicator?: string;
  Disclaimer?: string;
  EstimatedArrival: {
    Arrival: { Date: string; Time?: string };
    BusinessDaysInTransit: string;
    Pickup: { Date: string; Time?: string };
    DayOfWeek: string;
    CustomerCenterCutoff?: string;
    DelayCount?: string;
    HolidayCount?: string;
    RestDays?: string;
    TotalTransitDays?: string;
  };
  /** "1" available at extra charge; "0" unavailable or free. */
  SaturdayDelivery?: string;
  SaturdayDeliveryDisclaimer?: string;
  /** "1" available at extra charge; "0" unavailable or free. */
  SundayDelivery?: string;
  SundayDeliveryDisclaimer?: string;
}

export interface UpsRatingGuaranteedDelivery {
  BusinessDaysInTransit?: string;
  DeliveryByTime?: string;
  ScheduledDeliveryDate?: string;
}
