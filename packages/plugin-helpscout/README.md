# @dianemo/plugin-helpscout

Help Scout plugin — conversation reads

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-helpscout ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import helpscout from "@dianemo/plugin-helpscout";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(helpscout);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("helpscout", {
  instanceId: "main",
  baseUrl: "https://api.helpscout.net",
  clientId: process.env.HELPSCOUT_CLIENT_ID!,
  clientSecret: process.env.HELPSCOUT_CLIENT_SECRET!,
});

// "helpscout:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("helpscout", { instanceId: "main" });

const conversation = await requests.helpscout.getConversationWithThreads(
  account,
  1234567
);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

## Scope

Conversation reads only — `getConversation`, `getConversationWithThreads` and
`getConversationThreads`. No customer, mailbox or write endpoints in this version.

`getConversationWithThreads` returns Help Scout's **truncated** embedded thread list: the API caps
it and does not paginate it, so a 60-thread conversation can come back with a handful. Compare
`_embedded.threads.length` against the conversation's `threads` count, and page through
`getConversationThreads` when you need all of them:

```ts
const threads = [];
let page = 1;
let totalPages = 1;

do {
  const res = await requests.helpscout.getConversationThreads(
    account,
    1234567,
    page
  );
  threads.push(...res._embedded.threads);
  totalPages = res.page.totalPages;
  page += 1;
} while (page <= totalPages);
```

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/helpscout-api.md`](docs/helpscout-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
