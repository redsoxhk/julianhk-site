# julianhk.com

Personal website for Julian Helguero-Kelley. Built with [Astro](https://astro.build) + MDX and
compiled to plain static HTML — no JavaScript is shipped to the browser. Design tokens live in
CSS custom properties, so re-theming is a one-file change.

## Structure

Source lives in **`src/`**; **`public/`** holds files that ship as-is. `npm run build` combines
them into **`dist/`**, and `dist/` is the only thing deployed.

| Path | What it is |
|------|-----------|
| `src/pages/` | One file per page. `index.astro` → `/`, `work.astro` → `/work/`. |
| `src/pages/writing/[...slug].astro` | Renders each post; builds one static page per post. |
| `src/content/writing/` | The posts themselves (`.md` / `.mdx`). Filename becomes the URL. |
| `src/content.config.ts` | Required frontmatter for a post. Build fails if a post doesn't match. |
| `src/layouts/` | Page shells — `BaseLayout` (head/nav/footer), `PostLayout` (a single post). |
| `src/components/` | Reusable pieces: `HeatMeter`, `HeatList`, `Spectrum`, `Callout`. |
| `src/styles/global.css` | All styling. Design tokens at the top under `:root`. |
| `src/assets/` | Images referenced from posts (Astro optimizes and resizes these). |
| `public/assets/` | Self-hosted fonts and the profile photo — copied to `dist/` untouched. |
| `public/_headers` | Cloudflare caching + security headers. |
| `wrangler.jsonc` | Cloudflare config — builds, then deploys **only** `dist/`. |
| `src-assets/profile-original.jpg` | Full-resolution source photo (not deployed). |
| `optimize-photo.mjs` | Regenerates the optimized photo into `public/assets/`. |
| `build-preview.mjs` | Bundles a built page into one shareable, self-contained HTML file. |

## Local development

```bash
npm install
```

Then start the dev server — it reloads as you edit:

```bash
npm run dev
```

Other commands:

| Command | What it does |
|---------|--------------|
| `npm run build` | Compiles the site into `dist/`. |
| `npm run preview` | Serves `dist/` exactly as Cloudflare will. |
| `npm run optimize:photo` | Regenerates the optimized profile photo. |
| `npm run build:preview-artifact` | Builds, then writes a single self-contained `preview.html`. |

## Writing a post

Add a `.md` or `.mdx` file to `src/content/writing/`. The filename becomes the URL —
`first-batch.mdx` publishes at `/writing/first-batch/`. Start with this block at the top:

```yaml
---
title: 'Your title'
description: 'One sentence. Shows on the writing index and in link previews.'
date: 2026-08-01
draft: true
---
```

`draft: true` keeps a post off the site entirely. Flip it to `false` to publish.

Use `.mdx` (rather than `.md`) when you want to drop components into the post — see
`src/content/writing/example-post.mdx` for a working demo of components, images, and code.

## Deploy

Hosted on **Cloudflare Workers** (project `julianhk-site`), auto-deploying from `main` on merge.
Custom domain: **julianhk.com**.

`wrangler.jsonc` runs `npm run build` and then uploads **only `dist/`**. That scoping is
deliberate and load-bearing: without it, wrangler tries to upload the whole repo including
`node_modules`, and workerd (122 MiB) exceeds Cloudflare's 25 MiB-per-file limit. Keep the
deployed folder pointed at build output only.

Note: Cloudflare only builds the production branch. Deploy checks on PR branches finish
instantly and are **not** a real signal — verify with `npm run build` locally instead.

## Workflow

Changes go through pull requests — branch → commit → PR → merge.
