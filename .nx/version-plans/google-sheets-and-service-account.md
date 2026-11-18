---
"@dianemo/plugin-google": minor
---

Adds service-account sign-in and the whole of Google's Sheets API v4.

A Google account can now be registered with `serviceAccountEmail`, `privateKey` and
`scopes` instead of an OAuth pair; the assertion is re-signed on every refresh. The two
are mutually exclusive, and an `apiKey` can accompany either.

The 17 Sheets calls are on `requests.google`: seven reads (`getSpreadsheet`, `getValues`,
`batchGetValues`, and the data-filter and developer-metadata variants) on a `sheetsRead`
sub-client, and ten writes (`createSpreadsheet`, `batchUpdateSpreadsheet`, `updateValues`,
`appendValues`, the batch and clear variants, and `copySheetTo`) on `sheetsWrite`. Their
request and response types are exported with Google's own names. Each sub-client is
metered at Google's 60 requests per minute per user per project. Writes are not retried
on a 5xx, a timeout or a dropped connection, so a repeated call cannot append twice.
Failures raise `GGL_0009` (not found or not shared), `GGL_0010` (invalid request),
`GGL_0011` (quota) or `GGL_0012` (anything else).

BREAKING: the `@dianemo/core` peer dependency is now `^2.1.1`, the first release in which
a refresh-config interceptor survives core's deep copy. Upgrade `@dianemo/core` before
upgrading this package.
