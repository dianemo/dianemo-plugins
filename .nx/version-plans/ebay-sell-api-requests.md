---
"@dianemo/plugin-ebay": minor
---

Adds twenty-four request functions across five new modules (`inventory`, `fulfillment`, `account`, `taxonomy` and `listing`), covering inventory items, offers, shipping fulfillments, business policies, category taxonomy and bulk listing migration, all using the same `grantId` pattern as `getOrders`. `getOrders` now accepts `data.next` to follow eBay's next-page URL, so a result set can be paged to exhaustion; it cannot be combined with any other field and is refused with `EBY_0004` if it is. `EbayRequestOptions` is still exported from the package root.
