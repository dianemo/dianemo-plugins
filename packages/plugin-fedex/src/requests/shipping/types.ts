import { FedExPackageType, FedExResponse, FedExServiceType } from "../types.js";
import {
  FedExShipAdditionalMeasures,
  FedExShipAlert3P,
  FedExShipBrokerDetail,
  FedExShipCommercialInvoice,
  FedExShipCompletedEtdDetail,
  FedExShipCompletedHazardousShipmentDetail,
  FedExShipCompletedHoldAtLocationDetail,
  FedExShipCompletedPackageDetail,
  FedExShipContactAndAddress,
  FedExShipCustomsDeclarationStatementDetail,
  FedExShipCustomsOptionDetail,
  FedExShipDocumentRequirementsDetail,
  FedExShipDutiesPayment,
  FedExShipExportDetail,
  FedExShipExpressFreightDetail,
  FedExShipLabelSpecification,
  FedExShipMasterTrackingId,
  FedExShipMoney,
  FedExShipParty1,
  FedExShipPartyAccountNumber,
  FedExShipPayment,
  FedExShipPendingShipmentAccessDetail,
  FedExShipPieceResponse,
  FedExShipRecipientCustomsId,
  FedExShipRecipientsParty,
  FedExShipRequestedPackageLineItem,
  FedExShipServiceDescription,
  FedExShipShipmentAdvisoryDetails,
  FedExShipShipmentDocument,
  FedExShipShipmentOperationalDetail,
  FedExShipShipmentRateDetail,
  FedExShipShipmentSpecialServicesRequested,
  FedExShipShipperAccountNumber,
  FedExShipShipperParty,
  FedExShipShippingDocumentSpecification,
  FedExShipSmartPostInfoDetail,
  FedExShipSoldToParty,
  FedExShipUsmcaDetail,
  FedExShipVariableHandlingChargeDetail,
  FedExShipVersion,
  FedExShipWeight,
} from "../purchaser/types.js";

// Wire types mirror the FedEx Developer Portal OpenAPI spec "Ship API" v1.0.0
// (downloaded 2026-11-12). Shapes shared with create-shipment are imported from
// the purchaser family; only the spec's distinct schemas are declared here.

export interface FedExCancelShipmentOptions {
  /** @deprecated Not in the spec; the real field is `deletionControl` on the request. */
  deleteAllPackages?: boolean;
}

export type FedExCancelShipmentRequest = FedExShipCancelShipmentRequest;
export type FedExCancelShipmentResponse =
  FedExResponse<FedExShipCancelShipmentOutput>;

export type FedExShipGetShipmentAsyncResultsResponse =
  FedExResponse<FedExShipGetShipmentAsyncResultsOutput>;
export type FedExShipValidateShipmentResponse =
  FedExResponse<FedExShipValidateShipmentOutput>;
export type FedExShipCreateTagResponse =
  FedExResponse<FedExShipCreateTagOutput>;
export type FedExShipCancelTagResponse =
  FedExResponse<FedExShipCancelTagOutput>;

/** `shipmentid` path segment of the cancel-tag endpoint. */
export interface FedExShipCancelTagParams {
  shipmentId: string;
}

export interface FedExShipCancelShipmentRequest {
  accountNumber: FedExShipShipperAccountNumber;
  emailShipment?: boolean;
  senderCountryCode?: string;
  deletionControl?: "DELETE_ALL_PACKAGES";
  trackingNumber: string;
  version?: FedExShipVersion;
}

export interface FedExShipCancelShipmentOutput {
  cancelledShipment?: boolean;
  cancelledHistory?: boolean;
  message?: string;
}

export interface FedExShipGetShipmentAsyncResultsRequest {
  accountNumber: FedExShipPartyAccountNumber;
  jobId: string;
  version?: FedExShipVersion;
}

export interface FedExShipShipmentRating {
  actualRateType?: string;
  shipmentRateDetails?: FedExShipShipmentRateDetail[];
}

export interface FedExShipCompletedShipmentDetail {
  completedPackageDetails?: FedExShipCompletedPackageDetail[];
  operationalDetail?: FedExShipShipmentOperationalDetail;
  carrierCode?: string;
  completedHoldAtLocationDetail?: FedExShipCompletedHoldAtLocationDetail;
  completedEtdDetail?: FedExShipCompletedEtdDetail;
  packagingDescription?: string;
  masterTrackingId?: FedExShipMasterTrackingId;
  serviceDescription?: FedExShipServiceDescription;
  usDomestic?: boolean;
  hazardousShipmentDetail?: FedExShipCompletedHazardousShipmentDetail;
  shipmentRating?: FedExShipShipmentRating;
  documentRequirements?: FedExShipDocumentRequirementsDetail;
  exportComplianceStatement?: string;
  accessDetail?: FedExShipPendingShipmentAccessDetail;
}

export interface FedExShipTransactionShipment {
  serviceType?: FedExServiceType;
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  serviceCategory?: string;
  shipmentDocuments?: FedExShipShipmentDocument[];
  pieceResponses?: FedExShipPieceResponse[];
  serviceName?: string;
  alerts?: FedExShipAlert3P[];
  completedShipmentDetail?: FedExShipCompletedShipmentDetail;
  shipmentAdvisoryDetails?: FedExShipShipmentAdvisoryDetails;
  masterTrackingNumber?: string;
}

export interface FedExShipGetShipmentAsyncResultsOutput {
  transactionShipments?: FedExShipTransactionShipment[];
}

export interface FedExShipEmailNotificationRecipient {
  name?: string;
  emailNotificationRecipientType:
    "BROKER" | "OTHER" | "RECIPIENT" | "SHIPPER" | "THIRD_PARTY";
  emailAddress?: string;
  notificationFormatType?: "HTML" | "TEXT";
  notificationType?: "EMAIL";
  locale?: string;
  notificationEventType?: (
    | "ON_DELIVERY"
    | "ON_EXCEPTION"
    | "ON_SHIPMENT"
    | "ON_TENDER"
    | "ON_ESTIMATED_DELIVERY"
    | "ON_BILL_OF_LADING"
    | "ON_PICKUP_DRIVER_ARRIVED"
    | "ON_PICKUP_DRIVER_ASSIGNED"
    | "ON_PICKUP_DRIVER_DEPARTED"
    | "ON_PICKUP_DRIVER_EN_ROUTE"
  )[];
}

export interface FedExShipEMailNotificationDetail {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExShipEmailNotificationRecipient[];
  personalMessage?: string;
}

export interface FedExShipCommodity1 {
  unitPrice?: FedExShipMoney;
  additionalMeasures?: FedExShipAdditionalMeasures[];
  numberOfPieces?: number;
  quantity?: number;
  quantityUnits?: string;
  customsValue?: FedExShipMoney;
  countryOfManufacture?: string;
  cIMarksAndNumbers?: string;
  harmonizedCode?: string;
  description: string;
  name?: string;
  weight?: FedExShipWeight;
  exportLicenseNumber?: string;
  /** Format: YYYY-MM-DD */
  exportLicenseExpirationDate?: string;
  partNumber?: string;
  purpose?: "BUSINESS" | "CONSUMER";
  usmcaDetail?: FedExShipUsmcaDetail;
}

export interface FedExShipCustomsClearanceDetail1 {
  regulatoryControls?: (
    | "FOOD_OR_PERISHABLE"
    | "USMCA"
    | "NOT_APPLICABLE_FOR_LOW_VALUE_CUSTOMS_EXCEPTIONS"
    | "NOT_IN_FREE_CIRCULATION"
  )[];
  brokers?: FedExShipBrokerDetail[];
  commercialInvoice: FedExShipCommercialInvoice;
  freightOnValue?: "CARRIER_RISK" | "OWN_RISK";
  dutiesPayment?: FedExShipDutiesPayment;
  commodities: FedExShipCommodity1[];
  isDocumentOnly?: boolean;
  recipientCustomsId?: FedExShipRecipientCustomsId;
  customsOption?: FedExShipCustomsOptionDetail;
  importerOfRecord?: FedExShipParty1;
  generatedDocumentLocale?: string;
  exportDetail?: FedExShipExportDetail;
  totalCustomsValue?: FedExShipMoney;
  partiesToTransactionAreRelated?: boolean;
  declarationStatementDetail?: FedExShipCustomsDeclarationStatementDetail;
  insuranceCharge?: FedExShipMoney;
}

export interface FedExShipRequestedShipmentVerify {
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  pickupType:
    | "CONTACT_FEDEX TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  serviceType: FedExServiceType;
  packagingType: FedExPackageType;
  totalWeight: number;
  shipper: FedExShipShipperParty;
  recipients: FedExShipRecipientsParty[];
  origin?: FedExShipContactAndAddress;
  shippingChargesPayment: FedExShipPayment;
  shipmentSpecialServices?: FedExShipShipmentSpecialServicesRequested;
  emailNotificationDetail?: FedExShipEMailNotificationDetail;
  variableHandlingChargeDetail?: FedExShipVariableHandlingChargeDetail;
  customsClearanceDetail?: FedExShipCustomsClearanceDetail1;
  smartPostInfoDetail?: FedExShipSmartPostInfoDetail;
  expressFreightDetail?: FedExShipExpressFreightDetail;
  blockInsightVisibility?: boolean;
  labelSpecification: FedExShipLabelSpecification;
  shippingDocumentSpecification?: FedExShipShippingDocumentSpecification;
  rateRequestType?: (
    "LIST" | "NONE" | "PREFERRED" | "ACCOUNT" | "INCENTIVE" | "RETAIL"
  )[];
  preferredCurrency?: string;
  requestedPackageLineItems: FedExShipRequestedPackageLineItem[];
}

export interface FedExShipValidateShipmentRequest {
  requestedShipment: FedExShipRequestedShipmentVerify;
  accountNumber?: FedExShipShipperAccountNumber;
  version?: FedExShipVersion;
}

export type FedExShipValidateShipmentOutput = object;

export interface FedExShipShipShipmentEmailNotificationRecipientTag {
  name?: string;
  emailNotificationRecipientType:
    "BROKER" | "OTHER" | "RECIPIENT" | "SHIPPER" | "THIRD_PARTY";
  emailAddress: string;
  notificationFormatType?: "HTML" | "TEXT";
  notificationType?: "EMAIL";
  locale?: string;
  notificationEventType?: (
    | "ON_DELIVERY"
    | "ON_EXCEPTION"
    | "ON_SHIPMENT"
    | "ON_TENDER"
    | "ON_ESTIMATED_DELIVERY"
    | "ON_PICKUP_DRIVER_ARRIVED"
    | "ON_PICKUP_DRIVER_ASSIGNED"
    | "ON_PICKUP_DRIVER_DEPARTED"
    | "ON_PICKUP_DRIVER_EN_ROUTE"
  )[];
}

export interface FedExShipShipShipmentEMailNotificationDetailTag {
  aggregationType?: "PER_PACKAGE" | "PER_SHIPMENT";
  emailNotificationRecipients?: FedExShipShipShipmentEmailNotificationRecipientTag[];
  personalMessage?: string;
}

export interface FedExShipCreateTagRequestedShipment {
  /** Format: YYYY-MM-DD */
  shipDatestamp?: string;
  totalDeclaredValue?: FedExShipMoney;
  shipper: FedExShipShipperParty;
  soldTo?: FedExShipSoldToParty;
  recipients: FedExShipRecipientsParty[];
  recipientLocationNumber?: string;
  pickupType:
    | "CONTACT_FEDEX_TO_SCHEDULE"
    | "DROPOFF_AT_FEDEX_LOCATION"
    | "USE_SCHEDULED_PICKUP";
  serviceType: FedExServiceType;
  packagingType: FedExPackageType;
  totalWeight: number;
  origin?: FedExShipContactAndAddress;
  shippingChargesPayment: FedExShipPayment;
  shipmentSpecialServices?: FedExShipShipmentSpecialServicesRequested;
  emailNotificationDetail?: FedExShipShipShipmentEMailNotificationDetailTag;
  expressFreightDetail?: FedExShipExpressFreightDetail;
  variableHandlingChargeDetail?: FedExShipVariableHandlingChargeDetail;
  customsClearanceDetail?: FedExShipCustomsClearanceDetail1;
  smartPostInfoDetail?: FedExShipSmartPostInfoDetail;
  blockInsightVisibility?: boolean;
  labelSpecification: FedExShipLabelSpecification;
  shippingDocumentSpecification?: FedExShipShippingDocumentSpecification;
  rateRequestType?: (
    "LIST" | "NONE" | "PREFERRED" | "ACCOUNT" | "INCENTIVE" | "RETAIL"
  )[];
  preferredCurrency?: string;
  totalPackageCount?: number;
  masterTrackingId?: FedExShipMasterTrackingId;
  requestedPackageLineItems: FedExShipRequestedPackageLineItem[];
  pickupDetail: {
    readyPickupDateTime: string;
    latestPickupDateTime: string;
  };
}

export interface FedExShipCreateTagRequest {
  requestedShipment: FedExShipCreateTagRequestedShipment;
  accountNumber: FedExShipPartyAccountNumber;
  version?: FedExShipVersion;
}

export interface FedExShipCompletedTagDetail2 {
  confirmationNumber: string;
  location: string;
  dispatchDate: string;
}

export interface FedExShipCreateTagOutput {
  masterTrackingNumber?: string;
  serviceType?: string;
  /** Format: MMM-dd-yyyy */
  shipTimestamp?: string;
  completedTagDetail?: FedExShipCompletedTagDetail2;
}

export interface FedExShipCancelTagRequest {
  accountNumber: FedExShipPartyAccountNumber;
  serviceType: string;
  trackingNumber?: string;
  version?: FedExShipVersion;
  completedTagDetail: FedExShipCompletedTagDetail2;
}

export interface FedExShipCancelTagOutput {
  cancelledTag?: boolean;
  successMessage?: string;
}
