# Governance

The project must never depend on one person, so roles, access and decisions are written down.

## Roles

| Role                         | Can                                             | How someone gets it                                          |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| Contributor                  | Open issues and PRs                             | Anyone                                                       |
| Triager                      | Label, assign, close duplicates                 | 3+ helpful contributions, invited by a maintainer            |
| Module / language maintainer | Review and merge in their area (via CODEOWNERS) | Sustained quality work in that area, approved by maintainers |
| Core maintainer              | Release, change governance, manage the org      | Approved by existing core maintainers                        |
| Founder / lead               | Final call on deadlocks and project direction   | —                                                            |

## Decisions

- Small decisions happen in the PR.
- Structural decisions are written as an ADR in [docs/adr/](docs/adr/) and stay open for
  comments for 7 days.
- Ties are broken by the lead.

## Access

- At least two core maintainers hold org owner rights and npm / Packagist publish rights.
- Two-factor authentication is required for everyone in the organisation.
- Packages are published only by CI, with trusted publishing and provenance.
