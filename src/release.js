/* global __MURMUR_VERSION__, __MURMUR_DMG_MB__ */
import { useEffect, useState } from "react";

// Murmur is published as GitHub releases of the app repo. Each release carries Murmur.dmg, so this link always
// downloads the newest version. Set VITE_DOWNLOAD_URL to point somewhere else.
export const repo = "shubhamsWEB/murmur-app";
export const releasesUrl = `https://github.com/${repo}/releases`;
export const downloadUrl = import.meta.env.VITE_DOWNLOAD_URL || `${releasesUrl}/latest/download/Murmur.dmg`;

// Filled in at build time by vite.config.js (from the latest release, or the app's Info.plist and DMG).
const built = { version: __MURMUR_VERSION__, sizeMB: __MURMUR_DMG_MB__ };

// The version and size shown on the page: what the site was built with, refreshed from GitHub when the page
// opens, so a new release shows up without redeploying the site.
export function useRelease() {
  const [release, setRelease] = useState(built);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data || cancelled) return;
        const asset = data.assets?.find((a) => a.name === "Murmur.dmg") ?? data.assets?.find((a) => a.name.endsWith(".dmg"));
        setRelease({
          version: (data.tag_name || "").replace(/^v/, "") || built.version,
          sizeMB: asset ? Math.max(1, Math.round(asset.size / 1_000_000)) : built.sizeMB,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return { ...release, sizeText: release.sizeMB ? `${release.sizeMB} MB` : null };
}
