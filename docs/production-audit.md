# Production audit follow-up

Checked on 2026-09-06 against the deployed `https://maxie.dev/` site and the production build. The deployed baseline predates this branch.

## Findings

| Reported item | Current evidence | Action |
| --- | --- | --- |
| Unrecognized `Permissions-Policy` features | The production response does not include this header. A clean Chromium session visited all 48 sitemap URLs without console warnings or errors. | Not reproduced. Do not add or relax permissions to silence a warning whose source is unknown. If it returns, inspect the affected document's response headers and compare a browser profile without extensions. |
| Short cache lifetime | GitHub Pages returns `Cache-Control: max-age=600` for static assets. Live Lighthouse reports approximately 189 KiB of potential repeat-visit savings on the homepage. | Hosting limitation remains. Astro HTML or a meta tag cannot change an HTTP cache header. Longer cache lifetimes would require control over the serving layer; do not add a service worker or change hosting solely to hide this diagnostic. |
| Network dependency tree | Live reports identify local fonts and the existing router/motion modules. | Replace the shared motion runtime with native animation, intersection and scroll APIs while retaining timing, easing, triggers and navigation cleanup. Keep the router for page transitions. Load the existing Fontsource CSS directly and preload only the intended Latin font files; the npm font provider did not supply the subset metadata needed by the previous preload filter. |
| Minify JavaScript / unused JavaScript | Neither warning reproduced in clean live Lighthouse runs for `/`, `/projects/` and `/mods/`, on mobile and desktop. All six runs passed the existing gates. | Do not remove interaction code based only on initial-load coverage. Keep live audits available to distinguish delivered assets from a development build or browser-injected code. |
| Touch target size or spacing | All 48 deployed sitemap pages passed axe `target-size` at 390 px, and sampled live Lighthouse accessibility was 100. Direct geometry inspection nevertheless found 18 px tooltip buttons and 16 px game links overlapping the stretched card link. Such controls cannot rely on WCAG's spacing exception. | Increase these shared controls to at least 24 px without changing their text size. Add explicit geometry assertions for controls over card links, expand the full browser audit to 320/390/1440 px in both themes and check console errors. No rules are suppressed. |
| Lazy-loaded LCP candidate on `/mods/` | Live Lighthouse identified the first game's background image as a lazy-loaded LCP candidate. | Load only the first game banner eagerly with high priority. Supply AVIF with WebP fallback, retain the image composition and keep later banners lazy. |
| Internal URL redirects | `/projects` returns 301 to `/projects/`; generated internal routes omitted the final slash while the sitemap used it. | Generate directory URLs consistently with a trailing slash and set Astro's `trailingSlash` policy. Tests require every internal page link to match a generated sitemap route. |

## Search Console statuses

**Page with redirect** means Google found a URL that redirects to another URL. It is expected for HTTP-to-HTTPS, the GitHub hostname redirect to the custom domain, or an old URL with a real replacement. The source URL is not supposed to be indexed independently. This is different from **Redirect error**, which can indicate a loop or broken chain.

**Crawled - currently not indexed** means Google fetched a page but did not add it to the index. It does not by itself prove a technical defect, and index inclusion cannot be guaranteed by a code change. Historical entries can remain until Google revisits their URLs.

The pages in the historical report have been removed. Keep removed pages returning a real 404 when no equivalent replacement exists; avoid returning a successful empty page or redirecting every removed URL to the homepage. Keep only current, canonical 200 pages in the sitemap and internal links. If a specific URL has a real replacement, assess that redirect individually.

The browser suite checks useful HTTP 404 responses without misleading canonical/social URLs, sitemap coverage, indexable HTML without JavaScript, and matching canonical URLs. These controls prevent technical regressions; they do not assert Google's current indexing decisions.

## Reproduction and prevention

```sh
just ci
just audit-browser
just audit-lighthouse
just audit-lighthouse-live https://maxie.dev
```

Lighthouse checks the homepage, project list, mod list and representative project/mod detail pages. It runs three consecutive measurements per route/profile. Every category must score 100 in every run, and CLS must remain at or below 0.1. A result below 100 fails CI, even if it passes the previous performance threshold of 95. The live command audits the actual hosting response; it does not start a local preview. Keep performance measurements separate from concurrent builds or browser audits.

The six initial live diagnostic runs measured performance 97 mobile / 100 desktop and accessibility, best practices and SEO 100. They were single runs per route/profile, not a replacement for the repeated final acceptance series.

## LLM discovery

`/llms.txt` is generated from the same public project and mod summaries used by the website. It follows the llmstxt.org structure, links to current canonical pages and the public GitHub profile, and is discoverable through `rel="describedby"`. The linked pages provide their content in server-rendered HTML. Markdown copies of those pages are not provided.

The file is a reading guide, not a crawler permission file or a guarantee of search ranking or inclusion in an AI answer. `robots.txt`, the sitemap, canonical URLs and visible HTML remain independently validated. Browser tests check the generated guide's format and that its internal links return 200 without redirects.

## Verification before font subsetting

The production build and 54 unit/contract tests passed. The browser audit passed 375 tests across all generated pages, both themes and 320/390/1440 px viewports, including keyboard interactions, reduced motion, post-navigation animation parameters, delayed fonts, canonical links and `llms.txt`. Visual comparison of the homepage and mod list at 390/1440 px retained the measured heading and brand geometry.

That local Lighthouse series completed all 30 runs. Accessibility, best practices and SEO were 100 throughout, desktop performance was 100 throughout, and the largest CLS was 0.000115. Mobile performance was below the new 100-point gate:

| Route | Before optimization, mobile | Final mobile runs |
| --- | --- | --- |
| `/` | 96 / 96 / 96 | 96 / 96 / 96 |
| `/projects/` | 94 / 94 / 94 | 96 / 96 / 96 |
| `/mods/` | 95 / 95 / 95 | 97 / 97 / 97 |
| `/projects/maxiedev-events/` | 96 / 96 / 96 | 98 / 98 / 98 |
| `/mods/boss-scaler/` | 96 / 96 / 96 | 98 / 97 / 97 |

These are local production-preview measurements, not deployed-site or GitHub-runner scores. The command correctly exits with failure for the remaining mobile scores. The gate has no exceptions, disabled rules, relaxed throttling or retry-until-pass behavior. Reports are retained on failure.

The remaining mobile cost is initial rendering and delivery of the document, fonts and retained page router; the homepage's portrait remains its LCP element. Moving styles to a separate file worsened the measured project-list score and was reverted. Broadly preloading font subsets also worsened it. Achieving 100 on this local profile remains unresolved, rather than being declared impossible or hidden by changing the audit conditions. Hosting cache policy and historical Google indexing decisions are separate from these local scores.

Native screen-reader listening, browser UI zoom and actual Facebook/Discord previews were not repeated in this audit. Automated accessibility checks do not replace those manual checks.

## Font subsetting follow-up

The first branch CI run completed all 30 measurements with mobile performance 99 and every other category/profile at 100. The strict gate rejected 99, and the reports were uploaded and downloaded despite the failure: [CI evidence](https://github.com/MrMaxie/MrMaxie.github.io/actions/runs/34053716482).

Production builds now subset the installed fonts using the site's source characters, including encoded entities and escapes. HarfBuzz preserves the variable weight axes, shaping features and hinting. Development uses complete fonts so editing can introduce new characters immediately. Font assets receive content-based filenames, and the original licenses accompany the build. Small font files remain external to respect the existing inline-CSS budget.

The three Latin files fell from approximately 100 KB to 70 KB. The Outfit and Karla extended files fell from approximately 30 KB together to 2.7 KB. A comparison of the homepage and mod list at 390/1440 px found identical pixels and geometry before and after subsetting. The build, inline-CSS budget and 55 unit/contract tests pass. These byte and visual checks do not by themselves establish a 100-point Lighthouse result; the repeated CI audit remains authoritative for its runner.

The next step limits Karla to its used 400-700 weight range, reducing its Latin file from 21.4 KB to 14.9 KB. A browser assertion rejects requested Karla weights outside that generated range. The comparison retained layout and line wrapping, with only font rasterization differences in at most 0.012% of sampled color channels. Outfit and Fira Code retain their original weight ranges.

Responsive image preloads now expose the portrait and first game banner in the document head, using the same image variants and size definitions as the displayed images. Browser tests verify that the selected image is fetched by its preload exactly once on mobile and desktop, including a mobile pixel ratio of 1.75. These changes preserve image quality, composition and page animations.

The subsequent [CI run](https://github.com/MrMaxie/MrMaxie.github.io/actions/runs/34056498117) passed the build, 55 unit tests and 376 browser tests. Of 30 Lighthouse measurements, 25 scored 100 in every category; five mobile measurements scored 99 for performance. Mobile results were home 99/100/100, projects 100/100/100, mods 99/99/99, project detail 100/100/100 and mod detail 100/100/99. Every CLS measurement was zero. The strict gate correctly failed and retained all reports.

The two small Outfit/Karla alphabet extensions are embedded in the existing CSS, eliminating their late font requests while larger Latin files remain separately cached. The [final implementation CI run](https://github.com/MrMaxie/MrMaxie.github.io/actions/runs/34057332018) passed the build, 55 unit tests and 376 browser tests. Of 30 Lighthouse runs, 27 scored 100 in every category; only `/mods/` mobile performance remained 99/99/99. The unchanged strict gate failed and retained all reports.

Local results differ: embedding the extensions improved the mod list's first render but regressed homepage performance from 98 to 97. Reports show different HTML delivery costs: the runner transferred about 24 KB for a 108 KB document, whereas the local preview transferred the full document. The embedding is retained based on the target runner's result, without claiming a universal performance improvement. A further homepage Fira preload was not retained because it delayed the portrait's LCP. Stable mobile performance 100 remains unresolved; neither audit conditions nor page animations were relaxed.

## Audit transport parity

A fresh production check confirmed HTTP/2 and gzip for `https://maxie.dev/mods/`. The earlier CI preview used HTTP/1.1; Lighthouse's simulated connection costs therefore did not represent the deployed transport. CI now enables Vite's HTTPS/HTTP/2 preview and checks the document protocol in every Lighthouse report.

Each disposable Linux runner creates a one-day certificate for localhost and trusts that exact certificate in Chromium's certificate database and the Node test client. Certificate validation remains enabled; no browser certificate-error bypass or Lighthouse rule exception is used. Keys stay outside uploaded reports. Local audits retain HTTP/1.1 unless `AUDIT_TLS_CERT` and `AUDIT_TLS_KEY` identify a certificate already trusted by the test clients. Results from different transports must not be presented as interchangeable. The HTTP/2 runner result must be verified independently before claiming that the remaining performance gate passes.

## References

- [Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
- [HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)
- [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Search Console page indexing statuses](https://support.google.com/webmasters/answer/7440203)
- [Google HTTP and network error guidance](https://developers.google.com/search/docs/crawling-indexing/http-network-errors)
- [llms.txt proposal and format](https://llmstxt.org/)
- [Web font loading and preload guidance](https://web.dev/learn/performance/optimize-web-fonts)
- [HarfBuzz-based variable font subsetting](https://github.com/papandreou/subset-font)
- [Vite HTTPS/HTTP/2 preview](https://v8.vite.dev/config/preview-options#preview-https)
- [Chromium Linux certificate management](https://chromium.googlesource.com/chromium/src/+/master/docs/linux/cert_management.md)
