import { useEffect, useRef, useState } from "react";
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

// Murmur's Product Hunt page: a quiet line above the page, and the official badge in the footer.
const productHunt = "https://www.producthunt.com/products/murmur-18?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-murmur-27023602-121b-4eab-968c-bfa99febae2b";

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
  { said: "it reads for you", result: "Summarised 9 unread emails" },
  { said: "it does the job", result: "Sent on WhatsApp to Arjun" },
  { said: "pdf kholo", result: "Opened Lease 2025.pdf" },
  { said: "stays on your mac", result: "Done on this Mac" },
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

// The launch film, between the overview and the rest: a poster with a play button until it's started, then the
// player's own controls.
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

// The problem: a Mac does nothing until your hands do it.
const chores = [
  ["Typing every email, message and note by hand.", "Say it. It’s typed where your cursor is, in any app, faster than you can type."],
  ["Reading a long page, thread or inbox to find the one thing that matters.", "Ask “summarise this” or “which emails need a reply?” and get the answer."],
  ["Clicking through five apps and tabs to do one small job.", "Ask once. Murmur opens, reads, clicks and types until the job is done."],
  ["Digging through folders for a file you saw last month.", "Describe it, “the clause about pets in the lease”, and it opens."],
  ["Switching to the phone to send a quick message.", "“Text Neha I’m on my way.” Sent from your Mac, after you see the words."],
];

function Chores() {
  return (
    <div className="chores">
      <p className="chores-head"><span>Without Murmur</span><span>With Murmur</span></p>
      <ul>
        {chores.map(([before, after]) => (
          <li key={before}><span className="before">{before}</span><span className="after">{after}</span></li>
        ))}
      </ul>
    </div>
  );
}

const glance = [
  { title: "Dictate", said: "Running late, start without me.", what: "Speak in any app, in English, Hinglish or 25 other languages. It’s typed where the cursor is.", href: "#call" },
  { title: "Rewrite", said: "Make this sound friendlier.", what: "Select text and say what to do: shorten, fix, translate, reply.", href: "#call" },
  { title: "Read and summarise", said: "Summarise this article.", what: "Ask about the page, email, code or file in front of you.", href: "#read" },
  { title: "Do whole tasks", said: "Go through my unread emails.", what: "It makes a task list and works through your apps until it’s done.", href: "#tasks" },
  { title: "Use the web", said: "Find running shoes on Flipkart.", what: "Opens sites, searches them, clicks, scrolls and reads, in your own browser.", href: "#tasks" },
  { title: "Message people", said: "WhatsApp Arjun the meeting link.", what: "WhatsApp, Messages and Slack. You see the exact words before it sends.", href: "#uses" },
  { title: "Find files", said: "Photos from the Coorg trip.", what: "Searches PDFs, documents, photos, audio and video by what’s inside.", href: "#marks" },
  { title: "Remember", said: "Priya is my manager, on Slack.", what: "Tell it once and it uses it everywhere. You can see and forget anything.", href: "#learns" },
];

function Glance() {
  return (
    <section className="glance" id="what" aria-label="What Murmur does">
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

// Asking about what's on the screen: where you are, what you say, what Murmur shows.
const exchanges = [
  ["Safari, a long article", "Summarise this.", "A short summary in a panel beside your work. Nothing is typed."],
  ["Gmail, an open email", "What do they want from me, and by when?", "The ask and the deadline, in two lines."],
  ["VS Code, a function selected", "Explain this code.", "What it does, step by step, and anything that looks wrong."],
  ["Anywhere", "What’s on my calendar tomorrow?", "Every event from all your calendar accounts, in order."],
  ["A message in another language, selected", "Translate this into English.", "Replaced in place, ready to send."],
  ["Anywhere", "What did I send Neha yesterday?", "Found in Murmur’s memory of your commands, on this Mac."],
];

function Exchanges() {
  return (
    <ul className="exchanges">
      {exchanges.map(([where, said, shown]) => (
        <li key={said}>
          <span className="where">{where}</span>
          <q>{said}</q>
          <p>{shown}</p>
        </li>
      ))}
    </ul>
  );
}

// A big request, worked through like a person would: the list ticks itself off, then the answer appears.
const taskSteps = [
  "Open Gmail in your browser",
  "Open each of the 9 unread emails",
  "Note who is asking you for something",
  "Go back to the inbox after each one",
  "Tell you which ones need a reply",
];

function TaskRun() {
  const [tick, setTick] = useState(taskSteps.length + 3);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    let n = 0;
    setTick(0);
    const timer = setInterval(() => {
      n = n >= taskSteps.length + 4 ? 0 : n + 1;
      setTick(n);
    }, 1100);
    return () => clearInterval(timer);
  }, []);
  const done = Math.min(tick, taskSteps.length);
  const finished = tick >= taskSteps.length;
  return (
    <figure className="taskrun">
      <div className="taskrun-ask"><Bird /><q>Go through my unread emails and tell me which ones need a reply.</q></div>
      <p className="taskrun-label">Murmur’s task list</p>
      <ol>
        {taskSteps.map((step, i) => (
          <li key={step} className={i < done ? "done" : i === done ? "now" : ""}>
            <span className="box" aria-hidden="true" />{step}
          </li>
        ))}
      </ol>
      <div className={`taskrun-answer${finished ? " shown" : ""}`}>
        <b>3 need a reply.</b> Your bank wants a signed form by Friday. Neha asked if Saturday works. The landlord sent the new lease to review.
      </div>
      <figcaption>It plans, works through every item, keeps notes, and goes back when something is in the way. It stops only when the list is done.</figcaption>
    </figure>
  );
}

function GoAhead() {
  return (
    <figure className="goahead">
      <div className="goahead-panel" aria-hidden="true">
        <p className="goahead-title"><Bird />Send this to Arjun on WhatsApp?</p>
        <p className="goahead-detail">“Running 10 minutes late, start without me.”</p>
        <div className="goahead-buttons">
          <span>Cancel</span><span>Allow</span><span className="primary">Allow for This Task</span><span>Always Allow Messages</span>
        </div>
      </div>
      <figcaption>
        <b>You stay in charge.</b> Before it sends, deletes or runs a script, Murmur asks: once, for the whole task, or never again for that kind of thing. Anything that pays or moves money always asks.
      </figcaption>
    </figure>
  );
}

const jobs = [
  ["Open saleshq.ai and summarise what they do.", "Opens the site, reads it top to bottom, and tells you."],
  ["Find running shoes on Flipkart and open the cheapest.", "Searches the site, compares the results, opens the one."],
  ["Open Notes and write a packing list for Goa.", "Opens Notes and writes the list into a new note."],
  ["Build a React app with a login page.", "Starts Claude Code or Codex on it, in a new project folder."],
];

// A day of observations: when, where, what was said, what Murmur did.
const notes = [
  ["08:40", "Mail, replying", "Thursday works for me, could you send the agenda?", "Typed it into the reply, where the cursor was."],
  ["09:15", "Anywhere", "Go through my unread emails and tell me what needs a reply.", "Read all nine and listed the three that do, with who and why."],
  ["10:05", "Anywhere, in Hinglish", "Mera PAN card kholo.", "Found it among your documents and opened it."],
  ["11:40", "Safari, a long article", "Summarise this.", "Five lines in a panel. Nothing typed."],
  ["13:10", "Anywhere", "Send Arjun a message on WhatsApp saying I’ll be 10 minutes late.", "Showed the exact words, sent them after a yes, and checked they went."],
  ["15:30", "Search, ⇧⌘Space", "The clause about pets in the lease.", "Found the lease and the passage that matched."],
  ["17:05", "Finder, a folder of videos", "Play the second one.", "Played the second video in that window."],
  ["18:45", "Anywhere", "Build a React app with a login page.", "Started Claude Code on it in a new project folder."],
  ["21:00", "Anywhere", "Remember that Priya is my manager, on Slack.", "Now “message my manager” goes to Priya on Slack, every time."],
];

// Who it helps, and what they say to it.
const uses = [
  {
    title: "If you write all day",
    problem: "Emails, Slack, docs, tickets: your thoughts are faster than your fingers.",
    says: ["Thanks, I’ll send the deck by Monday.", "Make this sound friendlier.", "Reply to this saying yes."],
  },
  {
    title: "If your inbox runs your day",
    problem: "Too much to read, and the one thing that matters is buried.",
    says: ["Which emails need a reply?", "Summarise the email from HDFC.", "What’s on my calendar tomorrow?"],
  },
  {
    title: "If you live in chats",
    problem: "A quick message shouldn’t mean finding the app, the person and the box.",
    says: ["Text Neha I’m on my way.", "WhatsApp Arjun the meeting link.", "Tell the team on Slack I’m off tomorrow."],
  },
  {
    title: "If you can never find the file",
    problem: "You remember what was in it, not what you called it or where you put it.",
    says: ["Open my resume.", "The Amazon invoice from March.", "Photos from the Coorg trip."],
  },
  {
    title: "If you build software",
    problem: "Context switching between the editor, the browser and the agent.",
    says: ["Explain this error.", "Ask Claude to add tests for this.", "Open the murmur repo in VS Code."],
  },
  {
    title: "If you think in Hinglish",
    problem: "Most assistants want pure English. You don’t talk that way.",
    says: ["Mujhe PDF kholkar do.", "Arjun ko message karo ki main late hoon.", "Kal subah 9 baje call karte hain."],
  },
];

function Uses() {
  return (
    <div className="uses">
      {uses.map((use) => (
        <article key={use.title}>
          <h3>{use.title}</h3>
          <p>{use.problem}</p>
          <ul>{use.says.map((said) => <li key={said}><q>{said}</q></li>)}</ul>
        </article>
      ))}
    </div>
  );
}

const learns = [
  ["Memory", "Tell it once: “Priya is my manager, on Slack”, “open links in Chrome”, “keep my replies short”. It also notices who you message where, and follows on from your last command: after a message to Arjun, “and ask when he’s back” just works. The Memory page shows everything, each line with an × to forget it."],
  ["Skills", "Teach the agent how you want things done, in the same SKILL.md format Claude uses. Murmur comes with a skill for working carefully on your Mac (look, act, check it worked) and one for Cua Driver. Add any skill from a GitHub link, or write your own."],
  ["Permissions", "Allow once, for this task, or always: the same choices Claude gives you. Settings shows what’s always allowed and takes it back. Money always asks."],
];

const steps = [
  ["Open the download and drag Murmur to Applications.", "If macOS says it can’t verify Murmur, open System Settings → Privacy & Security and click Open Anyway. You only do this once."],
  ["Choose how you speak.", "English, Hinglish (Hindi and English mixed, typed in English letters) or 25 other languages. Only the model you pick is downloaded."],
  ["Allow the microphone and Accessibility.", "Accessibility is what lets Murmur type into other apps and press buttons for you."],
  ["Choose the folders Murmur may search.", "The first index takes a while. Murmur shows its progress, and you can search as it goes."],
  ["Pick how commands are planned.", "Install Ollama for a free local model, or add your own Claude or OpenAI key. Dictation, search and quick commands work without either."],
];

const questions = (sizeText) => [
  ["Does Murmur listen all the time?", "No. It listens only while you hold fn, or after you double-tap fn for hands-free, until you tap again. Esc cancels."],
  ["How does it tell a command from dictation?", "Typing is the default. Known commands like “open Slack” or “PDF kholo” run at once; an instruction said where you can’t type is treated as a command. Hold ⌃ with fn, or start with “Murmur…”, to always mean a command."],
  ["Can it really do things on its own?", "Yes, with your OK. It opens apps and websites, reads them, clicks, types and works through a task list until the job is done. Before it sends a message, deletes something or runs a script, it asks: once, for the whole task, or always. Anything that pays always asks."],
  ["Which languages does it understand?", "Dictation: English, Hinglish (typed in English letters) and 25 European languages. Commands: English and Hinglish, so “mujhe PDF kholkar do” works as well as “open the PDF”."],
  ["Do I need an AI subscription?", "No. Dictation, file search and quick commands like “open Slack” or “volume 30” need nothing. For everything else, use a free local model through Ollama, or your own Claude or OpenAI key, which handles long tasks best."],
  ["Is it really free?", "Yes. Speech recognition and file search run on your Mac. A cloud model for commands is optional and uses your own API key."],
  ["What does it need?", `A Mac with Apple silicon on macOS 14 or later. The app is ${sizeText ? `a ${sizeText}` : "a small"} download; the speech and search models download on first launch.`],
];

const links = [["#what", "What it does"], ["#tasks", "Tasks"], ["#uses", "Use cases"], ["#range", "Privacy"], ["#install", "Install"]];

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
        <span>Murmur is live on Product Hunt.</span>
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
          <h1 className="sr-only">Murmur: talk to your Mac. It types for you, reads and summarises for you, and carries out whole tasks across your apps and the web, in English or Hinglish. Your voice never leaves your Mac.</h1>
          <Flock phrases={heroPhrases} onPhase={(phase, index) => setHud({ phase, index })} />
          <div className="hero-foot">
            <div className="specimen">
              <p className="specimen-name">Murmur <i>voice assistant for Mac</i></p>
              <p>Hold <kbd>fn</kbd> and say what you need. Murmur types it in any app, reads and summarises what’s on your screen, finds your files, messages people and carries out whole tasks across your apps and the web. In English, Hinglish and 25 other languages, and your voice never leaves your Mac.</p>
              <div className="specimen-actions">
                <DownloadButton />
                <span>Free, for Apple silicon Macs on macOS 14 or later.</span>
              </div>
            </div>
            <Hud phase={hud.phase} index={hud.index} />
          </div>
        </section>

        <Glance />

        <section className="film-strip" aria-label="Murmur at work, a 51-second film">
          <Film />
        </section>

        <Plate id="why" title="Less clicking, more done" kicker="The problem it solves.">
          <p className="lede">Your Mac can do almost anything, but only once your hands have done every step. Murmur turns “I need to…” into done.</p>
          <Chores />
        </Plate>

        <Plate id="call" title="Dictate in any app" kicker="Hold fn, speak, let go.">
          <p className="lede">Hold <kbd>fn</kbd> and say it the way you would to a person. Let go, and it’s typed where your cursor is, in any app.</p>
          <Sonogram />
          <ul className="asides">
            <li>Pick how you speak: English, Hinglish (Hindi and English mixed, typed in English letters) or 25 other languages. All recognised on your Mac.</li>
            <li>Double-tap <kbd>fn</kbd> to keep talking hands-free. Quiet Voice lifts soft speech, for open offices and late nights.</li>
            <li>Select some text first and say “make this shorter”, “translate this to Hindi” or “reply to this”.</li>
          </ul>
        </Plate>

        <Plate id="read" title="Ask about anything on screen" kicker="It reads, so you don’t have to.">
          <p className="lede">Murmur sees what you’re looking at: the page, the email, the selected code, the file in Finder. Ask about it, and the answer appears beside your work.</p>
          <Exchanges />
        </Plate>

        <Plate id="tasks" title="Hand it the whole job" kicker="Across your apps and the web.">
          <p className="lede">Ask for something with many parts. Murmur writes itself a task list and works through it in your apps and your own browser, the way you would, until every item is done.</p>
          <div className="tasks">
            <TaskRun />
            <GoAhead />
          </div>
          <ul className="jobs">
            {jobs.map(([said, did]) => <li key={said}><q>{said}</q><span>{did}</span></li>)}
          </ul>
        </Plate>

        <Plate id="behaviour" title="A day with Murmur" kicker="Real requests, from one day." wide>
          <p className="lede">Dictation, reading, messages, files, tasks and coding, all from the same key.</p>
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

        <Plate id="uses" title="Made for how you work" kicker="Who it helps, and what they say.">
          <Uses />
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

        <Plate id="learns" title="It learns how you work" kicker="Memory, skills and permissions.">
          <div className="trio">
            {learns.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
        </Plate>

        <Plate id="range" title="Private by design" kicker="What stays on your Mac, and what can leave.">
          <p className="lede">Your voice and your files never leave your Mac. Commands are planned by a local model in Ollama, so by default nothing leaves at all. Add your own Claude or OpenAI key and only the command, and what Murmur reads to carry it out, goes to that provider.</p>
          <figure className="range">
            <RangeMap />
            <figcaption><span><b>How to read this:</b> hatched: lives on your Mac. Dotted: visited only if you add a key, and only with a command and what Murmur reads to do it (a page, an email, the selected text).</span></figcaption>
          </figure>
        </Plate>

        <Plate id="install" title="Install in five steps" kicker="About five minutes.">
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
        <a className="ph-badge" href={productHunt} target="_blank" rel="noopener noreferrer">
          <img alt="Murmur - Talk to your Mac. A free, private voice assistant | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1280346&theme=light&t=1792047746820" />
        </a>
        <small>© 2026 Murmur</small>
      </footer>
    </>
  );
}
