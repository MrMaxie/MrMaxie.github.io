import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { gzipSync } from 'node:zlib';

const dist = new URL('../dist/', import.meta.url);
const pageBudget = 15_288;

const collectFiles = (directory: URL): URL[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });

test('keeps critical CSS consistent and bounds all inline styles per page', () => {
  assert.ok(existsSync(dist), 'dist is missing; just ci must build before tests');

  const htmlFiles = collectFiles(dist).filter(file => file.pathname.endsWith('.html'));
  const projectStyles = new Set<string>();
  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<link\b[^>]*\brel=(?:"stylesheet"|'stylesheet'|stylesheet)/);
    const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
    assert.doesNotMatch(styles.join('\n'), /\b(?:NaN|Infinity)(?:ms|s)\b/, 'built animation timings must remain valid');
    if (/<meta\b[^>]*\bhttp-equiv=(?:"refresh"|'refresh'|refresh)/.test(html)) {
      assert.equal(styles.length, 0, 'redirect pages must not load the portfolio stylesheet');
      continue;
    }
    const shared = styles.filter(style => style.includes('.site-container{'));
    assert.equal(shared.length, 1, 'each page must contain the common critical stylesheet once');
    projectStyles.add(shared[0]);
    const bytes = gzipSync(styles.join('\n'), { level: 9 }).byteLength;
    assert.ok(bytes <= pageBudget, `${file.pathname}: inline CSS is ${bytes} B gzip; budget is ${pageBudget} B`);
  }
  assert.equal(projectStyles.size, 1, 'critical CSS must remain identical across pages');
});
