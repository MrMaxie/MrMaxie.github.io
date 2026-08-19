# Approach

The migration keeps the rendered site contract stable while replacing the build and content internals in independently verifiable slices. Shared functions under `src/lib` own route construction, date handling, article ordering, tag discovery, and pagination. Thin Astro pages compose the same listing component for canonical routes and first-page aliases, which removes static `Astro.rewrite()` calls.

Astro 7 owns content loading, MDX rendering, image processing, sitemap generation, and static output. Biome owns formatting and linting, so component styles move from SCSS to flat, standards-based CSS selectors that remain reliable with Astro's style scoping. `astro-icon` resolves Tabler SVG data from the local `@iconify-json/tabler` package at build time.

The project toolchain is pinned by mise and routed through a justfile. Nub owns installation, script execution, TypeScript execution, and `nub.lock`. GitHub Actions use the same commands as local development and do not depend on a private Arcantry path. OpenSpec validation remains portable through the repository dependency.

Arcantry manages the shared knowledge and release layers. Version 1.0.0 records the verified pre-migration Git state as a baseline. The accepted change becomes the source for the local 2.0.0 changelog and release manifest after implementation and verification.

# Trade-offs

- `@playform/compress` remains only if the Astro 7 build is warning-free. The standard Astro/Vite output is the fallback.
- Biome Astro formatting uses its experimental full-support option because the project explicitly prefers one formatter over a Prettier fallback.
- The local Arcantry CLI is used for adoption and validation, but its private filesystem path is intentionally absent from project scripts and CI until a registry package is available.
- Static aliases render the shared listing component directly. This duplicates small page entrypoints but avoids runtime request state and preserves every current URL.
