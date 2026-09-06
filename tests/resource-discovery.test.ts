import assert from 'node:assert/strict';
import test from 'node:test';
import { Tags } from '../src/data/tags.ts';
import { createTag, type ResourceData, type TagDefinition, TagKind } from '../src/lib/content.ts';
import type { Project } from '../src/lib/projects.ts';
import { resolveTags } from '../src/lib/tags.ts';
import { buildTopicGroups } from '../src/lib/topics.ts';
import { catalog, pageHtml, pageText, readSource } from './catalog.ts';

const project = (slug: string, tags: TagDefinition[]): Project => ({
  slug,
  name: slug,
  summary: slug,
  color: '#123456',
  tags,
  links: [],
  description: {} as ResourceData['description'],
});

const childTag = createTag({
  ...Tags.TypeScript,
  id: 'child-technology',
  name: 'Child technology',
  parents: [Tags.TypeScript],
});

test('every catalog tag has resources in the generated site', () => {
  for (const tag of Object.values(Tags)) {
    const page = pageHtml(`tags/${tag.id}`);
    assert.match(page, /project-resource-card/);
  }
});

test('includes child resources under parent tags without reversing the relationship', () => {
  const projects = [project('svelte-tool', [childTag]), project('typescript-tool', [Tags.TypeScript])];
  const topics = buildTopicGroups(projects, [], [Tags.TypeScript, childTag]);
  assert.deepEqual(
    topics.find(topic => topic.slug === 'typescript')?.projects.map(item => item.slug),
    ['svelte-tool', 'typescript-tool'],
  );
  assert.deepEqual(
    topics.find(topic => topic.slug === childTag.id)?.projects.map(item => item.slug),
    ['svelte-tool'],
  );
});

test('tag labels can change without changing routes, membership, or technology grouping', () => {
  const renamed = { ...Tags.TypeScript, name: 'A different display label' };
  const topics = buildTopicGroups([project('tool', [renamed])], [], [renamed]);
  assert.equal(topics[0].slug, Tags.TypeScript.id);
  assert.equal(topics[0].projects.length, 1);
  assert.equal(renamed.kind, TagKind.Technology);
  assert.deepEqual(resolveTags([renamed, Tags.TypeScript]), [Tags.TypeScript]);
});

test('rejects missing, duplicate, unknown parent, and circular tag definitions', () => {
  assert.throws(() => buildTopicGroups([project('tool', [Tags.Rust])], [], []), /Missing tag definitions/);
  assert.throws(() => buildTopicGroups([], [], [Tags.Rust, Tags.Rust]), /Duplicate tag definition/);
  assert.throws(() => buildTopicGroups([], [], [childTag]), /Unknown parent tag/);
  const first: TagDefinition = { ...Tags.TypeScript, parents: [] };
  const second: TagDefinition = { ...childTag, parents: [first] };
  const cycle = { ...first, parents: [second] };
  assert.throws(() => buildTopicGroups([], [], [cycle, second]), /Circular tag parents/);
  assert.throws(() => resolveTags([{ ...Tags.Rust, id: 'unknown' }]), /Unknown tag/);
});

test('validates tag content and resolves duplicate tags at the component boundary', () => {
  assert.throws(() => createTag({ ...Tags.Rust, id: 'invalid id' }), /Invalid tag ID/);
  assert.throws(() => createTag({ ...Tags.Rust, color: 'red' }), /Invalid content color/);
  assert.throws(() => createTag({ ...Tags.Rust, name: ' ' }), /must not be empty/);
  assert.deepEqual(resolveTags([Tags.Rust, Tags.Rust, Tags.TypeScript]), [Tags.Rust, Tags.TypeScript]);
});

test('preserves the approved mod media and provider destinations', () => {
  const links = {
    'boss-scaler': 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393301771',
    'economy-scaler': 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393716685',
    'money-is-luck': 'https://steamcommunity.com/sharedfiles/filedetails/?id=2493745218',
    'daedalian-keys': 'https://www.curseforge.com/hogwarts-legacy/mods/daedalian-key-assist',
    'imelda-flight-challenges': 'https://www.curseforge.com/hogwarts-legacy/mods/easier-imelda-flight-challenges',
  };
  const entries = catalog('mods');
  assert.deepEqual(entries.map(entry => entry.slug).sort(), Object.keys(links).sort());
  const screenshots: Record<string, string[]> = {
    'daedalian-keys': ['01', '02'],
    'imelda-flight-challenges': ['03', '02', '01'],
  };
  for (const entry of entries) {
    assert.ok(entry.html.includes(links[entry.slug as keyof typeof links]));
    const media = [...entry.source.matchAll(/from ['"](.*?assets\/mods\/.*?)['"]/g)].map(match => match[1]);
    const expectedScreenshots = (screenshots[entry.slug] ?? []).map(
      number => `../../assets/mods/${entry.slug}/${number}.jpg`,
    );
    assert.deepEqual(media.sort(), [`../../assets/mods/${entry.slug}.png`, ...expectedScreenshots].sort());
    const imports = new Map(
      [...entry.source.matchAll(/import (\w+) from ['"]([^'"]+)['"]/g)].map(match => [match[1], match[2]]),
    );
    const orderedScreenshots = [...(entry.fields.screenshots ?? '').matchAll(/image: (\w+)/g)].map(match =>
      imports.get(match[1]),
    );
    assert.deepEqual(orderedScreenshots, expectedScreenshots);
    assert.doesNotMatch(entry.source, /visual:|audience:|features:|usage:|unchanged:/);
    assert.doesNotMatch(entry.html, /github\.com\/MrMaxie\/game-mods|\.uasset/);
  }
  assert.match(
    pageText(entries.find(entry => entry.slug === 'daedalian-keys')?.html ?? ''),
    /No additional prompt or button press is required/,
  );
  assert.match(
    pageText(entries.find(entry => entry.slug === 'money-is-luck')?.html ?? ''),
    /even coin count, the item adds 0\.2 Luck per coin/,
  );
});

test('lists every mod in its game section without game subpages or truncation', () => {
  const listing = pageHtml('mods');
  for (const entry of catalog('mods')) assert.ok(listing.includes(`/mods/${entry.slug}`));
  for (const game of ['terraria', 'isaac', 'hogwarts-legacy'])
    assert.match(listing, new RegExp(`id=["']?${game}["' >]`));
  assert.doesNotMatch(listing, /\/mods\/game\/|View all/);
  assert.doesNotMatch(readSource('src/pages/mods.astro'), /\.slice\(/);
});

test('renders optional screenshots between the header and description with accessible controls', () => {
  for (const entry of catalog('mods')) {
    const carousel = entry.html.indexOf('aria-roledescription=carousel');
    if (['daedalian-keys', 'imelda-flight-challenges'].includes(entry.slug)) {
      assert.ok(carousel >= 0 && carousel < entry.html.indexOf('data-project-description'));
      for (const text of ['Show previous image', 'Show next image', 'aria-live=polite'])
        assert.ok(entry.html.includes(text));
    } else assert.equal(carousel, -1);
    assert.doesNotMatch(entry.html, /<dl\b|mod-detail__backdrop|mod-detail__foreground/);
  }
  const script = readSource('src/scripts/mod-slideshow.ts');
  assert.match(script, /emblaApi\.destroy\(\)/);
  assert.match(script, /astro:before-swap/);
});

test('shares cards, arrows, and spotlight behavior across projects and mods', () => {
  for (const component of ['projects/ProjectCard', 'mods/ModCard'])
    assert.match(readSource(`src/components/${component}.astro`), /<ResourceCard/);
  const card = readSource('src/components/ui/ResourceCard.astro');
  assert.match(card, /<ResourceArrow/);
  assert.match(card, /<InteractiveSpotlight/);
  assert.match(readSource('src/styles/effects.css'), /@property --pointer-x/);
});
