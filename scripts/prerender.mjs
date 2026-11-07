// Writes every page of the site as finished HTML, so search engines and AI assistants (most of which don't run
// JavaScript) read the whole page, with its own title, description and structured data. Runs after the browser
// build (dist/) and the Node build of src/entry-server.jsx (dist-ssr/), as part of `npm run build`.
//
// Also writes sitemap.xml, robots.txt, llms.txt and 404.html.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "../dist");
const server = join(here, "../dist-ssr/entry-server.js");

// The site's full address: set by the GitHub Pages workflow, or by Vercel or Netlify; otherwise the real one.
const site = (process.env.VITE_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  || process.env.URL
  || "https://usemurmur.live").replace(/\/$/, "");

const { routes, render, headFor, notFoundHead, llmsText, filmSitemapEntry } = await import(pathToFileURL(server).href);
const template = readFileSync(join(dist, "index.html"), "utf8");
const seoBlock = /<!--seo-->[\s\S]*?<!--\/seo-->/;
if (!seoBlock.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html needs <!--seo-->…<!--/seo--> in its head and an empty <div id=\"root\"></div>");
}
const built = new Date();

function page(head, body) {
  return template.replace(seoBlock, head).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function write(path, text) {
  const file = join(dist, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

for (const route of routes) {
  write(join(route, "index.html"), page(headFor(route, { site, built }), render(route)));
}
write("404.html", page(notFoundHead(), render("/404/")));

const day = built.toISOString().slice(0, 10);
write("sitemap.xml", [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
  ...routes.filter((route) => route !== "/film/").map((route) => `  <url><loc>${site}${route}</loc><lastmod>${day}</lastmod></url>`),
  ...filmSitemapEntry(site),
  "</urlset>",
  "",
].join("\n"));

// Every crawler is welcome, AI assistants' included (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and the rest).
write("robots.txt", ["User-agent: *", "Allow: /", "", `Sitemap: ${site}/sitemap.xml`, ""].join("\n"));

write("llms.txt", llmsText(site));

rmSync(join(here, "../dist-ssr"), { recursive: true, force: true });
console.log(`Pre-rendered ${routes.length} pages and 404.html for ${site}`);
