---
"@dianemo/plugin-newegg": minor
---

Adds `getFeedResult` to read a feed's per-row processing report, so a caller can
see which rows failed and not only that processing ended. Also adds
`updateItemInventoryAndPrice` to write inventory and price in one call,
`getBatchItemInventory` and `getBusinessBatchItemInventory` to resolve up to 100
SKUs at once, `submitBusinessInventoryFeed` for the business marketplace, which
has no standalone inventory feed, and a new `sellerManagement` module with
`getIndustryList` and `getFeedSchema`. Each new endpoint has its own rate-limit
sub-client.
