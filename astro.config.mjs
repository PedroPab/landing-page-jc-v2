import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jcresortes.com',
  output: 'static',
  compressHTML: true,

  integrations: [
    mdx(),
    sitemap({
      changefreq: 'monthly',
      priority: 0.8,
    }),
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
