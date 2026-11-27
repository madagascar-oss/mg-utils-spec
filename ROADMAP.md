# Roadmap

Reviewed in public each quarter. Each phase ends with something public.

## Now — first release (spec 0.1)

- [x] `spec/words` and `spec/phone` with sources and shared vectors
- [x] `@mdgascar/words`, `@mdgascar/phone`, `@mdgascar/utils`
- [x] Publish 0.1.0 to npm from CI
- [x] Live demo page

## Next — PHP port and remaining modules

- [x] Codegen for PHP; `mdg-utils-php` passes the same vectors
- [x] Split into `mdg-utils-spec`, `mdg-utils-js` and `mdg-utils-php` ([ADR 0003](docs/adr/0003-split-repos-per-language.md))
- [x] `mdg-utils-php` on Packagist
- [x] Symfony bundle as a separate package
- [x] `ariary` and `date` modules in both languages
- [x] Fixed-line numbers in `phone`
- [x] Words back to numbers, ordinals, dates back to calendar fields
- [ ] Release 1.0.0 of spec and packages

## Later

- [ ] Python port (`mdg-utils-python`), led by a contributor
- [ ] Docs site with versioned API reference
- [ ] `mg-geo` and `mg-pay` in their own repositories
