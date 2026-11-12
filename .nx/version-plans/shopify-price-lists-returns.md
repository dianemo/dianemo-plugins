---
"@dianemo/plugin-shopify": minor
---

Price lists and returns are now covered by request functions, and orders, inventory and fulfillment orders gain the calls that were missing. Import `priceLists` and `returns` from `@dianemo/plugin-shopify/requests/priceLists` and `/requests/returns`, toggle inventory activation across locations in bulk, and move a fulfillment order to another location; a move that splits returns both the moved and the remaining order, and a rejected move raises. The list reads that nest connections (`getMany`, `getByOrderId`, `companies.getOne`) take an optional `pages` argument so a Plus store can raise the conservative default page sizes, and four order fields dropped in an earlier revision are restored.
