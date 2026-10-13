# @dianemo/plugin-wayfair

Wayfair plugin — dropship purchase orders

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-wayfair ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import wayfair from "@dianemo/plugin-wayfair";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(wayfair);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("wayfair", {
  instanceId: "main",
  baseUrl: "https://api.wayfair.com/v1/graphql",
  // sandbox: "https://sandbox.api.wayfair.com/v1/graphql"
  clientId: process.env.WAYFAIR_CLIENT_ID!,
  clientSecret: process.env.WAYFAIR_CLIENT_SECRET!,
});

// "wayfair:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("wayfair", { instanceId: "main" });

// `page` is 1-based, 100 rows a page.
const inventory = await requests.wayfair.getInventory(account, 1);

const orders = await requests.wayfair.getOrders(account, {
  limit: 50,
  fromDate: "2026-01-01",
});
```

Tokens come from Wayfair's central SSO host, so `baseUrl` only has to point at the API. The token's
audience is taken from `baseUrl`'s host root — `https://api.wayfair.com/`, the same value Wayfair's
own [supplier plugin](https://github.com/wayfair-contribs/plentymarkets-plugin) sends; pointing
`baseUrl` at the sandbox moves the audience with it.

`fromDate` and `toDate` bound `poDate` through Wayfair's `filters` list. The lower bound matches what
Wayfair's own client sends; the upper bound uses `lessThanOrEqualTo`, which is attested only by
schema types generated from introspection, so verify it against your own account before relying on
it — if Wayfair rejects it you get the GraphQL error, not a silently unbounded page.

Wayfair answers a rejected query with HTTP 200 and a body carrying `errors`. Those come back as a
`RequestError` whose `metadata.errors` holds Wayfair's own messages, rather than as a null field on a
response that looked successful.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/wayfair-api.md`](docs/wayfair-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
