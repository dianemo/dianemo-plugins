# @dianemo/plugin-extensiv

Extensiv (3PL Central) plugin — multi-warehouse inventory and orders

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-extensiv ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import extensiv from "@dianemo/plugin-extensiv";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(extensiv);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("extensiv", {
  instanceId: "main",
  baseUrl: "https://secure-wms.com",
  clientId: process.env.EXTENSIV_CLIENT_ID!,
  clientSecret: process.env.EXTENSIV_CLIENT_SECRET!,
  // the 3PL Central user the token is issued for
  userLogin: process.env.EXTENSIV_USER_LOGIN!,
});

// "extensiv:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("extensiv", { instanceId: "main" });

const orders = await requests.extensiv.getOrders(account);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/extensiv-api.md`](docs/extensiv-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
