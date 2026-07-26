import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The "writing" collection: every .md / .mdx file in src/content/writing/
 * becomes a post at /writing/<filename>.
 *
 * The schema below is a checklist — if a post's frontmatter is missing a
 * field or has a typo, the build fails with a clear message instead of
 * quietly publishing a broken page.
 */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** Set to true to keep a post out of the index and off the site. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
