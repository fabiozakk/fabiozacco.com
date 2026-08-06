# Fabio Zacco — website

One-page site built with [Astro](https://astro.build), styled as a dark, cinematic
showcase, with content editable either as plain files or through a visual CMS panel
at `/admin`. Bilingual: English at `/en/`, Italian at `/it/` (`/` redirects to `/en/`).

## Project structure

```
src/
├─ content.config.ts        # Content collection schemas (validated at build time)
├─ content/                 # Every collection has one file/folder per locale:
│  │                        # <collection>/<locale>/<file>, e.g. playing/en/…
│  ├─ settings/
│  │  ├─ en/ it/            #   site.yml, hero.yml, bio.md — one set per language
│  ├─ playing/
│  │  ├─ en/ it/*.md        #   One file per "Playing" video, per language
│  └─ scoring/
│     ├─ en/ it/*.md        #   One file per "Scoring" video, per language
├─ assets/                  # Images referenced by the content files above (shared
│                            # across locales — reference the same path from both)
├─ components/
│  ├─ Home.astro            # Assembles the one page; takes a `lang` prop
│  └─ …                     # Page sections (Hero, Bio, VideoCard, Contact, …)
├─ layouts/Base.astro       # <head>, SEO, fonts, hreflang alternates
├─ lib/i18n.ts              # Locale list + UI copy dictionary (nav, labels, footer…)
├─ pages/
│  ├─ en/index.astro        # <Home lang="en" />
│  └─ it/index.astro        # <Home lang="it" />
└─ scripts/motion.ts        # Scroll reveal, parallax, custom cursor, marquee, Lenis

public/
├─ admin/                   # Sveltia CMS panel (index.html + config.yml)
└─ robots.txt, favicon, og-default.jpg
```

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:4321`. `npm run build` outputs the static site to `dist/`;
`npm run preview` serves that build locally.

## Editing content

### Option A — edit files directly

Every piece of content is a plain Markdown or YAML file under `src/content/`, split
into `en/` and `it/` subfolders — **every change needs to be made in both languages**
to keep the site in sync:

- **Site info & social links** → `src/content/settings/{en,it}/site.yml`
- **Hero** → `src/content/settings/{en,it}/hero.yml`. Leave `video` empty to show the
  image slideshow (`images:` list); fill it in with a direct `.mp4` URL to use a video
  background instead (not a YouTube link). Point both locales at the same image/video
  paths unless you specifically want different media per language.
- **Bio** → `src/content/settings/{en,it}/bio.md` (frontmatter has the portrait image,
  the body text is the bio itself).
- **Playing / Scoring videos** → add a matching `.md` file in both
  `src/content/playing/en/` + `.../it/` (or `scoring/`), with the **same filename** in
  each so the CMS pairs them as translations of one entry. Copy an existing one as a
  template. The `youtube` field accepts a full YouTube URL, a `youtu.be` link, or just
  the 11-character video ID. `order` controls sort position (keep it identical across
  languages), `featured: true` makes a card span the full width.

Images live in `src/assets/` (not `public/`) so Astro can optimize them
automatically (AVIF/WebP, responsive sizes, lazy loading). One copy is enough — both
locales can reference the same file.

### Option B — the CMS panel

Go to `/admin` on the deployed site (or `http://localhost:4321/admin` locally) for a
visual editor — no code required. It's [Sveltia CMS](https://sveltiacms.app), a small
open-source panel that edits the same files described above and commits the changes
to GitHub. Publishing a change triggers a new deploy automatically.

`public/admin/config.yml` already points at this project's repo (`backend.repo`) and
declares both locales under `i18n:` — the editor shows a language switcher on every
bilingual entry. The one thing still needed for it to work live:

1. Deploy the site on **Netlify** (see below) and link it to that same GitHub repo —
   Netlify's built-in OAuth then lets the CMS log in with "Sign in with GitHub", no
   extra setup.

**Editing without deploying anywhere first:** run `npm run dev`, open
`http://localhost:4321/admin` in **Chrome or Edge**, and choose **"Work with Local
Repository"** — pick this project's folder when prompted. The CMS then reads and
writes the files on your disk directly; commit and push normally when you're happy
with the changes.

**Not using Netlify?** GitHub's OAuth flow needs a small server-side proxy to keep the
client secret out of the browser. Deploy
[sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (one click, free, runs
on Cloudflare Workers) and set `backend.base_url` in `config.yml` to the worker's URL.
Or skip OAuth entirely and use "Sign in using Token" with a
[GitHub personal access token](https://github.com/settings/tokens) that has `repo`
access.

## Deploying

1. Create a GitHub repository and push this project to it.
2. Update `astro.config.mjs` — set `site:` to your real domain (needed for the
   sitemap and canonical URLs).
3. On [Netlify](https://app.netlify.com): **Add new site → Import an existing
   project**, pick the repo. Build command and publish directory are already set in
   `netlify.toml` (`npm run build` → `dist`), so you can just click deploy.
4. Once it's live, follow the CMS steps above to finish wiring up `/admin`.
5. Point your domain at Netlify (Netlify's docs cover custom domains + HTTPS, both
   free).

## Stack

Astro 7 · content collections (Markdown/YAML) · built-in i18n routing (English +
Italian) · Sveltia CMS · Motion + Lenis for animation/smooth scroll ·
`lite-youtube-embed` for lightweight YouTube embeds · Fontsource (self-hosted Inter
Variable + Instrument Serif) · Netlify hosting.
