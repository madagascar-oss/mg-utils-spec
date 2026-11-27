# words: Malagasy number words

Turns any number from `0` up, whole or decimal, into Malagasy words, as written in the standard
(official) language, writes ordinals (`fahatelo`, third), and reads the words back into the
number. The rules have no upper limit; each port stops at its largest exact integer
(see [Errors](#errors)). Input is a number value, or plain decimal text such as
`'2000000000000000.9'` when every digit must be exact (rule 13). Digit separators and other
notations are not parsed.

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Parsers (text typed by users → value) come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function         | Does                                     | JavaScript                     | PHP                                                            |
| ---------------- | ---------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `spell`          | Number → Malagasy words                  | `spell(n, options)`            | `NumberWords::spell($n, $system)` (int, float or decimal text) |
| `spellOrdinal`   | Whole number → ordinal words (rule 14)   | `spellOrdinal(n, options)`     | `NumberWords::spellOrdinal($n, $system)`                       |
| `parseWords`     | Words → number, or throws (rule 15)      | `parseWords(text, options)`    | `NumberWords::parse($text)->value()`, `->digits`               |
| `safeParseWords` | Words → number or error code, no throw   | `safeParseWords(text, opts)`   | `NumberWords::safeParse($text)`                                |
| `tryParseWords`  | Words → number, or nothing, never throws | `tryParseWords(text, options)` | `NumberWords::tryParse($text)` → `null`                        |

One option for writing, `system`: `standard` (the default, rules 1–11) or `traditional`
(rule 12). One option for reading, `as`: `number` (the default) or `text`, the exact decimal
digits of any size.

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

4. **`amby` up to 199, `sy` from 200:** `348` → `valo amby efapolo sy telonjato`,
   `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby`:
   `1 105` → `dimy amby zato sy arivo`, `1 205` → `dimy sy roanjato sy arivo`. **Inside a count**
   before a group word (rule 6), every part is joined by `amby` instead, so a count is one
   phrase: `280 000 000` → `valopolo amby roanjato tapitrisa`.
5. **One is `iraika` right before `ambin'ny` or `amby`** (`11`, `21`, `101`, `121`). Before `sy`
   and alone it is `iray`: `1` → `iray`, `201` → `iray sy roanjato`, `1 001` → `iray sy arivo`.
6. **Groups of 1000 and above** are `arivo` (10³), `alina` (10⁴), `hetsy` (10⁵), `tapitrisa`
   (10⁶) and `lavitrisa` (10⁹). The count is read before the group word: `roa arivo`,
   `roapolo tapitrisa`. `arivo`, `alina` and `hetsy` take a count of 1–9 and `tapitrisa` 1–999.
   **A count is one phrase, every part joined by `amby`** (rule 4), so it never contains `sy`:
   `201 000 000` → `iraika amby roanjato tapitrisa`, while `200 000 001` →
   `iray sy roanjato tapitrisa`. **`lavitrisa`, the largest group, takes any count**, so numbers
   of any size are spelled: `1 000 000 000 000` → `arivo lavitrisa`, `10 000 000 000 000` →
   `iray alina lavitrisa`, `25 000 000 000 000` → `dimy arivo amby roa alina lavitrisa`.
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
11. **Out of scope:** negative numbers (decided by the maintainers on 2026-11-27).
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

14. **Ordinals** (`spellOrdinal`) put `faha` before the cardinal words: `3` → `fahatelo`,
    `10` → `fahafolo`. Before a vowel it is `fah`: `4` → `fahefatra`, `6` → `fahenina`,
    `1000` → `faharivo`. `1` is `voalohany`; a 1 inside a larger number takes `fah` like the
    rest: `11` → `fahiraika ambin'ny folo`, `21` → `fahiraika amby roapolo`. Input is a whole
    number from 1, or digit text (rule 13 without a point). The `system` option applies.

15. **Reading words back** (`parseWords`, `safeParseWords`, `tryParseWords`) gives the number
    that `spell` writes as these words, in either system: `roa arivo` → `2000`.
    - Case, spacing, curly apostrophes and the older spellings `ambin' ny` and `amby ny` do not
      matter. Anything else must be exactly what `spell` writes: `dimy amby roanjato` (not how
      205 is written) is `INVALID_FORMAT`.
    - Text longer than 4096 characters (`limits.maxWordsLength`, above the longest spelling of
      100-character decimal text) is `INVALID_FORMAT`.
    - A number value that cannot hold the result exactly is `PRECISION_LOSS`, never a rounded
      value; `{ as: 'text' }` gives the exact decimal digits instead, of any size.
    - From one million billion up, a few phrases are what `spell` writes for two numbers:
      `dimy amby roapolo tapitrisa lavitrisa` is both 25 000 000 000 000 000 (count 25 000 000)
      and 20 000 005 000 000 000 (count 20 000 005). Such text is `AMBIGUOUS`: the reader never
      picks one.

## Errors

| Input                                         | Code             |
| --------------------------------------------- | ---------------- |
| Not a number or text, `NaN`, `Infinity`       | `INVALID_TYPE`   |
| Text that is not plain decimal (rule 13)      | `INVALID_FORMAT` |
| A `system` other than the two of rule 12      | `INVALID_TYPE`   |
| Below 0 (below 1 for `spellOrdinal`)          | `OUT_OF_RANGE`   |
| Above the port's largest exact integer        | `OUT_OF_RANGE`   |
| `spellOrdinal`: a number with decimals        | `INVALID_TYPE`   |
| `parseWords`: not text, or an unknown `as`    | `INVALID_TYPE`   |
| `parseWords`: words `spell` does not write    | `INVALID_FORMAT` |
| `parseWords`: words two numbers share         | `AMBIGUOUS`      |
| `parseWords`: a number cannot hold the result | `PRECISION_LOSS` |

The spec sets no maximum. For number values, a port stops where its integer type stops being
exact (decimal text has no such limit):

| Port       | Largest input                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| JavaScript | `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991)                                                         |
| PHP        | `PHP_INT_MAX` (9 223 372 036 854 775 807, on 64-bit) for `fromInt`; 9 007 199 254 740 991 for `fromFloat` |

Shared vectors stay within 9 007 199 254 740 991 so every port runs all of them.

## Sources

- `amby` up to 199 and `sy` from 200 (rule 4): Peace Corps Madagascar, _Malagasy Language
  Lessons_: "amby is used to connect numbers with one digit to two and three digits until 199.
  Sy is used after 199 and more."
  <https://files.peacecorps.gov/multimedia/audio/languagelessons/madagascar/MG_Malagasy_Language_Lessons.pdf>.
- `sy` between groups and the hundreds of a larger number (`7 495` →
  `dimy amby sivifolo sy efajato sy fito arivo`), `arivo lavitrisa` and `alina lavitrisa`:
  Malagasy Wikipedia, [Fanisana amin' ny teny malagasy](https://mg.wikipedia.org/wiki/Fanisana_amin'_ny_teny_malagasy)
  and [Tapitrisa](https://mg.wikipedia.org/wiki/Tapitrisa) (`Valopolo amby roanjato tapitrisa`,
  280 000 000, a count joined by `amby`, as in the dictionary entry `tapitrisa`).
- Ordinals (rule 14): dictionary entries [voalohany](https://malagasyword.org/bins/teny2/voalohany)
  and [faha](https://malagasyword.org/bins/teny2/faha) ("Before vowels fah- only is added";
  "This prefix may be added to all except iray"), and the ordinals table of
  [mylanguages.org](https://mylanguages.org/malagasy_numbers.php).
- Assimil, _Le malgache de poche_ (2000), as quoted by Languages and Numbers:
  <https://www.languagesandnumbers.com/how-to-count-in-malagasy/en/mlg/>. Digits, tens,
  hundreds, `ambin'ny`, and the examples `348` and `2 586`.

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

- Nothing is waiting. Negative numbers were not added (rule 11): Malagasy Wikipedia defines
  them as numbers `latsaky ny aotra` ("below zero", [Isa miiba](https://mg.wikipedia.org/wiki/Isa_miiba))
  but spells none in words.

## Recorded disagreements

- **Spelling of two traditional names (rule 12).** `phanisana` writes `tsipesimpesina` (10¹¹)
  and `tsitanoanoa` (10¹³); Languages and Numbers (Assimil) writes `tsipesimpesenina` and
  `tsihitanoanoa`. The data follows Assimil, the project's reference, including in the derived
  `tsipesimpeseninafaharoa` (10¹⁸). Decided by the maintainers on 2026-11-27.
- **`sy` from 200 (rule 4).** The Peace Corps lessons use `sy` after 199. Assimil writes
  `348` → `valo amby efapolo amby telonjato` and Malagasy Wikipedia `239` →
  `sivy amby telopolo amby roanjato` (`amby` below 1000). The data follows the Peace Corps rule,
  which also matches `2 586` and `7 495`. Decided by the maintainers on 2026-11-27.
- **`amby` inside a count (rules 4 and 6).** The dictionary entry `tapitrisa` and Malagasy
  Wikipedia write `valopolo amby roanjato tapitrisa` (280 000 000). The data joins every part of
  a count by `amby`, so `201 000 000` (`iraika amby roanjato tapitrisa`) and `200 000 001`
  (`iray sy roanjato tapitrisa`) stay apart. Decided by the maintainers on 2026-11-27.
- **Ordinals with a vowel (rule 14).** mylanguages.org writes `fahaenina` and `fahaefatra`; the
  dictionary entry `faha` adds only `fah` before a vowel. The data follows the dictionary:
  `fahenina`, `fahefatra`. The same table writes 12th and 13th as `faha-roapolo` and
  `faha-telopolo` (the forms for 20th and 30th) and repeats the 16th for the 18th; those rows
  are not used.
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
- **Counts of 1000 and more before `lavitrisa` (rule 6).** Malagasy Wikipedia writes
  `arivo lavitrisa` (1 000 000 000 000) and `alina lavitrisa` (10 000 000 000 000): the count is
  a number of any size. The data does the same, with `iray` before `alina` (rule 7):
  `iray alina lavitrisa`.
- **Leading zeros after `faingo` (rule 9).** `tanisa` reads each one as `aotra` (`0.008` →
  `aotra faingo aotra aotra valo`). The `malagasy-numberwords` guide lists it as a known
  limitation that `3,05` may be read as `5` instead of zero then five. The data follows `tanisa`,
  so `1.05` and `1.5` stay different. Decided by the maintainers on 2026-11-26.
- **Largest-first for millions.** Some texts put the millions first (`dimy tapitrisa sy …`).
  The dictionary and Assimil read every number from the smallest part up; the data follows them.
- **Older `roa amby ny folo` (12).** The `amby` and `lavitrisa` entries quote this older
  form; Assimil mentions `amby ny` too. The data uses `ambin'ny`.
