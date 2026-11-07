# Murmur product website

A standalone React/Vite site for Murmur, styled as a field guide (the name is a starling murmuration).

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the production site to `dist/`, with every page already rendered (see below).

## Where downloads come from

Murmur is published as GitHub releases of the app repo,
[shubhamsWEB/murmur-app](https://github.com/shubhamsWEB/murmur-app/releases). Every release carries `Murmur.dmg`,
and the Download buttons link to `releases/latest/download/Murmur.dmg`, so they always get the newest version.
To publish one, run `./scripts/release.sh` in the app repo.

The version and size on the page come from the latest release: once when the site is built, and again in the
visitor's browser, so a new release shows up without redeploying. Set `VITE_DOWNLOAD_URL` to link somewhere else.

## The launch film

The film plays in [Video.js](https://videojs.org) (`@videojs/react`, `src/FilmPlayer.jsx`). The page shows only the
poster and a button until then. The player loads in the background once the page has loaded and the film is near
the screen, and takes over on the click.

- **Streamed** (HLS, `public/media/film/master.m3u8`): 1080p, 720p, 480p and 360p, chosen for the connection and the
  player's size, or picked in the settings menu. Where streaming isn't possible, or the stream fails, the MP4 in
  `public/media/murmur-launch.mp4` plays from the same point.
- **Chapters** on the timeline (`public/media/film/chapters.vtt`, written by hand), and a preview frame while
  scrubbing (`storyboard.jpg` and `storyboard.vtt`).
- The film's captions are part of the picture, so the player has none of its own.

For a new film, put its master MP4 through `scripts/film.sh` (it needs ffmpeg). Then write its chapters, and replace
`murmur-launch.mp4` and `murmur-launch.jpg`.

## Search engines and AI assistants

Most crawlers, and almost every AI assistant's, read a page without running its JavaScript. So `npm run build` renders
every page to finished HTML: it builds the site, builds `src/entry-server.jsx` for Node, and runs
`scripts/prerender.mjs`, which writes each page's `index.html` with its own title, description, canonical address,
link previews and structured data (schema.org JSON-LD, from `src/seo.js`). In the browser, React takes over the HTML
that's there. `npm run dev` still renders in the browser, without any of that.

- **Pages**: the home page, and the guides in `src/guides.js`, one page each for what people search for: a Wispr Flow
  alternative, voice typing on Mac, on Windows, Hinglish voice typing, offline speech to text. Each is listed in the
  sitemap and linked from every page's footer. To add one, add it to `guides`; it gets its address, head and sitemap
  entry from there. The comparison's prices are dated (`comparedOn`): check them again before changing them.
- **Also written**: `sitemap.xml`, `robots.txt` (every crawler welcome, AI assistants' included), `llms.txt` (a plain
  summary for AI assistants and coding agents) and `404.html` (not indexed).
- **IndexNow**: after each deploy, `scripts/indexnow.mjs` asks Bing and the other IndexNow engines to crawl the
  pages again. The key is the file `public/<key>.txt`; it's public by design.
- The site's address comes from `VITE_SITE_URL` (the Pages workflow sets it), otherwise https://usemurmur.live.

## Deploying

**GitHub Pages** (live at https://usemurmur.live): every push to `main` builds and publishes
the site through `.github/workflows/pages.yml`. One-time setup: repo **Settings → Pages → Build and deployment →
Source: GitHub Actions**. The workflow sets the base path and the full address for link previews itself, and still
works if you add a custom domain.

Any other static host works too (Vercel, Netlify): build command `npm run build`, output directory `dist`.
Elsewhere, set `VITE_SITE_URL` to the site's address.

## How it's put together

One theme, an explainer collage: newsprint paper, halftone cut-outs, torn scraps with tape, a yellow highlighter and
pen marks that draw themselves in as you scroll.

- `src/App.jsx` lays out the home page's sections; `src/content.js` holds their words. `src/Site.jsx` picks the page
  for an address; `src/Parts.jsx` holds what every page shares (the bar, the footer, the download buttons, headings).
- `src/Collage.jsx` holds the collage pieces: `Cut` (a cut-out from `public/collage`), `Mark` (a pen mark), `Note`
  (handwriting in the margin) and `Hi` (the highlighter).
- `public/collage/*.webp` are halftone cut-outs made from photos with `scripts/halftone.py`
  (`python3 scripts/halftone.py photo.png public/collage/name.webp 1d1a17 6`).
- `src/motion.js` holds all scroll motion: smooth scrolling (Lenis), `data-reveal` for things that are stuck onto the
  page once, and `data-scroll`, which gives an element `--p` (its progress through the screen) for CSS to animate
  with. With reduced motion nothing moves.
- `src/Flock.jsx` draws the hero: starlings that gather into a phrase, letter by letter, then scatter.
- `src/Scenes.jsx` holds the small live scenes and the Mac/Windows shortcuts.
- `src/releases.js` is the "Recent releases" list. Add a line when you publish a release.
- `src/release.js` holds the download links and fetches the latest release's version and size.
- Type: Montagu Slab for headings and for what people say (light), Hedvig Letters Sans to read, Kalam for notes in
  the margin (Google Fonts).
- Colours: paper `#f1ebdd`, ink `#1d1a17`, highlighter `#ffe14d`, pen `#2b55c7`, and the brand coral `#ff6f61`.
