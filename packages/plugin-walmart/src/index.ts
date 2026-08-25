import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerWalmartTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "walmart",
  registerTemplate: registerWalmartTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerWalmartTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/feeds/itemFeedTypes.js";
export * from "./requests/feeds/types.js";
export * from "./requests/inventory/types.js";
export * from "./requests/items/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/pricing/types.js";
export * from "./requests/returns/types.js";
export * from "./requests/types.js";
