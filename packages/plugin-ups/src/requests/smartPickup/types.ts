export interface UpsSmartPickupRequestV1 {
  SmartPickupRequest: {
    Action: "I" | "A" | "U";
    AccountInfo: UpsSmartPickupAccountInfoV1;
    SmartPickupTrigger?: UpsSmartPickupTriggerV1;
    NotificationIndicator?: UpsSmartPickupNotificationIndicatorV1;
  };
}

export interface UpsSmartPickupResponseV1 {
  SmartPickupResponse: {
    Response: UpsSmartPickupCommonResponseV1;
    SmartPickupTrigger: UpsSmartPickupTriggerV1;
    NotificationIndicator: UpsSmartPickupNotificationIndicatorV1;
  };
}

export interface UpsSmartPickupViewPickupInfoRequestV1 {
  ViewPickupInfoRequest: {
    Locale: UpsSmartPickupLocaleV1;
    AccountInfo: UpsSmartPickupAccountInfoV1;
  };
}

export interface UpsSmartPickupViewPickupInfoResponseV1 {
  ViewPickupInfoResponse: UpsSmartPickupPickupInfoResponseV1 & {
    PickUpInfo?: UpsSmartPickupPickupInfoV1 & {
      PickUpDate: {
        PickUpDay: "01" | "02" | "03" | "04" | "05";
      };
    };
    ContactInfo: UpsSmartPickupAddressV1;
    PickUpTypeCode?: "02" | "08";
  };
}

export interface UpsSmartPickupUpdatePickupInfoRequestV1 {
  UpdatePickupInfoRequest: UpsSmartPickupAddressV1 & {
    Locale: UpsSmartPickupLocaleV1;
    AccountInfo: UpsSmartPickupAccountInfoV1;
    PickUpTypeCode: "02" | "08";
    PickUpInfo?: UpsSmartPickupPickupInfoV1;
  };
}

export interface UpsSmartPickupUpdatePickupInfoResponseV1 {
  UpdatePickupInfoResponse: UpsSmartPickupPickupInfoResponseV1;
}

export interface UpsSmartPickupAccountInfoV1 {
  /** What every request example in UPS's OpenAPI spec sends, and the response schema declares. */
  AccountNumber?: UpsSmartPickupAccountNumberV1;
  /** The request schema's own spelling, a typo; both are accepted — docs/ups-api.md#smart-pickup-account-key */
  AccountNmber?: UpsSmartPickupAccountNumberV1;
  CountryCode?: UpsSmartPickupCountryCodeV1;
}

export type UpsSmartPickupTriggerV1 = "01" | "02";

export type UpsSmartPickupNotificationIndicatorV1 = "01" | "02";

export interface UpsSmartPickupCommonResponseV1 {
  ResponseStatus: {
    Code: "1";
    Description: string;
  };
  Alert: {
    Code: string;
    Description: string;
  };
  TransactionReference?: {
    // The CustomerContext Information which will be echoed during response.
    CustomerContext: string;
    // The Unique TransactionIdentifier Information for that transaction.
    TransactionIdentifier: string;
  };
}

export interface UpsSmartPickupLocaleV1 {
  LanguageCode: string;
  CountryCode: UpsSmartPickupCountryCodeV1;
}

export interface UpsSmartPickupPickupInfoResponseV1 {
  Response: UpsSmartPickupCommonResponseV1;
  AccountNumber?: string;
  PickUpNotifyTime?: UpsSmartPickupTimeV1;
  WeekEndPickUpNotifyTime?: UpsSmartPickupTimeV1;
  SundayPickUpNotifyTime?: UpsSmartPickupTimeV1;
  PickUpPendingStatusIndicator?: UpsSmartPickupPendingStatusIndicatorV1;
}

export interface UpsSmartPickupPickupInfoV1 {
  PickupPoint: UpsSmartPickupPickupPointV1;
  PickUpTime: UpsSmartPickupPickupTimeV1;
  WeekendServiceTerritoryIndicator?: "N" | "Y";
  // Weekend pickup Information. Available when WeekendServiceTerritoryIndicator is populated and PickupTypeCode is **02**.
  WeekendPickupInformation?: {
    DeliveryOptions?: "01" | "02";
    PickUpDate: {
      WeekEndPickUpDay: "01" | "02";
    }[];
    PickupPoint: UpsSmartPickupPickupPointV1;
    PickUpTime: UpsSmartPickupPickupTimeV1;
  };
}

export interface UpsSmartPickupAddressV1 {
  Address: {
    CompanyName?: string;
    StreetName: string;
    StreetNumber?: string;
    StreetType?: string;
    StreetPrefix?: string;
    StreetSuffix?: string;
    City?: string;
    State?: string;
    CountryCode?: UpsSmartPickupCountryCodeV1;
    PostalCode?: string;
    PostalCodeExtension?: string;
    RoomSuite?: string;
    // Additional address information. Not applicable for US, CA, and PR.
    AddressLine2?: string;
    // Additional address information. Not applicable for US, CA, and PR.
    AddressLine3?: string;
  };
}

export type UpsSmartPickupAccountNumberV1 = string;

export type UpsSmartPickupCountryCodeV1 = string;

export type UpsSmartPickupTimeV1 = string;

export type UpsSmartPickupPendingStatusIndicatorV1 = string;

export type UpsSmartPickupPickupPointV1 =
  | "001"
  | "002"
  | "003"
  | "004"
  | "005"
  | "006"
  | "007"
  | "008"
  | "009"
  | "010"
  | "011"
  | "012"
  | "013"
  | "014";

export interface UpsSmartPickupPickupTimeV1 {
  EarliestTime: UpsSmartPickupTimeV1;
  LatestTime: UpsSmartPickupTimeV1;
  PreferredTime: UpsSmartPickupTimeV1;
}
