#!/usr/bin/env node
/**
 * Generate TypeScript types from a Google Discovery document's `schemas`.
 *
 *   node scripts/generate-google-discovery-types.mjs <discovery.json> <out.ts>
 *   node scripts/generate-google-discovery-types.mjs <discovery.json> <out.ts> --check
 *
 * One exported type per schema, named as in the document, sorted by name so
 * the output is deterministic. Every property is optional: discovery never
 * marks response fields required. `--check` exits 1 when the file on disk
 * differs from what would be generated.
 */
import path from "node:path";
import fs from "node:fs";
import * as prettier from "prettier";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const [input, output] = args.filter((a) => a !== "--check");
if (!input || !output) {
  console.error(
    "usage: generate-google-discovery-types.mjs <discovery.json> <out.ts> [--check]"
  );
  process.exit(2);
}

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** The TypeScript type for one discovery schema node. */
function typeOf(schema) {
  if (schema.$ref) return schema.$ref;
  if (schema.enum) return schema.enum.map((v) => JSON.stringify(v)).join(" | ");
  switch (schema.type) {
    case "string":
      // int64 travels as a JSON string; every other format is a plain string.
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array": {
      const item = schema.items ? typeOf(schema.items) : "unknown";
      return item.includes(" | ") ? `(${item})[]` : `${item}[]`;
    }
    case "object":
      if (schema.properties) return inlineObject(schema.properties);
      if (schema.additionalProperties) {
        return `Record<string, ${typeOf(schema.additionalProperties)}>`;
      }
      return "unknown";
    default:
      return "unknown";
  }
}

function inlineObject(properties) {
  return `{\n${members(properties)}\n}`;
}

/** A JSDoc block, or "" when there is nothing to say. */
function doc(schema, indent) {
  const lines = [];
  if (schema.description) {
    lines.push(...schema.description.replaceAll("*/", "*\\/").split("\n"));
  }
  if (schema.deprecated) lines.push("@deprecated");
  if (lines.length === 0) return "";
  if (lines.length === 1) return `${indent}/** ${lines[0]} */\n`;
  return `${indent}/**\n${lines.map((l) => `${indent} * ${l}`.trimEnd()).join("\n")}\n${indent} */\n`;
}

function members(properties) {
  return Object.keys(properties)
    .sort()
    .map((name) => {
      const prop = properties[name];
      const key = IDENT.test(name) ? name : JSON.stringify(name);
      return `${doc(prop, "")}${key}?: ${typeOf(prop)};`;
    })
    .join("\n");
}

function declaration(name, schema) {
  const head = doc(schema, "");
  if (
    schema.type === "object" &&
    schema.properties &&
    Object.keys(schema.properties).length > 0
  ) {
    return `${head}export interface ${name} {\n${members(schema.properties)}\n}\n`;
  }
  if (schema.type === "object" && !schema.additionalProperties) {
    // An empty interface accepts any value; this accepts only `{}`.
    return `${head}export type ${name} = Record<string, never>;\n`;
  }
  return `${head}export type ${name} = ${typeOf(schema)};\n`;
}

const discovery = JSON.parse(fs.readFileSync(input, "utf8"));
const schemas = discovery.schemas ?? {};
const header = `// Generated — do not edit.
// Source: ${discovery.title ?? discovery.name} ${discovery.version}, revision ${discovery.revision ?? "unknown"}.
// Regenerate with \`npm run generate:google-types\`.
`;
const body = Object.keys(schemas)
  .sort()
  .map((name) => declaration(name, schemas[name]))
  .join("\n");

const target = path.resolve(output);
const options = (await prettier.resolveConfig(target)) ?? {};
const text = await prettier.format(`${header}\n${body}`, {
  ...options,
  parser: "typescript",
});

if (CHECK) {
  const current = fs.existsSync(target)
    ? fs.readFileSync(target, "utf8")
    : null;
  if (current !== text) {
    console.error(
      `${output} is stale; run \`npm run generate:google-types\` and commit it.`
    );
    process.exit(1);
  }
  console.log(`${output} is up to date.`);
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  console.log(`wrote ${output} (${Object.keys(schemas).length} types)`);
}
