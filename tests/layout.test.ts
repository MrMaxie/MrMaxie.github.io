import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('aligns navigation and page content to one shared container', async () => {
  const [base, navigation, styles] = await Promise.all([
    readFile(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/site/Nav.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8'),
  ]);

  assert.match(base, /class="site-container flex flex-1 flex-col"/);
  assert.match(navigation, /class="site-container grid/);
  assert.doesNotMatch(navigation, /w-screen|-ml-\[calc\(50vw-50%\)\]/);
  assert.match(styles, /\.site-container\s*{[\s\S]*?width: min\([\s\S]*?margin-inline: auto;/);
});

test('lays out featured projects in two columns', async () => {
  const [home, effects] = await Promise.all([
    readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/effects.css', import.meta.url), 'utf8'),
  ]);

  assert.match(home, /home-projects grid grid-cols-2 max-content:grid-cols-1/);
  assert.doesNotMatch(home, /home-projects grid grid-cols-3/);
  assert.match(effects, /\.home-projects > \.project-resource-card:nth-child\(odd\)[\s\S]*?border-right:/);
  assert.match(effects, /\.home-projects > \.project-resource-card:nth-child\(-n \+ 2\)[\s\S]*?border-bottom:/);
});
