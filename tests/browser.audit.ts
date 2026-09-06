import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { auditOutput, builtRoutes, productionPreview } from './helpers/site-audit.ts';

test('production accessibility, readability and discoverability audit', async t => {
  const output = await auditOutput('browser');
  const results: unknown[] = [];
  const { server, baseURL } = await productionPreview();
  t.after(() => server.stop());
  const browser = await chromium.launch();
  t.after(() => browser.close());
  t.after(async () => {
    await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(`Browser audit evidence: ${output}`);
  });

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Map<string, string>();
  const routes = await builtRoutes();
  assert.ok(routes.length > 0, 'Build must contain public pages');
  for (const route of routes) {
    await t.test(`HTML without JavaScript: ${route}`, async () => {
      const response = await page.goto(`${baseURL}${route}`);
      assert.equal(response?.status(), 200);
      const metadata = await page.evaluate(() => ({
        title: document.title.trim(),
        language: document.documentElement.lang,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim(),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        social: Object.fromEntries(
          [...document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')].map(node => [
            node.getAttribute('property') ?? node.getAttribute('name'),
            node.getAttribute('content'),
          ]),
        ),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
        headings: [...document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
        main: document.querySelector('main')?.textContent?.trim(),
        externalLinks: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="https://"]')].map(link => ({
          href: link.href,
          target: link.target,
          rel: link.rel,
        })),
        structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
          node => node.textContent,
        ),
      }));
      results.push({ route, metadata });
      assert.ok(metadata.language);
      assert.ok(metadata.title);
      assert.ok(!titles.has(metadata.title), `Duplicate title with ${titles.get(metadata.title)}`);
      titles.set(metadata.title, route);
      assert.ok(metadata.description);
      assert.equal(metadata.canonical, `https://maxie.dev${route}`);
      assert.equal(metadata.social['og:title'], metadata.title);
      assert.equal(metadata.social['twitter:title'], metadata.title);
      assert.equal(metadata.social['og:description'], metadata.description);
      assert.equal(metadata.social['twitter:description'], metadata.description);
      assert.equal(metadata.social['og:url'], metadata.canonical);
      assert.equal(metadata.social['og:type'], 'website');
      assert.equal(metadata.social['og:image'], 'https://maxie.dev/og-banner.png');
      assert.equal(metadata.social['twitter:image'], metadata.social['og:image']);
      assert.equal(metadata.social['og:image:width'], '1200');
      assert.equal(metadata.social['og:image:height'], '630');
      assert.equal(metadata.social['og:image:type'], 'image/png');
      assert.ok(metadata.social['og:image:alt']);
      assert.equal(metadata.social['twitter:image:alt'], metadata.social['og:image:alt']);
      assert.equal(metadata.social['twitter:card'], 'summary_large_image');
      assert.doesNotMatch(metadata.robots, /noindex|nosnippet/i);
      assert.equal(metadata.headings.length, 1, 'Expected one primary heading');
      assert.ok(metadata.headings[0]);
      assert.ok(metadata.main);
      for (const link of metadata.externalLinks) {
        assert.equal(link.target, '_blank', link.href);
        assert.ok(link.rel.split(' ').includes('noopener'), link.href);
      }
      assert.equal(metadata.structuredData.length, 1);
      for (const json of metadata.structuredData) {
        const graph = JSON.parse(json ?? '')['@graph'];
        assert.ok(graph.some((item: { '@type': string }) => item['@type'] === 'Person'));
        assert.ok(graph.some((item: { '@type': string }) => item['@type'] === 'WebSite'));
      }
    });
  }
  await t.test('robots and sitemap expose the production routes', async () => {
    const banner = await page.request.get(`${baseURL}/og-banner.png`);
    assert.equal(banner.status(), 200);
    assert.match(banner.headers()['content-type'], /image\/png/);
    const image = await banner.body();
    assert.equal(image.readUInt32BE(16), 1200);
    assert.equal(image.readUInt32BE(20), 630);
    const robots = await page.request.get(`${baseURL}/robots.txt`);
    assert.equal(robots.status(), 200);
    assert.match(await robots.text(), /Sitemap: https:\/\/maxie\.dev\/sitemap-index.xml/);
    const index = await page.request.get(`${baseURL}/sitemap-index.xml`);
    assert.equal(index.status(), 200);
    const locations = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)];
    assert.ok(locations.length);
    let entries = '';
    for (const [, location] of locations) {
      const sitemap = await page.request.get(`${baseURL}${new URL(location).pathname}`);
      assert.equal(sitemap.status(), 200);
      entries += await sitemap.text();
    }
    for (const route of routes) assert.ok(entries.includes(`<loc>https://maxie.dev${route}</loc>`), route);
    assert.ok(!entries.includes('/404'), 'Error pages must not be advertised in the sitemap');
  });
  const missingRoute = '/audit-missing-page/';
  await t.test('missing pages return a useful 404 without a misleading canonical URL', async () => {
    assert.equal((await page.goto(`${baseURL}${missingRoute}`))?.status(), 404);
    assert.equal(await page.locator('h1').textContent(), 'That page is not here.');
    assert.equal(await page.getByRole('link', { name: 'Go home', exact: true }).getAttribute('href'), '/');
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  });
  await context.close();

  await t.test('mod destinations open an isolated tab and leave the portfolio in place', async () => {
    const linkContext = await browser.newContext();
    try {
      const linkPage = await linkContext.newPage();
      for (const [route, label] of [
        ['/mods/boss-scaler/', 'Steam Workshop'],
        ['/mods/daedalian-keys/', 'CurseForge'],
      ]) {
        await linkPage.goto(`${baseURL}${route}`);
        const link = linkPage.getByRole('link', { name: new RegExp(label) });
        const href = await link.getAttribute('href');
        assert.ok(href);
        await linkContext.route(href, route =>
          route.fulfill({ contentType: 'text/html', body: '<title>External destination</title>' }),
        );
        const popupPromise = linkPage.waitForEvent('popup');
        await link.click();
        const popup = await popupPromise;
        try {
          await popup.waitForLoadState();
          assert.equal(popup.url(), href);
          assert.equal(await popup.evaluate(() => window.opener), null);
          assert.equal(new URL(linkPage.url()).pathname, route);
        } finally {
          await popup.close();
        }
      }
    } finally {
      await linkContext.close();
    }
  });

  await t.test('late web fonts keep layout shift within budget', async () => {
    const fontContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await fontContext.addInitScript(() => {
        const shifts: number[] = [];
        Object.assign(window, { auditLayoutShifts: shifts });
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) shifts.push(shift.value);
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await fontContext.route('**/*.woff2', async route => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.continue();
      });
      const fontPage = await fontContext.newPage();
      for (const route of ['/', '/projects/maxiedev-events/']) {
        await fontPage.goto(`${baseURL}${route}`);
        await fontPage.evaluate(() => document.fonts.ready);
        await fontPage.evaluate(
          () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        const shift = await fontPage.evaluate(() =>
          (window as typeof window & { auditLayoutShifts: number[] }).auditLayoutShifts.reduce(
            (sum, value) => sum + value,
            0,
          ),
        );
        results.push({ route, delayedFontsLayoutShift: shift });
        assert.ok(shift <= 0.1, `${route}: layout shift ${shift} with delayed fonts`);
      }
    } finally {
      await fontContext.close();
    }
  });

  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    await t.test(`motion and contact after client navigation: ${reducedMotion}`, async () => {
      const motionContext = await browser.newContext({ reducedMotion });
      try {
        await motionContext.addInitScript(() => {
          const calls: Array<{ frames: unknown; options: unknown }> = [];
          Object.assign(window, { auditAnimations: calls });
          const animate = Element.prototype.animate;
          Element.prototype.animate = function (frames, options) {
            calls.push({ frames, options });
            return animate.call(this, frames, options);
          };
        });
        const motionPage = await motionContext.newPage();
        await motionPage.goto(baseURL);
        await motionPage.evaluate(() => document.fonts.ready);
        for (const control of await motionPage.locator('.site-nav a[aria-label], [data-theme-toggle]').all()) {
          await motionPage.mouse.move(0, 0);
          await control.hover();
          if (reducedMotion === 'no-preference') {
            assert.ok(
              await control.evaluate(node =>
                node
                  .getAnimations()
                  .some(
                    animation => animation instanceof CSSTransition && animation.transitionProperty === 'translate',
                  ),
              ),
              'Icon control must animate its hover movement',
            );
          } else {
            assert.ok(
              await control.evaluate(node =>
                getComputedStyle(node)
                  .transitionDuration.split(',')
                  .every(duration => Number.parseFloat(duration) <= 0.00001),
              ),
            );
          }
        }
        const calls = () =>
          motionPage.evaluate(
            () =>
              (
                window as typeof window & {
                  auditAnimations: Array<{ frames: Record<string, unknown>; options: { duration: number } }>;
                }
              ).auditAnimations,
          );
        if (reducedMotion === 'no-preference') {
          await motionPage.waitForFunction(
            () => (window as typeof window & { auditAnimations: unknown[] }).auditAnimations.length > 0,
          );
          assert.ok(
            (await calls()).some(
              call => JSON.stringify(call.frames).includes('translateY(9px)') && call.options.duration === 620,
            ),
          );
        } else assert.deepEqual(await calls(), []);
        await motionPage
          .getByRole('navigation', { name: 'Primary navigation' })
          .getByRole('link', { name: 'Projects', exact: true })
          .click();
        await motionPage.waitForURL('**/projects');
        await motionPage.evaluate(() => {
          location.hash = '#contact';
        });
        await motionPage.waitForFunction(() => document.activeElement?.id === 'contact');
        assert.equal(await motionPage.locator('#contact').isVisible(), true);
        const contactBounds = await motionPage.locator('#contact').boundingBox();
        const navBounds = await motionPage.getByRole('navigation', { name: 'Primary navigation' }).boundingBox();
        assert.ok(
          contactBounds && navBounds && contactBounds.y >= navBounds.y + navBounds.height - 1,
          'Focused contact must not be covered by navigation',
        );
        if (reducedMotion === 'no-preference') {
          assert.ok((await calls()).some(call => call.options.duration === 1600 && 'backgroundColor' in call.frames));
        } else assert.deepEqual(await calls(), []);
      } finally {
        await motionContext.close();
      }
    });
  }

  for (const theme of ['dark', 'light']) {
    for (const width of [320, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      context.setDefaultTimeout(10000);
      await context.addInitScript(theme => localStorage.setItem('maxie-theme', theme), theme);
      const page = await context.newPage();
      await t.test(`card surfaces preserve links and tooltip controls: ${theme} ${width}px`, async () => {
        for (const route of ['/', '/projects/', '/mods/']) {
          await page.goto(`${baseURL}${route}`);
          await page.evaluate(() => document.fonts.ready);
          const cards = page.locator('[data-project-card]');
          for (const card of await cards.all()) {
            await card.scrollIntoViewIfNeeded();
            const blocked = await card.evaluate(card => {
              const bounds = card.getBoundingClientRect();
              const blocked: Array<{ x: number; y: number; element: string }> = [];
              for (let y = Math.max(bounds.top + 4, 120); y < Math.min(bounds.bottom - 4, innerHeight); y += 12) {
                for (let x = bounds.left + 4; x < bounds.right - 4; x += 12) {
                  const hit = document.elementFromPoint(x, y);
                  if (!hit?.closest('a, button, [role="tooltip"]'))
                    blocked.push({ x, y, element: hit?.tagName ?? 'none' });
                }
              }
              return blocked;
            });
            assert.deepEqual(blocked, [], `${route}: ${await card.getAttribute('id')} has dead areas`);
          }
          const card = cards.first();
          const tooltipTrigger = card.locator('[data-tooltip] button').first();
          await tooltipTrigger.click();
          assert.equal(new URL(page.url()).pathname, route);
          await card.getByRole('tooltip').first().waitFor({ state: 'visible' });
          await page.keyboard.press('Escape');
          await tooltipTrigger.blur();
          await page.mouse.move(0, 0);
          const expected = await card.locator('.project-resource-card__link').getAttribute('href');
          const metadata = card.locator('.resource-metadata');
          await metadata.scrollIntoViewIfNeeded();
          const point = await metadata.evaluate(node => {
            const bounds = node.getBoundingClientRect();
            return { x: bounds.right - 2, y: bounds.top + bounds.height / 2 };
          });
          await page.mouse.click(point.x, point.y);
          await page.waitForURL(url => url.pathname === expected);
        }
      });
      for (const route of [...routes, missingRoute]) {
        await t.test(`axe and reflow: ${route} ${theme} ${width}px`, async () => {
          assert.equal((await page.goto(`${baseURL}${route}`))?.status(), route === missingRoute ? 404 : 200);
          await page.evaluate(() => document.fonts.ready);
          await page.locator('main').waitFor();
          const scan = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
            .analyze();
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
          await page.addStyleTag({
            content:
              '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
          });
          const spacingOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
          if (width === 1440) await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
          const zoomOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
          const clippedText = await page.evaluate(() => {
            const clipped: string[] = [];
            const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode;
              const parent = node.parentElement;
              if (
                !parent ||
                !node.textContent?.trim() ||
                parent.closest('script, style, pre, [aria-hidden="true"], .sr-only')
              )
                continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              if (
                [...range.getClientRects()].some(
                  rect => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1),
                )
              )
                clipped.push(node.textContent.trim());
            }
            return clipped;
          });
          results.push({
            route,
            theme,
            width,
            violations: scan.violations,
            incomplete: scan.incomplete,
            overflow,
            spacingOverflow,
            clippedText,
            zoomOverflow,
          });
          assert.deepEqual(
            {
              violations: scan.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })),
              overflow,
              spacingOverflow,
              clippedText,
              zoomOverflow,
            },
            { violations: [], overflow: false, spacingOverflow: false, clippedText: [], zoomOverflow: false },
          );
        });
      }
      await t.test(`skip link keyboard activation: ${theme} ${width}px`, async () => {
        await page.goto(baseURL);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
        await page.keyboard.press('Enter');
        assert.equal(new URL(page.url()).hash, '#main-content');
        await page.keyboard.press('Tab');
        assert.ok(
          await page.evaluate(
            () =>
              document.activeElement?.id === 'main-content' ||
              !!document.querySelector('main')?.contains(document.activeElement),
          ),
        );
      });
      await t.test(`theme keyboard control and client navigation: ${theme} ${width}px`, async () => {
        await page.goto(baseURL);
        const next = theme === 'dark' ? 'light' : 'dark';
        const toggle = page.getByRole('button', { name: `Switch to ${next} theme` });
        await toggle.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('html').getAttribute('data-theme'), next);
        await page
          .getByRole('navigation', { name: 'Primary navigation' })
          .getByRole('link', { name: 'Projects', exact: true })
          .click();
        await page.waitForURL('**/projects');
        assert.equal(await page.locator('html').getAttribute('data-theme'), next);
        await page.getByRole('button', { name: `Switch to ${theme} theme` }).waitFor();
        const tooltipTrigger = page.locator('button[aria-describedby]').first();
        await tooltipTrigger.focus();
        const tooltipId = await tooltipTrigger.getAttribute('aria-describedby');
        const tooltip = page.locator(`[id="${tooltipId}"]`);
        await tooltip.waitFor({ state: 'visible' });
        const bounds = await tooltip.boundingBox();
        assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width, 'Tooltip must fit in the viewport');
        await page.keyboard.press('Escape');
        await tooltip.waitFor({ state: 'hidden' });
        await tooltipTrigger.hover();
        await tooltip.waitFor({ state: 'visible' });
        await tooltip.hover();
        assert.equal(await tooltip.isVisible(), true);
      });
      await t.test(`screenshot carousel keyboard controls: ${theme} ${width}px`, async () => {
        const carouselPage = await context.newPage();
        try {
          await carouselPage.goto(`${baseURL}/mods/daedalian-keys/`);
          await carouselPage.evaluate(() => document.fonts.ready);
          await carouselPage.locator('[data-mod-slideshow-ready]').waitFor();
          const next = carouselPage.getByRole('button', { name: 'Show next image' });
          await carouselPage.waitForFunction(() => {
            const button = document.querySelector<HTMLButtonElement>('[data-mod-slideshow-next]');
            return button && !button.disabled;
          });
          await next.focus();
          await carouselPage.keyboard.press('Enter');
          await carouselPage.waitForFunction(
            () => document.querySelector('[data-mod-slideshow-current]')?.textContent === '2',
          );
          assert.equal(await carouselPage.getByRole('button', { name: 'Show previous image' }).isEnabled(), true);
        } finally {
          await carouselPage.close();
        }
      });
      await context.close();
    }
  }
});
