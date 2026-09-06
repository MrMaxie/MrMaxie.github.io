import assert from 'node:assert/strict';
import test from 'node:test';
import { projectOrder } from '../src/config/projects.ts';
import { selectProjects } from '../src/lib/project-selection.ts';
import { catalog, pageHtml, readSource } from './catalog.ts';

const projectIds = ['arcantry', 'cadder', 'mivi', 'dovik', 'office-3ds', 'free-tray-games'];
const projects = projectIds.map(slug => ({ slug }));

test('selects between one and four configured projects in editorial order', () => {
  assert.deepEqual(selectProjects(projects, ['dovik'], { label: 'Featured', minimum: 1, maximum: 4 }), [
    { slug: 'dovik' },
  ]);
  assert.deepEqual(
    selectProjects(projects, ['arcantry', 'cadder', 'mivi', 'dovik'], {
      label: 'Featured',
      minimum: 1,
      maximum: 4,
    }).map(project => project.slug),
    ['arcantry', 'cadder', 'mivi', 'dovik'],
  );
});

test('rejects invalid editorial project selections', () => {
  assert.throws(
    () => selectProjects(projects, [], { label: 'Featured', minimum: 1, maximum: 4 }),
    /at least 1 project/,
  );
  assert.throws(() => selectProjects(projects, projectIds, { label: 'Featured', maximum: 4 }), /at most 4 projects/);
  assert.throws(
    () => selectProjects(projects, ['arcantry', 'arcantry'], { label: 'Featured' }),
    /duplicate project identifiers/,
  );
  assert.throws(() => selectProjects(projects, ['missing'], { label: 'Featured' }), /unknown projects: missing/);
});

test('stores a typed catalog with neighboring Markdown descriptions', () => {
  const entries = catalog('projects');
  assert.deepEqual(entries.map(entry => entry.slug).sort(), [...projectOrder].sort());
  for (const entry of entries) {
    for (const field of ['name', 'summary', 'color', 'description'])
      assert.ok(entry.fields[field], `${entry.slug}: ${field}`);
    assert.match(entry.source, /createProject\(/);
    assert.match(entry.markdown, /## How I built it/);
    assert.doesNotMatch(entry.source, /visual:|logoCrop:|paragraphs:|disclosure:/);
  }
});

test('uses the shared header and description with real rendered metadata', () => {
  for (const group of ['projects', 'mods']) {
    const detail = readSource(`src/pages/${group}/[slug].astro`);
    for (const component of ['ResourceHeader', 'Description', 'ResourceNavigation'])
      assert.ok(detail.includes(`<${component}`));
  }
  const page = pageHtml('projects/maxiedev-events');
  assert.ok(page.indexOf('Description') < page.indexOf('data-project-description'));
  assert.ok(page.indexOf('data-project-description') < page.indexOf('More projects'));
  assert.match(page, /Apache-2.0/);
  assert.doesNotMatch(page, /project-visual|<dl\b/);
});
