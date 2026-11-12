#!/usr/bin/env node
/**
 * Prints `<name> <version>` for each package under packages/, with a package
 * ahead of the ones that depend on it — @dianemo/plugin-kit first, since every
 * plugin compiles against its dist. With `--changed-since <ref>`, only the
 * packages whose version differs from the one at that git ref.
 *
 * Usage:
 *   node scripts/release-versions.mjs
 *   node scripts/release-versions.mjs --changed-since origin/master
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const args = process.argv.slice(2);
const sinceIdx = args.indexOf("--changed-since");
const since = sinceIdx !== -1 ? args[sinceIdx + 1] : undefined;
if (sinceIdx !== -1 && !since) {
  console.error("--changed-since needs a git ref");
  process.exit(1);
}

const manifests = new Map();
for (const dir of readdirSync(join(ROOT, "packages")).sort()) {
  const path = join("packages", dir, "package.json");
  try {
    const manifest = JSON.parse(readFileSync(join(ROOT, path), "utf8"));
    if (!manifest.private) manifests.set(manifest.name, { path, manifest });
  } catch {
    // Not a package directory.
  }
}

function versionAt(ref, path) {
  try {
    const manifest = execFileSync("git", ["show", `${ref}:${path}`], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return JSON.parse(manifest).version;
  } catch {
    // The package did not exist at that ref, so any version is a change.
    return undefined;
  }
}

const printed = new Set();
function print(name) {
  if (printed.has(name)) return;
  printed.add(name);
  const { path, manifest } = manifests.get(name);
  const needs = { ...manifest.dependencies, ...manifest.peerDependencies };
  for (const dependency of Object.keys(needs)) {
    if (manifests.has(dependency)) print(dependency);
  }
  if (since && versionAt(since, path) === manifest.version) return;
  console.log(`${name} ${manifest.version}`);
}
for (const name of manifests.keys()) print(name);
