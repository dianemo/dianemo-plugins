import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerUspsTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "usps",
  registerTemplate: registerUspsTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerUspsTemplate } from "./client.js";
export * from "./requests/index.js";

// The way out of a payment token USPS has stopped accepting: nothing else
// evicts one before its seven-hour TTL.
export { clearCachedPaymentToken } from "./utils/uspsPaymentTokenCache.js";
export * from "./requests/addresses/types.js";
export * from "./requests/adjustments/types.js";
export * from "./requests/appointments/types.js";
export * from "./requests/containers/types.js";
export * from "./requests/internationalLabels/types.js";
export * from "./requests/internationalPrices/types.js";
export * from "./requests/internationalServiceStandards/types.js";
export * from "./requests/labels/types.js";
export * from "./requests/locations/types.js";
export * from "./requests/logisticsShipments/types.js";
export * from "./requests/mailCampaigns/types.js";
export * from "./requests/ncoaDataServices/types.js";
export * from "./requests/openAndDistribute/types.js";
export * from "./requests/packageCampaigns/types.js";
export * from "./requests/payments/types.js";
export * from "./requests/pickups/types.js";
export * from "./requests/qrCode/types.js";
export * from "./requests/rates/types.js";
export * from "./requests/scanForms/types.js";
export * from "./requests/serviceStandards/types.js";
export * from "./requests/shipEnrollment/types.js";
export * from "./requests/shippingOptions/types.js";
export * from "./requests/subscriptions/types.js";
export * from "./requests/tracking/types.js";
export * from "./requests/userInfo/types.js";
