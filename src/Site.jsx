import App from "./App";
import Guide from "./Guide";
import { Hi } from "./Collage";
import { SiteFooter, SiteHeader } from "./Parts";
import { guides } from "./guides";

// Which page an address shows. Every one is pre-rendered at build time (scripts/prerender.mjs) and picked up by the
// same code in the browser (src/main.jsx).

export const routes = ["/", ...guides.map((g) => g.path)];

// "/murmur/voice-typing-mac" → "/voice-typing-mac/", whatever base path the site is served from.
export function pathOf(pathname) {
  const base = import.meta.env.BASE_URL;
  let path = pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
  path = path.replace(/\/index\.html$/, "/").replace(/\/{2,}/g, "/");
  return path.endsWith("/") ? path : `${path}/`;
}

function NotFound() {
  const base = import.meta.env.BASE_URL;
  return (
    <>
      <SiteHeader />
      <main id="main" className="guide">
        <section className="guide-hero" aria-labelledby="missing-title">
          <h1 id="missing-title">This page isn’t <Hi>here</Hi></h1>
          <p className="hero-lede">The address may be mistyped, or the page may have moved. Everything about Murmur starts from the home page, and the guides are listed below.</p>
          <div className="hero-actions"><a className="download" href={base}>Go to the home page</a></div>
        </section>
      </main>
      <SiteFooter current="" />
    </>
  );
}

export default function Site({ path }) {
  if (path === "/") return <App />;
  const guide = guides.find((g) => g.path === path);
  return guide ? <Guide guide={guide} /> : <NotFound />;
}
