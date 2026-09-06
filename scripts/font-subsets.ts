import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { decodeHTML } from 'entities';
import subsetFont from 'subset-font';

const families = ['outfit', 'karla', 'fira-code'];
const require = createRequire(import.meta.url);

export function fontCharacters(sources: string[]): string {
  const text = decodeHTML(sources.join('\n'))
    .replace(/\\u\{([\da-f]+)\}|\\u([\da-f]{4})/gi, (_, braced, fixed) =>
      String.fromCodePoint(Number.parseInt(braced ?? fixed, 16)),
    )
    .replace(/\\([\da-f]{1,6})(?:\s|(?=[^\da-f]|$))/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
  const ascii = Array.from({ length: 95 }, (_, index) => String.fromCharCode(index + 32)).join('');
  return [...new Set(`${ascii}\u00a0\ufffd${text}${text.normalize('NFD')}`)].sort().join('');
}

export default function fontSubsets(): AstroIntegration {
  return {
    name: 'portfolio-font-subsets',
    hooks: {
      'astro:config:setup': async ({ command, config, updateConfig }) => {
        // Development keeps complete fonts so newly typed content is immediately available.
        if (command !== 'build') return;
        const source = fileURLToPath(config.srcDir);
        const files = (await readdir(source, { recursive: true })).filter(file => /\.(astro|css|md|ts)$/.test(file));
        const text = fontCharacters(await Promise.all(files.map(file => readFile(join(source, file), 'utf8'))));
        const revision = createHash('sha256').update(text).digest('hex').slice(0, 12);
        const cache = fileURLToPath(new URL(`font-subsets/${revision}/`, config.cacheDir));
        const aliases: Array<{ find: RegExp; replacement: string }> = [];
        for (const family of families) {
          const entry = require.resolve(`@fontsource-variable/${family}/index.css`);
          const css = await readFile(entry, 'utf8');
          const directory = join(cache, family);
          await mkdir(join(directory, 'files'), { recursive: true });
          for (const [, path] of css.matchAll(/url\(\.\/(files\/[^)]+\.woff2)\)/g)) {
            const original = await readFile(join(dirname(entry), path));
            const subset = await subsetFont(original, text, {
              targetFormat: 'woff2',
              preserveNameIds: [0, 7, 8, 9, 13, 14],
            });
            await writeFile(join(directory, path), subset);
          }
          await writeFile(join(directory, 'index.css'), css);
          aliases.push(
            { find: new RegExp(`^@fontsource-variable/${family}$`), replacement: join(directory, 'index.css') },
            { find: new RegExp(`^@fontsource-variable/${family}/files/`), replacement: `${join(directory, 'files')}/` },
          );
        }
        updateConfig({ vite: { resolve: { alias: aliases } } });
      },
      'astro:build:done': async ({ dir }) => {
        const directory = fileURLToPath(new URL('static/font-licenses/', dir));
        await mkdir(directory, { recursive: true });
        for (const family of families) {
          await writeFile(
            join(directory, `${family}.txt`),
            await readFile(require.resolve(`@fontsource-variable/${family}/LICENSE`)),
          );
        }
      },
    },
  };
}
