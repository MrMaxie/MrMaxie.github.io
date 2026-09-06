import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('uses visible headings as the accessible names for card links', () => {
  const home = readSource('../src/pages/index.astro');
  const projectCard = readSource('../src/components/ui/ResourceCard.astro');

  assert.match(home, /<ProjectCard[\s\S]*?headingLevel="h3"/);
  assert.doesNotMatch(home, /card-hit-area|aria-label={`(?:Open|Read)/);
  assert.match(projectCard, /<Heading[\s\S]*?>[\s\S]*?<a[\s\S]*?class="project-resource-card__link\b/);
  assert.doesNotMatch(projectCard, /aria-label={`Open/);
});

test('keeps project destinations visible', () => {
  const actions = readSource('../src/components/ui/ResourceLinks.astro');

  assert.doesNotMatch(actions, /\.project-actions a span\s*{/);
});

test('keeps shared cards keyboard reachable with separately labeled destinations', () => {
  const card = readSource('../src/components/ui/ResourceCard.astro');
  const links = readSource('../src/components/ui/ResourceLinks.astro');
  assert.match(card, /<Heading[\s\S]*<a/);
  assert.match(card, /relative z-4/);
  assert.match(links, /aria-label={/);
});

test('includes only real destinations in primary navigation', () => {
  const home = readSource('../dist/index.html');
  const nav = home.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(nav.indexOf('Projects') < nav.indexOf('Mods'));
  for (const label of ['Home', 'Projects', 'Mods', 'About']) assert.ok(nav.includes(label));
  assert.doesNotMatch(nav, />Contact</);
});

test('identifies the author portrait without making it interactive', () => {
  const portrait = readSource('../src/components/site/Portrait.astro');

  assert.match(portrait, /<Picture[\s\S]*?src={portrait}[\s\S]*?alt="Portrait of Maciej Mieńko"/);
  assert.doesNotMatch(portrait, /tabindex|role="button"|<button/);
});

test('marks the current primary destination in production pages', () => {
  for (const route of ['', 'about', 'projects', 'mods']) {
    const html = readSource(`../dist/${route ? `${route}/` : ''}index.html`);
    const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
    const currentLinks = [...nav.matchAll(/<a\b[^>]*aria-current=(?:"page"|page)[\s>][^>]*>/g)];
    assert.equal(currentLinks.length, 1, `${route || '/'} must have one active primary link`);
    const href = currentLinks[0][0].match(/\bhref=(?:"([^"]+)"|([^\s>]+))/);
    assert.equal(href?.[1] ?? href?.[2], `/${route}`);
  }
});
