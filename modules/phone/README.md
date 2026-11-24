# phone — Madagascar mobile phone numbers

Reads, checks and formats Malagasy **mobile** phone numbers (country code `+261`).

## Public API

Every language port provides each function below, named the way its language does it. Behaviour
is set by the rules and test vectors here. Functions that can reject input come in three forms:
`parse` throws, `safeParse` returns the value or the error code, `tryParse` returns the value or
nothing.

| Function               | Does                                            | JavaScript                                 | PHP                                           |
| ---------------------- | ----------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| `parsePhoneNumber`     | Text → parsed value, or throws                  | `parsePhoneNumber(input)`                  | `PhoneNumber::parse($input)`                  |
| `safeParsePhoneNumber` | Text → parsed value or error code, never throws | `safeParsePhoneNumber(input)`              | `PhoneNumber::safeParse($input)`              |
| `tryParsePhoneNumber`  | Text → parsed value, or nothing, never throws   | `tryParsePhoneNumber(input)` → `undefined` | `PhoneNumber::tryParse($input)` → `null`      |
| `isValidPhoneNumber`   | Any value → `true`/`false`, never throws        | `isValidPhoneNumber(input)`                | `PhoneNumber::isValid($input)`                |
| `formatPhoneNumber`    | Text → `e164`, `international` or `national`    | `formatPhoneNumber(input, format)`         | `PhoneNumber::parse($input)->format($format)` |
| operator display name  | Operator id → name, e.g. `telma` → `Telma`      | `OPERATOR_NAMES[id]`                       | `Operator::displayName()`                     |

## Rules

1. **A number has 9 significant digits** after `+261`: a 2-digit operator code, then 7 digits.
2. **Accepted spellings** of the same number `34 12 345 67`:
   `034 12 345 67`, `+261 34 12 345 67`, `00261 34 12 345 67`, `261 34 12 345 67`,
   `34 12 345 67`.
   - `0` is the national trunk prefix; `00` is the international prefix.
   - Spaces (including non-breaking and other Unicode spaces), `-`, `.`, `(` and `)` are
     ignored. A `+` is allowed only as the first character.
   - Any other character (letters, `_`, full-width digits) is `INVALID_FORMAT`.
   - The 9 significant digits never start with `0`, so `034 12 345 6` (one digit short) is
     `INVALID_FORMAT`, not a 9-digit number with operator `03`.
   - Input longer than 32 characters is `INVALID_FORMAT`, so parsers never scan unbounded text.
3. **Operator codes 30–39 are mobile.** Assigned codes:

   | Code | Operator                 | Assigned    |
   | ---- | ------------------------ | ----------- |
   | 32   | Orange Madagascar        | 2013 plan   |
   | 33   | Airtel Madagascar        | 2013 plan   |
   | 34   | Telma                    | 2013 plan   |
   | 37   | Orange Madagascar        | 21 Oct 2022 |
   | 38   | Telma (Telecom Malagasy) | 21 Oct 2022 |
   | 39   | Blueline (MVNO)          | 21 Aug 2013 |

   A well-formed number with any other code (including fixed-line `20` and VSAT `22`) is
   `UNKNOWN_OPERATOR`. Fixed lines are out of scope for spec 0.1.

4. **Formats** (`formatPhoneNumber`):

   | Format          | Output for `0341234567` |
   | --------------- | ----------------------- |
   | `e164`          | `+261341234567`         |
   | `international` | `+261 34 12 345 67`     |
   | `national`      | `034 12 345 67`         |

   Any other format name is `INVALID_TYPE`.

5. **Non-string input** is `INVALID_TYPE` for `parsePhoneNumber` and `formatPhoneNumber`;
   `isValidPhoneNumber` never throws and returns `false`.

## Parsed value

```yaml
e164: '+261341234567'
nationalNumber: '341234567'
operator: telma
```

## Sources

- ITU, national numbering plan for Madagascar (+261), communications from OMERT
  (27.VIII.2013, 21.VIII.2013) and ARTEC (21.X.2022):
  <https://www.itu.int/dms_pub/itu-t/oth/02/02/T020200007F0002PDFF.pdf>
- ARTEC, Plan national de numérotation: <https://www.artec.mg/plan-national-de-numerotation/>
  (lists 32 Orange, 33 Airtel, 34 and 38 Telma; did not load over HTTPS when checked on
  2026-11-23 because of a certificate error).

## Recorded disagreements

- **Grouping for 39.** The 2013 Blueline communication writes `+261 39 XXX XXXX`; the 2013
  plan and the 2022 communication write `+261 3X XX XXX XX`. The data uses the 2-2-3-2
  grouping for every operator so one number always looks the same.
- **Is 39 still active?** The ITU record does not withdraw 39. Until an official withdrawal is
  published, the data keeps it.
- **37 on the ARTEC page.** The ARTEC web page does not list 37; the ITU communication of
  21 Oct 2022 assigns it to Orange Madagascar. The data follows the ITU communication, which
  is the later and formal notice.
