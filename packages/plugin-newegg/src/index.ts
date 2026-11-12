import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";
import {
  registerNeweggTemplate,
  registerNeweggBusinessTemplate,
} from "./client.js";

// Two templates, one API surface: the consumer and business marketplaces
// take separate credentials but share every request function.
export default definePlugin({
  name: "newegg",
  registerTemplate: async (handler) => {
    await registerNeweggTemplate(handler);
    await registerNeweggBusinessTemplate(handler);
  },
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export {
  registerNeweggTemplate,
  registerNeweggBusinessTemplate,
} from "./client.js";
export * from "./requests/index.js";

export * from "./requests/feeds/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/pricing/types.js";
export * from "./requests/returns/types.js";
export * from "./requests/sellerManagement/types.js";
export * from "./requests/types.js";
