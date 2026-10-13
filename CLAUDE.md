# dianemo-plugins

Integration plugins for [dianemo](https://github.com/dianemo/dianemo) — one published
npm package per external API. 22 packages: `@dianemo/plugin-kit` plus 21 plugins.

`@dianemo/core` is the rate-limiting request handler these plug into. It is a **peer
dependency resolved from the registry**, not built here — read its behaviour from
`node_modules/@dianemo/core/dist/`, and put anything you learn in
`docs/core-behaviour.md`.

## What a plugin is

Two halves, no more:

- `registerTemplate` — describes the _shape_ of a client: its rate-limit calibration and
  its auth flow. Carries no credentials; those arrive later via `addTemplateClient`, so
  a plugin never knows where they came from.
- `createRequests` — the request functions using it, bound to the handler by
  `bindTryHandleRequest`.

A caller composes them with `handler.use(fedex, ups)` and gets
`{ fedex: {…}, ups: {…} }`.

## Skills

| Skill                    | Use it for                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `typescript-conventions` | Style within a file — size, layout, error codes, comments, and where a finding is written up |
| `writing-a-plugin`       | Adding a package for a new API                                                               |
| `pre-commit-checks`      | The ordered checks before committing or publishing                                           |
| `pull-requests`          | Opening a PR, its title and body, and keeping it current as the branch moves                 |

Load them rather than working from this file — they are the source of truth and they
change.

## Commands

```bash
npm run build          # plugin-kit, then the 21 plugins in parallel
npm test               # 264 tests (vitest run --typecheck)
npm run check          # tsc --noEmit, every workspace
npm run lint
npm run format:fix     # then sort-imports — order matters
npm run sort-imports
npm run exports        # regenerate exports maps from files on disk
npm run check:versions # published packages changed without a version bump
npm run verify:pack    # packs and installs tarballs; needs a fresh build
npm run verify:readme  # compiles every README example; needs a fresh build
```

Two ordering constraints that have both caused real confusion:
`format:fix` before `sort-imports` (the sorter orders by line length), and `build`
before either verify script (both read `dist/`).

`build` is `scripts/build.mjs`, not an npm workspace loop: **npm does not
topologically sort `run --workspaces`.** It runs alphabetically, so every plugin
sorting before `plugin-kit` compiled against a dist that did not exist yet. The script
builds the kit alone, then the plugins in parallel, and reports every failure rather
than the first.

## The four repo-wide tests

These catch what per-package tests cannot. If you add or restructure a plugin, they are
what will tell you:

- `test/auth.test.ts` — every plugin can actually obtain a token. No unresolved `{{…}}`,
  no client-level `{{refreshToken}}`, a doc-cited `grant_type`, and every leaf client
  carrying both a `baseURL` and a declared `rateLimit`. Six of the eight v1.0.0 blockers
  were auth failures that every other check passed.
- `test/requestClientNames.test.ts` — every request function targets a client its
  template registered, **and that client is usable**. Registered is not usable: a parent
  that owns auth for its sub-clients has no `baseURL`.
- `test/allPlugins.test.ts` — every plugin composes and registers its own template name.
- `test/composition.test-d.ts` — multi-plugin namespace inference, type-level.

Two of them hard-code the plugin count — `allPlugins` and `requestClientNames` — so
adding a plugin means bumping both, adding its `CASES` entry in `requestClientNames`,
and adding an `ACCEPTED_GRANTS` row in `auth` if it speaks OAuth. See `writing-a-plugin`.

## Documentation sits at two levels

A finding that took a doc search, a sample or a support ticket is documentation, not a
comment. Code carries a one-line pointer; the write-up carries the evidence, the URL and
the date checked.

**A vendor finding lives in the package it describes** —
`packages/plugin-<name>/docs/<name>-api.md`, shipped in that package's tarball so the
pointers in its published `src/` still resolve. Rate-limit evidence, wire quirks, and the
open questions that need a real account.

**A finding that outlives one package lives in the repo's `docs/`:**

- `docs/core-behaviour.md` — `@dianemo/core` behaviour several plugins are built around
- `docs/oauth-grants.md` — evidence behind `ACCEPTED_GRANTS` in `test/auth.test.ts`
- `docs/open-questions.md` — everything unresolved, and what would settle each
- `docs/package-exports.md`, `docs/dependency-hygiene.md`

Both directories are called `docs/`, so a pointer in code disambiguates by its first
character: `docs/ups-api.md` is the package's own, `/docs/core-behaviour.md` is the
repo's. `typescript-conventions` carries that rule and the comment standard it belongs
to — read it there rather than restating it here.

Two habits that matter more than they look:

**Say which kind of source you have.** Vendor documentation, an observed response, a
vendor's own published client, a third party's schema dump, and an inference are five
different strengths of claim. Several findings here rest on the weaker ones, and
flattening them into "the API does X" is worse than writing nothing — the next reader
cannot tell what still needs checking.

**Keep the negative results.** "Searched X, Y and Z; none publishes a figure" is a
finding, and it stops the next person repeating the search. Several rate limits here are
explicitly this repo's own politeness ceilings rather than anything a vendor states, and
each one says so.

## Conventions worth knowing before you read code

- **`clientName` is always the first parameter** of a request function. Two adjacent
  bare `string` parameters are invisible to TypeScript when swapped; this was broken in
  25 of one package's 33 functions.
- **Client names are built, never concatenated.** `buildClientName(template, creds)`
  yields `<template>:<organizationId | "_">:<instanceId>`. Sub-client segments are
  appended by the plugin, never by the caller.
- **One error code per distinct failure.** Three-letter prefix unique to the package,
  four digits. Gaps are fine; reuse is not. A transport failure and a business-logic
  failure in the same function are two codes.
- **A rate limit carries its source.** URL and date checked, in the comment or in the
  `docs/` section it points at. An uncommented number reads as verified.
- **`plugin-kit` is a peer dependency everywhere.** It holds process-global singleton
  state, so a second copy in `node_modules` means two bindings and a guard that fails
  open.

## Open items

`docs/open-questions.md` is the countable list — what is unresolved, what would
settle each, and corrections to the v1.0.0 validation report whose claims did not
survive being checked.

Nothing there blocks publishing. The headline items:

- **A 403 cannot freeze the fleet.** GitHub signals secondary limits with 403 as
  often as 429; core arms a freeze only for 429, 5xx and connection resets. Not
  fixable from a plugin.
- **UNIS's `/user/login` may report no token lifetime.** The token is a UUID, not
  a JWT, so there is no `exp` to fall back on — one login against a real account
  settles it, and it is the one open question whose wrong answer is an outage.
- **UNIS's 1,000/min per-IP quota is invisible to a per-client budget.** Ten
  clients on one host sit exactly on it while each looks compliant. Same shape as
  FedEx's per-project 1,400/10 s.
- **Eight rate limits are this repo's own ceilings**, not vendor figures. Each
  says so where it is declared. Extensiv's 20/s is the most permissive of them
  and the least corroborated.
- **No commit convention is established** — the repo has one commit. Do not import
  one from another repo and present it as this one's.
