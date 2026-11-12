import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerEbayTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "ebay",
  registerTemplate: registerEbayTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerEbayTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/account/types.js";
export * from "./requests/types.js";
export * from "./requests/fulfillment/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/listing/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/taxonomy/types.js";
