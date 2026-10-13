# @dianemo/plugin-unis

UNIS plugin — warehouse receipts and outbound orders

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-unis ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import unis from "@dianemo/plugin-unis";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(unis);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("unis", {
  instanceId: "main",
  baseUrl: "https://wise.logisticsteam.com/v2/shared/bam/v1/public",
  // sandbox: "https://preview.logisticsteam.com/shared/bam/v1/public"
  username: process.env.UNIS_USERNAME!,
  password: process.env.UNIS_PASSWORD!,
  // UNIS scopes every call by company and customer, so
  companyId: process.env.UNIS_COMPANY_ID!,
  // the plugin injects both into each request body
  customerId: process.env.UNIS_CUSTOMER_ID!,
});

// "unis:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("unis", { instanceId: "main" });

const orders = await requests.unis.getOrdersHeadLevel(account, {
  FacilityID: "123",
  UpdatedWhenFrom: new Date("2026-01-01"),
});
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/unis-api.md`](docs/unis-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
