# words — Malagasy cardinal number words

Turns a whole number from `0` to `999 999 999 999` into Malagasy words, as written in the
standard (official) language.

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Parsers (text typed by users → value) come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function        | Does                          | JavaScript         | PHP                        |
| --------------- | ----------------------------- | ------------------ | -------------------------- |
| `numberToWords` | Whole number → Malagasy words | `numberToWords(n)` | `NumberWords::fromInt($n)` |

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
   `roapolo tapitrisa`. `arivo`, `alina` and `hetsy` take a count of 1–9; `tapitrisa` and
   `lavitrisa` take 1–999, written with the same rules: `201 000 000` → `iray sy roanjato tapitrisa`.
7. **A count of one is the bare group word:** `1000` → `arivo`, `10 000` → `alina`,
   `1 000 000` → `tapitrisa`. `10`, `100` are `folo`, `zato` (never `iray folo`, `iray zato`).
8. **Groups are joined by `sy`, smallest first:** `280 000` → `valo alina sy roa hetsy`;
   `2026` → `enina amby roapolo sy roa arivo`.
9. **Out of scope for now:** negative numbers and decimals.

## Errors

| Input                                           | Code           |
| ----------------------------------------------- | -------------- |
| Not a number, not an integer, `NaN`, `Infinity` | `INVALID_TYPE` |
| Integer below 0 or above 999 999 999 999        | `OUT_OF_RANGE` |

## Sources

- Assimil, _Le malgache de poche_ (2000), as quoted by Languages and Numbers:
  <https://www.languagesandnumbers.com/how-to-count-in-malagasy/en/mlg/>. Digits, tens,
  hundreds, `ambin'ny`, and the examples `348` and `2 586`. This is the project's reference.

- Malagasy Dictionary and Encyclopedia of Madagascar (J.-M. de La Beaujardière, linguistic
  advisors I. Paul, H. Razanarisoa, B. S. Ralalaoherivony, L. Koziol):
  - Numbers table: <https://malagasyword.org/bins/manisa>
  - Entries `amby`, `iraika`, `aotra`, `alina`, `hetsy`, `tapitrisa`, `lavitrisa`:
    `https://malagasyword.org/bins/teny2/<word>`
- `2026` example: README of the `malagasy-numberwords` LaTeX package (CTAN, 2026),
  <https://ctan.org/pkg/malagasy-numberwords>.

## Recorded disagreements

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
- **`iray alina` vs `alina`.** Some learner sites write `iray alina`, `iray tapitrisa`. The
  dictionary's numbers table and Assimil give the bare words, and the data follows them.
- **Largest-first for millions.** Some texts put the millions first (`dimy tapitrisa sy …`).
  The dictionary and Assimil read every number from the smallest part up; the data follows them.
- **Older `roa amby ny folo` (12).** The `amby` and `lavitrisa` entries quote this older
  form; Assimil mentions `amby ny` too. The data uses `ambin'ny`.
