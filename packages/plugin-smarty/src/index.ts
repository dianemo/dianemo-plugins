import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerSmartyTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "smarty",
  registerTemplate: registerSmartyTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerSmartyTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/types.js";
export * from "./requests/intlAutocomplete/types.js";
export * from "./requests/usAutocomplete/types.js";
export * from "./requests/usExtract/types.js";
export * from "./requests/usReverseGeo/types.js";
export * from "./requests/usZipcode/types.js";
