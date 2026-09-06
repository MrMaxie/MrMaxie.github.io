import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('preloads the actual critical Latin font URLs without unrelated subsets', () => {
  for (const route of ['', 'projects/']) {
    const html = readFileSync(new URL(`../dist/${route}index.html`, import.meta.url), 'utf8');
    const preloads = [...html.matchAll(/<link\b[^>]*\brel=(?:"preload"|preload)[\s>][^>]*>/g)]
      .filter(([tag]) => /\bas=(?:"font"|font)[\s>]/.test(tag))
      .map(([tag]) => {
        const href = tag.match(/\bhref=(?:"([^"]+)"|([^\s>]+))/);
        return href?.[1] ?? href?.[2];
      });
    const families = ['Outfit Variable', 'Karla Variable', ...(route ? ['Fira Code Variable'] : [])];
    assert.equal(preloads.length, families.length, route || '/');
    for (const family of families) {
      const face = html
        .match(/@font-face\{[^}]+\}/g)
        ?.find(css => css.includes(family) && /unicode-range:U\+(?:\?\?|0{1,4}-0{0,2}FF)/i.test(css));
      assert.ok(face, `Missing Latin face for ${family}`);
      const url = face.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      assert.ok(url && preloads.includes(url), `Missing preload for ${family}`);
    }
  }
});
