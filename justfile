set dotenv-load := false

_default:
    @just --list

setup:
    nub install

dev port="1997":
    nub exec astro dev --host 127.0.0.1 --port {{ port }} --force

preview port="4321":
    nub exec astro preview --host 127.0.0.1 --port {{ port }}

format:
    nub exec biome check --write .

check:
    nub exec biome check .

build:
    nub run build

openspec-validate:
    nub run openspec:validate

ci:
    just openspec-validate
    just check
    nub run check:astro
    nub run test
    just build
