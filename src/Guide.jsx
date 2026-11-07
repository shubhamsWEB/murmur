import { Hi } from "./Collage";
import { Check, DownloadButton, Head, SiteFooter, SiteHeader, useOnWindows } from "./Parts";
import { downloadUrl, useWindowsRelease } from "./release";
import { useScrollMotion } from "./motion";
import { models, parity } from "./content";

// One guide page (src/guides.js): a heading that says what the page is about, then its sections and questions, in
// the same pieces as the home page.

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Section({ section }) {
  const id = slug(section.h2);
  return (
    <section className="block guide-section" aria-labelledby={id}>
      <Head id={id} title={section.h2} />
      {section.paragraphs && (
        <div className="prose" data-reveal>{section.paragraphs.map((text) => <p key={text.slice(0, 40)}>{text}</p>)}</div>
      )}
      {section.points && (
        <dl className="details pair">
          {section.points.map(([title, text], i) => (
            <div key={title} className="sticky" data-reveal data-delay={(i % 2) * 80}><dt>{title}</dt><dd>{text}</dd></div>
          ))}
        </dl>
      )}
      {section.steps && (
        <ol className="steps guide-steps">
          {section.steps.map(([title, detail], i) => <li key={title} data-reveal data-delay={i * 70}><strong>{title}</strong><span>{detail}</span></li>)}
        </ol>
      )}
      {section.examples && (
        <ul className="said">
          {section.examples.map(([line, where], i) => (
            <li key={line} className="scrap" data-reveal data-delay={i * 80}><q className="voice">{line}</q><span>{where}</span></li>
          ))}
        </ul>
      )}
      {section.table && (
        <>
          <div className="sheet taped compare-sheet" data-reveal>
            <table className="model-table compare">
              <thead><tr>{section.table.head.map((h, i) => <th key={h || i} scope="col">{h || <span className="sr-only">App</span>}</th>)}</tr></thead>
              <tbody>
                {section.table.rows.map(([name, ...cells]) => (
                  <tr key={name} className={name === "Murmur" ? "is-murmur" : ""}>
                    <th scope="row">{name}</th>
                    {cells.map((cell, i) => <td key={i} data-label={section.table.head[i + 1]}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note" data-reveal>{section.table.note}</p>
        </>
      )}
      {section.parity && (
        <div className="sheet" data-reveal>
          <table className="parity">
            <thead><tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">Mac</th><th scope="col">Windows</th></tr></thead>
            <tbody>{parity.map(([what, m, w]) => <tr key={what}><th scope="row">{what}</th><td><Check value={m} /></td><td><Check value={w} /></td></tr>)}</tbody>
          </table>
        </div>
      )}
      {section.models && (
        <div className="sheet taped" data-reveal>
          <table className="model-table">
            <thead><tr><th scope="col">What it does</th><th scope="col">Model</th><th scope="col">Details</th></tr></thead>
            <tbody>
              {models.map(([job, name, note]) => (
                <tr key={job}><th scope="row">{job}</th><td className="model-name"><span>{name}</span></td><td>{note.replace(/^New\. /, "")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function Guide({ guide }) {
  const isWindows = useOnWindows();
  const windows = useWindowsRelease();
  useScrollMotion();
  const windowsFirst = isWindows || guide.path === "/voice-typing-windows/";
  const mac = <DownloadButton os="mac" href={downloadUrl} quiet={windowsFirst} />;
  const win = <DownloadButton os="windows" href={windows.url} quiet={!windowsFirst} />;
  const base = import.meta.env.BASE_URL;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true" />
      <SiteHeader />

      <main id="main" className="guide">
        <section className="guide-hero" aria-labelledby="guide-title">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol><li><a href={base}>Murmur</a></li><li><span aria-current="page">{guide.nav}</span></li></ol>
          </nav>
          <p className="guide-kicker">{guide.kicker}</p>
          <h1 id="guide-title">{guide.h1} <Hi>{guide.hi}</Hi></h1>
          <p className="hero-lede">{guide.lede}</p>
          <div className="hero-actions">{windowsFirst ? <>{win}{mac}</> : <>{mac}{win}</>}</div>
          <p className="hero-meta">Free and open source. Mac with Apple silicon on macOS 14 or later, or Windows 10 and 11.</p>
        </section>

        {guide.sections.map((section) => <Section key={section.h2} section={section} />)}

        <section className="block faq-block" aria-labelledby="faq-title">
          <div className="faq-side">
            <Head id="faq-title" title="Questions" />
            <p className="note" data-reveal><a className="text-link" href={`${base}#install`}>How to set Murmur up</a></p>
          </div>
          <div className="faq sheet" data-reveal>
            {guide.faq.map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter actions={<>{mac}{win}</>} current={guide.path} />
    </>
  );
}
