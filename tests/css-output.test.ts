import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { gzipSync } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url);
const uniqueBudget = 15_288;

const collectFiles = (directory: URL): URL[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

const stylesheetHrefs = (html: string) =>
  [...html.matchAll(/<link\b[^>]*\brel=(?:"stylesheet"|'stylesheet'|stylesheet)[^>]*>/g)]
    .map(match =>
      match[0]
        .match(/\bhref=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/)
        ?.slice(1)
        .find(Boolean),
    )
    .filter((href): href is string => Boolean(href?.endsWith('.css')));

test('keeps built project CSS shared and bounded', () => {
  assert.ok(existsSync(dist), 'dist is missing; just ci must build before tests');

  const htmlFiles = collectFiles(dist).filter(file => file.pathname.endsWith('.html'));
  const routeStyles = htmlFiles.map(file => stylesheetHrefs(readFileSync(file, 'utf8')));
  const referencedStyles = [...new Set(routeStyles.flat())];
  const gzipBytes = new Map(
    referencedStyles.map(href => [href, gzipSync(readFileSync(new URL(`.${href}`, dist)), { level: 9 }).byteLength]),
  );
  const uniqueBytes = [...gzipBytes.values()].reduce((total, bytes) => total + bytes, 0);

  assert.equal(referencedStyles.length, 1, `expected one shared stylesheet, found ${referencedStyles.length}`);
  assert.ok(
    routeStyles.every(styles => styles.length === 1 && styles[0] === referencedStyles[0]),
    'every static HTML route must reference only the shared project stylesheet',
  );
  assert.ok(uniqueBytes <= uniqueBudget, `unique CSS is ${uniqueBytes} B gzip; budget is ${uniqueBudget} B`);
});
