/**
 * Renders a value as a GraphQL string literal, escaped. Interpolating a caller's
 * string straight into a query lets one `"` end the literal and hand Wayfair the
 * remainder as query text: `2026-01-01", field: poDate, equals: "` rewrites the
 * filter it was meant to fill in. GraphQL's string escapes are JSON's.
 *
 * Variables are the better way where the schema's own type names are known, and
 * for `getDropshipPurchaseOrders` they now are — see
 * docs/wayfair-api.md#getdropshippurchaseorders-is-the-order-read. This stays for
 * a query whose scalars have not been established.
 */
const gqlString = (value: string): string => JSON.stringify(value);

export default gqlString;
