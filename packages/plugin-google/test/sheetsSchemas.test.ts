import { describe, expectTypeOf, it } from "vitest";
import type {
  AddTableRequest,
  UpdateSheetPropertiesRequest,
} from "../src/requests/sheets/schemas.js";

// These checks are compile-time: tsc reports them, and the runtime assertions
// are empty. A missing `@ts-expect-error` target or a wrong type fails tsc.
describe("required Sheets request fields", () => {
  it("requires fields on UpdateSheetPropertiesRequest", () => {
    // @ts-expect-error fields is required: Google says at least one field must be specified
    const missing: UpdateSheetPropertiesRequest = {};
    void missing;
    expectTypeOf<
      UpdateSheetPropertiesRequest["fields"]
    >().toEqualTypeOf<string>();
  });

  it("requires table on AddTableRequest", () => {
    // @ts-expect-error table is required: Google says "Required."
    const missing: AddTableRequest = {};
    void missing;
  });

  it("accepts a complete UpdateSheetPropertiesRequest", () => {
    const complete: UpdateSheetPropertiesRequest = { fields: "title" };
    expectTypeOf(complete).toEqualTypeOf<UpdateSheetPropertiesRequest>();
  });
});
