# @dianemo/plugin-channel-advisor

ChannelAdvisor plugin — listings, orders, and fulfillment

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-channel-advisor ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import channelAdvisor from "@dianemo/plugin-channel-advisor";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(channelAdvisor);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("channelAdvisor", {
  instanceId: "main",
  baseUrl: "https://api.channeladvisor.com",
  clientId: process.env.CHANNEL_ADVISOR_CLIENT_ID!,
  clientSecret: process.env.CHANNEL_ADVISOR_CLIENT_SECRET!,
});

// "channelAdvisor:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("channelAdvisor", { instanceId: "main" });

// ChannelAdvisor authenticates with a refresh token, not client credentials: the
// account authorizes the application once and the authorization code is
// exchanged for a refresh token that does not expire. Do this once per set of
// credentials — one authorization can cover several profiles, and a call that
// names none returns all of them aggregated.
const grant = await requests.channelAdvisor.getGrantToken({
  // The `code` ChannelAdvisor sends to your redirect URI when the account
  // approves the application.
  code: process.env.CHANNEL_ADVISOR_AUTH_CODE!,
  baseUrl: "https://api.channeladvisor.com",
  clientId: process.env.CHANNEL_ADVISOR_CLIENT_ID!,
  clientSecret: process.env.CHANNEL_ADVISOR_CLIENT_SECRET!,
  redirectUri: "https://example.com/oauth/channel-advisor",
});

// The grant is the account, so its id is the client name's `instanceId` segment
// — that is what every request function authenticates as, and nothing else is
// stored for the client to fall back on.
await handler.setGrantTokens(account, "main", {
  accessToken: grant.access_token,
  expiresAt: Date.now() + grant.expires_in * 1000,
  refreshToken: grant.refresh_token,
  // ChannelAdvisor states no refresh-token expiry — the token is issued once
  // and is not regenerated on later authorizations — and 0 records that as
  // unstated: the stored grant then keeps the backend's default retention,
  // which each successful refresh renews.
  refreshTokenExpiresAt: 0,
});

const orders = await requests.channelAdvisor.getOrders(account);

// Unexported orders only — the import queue. `getAllExportedOrders` is its
// complement, and `getOrders` leaves the export flag to you.
const toImport = await requests.channelAdvisor.getAllUnexportedOrders(account);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/channel-advisor-api.md`](docs/channel-advisor-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
