#!/usr/bin/env bash
#
# Makes .github/workflows/publish.yml the npm trusted publisher of every
# package under packages/, so CI can publish them with no token.
#
#   scripts/trust-publishers.sh             # every package
#   scripts/trust-publishers.sh --dry-run   # report, change nothing
#   scripts/trust-publishers.sh @dianemo/plugin-fedex @dianemo/plugin-ups
#
# Needs npm 11.15 or later and `npm login` on an account with 2FA. The first
# package opens npm's 2FA page: tick "skip two-factor authentication for the
# next 5 minutes" there and the rest go through unprompted.
#
# Safe to run again. npm allows one publisher per package and refuses a
# second, so a package that already has one is reported and left as it is.
set -uo pipefail

REPO="dianemo/dianemo-plugins"
WORKFLOW="publish.yml"

cd "$(dirname "$0")/.." || exit 1

dry_run=""
packages=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=1 ;;
    *) packages+=("$arg") ;;
  esac
done
if [ ${#packages[@]} -eq 0 ]; then
  while read -r name _; do packages+=("$name"); done \
    < <(node scripts/release-versions.mjs)
fi

if ! npm whoami >/dev/null 2>&1; then
  echo "Not logged in to npm. Run 'npm login' first." >&2
  exit 1
fi

failed=()
for name in "${packages[@]}"; do
  # npm can only attach a publisher to a package that exists.
  if ! npm view "$name" name >/dev/null 2>&1; then
    echo "skip  $name: not on npm yet; publish it once by hand first"
    failed+=("$name")
    continue
  fi
  echo "trust $name"
  if ! npm trust github "$name" --repo "$REPO" --file "$WORKFLOW" \
    --allow-publish --yes ${dry_run:+--dry-run}; then
    failed+=("$name")
  fi
  # npm's own advice for bulk runs, to stay under its rate limit.
  sleep 2
done

echo
if [ ${#failed[@]} -eq 0 ]; then
  echo "All ${#packages[@]} packages trust $REPO/.github/workflows/$WORKFLOW."
else
  echo "${#failed[@]} of ${#packages[@]} need a look (an existing publisher also lands here):"
  printf '  %s\n' "${failed[@]}"
  echo "Check one with: npm trust list <package>"
  exit 1
fi
