import assert from 'node:assert/strict';
import test from 'node:test';
import { fontCharacters } from '../scripts/font-subsets.ts';

test('font subsets retain visible characters, entities, escapes and decomposed accents', () => {
  const text = fontCharacters(['Mieńko &eacute; &#169;', String.raw`content: "\2022"; const label = "\u03bb";`]);
  for (const character of 'Mieńkoé©•λ\u0301\u00a0\ufffd') assert.ok(text.includes(character), character);
  for (let code = 32; code <= 126; code++) assert.ok(text.includes(String.fromCharCode(code)));
  assert.equal(text, fontCharacters([String.raw`content: "\2022"; const label = "\u03bb";`, 'Mieńko &eacute; &#169;']));
});
