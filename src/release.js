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

// Murmur for Windows: Murmur-Windows-Setup.exe in the newest release, which carries both apps from 1.4.0 on. Until a
// release has it, the newest Windows beta's (releases tagged windows-…, never "latest", so the Mac link above is
// untouched). The page looks when it opens; this link is the fallback.
export const windowsInstaller = "Murmur-Windows-Setup.exe";
export const windowsDownloadUrl = import.meta.env.VITE_WINDOWS_DOWNLOAD_URL
  || `${releasesUrl}/download/windows-beta-1/${windowsInstaller}`;

// The newest 30 releases from GitHub, asked for once however many parts of the page want them (GitHub allows a
// visitor 60 questions an hour). Null when GitHub doesn't answer.
let releases = null;
export function releaseList() {
  releases ??= fetch(`https://api.github.com/repos/${repo}/releases?per_page=30`, { headers: { Accept: "application/vnd.github+json" } })
    .then((response) => (response.ok ? response.json() : null))
    .catch(() => null);
  return releases;
}

export function useWindowsRelease() {
  const [release, setRelease] = useState({ url: windowsDownloadUrl, page: `${releasesUrl}/tag/windows-beta-1`, sizeMB: null, beta: true });
  useEffect(() => {
    let cancelled = false;
    releaseList()
      .then((data) => {
        if (!Array.isArray(data) || cancelled) return;
        const carries = (r) => !r.draft && r.assets?.some((a) => a.name === windowsInstaller);
        // A full release (not a pre-release) first: the newest one with the installer; otherwise the newest beta.
        const newest = data.find((r) => carries(r) && !r.prerelease)
          ?? data.find((r) => carries(r) && String(r.tag_name).startsWith("windows-"));
        if (!newest) return;
        const asset = newest.assets.find((a) => a.name === windowsInstaller);
        setRelease({
          url: newest.prerelease ? asset.browser_download_url : `${releasesUrl}/latest/download/${windowsInstaller}`,
          page: newest.html_url,
          sizeMB: Math.max(1, Math.round(asset.size / 1_000_000)),
          beta: newest.prerelease,
        });
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
