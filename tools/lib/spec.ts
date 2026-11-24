import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const ROOT_DIR = fileURLToPath(new URL('../..', import.meta.url));
export const SPEC_DIR = ROOT_DIR;
export const MODULES_DIR = join(SPEC_DIR, 'modules');
export const SCHEMAS_DIR = join(SPEC_DIR, 'schemas');
/** Length of an ISO 8601 calendar date such as 2026-11-24. */
const ISO_DATE_LENGTH = 10;
/** Indentation of JSON files written by tools, matching Prettier. */
export const JSON_INDENT = 2;

/** Today's date as YYYY-MM-DD (tools only; library code never reads the clock). */
export function isoDate(date: Date = new Date()): string {
  return date.toISOString().slice(0, ISO_DATE_LENGTH);
}

export const MODULE_FILES = ['README.md', 'data.yaml', 'schema.json', 'tests.yaml'] as const;

export function listModules(): string[] {
  return readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function readYaml(path: string): unknown {
  return parse(readFileSync(path, 'utf8'));
}

export function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function moduleFile(module: string, file: (typeof MODULE_FILES)[number]): string {
  return join(MODULES_DIR, module, file);
}

export function readSpecVersion(): string {
  return readFileSync(join(SPEC_DIR, 'VERSION'), 'utf8').trim();
}

export interface ErrorDefinition {
  readonly code: string;
  readonly description: string;
}

export function readErrors(): readonly ErrorDefinition[] {
  return readYaml(join(SPEC_DIR, 'errors.yaml')) as ErrorDefinition[];
}

export interface TestVector {
  readonly fn?: string;
  readonly input: unknown;
  readonly args?: readonly unknown[];
  readonly expected?: unknown;
  readonly error?: string;
  readonly note?: string;
}

export function readTestVectors(module: string): readonly TestVector[] {
  return readYaml(moduleFile(module, 'tests.yaml')) as TestVector[];
}
