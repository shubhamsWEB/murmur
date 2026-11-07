import { useEffect, useRef, useState } from "react";
import { Bird } from "./Bird";
import { Cut, Hi, Note } from "./Collage";
import { onWindows } from "./release";
import { links } from "./content";
import { guides } from "./guides";

// The pieces every page shares: the bar at the top, the footer, the download buttons and the section headings.

export const github = "https://github.com/shubhamsWEB/murmur-app";
const base = import.meta.env.BASE_URL;
// An address on this site, from a path like "/voice-typing-mac/".
export const sitePath = (path) => `${base}${path.replace(/^\//, "")}`;

function Apple() {
  return <svg className="os" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.6zM14.1 5.6c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" /></svg>;
}
function WindowsLogo() {
  return <svg className="os" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.3 10.4 4.3v7.1H3zm8.3-1.1L21 2.8v8.6h-9.7zM3 12.4h7.4v7.2L3 18.6zm8.3 0H21v8.7l-9.7-1.4z" /></svg>;
}

export function DownloadButton({ os = "mac", href, quiet = false }) {
  return (
    <a className={`download${quiet ? " quiet" : ""}`} href={href} download>
      {os === "mac" ? <Apple /> : <WindowsLogo />}
      {os === "mac" ? "Download for Mac" : "Download for Windows"}
    </a>
  );
}

// Whether the visitor is on Windows, so the main button offers the right download. Decided after the page has
// loaded, so the pre-rendered page and the first render in the browser are the same.
export function useOnWindows() {
  const [windows, setWindows] = useState(false);
  useEffect(() => { setWindows(onWindows()); }, []);
  return windows;
}

// A section heading. Only the few that carry the page's promise (`loud`: your memory, your privacy, the way you
// talk) get the highlighter on their last words, so it still means something when it appears.
export function Head({ id, title, hi, lede, note, loud = false }) {
  return (
    <header className="head" data-reveal>
      <h2 id={id}>{title}{hi && <> {loud ? <Hi>{hi}</Hi> : hi}</>}</h2>
      {lede && <p className="lede">{lede}</p>}
      {note && <Note className="head-note">{note}</Note>}
    </header>
  );
}

export function Check({ value }) {
  if (value === true) return <span className="yes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13c3 2 4 4 5 6 3-7 7-11 11-14" /></svg><span className="sr-only">Yes</span></span>;
  if (value === false) return <span className="no">Not yet</span>;
  return <span className="partly">{value}</span>;
}

// Which section of the home page is on screen, so the bar can underline its link.
function useActiveSection(home) {
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!home) return undefined;
    const els = links.map(([href]) => document.getElementById(href.slice(1))).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [home]);
  return active;
}

function MobileMenu({ items }) {
  const menu = useRef(null);
  return (
    <details className="mobile-menu" ref={menu}>
      <summary aria-label="Menu">Menu</summary>
      <nav aria-label="Sections" className="scrap">
        {items.map(([href, label]) => <a key={href} href={href} onClick={() => { menu.current.open = false; }}>{label}</a>)}
      </nav>
    </details>
  );
}

// The bar at the top. On the home page its links go to the sections; elsewhere, to those sections on the home page.
export function SiteHeader({ home = false }) {
  const current = useActiveSection(home);
  const prefix = home ? "" : base;
  const items = links.map(([href, label]) => [`${prefix}${href}`, label, href.slice(1)]);
  return (
    <header className="nav">
      <a className="brand" href={home ? "#top" : base} aria-label="Murmur, home"><Bird /><span>Murmur</span></a>
      <nav aria-label="Primary">{items.map(([href, label, id]) => <a key={href} href={href} aria-current={current === id ? "true" : undefined}>{label}</a>)}</nav>
      <MobileMenu items={items} />
      <a className="nav-get" href={`${prefix}#install`}>Get Murmur</a>
    </header>
  );
}

// The footer: the sign-off, the download buttons, and links to the guides, so every page reaches every other.
export function SiteFooter({ actions, current }) {
  return (
    <footer className="footer">
      <div className="mascot" aria-hidden="true">
        <span className="mascot-say">Bye for now! Hold fn when you need me.</span>
        <Cut name="mascot" className="mascot-bird" />
      </div>
      <div className="footer-say" data-reveal>
        <p>Hold a key and <Hi>say it.</Hi></p>
        <div className="footer-actions">{actions}</div>
      </div>
      <nav className="footer-guides" aria-labelledby="footer-guides-title">
        <h2 id="footer-guides-title">More about Murmur</h2>
        <ul>
          {current !== "/" && <li><a href={base}>Murmur, the voice assistant</a></li>}
          {guides.map((g) => (
            <li key={g.path}><a href={sitePath(g.path)} aria-current={current === g.path ? "page" : undefined}>{g.nav}</a></li>
          ))}
        </ul>
      </nav>
      <div className="footer-meta">
        <p>Murmur is free and open source under the MIT licence. Made by <a href="https://shubhamsweb.netlify.app/">Shubham Agrawal</a>.</p>
        <a href={github}>Source code on GitHub</a>
      </div>
    </footer>
  );
}
