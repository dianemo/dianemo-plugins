import RequestHandler, { memoryBackend } from "@dianemo/core";
import shopify from "@dianemo/plugin-shopify";
import { TEST_KEY } from "./fixtures/key.js";
import { expectTypeOf, it } from "vitest";
import fedex from "@dianemo/plugin-fedex";
import ups from "@dianemo/plugin-ups";

const handler = new RequestHandler({ key: TEST_KEY, backend: memoryBackend() });

it("infers a distinct namespace per composed plugin", () => {
  const requests = handler.use(fedex, shopify, ups);

  expectTypeOf(requests).toHaveProperty("fedex");
  expectTypeOf(requests).toHaveProperty("shopify");
  expectTypeOf(requests).toHaveProperty("ups");
  // A plugin that was not composed must not appear.
  expectTypeOf(requests).not.toHaveProperty("walmart");

  // Every request function takes the client name first — the contract that
  // makes a plugin usable against more than one registered account.
  expectTypeOf(requests.fedex.cancelShipment)
    .parameter(0)
    .toEqualTypeOf<string>();
  expectTypeOf(requests.ups.trackPackage).parameter(0).toEqualTypeOf<string>();
});
