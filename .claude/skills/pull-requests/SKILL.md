---
name: pull-requests
description: Opening and maintaining a pull request in dianemo-plugins — the repo's PR template, the title format, which packages and version bumps to declare, and keeping the body current as the branch changes. Use when opening, drafting, writing, or updating a PR or its description, when asked to put a change up for review, and after pushing further commits to a branch that already has a PR open.
---

# Pull requests

## Before anything

Run the `pre-commit-checks` skill first, all eleven steps. A PR is where other people's
time starts getting spent, and CI here runs the same checks — a red pipeline on a fresh
PR means a step was skipped, not that CI found something clever.

Three CI jobs run on every PR: `verify` (`sort-imports:check`, `format`, `lint`, `check`,
`test`) and `package` (`verify:pack`, `verify:readme`) from `.github/workflows/ci.yml`,
both building first, and `Version Plan Check` (a version plan for every package whose
published content changed). Nothing is enforced by a git hook, so CI is the first thing
that will tell you.

## Title and base

The title becomes the **squash-merge commit** on `master`, so it is Title Case with the
long type word:

```
Feature: Add Newegg Order Requests
Bugfix: Restore Extensiv Token Refresh
Chore: Regenerate Exports Maps After Requests Move
```

Not the lowercase `feat:` / `fix:` form. **Commit messages inside the branch have no
established convention here** — see `pre-commit-checks`; do not infer one from this
title format.

Name the package when the change is confined to one, and let the title carry the
subject rather than the mechanism: `Bugfix: Restore Extensiv Token Refresh`, not
`Bugfix: Change refreshToken Placeholder In client.ts`.

PRs target `master`. Branches here are `feature/<subject>`. **Never name one
`chore/release-…`** — merging a PR from that prefix publishes; see `/docs/releasing.md`.

```bash
gh pr create --base master --title "Bugfix: …" --body-file <path>
```

Write the body to a file first — it is long and multi-line, and `--body` mangles it.
Use the session scratchpad, not the repo.

## The body

Follow `.github/pull_request_template.md`. Four sections; the last is optional. Delete a
heading you have nothing for rather than writing "N/A" — an empty heading is what makes
a template rot.

### Description — the gist, not the details

A short paragraph or three. What prompted this and what it does, at the level you would
explain it to someone in a corridor. Enough that a reviewer knows what they are about
to look at and why it exists.

Resist itemising here. No file lists, no per-function notes — those go below, and
repeating them makes the PR twice as long and half as useful.

### Packages Touched — what a consumer will see change

This repo publishes one npm package per API, so "which workspace" is the first thing a
reviewer needs and the diff spreads it across directories. One line per workspace,
with the bump its version plan declares:

```markdown
- `@dianemo/plugin-newegg` — **new package**, `1.0.0`
- `@dianemo/plugin-kit` — patch; adds one optional field to `PluginTemplate`
- Repo-level: `test/allPlugins.test.ts`, `test/requestClientNames.test.ts` counts bumped
```

**The version plan is enforced, not a convention.** `Version Plan Check` fails when a
package changed outside Markdown and its `test/` with no plan naming it. Write it before
you push:

```bash
npm run version-plan
npm run version-plan:check
```

The plan's body is the release note a consumer reads in that package's `CHANGELOG.md`,
so write it for them. Do not edit a `version` field: the release PR does, and a version
bumped anywhere else is never published — see `/docs/releasing.md`.

Two more things reviewers here specifically look for:

- **A `plugin-kit` change fans out to every plugin.** It is a peer dependency holding
  process-global singleton state, so say so explicitly and say whether every downstream
  package was rebuilt and retested, not just the one you were working in.
- **A change under a package's `src/requests/` needs `npm run exports`.** Say that you
  ran it. A stale exports map passes every in-repo test — tests import by filesystem
  path — while the new module is unreachable to a consumer.

### Changes Made — where the real data is

This is the section a reviewer actually works from. One bullet per meaningful change,
anchored to the file or function it touches, saying **what changed and why**:

```markdown
- **`getOrderList`** — `clientName` was the second parameter, behind `organizationId`.
  Two adjacent bare `string` parameters are invisible to TypeScript when swapped, so
  it now leads, per the repo convention.
- `packages/plugin-unis/src/client.ts`: the sub-client carried `{{refreshToken}}` at
  client level, which `test/auth.test.ts` rejects — moved to the template's auth block.
- **`EXT_0014`** — new code. The 401 retry path and the malformed-payload path shared
  `EXT_0009`, so a caller could not tell an auth failure from a bad body.
```

Bold the symbol or backtick the path — either is used here; be consistent within one
PR. Include the reasoning that is not obvious from the diff, and say when a change is a
drive-by fix rather than part of the main thrust.

**A new or changed rate limit gets its own bullet, with its source.** State which kind
of claim it is — vendor documentation, an observed response, a vendor's own published
client, a third party's schema dump, or an inference — and say plainly when the number
is this repo's politeness ceiling rather than anything the vendor states. Flattening
those into "the API allows X" is worse than writing nothing, because the reviewer cannot
tell what still needs checking.

### Additional Notes — everything that is not a change

Things a reviewer must know that the diff cannot tell them. Label each with a bold
lead-in:

- **Documentation written:** the `docs/` file this added to or created, and which level
  — a vendor finding belongs in `packages/plugin-<name>/docs/<name>-api.md` and ships in
  that tarball; a finding that outlives one package belongs in the repo's `/docs/`.
- **Open question added:** a new entry in `/docs/open-questions.md`, and what would
  settle it. A limit that needs a real account to verify is a normal thing to merge; an
  unrecorded one is not.
- **Testing:** what you ran and what you could not. "Auth was never exercised against a
  real account — the token lifetime is inferred from the docs" is a useful sentence, and
  in this repo an auth path that no one has run is the failure mode with teeth.
- **Convention changed:** a house rule this PR establishes or alters, so reviewers know
  the new shape is deliberate. If it belongs in a skill or `CLAUDE.md`, change it in
  this PR rather than promising to.
- **Left alone deliberately:** the related-looking thing you did _not_ touch, and why.
- **Out of scope:** anything riding along that is not the main thrust.

Omit the section only when there is genuinely nothing.

## Adding a plugin

Load `writing-a-plugin` before opening the PR — it carries the checklist of repo-wide
files a new package must be added to, which is exactly the class of omission a reviewer
cannot see from the diff. In the PR body, list each one you touched under **Packages
Touched**: the two suites that hard-code the plugin count, the `CASES` entry in
`test/requestClientNames.test.ts`, and the `ACCEPTED_GRANTS` row in `test/auth.test.ts`
if the plugin speaks OAuth.

## Keep the body current

**When you push further commits to a branch that already has a PR, update the PR body
in the same breath.** A stale body is worse than no body — a reviewer who reads it and
then finds a change it does not mention stops trusting the whole thing.

Treat it as part of the change, not a follow-up:

```bash
gh pr view <number> --json body -q .body > <scratchpad>/pr.md   # read what is there
# edit, then:
gh pr edit <number> --body-file <scratchpad>/pr.md
```

Re-check on every push:

- New bullets in **Changes Made** for what the new commits did.
- **Packages Touched** still complete — a new workspace in the diff and not in that
  list is the single easiest thing to miss here.
- **Description** still describes the PR's actual scope; if the scope grew, say so.
- **Additional Notes** still true — a testing caveat you resolved must not linger, and
  neither must a deploy note you dropped.

If you cannot tell whether something merits a bullet, it does.

## Footer

End the body with:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
