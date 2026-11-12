export type UpsPickupNotificationAccountPickupGetResponse =
  UpsPickupNotificationBaseResponse & {
    payload?: ({
      accountNumber?: UpsPickupNotificationAccountNumber;
    } & UpsPickupNotificationVersionNumber &
      UpsPickupNotificationAccountPickupPreference)[];
  };

export interface UpsPickupNotificationAccountPickupPreference {
  // Preferred locale for account pickup. Format follows <a href="https://www.iso.org/iso-639-language-code.html" target="_blank">ISO 639M</a> language code and region code combination.
  locale: string;
  emails?: string[];
  notificationIndicators: UpsPickupNotificationNotificationIndicators;
}

export type UpsPickupNotificationAccountPickupModifyResponse =
  UpsPickupNotificationBaseResponse & {
    payload?: {
      accountNumber?: UpsPickupNotificationAccountNumber;
    } & UpsPickupNotificationVersionNumber &
      UpsPickupNotificationAccountPickupPreference;
  };

export interface UpsPickupNotificationBaseResponse {
  statusMessage: string;
  timeStamp: string;
}

export type UpsPickupNotificationAccountNumber = string;

export interface UpsPickupNotificationVersionNumber {
  versionNumber?: number;
}

export interface UpsPickupNotificationNotificationIndicators {
  email?: UpsPickupNotificationCommonNotificationIndicators;
  sms?: UpsPickupNotificationCommonNotificationIndicators;
}

export interface UpsPickupNotificationCommonNotificationIndicators {
  dayOfPickupInd: boolean;
  dayBeforePickupInd: boolean;
  preArrivalInd: boolean;
  pickupUpdateInd: boolean;
  pickupCompleteInd: boolean;
  pickupCancellationInd: boolean;
  enrollmentConfirmationInd: boolean;
  smartPickupCutOffNotificationTimeInd: boolean;
  smartPickupTriggerWarningInd: boolean;
  smartPickupTriggerNotificationInd: boolean;
  smartPickupTriggerCancellationInd: boolean;
  pickupIncompleteNotificationInd: boolean;
  pickupDelayedInd: boolean;
}

export interface UpsPickupNotificationOptions {
  accountNumber: string;
  /** Needed for JWT callers; the spec says it is not required for OAuth2. */
  uuid?: string;
  /** Needed for Auth0 callers only. */
  idToken?: string;
}
