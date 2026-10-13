# @dianemo/plugin-google

Google APIs plugin

A plugin for [dianemo](https://github.com/dianemo/dianemo), which distributes one API rate limit
across every process that draws on it.

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-google ioredis
```

## Setup

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import google from "@dianemo/plugin-google";
import { Redis } from "ioredis";

const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(google);

// Credentials are encrypted into the backend, so every process pointed at this
// Redis rebuilds the same client and draws on one shared budget.
await handler.addTemplateClient("google", {
  instanceId: "main",
  // The profile sub-client's host.
  baseUrl: "https://www.googleapis.com",
  // A Google Cloud API key, sent as `?key=`. This is what Address Validation
  // takes for server-to-server use.
  apiKey: process.env.GOOGLE_API_KEY!,
  // Optional; defaults to "https://addressvalidation.googleapis.com".
  // addressValidationBaseUrl: "https://addressvalidation.googleapis.com",
});

// "google:_:main" — <template>:<organizationId | "_">:<instanceId>. Pass the
// account name as it comes out of buildClientName: each request routes itself
// to the sub-client it belongs on.
const client = buildClientName("google", { instanceId: "main" });

const validated = await requests.google.validateAddress(client, {
  address: {
    regionCode: "US",
    addressLines: ["1600 Amphitheatre Pkwy"],
    locality: "Mountain View",
    administrativeArea: "CA",
    postalCode: "94043",
  },
});
```

Beneath the account client the template registers a sub-client per host —
`addressValidation` and `profile` — because they are different hosts with different quotas. You
never name one: `validateAddress` and `getGoogleProfile` each append their own segment, so passing
the account name is always right.

## Credentials

Give the account an `apiKey`, a `clientId`/`clientSecret` pair, or both. A registration carrying
neither is refused, because every request on it would come back 401.

| Credential                  | Serves                                                                  |
| --------------------------- | ----------------------------------------------------------------------- |
| `apiKey`                    | Address Validation, with no user in the loop.                           |
| `clientId` + `clientSecret` | `getGoogleProfile`, and Address Validation on a signed-in user's token. |

There is no client-credentials path.
[Google's discovery document](https://accounts.google.com/.well-known/openid-configuration) lists
four grant types — `authorization_code`, `refresh_token`, `device_code` and `jwt-bearer` — so the
token endpoint answers `unsupported_grant_type` before it looks at the credentials, and a client
built on that grant can never authenticate. Google's own server-to-server credential is a
[service account](https://developers.google.com/identity/protocols/oauth2/service-account), whose
JWT assertion expires "a maximum of 1 hour after the issued time" and so has to be re-signed for
every refresh; dianemo 1.0.0 has no working hook for that, which leaves an API key as the
key-in-hand path today.

## Calling as a signed-in user

`getGoogleProfile` reads the OpenID Connect userinfo endpoint, which only accepts a user's token.
Exchange the authorization code your callback receives, seed the resulting refresh token as a grant
on the **account** client — one seeding covers both sub-clients — then name that grant on the call:

```ts
const { refresh_token, access_token, expires_in } =
  await requests.google.exchangeAuthCodeForRefreshToken({
    code: authorizationCode,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "https://example.com/oauth/google/callback",
  });

// Google only issues one when the consent request asked for offline access.
if (!refresh_token) throw new Error("Google returned no refresh token");

// `grantId` is your own identifier for the user. Google's own `sub` works, and
// is a 21-digit string rather than a number.
const grantId = "117253196834402457531";

await handler.setGrantTokens(client, grantId, {
  accessToken: access_token,
  expiresAt: Date.now() + expires_in * 1000,
  refreshToken: refresh_token,
  // Google gives no expiry for a user refresh token, so pick a horizon. Six
  // months matches the documented inactivity rule ("the refresh token has not
  // been used for six months"); use 7 days instead while your OAuth consent
  // screen is still in Testing, which is how long tokens issued then last.
  refreshTokenExpiresAt: Date.now() + 182 * 24 * 60 * 60 * 1000,
});

const profile = await requests.google.getGoogleProfile(client, grantId);

// Address Validation on the user's token instead of an API key.
await requests.google.validateAddress(
  client,
  { address: { regionCode: "US", addressLines, locality, postalCode } },
  { grantId }
);
```

Register another account by calling `addTemplateClient` again with a different `instanceId`. Pass
`organizationId` alongside it in a multi-tenant deployment: it becomes the second segment of the
client name, keeping each tenant's credentials and budget separate.

**API notes.** The rate-limit evidence behind this package's calibration, the wire quirks
it works around, and the questions still open are in
[`docs/google-api.md`](docs/google-api.md) — it ships with the package.

See [dianemo-plugins](https://github.com/dianemo/dianemo-plugins) for the full catalogue.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
