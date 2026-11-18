import type {
  BatchUpdateValuesRequest,
  DataFilterValueRange,
} from "./schemas.js";

/**
 * Option unions the read and write calls share, derived from Google's own
 * types so they cannot drift. The `*_UNSPECIFIED` members are dropped: Google
 * rejects them as input.
 */
type Specified<T> = Exclude<
  NonNullable<T>,
  "DIMENSION_UNSPECIFIED" | "INPUT_VALUE_OPTION_UNSPECIFIED"
>;

export type MajorDimension = Specified<DataFilterValueRange["majorDimension"]>;
export type ValueRenderOption = NonNullable<
  BatchUpdateValuesRequest["responseValueRenderOption"]
>;
export type DateTimeRenderOption = NonNullable<
  BatchUpdateValuesRequest["responseDateTimeRenderOption"]
>;
export type ValueInputOption = Specified<
  BatchUpdateValuesRequest["valueInputOption"]
>;
/** Google defines no schema for it, only a query parameter. */
export type InsertDataOption = "OVERWRITE" | "INSERT_ROWS";
