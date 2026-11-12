import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerUpsTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "ups",
  registerTemplate: registerUpsTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerUpsTemplate } from "./client.js";
export * from "./requests/index.js";

export * from "./requests/addressValidation/types.js";
export * from "./requests/commerceGuard/types.js";
export * from "./requests/customsDetail/types.js";
export * from "./requests/dangerousGoods/types.js";
export * from "./requests/deliveryDefense/types.js";
export * from "./requests/deliveryIntercept/types.js";
export * from "./requests/descriptionGuidance/types.js";
export * from "./requests/exportAssure/types.js";
export * from "./requests/forwarding/types.js";
export * from "./requests/guaranteedQuote/types.js";
export * from "./requests/landedCost/types.js";
export * from "./requests/locator/types.js";
export * from "./requests/packageTracking/types.js";
export * from "./requests/paperlessDocuments/types.js";
export * from "./requests/pickup/types.js";
export * from "./requests/pickupNotificationPreferences/types.js";
export * from "./requests/pickupPoints/types.js";
export * from "./requests/preNotification/types.js";
export * from "./requests/protectedDeliveryToken/types.js";
export * from "./requests/quantumView/types.js";
export * from "./requests/rating/types.js";
export * from "./requests/shipping/types.js";
export * from "./requests/smartPickup/types.js";
export * from "./requests/supplyChainSymphony/types.js";
export * from "./requests/timeInTransit/types.js";
export * from "./requests/trackAlert/types.js";
export * from "./requests/tradeDirect/types.js";
export * from "./requests/worldEase/types.js";
export * from "./requests/types.js";

// Defined by more than one endpoint family with different shapes; the barrel
// exports the general one and the others stay on their own module path.
export type { UpsAddress } from "./requests/shipping/types.js";
