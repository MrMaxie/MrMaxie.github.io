import * as cheerio from 'cheerio';
import { createRequire } from 'node:module';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * This script allows to prepare the icons for the app.
 * It will generate the icons in the correct format for astro, as components.
 */
const icons = [
    'at',
    'box-seam',
    'brand-github',
    'brand-linkedin',
    'error-404',
] as const;

const fileExists = async (path: string) => {
    try {
        await stat(path);
        return true;
    } catch {
        return false;
    }
};

const ensureDir = async (path: string) => {
    try {
        await stat(path);
    } catch {
        await mkdir(path, { recursive: true });
    }
};

const capitalizeName = (name: string) => name.replaceAll(/(^|-)(.)/gi, (_, p1, p2) => p2.toUpperCase());

const require = createRequire(import.meta.url);
const currentDir = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(currentDir, '..', 'src', 'components', 'icons');

const generateAstroIcon = async (icon: string) => {
    const iconPath = join(iconsDir, `${capitalizeName(icon)}.astro`);

    if (await fileExists(iconPath)) {
        return;
    }

    const svgRealPath = require.resolve(`@tabler/icons/${icon}.svg`);
    const svg = await readFile(svgRealPath, 'utf-8');

    return writeFile(iconPath, svg, 'utf-8');
};

const main = async () => {
    await ensureDir(iconsDir);
    await Promise.all(icons.map(generateAstroIcon));
};

main();
