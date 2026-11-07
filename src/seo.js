/* global __MURMUR_VERSION__, __MURMUR_DMG_MB__ */
import { guides } from "./guides";
import { models, questions } from "./content";
import { downloadUrl, releasesUrl, windowsInstaller } from "./release";
import { recentReleases } from "./releases";
import { chapters, film } from "./launch";

// What search engines and AI assistants read about each page: its title and description, the address it should be
// known by, link previews, and structured data (schema.org JSON-LD) saying what Murmur is. Used only at build time,
// by scripts/prerender.mjs, which writes it into each page's <head>.

const repoUrl = "https://github.com/shubhamsWEB/murmur-app";
const authorUrl = "https://shubhamsweb.netlify.app/";
const authorGithub = "https://github.com/shubhamsWEB";
// Without GitHub at build time the version falls back to 0.1.0; then the newest line in releases.js.
const version = __MURMUR_VERSION__ && __MURMUR_VERSION__ !== "0.1.0" ? __MURMUR_VERSION__ : recentReleases[0][0];
const dmgMB = __MURMUR_DMG_MB__;
// Every full release carries the Windows installer too.
const windowsDownloadUrl = `${releasesUrl}/latest/download/${windowsInstaller}`;

export const home = {
  path: "/",
  title: "Murmur: free voice typing and AI assistant for Mac & Windows",
  description: "Free, open-source voice typing for Mac and Windows. Hold a key and talk: Murmur types in any app, in English, Hinglish or 25 more languages, on your computer.",
  shareTitle: "Murmur: hold a key and say it",
  shareDescription: "A free voice assistant that types for you, reads for you and does whole jobs across your apps and the web. New in 1.7: a memory that keeps the details, who you wrote to and whose turn it is to reply, kept on your Mac.",
  shareImageAlt: "“Murmur now remembers.” beside three index cards: Priya Shah, your manager on Slack; asked of you, send Priya the Q3 deck by Friday; coming up, a flight on Sunday at 10:15.",
};

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

// The app itself, described the same way on every page.
function app(site) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${site}/#app`,
    name: "Murmur",
    alternateName: ["Murmur voice assistant", "Murmur dictation"],
    description: "A free, open-source voice assistant for Mac and Windows. Hold a key and talk: it types in any app, cleans up what you said, answers questions about your screen, finds your files, carries out whole jobs across your apps and remembers your work. Its speech models run on your own computer.",
    url: `${site}/`,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Voice typing and dictation",
    operatingSystem: "macOS 14 or later on Apple silicon; Windows 10 and 11 (64-bit)",
    softwareVersion: version,
    downloadUrl: [downloadUrl, windowsDownloadUrl],
    releaseNotes: releasesUrl,
    ...(dmgMB ? { fileSize: `${dmgMB} MB` } : {}),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    image: `${site}/og.png`,
    screenshot: `${site}/media/murmur-launch.jpg`,
    author: { "@id": `${site}/#author` },
    publisher: { "@id": `${site}/#author` },
    sameAs: [repoUrl],
    featureList: [
      "Voice typing (dictation) in any app",
      "On-device speech recognition with NVIDIA Parakeet",
      "Hinglish voice typing, in English letters",
      "English and 25 European languages",
      "Optional AI cleanup of filler words and corrections",
      "Voice commands for apps, settings, media and volume",
      "Answers questions about what is on your screen",
      "File search by what is inside files and photos",
      "Carries out multi-step tasks across apps and the web",
      "A private memory of people, promises and plans (Mac)",
      "Memory for Claude Code, Cursor and other AI tools over MCP (Mac)",
      "Works offline once models are downloaded",
      "No account",
    ],
  };
}

const author = (site) => ({ "@type": "Person", "@id": `${site}/#author`, name: "Shubham Agrawal", url: authorUrl, sameAs: [authorUrl, authorGithub] });

const website = (site) => ({
  "@type": "WebSite",
  "@id": `${site}/#website`,
  url: `${site}/`,
  name: "Murmur",
  alternateName: ["Murmur voice assistant", "usemurmur.live"],
  inLanguage: "en",
  publisher: { "@id": `${site}/#author` },
});

const faqPage = (url, items) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

// The launch film, on its own page: Google indexes a video only where it's the page's main content. Its chapters
// are Clips, so a search result can link straight to one (?t= starts the film there).
function filmVideo(site, url) {
  return {
    "@type": "VideoObject",
    "@id": `${url}#film`,
    name: film.name,
    description: film.description,
    thumbnailUrl: [`${site}/media/murmur-launch.jpg`, `${site}/og.png`],
    uploadDate: film.uploaded,
    duration: `PT1M${film.duration - 60}S`,
    contentUrl: `${site}/media/murmur-launch.mp4`,
    embedUrl: url,
    inLanguage: "en",
    isFamilyFriendly: true,
    // The same film on YouTube.
    sameAs: [film.youtube],
    author: { "@id": `${site}/#author` },
    about: { "@id": `${site}/#app` },
    hasPart: chapters.map(([start, end, title]) => ({
      "@type": "Clip",
      name: title,
      startOffset: Math.floor(start),
      endOffset: Math.ceil(end),
      url: `${url}?t=${Math.floor(start)}`,
    })),
  };
}

// The film's entry in sitemap.xml, so Google finds the video file and its thumbnail directly.
export function filmSitemapEntry(site) {
  const x = (text) => escape(text).replace(/'/g, "&apos;");
  return [
    `  <url>`,
    `    <loc>${site}${film.path}</loc>`,
    `    <video:video>`,
    `      <video:thumbnail_loc>${site}/media/murmur-launch.jpg</video:thumbnail_loc>`,
    `      <video:title>${x(film.name)}</video:title>`,
    `      <video:description>${x(film.description)}</video:description>`,
    `      <video:content_loc>${site}/media/murmur-launch.mp4</video:content_loc>`,
    `      <video:duration>${film.duration}</video:duration>`,
    `      <video:publication_date>${film.uploaded}</video:publication_date>`,
    `      <video:family_friendly>yes</video:family_friendly>`,
    `    </video:video>`,
    `  </url>`,
  ];
}

// Everything between <!--seo--> and <!--/seo--> in index.html, for one page.
export function headFor(path, { site, built = new Date() }) {
  const isFilm = path === film.path;
  const guide = isFilm ? { ...film, nav: "The launch film" } : guides.find((g) => g.path === path);
  const url = `${site}${path}`;
  const page = guide ?? home;
  const modified = built.toISOString().slice(0, 10);
  const shareTitle = guide ? guide.title : home.shareTitle;
  const shareDescription = guide ? guide.description : home.shareDescription;

  const graph = [website(site), author(site), app(site)];
  if (guide) {
    graph.push(
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: guide.title,
        description: guide.description,
        inLanguage: "en",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#app` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: isFilm ? `${site}/media/murmur-launch.jpg` : `${site}/og.png`,
        ...(isFilm ? { video: { "@id": `${url}#film` } } : {}),
        dateModified: modified,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Murmur", item: `${site}/` },
          { "@type": "ListItem", position: 2, name: guide.nav, item: url },
        ],
      },
      isFilm ? filmVideo(site, url) : faqPage(url, guide.faq),
    );
  } else {
    graph.push(
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: home.title,
        description: home.description,
        inLanguage: "en",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#app` },
        primaryImageOfPage: `${site}/og.png`,
        dateModified: modified,
      },
      faqPage(url, questions(dmgMB ? `${dmgMB} MB` : null, null)),
    );
  }

  return [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`,
    `<meta name="author" content="Shubham Agrawal" />`,
    `<meta property="og:type" content="${isFilm ? "video.other" : "website"}" />`,
    `<meta property="og:site_name" content="Murmur" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${escape(shareTitle)}" />`,
    `<meta property="og:description" content="${escape(shareDescription)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${site}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(home.shareImageAlt)}" />`,
    ...(guide && !isFilm ? [] : [
      `<meta property="og:video" content="${site}/media/murmur-launch.mp4" />`,
      `<meta property="og:video:type" content="video/mp4" />`,
      `<meta property="og:video:width" content="1920" />`,
      `<meta property="og:video:height" content="1080" />`,
    ]),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(shareTitle)}" />`,
    `<meta name="twitter:description" content="${escape(shareDescription)}" />`,
    `<meta name="twitter:image" content="${site}/og.png" />`,
    `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph })}</script>`,
  ].join("\n    ");
}

// The head for the page GitHub Pages shows for an address that doesn't exist: not to be indexed.
export function notFoundHead() {
  return [
    `<title>Page not found | Murmur</title>`,
    `<meta name="robots" content="noindex" />`,
  ].join("\n    ");
}

// /llms.txt: a plain summary of Murmur and its pages, for AI assistants and coding agents (llmstxt.org).
export function llmsText(site) {
  const lines = [
    "# Murmur",
    "",
    "> Murmur (usemurmur.live) is a free, open-source voice assistant for Mac and Windows. Hold a key and talk: it types what you say in any app, and it can clean up dictation, answer questions about your screen, find files by what's in them, carry out multi-step jobs across apps and the web, and on a Mac keep a private memory of your work. Its speech models run on your own computer.",
    "",
    "Not to be confused with other apps called Murmur: this one is by Shubham Agrawal (https://shubhamsweb.netlify.app/), source at https://github.com/shubhamsWEB/murmur-app.",
    "",
    "## Facts",
    "",
    "- Price: free. No account, no subscription, no word limit. Open source under the MIT licence.",
    "- Platforms: macOS 14 or later on Apple silicon (M1 or later); 64-bit Windows 10 and 11.",
    `- Latest version: ${version}. The Mac app is signed and notarized by Apple and updates itself; the Windows installer isn't code-signed yet.`,
    "- Shortcut: hold fn on a Mac (or Right Option / Right Command), or Ctrl + Windows key on a PC, and talk. Double-tap for hands-free.",
    "- Languages: English, Hinglish (Hindi and English mixed, typed in English letters) and 25 European languages.",
    "- Privacy: speech is transcribed on the device; audio is held in memory only while it's transcribed. Works offline once models are downloaded. Cloud models (Claude or OpenAI) are used only with the user's own key, if they choose.",
    `- Models: ${models.map(([job, name]) => `${name} for ${job.toLowerCase()}`).join("; ")}.`,
    "- Windows has dictation, AI cleanup, voice commands and file search; reading the screen, sending messages and memory are Mac-only for now.",
    "- Compared with Wispr Flow (free up to 2,000 words a week, Pro $15 a month, cloud transcription, closed source, as listed in November 2026): Murmur is free with no limit, on-device and open source, but has no phone app.",
    "",
    "## Pages",
    "",
    `- [Murmur, the voice assistant](${site}/): everything Murmur does, with the launch film, the models, privacy, shortcuts and FAQ.`,
    `- [The launch film](${site}${film.path}): ${film.description} Also on YouTube: ${film.youtube}`,
    ...guides.map((g) => `- [${g.nav}](${site}${g.path}): ${g.description}`),
    "",
    "## Download",
    "",
    `- [Murmur for Mac (DMG)](${downloadUrl})`,
    `- [Murmur for Windows (installer)](${windowsDownloadUrl})`,
    `- [Every release, with notes and checksums](${releasesUrl})`,
    "",
    "## Source",
    "",
    `- [The app, Mac and Windows](${repoUrl})`,
    "- [This website](https://github.com/shubhamsWEB/murmur)",
    "",
  ];
  return lines.join("\n");
}
