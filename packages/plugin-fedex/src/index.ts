import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerFedexTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "fedex",
  registerTemplate: registerFedexTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerFedexTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/addressValidation/types.js";
export * from "./requests/consolidation/types.js";
export * from "./requests/dutiesAndTaxes/types.js";
export * from "./requests/endOfDayClose/types.js";
export * from "./requests/globalTrade/types.js";
export * from "./requests/harmonizedCode/types.js";
export * from "./requests/locationSearch/types.js";
export * from "./requests/openShip/types.js";
export * from "./requests/packageTracking/types.js";
export * from "./requests/pickupRequest/types.js";
export * from "./requests/postalCodeValidation/types.js";
export * from "./requests/purchaser/types.js";
export * from "./requests/ratesAndTransitTimes/types.js";
export * from "./requests/regulatory/types.js";
export * from "./requests/serviceAvailability/types.js";
export * from "./requests/shipping/types.js";
export * from "./requests/tradeDocuments/types.js";
export * from "./requests/types.js";

// Defined by more than one endpoint family with different shapes; the barrel
// exports the general one and the others stay on their own module path.
export type { CustomsClearanceDetail } from "./requests/purchaser/types.js";
