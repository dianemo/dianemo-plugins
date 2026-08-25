# Walmart Marketplace API

Findings behind the rate-limit configuration and the feed content types in
`@dianemo/plugin-walmart`. Everything cited here was checked against Walmart's
published docs on **2026-08-25**; everything marked _unsourced_ or _inferred_ was
not published and is the part to confirm against a real seller account.

## Rate limits

Walmart meters **per endpoint**, not per client, and the published figures are a
default rather than a promise: "rate limits are allotted at the seller level, with
each seller receiving their own specific limits".
<https://developer.walmart.com/us-marketplace/docs/rate-limiting>

`src/client.ts` has one shared `requestLimit` bucket, so it has to sit at the floor
of the endpoints this package actually calls. That floor is **60/min**:

| Endpoint                                             | Published limit                               |
| ---------------------------------------------------- | --------------------------------------------- |
| `GET /v3/orders/released`                            | 60/min                                        |
| `POST /v3/orders/{purchaseOrderId}/acknowledge`      | 60/min                                        |
| `POST /v3/orders/{purchaseOrderId}/shipping`         | 60/min                                        |
| `POST /v3/orders/{purchaseOrderId}/cancel`           | 60/min                                        |
| `POST /v3/orders/{purchaseOrderId}/refund`           | 60/min                                        |
| `GET /v3/items`                                      | 300/min, but **60/min with query parameters** |
| `GET /v3/inventory`, `PUT /v3/inventory`             | 200/min                                       |
| `GET /v3/inventories`, `PUT /v3/inventories/{sku}`   | 200/min                                       |
| `GET /v3/wfs/inventory`                              | 100/min                                       |
| `GET /v3/orders`, `GET /v3/orders/{purchaseOrderId}` | 5000/min                                      |
| `GET /v3/feeds/{feedId}`                             | 5000/min                                      |

`getItems` always sends parameters, so the 300/min row never applies to this
package and `GET /v3/items` counts as a 60/min endpoint. Everything from
`/v3/inventory` down has room to spare under a 60/min bucket.

**Two endpoints this package calls are absent from that table, so their headroom is
unsourced.** `GET /v3/returns` has no row — the 60/min "Get Customer Return Orders
status" row is `/v3/fulfillment/return-orders`, a different API — and
`POST /v3/feeds?feedType=MP_INVENTORY` has none either. Both are assumed to fit
under 60/min pending confirmation against a real seller account.

### The bucket cannot cover the price paths

The price endpoints are orders of magnitude slower than everything above, and one
`requestLimit` cannot express a second, much slower budget:

| Endpoint                                      | Published limit  |
| --------------------------------------------- | ---------------- |
| `POST /v3/feeds?feedType=PRICE_AND_PROMOTION` | 10/hour (Shared) |
| `PUT /v3/price`                               | 100/hour         |

10/hour is 1/6 of a minute's worth of the configured bucket, so a caller looping
over price feeds is unprotected by the client's rate limiting and has to pace
itself. This is the one limit a reader of `src/client.ts` cannot infer from the
configured numbers, so it is stated inline there as well.

Sandbox is lower again: **30/hour per feed type**.
<https://developer.walmart.com/us-marketplace/docs/sandbox-throttling-limits>

## Feed content types are not uniform across feed types

`submitFeed` has a JSON branch and a multipart branch, and which one a feed type
wants is per-feed. `submitPriceFeed` passes a bare object, taking the JSON branch,
and it is easy to "correct" that into a multipart upload. Checked 2026-08-25:

- **`PRICE_AND_PROMOTION` — JSON.** The "New" bulk price API is documented with a
  JSON body and `content-type: application/json` in both its cURL and Python
  samples, and its OpenAPI request body is `application/json`. The payload shape
  in `src/requests/pricing/types.ts` (`MPItemFeedHeader`/`MPItem`) is that API's.
  <https://developer.walmart.com/us-marketplace/docs/update-promotional-pricing-for-multiple-items-in-bulk>
- **Item and inventory feeds — multipart**, with the payload in a `file` part, as
  `submitMultiNodeInventoryFeed` sends it.
  <https://developer.walmart.com/us-marketplace/docs/bulk-inventory>

Walmart's general feed guidance also says the content type "can be set to either
application/json or multipart/form-data", so multipart may well be accepted for the
price feed too. **This is unconfirmed.** JSON is what the endpoint's own page
demonstrates, so that is what is sent; settling it either way needs one call from a
real seller account.

## Two feed-type vocabularies

`feedType` means different things depending on which endpoint reads it, and the
two sets share no members.

| Type                  | Used by                       | Members                                                |
| --------------------- | ----------------------------- | ------------------------------------------------------ |
| `WalmartFeedType`     | `submitFeed`, `getFeedStatus` | `inventory`, `MP_INVENTORY`, `PRICE_AND_PROMOTION`     |
| `WalmartSpecFeedType` | `getTaxonomy`, `getSpec`      | `MP_ITEM`, `MP_MAINTENANCE`, `MP_WFS_ITEM`, `OMNI_WFS` |

The first names a feed you submit; the second names a schema family the item
endpoints classify against. They are kept as separate types, named for the
endpoints that accept them, because neither can be derived from the other.

## `getSpec` is a POST that reads

`POST /v3/items/spec` returns a JSON schema and mutates nothing. The verb is
Walmart's, and the reason is that the product-type list travels in the body —
Walmart caps it at 20 per request, so it would not fit a query string
comfortably.

The call is safe to retry despite the verb.

## The global market header travels in pairs

`WM_MARKET` is rejected on its own: it has to be sent with `WM_GLOBAL_VERSION`.
`getItems` and `retireItem` therefore take an optional `market` and build both
headers together rather than exposing them separately. `getItem` does not:
whether the single-item read honours the global market header was not
established, and offering the parameter would imply it does.

Omitting `market` sends neither header, which is the US marketplace.

## `WM_QOS.CORRELATION_ID` on the token call

Walmart requires a correlation id on `POST /v3/token` as well as on ordinary
requests. It is a literal minted at template-build time in `src/client.ts` rather
than one per refresh, because a refresh config cannot hold a function — see
[`core-behaviour.md`](../../../docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function).

The cost is one id per client per process on token refreshes. Walmart accepts a
repeated value; it only makes Walmart's own trace logs coarser for those calls.
Per-request ids are still unique, minted in `requestOptions.requestInterceptor`
from `config.requestId`.
