# Why

The site is built on an outdated Astro toolchain with duplicated route logic, a no-op CSS purge step, generated icon components, and npm-specific automation. The project needs a maintainable version 2.0 foundation without changing the public site experience.

# What changes

- Upgrade the static site to Astro 7 and the Content Layer API.
- Standardize local and CI workflows on mise, just, Nub, and Biome.
- Replace Sass and generated SVG components with plain CSS and a local Iconify collection.
- Consolidate article, tag, route, and pagination logic while preserving all current public URLs.
- Adopt shared Arcantry sources for OpenSpec, todo intake, changelog generation, and local release manifests.
- Split CI and GitHub Pages deployment into pinned, least-privilege workflows.

# Out of scope

- Changes to information architecture, visible design, or editorial content.
- Varlock or any environment schema.
- Commit, push, pull request, tag, publication, merge, or deployment.
