# Google APIs

Findings behind `@dianemo/plugin-google` — OpenID Connect userinfo, Address
Validation, Google Sheets API v4, service-account sign-in, and the Maps quotas
that shape how one client spans several Google APIs.

**The OAuth model below is common to both Google packages.**
`@dianemo/plugin-google-vertex-ai` is built on the same service-account flow and
cites the two sections that follow rather than restating them — see
[`plugin-google-vertex-ai/docs/vertex-ai-api.md`](../../plugin-google-vertex-ai/docs/vertex-ai-api.md).

Every URL below was checked on 2026-08-25, except those in the Google Sheets
sections, which were checked on 2026-11-18.

## No grant bootstraps from a client id and secret

Google's discovery document lists exactly four grant types:

```
authorization_code
refresh_token
urn:ietf:params:oauth:grant-type:device_code
urn:ietf:params:oauth:grant-type:jwt-bearer
```

<https://accounts.google.com/.well-known/openid-configuration>

There is no `client_credentials`, so a client built on that grant gets
`unsupported_grant_type` from the token endpoint and can never authenticate at
all. None of the four it _does_ offer bootstraps from a `clientId`/`clientSecret`
pair on its own either:

| grant                | what it additionally needs                           |
| -------------------- | ---------------------------------------------------- |
| `authorization_code` | a user at a browser                                  |
| `refresh_token`      | a token already stored from a previous grant         |
| `device_code`        | a user at a browser                                  |
| `jwt-bearer`         | a service-account assertion, re-signed every refresh |

**Consequence for a plugin.** A Google client-level `refreshConfig` has nothing
it can be given that will mint a first token — except the jwt-bearer assertion,
which needs a hook that runs per refresh (see below). `plugin-google` therefore
declares a client-level config that deliberately omits the `refresh_token` it
cannot obtain, so a grant-less call fails at Google with `invalid_request` naming
the missing field, rather than shipping the literal `{{refreshToken}}` as a
credential. `plugin-google-vertex-ai` goes the other way and signs an assertion.

`{{refreshToken}}` itself only ever resolves on a _grant_ config; that is core's
behaviour, not Google's — see
[`/docs/core-behaviour.md`](../../../docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh).

## Service-account (JWT-bearer) flow

The service account is the credential this flow rests on; `plugin-google` and
`plugin-google-vertex-ai` both ship it.
`serviceAccountEmail` is the `client_email` from the service-account JSON key and
`privateKey` its `private_key`. The IAM roles the engine needs are in
[that package's doc](../../plugin-google-vertex-ai/docs/vertex-ai-api.md#authentication).

The assertion is an RS256 JWT, header/claim set/algorithm exactly as Google
documents them: `{"alg":"RS256","typ":"JWT"}` over `iss` (the service-account
email), `scope`, `aud` (the token URL), `iat` and `exp`, signed SHA256withRSA,
then posted to `https://oauth2.googleapis.com/token` as
`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<jwt>`.

<https://developers.google.com/identity/protocols/oauth2/service-account>

Three things about it are not visible from the code:

- **`exp` has a documented maximum.** It "has a maximum of 1 hour after the
  issued time", and Google rejects an `exp` more than 65 minutes past `iat`. So
  `ASSERTION_TTL_SECONDS = 3600` is a ceiling, not a tunable — raising it makes
  every refresh fail.
- **Private keys usually arrive with escaped newlines.** Lifted out of the JSON
  key by hand, or passed through an env var, `private_key` comes through as
  `-----BEGIN PRIVATE KEY-----\n…`. `crypto.createSign().sign()` rejects that as
  a malformed PEM, so it is unescaped before signing.
- **It is signed with `node:crypto`, not a JWT library.** Rejected
  `jsonwebtoken`: this is the only JWT in the package, the format is a dozen
  lines of it, and `jsonwebtoken` is not a runtime dependency anywhere in this
  repo. `plugin-kit` and `plugin-walmart` already reach for `node:crypto` the
  same way.

**The assertion has to be minted per refresh** — it lives an hour, so a client
that outlives it would otherwise send an expired one forever. The hook that runs
per refresh is `refreshConfig.requestInterceptor`. On `@dianemo/core` 2.1.1 it is
an ordinary **enumerable** function property: core deep-copies the config with
`deepCloneWithFunctions` (`dist/utils/deepClone.js`, a `for…in` copy, so it keeps
enumerable keys and drops non-enumerable ones) and calls the interceptor on the
copy in `handleRefreshMethod` (`dist/client/methods/authenticate.js`). That is why
`plugin-google` raised its `@dianemo/core` peer to `^2.1.1`.
`plugin-google-vertex-ai` still defines its interceptor non-enumerable, a trick
from core 1.0.0, where `structuredClone` threw `DataCloneError` on a function
([`/docs/core-behaviour.md`](../../../docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function));
under 2.1.1 the clone drops that key, so its interceptor does not run. Do not copy
it. `test/realHandler.test.ts` proves the enumerable form runs, by reading the
assertion off a real token request.

`plugin-google` ships this for its own template: give the account
`serviceAccountEmail`, `privateKey` and `scopes` (and `tokenUrl`, an override for
tests) in place of an OAuth pair. The block is `{ type: "oauth2", clientId:
serviceAccountEmail, clientSecret: "", refreshConfig }` with no
`grantRefreshConfig`, and sub-clients inherit it from the account client. Address
Validation still takes the API-key path, which needs no scopes.

<https://developers.google.com/maps/documentation/address-validation/get-api-key>

## OpenID Connect userinfo

<https://developers.google.com/identity/openid-connect/openid-connect>
· <https://developers.google.com/identity/openid-connect/reference>

Only `sub` is guaranteed on the response. Every other claim depends on the scopes
the user granted — `email`/`email_verified` need `email`; `name`, `given_name`,
`family_name`, `picture` and `locale` need `profile`; `hd` appears only for
accounts in a Google Workspace or Cloud organization. A granted scope is not a
guarantee either: Google warns that "users or their organizations may choose to
supply or withhold certain fields".

**`sub` is a string, and must stay one.** It is a 21-digit decimal, which is past
the range a JS number represents exactly. Anything keyed by a Google account id
— `getGoogleProfile`'s `userId`, which is the grant id — is a string for the same
reason.

**The Google+ era fields are gone.** This response type used to declare `id`,
`link` and `gender`; all three were removed when the Google+ API shut down and no
current endpoint returns them. `sub` is the replacement for `id`.

**The host is a legacy alias, unverified.** `getGoogleProfile` calls
`/oauth2/v3/userinfo` through the account's `baseUrl`, i.e.
`www.googleapis.com/oauth2/v3/userinfo`. Google's current reference and its
discovery document name only `openidconnect.googleapis.com/v1/userinfo`. The
alias still _appears_ to be served, but that could not be confirmed without a
live authenticated call — so this is inferred, not documented, and moving to the
documented host is left as a deliberate separate change.

## OpenID Connect userinfo has no published quota

`plugin-google`'s account client meters at **600 requests/minute**. That figure
is a self-imposed backstop and **not a vendor figure**: Google publishes no QPM
for the userinfo endpoint, and the one OAuth limit it does document — the
new-user authorization rate — is given as "dependent on application history,
developer reputation, and riskiness" with no number attached, so there is nothing
to encode. 600/min sits far above any sign-in-driven workload while still
bounding a runaway loop. Replace it if Google ever publishes a real number; do
not read it as one.

<https://support.google.com/cloud/answer/9028764>
· <https://developers.google.com/identity/openid-connect/reference>

## Address Validation quotas

"There's a maximum request limit of 6,000 queries per minute for the validation
methods and another 6,000 QPM limit for feedback methods".

<https://developers.google.com/maps/documentation/address-validation/usage-and-billing>
· <https://developers.google.com/maps/documentation/address-validation/faq>

**What the quote settles: the split is by method _group_.** Validation methods
share one 6,000 QPM allowance and feedback methods have a separate one of the
same size — not one budget per method, and not one per region. This plugin calls
only a validation method, so a single 6,000 QPM bucket is the right _shape_, and
the feedback methods would need their own bucket if they were ever added.

**Open question: what the quota is scoped to.** The scope the bucket should be
keyed on — per Cloud project, per API key, or per billing account — is _not_
stated in either page above. "Metered per project" is the reasonable reading, by
analogy with Discovery Engine and Maps, both of which say "per project"
explicitly; but for Address Validation it is **inferred, not documented**, and it
has not been confirmed against a console Quotas page or a support answer.

This matters because the plugin buckets per _registered account_: one
`registerClientTemplate` call, one 6,000 QPM budget. If the real scope is the
Cloud project, then two accounts registered against one project each meter to
6,000 and can overrun it together — the same trap written up under
[Vertex AI Search](#vertex-ai-search-discovery-engine-quotas), where the
per-project scope _is_ documented. Resolving it needs the Quotas page for
Address Validation on a live project, read against two keys in one project.

## Google Maps Platform quotas

Nothing in this repo meters against these figures today. Kept because the shape
of the problem recurs whenever one client spans several Google APIs, and because
re-deriving it cost real time:

"The geocoding service is rate limited to 3,000 QPM (queries per minute),
calculated as the sum of client-side and server-side queries."

<https://developers.google.com/maps/documentation/geocoding/usage-and-billing>

**Quotas are held per project but configured per API** — the console's Quotas
page has you pick the API before editing a value — so a single client covering
every method under `/maps/api` spans several independent budgets rather than one.
Metering the lot at the tightest figure is the only single-bucket shape that
cannot overrun any of them.

Two traps worth carrying forward: the 6,000/min this replaced was double the
documented figure, and Google also enforces a per-second rate, so a burst can 429
below the per-minute ceiling.

## API-key injection

`plugin-google`'s Address Validation sub-client carries its API key in the query
string, and assigns it onto `config.params` rather than concatenating `?key=…`
onto `config.url` — verified on the wire, the key arrives exactly once. Four
failure modes of the string-concatenation version:

1. **`key=K&key=K` on the first retry.** Core re-runs a request interceptor on
   every attempt, against the config it already mutated — so one transient 500
   is enough. This is the non-local one, and the reason the code carries a note.
2. **A duplicate key** where the caller already supplied a `?key=`.
3. **The key inside a URL fragment**, if the url carries a `#`.
4. **A literal `key=undefined`** where the credential is absent, which reaches
   Google as a request with a malformed key rather than none.

Assigning on the params object is idempotent and immune to all four.

Where the key is used, the inherited OAuth block must also be cleared
(`authentication: undefined`). Leaving it in place has every call refresh a token
it does not send.

## Google Sheets API v4 calls

All 17 methods of the Sheets v4 REST API, on the Sheets host
(`sheetsBaseUrl`, default `https://sheets.googleapis.com`).

| Group       | Sub-client    | Calls                                                                                                                                                                                                                 |
| ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reads (7)   | `sheetsRead`  | `getSpreadsheet`, `getSpreadsheetByDataFilter`, `getValues`, `batchGetValues`, `batchGetValuesByDataFilter`, `getDeveloperMetadata`, `searchDeveloperMetadata`                                                        |
| Writes (10) | `sheetsWrite` | `createSpreadsheet`, `batchUpdateSpreadsheet`, `updateValues`, `appendValues`, `batchUpdateValues`, `batchUpdateValuesByDataFilter`, `clearValues`, `batchClearValues`, `batchClearValuesByDataFilter`, `copySheetTo` |

The option unions the calls share (`MajorDimension`, `ValueRenderOption`,
`DateTimeRenderOption`, `ValueInputOption`, `InsertDataOption`) live in
`src/requests/sheets/options.ts` and are exported.

**Scopes.** Reads need `https://www.googleapis.com/auth/spreadsheets.readonly`
(or `spreadsheets`, `drive.readonly`, `drive`); writes need
`https://www.googleapis.com/auth/spreadsheets` (or `drive`, or `drive.file` for
files the app created or the user opened with it). A service account's `scopes`
must name one that covers the calls it makes.

<https://developers.google.com/workspace/sheets/api/scopes>

**Dates come back as serial numbers, not text.** In a cell's `effectiveValue`,
a `DATE` or `DATE_TIME` cell (`effectiveFormat.numberFormat.type`, or
`userEnteredFormat.numberFormat.type`) holds a `numberValue`: a serial number of
days since 1899-12-30, with the time of day as the fraction, in the
**spreadsheet's own time zone** (`properties.timeZone`), not UTC. Convert with
that time zone before treating it as an instant. `formattedValue` is the
display text and depends on the cell's format and locale. Through the values
calls the same cell is a string or a number depending on
`valueRenderOption` (`FORMATTED_VALUE`, `UNFORMATTED_VALUE`, `FORMULA`) and
`dateTimeRenderOption` (`SERIAL_NUMBER`, `FORMATTED_STRING`).

<https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/cells>
· <https://developers.google.com/workspace/sheets/api/reference/rest/v4/DateTimeRenderOption>

## Google Sheets API v4 types

`src/requests/sheets/schemas.ts` was produced once from Google's Discovery
document for Sheets v4 (`apis.getRest`, revision `20261111`; the response has no
`etag`) and is maintained by hand from here. Its type names match the discovery
`schemas`, so Google's reference pages map onto it directly. The document itself
is not kept in the repository.

<https://developers.google.com/discovery/v1/reference/apis>
· <https://discovery.googleapis.com/discovery/v1/apis/sheets/v4/rest>

Twenty request-only fields are required in the types (not optional) because Google's
descriptions say so: three say "Required.", fifteen update-mask `fields` say "At least one
field must be specified", and two comment `content` fields say they "cannot be empty". Only
request-only types get required fields, because Google's JSON omits fields that hold their
default value, so a response cannot be trusted to carry any field.

## Google Sheets API v4 quotas

"Read requests: 300 per minute per project; 60 per minute per user per
project. Write requests: 300 per minute per project; 60 per minute per user per
project." Reads and writes are metered apart.

<https://developers.google.com/sheets/api/limits> (fetched 2026-11-18)

The plugin declares one `requestLimit` of 60 per 60 s on each of the
`sheetsRead` and `sheetsWrite` sub-clients — the per-user figure, since a
registered account is one service account or one user. The 300 per project
figure is not enforced: two accounts registered against one Cloud project can
overrun it together, the same shape as the trap under
[Address Validation quotas](#address-validation-quotas). The parent's 600 per
60 s backstop is unchanged.

## Google Sheets API v4 errors

Every Sheets call raises one of these, with the HTTP status as `statusCode` and
in `metadata.status`, and Google's `error.status` string (for example
`PERMISSION_DENIED`) in `metadata.googleStatus`:

| Code       | When                                                                                                                                                  | Status     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `GGL_0009` | spreadsheet not found, or not shared with the account; Google answers both alike, so neither can this plugin                                          | 404, 403   |
| `GGL_0010` | invalid request                                                                                                                                       | 400        |
| `GGL_0011` | quota exceeded, after core's retries; also a 403 whose reason is `rateLimitExceeded`, `userRateLimitExceeded` or `RATE_LIMIT_EXCEEDED`                | 429, 403   |
| `GGL_0012` | any other failure, including one with no HTTP status; also a 403 whose reason is `SERVICE_DISABLED` or `accessNotConfigured` (Sheets API not enabled) | other, 403 |

Google uses 403 for three different failures, so a 403 is told apart by the
reasons in the body, read from `error.details[].reason` and the older
`error.errors[].reason` (case-insensitive). A body that is missing, not an
object, or has no string reasons leaves it `GGL_0009`. This mapping rests on the
reason strings Google documents for 403 in its Sheets and Drive error guides and
on the `google.rpc.ErrorInfo` convention, not on a captured response of every
kind.

Core logs a failure once, when `tryHandleRequest` first wraps it, so the log
line says `GGL_0012` whatever the status; the error a caller catches carries the
mapped code.

Array query parameters (`ranges`) are sent repeated (`ranges=A&ranges=B`), not
as axios's default `ranges[]=A`, through a `paramsSerializer`.

## Writes are not retried

`sheetsWrite` does not retry a 5xx, a timeout or a dropped connection: its
`retryOptions` set `retry5xxs: false` and a `classifyError` that fails any
response of 500 or more, or none at all, at once. Each of those can arrive after
Google applied the write, and repeating an `appendValues` adds its rows twice.
The caller gets the error (`GGL_0012`) and decides, for example by re-reading the
range before appending again. A 429 is still retried by core: Google rejects it
before doing any work, so repeating it is safe. `sheetsRead` keeps core's
defaults. `test/sheetsWrite.test.ts` proves it on a real socket: one hit for a
500, one for a dropped connection, two for a read that fails once.

## Creating a spreadsheet as a service account

Checked 2026-11-18. `createSpreadsheet` calls `spreadsheets.create`, which takes
no folder or parent and so cannot target a shared drive; the file is created in
the caller's own Drive. Google's pages say:

- The Sheets `spreadsheets.create` reference lists the scopes `drive`,
  `drive.file` and `spreadsheets`, and says nothing about where the file lands,
  who owns it, or service accounts
  (<https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/create>).
- The Drive shared-drives guide says service accounts "don't have storage
  quota" and cannot own files, and that they must put files in shared drives or
  use OAuth to act for a user
  (<https://developers.google.com/workspace/drive/api/guides/about-shareddrives>).

**Negative / uncertain result.** No official page says that
`spreadsheets.create` as a service account succeeds or fails, or names the error.
The Drive statement implies a service account with no storage cannot hold a new
file in its own Drive, so a bare `createSpreadsheet` as a service account may be
refused (Drive reports that class of failure as `storageQuotaExceeded`), but this
was not tested against Google and is not claimed. Placing a new file in a shared
drive needs the Drive API (`files.create` with `supportsAllDrives` and a
`parents` entry), which this plugin does not call. Until verified against a real
project, treat a service account as a writer to spreadsheets a person created and
shared with its email, and use user OAuth for `createSpreadsheet`.
