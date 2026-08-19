import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
    site: 'https://maxie.dev/',
    integrations: [
        icon({ iconDir: 'src/assets/icons' }),
        mdx(),
        sitemap({
            filter: url => {
                if (url.match(/\/blog\/tag\/[^/]+\/1\/?$/) || url.match(/\/blog\/page\/1\/?$/)) {
                    return false;
                }

                return true;
            },
        }),
        playformCompress(),
    ],
    output: 'static',
    compressHTML: true,
    build: {
        assets: 'static',
    },
    prefetch: {
        prefetchAll: true,
    },
});
