import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { __unstable__loadDesignSystem } from 'tailwindcss';

type CandidateWithPosition = {
  candidate: string;
  position: number;
};

type ScannerInstance = {
  files: string[];
  scan(): string[];
  getCandidatesWithPositions(input: { file: string; content: string; extension: string }): CandidateWithPosition[];
};

type ScannerConstructor = new (options: {
  sources: Array<{ base: string; pattern: string; negated: boolean }>;
}) => ScannerInstance;

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(projectRoot, 'src');
const stylesRoot = resolve(sourceRoot, 'styles');
const require = createRequire(import.meta.url);
const viteEntry = require.resolve('@tailwindcss/vite');
const oxideEntry = require.resolve('@tailwindcss/oxide', { paths: [dirname(viteEntry)] });
const { Scanner } = require(oxideEntry) as { Scanner: ScannerConstructor };
const write = process.argv.includes('--write');

const designSystem = await __unstable__loadDesignSystem(await readFile(resolve(stylesRoot, 'global.css'), 'utf8'), {
  base: stylesRoot,
  loadStylesheet: async (id, base) => {
    const path = id === 'tailwindcss' ? require.resolve('tailwindcss/index.css') : resolve(base, id);

    return {
      path,
      content: await readFile(path, 'utf8'),
      base: dirname(path),
    };
  },
});

const scanner = new Scanner({
  sources: [
    { base: resolve(sourceRoot, 'components'), pattern: '**/*.{astro,js,mjs,ts,tsx}', negated: false },
    { base: resolve(sourceRoot, 'layouts'), pattern: '**/*.{astro,js,mjs,ts,tsx}', negated: false },
    { base: resolve(sourceRoot, 'pages'), pattern: '**/*.{astro,js,mjs,ts,tsx}', negated: false },
  ],
});

scanner.scan();

let suggestionCount = 0;

for (const file of scanner.files) {
  const source = await readFile(file, 'utf8');
  const suggestions = scanner
    .getCandidatesWithPositions({
      file,
      content: source,
      extension: extname(file).slice(1),
    })
    .flatMap(({ candidate, position }) => {
      const [canonical] = designSystem.canonicalizeCandidates([candidate], { rem: 16 });

      if (!canonical || canonical === candidate) {
        return [];
      }

      const characterPosition = position;
      const line = source.slice(0, characterPosition).split('\n').length;

      return [{ candidate, canonical, characterPosition, line }];
    });

  if (suggestions.length === 0) {
    continue;
  }

  suggestionCount += suggestions.length;

  for (const { candidate, canonical, line } of suggestions) {
    console.log(`${relative(projectRoot, file)}:${line} ${candidate} -> ${canonical}`);
  }

  if (write) {
    const updated = suggestions
      .toSorted((left, right) => right.characterPosition - left.characterPosition)
      .reduce((content, { candidate, canonical, characterPosition }) => {
        if (content.slice(characterPosition, characterPosition + candidate.length) !== candidate) {
          throw new Error(`Tailwind candidate position no longer matches in ${relative(projectRoot, file)}`);
        }

        return `${content.slice(0, characterPosition)}${canonical}${content.slice(characterPosition + candidate.length)}`;
      }, source);

    await writeFile(file, updated);
  }
}

if (suggestionCount === 0) {
  console.log('Tailwind classes are canonical.');
} else if (write) {
  console.log(`Canonicalized ${suggestionCount} Tailwind class${suggestionCount === 1 ? '' : 'es'}.`);
} else {
  console.error(
    `Found ${suggestionCount} non-canonical Tailwind class${suggestionCount === 1 ? '' : 'es'}. Run "just format" to fix them.`,
  );
  process.exitCode = 1;
}
