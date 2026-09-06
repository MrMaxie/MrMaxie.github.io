import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import fontSubsets from './scripts/font-subsets';
export default defineConfig({
  site: 'https://maxie.dev/',
  integrations: [fontSubsets(), icon({ iconDir: 'src/assets/icons' }), sitemap(), playformCompress({ CSS: false })],
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  markdown: { processor: satteri({ features: { smartPunctuation: false } }) },
  build: {
    assets: 'static',
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: file => (file.endsWith('.woff2') ? false : undefined) },
  },
});
