# Shopify GraphQL Admin API

Findings behind the rate-limit configuration and the declared per-request costs in
`@dianemo/plugin-shopify`. Everything cited here was checked against Shopify's
published docs on **2026-08-25**; everything marked _inferred_ was not published
and was derived from the cost rules, so it is the part to confirm against a real
shop.

## Nested page sizes are a cost decision, and the caller may know better

Shopify prices a query by the connection sizes it **requests**, and the
single-query cap is 1,000 points on a standard plan. A Shopify Plus store gets a
10x allowance.

That difference is why the list reads here default to small nested pages —
`getMany` at 10 line items, `getByOrderId` at 5 fulfillments, `companies.getOne`
at 25 contacts. Those defaults fit a standard plan. They are not a claim that
larger reads fail: a Plus store can request the same nested detail `getOne`
returns and stay inside its own cap.

So each of those three takes an optional `pages` argument that raises them. The
default stays conservative because a plugin cannot know the plan; the caller can.

**The failure mode this guards against is silence.** Asking for 10 line items on
an order with 30 does not error — it returns 10, and a caller that pages the
list and acts on what came back has quietly lost the rest. If you are reading a
list and then acting per-node, either raise `pages` or re-read each node with the
single-record function.

## A move can split instead of moving

`fulfillmentOrderMove` does not always move the whole thing. When the
destination location cannot stock every line, Shopify moves what it can and
answers with **both** `movedFulfillmentOrder` and a
`remainingFulfillmentOrder` holding the rest at the original location.

A caller that reads only `movedFulfillmentOrder` has silently lost track of the
remainder. `move` returns the whole payload for that reason rather than just the
moved order.

## `userErrors` arrives under HTTP 200

Shopify reports domain rejections in a `userErrors` array on the mutation
payload, not as a transport error, so nothing below the GraphQL layer sees them.

`move` raises on a non-empty `userErrors`: a move that did not happen must not
read as one that did. `bulkToggleActivation` does **not** — its errors are
per-location and a partial application is a legitimate result, so the array is
returned for the caller to inspect. That difference is deliberate.

## Rate limits and the leaky bucket

The GraphQL Admin API meters a shop with a leaky bucket priced in points, not in
requests. <https://shopify.dev/docs/api/usage/limits>

**Restore rate — published.** Shopify's rate-limit table gives per-plan restore
rates:

| Plan       | Restore rate (points/second) |
| ---------- | ---------------------------- |
| Standard   | 100                          |
| Advanced   | 200                          |
| Plus       | 1,000                        |
| Enterprise | 2,000                        |

`STANDARD_PLAN_BUCKET` in `src/client.ts` starts every shop at the Standard
figure. Standard is the only safe starting guess: admitting a Standard shop at an
enterprise rate is a self-inflicted throttle, where the reverse merely leaves
budget unused for one request.

**Bucket size — not published, inferred.** Shopify documents per-plan restore
rates but no per-plan bucket capacity. The only capacity figure it publishes
anywhere is the `"maximumAvailable": 1000` in its own example response, and that
example still shows the pre-increase `"restoreRate": 50`, so it cannot be read as
a current Standard figure either. 1,000 is used because it is the one published
number, and because it is exactly Shopify's ceiling on a single query — so a
1,000-point bucket is the smallest one that can admit any legal query, and
assuming no more than that is the conservative direction. **This is the figure to
confirm against a real shop.**

Neither number has to be right for long. Every GraphQL response carries
`extensions.cost.throttleStatus`, naming the shop's real `maximumAvailable` and
`restoreRate`, and `adoptShopThrottleStatus` in `src/client.ts` replaces both with
what the shop reports. The guess governs exactly one request per client, and a
plan change is picked up without a redeploy.

## Query cost

Shopify prices a query from its shape _before_ running it, and refuses anything
over 1,000 points with `MAX_COST_EXCEEDED` — on every plan, no matter how much
budget the shop has left. So the cost of a request is a property of the document
and is computable locally, which is why every request in this package declares
one.

Two things depend on getting a declared cost right. It is what dianemo spends from
the shared bucket, so an under-declared query overdraws it and the shop gets
throttled; and the bucket ceiling is also the largest admissible cost, so an
over-sized page is refused locally, naming the client, instead of being refused by
Shopify a round trip later.

Shopify's published cost table, quoted:

| Type             | Cost                             |
| ---------------- | -------------------------------- |
| Scalar, Enum     | 0                                |
| Object           | 1                                |
| Interface, Union | Maximum of possible selections   |
| Connection       | Sized by `first` and `last` args |
| Mutation         | 10                               |

and: "A single query may not exceed a cost of 1,000 points, regardless of plan
limits."

`src/requests/utils/queryCost.ts` encodes that table. Two things it does not
settle, both resolved by over-estimating rather than by guessing precisely:

- **What a connection costs — inferred.** "Sized by `first` and `last`" gives no
  formula. `connectionCost` charges `2 + pageSize × nodeCost`; the two points
  stand for the `edges` and `node` wrappers, which are objects and so cost 1 each
  under the rule above. The wrapper charge is an inference, not a citation.
- **What a non-connection list field costs — inferred.** `taxLines`,
  `Order.transactions`, `Customer.addresses`. The table names only objects,
  connections and interfaces, and a list has no `edges`, so these are charged as
  one object each and their `first` argument is not multiplied through.

Both are safe to be wrong about in this direction. Shopify charges
`actualQueryCost`, which is never more than the `requestedQueryCost` these numbers
estimate, so an over-estimate spends local budget the vendor did not charge — and
an under-estimate surfaces as a throttled response that is retried rather than
raised (see `src/throttling.ts`). **Both readings want confirming against a real
shop**, by comparing a declared cost against the `requestedQueryCost` that comes
back.

## Audited query costs per request

Every declared `cost` in the package was recomputed from the query text it sits
next to. Page depths were then chosen so that each request fits the 1,000-point
ceiling. The arithmetic:

| Request                                  | Cost | Working                                                                                    |
| ---------------------------------------- | ---- | ------------------------------------------------------------------------------------------ |
| `orders.getOne`                          | 549  | `ORDER_DETAIL_PAGES`, below                                                                |
| `orders.getMany` (default `first: 5`)    | 822  | `2 + 5 × 164`                                                                              |
| `orders.getByPO`                         | 551  | `2 + 1 × 549`                                                                              |
| `companies.getOne`                       | 251  | `COMPANY_DETAIL_PAGES`, below                                                              |
| `companies.getMany` (default `first: 5`) | 607  | `2 + 5 × 121`                                                                              |
| `fulfillmentOrders.getOne`               | 925  | `FULFILLMENT_ORDER_DETAIL_PAGES`, below                                                    |
| `fulfillmentOrders.getByOrderId`         | 953  | `1 + 2 + 10 × 95`                                                                          |
| `companyContacts.getOne`                 | 14   | contact + `company` + `locations(first: 10)`                                               |
| `companyLocations.getOne` / node         | 5    | location, `taxSettings`, `company`, `buyerExperienceConfiguration`, `paymentTermsTemplate` |
| `customers.getOne` / node                | 5    | customer, `defaultEmailAddress`, `addresses` list, `companyContactProfiles`, its `company` |
| `metafields.get`                         | 103  | `1 + 2 + 100 × 1`                                                                          |
| `webhooks` subscription node             | 2    | subscription + `endpoint`                                                                  |

### Order node cost

`ORDER_OBJECT_COST = 15` — objects hanging directly off an order:
`billingAddress`, `customer`, `paymentTerms`, `shippingAddress`, `shippingLine`
and its `discountedPriceSet.shopMoney` (7), plus the four `total*Set.shopMoney`
pairs (8).

`LINE_ITEM_COST = 11` — one `lineItems` node: the line item,
`originalTotalSet.shopMoney`, `discountAllocations` with both of its money
objects, `taxLines.priceSet.shopMoney`, and `variant`.

At `ORDER_DETAIL_PAGES` (`discountApplications: 100`, `events: 100`,
`lineItems: 25`, `metafields: 50`):

```
1 + 15 + (2 + 100×1) + (2 + 100×1) + (2 + 25×11) + (2 + 50×1) = 549
```

comfortably inside the ceiling, so a single order is never truncated. But it also
means Shopify will not return **two** full-detail orders in one query at any plan
level — the ceiling is the same on all of them. Something has to give in
`getMany`, and the nested collections are the safer half to shrink: a smaller page
is more round trips, whereas a caller who needs an order's 30th line item can read
that order with `getOne`.

At `ORDER_LIST_PAGES` (all four collections 10 deep) a node costs 164, so the
ceiling allows six orders per page:

```
first: 5 →  2 + 5×164 =  822   (the default)
first: 6 →  2 + 6×164 =  986
first: 7 →  2 + 7×164 = 1150   refused
```

`first: 7` is refused locally as a budget error naming the client, rather than
coming back `MAX_COST_EXCEEDED` a round trip later.

### Company node cost

One `contacts` node costs 3 (the contact, its `customer`, and the customer's
`companyContactProfiles` list). One `locations` node costs
`5 + connectionCost(catalogs, 1)` — the location, `billingAddress`,
`taxSettings`, `buyerExperienceConfiguration` and its `paymentTermsTemplate`, plus
the `catalogs` connection. A company is 2 (itself plus its
`customerInvoiceEmail` metafield object) plus both connections.

At `COMPANY_DETAIL_PAGES` (`contacts: 25`, `locations: 10`, `catalogs: 10`):

```
2 + (2 + 25×3) + (2 + 10×17) = 2 + 77 + 172 = 251
```

At `COMPANY_LIST_PAGES` (`contacts: 10`, `locations: 5`, `catalogs: 10`) a node
costs 121, so eight fit a query (`2 + 8×121 = 970`; nine is 1,091). The default is
`first: 5`, at 607.

**The bug this fixed.** `catalogs` was previously read 100 deep _inside_
`locations`, itself read 10 deep, making one location node cost
`5 + (2 + 100×1) = 107`:

```
locations connection alone: 2 + 10×107 = 1072
```

past the 1,000-point ceiling on its own, so `companies.getOne` failed on every
shop with `MAX_COST_EXCEEDED`.

### Fulfillment order node cost

One `fulfillments` node costs `2 + connectionCost(fulfillmentLineItems, 2)` — the
fulfillment, its `fulfillmentLineItems` connection (whose nodes are the line item
plus its `lineItem`), and the `trackingInfo` list. A fulfillment order is 1 plus
the `fulfillments` and `lineItems` connections.

At `FULFILLMENT_ORDER_DETAIL_PAGES` (all three 20 deep):

```
fulfillments node:  2 + (2 + 20×2) = 44
1 + (2 + 20×44) + (2 + 20×2) = 1 + 882 + 42 = 925
```

925 is most of the ceiling, because this selection nests three connections deep
and the multiplication compounds fast.

At `FULFILLMENT_ORDER_LIST_PAGES` (`fulfillments: 5`, `fulfillmentLineItems: 5`,
`lineItems: 10`) a node costs 95, so ten fit alongside the order that owns them:
`1 + 2 + 10×95 = 953`. The line items are the part callers fulfil against, so they
keep the most depth; the `fulfillments` history nested inside each fulfillment
order gives up the most.

**The bug this fixed.** `fulfillmentOrders` was read 100 deep at _detail_ depth:

```
1 + (2 + 100×925) = 92,503
```

against a ceiling of 1,000 — `fulfillmentOrders.getByOrderId` could not succeed on
any shop.

## Authentication

The Admin API takes the bare access token in `X-Shopify-Access-Token`, with no
scheme prefix — which is what `excludePrefix` on the client's `authentication`
block is for. The default `Bearer ` would be sent as part of the token and
rejected. <https://shopify.dev/docs/api/usage/authentication>

The template declares no refresh flow, deliberately: an admin-created custom
app's access token does not expire, so there is nothing to rotate and no
`grant_type` to name. Public apps using Shopify's _expiring_ offline tokens do
carry a `refresh_token`, and would need an `oauth2` template rather than the
`token` one this package registers.

## API version

`API_VERSION` in `src/client.ts` pins every GraphQL request to `2025-10`.

Shopify ships a version each quarter and keeps each one accessible for at least
twelve months. **`2025-10` stops being accessible on 2026-10-16**, after which
requests are silently redirected to the oldest version still supported.
<https://shopify.dev/docs/api/usage/versioning>

Left where it is rather than bumped blind: a newer version can drop fields this
package selects, and that cannot be checked without a real shop. It does need
deciding before the expiry date above.
