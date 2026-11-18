import { useEffect, useRef, useState } from "react";
import { Head, sitePath } from "./Parts";
import { Note } from "./Collage";
import { meetingBeats, meetingFacts, meetingHidden, meetingApps } from "./content";

// Meeting notes, the 1.8 headline: a laptop on a call, playing a meeting beat by beat. Murmur's panel sits beside the
// call and changes with what's said: it listens, catches a question, drafts the answer, and keeps the notes. The
// switch above it shows the same screen as the other people see it in a screen share: without the panel.
//
// It plays by itself while it's on screen (not for people who've asked for less motion: they step through it), and
// the steps under it jump to any moment.

const HOLD = [4200, 3200, 6200, 5200, 5600];

function useOnScreen(ref) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return undefined;
    const watch = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), { threshold: 0.35 });
    watch.observe(ref.current);
    return () => watch.disconnect();
  }, [ref]);
  return seen;
}

function Tile({ person, speaking, you }) {
  return (
    <div className={`call-tile tile-${person.tone}${speaking ? " speaking" : ""}`}>
      <span className="call-face" aria-hidden="true">{person.name[0]}</span>
      <span className="call-name">{you ? "You" : person.name}</span>
    </div>
  );
}

const people = [
  { name: "Priya", tone: "a" },
  { name: "Arjun", tone: "b" },
  { name: "Neha", tone: "c" },
  { name: "You", tone: "d" },
];

function Panel({ beat, step }) {
  return (
    <div className="mm-panel" key="panel">
      <div className="mm-head">
        <span className="mm-dot" />
        <b>Teams · {beat.clock}</b>
        <span className="mm-meters"><i /><i /></span>
      </div>
      <div className="mm-tabs"><span className={beat.tab === "live" ? "on" : ""}>Live</span><span className={beat.tab === "notes" ? "on" : ""}>Notes</span><span>Transcript</span></div>
      {beat.tab === "live" ? (
        <div className="mm-body" key={`live-${step}`}>
          {beat.question ? <p className="mm-question">“{beat.question}”</p> : <p className="mm-listening"><b>Listening</b>When someone asks you something, an answer shows here.</p>}
          {beat.drafting && <p className="mm-drafting">Drafting an answer…</p>}
          {beat.answer && (
            <div className="mm-answer">
              <p className="mm-headline">{beat.answer.headline}</p>
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
          <p className="mm-saved" style={{ "--i": 3 }}>Saved to Documents › Murmur Meetings</p>
        </div>
      )}
      <div className="mm-actions"><span className="mm-primary">Answer now</span><span>Screen</span><span>Recap</span></div>
    </div>
  );
}

export default function Meetings() {
  const stage = useRef(null);
  const seen = useOnScreen(stage);
  const [step, setStep] = useState(0);
  const [view, setView] = useState("you");
  const [playing, setPlaying] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(query.matches);
    // Without motion, it opens on the answer rather than an empty panel.
    if (query.matches) { setPlaying(false); setStep(2); }
  }, []);

  useEffect(() => {
    if (!playing || !seen || still) return undefined;
    const timer = setTimeout(() => setStep((s) => (s + 1) % meetingBeats.length), HOLD[step]);
    return () => clearTimeout(timer);
  }, [playing, seen, still, step]);

  const beat = meetingBeats[step];
  const shared = view === "them";
  const go = (i) => { setStep(i); setPlaying(false); };

  return (
    <section className="block meetings" id="meetings" aria-labelledby="meetings-title">
      <Head id="meetings-title" loud title="In your meeting, and" hi="never in the screen share"
        lede="Murmur sits in on your Zoom, Teams or Meet call. It writes down what’s said, keeps notes worth keeping, and when someone asks you something, drafts an answer you can read out, right beside the call. Nobody else sees it: not in a shared screen, not in a recording, and no bot joins the call."
        note="new in 1.8, Mac and Windows" />

      <div className="meet-stage" ref={stage}>
        <div className="meet-switch" role="group" aria-label="Whose view of the screen">
          <button type="button" aria-pressed={!shared} onClick={() => setView("you")}>What you see</button>
          <button type="button" aria-pressed={shared} onClick={() => setView("them")}>What the call sees</button>
        </div>

        {/* (The reveal is on the wrapper: its class is set by the page's motion, and mustn't be rewritten here.) */}
        <div className="laptop-wrap" data-reveal>
        <div className={`laptop${shared ? " shared" : ""}`}>
          <div className="laptop-lid">
            <div className="laptop-screen" role="img"
              aria-label={shared
                ? "Your screen as the others see it in the screen share: the call, without Murmur’s panel."
                : `Your screen: a Teams call with Murmur’s panel beside it. ${beat.label}: ${beat.summary}`}>
              <div className="call" aria-hidden="true">
                <div className="call-bar"><span className="call-lights"><i /><i /><i /></span><b>Weekly product sync</b><span className="call-rec">{shared ? "You’re sharing your screen" : beat.clock}</span></div>
                <div className="call-grid">
                  {people.map((person) => <Tile key={person.name} person={person} speaking={beat.speaker === person.name} you={person.name === "You"} />)}
                </div>
                <p className="call-caption" key={`caption-${step}`}><b>{beat.speaker}</b>{beat.caption}</p>
              </div>
              <div className="mm-slot" aria-hidden="true">
                <Panel beat={beat} step={step} />
                <div className="mm-ghost"><span>Murmur’s panel isn’t in the shared screen</span></div>
              </div>
            </div>
          </div>
          <div className="laptop-base" aria-hidden="true"><span /></div>
          <Note className="meet-note">{shared ? "as Priya sees it" : "only on your screen"}</Note>
        </div>
        </div>

        <div className="meet-steps">
          <button type="button" className="meet-play" onClick={() => setPlaying((p) => !p)} aria-label={playing && !still ? "Pause the meeting" : "Play the meeting"}>
            {playing && !still ? "Pause" : "Play"}
          </button>
          <ol>
            {meetingBeats.map((b, i) => (
              <li key={b.label}>
                <button type="button" aria-current={i === step ? "step" : undefined} onClick={() => go(i)}>
                  <span className="meet-n" aria-hidden="true">{i + 1}</span>{b.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <p className="meet-now" aria-live="polite"><b>{beat.label}.</b> {beat.summary}</p>
      </div>

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

      <dl className="details meet-facts">
        {meetingFacts.map(([title, text], i) => (
          <div key={title} className="sticky" data-reveal data-delay={(i % 3) * 80}><dt>{title}</dt><dd>{text}</dd></div>
        ))}
      </dl>

      <p className="meet-apps" data-reveal><b>Works with the call you’re already on</b>{meetingApps.map((app) => <span key={app}>{app}</span>)}</p>
      <p className="meet-more" data-reveal>
        <a className="text-link" href={sitePath("/ai-meeting-notes/")}>How the notes work, without a bot in the call</a>
        <a className="text-link" href={sitePath("/cluely-alternative/")}>Murmur as a free alternative to Cluely</a>
      </p>
    </section>
  );
}
