# mdg-utils-spec

The shared contract behind mdg-utils: Malagasy data with official sources, and the test
vectors every language port must pass.

[![CI](https://github.com/mdgascar/mdg-utils-spec/actions/workflows/ci.yml/badge.svg)](https://github.com/mdgascar/mdg-utils-spec/actions/workflows/ci.yml)

Spec version: see [`VERSION`](VERSION) · releases are tagged `vX.Y.Z`.

## Modules

| Module                             | What it does                                                        |
| ---------------------------------- | ------------------------------------------------------------------- |
| [words](modules/words/README.md)   | `21` → `iraika amby roapolo` and back, ordinals (`fahatelo`)        |
| [phone](modules/phone/README.md)   | Parse, validate and format `+261` mobile and fixed numbers          |
| [ariary](modules/ariary/README.md) | `1500` → `Ar 1 500`, parse, words, FMG                              |
| [date](modules/date/README.md)     | `2026-11-23` → `23 Novambra 2026` and back, month and weekday names |

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

Docs for every module, and a playground that runs each port live in the browser:
**[mdgascar.github.io/mdg-utils-docs](https://mdgascar.github.io/mdg-utils-docs/)**.

| Language   | Repository                                                 | Package                           |
| ---------- | ---------------------------------------------------------- | --------------------------------- |
| JavaScript | [mdg-utils-js](https://github.com/mdgascar/mdg-utils-js)   | `@mdgascar/*` on npm              |
| PHP        | [mdg-utils-php](https://github.com/mdgascar/mdg-utils-php) | `mdgascar/mdg-utils` on Packagist |

Each implementation includes this repository as a git submodule at `spec/`, pinned to a
spec commit. A port is done when it passes every vector. Want another language? Open a
[new-language issue](https://github.com/mdgascar/mdg-utils-spec/issues/new/choose).

Why this layout: [ADR 0003](docs/adr/0003-split-repos-per-language.md).

## Known bugs

Bugs found in the spec or its data, and what became of them. Report a new one in an
[issue](https://github.com/mdgascar/mdg-utils-spec/issues/new/choose).

### Fixed in 0.9.0

| Module | Bug                                                                                                                                                                                                                   | Fix                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| words  | Two numbers had the same words: `iray sy roanjato tapitrisa` was both 201 000 000 and 200 000 001, and `iray sy arivo lavitrisa` both 1 001 000 000 000 and 1 000 000 000 001. A count before a group word used `sy`. | A count is one phrase joined by `amby` (rules 4 and 6): 201 000 000 is `iraika amby roanjato tapitrisa`. |
| words  | `280 000 000` was `valopolo sy roanjato tapitrisa`, against the dictionary and Wikipedia (`valopolo amby roanjato tapitrisa`).                                                                                        | Same fix.                                                                                                |
| words  | Rule 6 gave `iray tapitrisa lavitrisa` as 10¹⁸; it is 10¹⁵.                                                                                                                                                           | Example corrected.                                                                                       |
| ariary | `parseAriary` rounded decimals a number cannot hold (`0,123456789012345678`) without a word.                                                                                                                          | `PRECISION_LOSS`, or the exact digits with `{ as: 'text' }`.                                             |
| ariary | `fmgToAriary` and `ariaryToFmg` rounded results a number cannot hold (`0.30000000000000004` FMG → `0.06000000000000001` Ar).                                                                                          | Same fix.                                                                                                |
| ariary | `formatAriary` wrote amounts that `parseAriary` refused: formatting writes every decimal (up to 329 characters), reading stopped at 32.                                                                               | Reading takes 329 characters, so every formatted amount reads back.                                      |
| phone  | Yas numbers in `036` were `UNKNOWN_OPERATOR`.                                                                                                                                                                         | `36` added for Yas Madagascar.                                                                           |
| phone  | Fixed-line numbers (`020 …`, `022 …`) were `UNKNOWN_OPERATOR`, and the error description said "mobile operator".                                                                                                      | Fixed lines added with their zones and towns (rule 3); `UNKNOWN_OPERATOR` covers every operator.         |

### Open

| Module | Bug                                                                                                                                                                                                        | Status                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| words  | From one million billion up, a few phrases are written the same for two numbers: `dimy amby roapolo tapitrisa lavitrisa` (25 000 000 000 000 000, or 20 000 005 000 000 000). The language itself does it. | `parseWords` answers `AMBIGUOUS` and never guesses. Waiting for a source. |
| date   | `Mey` is both the name and the abbreviation of May, so `5 Mey 12` reads as two dates (styles `long` and `medium`). Only years up to 31.                                                                    | `parseDate` answers `AMBIGUOUS` unless a style is given. Comes from CLDR. |

## Contributing

You can help without writing code: fix data with a source, or add test vectors. See
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
