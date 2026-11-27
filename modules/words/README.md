# words — Malagasy cardinal number words

Turns any number from `0` up, whole or decimal, into Malagasy words, as written in the standard
(official) language. The rules have no upper limit; each port stops at its largest exact integer
(see [Errors](#errors)). Input is a number value, or plain decimal text such as
`'2000000000000000.9'` when every digit must be exact (rule 13). Digit separators and other
notations are not parsed.

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Parsers (text typed by users → value) come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function        | Does                    | JavaScript                  | PHP                                                                                                                   |
| --------------- | ----------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `numberToWords` | Number → Malagasy words | `numberToWords(n, options)` | `NumberWords::fromInt($n, $system)`, `NumberWords::fromFloat($n, $system)`, `NumberWords::fromString($text, $system)` |

One option, `system`: `standard` (the default, rules 1–11) or `traditional` (rule 12).

## Rules

1. **Zero** is `aotra`.
2. **Read from the smallest part upwards.** Units come before tens, tens before hundreds, and
   each larger group follows: `21` → `iraika amby roapolo` ("one over twenty").
3. **Joining words depend on what the smaller part is added to:**

   | Added to                                                      | Word       | Examples                                                        |
   | ------------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
   | `folo` (10)                                                   | `ambin'ny` | `11` → `iraika ambin'ny folo`                                   |
   | `roapolo`–`sivifolo` (20–90)                                  | `amby`     | `34` → `efatra amby telopolo`                                   |
   | `zato` (exactly 100)                                          | `amby`     | `105` → `dimy amby zato`; `125` → `dimy amby roapolo amby zato` |
   | `roanjato`–`sivinjato` (200–900) and every group from `arivo` | `sy`       | `205` → `dimy sy roanjato`; `1 100` → `zato sy arivo`           |

4. **Hundreds from 200 take `sy` at every size:** `348` → `valo amby efapolo sy telonjato`,
   `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby`:
   `1 105` → `dimy amby zato sy arivo`, `1 205` → `dimy sy roanjato sy arivo`.
5. **One is `iraika` right before `ambin'ny` or `amby`** (`11`, `21`, `101`, `121`). Before `sy`
   and alone it is `iray`: `1` → `iray`, `201` → `iray sy roanjato`, `1 001` → `iray sy arivo`.
6. **Groups of 1000 and above** are `arivo` (10³), `alina` (10⁴), `hetsy` (10⁵), `tapitrisa`
   (10⁶) and `lavitrisa` (10⁹). The count is read before the group word: `roa arivo`,
   `roapolo tapitrisa`. `arivo`, `alina` and `hetsy` take a count of 1–9 and `tapitrisa` 1–999,
   written with the same rules: `201 000 000` → `iray sy roanjato tapitrisa`.
   **`lavitrisa`, the largest group, takes any count**, written with every rule here, so numbers
   of any size are spelled: `10¹²` → `arivo lavitrisa`, `1 999 × 10⁹` →
   `sivy amby sivifolo sy sivinjato sy arivo lavitrisa`, `10¹⁸` → `iray tapitrisa lavitrisa`.
7. **A count of one is bare only for `arivo`:** `1000` → `arivo`, but `10 000` → `iray alina`,
   `100 000` → `iray hetsy`, `1 000 000` → `iray tapitrisa`, `10⁹` → `iray lavitrisa`.
   `199 102` → `roa amby zato sy sivy arivo sy sivy alina sy iray hetsy`. `10` and `100` are
   `folo` and `zato` (never `iray folo`, `iray zato`).
8. **Groups are joined by `sy`, smallest first:** `280 000` → `valo alina sy roa hetsy`;
   `2026` → `enina amby roapolo sy roa arivo`.
9. **Decimals: `faingo`, then the decimals read as a whole number.** The whole part comes first,
   then `faingo` (the comma), then the digits after the point, read with every rule above:
   `3.14` → `telo faingo efatra ambin'ny folo`, `18.3` → `valo ambin'ny folo faingo telo`.
   Each leading zero after the point is `aotra`: `0.008` → `aotra faingo aotra aotra valo`,
   `1.05` → `iray faingo aotra dimy`. A whole part of zero is `aotra`: `0.5` → `aotra faingo dimy`.
10. **The decimals are those of the number value**, in its shortest exact decimal form. A number
    has no trailing zeros (`1.50` is `1.5`), and a whole-valued number has no `faingo` (`1.0` →
    `iray`). A binary floating-point value reads as it is: `0.1 + 0.2` is
    `0.30000000000000004`, not `0.3`.
11. **Out of scope for now:** negative numbers.
12. **The traditional system** (option `system: traditional`) gives **every power of ten from
    10³ its own name**. It is not used in everyday writing, but it is attested in learner
    material. Each name takes a single digit, 1–9, read with the rules above, and the groups are
    joined by `sy`, smallest first. A count of one is bare only for `arivo` (rule 7). Below
    10 000 the two systems write the same words.

    | Power | Name          | Power | Name                 | Power | Name                        |
    | ----- | ------------- | ----- | -------------------- | ----- | --------------------------- |
    | 10³   | `arivo`       | 10⁹   | `lavitrisa`          | 10¹⁵  | `tsitamboisafaharoa`        |
    | 10⁴   | `alina`       | 10¹⁰  | `alinkisa`           | 10¹⁶  | `lavitrisafaharoa`\*        |
    | 10⁵   | `hetsy`       | 10¹¹  | `tsipesimpesenina`   | 10¹⁷  | `alinkisafaharoa`\*         |
    | 10⁶   | `tapitrisa`   | 10¹²  | `tsitokotsiforohana` | 10¹⁸  | `tsipesimpeseninafaharoa`\* |
    | 10⁷   | `safatsiroa`  | 10¹³  | `tsihitanoanoa`      |       |                             |
    | 10⁸   | `tsitamboisa` | 10¹⁴  | `safatsiroafaharoa`  |       |                             |

    `30 000 000` → `telo safatsiroa` (standard: `telopolo tapitrisa`); `12 345 678 901` →
    `iray sy sivinjato sy valo arivo sy fito alina sy enina hetsy sy dimy tapitrisa sy efatra
safatsiroa sy telo tsitamboisa sy roa lavitrisa sy iray alinkisa`.

    The source names 10⁷–10¹⁵, then skips to 10²¹; its rule is that `<name>faharoa` ("the
    second") is `<name>` × 10⁷. \* 10¹⁶–10¹⁸ are **derived** by that rule (as `phanisana`
    does), so the system names every integer a number value can hold. Decimals after `faingo`
    are read in the same system (rule 9). **No name exists past 10¹⁸**, so a number of 10¹⁹ or
    more, which only decimal text (rule 13) can reach, is written in the standard system. The
    whole part and the decimals are each one number here: `'10000000000000000000'` →
    `folo lavitrisa lavitrisa` in both systems.

13. **Decimal text** is read digit by digit, exactly, with no floating-point rounding:
    `'2000000000000000.9'` → `roa tapitrisa lavitrisa faingo sivy`, where the number
    `2_000_000_000_000_000.9` is already `2000000000000001` before any port sees it. The text is
    digits with an optional `.` and decimals: `'12'`, `'1500.25'`. No sign, space, separator,
    exponent, or missing digit on either side of the point (`'.5'`, `'5.'`), and at most 100
    characters (`limits.maxTextLength`). Anything else is `INVALID_FORMAT`. Leading zeros and
    trailing decimal zeros are dropped, so text reads like the number it writes (rule 10):
    `'007'` → `fito`, `'1.50'` → `iray faingo dimy`, `'0.0'` → `aotra`. Text has no port limit:
    every port reads every digit.

## Errors

| Input                                    | Code             |
| ---------------------------------------- | ---------------- |
| Not a number or text, `NaN`, `Infinity`  | `INVALID_TYPE`   |
| Text that is not plain decimal (rule 13) | `INVALID_FORMAT` |
| A `system` other than the two of rule 12 | `INVALID_TYPE`   |
| Below 0                                  | `OUT_OF_RANGE`   |
| Above the port's largest exact integer   | `OUT_OF_RANGE`   |

The spec sets no maximum. For number values, a port stops where its integer type stops being
exact (decimal text has no such limit):

| Port       | Largest input                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| JavaScript | `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991)                                                         |
| PHP        | `PHP_INT_MAX` (9 223 372 036 854 775 807, on 64-bit) for `fromInt`; 9 007 199 254 740 991 for `fromFloat` |

Shared vectors stay within 9 007 199 254 740 991 so every port runs all of them.

## Sources

- Assimil, _Le malgache de poche_ (2000), as quoted by Languages and Numbers:
  <https://www.languagesandnumbers.com/how-to-count-in-malagasy/en/mlg/>. Digits, tens,
  hundreds, `ambin'ny`, and the examples `348` and `2 586`. This is the project's reference.

- Malagasy Dictionary and Encyclopedia of Madagascar (J.-M. de La Beaujardière, linguistic
  advisors I. Paul, H. Razanarisoa, B. S. Ralalaoherivony, L. Koziol):
  - Numbers table: <https://malagasyword.org/bins/manisa>
  - Entries `amby`, `iraika`, `aotra`, `alina`, `hetsy`, `tapitrisa`, `lavitrisa`, `faingo`:
    `https://malagasyword.org/bins/teny2/<word>`
- `2026` and `3.14` examples: README of the `malagasy-numberwords` LaTeX package (CTAN, 2026),
  <https://ctan.org/pkg/malagasy-numberwords>.
- `18.3` and `0.008` examples: README of the `tanisa` npm package,
  <https://unpkg.com/tanisa@1.2.0/README.md>.
- Traditional system (rule 12): the names for 10⁷–10¹⁵ and the `faharoa` rule from Languages
  and Numbers (quoting Assimil), above. One digit per name, joined by `sy`, smallest first:
  the 12 345 678 901 example of `tanisa` 1.1.3, <https://unpkg.com/tanisa@1.1.3/README.md>,
  and the `phanisana` PHP library, which also derives 10¹⁶–10¹⁸,
  <https://github.com/mamyraoby/phanisana/blob/main/src/Enum/Dictionary.php>.

## Waiting for a source or an expert

Not in the data until a source settles them, or a Malagasy language expert reviews them.

- **Negative numbers.** Out of scope (rule 11). Malagasy Wikipedia defines negative numbers as
  numbers `latsaky ny aotra` ("below zero",
  [Isa miiba](https://mg.wikipedia.org/wiki/Isa_miiba)) but writes its examples only in digits
  (`−3`, `−100`). Elsewhere `latsaky ny` means "less than" (`isa latsaky ny zato`, numbers below
  a hundred, [Fanisana amin' ny teny malagasy](https://mg.wikipedia.org/wiki/Fanisana_amin'_ny_teny_malagasy)),
  so `latsaky ny dimy` would read as "less than five", not "minus five". `tanisa` rejects
  negatives (`toWords(-5)` throws). Needed: a source that spells a negative number in words.

## Recorded disagreements

- **Spelling of two traditional names (rule 12).** `phanisana` writes `tsipesimpesina` (10¹¹)
  and `tsitanoanoa` (10¹³); Languages and Numbers (Assimil) writes `tsipesimpesenina` and
  `tsihitanoanoa`. The data follows Assimil, the project's reference, including in the derived
  `tsipesimpeseninafaharoa` (10¹⁸). Decided by the maintainers on 2026-11-27.
- **`sy` before 200–900 at every size (rule 4).** Assimil gives `348` → `valo amby efapolo amby
telonjato` (`amby` below 1000) but `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`
  (`sy` before the hundreds). The dictionary's `tapitrisa` entry writes
  `valopolo amby roanjato tapitrisa`. The data uses `sy` for 200–900 everywhere, one rule that
  matches the `2 586` example; `348` and `280 000 000` differ from those two attestations.
  Decided by the maintainers on 2026-11-24.
- **`ambin'ny` vs `ambin' ny`.** The dictionary writes `ambin' ny`; Assimil and everyday
  writing use `ambin'ny`. Since spec 0.3.0 the data follows `ambin'ny`, with an ASCII
  apostrophe (Assimil prints a typographic `’`).
- **`isa` vs `iray` for 1.** The dictionary's numbers table lists `isa` (the counting form);
  its `iray` entry gives `iray` as the adjective "one", which is the form used in sentences
  and in Assimil. The data follows `iray`.
- **`iray alina` vs `alina`.** The dictionary's numbers table and Assimil give the bare words
  (`alina`, `hetsy`, `tapitrisa`, `lavitrisa`). Since spec 0.4.0 the data writes `iray` before
  every group except `arivo`, as in everyday and learner usage. Decided by the maintainers on
  2026-11-25.
- **Counts of 1000 and more before `lavitrisa` (rule 6).** The sources stop at `lavitrisa`
  (10⁹) and attest no larger group word. The data reuses `lavitrisa` with a count written by
  the same rules (`arivo lavitrisa` for 10¹²) instead of inventing one. Decided by the
  maintainers on 2026-11-26. Because the count is itself joined by `sy`, some phrases read two
  ways: `iray sy arivo lavitrisa` is both `1 001 × 10⁹` (the output) and `1 + 1 000 × 10⁹`
  (whose output is the same phrase). Output stays one phrase per number; a future
  words-to-number parser must decide how to read these.
- **Leading zeros after `faingo` (rule 9).** `tanisa` reads each one as `aotra` (`0.008` →
  `aotra faingo aotra aotra valo`). The `malagasy-numberwords` guide lists it as a known
  limitation that `3,05` may be read as `5` instead of zero then five. The data follows `tanisa`,
  so `1.05` and `1.5` stay different. Decided by the maintainers on 2026-11-26.
- **Largest-first for millions.** Some texts put the millions first (`dimy tapitrisa sy …`).
  The dictionary and Assimil read every number from the smallest part up; the data follows them.
- **Older `roa amby ny folo` (12).** The `amby` and `lavitrisa` entries quote this older
  form; Assimil mentions `amby ny` too. The data uses `ambin'ny`.
