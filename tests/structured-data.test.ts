import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeStructuredData, siteStructuredData } from '../src/lib/structured-data.ts';

test('JSON-LD preserves text without allowing script termination', () => {
  const input = { name: '</script><script>alert(1)</script>\u2028\u2029' };
  const serialized = serializeStructuredData(input);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), input);
});

test('breadcrumbs resolve public URLs and preserve visible order', () => {
  const graph = siteStructuredData('https://maxie.dev/', 'https://maxie.dev/projects/example/', [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Example' },
  ])['@graph'];
  const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList');
  assert.deepEqual(
    breadcrumbs?.itemListElement?.map(item => [item.position, item.name, item.item]),
    [
      [1, 'Home', 'https://maxie.dev/'],
      [2, 'Projects', 'https://maxie.dev/projects/'],
      [3, 'Example', 'https://maxie.dev/projects/example/'],
    ],
  );
});
