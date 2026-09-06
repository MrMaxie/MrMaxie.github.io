import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const aboutPath = new URL('../src/layouts/Base.astro', import.meta.url);
const projectsDirectory = new URL('../src/data/projects/', import.meta.url);

test('separates professional outreach from project issue reports', async () => {
  const about = await readFile(aboutPath, 'utf8');
  const contact = await readFile(new URL('../src/components/site/ContactPanel.astro', import.meta.url), 'utf8');

  assert.match(about, /<ContactPanel/);
  assert.match(contact, /Want to work together or ask about a project/);
  assert.match(contact, /Contact me on LinkedIn/);
  assert.match(contact, /Found a bug\?/);
  assert.match(contact, /Choose a project/);
  assert.doesNotMatch(contact, /mailto:|availability|response time/i);
});

test('omits issue-report and download links from every project source and detail page', async () => {
  const files = (await readdir(projectsDirectory)).filter(file => file.endsWith('.ts'));
  assert.ok(files.length > 0);

  for (const file of files) {
    const source = await readFile(new URL(file, projectsDirectory), 'utf8');
    const slug = file.replace(/\.ts$/, '');
    const page = await readFile(new URL(`../dist/projects/${slug}/index.html`, import.meta.url), 'utf8');

    assert.doesNotMatch(source, /Report an issue|kind: issues|label: Download|\/releases\/(?:latest|download)/i, file);
    assert.doesNotMatch(page, /Report an issue|href="https:\/\/github\.com\/[^"\s]+\/issues(?:[/?#][^"]*)?"/, slug);
    assert.doesNotMatch(page, /aria-label="[^"]*: Download"|href="[^"]*\/releases\/(?:latest|download)[^"]*"/i, slug);
  }
});
