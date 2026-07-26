// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Output goes to dist/ and NOTHING else — Cloudflare uploads exactly this folder
// (see wrangler.jsonc). Keeping the deployed folder separate from the repo root
// is what stops wrangler from ever trying to upload node_modules again.
export default defineConfig({
  site: 'https://julianhk.com',
  outDir: './dist',
  publicDir: './public', // fonts, photo and _headers pass through untouched
  integrations: [mdx()],
});
