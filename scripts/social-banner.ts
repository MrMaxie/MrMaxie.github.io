import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

// Keep the editable HTML outside the public site; publish only the rendered image.
const assets = {
  outfit: ['../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2', 'font/woff2'],
  outfitExtended: [
    '../node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2',
    'font/woff2',
  ],
  karla: ['../node_modules/@fontsource-variable/karla/files/karla-latin-wght-normal.woff2', 'font/woff2'],
  portrait: ['../src/assets/portrait.png', 'image/png'],
};
let html = await readFile(new URL('./social-banner.html', import.meta.url), 'utf8');
for (const [name, [path, mime]] of Object.entries(assets)) {
  const data = await readFile(new URL(path, import.meta.url));
  html = html.replaceAll(`{{${name}}}`, `data:${mime};base64,${data.toString('base64')}`);
}
assert(!html.includes('{{'), 'Every template asset must be resolved');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
  });
  assert(await page.evaluate(() => document.fonts.check('500 76px Outfit', 'Maciej Mieńko')));
  const png = await sharp(await page.screenshot())
    .png({ compressionLevel: 9 })
    .toBuffer();
  const metadata = await sharp(png).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  await writeFile(new URL('../public/og-banner.png', import.meta.url), png);
  console.log(`Generated public/og-banner.png: 1200 x 630, ${Math.round(png.length / 1024)} KiB`);
} finally {
  await browser.close();
}
