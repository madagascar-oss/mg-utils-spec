# 0003 — One spec repository, one repository per language

- Status: accepted
- Date: 2026-11-24
- Supersedes: [0001](0001-polyglot-monorepo-shared-spec.md)

## Context

ADR 0001 kept the spec and every language in one repository. With two ports and more planned
(Python, possibly led by other maintainers), each language needs its own CI, release pace,
registry layout (Packagist wants `composer.json` at the root) and maintainers.

## Decision

- `mg-utils-spec` holds data, schemas, error codes and test vectors. Tags `vX.Y.Z` are releases.
- `mg-utils-js` and `mg-utils-php` each include the spec as a git submodule at `spec/`,
  pinned to a tag, generate their tables from it and run every vector.
- Renovate bumps the submodule; the bump PR is where a port catches up.
- A conformance workflow in this repository runs the ports against spec pull requests.

Same pattern as Sqids, ua-parser and JSON-Schema-Test-Suite.

## Consequences

- Each port releases on its own; it states the spec version it implements.
- Cross-language changes take two steps: spec release, then port PRs.
- Contributors clone ports with `--recurse-submodules`.
