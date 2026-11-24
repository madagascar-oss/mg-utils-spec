# mg-utils-spec

The shared contract behind mg-utils: Malagasy data with official sources, and the test
vectors every language port must pass.

[![CI](https://github.com/madagascar-oss/mg-utils-spec/actions/workflows/ci.yml/badge.svg)](https://github.com/madagascar-oss/mg-utils-spec/actions/workflows/ci.yml)

Spec version: see [`VERSION`](VERSION) · releases are tagged `vX.Y.Z`.

## Modules

| Module                             | What it does                                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| [words](modules/words/README.md)   | `21` → `iraika amby roapolo`                                           |
| [phone](modules/phone/README.md)   | Parse, validate and format `+261` mobile numbers                       |
| [ariary](modules/ariary/README.md) | `1500` → `Ar 1 500`, parse, words, FMG                                 |
| [date](modules/date/README.md)     | `2026-11-23` → `Alatsinainy 23 Novambra 2026`, month and weekday names |

Each folder in [`modules/`](modules) holds:

- `README.md` — rules in plain words, sources, recorded disagreements
- `data.yaml` — the data, every entry with `source:` and `checked:`
- `schema.json` — JSON Schema for `data.yaml`
- `tests.yaml` — shared test vectors (the contract)

Error codes shared by every language live in [`errors.yaml`](errors.yaml); the JSON Schemas
for sources, vectors and errors live in [`schemas/`](schemas).

```text
VERSION              spec version, tagged vX.Y.Z on release
errors.yaml          error codes shared by every language
modules/<name>/      README.md · data.yaml · schema.json · tests.yaml
schemas/             source, tests and errors JSON Schemas
tools/               validate, stale-data, new-module (dev only)
docs/adr/            architecture decisions
```

## Implementations

| Language   | Repository                                                     | Package                                |
| ---------- | -------------------------------------------------------------- | -------------------------------------- |
| JavaScript | [mg-utils-js](https://github.com/madagascar-oss/mg-utils-js)   | `@madagascar-oss/*` on npm             |
| PHP        | [mg-utils-php](https://github.com/madagascar-oss/mg-utils-php) | `madagascar-oss/mg-utils` on Packagist |

Each implementation includes this repository as a git submodule at `spec/`, pinned to a
release tag. A port is done when it passes every vector. Want another language? Open a
[new-language issue](https://github.com/madagascar-oss/mg-utils-spec/issues/new/choose).

Why this layout: [ADR 0003](docs/adr/0003-split-repos-per-language.md).

## Contributing

You can help without writing code: fix data with a source, or add test vectors. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
