import fs from 'fs';
let html = fs.readFileSync('index.html','utf8');
let css  = fs.readFileSync('styles.css','utf8');
// inline self-hosted fonts as data URIs
css = css.replace(/url\('(assets\/fonts\/[^']+\.woff2)'\)/g, (_, p) => {
  const b64 = fs.readFileSync(p).toString('base64');
  return `url('data:font/woff2;base64,${b64}')`;
});
// inline profile photo
const jpg = fs.readFileSync('assets/profile.jpg').toString('base64');
const bodyInner = html.split('<body>')[1].split('</body>')[0]
  .replace('src="assets/profile.jpg"', `src="data:image/jpeg;base64,${jpg}"`)
  // drop the year <script> (artifact CSP-safe; hardcode current year)
  .replace(/<script>[\s\S]*<\/script>/, '')
  .replace('<span id="year">2026</span>', '2026');
fs.writeFileSync('preview.html', `<style>\n${css}\n</style>\n${bodyInner}`);
console.log('preview.html', fs.statSync('preview.html').size, 'bytes');
