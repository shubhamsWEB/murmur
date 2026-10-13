import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The version and size shown on the site come from the newest GitHub release of the app, so the page never drifts
// from what the Download button gets. Without network access, they come from the app's source next door.
const root = (path) => fileURLToPath(new URL(path, import.meta.url));

function appVersion() {
  try {
    const plist = readFileSync(root("../Resources/Info.plist"), "utf8");
    return plist.match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/)?.[1] ?? "0.1.0";
  } catch {
    return "0.1.0";
  }
}

function dmgSizeMB(version) {
  for (const path of [`../dist/Murmur-${version}.dmg`, `public/downloads/Murmur-${version}.dmg`]) {
    const file = root(path);
    if (existsSync(file)) return Math.max(1, Math.round(statSync(file).size / 1_000_000));
  }
  return null;
}

// The newest GitHub release, so the built page matches what the Download button gets.
async function latestRelease() {
  try {
    const response = await fetch("https://api.github.com/repos/shubhamsWEB/murmur-app/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const asset = data.assets?.find((a) => a.name === "Murmur.dmg") ?? data.assets?.find((a) => a.name.endsWith(".dmg"));
    return {
      version: String(data.tag_name || "").replace(/^v/, ""),
      sizeMB: asset ? Math.max(1, Math.round(asset.size / 1_000_000)) : null,
    };
  } catch {
    return null;
  }
}

// Link previews need an absolute address for the image. Set VITE_SITE_URL, or let Vercel / Netlify supply theirs.
const siteUrl = (process.env.VITE_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || process.env.URL
  || "").replace(/\/$/, "");

const shareTags = {
  name: "murmur-share-tags",
  transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", siteUrl),
};

export default defineConfig(async () => {
  // Newest release on GitHub first; otherwise, next to the app's source, its Info.plist and built DMG.
  const release = await latestRelease();
  const version = release?.version || appVersion();
  const sizeMB = release?.sizeMB ?? dmgSizeMB(version);
  return {
    // GitHub Pages serves the site from /<repo>/ (here /murmur/); the Pages workflow sets BASE_PATH.
    base: process.env.BASE_PATH || "/",
    plugins: [react(), shareTags],
    define: {
      __MURMUR_VERSION__: JSON.stringify(version),
      __MURMUR_DMG_MB__: JSON.stringify(sizeMB),
    },
  };
});
