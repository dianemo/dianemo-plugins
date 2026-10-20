# @dianemo/plugin-newegg

Newegg plugin — Newegg and Newegg Business marketplaces

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-newegg ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import newegg from "@dianemo/plugin-newegg";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(newegg);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("newegg", {
  instanceId: "main",
  baseUrl: "https://api.newegg.com/marketplace",
  token: process.env.NEWEGG_TOKEN!,
  secretKey: process.env.NEWEGG_SECRET_KEY!,
  sellerId: process.env.NEWEGG_SELLER_ID!,
});

// "newegg:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("newegg", { instanceId: "main" });

const orders = await requests.newegg.getOrders(account, {
  RequestCriteria: { OrderDownloaded: 0 },
});
```

Newegg Business is a second template — register it as `neweggBusiness` with `baseUrl: "https://api.newegg.com/marketplace/b2b"`, build its name the same way, and pass that name instead. The two marketplaces are metered separately.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/newegg-api.md`](docs/newegg-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
