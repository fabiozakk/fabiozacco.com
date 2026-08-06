# Fabio Zacco — website

One-page site built with [Astro](https://astro.build), styled as a dark, cinematic
showcase, with content editable either as plain files or through a visual CMS panel
at `/admin`.

## Project structure

```
src/
├─ content.config.ts        # Content collection schemas (validated at build time)
├─ content/
│  ├─ settings/
│  │  ├─ site.yml           # Name, tagline, email, social links, SEO description
│  │  ├─ hero.yml           # Headline, subhead, video OR slideshow images
│  │  └─ bio.md             # Short bio text + portrait
│  ├─ playing/*.md          # One file per "Playing" video
│  └─ scoring/*.md          # One file per "Scoring" video
├─ assets/                  # Images referenced by the content files above
├─ components/              # Page sections (Hero, Bio, VideoCard, Contact, …)
├─ layouts/Base.astro       # <head>, SEO, fonts
├─ pages/index.astro        # Assembles the one page
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

Every piece of content is a plain Markdown or YAML file under `src/content/`:

- **Site info & social links** → `src/content/settings/site.yml`
- **Hero** → `src/content/settings/hero.yml`. Leave `video` empty to show the image
  slideshow (`images:` list); fill it in with a direct `.mp4` URL to use a video
  background instead (not a YouTube link).
- **Bio** → `src/content/settings/bio.md` (frontmatter has the portrait image, the
  body text is the bio itself).
- **Playing / Scoring videos** → add a new `.md` file in `src/content/playing/` or
  `src/content/scoring/`. Copy an existing one as a template. The `youtube` field
  accepts a full YouTube URL, a `youtu.be` link, or just the 11-character video ID.
  `order` controls sort position, `featured: true` makes a card span the full width.

Images live in `src/assets/` (not `public/`) so Astro can optimize them
automatically (AVIF/WebP, responsive sizes, lazy loading).

### Option B — the CMS panel

Go to `/admin` on the deployed site (or `http://localhost:4321/admin` locally) for a
visual editor — no code required. It's [Sveltia CMS](https://sveltiacms.app), a small
open-source panel that edits the same files described above and commits the changes
to GitHub. Publishing a change triggers a new deploy automatically.

**Before this works you need to:**

1. Push this project to a GitHub repository.
2. Edit `public/admin/config.yml` and replace `OWNER/REPO` in the `backend.repo` line
   with your actual `github-username/repo-name`.
3. Deploy the site on **Netlify** (see below) and link it to that same repo — Netlify's
   built-in OAuth then lets the CMS log in with "Sign in with GitHub", no extra setup.

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

## Placeholder content

The `playing` and `scoring` entries and the hero/bio images are placeholders (marked
`PLACEHOLDER` in the title, using open-licensed sample videos and generated abstract
art) so the page has something real to render. Replace them with real photos, bio
copy, and video links — either by editing the files directly or through `/admin`.

## Stack

Astro 7 · content collections (Markdown/YAML) · Sveltia CMS · Motion + Lenis for
animation/smooth scroll · `lite-youtube-embed` for lightweight YouTube embeds ·
Fontsource (self-hosted Inter Variable + Instrument Serif) · Netlify hosting.


a
