# eBay API

Findings about eBay's Sell Fulfillment and OAuth services that cost real time to
establish, and that the shape of `@dianemo/plugin-ebay` depends on. Every page
cited here was checked 2026-08-25; quoted text is verbatim from the page named.

## Paging follows the opaque `next` URL

`getOrders` answers with a `next` field holding a **complete URL** for the following
page, not a cursor token to pass back as a parameter.

It already encodes the filters, limit and offset of the search that produced it, and
eBay does not document its shape as stable — so it is followed verbatim rather than
parsed and rebuilt. Pass it as `data.next` and `getOrders` requests that URL directly.

Because everything else is already baked in, `next` is exclusive with every other field
on `GetEbayOrdersData`; combining them is refused with `EBY_0004` rather than silently
dropping one side.

```ts
let next: string | undefined;
do {
  const page = await getOrders(
    clientName,
    { grantId },
    next ? { next } : { limit: 50 }
  );
  // …
  next = page.next;
} while (next);
```

## The fulfillment id is only in a header

`POST /sell/fulfillment/v1/order/{orderId}/shipping_fulfillment` answers 201
with an **empty body**. The id of the fulfillment it just created is in the
`Location` header and nowhere else.

`createShippingFulfillment` parses it off the last path segment and raises when
it is absent, because the alternative — returning undefined — hides a
fulfillment that exists on eBay and cannot be addressed. A proxy that strips
response headers produces exactly that case.

## Two request caps eBay enforces by rejection

Both are refused client-side rather than sent and bounced, because the whole
batch fails and the caller cannot tell which item was at fault:

| Function                | Cap        |
| ----------------------- | ---------- |
| `getBulkInventoryItems` | 25 SKUs    |
| `bulkMigrate`           | 5 listings |

## `Content-Language` on writes

eBay reads localised fields off `Content-Language` and omits or rejects them
without it. Every inventory and offer write sends `en-US`, as do the three
account policy reads — the policy endpoints use it to choose which localised
policy fields come back.

## Literal braces in a filter

`get_item_condition_policies` takes `filter=categoryIds:{123}` with the braces
unencoded. `getItemConditionPolicies` therefore builds that into the URL rather
than passing it through query-parameter serialisation, which would percent-encode
them.

## Call limits are daily; the per-minute rate is derived

eBay's default API call limit table gives the Fulfillment API **"Order resource
(all methods): 100,000 API calls per day"** — the row that governs every function
in the plugin — and eBay raises it only **"after completing our Application Growth
Check"**.

Source: https://developer.ebay.com/develop/get-started/api-call-limits

**The per-minute figure in the code is derived, not published.** eBay states no
sub-daily rate for this resource. That absence is meaningful rather than an
omission: the same table _does_ publish short-window limits where they exist —
Commerce Media carries a **"POST rate user level limit: 50 requests per 5
seconds"** — and Fulfillment has none.

The arithmetic: 100,000 / 1440 minutes = 69.4/min, so a bucket of 69/min holds
99,360 calls/day, inside the published ceiling.

Modelling the published shape literally — one 100,000-token bucket refilled every
24h — was rejected. A backfill could spend the whole day's allowance in a quarter
of an hour and leave every other caller failing until the counter reset. **The
reset time is not published either**, so that failure window cannot even be
predicted from the docs; the only way to know it is at runtime, from the `reset`
value on a rate-limit record returned by the Developer Analytics API. Smoothing
trades peak throughput for never being in that position.

## Per application or per application-user is unpublished

Whether eBay counts the 100,000/day against the application or against each
application-user is **not stated anywhere**. The call-limit table says neither, and
eBay's Developer Analytics API exposes _both_ counters: **"The rate_limit resource
retrieves call-limit data for an application. The user_rate_limit resource
retrieves call-limit data for an application user."**

Source: https://developer.ebay.com/develop/api/sell/developer_analytics_api

So the plugin shares one bucket across every seller's grant. Sharing is the only
reading that cannot overspend either counter. Per-grant buckets would multiply the
budget by the number of sellers, and if that guess were wrong every seller's calls
would start failing at once.

Note that _declaring_ `grantRateLimitBehavior: "shared"` would configure nothing —
see
[/docs/core-behaviour.md](../../../docs/core-behaviour.md#grantratelimitbehavior-shared-configures-nothing).
The sharing is core's default, so the plugin says it in prose instead.

## Token endpoint grants and their daily quotas

eBay's authorization guide tabulates the grants its token endpoint accepts, each
with its own daily quota:

| grant                | token       | quota      |
| -------------------- | ----------- | ---------- |
| `client_credentials` | application | 1,000/day  |
| `authorization_code` | user        | 10,000/day |
| `refresh_token`      | user        | 50,000/day |

Source: https://developer.ebay.com/develop/guides/sell/authorization

All three are in play: the client-level `refreshConfig` uses the first,
`grantRefreshConfig` the third, and `exchangeAuthCodeForAccessToken` posts the
second directly. `test/auth.test.ts` asserts eBay accepts exactly these three, and
its `ACCEPTED_GRANTS` entry cites this page.

Which token can carry which scope is a separate question, and getting it wrong was
the original v1.0.0 blocker. The same guide: **"Client credentials grant flow mints
a new Application access token that you can use to access the resources owned by
the application"**, **"Authorization code grant flow mints a new User access token
that you can use to access the resources owned by the user"**, and **"If your
application needs to access and modify resources owned by the user, you must use
the authorization code grant flow"**. Orders are the seller's, so every request
function in the plugin runs on a grant, never on the application token.

## Scopes

`APPLICATION_SCOPE` is `https://api.ebay.com/oauth/api_scope`, which is what
eBay's own client-credentials example asks for. Core requires a `refreshConfig`,
but nothing in the plugin uses the token it mints.

`creds.scopeList` — the seller's consent scope list — deliberately does not appear
there. Asking for a user scope under client credentials is not a combination eBay
documents, so the unused path asks for exactly what eBay's own example asks for.
`sell.fulfillment` is a user scope, which is why it can only ride on a grant.

The constant is **not** derived from `baseUrl`, because scope identifiers are
`api.ebay.com` URIs in the sandbox too: eBay's sandbox cURL example posts to
`api.sandbox.ebay.com` with
`scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope`.

Source: https://developer.ebay.com/develop/guides/sell/authorization

## Refreshing a seller's grant

`grantRefreshConfig` is eBay's documented refresh-token request verbatim: POST to
the token endpoint, `Content-Type: application/x-www-form-urlencoded`,
`Authorization: Basic <B64-encoded-oauth-credentials>`, body
`grant_type=refresh_token`, `refresh_token=<value>`, `scope=<scopeList>`.

`scope` is documented as optional — **"If you do not specify a scope parameter,
the default will be the set of scope values included in the consent request"** —
and is sent anyway because the credential already carries the list.

Source: https://developer.ebay.com/develop/guides/sell/authorization

## The authorization code exchange takes no scope

`exchangeAuthCodeForAccessToken` sends `grant_type`, `redirect_uri` and `code`
alone, which is eBay's documented body for this exchange.

Adding `scope` back was considered and rejected: it is a parameter that _reads_ as
the thing narrowing the token while changing nothing, because the granted scopes
are fixed by the consent request the seller already approved. Narrowing belongs in
the consent request; the refresh request may then repeat that list or a subset of
it, which is what `grantRefreshConfig` sends.

Source: https://developer.ebay.com/develop/guides/sell/authorization

## orderIds excludes every other parameter

eBay on `orderIds`: **"If one or more order ID values are specified through the
orderIds query parameter, all other query parameters will be ignored."** The same
page repeats it against `filter` — **"If the orderIds parameter is included in the
request, the filter parameter will be ignored"** — and again against `offset`.

Source:
https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrders

A caller passing both therefore got every order the ids named and none of the
narrowing it asked for, with an HTTP 200 on it. Two calls are the only way to ask
both questions, and refusing the combination (`EBY_0003`) is the only way to say
so. `orderIds` itself takes up to 50 ids.

## getOrders paging

`limit` defaults to 50 and caps at 200: **"If a requested limit is more than 200,
the call fails and returns an error."** The plugin does not pre-empt that, because
eBay already fails loudly and a local check would only duplicate a number that can
change. `offset` is zero-based.

Source:
https://developer.ebay.com/api-docs/sell/fulfillment/resources/order/methods/getOrders
