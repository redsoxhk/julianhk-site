# julianhk.com

Personal website for Julian Helguero-Kelley. Plain static HTML/CSS — no framework, no build step
to view. Structured with CSS custom properties so it's easy to re-theme or grow later.

## Structure

Everything that ships lives in **`public/`**; the repo root holds source and tooling only.

| Path | What it is |
|------|-----------|
| `public/index.html` | The page (single page, semantic HTML). |
| `public/styles.css` | All styling. Design tokens live at the top under `:root`. |
| `public/assets/` | Optimized photo (~50 KB) and self-hosted fonts. |
| `public/_headers` | Cloudflare caching + security headers. |
| `wrangler.jsonc` | Cloudflare config — deploys **only** `public/`. |
| `src-assets/profile-original.jpg` | Full-resolution source photo (not deployed). |
| `optimize-photo.mjs` | Regenerates the optimized photo into `public/assets/`. |

## Local preview

No build needed — open `index.html` in a browser, or run any static server:

```bash
npx serve public
```

## Regenerating the optimized photo

Only needed if the source photo changes. Requires a one-time `npm install` (pulls in `sharp`):

```bash
npm install
npm run optimize:photo
```

## Deploy

Hosted as a static site (target: Cloudflare Pages), auto-deploying from `main` on merge.
Custom domain: **julianhk.com**. See deploy notes in the repo once wired up.

## Workflow

Changes go through pull requests — branch → commit → PR → merge.
