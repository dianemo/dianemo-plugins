# Releasing

Versions are not edited by hand. A change to a published package carries a **version
plan**, and two workflows turn the plans on `master` into a release.

## A version plan in every PR that changes a package

```bash
npm run version-plan          # writes .nx/version-plans/<name>.md
npm run version-plan:check    # is one required, and is it there?
```

A plan names each package the PR changes and the bump it takes, then says what
changed:

```markdown
---
"@dianemo/plugin-fedex": minor
---

`createShipment` accepts `shipmentSpecialServices`, so a signature option no longer
needs a hand-built request body.
```

**The body is the release note.** Nx writes it into that package's `CHANGELOG.md`, so
it is read by consumers, not reviewers. Put what a consumer must do under `BREAKING:`.

The `Version Plan Check` workflow fails a PR that changes a package without one. Every
file under `packages/` counts except Markdown and `packages/*/test/**` — neither
changes a byte a consumer runs. Ask `version-plan:check` rather than reasoning about
paths; it compares commits, so it reports nothing until the change is committed.

Do not touch a `version` field or a `CHANGELOG.md` in a feature PR. The release PR
owns both, and a version bumped anywhere else is never published.

## `plugin-kit` does not drag the plugins with it

Every plugin declares `@dianemo/plugin-kit` as a peer on a caret range. `nx.json` sets
`updateDependents: "never"`, so a kit release leaves the 21 plugins alone: a kit patch
or minor already satisfies their range, and re-releasing every plugin to say so would
publish 21 packages with no change in them.

A kit **major** is the exception, and it is manual: the PR that makes it raises each
plugin's peer range itself and names every plugin in its plan.

## The release PR

`create-release-pr.yml` runs on every push to `master`. While a plan is pending it runs
`npm run release` — which applies the plans, bumps the versions, writes each released
package's `CHANGELOG.md` and deletes the plans — and opens one PR from
`chore/release-next`, rebuilding that branch each time `master` gains another plan. Do
not push to it by hand. `Version Plan Check` skips the `chore/release-` prefix, because
a release consumes the plans the check looks for.

The workflow does two things `npm run release` does not. It syncs the lockfile with
`npm install --package-lock-only`, since `nx.json` skips it, and it runs
`scripts/join-changelog-entries.mjs`: Nx appends the PR link to the first line of a
plan's body, which for a plan wrapped at 80 columns is the middle of its opening
sentence.

A push made with the built-in token starts no workflows, so the release workflow starts
`CI` on the branch itself.

## Merging it publishes

`publish.yml` runs on every push to `master` but publishes only when the push merged a
PR from a `chore/release-` branch of this repository. It publishes each version
`master` names that npm does not have — `plugin-kit` first — and tags the commit
`<package>@<version>`. **Never name another branch `chore/release-…`.**

It authenticates through npm trusted publishing, so there is no token and no one-time
password, and each version carries provenance. To retry a release that failed
part-way, run `Publish` from the Actions tab: it skips what already went out.

## A new package is published once by hand

npm can only attach a trusted publisher to a package that exists. So the first version
of a new plugin is published by hand from the merged release commit, and then given its
publisher:

```bash
npm publish -w @dianemo/plugin-<name> --access public
npm trust github @dianemo/plugin-<name> --repo dianemo/dianemo-plugins --file publish.yml
```

Until both are done `publish.yml` stops at that package, so after the by-hand publish
run `Publish` from the Actions tab to send whatever was queued behind it.

## By hand

Should `create-release-pr.yml` be unavailable, make the same PR from a branch named
`chore/release-<date>`, running `npm run release`, the changelog script and
`npm install --package-lock-only` yourself. Merging it publishes like any other release
PR.

Should `publish.yml` be unavailable too, tag the merge commit `<package>@<version>` for
each released package and publish from it with
`NPM_CONFIG_OTP=<code> npm run release:publish`. The one-time password has to arrive by
environment: nx parses `--otp` with yargs, which reads the value as a number and drops
a leading zero, so roughly one code in ten reaches npm a digit short and is refused.
