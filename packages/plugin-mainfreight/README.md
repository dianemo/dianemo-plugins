# @dianemo/plugin-mainfreight

Mainfreight plugin — freight and warehousing

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-mainfreight ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import mainfreight, { MainfreightRegion } from "@dianemo/plugin-mainfreight";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(mainfreight);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("mainfreight", {
  instanceId: "main",
  baseUrl: "https://api.mainfreight.com",
  // sandbox: "https://apitest.mainfreight.com"
  token: process.env.MAINFREIGHT_TOKEN!,
});

// "mainfreight:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("mainfreight", { instanceId: "main" });

// getOutboundOrder resolves the reference through Mainfreight's tracking
// endpoint, so it answers with tracking records — not an order document.
const tracking = await requests.mainfreight.getOutboundOrder(
  account,
  "WarehousingNZ",
  MainfreightRegion.NEW_ZEALAND,
  "SO-1001"
);
```

Canada has no region code of its own — Mainfreight serves Canadian sites out of `US`, so pass
`MainfreightRegion.UNITED_STATES` for them. An unrecognised region is refused before the request is
dispatched rather than forwarded into the query string.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/mainfreight-api.md`](docs/mainfreight-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
