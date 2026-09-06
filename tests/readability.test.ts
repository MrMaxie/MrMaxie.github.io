import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const globalStylesPath = new URL('../src/styles/global.css', import.meta.url);

test('the site background stays plain outside dedicated decorative surfaces', async () => {
  const source = await readFile(globalStylesPath, 'utf8');

  assert.match(source, /body\s*{[^}]*background: var\(--canvas\)/s);
  assert.doesNotMatch(source, /body\s*{[^}]*gradient\(/s);
});

test('small muted metadata uses the readable shared text size', async () => {
  const sources = await Promise.all(
    [
      '../src/pages/tags/index.astro',
      '../src/pages/mods.astro',
      '../src/components/ui/ResourceLinks.astro',
      '../src/components/site/Header.astro',
      '../src/pages/index.astro',
    ].map(path => readFile(new URL(path, import.meta.url), 'utf8')),
  );

  for (const source of sources) {
    assert.doesNotMatch(source, /text-\[(?:0\.66|0\.68|0\.7)rem\][^"\n]*text-text-muted/);
  }
});
