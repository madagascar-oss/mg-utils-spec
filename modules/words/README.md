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
3. **Below 1000, parts are joined by `amby`**, except between units and exactly ten, which use
   `ambin' ny`:
   - `11` → `iraika ambin' ny folo`
   - `21` → `iraika amby roapolo`
   - `105` → `dimy amby zato`
   - `111` → `iraika ambin' ny folo amby zato`
4. **One becomes `iraika`** when it is added to tens or hundreds (`11`, `21`, `101`). Alone it is
   `iray`.
5. **Groups of 1000 and above** are `arivo` (10³), `alina` (10⁴), `hetsy` (10⁵), `tapitrisa`
   (10⁶) and `lavitrisa` (10⁹). The count is read before the group word: `roa arivo`,
   `roapolo tapitrisa`. `arivo`, `alina` and `hetsy` take a count of 1–9; `tapitrisa` and
   `lavitrisa` take 1–999.
6. **A count of one is the bare group word:** `1000` → `arivo`, `10 000` → `alina`,
   `1 000 000` → `tapitrisa`.
7. **Groups are joined by `sy`**, smallest first: `280 000` → `valo alina sy roa hetsy`;
   `2026` → `enina amby roapolo sy roa arivo`.

## Errors

| Input                                           | Code           |
| ----------------------------------------------- | -------------- |
| Not a number, not an integer, `NaN`, `Infinity` | `INVALID_TYPE` |
| Integer below 0 or above 999 999 999 999        | `OUT_OF_RANGE` |

## Sources

- Malagasy Dictionary and Encyclopedia of Madagascar (J.-M. de La Beaujardière, linguistic
  advisors I. Paul, H. Razanarisoa, B. S. Ralalaoherivony, L. Koziol):
  - Numbers table: <https://malagasyword.org/bins/manisa>
  - Entries `amby`, `iraika`, `aotra`, `alina`, `hetsy`, `tapitrisa`, `lavitrisa`:
    `https://malagasyword.org/bins/teny2/<word>`
- `2026` example: README of the `malagasy-numberwords` LaTeX package (CTAN, 2026),
  <https://ctan.org/pkg/malagasy-numberwords>.

## Recorded disagreements

- **`ambin' ny` vs `ambin'ny`.** The dictionary writes `ambin' ny` (apostrophe then space);
  everyday writing often uses `ambin'ny`. The data follows the dictionary. Changing it is an
  output change for existing inputs, so a major version.
- **`isa` vs `iray` for 1.** The dictionary's numbers table lists `isa` (the counting form);
  its `iray` entry gives `iray` as the adjective "one", which is the form used in sentences
  and in the handbook example. The data follows `iray`.
- **`iray alina` vs `alina`.** Some learner sites write `iray alina`, `iray tapitrisa`. The
  dictionary's numbers table gives the bare words, and the data follows it.
- **Older `roa amby ny folo` (12).** The `amby` and `lavitrisa` entries quote this older
  form; the numbers table uses `roa ambin' ny folo`, which the data follows.
- **Combined groups** (for example `1 234 567`) are not spelled out in the table. They apply
  rules 2–7, which are attested separately (`valo alina sy roa hetsy`,
  `valopolo amby roanjato tapitrisa`). A linguist review is welcome.
