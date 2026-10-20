# @dianemo/plugin-amazon-spapi

Amazon Selling Partner API plugin — multi-region, multi-marketplace, with per-region rate limits

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-amazon-spapi ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import amazonSpapi from "@dianemo/plugin-amazon-spapi";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(amazonSpapi);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("amazonSpapi", {
  // your selling partner id — SP-API puts it in several request paths, so the plugin reads it back out of the client name
  instanceId: "A1B2C3D4E5F6G7",
  baseUrl: "https://api.amazon.com",
  // the Login-with-Amazon host that issues tokens; the SP-API host per region is built in
  clientId: process.env.AMAZON_CLIENT_ID!,
  clientSecret: process.env.AMAZON_CLIENT_SECRET!,
});

// "amazonSpapi:_:A1B2C3D4E5F6G7" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("amazonSpapi", {
  instanceId: "A1B2C3D4E5F6G7",
});

// SP-API authenticates as the seller, not as your application: the seller
// authorizes it once and the authorization code is exchanged for a refresh
// token. Do this once per seller.
const grant = await requests.amazonSpapi.getRefreshToken({
  // The `spapi_oauth_code` Amazon sends to your redirect URI on authorization.
  code: process.env.AMAZON_AUTH_CODE!,
  apiUrl: "https://api.amazon.com",
  redirectUrl: "https://example.com/oauth/amazon",
  clientId: process.env.AMAZON_CLIENT_ID!,
  clientSecret: process.env.AMAZON_CLIENT_SECRET!,
});

// Seed it on the account client, not on a region or endpoint client: those are
// its sub-clients, so they read this one grant and one refresh serves them all.
// The grant is the seller, so its id is the client name's `instanceId` segment —
// the selling partner id every request function authenticates as.
await handler.setGrantTokens(account, "A1B2C3D4E5F6G7", {
  accessToken: grant.access_token,
  expiresAt: Date.now() + grant.expires_in * 1000,
  refreshToken: grant.refresh_token,
  // Amazon does not state a refresh-token expiry, and 0 records that as
  // unstated: the stored grant then keeps the backend's default retention,
  // which each successful refresh renews.
  refreshTokenExpiresAt: 0,
});

const orders = await requests.amazonSpapi.getOrders(account, "us-east-1", {
  MarketplaceIds: "ATVPDKIKX0DER",
  CreatedAfter: "2026-01-01T00:00:00Z",
});

// `pii: true` asks for the buyer's name and shipping address. That call goes out
// on a restricted data token minted for exactly this path and set of elements,
// which is the only way Amazon returns the fields at all.
const withPii = await requests.amazonSpapi.getOrders(
  account,
  "us-east-1",
  { MarketplaceIds: "ATVPDKIKX0DER" },
  true
);
```

Under the account client the template registers one sub-client per region and endpoint, so every
SP-API endpoint carries its own budget — the published quotas range from one request every two
minutes to twenty per second. Every request function takes the account client name first and the
region second; the endpoint segment, and the restricted-data segment when you ask for PII, are
appended for you.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/amazon-spapi-api.md`](docs/amazon-spapi-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
