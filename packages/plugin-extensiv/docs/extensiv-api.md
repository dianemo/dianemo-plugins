# Extensiv (3PL Central) REST API behaviour

Findings about the Extensiv `secure-wms` REST API that cost real time to
establish. What is quoted from Extensiv's own documentation is marked as such;
what was reasoned out from this package and from standard HTTP is marked as
inferred, because the difference is what a future reader needs in order to know
which lines are safe to build on.

No live 3PL Central account was available while this was written. Nothing below
was confirmed against a real response.

## Escaping a dot in a file name

Extensiv addresses an order file by name in the path
(`/orders/{orderId}/files/{fileName}`), and its router reads a literal `.` in
that segment as a format suffix rather than as part of the name. **Extensiv's
own documented escape for it is `~d~`**, so `label.pdf` is addressed as
`label~d~pdf`. Without the substitution every file with an extension — which is
every file anyone actually attaches — 404s.

`packages/plugin-extensiv/src/requests/files/index.ts` implements this as

```ts
encodeURIComponent(fileName).replace(/\./g, "~d~");
```

and the order of the two steps is load-bearing in a way that is easy to undo:
`encodeURIComponent` does not touch `.`, so it cannot hide a dot from the
`replace`, and it runs before any `~d~` exists, so it cannot percent-encode the
`~` characters the escape introduces. Swapping the two lines breaks both halves.

### What is not established

- **Whether any character other than `.` needs the same treatment.** Extensiv
  documents `~d~` and nothing else. A literal `~` in a file name is the obvious
  hazard: `label~d~pdf` as a _name_ would be indistinguishable from the escaped
  form of `label.pdf`, and there is no documented escape for the tilde itself.
  Untested.
- **Whether `?name=` takes `~d~` too.** `attachFile` passes the name as a query
  parameter rather than a path segment, and this package sends plain
  `encodeURIComponent` there. That is the defensible reading — the `~d~` escape
  exists because of _path_ routing, and a query value has percent-encoding of
  its own — but it is a reading, not a confirmed behaviour. If an attached file
  ever comes back with a mangled `DocName`, this is the first thing to check.

## Collections arrive as ResourceList

Extensiv serves its collection endpoints in two representations. Under
`Accept: application/hal+json` the members sit in an `_embedded` envelope keyed
by rel URI; under plain `Accept: application/json` they arrive as a flat
`ResourceList` alongside `TotalResults`.

This package's client sends `Accept: application/json`
(`packages/plugin-extensiv/src/client.ts`), so `ResourceList` is the field to
read. `UpdateOrderItemResponse` was declared against `_embedded` before 1.0.0
and read `undefined` off every response.

**This is inferred, not confirmed.** The evidence is internal: every other
collection type in this package is written against `ResourceList` and those
types were built from real responses, and the client's `Accept` header is
unambiguous. It has not been checked against a live account, and Extensiv's
documentation was not found to state the two representations explicitly. If a
collection ever reads `undefined`, `_embedded` is the thing to try.

## If-Match on the mutating endpoints

Extensiv enforces optimistic concurrency on its mutating endpoints and refuses
a request that arrives without an `If-Match` header. Four functions were
rejected in validation for omitting it — `cancelOrder`, `updateOrderItem`,
`deleteOrderItem` and `deletePurchaseOrder`; `updatePurchaseOrder` already had
it, which is how the pattern was known to be right.

**Consequence for a caller:** the etag has to come from somewhere, and the only
source is the corresponding read. `getOrder`, `getOrderItems` and
`getPurchaseOrder` therefore return `{ data, etag }` rather than the body alone.
Nothing else in the plugin surfaces an etag, so a caller that reaches for a
mutating function without having read the resource first cannot call it at all —
which is the intended shape, not an oversight.

| mutating function     | etag from          |
| --------------------- | ------------------ |
| `updateOrder`         | `getOrder`         |
| `cancelOrder`         | `getOrder`         |
| `updateOrderItem`     | `getOrderItems`    |
| `deleteOrderItem`     | `getOrderItems`    |
| `updatePurchaseOrder` | `getPurchaseOrder` |
| `deletePurchaseOrder` | `getPurchaseOrder` |

### `If-Match: *`

Passing `"*"` should waive the check and act on whatever the current revision
is. That is **standard HTTP semantics (RFC 9110 §13.1.1), not something
confirmed against Extensiv** — its documentation was not found to say whether
its cancel and delete endpoints honour the wildcard. Treat it as likely rather
than known, and read the resource first if the answer matters.

## A canceled order reports as closed

`ReadOnly.Status` is a number, and a canceled order is `2` — but it also comes
back with **`IsClosed: true`**, the same as a normally completed one. Filtering on
`IsClosed` alone therefore treats cancellations as fulfilled work.

The three values are `0` open, `1` closed, `2` canceled, exported as
`ExtensivOrderStatus`. A canceled order additionally carries a `-CANCELED-` suffix
on its reference number, which is a useful cross-check but not a substitute:
read `Status`.

## PUT /orders/{id} is a whole-order replace

`updateOrder` sends the entire order, not a patch. Members absent from the
request body are **dropped**, not left unchanged — so the body has to be a read
of the order with the mutation applied on top, and the read has to be wide
enough to carry every member back.

Two narrower reads were measured to be insufficient:

- `detail=BillingDetails` omits `ShipTo`, `OrderItems`, `ParcelOption`,
  `SavedElements` and `Inserts` outright.
- `detail=All` **without** `itemdetail=All` returns `OrderItems` whose
  `Allocations` are absent.

These are top-level members rather than detail sections, so Extensiv's
"unspecified sections are left unchanged" does not cover them.

**Consequence for a caller:** read with `getOrder`, which already requests
`detail=All` and `itemdetail=All` and is the only source of the required
`If-Match` etag. Do not assemble an update body by hand.

The `detail` parameter on the update itself controls only what the _response_
carries; it has no bearing on what is written.

## Pagination

Every collection endpoint accepts four query parameters: `pgsiz`, `pgnum`,
`rql` and `sort`. `pgnum` is 1-based. `rql` takes an RQL expression against the
dotted response path, e.g. `readonly.customerIdentifier.id==12`. `sort` takes a
field name, prefixed with `-` for descending.

**Extensiv pages every collection whether or not the caller asks.** Omitting
`pgsiz` returns the first **100** records; the ceiling varies by endpoint and a
request above it is clamped rather than refused. `/inventory/receivers`
documents a maximum of **500**, which is the only per-endpoint figure this
package has.

The trap is that nothing in the body says a page was truncated: a caller
reading `ResourceList.length` sees a plausible short answer and no error.
`TotalResults` is the only signal — compare it against the number of records
received to know whether to ask for the next page. Five list functions in this
plugin took no pagination options at all before 1.0.0 and so silently capped
every result set at 100.

### What is not established

Two endpoints take `ExtensivListOptions` in this package without it being
verified that they honour it:

- `/properties/facilities` (`getFacilities`)
- `/orders/{orderId}/filesummaries` (`getFiles`)

Both are collections, and Extensiv's parameters are documented as applying to
collections generally, so passing the options is the right default. Neither was
observed paging. `getFiles` in particular returns an `OrderFilesSummary` with a
`ResourceList` and **no `TotalResults`**, so if it does page there is no way
from the response to tell.

## Rate limit: unpublished, and 20/s is this repo's own ceiling

**Negative result, confirmed 2026-08-25: Extensiv (3PL Central) states no rate
limit** for the REST API this package calls.

The template declares `20 / 1 s`. That figure is **not Extensiv's** — it is this
repository's own ceiling. It is also the most permissive unsourced ceiling in the
catalogue, at 1,200/min against Mainfreight's 100/min and Wayfair's 60/min, so it
is the one most likely to be wrong in the dangerous direction: high enough to
overrun a real quota rather than merely to be slow.

Nothing here has observed a 429 at it, which is weak evidence rather than
confirmation. Confirm the real figure with Extensiv and set it per client with the
`rateLimitOverrides` argument to `addTemplateClient` rather than editing the
template.

Recorded in the repo's countable list at
[`open-questions.md`](../../../docs/open-questions.md#unsourced-calibrations).
