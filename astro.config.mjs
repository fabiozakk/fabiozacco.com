// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fabiozacco.com',
  integrations: [sitemap()],
  image: {
    // Allow remote YouTube thumbnails to be used with astro:assets if ever needed.
    domains: ['i.ytimg.com'],
  },
});
