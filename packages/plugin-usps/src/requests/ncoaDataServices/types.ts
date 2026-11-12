export interface UspsNcoaChangeOfAddressSearchRequest {
  CRID: UspsNcoaCRID;
  IPAgreementID: UspsNcoaIPAgreementID;
  /** Selects the action; the schema is a pattern, `^(MailerInsert|Search)$`. */
  requestType: "MailerInsert" | "Search" | null;
  mailerListID?: UspsNcoaMailerListID;
  /**
   * For `MailerInsert`: mailerCompany, mailerID or CRID, mailerNAICSCode,
   * mailerCompanyAddress/City/State/ZIP and activeThroughDate are required.
   * The spec marks none of them required in the schema.
   */
  mailerList?: {
    mailerCompany?: string | null;
    mailerID?: string | null;
    CRID?: UspsNcoaCRID;
    mailerNAICSCode?: string | null;
    mailerCompanyAddress?: string | null;
    mailerCompanyCity?: string | null;
    mailerCompanyState?: string | null;
    mailerCompanyZIP?: string | null;
    mailerCompanyAddon?: string | null;
    mailerCompanyUrb?: string | null;
    mailerCompanyPhone?: string | null;
    mailerCompanyUrl?: string | null;
    mailerContactName?: string | null;
    mailerContactAddr?: string | null;
    mailerContactCity?: string | null;
    mailerContactState?: string | null;
    mailerContactZIP?: string | null;
    mailerContactAddon?: string | null;
    mailerContactUrbanization?: string | null;
    mailerContactPhone?: string | null;
    activeThroughDate?: string | null;
    balaMailerID?: string | null;
    balaNAICSCode?: string | null;
    balaCompanyName?: string | null;
    balaCompanyAddress?: string | null;
    balaCompanyCity?: string | null;
    balaCompanyState?: string | null;
    balaCompanyZIP?: string | null;
    balaCompanyAddon?: string;
    balaCompanyUrbanization?: string | null;
    balaCompanyPhone?: string | null;
    balaCompanyUrl?: string | null;
    balaContactName?: string | null;
    balaContactAddress?: string | null;
    balaContactCity?: string | null;
    balaContactState?: string | null;
    balaContactZIP?: string | null;
    balaContactAddon?: string | null;
    balaContactUrbanization?: string | null;
    balaContactPhone?: string | null;
    balaBrokerIndicator?: string | null;
  };
  nameAddresses?: UspsNcoaNameAddress[];
  numberOfMonths?: number;
}

export interface UspsNcoaNameAddress {
  fullName?: string | null;
  streetAddress?: UspsNcoaStreetAddress;
  lastLine?: string | null;
  urbanization?: UspsNcoaUrbanization;
  recordID?: string | null;
}

export interface UspsNcoaMailerResponse {
  numberRecordsAdded?: number;
}

export interface UspsNcoaRecordsResponse {
  numberOfMonths?: number;
  recordCount?: number;
  COABeyondMonthsCount?: number;
  COAMatchCount?: number;
  COANoMatchCount?: number;
  COAFoundCount?: number;
  COANotAllowedMatchCount?: number;
  records?: UspsNcoaRecords[];
}

export interface UspsNcoaRecords {
  changeOfAddressInformation: {
    errorCode?: string;
    errorDescription?: string;
    beyondMonths?: string;
    returnCode?: string;
    moveEffectiveDate?: string;
    moveType?: "B" | "F" | "I";
    origFullName?: string;
    matchedBusinessName?: string;
    matchedFirstName?: string;
    matchedLastName?: string;
    matchedSuffixName?: string;
    middleNameTwoChars?: string;
  };
  oldAddressInformation: UspsNcoaAddressObject;
  newAddressInformation?: UspsNcoaAddressObject;
}

export interface UspsNcoaAddressObject {
  returnCode: string | null;
  returnCodeText?: string;
  footnotes?: string | null;
  address: UspsNcoaDomesticAddress;
  countyName?: string;
  carrierRoute?: string | null;
  recordType?: string | null;
  DPVConfirmation?: string | null;
  DPVBusiness?: string | null;
  DPVCMRA?: string | null;
  DPVDrop?: string | null;
  DPVEducational?: string | null;
  DPVDropCount?: string | null;
  DPVLACS?: string | null;
  DPVNoDoorDelivery?: string | null;
  DPVNostatReasonCode?: string | null;
  DPVNostatReasonCodeDesc?:
    | "INTERNAL_DROP_ADDRESS"
    | "CDS_NOSTAT"
    | "CMZ_NOSTAT"
    | "REGULAR_NOSTAT"
    | "SECONDARY_REQUIRED";
  DPVSeasonal?: string | null;
  DPVThrowback?: string | null;
  DPVNoSecureLocation?: string | null;
  DPVVacant?: string | null;
  DPVNostat?: string | null;
  DPVNonDeliveryDaysFlag?: string | null;
  DPVNonDeliveryDaysValues?: string | null;
  DPVCurbDelivery?: string | null;
  DPVNDCBUDelivery?: string | null;
  DPVCentralBoxDelivery?: string | null;
  DPVOtherDelivery?: string | null;
  DPVDeliveryType?: string | null;
  DPVEnhancedConfirmation?: string | null;
  DPVFootnotes?: string | null;
  DPVPBSA?: string | null;
  DPVFalseConfirmation?: string | null;
  DPVUsageCode?: "A" | "B" | "C" | "D" | "G" | " ";
  foreign1?: string | null;
  foreign2?: string | null;
  foreign3?: string | null;
  suiteLinkIndicator?: string | null;
  LACSLinkIndicator?: string | null;
  LACSLinkReturnCode?: string | null;
  postOfficeCity?: string;
  postOfficeState?: string;
  countyNumber?: string;
  autoZoneIndicator?: "A" | "B" | "C" | "D";
  miscLine?: string;
  ZIP5Valid?: "Y" | "N";
  POBoxOnlyZIP?: "Y" | "N";
  defaultFlag?: "Y" | "N";
  matchedPrimaryNumber?: string;
  matchedSecondaryNumber?: string;
  secondaryInfo?: string;
  parsedPMBDesignator?: string;
  parsedPMBNumber?: string;
  financeNumber?: string;
  baseAlternateCode?: "A" | "B";
  eLOTCode?: "A" | "D";
  eLOTNumber?: string;
  electricVehicleRoute?: string | null;
}

export interface UspsNcoaDomesticAddress {
  streetAddress?: string | null;
  streetAddressAbbreviation?: string;
  secondaryAddress?: string;
  lastline?: string | null;
  urbanization?: UspsNcoaUrbanization;
  city?: string | null;
  cityAbbreviation?: string;
  stateAbbr?: string | null;
  ZIPCode?: string | null;
  ZIPPlus4?: string | null;
  deliveryPoint?: string | null;
}

export type UspsNcoaStreetAddress = string | null;

export type UspsNcoaCRID = string;

export type UspsNcoaIPAgreementID = string;

export type UspsNcoaMailerListID = string;

export type UspsNcoaUrbanization = string | null;

/**
 * HTTP 200 is a `RecordsResponse` (`requestType` `Search`); 201 is a
 * `MailerResponse` (`MailerInsert`). The status is not returned, so tell them
 * apart by which fields are present.
 */
export type UspsNcoaSearchResponse =
  UspsNcoaRecordsResponse | UspsNcoaMailerResponse;
