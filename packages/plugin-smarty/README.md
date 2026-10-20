# @dianemo/plugin-smarty

Smarty plugin — US and international address validation

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-smarty ioredis
```

## Setup

```ts
import RequestHandler from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import smarty from "@dianemo/plugin-smarty";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(smarty);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("smarty", {
  instanceId: "main",
  baseUrl: "https://us-street.api.smarty.com",
  // informational: each sub-client pins its own host
  authId: process.env.SMARTY_AUTH_ID!,
  authToken: process.env.SMARTY_AUTH_TOKEN!,
});

const [candidate] = await requests.smarty.verifySmartyUs(
  { street: "1600 Amphitheatre Pkwy", city: "Mountain View", state: "CA" },
  { organizationId: null, alias: "main" }
);
```

The US and international APIs are separate sub-clients sharing one budget. Requests take an options object instead of a client name; `alias` is the `instanceId` you registered, defaulting to `"production"`.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/smarty-api.md`](docs/smarty-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
