import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Flock from "./Flock";
import { Bird, Pill } from "./Bird";
import { AgentMemoryScene, CleanupScene, DictateScene, MemoryScene, ReadScene, SearchScene, Shortcuts, TaskScene } from "./Scenes";
import { Cut, Hi, Mark, Note } from "./Collage";
import { downloadUrl, onWindows, releasesUrl, repo, useRelease, useWindowsRelease } from "./release";
import { featured, useRecentReleases } from "./releases";
import { useScrollMotion } from "./motion";
import {
  chatApps, dictation, heroPhrases, jobs, leadThreads, learns, links, memoryExamples, memorySources, memorySteps, memoryTools, memoryTrust, models, modes, parity, questions,
  spoken, steps, whatsNew,
} from "./content";

const github = "https://github.com/shubhamsWEB/murmur-app";
const media = `${import.meta.env.BASE_URL}media/`;

function Apple() {
  return <svg className="os" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.2.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.6zM14.1 5.6c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" /></svg>;
}
function WindowsLogo() {
  return <svg className="os" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5.3 10.4 4.3v7.1H3zm8.3-1.1L21 2.8v8.6h-9.7zM3 12.4h7.4v7.2L3 18.6zm8.3 0H21v8.7l-9.7-1.4z" /></svg>;
}

function DownloadButton({ os = "mac", href, quiet = false }) {
  return (
    <a className={`download${quiet ? " quiet" : ""}`} href={href} download>
      {os === "mac" ? <Apple /> : <WindowsLogo />}
      {os === "mac" ? "Download for Mac" : "Download for Windows"}
    </a>
  );
}

const ticker = ["Free", "Open source", "Remembers for you", "Runs on your computer", "English", "Hinglish", "25 European languages", "Mac", "Windows", "Your own models", "No account"];

const flow = [
  ["You hold the key and talk", "fn on a Mac, Ctrl and the Windows key on a PC. The capsule at the bottom of the screen shows it’s listening.", null],
  ["Your speech becomes text, on your computer", "Parakeet for English and Europe’s languages, Oriserve’s Apex for Hinglish. The audio is held in memory only while it’s transcribed.", "nothing uploaded"],
  ["Murmur decides what you meant", "Writing is typed straight away. Clear commands like “open Slack” or “volume 30” run at once, with no model at all.", null],
  ["Anything bigger is planned", "Murmur Agent, or your own Claude or OpenAI key, works out the steps and does them. It asks before it sends, deletes or runs anything.", "you stay in charge"],
];

const numbers = (sizeText) => [
  ["2 s", "for a command step with Murmur Agent, where a general model took half a minute"],
  ["3", "speech models: English, Hinglish, and 25 European languages"],
  ["0", "accounts, subscriptions or bytes of your audio sent anywhere"],
  [sizeText || "13 MB", "to download on a Mac. The models come later, only the ones you choose"],
];

const openSource = [
  ["The Mac app", "Swift, from dictation and file search to the agent and its tools. Releases are signed and notarized by Apple.", "https://github.com/shubhamsWEB/murmur-app"],
  ["The Windows app", "A Tauri app in the same repository, with the same speech models and the same window.", "https://github.com/shubhamsWEB/murmur-app/tree/main/shell"],
  ["Releases and notes", "Every version, what changed in it, and the SHA-256 of each download.", "https://github.com/shubhamsWEB/murmur-app/releases"],
];

// The launch film. Until it's played, only its poster and a button: the player (Video.js, src/FilmPlayer.jsx) starts
// loading when the visitor nears the film and takes over on the click, playing from the start with sound.
const FilmPlayer = lazy(() => import("./FilmPlayer"));
const filmLabel = "Murmur's launch film: hold a key and speak; it types where your cursor is in many languages, reads and summarises a long document, opens apps, plans a whole job like sending your resume, finds a file you describe and learns from what you work on, and your voice never leaves your computer.";

function Film() {
  const figure = useRef(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  // Near the film (or on the first hover or focus), fetch the player so the click plays at once; never before the
  // page itself has loaded, and only when the browser is idle.
  const warm = () => { import("./FilmPlayer"); };
  useEffect(() => {
    const element = figure.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const idle = (run) => {
      const later = () => (window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500));
      if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
    };
    const watch = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { idle(warm); watch.disconnect(); }
    }, { rootMargin: "300px 0px" });
    watch.observe(element);
    return () => watch.disconnect();
  }, []);
  const facade = (busy) => (
    <>
      <img className="film-poster" src={`${media}murmur-launch.jpg`} alt="" decoding="async" />
      <button type="button" className="film-play" onClick={() => setStarted(true)} onPointerEnter={warm} onFocus={warm}
        aria-label="Play the film, 1 minute 28 seconds, with sound" aria-busy={busy || undefined} disabled={busy}>
        <span className="film-icon" aria-hidden="true">
          {busy ? <span className="film-spinner" /> : <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>}
        </span>
        <span>{busy ? "Starting the film" : "Watch Murmur at work"} <small>1:28</small></span>
      </button>
    </>
  );
  return (
    <figure ref={figure} className={`film taped${started ? " playing" : ""}`}>
      {started ? (
        <Suspense fallback={facade(true)}>
          <FilmPlayer label={filmLabel} onReady={() => setReady(true)} />
          {!ready && facade(true)}
        </Suspense>
      ) : facade(false)}
    </figure>
  );
}

// The story: the words scroll past while the taped-up screenshot beside them changes with each step.
const story = [
  {
    id: "type", title: "Talk. It’s typed where your cursor is", scene: <DictateScene />, cut: "laptop", note: "any app at all",
    text: <p>Say it the way you’d say it to a person, and let go. Mail, Slack, Notes, a browser, a code editor: Murmur works wherever you can type, and recognises your speech on your own computer in moments.</p>,
  },
  {
    id: "cleanup", title: "The ums go. Your corrections stick", scene: <CleanupScene />, cut: "mic", note: "off until you want it",
    text: <>
      <p>Turn on AI cleanup and Murmur takes out fillers and repeated words, keeps only what you meant when you correct yourself, and sets out spoken lists.</p>
      <p className="dim">Murmur Cleanup does it on your Mac in a fraction of a second, or use your own Claude or OpenAI key.</p>
    </>,
  },
  {
    id: "read", title: "It reads, so you don’t have to", scene: <ReadScene />, cut: "docs", note: "even a 470-page PDF",
    text: <>
      <p>“Summarise this.” “What do they want from me, and by when?” Murmur reads the page, the email or the document in front of you, all the way to the end, and answers beside your work.</p>
      <p className="dim">Ask for pages 1 to 22 and it reads those pages from the file. Select text and say “make this shorter” to rewrite it in place.</p>
    </>,
  },
  {
    id: "tasks", title: "Hand it the whole job", scene: <TaskScene />, cut: "hand", note: "Esc stops it",
    text: <>
      <p>Murmur writes itself a task list and works through it in your apps and your own browser. When it needs you, it asks, and you answer out loud.</p>
      <ul className="jobs">{jobs.slice(0, 3).map(([said]) => <li key={said}><q className="voice">{said}</q></li>)}</ul>
      <p className="dim">Messages go to people by name in {chatApps.slice(0, 5).join(", ").replace(/, ([^,]*)$/, " and $1")}, after you see the exact words.</p>
    </>,
  },
  {
    id: "search", title: "Describe the file. It opens", scene: <SearchScene />, cut: "docs", note: "photos too",
    text: <>
      <p>Press <kbd>⇧</kbd><kbd>⌘</kbd><kbd>space</kbd>, or just say “open my PAN card”. Murmur searches inside your PDFs, documents, audio and video, and what your photos show, in the folders you choose.</p>
      <p className="dim">It reads the words in images too: receipts, screenshots, signs.</p>
    </>,
  },
];

function Story() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="story" id="features" aria-label="What Murmur does">
      <div className="story-steps">
        {story.map((s, i) => (
          <article key={s.id} id={s.id} className={`story-step${active === i ? " active" : ""}`} data-index={i}
            ref={(el) => { refs.current[i] = el; }} aria-labelledby={`${s.id}-title`}>
            <span className="tag">Part {i + 1} of {story.length}</span>
            <h2 id={`${s.id}-title`}>{s.title}</h2>
            <div className="story-text">{s.text}</div>
            <div className="story-inline" aria-hidden="true">{s.scene}</div>
          </article>
        ))}
      </div>
      <div className="story-stage" aria-hidden="true">
        <div className="story-sticky">
          {story.map((s, i) => (
            <div key={s.id} className={`stage-scene${active === i ? " active" : ""}`}>
              <div className="stage-paper taped">{s.scene}</div>
              <Cut name={s.cut} className={`stage-cut cut-${s.cut}`} />
              <Note className="stage-note">{s.note}</Note>
              <Mark kind="arrow" className="stage-arrow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Which section is on screen, so the bar can underline its link.
function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const ids = links.map(([href]) => href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: "-40% 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function MobileMenu() {
  const menu = useRef(null);
  return (
    <details className="mobile-menu" ref={menu}>
      <summary aria-label="Menu">Menu</summary>
      <nav aria-label="Sections" className="scrap">
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => { menu.current.open = false; }}>{label}</a>)}
      </nav>
    </details>
  );
}

// Memory, the 1.6 headline: one memory for the whole Mac. How it's made, what it answers, the AI tools that use it,
// and why it's safe to have.
function Memory() {
  return (
    <section className="block memory" id="memory" aria-labelledby="memory-title">
      <Head id="memory-title" loud title="One memory for" hi="your whole Mac"
        lede="Murmur keeps a private memory of your working life: who people are, what you’re working on, who’s waiting on a reply, what you promised and what’s coming up. It builds it from your apps and the windows you work in, uses it in every command, and lets your other AI tools use it too."
        note="threads, new in 1.7" />

      <ol className="flow memory-steps">
        {memorySteps.map(([title, text], i) => (
          <li key={title} className="flow-step scrap" data-reveal data-delay={i * 110}>
            <span className="flow-n" aria-hidden="true">{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            {i === 0 && <ul className="memory-chips">{memorySources.map((s) => <li key={s}>{s}</li>)}</ul>}
            {i < memorySteps.length - 1 && <Mark kind="arrow" className="flow-arrow" />}
          </li>
        ))}
      </ol>

      <div className="memory-grid">
        <div className="memory-stage" data-reveal>
          <div className="stage-paper taped"><MemoryScene /></div>
          <Cut name="cards" className="memory-cut" depth="0.4" />
          <Note className="memory-note">what you worked on, kept as cards</Note>
        </div>
        <div className="memory-examples">
          <h3 className="memory-sub">So you can just say</h3>
          <dl>
            {memoryExamples.map(([said, does], i) => (
              <div key={said} data-reveal data-delay={i * 80}><dt><q className="voice">{said}</q></dt><dd>{does}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div className="memory-agents">
        <div className="memory-agents-copy" data-reveal>
          <h3 className="memory-sub">Your AI tools get it too</h3>
          <p>Claude Code, Claude Desktop, Cursor and any other AI tool on your Mac that connects to tools over MCP can ask Murmur’s memory before they answer. So your coding agent knows what you shipped this week, who owns the payments code, and what you promised to fix.</p>
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

      <dl className="details memory-trust">
        {memoryTrust.map(([title, text], i) => (
          <div key={title} className="sticky" data-reveal data-delay={i * 80}><dt>{title}</dt><dd>{text}</dd></div>
        ))}
      </dl>
    </section>
  );
}

function Check({ value }) {
  if (value === true) return <span className="yes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13c3 2 4 4 5 6 3-7 7-11 11-14" /></svg><span className="sr-only">Yes</span></span>;
  if (value === false) return <span className="no">Not yet</span>;
  return <span className="partly">{value}</span>;
}

// A section heading. Only the few that carry the page's promise (`loud`: your memory, your privacy, the way you
// talk) get the highlighter on their last words, so it still means something when it appears.
function Head({ id, title, hi, lede, note, loud = false }) {
  return (
    <header className="head" data-reveal>
      <h2 id={id}>{title}{hi && <> {loud ? <Hi>{hi}</Hi> : hi}</>}</h2>
      {lede && <p className="lede">{lede}</p>}
      {note && <Note className="head-note">{note}</Note>}
    </header>
  );
}

export default function App() {
  const { version, sizeText } = useRelease();
  const windows = useWindowsRelease();
  const [isWindows] = useState(onWindows);
  const [hud, setHud] = useState({ phase: "listening", index: 0 });
  const listening = hud.phase !== "done";
  useScrollMotion();
  const current = useActiveSection();

  const mac = <DownloadButton os="mac" href={downloadUrl} quiet={isWindows} />;
  const win = <DownloadButton os="windows" href={windows.url} quiet={!isWindows} />;
  const recentReleases = useRecentReleases();
  const latest = recentReleases[0];
  const shownVersion = version && version !== "0.1.0" ? version : latest[0];

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true" />

      <header className="nav">
        <a className="brand" href="#top" aria-label="Murmur, home"><Bird /><span>Murmur</span></a>
        <nav aria-label="Primary">{links.map(([href, label]) => <a key={href} href={href} aria-current={current === href.slice(1) ? "true" : undefined}>{label}</a>)}</nav>
        <MobileMenu />
        <a className="nav-get" href="#install">Get Murmur</a>
      </header>

      <main id="main">
        <section className="hero" id="top" data-scroll>
          <div className="flock-band">
            <Flock phrases={heroPhrases} color="rgba(29, 26, 23, 0.9)" onPhase={(phase, index) => setHud({ phase, index })} />
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <a className="stamp" href="#memory">New in {featured}: Murmur remembers</a>
              <h1>Hold a key and <Hi>say it.</Hi></h1>
              <p className="hero-lede">Murmur types what you say in any app, answers questions about your screen, finds your files and carries out whole jobs across your apps and the web. Now it remembers your work, too: who’s who, what you promised and what’s coming up, for Murmur and for your other AI tools. In English, Hinglish or 25 more languages. Free, and its models run on your own computer.</p>
              <div className="hero-actions">{isWindows ? <>{win}{mac}</> : <>{mac}{win}</>}</div>
              <p className="hero-meta">Free and open source. Mac with Apple silicon on macOS 14 or later, or Windows 10 and 11.</p>
            </div>
            <div className="hero-collage" aria-hidden="true">
              <span className="block block-coral" />
              <span className="block block-yellow" />
              <Cut name="mic" className="hero-mic" depth="0.6" />
              <Cut name="hand" className="hero-hand" depth="-0.4" />
              <span className="keycap">fn</span>
              <div className="hero-pill"><Pill state={listening ? "listening" : "done"}>{listening ? "Listening" : heroPhrases[hud.index].result}</Pill></div>
              <Note className="hero-note">hold it, talk, let go</Note>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true" data-scroll>
          <div className="ticker-row">
            {[0, 1].map((k) => (
              <span key={k}>
                {ticker.map((t) => <span key={t} className="ticker-item">{t}<Bird mono /></span>)}
              </span>
            ))}
          </div>
        </div>

        <section className="film-wrap" data-scroll aria-label="Murmur at work, a film of 1 minute 28 seconds"><Film /></section>

        <Memory />

        <section className="block" aria-labelledby="modes-title">
          <Head id="modes-title" title="One key does" hi="four things" lede="Hold fn on a Mac, or Ctrl and the Windows key on a PC, and talk. Murmur works out whether you’re writing, asking or handing it a job." />
          <dl className="modes">
            {modes.map(([verb, said, does], i) => (
              <div key={verb} className="mode scrap" data-reveal data-delay={i * 90}>
                <dt>{verb}</dt>
                <dd><q className="voice">{said}</q><span>{does}</span></dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="block" id="how" aria-labelledby="how-title">
          <Head id="how-title" title="How it works, in" hi="four steps" lede="Everything up to the last step happens on your computer. Most of the time, so does the last step." />
          <ol className="flow">
            {flow.map(([title, text, note], i) => (
              <li key={title} className="flow-step scrap" data-reveal data-delay={i * 120}>
                <span className="flow-n" aria-hidden="true">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                {note && <Note className="flow-note">{note}</Note>}
                {i < flow.length - 1 && <Mark kind="arrow" className="flow-arrow" />}
              </li>
            ))}
          </ol>
        </section>

        <section className="numbers" aria-label="Murmur in numbers">
          {numbers(sizeText).map(([big, small], i) => (
            <div key={small} className="number" data-reveal data-delay={i * 90}>
              <b>{big}</b><span>{small}</span>
            </div>
          ))}
        </section>

        <section className="block" id="new" aria-labelledby="new-title">
          <Head id="new-title" title={`New in Murmur ${featured}`} lede={<>The newest, Murmur {latest[0]}, came out on {latest[1]}. Murmur updates itself, or <a href={`${releasesUrl}/tag/v${latest[0]}`}>read the full notes</a>.</>} />
          <ul className="new-grid">
            {whatsNew.map(([title, text], i) => (
              <li key={title} className={`scrap${i === 0 ? " lead taped" : ""}`} data-reveal data-delay={i * 80}>
                {i === 0 && <>
                  <span className="seal" aria-hidden="true">new</span>
                  <dl className="lead-facts"><div><dt>Follow-up after</dt><dd>4 days</dd></div><div><dt>Sent anywhere by default</dt><dd>Nothing</dd></div></dl>
                  <ul className="lead-threads" aria-label="Threads in the morning brief">
                    {leadThreads.map(([who, what, whose]) => (
                      <li key={who}><b>{who}</b><span>{what}</span><em className={whose === "Your turn" ? "yours" : ""}>{whose}</em></li>
                    ))}
                  </ul>
                </>}
                <h3>{title}</h3><p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <Story />

        <section className="block" aria-labelledby="details-title">
          <Head id="details-title" title="The small things," hi="done right" />
          <dl className="details">
            {dictation.map(([title, text], i) => (
              <div key={title} className="sticky" data-reveal data-delay={(i % 3) * 80}><dt>{title}</dt><dd>{text}</dd></div>
            ))}
          </dl>
        </section>

        <section className="block languages" id="languages" aria-labelledby="languages-title">
          <Head id="languages-title" loud title="Talk the way you" hi="actually talk" lede="Mix Hindi and English as you like and it’s typed in English letters. Or pick English, or one of 25 European languages. Only the model you choose downloads." note="Hinglish in coral" />
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
        </section>

        <section className="block" id="models" aria-labelledby="models-title">
          <Head id="models-title" title="The models run on" hi="your computer" lede="Each one downloads once, when you first need it. After that, Murmur works offline." />
          <div className="sheet taped" data-reveal>
            <table className="model-table">
              <thead><tr><th scope="col">What it does</th><th scope="col">Model</th><th scope="col">Details</th></tr></thead>
              <tbody>
                {models.map(([job, name, note]) => (
                  <tr key={job} className={note.startsWith("New.") ? "is-new" : ""}>
                    <th scope="row">{job}</th><td className="model-name"><span>{name}</span></td><td>{note.replace(/^New\. /, "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note" data-reveal>Rather use a bigger model? Add your own Claude or OpenAI key for commands, cleanup or vision.</p>
        </section>

        <section className="block privacy" id="privacy" aria-labelledby="privacy-title">
          <Head id="privacy-title" loud title="Your voice never" hi="leaves your computer" />
          <div className="privacy-grid">
            <Cut name="lock" className="privacy-lock" depth="0.5" />
            <div className="scrap" data-reveal>
              <h3><span className="circled">Stays on your computer<Mark kind="circle" className="privacy-circle" /></span></h3>
              <p>Your audio, your files and the index of what’s in them, everything Murmur remembers, and by default what it read from your screen and every command and cleanup.</p>
            </div>
            <div className="scrap" data-reveal data-delay="100">
              <h3>Leaves only if you choose</h3>
              <p>With your own Claude or OpenAI key, the command and what Murmur reads to carry it out, the dictation it tidies, or, if you turn it on, what Murmur saw while you worked, never banking, health, ID or password pages. Never audio, never files. Models download once from Hugging Face and Ollama.</p>
            </div>
          </div>
        </section>

        <section className="block" aria-labelledby="learns-title">
          <Head id="learns-title" title="It learns" hi="how you work" />
          <div className="three">
            {learns.map(([title, text], i) => <div key={title} className="card" data-reveal data-delay={i * 90}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </section>

        <section className="block" id="keys" aria-labelledby="keys-title">
          <Head id="keys-title" title="The" hi="shortcuts" lede="Hold one key and Murmur decides. Add another when you want to." />
          <div className="sheet" data-reveal><Shortcuts initial={isWindows ? "windows" : "mac"} /></div>
        </section>

        <section className="block" id="windows" aria-labelledby="windows-title">
          <Head id="windows-title" title="Murmur on" hi="Windows" lede="Dictation, AI cleanup, voice commands and file search, in the same window as the Mac app. It installs for your account without admin rights and updates itself." />
          <div className="two wide-right">
            <div data-reveal>
              <DownloadButton os="windows" href={windows.url} />
              <p className="note">Windows 10 and 11, 64-bit{windows.sizeText ? `, ${windows.sizeText}` : ""}. The installer isn’t code-signed yet: if SmartScreen warns, click More info, then Run anyway.</p>
            </div>
            <div className="sheet" data-reveal data-delay="100">
              <table className="parity">
                <thead><tr><th scope="col"><span className="sr-only">Feature</span></th><th scope="col">Mac</th><th scope="col">Windows</th></tr></thead>
                <tbody>{parity.map(([what, m, w]) => <tr key={what}><th scope="row">{what}</th><td><Check value={m} /></td><td><Check value={w} /></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="block" id="open" aria-labelledby="open-title">
          <Head id="open-title" title="Built in the" hi="open" lede="Murmur is open source under the MIT licence. Read every line, build it yourself, or send a fix." />
          <div className="open-grid">
            {openSource.map(([title, text, href], i) => (
              <a key={title} className="card open-card" href={href} data-reveal data-delay={i * 90}>
                <h3>{title}</h3><p>{text}</p><span className="open-go">Open on GitHub</span>
              </a>
            ))}
          </div>
        </section>

        <section className="block" id="install" aria-labelledby="install-title">
          <Head id="install-title" title="Set up in" hi="five minutes" />
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
              <a className="text-link" href={github}>Source code on GitHub</a>
            </div>
          </div>
        </section>

        <section className="block" aria-labelledby="releases-title">
          <Head id="releases-title" title="Recent" hi="releases" />
          <ol className="timeline" data-scroll>
            {recentReleases.map(([v, date, text], i) => (
              <li key={v} data-reveal data-delay={i * 60}>
                <a href={`${releasesUrl}/tag/v${v}`}><b>{v}</b><time>{date}</time></a>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <a className="text-link" href={releasesUrl}>Every release on GitHub</a>
        </section>

        <section className="block faq-block" aria-labelledby="faq-title">
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

      <footer className="footer">
        <div className="mascot" aria-hidden="true">
          <span className="mascot-say">Bye for now! Hold fn when you need me.</span>
          <Cut name="mascot" className="mascot-bird" />
        </div>
        <div className="footer-say" data-reveal>
          <p>Hold a key and <Hi>say it.</Hi></p>
          <div className="footer-actions">{mac}{win}</div>
        </div>
        <div className="footer-meta">
          <p>Murmur is free and open source under the MIT licence.</p>
          <a href={github}>Source code on GitHub</a>
        </div>
      </footer>
    </>
  );
}
