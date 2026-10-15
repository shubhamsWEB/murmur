import { useRef, useState } from "react";
import Flock from "./Flock";
import Sonogram from "./Sonogram";
import { FieldMarks, RangeMap } from "./Figures";

import { downloadUrl, releasesUrl, useRelease } from "./release";

// The Starling, from the app icon's 100-unit grid.
function Bird({ mono = false }) {
  const body = mono ? "currentColor" : "var(--coral)";
  const cut = mono ? "var(--mono-cut)" : "#FFF6EF";
  return (
    <svg className="bird" viewBox="10 26 82 62" aria-hidden="true">
      <path d="M30 58 L12 47 L16 67 Z" fill={mono ? "currentColor" : "#E2554A"} />
      <ellipse cx="48" cy="60" rx="24" ry="19" fill={body} />
      <circle cx="66" cy="42" r="13" fill={body} />
      <path d="M78 40.5 L89 44 L78 47.5 Z" fill={mono ? "currentColor" : "#221E1C"} />
      <circle cx="69" cy="39" r="2.6" fill={mono ? cut : "#221E1C"} />
      <path d="M44 78.5 v6 M53 78.5 v6" stroke={mono ? "currentColor" : "#221E1C"} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M31 60 q4.5 -8 9 0 t9 0 t9 0" stroke={cut} strokeWidth="3.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function DownloadButton({ small = false }) {
  return (
    <a className={`download${small ? " small" : ""}`} href={downloadUrl} download>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" /></svg>
      {small ? "Download" : "Download for Mac"}
    </a>
  );
}

// What the flock spells, and what Murmur's capsule says at the same moment.
const heroPhrases = [
  { said: "talk to your mac", result: "Listening…" },
  { said: "it types for you", result: "Typed into Slack" },
  { said: "finds any file", result: "Found Lease 2025.pdf" },
  { said: "does the busywork", result: "Opened YouTube in Chrome" },
  { said: "stays on your mac", result: "Transcribed on this Mac" },
];

function Hud({ phase, index }) {
  const listening = phase !== "done" || index === 0;
  return (
    <div className={`hud${listening ? " listening" : ""}`} aria-hidden="true">
      <Bird />
      <span className="bars"><i /><i /><i /><i /><i /></span>
      <span className="hud-text">{listening ? "Listening…" : heroPhrases[index].result}</span>
    </div>
  );
}

function Plate({ id, kicker, title, children, wide = false }) {
  return (
    <section className={`plate${wide ? " wide" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="plate-margin">
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="plate-kicker">{kicker}</p>
      </header>
      <div className="plate-body">{children}</div>
    </section>
  );
}

const glance = [
  { title: "Dictate", said: "Running late, start without me.", what: "Speak in any app. Your words are typed where the cursor is.", href: "#call" },
  { title: "Rewrite", said: "Make this shorter.", what: "Select text and say what to do with it: shorten, translate, reply.", href: "#call" },
  { title: "Find files", said: "The clause about pets in the lease.", what: "Search photos, PDFs, documents, audio and video by what’s inside.", href: "#marks" },
  { title: "Get things done", said: "Open YouTube in Chrome.", what: "Open apps and sites, run multi-step tasks, start Claude Code or Codex.", href: "#behaviour" },
];

function Glance() {
  return (
    <section className="glance" aria-label="What Murmur does">
      <ul>
        {glance.map((item) => (
          <li key={item.title}>
            <a href={item.href}>
              <h2>{item.title}</h2>
              <q>{item.said}</q>
              <p>{item.what}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="glance-note">All of it starts with one key, <kbd>fn</kbd>. Speech is recognised on your Mac and never leaves it.</p>
    </section>
  );
}

// A day of observations: when, where, what was said, what Murmur did.
const notes = [
  ["08:52", "Mail", "Thursday works for me, could you send the agenda?", "Typed it into the reply, where the cursor was."],
  ["10:15", "Finder", "Open my resume PDF.", "Opened Resume 2026.pdf. No search window, no clicking."],
  ["11:40", "Safari, with a paragraph selected", "Make this shorter.", "Rewrote the selection in place."],
  ["13:05", "The desktop", "Open YouTube in Chrome.", "Chrome came forward with YouTube open. No model needed."],
  ["15:30", "Search, ⇧⌘Space", "The clause about pets in the lease.", "Found the lease and showed the passage that matched."],
  ["17:20", "Anywhere", "Open Notes and write a packing list for Goa.", "Opened Notes and wrote the list, step by step."],
  ["18:45", "Anywhere", "Build a React app with a hello world page.", "Started Claude Code on it in a new project folder."],
];

const steps = [
  ["Open the download and drag Murmur to Applications.", "If macOS says it can’t verify the developer, open System Settings → Privacy & Security and click Open Anyway. You only do this once."],
  ["Allow the microphone and Accessibility.", "Accessibility is what lets Murmur type into other apps and press buttons for you."],
  ["Choose the folders Murmur may search.", "The first index takes a while. Murmur shows its progress, and you can search as it goes."],
  ["Pick how commands are planned.", "Install Ollama for a free local model, or add your own Claude or OpenAI key. Dictation and search work without either."],
];

const questions = (sizeText) => [
  ["Does Murmur listen all the time?", "No. It listens only while you hold fn, or after you double-tap fn for hands-free, until you tap again. Esc cancels."],
  ["How does it tell a command from dictation?", "Typing is the default. Known commands like “open Slack” run at once; an instruction said where you can’t type is treated as a command. Hold ⌃ with fn, or start with “Murmur…”, to always mean a command."],
  ["Is it really free?", "Yes. Speech recognition and file search run on your Mac. A cloud model for commands is optional and uses your own API key."],
  ["What does it need?", `A Mac with Apple silicon on macOS 14 or later. The app is ${sizeText ? `a ${sizeText}` : "a small"} download; the speech and search models download on first launch.`],
];

const links = [["#call", "How it works"], ["#marks", "Keys"], ["#range", "Privacy"], ["#install", "Install"], ["#questions", "Questions"]];

// On phones the links fold into a small menu; picking one closes it.
function MobileMenu() {
  const menu = useRef(null);
  return (
    <details className="mobile-menu" ref={menu}>
      <summary aria-label="Menu">Menu</summary>
      <nav aria-label="Sections">
        {links.map(([href, label]) => <a key={href} href={href} onClick={() => { menu.current.open = false; }}>{label}</a>)}
      </nav>
    </details>
  );
}

export default function App() {
  const { version, sizeText } = useRelease();
  const [hud, setHud] = useState({ phase: "listening", index: 0 });

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Murmur, home"><Bird mono /><span>Murmur</span></a>
        <nav aria-label="Primary">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <MobileMenu />
        <DownloadButton small />
      </header>

      <main id="main">
        <section className="hero" id="top">
          <h1 className="sr-only">Murmur: talk to your Mac. It types for you, finds any file and does the busywork, and your voice never leaves your Mac.</h1>
          <Flock phrases={heroPhrases} onPhase={(phase, index) => setHud({ phase, index })} />
          <div className="hero-foot">
            <div className="specimen">
              <p className="specimen-name">Murmur <i>voice assistant for Mac</i></p>
              <p>A voice assistant that lives in your Mac’s menu bar. Hold <kbd>fn</kbd> and speak: it types what you say in any app, finds your files from a description, and does small jobs for you. Speech is recognised on your Mac and never leaves it.</p>
              <div className="specimen-actions">
                <DownloadButton />
                <span>Free, for Apple silicon Macs on macOS 14 or later.</span>
              </div>
              <a className="ph-badge" href="https://www.producthunt.com/products/murmur-18?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-murmur-27023602-121b-4eab-968c-bfa99febae2b" target="_blank" rel="noopener noreferrer">
                <img alt="Murmur - Talk to your Mac. A free, private voice assistant | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1280346&theme=light&t=1792047746820" />
              </a>
            </div>
            <Hud phase={hud.phase} index={hud.index} />
          </div>
        </section>

        <Glance />

        <Plate id="call" title="Dictate in any app" kicker="Hold fn, speak, let go.">
          <p className="lede">Hold <kbd>fn</kbd> and say it the way you would to a person. Let go, and it’s typed where your cursor is, in any app.</p>
          <Sonogram />
          <ul className="asides">
            <li>Recognised on your Mac by Parakeet, on the Neural Engine. The audio is never saved.</li>
            <li>Double-tap <kbd>fn</kbd> to keep talking hands-free. Tap again to finish, Esc to cancel.</li>
            <li>Select some text first and say “make this shorter”, “translate this to Hindi” or “reply to this”.</li>
          </ul>
        </Plate>

        <Plate id="marks" title="Two shortcuts" kicker="That’s all there is to learn.">
          <p className="lede">Two keys, from any app, including full-screen ones.</p>
          <div className="marks">
            <FieldMarks />
            <ol className="marks-legend">
              <li><span><b>fn, held.</b> Talk. Let go and it’s typed or done.</span></li>
              <li><span><b>⌃ with fn.</b> Always a command, never typed.</span></li>
              <li><span><b>⇧⌘Space.</b> Search your files by describing them. Return opens the best match.</span></li>
              <li><span><b>The capsule.</b> Shows at the bottom of your screen while Murmur listens, then says what it did.</span></li>
            </ol>
          </div>
        </Plate>

        <Plate id="behaviour" title="What you can ask" kicker="Real requests from one day." wide>
          <p className="lede">Dictation, file search, quick commands, multi-step tasks and coding, all from the same key.</p>
          <ol className="notebook">
            {notes.map(([time, where, said, did]) => (
              <li key={time}>
                <time>{time}</time>
                <span className="where">{where}</span>
                <q>{said}</q>
                <span className="did">{did}</span>
              </li>
            ))}
          </ol>
        </Plate>

        <Plate id="range" title="Private by design" kicker="What stays on your Mac, and what can leave.">
          <p className="lede">Murmur stays home. Your voice and your files never leave your Mac. Commands are planned by a local model in Ollama, unless you choose to add your own Claude or OpenAI key.</p>
          <figure className="range">
            <RangeMap />
            <figcaption><span><b>How to read this:</b> hatched: lives on your Mac. Dotted: visited only if you add a key, and only by the words of a command, the front app’s name and any selected text.</span></figcaption>
          </figure>
        </Plate>

        <Plate id="install" title="Install in four steps" kicker="About five minutes.">
          <div className="install">
            <ol className="steps">
              {steps.map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}
            </ol>
            <div className="install-cta">
              <DownloadButton />
              <span>Version {version}{sizeText ? `, ${sizeText}` : ""}.<br />Apple silicon, macOS 14 or later.</span>
              <a className="all-versions" href={releasesUrl}>Release notes and earlier versions</a>
            </div>
          </div>
        </Plate>

        <Plate id="questions" title="Questions" kicker="Before you install.">
          <div className="faq">
            {questions(sizeText).map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </Plate>
      </main>

      <footer className="footer">
        <a className="brand" href="#top" aria-label="Murmur, home"><Bird mono /><span>Murmur</span></a>
        <p>A free voice assistant for your Mac.</p>
        <small>© 2026 Murmur</small>
      </footer>
    </>
  );
}
