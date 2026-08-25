import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerAmazonSpapiTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "amazonSpapi",
  registerTemplate: registerAmazonSpapiTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerAmazonSpapiTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/auth/types.js";
export * from "./requests/fba/types.js";
export * from "./requests/feeds/types.js";
export * from "./requests/financial/types.js";
export * from "./requests/fullfillments/inbound/v0/types.js";
export * from "./requests/fullfillments/inbound/v2024-03-20/types.js";
export * from "./requests/listings/types.js";
export * from "./requests/awd/types.js";
export * from "./requests/orders/types.js";
export * from "./requests/ordersV2/types.js";
export * from "./requests/productTypes/types.js";
export * from "./requests/reports/types.js";
export * from "./requests/sellers/types.js";
export * from "./requests/shipping/types.js";
export * from "./requests/supplySource/types.js";
export * from "./requests/types.js";

// Defined by more than one endpoint family with different shapes; the barrel
// exports the general one and the others stay on their own module path.
export type { PackageDetail } from "./requests/orders/types.js";
export type { AmazonAddress } from "./requests/orders/types.js";
