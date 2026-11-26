# ariary — Malagasy Ariary amounts

Formats, reads and converts amounts in Malagasy Ariary (ISO 4217 `MGA`), writes them in words,
and converts old Malagasy francs (FMG).

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Parsers (text typed by users → value) come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function          | Does                                            | JavaScript                           | PHP                                     |
| ----------------- | ----------------------------------------------- | ------------------------------------ | --------------------------------------- |
| `formatAriary`    | Amount → `Ar 1 500` (grouping, symbol position) | `formatAriary(amount, options)`      | `Ariary::fromInt($amount)->format(...)` |
| `parseAriary`     | Text → amount, or throws                        | `parseAriary(text)`                  | `Ariary::parse($text)->amount`          |
| `safeParseAriary` | Text → amount or error code, never throws       | `safeParseAriary(text)`              | `Ariary::safeParse($text)`              |
| `tryParseAriary`  | Text → amount, or nothing, never throws         | `tryParseAriary(text)` → `undefined` | `Ariary::tryParse($text)` → `null`      |
| `ariaryToWords`   | Amount → Malagasy words + `ariary`              | `ariaryToWords(amount)`              | `Ariary::fromInt($amount)->toWords()`   |
| `fmgToAriary`     | Old francs → Ariary (5 FMG = 1 Ar)              | `fmgToAriary(francs)`                | `Ariary::fromFmg($francs)->amount`      |
| `ariaryToFmg`     | Ariary → old francs                             | `ariaryToFmg(amount)`                | `Ariary::fromInt($amount)->toFmg()`     |
| `formatFmg`       | Francs → `Fmg 7 500`                            | `formatFmg(francs, options)`         | `Ariary::formatFmg($francs, ...)`       |

## Rules

1. **Amounts are whole numbers** from 0 up, the same range as the words module, which spells
   numbers of any size. The spec sets no maximum; a port stops at its largest exact integer:
   `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991) in JavaScript, `PHP_INT_MAX` in PHP.
   Negative amounts and amounts above that limit are `OUT_OF_RANGE`; non-integers are
   `INVALID_TYPE`. Shared vectors stay within 9 007 199 254 740 991.
2. **Default format: `Ar 1 500`.** Symbol `Ar`, a no-break space (U+00A0), then the digits in
   groups of three separated by no-break spaces. No decimals.
3. **Options** (`formatAriary` and `formatFmg`):

   | Option           | Values                      | Example for 1500 |
   | ---------------- | --------------------------- | ---------------- |
   | `grouping`       | `space` (default), `dot`    | `Ar 1.500`       |
   | `symbolPosition` | `before` (default), `after` | `1 500 Ar`       |

   Any other value is `INVALID_TYPE`. **A comma is never a thousand separator in Madagascar.**

4. **Reading text** (`parseAriary`):
   - Accepts the currency as `Ar`, `MGA` or `Ariary` (any case), before or after the amount,
     or no currency at all, but not on both sides.
   - Digit groups may be separated by spaces, no-break spaces, narrow no-break spaces (U+202F)
     or dots, the same separator throughout. Every group after the first has three digits.
   - Rejected with `INVALID_FORMAT`: commas, decimals, signs, leading zeros, other currencies,
     and input longer than 32 characters.
   - Amounts above the port's largest exact integer are `OUT_OF_RANGE`.
5. **In words:** the number in words (see the words module) followed by `ariary`:
   `1500` → `dimanjato sy arivo ariary`.
6. **Malagasy franc:** 1 Ar = 5 FMG. `fmgToAriary` accepts only multiples of 5 (other amounts do
   not convert to whole ariary: `OUT_OF_RANGE`); `ariaryToFmg` multiplies by 5, and a result
   above the port's largest exact integer is `OUT_OF_RANGE`. `formatFmg` uses the same layout
   with the symbol `Fmg`.

## Sources

- Symbol `Ar`, name `Ariary`, symbol spacing: Unicode CLDR 49, locale `mg`
  ([currencies.json](https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/mg/currencies.json),
  [numbers.json](https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-numbers-full/main/mg/numbers.json)).
- Space as thousand separator: Ministry of Economy and Finance, _Annexe au projet de loi
  n° 022/2024 portant loi de finances pour 2025, Tome 3_ (amounts such as `12 075 821 312`),
  [PDF](https://cabri-sbo.org/uploads/bia/Madagascar_2025_Formulation_External_BudgetFramework_MinistryOfFinanceAndEconomicDevelopment_SADCCOMESA_French_32db46.pdf).
- Code `MGA`, numeric 969: ISO 4217 list one (SIX, published 2026-09-17),
  [XML](https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml).
- Franc withdrawn after 2004-12-31: CLDR
  [currencyData.json](https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/currencyData.json)
  (MG: `MGF` until 2004-12-31).
- 1 ariary = 5 francs: Malagasy Dictionary, [ariary](https://malagasyword.org/bins/teny2/ariary)
  ("5,00frs"). The Banky Foiben'i Madagasikara site gave no readable page when checked.

## Recorded decisions

- **Space or dot, never a comma.** CLDR `mg` groups thousands with a comma (`Ar 1,500`). The
  project lead decided (2026-11-24) that Madagascar uses a space or a dot, which matches the
  Ministry of Finance documents above. The spec follows the space by default, offers the dot
  as an option, and keeps CLDR's symbol position (`Ar` first).
- **Reading separators.** Text pasted from documents uses spaces, no-break spaces or narrow
  no-break spaces interchangeably, so all three count as the same separator when reading.
- **Symbol `Fmg`.** ISO uses `MGF` and CLDR `mg` has no symbol for the franc; `Fmg` is the
  abbreviation the project lead asked for.

## Waiting for a source or an expert

- **FMG amounts in words.** Not provided. `iraimbilanja` names one franc (1/5 ariary) in
  [English Wikipedia, Malagasy franc](https://en.wikipedia.org/wiki/Malagasy_franc) and
  [Malagasy Wikipedia, Ariary](https://mg.wikipedia.org/wiki/Ariary), and the latter says a
  franc amount is spoken in ariary (`2 500 F` is said `dimanjato`). No source spells a whole
  FMG amount, so the spec adds no FMG words function until one does. Decided by the
  maintainers on 2026-11-26.

## Recorded disagreements

- **Minor unit.** ISO 4217 lists 2 minor units for MGA; CLDR uses 0 digits and amounts are
  written without decimals in practice. The spec follows CLDR: whole ariary only.
- **Thousand separator.** See "Recorded decisions": CLDR comma vs Ministry of Finance space.
