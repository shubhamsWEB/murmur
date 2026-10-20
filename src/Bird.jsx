// The Starling, from the app icon's 100-unit grid.
export function Bird({ mono = false, className = "bird" }) {
  const body = mono ? "currentColor" : "var(--coral)";
  const cut = mono ? "var(--mono-cut)" : "#FFF6EF";
  return (
    <svg className={className} viewBox="10 26 82 62" aria-hidden="true">
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

// Murmur's capsule, as it shows at the bottom of your screen. `state`: listening (the bars move), working (a
// spinner), done, problem, or idle (just the bird).
export function Pill({ state = "listening", children, className = "" }) {
  return (
    <div className={`pill pill-${state} ${className}`} aria-hidden="true">
      {state === "problem" ? <span className="pill-alert">!</span> : <Bird />}
      {state === "listening" && <span className="bars"><i /><i /><i /><i /><i /></span>}
      {state === "working" && <span className="spinner" />}
      {state === "done" && <span className="tick">✓</span>}
      {children && <span className="pill-text">{children}</span>}
    </div>
  );
}
