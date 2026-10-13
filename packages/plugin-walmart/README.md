# @dianemo/plugin-walmart

Walmart Marketplace plugin — items, orders, and fulfillment

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-walmart ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import walmart from "@dianemo/plugin-walmart";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(walmart);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("walmart", {
  instanceId: "main",
  baseUrl: "https://marketplace.walmartapis.com",
  // sandbox: "https://sandbox.walmartapis.com"
  clientId: process.env.WALMART_CLIENT_ID!,
  clientSecret: process.env.WALMART_CLIENT_SECRET!,
  // sent as WM_PARTNER.ID when refreshing the token
  partnerId: process.env.WALMART_PARTNER_ID!,
});

// "walmart:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("walmart", { instanceId: "main" });

const items = await requests.walmart.getItems(account, { limit: 20 });
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/walmart-api.md`](docs/walmart-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
