# Murmur product website

A standalone React/Vite site for Murmur, styled as a field guide (the name is a starling murmuration).

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the production site to `dist/`.

## Where downloads come from

Murmur is published as GitHub releases of the app repo,
[shubhamsWEB/murmur-app](https://github.com/shubhamsWEB/murmur-app/releases). Every release carries `Murmur.dmg`,
and the Download buttons link to `releases/latest/download/Murmur.dmg`, so they always get the newest version.
To publish one, run `./scripts/release.sh` in the app repo.

The version and size on the page come from the latest release: once when the site is built, and again in the
visitor's browser, so a new release shows up without redeploying. Set `VITE_DOWNLOAD_URL` to link somewhere else.

## Deploying

It's a static site; any static host works.

- **Vercel or Netlify:** import this repository with the build command `npm run build` and the output
  directory `dist`. No settings are needed.
- **Link previews:** `public/og.png` is the image shown when the link is shared. Previews need the site's full
  address; Vercel and Netlify supply it automatically, and elsewhere set `VITE_SITE_URL` (for example
  `https://murmur.app`).

## How it's put together

- `src/App.jsx` holds all the copy and sections.
- `src/Flock.jsx` draws the hero: starlings that gather into a phrase, letter by letter, then scatter. It respects
  `prefers-reduced-motion` and pauses off-screen.
- `src/Sonogram.jsx` draws a picture of a spoken sentence; the words are typed under it as a playhead passes.
- `src/Figures.jsx` holds the keyboard figure and the privacy range map, as SVG.
- `src/release.js` holds the download link and fetches the latest release's version and size.
- Type: Young Serif for headings and spoken words, Atkinson Hyperlegible for everything else (Google Fonts).
- Colours: ink, starling teal, beak yellow, and the brand coral for the Starling and the capsule.
- The Starling is inline SVG from the app icon's geometry (`Resources/AppIcon/appicon.svg` in the app repo).
- `public/brand/*.png` are earlier brand references; the site doesn't use them.
