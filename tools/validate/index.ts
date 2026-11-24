// Validates every spec file: data against its module schema, vectors against the shared
// schema, error codes against errors.yaml, and provenance dates.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Ajv2020 } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  MODULE_FILES,
  SCHEMAS_DIR,
  SPEC_DIR,
  isoDate,
  listModules,
  moduleFile,
  readErrors,
  readJson,
  readTestVectors,
  readYaml,
} from '../lib/spec.ts';

const SHARED_SCHEMAS = ['source', 'tests', 'errors'] as const;
const today = isoDate();
const problems: string[] = [];

const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats.default(ajv);
for (const name of SHARED_SCHEMAS) {
  ajv.addSchema(readJson(join(SCHEMAS_DIR, `${name}.schema.json`)) as object);
}

function check(schemaOrId: string | object, data: unknown, label: string): void {
  const validate =
    typeof schemaOrId === 'string' ? ajv.getSchema(schemaOrId) : ajv.compile(schemaOrId);
  if (validate === undefined) throw new Error(`Unknown schema for ${label}`);
  if (validate(data)) return;
  for (const error of validate.errors ?? []) {
    problems.push(`${label}${error.instancePath}: ${error.message ?? 'invalid'}`);
  }
}

function checkDates(value: unknown, label: string): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      checkDates(item, `${label}/${String(index)}`);
    });
  } else if (value !== null && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) {
      if (key === 'checked' && typeof inner === 'string' && inner > today) {
        problems.push(`${label}: checked date ${inner} is in the future`);
      }
      checkDates(inner, `${label}/${key}`);
    }
  }
}

const errorsFile = join(SPEC_DIR, 'errors.yaml');
check(
  'https://github.com/madagascar-oss/mg-utils-spec/schemas/errors.schema.json',
  readYaml(errorsFile),
  'errors.yaml',
);
const knownCodes = new Set(readErrors().map((error) => error.code));

for (const module of listModules()) {
  const missing = MODULE_FILES.filter((file) => !existsSync(moduleFile(module, file)));
  if (missing.length > 0) {
    problems.push(`modules/${module}: missing ${missing.join(', ')}`);
    continue;
  }
  const data = readYaml(moduleFile(module, 'data.yaml'));
  check(readJson(moduleFile(module, 'schema.json')) as object, data, `modules/${module}/data.yaml`);
  checkDates(data, `modules/${module}/data.yaml`);

  const vectors = readTestVectors(module);
  check(
    'https://github.com/madagascar-oss/mg-utils-spec/schemas/tests.schema.json',
    vectors,
    `modules/${module}/tests.yaml`,
  );
  vectors.forEach((vector, index) => {
    if (vector.error !== undefined && !knownCodes.has(vector.error)) {
      problems.push(
        `modules/${module}/tests.yaml/${String(index)}: unknown error code ${vector.error}`,
      );
    }
  });
}

if (problems.length > 0) {
  console.error(`Spec validation failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Spec valid: ${listModules().join(', ')}`);
