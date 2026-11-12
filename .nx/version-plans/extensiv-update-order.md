---
"@dianemo/plugin-extensiv": minor
---

Adds `updateOrder` (`PUT /orders/{id}`) to `@dianemo/plugin-extensiv`, taking the complete order body, the `If-Match` etag from `getOrder` and optional `detail` / `recalcautocharges` parameters. The endpoint replaces the whole order, so read it with `getOrder` rather than building the body by hand. Also adds the `ExtensivOrderStatus` enum (`OPEN`, `CLOSED`, `CANCELED`), which types `Status` on an order, and exports the `Inventory` row type.
