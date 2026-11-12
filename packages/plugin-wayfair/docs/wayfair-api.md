# Wayfair supplier API

Findings behind `@dianemo/plugin-wayfair`. Read the source note below before
relying on any of it — none of this comes from vendor documentation.

## The sources here are vendor _code_, not vendor documentation

Wayfair publishes no public developer documentation for the supplier GraphQL API.
The developer portal is a JavaScript application behind a supplier login and
serves nothing to a fetch, so there is no page to quote.

Almost everything below is instead taken from **Wayfair's own published
integration**, `https://github.com/wayfair-contribs/plentymarkets-plugin`, whose
files carry `@copyright Wayfair LLC`. That is vendor-published _code_ rather than
vendor _documentation_ — first-party, and running in production against the real
API, but never written down as a promise and free to change without a changelog.
The distinction is kept explicit throughout rather than dressed up as a doc
citation.

One finding rests on something weaker still — a **third party's schema
introspection** — and says so in place. Everything was checked 2026-08-25.

## The token audience is the API host root

`src/Core/Helpers/URLHelper.php` holds:

```php
BASE_URL      = 'https://api.wayfair.com/'
BASE_AUTH_URL = 'https://sso.auth.wayfair.com/'
URLS['graphql'] = 'v1/graphql'
```

`src/Core/Api/Services/AuthService.php` then sends
`'audience' => URLHelper::getBaseUrl()` — the base URL, not the GraphQL URL — and
the endpoint is built as base + `v1/graphql`.

So the audience is **the host root, with its trailing slash**: two separate facts,
both provable only from these constants. `BASE_AUTH_URL` being its own constant is
also why the token URL is a different host from the API and is not derived from
`baseUrl`.

The bug this fixed: the plugin sent `${creds.baseUrl}/`, which asked for
`https://api.wayfair.com/v1/graphql/`. No Auth0 tenant has a registration for that
audience, so every request died at token acquisition, before a query was ever
sent. The value is derived from `baseUrl` rather than hardcoded so that the
sandbox host follows the same rule, and `new URL(…).origin` drops the path
Wayfair's own constant does not include.

## `getDropshipPurchaseOrders` is the order read

Wayfair exposes two root fields that both look like an order list, and they are not
interchangeable.

`purchaseOrders` carries a handful of fields and takes a `filters` list. **`getDropshipPurchaseOrders`
is the one Wayfair's own dropship integrations use**, and the only one that carries the
warehouse, the ship-to and bill-to addresses, the shipping method, the event and the
per-product `isCancelled` state — everything an order importer needs to do anything with
an order beyond counting it.

It also takes the filters that matter for incremental import, as **typed variables**:

```graphql
query getDropshipPurchaseOrders(
  $limit: Int32
  $hasResponse: Boolean
  $fromDate: IsoDateTime
  $poNumbers: [String]
  $sortOrder: SortOrder
)
```

Those five scalar names — `Int32`, `IsoDateTime`, `SortOrder` in particular — are the
ones Wayfair's schema actually declares, established from a query running in production
rather than inferred. Naming a scalar wrongly fails the whole query, which is why
`gqlString` exists for operations whose scalars are still unknown.

Two operational limits: `limit` is capped at **25**, and paging only holds under
`sortOrder: "ASC"` — a descending sort re-reads the same window as new orders arrive.

## A rejected query comes back as HTTP 200

An unauthorised supplier, an unknown argument, a malformed filter — each arrives
as HTTP 200 carrying `{"data":null,"errors":[…]}`. Nothing in the transport layer
can see the failure: the status is fine and the body says otherwise.

This is why `WayfairGraphQLResponse.data` is declared nullable. Declaring it
non-nullable turned every one of those into `TypeError: Cannot read properties of
null` at the caller's first field access, with nothing left saying what Wayfair had
objected to.

Wayfair's own client checks status and body together, failing a purchase-order
fetch on:

```php
$response->getStatusCode() != 200 || (isset($errors) && !empty($errors))
  || !isset($body['data']['purchaseOrders'])
```

(`src/Core/Api/Services/FetchOrderService.php`.) `handleGraphQLRequest` does the
same, and additionally refuses a missing `data` with no `errors`: it is not a
result, and returning it only moves the failure somewhere less legible.

## Mutations answer with a feed handle, not a result

`acceptOrder`, `shipOrder` and `saveInventory` all return the same envelope: an
`id`, a `handle`, a `status`, and three counted lists — `errors`, `completed`
and `processing`.

`status` reports whether the **submission** was accepted, not whether the
acceptance, shipment or inventory write succeeded. Wayfair processes these as
feeds, so `errorCount` and `completedCount` fill in afterwards and a response
with `errorCount: 0` on arrival means nothing has failed _yet_.

A caller that needs the outcome has to poll the handle. Treating the mutation's
return value as confirmation is the mistake this shape invites.

## Paging defaults

**Wayfair defaults `inventory` to 10 rows when no `limit` is given** — from the
introspected schema in `https://github.com/mendeljacks/wayfair`
`src/wayfair_connector.ts`, which documents the default alongside
`inventory(filters, ordering, limit, offset)`. That default is why `PAGE_SIZE =
100` is passed explicitly rather than left off: omitting it silently caps a page at
a tenth of what the caller expects.

`getInventory`'s `page` is 1-based, mapping to the offset Wayfair pages on: page 1
is `offset: 0`. `page: 0` — the obvious thing to pass if you assume pages count
from zero — used to send `offset: -100`, so it is refused rather than clamped: a
caller silently handed page 1 instead has no way to see that its paging is off by
one for every page after it.

`getOrders`' `limit` default of 50 is this plugin's own choice, not Wayfair's,
copied from the `limit: 50` in Wayfair's own query above.

## Rate limits are unpublished

**Wayfair publishes no rate limit for the supplier GraphQL API.** Not in the
developer portal's public pages, and not in their own published supplier plugin,
which paces nothing at all.

The 60/min in `client.ts` is **this repository's own politeness ceiling** —
inherited, never verified against Wayfair, and to be treated as a guess rather
than a documented figure. A bare number in the config would read as something that
had been checked; it has not been. Settling it needs a supplier account (searched
2026-08-25).
