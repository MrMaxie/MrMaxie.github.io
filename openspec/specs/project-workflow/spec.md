# project-workflow Specification

## Purpose
TBD - created by archiving change modernize-site-foundation. Update Purpose after archive.

## Requirements

### Requirement: Reproducible local toolchain

The repository MUST pin Node, Nub, and just through mise and MUST expose setup, development, preview, formatting, validation, build, and CI tasks through the justfile.

#### Scenario: Start local development

- **WHEN** a contributor runs `just dev` without arguments
- **THEN** Astro starts with HMR on `127.0.0.1:1997`
- **AND** the development command includes `--force`

### Requirement: Nub project identity

The JavaScript project MUST use Nub commands and `nub.lock` as its package-manager contract without npm or tsx workflow dependencies.

#### Scenario: Install in CI

- **WHEN** CI runs `nub ci`
- **THEN** dependencies are installed strictly from the Nub lockfile

### Requirement: Single formatter and linter

Biome MUST be the only repository formatter and linter and MUST check JavaScript, TypeScript, JSON, CSS, and Astro files.

#### Scenario: Validate source formatting

- **WHEN** `just check` runs
- **THEN** Biome reports formatting and lint failures without delegating to Prettier, ESLint, or Sass tooling

### Requirement: Shared project knowledge and release history

Arcantry MUST manage shared OpenSpec, todo.txt, changelog, release manifests, and the package manifest version while the local Arcantry CLI path remains outside tracked project configuration and CI.

#### Scenario: Cut version 2.0.0 locally

- **WHEN** the completed OpenSpec change is archived and the local release cut is applied
- **THEN** `package.json`, `CHANGELOG.md`, and `releases/2.0.0.yaml` agree on version 2.0.0
- **AND** no tag or external publication is created

### Requirement: Pinned GitHub automation

Pull request CI and GitHub Pages deployment MUST use the shared mise, Nub, and just workflow with least-privilege permissions, timeouts, immutable action SHAs, and disabled persisted checkout credentials.

#### Scenario: Deploy from master

- **WHEN** the deployment workflow runs for `master`
- **THEN** it validates and builds the site before uploading `dist` with the official Pages actions
