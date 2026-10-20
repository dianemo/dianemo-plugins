# ChannelAdvisor REST API behaviour

Findings behind the numbers and the shapes in `@dianemo/plugin-channel-advisor`.

**A note on the sources.** ChannelAdvisor's developer documentation now
redirects into Rithum's Knowledge Center, whose article bodies render
client-side and so return nothing useful to a fetch. Every page cited below was
therefore read from the Internet Archive's capture of the original
`developer.channeladvisor.com` URL. The URLs are the canonical ones; the capture
dates say what was actually read. All checked 2026-08-25.

## Request limits

"REST API Request Limits":
<https://developer.channeladvisor.com/rest-api-core-concepts/rest-api-request-limits>
— read from the Internet Archive's **2022-05-18** capture.

Three limits apply to every endpoint:

| scope                 | limit                           |
| --------------------- | ------------------------------- |
| IP address            | 500,000 / hour (8,300 / minute) |
| Account (aka Profile) | 2,000 / minute                  |
| Integration           | 5 concurrent requests           |

### Why the account limit is the one encoded

`client.ts` configures exactly one bucket:

```ts
rateLimit: [
  {
    type: "requestLimit",
    interval: 60_000,
    tokensToAdd: 2000,
    maxTokens: 2000,
  },
];
```

The account limit is the binding one of the three rate figures: it is the
smallest (2,000/minute against the IP limit's 8,300/minute), it is metered per
profile, and a per-profile budget is exactly what a limit shared across
processes exists to divide. Its window is a minute, so the refill interval is a
minute and the bucket holds exactly one window's allowance.

`concurrencyLimit` was the original configuration here and was the wrong
_shape_ of limit: ChannelAdvisor meters a quota over a window, not a number of
requests in flight, so a concurrency cap either throttles a caller that is well
inside its quota or lets a fast caller blow through it, depending only on
latency.

### What this single bucket cannot say

Both omissions are deliberate:

- **The 5-concurrent integration limit is not enforced.** It is a different
  shape of limit; core 2.0's list-shaped `rateLimit` could carry a
  `concurrencyLimit` beside the account bucket, but the figure is per
  integration rather than per client, so it is left out. A full bucket admits far more than five
  requests at once. A host that needs the cap has to bound its own concurrency.
- **One authorization can cover several profiles** (see
  [One refresh token per authorization, not per profile](#one-refresh-token-per-authorization-not-per-profile)),
  and the 2,000 is _per profile_. The client paces itself as though it spoke for
  one profile — correct for the common case, conservative otherwise. Register a
  client per profile to spend each profile's own allowance.

### Per-endpoint limits, also unmodelled

From the same page, and much tighter than the account bucket:

- `/v1/ProductUpload` — 60 files per hour per account, 128 MB per request.
- `/v1/ProductExport` — 10 requests per minute.

Callers driving either need their own pacing on top of the client's.

## Refreshing the access token

"Updating Access Token":
<https://developer.channeladvisor.com/authorization/updating-access-token>
— read from the Internet Archive, as above.

The refresh token grant is the only grant type ChannelAdvisor's token endpoint
accepts for renewing access. The documented request is:

- `POST /oauth2/token`
- `Authorization: Basic <base64(appId:sharedSecret)>`
- `Content-Type: application/x-www-form-urlencoded` — "No other body types
  supported"
- body `grant_type=refresh_token&refresh_token=…`

answering with an access token valid for one hour. That is exactly what
`grantRefreshConfig` sends, hence `useBasicAuth: true` and
`dataLocation: "urlEncodedForm"`.

The refresh token itself comes from the authorization-code exchange in
`getGrantToken`, or from the Developer Console. Seed it with
`handler.setGrantTokens(clientName, grantId, ...)`, which writes the per-grant
credential key — so the refresh has to run as a _grant_, and every request has
to carry a `grantId` for that path to be reachable. See
[`/docs/core-behaviour.md`](../../../docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh)
for why a client-level `{{refreshToken}}` cannot work, and
`requests/handleCaRequest.ts` for where the grant is enforced.

**`client_credentials` is not supported.** The client-level `refreshConfig`
sends it anyway, as the least-bad failure available for a request that reaches
past the request functions: it fails at the token endpoint with the vendor
naming the reason, rather than putting an unresolved `{{refreshToken}}` on the
wire.

## One refresh token per authorization, not per profile

"Working with Multiple Accounts", ChannelAdvisor developer docs — read from the
Internet Archive, as above.

ChannelAdvisor issues one refresh token per **authorization**, not per profile.
The Developer Console grants an application access to a _set_ of profiles at
once, and a request that names no profile returns data aggregated across all of
them. Scope a call to a single profile with `$filter=ProfileID eq …`.

**Consequence for this plugin:** one credential set is one client holding one
refresh token, so the grant _is_ the client. `requests/clientName.ts` derives
the grant id from the alias segment of the client name
(`channelAdvisor:<organizationId|_>:<alias>`) rather than accepting it as an
argument — see the comment there for why deriving beats passing.

## Query option grammar

The OData subset `requests/handleQueryOptions.ts` emits. The formats are
ChannelAdvisor's; the nesting rules are what this package had to work out.

### Top-level options

| option     | rendered as                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `select`   | `$select=field1,field2,field3`                                                       |
| `expand`   | `$expand=…`, see below                                                               |
| `filter`   | `$filter=…`, see below                                                               |
| `skip`     | `$skip=<n>`                                                                          |
| `top`      | `$top=<n>`                                                                           |
| `orderBy`  | `$orderby=<field> <asc\|desc>`                                                       |
| `count`    | `$count=true`                                                                        |
| `exported` | `exported=<bool>` — not an OData option; a ChannelAdvisor query parameter of its own |

### `$expand`

- Plain options: `$expand=option1,option2,option3`
- Expanded child records:
  `$expand=childRecordName($expand=childRecordName($expand=option1,option2))`
- Mixed: `$expand=option1,childRecordName($expand=option1,option2,option3)`

### `$filter`

- Without a child record: `(field1 op 'value1' and field2 op 'value2')`
- Ranging over a child collection:
  `childRecordName/Any (c: c/field1 op 'value1' and c/field2 op 'value2')`
- A filter value is rendered by `formatFilterValue`: strings quoted, numbers and
  `Edm.DateTimeOffset` bare, `null` as the literal `null`.

Two nesting rules are not visible from the format strings and were both bugs
before 1.0.0:

- **The lambda variable has to reach every field reference inside the `Any`.**
  Applying `c/` once to the joined condition string qualifies only the first
  condition; the second then resolves against the _parent_ entity, where the
  field usually does not exist. It is carried down as a per-field prefix
  instead.
- **The collection being ranged over takes the enclosing prefix, not the new
  one.** `childRecordName` is a field of whatever scope encloses the group, so
  it is written with the _inherited_ prefix; only the conditions inside the
  lambda take the new variable.

### Date-only values silently widen a filter

`DateTime` values render as a full `Edm.DateTimeOffset` in UTC and **unquoted**,
which is the form ChannelAdvisor's own examples use:

```
CreateDateUtc gt 2016-01-01T00:00:00Z
```

Rendering a luxon `DateTime` as a date, or quoting it, is the worst kind of
wrong: an hourly incremental sync widens to _everything since midnight_ and
re-reads up to a day of records on every run, with no error anywhere to say so.
