import fs from 'fs';
import path from 'path';

// Builds a single self-contained preview.html (CSS + fonts + images inlined)
// from the BUILT site in dist/. Used only to publish a shareable preview file;
// it is not part of the deploy. Run `npm run build:preview-artifact`.
//
// Pass a page path to preview something other than the home page, e.g.
//   node build-preview.mjs writing/example-post
const DIST = 'dist';
const page = (process.argv[2] || '').replace(/^\/|\/$/g, '');
const entry = path.posix.join(DIST, page, 'index.html');

if (!fs.existsSync(entry)) {
  console.error(`No built page at ${entry} — run "npm run build" first.`);
  process.exit(1);
}

let html = fs.readFileSync(entry, 'utf8');

const asDataUri = (urlPath, mime) => {
  const file = path.join(DIST, urlPath.replace(/^\//, ''));
  if (!fs.existsSync(file)) return null;
  return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
};

const mimeFor = (file) =>
  ({ '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png' })[
    path.extname(file).toLowerCase()
  ] ?? 'application/octet-stream';

// 1. Pull in every stylesheet Astro linked, inlining the fonts it references.
let css = '';
html = html.replace(/<link rel="stylesheet" href="([^"]+)"\s*\/?>/g, (_, href) => {
  const file = path.join(DIST, href.replace(/^\//, ''));
  if (!fs.existsSync(file)) return '';
  css += fs.readFileSync(file, 'utf8');
  return '';
});
css = css.replace(/url\(["']?(\/assets\/fonts\/[^"')]+)["']?\)/g, (match, p) => {
  const uri = asDataUri(p, 'font/woff2');
  return uri ? `url('${uri}')` : match;
});

// 2. Inline images. srcset would balloon the file, so keep only the fallback src.
html = html
  .replace(/\ssrcset="[^"]*"/g, '')
  .replace(/\ssizes="[^"]*"/g, '')
  .replace(/src="(\/(?:assets|_astro)\/[^"]+)"/g, (match, p) => {
    const uri = asDataUri(p, mimeFor(p));
    return uri ? `src="${uri}"` : match;
  });

// 3. Drop preload hints (their targets are now inlined) and emit body only.
html = html.replace(/<link rel="preload"[^>]*>/g, '');
const bodyInner = html.split('<body>')[1].split('</body>')[0];

fs.writeFileSync('preview.html', `<style>\n${css}\n</style>\n${bodyInner}`);
console.log('preview.html', fs.statSync('preview.html').size, 'bytes');
