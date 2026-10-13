# @dianemo/plugin-ups

UPS plugin — rating, shipping, and tracking

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-ups ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import ups from "@dianemo/plugin-ups";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(ups);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("ups", {
  instanceId: "main",
  baseUrl: "https://onlinetools.ups.com",
  // sandbox: "https://wwwcie.ups.com"
  clientId: process.env.UPS_CLIENT_ID!,
  clientSecret: process.env.UPS_CLIENT_SECRET!,
  // Your six-character UPS account number, sent as `x-merchant-id` on the token
  // request. Not the same thing as clientId; omit it and the header is omitted.
  merchantId: process.env.UPS_ACCOUNT_NUMBER!,
});

// "ups:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("ups", { instanceId: "main" });

// The shipment identification number `requestShipment` returned. Pass a package
// tracking number as the third argument to void one package instead of the lot.
const voided = await requests.ups.voidShipment(account, "1Z999AA10123456784");
```

`merchantId` is optional but worth setting: UPS reads it to scope the token to
the account being billed, and the header is left off entirely when it is absent
rather than filled with a value that is not an account number.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/ups-api.md`](docs/ups-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
