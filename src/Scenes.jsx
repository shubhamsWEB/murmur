import { useEffect, useRef, useState } from "react";
import { Bird, Pill } from "./Bird";

// Each scene is a short loop of Murmur at work, played only while it's on screen. At rest (before it scrolls in,
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
    <div className={`win ${className}`}>
      <div className="win-bar">
        <span className="lights"><i /><i /><i /></span>
        <span className="win-title">{title}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

const Caret = () => <span className="caret" aria-hidden="true" />;

// What you said, as Murmur heard it: the serif is always the person's voice.
export function Said({ children, className = "" }) {
  return <p className={`said ${className}`}><Bird /><q>{children}</q></p>;
}

// Dictation: hold fn, talk, let go; the sentence lands where the cursor was.
export function DictateScene() {
  const [ref, step] = useTimeline([900, 2600, 700, 3000]);
  const pill = [null, ["listening", "Listening"], ["working", "Writing it down"], ["done", "Typed into Mail"]][step];
  return (
    <figure className="scene" ref={ref}>
      <Window title="New Message">
        <div className="mail-field"><span>To</span>Priya Shah</div>
        <div className="mail-field"><span>Subject</span>Thursday</div>
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
        <span className={`key-hint${step === 1 ? " down" : ""}`}><kbd>fn</kbd>{step === 1 ? " held" : ""}</span>
        <Pill state={pill?.[0] ?? "idle"} className={pill ? "" : "faded"}>{pill?.[1] ?? "Hold fn to talk"}</Pill>
      </div>
      <figcaption className="sr-only">Holding fn and saying “Thursday works for me, could you send the agenda before then?” types the sentence into the email being written.</figcaption>
    </figure>
  );
}

const rawWords = [
  ["Um,", "filler"], ["so", ""], ["let’s", ""], ["meet", ""], ["at", ""], ["5,", "fix"], ["no,", "fix"], ["6pm,", ""],
  ["and", ""], ["uh", "filler"], ["bring", ""], ["the", ""], ["the", "filler"], ["deck.", ""],
];

// AI cleanup: the ums go, the correction wins.
export function CleanupScene() {
  const [ref, step] = useTimeline([1500, 1900, 3600]);
  return (
    <figure className="scene" ref={ref}>
      <div className="cleanup">
        <p className="cleanup-label">You said</p>
        <p className={`raw${step >= 1 ? " marking" : ""}`}>
          {rawWords.map(([word, kind], i) => <span key={i} className={kind}>{word} </span>)}
        </p>
        <p className="cleanup-label">Typed</p>
        <p className={`clean${step === 2 ? " shown" : ""}`}>Let’s meet at 6pm, and bring the deck.</p>
        <p className="cleanup-meta">Murmur Cleanup, on this Mac, in a fraction of a second</p>
      </div>
      <figcaption className="sr-only">“Um, so let’s meet at 5, no, 6pm, and uh bring the the deck” becomes “Let’s meet at 6pm, and bring the deck.”</figcaption>
    </figure>
  );
}

// Reading a long document from the file: a page range, summarised beside it.
export function ReadScene() {
  const [ref, step] = useTimeline([2200, 900, 3800]);
  return (
    <figure className="scene" ref={ref}>
      <Window title="Field Notes on Cities.pdf, 470 pages" className="doc">
        <div className="doc-page">
          <p className="doc-head">Chapter one</p>
          {Array.from({ length: 9 }, (_, i) => <i key={i} className="doc-line" style={{ width: `${88 - (i % 4) * 9}%` }} />)}
        </div>
        <aside className={`answer${step === 2 ? " shown" : ""}${step === 1 ? " thinking" : ""}`}>
          <p className="answer-head"><Bird />Pages 1 to 22</p>
          <ul>
            <li>Cities grew fastest where rivers and roads met, not where land was cheapest.</li>
            <li>Most neighbourhoods kept their street plan for centuries, even after rebuilding.</li>
            <li>The author argues parks did more for health than early hospitals did.</li>
          </ul>
        </aside>
      </Window>
      <div className="scene-foot">
        <Said className={step >= 0 ? "shown" : ""}>Summarise pages one to twenty-two.</Said>
      </div>
      <figcaption className="sr-only">With a 470-page PDF open, saying “summarise pages one to twenty-two” shows a summary of those pages beside the document.</figcaption>
    </figure>
  );
}

const taskSteps = [
  "Find your resumes",
  "Ask which one",
  "Open the chat with Arjun on WhatsApp",
  "Attach Resume 2026.pdf",
  "Send after your yes",
];

// A whole task: a plan, a question halfway, your answer, and the rest done.
export function TaskScene() {
  // 0 plan · 1 found · 2 asks · 3 you answer · 4 chat · 5 attach · 6 done
  const [ref, step] = useTimeline([1300, 1300, 2000, 1700, 1100, 1100, 3600]);
  const done = [0, 1, 1, 2, 3, 4, 5][step];
  return (
    <figure className="scene" ref={ref}>
      <div className="task">
        <Said>Send my resume to Arjun on WhatsApp.</Said>
        <ol className="task-list">
          {taskSteps.map((text, i) => (
            <li key={text} className={i < done ? "done" : i === done && step < 6 ? "now" : ""}>
              <span className="box" aria-hidden="true" />{text}
            </li>
          ))}
        </ol>
        <div className={`ask${step >= 2 ? " shown" : ""}`}>
          <p className="ask-q"><Bird />I found two. Resume 2026.pdf or Resume (old).pdf?</p>
          <p className={`ask-a${step >= 3 ? " shown" : ""}`}><q>The latest one.</q></p>
        </div>
      </div>
      <div className="scene-foot">
        <span className="key-hint"><kbd>esc</kbd> stops it at any step</span>
        <Pill state={step === 6 ? "done" : step === 2 ? "idle" : "working"}>
          {step === 6 ? "Sent to Arjun" : step === 2 ? "Waiting for you" : "Working"}
        </Pill>
      </div>
      <figcaption className="sr-only">Murmur plans the task, asks which of two resumes to send, hears “the latest one”, then opens the WhatsApp chat, attaches the file and sends it.</figcaption>
    </figure>
  );
}

// File search by what's inside, photos included.
export function SearchScene() {
  const query = "my cat on the blue sofa";
  const [ref, step] = useTimeline([2200, 3600]);
  return (
    <figure className="scene" ref={ref}>
      <div className="search">
        <div className="search-box">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <span className={`typing${step === 0 ? " run" : ""}`}>{query}</span>
          <span className="search-keys"><kbd>⇧</kbd><kbd>⌘</kbd><kbd>space</kbd></span>
        </div>
        <ul className={`results${step === 1 ? " shown" : ""}`}>
          <li className="best">
            <span className="thumb photo" aria-hidden="true"><i /></span>
            <span><b>IMG_4021.HEIC</b><small>A grey cat asleep on a blue sofa</small></span>
          </li>
          <li>
            <span className="thumb photo two" aria-hidden="true"><i /></span>
            <span><b>IMG_3877.HEIC</b><small>Cat on a sofa cushion, evening light</small></span>
          </li>
          <li>
            <span className="thumb pdf" aria-hidden="true">PDF</span>
            <span><b>Sofa invoice.pdf</b><small>“…3-seater, colour: Blue Lagoon…”, page 1</small></span>
          </li>
        </ul>
      </div>
      <figcaption className="sr-only">Searching “my cat on the blue sofa” finds the photo of the cat first, then a similar photo and the sofa’s invoice.</figcaption>
    </figure>
  );
}

const macKeys = [
  [["fn"], "Hold to talk. Let go, and it’s typed or done."],
  [["fn", "fn"], "Double-tap for hands-free. Tap again to finish."],
  [["fn", "⇧"], "Only type what I say, never a command."],
  [["fn", "⌃"], "This is a command."],
  [["⇧", "⌘", "space"], "Search your files."],
  [["esc"], "Cancel dictation, or stop a command."],
];
const windowsKeys = [
  [["ctrl", "⊞"], "Hold to talk. Let go, and it’s typed or done."],
  [["ctrl", "⊞", "ctrl", "⊞"], "Double-tap for hands-free. Tap again to finish."],
  [["ctrl", "⊞", "shift"], "Only type what I say, never a command."],
  [["ctrl", "⊞", "alt"], "This is a command."],
  [["ctrl", "shift", "space"], "Search your files."],
  [["esc"], "Cancel dictation."],
];

function Keys({ keys }) {
  const tap = keys.length === 2 && keys[0] === keys[1];
  const twice = keys.length === 4 && keys[0] === keys[2];
  if (tap || twice) {
    const one = keys.slice(0, keys.length / 2);
    return <span className="keys">{one.map((k) => <kbd key={k}>{k}</kbd>)}<span className="times">twice</span></span>;
  }
  return <span className="keys">{keys.map((k, i) => <kbd key={`${k}${i}`}>{k}</kbd>)}</span>;
}

// The shortcuts, for the computer you choose.
export function Shortcuts({ initial = "mac" }) {
  const [os, setOs] = useState(initial);
  const rows = os === "mac" ? macKeys : windowsKeys;
  return (
    <div className="shortcuts">
      <div className="toggle" role="tablist" aria-label="Computer">
        {[["mac", "Mac"], ["windows", "Windows"]].map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={os === id} onClick={() => setOs(id)}>{label}</button>
        ))}
      </div>
      <dl className="key-table" role="tabpanel">
        {rows.map(([keys, text]) => (
          <div key={text}><dt><Keys keys={keys} /></dt><dd>{text}</dd></div>
        ))}
      </dl>
      <p className="note">Every shortcut can be changed in Settings. On a Mac the talk key can be fn, Right ⌥ or Right ⌘.</p>
    </div>
  );
}
