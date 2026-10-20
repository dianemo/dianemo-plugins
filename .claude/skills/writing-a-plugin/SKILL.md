---
name: writing-a-plugin
description: How to add a new plugin package to dianemo-plugins — the file layout, the definePlugin entry, the client template and its auth block, request functions, the repo-wide files a new package must be added to, and the checks that catch the mistakes local correctness misses. Use when adding a plugin for a new API, scaffolding a package under packages/, or reviewing a newly added plugin. For style within a file see typescript-conventions; for the checks before committing see pre-commit-checks.
---

# Writing a plugin

One published package per external API. `packages/plugin-fedex` is the reference
implementation — the v1.0.0 validation called it the strongest package in the
catalogue, and copying its shape is the fastest way to get this right.

Read `typescript-conventions` for style within a file. This skill is about the package.

## Before you write anything: three vendor questions

Answer these first, because each one changes the shape of the whole package and all
three are expensive to change after publish.

1. **What grant does the vendor's token endpoint actually accept, and can it bootstrap
   from a client id and secret alone?** If it cannot — Google is the case — a
   client-level `refreshConfig` is impossible and you need an API key or a
   service-account assertion. Record the answer in `/docs/oauth-grants.md` with a
   citation.
2. **What is the published rate limit, what window does it use, and what is it scoped
   to?** Per project, per account, per API, per endpoint. This decides whether one
   bucket is even the right _shape_. Write the evidence into the package's own
   `docs/<name>-api.md` and cite the URL and the date checked.
3. **Does the vendor meter different endpoint families differently?** If so the plugin
   needs sub-clients, and that is much cheaper to build now than to retrofit — USPS had
   to be split because one bucket could not honestly serve both a documented 60/hour
   product and an unpublished labels quota.

## Layout

```
packages/plugin-<name>/
  LICENSE                  copy verbatim from any sibling
  NOTICE                   copy verbatim from any sibling
  README.md                see "The README compiles" below
  package.json             see "package.json" below
  tsconfig.json            3 lines, copy verbatim
  docs/
    <name>-api.md          the vendor findings — rate-limit evidence, wire quirks
  src/
    index.ts               definePlugin + type re-exports; no logic
    client.ts              registerTemplate — the rate limit and auth live here
    requests/
      index.ts             export * from each family
      types.ts             types shared across families
      <family>/
        index.ts           the request functions for that family
        types.ts           that family's wire shapes
```

`tsconfig.json` is always exactly:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist", "rootDir": "./src" },
  "include": ["src/**/*"]
}
```

## `src/index.ts`

```ts
import { bindTryHandleRequest } from "@dianemo/plugin-kit";
import { registerAcmeTemplate } from "./client.js";
import * as requests from "./requests/index.js";
import { definePlugin } from "@dianemo/core";

export default definePlugin({
  name: "acme",
  registerTemplate: registerAcmeTemplate,
  createRequests: (ctx) => {
    bindTryHandleRequest(ctx);
    return requests;
  },
});

export { registerAcmeTemplate } from "./client.js";
export * from "./requests/index.js";
export * from "./requests/<family>/types.js"; // one per family
```

`name` must be a single segment with **no colon** — it becomes the first segment of
every client name, so a colon shifts every later segment. It is also the key credentials
are filed under, and the namespace `handler.use()` returns.

`bindTryHandleRequest(ctx)` is what wires the request functions to the handler. Without
it every call throws "called before registration".

The type re-exports matter: without them a caller cannot name the payload they are
building. Where two families define the same name with different shapes, export the
general one from the barrel and leave the other on its own module path.

## `src/client.ts`

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import {
  CreateClientData,
  OAuth2Credentials,
} from "@dianemo/core/client/types";

declare module "@dianemo/core" {
  interface ClientTemplates {
    acme: OAuth2Credentials;
  }
}

export async function registerAcmeTemplate(handler: RequestHandler) {
  await handler.registerClientTemplate("acme", (creds): CreateClientData[] => [
    {
      name: buildClientName("acme", creds),
      rateLimit: [
        {
          type: "requestLimit",
          interval: 60_000,
          tokensToAdd: 60,
          maxTokens: 60,
        },
      ],
      requestOptions: { defaults: { baseURL: creds.baseUrl } },
      authentication: {/* see below */},
    },
  ]);
}
```

The `declare module` augmentation is what types `addTemplateClient("acme", { … })` for
the caller. Without it they get `never`.

`buildClientName("acme", creds)` yields `acme:<organizationId | "_">:<instanceId>`.
Never build that string by hand.

### The rate limit

`maxTokens === tokensToAdd` unless you have a specific reason otherwise. A bucket starts
full, so `maxTokens: 5000` with `tokensToAdd: 1` lets a cold replica fire 5,000 requests
instantly — which shipped in two packages.

An hourly cap is expressed as a paced per-minute or per-second interval, not one big
hourly bucket: 500/hour is `interval: 7200, tokensToAdd: 1`. A daily quota burned in the
first ten minutes then fails until midnight, which is worse than being slower.

`noLimit` is allowed but must be a decision someone wrote down. `test/auth.test.ts`
fails a leaf client that declares no `rateLimit` at all, because silently defaulting to
unmetered is a rate-limiting library not doing its job.

### The auth block

Only three placeholders are substituted: `{{clientId}}`, `{{clientSecret}}`,
`{{refreshToken}}`. Anything else reaches the vendor as a literal.

**`{{refreshToken}}` must not appear in a client-level `refreshConfig`.** At the client
level it resolves through a key that is only written _after_ a successful refresh, and
nothing public seeds it — so the literal ships. It belongs in `grantRefreshConfig`,
where a `grantId` routes it to the key `setGrantTokens` writes. See
`docs/core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh`. This
shipped as a blocker once and was re-introduced twice while being fixed elsewhere;
`test/auth.test.ts` asserts against it.

**Never put a `requestInterceptor` inside `refreshConfig`.** Core deep-copies that object
with `structuredClone`, which cannot clone a function, so every request in the package
throws `DataCloneError` before any HTTP. Per-request work goes in
`requestOptions.requestInterceptor`, which is not cloned and where `config.requestId` is
available. See `docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function`.

If a request needs a _different_ credential from the client's, the auth header cannot be
replaced by an interceptor — core merges it afterwards. Use a sub-client declaring
`authentication: undefined`. See
`docs/core-behaviour.md#the-auth-header-is-merged-after-requestinterceptor`.

Do not declare `grantRateLimitBehavior: "shared"`. It is the default and configures
nothing.

### Sub-clients

Return one parent with `subClients` rather than several flat top-level clients. Core
joins names with `:`, so leaf names come out identical either way — but a flat layout
gives every leaf its own auth namespace and leaves no account-level name for
`setGrantTokens` to target. amazon-spapi shipped 528 flat clients and a refresh token
had nowhere to go.

A parent that only owns auth for its children needs no `baseURL`. Every **leaf** needs
one, and needs its own rate limit.

## Request functions

```ts
export const cancelShipment = async (
  clientName: string,
  data: AcmeCancelRequest
): Promise<AcmeCancelResponse> => {
  const res = await tryHandleRequest<AcmeCancelResponse>(
    {
      clientName,
      requestName: "acme.shipping.cancelShipment",
      method: "PUT",
      url: "/ship/v1/shipments/cancel",
      data,
    },
    "ACM_0001",
    "Failed to cancel Acme shipment"
  );
  return res.data;
};
```

- `clientName` **first**, always.
- `requestName` is `<plugin>.<family>.<function>` and must use the plugin's own name —
  amazon-spapi used `amazon.*` against a template called `amazonSpapi`, the only package
  in the catalogue whose metric labels did not match itself.
- Each distinct failure gets its own error code — a three-letter prefix unique to the
  package plus four digits. See `typescript-conventions`.

## `package.json`

Copy a sibling's and change the name, description, keywords and `repository.directory`.
The parts that are not obvious:

```json
"peerDependencies": {
  "@dianemo/core": "^2.0.0",
  "@dianemo/plugin-kit": "^2.0.0"
}
```

Both are **peer** dependencies, never regular ones. `plugin-kit` holds process-global
singleton state, so a second copy in `node_modules` would mean two bindings; a peer is
single-copy by construction.

Anything you need only for types goes in `devDependencies` — type-only imports are
elided at build, and `verify:pack` fails a declared dependency that is never imported.

```json
"files": ["LICENSE", "NOTICE", "README.md", "dist", "src"]
```

**Do not hand-write the `exports` map.** Run `npm run exports`; it is generated from the
files on disk. See `docs/package-exports.md`.

## The README compiles

`npm run verify:readme` extracts each README's **first ```ts block** and type-checks it
against the built package. Follow a sibling's structure: title, one-line description,
the install line, a `## Setup` block that constructs a handler, calls
`addTemplateClient`, builds a client name with `buildClientName`, and makes one real
request. An example that drifts from a signature fails the build.

## The repo-wide files a new plugin must be added to

**This is the part local correctness will not catch.** Three test files carry
hard-coded counts and per-plugin cases:

| File                              | What to add                                                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test/allPlugins.test.ts`         | bump `expect(pluginDirs.length).toBe(21)`                                                                                                           |
| `test/requestClientNames.test.ts` | a `CASES` entry driving one real request function, and bump `expect(CASES.length).toBe(21)`                                                         |
| `test/auth.test.ts`               | a `CASES` entry with plausible credentials; its "covers every plugin package" test compares against the directory listing, so a missing entry fails |
| `README.md`                       | a row in the catalogue table                                                                                                                        |
| `docs/<name>-api.md`              | in the **package**: the rate-limit evidence and any wire quirks; add `"docs"` to its `files`                                                        |
| `/docs/oauth-grants.md`           | an `ACCEPTED_GRANTS` entry with a citation, if it is an OAuth plugin                                                                                |

A plugin with no request functions — one that registers a client and a rate limit
and lets callers drive it through the handler's generic surface — is exempt from
`requestClientNames.test.ts`. Note why in that file's coverage test rather than
silently skipping it. No plugin in the catalogue is currently exempt.

## Finishing

Run the `pre-commit-checks` skill. In particular `npm run exports` (the new package's
map does not exist yet) and `npm run verify:pack` (which is the only thing that proves
the package works as published rather than as the repo sees it).
