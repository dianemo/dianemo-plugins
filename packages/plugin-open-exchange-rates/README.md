# @dianemo/plugin-open-exchange-rates

Open Exchange Rates plugin — currency conversion rates

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-open-exchange-rates ioredis
```

## Setup

```ts
import RequestHandler from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import openExchangeRates from "@dianemo/plugin-open-exchange-rates";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(openExchangeRates);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("openExchangeRates", {
  instanceId: "main",
  baseUrl: "https://openexchangerates.org",
  token: process.env.OXR_APP_ID!,
});

const latest = await requests.openExchangeRates.getLatestRates(
  { alias: "main" },
  { base: "USD", symbols: "EUR,GBP,NZD" }
);
```

Requests take an options object instead of a client name. `alias` is the `instanceId` you registered, and defaults to `"production"` when omitted.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/open-exchange-rates-api.md`](docs/open-exchange-rates-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
