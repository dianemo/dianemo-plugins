#!/usr/bin/env node
/**
 * Fetch a Google API's Discovery document and save it, pretty-printed with
 * stable key order and otherwise unchanged.
 *
 *   node scripts/fetch-google-discovery.mjs <api> <version> <out.json>
 *   node scripts/fetch-google-discovery.mjs sheets v4 vendor-specs/google/sheets-v4.discovery.json
 *
 * Run by hand to update the committed spec; never in CI or tests, which read
 * the committed file. The Discovery API is public and needs no credentials.
 * https://developers.google.com/discovery/v1/reference/apis
 */
import path from "node:path";
import fs from "node:fs";

const BASE = "https://discovery.googleapis.com/discovery/v1/apis";

const [api, version, out] = process.argv.slice(2);
if (!api || !version || !out) {
  console.error("usage: fetch-google-discovery.mjs <api> <version> <out.json>");
  process.exit(2);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.json();
}

/** Recursively sort object keys so a re-fetch diffs only on real changes. */
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeys(value[k])])
    );
  }
  return value;
}

const list = await getJson(
  `${BASE}?name=${encodeURIComponent(api)}&preferred=true`
);
const preferred = list.items?.find((i) => i.name === api);
if (preferred && preferred.version !== version) {
  console.warn(
    `warning: the preferred version of ${api} is ${preferred.version}, not ${version}`
  );
}

const doc = await getJson(
  `${BASE}/${encodeURIComponent(api)}/${encodeURIComponent(version)}/rest`
);
const target = path.resolve(out);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(sortKeys(doc), null, 2) + "\n");
console.log(`wrote ${out} (${fs.statSync(target).size} bytes)`);
console.log(`revision: ${doc.revision}`);
console.log(`etag: ${doc.etag}`);
