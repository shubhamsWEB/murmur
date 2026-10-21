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

// Murmur for Windows (beta): dictation and file search. Published as releases tagged windows-…, kept apart from the
// Mac's (they're never "latest", so the Mac link above is untouched). This link is the first beta's; the page swaps in
// the newest beta's when it opens.
export const windowsInstaller = "Murmur-Windows-Setup.exe";
export const windowsDownloadUrl = import.meta.env.VITE_WINDOWS_DOWNLOAD_URL
  || `${releasesUrl}/download/windows-beta-1/${windowsInstaller}`;

export function useWindowsRelease() {
  const [release, setRelease] = useState({ url: windowsDownloadUrl, page: `${releasesUrl}/tag/windows-beta-1`, sizeMB: null });
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}/releases?per_page=30`, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!Array.isArray(data) || cancelled) return;
        const newest = data.find((r) => !r.draft && String(r.tag_name).startsWith("windows-")
          && r.assets?.some((a) => a.name === windowsInstaller));
        if (!newest) return;
        const asset = newest.assets.find((a) => a.name === windowsInstaller);
        setRelease({ url: asset.browser_download_url, page: newest.html_url, sizeMB: Math.max(1, Math.round(asset.size / 1_000_000)) });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return { ...release, sizeText: release.sizeMB ? `${release.sizeMB} MB` : null };
}

// Whether the visitor is on Windows, so the main button offers the right download.
export function onWindows() {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || "";
  return /windows|win32|win64|^win/i.test(platform);
}
