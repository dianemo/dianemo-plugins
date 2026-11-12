export interface UspsAppointment {
  appointmentType?: "PALLET" | "BEDLOAD" | "DROP_AND_PICK" | "SPEEDLINE";
  destinationEntry: "YES" | "NO";
  recurringAppointment?: {
    effectiveStartDate?: string;
    effectiveEndDate?: string;
    appointmentTime?: string;
    dayFrequencyArray?: Array<
      | "DAILY"
      | "SATURDAY"
      | "SUNDAY"
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
    >;
    weekFrequencyArray?: Array<
      | "WEEKLY"
      | "BI_WEEKLY"
      | "FIRST"
      | "SECOND"
      | "THIRD"
      | "FOURTH"
      | "FIFTH"
      | "SIXTH"
    >;
  };
  oneTimeAppointment?: {
    preferredAppointment?: string;
    optionalAppointment?: {
      optionalAppointmentStart?: string;
      optionalAppointmentEnd?: string;
    };
  };
  detailInfo: {
    uspsSummary?: Array<{
      destinationDiscountIndicator?: "YES" | "NO";
      zoneSkippingIndicator?: "YES" | "NO";
      fullServiceIndicator?: "YES" | "NO";
      eInductionIndicator?: "YES" | "NO";
      pallets?: Array<{
        palletPreSortLevel?: Array<{
          uspsContainerInfo?: {
            mailOwnerCRID?: string[];
            mailOwnerID?: string[];
            uspsPublicationID?: string[];
            actualPieceCount?: number;
            containerWeight?: string;
            IMCB?: string[];
            IMCBInfo?: "LINKED" | "SCANNED";
            siblingBarcode?: string[];
            postInductionStatus?: UspsAppointmentPostInductionStatus;
            containerDestination3digitZIP?: string;
            containerDestination5digitZIP?: string;
          };
          containerLevel?: UspsAppointmentContainerLevel;
          count?: number;
        }>;
        count?: number;
        handlingUnitType?:
          | "AIRBOX"
          | "SACKS"
          | "BUNDLES"
          | "MIXED_LENGTH_TRAYS"
          | "1FT_TRAY"
          | "2FT_TRAY"
          | "EMM_TRAY"
          | "FLAT_TUB"
          | "PARCELS";
        palletType?:
          | "AIRBOX"
          | "PALLET"
          | "EIRS_61"
          | "EIRS_61P"
          | "EIRS_66"
          | "EIRS_68"
          | "EIRS_84"
          | "EIRS_84C";
      }>;
      bedload?: {
        uspsContainerInfo?: {
          mailOwnerCRID?: string[];
          mailOwnerID?: string[];
          uspsPublicationID?: string[];
          actualPieceCount?: number;
          containerWeight?: string;
          IMCB?: string[];
          IMCBInfo?: "LINKED" | "SCANNED";
          siblingBarcode?: string[];
          /** Present in USPS's Postman example here, not in the schema. */
          postInductionStatus?: UspsAppointmentPostInductionStatus;
          containerDestination3digitZIP?: string;
          containerDestination5digitZIP?: string;
        };
        sacks?: Array<{
          preSortLevel?: Array<{
            containerLevel?: UspsAppointmentContainerLevel;
            count?: number;
          }>;
          IMPB?: string;
          count?: number;
        }>;
        trays?: Array<{
          preSortLevel?: Array<{
            containerLevel?: UspsAppointmentContainerLevel;
            count?: number;
          }>;
          IMTB?: string;
          count?: number;
          type?:
            | "MIXED_LENGTH_TRAYS"
            | "1FT_TRAY"
            | "2FT_TRAY"
            | "EMM_TRAY"
            | "FLAT_TUB";
        }>;
        parcels?: Array<{
          preSortLevel?: Array<{
            containerLevel?: UspsAppointmentContainerLevel;
            count?: number;
          }>;
          count?: number;
        }>;
        bundles?: Array<{
          preSortLevel?: Array<{
            containerLevel?: UspsAppointmentContainerLevel;
            count?: number;
          }>;
          count?: number;
        }>;
      };
      perishable?: "YES" | "NO";
      mailClass?:
        | "FIRST_CLASS"
        | "PERIODICALS"
        | "USPS_MARKETING_MAIL"
        | "PACKAGE_SERVICES"
        | "PARCEL_SELECT"
        | "PRIORITY_MAIL"
        | "USPS_GROUND_ADVANTAGE";
      rateType?:
        | "R"
        | "L"
        | "B"
        | "C"
        | "S"
        | "S1"
        | "S2"
        | "S3"
        | "S4"
        | "S5"
        | "S6"
        | "S7"
        | "F"
        | "A"
        | "N"
        | "P"
        | "T"
        | "D"
        | "X"
        | "H"
        | "M"
        | "Z"
        | "E"
        | "E4"
        | "G"
        | "1"
        | "2"
        | "3"
        | "4"
        | "J"
        | "K"
        | "V"
        | "W"
        | "Y"
        | "Q";
      inHomeStart?: string;
      inHomeEnd?: string;
      processingCategory?:
        "LT" | "FL" | "CD" | "OS" | "MP" | "IR" | "PF" | "CM" | "SP" | "MB";
      newsIndicator?: "YES" | "NO";
      priorityMailIndicator?: "YES" | "NO";
      verificationLocation?: "BMEU" | "DMU";
      mailContentName?: string;
      mailPreparerID?: string;
      mailPreparerCRID?: string;
      schedulerContentID?: string;
      consigneeContentID?: string;
    }>;
    consigneeContentID?: string;
  };
  trailerInfo?: {
    trailer?: Array<{
      trailerNumber?: string;
      trailerLength?: "20FT" | "40FT" | "45FT" | "48FT" | "53FT";
    }>;
    carrier?: {
      carrierName?: string;
      carrierCRID?: string;
      commonContact?: Array<{
        contactName?: string;
        telephone?: string;
        mobilePhone?: string;
        email?: string;
        fax?: string;
        contactID?: {
          idValue?: string;
          idValueType?: "DRIVERS_LICENSE" | "EMPLOYEE_ID";
        };
        contactType?:
          | "ACCOUNT_MANAGER"
          | "CARRIER"
          | "CROSS_DOCK"
          | "CUSTOMER_SERVICE"
          | "HELP_DESK"
          | "DROP_SHIP_COORDINATOR"
          | "APPT_COORDINATOR"
          | "PLANT"
          | "INBOUND_FREIGHT_COORDINATOR"
          | "SALES_OFFICE"
          | "TRUCK_DRIVER"
          | "WAREHOUSE"
          | "OTHER";
      }>;
    };
    billOfLadingNumberArray?: Array<{
      billOfLadingNumber?: string;
    }>;
  };
  consigneeFacility: {
    facilityNumber?: string;
    facilityType?: string;
  };
  comment?: string;
  valueAddedService?:
    | "D1"
    | "D2"
    | "D3"
    | "D4"
    | "D5"
    | "D6"
    | "D7"
    | "D8"
    | "D9"
    | "D10"
    | "D11"
    | "D12"
    | "D13"
    | "D14"
    | "D15"
    | "D16"
    | "D17"
    | "D18"
    | "D19"
    | "D20";
  shipperAppointmentRequestID: string;
  consigneeAppointmentID?: string;
  schedulerID?: string;
  schedulerCorpID?: string;
  CRID: string;
  shipperMultiStopID?: string;
  consigneeMultiStopID?: string;
  shipperStopNumber?: string;
  pickupOrDelivery?: "PICKUP" | "DELIVERY";
  palletPositionCount?: number;
  includesElectronicLoad?: "YES" | "NO";
}

export interface UspsAppointmentCancellationRequest {
  consigneeAppointmentID: string;
  shipperAppointmentRequestID: string;
  CRID: string;
  systemID?: string;
  destinationEntry: "YES" | "NO";
  cancelReasonCode: "A" | "D" | "E" | "M" | "P";
  cancelComments: string;
}

export interface UspsAppointmentCancellationResponse {
  consigneeAppointmentID: string;
  shipperAppointmentRequestID: string;
  CRID: string;
  systemID?: string;
  destinationEntry: "YES" | "NO";
  cancelReasonCode: "A" | "D" | "E" | "M" | "P";
  cancelComments: string;
  cancelNumber?: string;
}

export interface UspsAppointmentAvailabilityRequest {
  oneTimeAppt?: boolean;
  recurringAppt?: boolean;
  mailClass:
    | "FIRST_CLASS"
    | "PERIODICALS"
    | "USPS_MARKETING_MAIL"
    | "PACKAGE_SERVICES"
    | "PARCEL_SELECT"
    | "PRIORITY_MAIL";
  dropshipKey: string;
  appointmentType?: "PALLET" | "BEDLOAD" | "DROP_AND_PICK" | "SPEEDLINE";
  appointmentStartDate?: string;
  appointmentEndDate?: string;
  destinationEntry: "YES" | "NO";
  applyTiers?: "YES" | "NO";
  perishableInd?: boolean;
  userCRID?: string;
  schedulerID?: string;
  schedulerCorpID?: string;
  schedulerCRID?: string;
  consigneeFacility: {
    facilityNumber?: string;
    facilityType?: string;
  };
  detailInfo: {
    consigneeContainerGroupingID?: string;
    shipperContainerGroupingID?: string;
    uspsSummary?: Array<{
      destinationDiscountIndicator?: "YES" | "NO";
      zoneSkippingIndicator?: "YES" | "NO";
      processingCategory?:
        "LT" | "FL" | "CD" | "OS" | "MP" | "IR" | "PF" | "CM" | "SP" | "MB";
      newsIndicator?: "YES" | "NO";
      priorityMailIndicator?: "YES" | "NO";
      verificationLocation?: "BMEU" | "DMU";
      perishable?: "YES" | "NO";
      mailClass?:
        | "FIRST_CLASS"
        | "PERIODICALS"
        | "USPS_MARKETING_MAIL"
        | "PACKAGE_SERVICES"
        | "PARCEL_SELECT"
        | "PRIORITY_MAIL"
        | "USPS_GROUND_ADVANTAGE";
      rateType?:
        | "R"
        | "L"
        | "B"
        | "C"
        | "S"
        | "S1"
        | "S2"
        | "S3"
        | "S4"
        | "S5"
        | "S6"
        | "S7"
        | "F"
        | "A"
        | "N"
        | "P"
        | "T"
        | "D"
        | "X"
        | "H"
        | "M"
        | "Z"
        | "E"
        | "E4"
        | "G"
        | "1"
        | "2"
        | "3"
        | "4"
        | "J"
        | "K"
        | "V"
        | "W"
        | "Y"
        | "Q";
    }>;
  };
  preferredAppt?: string;
  apptTime?: string;
  dayFrequency?:
    | "DAILY"
    | "SATURDAY"
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY";
  weekFrequency?:
    | "WEEKLY"
    | "BI_WEEKLY"
    | "FIRST"
    | "SECOND"
    | "THIRD"
    | "FOURTH"
    | "FIFTH"
    | "SIXTH";
  apptTrackingID?: string;
  comments?: string;
  schedulerContentID?: string;
  shipperApptRequestID?: string;
  shipperMultiStopID?: string;
  trailerInfo?: {
    trailer?: Array<{
      trailerNumber?: string;
      trailerLength?: "20FT" | "40FT" | "45FT" | "48FT" | "53FT";
    }>;
    carrier?: {
      carrierName?: string;
      carrierCRID?: string;
      commonContact?: Array<{
        contactName?: string;
        telephone?: string;
        mobilePhone?: string;
        email?: string;
        fax?: string;
        contactID?: {
          idValue?: string;
          idValueType?: "DRIVERS_LICENSE" | "EMPLOYEE_ID";
        };
        contactType?:
          | "ACCOUNT_MANAGER"
          | "CARRIER"
          | "CROSS_DOCK"
          | "CUSTOMER_SERVICE"
          | "HELP_DESK"
          | "DROP_SHIP_COORDINATOR"
          | "APPT_COORDINATOR"
          | "PLANT"
          | "INBOUND_FREIGHT_COORDINATOR"
          | "SALES_OFFICE"
          | "TRUCK_DRIVER"
          | "WAREHOUSE"
          | "OTHER";
      }>;
    };
    billOfLadingNumberArray?: Array<{
      billOfLadingNumber?: string;
    }>;
  };
}

export type UspsAppointmentPostInductionStatus =
  | "ACCEPTED"
  | "ON_HOLD"
  | "REJECTED"
  | "NOT_PAID"
  | "TRANSPORTATION_INFO_UPDATED"
  | "DISPATCHED_FOR_INDUCTION"
  | "DISPATCHED_FOR_PICKUP"
  | "PICKED_UP"
  | "WAREHOUSED"
  | "PLANNED"
  | "DOCKED"
  | "MAIL_READY_FOR_PICKUP"
  | "DELIVERED"
  | "DEPOSITED_WITH_SHIPPER"
  | "EDOC_SUBMITTED"
  | "MAIL_READY_TO_BE_SHIPPED"
  | "POSTAGE_FINALIZED"
  | "MAIL_VERIFIED_AND_RELEASED"
  | "MAIL_IN_COPAL_POOL";

export type UspsAppointmentContainerLevel =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "M"
  | "N"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "AA"
  | "AB"
  | "AC"
  | "AD"
  | "AE"
  | "AF"
  | "AG";

export interface UspsAppointmentAvailabilityResponse {
  appointmentSlots?: Array<{
    slot?: string;
  }>;
}

export interface UspsAppointmentErrorMessage {
  apiVersion?: string;
  error?: {
    code?: string;
    message?: string;
    errors?: Array<{
      status?: string;
      code?: string;
      title?: string;
      detail?: string;
      source?: {
        parameter?: string;
        example?: string;
      };
    }>;
  };
}
