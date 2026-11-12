# UPS REST API

Findings that took reading UPS's OpenAPI specs to establish. UPS publishes those
specs in a public repository — `github.com/UPS-API/api-documentation` — and it is
the only authoritative source for most of what follows: the developer portal's
prose pages disagree with the specs in places, and the specs are what the gateway
enforces.

Every citation below was checked on **2026-08-25**. UPS versions its REST APIs by
release date, so the version pins in particular go stale on UPS's schedule rather
than ours.

## No published rate limit

**UPS publishes no rate limit for its REST APIs.** Not a number, not a header, not
a tier table. What is known:

- Every operation in UPS's OpenAPI specs declares a `429 Rate Limit Exceeded`
  response, so a throttle exists and is enforced.
- UPS returns **no rate-limit headers** alongside the 429 — nothing to infer a
  budget or a reset window from.
- The question was asked on UPS's own documentation repository on **2023-08-31**
  and is still open and unanswered:
  <https://github.com/UPS-API/api-documentation/issues/8>
- The limit is reportedly assigned **per integration** and varies by tier (CIE,
  standard production, high-volume), so there is no single correct figure to look
  up even in principle.

`src/client.ts` therefore paces at **5 requests per second**, and that figure is
**unsourced** — it is a conservative placeholder chosen only to sit well under the
throttles integrators report hitting. The 30/s it replaced was invented in exactly
the same way, but in the unsafe direction.

**Calibrate against 429s on your own account.** That is the only real evidence
obtainable, and it needs credentials this repository does not have. Until then,
treat the number in the code as a guess that is labelled as one.

## The `transId` header

UPS documents `transId` as "An identifier unique to the request". Whether it is
_required_ depends on which API you are calling:

| API                | `transId`                                |
| ------------------ | ---------------------------------------- |
| Track              | `required: true` on all three operations |
| Shipping           | `required: false`                        |
| Pickup             | `required: false`                        |
| Address Validation | `required: false`                        |

Nothing in this plugin supplied it at all before, so tracking was calling a
required header short.

It is now set at the client, in `requestOptions.requestInterceptor`, rather than
in the one request function that strictly needs it: everywhere else it is the id
UPS support searches their logs by (alongside `transactionSrc`), and sending it
costs nothing.

**Shipping documents the length cap as 32.** dianemo's `requestId` is a
36-character UUID, so the hyphens are stripped before it goes on the wire — still
unique, and still the id in dianemo's own logs.

**Delivery Intercept documents a cap of 14.** Its spec gives `transId` the pattern
`^[a-zA-Z0-9-.]{3,14}$` (minLength 3, maxLength 14), so the 32-character value the
interceptor generates violates it. The client interceptor therefore keeps a `transId`
that the request set itself instead of overwriting it, and the Delivery Intercept
functions send their own 14-character value, or the caller's `transId` from the
params type. That second path is what lets a caller use the fixed values UPS's test
environment answers to; see [Delivery Intercept](#delivery-intercept). This is
vendor documentation, not an observed response.

Other specs state their own constraints, all vendor documentation. The client's
hyphen-stripped 32-character value fits every one that states a length except
Delivery Intercept:

| API                                           | `transId`                                                    |
| --------------------------------------------- | ------------------------------------------------------------ |
| Rating                                        | `required: false`, length 32                                 |
| Time In Transit                               | `required: true`                                             |
| Dangerous Goods Utility                       | `required: true`                                             |
| PreNotification                               | `required: false`                                            |
| Paperless Document                            | not marked required                                          |
| Quantum View                                  | no header parameters declared                                |
| Landed Cost, Global Checkout                  | `required: true`                                             |
| Interactive Description Guidance              | "A 128 bit GUID", `maxLength: 32`; none declared on feedback |
| Chargeback Protection                         | optional, 3 to 36 characters                                 |
| Pickup notification preferences               | pattern `{3,100}` but `maxLength: 50`                        |
| WorldEase                                     | exactly 32 hex or hyphen characters                          |
| Delivery Intercept                            | pattern `{3,14}`                                             |
| Supply Chain Symphony inventory and logistics | `required`, 3 to 36 characters                               |
| Supply Chain Symphony transportation          | no header parameters declared                                |
| Delivery Defense                              | no parameters declared                                       |
| Forwarding                                    | optional                                                     |

- <https://github.com/UPS-API/api-documentation/blob/main/Tracking.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>

## `transactionSrc`

`transactionSrc` is free text naming the _application_ making the request. UPS
support searches their logs by it. It is not a per-merchant value, so it is set
once on the client from `UpsCredentials.transactionSrc` and defaults to naming
this plugin. Set it to your own application's name so your traffic is
distinguishable from anyone else's running the same package.

## `x-merchant-id`

On the OAuth token request, UPS documents this header as, verbatim, a **"6-digit
UPS account number"**, and marks it `required: false`.

`clientId` used to be sent here, which put a **32-character OAuth client key** in
a header documented as a 6-digit account number. Because the header is optional,
omitting it when no account number has been registered is strictly better than
filling it with something else — so `UpsCredentials.merchantId` is optional, and
absent means the header is not sent rather than sent wrong.

<https://github.com/UPS-API/api-documentation/blob/main/OAuthClientCredentials.yaml>

## Version pins

UPS versions its REST APIs by release date. The old version keeps answering until
UPS retires it, which is why a stale pin is silent rather than fatal — and why
these want revisiting whenever a newer dated version ships.

| API                                                          | pinned  | was     | why                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pickup                                                       | `v2409` | `v2403` | Every current Pickup operation — rate, cancel and creation — lists `v2409` as its only valid value and its default. `v2403` is not among them.                                                                          |
| Shipping                                                     | `v2409` | `v1`    | Both operations list `v2409` as their default, and Ship lists it as its only valid value. Void additionally accepts `v3`, but only for Roadie shipments. The `v1` path is a separate path UPS marks `deprecated: true`. |
| Address Validation                                           | `v2`    | `v1`    | Unlike the rest of UPS's catalogue this API is _not_ versioned by release date: `v2` is its only valid value and also its default. The `v1` path is separate and UPS marks it `deprecated: true`.                       |
| Rating                                                       | `v2409` | —       | The only value the live path lists, and its default. Every older value (`v1` to `v2205`) sits on the separate `{deprecatedVersion}` path marked `deprecated: true`. The spec lists no `v2403`.                          |
| Time In Transit                                              | `v1`    | —       | `default: v1` and no other value listed (inference: it is the only one).                                                                                                                                                |
| Tracking                                                     | `v1`    | —       | Literal in the path `/track/v1/...`; not a parameter, and no other version is listed.                                                                                                                                   |
| Track Alert                                                  | `v2`    | —       | The only value in the `version` enum. v1 is described as still supported but has no path in the spec.                                                                                                                   |
| Delivery Defense                                             | `v1.0`  | —       | Baked into the server URL `/api/deliverydefense/external/v1.0`; there is no version parameter.                                                                                                                          |
| Pickup notification preferences                              | `v1`    | —       | Sole entry of the `version` enum.                                                                                                                                                                                       |
| Smart Pickup Account Management                              | `v1`    | —       | Sole entry of the `version` enum.                                                                                                                                                                                       |
| UPS Pickup Points                                            | `v1`    | —       | Sole entry of the `version` enum.                                                                                                                                                                                       |
| Dangerous Goods, chemical reference data                     | `v2409` | —       | `default` and sole valid value.                                                                                                                                                                                         |
| Dangerous Goods, acceptance audit pre-check                  | `v2`    | —       | Sole entry in the "Valid values" text; the schema `default` says `v3`. A judgement; see [Dangerous Goods Utility](#dangerous-goods-utility).                                                                            |
| PreNotification                                              | `v2`    | —       | `default` and sole valid value.                                                                                                                                                                                         |
| Paperless Document                                           | `v2`    | —       | `default` and sole valid value on upload, image and delete.                                                                                                                                                             |
| Quantum View                                                 | `v3`    | —       | `default` and sole valid value.                                                                                                                                                                                         |
| Locator                                                      | `v3`    | —       | `default` and sole valid value.                                                                                                                                                                                         |
| Customs Detail                                               | `v2`    | —       | An inference. The server URL carries `{version}` but the spec defines no variable for it; `v2` comes from the title and `info.version: "2.0"`.                                                                          |
| TradeDirect                                                  | `v1`    | —       | Sole enum value of the `version` variable.                                                                                                                                                                              |
| WorldEase                                                    | `v1`    | —       | Sole enum value of the `version` variable.                                                                                                                                                                              |
| Landed Cost Quote                                            | `v1`    | —       | `default: v1` on the path parameter; no enum, so no other value is documented.                                                                                                                                          |
| Global Checkout (Guaranteed Quote)                           | `v1`    | —       | Server variable `default: v1`, `enum: [v1]`.                                                                                                                                                                            |
| Export Assure                                                | `v1`    | —       | Server variable `default: v1`, `enum: [v1]`, repeated on the path parameter.                                                                                                                                            |
| Interactive Description Guidance                             | `v1`    | —       | Server variable and path parameter, `default: v1`, `enum: [v1]`.                                                                                                                                                        |
| Chargeback Protection (Commerce Guard)                       | `v1`    | —       | Path parameter `default: v1`; the text lists only `v1`.                                                                                                                                                                 |
| Delivery Intercept                                           | `v2`    | —       | Server variable `enum: [v2]`, `default: v2`; the path parameter repeats it.                                                                                                                                             |
| Protected Delivery Token                                     | `v1`    | —       | Server variable `enum: [v1]`, `default: v1`.                                                                                                                                                                            |
| Supply Chain Symphony (inventory, logistics, transportation) | `v1`    | —       | Literal in the three server URLs (`/inventory/v1`, `/logistics/v1`, `/api/transaction-visibility-dashboard/v1`); there is no `{version}` variable and these are not dated releases.                                     |
| Forwarding                                                   | `v1`    | —       | Only value of the `version` server-variable enum, and its default.                                                                                                                                                      |

The `was` column is a dash where the pin is new and no earlier value was recorded.

- <https://github.com/UPS-API/api-documentation/blob/main/Pickup.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/AddressValidation.yaml>

## Address Validation query parameters

**UPS ignores a query parameter it does not recognise.** It does not 400. So the
request succeeded while silently doing neither of the two things it was asked to
do:

| sent                        | correct                    | problem                                                  |
| --------------------------- | -------------------------- | -------------------------------------------------------- |
| `maximumcandidatelimitsize` | `maximumcandidatelistsize` | not a UPS parameter at all — `limit` for `list`          |
| `regionalrequestIndicator`  | `regionalrequestindicator` | camelCased; UPS's parameter names here are all lowercase |

Two other constants in the same URL are deliberate rather than default:

- The request-option path segment is **`3`**, which asks for validation _and_
  classification in one call — the candidate list plus whether the address is
  residential or commercial. `1` is validation only, `2` classification only.
- `maximumcandidatelistsize` is **10**. UPS documents "Valid values: 0 - 50 ... If
  not provided, the default size of 15 is returned", so 10 is a narrowing we
  chose, not the API's default.

### `regionalrequestindicator` cannot be combined with classification

**Removed 2026-08-25.** Correcting the spelling above is what made this parameter
reach UPS for the first time, and UPS rejects it outright whenever the request
option asks for classification:

```
400  Address classification is not valid for a regional request.
```

The misspelling had been masking a conflict, not merely wasting a parameter. The
pre-1.0.0 implementation sent `regionalrequestIndicator` (camelCased) against
`v1/3` for years and never had a regional request honoured — which is why it
worked.

Established by trying nine URL variants against the live API. The
discriminating rows:

| URL                                                              | Result               |
| ---------------------------------------------------------------- | -------------------- |
| `v2/3?regionalrequestindicator=true&maximumcandidatelistsize=10` | **400**              |
| `v2/3?regionalrequestindicator=true`                             | **400**              |
| `v2/3?maximumcandidatelistsize=10`                               | 200, real candidates |
| `v2/3`                                                           | 200                  |
| `v2/1?regionalrequestindicator=true&maximumcandidatelistsize=10` | 200                  |
| `v1/3` with the old misspelled names                             | 200                  |

The fifth row isolates it: the parameter is fine on option `1`, so the conflict
is with **classification**, not with the parameter itself or with the API
version. Both `v1` and `v2` answer, so the version pin is not implicated either.

**Source: observed responses, 2026-08-25.** UPS's published
`AddressValidation.yaml` states no such constraint — this is enforced at the
gateway and documented nowhere, so it is exactly the kind of finding that
disappears if it is not written down here.

<https://github.com/UPS-API/api-documentation/blob/main/AddressValidation.yaml>

The spec's own description of these parameters, and the audit of the response types,
are under [Address Validation (street level)](#address-validation-street-level).

## Pickup path segments

Three Pickup operations share a `/pickup/{…}` shape and the final segment means
something different in each. Conflating them is the bug this section exists to
prevent.

**Cancel** — the segment is `CancelBy`, whose documented values are `01` =
AccountNumber and `02` = PRN. The `Prn` header is documented "Required if CancelBy
= prn". `cancelPickup` sends a PRN, so `02` is correct.

**Rate** — the segment is `pickuptype`, and it is **not a numeric code**. UPS
documents it as "Type of pickup. Valid values: oncall / smart / both. Length 6".
`oncall` is a scheduled one-off collection, `smart` a UPS Smart Pickup, and `both`
asks for the two side by side.

`getPickupRate` used to send **`/pickup/01`** — a value lifted from _Cancel's_
`CancelBy` enum, which means nothing on the Rate path. **The call had therefore
never worked.** This is why the fix looks arbitrary: swapping a `01` for the
string `oncall` is not a tuning change, it is the difference between an endpoint
that answers and one that never did. `UpsPickupRateRequest` describes an on-call
pickup, which is why `oncall` is the default of the new `pickupType` parameter.

<https://github.com/UPS-API/api-documentation/blob/main/Pickup.yaml>

The rest of the Pickup operations are under [Pickup operations](#pickup-operations).

## Void takes the shipment id, not the tracking number

UPS's path parameter is `shipmentidentificationnumber` ("The shipment's
identification number"). The package-level narrowing is a _separate_, optional
`trackingnumber` **query** parameter ("The package's tracking number"). Both were
being fed the same argument.

The conflation is easy to make and hard to notice, because **for a single-package
shipment UPS uses the same 1Z value for both.** On a multi-package shipment they
are different values, the path takes the shipment's, and passing a package
tracking number in the path is what fails.

`requestShipment` returns the right value as `ShipmentIdentificationNumber`.

<https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>

## Rating and billable-weight enums were inverted

Both enums had the wire code as the **member name** and UPS's human description as
the **value**:

```ts
// wrong
enum UpsRatingMethod {
  "01" = "Shipment Level",
  "02" = "Package Level",
}
```

So `res.RatingMethod === UpsRatingMethod.ShipmentLevel` compared `"01"` against
`"Shipment Level"` and was **never true** — a comparison that type-checks, reads
correctly, and silently always takes the else branch.

UPS documents both fields as two-character strings: `01` = Shipment level, `02` =
Package level. That is now the value, and the description is the member name.

**Neither field is returned unless `RatingMethodRequestedIndicator` is present in
the request**, so treat both as optional even on an otherwise successful rate —
absence means "you did not ask", not "shipment level".

<https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>

## Where the endpoint findings come from

Everything below rests on the UPS-API GitHub OpenAPI specs, in the files dated
2026-11-05. That is **vendor documentation, not an observed response**: no call was
made against a UPS account, so every claim is only as strong as the spec. Where the
schema, the examples and the prose disagree, the types follow the schema unless an
observed finding above says otherwise. Each place the spec contradicts itself is
recorded under its API, with how the types resolve it. A claim labelled
**inference** is the reader's reading of the spec, not something it states.

No spec states a rate limit; the only trace is the generic `429` response. See
[No published rate limit](#no-published-rate-limit). Operations the specs mark
deprecated (the `{deprecatedVersion}` paths) have no function. Where a `-Ready`
twin of a spec exists and was diffed, it differs from the base file in description
text only (API Request Generator banners and links), apart from the cases noted
under [Paperless Document](#paperless-document).

Error codes are `UPS_` plus four digits, one per distinct failure. Request URLs are
`/api` plus the path against the bare-host `baseURL`, except where noted.

## OAuth token requests against the spec

Source: OAuth Client Credentials API (vendor documentation). The existing auth block
matches it: `POST {host}/security/v1/oauth/token`, HTTP Basic (`clientId:secret`),
`application/x-www-form-urlencoded` body `grant_type=client_credentials`, optional
`x-merchant-id` (see [`x-merchant-id`](#x-merchant-id)). The servers are declared
per operation (`wwwcie.ups.com/`, `onlinetools.ups.com/`); the top-level `servers`
block is empty.

The response documents `expires_in` as a _string_ of seconds. Core applies `Number()`
to it, so it is read correctly. The spec states no token lifetime (negative result),
so core's handling of `expires_in` is what applies.

## Authorization code grant

**Open item: not supported.** The plugin supports only `client_credentials` today.

The OAuth Auth Code API (vendor documentation) documents three operations, with
servers `https://{wwwcie|onlinetools}.ups.com/security`:

| Operation      | Method and path           | Notes                                                                                                                                                                    |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Authorize      | `GET /v1/oauth/authorize` | 302 to UPS login. `client_id`, `redirect_uri` and `response_type=code` are required; `state`, `scope` and `code_challenge` are optional.                                 |
| Token exchange | `POST /v1/oauth/token`    | `grant_type=authorization_code`, `code`, `redirect_uri`, with Basic auth. For PKCE there is no `Authorization` header, only `client_id` and `code_verifier` in the body. |
| Refresh        | `POST /v1/oauth/refresh`  | Basic auth, `grant_type=refresh_token`, `refresh_token`; both fields required.                                                                                           |

The full paths are `/security/v1/oauth/authorize`, `/security/v1/oauth/token` and
`/security/v1/oauth/refresh`. The token and refresh responses carry, all as strings,
`access_token`, `refresh_token`, `expires_in`, `refresh_token_expires_in`,
`refresh_token_issued_at`, `issued_at` (milliseconds), `status`,
`refresh_token_status`, `refresh_count`, `scope`, `client_id` and `token_type`. The
refresh response returns a new access and refresh token pair, and core stores a
rotated `refresh_token` and `refresh_token_expires_in`. The refresh endpoint
documents no `x-merchant-id`.

A refresh leg is expressible with core's `{{refreshToken}}` placeholder in a
`grantRefreshConfig` (Basic auth, url-encoded form, `grant_type=refresh_token`,
`refresh_token={{refreshToken}}`), without using the client-level `refreshConfig`
that core's bootstrap cannot fill. **It was not shipped**, because no UPS request
function accepts a grant id, so a refresh leg would be unreachable. Supporting the
grant means adding a grant option to every request function. The authorize redirect
and the code exchange are interactive and would stay the caller's job.

Unverified, and needing a real account: whether a token obtained for another shipper
through this flow is accepted by the non-OAuth APIs without `x-merchant-id`, and
whether `refresh_token_expires_in` is long enough to avoid re-authorisation. The
spec states no refresh token lifetime (negative result). The `-Ready` twins of the
OAuth specs differ in description text and marketing links only (verified by diff).

## The Forwarding host

Source: Forwarding API v1, `servers` block (vendor documentation).

| Spec                          | Hosts                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Every other host-bearing spec | `onlinetools.ups.com`, `wwwcie.ups.com`                                                                                      |
| Forwarding                    | `https://www.onlinetools.ups.com/api/forwarding/{version}` and `https://www.onlinetoolsuat.ups.com/api/forwarding/{version}` |

Forwarding differs in two ways: the production host carries a `www.` prefix, and the
test host is `onlinetoolsuat.ups.com` rather than `wwwcie.ups.com`.

**The spec states which host is which environment.** `Forwarding.yaml`'s `servers`
block labels `https://www.onlinetools.ups.com/...` "Production" and
`https://www.onlinetoolsuat.ups.com/...` "Customer Integration Environment" (vendor
documentation, re-read 2026-11-12). Pairing `wwwcie.ups.com` with
`onlinetoolsuat.ups.com` is therefore the spec's own mapping, not an inference; an
earlier version of this section and of the comment on `forwardingBaseUrl` said the
spec never labelled them, which was wrong. What the spec does not say is whether a
token minted on `wwwcie.ups.com` is accepted by the UAT host (see the open
questions below).

The spec's `securitySchemes.oauth2.tokenUrl` is
`https://onlinetools.ups.com/security/v1/oauth/token`, the same endpoint as the rest
of UPS, so Forwarding shares the parent's auth and only `baseURL` differs. The spec
does not state whether the Forwarding host also answers the token path, whether
`www.onlinetools.ups.com` accepts tokens issued by `onlinetools.ups.com`, or whether
`wwwcie.ups.com` also serves Forwarding.

Implementation, as a client-template fact:

- A `forwarding` sub-client (`ups:<org>:<instance>:forwarding`) overrides only
  `baseURL`. Core builds both the parent and the sub-client, merging
  `{...parent, ...child}`, so the sub-client inherits `authentication` (one stored
  token, owned by the parent) and `requestOptions` (`transactionSrc`, the `transId`
  interceptor). Core's own sources were read for this, and a real-handler test in
  `test/client.test.ts` covers it.
- The sub-client's `baseURL` is the bare host. Forwarding functions therefore use
  URLs beginning `/api/forwarding/{version}/...`. A base URL that is not recognised
  (a proxy), or that does not parse (no scheme, say), is passed through unchanged
  instead of throwing at registration; `test/client.test.ts` covers it.
- The sub-client has its own rate-limit bucket. A caller mixing Forwarding and other
  calls gets the 5/s placeholder on each, so **one credential can reach 10/s
  combined** (5/s on the parent plus 5/s on `forwarding`). That figure is this
  repo's own, not UPS's, and whether UPS throttles per credential or per host is
  unknown; see [No published rate limit](#no-published-rate-limit). Recorded, not
  changed.

### Spec `servers` that are not the standard pair

| Spec                                                              | `servers`                                                                                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Forwarding                                                        | The two hosts above.                                                                                                         |
| UPS Pickup Points                                                 | `"Not Available"` (not a URL) and `https://onlinetools.ups.com/api/uppmanage/{version}`; no CIE host.                        |
| UPS Partner Transportation Data Ingestion (Supply Chain Symphony) | `"Not available"` and `https:onlinetools.ups.com/api/transaction-visibility-dashboard/v1` (malformed, no `//`); no CIE host. |
| OAuth Client Credentials, OAuth Auth Code                         | Empty top-level `servers`; per-operation servers instead (the Auth Code ones end `/security`).                               |

Standard hosts but production only, with no CIE listed: Protected Delivery Token
(`/api/pin-mgmt-sys/{version}`) and TradeDirect (`/api/ship/tradedirect/{version}`).
Standard hosts but **not under `/api`**: Supply Chain Symphony inventory
(`/inventory/v1`) and logistics (`/logistics/v1`). Every other spec has an `/api` or
longer prefix, for example `/api/brokerage/{version}`, `/api/track/{version}`,
`/api/ship/{version}`, `/api/deliverydefense/external/v1.0`,
`/api/trade/compliance/{version}`, `/api/export-assure/{version}`,
`/api/digital-experience/preferences/{version}`, `/api/account/pickup-info/{version}`
and `/api/deliveryintercept/{version}`.

## Shipping spec quirks

Source: the "Ship" spec (`Shipping.yaml`), vendor documentation.

| Function          | Method and URL                                         | Code     |
| ----------------- | ------------------------------------------------------ | -------- |
| `requestShipment` | POST `/api/shipments/v2409/ship`                       | UPS_0005 |
| `voidShipment`    | DELETE `/api/shipments/v2409/void/cancel/{shipmentId}` | UPS_0003 |
| `recoverLabel`    | POST `/api/labels/v1/recovery`                         | UPS_0020 |

`requestShipment` takes an optional `{ additionalAddressValidation: "city" }`, sent
as the `additionaladdressvalidation` query parameter. The name is lowercase and
`city` is its only documented value; UPS ignores unknown query parameters, so the
spelling matters. `voidShipment` takes an optional `{ shipperNumber }`, sent as a
header. The `{deprecatedVersion}` Ship and Void paths are marked deprecated and have
no function.

### Contradictions and open questions

1. **Label Recovery required fields.** `LabelRecoveryRequest.required` lists both
   `TrackingNumbers` and `ReferenceValues`, but their descriptions make them
   conditional on each other. Both are typed optional, because taken literally no
   ordinary caller could build a request.
2. **Roadie labels.** The Label Recovery `version` description says Roadie labels need
   `v2603`, against a default of `v1`. `v1` is pinned, so Roadie recovery is
   unreachable until someone confirms. Void also lists `v3` for Roadie only, which is
   not exposed.
3. **Multi-package void.** The spec says to pass several `trackingnumber` values as a
   bracketed list "with a coma separating". That is ambiguous; `voidShipment` keeps
   the single string parameter and the caller formats it.
4. **Single-object responses.** Some response arrays carry no "always an array at
   v2403 or later" note: the Void `Response.Alert`, `RateModifier` under both
   `NegotiatedRateCharges` and `NegotiatedCharges`, and all of Label Recovery's
   response. They are typed per schema. Whether UPS can return a lone object there
   is unknown.

Minor spec defects: `SecurePINType` carries `required` on the property itself;
`PackageResults_RateModifier.required` names an undefined `CurrencyCode`; `maximum: 1`
appears on many objects and is ignored. Only one boolean exists in the spec
(`ProductIdentifierExemptIndicator`); every other indicator is an empty-string
presence flag typed `string`.

Currency fields remain `CurrencyCodes` from plugin-kit, as in v1.0.0, although the
spec types them as plain strings. That is the plugin's refinement, not the spec's.

### Audit of the v1.0.0 shipping types

Every v1.0.0 name still exports, as an alias of a spec-derived `UpsShipping*` type.

| Change                                                                        | For a TypeScript caller |
| ----------------------------------------------------------------------------- | ----------------------- |
| `VoidShipmentResponse.PackageLevelResult` renamed `PackageLevelResults`       | breaking                |
| `UpsShipmentResult.Disclaimer` single alert to array                          | breaking                |
| `UpsPackageResult.Accessorial` and `RateModifier` single to array             | breaking                |
| `UpsItemizedCharge.subType` renamed `SubType`; `Description` optional         | breaking                |
| FRS `HandlingUnits[].AdjustedHeight` string to `{ Value, UnitOfMeasurement }` | breaking                |
| `UpsForm.Code` and `Description` optional                                     | breaking for reads      |
| `UpsShipTo.Residential` and `BillShipper.Address` removed (not in the spec)   | breaking                |
| Indicator fields, `ShipmentCharge.Type`, `DCISType` widened to `string`       | non-breaking            |
| `FormType` and `Product.Description` widened to `string \| string[]`          | non-breaking            |
| Many request fields required to optional, per the spec's `required` arrays    | non-breaking            |
| `options` parameters added to `requestShipment` and `voidShipment`            | non-breaking            |

`voidShipment` still takes two bare string parameters after `clientName`, against the
repo's own rule. It is kept because it is published; see
[Void takes the shipment id](#void-takes-the-shipment-id-not-the-tracking-number).

### Request shapes against UPS's own examples

Method: every request example embedded in the Shipping spec, and UPS's published Java samples run at API version v1, was turned into a typed fixture and type-checked against the package. These are findings from examples, not observed API behaviour.

- **Single objects where arrays were required.** The spec's examples send one object for `Package`, `PaymentInformation.ShipmentCharge`, `Notification`, `ShipmentIndicationType`, `HazMat`, `InternationalForms.Product`, `CN22Content`, `ScheduleB.UnitOfMeasurement` and `PackingListInfo.PackageAssociated`, and a bare string for `AddressLine` and `Notification.EMail.EMailAddress`. The request types are now `T | T[]`.
- **`TradeDirect.Child.Product`.** The schema (`Child_Product`) is one object, but the Trade Direct examples send an array. The type accepts both.
- **`LabelStockSize` is optional.** UPS's own examples, and the Java samples, omit it from `LabelSpecification`.
- **Label Recovery request.** `ResendEmailIndicator` (example) versus `ResendEMailIndicator` (schema): both are typed. The Roadie example sends `TrackingNumbers: { TrackingNumber: [...] }` and a `ReferenceValues` with only `ShipperNumber`; the schema says `TrackingNumbers` is an array of strings and `ReferenceValues.ReferenceNumber` is required. The type accepts the example's shape and makes `ReferenceNumber` optional.
- **The recoverLabel response is pinned to `v1`.** UPS's v1 Java sample (`LabelRecoveryResponse.json`) returns `LabelResults` as one object. The spec has no "always an array" note for `LabelResults`, `TrackingCandidate` or `Response.Alert`, so all three are typed `T | T[]`.
- **`TransactionIdentifier`** is on the shared reference type. It appears in the Trade Direct request examples and in the samples' responses, but the schema does not define it.
- **Example defects left in the spec** (these examples cannot type-check, and no type change was made):
  - `ShipFromAccountNumber`, `Residential`, `PackedByStoreIndicator`, `SEDFilingOption`, `BarCodeImageIndicator` and `Code` inside Trade Direct `Product` are in no schema.
  - `MasterCartonIndicator` is defined on `Shipment`, but `World_Wide_Economy_Shipping` puts it in `ShipmentServiceOptions`.
  - `EMailAddress` and `EmailAddress` casing varies between the schema and the examples. The same goes for `CompanyDisplayableName` and a `Name` under `BillThirdParty`.
  - `Billing_Third_Party`, `Trade_direct_LTL_shipment` and `Trade_direct_Master_shipment_` send `ShipmentServiceOptions` as a whitespace string.
  - `WorldEase_Shipment` is missing its `ShipmentRequest` wrapper.
- **Whether UPS's live service accepts these shapes is unverified.** They are what UPS's published examples send.

## Rating

Source: the "Rate" spec (`Rating.yaml`), vendor documentation. There is no
`Rating-Ready.yaml` to diff.

| Function     | Method and URL                           | Code     |
| ------------ | ---------------------------------------- | -------- |
| `getUpsRate` | POST `/api/rating/v2409/{requestoption}` | UPS_0002 |

### URL, version and request options

- Servers are `https://wwwcie.ups.com/api` and `https://onlinetools.ups.com/api`,
  matching the client. Version pin: see [Version pins](#version-pins). Older values
  sit on the deprecated path, but `RateOptions.version` still accepts the older
  `UPSVersion` members (a shared type), so a caller can still reach it.
- `{requestoption}` documents four values: `Rate`, `Shop`, `Ratetimeintransit`,
  `Shoptimeintransit`. Rate is the only option valid for Ground Freight Pricing
  (GFP). `Service` is "required for Rating and ignored for Shopping", which is why
  `getUpsRate` derives Rate vs Shop from the service code.
- Query `additionalinfo` has one value, `timeintransit`, documented as
  `Rate?additionalinfo=timeintransit` being the equivalent of `Ratetimeintransit`.
  The TimeInTransit response container comes back only when a `*timeintransit`
  option was used **and** `DeliveryTimeInformation` was sent.
- Before the audit, `RateOptions.requestOption` and `.additionalinfo` existed but
  `getUpsRate` never read them, and `UPSRequestOption` lacked the two
  `*timeintransit` members. Now an explicit `requestOption` wins, else Rate when a
  service code or the `FRSShipmentIndicator` is present, else Shop. The FRS rule is
  an **inference**: the indicator is what marks a GFP request and GFP is Rate-only,
  so a GFP request without a service code was previously sent as Shop.
  `?additionalinfo=timeintransit` is appended when requested via `additionalinfo` or
  when `DeliveryTimeInformation` is present, except when the path option already
  carries time in transit.
- `transactionSrc` has `default: testing` in the spec; the client sets its own.
  `transId` is `required: false`, length 32.
- The response `RATEResponseWrapper` is `{ RateResponse }`; the function unwraps it.
- At v2409 `RatedShipment`, `RatedPackage`, `Alert`, `AlertDetail`,
  `RatedShipmentAlert`, `ItemizedCharges`, `TaxCharges`, `Disclaimer` and the like are
  "always returned as an array"; below v2409 (v2403 for most) a single element comes
  back as a bare object. The response types model arrays only.

### Spec contradictions

- `RateRequest.Request` has `required: [RequestOption]` but no `RequestOption`
  property is defined; two examples nevertheless send `RequestOption:
shopTimeInTransit` (camelCase, unlike the path's `Shoptimeintransit`). Kept as an
  optional property.
- Every `UnitOfMeasurement` container lists `Description` in `required`, but the
  property text says it is "not validated" or "ignored". Kept optional; needs a real
  account.
- `DCISType` differs between levels inside this one spec: package level says 1
  Unsupported, 2 Signature Required, 3 Adult Signature Required; shipment level says
  1 Signature Required, 2 Adult Signature Required. The Ship spec says the same as
  the shipment level in one place and the package-level table in another. The shared
  `DCISType` enum (used by shipping) is unchanged (1/2); package-level rating also
  accepts the new `UpsRatingPackageDCISType` (1/2/3). Which table is real is open.
- `ShipmentCharge`, `AddressLine`, `ShipmentIndicationType`, `HazMatChemicalRecord`
  and `ReturnContractServices` are arrays in the schema. The existing types accept a
  single object for several of them, and that leniency is kept and widened rather
  than narrowed, because the spec does not forbid it and the old comments claim UPS
  accepts it. Unverified.
- `ReturnServiceCodes` still has `"2"` (print and mail), which this spec's code list
  omits; `ImportControlCodes` text is truncated in the spec (`'03'` onwards only).
  Left as is.
- The shared `Indicator = "X" | "Y" | "true"` type cannot express the empty string
  that the spec's "empty tag" indicators use, and its own doc comment says UPS uses
  an empty string. Unresolved.
- Not verified against the spec because it has no enum: `CODFundsCodes` member
  naming, and `CountryCodesISO3166Alpha2` (an unused duplicate of
  `UpsValidCountryCode`). Other enum values spot-checked (pickup type, customer
  classification, packaging type, FRS payment type, handling unit type, dry ice UoM,
  regulation sets, transport mode, simple rate, premier category) matched.

### Audit of the rating types

Rating response types had no `RatingMethod` fields before, so there was nothing to
invert there: the enums of that name live in the shipping family, and the fix in
[Rating and billable-weight enums were inverted](#rating-and-billable-weight-enums-were-inverted)
is untouched. The new `UpsRateMethod` and `UpsRateBillableWeightMethod` use `"01"`
and `"02"` as the value, per that finding.

| Change                                                                                                                                                                                                                                                                                                               | Class                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `UPSRequestOption` gains `Ratetimeintransit`, `Shoptimeintransit`                                                                                                                                                                                                                                                    | non-breaking                                           |
| `getUpsRate` honours `options.requestOption` and `options.additionalinfo` (previously ignored)                                                                                                                                                                                                                       | non-breaking behaviour fix                             |
| `getUpsRate`: GFP (FRS indicator) with no service code now uses Rate, not Shop                                                                                                                                                                                                                                       | non-breaking behaviour fix                             |
| `Request.TransactionReference.CustomerContext` required to optional                                                                                                                                                                                                                                                  | non-breaking                                           |
| `Request.TransactionReference.TransactionIdentifier` required to optional, `@deprecated` (not in the spec)                                                                                                                                                                                                           | non-breaking                                           |
| `Shipper.Address`, `ShipTo.Address` now require `AddressLine` (new `UpsRatingRequiredLineAddress`)                                                                                                                                                                                                                   | breaking                                               |
| `AlternateDeliveryAddress.AddressLines` (not in the spec) required to optional, `@deprecated`                                                                                                                                                                                                                        | non-breaking                                           |
| `ShipFrom.ShipperNumber` (not in the spec) marked `@deprecated`                                                                                                                                                                                                                                                      | non-breaking                                           |
| `Shipment.ShipmentCharges` (not in the spec) marked `@deprecated`                                                                                                                                                                                                                                                    | non-breaking                                           |
| `Shipment.ShipmentIndicationType` accepts an array; `Description` added                                                                                                                                                                                                                                              | non-breaking                                           |
| `BillReceiver.Address` and `.Address.PostalCode` required to optional                                                                                                                                                                                                                                                | non-breaking                                           |
| `BillThirdPartyAddress` gains `AddressLine`, `City`, `StateProvinceCode`                                                                                                                                                                                                                                             | non-breaking                                           |
| `Package.Dimensions.Length/Width/Height` optional to required                                                                                                                                                                                                                                                        | breaking                                               |
| `UPSPremierCategories.UPSPremierPlatinum` `"03 "` to `"03"` (trailing space)                                                                                                                                                                                                                                         | breaking (value)                                       |
| `HazMat.HazMatChemicalRecord` optional to required, accepts an array                                                                                                                                                                                                                                                 | breaking                                               |
| `HazMatChemicalRecord.TransportationMode`, `.RegulationSet` optional to required                                                                                                                                                                                                                                     | breaking                                               |
| `HazMatChemicalRecord.PackagingGroupType` added; `PackingGroupType` (wrong wire name) `@deprecated`                                                                                                                                                                                                                  | non-breaking                                           |
| `PackageServiceOptions.ProactiveIndicator`, `Insurance.PackageProtection` added                                                                                                                                                                                                                                      | non-breaking                                           |
| `PackageServiceOptions.DeliveryConfirmation` accepts `UpsRatingPackageDCISType` too                                                                                                                                                                                                                                  | non-breaking                                           |
| `ShipmentServiceOptions` gains `GlobalCheckoutIndicator`, `SundayDeliveryIndicator`, `AvailableServicesOption`, `ShipperExportDeclarationIndicator`, `CommercialInvoiceRemovalIndicator`, `VerifiedDelivery`, `InsideDelivery`, `ItemDisposalIndicator`                                                              | non-breaking                                           |
| `RestrictedArticles.PerishablesIndicator` added; its `ShipperExportDeclarationIndicator` and `CommercialInvoiceRemovalIndicator` (misplaced; the spec has them on `ShipmentServiceOptions`) `@deprecated`                                                                                                            | non-breaking                                           |
| `Description` added on `ImportControl`, `ReturnService`, `ShipmentIndicationType`, `HandlingUnitType`, FRS `Type`, and the Adjusted-height, handling-unit-dimension and DimWeight UoM containers                                                                                                                     | non-breaking                                           |
| `DeliveryTimeInformation.ReturnContractServices` added                                                                                                                                                                                                                                                               | non-breaking                                           |
| `InvoiceLineTotal.CurrencyCode/MonetaryValue`, `PromotionalDiscountInformation.PromoCode/PromoAliasCode` optional to required (spec `required`)                                                                                                                                                                      | breaking                                               |
| `ServiceCode.UPSHeavyGoods = "75"` added                                                                                                                                                                                                                                                                             | non-breaking                                           |
| Duplicate `DeliveryConfirmation` and `AccessPointCOD` declarations (declaration-merged) removed                                                                                                                                                                                                                      | non-breaking                                           |
| `RatedShipment.RatedPackage` single object to **array** (v2409 always returns an array)                                                                                                                                                                                                                              | breaking                                               |
| `RatedShipment.GuaranteedDelivery` required to optional; `Zone`, `RateChart`, `RatingMethod`, `BillableWeightCalculationMethod`, `BaseServiceCharge`, `ItemizedCharges`, `FRSShipmentData`, `TaxCharges`, `TotalChargesWithTaxes`, `Disclaimer`, `RoarRatedIndicator` added                                          | non-breaking                                           |
| `RatedShipment.RatedShipmentAlert` required to optional; `Service.Description` required to optional                                                                                                                                                                                                                  | non-breaking (readers)                                 |
| `RatedShipment.TimeInTransit` required to optional; `PackageBillType` optional; `PickupDate` kept; `AutoDutyCode`, `DocumentsOnlyIndicator`, service summary `Disclaimer`, Saturday and Sunday fields, `DelayCount`, `HolidayCount`, `RestDays`, `TotalTransitDays` added; `Arrival.Time` and `Pickup.Time` optional | non-breaking (readers)                                 |
| `RateResponse.Response.Alert` and `.TransactionReference` required to optional; `AlertDetail` added; `TransactionReference.TransactionIdentifier` removed (not in the spec)                                                                                                                                          | breaking only for code reading `TransactionIdentifier` |
| `RatedPackage` fields all optional per spec; `BaseServiceCharge`, `Accessorial`, `ItemizedCharges`, `NegotiatedCharges`, `SimpleRate`, `RateModifier` added                                                                                                                                                          | non-breaking (readers)                                 |
| `NegotiatedRateCharges` gains `BaseServiceCharge[]`, `RateModifier[]`; `TotalCharge` stays required                                                                                                                                                                                                                  | non-breaking                                           |
| Response types now named (`UpsRating*`); inline shapes replaced                                                                                                                                                                                                                                                      | non-breaking                                           |

### Findings from the audit against UPS's examples

- **Presence flags admit `""`.** The spec describes these fields as "True if tag exists... Any value inside is ignored", yet `Indicator` was `"X" | "Y" | "true"`, so the empty tag could not be written. It is now `"" | "X" | "Y" | "true"`. Source: Rating spec field descriptions (vendor documentation).
- **`ServiceCode` and `CODFundsCodes` are no longer closed.** Rating's `Service.Code` says "refer to Service Codes in the Appendix", and `COD.CODFundsCode` says "refer to Rating and Shipping COD Supported Countries or Territories in the Appendix". The spec's own `International_Rate` example sends `"072"`, which the 15-member enum rejected (example embedded in UPS's OpenAPI spec). The fields are now `Enum | (string & {})`, and the enums stay exported as the known subset. No Rating field has an `enum:` in the spec. Every other Rating enum comes from a prose "Valid values" list and is left closed.
- **Requests accept one object or an array where the spec's examples send one object.** Source: examples embedded in UPS's OpenAPI spec, found by type-checking all 69 request examples and Java samples against the package. Rating `Shipment.Package` is now `Package | Package[]`. Responses were not widened.
- **`TransactionReference.TransactionIdentifier`** is optional on the response. It appears in UPS's published Java samples, run at API version v1, and in spec examples, but the schema does not define it.
- **`RateOptions.version` and older versions.** The option still accepts versions before v2403. At those versions UPS returns single objects for `RatedShipment`, `RatedPackage` and `Alert`, while `RateResponse` types them as arrays. Source: UPS's published Java sample, run at v1. Whether any version in between collapses single results is unproven. The stale exported type `RateResponseObject` is kept because `origin/master` exported it.
- **Example defects left in the spec** (no type change): `shop_TimeInTransit_CIE` sends `RequestOption: "shopTimeInTransit"` (case differs from `Shoptimeintransit`) and `StateProvinceCode: true` (a boolean). `Negotiated_Rate` and `TPFC_Negotiated` put `AttentionName` under `BillThirdParty`, which the schema lacks. `TPFC_Negotiated` puts `ShipmentRatingOptions` inside `Package`; the schema defines it on `Shipment`. `Time_In_Transit` nests `Shipper` inside `Shipper`.

## Time In Transit

Source: the "Time In Transit" spec (`TimeInTransit.yaml`), vendor documentation.
There is no `-Ready` twin.

| Function           | Method and URL                        | Code     |
| ------------------ | ------------------------------------- | -------- |
| `getTimeInTransit` | POST `/api/shipments/v1/transittimes` | UPS_0025 |

- `transId` and `transactionSrc` are both `required: true` here, unlike Rating; the
  client already sends both.
- The request `TimeInTransitRequest` is flat camelCase, not the PascalCase wrapper
  Rating uses. Only `originCountryCode` is `required`.
- Spec contradiction: the example sends `weight: '10.5'` and `numberOfPackages: '1'`
  as strings while the schema says `number` and `integer`. Typed per the schema.
- `avvFlag` is documented as "not to be exposed to external customers"; it is typed
  but callers should leave it alone.
- `dropOffAtFacilityIndicator` and `holdForPickupIndicator` are integers 0/1 per the
  schema although their text says `"0", "1"`.
- The response `TimeInTransitResponse` has no `required` list, so all four containers
  are optional. `emsResponse.weight` and `shipmentContentsValue` come back as strings
  while the request sends numbers. `destinationPickList` and `originPickList` return
  candidate addresses when `validationList.*Ambiguous` is true (spec wording: "has a
  candidate list").
- The spec states no maximum for `maxList` beyond "default 200".
- Open question (needs a real account): `residentialIndicator` uses `01` residential
  and `02` commercial here, whereas Rating uses a presence flag. Confirm the mapping
  against a real response.

### Findings from the audit against UPS's examples

- **Optional response fields.** `services[].saturdayDeliveryIndicator` is listed in the spec's `required` array but the schema defines no such property, so it is optional in the type. The candidate address `required` list spells `CountryCode`, but the property is `countryCode`, so it is also optional. Source: TimeInTransit spec (vendor documentation).
- **Request values.** The spec schema types `weight`, `shipmentContentsValue` and `numberOfPackages` as numbers. The spec's own example and UPS's published Java samples, run at v1, send them as strings (`"10.5"`, `"1"`) and send `residentialIndicator: ""`. The request type accepts `number | string` for those three and `""` for the indicator. Whether the live service coerces them is unproven.

## Tracking

Source: the "UPS TrackService API" spec (`Tracking.yaml`), vendor documentation.
Servers are `https://wwwcie.ups.com/api` and `https://onlinetools.ups.com/api`, and
the path is the literal `/track/v1/...`. The `-Ready` twin differs in description text
only.

| Function                 | Method and URL                                          | Code     |
| ------------------------ | ------------------------------------------------------- | -------- |
| `trackPackage`           | GET `/api/track/v1/details/{inquiryNumber}`             | UPS_0006 |
| `trackByReferenceNumber` | GET `/api/track/v1/reference/details/{referenceNumber}` | UPS_0045 |
| `trackShipmentPackages`  | GET `/api/track/v1/shipment/details/{inquiryNumber}`    | UPS_0046 |

- `trackPackage` query: `locale` (default `en_US`), `returnSignature`,
  `returnMilestones`, `returnPOD` (all strings, default `"false"`). v1.0.0 sent only
  the first two; the other two are now reachable.
- `trackByReferenceNumber` query: `locale`, `fromPickUpDate` (default currentDate-14),
  `toPickUpDate` (default currentDate), `destCountry`, `destZip`, `shipperNum`,
  `refNumType` (`SmallPackage` or `fgv`). The spec's `refNumType` default is the
  prose string "SmallPackage. Valid values: SmallPackage, fgv", and the type takes it
  as an enum, which is an **inference**. The date format of the two pickup dates is
  not stated; `YYYYMMDD` in the type comment is an **inference** from the rest of UPS.
- `trackShipmentPackages` query: `locale`, `offset` (0-based, default 0), `count`
  (default 50). `packageCount` on a package may exceed the packages returned, so
  callers page with these.
- All three return the same `TrackApiResponse`. Error bodies (400, 403, 404, 500, 503)
  are `{ response: { errors: [{code, message}] } }`, and the 403 is described
  "Blocked Merchant".
- Nothing in the schema is `required`, so every response field is optional. v1.0.0
  made nearly all of them required.
- **Timezone claim is unverified.** The v1.0.0 comment that each activity's date and
  time is in the timezone of the city or state where it occurred appears nowhere in
  `Tracking.yaml`. The spec gives `date` as YYYYMMDD and `time` as HHMMSS plus
  separate `gmtDate`, `gmtTime` and `gmtOffset`. The source of the claim is unknown;
  it is kept as a field comment on `Activity` and should be read as unverified. Use
  the `gmt*` fields for an unambiguous instant.
- The spec's `transactionSrc` default `testing` is overridden by the client's own
  value (see [`transactionSrc`](#transactionsrc)).
- `trackPackage(clientName, trackingNumber: string, options?)` takes a bare string
  positional after `clientName`, kept because it is published. The two new functions
  take named params.
- Open question: whether the single-object-vs-array collapse seen in Address
  Validation v1 exists for tracking. The spec does not say, and everything is typed
  as arrays.

### Audit of the tracking types

| Type or field                                                                                                                  | Change                                                                                                                                                                                                                                        | Class                                                         |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `TrackPackageResponse`, `UpsShipment`, `Activity`                                                                              | every field now optional (spec has no `required`)                                                                                                                                                                                             | breaking for strict callers reading fields without checks     |
| `Package` (unexported) to `UpsTrackingPackage` (exported)                                                                      | renamed and exported; added `dimension`, `isSmartPackage`, `ucixStatus`; all fields optional                                                                                                                                                  | non-breaking (it was unnameable before)                       |
| `alternativeTrackingNumber` to `alternateTrackingNumber`                                                                       | the spec's name; v1.0.0's field never existed on the wire                                                                                                                                                                                     | breaking at compile time, a bug fix at runtime                |
| `Status.description`                                                                                                           | literal union of English strings to `string` (UPS translates it by locale)                                                                                                                                                                    | breaking for exhaustive checks                                |
| `Status.type`, `Status.statusCode`                                                                                             | closed unions to `known \| (string & {})`; the spec types both as plain strings                                                                                                                                                               | non-breaking for readers; narrowing comparisons still compile |
| `Status`, `Address`, `Warning`, `MileStone`, `PackageAddress`, `PaymentInformation`, `ReferenceNumber`, `Service` (unexported) | exported as `UpsTracking*`; `MileStone.subMilestone` and `deliveryInformation.signature` optional; `Service.levelCode`, `Activity.gmtDate/gmtOffset/gmtTime/logicalScan`, `deliveryInformation.deliveryPhoto/pod`, `deliveryTime` types added | non-breaking                                                  |
| `deliveryInformation`, `deliveryTime`, `weight`, `milestones`                                                                  | optional (spec)                                                                                                                                                                                                                               | breaking for strict callers                                   |
| inline `options` of `trackPackage`                                                                                             | named `UpsTrackingDetailsOptions`, gains `returnMilestones`, `returnPOD`                                                                                                                                                                      | non-breaking                                                  |
| URL                                                                                                                            | tracking number now `encodeURIComponent`-ed; query built with `URLSearchParams` (same string for the default call)                                                                                                                            | non-breaking                                                  |

## Track Alert

Source: the "UPS Track Alert API v2" spec, vendor documentation. Servers are
`https://wwwcie.ups.com/api/track/{version}` and `https://onlinetools.ups.com/api/track/{version}`.
The two `-Ready` files differ from their twins in description text only.

| Function                       | Method and URL                                   | Code     |
| ------------------------------ | ------------------------------------------------ | -------- |
| `createTrackAlertSubscription` | POST `/api/track/v2/subscription/{type}/package` | UPS_0047 |

- **Standard and enhanced are one operation.** `UPSTrackAlert.yaml` and
  `UPSTrackAlertEnhanced.yaml` differ by 47 lines, all in `components.schemas`: the
  Enhanced file adds `AccountSubscriptionRequest`, `AccountSubscriptionResponse` and
  `AccountUnsubscribeResponse` (an `Outbound` sub-account type,
  `shipperAccountNumber`). Paths, parameters, `operationId`
  (`processSubscriptionTypeForTrackingNumber`) and the `{type}` enum (`standard` or
  `enhanced`) are identical, and neither file has an operation that references the
  account schemas. So there is no second endpoint: no separate enhanced function
  exists, UPS_0048 is unused, and `{type}` is a discriminant in
  `UpsTrackAlertSubscriptionParams`. The account-subscription schemas are unreachable
  and were not modelled; if UPS later publishes the paths they need a new function.
- `eventPreferences` (D, I, M, X; 1 to 4 entries) is in the shared `CommonRequest`
  schema but its description says "only for enhanced users", so it is typed only on
  the enhanced body (**inference**). `locale` is the only `required` field of
  `CommonRequest`, and `trackingNumberList` (max 100) of the package request.
  Tracking numbers match `1Z` plus 16, or `1R` plus 14, or 26 alphanumerics.
- A 200 can carry `invalidTrackingNumbers`: partial success is not an error. A 400
  carries the same field alongside `response.errors`.
- Error codes in the spec table are `VSS...` strings (for example `VSS300` locale
  required, `VSS220` over 100 numbers, `VSS930` bad type).
- The "TrackingEvent" webhook (UPS POSTs to the subscriber; the spec expects a 200
  back) is not a request this plugin makes, so it has no function. The payload is
  exported as `UpsTrackAlertEvent` and the headers as `UpsTrackAlertWebhookHeaders`
  (`x-api-key`, `User-Agent: UPSPubSubTrackingService`). Event `activityStatus.type` is
  `D I M MV U X`; `U` and `MV` appear only in the webhook enum, not in
  `eventPreferences`. The spec's examples carry `activityStatus.descriptionCode`,
  which the schema lacks, so it is typed optional. Under v2, webhook credentials are
  managed separately ("Manage Webhook Credentials"); nothing in the Track Alert spec
  describes that endpoint, and no other spec was checked for it (negative result).
- **Spec defect.** The `webhooks:` block is malformed structurally: indented under
  `paths`, then `TrackingEvent:` at the top level. A Ruby parse places it under a stray
  key, so the content was read directly.

Open questions (need a real account):

- Whether `eventPreferences` sent on a `standard` subscription is rejected or
  ignored (`additionalProperties: true` suggests ignored).
- Whether the webhook `x-api-key` header is the only authentication UPS offers the
  receiver.

## Address Validation (street level)

Source: the "Address Validation - Street Level" spec, vendor documentation. The
`-Ready` twin differs in description text only. This section adds to
[Address Validation query parameters](#address-validation-query-parameters), which
rests on observed responses.

| Function                          | Method and URL                                   | Code     |
| --------------------------------- | ------------------------------------------------ | -------- |
| `makeUpsAddressValidationRequest` | POST `/api/addressvalidation/v2/{requestoption}` | UPS_0004 |

- `requestoption` is an integer 1 to 3 (1 validation, 2 classification, 3 both).
  The `{deprecatedVersion}` (`v1`) twin is `deprecated: true` and has no function.
- The documented query parameters are `regionalrequestindicator` (string, "True or
  False") and `maximumcandidatelistsize` (integer, 0 to 50, default 15). Both are
  reachable through the optional third parameter `UpsAddressValidationOptions`;
  defaults are unchanged (option 3, size 10).
- The options type is a union that forbids `regionalRequestIndicator` unless
  `requestOption` is 1. That encodes the observed 400 in
  [`regionalrequestindicator` cannot be combined with classification](#regionalrequestindicator-cannot-be-combined-with-classification),
  which outranks the spec. Option 1 is the only value verified to accept it. Whether
  option 2 also rejects a regional request is not covered by the nine observed
  variants, which tried only option 3 with the parameter; the type is conservative
  about 2, an **inference**.
- The spec says the sandbox (CIE) returns results only for NY and CA addresses.
- The spec says `Candidate` and `Alert` are "always returned as an array" for
  versions at or above v2 (v1 collapsed a single element to an object). The plugin
  pins v2, so the types are arrays.
- In the request `AddressKeyFormat` only `CountryCode` is `required`. `Region` (US and
  PR only) overrides the political-division and postcode fields; `ConsigneeName`,
  `AttentionName` and `AddressLine` are ignored for a regional request.
- The request wrapper `XAVRequest` is correct; the response wrapper is `XAVResponse`.

### Audit of the address validation types

| Type or field                                                                                                                                                                                                         | Change                                                                                                                                                                      | Class                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `XAVRequest.XAVRequest.AddressKeyFormat`                                                                                                                                                                              | now the named `UpsAddressValidationAddressKeyFormat`; `AddressLine`, `PoliticalDivision2`, `PostcodePrimaryLow` made optional; `Region`, `Urbanization` added               | non-breaking (request widened)                                           |
| `makeUpsAddressValidationRequest`                                                                                                                                                                                     | optional third parameter `options`                                                                                                                                          | non-breaking                                                             |
| `UPSValidationResponse.Candidate`                                                                                                                                                                                     | `AddressCandidate \| AddressCandidate[]` to `AddressCandidate[]` (v2 always an array)                                                                                       | breaking for code that handled the bare object                           |
| `AddressCandidate.AddressKeyFormat.AddressLine`                                                                                                                                                                       | `string \| string[]` to `string[]`                                                                                                                                          | breaking for code that handled a bare string                             |
| `AddressCandidate.AddressKeyFormat`                                                                                                                                                                                   | `AddressLine`, `PoliticalDivision1/2`, `PostcodePrimaryLow`, `PostcodeExtendedLow` made optional (spec requires only `CountryCode`); `ConsigneeName`, `AttentionName` added | breaking (fields a caller read as `string` become `string \| undefined`) |
| `UPSValidationResponse.Response.TransactionReference`                                                                                                                                                                 | now optional; `CustomerContext` optional; `TransactionIdentifier` kept but optional (not in the spec)                                                                       | breaking (optionality)                                                   |
| `UPSValidationResponse.Response.Alert`                                                                                                                                                                                | added                                                                                                                                                                       | non-breaking                                                             |
| `AddressClassification` (both places)                                                                                                                                                                                 | extracted to `UpsAddressClassification`; `Description` gains `"UnClassified"` (the spec's own text); comment typo fixed                                                     | non-breaking for readers except exhaustive switches                      |
| new exports `UpsAddressValidationOptions`, `UpsAddressValidationRequestOption`, `UpsAddressValidationAddressKeyFormat`, `UpsAddressValidationResponseStatus`, `UpsAddressValidationAlert`, `UpsAddressClassification` | added                                                                                                                                                                       | non-breaking                                                             |

### Findings from the audit against UPS's examples

- `AddressClassification.Description` is the four known values plus any string, because the spec gives no closed list.
- **`AddressLine` on requests accepts a bare string.** UPS's Java samples (v1) send a bare string; the v2 schema says array. The type is `string | string[]`.
- **Not typed.** The Java samples nest a `Request` container (with `TransactionReference`) inside `XAVRequest`; the v2 schema has only `AddressKeyFormat`. The spec's own example sends `AddressKeyFormat.BuildingName`, which is in no schema.
- **`regionalRequestIndicator` casing.** It is sent as lowercase `true`/`false` while the spec prose says "True or False". Unknown query values are silently ignored by this API, so a casing mismatch would degrade quietly into a non-regional request. Neither has been checked against a real account.
- The spec has one array, `AddressLine`, with no "always an array" note. Whether a single line collapses to a bare string at v2 is unproven; UPS's v1 behaviour is a bare string.

## Delivery Defense

Source: the "DeliveryDefense API" 1.0 spec, vendor documentation. The `-Ready` twin
differs in description text only. The version is baked into the server URLs
`https://wwwcie.ups.com/api/deliverydefense/external/v1.0` and its production twin,
so there is no version parameter.

| Function                         | Method and URL                                          | Code     |
| -------------------------------- | ------------------------------------------------------- | -------- |
| `getDeliveryDefenseAddressScore` | POST `/api/deliverydefense/external/v1.0/address/score` | UPS_0050 |

- The request requires `street`, `city`, `state` and `zipCode`. `zipCode` has the
  pattern `^[0-9]{5}(?:-[0-9]{4})?$`, so the API is US-only (an **inference** from
  the pattern).
- Responses: 200 (score); **204** (address format valid but no score could be
  calculated, with an empty body). `getDeliveryDefenseAddressScore` returns
  `undefined` for it, whether axios reports the empty body as `""` or the status is
  204, and its return type says `| undefined`; a real-handler test
  (`test/realHandler.test.ts`) serves a 204; 400 (`Error400`, a
  problem-details object with a free-form `errors`); 401 (`{errorCode,
errorMessage}`); 500 (no schema).
- `score` bands: 900 to 1000 low likelihood of loss; 700 to 899 4x; 500 to 699 16x;
  300 to 499 18x; 100 to 299 21x higher. `resiComFlag` is a plain string
  ("Residential" in the examples; "Commercial" is assumed, not shown).
- The spec declares no `parameters` at all, so it lists no `transId` or
  `transactionSrc` headers. The client still sends them, which is harmless by
  **inference**.
- One 200 example's `address` strings carry a trailing comma; cosmetic.

## Pickup operations

Source: the "Pickup" spec (`Pickup.yaml`), vendor documentation. Servers are
`https://wwwcie.ups.com/api` and `https://onlinetools.ups.com/api`. The spec's
`info.version` is an empty string. See also
[Pickup path segments](#pickup-path-segments), which explains `CancelBy` and
`pickuptype`.

| Function                           | Method and URL                                                                    | Code     |
| ---------------------------------- | --------------------------------------------------------------------------------- | -------- |
| `createPickup`                     | POST `/api/pickupcreation/v2409/pickup`                                           | UPS_0010 |
| `cancelPickup`                     | DELETE `/api/shipments/v2409/pickup/02`, `Prn` header                             | UPS_0011 |
| `cancelPickupByAccountNumber`      | DELETE `/api/shipments/v2409/pickup/01`, no header                                | UPS_0043 |
| `getPickupRate`                    | POST `/api/shipments/v2409/pickup/{pickuptype}`                                   | UPS_0012 |
| `getPickupPendingStatus`           | GET `/api/shipments/v2409/pickup/{pickuptype}`, `AccountNumber` header (required) | UPS_0030 |
| `getPickupPoliticalDivisions`      | GET `/api/pickup/v2409/countries/{countrycode}`                                   | UPS_0031 |
| `getPickupServiceCenterFacilities` | POST `/api/pickup/v2409/servicecenterlocations`                                   | UPS_0032 |

- Every operation's `version` path parameter documents `v2409` as the only valid
  value and the default. Cancel `01` is account number and `02` is PRN; Rate and
  Pending Status take `oncall`, `smart` or `both`.
- **Spec contradiction, Cancel.** The operation documents only a `Prn` header
  (described "Required if CancelBy = prn", length 26) and no request body, yet
  components define a `PickupCancelRequest` body schema (`CancelBy`, optional `PRN`
  of length 11, "Required if CancelBy = 02"). Nothing in the operation says where an
  account number is sent for `01`. **Inference:** the account comes from the OAuth
  token. This is an open question needing a real account. The PRN length also
  disagrees (26 in the header, 11 in the body).
- **Spec contradiction, `createPickup`.** The Creation request body is a `oneOf` of
  `PICKUPCreationRequestWrapper` and `PICKUPTriggerGWNRequestWrapper` (the "Smart
  Pickup" example: `PickupTriggerGWNRequest` with `AccountNumber` and
  `ServiceDateOption`), with a matching `oneOf` response. `createPickup` is an
  overload pair so both bodies are reachable and each gets its own response type.
- **Spec contradiction, Rate.** The schema requires `Request` and
  `AlternateAddressIndicator`, while the worked example omits `Request`. The schema is
  followed. The example also writes `ReadyTime` as `'900'` where every description says
  `HHMM`.
- For versions at or above v2403 an element "will always be returned as an array"
  (older versions returned a single object when there was one). v2409 is pinned, so
  arrays are typed.
- Deprecated operations with no function (negative result): `DELETE
/shipments/{deprecatedVersion}/pickup/{CancelBy}` and `POST
/pickupcreation/{deprecatedVersion}/pickup`.
- Existing signatures are kept. `cancelPickup(clientName, prn: string)` puts a bare
  `string` positional after `clientName`, against the repo's own rule.

### Audit of the pickup types

`types.ts` was rebuilt from `components.schemas`. The exported names are unchanged:
`UpsPickupCreationRequest`, `UpsPickupCreationResponse`, `UpsPickupCancelResponse`,
`UpsPickupRateRequest`, `UpsPickupRateResponse`, `UpsPickupType`. The wrapper
(`{ PickupXRequest: ... }`) is unchanged; the inner object is now
`UpsPickupXRequestBody`. "Reader" means a caller reading a response field.

| Type and field                                  | Change                                                                                                                                                                                                                                                                                                                     | Class                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| CreationRequest `Request`                       | new required object (`SubVersion?`, `TransactionReference?`)                                                                                                                                                                                                                                                               | breaking                 |
| CreationRequest `AlternateAddressIndicator`     | optional to required                                                                                                                                                                                                                                                                                                       | breaking                 |
| CreationRequest `PaymentMethod`                 | optional `"00".."03"` to required `string` (spec describes 00, 01, 03, 04, 05, 06 ...; the old union missed members)                                                                                                                                                                                                       | breaking                 |
| CreationRequest `RatePickupIndicator`           | `"Y"\|"N"` to `string`                                                                                                                                                                                                                                                                                                     | non-breaking             |
| CreationRequest `Shipper`, `Shipper.Account`    | required to optional; `ChargeCard` added                                                                                                                                                                                                                                                                                   | non-breaking             |
| CreationRequest `PickupAddress`                 | `CompanyName`, `ContactName`, `ResidentialIndicator` optional to required; `PostalCode` required to optional; `Room`, `Floor`, `Urbanization`, `PickupPoint` added                                                                                                                                                         | breaking                 |
| CreationRequest `TotalWeight.UnitOfMeasurement` | `{ Code: string }` to `string` (spec schema and its own example: `LBS`)                                                                                                                                                                                                                                                    | breaking                 |
| CreationRequest                                 | added optional `RateChartType`, `TaxInformationIndicator`, `UserLevelDiscountIndicator`, `OverweightIndicator`, `TrackingData`, `TrackingDataWithReferenceNumber`, `SpecialInstruction`, `ReferenceNumber`, `FreightOptions`, `ServiceCategory`, `CashType`, `ShippingLabelsAvailable`, `PremierIndicator`, `Notification` | non-breaking             |
| CreationResponse `PRN`                          | required to optional                                                                                                                                                                                                                                                                                                       | breaking (reader)        |
| CreationResponse `RateStatus.Description`       | required to optional                                                                                                                                                                                                                                                                                                       | breaking (reader)        |
| CreationResponse                                | `RateStatus` optional to required; added `WeekendServiceTerritory(Indicator)`, `RateResult`, `Response.Alert`, `Response.TransactionReference`                                                                                                                                                                             | non-breaking             |
| RateRequest `Shipper.Account`                   | replaced by flat optional `ShipperAccount { AccountNumber, AccountCountryCode }` (the old shape was not in the spec)                                                                                                                                                                                                       | breaking                 |
| RateRequest `Request`                           | new required                                                                                                                                                                                                                                                                                                               | breaking                 |
| RateRequest `ServiceDateOption`                 | optional `"01"\|"02"\|"03"` to required `string`                                                                                                                                                                                                                                                                           | breaking                 |
| RateRequest `AlternateAddressIndicator`         | optional to required                                                                                                                                                                                                                                                                                                       | breaking                 |
| RateRequest `PickupDateInfo`                    | required to optional                                                                                                                                                                                                                                                                                                       | non-breaking             |
| RateRequest `PickupPiece`, `TotalWeight`        | removed (not in the Rate schema)                                                                                                                                                                                                                                                                                           | breaking                 |
| RateRequest `PickupAddress`                     | `CompanyName`, `ContactName`, `Phone` removed; `AddressLine` is a single `string?` not `string[]`; `PostalCode`, `ResidentialIndicator` now required                                                                                                                                                                       | breaking                 |
| RateRequest                                     | added optional `RateChartType`, `TaxInformationIndicator`, `UserLevelDiscountIndicator`                                                                                                                                                                                                                                    | non-breaking             |
| RateResponse `RateResult`                       | `ChargeDetail`, `GrandTotalOfAllCharge`, `RateType` required to optional; `ChargeDetail.ChargeDescription`, `TaxAmount` required to optional; added `Disclaimer`, `TaxCharges`, tax and incented totals                                                                                                                    | breaking (reader)        |
| RateResponse                                    | added `WeekendServiceTerritory(Indicator)`, `Response.Alert`                                                                                                                                                                                                                                                               | non-breaking             |
| CancelResponse                                  | `Response.TransactionReference.CustomerContext` required to optional; added `GWNStatus`, `Response.Alert`                                                                                                                                                                                                                  | breaking (reader, minor) |
| `createPickup`                                  | const arrow to overloaded function declaration; the creation call is unchanged                                                                                                                                                                                                                                             | non-breaking             |

### Findings from the audit against UPS's examples

- **`cancelPickupByAccountNumber`.** The spec defines no parameter for `CancelBy=01`: no `Prn` header and no account number anywhere on the path, so the request names no account. Which account UPS cancels is unverified.
- **Response arrays.** The Pickup spec has 13 response arrays with no "always an array" note. Whether any collapses to a single object at v2409 is unproven. UPS's v1 Java samples show single objects in several places.
- **Request shapes.** `PickupCreationRequest.Request`, `PickupRateRequest.Request` and `PickupGetServiceCenterFacilitiesRequest.Request` are in the spec's `required` lists, but UPS's own examples omit them. All three are optional in the types. `PickupPiece` and `PickupAddress.AddressLine` accept one object or string where the examples send one.
- **`TransactionIdentifier`** is on the response reference. It appears in the spec's Smart Pickup example response.
- **Error codes.** `cancelPickup` is `UPS_0011` (unchanged from v1.0.0) and `cancelPickupByAccountNumber` is `UPS_0043`.

## Pickup notification preferences

Source: the "CCPS WS General Preferences API v1" spec (v1.0), vendor documentation.
Servers are `https://{onlinetools|wwwcie}.ups.com/api/digital-experience/preferences/{version}`.

| Function                              | Method and URL                                                                 | Code     |
| ------------------------------------- | ------------------------------------------------------------------------------ | -------- |
| `getPickupNotificationPreferences`    | GET `/api/digital-experience/preferences/v1/account-pickup?account_number=...` | UPS_0033 |
| `updatePickupNotificationPreferences` | PUT the same URL                                                               | UPS_0034 |

- `account_number` is a required query parameter. Optional headers are `UUID` (JWT
  callers only) and `id_token` (Auth0 only), modelled as `uuid` and `idToken` options.
- GET returns `payload` as an array of `{ accountNumber, versionNumber, ...preference }`;
  PUT returns a single object. Typed that way.
- `versionNumber` is a 19-digit integer in the spec's example (`1740530158285357000`),
  above `Number.MAX_SAFE_INTEGER` (9007199254740991). `JSON.parse` rounds a number
  that large, so a caller who reads `versionNumber` and echoes it back on the PUT may
  send a different value than UPS issued. Whether UPS uses it for optimistic
  concurrency is not stated. **Inference** from the example; no code change.
- Header schema contradiction: `transId` has `pattern {3,100}` but `maxLength: 50`;
  `transactionSrc` has `pattern {3,100}` but `maxLength: 36`. The client's values
  (32 hex, `dianemo`) satisfy both readings.

## Smart Pickup Account Management

Source: the "Smart Pickup Account Management v1" spec (v1.0), vendor documentation.
Servers are `.../api/account/pickup-info/{version}`.

| Function                   | Method and URL                                   | Code     |
| -------------------------- | ------------------------------------------------ | -------- |
| `manageSmartPickupTrigger` | POST `/api/account/pickup-info/v1/smart-trigger` | UPS_0035 |
| `viewSmartPickupInfo`      | POST `/api/account/pickup-info/v1/view`          | UPS_0036 |
| `updateSmartPickupInfo`    | POST `/api/account/pickup-info/v1/update`        | UPS_0037 |

- `Content-Type` is a required header; the JSON body makes the transport send it.
- `/view` is a POST that only reads.
- The request schema spells `AccountInfo.AccountNmber` (sic); see
  [Smart Pickup account key](#smart-pickup-account-key).
- `transactionSrc` has a maximum length of 30 here; the client default `dianemo`
  fits.
- `SmartPickupCommonResponseV1.Alert` is a single required object, not an array.

### Smart Pickup account key

The request schema's `AccountInfo` property is the typo `AccountNmber`. The
`AccountNumber` key is what the request examples embedded in UPS's OpenAPI spec send,
and what the response schema declares (re-checked 2026-11-12). `UpsSmartPickupAccountInfoV1`
therefore accepts both spellings, both optional, and sends whichever the caller sets.
Which one the live service reads is unknown: an open question for a real account.

## UPS Pickup Points

Source: the "UPS Lab Logistics Pickup Points API" v1.0.0 spec, vendor documentation.
The production server is `https://onlinetools.ups.com/api/uppmanage/{version}`. The
Customer Integration Environment server's `url` is the literal string `Not
Available`, so there is no test environment and every call here goes to production.

| Function                                | Method and URL                             | Code     |
| --------------------------------------- | ------------------------------------------ | -------- |
| `confirmPickupPointsOrder`              | POST `/orders`                             | UPS_0038 |
| `getPickupPointsInboundTrackingNumbers` | POST `/locations/inbound/tracking-numbers` | UPS_0039 |
| `updatePickupPointsSiteDetails`         | POST `/sites/{startdate}/{enddate}`        | UPS_0040 |
| `getPickupPointsSiteDetails`            | GET `/sites/{startdate}/{enddate}`         | UPS_0041 |
| `getPickupPointsSubscriptions`          | GET `/subscriptions/sites`                 | UPS_0042 |

All paths are under `/api/uppmanage/v1`.

- **Name discrepancy.** The POST on `/sites/...` is `getSiteDetailsByDateRange` in the
  spec and it reads (inbound-token lookup, paging query). The function name
  `updatePickupPointsSiteDetails` was kept, but per the spec it does not update
  anything.
- Required headers beyond the client's `Authorization`, `transId` and
  `transactionSrc`: `clientId` and `locale` (`xx_XX`) on every operation; optional
  `sessionid` (not documented on the two site-details GET and subscription
  operations); `Cookie` (a QVMC session cookie) and `Username` (from "XOLT Gateway")
  on site details and subscriptions; optional `UUID`. These are modelled in named
  option types.
- **Open question needing a real account.** `Authorization` is documented as a
  "Bearer JWT token", and `Cookie`, `Username` and `UUID` describe a UPS web-session
  context. It is unknown whether an OAuth client-credentials token is accepted, or
  whether this API is reachable only from inside UPS's own web applications.
- Query parameters: `offset` (default `"0"`), `limit` (default `"25"`), `sort` (for
  example `+locationidentifier`), `location_identifier` on both site-details
  operations; the GET adds `location_id_category_code` (`01` or `02`), `city`, `state`
  and `country`. All are strings in the spec, including the numeric ones. The POST's
  category code travels in its body.
- Order creation returns `201` in the spec; the others return `200`.
- **`getPickupPointsSiteDetails` sets `Content-Type: application/json` itself.** It
  is a body-less GET, and the spec's `getSiteDetailsByDateRangeStandardFetch` lists
  `Content-Type` among its required parameters (the subscriptions GET does not). A
  request with no body gets no `Content-Type` from the transport, but an explicit one
  on a body-less GET does survive, as the Forwarding document download shows
  (`test/realHandler.test.ts`). Whether UPS would reject the request without it is
  unknown.

## Dangerous goods, PreNotification, paperless, Quantum View and Locator

Sources: the "Dangerous Goods Utility", "PreNotification", "Paperless Document",
"Quantum View" and "Locator" specs, vendor documentation. Every spec lists
`https://wwwcie.ups.com/api` and `https://onlinetools.ups.com/api`, so there is no
host discrepancy. Each spec's OAuth token URL is the CIE one, as elsewhere. A
deprecated `{deprecatedVersion}` path (`v1`, plus `v1801` for chemical reference
data) exists in all five, one per live operation, and none has a function (negative
result: nine deprecated operations skipped).

| Function                                 | Method and URL                                               | Code     |
| ---------------------------------------- | ------------------------------------------------------------ | -------- |
| `getDangerousGoodsChemicalReferenceData` | POST `/api/dangerousgoods/v2409/chemicalreferencedata`       | UPS_0055 |
| `checkDangerousGoodsAcceptanceAudit`     | POST `/api/dangerousgoods/v2/acceptanceauditprecheck`        | UPS_0056 |
| `sendDangerousGoodsPreNotification`      | POST `/api/dangerousgoods/v2/prenotification`                | UPS_0057 |
| `uploadPaperlessDocument`                | POST `/api/paperlessdocuments/v2/upload`                     | UPS_0058 |
| `pushPaperlessDocumentImage`             | POST `/api/paperlessdocuments/v2/image`                      | UPS_0059 |
| `deletePaperlessDocument`                | DELETE `/api/paperlessdocuments/v2/DocumentId/ShipperNumber` | UPS_0060 |
| `getQuantumViewEvents`                   | POST `/api/quantumview/v3/events`                            | UPS_0061 |
| `searchUpsLocations`                     | POST `/api/locations/v3/search/availabilities/{reqOption}`   | UPS_0062 |

### Dangerous Goods Utility

- **The acceptance audit pre-check version contradicts itself.** The schema has
  `default: v3`, but the description says "Valid values: - v2", the deprecated twin
  is `v1`, and the response notes say "versions >= v2 return arrays". `v3` appears
  nowhere else in that spec. `v2` is pinned, following the "Valid values" text. This
  is a **judgement**, and the likely explanation is a default pasted from another
  spec. It needs a real account to settle: if `/v2/` returns 404, try `v3`.
- The chemical reference data and pre-check bodies carry `ShipperNumber` in the body,
  not a header.
- **Spec defect.** `ChemicalData_ProperShippingNameDetail.ProperShippingName` is
  `type: array` with no `items`. It is typed `string[]` as an **inference**: its
  description is a name, and the example shows a string.
- Both operations mark `transId` and `transactionSrc` `required: true`; the client
  already sends both.

### PreNotification

- The path sits under `/dangerousgoods/`, not its own segment.
- `transId` and `transactionSrc` are `required: false` here (required in Dangerous
  Goods Utility).

### Paperless Document

- Upload and image also take `ShipperNumber` as a required header (named
  `shipperNumber` in `UpsPaperlessDocumentParams`). `transId` and `transactionSrc` are
  not marked required.
- Upload: "maximum allowable size of each file is 10 MB", **1 MB in CIE**; the file is
  a base64 string; at most 13 files or documents per shipment;
  `UserCreatedFormDocumentType` is a 3-digit code (001 to 013).
- `DocumentID` in responses is always an array at v2 and later (v1 collapsed single
  elements).
- The spec still defines `DeleteRequest*` schemas (with `ShipperNumber` and
  `DocumentID` in a body) although the delete operation has no `requestBody`. They
  are unreferenced and were not generated.
- `-Ready` diff beyond description text: a typo ("Ddocument type 010"), renamed
  example keys, and the document-type table says `007 - One Time USMCA` in the base
  file but `One Time NAFTA` in the Ready file. The types are identical.

#### Paperless Document delete path

The path is the literal `/paperlessdocuments/{version}/DocumentId/ShipperNumber`.
Only `{version}` is a template variable; `ShipperNumber` and `DocumentId` are
declared as `in: header`, `required: true` parameters, and the operation has no
request body. So the implementation sends
`DELETE /api/paperlessdocuments/v2/DocumentId/ShipperNumber` with headers
`ShipperNumber` and `DocumentId`. That is what the spec says. It is odd enough, a
path that names its own parameters, that **a real account should confirm it** before
anyone "fixes" it into `/{DocumentId}/{ShipperNumber}`. "Only one DocumentID will be
accepted for delete request."

### Quantum View

- The operation declares no `transId` or `transactionSrc` header parameters at all;
  the client sends them regardless. Whether UPS accepts them is an open question
  needing a real account.
- Date-time fields are `YYYYMMDDHHmmss`; an empty `EndDateTime` defaults to 7 days
  after `BeginDateTime`. `Bookmark` is the paging token.
- At v3 every repeating element is always an array (v1 and v2 collapsed single
  elements).

### Locator

- The `reqOption` path segment documents these values: `1` Locations (drop and
  will-call), `8` additional services, `16` program types, `24` additional services
  and program types, `32` retail locations, `40` retail plus additional services,
  `48` retail plus program types, `56` retail plus both, `64` UPS Access Point
  locations. The schema is only `string` with `maxLength: 4`; the union
  `UpsLocatorRequestOption` comes from the description.
- `Locale` is an optional query parameter (default `en_US`), omitted when unset.
- `SearchOptionCode` in the body says "Either OptionType 03 or 04 is required"
  without tying it to `reqOption`; left as an optional string.

### Typing notes for these five

- `ErrorResponse`, `CommonErrorResponse` and `ErrorMessage` are not generated;
  non-2xx responses surface through `tryHandleRequest`'s error.
- Spec fields with `type: string` that hold numbers or dates stay `string`.
- These specs have no enums, `oneOf` or nullable, so no unions were needed beyond
  `UpsLocatorRequestOption`.

### Open questions for these five (need a real account)

1. Dangerous Goods acceptance audit pre-check: `/v2/` or `/v3/`.
2. Paperless delete: the literal `DocumentId/ShipperNumber` path with header values.
3. Whether Quantum View accepts the client's `transId` and `transactionSrc` headers.

### Request shapes against UPS's own examples

Source: examples embedded in UPS's OpenAPI specs and UPS's published Java samples, run at API version v1.

- **Single objects where arrays were required**, now `T | T[]` on requests: DG `Shipment.Package` and `ChemicalRecord`; PreNotification `Package`, `ChemicalRecord` and the `AddressLine`s; Locator `SearchOption.OptionCode` and `ServiceSearch.ServiceCode`; Paperless `UserCreatedForm`, `FormsHistoryDocumentID.DocumentID` and `TrackingNumber`; Quantum View `SubscriptionRequest` and `FileName`.
- **Optional request fields.** DG `ChemicalReferenceDataRequest.Request`; Paperless `UploadRequest.ShipperNumber` and `PushToImageRepositoryRequest.ShipperNumber`. They are in the `required` lists but absent from the examples, and the shipper number is also sent as the `ShipperNumber` header.
- **Quantum View `Bookmark`.** The schema puts it on `QuantumViewRequest`, but the example nests it in `SubscriptionRequest`. The type accepts both.
- **`TransactionIdentifier`** is optional on the DG, PreNotification and Quantum View response `TransactionReference`s. It appears in UPS's samples.
- DG has two arrays with no "always an array" note, `ProperShippingName` and `ElementIdentifier`. Whether they collapse to a single object is unproven.
- **Left as is** (example defects or v1-only shapes): the DG precheck example's `AddressLinde`; the Locator example's `LanguageCode` under `Translate` (the schema has `Locale`); the PreNotification example's `RequestOption`; the Quantum View example's `XpciVersion`; a Paperless example that sends `null`.
- Where the spec points to an appendix or gives no closed list, a union is "known values plus any string". Exported enums stay for autocomplete.

## Trade and customs APIs

Sources: the "Landed Cost", "Global Checkout", "Export Assure", "Interactive
Description Guidance", "Chargeback Protection" and "Customs Detail API v2" specs,
vendor documentation. Nobody has called these endpoints. No spec here lists a
deprecated operation, and none states a rate limit beyond Chargeback Protection's
`RATE_LIMIT_EXCEEDED` error code.

Request URL is the bare host plus the prefix plus the path. Every spec lists only the
two known hosts, so there is no host discrepancy, but the prefixes differ:

| Family                | Spec `servers` URL                   | Request URL                                              |
| --------------------- | ------------------------------------ | -------------------------------------------------------- |
| Landed Cost           | `.../api`                            | `/api/landedcost/v1/quotes`                              |
| Global Checkout       | `.../api/brokerage/{version}`        | `/api/brokerage/v1/content/glc/request-quote`            |
| Export Assure         | `.../api/brokerage/{version}`        | `/api/brokerage/v1/importexport/exportassure`            |
| Description Guidance  | `.../api/export-assure/{version}`    | `/api/export-assure/v1/interactive[...]`                 |
| Chargeback Protection | `.../api`                            | `/api/commerce-guard/v1/verify`                          |
| Customs Detail        | `.../api/trade/compliance/{version}` | `/api/trade/compliance/v2/content/fields/customs-detail` |

Note that `/api/brokerage` (Global Checkout, Export Assure) and `/api/export-assure`
(Description Guidance) differ even though the latter is Export Assure's companion
API.

| Function                             | Method                                   | Code     |
| ------------------------------------ | ---------------------------------------- | -------- |
| `getLandedCostQuote`                 | POST                                     | UPS_0065 |
| `createGuaranteedQuote`              | POST                                     | UPS_0066 |
| `submitExportAssure`                 | POST                                     | UPS_0067 |
| `startDescriptionGuidanceSession`    | POST `/interactive`                      | UPS_0068 |
| `continueDescriptionGuidanceSession` | POST `/interactive/{sessionId}`          | UPS_0069 |
| `submitDescriptionGuidanceFeedback`  | POST `/interactive/feedback/{sessionId}` | UPS_0070 |
| `verifyCommerceGuardChargebackRisk`  | POST                                     | UPS_0071 |
| `getCustomsDetailRequirements`       | GET                                      | UPS_0075 |
| `submitCustomsDetail`                | POST                                     | UPS_0076 |

### Landed Cost Quote

- The `AccountNumber` header is optional (no `required`), exposed as
  `UpsLandedCostOptions.accountNumber`. `transId` and `transactionSrc` are
  `required: true`, both already sent by the client.
- The request `alversion` (integer) is **required** by the schema, yet the spec's own
  example request omits it. The example also sends `transID` inside the body, a second
  copy of the header's id. `alversion` is now optional on the request type, because
  the example the vendor published omits it; the description says it "must match the
  major number of the corresponding ICD version" (examples `1, 2, 3`). Whether UPS
  enforces it is an open question.
- Request `transModes`, `shipmentType` and `incoterms` are typed `string`, not unions:
  the descriptions list allowed values but they are not `enum`s, and the
  description's shipment types (GIFT, COMMERCIAL, SALE ...) contradict the example
  (`Sale`, mixed case).
- Request `shipmentItems.priceEach` is documented `number` but the example sends it
  as a string (`'125'`); `grossWeight` and `transportCost` are likewise sent as `''`
  in the example.
- Response contradictions between schema and example, typed per the schema with the
  example's top-level fields added as optional:
  - The schema places `transID`, `perfStats`, `alVersion` and `errors` inside
    `shipment`, and `LandedCostResponse.required` lists `alVersion`, `perfStats` and
    `transID` at the top level where no such property exists. The example puts
    `transID`, `alversion` (lower-case v), `dpversion`, `error` (singular) and
    `perfStats` at the top level.
  - The schema's item fields are `commodityID`, `totalCommodityTaxAndFee`,
    `totalCommodityDutyAndTax` and, on the shipment, `totalDutyAndTax`; the example
    uses `commodityId`, `totalCommodityTaxesAndFees`, `totalCommodityDutyandTax` and
    `totalDutyandTax`. Both spellings are typed, all optional, on the response; see
    [Landed Cost response spellings](#landed-cost-response-spellings).
- `ErrorResponse` (4xx) is `{ response: { errors: [{ code, message }] } }`.

#### Landed Cost response spellings

Evidence is the 200 example embedded in UPS's OpenAPI spec against its schema. The
two disagree on four names, so `UpsLandedCostResponse` and
`UpsLandedCostResponseShipmentItems` type both spellings and make every one optional:

| Schema                     | Example                      | Level    |
| -------------------------- | ---------------------------- | -------- |
| `commodityID`              | `commodityId`                | item     |
| `totalCommodityTaxAndFee`  | `totalCommodityTaxesAndFees` | item     |
| `totalCommodityDutyAndTax` | `totalCommodityDutyandTax`   | item     |
| `totalDutyAndTax`          | `totalDutyandTax`            | shipment |

Which spelling the live service returns is unknown (an open question for a real
account); a caller reading either should read both. The earlier statement here that
the example was "stale or hand-written" was an inference and is withdrawn. The
request's `alversion` is optional for the reason given above.

### Global Checkout (Guaranteed Quote)

- The operation id is `createGuaranteedQuote`, summary "returns a guaranteed landed
  cost quote".
- Required headers per spec: `transId`, `transactionSrc` (client sends), `Accept` and
  `Content-Type`. `createGuaranteedQuote` now sends `Accept: application/json`
  explicitly, because the spec marks it required (axios would otherwise send
  `application/json, text/plain, */*`); `test/realHandler.test.ts` reads it off the
  wire. `Content-Type: application/json` comes with the object body. Not exposed.
- The `registration-id` header is optional: "If not passed then it will be obtained
  with the OAuth token's UUID". Exposed as `UpsGuaranteedQuoteOptions.registrationId`
  (pattern: GUID, hyphens optional).
- Contradictions: the example uses `shipperAccountNumber: " "` (schema: required,
  exactly 6 characters), `serviceLevelCode: "01"`, `shipmentType: Sale` (schema
  table: GIFT, COMM, OTHR, PERS) and `countryCode: AB` for a shipper address. The
  schema `BSIS_v1_Shipment` carries `minItems` and `maxItems` on an object, which is
  meaningless. `shipmentType` is typed `string` because the schema has no enum, only
  a description table.
- The response schema `BSIS_v1_QuoteResponse` accidentally nests
  `additionalProperties: false` inside `properties`; it is dropped from the TS type.
  `quoteCreationTimestamp` has a `+0000` style format (no colon), per the regex.
- Error bodies are `{ response: { errors: [{ code, description?, message, value?,
field? }] } }`; the 422 example code is `105.350` INVALID_PART_NUMBER.

### Export Assure

- `submitExportAssure` is one endpoint performing four checks selected by booleans in
  the body: description guidance, POA, UPS prohibited goods and premium commodity
  compliance.
- **The premium feature is chargeable.** `evaluateAdvancedImportExportRequirements:
true` incurs a charge each time guidance is provided and requires
  `evaluateImportExportRequirements: true`. Schema defaults: descriptions true, POA
  true, import/export true, advanced **false**.
- Spec prose says `advancedImportExportRequirements` in several places; the schema
  property is `evaluateAdvancedImportExportRequirements`. Typed per schema.
- The header is `accountNumber` (lower-camel), optional; `transactionSrc` is
  required (client sends). `Accept` and `Content-Type` are marked required and not
  exposed; `submitExportAssure` sends `Accept: application/json` explicitly.
- The spec's own `cieResponseExample` returns `importerPoaOnFileIndicator` and
  `exporterPoaOnFileIndicator` as booleans (`false`, `true`), where the schema (and
  the other examples) say `"Yes"`/`"No"`/`null`; both indicator types now admit
  `boolean`.
- **207 Multi-Status** returns `ExportAssurePartialResponse` (`shipment` plus
  `response` errors) when some checks fail. The function returns the union. Whether
  dianemo core or `tryHandleRequest` treats 207 as success was not verified
  (**inference**: any 2xx is).
- `shipmentRequest.grossWeightUnit` is required but nullable (`null` when there is no
  `grossWeight`); `UOM` is a closed 34-member enum; `hsCode` pattern accepts dotted
  forms. `ErrorCode.description` has a pattern but no `type`; typed `string`.
- Responses include `x-request-id` and `BkndTransId` headers; not modelled.

### Interactive Description Guidance

- Three operations, all POST. Feedback returns **204** (no body), so that function
  returns `Promise<void>`.
- `transId` is documented "A 128 bit GUID" with `maxLength: 32`; the client's
  hyphen-stripped id fits. It is required on start and iterate. The feedback
  operation lists no `transId` or `transactionSrc` parameters at all (the client
  sends them anyway).
- The start request `importCountryCode` is a closed enum (US, CA, CN, UK, DE, HK, NL,
  IT, ES, FR, GB, IE); every other field is optional. Quantities and values are
  strings, not numbers.
- Success responses carry a monetization header `x-api-success-count` (1 when
  `noMoreQuestions` is true). It is not modelled; callers loop until
  `noMoreQuestions`.
- Negative results: the spec states no session lifetime or expiry.

### Chargeback Protection (Commerce Guard)

- The operation id is `verifyChargebackRisk`; the title is "Chargeback Protection API
  v1".
- The required header is **`partnerId`** (1 to 64 characters). The optional one is
  **`transSrc`**, not `transactionSrc` (max 36), so the client's `transactionSrc`
  header is irrelevant here. `transId` (3 to 36, `[a-zA-Z0-9-.]`) is optional and the
  client's value satisfies it. Exposed as `UpsCommerceGuardOptions`.
- `partnerId` is a per-integration value, not derivable from OAuth credentials. Where
  a caller obtains it is an open question.
- Responses: `decision` enum `reject | review | undecided`; score ranks `no_risk |
low | medium | high`. A 403 is documented in addition to the usual set. The error
  `code` is a closed enum (INVALID_REQUEST, UNAUTHORIZED, RATE_LIMIT_EXCEEDED, ...).

### Customs Detail

- **Why the spec is 870 KB.** 569 KB of it is 15 `components.examples` (CPSC, FDA and
  similar regulatory-data save requests); the schemas total 19 KB. The request and
  response are therefore typed from the schemas, not the examples.
- **The version pin `v2` is an inference.** The server URL is
  `.../api/trade/compliance/{version}` but the spec has no `variables` block and no
  `version` path parameter, so it never says what the value is. `v2` comes from the
  title and `info.version: "2.0"`. Open question: confirm the literal path segment
  with a real call (it could be `v1` or `v2`).
- GET inputs are query parameters in snake_case (`import_country_code`,
  `export_country_code`, `locale`, `commodity_codes`, `shipment_type`,
  `shipment_weight`, `shipment_weight_unit`, `shipment_value`,
  `shipment_value_currency`, `user_roles`, `commerce_model`), all optional.
  `commodity_codes` and `user_roles` are documented as comma-separated; the plugin
  joins them with `,` itself (axios would otherwise emit `key[]=`).
- Omitting both country codes returns every country's fields (spec description).
- **`locale` contradicts itself.** The description lists tags such as `en`,
  `zh-Hans` and `fr-CA`, but the schema is `minLength: 5, maxLength: 5, pattern
^[a-z]{2}-[A-Z]{2}$`, which `en` and `zh-Hans` would fail. Typed as plain `string`;
  default `en-US`.
- The POST `registrationId` header is optional in the schema but described as
  "required for ews/fws/worldship". Exposed as
  `UpsCustomsDetailSubmitOptions.registrationId`.
- The POST answers **204 No Content**, and `submitCustomsDetail` returns `void`.
  `actionType` is `validate` or `save`; validation failures are 422 with the error
  envelope `{ response: { errors: [{code, message, field?, value?}] } }`.
- The response `fieldGroups[].fields[].tooltip` is in the `required` list, but its
  schema type is `[string, "null"]`, so it is typed `string | null`.
  `requirementConditions` and `displayConditions` are `null` in 154 and 8 places in
  the spec's examples and were already typed nullable. The audit's claim that
  `validation.listValues` is `null` in the examples **did not hold**: no example sets
  it to `null` and the schema types it as a plain array, so it is unchanged. The
  error envelope's `errors[]` items carry `description` (`VALUE_REQUIRED`,
  `RESOURCE_NOT_FOUND`, `null` in the 401 example), now on
  `UpsCustomsDetailError`.
- `validation.minLength` and `maxLength` carry `minLength` and `maxLength` keywords on
  integer schemas (a spec bug, ignored).
- Not wired: the `Content-Type` header is documented as required; axios sets it for
  the JSON body.

### Open questions for the trade APIs (need a real account)

1. Does Landed Cost enforce `alversion` when the spec's own example omits it?
2. What is the real Landed Cost response shape: schema-nested or example top-level
   fields, and which spelling of the item and total fields?
3. Does `tryHandleRequest` or core resolve (not throw) on Export Assure's 207?
4. Where does a caller obtain Commerce Guard's `partnerId`?
5. Does Global Checkout need explicit `Accept` and `Content-Type` headers beyond
   axios defaults? (`Accept: application/json` is now sent regardless.)
6. What is Customs Detail's literal version path segment?

## TradeDirect and WorldEase

Sources: the "TradeDirect Shipments API v1" and "WorldEase Shipment Management API
v1" specs, vendor documentation. Neither has a deprecated operation or a `-Ready`
twin.

| Function                            | Method             | Path (after host)                                                                | Code     |
| ----------------------------------- | ------------------ | -------------------------------------------------------------------------------- | -------- |
| `deleteTradeDirectMasterShipment`   | DELETE             | `/api/ship/tradedirect/v1/master-shipments/{usi-number}?shipper_account_number=` | UPS_0077 |
| `deleteTradeDirectChildShipment`    | DELETE             | `.../master-shipments/{usi-number}/child-shipments/{tracking-number}`            | UPS_0078 |
| `closeoutTradeDirectMasterShipment` | POST               | `.../master-shipments/{usi-number}/closeout`                                     | UPS_0079 |
| `deleteTradeDirectLtlChildShipment` | DELETE             | `.../master-shipments/{usi-number}/ltl-child-shipments/{sub-pro-number}`         | UPS_0080 |
| `generateTradeDirectDocuments`      | POST               | `.../master-shipments/documents`                                                 | UPS_0081 |
| `closeoutWorldEaseMasterShipment`   | POST               | `/api/ship/v1/master-shipment/closeout/{shipment-gccn}`                          | UPS_0082 |
| `deleteWorldEaseMasterShipment`     | DELETE (with body) | `/api/ship/v1/master-shipment/{shipment-gccn}`                                   | UPS_0083 |
| `deleteWorldEaseChildShipment`      | DELETE             | `/api/ship/v1/child-shipment/{shipment-gccn}/{tracking-number}`                  | UPS_0084 |

### TradeDirect

- Only the production host is listed
  (`https://onlinetools.ups.com/api/ship/tradedirect/{version}`); no CIE server. The
  functions are implemented against the same client anyway. Open question: whether a
  CIE equivalent (`wwwcie.ups.com`) exists.
- Master delete takes a **required** query parameter `shipper_account_number`. Its
  description is a copy-paste of the USI description (and says "clouseout"); the
  schema pattern `^[A-Z0-9]{6}$` and the example `1234WW` show it is a six-character
  account number.
- Delete master, child and LTL child all answer 204 with no body; the functions
  return `void`.
- Closeout answers 200, or **207** with an additional `message` when completed with
  warnings; both bodies share `CloseoutResponse`. `palletLabelResponses` is plural and
  described as "a list" but typed as one `LabelResponse` object (with `files[]`); it
  is typed as the object. In `DocGenerationResponse` and `LabelResponse` exactly one
  of `warning` or `files` is present (`oneOf`).
- `DocumentResponse.documents` `oneOf` lists a required key `pgkplt`, a typo for
  `pkgplt` (the property is declared `pkgplt`). Typed with `pkgplt`; all keys
  optional.
- Closeout `shipment.packages` is optional (`minItems 0`, max 200). `freightClass` is
  a numeric enum including 77.5 and 92.5.
- The documents `docFormat` enum includes `STARPL`; WorldEase's label enum uses
  `STAR`.
- Error envelope: `{ response: { errors: [{code, message}] } }`.

### WorldEase Shipment Management

- Both CIE and production hosts are listed.
- **DELETE with a request body.** Master delete takes `{ shipperAccountNumber }` as a
  body (the same `PostRequest` schema as closeout). Some proxies and HTTP clients
  drop DELETE bodies. It is unverified that dianemo or axios sends it; the test
  confirms only that `data` is set on the request config.
- **Path and parameter name mismatch.** Child delete's path is
  `/child-shipment/{shipment-gccn}/{tracking-number}` but the declared path parameter
  is named `trackingNumber`. The position is unambiguous, and the URL is built from
  the template.
- Closeout answers **202** with the master label (`opTyp`, `lblNmbr`, `lblData`, all
  optional in the schema) and `transId`. Deletes answer 200 `{ code, message }`
  (`code` "1" is success).
- `transId` is documented as exactly 32 characters of hex or hyphen (`minLength =
maxLength = 32`), matching the client's hyphen-stripped UUID. `transactionSrc` has a
  maximum of 512.
- The GCCN pattern is `^[A-Za-z0-9]{11}$`.
- The error envelope here is `{ errors: [{code, message}] }`, **not** wrapped in
  `response` like the other two families.
- Documented responses are 200 or 202, 400, 401 and 404 only (no 5xx, no 429).

## Delivery Intercept

Source: the "Delivery Intercept API v2" spec, vendor documentation. Servers are
`https://onlinetools.ups.com/api/deliveryintercept/{version}` and the
`https://wwwcie.ups.com/...` twin. There is no `-Ready` twin and no deprecated
operation (negative result). All seven operations end `/{tracking_number}`.

| Function                             | Method and path (after `/api/deliveryintercept/v2`) | Code     |
| ------------------------------------ | --------------------------------------------------- | -------- |
| `getDeliveryInterceptCharges`        | POST `/charges/{tracking_number}`                   | UPS_0085 |
| `getDeliveryInterceptEligibility`    | GET `/eligibility/intercept/{tracking_number}`      | UPS_0086 |
| `redirectDeliveryInterceptToAddress` | POST `/redirect/address/{tracking_number}`          | UPS_0087 |
| `requestDeliveryInterceptWillCall`   | POST `/willcall/{tracking_number}`                  | UPS_0088 |
| `requestDeliveryInterceptReturn`     | POST `/return/{tracking_number}`                    | UPS_0089 |
| `rescheduleDeliveryIntercept`        | POST `/reschedule/{tracking_number}`                | UPS_0090 |
| `cancelDeliveryIntercept`            | POST `/cancel/{tracking_number}`                    | UPS_0091 |

- **Three extra required headers, each with one valid value.** `platformType` (enum
  `XOLT`), `inquiryType` (enum `U`, "UPS Shipper Initiated Intercepts") and
  `Content-Type`. The plugin sends them as constants and callers are not asked. The
  optional query parameter `loc` (a locale such as `en_US`, pattern
  `^[a-z]+[_]+[A-Z]+$`) is on `UpsDeliveryInterceptParams`.
- **`transId` is capped at 14 characters here** (`^[a-zA-Z0-9-.]{3,14}$`), against
  Shipping's 32. The client interceptor keeps a `transId` the request set itself, and
  these functions send their own 14-character value, or the caller's `transId` from
  `UpsDeliveryInterceptParams`. The response `transactionId` is also capped at 14. See
  [The `transId` header](#the-transid-header).
- **CIE returns a stubbed success only for fixed inputs.** The spec prose says
  `transId` must be `SIICharges` (charges), `SUPER14` (eligibility), `SIIWillcall`,
  `SIIReturn`, `SIIReschedule`, `SIIRedirect` or `SIICancel`, with tracking numbers
  `1Z4096YY0316914058` (all but eligibility) and `1Z6568YY1200043419` (eligibility).
  Passing the caller's `transId` is what makes these values reachable. Open
  question: does CIE reject any other `transId` or just fail to stub?
- **The tracking number is `1Z` plus 16 alphanumerics** (`^(1Z)[A-Z0-9]{16}$`, exactly
  18 characters), so non-1Z numbers (Mail Innovations, freight) cannot be intercepted
  through this API.
- **One shared request schema for five operations.** `redirect`, `willcall`,
  `return`, `reschedule` and `cancel` all take `DeliveryInterceptRequestV2`. The
  operation is chosen by the path, and `requestType` (`WC`, `SC`, `FD`, `AA`, `RS`) is
  optional in the schema though the spec's examples set it (`AA`, `WC`, `RS`, `FD`,
  and `FD` for cancel as well). `reasonForReturn` is "required only for RS",
  `deliveryDate` "required only for FD" and `specialInstructions` "available only to
  AA", all prose-only, so the type cannot enforce them. The schema requires
  `requesterContactInfo` and `specialInstructions` (nullable).
- **Spec contradiction: `commonEligibilityMap`.** The schema defines it as a single
  object (`interceptFeature` and `eligibilityValue`); every example returns an array
  of those, and the 200 `ERROR` example returns `commonEligibilityMap: null`. Typed
  as `Entry | Entry[] | null`. The `eligibility` examples also give `date`
  and `dayOfWeekNumber` as bare numbers (`20250110`, `6`) where the schema says string
  patterns and `"01"` to `"07"`; typed to accept both. The `dayOfWeekText` enum lists
  Sunday to Friday only, with no Saturday, although `dayOfWeekNumber` includes `07`;
  Saturday was added by **inference**.
- **The charges 200 examples carry fields the schema lacks.** `response.addrToken`
  and the six totals `accessorialGrandTotal`, `interceptGrandTotal`,
  `transportationGrandTotal`, `grandTotalCharge`, `taxesGrandTotal` and
  `preTaxGrandTotal` appear in the examples embedded in UPS's OpenAPI spec (the totals
  as empty strings in both) and not in the schema. All seven are typed as optional
  strings.
- **Malformed `anyOf` on `packageWeightUOM`.** The third alternative is `{title:
Kilograms}` with no `const`, and `KGS` has no title. Read as `"LBS" | "KGS"`
  (**inference**).
- `interceptOption` for charges has one more member than the intercept request
  `requestType`: `AL` (all). Modelled as `UpsDeliveryInterceptOption` and
  `UpsDeliveryInterceptRequestType = Exclude<..., "AL">`.
- Response shapes: 200 is a different schema on charges, eligibility and the five
  actions. 400 and 401 are `DeliveryInterceptErrorResponseV2`
  (`response.errors[].code/message`), whereas the 200 shape carries
  `errors[].errorCode/errorMessage/errorSource`. Only 200, 400 and 401 are documented
  (no 403, 429 or 5xx, unlike Protected Delivery Token). The error shapes are not
  typed on the functions because `tryHandleRequest` throws on failure; the types are
  exported for callers decoding error bodies.
- `additionalProperties` is `true` on the charges request and `false` on
  `DeliveryInterceptRequestV2`. TypeScript interfaces cannot express either; recorded
  only.
- Security is `OAuth2` client credentials with token URL
  `https://onlinetools.ups.com/security/v1/oauth/token`, the same as the rest of UPS.

## Protected Delivery Token

Source: the "PIN Management System API v1" spec, vendor documentation. The server is
**production only**, `https://onlinetools.ups.com/api/pin-mgmt-sys/{version}`
(description "external url for PIN Management System"). No CIE server is listed.
Open question: is there a CIE equivalent (`wwwcie.ups.com/api/pin-mgmt-sys/v1`), and
does the plugin's CIE client work against it? The functions use the same client
regardless. There is no `-Ready` twin and no deprecated operation (negative result).

| Function                         | Method and path (after `/api/pin-mgmt-sys/v1`)    | Code     |
| -------------------------------- | ------------------------------------------------- | -------- |
| `generateProtectedDeliveryToken` | POST `/pins/token`, body `{pin}`                  | UPS_0092 |
| `getProtectedDeliveryPinByToken` | GET `/pins/token`                                 | UPS_0093 |
| `getProtectedDeliveryPins`       | POST `/pins/retrieve`, body `{trackingNumbers[]}` | UPS_0094 |
| `getProtectedDeliveryEpraCode`   | GET `/pins/epra`                                  | UPS_0095 |

- **`GET /pins/token` takes its input as a required header** `X-UserToken` (uuid),
  "Token generated by Generate Token API". Implemented as `{ userToken }` params, sent
  as `X-UserToken`.
- **`GET /pins/epra`** takes `trackingNumber` as a required header, `epra` as an
  optional header, `action` as an optional query parameter and `Authorization` as a
  required header. `Authorization` is **not a parameter**: core sets the client's own
  auth header after every request-level header
  (`handlePreRequest` in `@dianemo/core`, `{ ...request.config.headers, ...authHeader }`,
  read 2026-11-12), so a caller's value was always discarded. The function used to
  take a required `authorization` and send it; it was added the same day, so
  removing it changed no published signature. What UPS receives is the client's
  bearer token, and `test/realHandler.test.ts` reads that off the wire, including a
  request that sets its own `Authorization` and loses. Open questions that need a
  real account:
  1. Whether UPS accepts the client's OAuth bearer as the required `Authorization`
     header or expects a separate credential. If it does, this function cannot send
     one through core's header merge.
  2. What values `action` and `epra` take: the schema is a bare `type: string`, with
     no enum and no description.
  3. The 501 response, documented only on this operation, is not explained.
- `transID` and `transactionSrc` are required headers, with no length or pattern
  constraints unlike the other specs; the client supplies both on every request. The
  spec spells it `transID`; HTTP header names are case-insensitive, and the client
  sends `transId`.
- Response codes documented on every operation: 200, 400, 401, 403, 404, 429, 500,
  plus 415 on the two POSTs and 501 on epra. The 429 matches the pattern in
  [No published rate limit](#no-published-rate-limit); no limit is stated.
- The bodies are tiny: token `{token}`, PIN `{pin}`, pins `{results: [{trackingNumber,
pin}]}`, EPRA `{response: {epraCode?, epraRequired?, epraMatch?, epraKiala?}}`.
  Nothing says what the EPRA fields contain. `WarningResponse` is defined in the
  schemas but referenced by no operation response.
- The spec states the PIN is shipper-generated ("Generate a token using Shipper
  generated PIN") and gives no PIN length or format; the example is `"123456"`.

## Supply Chain Symphony

Sources: three specs treated as one family: "Ingest Inventory API v1" (1.0.0),
"Ingest Logistics API v1" (1.0.0) and "UPS Partner Transportation Data Ingestion API"
(1.0), vendor documentation. None has a `-Ready` twin or a deprecated operation
(negative result).

| Spec                                  | Server URL in the spec                                                                                     | Function and code                                     | Request URL used                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| Ingest Inventory                      | `https://onlinetools.ups.com/inventory/v1` (plus `wwwcie`)                                                 | `ingestScsInventory` UPS_0096, POST `/inventory`      | `/inventory/v1/inventory`                         |
| Ingest Logistics                      | `https://onlinetools.ups.com/logistics/v1` (plus `wwwcie`)                                                 | `ingestScsLogistics` UPS_0097, POST `/logistics-data` | `/logistics/v1/logistics-data`                    |
| Partner Transportation Data Ingestion | `Not available` (CIE) and `https:onlinetools.ups.com/api/transaction-visibility-dashboard/v1` (production) | `ingestScsTransportation` UPS_0098, POST `/Ingest`    | `/api/transaction-visibility-dashboard/v1/Ingest` |

- **Inventory and Logistics are not under `/api`.** Every other UPS family is. This is
  inferred from the server URLs only.
- **The Transportation `servers` block is malformed.** The production URL is
  `https:onlinetools.ups.com/...` (no `//`), and the CIE entry's URL is the literal
  string `Not available`. The path was taken from the production URL's path component.
  Open question: is there a CIE endpoint for transportation ingestion? The OAuth
  scheme's `tokenUrl` there points at **CIE**
  (`https://wwwcie.ups.com/security/v1/oauth/token`), unlike every other spec's
  production token URL, which may mean a copy-paste from a test spec.
- **Different security wiring for Transportation.** The operation's `security` is
  `OAuth2ClientCredentialsWithAssertion`, a scheme name that is not defined anywhere
  in the spec (only `OAuth2` is under `securitySchemes`, a plain client-credentials
  flow). So the spec does not say whether this API needs a JWT-bearer client
  assertion or an ordinary client-secret token. The plugin's client only does
  `client_secret_basic`. If an assertion is genuinely needed, the client template
  cannot call this endpoint; settling it needs a real account or UPS support.
- **Inventory and Logistics operations have no `security` on the operation**
  (`security: null` on both); the top-level `security: [OAuth2]` applies. It is the
  same plain `OAuth2` scheme as the rest of UPS, not a different one.
- **Headers.** Inventory and Logistics require `transId` (3 to 36 characters,
  `^[a-zA-Z0-9-.]{3,36}$`), `transactionSrc` (1 to 36, `^[a-zA-Z0-9-.]{1,36}$`) and
  `Content-Type`. The client's 32-character hyphen-less `transId` and the
  `transactionSrc` default `dianemo` fit. **Transportation documents no header
  parameters at all** (no `transId`, `transactionSrc` or `Content-Type`); the client's
  headers are sent regardless.
- **Different request envelopes.** All three wrap the payload as
  `{apiVersion, request: {...}}`. Inventory's `apiVersion` is a free string (example
  `"1.0"`), and so is Logistics'. Transportation's is the literal `"v1.0"` (enum), and
  its `request.docType` is `OrderStatus | Order`, `docFlow` `Inbound | Outbound`.
- **Responses.** Inventory's 200 is `{isCompleted, isFaulted, errors[], result:
[{messageId, ...}]}`, but its 400 and 500 bodies have `result: string` (for example
  `"Bad Request"`), 401 is a different shape (`apiName, faultName, errorCode,
errorDate, errorTime, errorDescription`), and 403 has no body schema. Logistics and
  Transportation return `SC360ResponseListServiceResponse` for **both 200 and 207**;
  207 is partial success, with per-shipment `isCompleted` in `result[]`. Dianemo and
  axios treat 207 as success, so a caller must inspect `result[].isCompleted`. This is
  noted in the function comments.
- Inventory success `errors` items are `{type: object}` and Transportation's
  `ObjectServiceResponse.result` is a bare `object`; both are typed
  `Record<string, unknown>` because the spec gives no shape.
- **Name collisions between the three specs** (`Error`, `ErrorResponse`,
  `ActivityInformation`, `ShipUnit`, ...) have different shapes, so the types carry a
  per-spec segment: `UpsScsInventory*`, `UpsScsLogistics*`, `UpsScsTransportation*`.
  The Logistics and Transportation request schemas are near-duplicates but diverge:
  Transportation adds `sensorData`, `temperatureCondition` and `shipmentBookedDate`;
  Logistics has `loadId` and `shipUnits[].volume...`; Transportation makes
  `customerAccountNumber`, `shipmentDetails`, `shipmentPlacedDate` and
  `shipmentUniqueKey` required, with `shipmentUniqueKey` camel-cased where Logistics
  and the responses use `shipmentUniquekey`. Field spelling quirks are preserved as
  written: `itemDesciption`, and `shipmentUniquekey` in responses.
- Date and time fields are `format: date-time` strings in Logistics and
  Transportation; Inventory's dates are plain strings with no format.

## Forwarding

Source: the "Forwarding API v1" spec (`Forwarding.yaml`, version 1.0), vendor
documentation. There is no `-Ready` twin. The host is not the usual UPS one; see
[The Forwarding host](#the-forwarding-host), which also covers the sub-client.

### Auth, headers and limits

- Auth is `oauth2` client credentials, `client_secret_basic`, empty scopes, the same
  as the rest of UPS.
- **Every operation requires two headers no other UPS API here requires:
  `X-BusinessGUID`** (36 characters,
  `^[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}$`, "Unique business
  GUID") **and `X-ClientId`** ("Unique client Id", example
  `12345678-12AB-1234-A789-00000000000A`). The spec says nothing about where either
  value comes from. They are modelled as required `businessGuid` and `clientId`
  fields on every function's options, not on the client credentials, because it is
  unknown whether they are per-account, per-app or per-request.
- `transactionSrc` is **required** here (pattern `^[a-zA-Z0-9-.]{1,36}$`); the client
  already sends it. `transId` is optional and the client sends it.
- `Content-Type: application/json` is documented as required on every operation,
  including GET. It is sent explicitly on all JSON requests and omitted on the
  multipart upload so axios supplies the boundary. A request through a real
  handler (`test/realHandler.test.ts`) shows an explicit `Content-Type` is kept on a
  body-less GET.
- The spec states no rate limit and declares no `429` response at all (responses are
  200, 400, 401, 404 and 500 only). Negative result.
- The error shape is `{ response: { errors: [{ code, message }] } }`
  (`UpsForwardingErrorResponseV1`). The error catalogue is linked at
  `developer.ups.com/api/reference/forwarding/errors` and was not read.

### Operations

There are 24, none deprecated and no `{deprecatedVersion}` paths. Codes are
`UPS_0100` to `UPS_0123`, listed here by their last four digits, plus `UPS_0130`
(`getForwardingDocuments`: the body was neither PDF bytes nor JSON carrying
`response.pdfFile`; a gap is left after 0123 so a code added elsewhere in the same
change could not collide). Paths are under
`/api/forwarding/v1`.

| Code         | Function                                                                                     | Method             | Path                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| 0100         | `getForwardingShipmentRates`                                                                 | POST               | `/shipments/rates`                                                         |
| 0101         | `createForwardingOrder`                                                                      | POST               | `/orders`                                                                  |
| 0102         | `cancelForwardingOrder`                                                                      | DELETE (JSON body) | `/orders`                                                                  |
| 0103         | `setForwardingOrderDate`                                                                     | PATCH              | `/orders`                                                                  |
| 0104         | `searchForwardingOrders`                                                                     | GET                | `/orders`                                                                  |
| 0105         | `createForwardingLabel`                                                                      | POST               | `/documents/labels`                                                        |
| 0106         | `submitForwardingOrderShipments`                                                             | PATCH              | `/shipments`                                                               |
| 0107         | `cancelForwardingShipment`                                                                   | DELETE (JSON body) | `/shipments`                                                               |
| 0108         | `createForwardingShipment`                                                                   | POST               | `/shipments`                                                               |
| 0109         | `getForwardingShipmentDetails`                                                               | GET                | `/shipments`                                                               |
| 0110         | `createForwardingManifest`                                                                   | POST               | `/documents/manifests`                                                     |
| 0111 to 0116 | `getForwardingCities`, `Currencies`, `PaymentTypes`, `Countries`, `Airports`, `ServiceTypes` | GET                | `/info/{cities,currencies,payment-types,countries,airports,service-types}` |
| 0117         | `getForwardingAccessorials`                                                                  | POST               | `/info/accessorials`                                                       |
| 0118         | `createForwardingQuote`                                                                      | POST               | `/quotes`                                                                  |
| 0119         | `searchForwardingQuotes`                                                                     | GET                | `/quotes`                                                                  |
| 0120         | `bookForwardingQuote`                                                                        | PATCH              | `/quotes`                                                                  |
| 0121         | `getForwardingShipmentMilestones`                                                            | GET                | `/shipments/milestones`                                                    |
| 0122         | `getForwardingDocuments`                                                                     | GET                | `/documents`                                                               |
| 0123         | `uploadForwardingDocument`                                                                   | POST               | `/documents`                                                               |

Request-function signatures are `(clientName, headers, data)` for body-only
operations, `(clientName, params, data)` for PATCH with a query, and
`(clientName, params)` for GET. Query names are camelCased in the options and mapped
to the spec's snake_case on the wire.

### Wire quirks

- **Two DELETEs carry a JSON body** (`/orders` cancel, `/shipments` cancel), sent as
  axios `data` on DELETE. Some proxies drop DELETE bodies; unverified against UPS.
- **The two PATCH operations** (`/orders` set date, `/shipments` submit) take a
  JSON-Patch-like array body `[{op: "replace", path, value}]`
  (`UpsForwardingPatchReplaceReqV1`); `op` is only ever `replace`. The spec does not
  say which `path` values are valid. `setForwardingOrderDate`'s description is "Set
  Date for one or all active orders ... to a future date. Past dates are not allowed
  except for yesterday"; omitting `order_number` for all orders is an **inference**
  from "one or all".
- **Document download returns `application/pdf` bytes** (`type: string, format:
binary`), so `getForwardingDocuments` asks for `arraybuffer` and returns a
  `Buffer`; the spec's one example is JSON instead, see
  [Forwarding documents bytes](#forwarding-documents-bytes). `doc_type` is required
  with default `All`; the spec lists no other values for it.
- **Document upload is `multipart/form-data`**, not JSON base64. The parts are
  `AccountNumber`, `ShipmentNumber`, `DocumentType` (enum `PackingList`,
  `CommercialInvoice`, `SLI`, `ExportDeclaration`, `AirWaybill`, `Quote`, `Booking`,
  `DomesticAirWaybill`, `HAZMAT`, `CERT_ORIGIN`, `MSC`) and `DocumentToUpload` (binary,
  "Supported format - PDF"). It is built with global `FormData` and `Blob`; bytes
  default to `application/pdf`.
- `POST /documents/labels` returns an inline schema `{ response: ApolloLabelV1 }`
  (named `UpsForwardingPrintLabelResponse`).

### Forwarding response nesting

Evidence is the 2xx examples embedded in UPS's OpenAPI spec (`Forwarding.yaml`,
extracted and re-read 2026-11-12) set against its schemas. Where they disagree, the
response types admit both and say which is which. A script type-checked every 2xx
example (excluding any named `Invalid` or `BadRequest`, which are error scenarios)
against the response type of its operation; 81 of them, across 22 operations, were
checked and each one now passes. Findings:

- **`POST /shipments`** (`UpsForwardingAirShipResponseV1`). The schema declares
  `response` as a bare object and lists `shipmentNumber`, `prqNumber`, `prqStatus`,
  `rates`, `airWaybillDocument` and `label` beside it; all ten 200 examples put every
  one of them inside `response` and nothing at the top level. `response` is now typed
  with those fields and the top-level ones stay optional. Within them, `rates[]
.totalCharge.amount` is a **number** (`5399.04`) in the examples where the schema
  (`ApolloChargeAmountV1`) says string or null, and `airWaybillDocument`, `label`,
  `label.layout` and `label.image` are `null` in places.
- **`GET /info/countries`, `/info/currencies`, `/info/payment-types`.** The schemas
  are unwrapped; every example is `{ response: { <list>, message } }`. (The schemas
  for cities, airports and service types are already wrapped.) Each type admits both
  forms. The payment-types example's list is `paymentTypes`, a key the schema does
  not have (it has `shipper`, `consignee`, `thirdParty`), so that is typed too.
- **`POST /info/accessorials`.** Each `accessorials[]` item carries a `name` the
  schema lacks.
- **`PATCH /shipments`.** The manifest fields sit in `response` in some examples and at
  the top level in others, `response` is `null` in one and holds only `warnings`,
  `code` and `message` in another, `warnings` is `[null]`, and the success `message`
  is at the top level. `response` is therefore `Partial<…> | null` with the same
  fields optional at the top level, and a warning array admits `null` entries.
- **`GET /shipments/milestones`.** The "no match" 200 example answers
  `response: { errors: null, code: -1001, message }` with no `primaryInformation`.
- **`GET /quotes`.** About 65 leaves across the three examples are `null` (the audit's
  count), including whole objects and arrays: `originPort`, `destinationPort`,
  `pricingDetail`, `shipmentDetails.location`, `.fclCargoItems`, `.lclCargoItems`,
  `.airCargoItems`, `portOfLoad`, `portOfDischarge`, `commodityName`, address
  `stateCode` and `isLoadingDockAvailable`, `charges[].originalChargeAmount`. Every
  optional field of the quote-summary response types now admits `null`. The
  `paymentTerm` pair is returned as `type: "COL", code: "CONS"`, the reverse of what
  the request enums pair, so the **response** `type` and `code` are open (the known
  values plus any string); the request enums are unchanged. `lclCargoItems[]` items
  carry `weightDetail`, as the sibling `LclCargoItemV1` schema does, where the
  schema's `LclCargoItem` (an alias of the FCL `CargoItem`) has `weight`; both are
  typed.
- **Other nulls.** `GET /info/cities` (`sortCode`, `tariffDestination`), `GET
/shipments` (party and address fields), `PATCH /orders` (`orderNumber`,
  `shipmentNumber`) and `POST /orders` and `/documents/labels` (charge
  `description`, `includedInd`, consignee fields, `thirdParty`) were already typed
  nullable and pass.

Limits of the sweep. It can only see what the types declare: two response types
(`UpsForwardingOrderResponseV1`, `UpsForwardingOrderSearchResponseV1`) carry an
index signature and accept any extra key, and a type that is optional throughout
accepts any subset. An example that passes is therefore a necessary check, not a
proof the type is complete. The fixtures were generated into a scratch folder, not
the repository.

### Forwarding documents bytes

`GET /documents` is `application/pdf` (`type: string, format: binary`) in the spec,
and `getForwardingDocuments` asks axios for an `arraybuffer`. The spec's one 200
example (`PdfResponse`) is JSON instead:
`{ response: { fileName, pdfFile: "<base64 PDF>", code, isValid, ... } }` (example
embedded in UPS's OpenAPI spec). Which one the live service returns is unknown, so
the function returns PDF bytes either way: a body that starts with `%PDF` is returned
as is, a JSON body carrying a non-empty `response.pdfFile` is base64-decoded, and
anything else fails with `UPS_0130`.

The error path needed a second fix. Core's `redactBody` replaces a `Buffer` with
`[Buffer N bytes]` (`utils/redact.js` in `@dianemo/core`, read 2026-11-12), and it
runs on a failed response before the caller sees the error, so UPS's JSON error
(`{ response: { errors: [{ code, message }] } }`) was lost on any non-2xx.
The request now carries a `transformResponse` that decodes the body of a response
with status 300 or above to JSON (or text if it does not parse) and leaves every
other body untouched. That is safe for a binary success body because axios passes
the status to the transform, and the transform returns `data` unchanged for anything
below 300; `test/realHandler.test.ts` sends a PDF containing bytes that are not
valid UTF-8 through a real handler and compares it byte for byte. The decoded
error is what `getOriginalResponseData(err)` returns. One consequence: core's
redaction still applies to the decoded object, and its key-name list includes
`code`, so the error `code` reads `[REDACTED]` while `message` survives.

### Forwarding order search criteria

`GET /orders` takes one required query parameter `criteria` (`style: deepObject,
explode: true`) whose schema is an object holding `shipperAccountNumber`,
`criteriaList[]` (1 to 12 items of `criteriaField`, `criteriaOperator`,
`criteriaValue`, `criteriaValue2`) and `language`. OpenAPI defines no array syntax for
deepObject, so the plugin flattens it to
`criteria[shipperAccountNumber]=...&criteria[criteriaList][0][criteriaField]=...`
(indexed). **That indexing is an inference**, not something the spec states. The
spec's examples use the fields `ORDER_STATUS`, `SHIP_DATE` and `SHIPPER_REF` and the
operators `EQ`, `NOTEQ`, `BTWN` and `LIKE`; the schema types field and operator as
free strings, so they are typed `string`.

### Spec contradictions and defects

- `ApolloOrderPrintLabelRequestV1.orderNumber` is the empty schema `{}` (only an
  example). It is typed `string`, as every other `orderNumber` is (a 13-digit string,
  `ApolloOrderNumberV1`); that is an inference from the sibling schema, not
  something the spec states for this field.
- `ApolloAirShipResponseV1.response` is `type: object` with no properties and the
  rest of that response is documented as siblings, but the examples nest everything
  in `response`; see [Forwarding response nesting](#forwarding-response-nesting).
- `ApolloAirFreightRateRequestV1.shipment.paymentType` is a `oneOf` of `const` values
  (`PPD`, `COL`, `OTH/THD`), typed as the literal union. Several other `oneOf`
  code lists of `enum` or `title` are likewise literal unions.
- Several schemas set `additionalProperties: true`; those are typed with an index
  signature `[key: string]: unknown`.
- Two component schemas collide once the `Apollo` prefix is dropped
  (`ApolloCountryCodeV1` and `CountryCodeV1`); the first keeps its prefix as
  `UpsForwardingApolloCountryCodeV1`.
- `GET /info/cities`: `city` is required "if the country is not US or CA" and
  `postal` is required if it is, but the parameter schema marks neither required.
  This is documented in the types, not enforced.
- Several `info` GET operations (`/info/service-types`) declare `transId`,
  `transactionSrc` and others as shared `components.parameters`;
  `shipper_account_number` is `maxLength: 9` on some operations and `minLength 6 /
maxLength 12` on service-types.

### Open questions (need a real account)

1. Where `X-BusinessGUID` and `X-ClientId` come from, and whether they can live on
   the client.
2. Whether `www.onlinetools.ups.com` accepts tokens issued by `onlinetools.ups.com`,
   and whether the UAT host `onlinetoolsuat.ups.com` (which the spec labels the
   Customer Integration Environment) accepts a token minted on `wwwcie.ups.com`.
3. The indexed deepObject syntax for `criteriaList`.
4. Valid `path` values for the two PATCH bodies.
5. Whether the DELETE bodies survive UPS's gateway.
6. Whether `GET /documents` returns raw PDF bytes (the schema) or JSON with a
   base64 `pdfFile` (the example); both are handled.
7. Which spelling `POST /shipments` and the other nested-or-unnested responses use
   on the wire; see [Forwarding response nesting](#forwarding-response-nesting).
8. Whether the `forwarding` sub-client's own 5/s bucket matters: one credential can
   reach 10/s combined with the parent, against a limit UPS does not publish.

## What the tests can see

Most of this package's tests mock `RequestHandler.handleRequest` and assert on the
config handed to it. They therefore **cannot see anything core or axios do before or
after that call**: which headers survive core's merge, how a response body is
transformed, what a 204 looks like, what `redactBody` does to an error. That is how
the EPRA `Authorization` parameter, the lost Forwarding error body and the
unparseable-`baseUrl` throw went unnoticed.

`test/realHandler.test.ts` runs requests through a real `RequestHandler` against a
local `node:http` server (which also serves the token endpoint). It currently covers:

- Forwarding document download: raw PDF bytes (non-UTF-8 content, compared byte for
  byte), the JSON-wrapped PDF, a body that is neither (`UPS_0130`), a 400 with a JSON
  error and a 404 with a text body, and that an explicit `Content-Type` survives on a
  body-less GET;
- the client's bearer token reaching the server on the EPRA call, and an
  `Authorization` set on the request itself being replaced by it;
- an empty 204 from Delivery Defense;
- `Accept: application/json` on the guaranteed quote, as the exact value;
- that a body-less GET with no `Content-Type` of its own goes out without one.

`test/client.test.ts` covers the sub-client merge with a real handler and the
unparseable `baseUrl`. `test/responseShapes.test.ts` is type-level only: its literals
take the shape of examples embedded in UPS's OpenAPI spec, and `vitest --typecheck`
is the assertion.

Everything else in the package is still checked only at the `handleRequest` seam.
Another source of the same blind spot: UPS's Java sample repository
(`github.com/UPS-API/java-api-examples`, fetched 2026-11-12 by an auditor, not
re-fetched here) runs every API at version `v1`, so its responses can only
corroborate `v1` behaviour, and no sample from it supports any claim about a newer
version.

## Open questions from the example cross-check

- `Shipment.Package` on a Rating or Shipping request is now object-or-array. That follows UPS's examples; whether the live API treats the two identically is unproven.
- The spec contains no example at all for Tracking, Void and several other operations, so their request and response shapes rest on the schema alone.
