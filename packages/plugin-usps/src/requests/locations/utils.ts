type QueryValue = string | number | boolean | string[] | undefined;

/**
 * Core's `params` is `Record<string, string>`, so numbers are stringified, and
 * array filters are joined with commas as the spec's `explode: false` asks.
 */
export const locationQuery = (params: object): Record<string, string> => {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params) as [string, QueryValue][]) {
    // An empty list would be sent as `key=`, which USPS reads as an empty
    // filter rather than no filter.
    if (value === undefined || (Array.isArray(value) && value.length === 0))
      continue;
    query[key] = Array.isArray(value) ? value.join(",") : String(value);
  }
  return query;
};
