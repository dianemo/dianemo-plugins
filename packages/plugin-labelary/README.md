# @dianemo/plugin-labelary

Labelary plugin — ZPL label rendering

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-labelary ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import labelary from "@dianemo/plugin-labelary";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(labelary);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("labelary", {
  instanceId: "main",
  baseUrl: "https://api.labelary.com/v1",
});

// "labelary:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("labelary", { instanceId: "main" });

const png = await requests.labelary.convertZPL(account, {
  label: "^XA^FO50,50^ADN,36,20^FDHello^FS^XZ",
  format: "image/png",
  dpi: 8,
  width: 4,
  height: 6,
});
```

Labelary needs no credentials. The template exists to give its calls a shared rate limit, and `instanceId` just names the client.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/labelary-api.md`](docs/labelary-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
