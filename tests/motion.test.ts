import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('keeps page effects on the shared lifecycle without a second animation runtime', async () => {
  const scriptDirectory = new URL('src/scripts/', root);
  const scriptFiles = (await readdir(scriptDirectory)).filter(file => file.endsWith('.ts'));
  const [packageSource, layout, siteMotion, lifecycle, ...scripts] = await Promise.all([
    readFile(new URL('package.json', root), 'utf8'),
    readFile(new URL('src/layouts/Base.astro', root), 'utf8'),
    readFile(new URL('src/scripts/site-motion.ts', root), 'utf8'),
    readFile(new URL('src/scripts/page-lifecycle.ts', root), 'utf8'),
    ...scriptFiles.map(file => readFile(new URL(file, scriptDirectory), 'utf8')),
  ]);
  const packageJson = JSON.parse(packageSource);
  const scriptSource = scripts.join('\n');

  assert.equal(packageJson.dependencies.motion, undefined);
  assert.equal(packageJson.dependencies.gsap, undefined);
  assert.match(layout, /import '~\/scripts\/site-motion'/);
  assert.match(siteMotion, /import '.\/reveal-motion'/);
  assert.match(siteMotion, /import '.\/interactive-surfaces'/);
  assert.match(siteMotion, /import '.\/site-nav'/);
  assert.match(siteMotion, /import '.\/contact-arrival'/);
  assert.doesNotMatch(scriptSource, /\bgsap\b|ScrollTrigger|from ['"]motion/);
  assert.equal(lifecycle.match(/prefers-reduced-motion/g)?.length, 1);
});
