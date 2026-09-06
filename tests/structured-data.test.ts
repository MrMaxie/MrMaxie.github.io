import assert from 'node:assert/strict';
import test from 'node:test';
import { serializeStructuredData, siteStructuredData } from '../src/lib/structured-data.ts';

test('JSON-LD preserves text without allowing script termination', () => {
  const input = { name: '</script><script>alert(1)</script>\u2028\u2029' };
  const serialized = serializeStructuredData(input);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), input);
});

test('public identity links the name, aliases, profiles and website to one person', () => {
  for (const route of ['/', '/about/', '/projects/']) {
    const graph = siteStructuredData('https://maxie.dev/', `https://maxie.dev${route}`)['@graph'];
    const person = graph.find(item => item['@type'] === 'Person');
    const website = graph.find(item => item['@type'] === 'WebSite');
    assert.equal(person?.name, 'Maciej Mieńko');
    assert.equal(person?.['@id'], 'https://maxie.dev/#person');
    assert.deepEqual(person?.alternateName, ['Maxie', 'MrMaxie']);
    assert.deepEqual(person?.sameAs, [
      'https://github.com/MrMaxie',
      'https://www.linkedin.com/in/maciej-mie%C5%84ko-b0200b190/',
    ]);
    assert.equal(website?.url, 'https://maxie.dev/');
    assert.equal(website?.alternateName, 'maxie.dev');
    assert.deepEqual(website?.author, { '@id': person?.['@id'] });
    const profiles = graph.filter(item => item['@type'] === 'ProfilePage');
    assert.equal(profiles.length, route === '/about/' ? 1 : 0);
    if (route === '/about/') {
      assert.equal(profiles[0].url, person?.url);
      assert.deepEqual(profiles[0].mainEntity, { '@id': person?.['@id'] });
      assert.deepEqual(profiles[0].isPartOf, { '@id': website?.['@id'] });
    }
  }
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
