# @dianemo/plugin-google

Google APIs plugin

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-google ioredis
```

## Setup

This reads and writes a Google Sheet as a service account. Share the spreadsheet with the service
account's email first; a service account owns no Drive storage and sees only what is shared with it.

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import google from "@dianemo/plugin-google";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(google);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("google", {
  instanceId: "main",
  // Required by the credentials type; a service account has no profile
  // sub-client, so nothing is called on it.
  baseUrl: "https://www.googleapis.com",
  // The `client_email` and `private_key` of the service account's JSON key.
  serviceAccountEmail: process.env.GOOGLE_SA_EMAIL!,
  privateKey: process.env.GOOGLE_SA_PRIVATE_KEY!,
  // Read and write. Reading alone needs only
  // "https://www.googleapis.com/auth/spreadsheets.readonly".
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// "google:_:main" — <template>:<organizationId | "_">:<instanceId>. Pass the
// account name as it comes out of buildClientName: each request routes itself
// to the sub-client it belongs on.
const client = buildClientName("google", { instanceId: "main" });

const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

// Read: the spreadsheet's sheets, without their cell data.
const spreadsheet = await requests.google.getSpreadsheet(
  client,
  spreadsheetId,
  {
    fields: "spreadsheetId,properties.title,sheets.properties",
  }
);

// Write: append two rows below the table in A1:C. Google requires
// `valueInputOption`.
await requests.google.appendValues(
  client,
  spreadsheetId,
  "Sheet1!A1:C",
  {
    values: [
      ["2026-11-18", "widget", 3],
      ["2026-11-19", "gadget", 5],
    ],
  },
  { valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS" }
);
```

Beneath the account client the template registers a sub-client per host and quota —
`addressValidation`, `sheetsRead` and `sheetsWrite` (service-account and OAuth accounts; Sheets takes no
API key) and `profile` (OAuth accounts only). You never name
one: every request appends its own segment, so passing the account name is always right.

The Sheets calls are the whole of Google's Sheets API v4: seven reads on `sheetsRead`
(`getSpreadsheet`, `getSpreadsheetByDataFilter`, `getValues`, `batchGetValues`,
`batchGetValuesByDataFilter`, `getDeveloperMetadata`, `searchDeveloperMetadata`) and ten writes on
`sheetsWrite` (`createSpreadsheet`, `batchUpdateSpreadsheet`, `updateValues`, `appendValues`,
`batchUpdateValues`, `batchUpdateValuesByDataFilter`, `clearValues`, `batchClearValues`,
`batchClearValuesByDataFilter`, `copySheetTo`). Request and response types are exported with
Google's own names (`Spreadsheet`, `ValueRange`, `CellData`, `BatchUpdateSpreadsheetRequest`, and so
on), importable from `@dianemo/plugin-google` as types; they are generated from Google's discovery
document in `src/requests/sheets/schemas.ts`. Every call takes an
optional `fields` mask, and `getSpreadsheet` also takes `commentsViewMode`.
Each is metered at Google's 60 requests per minute per user per project, reads and writes apart.
Failures raise `GGL_0009` (not found or not shared, 403 and 404), `GGL_0010` (400), `GGL_0011`
(quota, 429), `GGL_0012` (anything else, including a token missing the needed scope) or `GGL_0013`
(Google sign-in failed: the token endpoint refused the credentials); see [the error table](docs/google-api.md#google-sheets-api-v4-errors).

### Address Validation with an API key

```ts
await handler.addTemplateClient("google", {
  instanceId: "maps",
  baseUrl: "https://www.googleapis.com",
  // A Google Cloud API key, sent as `?key=`. This is what Address Validation
  // takes for server-to-server use.
  apiKey: process.env.GOOGLE_API_KEY!,
  // Optional; defaults to "https://addressvalidation.googleapis.com".
  // addressValidationBaseUrl: "https://addressvalidation.googleapis.com",
});

const validated = await requests.google.validateAddress(
  buildClientName("google", { instanceId: "maps" }),
  {
    address: {
      regionCode: "US",
      addressLines: ["1600 Amphitheatre Pkwy"],
      locality: "Mountain View",
      administrativeArea: "CA",
      postalCode: "94043",
    },
  }
);
```

## Credentials

Give the account an `apiKey`, a `clientId`/`clientSecret` pair, or a service account
(`serviceAccountEmail` + `privateKey` + `scopes`). A service account and an OAuth pair are mutually
exclusive and registering both is refused; an `apiKey` can accompany either, and Address Validation
then uses the key. A registration carrying none is refused, because every request on it would come
back 401. A half-given service account, or one without `scopes`, is refused too.

| Credential                           | Serves                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `apiKey`                             | Address Validation, with no user in the loop.                           |
| `clientId` + `clientSecret`          | `getGoogleProfile`, and Address Validation on a signed-in user's token. |
| `serviceAccountEmail` + `privateKey` | Server-to-server calls signed as a service account, with `scopes`.      |

There is no client-credentials path.
[Google's discovery document](https://accounts.google.com/.well-known/openid-configuration) lists
four grant types — `authorization_code`, `refresh_token`, `device_code` and `jwt-bearer` — so the
token endpoint answers `unsupported_grant_type` before it looks at the credentials. Google's own
server-to-server credential is a
[service account](https://developers.google.com/identity/protocols/oauth2/service-account), whose
JWT assertion expires "a maximum of 1 hour after the issued time" and so is re-signed for every
refresh by an interceptor on the client's refresh config. That needs `@dianemo/core` 2.1.1 or later.

## Calling as a service account

`serviceAccountEmail` and `privateKey` are the `client_email` and `private_key` of the service
account's JSON key; `scopes` lists the OAuth scopes to request (see [Setup](#setup)). No grant is
seeded. The first call signs an assertion and exchanges it for a token, and later calls refresh it
the same way. A service-account account has no `profile` sub-client, since userinfo needs a
signed-in user. `getGoogleProfile` and a user's `validateAddress` need an OAuth account instead.

Writing needs `https://www.googleapis.com/auth/spreadsheets` (or `drive.file`,
for files the app created or the user opened with it) in `scopes`; the read-only
scope above only covers the read calls. Write calls are not retried on a 5xx,
timeout or dropped connection, so a repeated call cannot append twice
([details](docs/google-api.md#writes-are-not-retried)). A service account owns no
Drive storage, so share an existing spreadsheet with its email rather than
relying on `createSpreadsheet`
([details](docs/google-api.md#creating-a-spreadsheet-as-a-service-account)).

## Calling as a signed-in user

`getGoogleProfile` reads the OpenID Connect userinfo endpoint, which only accepts a user's token.
Exchange the authorization code your callback receives, seed the resulting refresh token as a grant
on the **account** client — one seeding covers both sub-clients — then name that grant on the call:

```ts
const { refresh_token, access_token, expires_in } =
  await requests.google.exchangeAuthCodeForRefreshToken({
    code: authorizationCode,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "https://example.com/oauth/google/callback",
  });

// Google only issues one when the consent request asked for offline access.
if (!refresh_token) throw new Error("Google returned no refresh token");

// `grantId` is your own identifier for the user. Google's own `sub` works, and
// is a 21-digit string rather than a number.
const grantId = "117253196834402457531";

await handler.setGrantTokens(client, grantId, {
  accessToken: access_token,
  expiresAt: Date.now() + expires_in * 1000,
  refreshToken: refresh_token,
  // Google gives no expiry for a user refresh token, so pick a horizon. Six
  // months matches the documented inactivity rule ("the refresh token has not
  // been used for six months"); use 7 days instead while your OAuth consent
  // screen is still in Testing, which is how long tokens issued then last.
  refreshTokenExpiresAt: Date.now() + 182 * 24 * 60 * 60 * 1000,
});

const profile = await requests.google.getGoogleProfile(client, grantId);

// Address Validation on the user's token instead of an API key.
await requests.google.validateAddress(
  client,
  { address: { regionCode: "US", addressLines, locality, postalCode } },
  { grantId }
);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/google-api.md`](docs/google-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
