# 0004 — Number words follow the maintainers' rules where sources disagree

- Status: accepted
- Date: 2026-11-25

## Context

The sources for Malagasy number words do not agree with each other, and sometimes not with
themselves:

- The _Malagasy Dictionary and Encyclopedia of Madagascar_ writes `ambin' ny`, bare group words
  (`alina`, `tapitrisa`) and `valopolo amby roanjato tapitrisa` (280 000 000).
- Assimil, _Le malgache de poche_, writes `ambin'ny`, but gives both `348` → `… amby telonjato`
  and `2 586` → `… sy dimanjato sy roa arivo`.
- Learner sites and everyday usage write `iray alina`, `iray tapitrisa`.

Ports need one rule per case, and test vectors that pin it.

## Decision

The maintainers chose, on 2026-11-24 and 2026-11-25 (spec 0.3.0 and 0.4.0):

1. `ambin'ny` (ASCII apostrophe) for 11–19.
2. `amby` for units onto 20–90 and anything onto exactly 100; `sy` onto 200–900 at every size,
   and between groups of 1 000 and above.
3. `iraika` only right before `ambin'ny` or `amby`; `iray` before `sy` and alone.
4. A count of one is bare only for `arivo`; every other group takes `iray`.
5. Smallest part first; no negatives or decimals for now.

Each departure from a source is listed under "Recorded disagreements" in
[`modules/words/README.md`](../../modules/words/README.md), with a test vector.

## Alternatives

- Follow the dictionary everywhere: rejected, its spelling `ambin' ny` and bare `alina` read as
  dated to the maintainers.
- Follow Assimil everywhere: impossible, its two examples need different rules for hundreds.

## Consequences

- Outputs changed twice (0.3.0, 0.4.0); both were major changes for consumers (minor before 1.0).
- Some outputs differ from attestations (`348`, `280 000 000`, `10 000`); the vectors note each one.
- A linguist review can reopen any rule: change the README rule and vectors first, then the ports.
