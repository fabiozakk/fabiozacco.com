import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each "settings" file is edited as its own form in the CMS panel, so each
// gets its own collection (one entry, one shape) rather than being crammed
// into a single generic "settings" bucket with a loose schema.
//
// Every collection is bilingual: each pattern matches one file per locale
// folder (e.g. `en/site.yml`, `it/site.yml`), and the entry `id` carries the
// locale as its first path segment — see `src/lib/i18n.ts` for how callers
// pick the right one.

const site = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '*/site.yml' }),
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

// A raw CSS `object-position` value (e.g. "50% 100%", "center top").
// Empty/unset keeps the current default: centered.
const position = z.string().optional().default('');

const hero = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '*/hero.yml' }),
  schema: ({ image }) =>
    z.object({
      headline: z.string(),
      subhead: z.string(),
      // Leave empty to fall back to the image slideshow.
      video: z.string().optional().default(''),
      // Used as <video poster> and as the mobile / reduced-motion fallback.
      poster: image(),
      posterPosition: position,
      images: z
        .array(
          z.object({
            image: image(),
            position,
            // Optional tighter/differently-framed crop for narrow screens —
            // falls back to `image` above when not set. Useful for wide
            // group shots that lose their subject when cropped down to a
            // narrow mobile viewport; most photos won't need one.
            mobileImage: image().optional(),
            mobilePosition: position,
          }),
        )
        .default([]),
      interval: z.number().positive().default(5),
    }),
});

const bio = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '*/bio.md' }),
  schema: ({ image }) =>
    z.object({
      portrait: image(),
      portraitPosition: position,
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
    thumbnailPosition: position,
  });

const playing = defineCollection({
  loader: glob({ base: './src/content/playing', pattern: '*/*.md' }),
  schema: videoEntry,
});

const scoring = defineCollection({
  loader: glob({ base: './src/content/scoring', pattern: '*/*.md' }),
  schema: videoEntry,
});

export const collections = { site, hero, bio, playing, scoring };
