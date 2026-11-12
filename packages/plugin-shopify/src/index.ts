import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerShopifyTemplate } from "./client.js";
import { definePlugin } from "@dianemo/core";
import requests from "./requests/index.js";

export default definePlugin({
  name: "shopify",
  registerTemplate: registerShopifyTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerShopifyTemplate } from "./client.js";
export { default as requests } from "./requests/index.js";

export * from "./requests/bulkOperation/types.js";
export * from "./requests/companies/types.js";
export * from "./requests/companyContacts/types.js";
export * from "./requests/companyLocations/types.js";
export * from "./requests/customers/types.js";
export * from "./requests/draftOrders/types.js";
export * from "./requests/fulfillmentOrders/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/metafields/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/priceLists/types.js";
export * from "./requests/returns/types.js";
export * from "./requests/pricing/types.js";
export * from "./requests/types.js";
export * from "./requests/webhooks/types.js";
