# mdg-utils-spec — every command in one place. Run `just` to list them.
set shell := ["bash", "-euo", "pipefail", "-c"]

# List commands
default:
    @just --list

# Install dependencies and git hooks
setup:
    command -v pnpm >/dev/null || npm install --global pnpm@10
    pnpm install --frozen-lockfile
    pnpm hooks

# Validate data, schemas, test vectors and error codes
validate:
    pnpm validate

# Format check, typecheck and dead-code check for the tools
lint:
    pnpm lint

# Fix formatting
format:
    pnpm format

# Everything CI runs
ci: validate lint

# List data entries whose `checked:` date is older than 12 months
stale-data:
    pnpm stale-data

# Scaffold a new module (README, data, schema, vectors)
new-module name:
    pnpm new-module {{name}}
