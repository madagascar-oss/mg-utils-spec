// Scaffolds a spec module: README, data, schema and test vectors.
// Each language repo has its own scaffold for the code side.
// Usage: just new-module <name>   (lower-case, e.g. ariary)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSON_INDENT, MODULES_DIR, ROOT_DIR, isoDate } from '../lib/spec.ts';

const MODULE_NAME = /^[a-z][a-z0-9]*$/;
const name = process.argv[2] ?? '';
if (!MODULE_NAME.test(name)) {
  console.error('Usage: just new-module <name>  (lower-case letters and digits, e.g. ariary)');
  process.exit(1);
}
const specDir = join(MODULES_DIR, name);
if (existsSync(specDir)) {
  console.error(`Module "${name}" already exists.`);
  process.exit(1);
}

const pascal = name.charAt(0).toUpperCase() + name.slice(1);
const fnName = `check${pascal}Input`;
const today = isoDate();

function write(path: string, content: string): void {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, content);
  console.log(`created ${path.slice(ROOT_DIR.length)}`);
}

write(
  join(specDir, 'README.md'),
  `# ${name}

What this module does, in one sentence.

## Public API

Every language port provides each function below, named the way its language does it.

| Function | Does | JavaScript | PHP |
| --- | --- | --- | --- |
| \`${fnName}\` | Placeholder — rename it in spec and code | \`${fnName}(input)\` | TODO |

## Rules

1. Write each rule in plain words, with an example.

## Errors

| Input | Code |
| --- | --- |
| Not a string | \`INVALID_TYPE\` |

## Sources

- Link every official source used in \`data.yaml\`.

## Recorded disagreements

- None yet.
`,
);

write(
  join(specDir, 'data.yaml'),
  `# Data for ${name}. Every entry needs \`source:\` (https URL) and \`checked:\` (date).
entries: []
# - id: example
#   value: "..."
#   source: https://...
#   checked: ${today}
`,
);

write(
  join(specDir, 'schema.json'),
  `${JSON.stringify(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: `https://github.com/mdgascar/mdg-utils-spec/modules/${name}/schema.json`,
      title: name,
      type: 'object',
      additionalProperties: false,
      required: ['entries'],
      properties: {
        entries: { type: 'array', items: { $ref: '../../schemas/source.schema.json' } },
      },
    },
    null,
    JSON_INDENT,
  )}\n`,
);

write(
  join(specDir, 'tests.yaml'),
  `# Shared test vectors for ${fnName}. Every language must pass all of them.
- input: "example"
  expected: "example"
- input: null
  error: INVALID_TYPE
`,
);

console.log(
  `Next: fill modules/${name}/, run \`just validate\`, then scaffold the code in mdg-utils-js and mdg-utils-php.`,
);
