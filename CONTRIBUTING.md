# Contributing to mg-utils-spec

This repository is the contract. Changes here reach every language, so they are reviewed for
correctness and sources first.

The [organisation guide](https://github.com/madagascar-oss/.github/blob/main/CONTRIBUTING.md)
and [Code of Conduct](https://github.com/madagascar-oss/.github/blob/main/CODE_OF_CONDUCT.md)
apply too.

## Steps

1. **Find work.** Issues labelled `good first issue`, `help wanted` or `no-code`.
2. **Set up.** Node.js 22.18+, pnpm and [just](https://just.systems), then `just setup`.
3. **Change data or vectors.** Edit `modules/<module>/data.yaml` or `modules/<module>/tests.yaml`, then
   `just validate`. Branch from `dev` as `<type>/<short-name>`, e.g. `fix/phone-dots`.
4. **Open the PR against `dev`.** Cite a source for any data. The conformance check runs the
   JS and PHP ports against your change, so you see which ports need code.
5. **Ports follow.** After the spec is released, Renovate opens a PR in each language repo
   to bump the `spec/` submodule; that PR carries the code change.

## Branches and releases

```text
feat/… fix/… ──squash──▶ dev ──merge──▶ main ──▶ tag vX.Y.Z
```

Bump [`VERSION`](VERSION) in the PR that changes the spec. Merging `dev` into `main` tags
`v<VERSION>` and creates the GitHub release.

## Public API rules

- Each module README has a **Public API** table. A port is complete when it passes every vector
  **and** provides every function in that table, named the way its language does it.
- A parser (text typed by users → value) comes in three forms: `parse` throws, `safeParse` returns the
  value or the error code, `tryParse` returns the value or nothing (`undefined` in JavaScript,
  `null` in PHP). None of the last two ever throws.
- Extras are allowed only to adapt the language's native types (for example its date type), and
  are listed under the table. Anything else goes into the table first, so every port gets it.

## Data rules

- **No source, no merge.** An official page, a law or decree, a regulator publication, or a
  recognised dictionary or grammar.
- Every entry has `checked:` — the date someone last verified it. A monthly job lists entries
  older than 12 months.
- When official sources disagree, keep both in the module README and say which one the data
  follows and why.

## Versioning

Before 1.0.0, a major change bumps the minor version instead.

| Change                               | Spec  |
| ------------------------------------ | ----- |
| Typo or wrong value fixed in data    | patch |
| New data (operator, prefix, word)    | minor |
| New helper function                  | minor |
| Output changes for an existing input | major |
| File layout consumers read changes   | major |

Each package states the spec version it implements; its CI fails if it does not match.

## Commands

| Command                  | Does                                            |
| ------------------------ | ----------------------------------------------- |
| `just setup`             | Install dependencies                            |
| `just validate`          | Validate data, schemas, vectors and error codes |
| `just new-module <name>` | Scaffold a module                               |
| `just stale-data`        | List entries not checked for 12 months          |
| `just ci`                | Everything CI runs                              |
