# @dianemo/plugin-ebay

eBay plugin — inventory and order management

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-ebay ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import ebay from "@dianemo/plugin-ebay";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(ebay);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("ebay", {
  instanceId: "main",
  baseUrl: "https://api.ebay.com",
  // sandbox: "https://api.sandbox.ebay.com"
  clientId: process.env.EBAY_CLIENT_ID!,
  clientSecret: process.env.EBAY_CLIENT_SECRET!,
  // space-delimited OAuth scopes the sellers' grants carry
  scopeList: process.env.EBAY_SCOPES!,
});

// "ebay:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("ebay", { instanceId: "main" });

// Sell Fulfillment answers a user token only, so each seller authorises the
// application once and its grant is seeded under a `grantId` you choose.
//
// `code` is the `?code=` query parameter eBay appends when it redirects the
// seller back to `redirectUri` after they grant consent — read it off that
// request in your redirect handler. It is single-use and short-lived, so
// exchange it straight away rather than storing it.
const code = "<the ?code= parameter eBay redirected back with>";

const tokens = await requests.ebay.exchangeAuthCodeForAccessToken({
  code,
  baseUrl: "https://api.ebay.com",
  clientId: process.env.EBAY_CLIENT_ID!,
  clientSecret: process.env.EBAY_CLIENT_SECRET!,
  // The RuName eBay assigned the application, not a bare URL. The granted
  // scopes come from the consent request the seller approved, so there is
  // nothing to pass here.
  redirectUri: process.env.EBAY_REDIRECT_URI!,
});

await handler.setGrantTokens(account, "seller-42", {
  accessToken: tokens.access_token,
  expiresAt: Date.now() + tokens.expires_in * 1000,
  refreshToken: tokens.refresh_token,
  // In seconds too. eBay's documented example returns 47,304,000 — 18 months.
  refreshTokenExpiresAt: Date.now() + tokens.refresh_token_expires_in! * 1000,
});

const orders = await requests.ebay.getOrders(
  account,
  { grantId: "seller-42" },
  { filters: { creationDate: { min: "2026-01-01T00:00:00.000Z" } } }
);
```

One client serves every seller who authorised the application: the credentials above identify the
application, and `grantId` identifies whose orders are being read. Core renews each grant from its
own refresh token, and all of them draw on one shared budget — eBay meters the Fulfillment API's
Order resource at [100,000 calls per day](https://developer.ebay.com/develop/get-started/api-call-limits),
which this plugin paces at 69/minute rather than letting a backfill spend the day in a quarter of an
hour.

`orderIds` cannot be combined with `filters`, `limit` or `offset` — eBay ignores the rest when
`orderIds` is present, so passing both is refused with `EBY_0003` rather than answering the wrong
question. Fetch the named orders and the filtered page separately.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/ebay-api.md`](docs/ebay-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
