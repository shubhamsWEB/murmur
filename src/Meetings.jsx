import { useEffect, useRef, useState } from "react";
import { Head, sitePath } from "./Parts";
import { Note } from "./Collage";
import { meetingApps, meetingBeats, meetingCompared, meetingHidden } from "./content";

// Meeting notes, the 1.8 headline: a laptop on a call, playing a meeting beat by beat. Murmur's panel floats over
// the call and changes with what's said: it listens, catches a question, writes the answer out, reads the shared
// chart, and keeps the notes. A handle on the screen wipes between the screen as you see it and as the call sees
// it in the screen share: the panel is only on your side of it.
//
// It plays by itself while it's on screen (not for people who've asked for less motion: they step through it), and
// the track under it jumps to any moment.

const HOLD = [4600, 3400, 8200, 7400, 6200];

function useOnScreen(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return undefined;
    const watch = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), { threshold: 0.3 });
    watch.observe(ref.current);
    return () => watch.disconnect();
  }, [ref]);
  return seen;
}

// Text as it's written, a few letters at a time.
function useTyped(text, key, still) {
  const [count, setCount] = useState(still ? text.length : 0);
  useEffect(() => {
    if (still) { setCount(text.length); return undefined; }
    setCount(0);
    const timer = setInterval(() => setCount((c) => {
      if (c >= text.length) { clearInterval(timer); return c; }
      return c + 2;
    }), 30);
    return () => clearInterval(timer);
  }, [text, key, still]);
  return text.slice(0, count);
}

// The people on the call, as paper cut-outs. Made up.
const people = [
  { name: "Priya", tile: "#e9b9a3", skin: "#c98e6b", hair: "#2a2622", top: "#d9473a", long: true },
  { name: "Arjun", tile: "#b7c8a0", skin: "#b9805c", hair: "#1d1a17", top: "#2b55c7" },
  { name: "Neha", tile: "#a8bbd6", skin: "#d6a37f", hair: "#4a3326", top: "#ffe14d", long: true },
  { name: "You", tile: "#ead691", skin: "#c48d68", hair: "#2a2622", top: "#fbf8f0" },
];

function Face({ person }) {
  return (
    <svg viewBox="0 0 80 60" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="80" height="60" fill={person.tile} />
      {person.long && <path d="M25 30c0-13 6-21 15-21s15 8 15 21v15H25z" fill={person.hair} />}
      <path d="M14 62c1-14 11-21 26-21s25 7 26 21z" fill={person.top} />
      <rect x="35.5" y="33" width="9" height="10" rx="3" fill={person.skin} />
      <ellipse cx="40" cy="25" rx="10.5" ry="12" fill={person.skin} />
      <path d={person.long ? "M29 24c0-10 5-14 11-14s11 4 11 14c-3-5-8-7-11-7s-8 2-11 7z" : "M29 22c0-9 5-13 11-13s11 4 11 13c-2-4-6-5-11-5s-9 1-11 5z"} fill={person.hair} />
    </svg>
  );
}

// The slide being shared in the call: checkout conversion by week, with week four down.
function Slide() {
  const weeks = [3.3, 3.5, 3.4, 2.1, 3.2, 3.6];
  return (
    <div className="call-slide">
      <b>Checkout conversion, by week</b>
      <div className="slide-bars">
        {weeks.map((value, i) => (
          <span key={i} className={i === 3 ? "low" : ""} style={{ "--h": `${(value / 4) * 100}%` }}><i>{value}%</i><em>W{i + 1}</em></span>
        ))}
      </div>
    </div>
  );
}

function Panel({ beat, step, still }) {
  const headline = useTyped(beat.answer ? beat.answer.headline : "", step, still);
  const written = beat.answer && headline.length >= beat.answer.headline.length;
  return (
    <div className="mm-panel">
      <div className="mm-head">
        <span className="mm-dot" />
        <b>Meeting notes</b>
        <span className="mm-clock">{beat.clock}</span>
        <span className="mm-wave"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="mm-tabs"><span className={beat.tab === "live" ? "on" : ""}>Live</span><span className={beat.tab === "notes" ? "on" : ""}>Notes</span><span>Transcript</span></div>
      {beat.tab === "live" ? (
        <div className="mm-body" key={`live-${step}`}>
          {beat.question
            ? <p className="mm-question">{beat.screen && <b>From the screen</b>}“{beat.question}”</p>
            : <p className="mm-listening"><b>Listening</b>When someone asks you something, an answer shows here.</p>}
          {beat.noted && <p className="mm-noted">{beat.noted}</p>}
          {beat.drafting && <p className="mm-drafting">Drafting an answer…</p>}
          {beat.answer && (
            <div className={`mm-answer${written ? " written" : ""}`}>
              <p className="mm-headline">{headline}{!written && <span className="mm-caret" />}</p>
              <ul>{beat.answer.points.map((point, i) => <li key={point} style={{ "--i": i }}>{point}</li>)}</ul>
              {beat.answer.also && <p className="mm-also" style={{ "--i": beat.answer.points.length }}><b>You could also say</b>{beat.answer.also}</p>}
            </div>
          )}
        </div>
      ) : (
        <div className="mm-body mm-notes" key={`notes-${step}`}>
          <p className="mm-headline">{beat.notes.title}</p>
          {beat.notes.sections.map(([heading, items], s) => (
            <div key={heading} style={{ "--i": s }} className="mm-section">
              <b>{heading}</b>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
          <p className="mm-saved" style={{ "--i": 2 }}>Saved to Documents › Murmur Meetings</p>
        </div>
      )}
      <div className="mm-actions"><span className="mm-primary">Answer now</span><span>Screen</span><span>Recap</span></div>
    </div>
  );
}

export default function Meetings() {
  const stage = useRef(null);
  const screen = useRef(null);
  const seen = useOnScreen(stage);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [still, setStill] = useState(false);
  // Where the handle is, across the screen: 100, all as you see it; 0, all as the call sees it.
  const [split, setSplit] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(query.matches);
    // Without motion, it opens on the answer rather than an empty panel.
    if (query.matches) { setPlaying(false); setStep(2); }
  }, []);

  useEffect(() => {
    if (!playing || !seen || still || dragging) return undefined;
    const timer = setTimeout(() => setStep((s) => (s + 1) % meetingBeats.length), HOLD[step]);
    return () => clearTimeout(timer);
  }, [playing, seen, still, dragging, step]);

  // Once, the first time it's on screen: the handle sweeps across and back, to show it's there to drag.
  useEffect(() => {
    if (!seen || shown || still) return undefined;
    setShown(true);
    const out = setTimeout(() => setSplit(52), 1800);
    const back = setTimeout(() => setSplit(100), 3600);
    return () => { clearTimeout(out); clearTimeout(back); };
  }, [seen, shown, still]);

  const place = (event) => {
    const box = screen.current.getBoundingClientRect();
    setSplit(Math.round(Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100))));
  };
  const grab = (event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); setShown(true); place(event); };
  const drag = (event) => { if (dragging) place(event); };
  const drop = () => setDragging(false);
  const keys = (event) => {
    if (event.key === "ArrowLeft") { setSplit((s) => Math.max(0, s - 10)); event.preventDefault(); }
    if (event.key === "ArrowRight") { setSplit((s) => Math.min(100, s + 10)); event.preventDefault(); }
  };

  const beat = meetingBeats[step];
  const theirs = split < 50;
  const go = (i) => { setStep(i); setPlaying(false); };
  const running = playing && seen && !still && !dragging;

  return (
    <section className="block meetings" id="meetings" aria-labelledby="meetings-title">
      <Head id="meetings-title" loud title="In your meeting, and" hi="never in the screen share"
        lede="Murmur sits in on your Zoom, Teams or Meet call. It writes down what’s said, keeps notes worth keeping, and when someone asks you something, drafts an answer you can read out, right beside the call. Nobody else sees it: not in a shared screen, not in a recording, and no bot joins the call."
        note="new in 1.8, Mac and Windows" />

      <div className="meet-stage" ref={stage}>
        <div className="meet-top">
          <div className="meet-switch" role="group" aria-label="Whose view of the screen">
            <button type="button" aria-pressed={!theirs} onClick={() => setSplit(100)}>What you see</button>
            <button type="button" aria-pressed={theirs} onClick={() => setSplit(0)}>What the call sees</button>
          </div>
          <p className="meet-hint">or drag the handle across the screen</p>
        </div>

        {/* (The reveal is on the wrapper: its class is set by the page's motion, and mustn't be rewritten here.) */}
        <div className="laptop-wrap" data-reveal>
          <div className={`laptop${dragging ? " dragging" : ""}`} style={{ "--split": `${split}%` }}>
            <div className="laptop-lid">
              <span className="laptop-cam" aria-hidden="true" />
              <div className="laptop-screen" ref={screen}>
                <div className="desk" role="img"
                  aria-label={`Your screen, shared in a Teams call. ${beat.label}: ${beat.summary} Murmur’s panel is on your screen only; the people in the call see the call without it.`}>
                  <div className="desk-bar" aria-hidden="true"><b>Teams</b><span>Meeting</span><span>View</span><span>Window</span><em>Thu 4:05 PM</em></div>
                  <div className="call" aria-hidden="true">
                    <div className="call-bar"><span className="call-lights"><i /><i /><i /></span><b>Weekly product sync</b><span className="call-rec">Sharing your screen</span></div>
                    <div className="call-main">
                      <Slide />
                      <div className="call-people">
                        {people.map((person) => (
                          <div key={person.name} className={`call-tile${beat.speaker === person.name ? " speaking" : ""}`}>
                            <Face person={person} />
                            <span className="call-name">{person.name}{beat.speaker === person.name && <span className="call-voice"><i /><i /><i /></span>}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="call-caption" key={`caption-${step}`}><b>{beat.speaker}</b>{beat.caption}</p>
                  </div>
                </div>
                <div className="yours" aria-hidden="true">
                  <Panel beat={beat} step={step} still={still} />
                </div>
                <span className="split-tag split-you" aria-hidden="true">On your screen</span>
                <span className="split-tag split-them" aria-hidden="true">In the screen share</span>
                <div className="split-handle" role="slider" tabIndex={0} aria-label="How much of the screen is shown as you see it"
                  aria-valuemin={0} aria-valuemax={100} aria-valuenow={split}
                  aria-valuetext={theirs ? "As the call sees it: without Murmur’s panel" : "As you see it: with Murmur’s panel"}
                  onPointerDown={grab} onPointerMove={drag} onPointerUp={drop} onPointerCancel={drop} onKeyDown={keys}>
                  <span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6 3 12l6 6M15 6l6 6-6 6" /></svg></span>
                </div>
              </div>
            </div>
            <div className="laptop-base" aria-hidden="true"><span /></div>
            <Note className="meet-note">{theirs ? "what Priya sees: no Murmur" : "only you see this"}</Note>
          </div>
        </div>

        <div className="meet-track">
          <button type="button" className="meet-play" onClick={() => setPlaying((p) => !p)} aria-label={playing && !still ? "Pause the meeting" : "Play the meeting"}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{playing && !still ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
          </button>
          <ol>
            {meetingBeats.map((b, i) => (
              <li key={b.label} className={i < step ? "done" : ""}>
                <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => go(i)}>
                  <span className="meet-fill" aria-hidden="true">
                    {i === step && <i key={`${step}-${running}`} style={{ animationDuration: `${HOLD[i]}ms`, animationPlayState: running ? "running" : "paused" }} />}
                  </span>
                  <span className="meet-label"><b aria-hidden="true">{i + 1}</b>{b.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="meet-now" aria-live="polite"><b>{beat.label}.</b> {beat.summary}</p>
      </div>

      <ul className="meet-board">
        <li className="board-card board-key" data-reveal>
          <div className="board-art" aria-hidden="true">
            <span className="mkey">⌃</span><span className="mkey">⌥</span><span className="mkey mkey-wide">return</span>
          </div>
          <h3>One key answers</h3>
          <p>Murmur answers by itself the moment they finish asking. Or press ⌃⌥Return on a Mac, Ctrl+Alt+Enter on Windows, to answer what was just said.</p>
        </li>
        <li className="board-card board-code" data-reveal data-delay="80">
          <pre className="board-art" aria-hidden="true">{"def allow(key):\n    bucket = refill(key)\n    return bucket.take(1)"}</pre>
          <h3>Code, when code is asked for</h3>
          <p>Asked to write a function or fix a query, it shows working code first, then how to talk through the idea and its cost.</p>
        </li>
        <li className="board-card board-notes" data-reveal data-delay="160">
          <ul className="board-art" aria-hidden="true">
            <li className="ticked">Release moves to Friday</li>
            <li>You: share the design by Monday</li>
            <li>Neha: retest checkout on Thursday</li>
          </ul>
          <h3>Notes that say something</h3>
          <p>What was decided, who does what and by when, the numbers and names. Never “the team discussed the project”.</p>
        </li>
        <li className="board-card board-bot" data-reveal>
          <ul className="board-art" aria-hidden="true">
            <li>Priya</li><li>Arjun</li><li>Neha</li><li>You</li><li className="struck">Notetaker bot</li>
          </ul>
          <h3>No bot joins the call</h3>
          <p>Murmur listens from your own computer, so there’s no extra name in the list of people and nothing to install in the meeting app.</p>
        </li>
        <li className="board-card board-context" data-reveal data-delay="80">
          <div className="board-art" aria-hidden="true"><span>agenda.md</span><span>api-spec.docx</span><span>resume.pdf</span></div>
          <h3>It knows what the meeting is for</h3>
          <p>Tell it what the meeting is about and add your agenda, spec or resume. Answers and notes use them.</p>
        </li>
        <li className="board-card board-ai" data-reveal data-delay="160">
          <div className="board-art" aria-hidden="true"><span>Claude</span><span>OpenAI</span><span>Sarvam</span><span className="on">On your computer</span></div>
          <h3>Your choice of AI</h3>
          <p>Answer with Claude, OpenAI or Sarvam with your own key, or a model on your own computer. Speech becomes text on your computer unless you choose otherwise.</p>
        </li>
      </ul>

      <div className="meet-hidden">
        <div className="meet-hidden-copy" data-reveal>
          <h3 className="memory-sub">Hidden, and how</h3>
          <p>Murmur asks the system to leave its windows out of anything that captures the screen. It’s the same setting banking and password apps use, so it works in every meeting app without a plug-in.</p>
          <p className="note">It’s your meeting and your notes, but the people in it should know. Tell them you’re taking notes; in many places the law asks you to.</p>
        </div>
        <table className="meet-table" data-reveal data-delay="100">
          <thead><tr><th scope="col">Where</th><th scope="col">You</th><th scope="col">Everyone else</th></tr></thead>
          <tbody>
            {meetingHidden.map(([where, you, them]) => (
              <tr key={where}><th scope="row">{where}</th><td>{you}</td><td className="meet-not">{them}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="meet-apps" data-reveal><b>Works with the call you’re already on</b>{meetingApps.map((app) => <span key={app}>{app}</span>)}</p>
      <p className="meet-more" data-reveal>
        <b>Free, where others charge</b>
        <a className="text-link" href={sitePath("/ai-meeting-notes/")}>How the notes work</a>
        {meetingCompared.map(([name, path]) => <a key={path} className="text-link" href={sitePath(path)}>Murmur and {name}</a>)}
      </p>
    </section>
  );
}
