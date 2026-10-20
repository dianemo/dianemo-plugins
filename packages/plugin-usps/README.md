# @dianemo/plugin-usps

USPS plugin — labels, pickups, and payment-token caching

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-usps ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import usps from "@dianemo/plugin-usps";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(usps);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("usps", {
  instanceId: "main",
  baseUrl: "https://apis.usps.com",
  // sandbox: "https://apis-tem.usps.com"
  clientId: process.env.USPS_CLIENT_ID!,
  clientSecret: process.env.USPS_CLIENT_SECRET!,
  // Customer Registration Identifier — identifies the business
  crid: process.env.USPS_CRID!,
  // Mailer Identifier, used in the PAYER and LABEL_OWNER roles
  mid: process.env.USPS_MID!,
});

// "usps:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("usps", { instanceId: "main" });

const rates = await requests.usps.getBaseRatesList(account, {
  originZIPCode: "38116",
  destinationZIPCode: "90210",
  weight: 5,
  length: 12,
  width: 9,
  height: 3,
  priceType: "COMMERCIAL",
  mailClass: "USPS_GROUND_ADVANTAGE",
});
```

Label purchases need a payment token USPS mints per account. The plugin caches it through the handler's backend, so one process mints it and the rest reuse it rather than each minting their own. The cached token is tied to the credentials that minted it, so rotating a secret or correcting an account type mints a new one rather than reusing the old. If USPS refuses a token before it expires, call `clearCachedPaymentToken(account, accountNumber)` and retry — that is the only eviction path short of the seven-hour TTL.

## Rate limits

USPS meters per API, and the only quota it publishes — [60 calls per hour](https://devs.usps.com/getting-started) — covers a default product that excludes Labels and Payments. So the account's client is split into two metered sub-clients, mirroring how USPS actually meters:

| client                | paced at               | endpoints                                   |
| --------------------- | ---------------------- | ------------------------------------------- |
| `usps:_:main`         | unmetered, no requests | owns the OAuth token both sub-clients share |
| `usps:_:main:default` | 60/hour, one at a time | addresses, rates, tracking, pickups         |
| `usps:_:main:labels`  | 10/s                   | labels, payments                            |

Request functions append their own segment, so keep passing the account name (`usps:_:main`) — you never write `:labels` yourself.

The 60/hour is USPS's published figure. The 10/s is **not**: USPS publishes no quota for Labels or Payments, which sit behind USPS Ship enrolment and an Enterprise Payment Account. Treat it as a working default, confirm your real quota with USPS, and set it without forking the plugin:

```ts
await handler.addTemplateClient(
  "usps",
  { instanceId: "main" /* … */ },
  // Keyed by sub-client; the type must stay "requestLimit"
  {
    labels: {
      type: "requestLimit",
      interval: 1000,
      tokensToAdd: 25,
      maxTokens: 25,
    },
  }
);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/usps-api.md`](docs/usps-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
