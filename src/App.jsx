import { useState } from "react";
import Film from "./Film";
import Flock from "./Flock";
import Hero from "./Hero";
import { Bird } from "./Bird";
import { Check, DownloadButton, Head, SiteFooter, SiteHeader, github, sitePath, useOnWindows } from "./Parts";
import { AgentMemoryScene, CleanupScene, DictateScene, MemoryScene, ReadScene, SearchScene, Shortcuts, TaskScene } from "./Scenes";
import { Cut, Hi, Mark, Note } from "./Collage";
import { downloadUrl, releasesUrl, repo, useRelease, useWindowsRelease } from "./release";
import { featured, useRecentReleases } from "./releases";
import { comparedOn } from "./guides";
import Meetings from "./Meetings";
import { film, length } from "./launch";
import { useScrollMotion } from "./motion";
import {
  dictation, flow, freeReasons, heroPhrases, jobs, learns, memoryExamples, memorySources, memoryTools, memoryTrust, models, parity, privacyLedger, proof,
  questions, receipt, spoken, steps, ways, whatsNew, writePoints,
} from "./content";

const openSource = [
  ["The Mac app", "Swift, from dictation and file search to the agent and its tools. Releases are signed and notarized by Apple.", "https://github.com/shubhamsWEB/murmur-app"],
  ["The Windows app", "A Tauri app in the same repository, with the same speech models and the same window.", "https://github.com/shubhamsWEB/murmur-app/tree/main/shell"],
  ["Releases and notes", "Every version, what changed in it, and the SHA-256 of each download.", "https://github.com/shubhamsWEB/murmur-app/releases"],
];

// A chapter's opening: which of the four things this is, the promise, and a sentence or two.
function Opening({ id, tag, title, children, note }) {
  return (
    <header className="opening" data-reveal>
      <p className="tag">{tag}</p>
      <h2 id={id}>{title}</h2>
      <div className="lede">{children}</div>
      {note && <Note className="opening-note">{note}</Note>}
    </header>
  );
}

// Write: dictation, with cleanup beside it and the languages running underneath.
function Write() {
  return (
    <section className="block chapter" id="write" aria-labelledby="write-title">
      <div className="chapter-grid">
        <div className="chapter-copy">
          <Opening id="write-title" tag="Write" title="Write as fast as you talk">
            <p>Hold the key, say it the way you’d say it to a person, and let go. Your words are typed where the cursor is, in any app, recognised on your own computer in moments. Most people talk about three times faster than they type.</p>
          </Opening>
          <dl className="points">
            {writePoints.map(([title, text], i) => <div key={title} data-reveal data-delay={i * 80}><dt>{title}</dt><dd>{text}</dd></div>)}
          </dl>
        </div>
        <div className="chapter-stage" data-reveal>
          <div className="stage-paper taped"><DictateScene /></div>
          <div className="stage-second"><CleanupScene /></div>
          <Note className="chapter-note">with cleanup on</Note>
        </div>
      </div>

      <div className="tongues" id="languages">
        <h3 className="sub">In the language you actually speak</h3>
        <p className="lede">Mix Hindi and English as you like and it’s typed in English letters. Or choose English, one of 25 European languages, or Hindi and 20 more Indian languages with a Sarvam key.</p>
        <div className="rails" data-scroll>
          {[spoken.slice(0, 4), spoken.slice(4)].map((row, r) => (
            <ul key={r} className={`rail${r ? " back" : ""}`}>
              {[...row, ...row].map(([line, lang], i) => (
                <li key={`${line}${i}`} className={lang.startsWith("Hinglish") ? "hinglish" : ""} aria-hidden={i >= row.length}>
                  <q className="voice">{line}</q><span>{lang}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

const wayScenes = { read: <ReadScene />, task: <TaskScene />, find: <SearchScene /> };

// Ask and do: the same key, three more things. Choosing one shows it happening.
function AskAndDo() {
  const [way, setWay] = useState(0);
  return (
    <section className="block chapter" id="ask" aria-labelledby="ask-title">
      <div className="chapter-grid flip">
        <div className="chapter-copy">
          <Opening id="ask-title" tag="Ask and do" title="Ask it. Or hand it the whole job">
            <p>The same key. Murmur works out whether you’re writing, asking a question or giving it work to do, and it asks before it sends, deletes or pays for anything.</p>
          </Opening>
          <div className="ways" role="tablist" aria-label="What you can ask for" aria-orientation="vertical">
            {ways.map((w, i) => (
              <button key={w.id} type="button" role="tab" id={`way-${w.id}`} aria-selected={way === i} aria-controls="way-panel" onClick={() => setWay(i)}>
                <b>{w.title}</b>
                <q className="voice">{w.said}</q>
                <span>{w.text}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="chapter-stage" role="tabpanel" id="way-panel" aria-labelledby={`way-${ways[way].id}`}>
          <div className="stage-paper taped" key={ways[way].id}>{wayScenes[ways[way].id]}</div>
          <Cut name="docs" className="ask-cut" />
        </div>
      </div>

      <div className="more-jobs">
        <h3 className="sub">More things people hand it</h3>
        <dl>
          {jobs.map(([said, does], i) => <div key={said} data-reveal data-delay={i * 70}><dt><q className="voice">{said}</q></dt><dd>{does}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

// Remember: one memory for the whole Mac, what it lets you say, and the AI tools that can ask it.
function Memory() {
  return (
    <section className="block chapter memory" id="memory" aria-labelledby="memory-title">
      <div className="chapter-grid">
        <div className="chapter-copy">
          <Opening id="memory-title" tag="Remember" title="It remembers, so you don’t have to" note="on the Mac">
            <p>Murmur keeps a private memory of your working life: who people are, what you promised, who’s waiting on a reply and what’s coming up. It builds it from your apps and the windows you work in, and uses it in every command.</p>
          </Opening>
          <div className="memory-examples">
            <h3 className="sub">So you can just say</h3>
            <dl>
              {memoryExamples.slice(0, 4).map(([said, does], i) => (
                <div key={said} data-reveal data-delay={i * 80}><dt><q className="voice">{said}</q></dt><dd>{does}</dd></div>
              ))}
            </dl>
          </div>
        </div>
        <div className="chapter-stage sticky-stage" data-reveal>
          <div className="stage-paper taped"><MemoryScene /></div>
          <Cut name="cards" className="memory-cut" depth="0.4" />
          <p className="learns-from"><b>It learns from</b>{memorySources.map((s) => <span key={s}>{s}</span>)}</p>
        </div>
      </div>

      <div className="memory-agents">
        <div className="memory-agents-copy" data-reveal>
          <h3 className="sub">Your other AI tools can ask it too</h3>
          <p>Claude Code, Claude Desktop, Cursor and any AI tool on your Mac that connects to tools over MCP can ask Murmur’s memory before they answer. So your coding agent knows what you shipped this week, who owns the payments code, and what you promised to fix.</p>
          <dl className="memory-tools">
            {memoryTools.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
          </dl>
          <p className="memory-how">Add it with one command, copied from <b>Memory → Use your memory in Claude Code</b>:</p>
          <code className="memory-command">claude mcp add --scope user murmur -- …/murmur-memory mcp</code>
          <p className="note">Read-only: they can ask, never change. What a tool reads goes to the model that tool uses.</p>
        </div>
        <div className="memory-agents-scene" data-reveal data-delay="100">
          <div className="stage-paper taped"><AgentMemoryScene /></div>
          <Note className="memory-agents-note">Claude Code, asking Murmur</Note>
        </div>
      </div>
    </section>
  );
}

const money = (n) => `$${n.toFixed(2)}`;

// Free: what the same three things cost elsewhere, as a till receipt, and why Murmur can be free.
function Free() {
  const month = receipt.reduce((sum, [, , price]) => sum + price, 0);
  return (
    <section className="band band-coral" id="free" aria-labelledby="free-title">
      <div className="band-in free-grid">
        <div className="free-copy">
          <header data-reveal>
            <h2 id="free-title">One free app, where you’d pay for three</h2>
            <p className="lede">Voice typing, meeting notes and answers during a call are usually three subscriptions. Murmur does all three, and it’s free.</p>
          </header>
          <dl className="reasons">
            {freeReasons.map(([title, text], i) => <div key={title} data-reveal data-delay={i * 80}><dt>{title}</dt><dd>{text}</dd></div>)}
          </dl>
        </div>
        <div className="receipt-wrap" data-reveal>
          <div className="receipt">
            <p className="receipt-title">Elsewhere, every month</p>
            <table>
              <tbody>
                {receipt.map(([what, who, price]) => (
                  <tr key={who}><th scope="row">{what}<small>{who}</small></th><td>{money(price)}</td></tr>
                ))}
              </tbody>
              <tfoot>
                <tr><th scope="row">A month</th><td>{money(month)}</td></tr>
                <tr className="receipt-year"><th scope="row">A year</th><td><s>{money(month * 12)}</s></td></tr>
              </tfoot>
            </table>
            <p className="receipt-murmur"><span>Murmur, all three</span><b><span className="circled">$0<Mark kind="circle" className="receipt-circle" /></span></b></p>
          </div>
          <p className="receipt-small">
            Prices from each company’s own site, {comparedOn}; each also has a free plan with limits. See how Murmur compares
            with {receipt.map(([, who, , path], i) => <span key={who}>{i ? (i === receipt.length - 1 ? " and " : ", ") : " "}<a href={sitePath(path)}>{who.replace(/ Pro$/, "")}</a></span>)}.
          </p>
        </div>
      </div>
    </section>
  );
}

// Privacy: a ledger of what stays and what leaves, and the promises about what Murmur remembers.
function Privacy() {
  return (
    <section className="band band-ink" id="privacy" aria-labelledby="privacy-title">
      <div className="band-in">
        <header className="privacy-head" data-reveal>
          <h2 id="privacy-title">Your voice stays <Hi>on your computer</Hi></h2>
          <p className="lede">The models that hear you, tidy your words and search your files run on your own machine. Nothing leaves it unless you decide it should.</p>
          <Cut name="lock" className="privacy-lock2" />
        </header>
        <div className="ledger">
          {privacyLedger.map(([title, lines], i) => (
            <div key={title} className={i ? "ledger-leaves" : "ledger-stays"} data-reveal data-delay={i * 100}>
              <h3>{title}</h3>
              <ul>{lines.map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          ))}
        </div>
        <dl className="vows">
          {memoryTrust.map(([title, text], i) => <div key={title} data-reveal data-delay={i * 70}><dt>{title}</dt><dd>{text}</dd></div>)}
        </dl>
        <p className="privacy-source" data-reveal>Don’t take our word for it: <a href={github}>read the source on GitHub</a>.</p>
      </div>
    </section>
  );
}

// The rest, for the curious: one sheet with a tab for each subject, so it's all here without being a mile long.
function Details({ isWindows, recentReleases }) {
  const tabs = [
    ["how", "How it works", (
      <ol className="steps">
        {flow.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}
      </ol>
    )],
    ["keys", "Shortcuts", <Shortcuts initial={isWindows ? "windows" : "mac"} />],
    ["models", "Models", (
      <>
        <p className="panel-lede">Each one downloads once, when you first need it. After that, Murmur works offline.</p>
        <table className="model-table">
          <thead><tr><th scope="col">What it does</th><th scope="col">Model</th><th scope="col">Details</th></tr></thead>
          <tbody>
            {models.map(([job, name, note]) => (
              <tr key={job}><th scope="row">{job}</th><td className="model-name"><span>{name}</span></td><td>{note.replace(/^New\. /, "")}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="note">Rather use a bigger model? Add your own Claude, OpenAI or Sarvam key for commands, cleanup, meetings or vision.</p>
      </>
    )],
    ["touches", "Fine touches", (
      <dl className="touches">{dictation.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
    )],
    ["learns", "How it learns", (
      <dl className="touches">
        {[...learns, whatsNew[5]].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
      </dl>
    )],
    ["windows", "Mac and Windows", (
      <table className="parity">
        <thead><tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">Mac</th><th scope="col">Windows</th></tr></thead>
        <tbody>{parity.map(([what, m, w]) => <tr key={what}><th scope="row">{what}</th><td><Check value={m} /></td><td><Check value={w} /></td></tr>)}</tbody>
      </table>
    )],
    ["open", "Open source", (
      <>
        <p className="panel-lede">Murmur is open source under the MIT licence. Read every line, build it yourself, or send a fix.</p>
        <ul className="open-list">
          {openSource.map(([title, text, href]) => <li key={title}><a href={href}><b>{title}</b><span>{text}</span></a></li>)}
        </ul>
      </>
    )],
    ["releases", "Releases", (
      <>
        <ol className="timeline">
          {recentReleases.slice(0, 6).map(([v, date, text]) => (
            <li key={v}><a href={`${releasesUrl}/tag/v${v}`}><b>{v}</b><time>{date}</time></a><p>{text}</p></li>
          ))}
        </ol>
        <a className="text-link" href={releasesUrl}>Every release on GitHub</a>
      </>
    )],
  ];
  const [open, setOpen] = useState("how");
  const move = (event) => {
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const at = tabs.findIndex(([id]) => id === open);
    const next = tabs[(at + step + tabs.length) % tabs.length][0];
    setOpen(next);
    document.getElementById(`detail-tab-${next}`)?.focus();
  };
  return (
    <section className="block" id="details" aria-labelledby="details-title">
      <Head id="details-title" title="The details," hi="for the curious" lede="Shortcuts, models, what works on which computer, and where the code lives." />
      <div className="spec sheet" data-reveal>
        <div className="spec-tabs" role="tablist" aria-label="Details" onKeyDown={move}>
          {tabs.map(([id, label]) => (
            <button key={id} type="button" role="tab" id={`detail-tab-${id}`} aria-controls={`detail-${id}`} aria-selected={open === id}
              tabIndex={open === id ? 0 : -1} onClick={() => setOpen(id)}>{label}</button>
          ))}
        </div>
        {tabs.map(([id, label, body]) => (
          <div key={id} className="spec-panel" role="tabpanel" id={`detail-${id}`} aria-labelledby={`detail-tab-${id}`} hidden={open !== id}>
            <h3 className="sr-only">{label}</h3>
            {body}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const { version, sizeText } = useRelease();
  const windows = useWindowsRelease();
  const isWindows = useOnWindows();
  useScrollMotion();

  const mac = <DownloadButton os="mac" href={downloadUrl} quiet={isWindows} />;
  const win = <DownloadButton os="windows" href={windows.url} quiet={!isWindows} />;
  const recentReleases = useRecentReleases();
  const latest = recentReleases[0];
  const shownVersion = version && version !== "0.1.0" ? version : latest[0];

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true" />

      <SiteHeader home />

      <main id="main">
        <Hero
          stamp={<a className="stamp" href="#meetings">New in {featured}: meeting notes</a>}
          actions={<>{isWindows ? <>{win}{mac}</> : <>{mac}{win}</>}<a className="watch" href="#film"><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>Watch the film, {length.clock}</a></>}
          meta="Free and open source, with no account. Mac with Apple silicon on macOS 14 or later, or Windows 10 and 11."
        />

        <section className="proof" aria-label="Murmur in four lines">
          {proof.map(([title, text], i) => (
            <div key={title} data-reveal data-delay={i * 80}><h2>{title}</h2><p>{text}</p></div>
          ))}
        </section>

        <Write />
        <AskAndDo />
        <Meetings />
        <Memory />

        <section className="block film-wrap" id="film" data-scroll aria-labelledby="film-title">
          <Head id="film-title" title="Watch it work" lede={`One working day with Murmur, in ${film.duration} seconds: typing, reading, doing, meeting and remembering.`} />
          <Film />
          <p className="film-more"><a className="text-link" href={sitePath("/film/")}>Watch it on its own page, with chapters</a></p>
        </section>

        <Free />
        <Privacy />

        <section className="block" id="install" aria-labelledby="install-title">
          <Head id="install-title" title="Set up in" hi="five minutes" lede="Download it, choose how you speak, and hold the key. There’s no account to make." />
          <div className="two wide-left">
            <ol className="steps">
              {steps.map(([title, detail], i) => <li key={title} data-reveal data-delay={i * 70}><strong>{title}</strong><span>{detail}</span></li>)}
            </ol>
            <div className="get scrap taped" data-reveal>
              <Bird />
              <p className="get-version">Murmur {shownVersion}</p>
              <DownloadButton os="mac" href={downloadUrl} />
              <p className="note">{sizeText ? `${sizeText}. ` : ""}Apple silicon, macOS 14 or later. From then on Murmur updates itself.</p>
              <DownloadButton os="windows" href={windows.url} quiet />
              <p className="note">Windows 10 and 11, 64-bit{windows.sizeText ? `, ${windows.sizeText}` : ""}. The installer isn’t code-signed yet: if SmartScreen warns, click More info, then Run anyway.</p>
              <a className="text-link" href={github}>Source code on GitHub</a>
            </div>
          </div>
        </section>

        <Details isWindows={isWindows} recentReleases={recentReleases} />

        <section className="block faq-block" id="questions" aria-labelledby="faq-title">
          <div className="faq-side">
            <Head id="faq-title" title="Questions" />
            <p className="note" data-reveal>Anything else? <a className="text-link" href={`https://github.com/${repo}/issues`}>Ask on GitHub</a>.</p>
          </div>
          <div className="faq sheet" data-reveal>
            {questions(sizeText, windows.sizeText).map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter actions={<>{mac}{win}</>} current="/" sky={<Flock phrases={heroPhrases} color="rgba(251, 248, 240, 0.9)" />} />
    </>
  );
}
