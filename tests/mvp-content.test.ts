import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import { catalog, pageText } from './catalog.ts';

const entries = catalog('projects');
const dist = new URL('../dist/', import.meta.url);
const source = (file: string) => entries.find(entry => entry.slug === file.replace('.ts', ''))?.source ?? '';
const html = (route: string) => readFileSync(new URL(`${route}/index.html`, dist), 'utf8');

test('keeps proprietary entries within the approved minimal disclosure', () => {
  const proprietary = entries.filter(entry => entry.fields.access === 'Access.Proprietary');
  assert.equal(proprietary.length, 8);
  for (const entry of proprietary) {
    assert.deepEqual(Object.keys(entry.fields).sort(), [
      'access',
      'color',
      'description',
      'icon',
      'name',
      'summary',
      'tags',
    ]);
    assert.match(entry.html, /Proprietary/);
    assert.match(entry.html, /data-project-description/);
    assert.match(entry.html, /How I built it/);
    assert.doesNotMatch(entry.html, /Project identity and details are unavailable due to NDA/);
    assert.ok(entry.html.includes(entry.fields.icon));
  }
});

test('renders project descriptions without a fixed length or obsolete panels', () => {
  for (const entry of entries) {
    const file = `${entry.slug}.ts`;
    const page = html(`projects/${file.replace('.ts', '')}`);
    const descriptionStart = page.indexOf('data-project-description');
    const descriptionEnd = page.indexOf('id=resource-navigation', descriptionStart);
    assert.ok(descriptionStart >= 0 && descriptionEnd > descriptionStart, `Missing description: ${file}`);
    const description = page.slice(descriptionStart, descriptionEnd);
    assert.match(description, /<h2\b/, `Missing descriptive heading: ${file}`);
    assert.match(description, /How I built it/, `Missing implementation section: ${file}`);
    assert.doesNotMatch(description, /My (?:fullstack )?contribution|My scope|My role|full[ -]?stack/i);
    assert.match(description, /<mark>/, `Missing project-color emphasis: ${file}`);
    assert.doesNotMatch(description, /\*\*|==|__/, `Unrendered text formatting: ${file}`);
    const paragraphs = (description.match(/<p\b/g) ?? []).length;
    assert.ok(paragraphs >= 1, `Expected project paragraphs: ${file}`);
    if (file === 'arcantry.ts') {
      assert.match(description, /<ul\b[\s\S]*<li\b/);
      assert.match(description, /<strong\b/);
      assert.match(description, /<u>/);
      assert.ok(paragraphs > 3, 'Arcantry needs space for its product scope');
      for (const topic of ['todo.txt', 'Release commands', 'agent skills', 'Rust', 'TypeScript']) {
        assert.ok(description.includes(topic), `Missing Arcantry coverage: ${topic}`);
      }
    }
    assert.doesNotMatch(page, /<time\b|<dl\b|Project overview|Project story|Latest update|Latest release/);
  }
});

test('presents office-3ds as a dashboard without anonymization or neutral-demo framing', () => {
  assert.doesNotMatch(source('office-3ds.ts'), /^disclosure:/m);
  assert.doesNotMatch(source('office-3ds.ts'), /neutral demo|Details anonymized/i);
  assert.doesNotMatch(html('projects/office-3ds'), /neutral demo|Details anonymized/i);
  assert.doesNotMatch(html('projects'), /Details anonymized/);
});

test('shows the corrected technologies on project cards', () => {
  const expected = {
    'factory-control-platform': ['TypeScript', 'C/C++', 'C#'],
    'vision-guided-drone-system': ['C/C++', 'Embedded C', 'Python'],
    'work-management-platform': ['TypeScript', 'C#'],
    'real-time-3d-geospatial-platform': ['TypeScript', 'Rust', 'C#'],
  };
  for (const [slug, tags] of Object.entries(expected)) {
    const card = html('projects').match(new RegExp(`<article\\b[^>]*\\bid="?${slug}"?[\\s>][\\s\\S]*?</article>`))?.[0];
    assert.ok(card, `Missing project card: ${slug}`);
    for (const tag of tags) {
      assert.ok(card.includes(tag), `Missing ${tag} on ${slug}`);
    }
  }
});

test('uses declared project icons and colors on detail pages', () => {
  const expected = {
    'factory-control-platform': ['#2A835F', 'lucide:robot-arm'],
    'event-operations-platform': ['#D90000', 'tabler:ticket'],
    'live-consultation-platform': ['#B0CDE6', 'tabler:calendar-stats'],
    'interactive-learning-platform': ['#118AB2', 'tabler:backpack'],
    'transparent-hiring-platform': ['#06D6A0', 'tabler:briefcase-2'],
    'real-time-3d-geospatial-platform': ['#558467', 'lucide:map-pinned'],
    'work-management-platform': ['#3874FF', 'lucide:list-todo'],
    'vision-guided-drone-system': ['#65DCD5', 'tabler:drone'],
  };
  for (const [slug, [color, icon]] of Object.entries(expected)) {
    const entry = entries.find(candidate => candidate.slug === slug);
    assert.ok(entry);
    assert.equal(entry.fields.color, color);
    assert.equal(entry.fields.icon, icon);
    assert.ok(entry.html.includes(icon));
    assert.ok(html('projects').includes(icon));
  }
});

test('omits dates from project cards and uses the short Docs label', () => {
  assert.doesNotMatch(html('projects'), /<time\b|Latest update|Latest release|>Documentation</);
  assert.match(html('projects'), />\s*Docs\s*</);
});

test('labels private projects on cards and detail pages', () => {
  for (const slug of ['mivi', 'dovik', 'blocksy']) {
    assert.match(source(`${slug}.ts`), /access: Access.Private/);
    assert.match(html(`projects/${slug}`), /Private/);
    assert.doesNotMatch(html(`projects/${slug}`), /Not publicly available yet\./);
  }
  assert.doesNotMatch(html('projects'), /Not publicly available yet\./);
});

test('describes Blocksy as a complete game experiment while keeping its availability private', () => {
  const entry = source('blocksy.ts');
  const page = html('projects/blocksy');

  for (const detail of ['11 by 11 grid', 'entity-component-system', 'LDtk', 'PHP FFI', 'CRT shader']) {
    assert.ok(page.includes(detail), `Missing Blocksy detail: ${detail}`);
  }
  assert.match(entry, /license: ['"]Apache-2\.0['"]/);
  assert.match(entry, /access: Access.Private/);
  assert.doesNotMatch(page, /Not publicly available yet\./);
});

test('keeps featured cards consistent with private badges and no status footers', () => {
  const home = readFileSync(new URL('index.html', dist), 'utf8');
  for (const slug of ['arcantry', 'cadder', 'mivi', 'dovik']) {
    const card = home.match(new RegExp(`<article\\b[^>]*\\bid="?${slug}"?[\\s>][\\s\\S]*?</article>`))?.[0];
    assert.ok(card, `Missing featured card: ${slug}`);
    assert.doesNotMatch(card, /<time\b|project-currentness|Not publicly available yet\./);
    if (slug === 'mivi' || slug === 'dovik') {
      assert.match(card, /Private/);
    }
  }
});

test('omits removed content from generated routes and navigation', () => {
  for (const route of [
    'blog',
    'projects/pixelizer',
    'projects/commitshade',
    'projects/unfox',
    'projects/property-platform',
    'projects/recruitment-platform',
    'projects/learning-platform',
    'mods/game/stardew-valley',
    'mods/anti-decay',
    'mods/exp-share',
    'mods/fishing-poster',
    'mods/gmcm-pad',
    'mods/knowledge-share',
  ]) {
    assert.equal(existsSync(new URL(route, dist)), false, `${route} must not be generated`);
  }
  const pages = [
    'index.html',
    'projects/index.html',
    'mods/index.html',
    'tags/index.html',
    'sitemap-0.xml',
    'robots.txt',
  ];
  for (const page of pages) {
    assert.doesNotMatch(
      readFileSync(new URL(page, dist), 'utf8'),
      /\/blog|\/projects\/(?:pixelizer|commitshade|unfox)|stardew[ -]valley|fence repair/i,
    );
  }
});

test('presents the public events package with its npm link and highlighted typed example', () => {
  const entry = entries.find(candidate => candidate.slug === 'maxiedev-events');
  assert.ok(entry);
  assert.equal(entry.fields.name, '@maxiedev/events');
  assert.equal(entry.fields.color, '#E69DB8');
  assert.equal(entry.fields.icon, 'lucide:split');
  assert.ok(entry.html.includes('https://www.npmjs.com/package/@maxiedev/events'));
  const code = entry.html.match(/<pre\b[\s\S]*?<\/pre>/)?.[0] ?? '';
  assert.match(pageText(code), /events.emit\('saved', 'item-42'\)/);
  const colors = new Set([...code.matchAll(/color:([^;" >]+)/g)].map(match => match[1]));
  assert.ok(colors.size >= 3, 'Code must contain distinct token colors');
});
