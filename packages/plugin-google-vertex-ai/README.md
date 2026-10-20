# @dianemo/plugin-google-vertex-ai

Google Vertex AI plugin

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-google-vertex-ai ioredis
```

## Setup

A service account is the credential this API is built around, and the only one
that can obtain a first token from what you register — Google's token endpoint
has no `client_credentials` grant. Take `client_email` and `private_key` from
the service-account JSON key and grant the account
`roles/discoveryengine.viewer` on the project that owns the engine, or
`roles/discoveryengine.editor` if you also write session state.

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import googleVertexAi from "@dianemo/plugin-google-vertex-ai";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(googleVertexAi);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("googleVertexAi", {
  instanceId: "main",
  baseUrl: `https://discoveryengine.googleapis.com/v1/projects/${process.env.GCP_PROJECT}/locations/global/collections/default_collection/engines/${process.env.VERTEX_APP_ID}`,
  // request paths are relative to one engine, so the engine path belongs in baseUrl
  serviceAccountEmail: process.env.VERTEX_SERVICE_ACCOUNT_EMAIL!,
  privateKey: process.env.VERTEX_PRIVATE_KEY!,
});

// "googleVertexAi:_:main" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("googleVertexAi", { instanceId: "main" });

const session = await requests.googleVertexAi.createSession(
  account,
  "user-42",
  {}
);

const answer = await requests.googleVertexAi.getAnswer(
  account,
  "What is our return policy?",
  {},
  // getAnswer wants the fully-qualified session name, which is what createSession
  // returns. updateSessionState takes either that or the bare trailing id.
  session.name
);
```

That flow runs as written — nothing to seed first. The plugin signs a fresh
JWT-bearer assertion for each token refresh and exchanges it at
`https://oauth2.googleapis.com/token`.

`privateKey` is the PEM straight out of the JSON key. Escaped newlines are
handled, so passing it through an env var works without unescaping it yourself.

## Adding per-user delegated calls

Register `clientId` and `clientSecret` **alongside** the service account to also
authenticate as a user rather than as the project. They are additive, not a
replacement: an OAuth client on its own cannot mint a first token.

Dianemo does not run Google's consent screen, so each grant's tokens have to be
seeded before its first call — otherwise that call throws
`GrantRefreshTokenMissingError` before any HTTP happens. Run the
authorization-code flow yourself, then hand dianemo what it returned:

```ts
await handler.addTemplateClient("googleVertexAi", {
  instanceId: "main",
  baseUrl: `https://discoveryengine.googleapis.com/v1/projects/${process.env.GCP_PROJECT}/locations/global/collections/default_collection/engines/${process.env.VERTEX_APP_ID}`,
  serviceAccountEmail: process.env.VERTEX_SERVICE_ACCOUNT_EMAIL!,
  privateKey: process.env.VERTEX_PRIVATE_KEY!,
  clientId: process.env.VERTEX_CLIENT_ID!,
  clientSecret: process.env.VERTEX_CLIENT_SECRET!,
});

const account = buildClientName("googleVertexAi", { instanceId: "main" });

// The token response from your own authorization-code exchange.
declare const consent: {
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

// Google's refresh tokens do not expire on a clock, so park the expiry far out
// and let a revoked token surface as an `invalid_grant` from the token endpoint.
await handler.setGrantTokens(account, "support-bot", {
  accessToken: consent.access_token,
  expiresAt: Date.now() + consent.expires_in * 1000,
  refreshToken: consent.refresh_token,
  refreshTokenExpiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
});

// Naming a grant authenticates as that user; omitting it uses the service account.
const answer = await requests.googleVertexAi.getAnswer(
  account,
  "What is our return policy?",
  { grantId: "support-bot" }
);
```

Tokens are cached per `grantId`, so several delegated users can share one
account's rate limit without sharing a token. Seed each one with its own
`setGrantTokens` call.

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/vertex-ai-api.md`](docs/vertex-ai-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
