import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import playformCompress from '@playform/compress';
import purgecss from 'astro-purgecss';

export default defineConfig({
    site: 'https://maxie.dev/',
    integrations: [
        mdx(),
        sitemap({
            filter: url => {
                if (
                    url.match(/\/blog\/tag\/[^/]+\/1\/?$/) ||
                    url.match(/\/blog\/page\/1\/?$/)
                ) {
                    return false;
                }

                return true;
            },
        }),
        playformCompress(),
        purgecss(),
    ],
    output: 'static',
    build: {
        assets: 'static',
    },
    prefetch: {
        prefetchAll: true,
    },
});