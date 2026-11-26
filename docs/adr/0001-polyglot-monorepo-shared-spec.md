# 0001. Polyglot monorepo with a shared spec

- Status: superseded by [0003](0003-split-repos-per-language.md)
- Date: 2026-11-23

## Context

mdg-utils gives developers Malagasy-specific helpers (number words, phone numbers, Ariary
amounts, dates) in several languages, starting with JavaScript and PHP. The same Malagasy data
and rules would otherwise be copied into each language and drift apart: a new operator prefix
fixed in one port but not another, or two ports spelling 11 differently. The project is run by
volunteers, so every repeated task must be cheap or automated.

## Decision

One repository, `mdgascar/mdg-utils`, holds:

- `spec/` — the single source of truth: for each module, rules in plain words (`README.md`),
  data with a source and check date per entry (`data.yaml`), a JSON Schema (`schema.json`) and
  language-neutral test vectors (`tests.yaml`). Error codes are shared (`spec/errors.yaml`).
- `tools/codegen` — turns spec data into native constants per language. Generated files are
  committed, carry a `GENERATED — edit spec/ instead` header, and CI fails if they drift.
- One folder per language (`js/`, `php/`, later `python/`), each running every spec vector.
  A port is done when it passes all of them.
- Tooling at the root, behind one `justfile`.

PHP is mirrored read-only to `mdg-utils-php` for Packagist, because Packagist needs a
`composer.json` at the repository root.

## Consequences

- A data fix is one change to `spec/` plus regenerated code, reviewed once.
- Non-coders can contribute data and vectors without touching any language.
- Contributors need Node.js for codegen even when working on another language; the dev
  container provides it.
- CI runs every language on every PR, so it is slower than one-language repositories.
- Releases need care: JS and PHP versions are bumped from the same changeset.

## Alternatives considered

- **One repository per language.** Simple per-language tooling, but data and behaviour drift,
  and every fix needs N pull requests.
- **Runtime loading of shared JSON data.** Avoids codegen, but adds file I/O or a data
  package dependency, breaks tree-shaking and the zero-runtime-dependency rule.
- **Hand-written constants checked by tests only.** Vectors catch wrong behaviour but not
  missing data, and still duplicate every value by hand.
