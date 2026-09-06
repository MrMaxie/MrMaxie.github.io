set dotenv-load := false
set indentation := "  "

_default:
  @just --list

setup:
  nub install

dev port="1997":
  nub exec astro dev --host 127.0.0.1 --port {{ port }} --force

preview port="1997":
  nub exec astro preview --host 127.0.0.1 --port {{ port }}

format:
  nub --experimental-strip-types scripts/tailwind-classes.ts --write
  nub exec biome check --write .

check:
  nub exec biome check .
  nub --experimental-strip-types scripts/tailwind-classes.ts

build:
  nub exec astro build

# Render the editable HTML social banner with the installed Chromium browser.
social-banner:
  nub --experimental-strip-types scripts/social-banner.ts

# Install the browser used by production audits.
audit-setup:
  nub exec playwright install chromium

# Build and audit all generated pages in both themes and viewport sizes.
audit-browser: build
  nub --test --experimental-strip-types tests/browser.audit.ts

# Three sequential runs per route/profile; every run must meet the quality gates.
audit-lighthouse: build
  nub --experimental-strip-types scripts/lighthouse-audit.ts

# Audit hosting, cache headers and delivered assets using the same quality gates.
audit-lighthouse-live url="https://maxie.dev":
  nub --experimental-strip-types scripts/lighthouse-audit.ts {{ url }}

ci:
  just check
  nub exec astro check
  just build
  nub --test --experimental-strip-types tests/*.test.ts
