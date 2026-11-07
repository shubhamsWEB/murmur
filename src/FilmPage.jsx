import { useEffect, useState } from "react";
import Film from "./Film";
import { Hi } from "./Collage";
import { DownloadButton, Head, SiteFooter, SiteHeader, sitePath, useOnWindows } from "./Parts";
import { downloadUrl, useWindowsRelease } from "./release";
import { useScrollMotion } from "./motion";
import { chapters, clock, film } from "./launch";
import { guides } from "./guides";

// The launch film's own page: the film first, as the page's main content, so search engines index it as a video,
// then its chapters (each one starts the film there) and the way to get Murmur.
export default function FilmPage() {
  const isWindows = useOnWindows();
  const windows = useWindowsRelease();
  useScrollMotion();
  const [startAt, setStartAt] = useState(0);
  const [request, setRequest] = useState(null);
  // ?t=13 in the address (a search result's chapter link) starts the film there when it's played.
  useEffect(() => {
    const t = Number(new URLSearchParams(window.location.search).get("t"));
    if (t > 0 && t < 88) setStartAt(t);
  }, []);
  const mac = <DownloadButton os="mac" href={downloadUrl} quiet={isWindows} />;
  const win = <DownloadButton os="windows" href={windows.url} quiet={!isWindows} />;
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <SiteHeader />

      <main id="main" className="guide film-page">
        <section className="guide-hero" aria-labelledby="film-title">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol><li><a href={base}>Murmur</a></li><li><span aria-current="page">The launch film</span></li></ol>
          </nav>
          <h1 id="film-title">Murmur at work, in <Hi>a minute and a half</Hi></h1>
        </section>

        <section className="film-wrap film-solo" aria-label="The film, 1 minute 28 seconds">
          <Film asVideo startAt={startAt} request={request} />
          <p className="film-more"><a className="text-link" href={film.youtube}>Watch it on YouTube</a></p>
        </section>

        <section className="guide-hero film-about">
          <p className="hero-lede">Murmur is a free, open-source voice assistant for Mac and Windows. In this film you hold a key and talk: it types in any app, tidies what you said, reads a long document for you, opens apps, works through a whole job, finds a file you describe and remembers your work. Your voice never leaves your computer.</p>
        </section>

        <section className="block guide-section" aria-labelledby="chapters-title">
          <Head id="chapters-title" title="What’s in it" lede="Thirteen chapters. Pick one to start the film there." />
          <ol className="chapters">
            {chapters.map(([start, , title, what]) => (
              <li key={start} data-reveal>
                <button type="button" onClick={() => setRequest({ t: start, at: Date.now() })} aria-label={`Play from ${clock(start)}: ${title}`}>
                  <time>{clock(start)}</time>
                  <span><b>{title}</b>{what}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="block guide-section" aria-labelledby="get-title">
          <Head id="get-title" title="Try it yourself" lede="Free, with no account. Mac with Apple silicon on macOS 14 or later, or 64-bit Windows 10 and 11." />
          <div className="hero-actions">{isWindows ? <>{win}{mac}</> : <>{mac}{win}</>}</div>
          <ul className="film-guides">
            {guides.map((g) => <li key={g.path}><a className="text-link" href={sitePath(g.path)}>{g.nav}</a></li>)}
          </ul>
        </section>
      </main>

      <SiteFooter actions={<>{mac}{win}</>} current="/film/" />
    </>
  );
}
