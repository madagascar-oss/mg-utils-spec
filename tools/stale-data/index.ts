// Lists spec data entries whose `checked:` date is older than 12 months.
// Prints a Markdown issue body; the monthly workflow opens or updates an issue with it.
import { isoDate, listModules, moduleFile, readYaml } from '../lib/spec.ts';

const MAX_AGE_MONTHS = 12;
const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - MAX_AGE_MONTHS);
const cutoffDate = isoDate(cutoff);

interface StaleEntry {
  readonly path: string;
  readonly checked: string;
  readonly source: string;
}

function findStale(value: unknown, path: string): StaleEntry[] {
  if (Array.isArray(value))
    return value.flatMap((item, index) => findStale(item, `${path}[${String(index)}]`));
  if (value === null || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  const own =
    typeof record['checked'] === 'string' && record['checked'] < cutoffDate
      ? [{ path, checked: record['checked'], source: String(record['source']) }]
      : [];
  const nested = Object.entries(record).flatMap(([key, inner]) =>
    findStale(inner, `${path}.${key}`),
  );
  return [...own, ...nested];
}

const stale = listModules().flatMap((module) =>
  findStale(readYaml(moduleFile(module, 'data.yaml')), `spec/${module}/data.yaml`),
);

if (stale.length === 0) {
  console.log(`No data entries older than ${String(MAX_AGE_MONTHS)} months.`);
} else {
  console.log(
    `These entries were last checked before ${cutoffDate}. Re-check each source, then update \`checked:\` (and the value if it changed).\n`,
  );
  for (const entry of stale) {
    console.log(`- [ ] \`${entry.path}\` — checked ${entry.checked} — ${entry.source}`);
  }
}
