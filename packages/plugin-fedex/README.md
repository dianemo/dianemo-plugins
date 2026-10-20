# @dianemo/plugin-fedex

FedEx plugin — shipping, rates, tracking, pickups, and address validation

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-fedex ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import fedex from "@dianemo/plugin-fedex";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(fedex);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("fedex", {
  instanceId: "main",
  baseUrl: "https://apis.fedex.com",
  // sandbox: "https://apis-sandbox.fedex.com"
  clientId: process.env.FEDEX_CLIENT_ID!,
  clientSecret: process.env.FEDEX_CLIENT_SECRET!,
});

// "fedex:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("fedex", { instanceId: "main" });

const cancelled = await requests.fedex.cancelShipment(account, {
  accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER! },
  trackingNumber: "794953555551",
});
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
