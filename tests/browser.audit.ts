import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { builtRoutes, productionPreview, sampleRoutes } from './helpers/site-audit.ts';

test('production accessibility, readability and discoverability audit', async t => {
  const output = await mkdtemp(join(tmpdir(), 'portfolio-browser-audit-'));
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
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
        headings: [...document.querySelectorAll('h1')].map(node => node.textContent?.trim()),
        main: document.querySelector('main')?.textContent?.trim(),
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
      assert.doesNotMatch(metadata.robots, /noindex|nosnippet/i);
      assert.equal(metadata.headings.length, 1, 'Expected one primary heading');
      assert.ok(metadata.headings[0]);
      assert.ok(metadata.main);
      for (const json of metadata.structuredData) assert.ok(JSON.parse(json ?? ''));
    });
  }
  await t.test('robots and sitemap expose the production routes', async () => {
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
  });
  await context.close();

  for (const theme of ['dark', 'light']) {
    for (const width of [320, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      context.setDefaultTimeout(10000);
      await context.addInitScript(theme => localStorage.setItem('maxie-theme', theme), theme);
      const page = await context.newPage();
      for (const route of sampleRoutes) {
        await t.test(`axe and reflow: ${route} ${theme} ${width}px`, async () => {
          assert.equal((await page.goto(`${baseURL}${route}`))?.status(), 200);
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
          results.push({
            route,
            theme,
            width,
            violations: scan.violations,
            incomplete: scan.incomplete,
            overflow,
            spacingOverflow,
          });
          assert.deepEqual(
            {
              violations: scan.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })),
              overflow,
              spacingOverflow,
            },
            { violations: [], overflow: false, spacingOverflow: false },
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
        await page.keyboard.press('Escape');
        await tooltip.waitFor({ state: 'hidden' });
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
