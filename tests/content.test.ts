import assert from 'node:assert/strict';
import test from 'node:test';
import { Tags } from '../src/data/tags.ts';
import { createMod, createProject, GameId, normalizeLinks, type ResourceData } from '../src/lib/content.ts';
import { orderCatalog } from '../src/lib/project-selection.ts';

const description = {} as ResourceData['description'];
const input = { name: 'Example', summary: 'An example.', tags: [Tags.TypeScript], description };

test('new catalog entries appear without requiring an ordering edit', () => {
  const entries = [{ slug: 'new' }, { slug: 'first' }, { slug: 'second' }];
  assert.deepEqual(
    orderCatalog(entries, ['second', 'first']).map(entry => entry.slug),
    ['second', 'first', 'new'],
  );
  assert.deepEqual(orderCatalog(entries, []), entries);
  assert.throws(() => orderCatalog(entries, ['missing']), /unknown projects/);
});

test('content factories supply optional defaults without duplicating presentation data', () => {
  const project = createProject({ ...input, name: ' Example ', color: '#123456' });
  const mod = createMod({ ...input, game: GameId.Terraria });
  assert.equal(project.name, 'Example');
  assert.deepEqual(project.links, []);
  assert.deepEqual(mod.screenshots, []);
  assert.equal(mod.logo, undefined);
  assert.equal(project.description, description);
  assert.throws(() => createProject({ ...input, color: 'invalid' }), /Invalid content color/);
  assert.throws(() => createMod({ ...input, summary: ' ', game: GameId.Terraria }), /must not be empty/);
});

test('link normalization rejects executable URLs and empty labels', () => {
  assert.throws(() => normalizeLinks([{ label: 'Source', href: 'javascript:alert(1)' }]), /Unsupported link protocol/);
  assert.throws(() => normalizeLinks([{ label: ' ', href: 'https://example.com' }]), /must not be empty/);
  assert.throws(() => normalizeLinks([{ label: 'Source', href: 'not a URL' }]), /Invalid URL/);
  assert.deepEqual(normalizeLinks([{ label: ' Source ', href: 'https://example.com' }]), [
    { label: 'Source', href: 'https://example.com/' },
  ]);
});
