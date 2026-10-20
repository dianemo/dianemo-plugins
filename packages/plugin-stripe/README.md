# @dianemo/plugin-stripe

Stripe plugin — payment intents, refunds, and webhooks

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-stripe ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import stripe from "@dianemo/plugin-stripe";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(stripe);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("stripe", {
  // the Stripe account this key belongs to, so one client is held per account
  instanceId: "acct_1A2B3C",
  baseUrl: "https://api.stripe.com",
  apiKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
});

// "stripe:_:acct_1A2B3C" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("stripe", { instanceId: "acct_1A2B3C" });

const customer = await requests.stripe.customers.retrieve(account, "cus_123");

// stripeClientName builds the same name straight from a Stripe account id.
const same = requests.stripe.stripeClientName({
  organizationId: null,
  stripeAccountId: "acct_1A2B3C",
});
```

`webhookSecret` is not used by the HTTP client — your webhook receiver reads it back when verifying inbound signatures. It is cached in-process per (organization, account) as the credentials land; clear that entry when an account is offboarded, or a revoked secret keeps being served for the lifetime of the process:

```ts
import { clearStripeCredentialCache } from "@dianemo/plugin-stripe";

await handler.removeTemplateClient("stripe", "acct_1A2B3C");
clearStripeCredentialCache(null, "acct_1A2B3C");
```

The cache is per process, so every replica that built the account's client has to be told.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

## Accounts, not Connect

Each registered credential is one Stripe account's own secret key, and `instanceId` selects which of those keys a request uses. No [`Stripe-Account`](https://docs.stripe.com/connect/authentication) header is sent, so a call always acts as the account that owns the `apiKey` you registered under that `instanceId` — a platform cannot act on behalf of a connected account through this plugin. Register each account's own key to charge that account.

Every request pins [`Stripe-Version: 2022-11-15`](https://docs.stripe.com/api/versioning), exported as `STRIPE_API_VERSION` so a webhook receiver can match it. That is the version this package's response types are written against, so an account upgrading its dashboard default does not change the shapes you get back.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/stripe-api.md`](docs/stripe-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
