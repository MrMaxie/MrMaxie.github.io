import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const sourceRoot = new URL('../src/', import.meta.url);

const collectFiles = async (directory: URL): Promise<URL[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      return entry.isDirectory() ? collectFiles(path) : [path];
    }),
  );

  return files.flat();
};

test('uses the official, exactly pinned Tailwind CSS 4 Vite integration', async () => {
  const [packageSource, astroConfig, globalStyles, justfile, canonicalizer] = await Promise.all([
    readFile(new URL('package.json', root), 'utf8'),
    readFile(new URL('astro.config.ts', root), 'utf8'),
    readFile(new URL('styles/global.css', sourceRoot), 'utf8'),
    readFile(new URL('justfile', root), 'utf8'),
    readFile(new URL('scripts/tailwind-classes.ts', root), 'utf8'),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.equal(packageJson.devDependencies.tailwindcss, '4.3.3');
  assert.equal(packageJson.devDependencies['@tailwindcss/vite'], '4.3.3');
  assert.match(astroConfig, /import tailwindcss from '@tailwindcss\/vite';/);
  assert.match(astroConfig, /vite:\s*{\s*plugins: \[tailwindcss\(\)\]/s);
  assert.match(astroConfig, /playformCompress\({ CSS: false }\)/);
  assert.doesNotMatch(astroConfig, /@astrojs\/tailwind|postcss/i);
  assert.match(globalStyles, /^@import "tailwindcss" source\("\.\.\/"\);/);
  assert.match(globalStyles, /@custom-variant dark \(&:where\(\[data-theme="dark"\]/);
  assert.match(globalStyles, /--color-\*: initial;/);
  assert.match(justfile, /tailwind-classes\.ts --write/);
  assert.match(justfile, /tailwind-classes\.ts\s*$/m);
  assert.match(canonicalizer, /canonicalizeCandidates/);

  for (const [name, value] of [
    ['phone', '34rem'],
    ['compact', '42rem'],
    ['nav', '46rem'],
    ['content', '52rem'],
  ]) {
    assert.match(globalStyles, new RegExp(`--breakpoint-${name}: ${value};`));
  }
});

test('keeps styling sources bounded and rejects legacy or unsafe Tailwind patterns', async () => {
  const files = await collectFiles(sourceRoot);
  const cssFiles = files.filter(file => file.pathname.endsWith('.css'));
  const astroFiles = files.filter(file => file.pathname.endsWith('.astro'));
  const rootFiles = await readdir(root);

  assert.deepEqual(cssFiles.map(file => file.pathname.split('/').at(-1)).sort(), ['effects.css', 'global.css']);
  assert.doesNotMatch(rootFiles.join('\n'), /^(?:postcss\.config|tailwind\.config)/m);

  for (const file of astroFiles) {
    const source = await readFile(file, 'utf8');

    assert.doesNotMatch(source, /<style\b/i, `${file.pathname} contains a component style block`);
    assert.doesNotMatch(source, /@apply\b/, `${file.pathname} contains @apply`);
    assert.doesNotMatch(
      source,
      /\b(?:bg|border|fill|from|ring|stroke|text|to|via)-\$\{/,
      `${file.pathname} interpolates a Tailwind utility fragment`,
    );
  }

  const projectSources = await Promise.all(
    files.filter(file => /\.(?:astro|css|js|mjs|ts|tsx)$/.test(file.pathname)).map(file => readFile(file, 'utf8')),
  );
  const projectText = projectSources.join('\n');

  assert.doesNotMatch(projectText, /@astrojs\/tailwind|PurgeCSS|purgecss/i);
  assert.doesNotMatch(projectText, /@apply\b/);
});

test('preserves component-controlled link colors, motion, and alignment', async () => {
  const [globalStyles, effects, header, modCard, about] = await Promise.all([
    readFile(new URL('styles/global.css', sourceRoot), 'utf8'),
    readFile(new URL('styles/effects.css', sourceRoot), 'utf8'),
    readFile(new URL('components/site/AuthorHero.astro', sourceRoot), 'utf8'),
    readFile(new URL('components/ui/ResourceCard.astro', sourceRoot), 'utf8'),
    readFile(new URL('layouts/Base.astro', sourceRoot), 'utf8'),
  ]);

  const globalAnchorRule = globalStyles.match(/\na \{([^}]*)\}/)?.[1] ?? '';
  const globalAnchorHoverRule = globalStyles.match(/\na:hover \{([^}]*)\}/)?.[1] ?? '';
  assert.doesNotMatch(globalAnchorRule, /\n\s*color:/);
  assert.doesNotMatch(globalAnchorHoverRule, /\n\s*color:/);
  assert.match(effects, /\.tag-link \{[\s\S]*?color: var\(--tag-color\);/);

  assert.match(header, /<Portrait/);
  assert.doesNotMatch(header, /data-meteor-field|site-header__playground|rounded-full/);
  assert.match(effects, /\.project-resource-card__brand \{[\s\S]*?scale 260ms;/);

  assert.match(modCard, /project-resource-card__footer[^\n]*mt-auto/);
  assert.match(about, /<ContactPanel/);
});
