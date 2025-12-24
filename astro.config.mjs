import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.beyondwritingcode.com',
  integrations: [react(), sitemap()],
  redirects: {
    '/newsletter': '/posts',
    '/legal/terms': '/terms',
    '/legal/privacy': '/privacy',
    '/feed': '/feed.xml',
  },
  build: {
    format: 'file',
  },
});
