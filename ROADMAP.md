# Roadmap

Reviewed in public each quarter. Each phase ends with something public.

## Now — first release (spec 0.1)

- [x] `spec/words` and `spec/phone` with sources and shared vectors
- [x] `@madagascar-oss/words`, `@madagascar-oss/phone`, `@madagascar-oss/utils`
- [ ] Publish 0.1.0 to npm from CI
- [x] Live demo page

## Next — PHP port and remaining modules

- [x] Codegen for PHP; `mg-utils-php` passes the same vectors
- [x] Split into `mg-utils-spec`, `mg-utils-js` and `mg-utils-php` ([ADR 0003](docs/adr/0003-split-repos-per-language.md))
- [ ] `mg-utils-php` on Packagist
- [ ] Symfony bundle as a separate package
- [x] `ariary` and `date` modules in both languages
- [ ] Fixed-line numbers in `phone`
- [ ] Release 1.0.0 of spec and packages

## Later

- [ ] Python port (`mg-utils-python`), led by a contributor
- [ ] Docs site with versioned API reference
- [ ] `mg-geo` and `mg-pay` in their own repositories
