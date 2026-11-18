import { useEffect, useRef, useState } from "react";
import { Bird, Pill } from "./Bird";
import { Cut, Hi, Note } from "./Collage";
import { Face, people } from "./Meetings";
import { heroModes } from "./content";

// The top of the page. The headline's last word and the demo beside it change together: what you say, and what
// Murmur does with it, five ways. It plays by itself while it's on screen; a tab picks one and stops the tour.
// Before the page's script runs, and for people who've asked for less motion, it shows the first one, finished.

function useOnScreen(ref) {
  const [seen, setSeen] = useState(true);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return undefined;
    const watch = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), { threshold: 0.2 });
    watch.observe(ref.current);
    return () => watch.disconnect();
  }, [ref]);
  return seen;
}

function useTyped(text, key, on) {
  const [count, setCount] = useState(text.length);
  useEffect(() => {
    if (!on) { setCount(text.length); return undefined; }
    setCount(0);
    const timer = setInterval(() => setCount((c) => {
      if (c >= text.length) { clearInterval(timer); return c; }
      return c + 1;
    }), 26);
    return () => clearInterval(timer);
  }, [text, key, on]);
  return text.slice(0, count);
}

const Bar = ({ title }) => (
  <div className="win-bar"><span className="lights"><i /><i /><i /></span><span className="win-title">{title}</span></div>
);

function TypeSurface({ done }) {
  return (
    <div className="win hd-win">
      <Bar title="Slack, #launch" />
      <div className="win-body hd-chat">
        <p className="hd-msg"><b>Priya</b>Standup in five. Is everyone here?</p>
        <p className="hd-msg"><b>Arjun</b>I’m in.</p>
        <p className="hd-compose">
          {done ? <span className="arrive">Running ten minutes late, start without me.</span> : <span className="caret" />}
        </p>
      </div>
    </div>
  );
}

function AskSurface({ phase }) {
  return (
    <div className="win hd-win doc">
      <Bar title="Mail, from Priya Shah" />
      <div className="win-body">
        <div className="doc-page">
          <p className="doc-head">The Q3 deck</p>
          {Array.from({ length: 8 }, (_, i) => <i key={i} className="doc-line" style={{ width: `${90 - (i % 4) * 11}%` }} />)}
        </div>
        <aside className={`answer${phase === 2 ? " shown" : ""}${phase === 1 ? " thinking" : ""}`}>
          <p className="answer-head"><Bird />What she needs</p>
          <ul>
            <li>The Q3 deck, with the new pricing slide.</li>
            <li>By Friday at 5, before the board call.</li>
            <li>A yes or no on the launch date.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

const jobSteps = ["Find your resume", "Open the chat with Arjun", "Attach Resume 2026.pdf", "Show you the message", "Send after your yes"];

function DoSurface({ phase, still }) {
  const [n, setN] = useState(jobSteps.length);
  useEffect(() => {
    if (still) { setN(jobSteps.length); return undefined; }
    if (phase < 2) { setN(0); return undefined; }
    const timer = setInterval(() => setN((v) => Math.min(jobSteps.length, v + 1)), 720);
    return () => clearInterval(timer);
  }, [phase, still]);
  return (
    <div className="task hd-task">
      <ol className="task-list">
        {jobSteps.map((text, i) => (
          <li key={text} className={i < n ? "done" : i === n && phase === 2 ? "now" : ""}><span className="box" aria-hidden="true" />{text}</li>
        ))}
      </ol>
      <p className="hd-esc"><kbd>esc</kbd> stops it at any step</p>
    </div>
  );
}

function MeetSurface({ phase }) {
  return (
    <div className="hd-meet">
      <div className="hd-call">
        <div className="hd-tiles">
          {people.slice(0, 2).map((person) => (
            <div key={person.name} className={`hd-tile${person.name === "Priya" ? " speaking" : ""}`}>
              <Face person={person} /><span className="hd-name">{person.name}</span>
            </div>
          ))}
        </div>
        <p className="hd-caption"><b>Priya</b>How would you rate-limit the public API?</p>
      </div>
      <div className="hd-panel">
        <p className="hd-panel-head"><span className="mm-dot" />Meeting notes</p>
        {phase < 2 ? <p className="hd-wait">{phase === 1 ? "Drafting an answer…" : "Listening to the call"}</p> : (
          <div className="hd-answer">
            <p className="hd-panel-line">I’d use a token bucket per API key, kept in Redis.</p>
            <ul>
              <li>Each key refills at a fixed rate.</li>
              <li>Out of tokens: 429, with Retry-After.</li>
            </ul>
          </div>
        )}
        <p className="hd-hidden">Hidden from the screen share</p>
      </div>
    </div>
  );
}

const cards = [["Priya Shah", "Your manager. On Slack."], ["Asked of you", "The Q3 deck, by Friday."], ["Coming up", "Flight to Raipur, Sun 10:15."]];

function RecallSurface({ phase }) {
  return (
    <div className="hd-recall">
      <ul className={`hd-cards${phase >= 1 ? " picked" : ""}`}>
        {cards.map(([title, text]) => <li key={title} className="hd-card"><b>{title}</b><span>{text}</span></li>)}
      </ul>
      <p className={`hd-reply${phase === 2 ? " shown" : ""}`}><Bird />Sunday at 10:15, from Bengaluru, Terminal 1. Check-in closes at 09:15.</p>
    </div>
  );
}

export default function Hero({ stamp, actions, meta }) {
  const stage = useRef(null);
  const seen = useOnScreen(stage);
  const [mode, setMode] = useState(0);
  const [phase, setPhase] = useState(2); // 0 you say it · 1 Murmur works · 2 it's done
  const [auto, setAuto] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStill(false);
    setAuto(true);
    setPhase(0);
  }, []);

  const current = heroModes[mode];
  const total = 800 + current.said.length * 26 + 900 + (current.hold || 4600);
  useEffect(() => {
    if (still || !seen) return undefined;
    if (phase === 2 && !auto) return undefined;
    const wait = phase === 0 ? 800 + current.said.length * 26 : phase === 1 ? 900 : current.hold || 4600;
    const timer = setTimeout(() => {
      if (phase < 2) setPhase(phase + 1);
      else { setMode((mode + 1) % heroModes.length); setPhase(0); }
    }, wait);
    return () => clearTimeout(timer);
  }, [mode, phase, auto, still, seen, current]);

  const pick = (i) => { setMode(i); setPhase(still ? 2 : 0); setAuto(false); };
  const keys = (event) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (mode + step + heroModes.length) % heroModes.length;
    pick(next);
    document.getElementById(`hero-tab-${heroModes[next].id}`)?.focus();
  };
  const said = useTyped(current.said, mode, phase === 0 && !still);
  const pill = phase === 0 ? ["listening", "Listening"] : phase === 1 ? ["working", "Working"] : ["done", current.pill];

  return (
    <section className="hero2" id="top">
      <div className="hero2-grid">
        <div className="hero2-copy">
          {stamp}
          <h1>
            <span className="sr-only">Say it, and it’s typed, answered, done, noted or remembered. </span>
            <span aria-hidden="true">Say it,<br />and it’s<br /><span className="h1-word" key={current.word}><Hi>{current.word}</Hi></span></span>
            <span className="h1-sub">Free voice typing, an AI assistant and meeting notes for Mac and Windows</span>
          </h1>
          <p className="hero-lede">Hold a key and talk. Murmur types what you say in any app, answers questions about what’s on your screen, carries out jobs across your apps and takes notes in your meetings. It’s free, and it runs on your own computer.</p>
          <div className="hero-actions">{actions}</div>
          <p className="hero-meta">{meta}</p>
        </div>

        <div className="demo-wrap" ref={stage}>
          <div className={`demo phase-${phase}`}>
            <div className="demo-say">
              <span className={`demo-key${phase === 0 && current.id !== "meet" ? " down" : ""}`} aria-hidden="true">{current.id === "meet" ? <span className="mm-dot" /> : "fn"}</span>
              <p><span className="demo-label">{current.label}</span><q className="voice">{said}</q>{phase === 0 && !still && <span className="caret" aria-hidden="true" />}</p>
            </div>
            <div className="demo-screen" role="tabpanel" id="hero-panel" aria-labelledby={`hero-tab-${current.id}`} key={current.id}>
              {current.id === "type" && <TypeSurface done={phase === 2} />}
              {current.id === "ask" && <AskSurface phase={phase} />}
              {current.id === "do" && <DoSurface phase={phase} still={still} />}
              {current.id === "meet" && <MeetSurface phase={phase} />}
              {current.id === "recall" && <RecallSurface phase={phase} />}
            </div>
            <div className="demo-foot"><Pill state={pill[0]}>{pill[1]}</Pill></div>
            <Cut name="hand" className="demo-hand" />
            <Note className="demo-note">hold it, talk, let go</Note>
          </div>

          <div className="demo-tabs">
            <div role="tablist" aria-label="What Murmur does" onKeyDown={keys}>
              {heroModes.map((m, i) => (
                <button key={m.id} type="button" role="tab" id={`hero-tab-${m.id}`} aria-controls="hero-panel" aria-selected={i === mode}
                  tabIndex={i === mode ? 0 : -1} onClick={() => pick(i)}>
                  {m.tab}
                  <span className="demo-fill" aria-hidden="true">
                    {i === mode && auto && !still && <i key={`${mode}-${seen}`} style={{ animationDuration: `${total}ms`, animationPlayState: seen ? "running" : "paused" }} />}
                  </span>
                </button>
              ))}
            </div>
            {!still && (
              <button type="button" className="demo-play" onClick={() => { setAuto((a) => !a); if (!auto && phase === 2) { setMode((mode + 1) % heroModes.length); setPhase(0); } }}
                aria-label={auto ? "Pause the tour" : "Play the tour"}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{auto ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
