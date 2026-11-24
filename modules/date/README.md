# date — Malagasy dates

Writes Gregorian dates in Malagasy, and gives the Malagasy names of months and weekdays.

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Parsers (text typed by users → value) come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function         | Does                                            | JavaScript                          | PHP                                               |
| ---------------- | ----------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `formatDate`     | Date → text in a `DateStyle`                    | `formatDate(date, style)`           | `MalagasyDate::fromString($date)->format($style)` |
| `getMonthName`   | `1`–`12` → month name, wide or abbreviated      | `getMonthName(month, width)`        | `MalagasyDate::monthName($month, $width)`         |
| `getWeekdayName` | ISO weekday `1`–`7` → name, wide or abbreviated | `getWeekdayName(isoWeekday, width)` | `MalagasyDate::weekdayName($weekday, $width)`     |

Allowed per language, because they adapt native types: building a date from the language's own
date type (`Date` in JavaScript, `DateTimeInterface` via `MalagasyDate::fromDateTime()` in PHP)
and reading the ISO weekday of a date object (`MalagasyDate->isoWeekday()` in PHP).

## Rules

1. **Input** is a calendar date, never a time:
   - text in ISO 8601 form `YYYY-MM-DD` (`2026-11-23`), or
   - calendar fields `{ year, month, day }`; ports may also accept their native date type
     (JavaScript `Date`, read in its local calendar fields; PHP `DateTimeInterface`).
2. **Years 1 to 9999.** Other years are `OUT_OF_RANGE`.
3. **Impossible dates** (`2026-02-30`, `2023-02-29`): `INVALID_FORMAT` for text,
   `OUT_OF_RANGE` for calendar fields. Text in any other shape (`26/06/1960`, `2026-1-5`, with a
   time) is `INVALID_FORMAT`. Anything else is `INVALID_TYPE`.
4. **Styles** (`formatDate`), default `long`:

   | Style     | Pattern         | `2026-11-23`                   |
   | --------- | --------------- | ------------------------------ |
   | `long`    | `d MMMM y`      | `23 Novambra 2026`             |
   | `full`    | `EEEE d MMMM y` | `Alatsinainy 23 Novambra 2026` |
   | `medium`  | `y MMM d`       | `2026 Nov 23`                  |
   | `short`   | `y-MM-dd`       | `2026-11-23`                   |
   | `numeric` | `dd/MM/y`       | `23/11/2026`                   |

   Pattern letters: `EEEE` weekday name, `d` day, `dd` two-digit day, `MMMM` month name, `MMM`
   abbreviated month, `MM` two-digit month, `y` year. Any other style is `INVALID_TYPE`.

5. **Names.** Months 1–12, weekdays numbered as in ISO 8601 (Monday 1 … Sunday 7). Width
   `wide` (default) or `abbreviated`; other widths are `INVALID_TYPE`, other numbers
   `OUT_OF_RANGE`.

| #   | Month     | Abbr. |     | ISO | Weekday     | Abbr. |
| --- | --------- | ----- | --- | --- | ----------- | ----- |
| 1   | Janoary   | Jan   |     | 1   | Alatsinainy | Alats |
| 2   | Febroary  | Feb   |     | 2   | Talata      | Tal   |
| 3   | Martsa    | Mar   |     | 3   | Alarobia    | Alar  |
| 4   | Aprily    | Apr   |     | 4   | Alakamisy   | Alak  |
| 5   | Mey       | Mey   |     | 5   | Zoma        | Zom   |
| 6   | Jona      | Jon   |     | 6   | Asabotsy    | Asab  |
| 7   | Jolay     | Jol   |     | 7   | Alahady     | Alah  |
| 8   | Aogositra | Aog   |     |     |             |       |
| 9   | Septambra | Sep   |     |     |             |       |
| 10  | Oktobra   | Okt   |     |     |             |       |
| 11  | Novambra  | Nov   |     |     |             |       |
| 12  | Desambra  | Des   |     |     |             |       |

## Sources

- Month and weekday names, abbreviations, and the `long`, `full`, `medium` and `short`
  patterns: Unicode CLDR 49, locale `mg`,
  [ca-gregorian.json](https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-dates-full/main/mg/ca-gregorian.json).
- Cross-checked with the Malagasy Dictionary:
  [Janoary](https://malagasyword.org/bins/teny2/Janoary),
  [Alatsinainy](https://malagasyword.org/bins/teny2/Alatsinainy) ("andro faharoa amin'ny
  herinandro", second day of the week), [Alahady](https://malagasyword.org/bins/teny2/Alahady)
  ("andro voalohany amin'ny herinandro", first day of the week).

## Recorded decisions

- **`numeric` style `dd/MM/y`.** CLDR `mg` has no such pattern (its `short` is `y-MM-dd`). The
  project lead asked (2026-11-24) for both: CLDR by default, and `dd/MM/y` as an option because
  it is the everyday written form in Madagascar.
- **ISO weekday numbers.** The dictionary counts Sunday (Alahady) as the first day of the week;
  the spec numbers weekdays as ISO 8601 (Monday 1) so every language maps them the same way.
  Names are unaffected.
