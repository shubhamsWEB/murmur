import { useRef, useState } from "react";
import Flock from "./Flock";
import { Bird, Pill } from "./Bird";
import {
  AskFirst, ButtonScene, CleanupScene, DictateScene, FitScene, HinglishScene, KeysScene, MicCards, ScreenScene,
  SearchScene, TaskScene,
} from "./Scenes";
import { downloadUrl, releasesUrl, useRelease } from "./release";

// Murmur's Product Hunt page: a quiet line above the page, and the official badge in the footer.
const productHunt = "https://www.producthunt.com/products/murmur-18?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-murmur-27023602-121b-4eab-968c-bfa99febae2b";
const github = "https://github.com/shubhamsWEB/murmur-app";

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
  { said: "talk to your mac", result: "Listening" },
  { said: "it types for you", result: "Typed into Slack" },
  { said: "it reads for you", result: "Summarised 9 unread emails" },
  { said: "pdf kholo", result: "Opened Lease 2025.pdf" },
  { said: "it does the job", result: "Sent on WhatsApp to Arjun" },
  { said: "stays on your mac", result: "Done on this Mac" },
];

function HeroPill({ phase, index }) {
  const listening = phase !== "done" || index === 0;
  return <Pill state={listening ? "listening" : "done"}>{listening ? "Listening" : heroPhrases[index].result}</Pill>;
}

// One feature: a short headline and sentence beside its scene. `flip` puts the scene first on wide screens.
function Feature({ id, eyebrow, title, children, scene, flip = false, badge }) {
  return (
    <section className={`feature${flip ? " flip" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="feature-text">
        <p className="eyebrow">{eyebrow}{badge && <span className="badge">{badge}</span>}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
      <div className="feature-scene">{scene}</div>
    </section>
  );
}

function Section({ id, title, lede, children, className = "" }) {
  return (
    <section className={`section ${className}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="section-head">
        <h2 id={`${id}-title`}>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </header>
      {children}
    </section>
  );
}

// The launch film: a poster with a play button until it's started, then the player's own controls.
const media = `${import.meta.env.BASE_URL}media/`;

function Film() {
  const video = useRef(null);
  const [started, setStarted] = useState(false);
  const play = () => {
    setStarted(true);
    video.current?.play().catch(() => {});
  };
  return (
    <figure className="film">
      <div className="film-frame">
        <video ref={video} src={`${media}murmur-launch.mp4`} poster={`${media}murmur-launch.jpg`} preload="none"
          playsInline controls={started} onPlay={() => setStarted(true)}
          aria-label="Murmur's launch film: hold fn and speak; it types where your cursor is, plays a YouTube video, summarises and translates selected text, finds your resume and changes settings, and your voice never leaves your Mac." />
        {!started && (
          <button type="button" className="film-play" onClick={play} aria-label="Play, 51 seconds, with sound">
            <span className="film-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg></span>
            <span className="film-time" aria-hidden="true">0:51</span>
          </button>
        )}
      </div>
    </figure>
  );
}

const jobs = [
  ["Open saleshq.ai and summarise what they do.", "Opens the site, reads it top to bottom, and tells you."],
  ["Find running shoes on Flipkart and open the cheapest.", "Searches the site, compares the results, opens the one."],
  ["Text Neha I’m on my way.", "Shows you the exact words, sends them after a yes."],
  ["Build a React app with a login page.", "Starts Claude Code or Codex on it, in a new project folder."],
];

const onMac = [
  ["Your voice", "Recognised by Parakeet or Whisper on the Neural Engine, held in memory only while it’s transcribed."],
  ["Your files", "Indexed with EmbeddingGemma, only in the folders you choose."],
  ["Commands and AI cleanup", "Planned by a free local model in Ollama, by default."],
];
const ifYouChoose = [
  ["Claude or OpenAI, with your own key", "The command, what Murmur reads to carry it out, and dictation it tidies, if AI cleanup is on. Never audio, never files."],
  ["Model downloads", "Each model downloads once from Hugging Face. After that it works offline."],
];

const learns = [
  ["Memory", "Tell it once: “Priya is my manager, on Slack”, “open links in Chrome”. It also notices who you message where. The Memory page shows everything, each line with an × to forget it."],
  ["Skills", "Teach it how you want things done, in the same SKILL.md format Claude uses. Murmur comes with skills for email, chats, research, shopping, forms and long tasks. Add any from a GitHub link."],
  ["Permissions", "Allow once, for this task, or always. Settings shows what’s always allowed and takes it back. Anything that pays always asks."],
];

const steps = [
  ["Download and drag Murmur to Applications.", "If macOS says it can’t verify Murmur, open System Settings → Privacy & Security and click Open Anyway. Once."],
  ["Choose how you speak.", "English, Hinglish or 25 European languages. Only the model you pick is downloaded."],
  ["Allow the microphone and Accessibility.", "Accessibility is what lets Murmur type into other apps and press buttons for you."],
  ["Choose the folders Murmur may search.", "The first index takes a while; you can search as it goes."],
  ["Pick how commands are planned.", "Ollama for a free local model, or your own Claude or OpenAI key. Dictation, search and quick commands need neither."],
];

const questions = (sizeText) => [
  ["Does Murmur listen all the time?", "No. Only while you hold fn, or after you double-tap fn for hands-free, until you tap again. Esc cancels."],
  ["Does it change what I say?", "Not unless you ask it to. By default your words go in exactly as heard; Murmur only fits the spacing, the first letter and the final full stop to the sentence around your cursor. AI cleanup, which takes out ums and applies your corrections, is off until you turn it on, and if the model changes more than that, your words go in as heard."],
  ["How does it tell a command from dictation?", "Typing is the default. Known commands like “open Slack” or “PDF kholo” run at once. To decide yourself, hold ⇧ with fn to only type, or ⌃ with fn to always mean a command."],
  ["Which languages does it understand?", "Dictation: English, Hinglish (typed in English letters) and 25 European languages. Commands: English and Hinglish, so “mujhe PDF kholkar do” works as well as “open the PDF”."],
  ["Do I need an AI subscription?", "No. Dictation, file search and quick commands like “open Slack” or “volume 30” need nothing. For the rest, use a free local model through Ollama, or your own Claude or OpenAI key, which handles long tasks best."],
  ["Is it really free?", "Yes, and open source under the MIT licence. Speech recognition and file search run on your Mac."],
  ["What does it need?", `A Mac with Apple silicon on macOS 14 or later. The app is ${sizeText ? `a ${sizeText}` : "a small"} download; the speech and search models download on first launch.`],
];

const links = [["#features", "Features"], ["#languages", "Hinglish"], ["#tasks", "Tasks"], ["#privacy", "Privacy"], ["#install", "Install"]];

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
      <a className="launch" href={productHunt} target="_blank" rel="noopener noreferrer">
        <svg className="ph" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#FF6154" />
          <path fillRule="evenodd" fill="#fff" d="M16 12h6.2a5.4 5.4 0 0 1 0 10.8h-2.8V28H16zm3.4 3v4.8h2.8a2.4 2.4 0 0 0 0-4.8z" />
        </svg>
        <span>Murmur is on Product Hunt.</span>
        <b>Come say hi →</b>
      </a>
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
          <h1 className="sr-only">Murmur: talk to your Mac. It types for you in any app, reads and summarises for you, and carries out whole tasks across your apps and the web, in English or Hinglish. Your voice never leaves your Mac.</h1>
          <Flock phrases={heroPhrases} onPhase={(phase, index) => setHud({ phase, index })} />
          <div className="hero-foot">
            <div className="hero-copy">
              <p className="hero-line">A free voice assistant for your Mac.</p>
              <p>Hold <kbd>fn</kbd> and talk. Murmur types in any app, reads what’s on your screen, finds your files and does whole jobs across your apps and the web. In English, Hinglish and 25 more languages, and your voice never leaves your Mac.</p>
              <div className="hero-actions">
                <DownloadButton />
                <span>Free and open source · Apple silicon · macOS 14+</span>
              </div>
            </div>
            <HeroPill phase={hud.phase} index={hud.index} />
          </div>
        </section>

        <section className="film-strip" aria-label="Murmur at work, a 51-second film">
          <Film />
        </section>

        <div id="features">
          <Feature id="dictate" eyebrow="Dictation" title="Talk. It’s typed where your cursor is."
            scene={<DictateScene />}>
            <p>Hold <kbd>fn</kbd>, say it the way you’d say it to a person, and let go. Mail, Slack, Notes, a browser, a code editor: it works wherever you can type, recognised on your Mac in moments.</p>
            <p className="aside">Double-tap <kbd>fn</kbd> to talk hands-free. Quiet voice lifts soft speech for open offices and late nights.</p>
          </Feature>

          <Feature id="fit" eyebrow="Fits the sentence" badge="New" title="It writes like you’d type it there." flip
            scene={<FitScene />}>
            <p>Dictate into the middle of a sentence and Murmur adds the space, leaves out the capital and drops the full stop. Start a new sentence and it gets its capital. Only the spacing, the first letter and the last full stop change: never your words.</p>
          </Feature>

          <Feature id="cleanup" eyebrow="AI cleanup" badge="New · optional" title="The ums go. Your corrections stick."
            scene={<CleanupScene />}>
            <p>Turn on AI cleanup and Murmur takes out the ums and repeated words, keeps only what you meant when you correct yourself, sets out spoken lists, and writes casually in chats and formally in email.</p>
            <p className="aside">Off until you turn it on. It runs on your local model or your own Claude or OpenAI key, and if the model changes more than that, or takes over four seconds, your words go in exactly as heard.</p>
          </Feature>

          <Feature id="languages" eyebrow="Hinglish and 25 more" badge="Faster" title="Talk the way you actually talk." flip
            scene={<HinglishScene />}>
            <p>Mix Hindi and English as you like and it’s typed in English letters, now noticeably faster. Or pick English, or one of 25 European languages, recognised by Parakeet Ultra, which makes fewer mistakes in every one of them.</p>
            <p className="aside">Commands work in Hinglish too: “mujhe PDF kholkar do”.</p>
          </Feature>

          <Feature id="read" eyebrow="Ask about the screen" title="It reads, so you don’t have to."
            scene={<ScreenScene />}>
            <p>“Summarise this.” “What do they want from me, and by when?” “Explain this code.” Murmur reads the page, the email or the selection in front of you and answers in a panel beside your work. Select text and say “make this shorter” or “translate this” to rewrite it in place.</p>
          </Feature>

          <Feature id="tasks" eyebrow="Whole tasks" title="Hand it the whole job." flip
            scene={<TaskScene />}>
            <p>Ask for something with many parts. Murmur writes itself a task list and works through it in your apps and your own browser, the way you would, until every item is done.</p>
            <ul className="jobs">
              {jobs.map(([said, did]) => <li key={said}><q>{said}</q><span>{did}</span></li>)}
            </ul>
          </Feature>

          <div className="askfirst-row"><AskFirst /></div>

          <Feature id="search" eyebrow="File search" title="Describe the file. It opens."
            scene={<SearchScene />}>
            <p>Press <kbd>⇧</kbd><kbd>⌘</kbd><kbd>Space</kbd>, or just say “open my PAN card”. Murmur searches what’s inside your PDFs, documents, photos, audio and video, in the folders you choose, and Return opens the best match.</p>
          </Feature>

          <Feature id="button" eyebrow="The Murmur button" badge="New" title="Always one click away." flip
            scene={<ButtonScene />}>
            <p>A small Murmur pill sits on your screen. Drag it wherever it suits you and it stays there. Click it to open Murmur, or right-click to start dictating. Turn it off in Settings if you’d rather not see it.</p>
          </Feature>
        </div>

        <Section id="hears" title="Hears you better" lede="Small things that add up to fewer mistakes.">
          <MicCards />
        </Section>

        <Section id="keys" title="Four shortcuts. That’s all." lede="Hold fn and Murmur works out whether you’re writing or asking. Add one key when you want to decide. Every shortcut can be changed in Settings.">
          <KeysScene />
        </Section>

        <Section id="privacy" className="dark" title="Private by design" lede="Your voice and your files never leave your Mac. By default, nothing does.">
          <div className="privacy">
            <div>
              <h3>On your Mac</h3>
              <ul>{onMac.map(([title, text]) => <li key={title}><b>{title}.</b> {text}</li>)}</ul>
            </div>
            <div>
              <h3>Only if you choose</h3>
              <ul>{ifYouChoose.map(([title, text]) => <li key={title}><b>{title}.</b> {text}</li>)}</ul>
            </div>
          </div>
        </Section>

        <Section id="learns" title="It learns how you work">
          <div className="trio">
            {learns.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </Section>

        <Section id="install" title="Install in five minutes">
          <div className="install">
            <ol className="steps">
              {steps.map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}
            </ol>
            <div className="install-cta">
              <Bird />
              <DownloadButton />
              <span>Version {version}{sizeText ? ` · ${sizeText}` : ""}<br />Apple silicon · macOS 14 or later</span>
              <a className="small-link" href={releasesUrl}>Release notes and earlier versions</a>
              <a className="small-link" href={github}>Source code on GitHub</a>
            </div>
          </div>
        </Section>

        <Section id="questions" title="Questions">
          <div className="faq">
            {questions(sizeText).map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </Section>
      </main>

      <footer className="footer">
        <a className="brand" href="#top" aria-label="Murmur, home"><Bird mono /><span>Murmur</span></a>
        <p>A free, open-source voice assistant for your Mac.</p>
        <a className="ph-badge" href={productHunt} target="_blank" rel="noopener noreferrer">
          <img alt="Murmur - Talk to your Mac. A free, private voice assistant | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1280346&theme=light&t=1792047746820" />
        </a>
        <small>© 2026 Murmur · <a href={github}>GitHub</a></small>
      </footer>
    </>
  );
}
