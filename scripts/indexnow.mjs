// Tells Bing (and the other IndexNow search engines: Yandex, Seznam, Naver) that the site's pages have changed, so
// they're crawled again soon. Bing's index is also what ChatGPT search and Copilot answer from. Runs after each
// deploy (.github/workflows/pages.yml). The key is public by design: it's served at /<key>.txt to prove the site
// is ours.
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const site = (process.env.SITE_URL || "https://usemurmur.live").replace(/\/$/, "");
const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const key = readdirSync(publicDir).find((name) => /^[0-9a-f]{32}\.txt$/.test(name))?.replace(/\.txt$/, "");
if (!key) throw new Error("No IndexNow key file (32 hex characters + .txt) in public/");

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${response.status} for ${urlList.length} pages`);
if (response.status >= 400) process.exitCode = 1;
