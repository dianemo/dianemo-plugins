<p align="center">
  <img src="assets/dianemo-mark.png" alt="dianemo" width="120">
</p>

<h1 align="center">dianemo-plugins</h1>

<p align="center">
  Integration plugins for <a href="https://github.com/dianemo/dianemo">dianemo</a> — one published
  package per external API, each carrying that vendor's rate-limit calibration, auth flow, and typed
  request functions.
</p>

## Install what you use

```bash
npm install @dianemo/core @dianemo/backend-redis @dianemo/plugin-fedex @dianemo/plugin-ups ioredis
```

```ts
import RequestHandler, { buildClientName } from "@dianemo/core";
import { redisBackend } from "@dianemo/backend-redis";
import fedex from "@dianemo/plugin-fedex";
import ups from "@dianemo/plugin-ups";
import { Redis } from "ioredis";

// core 2.0 rejects a key shorter than 32 characters (`key_too_short`)
const handler = new RequestHandler({
  key: process.env.DIANEMO_KEY!,
  backend: redisBackend(new Redis(process.env.REDIS_URL!)),
});

export const requests = handler.use(fedex, ups);

await handler.addTemplateClient("fedex", {
  instanceId: "production",
  baseUrl: "https://apis.fedex.com",
  clientId: process.env.FEDEX_CLIENT_ID!,
  clientSecret: process.env.FEDEX_CLIENT_SECRET!,
});

// "fedex:_:production" — <template>:<organizationId | "_">:<instanceId>
const account = buildClientName("fedex", { instanceId: "production" });

await requests.fedex.trackPackages(account, {
  includeDetailedScans: true,
  trackingInfo: [{ trackingNumberInfo: { trackingNumber: "794953555551" } }],
});
```

`requests` is typed from exactly the plugins you passed — a plugin you didn't install doesn't appear
on it.

## Catalogue

Twenty-one integrations, plus the shared toolkit they all depend on. Each package carries its own
vendor findings — rate-limit evidence, wire quirks and open questions — under its `docs/` directory.

| Package                                                                      | Integration                                                    | Vendor findings                                                                  |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`@dianemo/plugin-amazon-spapi`](packages/plugin-amazon-spapi)               | Amazon Selling Partner API — multi-region, multi-marketplace   | [API notes](packages/plugin-amazon-spapi/docs/amazon-spapi-api.md)               |
| [`@dianemo/plugin-channel-advisor`](packages/plugin-channel-advisor)         | ChannelAdvisor — listings, orders, fulfillment                 | [API notes](packages/plugin-channel-advisor/docs/channel-advisor-api.md)         |
| [`@dianemo/plugin-ebay`](packages/plugin-ebay)                               | eBay — Sell Fulfillment orders                                 | [API notes](packages/plugin-ebay/docs/ebay-api.md)                               |
| [`@dianemo/plugin-extensiv`](packages/plugin-extensiv)                       | Extensiv (3PL Central) — multi-warehouse                       | [API notes](packages/plugin-extensiv/docs/extensiv-api.md)                       |
| [`@dianemo/plugin-fedex`](packages/plugin-fedex)                             | FedEx — shipping, rates, tracking, pickups, address validation | —                                                                                |
| [`@dianemo/plugin-google`](packages/plugin-google)                           | Google — OpenID Connect userinfo, Address Validation           | [API notes](packages/plugin-google/docs/google-api.md)                           |
| [`@dianemo/plugin-google-vertex-ai`](packages/plugin-google-vertex-ai)       | Google Vertex AI Search (Discovery Engine)                     | [API notes](packages/plugin-google-vertex-ai/docs/vertex-ai-api.md)              |
| [`@dianemo/plugin-helpscout`](packages/plugin-helpscout)                     | Help Scout — conversation reads                                | [API notes](packages/plugin-helpscout/docs/helpscout-api.md)                     |
| [`@dianemo/plugin-labelary`](packages/plugin-labelary)                       | Labelary — ZPL label rendering                                 | [API notes](packages/plugin-labelary/docs/labelary-api.md)                       |
| [`@dianemo/plugin-mainfreight`](packages/plugin-mainfreight)                 | Mainfreight — freight and warehousing                          | [API notes](packages/plugin-mainfreight/docs/mainfreight-api.md)                 |
| [`@dianemo/plugin-newegg`](packages/plugin-newegg)                           | Newegg and Newegg Business                                     | [API notes](packages/plugin-newegg/docs/newegg-api.md)                           |
| [`@dianemo/plugin-open-exchange-rates`](packages/plugin-open-exchange-rates) | Open Exchange Rates                                            | [API notes](packages/plugin-open-exchange-rates/docs/open-exchange-rates-api.md) |
| [`@dianemo/plugin-printnode`](packages/plugin-printnode)                     | PrintNode — remote print dispatch                              | [API notes](packages/plugin-printnode/docs/printnode-api.md)                     |
| [`@dianemo/plugin-shopify`](packages/plugin-shopify)                         | Shopify Admin API — GraphQL                                    | [API notes](packages/plugin-shopify/docs/shopify-api.md)                         |
| [`@dianemo/plugin-smarty`](packages/plugin-smarty)                           | Smarty — US and international address validation               | [API notes](packages/plugin-smarty/docs/smarty-api.md)                           |
| [`@dianemo/plugin-stripe`](packages/plugin-stripe)                           | Stripe — payment intents, refunds, webhooks                    | [API notes](packages/plugin-stripe/docs/stripe-api.md)                           |
| [`@dianemo/plugin-unis`](packages/plugin-unis)                               | UNIS — receipts and outbound orders                            | [API notes](packages/plugin-unis/docs/unis-api.md)                               |
| [`@dianemo/plugin-ups`](packages/plugin-ups)                                 | UPS — rating, shipping, tracking                               | [API notes](packages/plugin-ups/docs/ups-api.md)                                 |
| [`@dianemo/plugin-usps`](packages/plugin-usps)                               | USPS — labels, pickups, payment-token caching                  | [API notes](packages/plugin-usps/docs/usps-api.md)                               |
| [`@dianemo/plugin-walmart`](packages/plugin-walmart)                         | Walmart Marketplace                                            | [API notes](packages/plugin-walmart/docs/walmart-api.md)                         |
| [`@dianemo/plugin-wayfair`](packages/plugin-wayfair)                         | Wayfair — dropship purchase orders                             | [API notes](packages/plugin-wayfair/docs/wayfair-api.md)                         |

`@dianemo/plugin-kit` is the shared toolkit every plugin depends on; it is described
[below](#plugin-kit) and is not installed directly.

## Why one repo, many packages

Install granularity and repo granularity are separate concerns. Twenty-two repos would mean
twenty-two CI pipelines and release trains for packages version-locked to the same
`CreateClientData` type in core. One repo gives the same `npm i @dianemo/plugin-fedex` granularity
plus atomic changes when that type moves.

## plugin-kit

Every plugin depends on `@dianemo/plugin-kit`, which provides:

- **`tryHandleRequest`** — the handler-bound request executor. Request functions import it directly,
  which is what keeps their signatures at `(clientName, data)` with no handler parameter.
- **`bindTryHandleRequest(ctx)`** — called by each plugin's `createRequests` to establish that
  binding.
- **`backend()`** — the handler's storage backend, for plugins caching state others reuse (USPS
  payment tokens, for instance). How far that sharing reaches is the host's choice of backend, not
  the plugin's: fleet-wide on `@dianemo/backend-redis`, process-local on the memory backend.
- **`acquireLock` / `releaseLock`** — a short-lived lock, for work that should happen once rather
  than once per replica.
- **`CurrencyCodes`** — the ISO 4217 enum several integrations share; it is the declared type of
  required fields in five plugins, so its accuracy moves money —
  [`currency-codes.md`](packages/plugin-kit/docs/currency-codes.md).

### One handler per process

The binding is process-wide, held on a `Symbol.for` key rather than in module scope. Passing
plugins to a _second_ handler in the same process throws rather than rebinding, because a silent
rebind would route the first handler's traffic through the second's rate-limit budget — requests
would keep succeeding, against the wrong bucket. Module scope could not refuse that: npm installs a
second copy of `plugin-kit` whenever two plugins resolve incompatible ranges of it, and each copy
held its own state, so the guard failed open.

If you genuinely need two handlers, run them in separate processes.

## Documentation

A finding that took a doc search, a vendor sample or a support ticket is documentation, not a
comment. Code carries a one-line pointer; the write-up carries the evidence, the URL and the date
checked.

**Vendor findings live in the package they describe** — `packages/plugin-<name>/docs/` — and ship in
that package's tarball, so the pointers in its published `src/` resolve for a consumer. The
[catalogue](#catalogue) links each one. Both directories are called `docs/`, so a pointer in code
disambiguates by its first character: `docs/ups-api.md` is the package's own, `/docs/core-behaviour.md`
is the repo's. The `typescript-conventions` skill
([`.claude/skills/typescript-conventions/SKILL.md`](.claude/skills/typescript-conventions/SKILL.md))
carries the full rule, along with the comment standard itself.

**Repo-wide concerns live in [`docs/`](docs/):**

| Document                                              | What it covers                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------- |
| [`core-behaviour.md`](docs/core-behaviour.md)         | `@dianemo/core` behaviour that more than one plugin is built around |
| [`oauth-grants.md`](docs/oauth-grants.md)             | The evidence behind `ACCEPTED_GRANTS` in `test/auth.test.ts`        |
| [`package-exports.md`](docs/package-exports.md)       | Why every `exports` map is enumerated rather than wildcarded        |
| [`dependency-hygiene.md`](docs/dependency-hygiene.md) | Why a declared runtime dependency must actually be imported         |
| [`open-questions.md`](docs/open-questions.md)         | Everything unresolved, and what would settle each                   |

Two conventions run through all of it. **Say which kind of source you have** — vendor documentation,
an observed response, a vendor's own published client, a third party's schema dump and an inference
are five different strengths of claim, and flattening them into "the API does X" is worse than
writing nothing. **Keep the negative results** — "searched X, Y and Z; none publishes a figure" is a
finding, and it stops the next person repeating the search.

## Adding a plugin

1. `packages/plugin-<name>/` with `package.json` (peer-depend on `@dianemo/core`, depend on
   `@dianemo/plugin-kit`) and a `tsconfig.json` extending `../../tsconfig.base.json`.
2. `src/client.ts` — the template: rate limit, auth flow, sub-clients, plus a `declare module
"@dianemo/core"` block adding the credential shape to `ClientTemplates`.
3. `src/requests/` — request functions importing `tryHandleRequest` from `@dianemo/plugin-kit`.
4. `src/index.ts` — `definePlugin({ name, registerTemplate, createRequests })`.

The repo-wide tests pick up any new `packages/plugin-*` directory automatically:
`test/allPlugins.test.ts` asserts it composes, registers a template matching its name and doesn't
collide with the others, and `test/requestClientNames.test.ts` asserts every request function targets
a client its template actually registered. Both hard-code the expected plugin count, so bump it in
each when you add one.

## Development

```bash
npm install
npm run build           # plugin-kit first, then all 21 plugins
npm test                # 264 tests (vitest run --typecheck)
npm run check           # tsc --noEmit, every workspace
npm run lint
npm run format:fix      # then sort-imports — order matters
npm run sort-imports    # import ordering (CI gates on --check)
npm run exports         # regenerate exports maps from the files on disk
npm run verify:pack     # packs and installs tarballs; needs a fresh build
npm run verify:readme   # compiles every README example; needs a fresh build
```

Two ordering constraints: `format:fix` before `sort-imports`, because the sorter orders by line
length; and `build` before either verify script, because both read `dist/`.

`@dianemo/core` installs from npm like any other dependency — no sibling checkout needed.

### Test coverage

Four repo-wide suites cover every plugin structurally: `allPlugins` (it composes and registers a
template under its own name), `requestClientNames` (every request function targets a client its
template registered, and that client is usable), `auth` (every plugin can actually obtain a token)
and `composition` (multi-plugin namespace inference, type-level). `plugin-fedex` additionally has
behavioural tests — request routing, the rate-limit calibration, and the binding guards — as the
worked example.

**The individual request functions are not covered.** There are ~320 of them across 21 vendors, and
they are thin wrappers over `tryHandleRequest`; the valuable tests are contract tests per vendor,
which do not exist yet.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
