# @dianemo/plugin-shopify

Shopify Admin API plugin — cost-metered GraphQL sub-client

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-shopify ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import shopify from "@dianemo/plugin-shopify";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(shopify);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("shopify", {
  // which shop this token belongs to
  instanceId: "acme-store",
  // the shop domain only — no scheme, no path; the plugin appends the Admin API paths
  baseUrl: "acme-store.myshopify.com",
  token: process.env.SHOPIFY_ACCESS_TOKEN!,
});

// "shopify:_:acme-store" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("shopify", { instanceId: "acme-store" });

const orders = await requests.shopify.orders.getMany(account, {
  query: "fulfillment_status:unfulfilled",
});
```

Requests are grouped by resource — `orders`, `inventory`, `customers`, and so on. Pass the account
name; each request addresses the `:graph-ql` sub-client beneath it, which is where the budget lives.

## Rate limiting and query cost

Shopify meters the Admin GraphQL API in cost points, not requests, so every function here declares
what its query will be charged and spends that from the shared bucket.

The bucket starts at Shopify's [published](https://shopify.dev/docs/api/usage/limits) Standard-plan
restore rate of 100 points/second, with a 1,000-point capacity. Shopify does not publish per-plan
bucket capacities, so that second number is inferred from its documented ceiling on a single query;
it is replaced by whatever the shop actually reports in `extensions.cost.throttleStatus` on its
first response, so an Advanced, Plus or enterprise shop runs on its own real budget from then on
without configuration.

Two consequences worth knowing about:

- **List depth is bounded by cost, not by preference.** Shopify refuses any single query costing
  more than 1,000 points, on every plan. A fully detailed order costs 549, so `orders.getMany`
  reads five per page with nested collections ten deep; read one order in full with `orders.getOne`.
  Asking for more than the ceiling allows fails before the request is sent, naming the client,
  rather than coming back `MAX_COST_EXCEEDED`.
- **Throttling is retried, not surfaced.** Shopify answers a throttled query with HTTP 200 and a
  body-level `THROTTLED` error. This plugin turns that into a 429 inside the transport, so it backs
  off, freezes the client fleet-wide and retries like any other rate limit.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/shopify-api.md`](docs/shopify-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
