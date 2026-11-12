import type { FedExConsolidationCreateResponse } from "../src/requests/consolidation/types.js";
import type { FedExConsolidationAlert } from "../src/requests/consolidation/types.js";
import type { CreatePickupResponse } from "../src/requests/pickupRequest/types.js";
import type { FedExResponse } from "../src/requests/types.js";
import { describe, expect, expectTypeOf, it } from "vitest";

// No FedEx spec marks a response field required: docs/fedex-api.md#response-envelope.
describe("fedex shared response envelope", () => {
  it("accepts an empty response and an alert with no fields", () => {
    const empty: FedExResponse<{ x?: string }> = {};
    const bare: FedExResponse<{ x?: string }> = {
      output: { alerts: [{}] },
    };
    expect([empty, bare]).toHaveLength(2);
  });

  it("types output as optional, so reading it needs a guard", () => {
    expectTypeOf<CreatePickupResponse["output"]>().toEqualTypeOf<
      CreatePickupResponse["output"] | undefined
    >();
    expectTypeOf<CreatePickupResponse["transactionId"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  it("lets the consolidation output own its alerts rather than intersect them", () => {
    expectTypeOf<
      NonNullable<FedExConsolidationCreateResponse["output"]>["alerts"]
    >().toEqualTypeOf<FedExConsolidationAlert[] | undefined>();
  });
});
