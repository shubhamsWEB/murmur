import { useEffect, useRef, useState } from "react";
import { Bird, Pill } from "./Bird";

// Each scene is a small loop of what Murmur does, played only while it's on screen. At rest (before it scrolls in,
// off screen, or with reduced motion) it shows its last step, so the page reads complete as a still.
function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function useTimeline(durations, still = durations.length - 1) {
  const ref = useRef(null);
  const [step, setStep] = useState(still);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !("IntersectionObserver" in window)) return undefined;
    let timer;
    let i = 0;
    let running = false;
    const tick = () => {
      setStep(i);
      timer = setTimeout(() => {
        i = (i + 1) % durations.length;
        tick();
      }, durations[i]);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        i = 0;
        tick();
      } else if (!entry.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
        setStep(still);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, step];
}

function Window({ title, children, className = "" }) {
  return (
    <div className={`window ${className}`}>
      <div className="window-bar">
        <span className="lights"><i /><i /><i /></span>
        <span className="window-title">{title}</span>
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}

const Caret = () => <span className="caret" aria-hidden="true" />;

// Dictation: hold fn, talk, let go; the sentence lands where the cursor was.
export function DictateScene() {
  const [ref, step] = useTimeline([900, 2600, 700, 2800]);
  const pill = [null, ["listening", "Listening"], ["working", "Writing it down"], ["done", "Typed into Mail"]][step];
  return (
    <figure className="scene" ref={ref}>
      <Window title="New Message">
        <div className="mail-field"><span>To</span>Priya Shah</div>
        <div className="mail-field"><span>Subject</span>Agenda for Thursday</div>
        <div className="mail-body">
          <p>Hi Priya,</p>
          <p>
            {step === 3
              ? <span className="arrive">Thursday works for me. Could you send the agenda before then?</span>
              : <Caret />}
          </p>
        </div>
      </Window>
      <div className="scene-foot">
        <span className={`key-hint${step === 1 ? " down" : ""}`}><kbd>fn</kbd>{step === 1 ? "held" : ""}</span>
        <Pill state={pill?.[0] ?? "idle"} className={pill ? "" : "faded"}>{pill?.[1] ?? "Hold fn to talk"}</Pill>
      </div>
      <figcaption className="sr-only">Holding fn and saying “Thursday works for me, could you send the agenda before then?” types the sentence into the email being written.</figcaption>
    </figure>
  );
}

// Fit to the sentence: dictating into the middle of a line comes out lowercase, spaced, with no stray full stop.
export function FitScene() {
  const [ref, step] = useTimeline([1300, 1500, 3000]);
  return (
    <figure className="scene" ref={ref}>
      <Window title="Notes">
        <p className="note-line">
          I think {step === 2 ? <mark className="arrive fit">tomorrow </mark> : <Caret />}works for me.
        </p>
        <p className="note-line muted">Let me know if not.</p>
      </Window>
      <div className="scene-foot">
        <div className={`said${step >= 1 ? " shown" : ""}`}><Bird /><q>Tomorrow.</q></div>
        <span className={`fit-label${step === 2 ? " shown" : ""}`}>Space added · no capital · no full stop</span>
      </div>
      <figcaption className="sr-only">Saying “Tomorrow.” with the cursor in the middle of “I think works for me.” inserts “tomorrow ” in lowercase, without a full stop.</figcaption>
    </figure>
  );
}

const rawWords = [
  ["Um,", "filler"], ["so", ""], ["let’s", ""], ["meet", ""], ["at", ""], ["5,", "fix"], ["no,", "fix"], ["6pm,", ""],
  ["and", ""], ["uh", "filler"], ["bring", ""], ["the", ""], ["deck.", ""],
];

// AI cleanup: the ums go, the correction wins, and the style fits the app.
export function CleanupScene() {
  const [ref, step] = useTimeline([1500, 1900, 3400]);
  return (
    <figure className="scene" ref={ref}>
      <div className="cleanup">
        <p className="cleanup-label">What you said</p>
        <p className={`raw${step >= 1 ? " marking" : ""}`}>
          {rawWords.map(([word, kind], i) => <span key={i} className={kind}>{word} </span>)}
        </p>
        <div className={`cleanup-out${step === 2 ? " shown" : ""}`}>
          <div>
            <p className="cleanup-label">In WhatsApp · Very casual</p>
            <p className="out">so let’s meet at 6pm and bring the deck</p>
          </div>
          <div>
            <p className="cleanup-label">In Mail · Formal</p>
            <p className="out">So, let’s meet at 6pm and bring the deck.</p>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">“Um, so let’s meet at 5, no, 6pm, and uh bring the deck.” becomes “so let’s meet at 6pm and bring the deck” in WhatsApp and “So, let’s meet at 6pm and bring the deck.” in Mail.</figcaption>
    </figure>
  );
}

// Hinglish: spoken the way you talk, typed in English letters.
export function HinglishScene() {
  const [ref, step] = useTimeline([1200, 2200, 3000]);
  return (
    <figure className="scene" ref={ref}>
      <Window title="Arjun" className="chat">
        <p className="bubble in">Kal ka plan kya hai?</p>
        {step === 2 && <p className="bubble out arrive">Kal subah 9 baje call karte hain, theek hai? Main agenda bhej deta hoon.</p>}
        <div className="chat-input">{step === 2 ? <span className="muted">Message</span> : <><Caret /><span className="muted">Message</span></>}</div>
      </Window>
      <div className="scene-foot">
        <Pill state={["idle", "listening", "done"][step]} className={step === 0 ? "faded" : ""}>
          {["Hinglish", "Listening", "Typed"][step]}
        </Pill>
      </div>
      <figcaption className="sr-only">Saying “Kal subah 9 baje call karte hain, theek hai? Main agenda bhej deta hoon.” in Hinglish types it into the chat in English letters.</figcaption>
    </figure>
  );
}

// Ask about what's on screen: the answer shows beside the page.
export function ScreenScene() {
  const [ref, step] = useTimeline([1200, 1600, 3600]);
  return (
    <figure className="scene" ref={ref}>
      <Window title="The four-day week, two years on" className="article">
        <div className="article-body">
          <p className="article-title">The four-day week, two years on</p>
          {Array.from({ length: 9 }, (_, i) => <span key={i} className="line" style={{ width: `${[96, 92, 88, 97, 70, 94, 90, 85, 60][i]}%` }} />)}
        </div>
        <aside className={`answer${step === 2 ? " shown" : ""}`}>
          <p className="answer-head"><Bird />Summary</p>
          <ul>
            <li>Most companies in the trial kept it.</li>
            <li>People took fewer sick days.</li>
            <li>Output held steady in most teams.</li>
          </ul>
        </aside>
      </Window>
      <div className="scene-foot">
        <div className={`said${step >= 1 ? " shown" : ""}`}><Bird /><q>Summarise this.</q></div>
      </div>
      <figcaption className="sr-only">Saying “Summarise this” on a long article shows a three-line summary in a panel beside it.</figcaption>
    </figure>
  );
}

const taskSteps = [
  "Open Gmail in your browser",
  "Open each of the 9 unread emails",
  "Note who is asking you for something",
  "Go back to the inbox after each one",
  "Tell you which ones need a reply",
];

// A whole job: the list ticks itself off, then the answer appears.
export function TaskScene() {
  const durations = [...taskSteps.map(() => 900), 3600];
  const [ref, step] = useTimeline(durations);
  const done = step;
  const finished = step === taskSteps.length;
  return (
    <figure className="scene" ref={ref}>
      <div className="taskrun">
        <div className="taskrun-ask"><Bird /><q>Go through my unread emails and tell me which ones need a reply.</q></div>
        <ol>
          {taskSteps.map((item, i) => (
            <li key={item} className={i < done ? "done" : i === done ? "now" : ""}><span className="box" aria-hidden="true" />{item}</li>
          ))}
        </ol>
        <p className={`taskrun-answer${finished ? " shown" : ""}`}>
          <b>3 need a reply.</b> Your bank wants a signed form by Friday. Neha asked if Saturday works. The landlord sent the new lease to review.
        </p>
      </div>
    </figure>
  );
}

export function AskFirst() {
  return (
    <figure className="askfirst">
      <div className="askfirst-panel" aria-hidden="true">
        <p className="askfirst-title"><Bird />Send this to Arjun on WhatsApp?</p>
        <p className="askfirst-detail">“Running 10 minutes late, start without me.”</p>
        <div className="askfirst-buttons"><span>Cancel</span><span>Allow</span><span className="primary">Allow for This Task</span></div>
      </div>
      <figcaption><b>You stay in charge.</b> Before it sends, deletes or runs a script, Murmur asks: once, for the whole task, or always. Anything that pays always asks.</figcaption>
    </figure>
  );
}

const query = "the clause about pets in the lease";

// File search: describe it, and the passage comes up.
export function SearchScene() {
  const [ref, step] = useTimeline([700, 2000, 3600]);
  return (
    <figure className="scene" ref={ref}>
      <div className="search">
        <div className="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg>
          <span className={`search-query${step === 1 ? " typing" : ""}`} style={{ "--chars": query.length }}>
            {step === 0 ? <span className="muted">Describe a file…</span> : query}
          </span>
          <span className="search-keys"><kbd>⇧</kbd><kbd>⌘</kbd><kbd>Space</kbd></span>
        </div>
        <ul className={`results${step === 2 ? " shown" : ""}`}>
          <li className="top"><span className="file pdf">PDF</span><div><b>Lease 2025.pdf</b><span>“…no pets may be kept without the landlord’s written consent…” · page 4</span></div></li>
          <li><span className="file doc">DOC</span><div><b>House rules.docx</b><span>Pets, parking and visitors</span></div></li>
          <li><span className="file pdf">PDF</span><div><b>Lease 2024.pdf</b><span>Last year’s lease, clause 14</span></div></li>
        </ul>
      </div>
      <figcaption className="sr-only">Searching for “the clause about pets in the lease” finds Lease 2025.pdf and shows the matching passage on page 4.</figcaption>
    </figure>
  );
}

// The Murmur button: drag it anywhere; a click opens Murmur.
export function ButtonScene() {
  const [ref, step] = useTimeline([1200, 1700, 700, 3200]);
  const moved = step >= 1;
  return (
    <figure className="scene" ref={ref}>
      <div className={`desktop step-${step}`}>
        <div className="desk-window" />
        <div className={`murmur-window${step === 3 ? " shown" : ""}`}>
          <div className="window-bar"><span className="lights"><i /><i /><i /></span><span className="window-title">Murmur</span></div>
          <div className="mw-body">
            <p className="mw-head">This week</p>
            <p className="mw-stat"><b>2,140</b> words dictated</p>
            <p className="mw-stat"><b>38</b> commands done</p>
          </div>
        </div>
        <div className={`float-button${moved ? " moved" : ""}`}><Bird /></div>
        <div className={`cursor${moved ? " moved" : ""}${step === 2 ? " click" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.5 1.5L9 19z" /></svg>
        </div>
        <div className="dock"><i /><i /><i /><i /><i /><i /></div>
      </div>
      <figcaption className="sr-only">The Murmur button is dragged from the bottom of the screen to the top right, and a click on it opens Murmur’s window.</figcaption>
    </figure>
  );
}

// Hearing you better: the Mac's microphone over AirPods, no cut-off first word, and saying when it hears nothing.
export function MicCards() {
  const [ref, step] = useTimeline([1300, 2600]);
  return (
    <div className="mic-cards" ref={ref}>
      <div className="mic-card">
        <div className="mic-visual">
          <span className="mic-option off">AirPods Pro<small>Bluetooth · phone-call sound</small></span>
          <span className="mic-option on">MacBook Pro Microphone<small>Chosen automatically</small></span>
        </div>
        <h3>The Mac’s mic, not your AirPods</h3>
        <p>AirPods drop to phone-call sound while their microphone is on. Murmur listens with the Mac’s own, and your music keeps sounding right.</p>
      </div>
      <div className="mic-card">
        <div className="mic-visual">
          <Pill state={step === 0 ? "working" : "listening"}>{step === 0 ? "Starting the microphone…" : "Listening"}</Pill>
        </div>
        <h3>No cut-off first words</h3>
        <p>A Bluetooth mic takes a moment to wake. The pill says so until it’s really listening, so your first word isn’t lost.</p>
      </div>
      <div className="mic-card">
        <div className="mic-visual">
          <Pill state="problem">No sound from USB Mic</Pill>
        </div>
        <h3>Says when it can’t hear you</h3>
        <p>A muted or wrong microphone gets named, with a pointer to choose another, instead of a vague “didn’t catch that”.</p>
      </div>
    </div>
  );
}

const keyRows = [
  { keys: ["fn"], name: "Talk", what: "Hold and speak. Let go and it’s typed, or done if you asked for something. Double-tap for hands-free.", pill: ["listening", "Listening"] },
  { keys: ["fn", "⇧"], name: "Only type", what: "Always typed where your cursor is, never run as a command.", pill: ["listening", "Typing only"] },
  { keys: ["fn", "⌃"], name: "Only a command", what: "Always carried out, never typed.", pill: ["listening", "Command · let go when done"] },
  { keys: ["⇧", "⌘", "Space"], name: "Search files", what: "Describe a file; Return opens the best match.", pill: ["idle", "Describe a file…"] },
];

// The four shortcuts, each lighting up in turn with what the pill says.
export function KeysScene() {
  const [ref, step] = useTimeline([2400, 2400, 2400, 2400], 0);
  return (
    <div className="keys" ref={ref}>
      <ul>
        {keyRows.map((row, i) => (
          <li key={row.name} className={i === step ? "active" : ""}>
            <span className="combo">{row.keys.map((k) => <kbd key={k}>{k}</kbd>)}</span>
            <span><b>{row.name}.</b> {row.what}</span>
          </li>
        ))}
      </ul>
      <div className="keys-screen" aria-hidden="true">
        <div className="desk-window" />
        <Pill state={keyRows[step].pill[0]}>{keyRows[step].pill[1]}</Pill>
      </div>
    </div>
  );
}
