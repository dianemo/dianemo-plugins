#!/usr/bin/env node
/**
 * Verify the packages as npm publishes them, not as the repo sees them.
 *
 * The catalogue test in test/allPlugins.test.ts imports each plugin by
 * filesystem path (packages/<name>/src/index.ts), which never consults
 * package.json — so the `exports` map, `files` list and emitted dist are
 * invisible to it. A consumer only ever uses those. This packs every
 * workspace, installs the tarballs into a throwaway project alongside
 * @dianemo/core from the registry, and drives them by bare specifier.
 *
 * Catches: a wrong path in an `exports` subpath, an `exports` map gone stale
 * against the files on disk, a request family reachable only as
 * `<family>/index`, `files` omitting dist, a package that was never built, a
 * declared dependency nothing imports, and a runtime dependency left
 * undeclared and silently satisfied by monorepo hoisting.
 *
 * Zero-dependency: no commander, so it runs without an install step.
 *
 *   node scripts/verify-package.mjs            # pack, install, verify
 *   node scripts/verify-package.mjs --keep     # leave the temp project behind
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const KEEP = process.argv.includes("--keep");

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Collect the workspaces and confirm each one has something to publish.
// ---------------------------------------------------------------------------

// A module nobody regenerated for is unreachable to a consumer while every
// in-repo test keeps passing.
try {
  run(
    "node",
    [path.join(ROOT, "scripts", "generate-exports.mjs"), "--check"],
    ROOT
  );
} catch (error) {
  process.stderr.write(error.stdout ?? "");
  process.stderr.write(error.stderr ?? "");
  fail("exports maps are stale — run `node scripts/generate-exports.mjs`");
}

const packagesDir = path.join(ROOT, "packages");
const dirs = fs
  .readdirSync(packagesDir)
  .filter((d) => d.startsWith("plugin-"))
  .sort();

const manifests = new Map();
for (const dir of dirs) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(packagesDir, dir, "package.json"), "utf8")
  );
  manifests.set(manifest.name, { dir, manifest });

  // `files` decides what lands in the tarball; a missing dist means the
  // package installs and then throws on first import.
  if (!(manifest.files ?? []).includes("dist")) {
    fail(`${manifest.name}: "files" does not include "dist"`);
  }
  if (!fs.existsSync(path.join(packagesDir, dir, "dist"))) {
    fail(`${manifest.name}: no dist/ — run \`npm run build\` first`);
  }
}
console.log(`Found ${manifests.size} packages, all with built output.`);

// ---------------------------------------------------------------------------
// Every declared dependency must actually be imported, and vice versa.
// ---------------------------------------------------------------------------

/**
 * npm 7+ auto-installs non-optional peers, so a declared-but-unimported peer
 * makes every consumer of every plugin install it — and ERESOLVE for anyone
 * already on an incompatible major. See docs/dependency-hygiene.md.
 *
 * Type-only imports are elided at build, so a dependency needed solely for
 * types belongs in devDependencies and correctly reads as phantom here.
 */
const DEPENDENCY_EXEMPT = new Set([
  // plugin-kit's entire public surface is typed in core's types and it is
  // meaningless without a core handler, but it imports no core value.
  "@dianemo/core",
]);

const bareSpecifiers = (dir) => {
  const found = new Set();
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js")) {
        const source = fs.readFileSync(full, "utf8");
        // Anchored to line start, because an unanchored `from ["']` also matches
        // the word inside a comment or a string — a shopify comment reading
        // `"unreachable" from "that location does not exist"` was reported as an
        // undeclared dependency. Emitted `.js` puts every import on its own line
        // at column zero, so anchoring costs nothing.
        for (const [, spec] of [
          ...source.matchAll(
            /^\s*(?:import|export)\b[^;\n]*?\bfrom\s*["']([^"'.][^"']*)["']/gm
          ),
          ...source.matchAll(/^\s*import\s*["']([^"'.][^"']*)["']/gm),
        ]) {
          if (spec.startsWith("node:")) continue;
          const parts = spec.split("/");
          found.add(
            spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
          );
        }
      }
    }
  };
  walk(path.join(packagesDir, dir, "dist"));
  return found;
};

for (const [name, { dir, manifest }] of manifests) {
  const imported = bareSpecifiers(dir);
  const declared = [
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ];
  const phantom = declared.filter(
    (d) => !imported.has(d) && !DEPENDENCY_EXEMPT.has(d)
  );
  if (phantom.length) {
    fail(
      `${name}: declares ${phantom.join(", ")} but never imports it — ` +
        `move it to devDependencies if it is only needed for types`
    );
  }
  const undeclared = [...imported].filter((d) => !declared.includes(d));
  if (undeclared.length) {
    fail(`${name}: imports ${undeclared.join(", ")} without declaring it`);
  }
}
console.log(
  "Every declared dependency is imported, and every import declared."
);

// ---------------------------------------------------------------------------
// Pack every workspace and install the tarballs into a scratch project.
// ---------------------------------------------------------------------------

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dianemo-pack-"));
const tarballs = path.join(tmp, "tarballs");
fs.mkdirSync(tarballs);

console.log("Packing workspaces…");
run("npm", ["pack", "--workspaces", "--pack-destination", tarballs], ROOT);

const packed = fs.readdirSync(tarballs).sort();
if (packed.length !== manifests.size) {
  fail(`packed ${packed.length} tarballs, expected ${manifests.size}`);
}

// Core comes from the registry at the range the repo develops against, so
// this exercises the same artifact a consumer resolves.
const rootManifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf8")
);
const coreRange = rootManifest.devDependencies["@dianemo/core"];
if (coreRange.startsWith("file:") || coreRange.startsWith("link:")) {
  fail(
    `root depends on @dianemo/core via "${coreRange}" — expected a registry range`
  );
}

const dependencies = {
  "@dianemo/core": coreRange,
};
for (const file of packed) {
  const name = `@dianemo/${file.replace(/-\d+\.\d+\.\d+\.tgz$/, "").replace(/^dianemo-/, "")}`;
  if (!manifests.has(name))
    fail(`packed tarball ${file} maps to unknown package ${name}`);
  dependencies[name] = `file:./tarballs/${file}`;
}

fs.writeFileSync(
  path.join(tmp, "package.json"),
  JSON.stringify(
    {
      name: "dianemo-package-verification",
      private: true,
      version: "1.0.0",
      type: "module",
      dependencies,
      devDependencies: {
        "@types/node": rootManifest.devDependencies["@types/node"],
        typescript: rootManifest.devDependencies.typescript,
      },
    },
    null,
    2
  ) + "\n"
);

console.log(
  `Installing ${packed.length} tarballs + @dianemo/core@${coreRange} from the registry…`
);
try {
  run("npm", ["install", "--no-audit", "--no-fund"], tmp);
} catch (error) {
  console.error(error.stdout ?? "", error.stderr ?? "");
  fail("install of the packed tarballs failed");
}

// ---------------------------------------------------------------------------
// Drive the installed packages by bare specifier, exactly as a consumer does.
// ---------------------------------------------------------------------------

const pluginNames = [...manifests.keys()]
  .filter((n) => n !== "@dianemo/plugin-kit")
  .sort();

// The namespace a plugin claims is its declared `name`, which is not always the
// package name de-kebabed (plugin-printnode registers "printNode"). Read it
// from the built output rather than guessing.
const namespaceOf = new Map();
for (const name of pluginNames) {
  const { dir } = manifests.get(name);
  const entry = path.join(packagesDir, dir, "dist", "index.js");
  const { default: plugin } = await import(`file://${entry}`);
  if (!plugin?.name)
    fail(`${name}: dist/index.js has no default plugin export`);
  namespaceOf.set(name, plugin.name);
}

const subpaths = pluginNames.filter((name) =>
  Object.keys(manifests.get(name).manifest.exports ?? {}).includes("./requests")
);

/**
 * One directory-form `requests/<family>` subpath per package — the shape that
 * was unreachable, and the only thing an in-repo test cannot prove, because
 * tests import by path and never consult the exports map. See
 * docs/package-exports.md.
 */
const directorySubpaths = pluginNames.flatMap((name) => {
  const keys = Object.keys(manifests.get(name).manifest.exports ?? {});
  const family = keys.find(
    (k) => /^\.\/requests\/[^/]+$/.test(k) && keys.includes(`${k}/index`)
  );
  return family ? [`${name}${family.slice(1)}`] : [];
});

fs.writeFileSync(
  path.join(tmp, "smoke.mjs"),
  `import RequestHandler, { memoryBackend } from "@dianemo/core";

const pluginNames = ${JSON.stringify(pluginNames, null, 2)};
const subpaths = ${JSON.stringify(subpaths, null, 2)};
const directorySubpaths = ${JSON.stringify(directorySubpaths, null, 2)};

let failures = 0;
const plugins = [];

for (const name of pluginNames) {
  try {
    const { default: plugin } = await import(name);
    if (!plugin || typeof plugin.name !== "string" || !plugin.name) {
      console.error(\`  \${name}: default export is not a plugin\`);
      failures++;
      continue;
    }
    if (typeof plugin.registerTemplate !== "function" || typeof plugin.createRequests !== "function") {
      console.error(\`  \${name}: plugin is missing registerTemplate/createRequests\`);
      failures++;
      continue;
    }
    plugins.push(plugin);
  } catch (error) {
    console.error(\`  \${name}: \${error.message.split("\\n")[0]}\`);
    failures++;
  }
}

// A "./requests" subpath must resolve. It may legitimately export nothing —
// a template-only plugin drives the handler's generic request surface.
for (const name of subpaths) {
  try {
    await import(\`\${name}/requests\`);
  } catch (error) {
    console.error(\`  \${name}/requests: \${error.message.split("\\n")[0]}\`);
    failures++;
  }
}

// A request family must resolve by its directory name, not only as
// "<family>/index" — the form the README and every doc example uses.
for (const subpath of directorySubpaths) {
  try {
    await import(subpath);
  } catch (error) {
    console.error(\`  \${subpath}: \${error.message.split("\\n")[0]}\`);
    failures++;
  }
}

if (plugins.length === pluginNames.length) {
  const handler = new RequestHandler({ key: "verify-key-at-least-32-characters-long", backend: memoryBackend() });
  const namespaces = handler.use(...plugins);
  for (const plugin of plugins) {
    if (namespaces[plugin.name] === undefined) {
      console.error(\`  \${plugin.name}: composed but produced no namespace\`);
      failures++;
    }
  }

  for (const plugin of plugins) {
    const scoped = new RequestHandler({ key: "verify-key-at-least-32-characters-long", backend: memoryBackend() });
    const registered = [];
    scoped.registerClientTemplate = async (templateName) => {
      registered.push(templateName);
    };
    try {
      await plugin.registerTemplate(scoped);
      if (!registered.includes(plugin.name)) {
        console.error(\`  \${plugin.name}: registered [\${registered}], not its own name\`);
        failures++;
      }
    } catch (error) {
      console.error(\`  \${plugin.name}: registerTemplate threw \${error.message.split("\\n")[0]}\`);
      failures++;
    }
  }
}

console.log(
  failures === 0
    ? \`  \${plugins.length} plugins imported, composed and registered; \${subpaths.length + directorySubpaths.length} subpaths resolved\`
    : \`  \${failures} failure(s)\`
);
process.exit(failures === 0 ? 0 : 1);
`
);

// The `types` condition of the exports map is a separate resolution from
// `default`, so a consumer-shaped tsc run is the only thing that exercises it.
const imports = pluginNames.map(
  (name, i) =>
    `import p${i} from "${name}";\nimport * as r${i} from "${name}/requests";`
);
fs.writeFileSync(
  path.join(tmp, "consume.ts"),
  `import RequestHandler, { memoryBackend } from "@dianemo/core";
${imports.join("\n")}

const handler = new RequestHandler({ key: "verify-key-at-least-32-characters-long", backend: memoryBackend() });
const namespaces = handler.use(${pluginNames.map((_, i) => `p${i}`).join(", ")});
${pluginNames.map((name, i) => `void namespaces.${namespaceOf.get(name)};\nvoid r${i};`).join("\n")}
`
);

fs.writeFileSync(
  path.join(tmp, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022"],
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: ["node"],
      },
      include: ["consume.ts"],
    },
    null,
    2
  ) + "\n"
);

let failed = false;

console.log("Importing every package by bare specifier…");
try {
  process.stdout.write(run("node", ["smoke.mjs"], tmp));
} catch (error) {
  process.stdout.write(error.stdout ?? "");
  process.stderr.write(error.stderr ?? "");
  failed = true;
}

console.log("Type-checking a consumer against the published .d.ts…");
try {
  run(
    path.join(tmp, "node_modules", ".bin", "tsc"),
    ["-p", "tsconfig.json"],
    tmp
  );
  console.log("  consumer type-checks against the published types");
} catch (error) {
  process.stdout.write(error.stdout ?? "");
  process.stderr.write(error.stderr ?? "");
  failed = true;
}

if (KEEP) console.log(`\nTemp project kept at ${tmp}`);
else fs.rmSync(tmp, { recursive: true, force: true });

if (failed) fail("the packed packages do not work as published");
console.log("\n✓ Packed packages work as published.");
