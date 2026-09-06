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

ci:
  just check
  nub exec astro check
  just build
  nub --test --experimental-strip-types tests/*.test.ts
