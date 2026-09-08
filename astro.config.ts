import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';

const npmFontProvider = fontProviders.npm({ remote: false });

export default defineConfig({
  site: 'https://maxie.dev/',
  integrations: [
    icon({ iconDir: 'src/assets/icons' }),
    sitemap({ filter: page => !new URL(page).pathname.startsWith('/projects/tag/') }),
    playformCompress({ CSS: false }),
  ],
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  fonts: [
    {
      name: 'Outfit Variable',
      cssVariable: '--font-outfit',
      provider: npmFontProvider,
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2'],
      optimizedFallbacks: false,
      fallbacks: ['Outfit Fallback', 'sans-serif'],
      options: {
        package: '@fontsource-variable/outfit',
        file: 'index.css',
      },
    },
    {
      name: 'Karla Variable',
      cssVariable: '--font-karla',
      provider: npmFontProvider,
      weights: ['200 800'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2'],
      optimizedFallbacks: false,
      fallbacks: ['Karla Fallback', 'sans-serif'],
      options: {
        package: '@fontsource-variable/karla',
        file: 'index.css',
      },
    },
    {
      name: 'Fira Code Variable',
      cssVariable: '--font-fira-code',
      provider: npmFontProvider,
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2'],
      fallbacks: ['monospace'],
      options: {
        package: '@fontsource-variable/fira-code',
        file: 'index.css',
      },
    },
  ],
  build: {
    assets: 'static',
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
