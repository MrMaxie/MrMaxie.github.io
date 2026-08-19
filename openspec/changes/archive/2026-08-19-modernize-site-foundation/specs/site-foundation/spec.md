# Requirements

## ADDED Requirements

### Requirement: Stable public site contract

The version 2.0 static build MUST preserve the existing public routes, canonical URLs, sitemap coverage, article order, MDX content, visible layout, accessibility labels, and `maxie.dev` domain.

#### Scenario: Build the version 2.0 site

- **WHEN** the production build completes
- **THEN** it emits the same 18 HTML routes as version 1.0
- **AND** article, tag, canonical, sitemap, and 404 behavior remain available without request-header access

### Requirement: Current Astro content model

The site MUST use Astro 7, Content Layer collections, `render(entry)`, `entry.id`, `ClientRouter`, and `astro/zod` without legacy collection or transition APIs.

#### Scenario: Render an article

- **WHEN** an article route is generated from the content collection
- **THEN** the route uses the content entry id and renders the MDX entry through the supported Astro 7 API

### Requirement: Shared pagination and tag routing

Article and tag listing routes MUST use shared, deterministic sorting, grouping, pagination, and route helpers.

#### Scenario: Generate a tag with more than one page

- **WHEN** a tag contains more entries than the configured page size
- **THEN** every entry appears on exactly one stable page
- **AND** first-page aliases render statically without `Astro.rewrite()`

### Requirement: Local assets and icons

The site MUST process the avatar through Astro assets and MUST source decorative Tabler icons from the repository-installed Iconify collection.

#### Scenario: Render site imagery

- **WHEN** the header, navigation, project list, or 404 page is rendered
- **THEN** no generated local SVG component or public avatar duplicate is required
- **AND** the existing visible crop and accessibility semantics are preserved
