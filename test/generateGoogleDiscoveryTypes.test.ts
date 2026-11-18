import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(import.meta.dirname, "..");
const SCRIPT = path.join(ROOT, "scripts/generate-google-discovery-types.mjs");
const FIXTURE = path.join(ROOT, "test/fixtures/discovery-mini.json");

function outFile(): string {
  return path.join(mkdtempSync(path.join(os.tmpdir(), "gdt-")), "out.ts");
}

function generate(out: string): string {
  execFileSync("node", [SCRIPT, FIXTURE, out], { stdio: "pipe" });
  return readFileSync(out, "utf8");
}

describe("generate-google-discovery-types", () => {
  it("maps scalars, arrays, refs and maps", () => {
    const src = generate(outFile());
    expect(src).toContain("export interface Zeta {");
    expect(src).toContain("export interface Alpha {");
    expect(src).toContain("name?: string;");
    expect(src).toContain("count?: number;");
    expect(src).toContain("ratio?: number;");
    expect(src).toContain("flag?: boolean;");
    expect(src).toContain("tags?: string[];");
    expect(src).toContain("alphas?: Alpha[];");
    expect(src).toContain("alpha?: Alpha;");
    expect(src).toContain("labels?: Record<string, string>;");
    expect(src).toContain("extras?: Record<string, unknown>;");
    expect(src).toContain("anything?: unknown;");
    expect(src).toContain("blob?: unknown;");
    expect(src).toContain("values?: unknown[][];");
  });

  it("an object with no properties is not an empty interface", () => {
    expect(generate(outFile())).toContain(
      "export type Empty = Record<string, never>;"
    );
  });

  it("int64 strings stay string", () => {
    expect(generate(outFile())).toContain("big?: string;");
  });

  it("enums become literal unions", () => {
    expect(generate(outFile())).toContain(
      'mode?: "MODE_UNSPECIFIED" | "FAST" | "SLOW";'
    );
  });

  it("descriptions become JSDoc", () => {
    const src = generate(outFile());
    expect(src).toContain("/** A zeta thing. */");
    expect(src).toContain("/** The name. */");
    expect(src).toMatch(/@deprecated[\s\S]*old\?: string;/);
    expect(src).toMatch(/generated — do not edit/i);
  });

  it("output is stable across runs and sorted by name", () => {
    const a = generate(outFile());
    const b = generate(outFile());
    expect(a).toBe(b);
    expect(a.indexOf("interface Alpha")).toBeLessThan(
      a.indexOf("interface Zeta")
    );
  });

  it("--check fails on a stale file", () => {
    const out = outFile();
    generate(out);
    const ok = spawnSync("node", [SCRIPT, FIXTURE, out, "--check"]);
    expect(ok.status).toBe(0);
    writeFileSync(out, readFileSync(out, "utf8") + "// stale\n");
    const stale = spawnSync("node", [SCRIPT, FIXTURE, out, "--check"]);
    expect(stale.status).toBe(1);
  });
});
