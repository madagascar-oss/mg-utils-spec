# 0002. PHP port

- Status: proposed
- Date: 2026-11-24
- Comment window: 7 days from opening the PR

## Context

Phase 2 of the handbook adds PHP as the second language. The port must pass the same spec
vectors as JavaScript, feel native to PHP developers (Symfony components are the reference),
and ship to Packagist, which needs `composer.json` at a repository root.

## Decision

- **Package and namespace.** Composer package `mdgascar/mdg-utils`, namespace
  `Mdgascar\MdgUtils`, one sub-namespace per module (`Words`, `Phone`, …), PHP `>=8.3`, no
  runtime dependencies.
- **Shape.** Pure static entry points for conversions (`NumberWords::fromInt()`) and
  `final readonly` value objects for domain values (`PhoneNumber::parse()`), with backed
  enums for closed sets (`ErrorCode`, `Operator`, `PhoneNumberFormat`).
- **Generated code.** `tools/codegen` writes `ErrorCode`, `Spec` and each module's
  `Generated/Data.php` (typed class constants, `@internal`) from the same language-neutral
  tables as TypeScript (`tools/codegen/shared/tables.ts`). Generated files are written in
  PER-CS style and excluded from php-cs-fixer, so the drift check compares exactly what the
  generator prints.
- **Errors.** `MdgUtilsException` (extends `InvalidArgumentException`) carries
  `ErrorCode $errorCode` with the shared spec codes.
- **`INVALID_TYPE` in a typed language.** With `declare(strict_types=1)`, PHP rejects wrong
  types before our code runs, with `TypeError`; an unknown enum name raises `ValueError`.
  The spec runner treats both as `INVALID_TYPE`. Throwing `MdgUtilsException` for them instead
  would need `mixed` parameters everywhere and fight the language.
- **Tooling.** PHPUnit (100% coverage gate), PHPStan level max with strict rules and
  `phpVersion: 80300`, PHPMD (complexity ≤ 10, methods ≤ 25 lines, naming), php-cs-fixer
  (PER-CS), PHPBench. No `composer.lock`: each CI PHP version resolves compatible dev tools.
- **Distribution.** `php/` is split to the read-only mirror `mdgascar/mdg-utils-php`
  on release and published from there to Packagist (see the release workflow). Commits on the
  mirror are rewritten by the split, so they are not signed; the monorepo stays the signed
  source of truth.

## Consequences

- One PR changes data for both languages; vectors catch any behavioural drift.
- Contributors to PHP need Node.js only to run codegen; the dev container has both.
- PHP and JS APIs look different (`NumberWords::fromInt` vs `numberToWords`) but share
  vectors, error codes and data. `php/tests/spec-functions.php` maps one to the other.

## Alternatives considered

- **Mirror the JS function names in PHP** (`numberToWords()` functions). Matches the spec
  literally, but namespaced functions are unusual in Symfony-style code and harder to mock.
- **Commit `composer.lock`.** Reproducible, but PHPUnit 13 and symfony/yaml 8 need PHP 8.4,
  so one lock cannot serve the whole 8.3–8.5 matrix.
