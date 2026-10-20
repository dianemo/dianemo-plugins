# `@dianemo/core` behaviour plugins depend on

Findings about core that cost real time to establish, and that more than one plugin
is built around. Each was verified by reading core's shipped `dist/`, at
`@dianemo/core@^2.0.0`. Line references are to that build and will drift; the
quoted code is the durable part.

## `refreshConfig` is deep-copied, so it cannot hold a function

`client/methods/authenticate.js` runs a refresh config's own interceptor against a
`structuredClone` of the object that _contains_ it:

```js
const refreshConfig = baseConfig.requestInterceptor
  ? await baseConfig.requestInterceptor(structuredClone(baseConfig))
  : baseConfig;
```

`structuredClone` cannot clone a function, so any `requestInterceptor` inside
`refreshConfig` throws `DataCloneError` before a single request leaves the
process. The copy is deliberate on core's part — the config is shared by every
grant on the client, and an interceptor writing into `config.data` would corrupt
the `{{…}}` placeholders for all of them.

`requestOptions.requestInterceptor` is a different thing and is safe:
`client/methods/handleRequest.js` calls it on the live `request.config` with no
clone.

**Consequence for a plugin:** anything per-request in a refresh config has to be a
value minted at template-build time, in `refreshConfig.customHeaders`. Per-request
work belongs in `requestOptions.requestInterceptor`, where `config.requestId` is
available and is a better correlation id than a fresh UUID anyway.

Walmart shipped this bug: it was the only plugin with an interceptor inside
`refreshConfig`, and all 20 of its request functions threw. amazon-spapi's sits in
`requestOptions`, which is why it worked.

## `{{refreshToken}}` cannot bootstrap a client-level refresh

Core substitutes exactly three placeholders — `{{clientId}}`, `{{clientSecret}}`,
`{{refreshToken}}`. Anything else ships to the vendor as a literal.

`{{refreshToken}}` resolves down two different paths depending on whether a
`grantId` is present:

```js
case "{{refreshToken}}": {
    const token = grantId
        ? await fetchGrantRefreshToken.bind(this)(grantId)
        : await fetchClientRefreshToken.bind(this)();
    if (token !== undefined)
        data[key] = token;
    break;
}
```

`fetchClientRefreshToken()` reads `${authNamespace}:oauth2` → `refreshToken`, a key
written **only** by `saveOAuthData` after a successful refresh. No public API seeds
it: `handler.setGrantTokens` writes the _per-grant_ key,
`${authNamespace}:oauth2:${grantId}`.

So on a first refresh with no `grantId` the value is `undefined`, the `case` leaves
`data[key]` untouched, and the literal string `{{refreshToken}}` goes out on the
wire. Core's own comment says as much.

**Consequence for a plugin:** a client-level `refreshConfig` must use a grant that
bootstraps from the credentials alone. `{{refreshToken}}` belongs in
`grantRefreshConfig`, where a `grantId` routes it to the key `setGrantTokens`
actually writes — and request functions then have to carry a `grantId` for that
path to be reachable at all.

channel-advisor shipped this, and `test/auth.test.ts` asserts against it because
two independent attempts at fixing other packages reproduced it.

## The auth header is merged _after_ `requestInterceptor`

An interceptor cannot replace the client's own auth header: core applies the
header afterwards and overwrites whatever the interceptor put there.

This matters wherever a request needs a _different_ credential from the client's —
amazon-spapi's restricted-data tokens, which replace the LWA token in
`x-amz-access-token`. Fixing only the interceptor yields the worst outcome
available: Amazon answers with the unrestricted view, and nothing in the response
says PII was withheld.

The way out is a sub-client that carries no credential of its own.
`client/methods/authenticate.js` opens with:

```js
if (!this.authData) return;
```

and `authData` is assigned straight from `client.authentication`. Sub-client
merging is `{ ...parent, ...child }`, so a child declaring
`authentication: undefined` overrides the parent's block and no header is applied —
leaving the interceptor's token intact. `authOwnerName` only decides which
namespace credentials are _stored_ under, so pointing at the parent for storage
does not reintroduce the header.

## `grantRateLimitBehavior: "shared"` configures nothing

The type is `"shared" | "isolated"`, but core's only runtime reference in the whole
package is:

```js
return auth?.type === "oauth2" && auth.grantRateLimitBehavior === "isolated";
```

`"shared"` is the default expressed as config. Declaring it reads as a decision
that was made and enforced, when nothing enforces it — say it in prose instead.

## Only 429, 5xx and connection resets freeze the fleet

`client/methods/handleRequest.js` arms a freeze for 429, 5xx and
`ECONNRESET`/`ETIMEDOUT`/`ECONNABORTED`. Both retry escape hatches are documented
as explicitly _non_-freezing: `retryStatusCodes` is "retried without freezing the
fleet, unlike a 429 or 5xx", and a retry granted through `retryStatusCodes` or
`retryHandler` "says nothing about the other".

**Consequence for a plugin:** a vendor that signals rate limiting with any other
status cannot get a fleet-wide freeze from plugin code. No plugin in this
catalogue currently hits it.

## `handler.getNamespace()` is the only public read of `keyPrefix`

`keyPrefix` is stored as a `protected namespace` field, built as
`` `${keyPrefix ? `${keyPrefix}:` : ""}requestHandler` ``, but `getNamespace()`
exposes it publicly.

**Consequence for a plugin:** any backend key a plugin writes must be prefixed with
it, or two handlers pointed at one Redis — the usual staging/production split —
share state they should not. `plugin-kit`'s `pluginKey()` exists for this, and the
bug it fixes was real: staging and production contended on the same USPS mint lock
and read each other's cached payment tokens.
