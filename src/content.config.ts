import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each "settings" file is edited as its own form in the CMS panel, so each
// gets its own collection (one entry, one shape) rather than being crammed
// into a single generic "settings" bucket with a loose schema.

const site = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'site.yml' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    seoDescription: z.string(),
    email: z.string().email(),
    location: z.string().optional(),
    social: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        }),
      )
      .default([]),
  }),
});

const hero = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'hero.yml' }),
  schema: ({ image }) =>
    z.object({
      headline: z.string(),
      subhead: z.string(),
      // Leave empty to fall back to the image slideshow.
      video: z.string().optional().default(''),
      // Used as <video poster> and as the mobile / reduced-motion fallback.
      poster: image(),
      images: z.array(image()).default([]),
      interval: z.number().positive().default(5),
    }),
});

const bio = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: 'bio.md' }),
  schema: ({ image }) =>
    z.object({
      portrait: image(),
    }),
});

const videoEntry = ({ image }: { image: () => z.ZodType<ImageMetadata> }) =>
  z.object({
    title: z.string(),
    // Any common YouTube URL shape or a bare 11-char ID — see src/lib/youtube.ts.
    youtube: z.string(),
    role: z.string().optional(),
    year: z.number().int().optional(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    // Optional override; otherwise the YouTube thumbnail is used.
    thumbnail: image().optional(),
  });

const playing = defineCollection({
  loader: glob({ base: './src/content/playing', pattern: '*.md' }),
  schema: videoEntry,
});

const scoring = defineCollection({
  loader: glob({ base: './src/content/scoring', pattern: '*.md' }),
  schema: videoEntry,
});

export const collections = { site, hero, bio, playing, scoring };
