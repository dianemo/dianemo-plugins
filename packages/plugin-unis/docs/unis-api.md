# UNIS WMS API

Findings behind `@dianemo/plugin-unis`.

## 404 is retried

The template adds `404` to `retryStatusCodes`, so a not-found response is retried
up to `maxRetries` rather than returned to the caller as absence.

**The evidence for this is operational, not documented.** UNIS publishes nothing
about transient 404s; what is known is that a configuration running this
integration in production carries exactly this setting, which is not something
anyone adds without having been bitten. Which responses are transient, and under
what conditions, is an open question.

The cost of being wrong in this direction is a genuinely missing resource taking
`maxRetries` attempts before it reports missing. The cost of the other direction
is treating a transient 404 as a real one, which for an order read means acting
as though the order does not exist.

## The documentation host's certificate expired

UNIS links a WMS API reference from <https://www.unisco.com/unis-api>, at
<https://docs.opera8.com/public-api/unis/1.4.x/>. That host's TLS certificate
**expired on 2025-03-29** — a Sectigo-issued `*.opera8.com` cert valid
2024-02-27 to 2025-03-29 — so no tool can read it with verification on, and it
was deliberately not bypassed. `web.archive.org` holds a snapshot from
2026-04-19 but is unreachable from this environment.

The pages below were therefore read **in a browser and pasted in by the repo
owner on 2026-08-25**, which is the provenance of everything in this file that
cites the reference: the Authentication page, and the API Reference for the
`/edi/*` endpoints. Both carry the footer "UNIS ©2022" and the version selector
reads `1.4.x`.

That is a weaker source than a fetched page — it cannot be re-checked
mechanically, and the parts of each page that were **images rather than text did
not survive the paste**. Where an answer sits in one of those images it is called
out below as still open.

## `FacilityID`

**Every read endpoint requires it, and a wrong one fails the whole call** with
`400 {"error":"Not found facility"}` — a clean rejection at UNIS's business-logic
layer, so auth and routing looking healthy tells you nothing about whether this
value is right.

**It is assigned by UNIS, per warehouse, and lives nowhere in this repo.** The
pre-1.0.0 implementation read it from a warehouse's own configuration, itself
sourced from a NetSuite custom field, and its type carried the note: _"FacilityID
indicates which warehouse UNIS ship from. It should be assigned by UNIS CSR."_
There is no facilities-lookup endpoint — not in UNIS's reference, and not in this
package. Contrast `plugin-extensiv`'s `getFacilities` and the Port Jersey
integration's `getFacility`, both of which exist. So the only way to obtain one is
to ask the UNIS account rep or read it from wherever the warehouse's config is
kept.

**It is a numeric string, not an airport-style code.** A real value verified
against production on 2026-08-25 was `"869"`. The declared type is `string`
throughout and `client.ts` does no coercion; UNIS accepted the string form on all
six read endpoints, and the bare-number fallback was never needed. The README
example previously read `"LAX01"`, which implied a format UNIS does not use —
source: **observed responses**, one tenant, one date, so treat the numeric shape
as this account's rather than as a documented vendor rule.

**One endpoint is slow.** `getOrdersItemLevel` took **32 seconds** against a
30-day window on that facility, where the other five returned in 0.2–3.1 s. Well
inside core's five-minute admission timeout, but far enough out of line to matter
when choosing a window size or putting it behind a user-facing request.

## Token lifetime

`tokenLifetimeSeconds` in `src/client.ts` reads the login response in three
steps: an explicit `expires_in` or `expiresIn`, then the `exp` claim if the token
is a JWT, then `FALLBACK_TOKEN_LIFETIME_SECONDS` (3,600 — one hour).

**Why it is not just `data.expires_in ?? 3600`.** Core has no 401 handling. The
lifetime reported here is the _only_ thing that expires the cached token, so a
token UNIS cut shorter than this figure keeps being served from cache until our
own clock says it lapsed, and every request in that window fails against a
credential that is already dead. Over-reporting a lifetime is therefore an
outage, not a slow path. Under-reporting one costs an extra login.

**Settled 2026-08-25: UNIS reports no lifetime field.** A live `POST /user/login`
against the production account returned a body whose only top-level keys are
`success`, `oAuthToken`, `idmUserId` and `userView` — no `expires_in`, no
`expiresIn`, nothing else. Source: **observed response**, one account, one date.

That closes the question this section used to pose, and it closes it the
unhelpful way: combined with the token being a UUID rather than a JWT (see
below), **both branches ahead of the fallback are dead for a real token**. The
fallback is not a last resort here. It is the mechanism.

**One hour is a chosen ceiling, not a UNIS figure.** UNIS publishes no TTL and
its login response states none, so nothing here is derived from the vendor. The
value was previously 10,800 (three hours), inherited from what the plugin
reported unconditionally before it read the login response at all. It was cut to
3,600 deliberately: the failure is asymmetric, and one hour is far enough inside
any plausible real TTL that the outage case stops being reachable, at the price
of at most a few extra logins a day.

**What remains genuinely unknown: UNIS's real TTL.** Ruling out the response
field removed the only cheap way to learn it. Settling it now needs an empirical
test — mint one token, poll a cheap endpoint on an interval, and record where the
first 401 lands relative to 3,600 seconds. Worth doing only if the extra logins
ever become a problem, or if a 401 is ever observed in production; until then the
short ceiling makes the answer not matter.

Both field spellings are still read because both are conventional and reading a
second key costs nothing — and because a future UNIS release adding one would
then be picked up automatically.

## Token type and the `Bearer` prefix — settled: bare

**The token goes in `Authorization` with no prefix.** The Authentication page's
screenshot of the request headers (a Postman table, red-boxed in the original)
shows exactly:

| KEY             | VALUE                                  |
| --------------- | -------------------------------------- |
| `Authorization` | `91611181-912a-4128-9359-f9082fcdbef5` |
| `Content-Type`  | `application/json`                     |

A bare value, no `Bearer `. The surrounding prose says only _"Pass token in header
`Authorization` when making API calls"_, and the same page writes the prefix
explicitly for its Basic scheme (_"header value is
`Basic ZWRpMDAxOnBhc3MwMDE=`"_) — so the page does spell out a scheme where one
is required. `excludePrefix: true` is correct.

Read from the vendor's own Authentication page (v1.4.x), captured to PDF by the
repo owner on 2026-08-25.

**The token is a UUID, not a JWT.** That is visible in the same screenshot, and it
has a consequence for the code: `jwtLifetimeSeconds` in `src/client.ts` can never
fire for a token of this shape — a UUID has no `.`-delimited segments and carries
no `exp` claim. So the effective lifetime chain is
`expires_in ?? expiresIn ?? FALLBACK_TOKEN_LIFETIME_SECONDS`, and in practice the
fallback unless UNIS reports a field.

The JWT branch is kept deliberately rather than deleted: it costs nothing, it is
the correct reading if UNIS ever issues a JWT, and it fails closed (returns
`undefined`) on a UUID. But nobody should read its presence as evidence that a
lifetime is being derived from the token today. It is not.

The `responseInterceptor` still returns `token_type: "Bearer"` because core's
`OAuthResponse` requires the field, and it remains inert — `excludePrefix: true`
means core never writes a prefix, and nothing reads the stored type back.

Core's side of this is `client/methods/authenticate.js`, which builds the header
as `` `${excludePrefix ? "" : `${prefix} `}${value}` `` and takes `prefix` from
`customPrefix` or a per-type default — never from the `token_type` the refresh
response returned. Verified against `@dianemo/core@^1.0.0`'s shipped `dist/`.

## Rate limit

**Two limits, vendor-stated** (supplied by UNIS, checked 2026-08-25):

| Scope    | Limit                |
| -------- | -------------------- |
| Per user | 100 calls / minute   |
| Per IP   | 1,000 calls / minute |

The template meters the per-user figure, which is the one a client corresponds
to: `100 / 60 s`.

**The per-IP limit is not expressible here, and it is the one that will bite
first at scale.** A client's budget is per set of credentials, so ten UNIS
clients on one host each meter to 100/min and together reach 1,000/min — exactly
the IP ceiling — while every one of them looks individually compliant. Eleven
overrun it. A host running more than ten UNIS accounts has to pace itself, or
lower each client's budget with the `rateLimitOverrides` argument to
`addTemplateClient` so the sum stays under 1,000.

This figure was previously carried as unsourced, with a note that the
undocumented `FAQs` page was the only remaining place it could be stated. The
100/min working default it guessed turned out to match the real per-user limit.
It is still absent from the Authentication page and from the API Reference for
the `/edi/*` endpoints — searched across the full text of both — so the developer
site alone will not tell the next reader this.

## Every call is scoped by company and customer

UNIS scopes every call by `CompanyID` and `CustomerID`, and the pair rides in the
**JSON body** of each request rather than in a header. That is why this plugin
carries a client-level `requestInterceptor` that merges the pair into
`config.data`.

Being client-level has a consequence worth knowing: the interceptor sees
everything sent through `handler.handleRequest` on this client, not only the
request functions this package ships. A caller passing a string body gets it
spread character-by-character into `{"0":"{","1":"\"",…}` and shipped as nonsense,
which is why `requestBody` refuses a non-object rather than casting. None of the
package's own request functions can produce one.

## Basic Auth is also supported, and would remove the TTL problem

The Authentication page documents **two** schemes. The plugin uses the first:

1. **Access token** — `POST /user/login` with `{username, password}`, then the
   token in `Authorization`.
2. **Basic** — `Authorization: Basic Base64(username:password)`, with the page's
   own worked example: `edi001` / `pass001` → `ZWRpMDAxOnBhc3MwMDE=`.

Core supports the second natively. `AuthDataBasic` is `{ type: "basic", username,
password }`, and `handleBasic` in `client/methods/authenticate.js` computes
`Buffer.from(`${username}:${password}`).toString("base64")` with a `Basic `
prefix — byte-identical to what UNIS documents. The plugin already takes
`username` and `password` as credentials, so switching is a few lines and deletes
`tokenLifetimeSeconds`, the JWT `exp` fallback, the fallback constant and the
whole token-lifetime question above.

**It was not switched, and the reason is a genuine trade-off rather than
inertia.** Basic Auth puts the account password on the wire on _every_ request;
the token flow sends it once per refresh and then carries a bearer credential.
Under TLS both are defensible, and the token flow is the better of the two on
credential exposure — so the more secure design is the one that carries the TTL
uncertainty.

Worth knowing as the escape hatch: if the token TTL ever turns out to be shorter
than the response reports, or a UNIS-side change breaks the refresh, Basic Auth is
a documented, always-valid path that needs no new credentials.

## The documented host is the preview one

Every example in the reference uses
`https://preview.logisticsteam.com/shared/bam/v1/public`, and the login example
uses the same host. `packages/plugin-unis/README.md` shows
`https://wise.logisticsteam.com/v2/shared/bam/v1/public` for production — note
the different subdomain **and** the extra `/v2` segment.

That production URL is **not** in the reference and is inherited from the
pre-1.0.0 package. It is plausibly correct — a preview host and a production host
routinely differ — but nothing here sources it, and the `/v2` difference is the
kind of detail that is wrong exactly once. Confirm it against a real account.

The path suffix is corroborated: the reference's `API:` lines are all relative
(`POST /edi/outbound/order`), and every full example URL is the base above plus
that path, which matches how the plugin composes `baseUrl` with its own paths.
