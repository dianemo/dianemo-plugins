import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerWayfairTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "wayfair",
  registerTemplate: registerWayfairTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerWayfairTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/fulfillment/types.js";
export * from "./requests/orders/types.js";
