# Smarty API behaviour

Findings behind `@dianemo/plugin-smarty`, which covers seven Smarty APIs: street
verification, ZIP Code lookup, autocomplete, extraction and reverse geocoding.

## Each surface is its own subscription

One secret-key pair reaches every API, but they are bought, allocated and
metered separately. Smarty sells each product as its own subscription with its
own lookup allocation and its own rate limit, and the rate is an attribute of
that product's plan tier rather than of the account.

**Vendor documentation**: Smarty's pricing pages, first checked 2026-08-25 and
again 2026-11-12. The wording is the page's own; the main page said "Up to" in
August and "Starting at" in November for the 25,000 figure.

| Surface                                                                             | Professional tier                             |
| ----------------------------------------------------------------------------------- | --------------------------------------------- |
| US address validation — <https://www.smarty.com/pricing>                            | "Starting at 25,000 address lookups / second" |
| International — <https://www.smarty.com/pricing/international-address-verification> | "Up to 3,500 address lookups / second"        |
| US reverse geocoding — <https://www.smarty.com/pricing/us-reverse-geocoding>        | "Up to 3,500 address lookups / second"        |

No pricing page says whether a limit is scoped to a subscription, a key or an
account.

The US Street API reference says the same thing from the other side: it
describes a 429 as exceeding "your plan's rate limit" and states no number at
all — <https://www.smarty.com/docs/cloud/us-street-api>.

Lookup allocations drain separately too.
<https://www.smarty.com/docs/cloud/licensing> shows one account holding two
active subscriptions with independent annual allocations, selected at call time
by a `license` value (`us-core-cloud`, `us-rooftop-geocoding-cloud`, …).

## How the plugin is wired

One client per account with seven sub-clients under it, each on
`https://<host>.api.smarty.com`:

| Client              | Host                         | Rate limit |
| ------------------- | ---------------------------- | ---------- |
| parent              | none                         | none       |
| `:us`               | `us-street`                  | 25,000/s   |
| `:usZipcode`        | `us-zipcode`                 | 25,000/s   |
| `:usExtract`        | `us-extract`                 | 25,000/s   |
| `:usReverseGeo`     | `us-reverse-geo`             | 3,500/s    |
| `:usAutocomplete`   | `us-autocomplete`            | unlimited  |
| `:intl`             | `international-street`       | 3,500/s    |
| `:intlAutocomplete` | `international-autocomplete` | 400/s      |

The limits are Smarty's defaults (see [Default rate limits](#default-rate-limits)),
declared per sub-client path as the template's `professional` rate-limit option
and applied by core, which is also the default when a caller names none. Each
sub-client meters against its own vendor figure, because there is no shared budget
for a shared bucket to protect and the ceilings run from 400/s to 25,000/s: one
bucket would cap US traffic against a budget international traffic was also
draining.

The parent deliberately has neither a `baseURL` nor a `rateLimit`. It exists to
carry the query-string auth every surface shares, and every request resolves a
sub-client; a call that somehow addressed the parent fails on the missing base
URL rather than going out unmetered.

### Default rate limits

**Vendor documentation**: the "Default rate limit" column of the table at
<https://www.smarty.com/docs/ludicrous-speed>, checked 2026-11-12.

| API (as the table names it)        | Default rate limit                                    | Sub-client         |
| ---------------------------------- | ----------------------------------------------------- | ------------------ |
| US Street Address API              | 25,000 address lookups per second                     | `us`               |
| US ZIP Code API                    | "Plans starting at 25,000 address lookups per second" | `usZipcode`        |
| US Address Extract API             | 25,000 address lookups per second                     | `usExtract`        |
| US Reverse Geocoding API           | 3,500 address lookups per second                      | `usReverseGeo`     |
| US Autocomplete API                | ∞                                                     | `usAutocomplete`   |
| International Street Address API   | 3,500 address lookups per second                      | `intl`             |
| International Address Autocomplete | 400 address lookups per second                        | `intlAutocomplete` |
| US Enrichment API                  | ∞                                                     | not in this plugin |

Two things a reader cannot see from the template:

- **US Autocomplete is declared `noLimit` on purpose.** Smarty's table gives it no
  limit, so any number here would be invented. It is a written decision, not a
  missing calibration.
- **The pricing pages do not carry all of these.** They state 25,000 for US
  verification and 3,500 for international verification and reverse geocoding, and
  nothing for ZIP Code, Extract or either autocomplete, which is why the earlier
  search of the pricing and reference pages (2026-11-12) came back empty for five
  surfaces.

**These are Professional-tier figures and are wrong for any other tier.** The
Free Trial is a fixed grant (1,000 US lookups over 42 days; 100 international)
rather than a rated plan, and both pricing pages offer a Custom tier whose
allowance reads "custom address lookups/second". Other tiers are added as
further `rateLimitOptions` once their figures are sourced; until then pace a
particular account with the `rateLimitOverrides` argument to `addTemplateClient`
rather than editing the template.

## What a 429 means here

The configured ceilings are the vendor's own, so reaching them is not what
produces a 429. One means the subscription's **lookup allocation** is exhausted,
the credentials are wrong, or the account is on a lower tier than the template
assumes.

These ceilings are also not a spend guard, and were not sized as one. Smarty
bills per lookup, so 25,000/s bounds a runaway loop at 90M lookups an hour —
which is to say it does not bound it in any sense that matters. Cost control
belongs upstream of the rate limiter. A lower `rateLimitOverrides` is the lever
if you want the limiter to double as one.

## `authId` is logged in plaintext on any error

Smarty's secret-key auth is query-string only, so `auth-id` and `auth-token`
ride in the URL. Core's redaction covers headers, which is where its escape
hatch applies, so a 4xx or 5xx logs the query string as sent. `authToken` is
redacted by name; `authId` is not. Not fixable from this package.

## Where the endpoint findings come from

Two sources, and each claim below says which:

- **The Smarty Postman collection** supplied 2026-11-12. It holds requests only:
  method, host, path, query parameters and example bodies. It has **no saved
  responses**, so no response shape comes from it.
- **Smarty's reference pages**, checked 2026-11-12, read through a fetch tool that
  summarises pages rather than returning raw HTML. Response shapes come from
  these. The pages give examples, not field types, so **every response field type
  is inferred from an example and every response field is optional**.

No call has been made against a Smarty account. Anything not from one of those two
sources is labelled an inference.

## Hosts

The sub-clients and their hosts are in the table under
[How the plugin is wired](#how-the-plugin-is-wired).

The collection uses `*.api.smartystreets.com` throughout. Every reference page
shows `*.api.smarty.com` in its example requests and `Host` headers, and none
mentions the older domain, so the plugin uses `smarty.com`. That
`smartystreets.com` is a legacy domain is an **inference**; whether it still
resolves is untested.

### Embedded-key auth is not supported

The collection's "Using Embedded Key" entries authenticate with a `key=` query
parameter, which Smarty intends for browser use. The plugin always injects the
secret-key pair (`auth-id`, `auth-token`) and models `key` nowhere.

### Every request takes the client name first

Until 3.0.0, `verifySmartyUs` and `verifySmartyIntl` took `(input, options)` and
built the client name themselves from `organizationId` and an `alias` that defaulted
to `"production"`. They now take `clientName` first like every other request here
and in the rest of the repo, and append their own sub-client segment. A caller who
relied on the `"production"` default passes
`buildClientName("smarty", { instanceId: "production" })`.

## US Street and International Street audit

C is the collection, R a reference page, I an inference.

| Item                                               | Finding                                                                                                                                          | Outcome                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `license` on US Street (C)                         | A query parameter even on the POST; it was unreachable                                                                                           | Added an optional `{ license }` argument, sent as a query parameter |
| Multiple-address POST (C; R: 100 lookups or 32 KB) | Unreachable through the single-lookup wrapper                                                                                                    | Added `verifySmartyUsBatch`, SMT_0010. Non-breaking                 |
| Forced `candidates: 1`, `match: "strict"`          | Equal to Smarty's documented defaults (R), and the caller's body overrides them                                                                  | Kept                                                                |
| "Include Rooftop Geocoding" (C)                    | Same parameters as the plain call apart from the licence value; rooftop is a licence (I)                                                         | Covered by `license`                                                |
| International `max_results` 1 to 10 (R only)       | Missing                                                                                                                                          | Added. Non-breaking                                                 |
| International `address5` to `address12` (R)        | Missing from the response type                                                                                                                   | Added as optional. Non-breaking                                     |
| International `analysis.changes` (R)               | The reference nests it as `{ organization, components: {…} }`; the type has the component keys flat, so `changes.components` does not type-check | **Not fixed**: correcting it is a breaking change for readers. Open |
| International `language` (R)                       | Documented as `native` or `latin`; typed `string`                                                                                                | **Not narrowed**: breaking. Open                                    |
| US `component-analysis` response (R)               | The reference does not say where it sits in the payload                                                                                          | Not typed. Unverified                                               |

The response value enumerations (DPV codes, change codes) were not re-checked.

## US ZIP Code

Source for the response: `smarty.com/docs/apis/us-zipcode-api/reference`.

- `GET /lookup` takes one lookup as query parameters (`zipcode`, `city`, `state`,
  `input_id`); `POST /lookup` takes a JSON array of them. `license` is a query
  parameter on both. It is in the collection but not on the reference page.
- The batch form is limited to 100 inputs or 16,384 bytes (R). The plugin does not
  enforce it.
- Valid input combinations (R): `zipcode`; `city` and `state`; all three.
- `status` and `reason` appear only when nothing matched.

## US Autocomplete

Source: `smarty.com/docs/apis/us-autocomplete/reference`. `GET /v2/lookup` on
`us-autocomplete`, as `suggestSmartyUsAutocomplete`.

**The collection's "US Autocomplete Pro" is not implemented.** Smarty's reference
page labels Pro the legacy API and recommends this one, so the plugin carries only
the current API. The two differ in host (`us-autocomplete-pro`), path (`/lookup`)
and in `selected`, which Pro takes as a composed address string and this API takes
as an opaque `entry_id` from a collapsed suggestion.

- **`prefer_geolocation` defaults to `city` on Smarty's side**, which geolocates by
  the sender's IP. Called from a server that is the server's IP, so a backend caller
  probably wants `"none"`. An inference from the documented behaviour.
- **`license`** is on the collection's Pro request and not on this API's reference
  page. It is modelled; whether this API honours it is unverified.
- **The page shows only embedded-key examples.** That this host accepts the
  secret-key query parameters the plugin injects is not stated on the page as
  fetched. This is the open question most worth one real call.
- The page calls `search` required, yet the `selected` flow omits it, so it is typed
  optional.

## US Extract

Source for the response: `smarty.com/docs/apis/us-extract-api/reference`.

- `POST /` with the text as the **raw body** and `Content-Type: text/plain`, not
  JSON. The limit is 64 KB (R). Options (`html`, `aggressive`, `addr_line_breaks`,
  `addr_per_line`, `match`, `license`) are query parameters (C).
- That a string body goes out unencoded rests on axios's behaviour, an inference;
  the test asserts the request handed to the handler, not the bytes on the wire.
- The page lists no values for `match`. The type uses `strict | invalid | enhanced`
  by inference from US Street.
- A request can bill zero or more lookups; `aggressive` is likely to use more (R).

## US Reverse Geocoding

Source: `smarty.com/docs/apis/us-reverse-geocoding-api/reference`.

- `GET /lookup` with `latitude`, `longitude` and optional `source`.
- `license` is sent by the collection but absent from the reference's parameter
  table. It is modelled as optional.
- The page gives the unit of `distance` as metres in one place and decimal degrees
  in another.

## International Address Autocomplete

Source: `smarty.com/docs/apis/international-autocomplete-api/reference`.

**The collection and the reference page describe different versions.** The
collection calls an unversioned `/lookup` with `distance`, `latitude`, `longitude`
and `include_only_administrative_area`. The reference page documents only **v2**,
at `/v2/lookup`, without those four parameters, and with `max_group_results` and
`language` instead.

The plugin calls **v2 for both steps**: `suggestSmartyIntlAddresses` is
`GET /v2/lookup` and `getSmartyIntlAutocompleteAddress` is
`GET /v2/lookup/{address_id}`. The second step exists only on the v2 page, and an
`address_id` is "valid for the current session", so taking the id from one version
and spending it on the other is the combination least likely to work. The four
collection-only parameters stay on the request type, marked as such; whether v2
ignores or rejects them is untested.

Summary results (`entries` above 1) are free; a single-address detail result is
charged (R).

## Open

- **Whether the Professional-tier rates are uniform across plan sizes.** Both
  pricing pages state the rate once, above the allocation selector (1K through
  170K US), which reads as one rate for the whole tier — but that is an
  inference from page layout, not a statement. An account on a small
  Professional plan would settle it.
- **Whether `license` must be sent explicitly for accounts holding more than one
  US subscription.** The International Street reference lists a `license` input
  and `SmartyIntlRequest` carries it; the US Street reference lists none and
  `SmartyUsRequest` matches that. An account holding both `us-core-cloud` and
  `us-rooftop-geocoding-cloud` would show whether the US endpoint needs it
  anyway.
- Does the US Autocomplete host accept secret-key auth?
- Does `/v2/lookup` on the international autocomplete host accept the collection's
  four older parameters, and is the unversioned `/lookup` still served?
- Is `license` honoured by US Reverse Geocoding and US Autocomplete?
- Which unit is reverse geocoding's `distance` in?
- Where does `component-analysis` sit in a US Street response?
