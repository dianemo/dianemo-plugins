---
"@dianemo/plugin-walmart": minor
---

Read a single item with `getItem`, browse the Product Type taxonomy with `getTaxonomy`, fetch spec schemas with `getSpec`, search the catalog with `catalogSearch`, and retire a listing with `retireItem`. Every function in the orders, feeds, inventory, items and pricing modules now takes an optional trailing `market` argument that sends the global market header, so a Canadian or international request no longer defaults to the US marketplace, and the MP_ITEM and MP_MAINTENANCE feed payload schemas are exported from `requests/feeds/itemFeedTypes`.
