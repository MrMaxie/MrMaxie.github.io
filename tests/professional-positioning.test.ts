import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path: string) => readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');

test('identifies the person without duplicating the primary navigation', async () => {
  const header = await read('components/site/Header.astro');
  const hero = await read('components/site/AuthorHero.astro');
  const about = await read('pages/about.astro');
  const identity = await read('components/site/AuthorIdentity.astro');
  assert.match(hero, /Software developer/);
  assert.match(header, /<AuthorHero/);
  assert.match(about, /<AuthorHero/);
  assert.match(hero, /<AuthorIdentity/);
  assert.match(identity, /Maciej Mieńko/);
  assert.match(identity, /Maxie/);
  assert.ok(hero.includes('Routes.about()'));
  assert.doesNotMatch(header, /Routes\.(projects|articles|mods)\(/);
  assert.match(hero, /<Portrait/);
});

test('keeps About personal while project evidence remains in the work', async () => {
  const [home, about, project] = await Promise.all([
    read('pages/index.astro'),
    read('pages/about.astro'),
    read('pages/projects/[slug].astro'),
  ]);
  assert.match(home, /getFeaturedProjects/);
  assert.match(about, /I build developer tools and local infrastructure/);
  for (const subject of ['Pokémon Ruby', 'RPG Maker XP', 'probability', 'Working with other people']) {
    assert.ok(about.replace(/\s+/g, ' ').includes(subject), subject);
  }
  assert.match(await read('layouts/Base.astro'), /<ContactPanel/);
  assert.doesNotMatch(about, /<dl|Routes\.project|Projects and writing|public-evidence/);
  assert.doesNotMatch(about, /religion|MapleStory|Heroes of Might|Butterfly Effect|watchlist/);
  assert.match(about, /what follows from the evidence/);
  assert.match(project, /<Description content={resource\.description}/);
  assert.doesNotMatch(project, /project\.(problem|approach|result|validation|responsibility)/);
  assert.doesNotMatch(`${home}\n${about}`, /available for work|open to work|private client|\bNDA\b/i);
});
