export interface AmazonShippingTemplate {
  name: string;
  id: string;
}

export type AmazonMarketplaceId =
  | "A2EUQ1WTGCTBG2"
  | "ATVPDKIKX0DER"
  | "A1AM78C64UM0Y8"
  | "A2Q3Y263D00KWC"
  | "A1RKKUPIHCS9HS"
  | "A1F83G8C2ARO7P"
  | "A13V1IB3VIYZZH"
  | "AMEN7PMS3EDWL"
  | "A1805IZSGTT6HS"
  | "A1PA6795UKMFR9"
  | "APJ6JRA9NG5V4"
  | "A2NODRKZP88ZB9"
  | "A1C3SOZRARQ6R3"
  | "ARBP9OOSHTCHU"
  | "A33AVAJ2PDY3EV"
  | "A17E79C6D8DWNP"
  | "A2VIGQ35RCS4UG"
  | "A21TJRUUN4KGV"
  | "A19VAU5U5O7RUS"
  | "A39IBJ37TRP1C6"
  | "A1VC38T7YXB528";

export type AwsRegion = "us-east-1" | "eu-west-1" | "us-west-2";

export type SPAPIRegion = Record<
  AwsRegion,
  {
    name: string;
    host: string;
    marketplaces: SPAPIMarketplace[];
  }
>;

export interface SPAPIMarketplace {
  name: string;
  marketplaceId: string;
  countryCode: string;
  sellerCentralUrl: string;
}

export type SPAPIEndpoints = Record<SPAPIEndpointName, SPAPIEndpointData>;

export type SPAPIEndpointName =
  | "easyShipListHandoverSlots"
  | "easyShipGetScheduledPackage"
  | "easyShipCreateScheduledPackage"
  | "easyShipUpdateScheduledPackages"
  | "easyShipCreateScheduledPackageBulk"
  | "fbaInventoryGetInventorySummaries"
  | "aplusSearchContentDocuments"
  | "aplusCreateContentDocument"
  | "aplusGetContentDocument"
  | "aplusUpdateContentDocument"
  | "aplusListContentDocumentAsinRelations"
  | "aplusPostContentDocumentAsinRelations"
  | "aplusValidateContentDocumentAsinRelations"
  | "aplusSearchContentPublishRecords"
  | "aplusPostContentDocumentApprovalSubmission"
  | "aplusPostContentDocumentSuspendSubmission"
  | "applicationsRotateApplicationClientSecret"
  | "catalogSearchCatalogItems"
  | "catalogGetCatalogItem"
  | "fbaGetItemEligibilityPreview"
  | "feedsGetFeeds"
  | "feedsCreateFeed"
  | "feedsGetFeed"
  | "feedsCancelFeed"
  | "feedsCreateFeedDocument"
  | "feedsGetFeedDocument"
  | "financesListFinancialEventGroups"
  | "financesListFinancialEventsByGroupId"
  | "financesListFinancialEventsByOrderId"
  | "financesListFinancialEvents"
  | "inboundListInboundPlans"
  | "inboundCreateInboundPlan"
  | "inboundGetInboundPlan"
  | "inboundGetShipments"
  | "inboundGetShipmentItemsByShipmentId"
  | "inboundGetShipmentItemsByShipmentIdv0"
  | "inboundListInboundPlanBoxes"
  | "inboundCancelInboundPlan"
  | "inboundListInboundPlanItems"
  | "inboundSetPackingInformation"
  | "inboundListPackingOptions"
  | "inboundGeneratePackingOptions"
  | "inboundConfirmPackingOption"
  | "inboundListPackingGroupItems"
  | "inboundListInboundPlanPallets"
  | "inboundListPlacementOptions"
  | "inboundGeneratePlacementOptions"
  | "inboundConfirmPlacementOption"
  | "inboundGetShipment"
  | "inboundGetDeliveryChallanDocument"
  | "inboundUpdateShipmentDeliveryWindow"
  | "inboundGetSelfShipAppointmentSlots"
  | "inboundGenerateSelfShipAppointmentSlots"
  | "inboundCancelSelfShipAppointment"
  | "inboundScheduleSelfShipAppointment"
  | "inboundUpdateShipmentTrackingDetails"
  | "inboundListTransportationOptions"
  | "inboundGenerateTransportationOptions"
  | "inboundConfirmTransportationOptions"
  | "inboundListItemComplianceDetails"
  | "inboundUpdateItemComplianceDetails"
  | "inboundGetInboundOperationStatus"
  | "fbaGetFulfillmentPreview"
  | "fbaListAllFulfillmentOrders"
  | "fbaCreateFulfillmentOrder"
  | "fbaGetPackageTrackingDetails"
  | "fbaListReturnReasonCodes"
  | "fbaCreateFulfillmentReturn"
  | "fbaGetFulfillmentOrder"
  | "fbaUpdateFulfillmentOrder"
  | "fbaCancelFulfillmentOrder"
  | "fbaSubmitFulfillmentOrderStatusUpdate"
  | "fbaGetFeatures"
  | "fbaGetFeatureInventory"
  | "fbaGetFeatureSKU"
  | "searchDefinitionsProductTypes"
  | "getDefinitionsProductType"
  | "listingsGetListingsItem"
  | "listingsPutListingsItem"
  | "listingsDeleteListingsItem"
  | "listingsPatchListingsItem"
  | "listingsSearchListingsItems"
  | "mfnGetEligibleShipmentServices"
  | "mfnGetShipment"
  | "mfnCancelShipment"
  | "mfnCreateShipment"
  | "mfnGetAdditionalSellerInputs"
  | "messagingGetMessagingActionsForOrder"
  | "messagingConfirmCustomizationDetails"
  | "messagingCreateConfirmDeliveryDetails"
  | "messagingCreateLegalDisclosure"
  | "messagingCreateNegativeFeedbackRemoval"
  | "messagingCreateConfirmOrderDetails"
  | "messagingCreateConfirmServiceDetails"
  | "messagingCreateAmazonMotors"
  | "messagingCreateWarranty"
  | "messagingGetAttributes"
  | "messagingCreateDigitalAccessKey"
  | "messagingCreateUnexpectedProblem"
  | "messagingSendInvoice"
  | "notificationsGetSubscription"
  | "notificationsCreateSubscription"
  | "notificationsGetSubscriptionById"
  | "notificationsDeleteSubscriptionById"
  | "notificationsGetDestinations"
  | "notificationsCreateDestination"
  | "notificationsGetDestination"
  | "notificationsDeleteDestination"
  | "awdListInventory"
  | "ordersV2SearchOrders"
  | "ordersV2GetOrder"
  | "ordersGetOrders"
  | "ordersGetOrder"
  | "ordersGetOrderBuyerInfo"
  | "ordersGetOrderAddress"
  | "ordersGetOrderItems"
  | "ordersGetOrderItemsBuyerInfo"
  | "ordersUpdateShipmentStatus"
  | "ordersGetOrderRegulatedInfo"
  | "ordersUpdateVerificationStatus"
  | "ordersConfirmShipment"
  | "productsGetMyFeesEstimateForSKU"
  | "productsGetMyFeesEstimateForASIN"
  | "productsGetMyFeesEstimates"
  | "pricingGetFeaturedOfferExpectedPriceBatch"
  | "pricingGetCompetitiveSummary"
  | "replenishmentGetSellingPartnerMetrics"
  | "replenishmentListOfferMetrics"
  | "replenishmentListOffers"
  | "reportsGetReports"
  | "reportsCreateReport"
  | "reportsGetReport"
  | "reportsCancelReport"
  | "reportsGetReportSchedules"
  | "reportsCreateReportSchedule"
  | "reportsGetReportSchedule"
  | "reportsCancelReportSchedule"
  | "reportsGetReportDocument"
  | "salesGetOrderMetrics"
  | "sellersGetMarketplaceParticipations"
  | "serviceGetServiceJobByServiceJobId"
  | "serviceCancelServiceJobByServiceJobId"
  | "serviceCompleteServiceJobByServiceJobId"
  | "serviceGetServiceJobs"
  | "serviceAddAppointmentForServiceJobByServiceJobId"
  | "serviceRescheduleAppointmentForServiceJobByServiceJobId"
  | "serviceAssignAppointmentResources"
  | "serviceSetAppointmentFulfillmentData"
  | "serviceGetRangeSlotCapacity"
  | "serviceGetFixedSlotCapacity"
  | "serviceUpdateSchedule"
  | "serviceCreateReservation"
  | "serviceUpdateReservation"
  | "serviceCancelReservation"
  | "serviceGetAppointmmentSlotsByJobId"
  | "serviceGetAppointmentSlots"
  | "serviceCreateServiceDocumentUploadDestination"
  | "brazilGetShipmentDetails"
  | "brazilSubmitInvoice"
  | "brazilGetInvoiceStatus"
  | "shippingCreateShipment"
  | "shippingGetShipment"
  | "shippingCancelShipment"
  | "shippingPurchaseLabels"
  | "shippingRetrieveShippingLabel"
  | "shippingPurchaseShipment"
  | "shippingGetRates"
  | "shippingGetAccount"
  | "shippingGetTrackingInformation"
  | "solicitationsGetSolicitationActionsForOrder"
  | "solicitationsCreateProductReviewAndSellerFeedbackSolicitation"
  | "supplySourcesGetSupplySources"
  | "supplySourcesCreateSupplySource"
  | "supplySourcesGetSupplySource"
  | "supplySourcesUpdateSupplySource"
  | "supplySourcesArchiveSupplySource"
  | "supplySourcesUpdateSupplySourceStatus"
  | "tokensCreateRestrictedDataToken"
  | "uploadsCreateUploadDestinationForResource";

export interface SPAPIEndpointData {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  rateLimit: number;
  burstLimit: number;
  /**
   * Amazon withholds PII on a restricted operation unless the call carries a
   * restricted data token. The template gives every flagged endpoint the `:pii`
   * sub-client that can send one, so this flag is what lets a request
   * function's `pii` argument reach the wire — set it where a request function
   * passes `dataElements`, and nowhere else.
   */
  restricted?: boolean;
}

export interface AuthorizedAccount {
  nickname: string;
  refreshToken: string;
  expiresAt: number;
  sellingPartnerId: string;
  awsRegion: AwsRegion;
}

export const spapiRegions: SPAPIRegion = {
  "eu-west-1": {
    name: "Europe",
    host: "sellingpartnerapi-eu.amazon.com",
    marketplaces: [
      {
        name: "Spain",
        marketplaceId: "A1RKKUPIHCS9HS",
        countryCode: "ES",
        sellerCentralUrl: "https://sellercentral-europe.amazon.com",
      },
      {
        name: "United Kingdom",
        marketplaceId: "A1F83G8C2ARO7P",
        countryCode: "UK",
        sellerCentralUrl: "https://sellercentral-europe.amazon.com",
      },
      {
        name: "France",
        marketplaceId: "A13V1IB3VIYZZH",
        countryCode: "FR",
        sellerCentralUrl: "https://sellercentral-europe.amazon.com",
      },
      {
        name: "Belgium",
        marketplaceId: "AMEN7PMS3EDWL",
        countryCode: "BE",
        sellerCentralUrl: "https://sellercentral.amazon.com.be",
      },
      {
        name: "Netherlands",
        marketplaceId: "A1805IZSGTT6HS",
        countryCode: "NL",
        sellerCentralUrl: "https://sellercentral.amazon.nl",
      },
      {
        name: "Germany",
        marketplaceId: "A1PA6795UKMFR9",
        countryCode: "DE",
        sellerCentralUrl: "https://sellercentral-europe.amazon.com",
      },
      {
        name: "Italy",
        marketplaceId: "APJ6JRA9NG5V4",
        countryCode: "IT",
        sellerCentralUrl: "https://sellercentral-europe.amazon.com",
      },
      {
        name: "Sweden",
        marketplaceId: "A2NODRKZP88ZB9",
        countryCode: "SE",
        sellerCentralUrl: "https://sellercentral.amazon.se",
      },
      {
        name: "South Africa",
        marketplaceId: "AE08WJ6YKNBMC",
        countryCode: "ZA",
        sellerCentralUrl: "https://sellercentral.amazon.co.za",
      },
      {
        name: "Poland",
        marketplaceId: "A1C3SOZRARQ6R3",
        countryCode: "PL",
        sellerCentralUrl: "https://sellercentral.amazon.pl",
      },
      {
        name: "Egypt",
        marketplaceId: "ARBP9OOSHTCHU",
        countryCode: "EG",
        sellerCentralUrl: "https://sellercentral.amazon.eg",
      },
      {
        name: "Turkey",
        marketplaceId: "A33AVAJ2PDY3EV",
        countryCode: "TR",
        sellerCentralUrl: "https://sellercentral.amazon.com.tr",
      },
      {
        name: "Saudi Arabia",
        marketplaceId: "A17E79C6D8DWNP",
        countryCode: "SA",
        sellerCentralUrl: "https://sellercentral.amazon.sa",
      },
      {
        name: "United Arab Emirates",
        marketplaceId: "A2VIGQ35RCS4UG",
        countryCode: "AE",
        sellerCentralUrl: "https://sellercentral.amazon.ae",
      },
      {
        name: "India",
        marketplaceId: "A21TJRUUN4KGV",
        countryCode: "IN",
        sellerCentralUrl: "https://sellercentral.amazon.in",
      },
    ],
  },
  "us-east-1": {
    name: "North America",
    host: "sellingpartnerapi-na.amazon.com",
    marketplaces: [
      {
        name: "Canada",
        marketplaceId: "A2EUQ1WTGCTBG2",
        countryCode: "CA",
        sellerCentralUrl: "https://sellercentral.amazon.ca",
      },
      {
        name: "United States of America",
        marketplaceId: "ATVPDKIKX0DER",
        countryCode: "US",
        sellerCentralUrl: "https://sellercentral.amazon.com",
      },
      {
        name: "Mexico",
        marketplaceId: "A1AM78C64UM0Y8",
        countryCode: "MX",
        sellerCentralUrl: "https://sellercentral.amazon.com.mx",
      },
      {
        name: "Brazil",
        marketplaceId: "A2Q3Y263D00KWC",
        countryCode: "BR",
        sellerCentralUrl: "https://sellercentral.amazon.com.br",
      },
    ],
  },
  "us-west-2": {
    name: "Far East",
    host: "sellingpartnerapi-fe.amazon.com",
    marketplaces: [
      {
        name: "Singapore",
        marketplaceId: "A19VAU5U5O7RUS",
        countryCode: "SG",
        sellerCentralUrl: "https://sellercentral.amazon.sg",
      },
      {
        name: "Australia",
        marketplaceId: "A39IBJ37TRP1C6",
        countryCode: "AU",
        sellerCentralUrl: "https://sellercentral.amazon.com.au",
      },
      {
        name: "Japan",
        marketplaceId: "A1VC38T7YXB528",
        countryCode: "JP",
        sellerCentralUrl: "https://sellercentral.amazon.co.jp",
      },
    ],
  },
};

export const spapiEndpoints: SPAPIEndpoints = {
  easyShipListHandoverSlots: {
    url: "/easyShip/2022-03-23/timeSlot",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  easyShipGetScheduledPackage: {
    url: "/easyShip/2022-03-23/package",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  easyShipCreateScheduledPackage: {
    url: "/easyShip/2022-03-23/package",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  easyShipUpdateScheduledPackages: {
    url: "/easyShip/2022-03-23/package",
    method: "PATCH",
    rateLimit: 1,
    burstLimit: 5,
  },
  easyShipCreateScheduledPackageBulk: {
    url: "/easyShip/2022-03-23/packages/bulk",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  fbaInventoryGetInventorySummaries: {
    url: "/fba/inventory/v1/summaries",
    method: "GET",
    rateLimit: 2,
    burstLimit: 2,
  },
  aplusSearchContentDocuments: {
    url: "/aplus/2020-11-01/contentDocuments",
    method: "GET",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusCreateContentDocument: {
    url: "/aplus/2020-11-01/contentDocuments",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusGetContentDocument: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}",
    method: "GET",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusUpdateContentDocument: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusListContentDocumentAsinRelations: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}/asins",
    method: "GET",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusPostContentDocumentAsinRelations: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}/asins",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusValidateContentDocumentAsinRelations: {
    url: "/aplus/2020-11-01/contentAsinValidations",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusSearchContentPublishRecords: {
    url: "/aplus/2020-11-01/contentPublishRecords",
    method: "GET",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusPostContentDocumentApprovalSubmission: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}/approvalSubmissions",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  aplusPostContentDocumentSuspendSubmission: {
    url: "/aplus/2020-11-01/contentDocuments/{contentReferenceKey}/suspendSubmissions",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  applicationsRotateApplicationClientSecret: {
    url: "/applications/2023-11-30/clientSecret",
    method: "POST",
    rateLimit: 0.0167,
    burstLimit: 1,
  },
  catalogSearchCatalogItems: {
    url: "/catalog/2022-04-01/items",
    method: "GET",
    rateLimit: 2,
    burstLimit: 2,
  },
  catalogGetCatalogItem: {
    url: "/catalog/2022-04-01/items/{asin}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 2,
  },
  fbaGetItemEligibilityPreview: {
    url: "/fba/inbound/v1/eligibility/itemPreview",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  feedsGetFeeds: {
    url: "/feeds/2021-06-30/feeds",
    method: "GET",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  feedsCreateFeed: {
    url: "/feeds/2021-06-30/feeds",
    method: "POST",
    rateLimit: 0.0083,
    burstLimit: 15,
  },
  feedsGetFeed: {
    url: "/feeds/2021-06-30/feeds/{feedId}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 15,
  },
  feedsCancelFeed: {
    url: "/feeds/2021-06-30/feeds/{feedId}",
    method: "DELETE",
    rateLimit: 2,
    burstLimit: 15,
  },
  feedsCreateFeedDocument: {
    url: "/feeds/2021-06-30/documents",
    method: "POST",
    rateLimit: 0.5,
    burstLimit: 15,
  },
  feedsGetFeedDocument: {
    url: "/feeds/2021-06-30/documents/{feedDocumentId}",
    method: "GET",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  financesListFinancialEventGroups: {
    url: "/finances/v0/financialEventGroups",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  financesListFinancialEventsByGroupId: {
    url: "/finances/v0/financialEventGroups/{eventGroupId}/financialEvents",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  financesListFinancialEventsByOrderId: {
    url: "/finances/v0/orders/{orderId}/financialEvents",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  financesListFinancialEvents: {
    url: "/finances/v0/financialEvents",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  inboundListInboundPlans: {
    url: "/inbound/fba/2024-03-20/inboundPlans",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundCreateInboundPlan: {
    url: "/inbound/fba/2024-03-20/inboundPlans",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundGetInboundPlan: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGetShipmentItemsByShipmentId: {
    url: "/fba/inbound/v0/shipments/{shipmentId}/items",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  inboundGetShipmentItemsByShipmentIdv0: {
    url: "/fba/inbound/v0/shipments/{shipmentId}/items",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  inboundListInboundPlanBoxes: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/boxes",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundCancelInboundPlan: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/cancellation",
    method: "PUT",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundListInboundPlanItems: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/items",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundSetPackingInformation: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/packingInformation",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundListPackingOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/packingOptions",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGeneratePackingOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/packingOptions",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundConfirmPackingOption: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/packingOptions/{packingOptionId}/confirmation",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundListPackingGroupItems: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/packingOptions/{packingOptionId}/packingGroups/{packingGroupId}/items",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundListInboundPlanPallets: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/pallets",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundListPlacementOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/placementOptions",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGeneratePlacementOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/placementOptions",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundConfirmPlacementOption: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/placementOptions/{placementOptionId}/confirmation",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundGetShipment: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGetDeliveryChallanDocument: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/deliveryChallanDocument",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundUpdateShipmentDeliveryWindow: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/deliveryWindow",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGetSelfShipAppointmentSlots: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/selfShipAppointmentSlots",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGenerateSelfShipAppointmentSlots: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/selfShipAppointmentSlots",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGetShipments: {
    url: "/fba/inbound/v0/shipments",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  inboundCancelSelfShipAppointment: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/selfShipAppointmentSlots/{slotId}/cancellation",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundScheduleSelfShipAppointment: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/selfShipAppointmentSlots/{slotId}/schedule",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundUpdateShipmentTrackingDetails: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/shipments/{shipmentId}/trackingDetails",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundListTransportationOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/transportationOptions",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGenerateTransportationOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/transportationOptions",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundConfirmTransportationOptions: {
    url: "/inbound/fba/2024-03-20/inboundPlans/{inboundPlanId}/transportationOptions/confirmation",
    method: "POST",
    rateLimit: 0.05,
    burstLimit: 1,
  },
  inboundListItemComplianceDetails: {
    url: "/inbound/fba/2024-03-20/items/compliance",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundUpdateItemComplianceDetails: {
    url: "/inbound/fba/2024-03-20/items/compliance",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 1,
  },
  inboundGetInboundOperationStatus: {
    url: "/inbound/fba/2024-03-20/operations/{operationId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  fbaGetFulfillmentPreview: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/preview",
    method: "POST",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaListAllFulfillmentOrders: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaCreateFulfillmentOrder: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders",
    method: "POST",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaGetPackageTrackingDetails: {
    url: "/fba/outbound/2020-07-01/tracking",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaListReturnReasonCodes: {
    url: "/fba/outbound/2020-07-01/returnReasonCodes",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaCreateFulfillmentReturn: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/{sellerFulfillmentOrderId}/return",
    method: "PUT",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaGetFulfillmentOrder: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/{sellerFulfillmentOrderId}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaUpdateFulfillmentOrder: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/{sellerFulfillmentOrderId}",
    method: "PUT",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaCancelFulfillmentOrder: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/{sellerFulfillmentOrderId}/cancel",
    method: "PUT",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaSubmitFulfillmentOrderStatusUpdate: {
    url: "/fba/outbound/2020-07-01/fulfillmentOrders/{sellerFulfillmentOrderId}/status",
    method: "PUT",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaGetFeatures: {
    url: "/fba/outbound/2020-07-01/features",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaGetFeatureInventory: {
    url: "/fba/outbound/2020-07-01/features/inventory/{featureName}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  fbaGetFeatureSKU: {
    url: "/fba/outbound/2020-07-01/features/inventory/{featureName}/{sellerSku}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 30,
  },
  listingsGetListingsItem: {
    url: "/listings/2021-08-01/items/{sellerId}/{sku}",
    method: "GET",
    rateLimit: 5,
    burstLimit: 10,
  },
  listingsPutListingsItem: {
    url: "/listings/2021-08-01/items/{sellerId}/{sku}",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 10,
  },
  listingsDeleteListingsItem: {
    url: "/listings/2021-08-01/items/{sellerId}/{sku}",
    method: "DELETE",
    rateLimit: 5,
    burstLimit: 10,
  },
  listingsPatchListingsItem: {
    url: "/listings/2021-08-01/items/{sellerId}/{sku}",
    method: "PATCH",
    rateLimit: 5,
    burstLimit: 10,
  },
  listingsSearchListingsItems: {
    url: "/listings/2021-08-01/items/{sellerId}",
    method: "GET",
    rateLimit: 5,
    burstLimit: 5,
  },
  mfnGetEligibleShipmentServices: {
    url: "/mfn/v0/eligibleShippingServices",
    method: "POST",
    rateLimit: 5,
    burstLimit: 10,
  },
  mfnGetShipment: {
    url: "/mfn/v0/shipments/{shipmentId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  mfnCancelShipment: {
    url: "/mfn/v0/shipments/{shipmentId}",
    method: "DELETE",
    rateLimit: 1,
    burstLimit: 1,
  },
  mfnCreateShipment: {
    url: "/mfn/v0/shipments",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  mfnGetAdditionalSellerInputs: {
    url: "/mfn/v0/additionalSellerInputs",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  messagingGetMessagingActionsForOrder: {
    url: "/messaging/v1/orders/{amazonOrderId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingConfirmCustomizationDetails: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/confirmCustomizationDetails",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateConfirmDeliveryDetails: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/confirmDeliveryDetails",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateLegalDisclosure: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/legalDisclosure",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateNegativeFeedbackRemoval: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/negativeFeedbackRemoval",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateConfirmOrderDetails: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/confirmOrderDetails",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateConfirmServiceDetails: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/confirmServiceDetails",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateAmazonMotors: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/amazonMotors",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateWarranty: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/warranty",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingGetAttributes: {
    url: "/messaging/v1/orders/{amazonOrderId}/attributes",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateDigitalAccessKey: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/digitalAccessKey",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingCreateUnexpectedProblem: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/unexpectedProblem",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  messagingSendInvoice: {
    url: "/messaging/v1/orders/{amazonOrderId}/messages/invoice",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsGetSubscription: {
    url: "/notifications/v1/subscriptions/{notificationType}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsCreateSubscription: {
    url: "/notifications/v1/subscriptions/{notificationType}",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsGetSubscriptionById: {
    url: "/notifications/v1/subscriptions/{notificationType}/{subscriptionId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsDeleteSubscriptionById: {
    url: "/notifications/v1/subscriptions/{notificationType}/{subscriptionId}",
    method: "DELETE",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsGetDestinations: {
    url: "/notifications/v1/destinations",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsCreateDestination: {
    url: "/notifications/v1/destinations",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsGetDestination: {
    url: "/notifications/v1/destinations/{destinationId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  notificationsDeleteDestination: {
    url: "/notifications/v1/destinations/{destinationId}",
    method: "DELETE",
    rateLimit: 1,
    burstLimit: 5,
  },
  awdListInventory: {
    url: "/awd/2024-05-09/inventory",
    method: "GET",
    rateLimit: 2,
    burstLimit: 2,
  },
  ordersV2SearchOrders: {
    url: "/orders/2026-01-01/orders",
    method: "GET",
    rateLimit: 0.0167,
    burstLimit: 20,
  },
  ordersV2GetOrder: {
    url: "/orders/2026-01-01/orders/{orderId}",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersGetOrders: {
    url: "/orders/v0/orders",
    method: "GET",
    rateLimit: 0.0167,
    burstLimit: 20,
    restricted: true,
  },
  ordersGetOrder: {
    url: "/orders/v0/orders/{orderId}",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
    restricted: true,
  },
  ordersGetOrderBuyerInfo: {
    url: "/orders/v0/orders/{orderId}/buyerInfo",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersGetOrderAddress: {
    url: "/orders/v0/orders/{orderId}/address",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersGetOrderItems: {
    url: "/orders/v0/orders/{orderId}/orderItems",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
    restricted: true,
  },
  ordersGetOrderItemsBuyerInfo: {
    url: "/orders/v0/orders/{orderId}/orderItems/buyerInfo",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersUpdateShipmentStatus: {
    url: "/orders/v0/orders/{orderId}/shipment",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
  },
  ordersGetOrderRegulatedInfo: {
    url: "/orders/v0/orders/{orderId}/regulatedInfo",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersUpdateVerificationStatus: {
    url: "/orders/v0/orders/{orderId}/regulatedInfo",
    method: "PATCH",
    rateLimit: 0.5,
    burstLimit: 30,
  },
  ordersConfirmShipment: {
    url: "/orders/v0/orders/{orderId}/shipmentConfirmation",
    method: "POST",
    rateLimit: 2,
    burstLimit: 10,
  },
  productsGetMyFeesEstimateForSKU: {
    url: "/products/fees/v0/listings/{SellerSKU}/feesEstimate",
    method: "POST",
    rateLimit: 1,
    burstLimit: 2,
  },
  productsGetMyFeesEstimateForASIN: {
    url: "/products/fees/v0/items/{Asin}/feesEstimate",
    method: "POST",
    rateLimit: 1,
    burstLimit: 2,
  },
  productsGetMyFeesEstimates: {
    url: "/products/fees/v0/feesEstimate",
    method: "POST",
    rateLimit: 0.5,
    burstLimit: 1,
  },
  pricingGetFeaturedOfferExpectedPriceBatch: {
    url: "/batches/products/pricing/2022-05-01/offer/featuredOfferExpectedPrice",
    method: "POST",
    rateLimit: 0.033,
    burstLimit: 1,
  },
  pricingGetCompetitiveSummary: {
    url: "/batches/products/pricing/2022-05-01/items/competitiveSummary",
    method: "POST",
    rateLimit: 0.033,
    burstLimit: 1,
  },
  replenishmentGetSellingPartnerMetrics: {
    url: "/replenishment/2022-11-07/sellingPartners/metrics/search",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  replenishmentListOfferMetrics: {
    url: "/replenishment/2022-11-07/offers/metrics/search",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  replenishmentListOffers: {
    url: "/replenishment/2022-11-07/offers/search",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  reportsGetReports: {
    url: "/reports/2021-06-30/reports",
    method: "GET",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsCreateReport: {
    url: "/reports/2021-06-30/reports",
    method: "POST",
    rateLimit: 0.0167,
    burstLimit: 15,
  },
  reportsGetReport: {
    url: "/reports/2021-06-30/reports/{reportId}",
    method: "GET",
    rateLimit: 2,
    burstLimit: 15,
  },
  reportsCancelReport: {
    url: "/reports/2021-06-30/reports/{reportId}",
    method: "DELETE",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsGetReportSchedules: {
    url: "/reports/2021-06-30/schedules",
    method: "GET",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsCreateReportSchedule: {
    url: "/reports/2021-06-30/schedules",
    method: "POST",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsGetReportSchedule: {
    url: "/reports/2021-06-30/schedules/{reportScheduleId}",
    method: "GET",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsCancelReportSchedule: {
    url: "/reports/2021-06-30/schedules/{reportScheduleId}",
    method: "DELETE",
    rateLimit: 0.0222,
    burstLimit: 10,
  },
  reportsGetReportDocument: {
    url: "/reports/2021-06-30/documents/{reportDocumentId}",
    method: "GET",
    rateLimit: 0.0167,
    burstLimit: 15,
  },
  salesGetOrderMetrics: {
    url: "/sales/v1/orderMetrics",
    method: "GET",
    rateLimit: 0.5,
    burstLimit: 15,
  },
  sellersGetMarketplaceParticipations: {
    url: "/sellers/v1/marketplaceParticipations",
    method: "GET",
    rateLimit: 0.016,
    burstLimit: 15,
  },
  serviceGetServiceJobByServiceJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}",
    method: "GET",
    rateLimit: 20,
    burstLimit: 40,
  },
  serviceCancelServiceJobByServiceJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}/cancellations",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceCompleteServiceJobByServiceJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}/completions",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceGetServiceJobs: {
    url: "/service/v1/serviceJobs",
    method: "GET",
    rateLimit: 10,
    burstLimit: 40,
  },
  serviceAddAppointmentForServiceJobByServiceJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}/appointments",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceRescheduleAppointmentForServiceJobByServiceJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}/appointments/{appointmentId}",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceAssignAppointmentResources: {
    url: "/service/v1/serviceJobs/{serviceJobId}/appointments/{appointmentId}/resources",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 2,
  },
  serviceSetAppointmentFulfillmentData: {
    url: "/service/v1/serviceJobs/{serviceJobId}/appointments/{appointmentId}/fulfillment",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceGetRangeSlotCapacity: {
    url: "/service/v1/serviceResources/{resourceId}/capacity/range",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceGetFixedSlotCapacity: {
    url: "/service/v1/serviceResources/{resourceId}/capacity/fixed",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceUpdateSchedule: {
    url: "/service/v1/serviceResources/{resourceId}/schedules",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceCreateReservation: {
    url: "/service/v1/reservation",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceUpdateReservation: {
    url: "/service/v1/reservation/{reservationId}",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceCancelReservation: {
    url: "/service/v1/reservation/{reservationId}",
    method: "DELETE",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceGetAppointmmentSlotsByJobId: {
    url: "/service/v1/serviceJobs/{serviceJobId}/appointmentSlots",
    method: "GET",
    rateLimit: 5,
    burstLimit: 20,
  },
  serviceGetAppointmentSlots: {
    url: "/service/v1/appointmentSlots",
    method: "GET",
    rateLimit: 20,
    burstLimit: 40,
  },
  serviceCreateServiceDocumentUploadDestination: {
    url: "/service/v1/documents",
    method: "POST",
    rateLimit: 5,
    burstLimit: 20,
  },
  brazilGetShipmentDetails: {
    url: "/fba/outbound/brazil/v0/shipments/{shipmentId}",
    method: "GET",
    rateLimit: 1.133,
    burstLimit: 25,
  },
  brazilSubmitInvoice: {
    url: "/fba/outbound/brazil/v0/shipments/{shipmentId}/invoice",
    method: "POST",
    rateLimit: 1.133,
    burstLimit: 25,
  },
  brazilGetInvoiceStatus: {
    url: "/fba/outbound/brazil/v0/shipments/{shipmentId}/invoice/status",
    method: "GET",
    rateLimit: 1.133,
    burstLimit: 25,
  },
  shippingCreateShipment: {
    url: "/shipping/v1/shipments",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingGetShipment: {
    url: "/shipping/v1/shipments/{shipmentId}",
    method: "GET",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingCancelShipment: {
    url: "/shipping/v1/shipments/{shipmentId}/cancel",
    method: "PUT",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingPurchaseLabels: {
    url: "/shipping/v1/shipments/{shipmentId}/purchaseLabels",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingRetrieveShippingLabel: {
    url: "/shipping/v1/shipments/{shipmentId}/containers/{trackingId}/label",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingPurchaseShipment: {
    url: "/shipping/v1/purchaseShipment",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingGetRates: {
    url: "/shipping/v1/rates",
    method: "POST",
    rateLimit: 5,
    burstLimit: 15,
    restricted: true,
  },
  shippingGetAccount: {
    url: "/shipping/v1/account",
    method: "GET",
    rateLimit: 5,
    burstLimit: 15,
  },
  shippingGetTrackingInformation: {
    url: "/shipping/v1/tracking/{trackingId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  solicitationsGetSolicitationActionsForOrder: {
    url: "/solicitations/v1/orders/{amazonOrderId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 5,
  },
  solicitationsCreateProductReviewAndSellerFeedbackSolicitation: {
    url: "/solicitations/v1/orders/{amazonOrderId}/solicitations/productReviewAndSellerFeedback",
    method: "POST",
    rateLimit: 1,
    burstLimit: 5,
  },
  supplySourcesGetSupplySources: {
    url: "/supplySources/2020-07-01/supplySources",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  supplySourcesCreateSupplySource: {
    url: "/supplySources/2020-07-01/supplySources",
    method: "POST",
    rateLimit: 1,
    burstLimit: 1,
  },
  supplySourcesGetSupplySource: {
    url: "/supplySources/2020-07-01/supplySources/{supplySourceId}",
    method: "GET",
    rateLimit: 1,
    burstLimit: 1,
  },
  supplySourcesUpdateSupplySource: {
    url: "/supplySources/2020-07-01/supplySources/{supplySourceId}",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 1,
  },
  supplySourcesArchiveSupplySource: {
    url: "/supplySources/2020-07-01/supplySources/{supplySourceId}",
    method: "DELETE",
    rateLimit: 1,
    burstLimit: 1,
  },
  supplySourcesUpdateSupplySourceStatus: {
    url: "/supplySources/2020-07-01/supplySources/{supplySourceId}/status",
    method: "PUT",
    rateLimit: 1,
    burstLimit: 1,
  },
  tokensCreateRestrictedDataToken: {
    url: "/tokens/2021-03-01/restrictedDataToken",
    method: "POST",
    rateLimit: 1,
    burstLimit: 10,
  },
  uploadsCreateUploadDestinationForResource: {
    url: "/uploads/2020-11-01/uploadDestinations/{resource}",
    method: "POST",
    rateLimit: 10,
    burstLimit: 10,
  },
  searchDefinitionsProductTypes: {
    url: "/definitions/2020-09-01/productTypes",
    method: "GET",
    rateLimit: 5,
    burstLimit: 10,
  },
  getDefinitionsProductType: {
    url: "/definitions/2020-09-01/productTypes/{productType}",
    method: "GET",
    rateLimit: 5,
    burstLimit: 10,
  },
};
