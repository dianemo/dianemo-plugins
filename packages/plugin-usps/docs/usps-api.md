# USPS APIs (v3)

Findings behind `@dianemo/plugin-usps`. Everything cited here is USPS's own: the
developer portal (checked 2026-08-25), the OpenAPI specs (downloaded 2026-11-12) or
USPS's published example repository (checked 2026-11-12). Each section says which.

## Rate limits

USPS **meters per API**, not per account and not per credential. That single fact
is why the client is split, and everything below is the evidence for how each
bucket was set.

### What USPS publishes

One quota, and it is small. `https://devs.usps.com/getting-started`, checked
**2026-08-25**, states verbatim:

> The default product includes OAuth, Addresses, Domestic Pricing, International
> Pricing, Locations, Service Standards, Service Standards Files, Shipping
> Options, and UserInfo, each with a quota of 60 calls per hour.

"each with a quota" — the 60/hour is **per API**, not shared across the nine. The
same page on raising it: _"To get started with APIs not included in the default or
to request a quota increase, please complete the Registration for API Access
form."_

And on Labels, from the same page — the reason Labels cannot inherit the figure
above: _"If you want to use the Labels APIs, it requires additional approval and
configuration. The Labels APIs require you to be enrolled in USPS Ship for both
outbound and return labels and have an Enterprise Payment Account."_

**This is USPS's own published default, not a third-party report.** Worth stating
plainly because the v1.0.0 validation report recorded the 60/hour as a
third-party figure and flagged it unverified; that was wrong, and it is the
reason a 600× discrepancy sat unresolved.

**The two devportal hosts disagree, and only one carries the number.**
`https://developers.usps.com/getting-started` does **not** contain the "quota of
60 calls per hour" sentence; `https://devs.usps.com/getting-started` does. Same
devportal, two hosts, two revisions. Anyone re-checking this on the
`developers.` host will conclude the number is unsourced — which is how a 10/s
label bucket came to look defensible.

The two hosts also disagree about **Tracking**: the `developers.` revision lists
Tracking in the default product, the `devs.` revision (the one with the number)
does not. `developers.usps.com/faq` also lists it. Tracking is therefore metered
here with the documented 60/hour group, on the strength of two of the three lists
— the conservative reading.

### What USPS does not publish — the negative results

Absences that were looked for and not found, each checked **2026-08-25**.
Recorded because "no quota is published" has to be falsifiable, and so the next
person to go looking does not repeat the search:

- **`https://developers.usps.com/faq`** — acknowledges a quota, publishes no
  number. The only rate-limit text on the page: _"If you have exceeded the quota
  limit of API calls per hour, please submit a service request on the Email Us
  page and a representative will assist."_
- **`https://developers.usps.com/terms-and-conditions`** — defers to the per-API
  description pages rather than stating limits: _"The Services have a limit on
  the number of requests that You may make in a given day. Such limits are
  dependent on the type of API used or the type of data requested. Such limits
  may be reviewed on the description pages associated with the APIs and data
  types."_ Followed by: _"The USPS reserves the right to modify, alter, or change
  these limits without notice for any given API."_
- **`https://developers.usps.com/paymentsv3`** (Payments 3.0) — no quota, and no
  payment-authorization token lifetime either.
- **`https://developers.usps.com/domesticlabelsv3`** (Domestic Labels 3.0) — no
  quota, no token lifetime.
- **`https://www.usps.com/business/web-tools-apis/onboarding-guide.pdf`** — no
  rate limit anywhere in it, and no payment-token lifetime.
- **`https://github.com/USPS/api-examples`** (USPS's own example repository, checked
  2026-11-12) — no quota, rate limit or token lifetime in its README, Postman
  collection or example files. The README says access tokens expire and callers
  should check the expiration time; its `expires_in` is the placeholder `"11111"`.

So for Labels and Payments there is no figure to cite, and none is invented. Both
sit **outside the default product** — USPS Ship enrolment and an Enterprise
Payment Account, per the quote above — which is also why the documented 60/hour
cannot simply be stretched to cover them.

### Re-checked 2026-11-12

Both getting-started pages were fetched again, through a tool that summarises
pages, so treat the wording as near-verbatim. Nothing has changed since
2026-08-25: `devs.usps.com/getting-started` still carries the "each with a quota
of 60 calls per hour" sentence and omits Tracking; `developers.usps.com/getting-started`
still has no figure and lists Tracking in the default product. No USPS page
fetched says whether a quota is scoped to an application, a client id, a CRID or
an IP, and none states a quota for Labels or any other non-default API.

Two more USPS statements, neither with a number:

- `developers.usps.com/faq`: "Each API product limits APIs access by time, scope,
  and quota." APIs are bundled into "API products", some approved automatically
  and some needing administrative approval. This is the only primary hint that a
  quota belongs to a product, which is consistent with Labels having its own.
- `developers.usps.com/terms-and-conditions` says limits are on requests "in a
  given day" and "may be reviewed on the description pages associated with the
  APIs". That is per day where the getting-started page says per hour. **The
  per-API description pages were not fetched**, so whether they state figures is
  a gap in this search, not a negative result.

What would settle the scope: with a real account, call one default API until it
returns 429, then call a different default API with the same token. If the second
still answers, the quota is per API.

### Third-party figures — _not_ used for calibration

Recorded as context only. Neither of these set a number in the code, and neither
is a USPS statement:

- **`https://www.smarty.com/blog/usps-api-rate-limit`** — reports that USPS's
  initial documentation limited address verification to 60/hour, then reports
  _practical_ limits of roughly **20,000/day for Addresses** and **500,000/day
  for Pricing, Locations, Service Standards and Tracking**. Smarty attributes
  those to unnamed "sources familiar with how the rollout has functioned in
  practice" and to "USPS support conversations and follow-up testing at Smarty" —
  no official USPS publication. Kept here as evidence that a quota increase is a
  normal thing to be granted, not as a basis for a number.
- **~6,000 calls/minute absorbed by the retired Web Tools XML API.** Also
  third-party, and a different, discontinued API. It is the only
  order-of-magnitude anchor available for label throughput and it is a weak one;
  it appears in the `:labels` comment as a ceiling, not as a source.

- **"60/hour per application, shared across every endpoint, labels included."**
  This circulates in search-engine summaries. Traced 2026-11-12, it comes from
  one author: a vendor who runs a USPS proxy, writing in
  `github.com/USPS/api-examples/issues/107` (2026-03-10, "what I've found through
  testing") and repeating it on his own blog and site. No raw 429 response is
  shown. It also claims a burst of 5 requests a minute and that token requests
  count. Two other vendor posts say "per API" instead, equally without a USPS
  source. **Not used**: it contradicts USPS's own "each with a quota", and its
  claim about labels contradicts USPS listing Labels outside the default
  product. The `:default` bucket here is one shared 60/hour bucket anyway, so
  that group is safe under either reading; only the `:labels` figure would be
  wrong if the claim were true.

The original flag was arithmetic: 10/s is 36,000/hour, roughly **600×** the
published 60/hour default. That ratio is what made a single shared bucket
indefensible — one of the two numbers had to be wrong for every endpoint it
covered.

### Why the client is split

Because USPS meters per API and publishes a quota for only one group of them,
**one budget per client cannot serve both groups honestly.** Setting it to 60/hour
would throttle label purchases to something no shipper can use; setting it to 10/s
would spend a documented hourly quota in six seconds. Neither number is wrong —
they belong to different meters.

So the account's client carries no budget of its own and registers two metered
sub-clients beneath it, mirroring how USPS actually meters:

| client                | paced at               | covers                                                                                                      |
| --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `usps:_:main`         | unmetered, no requests | owns the OAuth token both sub-clients draw on. A budget here would be a third bucket nothing spends from.   |
| `usps:_:main:default` | 60/hour, one at a time | the documented default product, plus Tracking, Pickups and every other API not listed under `labels`        |
| `usps:_:main:labels`  | 10/s                   | Labels, International Labels, Containers, Open and Distribute, SCAN Forms and Payments — no published quota |

Each sub-client carries its own calibration comment, because they are now
separate clients with separate quotas and only one of them has a citation.

**The `:default` arithmetic.** 3,600,000 ms ÷ 60 calls = one token every 60,000
ms, with `maxTokens: 1`. Paced one call at a time rather than allowed a burst of
60, so a cold replica cannot spend the whole hour in a second.

**Pickups is metered here too**, and it is _not_ in the published default product
— USPS publishes no quota for it either. It sits with the documented 60/hour
rather than with the label throughput because scheduling a pickup is a handful of
calls a day: the conservative bucket is the cheap mistake to make.

**The `:labels` 10/s is not derived from anything USPS published.** It is the
value this package has always paced label traffic at — enough for a shipper
buying labels in bulk, and comfortably under the retired Web Tools figure noted
above. It is a working default, and the code says so at the site rather than
implying a source it does not have. An account approved for labels has a quota
USPS will tell you and publishes nowhere.

**Confirm yours, then override rather than editing the number.**
`addTemplateClient` takes a `rateLimitOverrides` argument keyed by sub-client
name, so `{ labels: … }` retargets this bucket without forking the plugin. See the
package README for the call.

Request functions append their own sub-client segment (`requests/utils.ts`), so
callers keep passing the account name and never write `:labels` themselves —
which group an endpoint belongs to is USPS's business, not the caller's.

### Which API family goes to which group

Every request function names its group in `requests/utils.ts`. The rule:
**label-producing and payment endpoints go to `labels`; everything else goes to
`default`**, including the many APIs with no published quota, following the
precedent set above for Pickups.

| group     | API families                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labels`  | Labels, International Labels, Containers, Open and Distribute, SCAN Forms, Payments                                                                                                                                                                                                                                                                                                                                                                 |
| `default` | UserInfo, Addresses, Domestic Prices, International Prices, Shipping Options, Service Standards (estimates, standards, directory, files), International Service Standards, Tracking (v3 and v3r2), Pickups, Locations, Logistic Shipments, Ship Enrollment, QR Code, Adjustments, Reconciliation Adjustments, NCOA Data Services, the eight Subscriptions APIs, Informed Delivery Mail Campaigns, Informed Delivery Package Campaigns, Appointments |

**This is the repo's decision, not a USPS figure.** The consequence is that about a
hundred functions across more than twenty APIs now share one bucket paced at one
call a minute, although USPS meters per API ("each with a quota"), so per-API
buckets would be more faithful. A caller that needs more than that should pass
`rateLimitOverrides` for the `default` sub-client.

**Negative result: none of the 37 OpenAPI specs states a quota or rate limit.**
Each findings pass searched its own specs (for terms such as "rate limit",
"quota", "throttl", "per hour", "calls per") and found only `429` response
documentation, usually with a `Retry-After` header, and no figure. The searches are
recorded per API below. Together with the portal pages above, the only quota USPS
publishes anywhere is the 60/hour default-product sentence.

## Payment-token TTL

The cache holds a payment-authorization token for **7 hours**, described in code
as a margin under an 8-hour maximum. **As of the 2026-08-25 check that 8-hour
figure was unsourced; the Payments spec now cites it (see the update below).**
Checked 2026-08-25:

- **Payments 3.0** (`https://developers.usps.com/paymentsv3`) publishes no token
  lifetime.
- **Domestic Labels 3.0** (`https://developers.usps.com/domesticlabelsv3`)
  publishes none.
- The **onboarding PDF** has none.
- The only place the 8-hour figure was found at all is a third-party article.

The `7 * 60 * 60` predates this repository's validation pass and its comment read
as sourced; it is not. **Confirm the real lifetime against your own account before
trusting the margin.** If the true lifetime is 8 hours or longer, 7 is safe. If it
is shorter, the failure mode is every label request failing against a token that
will never work again — which is what `clearCachedPaymentToken` exists for, since
the TTL is otherwise the only eviction path and nothing detects a token USPS has
stopped accepting.

**Update from the Payments spec (vendor documentation, downloaded 2026-11-12).** The
Payments OpenAPI spec, v3.1.20, states that Payment Authorization Tokens are "valid
for eight hours after issuance" and that the Payments API should not be called per
label. That is a vendor statement of the 8-hour figure. It is still not an observed
token lifetime; no call has been made against a USPS account. The 7-hour cache
margin is this repo's choice and is unchanged.

### The `labels` interceptor and the payment token

The `labels` sub-client's interceptor mints and attaches
`X-Payment-Authorization-Token` for **any** request whose
`metadata.uspsAccountNumber` is a non-empty string, whatever its request name.
It used to key on the three `usps.labels*` names.

- `usps.payments.authorize` is skipped outright, so the mint cannot recurse into
  itself even if someone sets the metadata on it.
- The three original label request names (`usps.labels.create`, `.void`,
  `.reprint`) still throw the original message when the metadata is absent.
- Any other request name with the metadata absent passes through untouched.
- Any request name with the metadata present but empty or not a string throws the
  same message.
- The mint, lock and cache logic is unchanged; the token is shared per account
  across both sub-clients.

Which specs require the header (vendor documentation, checked per operation,
directly and through `$ref`):

| API in group `labels`    | Token header in the spec                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Labels                   | required on all 15 operations                                                                                                                                                                                 |
| International Labels     | required on all 6 operations                                                                                                                                                                                  |
| Open and Distribute      | required on both operations                                                                                                                                                                                   |
| Containers               | not declared on any of its 5 operations                                                                                                                                                                       |
| SCAN Forms               | not declared; the prose says a MID or manifestMID shipment is matched against the `LABEL_OWNER` role "provided in the Payment Authorization Token", which hints a token is involved (inference, not verified) |
| Payments account inquiry | not declared, and no `uspsAccountNumber` metadata is set                                                                                                                                                      |

No API in the `default` group declares the header.

**What USPS's published examples show (USPS's own published examples,
github.com/USPS/api-examples, checked 2026-11-12).** The header appears on four calls:
domestic label create, domestic label edit, first-class indicia (README and Postman) and
international label create (Postman). Every other label-group call in the examples
omits it: label reprint and cancel, branding, IMB indicia, international reprint, cancel
and indicia, both Open and Distribute calls, Containers, SCAN Forms and the payment
inquiry. The spec declares it **required** on 15 Labels, 6 International Labels and 2
Open and Distribute operations, so the examples are less strict than the spec, which is
the usual sign of an example that was copied rather than run. The plugin keeps sending the
token on every operation whose spec requires it; the examples do not show that any of
those calls works without it. Containers and SCAN Forms carry no token in the examples
either, which agrees with the spec and leaves the SCAN inference below unconfirmed.

## `manifestMid`

`UspsCredentials.manifestMid` is optional and, when absent, **the field is omitted
from both the `PAYER` and `LABEL_OWNER` roles entirely** — USPS then applies
whatever the account defaults to.

This is a doc-vs-code resolution, recorded because the two disagreed: the JSDoc
claimed `manifestMid` "falls back to MID when absent", while the code omitted the
field. **The code won.** Repeating the MID as the manifest MID is a guess about
the account's setup that USPS is better placed to make, and a wrong manifest MID
is a mis-manifested label rather than an error. The JSDoc was corrected to match.

**Recorded contradiction, not resolved.** The Payments spec, v3.1.20 (vendor
documentation, downloaded 2026-11-12), states in prose that a `LABEL_OWNER` role
needs `CRID`, `MID` **and `manifestMID`**. That conflicts with the decision above to
omit the field when `manifestMid` is absent. The statement is prose, not a schema
`required` array, and it is vendor documentation rather than an observed response,
so it does not by itself overturn the code's choice. Open question, needing a real
account: does USPS reject, or default, a `LABEL_OWNER` without `manifestMID`?

**Corroboration, not settlement (USPS's own published examples, checked 2026-11-12).**
All three payment-authorization examples (one README, two Postman) send `manifestMID` on
both the `PAYER` and the `LABEL_OWNER` role, and the `LABEL_OWNER` role there also
carries `accountType` and `accountNumber`, which the plugin's `LABEL_OWNER` omits. Each
example is a placeholder with the field filled in, so it agrees with the prose that the
role normally has `manifestMID`; it does not show what USPS does when it is absent. The
question stays open and the code is unchanged.

## Where the endpoint findings come from

Everything below rests on the USPS developer portal OpenAPI specs, downloaded
**2026-11-12**: 37 specs, all of which parse. That is **vendor documentation, not an
observed response**. No call was made against a USPS account. Where a schema, its
examples and its prose disagree, the types follow the schema and the disagreement is
recorded in the section for that API. A claim marked "inference" is a reading of the
spec, not something a response confirmed.

USPS's own example repository is a second, stronger-in-places source; it is described
under [USPS's published examples](#uspss-published-examples). Where this section
says "vendor documentation" it means the specs.

Every spec lists `https://apis.usps.com` as production. Eight list **no**
`apis-tem.usps.com` test server (read from each spec's `servers` block):

| Spec                                                                  | Server prefix                                       |
| --------------------------------------------------------------------- | --------------------------------------------------- |
| Appointments - All Mail Classes v3.0.3                                | `/fast-appointments/v3`                             |
| Informed Delivery Mail Campaigns v1.2.0                               | `/informed-delivery-campaigns` (no version segment) |
| Informed Delivery Package Campaigns v1.0.1                            | `/informed-delivery-package-campaigns` (no version) |
| QR Code v3.0.1                                                        | `/qr-code/v3`                                       |
| Subscriptions - Tracking v3.2.11 (v3r2)                               | `/subscriptions-tracking/v3r2`                      |
| Subscriptions - Tracking v3.1.17                                      | `/subscriptions-tracking/v3`                        |
| Package Tracking and Notification v3.2.9 (the `v3r2` file)            | `/tracking/v3r2`                                    |
| Package Tracking and Notification v3.2.9 (the `v3` file, same string) | `/tracking/v3`                                      |

Unusual prefixes, all with a test server: Shipment Tracking is `/logistics/v3`,
Shipping Options is `/shipments/v3`, Domestic Prices is `/prices/v3`, Carrier Pickup is
`/pickup/v3`, Open and Distribute is `/pmod/v3`, Subscriptions - Addresses is
`/subscriptions-address/v3` (singular), International Service Standards is
`/international-service-standard/v3` (singular) and UserInfo is `/oauth2-oidc/v3`.
Two tracking specs carry an identical title and version string but different
prefixes (`v3` and `v3r2`); the Subscriptions - Tracking pair likewise.

Function tables below were taken from the findings where they had one; where a
family's findings had none, the table was **read from the source** in
`src/requests/<family>/`, not from the spec.

## USPS's published examples

Source: `https://github.com/USPS/api-examples`, USPS's own GitHub organisation (last
pushed 2026-10-29), checked **2026-11-12**. It holds a README of curl examples with
responses (about 2,100 lines), a Postman collection of 90 requests with no saved
responses, SCAN Form request and response files, and two response files for Locations.
An `Error Inventory` spreadsheet, a Post Office locations interface-control document
(`.docx`) and a 2023 Domestic Labels PDF are also in the repository and were **not
read**: none could be opened as text here.

**Strength.** Vendor-published examples: a concrete request or response, so stronger
than a spec schema where the two disagree, but still not a response anyone here
observed. Many are dated 2023, placeholders are redacted (`XXXX`, `"string"`,
`{Confirmation Number}`), and the examples contradict each other in places. Where an
example contradicts a spec schema the types accept what the example shows; where the
example could simply be older than the spec the types admit both shapes and the section
for that API says so. Where an example only agrees with the spec it is recorded as
corroboration. The labels used below are "vendor documentation (spec)", "USPS's own
published examples" and "inference"; none of them is an observed response.

**Coverage.**

| API                                                                                                                                                                                                                                                                                                                                                                          | In the examples                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| OAuth token, Addresses, Carrier Pickup, Containers, Domestic Labels (create, edit, indicia), Domestic Prices, International Prices, Service Standards, Shipping Options, Tracking v3                                                                                                                                                                                         | request and response in the README                                                                                               |
| Payments authorization, SCAN Forms, Locations (drop-off, post office)                                                                                                                                                                                                                                                                                                        | request and response (SCAN and Locations as separate files)                                                                      |
| Payment account inquiry, Adjustments, Appointments, Informed Delivery Mail and Package Campaigns, International Labels, International Service Standards, Open and Distribute, Service Standards Directory and Files, Ship Enrollment, UserInfo, Parcel Locker locations, Label branding, label reprint and cancel, IMB indicia, Tracking notifications and proof of delivery | **request only** (Postman, no response)                                                                                          |
| Subscriptions (all eight), Logistic Shipments, QR Code, NCOA Data Services, Reconciliation Adjustments                                                                                                                                                                                                                                                                       | **not covered at all**                                                                                                           |
| Tracking v3r2                                                                                                                                                                                                                                                                                                                                                                | one README block, which looks like a documentation error (see [Tracking](#tracking)); the Postman collection has no v3r2 request |

The Postman collection also has a `POST /disputes/v3/dispute` request. That is a
Disputes API the plugin does not implement (it covers only Subscriptions - Disputes).

**What the examples do not state.** No quota, rate limit, token lifetime or
payment-token lifetime appears anywhere in the repository (see the negative results
under [Rate limits](#rate-limits)).

**Where the examples contradict themselves.** Recorded so that a later reader does not
take either side for settled:

- The README labels the first-class indicia call `PATCH /labels/v3/indicia`; the Postman
  collection and the spec use `POST`. The plugin uses `POST`.
- The README Edit Label body is a brace-wrapped list of objects with no enclosing array
  (not valid JSON); the Postman collection and the spec send an array. The plugin sends
  an array.
- The README Revoke example authenticates with `Bearer $TOKEN`; the Postman collection
  uses HTTP Basic, as does the spec.
- The README Carrier Pickup update response spells `streetAdress` and `ZIPLus4`; every
  other pickup example spells `streetAddress` and `ZIPPlus4`. The Postman PUT body wraps
  the pickup in `carrierPickupRequest`; the README PUT body does not.
- `postoffice-locator-v3-response.json` is **not valid JSON**: a trailing comma precedes
  the closing brace (line 2990), and the object has only `locations`, no `metadata` or
  `warnings`.
- The README SCAN response (`SCANForm-*-response.json`) is multipart with parts named
  `Scan Form Response` and `label`; the spec's multipart schema names them
  `SCANFormMetaData` and `SCANFormImage`. Its `fromAddress.address` has
  `streetAddress` and `secondaryAddress` swapped relative to the request, and
  lower-case `zipCode` and `zipPlus4`.
- Several README requests omit headers the spec lists: label create, edit and indicia
  carry `X-Payment-Authorization-Token`; reprint, cancel, branding, IMB indicia,
  international reprint, cancel and indicia, Open and Distribute, Containers and SCAN
  Forms do not (see [Payment token](#the-labels-interceptor-and-the-payment-token)).
- The Postman Addresses requests carry an empty `x-user-id` header that no spec lists;
  it is not sent.

## OAuth and UserInfo

Specs: "Open Authorization (OAuth 2.0) 3.0" v3.1.5, "Userinfo (OAuth 2.0)" v3.0.4.
Vendor documentation. Nothing here was called against USPS.

### Token endpoint

The spec confirms every part of the existing `src/client.ts` auth block:

- URL `POST {host}/oauth2/v3/token`, no security scheme on the operation, so the client
  credentials travel in the body (matching `{{clientId}}` and `{{clientSecret}}`).
- The spec accepts both `application/json` and `application/x-www-form-urlencoded`
  with a `grant_type` discriminator. The client's JSON body (`dataLocation:
"jsonBody"`) is documented.
- `client_credentials` requires `client_id` and `client_secret` only; `scope` is
  optional (omitted means the app's registered default). The plugin sends no scope.
- Response (`ClientApplicationTokenResponse`): `access_token`, `expires_in` and
  `token_type` ("Bearer") required; `issued_at` (epoch ms), `status`, `issuer`,
  `scope`, `client_id`, `application_name`, `api_products` and `public_key` optional.
  The example `expires_in` is 28799 (about 8 hours). The access token is a JWT. This
  grant returns no refresh token.
- The spec states no rate limit for the token endpoint; 429 "spike arrest" responses
  carry `Retry-After`.

**What USPS's published examples show (USPS's own published examples, checked
2026-11-12).** Corroboration unless stated:

- The client-credentials request is `POST /oauth2/v3/token` with
  `Content-Type: application/json` and a body of `client_id`, `client_secret` and
  `grant_type`: exactly what `src/client.ts` sends. No `scope` in the example either.
- The token response shows `expires_in` and `issued_at` as **strings** (`"11111"`,
  `"1111111111111"`), where the spec says integers. Core reads `Number(expires_in)` in
  `authenticate.js` of `@dianemo/core`, so a numeric string is accepted and a bad one
  falls back to a default lifetime with a logged warning. Nothing changed. The example
  values are placeholders, so whether live responses send strings is not shown.
- The authorization-code and refresh examples show the field names the spec lists
  (`refresh_token`, `refresh_token_issued_at`, `refresh_token_status`,
  `refresh_token_expires_in`, `refresh_count`) with `refresh_token_issued_at` and
  `refresh_token_expires_in` as numbers.
- **Contradiction.** The README Revoke example sends `Authorization: Bearer $TOKEN`; the
  Postman collection uses HTTP Basic, as does the spec. The spec and Postman agree, so
  `revokeUspsToken` would use Basic, and the reasons below for not adding it are
  unchanged.

### Authorization code grant

Open item. The plugin supports `client_credentials` only. The OAuth spec documents
more:

- On the same token endpoint, `refresh_token` (needs `refresh_token` plus client id and
  secret) and `authorization_code` (needs `code`, `redirect_uri` plus client id and
  secret). Both return `ResourceOwnerTokenResponse`, which adds `refresh_token`,
  `refresh_token_expires_in` (example 604799 s, about 7 days), `refresh_token_issued_at`,
  `refresh_count` and `refresh_token_status`.
- `GET /authorize` is leg one: query `response_type=code`, `client_id`,
  `redirect_uri`, optional `scope` and `state`, required `user_id`; Bearer-secured;
  answers 302 to `redirect_uri`.
- `POST /oauth2/v3/revoke` authenticates with **HTTP Basic** (client id and secret).
  Body `TokenRevokeRequest`: `token` required, `token_type_hint`
  (`access_token` or `refresh_token`, default `refresh_token`). A 200 has no payload.
  The spec says only refresh tokens can be revoked ("access tokens are
  self-contained", being JWTs).

None of this is built. If the grant were added, the template would need a
`grantRefreshConfig` for the refresh leg (no request function accepts a grant id
today), `ACCEPTED_GRANTS` in `test/auth.test.ts` (currently
`usps: ["client_credentials"]`) would change, and the evidence would go in
`/docs/oauth-grants.md`.

**Why `revokeUspsToken` was not added.**

- Core attaches the bearer token to every request on a client, so the call as the
  plugin could send it carries the wrong scheme. How core treats a per-request
  `Authorization` override was not checked in core's `dist`.
- The `client_credentials` grant never issues a refresh token, and only refresh tokens
  are revocable, so a caller of this plugin has nothing to revoke.

Revisit if the authorization code grant is ever added.

### UserInfo (`getUspsUserInfo`)

| Function          | Method and URL                         | Group     | Code     | Request name        |
| ----------------- | -------------------------------------- | --------- | -------- | ------------------- |
| `getUspsUserInfo` | GET `/oauth2-oidc/v3/userinfo`, Bearer | `default` | USP_0013 | `usps.userInfo.get` |

- `POST /userinfo` has identical security, description and response and no request
  body. It is not implemented because it carries nothing a caller could vary.
- Response `ResourceOwnerClaims`: `sub` required; `updated_at`; `payment_accounts`
  (`accounts`, one comma-and-space separated string, and `permits[]` of
  `permitNumber` and `permitZIP`); `mail_owners[]` of `crid` and `mids` (a
  comma-and-space string); additionalProperties true. `given_name`, `family_name`,
  `preferred_username`, `company_name`, `crid`, `address`, `email` and `contracts` are
  commented out in the spec as "not currently returned" and are not modelled.
- Claims depend on granted scopes: `openid` is required, `usps:payment_methods` gates
  `payment_accounts`, `usps:MIDs` gates `mail_owners`.
- Partly settled by vendor documentation: the security scheme lists **both**
  `clientCredentials` and `authorizationCode` flows and says tokens issued by either
  are supported, so the endpoint is documented as usable with a client-credentials
  token provided the app has the `openid` scope.
- Open questions needing a real account: what a client-credentials token returns for
  `sub` and the claims (the spec's wording is "for resource owner"), and whether the
  app's default-scope token includes `openid`. The plugin sends no `scope`.
- The spec states no quota. The path summary copies RFC 7009 revocation wording, a
  copy-paste error in the spec; ignored.
- USPS's published examples (Postman only, no response) call both `GET` and `POST` with
  no body, corroborating that the `POST` carries nothing a caller could vary. The
  open questions above stay open: no example shows a `sub` or any claim.

## Payments

Spec: Payments v3.1.20. Vendor documentation.

| Function                | Method and URL                                      | Group    | Code     | Request name              |
| ----------------------- | --------------------------------------------------- | -------- | -------- | ------------------------- |
| `authorizePayment`      | POST `/payments/v3/payment-authorization`           | `labels` | USP_0050 | `usps.payments.authorize` |
| `getUspsPaymentAccount` | GET `/payments/v3/payment-account/{account-number}` | `labels` | USP_0014 | `usps.payments.account`   |

The spec states no quota. Token lifetime and the `manifestMID` conflict are recorded
above under [Payment-token TTL](#payment-token-ttl) and [`manifestMid`](#manifestmid).

**`authorizePayment`.** Body `Parties` (`roles` required, minItems 1); the existing
function matches. Role rules are in the spec's **prose, not its schema**: `PAYER` and
`LABEL_OWNER` are required (`PAYER` may be omitted for the PC Postage flow,
`LABEL_OWNER` only); `LABEL_OWNER` needs `CRID`, `MID` and `manifestMID`; `PAYER` needs
`accountType` and `CRID`, plus `accountNumber` for EPS; each role may appear once.
`MID` and `manifestMID` match `^(\d{6}|\d{9})$`, `CRID` is 2 to 18 characters,
`permitZIP` is at most 5.

**`getUspsPaymentAccount`.** Query: `accountType` (required, `EPS` or `PERMIT`),
`permitZIPCode` (optional, `^\d{5}$`, which USPS requires when the type is PERMIT) and
`amount` (optional number). No required headers; no payment-token header and no
`uspsAccountNumber` metadata, so it is not token-gated. Response `PaymentAccount`:
`accountType`, `accountNumber`, `permitNumber`, `permitZIP`, `nonProfitStatus`
(permits only) and `sufficientFunds` (only when `amount` is sent). 404 is documented.

**What USPS's published examples show (USPS's own published examples, checked
2026-11-12).** The authorize request body matches `UspsAuthorizePaymentRequest` field for
field (`roleName`, `CRID`, `MID`, `manifestMID`, `accountType`, `accountNumber`), and the
README response is `{ paymentAuthorizationToken, roles }` with the roles echoed back,
which is `UspsAuthorizePaymentResponse`. The README token is the placeholder
`"XXXXXXXXXXXXXXXXXXXXXX"`. The account inquiry request in Postman is
`GET /payments/v3/payment-account/{account}?accountType=EPS&amount=100`, matching
`getUspsPaymentAccount`; no response is shown. The examples send `accountType` and
`accountNumber` on `LABEL_OWNER` too, which the plugin's minted token omits (see
[`manifestMid`](#manifestmid)); that is not shown to matter.

### Spec contradictions

- The Payments security scheme lists `tokenUrl: /oauth2/token`; every other spec uses
  `/oauth2/v3/token`, as does the OAuth spec itself. Ignored; the plugin uses
  `/oauth2/v3/token`.
- The inquiry enum is `EPS` or `PERMIT`; the token request's `accountType` is `EPS`,
  `PERMIT`, `METER` or `OMAS`. Modelled as two types.
- The UserInfo example `permitZIP` is 9 digits (`101500957`) while Payments caps
  `permitZIP` at 5.

### Audit of pre-existing types

| Type                                                     | Change                                                                                                                                      | Class           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `UspsPaymentRole`                                        | now extends the new `UspsPaymentAccount`; same fields, `permitZIP` and the MID fields gained doc comments only                              | non-breaking    |
| `UspsAuthorizePaymentResponse.paymentAuthorizationToken` | the spec marks it readOnly and not required; left as a required `string` (always present on a 200), the mint still checks for a falsy value | none (recorded) |
| `UspsPaymentRole.roleName`                               | the spec's `Role` has no `required`; left required                                                                                          | none (recorded) |
| `authorizePayment`                                       | request name now from `USPS_PAYMENT_AUTHORIZE_REQUEST_NAME` (same string), code USP_0050 unchanged                                          | none            |

## Labels

Spec: USPS Labels v18.0. Vendor documentation, not an observed response.

Server `https://apis.usps.com/labels/v3` (production) and
`https://apis-tem.usps.com/labels/v3` (testing). Request URL is `/labels/v3` plus the
path, against the bare-host baseURL. 15 operations, none `deprecated: true` (13
deprecated schema properties are tagged `@deprecated` in the types).

### Functions

The first three rows were read from the source, not the spec; the rest come from the
findings.

| Function                       | Method and URL                                   | Group    | Code     |
| ------------------------------ | ------------------------------------------------ | -------- | -------- |
| `createLabel`                  | POST `/labels/v3/label`                          | `labels` | USP_0001 |
| `voidLabel`                    | DELETE `/labels/v3/label/{trackingNumber}`       | `labels` | USP_0003 |
| `reprintLabel`                 | POST `/labels/v3/label-reprint/{trackingNumber}` | `labels` | USP_0008 |
| `cancelLabelByIdempotencyKey`  | DELETE `/labels/v3/label`                        | `labels` | USP_0020 |
| `createReturnLabel`            | POST `/labels/v3/return-label`                   | `labels` | USP_0021 |
| `editLabel`                    | PATCH `/labels/v3/label/{trackingNumber}`        | `labels` | USP_0022 |
| `createLabelIndicia`           | POST `/labels/v3/indicia`                        | `labels` | USP_0023 |
| `createLabelIndiciaImb`        | POST `/labels/v3/indicia/imb`                    | `labels` | USP_0024 |
| `cancelLabelIndiciaImb`        | DELETE `/labels/v3/indicia/imb/{imb}`            | `labels` | USP_0025 |
| `uploadLabelBranding`          | POST `/labels/v3/branding`                       | `labels` | USP_0026 |
| `listLabelBranding`            | GET `/labels/v3/branding`                        | `labels` | USP_0027 |
| `getLabelBranding`             | GET `/labels/v3/branding/{imageUUID}`            | `labels` | USP_0028 |
| `deleteLabelBranding`          | DELETE `/labels/v3/branding/{imageUUID}`         | `labels` | USP_0029 |
| `renameLabelBranding`          | PATCH `/labels/v3/branding/{imageUUID}`          | `labels` | USP_0030 |
| `reprintLabelByIdempotencyKey` | POST `/labels/v3/label-reprint`                  | `labels` | USP_0031 |

USP_0032 to USP_0034 are unused. `listLabelBranding` takes `limit` (1 to 100, default
10), `offset` (default 0), `orderBy` (`asc` or `desc`, default `desc`) and `sortBy`
(`imageName` or `createdDateTime`, default `createdDateTime`). `renameLabelBranding`
sends `[{op: "replace", path: "/imageName", value}]`.

`editLabel` accepts only `replace` on weight, length, height, width, girth,
processingCategory, rateIndicator and containers (the spec's enum). `value` is
`AnyValue` in the spec and is typed per path here, which is this repo's narrowing.
Per the spec description, edits are disallowed when the label was created with
`suppressPostage=false`, for Cubic Soft Pack dimensions, and from cubic to non-cubic
rate indicators.

### Group and quota

All 15 functions are in `labels` (the repo's decision, not a USPS figure). The spec
states no rate limit, quota or throttling text; its only trace is a `429` response on
every operation with a `Retry-After` header component.

### Payment token

Every one of the 15 operations lists `X-Payment-Authorization-Token` as a **required**
header parameter, including branding list, get, delete and rename, indicia cancel and
`DELETE /label` by idempotency key. Every function therefore sets
`metadata.uspsAccountNumber`. Branding needing a payment token is surprising
(inference: a spec-wide parameter list rather than a per-operation decision); no
account has confirmed whether USPS rejects branding calls without it.

### Content types and `Accept`

- Request bodies are `application/json` and `application/xml` for every body-carrying
  operation except branding PATCH (JSON only). The plugin sends JSON.
- `POST /branding` is **JSON, not multipart**: `{ imageName?, imageData }`, where
  `imageData` is the base64 of an .svg under 10 KB (maxLength 13336, pattern
  `^[A-Za-z0-9+/=]+$`).
- Label-producing responses list `multipart/form-data` first, then
  `application/vnd.usps.labels+json|xml`, then `application/json|xml`. The shapes differ:
  - `vnd.usps.labels+json` on `POST /label` and `POST /return-label` is flat: metadata
    at the top level with base64 images beside it.
  - `application/json` on those is nested (`labelMetadata`, `labelImage`, ...), which is
    the multipart schema.
  - Reprint (`/label-reprint` and `/label-reprint/{trackingNumber}`): the
    `vnd.usps.labels+json` schema is a `oneOf` of outbound and return responses that are
    **nested** (`labelMetadata` or `returnLabelMetadata`, `labelImage`, `reprintInfo`),
    not flat.
  - Indicia and IMB indicia (success `201`) have one schema (`indiciaMetadata`,
    `indiciaImage`, `receiptImage`) for every content type.
- The plugin keeps `Accept: application/vnd.usps.labels+json` for create, return and
  reprint (existing behaviour for create and reprint) and sends
  `Accept: application/json` for the two indicia creations, which it reads back as
  bytes and accepts in either form. Without an `Accept` the server answers
  `multipart/form-data`, which a JSON handler cannot return as `data`: stated by the
  spec as an inference and now shown by USPS's own README create and indicia examples
  (see [below](#what-uspss-published-examples-show)); still not observed here.
- `DELETE /label` and `/label/{trackingNumber}` return `CancelResponse` (`disputeId`);
  `DELETE /indicia/imb/{imb}` returns `IMBCancelResponse` with `disputeID`, a different
  capitalisation. Both are kept as the spec writes them.

### Idempotency key

`X-Idempotency-Key` (uuid) is declared `required: false` on `POST /label`,
`POST /return-label`, `DELETE /label` and `POST /label-reprint`. The spec says the label
endpoint is **not** idempotent: resubmitting a used UUID buys a new label, and a later
reprint or cancel references the most recent label with that UUID. The key is what
cancel and reprint by key look labels up by. For the two by-key functions the type makes
it required, since without it the call identifies nothing (this repo's decision).
`createReturnLabel` defaults to a fresh UUID, as `createLabel` does.

### Spec contradictions and oddities

- `LabelMetadata.inductionType` is `type: object, additionalProperties: false` with no
  properties; the v1.0.0 type said `string`. Typed `Record<string, never>`; no example
  shows a value.
- `ReprintInfo.reprintNumber` and `reprintLimit` are `type: integer, format: byte`, an odd
  combination; typed `number`.
- `LabelRequest.packageDescription` is a `oneOf`: a description with `rateIndicator`, or
  one with `packagingType` and `shape`. The v1.0.0 type required `rateIndicator` only.
- `ReturnLabelRequest.packageDescription` requires neither `mailingDate` nor
  `destinationEntryFacilityType` (outbound requires both). A return label's `toAddress`
  requires street, city, state and ZIP; an outbound `toAddress` requires none (the
  parcel-locker case).
- The spec has **no** `required` array on any response schema, so every response field
  is optional here.
- `ExtraService` is an integer enum list, not `{extraServiceCode, value}` objects (see the
  audit table).

### What USPS's published examples show

Source: USPS's own published examples (github.com/USPS/api-examples, checked
2026-11-12); not observed responses. The README has create, edit and first-class indicia
with responses, dated 2023 to 2025. Postman adds reprint, cancel, IMB indicia and the
branding calls as requests only.

- **Create label (corroboration).** The README request (`POST /labels/v3/label`, no
  `Accept`) has the spec's field names and nesting: `imageInfo`, `toAddress`,
  `fromAddress`, `packageDescription` with `weightUOM: "lb"`, `dimensionsUOM: "in"`,
  `extraServices: [920]` as integers and `packageOptions.packageValue`. Its response is
  `multipart/form-data` with a JSON part `labelMetadata` and a PDF part `labelImage`:
  the multipart form the spec lists first, and what a request without a vendor `Accept`
  gets. The `labelMetadata` fields match `UspsLabelMetadata` (`routingInformation`
  string, `zone` the string `"01"`, `postage` number, `commitment.name` and
  `scheduleDeliveryDate`, `extraServices[]` of `name`, `price`, `SKU`, `links[]` with
  `rel` as an array). One extra field, `parcelLockerNumber` (`""`), was not in the schema
  and is now optional on `UspsLabelMetadata`.
- **The example does not show what `application/vnd.usps.labels+json` returns.** No
  example uses the vendor type, so the flat shape `createLabel` types is still the spec's
  word alone.
- **Edit label.** The README response is a plain JSON object (not multipart) with the
  `UspsLabelMetadata` fields, including `labelBrokerID: ""`; it corroborates
  `editLabel`'s return type. The paths `/packageDescription/weight`, `length`, `height`,
  `width`, `girth`, `processingCategory`, `containers` and `rateIndicator` match
  `UspsLabelEditOperation`, with `containers` carrying `{ containerID, sortType }`. The
  README body is not valid JSON (no enclosing array); Postman sends an array.
- **First-class indicia: a real contradiction, fixed.** The README response is
  `multipart/form-data` from a request with no `Accept`: a JSON part named
  `indiciaMetadata` holding the **flat** metadata (`SKU`, `postage`, `fees`, `weight`),
  then PDF parts `receiptImage` and `indiciaImage`, the PDFs shown as base64 text with
  no `Content-Transfer-Encoding`. The plugin had sent `Accept: application/json` and typed
  the result as the spec's nested JSON document, which a multipart body would have
  broken. The spec text says `Accept` changes only the metadata part of a multipart
  body, and no example shows `application/json` returning a single document. Both
  indicia creations now request the body as bytes (`responseType: "arraybuffer"`), keep
  `Accept: application/json`, and fold either form into the same nested type
  (`readIndiciaBody` in `src/requests/labels/utils.ts`): multipart parts become
  `indiciaMetadata`, `indiciaImage` and `receiptImage`, the images as base64 strings. An
  unreadable body throws `USP_0095`. Not breaking against v2.0.0, which had no indicia.
  The cost: a failure status reaches the caller with a `Buffer` body in the error's
  `originalError`, not a parsed object.
- **Indicia method.** The README says `PATCH /labels/v3/indicia`; Postman and the spec
  say `POST`. The plugin uses `POST`.
- **Not exemplified at all:** reprint responses (either content type), cancel
  responses, IMB indicia responses, any `vnd.usps.labels+json` body, branding responses,
  `X-Idempotency-Key` (no example sends it), and the return label.

### Open questions needing a real account

- Whether branding operations really need the payment token. The examples do not help:
  none of them carries the header on a branding call (see
  [the payment token](#the-labels-interceptor-and-the-payment-token)).
- Whether USPS enforces the `X-Idempotency-Key` UUID format on cancel by key.
- Whether `application/vnd.usps.labels+json` returns the flat single JSON document the
  spec describes. No example uses it.
- Whether `Accept: application/json` on indicia returns the nested single document or
  multipart; the plugin handles either.

Settled by USPS's published examples (not observed): a create or indicia request with no
`Accept` header is answered with `multipart/form-data`. The plugin never relies on that
default.

### Audit of pre-existing types (v1.0.0 to now)

`createLabel`, `voidLabel` and `reprintLabel` keep name, request name, error code and
signature. Method and URL already matched the spec. `createLabel(clientName, data,
accountNumber, idempotencyKey?)`, `voidLabel` and `reprintLabel` keep a bare string
positional next to `clientName`, against the repo rule, because they are published.

| Change                                                                                                                                                                                                                                                  | Class                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `UspsCreateLabelRequest.fromAddress` and `returnAddress`: `UspsLabelAddress` (street required only) to `UspsLabelPostalAddress` (`streetAddress`, `city`, `state`, `ZIPCode` required)                                                                  | breaking                                                                   |
| `toAddress`: new `UspsLabelRecipientAddress`; `streetAddress` now optional (parcel locker), `facilityId` etc. kept                                                                                                                                      | non-breaking (widens)                                                      |
| `senderAddress`: `UspsLabelSenderAddress` (required street, city, state, ZIP, plus `platformUserId`)                                                                                                                                                    | breaking                                                                   |
| `UspsPackageDescription`: interface to intersection type; `rateIndicator` now a 47-code union, or `shape` plus `packagingType`; `mailClass` adds `MARKETING_MAIL_PARCELS`                                                                               | breaking (`rateIndicator` string narrowed); the union members are additive |
| `UspsPackageDescription.extraServices`: `{extraServiceCode, value?}[]` to `UspsLabelExtraServiceCode[]` (integers)                                                                                                                                      | breaking (the old shape contradicts the spec)                              |
| `customerReference[].referenceNumber` required to optional, plus `printReferenceNumber`                                                                                                                                                                 | non-breaking                                                               |
| `packageOptions.contentType` and `nonDeliveryOption` string to enum; added `packageValue`, `omas`, `redirectAddress`, `generateGXEvent`, `containers`, `ancillaryServiceEndorsements`, `returnReceiptTracking`, `originalPackage`                       | breaking (narrowing); the rest additive                                    |
| Added `destinationEntryFacilityAddress`, `serialNumberFormat`, `shipperVisibilityMethod`, `mailOwnerMID`, `logisticsManagerMID`, `nonprofit`, `weightUOM`, `dimensionsUOM`, `hasNonstandardCharacteristics`                                             | non-breaking                                                               |
| `imageInfo`: shared `UspsImageInfo` to `UspsLabelImageInfo` (adds `EPL300DPI`, `shipInfo`, `addZPLComments`)                                                                                                                                            | non-breaking                                                               |
| `UspsCustomsForm.restrictionType` string to enum; `contents[]` gains `itemValue`, `itemWeight`, `itemCategory`, `itemSubcategory`                                                                                                                       | breaking (`restrictionType` narrowing)                                     |
| `UspsLabelResponse.labelImage` required to optional                                                                                                                                                                                                     | breaking for readers                                                       |
| `UspsLabelMetadata`: `trackingNumber` required to optional; `extraServices` gains `warnings`; `inductionType` string to empty object; `labelAddress` typed; `commitment.name`, `links`, `warnings` added; `fees` and `extraServices` price now optional | breaking for readers                                                       |
| `UspsLabelResponse.returnLabel`: was nested `{returnLabelMetadata, returnLabelImage, returnReceiptImage}`; the spec is `ReturnLabelMetadata` fields merged with the images (flat), including `labelBrokerQR`                                            | breaking (the old shape contradicts the spec)                              |
| `reprintLabel` return type `UspsLabelResponse` to `UspsLabelReprintResponse` (nested `labelMetadata`, `labelImage`, `reprintInfo`)                                                                                                                      | breaking (the old flat shape contradicts the spec)                         |
| `UspsCancelResponse`: `trackingNumber` and `status` required to optional                                                                                                                                                                                | breaking for readers                                                       |
| `UspsLabelReprintRequest.imageInfo`: shared `UspsImageInfo` to `UspsLabelReprintImageInfo` (drops `receiptOption`, `returnLabel`, `includeLabelBrokerPDF`, `addImageComments`, which the reprint schema does not have)                                  | breaking only for callers that passed those                                |
| `UspsErrorResponse` removed from `labels/types.ts` (the shared `../types.ts` exports the same name; both under `export *` was a TS2308 conflict)                                                                                                        | non-breaking (still exported from the package)                             |
| `voidLabel` and `reprintLabel` URL-encode `trackingNumber`                                                                                                                                                                                              | non-breaking                                                               |
| `UspsLabelMetadata.parcelLockerNumber` added (from the README create example)                                                                                                                                                                           | non-breaking                                                               |

## International

Specs: International Labels v3.4.1, International Prices v3.3.12, International
Service Standards v3.0.2. Vendor documentation; nothing was observed against a live
account. No webhooks and no `deprecated: true` operations in any of the three.

### International Labels

Servers `https://apis.usps.com/international-labels/v3` and a testing server
`https://apis-tem.usps.com/international-labels/v3`.

| Function                                    | Method and URL                                          | Group    | Code     |
| ------------------------------------------- | ------------------------------------------------------- | -------- | -------- |
| `createInternationalLabel`                  | POST `/international-labels/v3/international-label`     | `labels` | USP_0035 |
| `cancelInternationalLabelByIdempotencyKey`  | DELETE `/international-labels/v3/international-label`   | `labels` | USP_0036 |
| `reprintInternationalLabel`                 | POST `.../international-label-reprint/{trackingNumber}` | `labels` | USP_0037 |
| `reprintInternationalLabelByIdempotencyKey` | POST `.../international-label-reprint`                  | `labels` | USP_0038 |
| `cancelInternationalLabel`                  | DELETE `.../international-label/{trackingNumber}`       | `labels` | USP_0039 |
| `createInternationalIndicia`                | POST `.../indicia`                                      | `labels` | USP_0040 |

- All six operations list `X-Payment-Authorization-Token` as a required header, so every
  function sets `metadata.uspsAccountNumber`. The `labels` group is the repo's decision,
  not a USPS figure. The spec states no rate limit or quota (searched for rate limit,
  quota, per hour and throttl; the only hits are 429 response refs and rate-indicator
  text).
- `X-Idempotency-Key` is optional on create. The spec says create is NOT idempotent:
  resubmitting a used UUID generates a new label, and reprint or cancel then reference
  the most recent label with that UUID. `createInternationalLabel` defaults the key to a
  fresh UUID, as domestic `createLabel` does; pass a stable one to be able to reprint or
  cancel by key. The key is required on the two by-key operations.
- **Response content types.** Create, reprint and indicia default to `multipart/form-data`
  (a metadata part plus the image part), which a JSON client cannot parse. Following
  domestic `createLabel`, these send `Accept: application/vnd.usps.labels+json`, which
  returns the label as one JSON document with a Base64 `labelImage`. Per the spec text,
  `Accept: application/json` would only change the metadata part of a multipart body, so
  it is not a way out. The multipart form is therefore not supported. Cancel operations
  return `application/json` only.
- **Schemas differ by media type**, typed per the `vnd+json` variant actually requested.
  Create returns `InternationalLabelVendorResponse` (flat: label metadata fields plus
  `labelImage` and `labelBrokerQR`), not the `{ labelMetadata, labelImage }` shape of the
  multipart and json variant, and it omits `prepaidDutiesTaxesFees`, which exists only on
  the multipart and json schema `InternationalLabelResponse` (also exported). Reprint's
  `vnd+json` schema is `LabelReprintInternationalResponse` (`labelMetadata`, `labelImage`,
  `reprintInfo`). Indicia's `vnd+json` schema is the same `IndiciaResponse` as multipart.
- Reprint limits (spec text): up to the mailing date, at most 3 times, canceled labels not
  reprintable.
- Cancel: a label can be canceled before a Shipping Services File exists; otherwise a
  refund request is submitted and `status: "DISPUTED"` with a `disputeId` returns. One
  `disputeId` per CRID per day; duplicates are rejected. The by-key and
  by-tracking-number endpoints are not interchangeable (spec).
- Indicia: First-Class Mail International letters, flats and cards only; "Only supported
  for PAYER roles with an EPS accountType"; non-refundable. It lives in this spec but
  takes no idempotency key.
- Spec quirk: `InternationalShippingContents` is `allOf [ShippingContents, {required:
[...]}]` with `additionalProperties: false`, so the three required fields come from the
  second member; typed `Required<Pick<...>> & ShippingContents`.
- Schema names that collide with the domestic Labels API (`PackageDescription`,
  `CustomsForm`, ...) are prefixed `UspsInternationalLabel`.
- Open question needing an account: whether the duties and taxes prepay detail is returned
  under `vnd+json` when `prepayDutiesTaxesFees` is true.
- **USPS's published examples** (github.com/USPS/api-examples, checked 2026-11-12;
  Postman only, request without a response). The create request has the field names and
  nesting `UspsInternationalLabelRequest` has (`toAddress` with `postalCode`,
  `province`, `country`, `countryISOAlpha2Code`; `packageDescription` with
  `packageOptions.nonDeliveryOption`; `customsForm.contents[]` with `countryofOrigin`
  lower-case `o`, as the type has it). One discrepancy: its `imageInfo` carries
  `packageNumber` (5) and `totalPackages` (50), which this spec's `imageInfo` schema
  does not list; both are now optional on `UspsInternationalLabelImageInfo`
  (non-breaking; the domestic reprint schema lists the same pair). Only create carries
  `X-Payment-Authorization-Token` there; reprint, cancel and indicia do not (see
  [the payment token](#the-labels-interceptor-and-the-payment-token)). No response is
  shown for any of the six operations, so the `vnd+json` and multipart questions above
  are unchanged.

### International Prices

Servers `https://apis.usps.com/international-prices/v3` and
`https://apis-tem.usps.com/international-prices/v3`; OAuth scope `international-prices`.
No payment-token header on any operation. Group `default` by the repo's decision; the spec
states no quota and none was found. All five operations are POST `.../search` with a JSON
body and response and no query parameters.

| Function                               | URL                                | Group     | Code     |
| -------------------------------------- | ---------------------------------- | --------- | -------- |
| `searchInternationalBaseRates`         | POST `/base-rates/search`          | `default` | USP_0041 |
| `searchInternationalExtraServiceRates` | POST `/extra-service-rates/search` | `default` | USP_0042 |
| `searchInternationalBaseRatesList`     | POST `/base-rates-list/search`     | `default` | USP_0043 |
| `searchInternationalTotalRates`        | POST `/total-rates/search`         | `default` | USP_0044 |
| `searchInternationalLetterRates`       | POST `/letter-rates/search`        | `default` | USP_0045 |

- `BaseRatesQuery.priceType` allows RETAIL, COMMERCIAL, COMMERCIAL_BASE,
  COMMERCIAL_PLUS and CONTRACT; `ExtraServiceRateQuery.priceType` allows RETAIL,
  COMMERCIAL, COMMERCIAL_PLUS and NSA. Extra-service codes in prices (370, 813, 820, 826,
  857, 930, 931, 955) differ from those in the Labels spec (480 to 488 plus the same tail).
  `ExtraServiceRateQuery` accepts both `extraServices` (array) and `extraService` (single);
  neither is required.
- Contract rates need `accountType` and `accountNumber` and, per the base-rates-list
  description, a specified mail class. The spec does not mark this conditional
  requirement in `required`, so the types do not enforce it.
- `TotalRatesQuery` is `RateListQuery` plus duties and taxes fields; `destinationCity` and
  `destinationState` "may be required" when `requestDutiesTaxesFees` is true (conditional,
  untyped).
- `ExtraServiceRateQuery.itemValue` is a `string` in the spec, while
  `TotalRatesQuery.itemValue` and `LetterRatesQuery.itemValue` are numbers. Mirrored as
  written; likely a spec inconsistency (inference). **Corroborated** by USPS's published
  examples (github.com/USPS/api-examples, checked 2026-11-12): the README and Postman
  extra-service request sends `"itemValue": "500"` while total rates sends `300`.
- **Extra-service response shape (USPS's published examples; contradiction with the spec,
  types now admit both).** The spec wraps the rows in `extraServices`. The README example
  answers with one bare row (`SKU`, `priceType`, `price`, `extraService: "930"`, `name`,
  `warnings`), and its `extraService` is the string `"930"`, where the spec lists
  integers. `UspsInternationalPriceExtraServiceRateDetails` now carries the row's own
  fields and the optional `extraServices` wrapper, and `extraService` is
  `string | number`. Not breaking against v2.0.0, which had no International Prices.
  The example is dated 2023 and sends the single `extraService` key; it may predate the
  array form.
- **Corroboration.** The base-rates, base-rates-list and total-rates requests and
  responses match the types: `rates[]` and `totalBasePrice` at the top (base rates), or
  `rateOptions[]` each with `rates[]` and `totalBasePrice` (list), plus `totalPrice` and
  `extraServices[]` with string `extraService` codes (total). Response `priceType` is
  `COMMERCIAL_BASE` on list and total rows, as the types allow; `endDate` is `""`;
  `dimWeight` is a number. The README sends `destinationEntryFacilityType: "NONE"`
  and `rateIndicator: "SP"` as the type lists.

### International Service Standards

Servers `https://apis.usps.com/international-service-standard/v3` and
`https://apis-tem.usps.com/international-service-standard/v3`; OAuth scope
`international-service-standard`.

| Function                          | Method and URL                                                          | Group     | Code     |
| --------------------------------- | ----------------------------------------------------------------------- | --------- | -------- |
| `getInternationalServiceStandard` | GET `/international-service-standard/v3/international-service-standard` | `default` | USP_0046 |

Required query `countryCode` (two letters, pattern `^([a-zA-Z]){2}$`) and `mailClass`
(three international classes). Response `{ countryCode, mailClass,
serviceStandardMessage }`, all optional in the spec. Documented errors are 400, 404 and
500 only (no 401 or 429). Group `default` by the repo's decision; no quota stated.

USPS's published examples (checked 2026-11-12) show the request only (Postman,
`?countryCode=CA&mailClass=FIRST-CLASS_PACKAGE_INTERNATIONAL_SERVICE`), which matches the
function; there is no example response.

## Addresses, prices, shipping options and service standards

Specs, all vendor documentation: Addresses v3.3.1 (file `addresses-v3r2_0.yaml`),
Domestic Prices v3.4.32, Shipping Options v3.1.32, Service Standards v3.1.12, Service
Standards Directory v3.0.2, Service Standards File Download API v3.0.3. Nothing was
observed against a live account.

### Server prefixes

- Addresses: the file is named `v3r2` but its `servers` entry is
  `https://apis.usps.com/addresses/v3` (and the `apis-tem` equivalent); `info.version` is
  3.3.1 and paths are `/addresses/v3/...` with no `r2` segment. Contrast Tracking, whose
  server really is `/tracking/v3r2`. The existing `validateAddress` URL
  `/addresses/v3/address` is correct. Inference: `r2` is a portal revision label for the
  file, not a URL version.
- Prices `/prices/v3`, Shipping Options `/shipments/v3` (not `/shipping-options`), Service
  Standards `/service-standards/v3`, Directory `/service-standards-directory/v3`, Files
  `/service-standards-files/v3`. All six list a test server with the same prefix.

### Functions

Read from the source (`src/requests/addresses`, `rates`, `shippingOptions`,
`serviceStandards`), not from the spec. All are in group `default`.

| Function                                | Method and URL                                                       | Code     |
| --------------------------------------- | -------------------------------------------------------------------- | -------- |
| `validateAddress`                       | GET `/addresses/v3/address`                                          | USP_0004 |
| `getUspsCityState`                      | GET `/addresses/v3/city-state`                                       | USP_0051 |
| `getUspsZipCode`                        | GET `/addresses/v3/zipcode`                                          | USP_0052 |
| `getTotalRates`                         | POST `/prices/v3/total-rates/search`                                 | USP_0002 |
| `getBaseRatesList`                      | POST `/prices/v3/base-rates-list/search`                             | USP_0009 |
| `searchBaseRates`                       | POST `/prices/v3/base-rates/search`                                  | USP_0053 |
| `searchExtraServiceRates`               | POST `/prices/v3/extra-service-rates/search`                         | USP_0054 |
| `searchLetterRates`                     | POST `/prices/v3/letter-rates/search`                                | USP_0055 |
| `searchShippingOptions`                 | POST `/shipments/v3/options/search`                                  | USP_0056 |
| `getServiceStandardsEstimates`          | GET `/service-standards/v3/estimates`                                | USP_0057 |
| `getServiceStandards`                   | GET `/service-standards/v3/standards`                                | USP_0058 |
| `getServiceStandardsDirectoryZip5Codes` | GET `/service-standards-directory/v3/zip5Codes`                      | USP_0059 |
| `getServiceStandardsDirectory`          | POST `/service-standards-directory/v3/reporter`                      | USP_0060 |
| `listServiceStandardsFiles`             | GET `/service-standards-files/v3/files`                              | USP_0061 |
| `generateServiceStandardsFileSignedUrl` | GET `/service-standards-files/v3/files/{fileID}/generate-signed-url` | USP_0062 |

### Group, quota and token

None of the six specs states a rate limit or quota (searched for "rate limit", "quota",
"throttl": no hits). A 429 is documented as a response on Addresses and Shipping Options
only. None requires `X-Payment-Authorization-Token`, and no operation here sets
`metadata.uspsAccountNumber`.

### Wire notes

- **Addresses.** No schema has a `required` array, so every response field is optional
  (the v1.0.0 types had required fields). `ZIPPlus4` is `nullable`. `additionalInfo` has
  about 60 fields (DPV flags, LACSLink, eLOT, ...); `business` is deprecated in favour of
  `DPVBusiness`. `DPVUsageCode` can be a single space and `LACSIndicator` an empty string.
  `GET /zipcode` requires `streetAddress`, `city` and `state`; `/address` requires only
  `streetAddress` (the v1.0.0 types also required `state`).
- **Domestic Prices.** `total-rates` and `base-rates-list` share `RateListQuery`, which is
  `additionalProperties: false` and has no `processingCategory`, `rateIndicator` or
  `destinationEntryFacilityType`. Those belong to `base-rates/search` (`BaseRatesQuery`),
  where they are required along with `mailClass` and `priceType`. The v1.0.0 types had them
  on the total-rates query.
  - `accountType: MID` exists on `base-rates/search` and `extra-service-rates/search` only;
    rate-list and total-rates allow EPS, PERMIT and METER.
  - `mailClass` on rate-list and total-rates is deprecated in favour of `mailClasses`; only
    those two accept `ALL`. `USPS_RETAIL_GROUND` is listed in the enums but its description
    says it returns 400. Several mail classes (`PARCEL_SELECT_LIGHTWEIGHT`,
    `FIRST-CLASS_PACKAGE_SERVICE`, ...) are deprecated aliases.
  - Extra-service search is a `oneOf` of an array query and a deprecated single-integer query
    (the spec says removed June 2025; still typed). The response is a bare array, and
    `base-rates/search` returns one rate option, not wrapped in `rateOptions`.
  - Letter rates: `weight` is in OUNCES (every other rate query is pounds); response
    `warnings` are plain strings, elsewhere objects.
  - Response `priceType` on rate rows can be `COMMERCIAL_BASE` or `COMMERCIAL_PLUS`; the
    request `priceType` cannot.
- **Shipping Options.** The request is a `oneOf` domestic (`destinationZIPCode`) or
  international (`destinationCountryCode`); the same pricing-option object serves request
  and response (`shippingOptions` is readOnly). `Commitment.cutOffTime` is typed `number`
  yet carries a four-digit HHMM pattern (a schema contradiction; typed `number`).
  `mailingDate` is a `oneOf` date or date-time. The domestic request `mailClass` enum has 19
  members, the response `DomesticMailClass` 14.
- **Service Standards.** `/estimates` has `acceptanceDate`, `acceptanceTime` and
  `weightUOM`; `/standards` has none of the three. `acceptanceLocations` is one object
  despite the plural. Both return bare arrays. `scheduledDelivery*` fields are deprecated.
  `length`, `width` and `height` have no `required` flag but are described as required for
  Priority Mail Next Day.
- **Directory.** `GET /zip5Codes` has no parameters; `POST /reporter` is paginated through
  the body (`offset`, `limit` max 20000) and the response `metadata.links.*.body` is the
  next request body. Responses are JSON only (no XML), unlike the other APIs. Its mail-class
  values differ from every other API (`PACKAGE_SERVICES`, `PRESORT_FIRST_CLASS`, ...).
- **Files.** `GET /files` returns a link array; the signed-URL response carries an
  Azure-style SAS URL with `expiry`, `contentLength` and `rangeLimit`. Downloading the file
  is a plain GET on `signedURL` and is **not** done by this plugin (it is outside the USPS
  API host and needs no OAuth).

### What USPS's published examples show for addresses, prices and shipping options

Source: USPS's own published examples (github.com/USPS/api-examples, checked
2026-11-12), README and Postman. They are dated 2023 to 2025 and are not observed
responses.

**Corroboration.**

- Addresses: the three request paths and query names (`streetAddress`,
  `secondaryAddress`, `city`, `state`, `ZIPCode`, `ZIPPlus4`; `ZIPCode` alone for
  city-state; `streetAddress`, `city`, `state` for zipcode) match. The address example
  sends only `streetAddress`, `city` and `state` plus optionals, so `state` optional on
  `/address` is not contradicted. `additionalInfo` in the example uses `deliveryPoint`,
  `carrierRoute`, `DPVConfirmation`, `DPVCMRA`, `business`, `centralDeliveryPoint` and
  `vacant`, all typed. `corrections[].code` is `""` and `matches[].code` is `"31"`, both
  strings as typed.
- Domestic Prices: request field names and nesting for base rates, total rates, base
  rates list (both `mailClass` and `mailClasses` in Postman) and letter rates match, and
  the total-rates request carries no `processingCategory`, `rateIndicator` or
  `destinationEntryFacilityType`, so the v1.0.0 removal agrees with the example. Response
  rows have `endDate: ""` throughout and no `null`, so the v1.0.0 `endDate: null`
  typing has no support in the examples. `totalPrice`, `totalBasePrice`, `rates[]` and
  `extraServices[]` inside each `rateOptions[]` entry match `UspsTotalRatesOption`.
- Shipping Options: the request (`pricingOptions[].paymentAccount`, `packageDescription`
  with `girth`, `extraServices: [365]`, `packageValue`, `mailingDate`) and the response
  (`shippingOptions[].mailClass`, `rateOptions[]` with `commitment.name` and
  `scheduleDeliveryDate`, `totalPrice`, `rates[]` with `dimensionalWeight` and
  `endDate: ""`, `extraServices[]` with `SKU: "NA"`) match. The response normalises
  `"38746 0230"` to `"38746-0230"`. The README curl sends no `Content-Type`; the plugin's
  client sets JSON.
- Service Standards: both requests use the typed query names
  (`serviceTypeCodes=925` as a bare string).

**Contradictions between the spec and the examples; the types now admit both.**

| API and field                                                         | Spec says                  | Example shows                                                                                                        | Change                                                                                    |
| --------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Domestic extra-service search request key (single code)               | `extraServices: <integer>` | `extraService: 415` (README and Postman)                                                                             | `extraService` added to `UspsRateExtraServiceSingleQuery`                                 |
| Domestic extra-service search response                                | array                      | one bare object, with a lower-case `sku`                                                                             | overloads: array query returns an array, single-code query returns object or array; `sku` |
| Letter rates `mailClass`, `zone`, `dimWeight`                         | `FIRST-CLASS_MAIL` only    | `USPS_GROUND_ADVANTAGE`, `zone: null`, `dimWeight: null`                                                             | `UspsRateLetterDetail` widened; `description` added                                       |
| Service Standards estimates `cutOffTime`, `serviceStandard`           | strings                    | numbers (`1700`, `2`)                                                                                                | `string \| number`                                                                        |
| Service Standards ZIP fields (`ZIPCode`, `ZIPPlus4`, `originZIPCode`) | strings                    | numbers (`10018`, `9998`)                                                                                            | `string \| number`                                                                        |
| Service Standards facility `closes`, `facilityType`                   | `closes`; `POST_OFFICE`    | `closeTimes` with mixed numbers and `"0000"`; `"POST OFFICE"`                                                        | `closeTimes` and the spaced value added; close times `string \| number`                   |
| Addresses: absent fields                                              | omitted or typed strings   | explicit `null` on every non-applicable field; four extra keys `postalCode`, `province`, `country`, `countryISOCode` | nullable fields and the four keys added                                                   |

All are new in this release, so none is breaking against v2.0.0 except where noted under
the audit below (v2.0.0 had `validateAddress` types; making `firm` and the address
fields nullable widens what a reader must handle).

The extra-service result is the one place a caller sees a union. The deprecated
single-code query is the form the examples use, and the spec says it is removed
(June 2025); the array query keeps the spec's array type.

### Open questions (need a real account)

- Whether USPS tolerates the three fields v1.0.0 sent on total-rates (the spec says
  `additionalProperties: false`; presumably 400).
- Whether the Directory and Files APIs count against the same 60/hour as the others.
- Whether the extra-service search answers with an object or an array for the array
  query (the examples only show the single-code query).
- Settled by the examples (still not observed): `endDate` is `""`, not `null`, on every
  rate row shown. Whether `ZIPPlus4: null` occurs is still open: the examples show a
  string for `ZIPPlus4` wherever it appears in an Addresses response.
- Not exemplified at all: Service Standards Directory and Files responses, the
  international shipping-options request, and any 429.

### Audit of pre-existing types

Methods, URLs, error codes, request names and function signatures of `validateAddress`,
`getTotalRates` and `getBaseRatesList` are unchanged and match the specs.

| Change                                                                                                                                                                                                                                | Class                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `UspsValidateAddressParams.state` required to optional (spec: not required)                                                                                                                                                           | non-breaking                                 |
| `UspsValidateAddressParams` field order only; `firm` unchanged                                                                                                                                                                        | non-breaking                                 |
| `UspsAddressResponse.address` required to optional                                                                                                                                                                                    | breaking (readers)                           |
| `UspsDomesticAddress`: `streetAddress`, `city`, `state`, `ZIPCode` required to optional; added `lastline`, `lastlineAbbr`                                                                                                             | breaking (readers)                           |
| `UspsAddressCorrection` and `UspsAddressMatch`: `code`, `text` required to optional                                                                                                                                                   | breaking (readers)                           |
| `UspsAddressAdditionalInfo`: added about 45 documented fields; `returnCode` etc. are literal unions                                                                                                                                   | non-breaking                                 |
| `UspsTotalRatesQuery` and `UspsBaseRatesListQuery`: `priceType` required to optional                                                                                                                                                  | non-breaking                                 |
| both queries: `mailClass` string to `UspsRateListMailClass`, `mailClasses` string[] to union[]                                                                                                                                        | breaking (callers passing arbitrary strings) |
| `UspsTotalRatesQuery`: removed `processingCategory`, `rateIndicator`, `destinationEntryFacilityType` (not in the spec)                                                                                                                | breaking                                     |
| `UspsTotalRatesQuery`: `extraServices` number[] to `UspsRateExtraServiceCode[]`                                                                                                                                                       | breaking (callers with a plain number[])     |
| `UspsBaseRatesListQuery`: `accountType` no longer allows `MID`                                                                                                                                                                        | breaking                                     |
| `UspsBaseRatesListQuery` is now an alias of `UspsRateListQueryBase`                                                                                                                                                                   | non-breaking                                 |
| `UspsTotalRatesResult` and `UspsBaseRatesListResult`: `rateOptions` required to optional                                                                                                                                              | breaking (readers)                           |
| `UspsRateOption`: `totalBasePrice`, `rates` optional; `totalPrice`, `extraServices` moved to new `UspsTotalRatesOption`                                                                                                               | breaking (readers of base-list options)      |
| `UspsRateDetail`: all fields optional; `priceType` gains `COMMERCIAL_BASE` and `COMMERCIAL_PLUS`; `processingCategory` and `destinationEntryFacilityType` become unions; `warnings` kept although only `BaseRateDetails` documents it | breaking (readers)                           |
| `UspsRateFee`, `UspsExtraServiceDetail`, `UspsRateWarning`: fields optional                                                                                                                                                           | breaking (readers)                           |
| `UspsDomesticAddress` and `firm` in the address responses: absent fields typed `\| null`; `postalCode`, `province`, `country`, `countryISOCode` added (from the README example)                                                       | breaking (readers must handle `null`)        |

## Tracking

Specs: "Package Tracking and Notification" v3.2.9, served at `/tracking/v3`, and a
second spec with the same title and version string served at `/tracking/v3r2`.
Vendor documentation. Both list only a production server; whether v3r2 has a test host is
open.

### Functions

`trackPackage`, `registerTrackingNotifications` and `requestTrackingProofOfDelivery`
target `/tracking/v3`; the v3r2 functions target `/tracking/v3r2`. The existing
`trackPackage` targets v3.

| Function                             | Method and URL                                       | Group     | Code     |
| ------------------------------------ | ---------------------------------------------------- | --------- | -------- |
| `trackPackage` (existing)            | GET `/tracking/v3/tracking/{n}`                      | `default` | USP_0005 |
| `registerTrackingNotifications`      | POST `/tracking/v3/tracking/{n}/notifications`       | `default` | USP_0065 |
| `requestTrackingProofOfDelivery`     | POST `/tracking/v3/tracking/{n}/proof-of-delivery`   | `default` | USP_0066 |
| `trackPackagesV3r2`                  | POST `/tracking/v3r2/tracking`                       | `default` | USP_0067 |
| `registerTrackingNotificationsV3r2`  | POST `/tracking/v3r2/tracking/{n}/notifications`     | `default` | USP_0068 |
| `requestTrackingProofOfDeliveryV3r2` | POST `/tracking/v3r2/tracking/{n}/proof-of-delivery` | `default` | USP_0069 |

No operation needs `X-Payment-Authorization-Token`. The group is the repo's decision (the
conservative bucket, following the Pickups precedent), not a USPS figure. The spec states
no rate limit, quota or call budget (searched for "rate limit", "quota" and "calls per");
the only throttling text is the generic 429 with `Retry-After`. On whether Tracking is in
USPS's default product, the findings and the portal pages above are not in agreement: the
earlier portal check found two of three lists including it (see Rate limits), while the
spec-level pass recorded Locations as one of the nine default-product APIs and Tracking and
Pickups as not. Both statements are kept.

### v3 versus v3r2

The two specs carry the same title and version string but are different APIs. Only
`ErrorMessage` is identical, so every v3r2 function has its own types
(`UspsTrackingV3r2*`) and nothing is reused from v3.

|                                | v3                                                                                                                              | v3r2                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Track                          | `GET /tracking/{n}`; query `expand` (SUMMARY or DETAIL), `destinationZIPCode`, `mailingDate`; optional header `X-Forwarded-For` | `POST /tracking`; body is an array of 1 to 35 `{trackingNumber, mailingDate?, destinationZIPCode?, includeVeriPoint?}`                                                      |
| Track response                 | `TrackingSummary` or `TrackingDetails` (oneOf)                                                                                  | 200: array of details; 207: array mixing success and failure entries, each with `statusCode`                                                                                |
| Detail shape                   | flat; several flags declared as strings                                                                                         | grouped (`deliveryDateExpectation`, `servicesEligibility` with real booleans, `trackingEvents`); renamed fields (`destinationZIPCode`, `uniqueTrackingID`, `recipientName`) |
| Notifications body             | `notifications[]` of `{email}` or `{cellNumber}`, `uniqueMailPieceId`, `mailPieceIntakeDate`, `notifyEventTypes` (7 values)     | `uniqueTrackingID`, `mailingDate`, `notifyEventTypes` (3 values), `recipients[]` of `{email, firstName?, lastName?}`                                                        |
| Notifications and POD response | `{resultText, returnCode}`                                                                                                      | `{transactionMessage}`                                                                                                                                                      |
| Proof-of-delivery body         | `uniqueMailPieceID`, `mailPieceIntakeDate`, `tableCode`, `requestType: "email"`, names, `email[]`, address fields               | `uniqueTrackingID`, `mailingDate`, `letterType` (POD or RRE), `recipients[]` (email, firstName and lastName all required), `CRID`                                           |
| `X-Forwarded-For`              | optional on all operations                                                                                                      | not declared                                                                                                                                                                |

### Spec contradictions and quirks

- v3 `mailClass` is an enum of 18 values, but its description says it "will also include
  the service standard message", which an enum cannot. **Settled by USPS's published
  example (github.com/USPS/api-examples README, checked 2026-11-12), not observed:** the
  detail example returns `"mailClass": "Priority Mail<SUP>&reg;</SUP>"`, display text with
  HTML markup, and `"services": "USPS Tracking<SUP>&#174;</SUP>"` likewise. The type is now
  the 18 constants plus any string (`UspsTrackingMailClassValue`), which is the v2.0.0
  `string` made autocomplete-friendly. Do not match on the text or parse its markup.
- v3 declares `authorizedAgent`, `emailEnabled`, `proofOfDeliveryEnabled`, `restoreEnabled`,
  `RRAMenabled` and `RREEnabled` as `string`, while `trackingProofOfDeliveryEnabled`,
  `redeliveryEnabled`, `carrierRelease` and `eSOFEligible` are `boolean`. The types follow
  the schema; the earlier types had them all `boolean`. **Corroborated** by the README v3
  detail example, where `emailEnabled`, `kahalaIndicator`, `proofOfDeliveryEnabled`,
  `restoreEnabled`, `RRAMEnabled`, `RREEnabled` and the event's `authorizedAgent` all
  arrive as the strings `"true"` and `"false"`. The example spells the field `RRAMEnabled`
  (capital E) where the spec says `RRAMenabled`; both are now typed.
- v3 `extendRetentionExtraServiceCodeOptions` items have no properties and are typed
  `Record<string, unknown>[]`.
- The v3 notification and proof-of-delivery requests carry deprecated fields beside their
  replacements. The proof-of-delivery `ZIPPlus4` has no type in the spec and is typed
  `string`.
- Capitalisation differs between schemas: proof-of-delivery requires `uniqueMailPieceID`,
  while the notification request and tracking detail use `uniqueMailPieceId`. Each is
  spelled as the spec spells it.
- v3r2 `State` is "no longer available as of June 2025".
- v3r2 207 is a 2xx, so a partially failed batch resolves rather than throws. Callers must
  inspect each entry's `statusCode`. `trackPackagesV3r2` returns the union of the 200 and
  207 bodies.
- USPS defaults `expand` to SUMMARY; `trackPackage` has always sent DETAIL and keeps doing so.
- The notification and proof-of-delivery operations are 202 acknowledgements; the spec gives
  no status or polling operation.

**What USPS's published examples show** (github.com/USPS/api-examples, checked
2026-11-12; not observed responses):

- **Summary.** The README summary example (`?expand=summary`, lower case) returns a legacy
  Web Tools envelope, `{ TrackResults: { RequestSeqNumber, TrackInfo: { "@ID",
TrackSummary } } }`, none of the spec's `eventSummaries` fields. `UspsTrackingSummary`
  now has an optional `TrackResults`. It may be an old example; which shape a live account
  gets is open. The plugin sends `expand` upper-case (`SUMMARY`, `DETAIL`), as Postman does.
- **Detail.** Beyond the settled fields above: `mailType` is `"DM"`, outside the four-value
  enum (the type now admits any string); `trackingEvents[]` carries `null` for
  `eventCountry`, `firm`, `name` and a key `additionalProp` that is in no schema (typed
  `string | null` and `unknown`); `services` is a single string where the spec says an
  array (typed `string | string[]`). `serviceTypeCode` is the string `"14"`, as typed.
- **"Tracking 3.2" is probably a documentation error.** The README block for v3r2 shows
  `GET https://apis.usps.com/tracking/v3r2/tracking/` (with an unterminated quote) carrying
  a JSON array in `--data`, no `{trackingNumber}` in the path, and answers with the **v3**
  flat detail shape (`emailEnabled: "true"`, `trackingEvents[]` with no grouping, `services`
  as an array). The spec says v3r2 is `POST /tracking` with that array body and a grouped
  response. A `GET` with a body, a v3 response to a v3r2 URL and the missing path segment
  all point at a copy of the v3 block with the URL edited, so it is recorded, not trusted;
  the v3r2 types and functions follow the spec and are unchanged. The Postman collection
  has no v3r2 request.
- **Postman** sends the notification body (`uniqueMailPieceId`, `mailPieceIntakeDate`,
  `notifyEventTypes: ["EMAIL_ALERT"]`, `firstName`, `lastName`, `notifications` of
  `{email}` and `{cellNumber}`) and the proof-of-delivery body (`uniqueMailPieceID`,
  `tableCode`, `requestType: "email"`, `email[]` and the address fields) exactly as the
  types have them, with `X-Forwarded-For` present but disabled, so optional. Neither
  response is shown.

### Audit of pre-existing types

`trackPackage(clientName, trackingNumber)` keeps a bare string after `clientName`, against
the repo's own rule, because it is published.

| Change                                                                                                                                                                                                                                                 | Class                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `UspsTrackingDetails.trackingNumber` required to optional                                                                                                                                                                                              | breaking                                                                   |
| `mailClass` `string` to 18-value union, then to the union plus any string (`UspsTrackingMailClassValue`)                                                                                                                                               | non-breaking against v2.0.0 (still accepts any string)                     |
| `emailEnabled`, `proofOfDeliveryEnabled`, `restoreEnabled`, `RRAMenabled`, `RREEnabled` `boolean` to `string`                                                                                                                                          | breaking                                                                   |
| `UspsTrackingEvent.authorizedAgent` `boolean` to `string`                                                                                                                                                                                              | breaking                                                                   |
| Added `ADPScripting`, `archiveRestoreInfo`, `associatedLabel`, `kahalaIndicator`, `approximateIntakeDate`, `uniqueTrackingId`, `predictedDeliveryTimeStamp`, `accessControl`, `extendRetentionPurchasedCode`, `extendRetentionExtraServiceCodeOptions` | non-breaking                                                               |
| `enabledNotificationRequests` now named types; `EMail` gains `firstDisplayable` and `otherActivity`; option keys are fixed instead of `Record<string, boolean>`                                                                                        | non-breaking                                                               |
| `trackPackage` gains optional options (`expand`, `destinationZIPCode`, `mailingDate`, `forwardedFor`)                                                                                                                                                  | non-breaking                                                               |
| `services` `string[]` to `string \| string[]`; `mailType` enum widened to any string; event `eventCountry`, `firm`, `name` may be `null`; `RRAMEnabled`, `additionalProp` and the summary's `TrackResults` added (all from the README examples)        | breaking for readers of `services` (v2.0.0 had `string[]`); the rest widen |

### Open questions (need a real account)

- Settled by USPS's published example (not observed): v3 `mailClass` is human-readable
  text with HTML markup, not the enum.
- Which summary shape a live account returns: the spec's `eventSummaries` or the README's
  legacy `TrackResults` envelope.
- Does v3r2 tracking have a test host?

## Pickups

Spec: Carrier Pickup v3.1.10, prefix `/pickup/v3`, test server listed. Vendor
documentation. Group `default`: Pickups is not in the published default product and USPS
publishes no quota for it either; the spec states none (see Tracking for the search).

### Functions

The first four rows were read from the source, not the spec.

| Function           | Method and URL                                          | Group     | Code     |
| ------------------ | ------------------------------------------------------- | --------- | -------- |
| `checkEligibility` | GET `/pickup/v3/carrier-pickup/eligibility`             | `default` | USP_0010 |
| `schedulePickup`   | POST `/pickup/v3/carrier-pickup`                        | `default` | USP_0006 |
| `getPickup`        | GET `/pickup/v3/carrier-pickup/{confirmationNumber}`    | `default` | USP_0011 |
| `cancelPickup`     | DELETE `/pickup/v3/carrier-pickup/{confirmationNumber}` | `default` | USP_0007 |
| `updatePickup`     | PUT `/pickup/v3/carrier-pickup/{confirmationNumber}`    | `default` | USP_0070 |

### Wire notes

- `PUT` requires `If-Match`, the ETag from GET ("good for one hour or until it is used in a
  DELETE or PUT"). The body is a `PickupConfirmation`, and the response carries a new
  `ETag` header, returned as `{ pickup, etag }`.
- `DELETE` lists `If-Match` as optional, but its description says all DELETE and PUT
  operations require it. `cancelPickup` keeps requiring an etag.
- GET documents an optional `If-None-Match` header and a `304` with an empty body. Modelled
  as `UspsPickupGetOptions.ifNoneMatch`.
- `eligibility` returns a `PickupAddress`. `PickupConfirmation.confirmationNumber` is
  `readOnly`, and all its fields are optional.

### Spec contradiction, settled by an example

The GET 200 schema is an array of `PickupConfirmation`, while its description and the PUT
body describe one. USPS's own README example (github.com/USPS/api-examples, checked
2026-11-12; not an observed response, and dated 2023) answers the GET with **one object**,
and v2.0.0 on `origin/master` typed `getPickup` as `pickup: UspsPickupDetails`, one object.
`getPickup` therefore returns `{ pickup: UspsPickupDetails; etag }` again. Because the spec
says array, a one-element array body is unwrapped to its element, and any other count
(including empty) throws `USP_0096` rather than being trimmed: a confirmation number names
one pickup. This is the published v2.0.0 shape, so it is not breaking against v2.0.0; it
reverses the array type introduced earlier in this release.

### What USPS's published examples show for pickups

Source: USPS's own published examples (github.com/USPS/api-examples, checked 2026-11-12;
README 2023 and a Postman collection). Not observed responses.

- **Create, get and update responses are flat**, not nested: `confirmationNumber`,
  `pickupAddress`, `packages`, `estimatedWeight`, `pickupLocation` and `pickupDate` sit
  side by side. The spec's `PickupConfirmation` nests the pickup under
  `carrierPickupRequest`, and the Postman PUT body does too (with `confirmationNumber` and
  `pickupDate` beside it). `UspsPickupConfirmation` now carries both: `carrierPickupRequest`
  and the flat fields. The README PUT body is flat, so `updatePickup` accepts either.
  Which the live API prefers is open; the two examples disagree.
- **Responses use strings for numbers**: `packageCount: "1"` and `estimatedWeight: "5"`,
  with all six package types echoed (`FIRST-CLASS_PACKAGE_SERVICE`, `PRIORITY_MAIL_EXPRESS`,
  `PRIORITY_MAIL`, `RETURNS`, `INTERNATIONAL`, `OTHER`) at count `"0"`. Requests send
  numbers. New response types (`UspsPickupResponsePackage`) admit both.
- **Eligibility is wrapped**: `{ pickupAddress: { firstName: null, lastName: null, firm:
null, address, contact } }` with `null` names and a contact list of `{ eMail: null }` and
  `{ phone: null, extension: null }`. The spec says the body is a `PickupAddress`.
  `UspsPickupEligibilityResponse` is now the address fields plus an optional
  `pickupAddress`, with nullable names. This is the one change that is breaking against
  v2.0.0 for readers (fields optional and nullable, where v2.0.0 had them required).
- **Contacts.** The README create request sends `{ phone }` (and gets `{ phone, extension }`
  back); Postman and the spec say `{ cellNumber }`. `UspsPickupContact` admits `{ phone,
extension? }` as a third form, additive.
- **Address.** The README create request also sends `postalCode`, `province`,
  `streetAddressAbbreviation: "Ave"` and `cityAbbreviation`; `secondaryAddress` and
  `urbanization` arrive as `null`. The update response spells `streetAdress` and `ZIPLus4`,
  almost certainly typos in the example; they are admitted as optional fields so the type
  does not claim the example is impossible, and nothing reads them.
- **Package types.** The README uses `FIRST-CLASS_PACKAGE_SERVICE`; Postman uses
  `USPS_GROUND_ADVANTAGE`; both are in `UspsPackageType`.
- **ETag and If-Match.** The README and Postman GET responses are shown without headers,
  so the `ETag` is not exemplified. PUT and DELETE send `If-Match: <etag>` in both, which
  is what `updatePickup` and `cancelPickup` send. The README says DELETE answers `200 OK`
  with no body. `If-None-Match` and the 304 are not exemplified.

### Audit of pre-existing types

`getPickup(clientName, confirmationNumber)` and `cancelPickup(clientName,
confirmationNumber, etag)` keep a bare string after `clientName`, against the repo's own
rule, because they are published.

| Change                                                                                                                                                                                                     | Class                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `getPickup` returns `pickup: UspsPickupDetails` (one object, as in v2.0.0 and the README example; an array body is unwrapped, `USP_0096` otherwise)                                                        | none against v2.0.0                                  |
| `UspsPickupConfirmation.confirmationNumber` and `pickupDate` required to optional                                                                                                                          | breaking                                             |
| `UspsPickupDetails` now an alias of `UspsPickupConfirmation`                                                                                                                                               | non-breaking                                         |
| `UspsPickupEligibilityResponse` now an alias of `UspsPickupAddress`; address `ZIPPlus4` may be `null`; read-only abbreviation fields added                                                                 | non-breaking except the `null`                       |
| Package items gain `averageLength`, `averageWidth`, `averageHeight`, `trackingNumbers`                                                                                                                     | non-breaking                                         |
| `getPickup` gains optional `ifNoneMatch`; confirmation and tracking numbers URL-encoded                                                                                                                    | non-breaking                                         |
| `UspsPickupConfirmation` gains the README's flat fields (`pickupAddress`, `packages`, `estimatedWeight`, `pickupLocation`); contacts gain `{ phone }`; response types admit string counts and `null` names | non-breaking (additive)                              |
| `UspsPickupEligibilityResponse` is the address fields (nullable) plus optional `pickupAddress`                                                                                                             | breaking for readers (v2.0.0 had the names required) |

### Open questions (need a real account)

- Settled by USPS's published example (not observed): `GET /carrier-pickup/{n}` returns one
  object. An array, as the spec says, is also handled.
- Does the API prefer the flat or the `carrierPickupRequest`-wrapped body on PUT, and does
  it return the same shape it was sent?
- Does a 304 from `If-None-Match` reach the caller as an error through core? Untested.

## Locations

Spec: Locations v3.5.7, prefix `/locations/v3`, test server listed. Vendor documentation.
Locations is one of the nine APIs in USPS's default product, so group `default` matches
the one published quota. The spec itself states no quota.

| Function                        | Method and URL                                         | Group     | Code     |
| ------------------------------- | ------------------------------------------------------ | --------- | -------- |
| `getDropoffLocations`           | GET `/locations/v3/dropoff-locations`                  | `default` | USP_0071 |
| `getPostOfficeLocations`        | GET `/locations/v3/post-office-locations`              | `default` | USP_0072 |
| `getParcelLockerLocations`      | GET `/locations/v3/parcel-locker-locations`            | `default` | USP_0073 |
| `listLocationFiles`             | GET `/locations/v3/files`                              | `default` | USP_0074 |
| `generateLocationFileSignedUrl` | GET `/locations/v3/files/{fileID}/generate-signed-url` | `default` | USP_0075 |

- `/post-office-locations` returns `{ locations[], warnings[], metadata }` (inline schema;
  `metadata.limit` and `metadata.offset` required). `/parcel-locker-locations`,
  `/dropoff-locations` and `/files` each return a bare array.
- The six array filters on post offices (`postOfficeType`, `mailingService`,
  `businessService`, `passportService`, `pickupService`, `financialService`) are
  `style: form, explode: false`. They are sent comma-joined. That reading of
  `explode: false` is an inference, not observed.
- Parameter names `LAT` and `LONG` are upper-case in the spec.
- Ranges: `radius` 1 to 100 (default 20); `limit` 1 to 100 (default 20 for post offices, 30
  for parcel lockers); parcel-locker `offset` 0 to 2000.
- `generate-signed-url` returns `{ signedURL, expiry, contentLength, rangeLimit }`. The spec
  does not say what the files contain.

**What USPS's published examples show** (github.com/USPS/api-examples, checked
2026-11-12: the README requests, Postman, and the two response files
`dropoff-location-v3-response.json` and `postoffice-locator-v3-response.json`; not
observed responses):

- **Requests.** The drop-off example is `?mailClass=PARCEL_SELECT&destinationZIPCode=30343`
  and the post office example `?radius=1&ZIPCode=10463`; the names match. **No example sends
  any array filter** (`postOfficeType`, `mailingService`, ...), `LAT`, `LONG`, or a
  paging parameter, so the comma-joined encoding stays an inference. The post office
  example sends no `Accept` header.
- **Drop-off response** (3 entries, a bare array as typed). Corroborated:
  `dropShipmentKey`, `facilityName`, `dropSitePhoneNumber`, `destinationZIPCode` (a
  3-digit string such as `"303"`), `destinationEntryFacilityType`, `acceptedPackageTypes[]`
  (`mailClass`, `processingCategory`, `palletized: "BOTH"`), `dropShipAcceptanceTimes[]`
  (`dayOfWeek`, `times[]` of `openTime` and `closeTime` as `HH:MM`),
  `dropShipmentFacilityDetails` (`dock`, `canopyClearance`, `liftTypes`, `ramps`,
  `truckManeuveringArea.surfaceType`, `levelers`, `doorDetails`, `overpassDetails`),
  `USPSConnectDetails` (`sameDayPickUp` and `nextDayPickUp` as `"0000"` strings, three
  empty cut-off arrays) and `timeZone`. Every enum value in the file is in the types.
  **Contradictions, types now admit both:** `facilityAddress` carries the street fields
  directly (`{ streetAddress, city, state, ZIPCode, ZIPPlus4 }`), where the types nested
  them as `{ address }`; and the flag is `dstObserved`, where the spec says `DSTObserved`.
- **Post office response** (3 entries inside `{ locations }`; no `metadata`, no
  `warnings`). The file is **not valid JSON** (a trailing comma before the closing brace;
  parsed here after removing it). Corroborated: `facilityName`, `facilityAddress` (flat),
  `geoCoordinates`, `postOfficeType: "POST_OFFICE"`, `distance`, `phoneNumbers`,
  `temporaryClosure`, `temporaryClosureDate`, `specialHours[]` of `date` and `open`,
  `parking: "STREET"`, `passports` (`photoCost`, `appointmentRequired`), `timeZone` and
  `DSTObserved` (capital D here, unlike the drop-off file). **Contradiction:** the id is
  `facilityId`, where the types had `facilityID`; both are typed now. `services[].service`
  is a plain string and the example uses values no request filter offers
  (`PO_BOX_DELIVERY_TIME`, `LAST_COLLECTION`, `RETAIL`, `LOBBY`, `CARRIER_CALL_REFERRAL`),
  and spells three with underscores where the filters use hyphens (`PASSPORT_WALK_IN`,
  `SELF_SERVICE_KIOSK`, `LABEL_BROKER_SELF_SERVICE_KIOSK`): a caller cannot feed a response
  value back into a filter. Hours here are `HH:MM:SS`, and some `times[]` have only a
  `closeTime`.
- **Not exemplified:** parcel-locker and files responses (Postman has the parcel-locker
  request without parameters), pagination `metadata`, `warnings`, and any 429.
- Breaking against v2.0.0: no; Locations is new in this release and the changes are
  additive.

Open questions (need a real account): are comma-joined array filters accepted as
`explode: false` implies (the examples do not test it); what do the `/files` entries point
at, and how long is the signed URL valid? Does the real post office response carry
`metadata`, as the spec says, or only `locations`, as the example file does?

## Shipping operations

Specs, vendor documentation: Containers v3.1.13, Open and Distribute (OD) v3.0.14, SCAN
Forms v3.1.15, Logistic Shipments v3.0.1, Ship Enrollment v3.0.2, QR Code v3.0.1,
Adjustments v3.0.8, Reconciliation Adjustments v3.0.6, NCOA Data Services v3.1.9. Nobody
has called these APIs. No webhook operations and no `deprecated: true` operations in these
nine specs. Deprecated fields are kept and tagged `@deprecated`: SCAN Forms `form`,
`imageType` and `labelType`; Open and Distribute `commitment.scheduleDeliveryDate`; both
adjustment specs `rootCause`, `totalPostage` and `basePostage`.

### Functions, groups and hosts

| Function                           | Method and URL                                                                                                                 | Group     | Code     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- | -------- |
| `addUspsContainerPackages`         | POST `/containers/v3/containers/{id}/packages`                                                                                 | `labels`  | USP_0080 |
| `removeAllUspsContainerPackages`   | DELETE `/containers/v3/containers/{id}/packages`                                                                               | `labels`  | USP_0081 |
| `removeUspsContainerPackage`       | DELETE `/containers/v3/containers/{id}/packages/{trackingNumber}`                                                              | `labels`  | USP_0082 |
| `createUspsContainerLabel`         | POST `/containers/v3/containers`                                                                                               | `labels`  | USP_0083 |
| `closeUspsContainerManifest`       | POST `/containers/v3/containers/manifest`                                                                                      | `labels`  | USP_0084 |
| `createOpenAndDistributeContainer` | POST `/pmod/v3/pmod/create`                                                                                                    | `labels`  | USP_0085 |
| `closeOpenAndDistributeContainer`  | POST `/pmod/v3/pmod/manifest/{id}`                                                                                             | `labels`  | USP_0086 |
| `createScanForm`                   | POST `/scan-forms/v3/scan-form`                                                                                                | `labels`  | USP_0087 |
| `createShipmentTrackingEvent`      | POST `/logistics/v3/shipment-tracking`                                                                                         | `default` | USP_0088 |
| `getShipEnrollmentStatus`          | POST `/ship-enrollment/v3/enrollment`                                                                                          | `default` | USP_0089 |
| `searchUspsQrCode`                 | POST `/qr-code/v3/search`                                                                                                      | `default` | USP_0090 |
| `getUspsAdjustments`               | GET `/adjustments/v3/adjustments/{CRID}/{trackingNumber}/{eventType}`                                                          | `default` | USP_0091 |
| `getUspsReconciliationAdjustments` | GET `/reconciliation-adjustments/v3/reconciliation-adjustments/{CRID}/{eventType}/{startDate}/{startTime}/{endDate}/{endTime}` | `default` | USP_0092 |
| `searchUspsChangeOfAddress`        | POST `/ncoa-data-services/v3/search`                                                                                           | `default` | USP_0093 |

All nine specs list a test server except QR Code (production only); the NCOA entry is
labelled "TEM Environment Endpoint".

- **Quotas.** No spec states a quota or rate limit; the only "429" matches are error
  responses. This is a negative result.
- **Group assignment** is the repo's decision, not a USPS figure: label-producing endpoints
  to `labels`, the rest to the conservative 60/hour `default` bucket, following the Pickups
  precedent.
- **QR Code and NCOA** are plausibly separately approved products. The QR Code spec says
  access is restricted to tracking numbers under MIDs the caller owns. Their real quota may
  differ from the `default` bucket.
- **QR Code test environment:** `/qr-code/v3/search` may not exist on `apis-tem.usps.com`.
  Unverified.

### Containers

Five operations, in group `labels`; none declares the payment-authorization header (see
the table in the interceptor section above).

- **Create (`POST /containers`).** The 201 is documented only as `multipart/form-data`,
  with schema `Container`. That schema has no image property: `containerID` and `warnings`
  are read-only, `imageInfo` is write-only. The spec never says where the label image sits,
  and there is no vendor `+json` alternative. **USPS's published example settles the
  layout** (github.com/USPS/api-examples README, checked 2026-11-12; not an observed
  response): the body is multipart with a JSON part `Content-Disposition: form-data;
name="containerMetadata"` and a part `name="labelImage"; filename="labelImage.pdf"`,
  `Content-Type: application/pdf`. No example, spec text or Postman header offers a JSON
  alternative (the Postman request sends no `Accept`; the `vnd.usps.labels+json` type is
  listed for no Containers operation), so multipart is the only form.
- Add-packages (200) returns JSON or XML `Container`. Remove-all, remove-one and manifest
  return 204 with no body (`void`).
- `mailingDate` is a `oneOf` of `date` and `date-time`, typed `string`. `NON_MACHINABLE` is
  still listed in `processingCategory` although its description says it converts to
  `NONSTANDARD`.
- **How the multipart body is read.** Core's `RequestConfig` extends axios's, so
  `responseType: "arraybuffer"` is passed through (`plugin-labelary` and `plugin-ups` use it)
  and axios hands back a `Buffer`; text would corrupt a binary image. Core logs a `Buffer`
  body as `[Buffer n bytes]`. A failure status therefore carries a `Buffer`, not a parsed
  object, in the error's `originalError`. `createUspsContainerLabel` requests bytes and
  returns `{ metadata, labelImage? }`, where `labelImage` is `{ bytes: Buffer, contentType,
filename? }`, through `parseContainerLabelResponse` (`src/requests/containers/utils.ts`,
  on the generic splitter in `src/requests/multipart.ts`; no new dependency). It takes the
  boundary from the `Content-Type` header, or from the first body line when the header is
  missing; counts a delimiter only at a line start; accepts CRLF or LF; and ignores parts it
  does not know. A body with no boundary that parses as JSON is returned as metadata alone;
  anything unreadable throws `USP_0094`. **A part is base64-decoded when it says
  `Content-Transfer-Encoding: base64` or when its whole body is base64 characters.** The README
  shows the PDF as base64 text with no such header, which a raw PDF never looks like (it
  starts `%PDF`), and has one stray space inside the string, which the decoder tolerates;
  whether live responses carry raw bytes or base64 is unverified, so the parser handles both.
  Verified against the README's own multipart block (it decodes to a 5,964-byte `%PDF-1.4`
  file) and in tests against a binary part containing every byte value, CRLF and a
  boundary prefix. The return type changed from the metadata object to `{ metadata,
labelImage? }`; not breaking against v2.0.0, which had no Containers.
- **Other Containers examples** (USPS's published examples, checked 2026-11-12).
  The add-packages request (`{ trackingNumbers: [...] }`) and response match
  `UspsContainerResponse`; the response has `secondaryAddress: null` (now `string | null`),
  `warnings: []`, `containerTopology: "NESTED"` and an uppercase `MID`. The create request
  matches `UspsContainerCreateRequest` (`imageInfo` with `imageType` and `labelType`,
  `sortType`, `destinationEntryFacilityType`, `mailClass`, `originAddress` with
  `secondaryAddress: ""`). Postman's close-container body is `{ mailingDate, containers }`;
  the removals carry no body. No example shows a 204.

### Open and Distribute

Group `labels`; the spec requires the payment token on both operations (a shared parameter
component, `required: true`), and both functions set `metadata.uspsAccountNumber` from a
named `accountNumber` field.

- Create (201) and close (200) list multipart, json, xml, `application/vnd.usps.pmod+json`
  and `+xml`, all pointing at one schema. Its title says "for multipart/form-data", and it
  carries Base64 `labelImage`, `imcbImage` and `receiptImage`. Both functions send
  `Accept: application/vnd.usps.pmod+json`. **This is an inference** by analogy with
  `createLabel` and `vnd.usps.labels+json`; the spec only lists the type and does not
  describe it.
- `scanFormImageType` is a plain string; its allowed values (PDF, TIFF, JPG, PNG, GIF, SVG,
  NONE) appear in prose only, so it is typed `string`.
- Open: whether the `vnd.usps.pmod+json` `Accept` returns the documented single JSON body.
  USPS's published examples (github.com/USPS/api-examples, checked 2026-11-12) have the
  create and close **requests** in Postman only, with no `Accept` header and no payment
  token, and no response. Every request key is in the types (`imcbLabelType`,
  `imcbContainerType`, `impbContainerType`, `containerMailClass`, `enclosedMailClass`,
  `senderAddress`, `returnAddress`, `generateScanForm`, `scanFormImageType`). Nothing there
  confirms or contradicts the inference above.

### SCAN Forms

Group `labels`. The payment-token header is not declared; only an optional
`X-Idempotency-Key` is. The prose says a MID or manifestMID shipment is matched against the
`LABEL_OWNER` role "provided in the Payment Authorization Token", which suggests a token is
involved server side. That is an inference, not verified. If SCAN Forms rejects the call
without the header, add `metadata` and an `accountNumber` option to `UspsScanFormOptions`.

- The 200 lists multipart (`SCANForm`: `SCANFormMetaData` plus `SCANFormImage`), json, xml,
  and `vnd.usps.labels+json` or `+xml` (`SCANFormVendorResponse`, metadata flattened with
  `SCANFormImage` beside it). The spec says `Accept` "will determine the media type format
  of only the metadata part of the multipart response, unless `application/vnd.usps.labels+json`
  or `+xml` is used". `createScanForm` sends `application/vnd.usps.labels+json` and returns
  the flattened shape.
- `X-Idempotency-Key` is an optional UUID, retained 30 days; a repeated key for the same
  customer returns the existing form. `createScanForm` sends it only when the caller passes
  `options.idempotencyKey`. Unlike `createLabel`, it does not default to a random UUID,
  because a key the caller never sees cannot be reused on a retry.
- Open: does `createScanForm` need the payment token despite the undeclared header?
- **What USPS's published examples show** (github.com/USPS/api-examples, checked
  2026-11-12; the three `SCANForm-*-request.json` and `-response.json` files plus Postman;
  not observed responses). The three requests (label, MID and manifestMID shipment)
  differ only in the address and in `shipment`: `{ trackingNumbers: [...] }`,
  `{ MID }` or `{ manifestMID }`, as `UspsScanFormShipment` has them, and carry no payment
  token and no `Accept`. Corroborated: `form`, `imageType`, `labelType`
  (`"8.5x11LABEL"`), `mailingDate`, `entryFacilityZIPCode`, `destinationEntryFacilityType`,
  `overwriteMailingDate`. **Contradictions, types now admit both:** the requests send
  `entryFacilityZIPPlus4: ""` (not in the schema; now optional), and `fromAddress` is
  **nested**, `{ firstName, lastName, firm, address: { streetAddress, ..., country,
countryISOCode: 840 } }`, where the spec's `SCANFormAddress` is flat
  (`UspsScanFormNestedAddress` added; `fromAddress` is the union). The responses are
  `multipart/form-data`, the metadata part named `Scan Form Response` and the image part
  `label` (`label.pdf`, `application/pdf`, shown as base64 text), where the spec's multipart
  schema names `SCANFormMetaData` and `SCANFormImage`; they carry `manifestNumber` and
  `trackingNumbers` (corroborating the flat `UspsScanFormResponse`, whose fields are the
  metadata part's) and the response address has lower-case `zipCode` and `zipPlus4`,
  `countryISOCode` as a string and `streetAddress` and `secondaryAddress` swapped
  (`UspsScanFormResponseNestedAddress`). The examples show **only the multipart form**; the
  `vnd.usps.labels+json` shape `createScanForm` requests is not exemplified, so the `Accept`
  choice stays the spec's word. They are dated 2023 and their multipart part names differ
  from the current spec's, so they may predate it. Unchanged: no multipart parser for SCAN,
  because the vendor type is requested; add one like Containers' if a live account answers
  multipart anyway.

### Logistic Shipments, Ship Enrollment, QR Code

- **Logistic Shipments.** The 201 echoes the `ShipmentTracking` schema. The example
  date-times look like `2025-10-17 13:30:00 UTC`, which is not RFC 3339 despite
  `format: date-time`. Which form the server accepts is unverified.
- **Ship Enrollment.** USPS's published examples (checked 2026-11-12) send
  `{ "MIDs": ["123456789"] }` (Postman, no response), matching the tuple. `MIDs` is
  `minItems: 1, maxItems: 1`, so it is typed as the tuple
  `[string]`. `program` still lists the obsolete `OUTBOUND`, `RETURNS` and `NONE`; kept,
  with a comment. A MID that is not found returns 404, per the schema description.
- **QR Code.** The 200 is one status with two shapes (`QRCodeResponse` or
  `NoQRCodeResponse`); the function returns a union, discriminated by the presence of
  `QRCode`. `QRCodeResponse.required` lists `pickup`, which is not a property; the property
  is `pickupCode`, and it is not in `required`. The types follow the properties: `pickupCode`
  optional, `QRCode` required, `pickup` omitted.

### Adjustments and Reconciliation Adjustments

- **Reconciliation 200:** `items` is an array of `ReconciliationAdjustments`, which is itself
  an array of details, so the body reads as an array of arrays. It is typed as written.
  Probably an authoring slip for a flat list (inference). The single-package Adjustments 200
  is a flat array.
- **Reconciliation `pageNum`** has `default: 20` on a parameter bounded 1 to 100, apparently
  copied from `pageSize`. Not modelled; unset paging is omitted.
- **The two specs disagree on field names:** Adjustments has `originZipCode`, Reconciliation
  has `originZIPCode`. The Adjustments fee `name` enum also admits display strings
  ("Nonstandard Dimension: Length > 22" and three others) alongside the constants;
  Reconciliation has only the constants. Both are kept as documented and the types are not
  shared.
- Adjustments declares unused components (`subscriptionId`, `offset`, `limit`, `If-Match`),
  a copy of the Subscriptions spec; no operation uses them.
- Reconciliation `startDate` and `endDate` are `YYYYMMDD`, and `startTime` and `endTime` are
  `HHMMSS`, plain strings in the schema.
- Open: is Reconciliation `items` nested or flat?
- **USPS's published examples** (github.com/USPS/api-examples, checked 2026-11-12): Postman
  has the single-package Adjustments `GET /adjustments/v3/adjustments/:CRID/:trackingNumber/:eventType`
  as a request only, matching `getUspsAdjustments`. **Reconciliation Adjustments, Logistic
  Shipments, QR Code and NCOA Data Services are not in the examples at all**, so nothing
  above is corroborated or contradicted by them.

### NCOA Data Services

200 is `RecordsResponse` (Search) and 201 is `MailerResponse` (MailerInsert). The status is
not exposed through `res.data`, so the return type is a union. `requestType` is required and
nullable, with pattern `^(MailerInsert|Search)$`, typed `"MailerInsert" | "Search" | null`.
The per-field requirements of `mailerList` for `MailerInsert` exist only in prose, so every
field is optional in the type, with the prose as a comment.

## Subscriptions

Source: the eight USPS developer portal "Subscriptions" OpenAPI specs. Vendor
documentation, not an observed response; nobody has a USPS account here.

| Spec                                               | Prefix                                          | Test server `apis-tem.usps.com` | Codes                |
| -------------------------------------------------- | ----------------------------------------------- | ------------------------------- | -------------------- |
| Subscriptions - Addresses v3.0.1                   | `/subscriptions-address/v3` (singular)          | listed                          | USP_0101, 0102, 0104 |
| Subscriptions - Adjustments v3.1.13                | `/subscriptions-adjustments/v3`                 | listed                          | USP_0105 to 0109     |
| Subscriptions - Disputes v3.1.0                    | `/subscriptions-disputes/v3`                    | listed                          | USP_0110 to 0114     |
| Subscriptions - NCOA+ v3.2.6                       | `/subscriptions-ncoa/v3`                        | listed                          | USP_0116, 0117, 0119 |
| Subscriptions - Package Transaction Details v3.1.7 | `/subscriptions-package-transaction-details/v3` | listed                          | USP_0120 to 0124     |
| Subscriptions - Tracking v3.1.17                   | `/subscriptions-tracking/v3`                    | **not listed**                  | USP_0125 to 0129     |
| Subscriptions - Tracking v3.2.11 (v3r2)            | `/subscriptions-tracking/v3r2`                  | **not listed**                  | USP_0130 to 0134     |
| Subscriptions - Unpaid Packages v3.0.7             | `/subscriptions-unpaid-packages/v3`             | listed                          | USP_0135 to 0139     |

USPS's published examples contain **no Subscriptions request or response** (the Postman
collection has only a `POST /disputes/v3/dispute`, a different API), so nothing in this
section was checked against them.

Within a product the codes run list, create, get, update, delete; Addresses and NCOA have
only create, get and delete. Functions are named `<verb>Usps<Product>Subscription(s)`, for
example `createUspsTrackingSubscription`; the v3r2 products use `TrackingV3r2`. All 36 are
in group `default`.

| Verb   | Method and URL                                                   |
| ------ | ---------------------------------------------------------------- |
| list   | `GET <prefix>/subscriptions`                                     |
| create | `POST <prefix>/subscriptions`                                    |
| get    | `GET <prefix>/subscriptions/{subscriptionId}`                    |
| update | `PUT <prefix>/subscriptions/{subscriptionId}` with `If-Match`    |
| delete | `DELETE <prefix>/subscriptions/{subscriptionId}` with `If-Match` |

### Group and rate limits

All 36 functions are in `default`, the repo's decision, not a USPS figure. None of the eight
specs states a rate limit, quota or throttle (searched for "rate limit", "quota",
"throttl" and "requests per"); they only document a 429 with `Retry-After`. No operation
takes `X-Payment-Authorization-Token`.

### Create, get and update return the ETag as well as the body

`If-Match` is required on PUT and DELETE and carries the ETag from a get, create or update,
which the specs say is good for one hour or until used. The ETag is therefore the only way to
update or delete, so create, get and update return `{ subscription, etag }` rather than the
bare body, and create adds `location`. A missing header gives `""`, the same precedent as
`getPickup`. Only the two tracking specs document an `ETag` response header on update; the
others list only `Content-Type`.

Array list filters (`CRID`, `MID`, `trackingNumber`) are sent comma-joined, because the specs
declare `style: form, explode: false`. That reading is an inference, not observed.

### The webhook is typed, not called

Every spec has `POST /notifications`, which USPS calls on the subscriber's `listenerURL`.
There is no function for it; the envelope and payload types are exported so a caller can type
their handler. Verification, per the spec text:

- Security is IP allow-listing plus an HMAC, both optional.
- If a `secret` was supplied (exactly 32 characters), the notification carries `X-HMAC`.
- `X-HMAC` is Base64 of HMAC-SHA256, keyed with the secret, over the `timestamp` field
  concatenated with the `payload` field. `payload` is the raw string, before `JSON.parse`.
- A second header, `hmac-header`, appears in six specs (addresses, NCOA, disputes, tracking
  v3, tracking v3r2, unpaid packages) and is marked deprecated. Adjustments and package
  transaction details declare only `X-HMAC`.
- The success response is HTTP 200.

### Tracking v3 versus v3r2

- The base path differs. Operations and the `subscriptions-tracking` scope are the same.
- The v3 description says Tracking 3.0 Legacy and Subscriptions - Tracking 3.0 Legacy are
  retired on 2027-07-31, and to migrate to v3r2.
- Event types: v3 has `ALL`, `PACKAGE_DELIVERED`, `AVAILABLE_FOR_PICKUP`,
  `DELIVERY_EXCEPTION_UPDATES`, `PACKAGE_IN_TRANSIT_UPDATES`, `PACKAGE_DELAYED` and
  `DEFAULT`. v3r2 has `ALL_UPDATES` (default), `DELIVERY_ACTIVITY`, `PACKAGE_DELAYED`, and
  `SCAN_EVENT_EXTRACT` for MID filters only.
- v3r2 adds `includeVeriPoint` on both filters, meant only for VeriPoint-eligible users.
- v3r2 has typed camelCase payload schemas, including a Scan Event Extract variant. v3 has only
  a legacy `TrackInfo` example and no payload schema, so its `payload` is typed `string`.
- v3r2's `/notifications` body is an `anyOf` of two structurally identical envelopes.

### Shared types

The `Subscription`, `EmailNotification`, `Links` and `PaginationMetadata` schemas differ only
in description wording and max-lengths across the eight specs, so they are one shared type.
Filters, subscription types and payloads stay per product.

### Spec contradictions and quirks

- **Addresses id and filter casing.** The schema spells the id `SubscriptionId`, while the
  notification, path parameter and examples use `subscriptionId`. The filter is `address` in
  the schema and `Address` in the example. The types accept both spellings; which one USPS
  sends is unknown.
- **Addresses scope.** Per-operation security says `subscriptions-address`, the global block
  says `subscriptions-addresses`, and NCOA uses `subscriptions-ncoa`.
- **Addresses `ConfirmSubscription`** (`subscriptionEligible` Y/N, `subscriptionNotEligibleCode`
  1 to 5) is declared but referenced by no operation. It is exported as
  `UspsSubscriptionAddressConfirmation` and not used as a return type.
- **Disputes and unpaid packages notification `payload`** is a `oneOf` of objects, while the
  other specs and the prose say a JSON string. It is typed `Details | string`.
- **Disputes `LettersAndFlatsDetails`** has no `requestType`, unlike the other three dispute
  variants.
- **Unpaid packages list.** The JSON schema is a bare array and the XML schema is
  `{ subscriptions, metadata }`. Typed as the union. `FileStatus` is orphaned.
- **Package transaction details.** The example nests a whole notification inside the
  `payload` string. `PackageTransactionDetails`, `NonLabelFeeDetails` and `ReturnLabelDetails`
  are referenced by nothing and are exported as a payload union (inference).
- **Adjustments.** `rootCause`, `totalPostage` and `basePostage` are deprecated and kept with
  `@deprecated`. The `fees[].name` enum mixes display strings and constants.
- **Tracking v3 `PaginationMetadata`** has a malformed `required` entry
  (`"offset - limit - offset"`). `limit` and `offset` are treated as required, as in the
  other specs.
- **Tracking v3r2.** `GMTOffset` is a string with a numeric example. The Scan Event Extract
  payload schema has `trackingEvent` (singular), while the example sends `trackingEvents`
  (array). The type has both.

### Lifecycle rules (spec prose)

- Tracking, adjustments, disputes, package transaction details and unpaid packages: USPS may
  delete a subscription after 30 days without traffic; the warning email goes out at 25 days.
- Addresses and NCOA: kept while the retention date (`subscriptionTTL`) is in the future; the
  warning email goes out 7 days before.
- Maximum 10 unique listener URLs per Home CRID.
- Filters cannot be edited; a different filter needs a new subscription.
- USPS sets `SUSPENDED` when the listener is unreachable. The customer may set `DISABLED`.
- `adminNotification` is required, with 1 to 3 emails.

### Open questions (need a real account)

1. Which OAuth scope string Addresses accepts.
2. Whether the tracking subscription APIs exist on `apis-tem.usps.com`.
3. Whether Disputes and Unpaid Packages really send an object `payload`, and which casing
   Addresses sends.
4. Whether the update response carries an `ETag` outside the tracking APIs.
5. The real 429 behaviour and any quota, since none is stated.

## Informed Delivery campaigns

Specs: "Informed Delivery Mail Campaigns" v1.2.0 and "Informed Delivery Package Campaigns"
v1.0.1. Vendor documentation; nothing was called against USPS.

| Spec              | `servers` URL                                               | Test server |
| ----------------- | ----------------------------------------------------------- | ----------- |
| Mail Campaigns    | `https://apis.usps.com/informed-delivery-campaigns`         | none listed |
| Package Campaigns | `https://apis.usps.com/informed-delivery-package-campaigns` | none listed |

Mail campaigns carry no version segment, unlike most USPS APIs; request URLs are
`/informed-delivery-campaigns/campaigns/{CRID}...`. USPS's published examples
(github.com/USPS/api-examples Postman, checked 2026-11-12) use these paths, with no version
segment, for all nine mail and six package campaign requests: corroboration of the URLs,
not of any response. Their bodies are `"string"` placeholders, so they cannot settle the
`IMBs` and `trackingNumbers` delimiter question below (both are single strings
`"string"`), and the mail-campaign edit body ends with a stray `"IMBs":` after its closing
brace, so it is not valid JSON as written. Every request key is in the types. Whether the test environment serves
these APIs is an open question needing a real account.

### Authentication and group

- OAuth2 client credentials, scope `campaigns`. The plugin sends no `scope`, so the token
  carries the app's registered default; whether that covers `campaigns` is unverified.
- The spec says a CRID must be onboarded with the Informed Delivery Program Office and have
  an Apigee app with the Informed Delivery product.
- No operation has an `X-Payment-Authorization-Token` header or any header parameter, so none
  uses `uspsAccountNumber` metadata.
- Group `default` (60/hour, paced one a minute), the repo's decision following the Pickups
  precedent, not a USPS figure. The specs state no quota, rate limit or throttling text
  (searched for rate, limit, quota, throttl; the only hits are the `limit` paging parameter
  and unrelated field names). They document 429 on some operations (mail campaigns create,
  get and cancel) with no figure. A campaign flow of create, add IMBs, poll callback summary
  spends one budget slot per call at one a minute.

### Functions

Path segments are named fields and are URL-encoded. Signatures are `(clientName, { CRID,
campaignID | callbackKey }, body?, params?)`. Every documented query parameter on the search
operations (and callback detail) is modelled and passed as `params`.

| Function                            | Method and URL                                               | Code     |
| ----------------------------------- | ------------------------------------------------------------ | -------- |
| `createMailCampaign`                | POST `/informed-delivery-campaigns/campaigns/{CRID}`         | USP_0140 |
| `searchMailCampaigns`               | GET same                                                     | USP_0141 |
| `getMailCampaign`                   | GET `.../{campaignID}`                                       | USP_0142 |
| `cancelMailCampaign`                | DELETE `.../{campaignID}`                                    | USP_0143 |
| `editMailCampaign`                  | PUT `.../{campaignID}`                                       | USP_0144 |
| `addMailCampaignImbs`               | POST `.../{campaignID}/pieces`                               | USP_0145 |
| `searchMailCampaignCallbackKeys`    | GET `.../callback`                                           | USP_0146 |
| `getMailCampaignCallbackSummary`    | GET `.../{callbackKey}/summary`                              | USP_0147 |
| `getMailCampaignCallbackDetail`     | GET `.../{callbackKey}/detail`                               | USP_0148 |
| `createPackageCampaign`             | POST `/informed-delivery-package-campaigns/campaigns/{CRID}` | USP_0149 |
| `searchPackageCampaigns`            | GET same                                                     | USP_0150 |
| `getPackageCampaign`                | GET `.../{campaignID}`                                       | USP_0151 |
| `editPackageCampaign`               | PUT `.../{campaignID}`                                       | USP_0152 |
| `cancelPackageCampaign`             | DELETE `.../{campaignID}`                                    | USP_0153 |
| `addPackageCampaignTrackingNumbers` | POST `.../{campaignID}/pieces`                               | USP_0154 |

### Wire notes

- Everything is JSON. Campaign images (`rideAlong`, `replacementImage`) are base64 strings
  inside the JSON body (`format: byte` on `rideAlong`; the mail spec says "provided in base64
  format"). No multipart anywhere.
- `POST .../pieces` takes `IMBs` (mail) and `trackingNumbers` (package) as a single `string`
  with no stated delimiter (the schema says "List of IMBs"). Responses use arrays. Whether
  the delimiter is comma, space or newline is open; typed `string`.
- IMB add responses: 201 (25 or fewer, per-IMB `pieceID`), 202 (more than 25: only a
  `callbackKey` and `status`; follow with the callback-key endpoints) and 207 partial success.
  The function returns the union `UspsMailCampaignImbsResponse`. The 400 body can be the
  IMB-level `IMBsErrorMessage` instead of the generic error; those throw via core's error path.
- Callback keys expire 60 days after submission; summary and detail return an error while
  `processingStatus` is SUBMITTED or PROCESSING (spec text).
- Create returns `201` with a `Location` header pointing at the campaign detail URL (the spec
  example `/campaign/v3` looks wrong; inference). Request functions return only `res.data`, so
  the header is not surfaced; the body is the campaign, with `campaignID`.
- `DELETE /campaigns/{CRID}/{campaignID}` (mail) returns 200 with no content type declared,
  typed `void`. The package cancel returns `{ status }`.
- Mail path ambiguity: `GET /campaigns/{CRID}/callback` (search callback keys) and
  `GET /campaigns/{CRID}/{campaignID}` (get campaign) share a shape, so a campaign whose ID
  is literally `callback` would collide. USPS generates campaign IDs, so this is theoretical.
  The `{callbackKey}/summary|detail` and `{campaignID}/pieces` paths differ in method, so
  they do not collide.

### Spec contradictions and oddities

- Mail `Campaign.campaignType` is described as codes A01 NON-SEQ, A02 MID, A03 SEQ, A04 SAT;
  `CampaignEdit.campaignType` is described as LETTER, CARD, FLAT, PACKAGE (the shape list).
  Neither is an `enum` in the schema, so both are typed `string`, with the create-side codes
  noted. The edit description looks like a copy-paste error (inference).
- The Mail spec's intro lists only A01, A02 and A03 while the field text lists A04 (SAT).
- `mailpieceShape` is LT, CD or FL in text, not an enum; typed `string`.
- Mail `Campaign.status` is free text in the schema, an enum (SUBMITTED, ACTIVE, COMPLETE,
  CANCELLED, DELETED, DRAFT, INACTIVE) only as the search filter. The package search enum
  omits DRAFT.
- The Mail spec's shared examples include an invalid-parameter error naming
  `campaignGroupingCode`, a package-only field (an example copied across the two specs;
  inference).
- Search query `createdDatetime`, `lastModifiedDatetime` and `submittedDatetime` are
  `format: date`, and the spec says they only work in conjunction with other parameters.
- Several GET and cancel operations declare only 400 (and some only 200), omitting 401, 403
  and 429.

## Appointments

Spec: "Appointments - All Mail Classes" v3.0.3 (FAST appointments). Vendor documentation;
nothing was called against USPS. The `servers` URL is `https://apis.usps.com/fast-appointments/v3`
with **no test environment listed**; whether the test environment serves it needs a real
account.

| Function                          | Method and URL                                             | Group     | Code     |
| --------------------------------- | ---------------------------------------------------------- | --------- | -------- |
| `createUspsAppointment`           | POST `/fast-appointments/v3/fast-appointments/appointment` | `default` | USP_0155 |
| `updateUspsAppointment`           | PUT same                                                   | `default` | USP_0156 |
| `cancelUspsAppointment`           | DELETE same (JSON body)                                    | `default` | USP_0157 |
| `findUspsAppointmentAvailability` | POST `/fast-appointments/v3/appointment-availability`      | `default` | USP_0158 |

USP_0159 is unused.

- **URL repeats the segment.** The server prefix `/fast-appointments/v3` is followed by
  operation paths `/fast-appointments/appointment`, so the full URL repeats the segment. Only
  the availability operation is `/fast-appointments/v3/appointment-availability`. The plugin
  sends the URL exactly as the spec composes it. Inference: it may be a spec bug; only a real
  call settles it. **Corroborated as USPS's own published example, not observed:** the
  Postman collection (github.com/USPS/api-examples, checked 2026-11-12) uses exactly these
  four URLs, `/fast-appointments/v3/fast-appointments/appointment` for create, update and
  cancel and `/fast-appointments/v3/appointment-availability`, so a repeated segment is
  what USPS's own collection sends.
- **Auth.** The spec declares scheme `OAuth` (scope `fast-appointments`, token URL
  `/oauth2/v3/token`) but has no top-level `security` block and no per-operation security, so
  the scope is stated but attached to no operation. The plugin sends no `scope`; whether the
  app's default token covers `fast-appointments` is unverified.
- No header parameters, so no `uspsAccountNumber` metadata. Group `default` is the repo's
  decision, not a USPS figure; the spec states no quota (searched for rate, limit, quota,
  throttl; only the `limit` paging parameter and unrelated field names match). It documents
  429 on some operations with no figure.
- Appointments accept and return `application/json` and `application/xml`; the plugin uses
  JSON.
- `DELETE /fast-appointments/appointment` has a request BODY (`CancellationRequest`) and no
  query parameters. It is sent as `data` on a DELETE. Some proxies drop DELETE bodies; whether
  USPS accepts it as documented is untested. The Postman cancel request carries the same
  body (`consigneeAppointmentID`, `shipperAppointmentRequestID`, `CRID`, `systemID`,
  `destinationEntry`, `cancelReasonCode`, `cancelComments`), so USPS's own collection also
  sends a DELETE with a body; that is still not a response.
- `SlotAvailability.mailClass` enum omits `USPS_GROUND_ADVANTAGE`, which the appointment
  `mailClass` enum includes.
- **USPS's published examples** (Postman only, no responses; checked 2026-11-12). Every
  request key is in the types. One discrepancy: the create and update bodies put
  `postInductionStatus`, `containerDestination3digitZIP` and
  `containerDestination5digitZIP` inside `bedload.uspsContainerInfo`, where the schema lists
  them only under the pallet container info. They are now optional on
  `bedload.uspsContainerInfo` (additive). The example's `mailClass` is `PARCEL_SELECT` and
  the availability example's is `USPS_MARKETING_MAIL`, both typed. The collection sends no
  headers beyond bearer auth.
