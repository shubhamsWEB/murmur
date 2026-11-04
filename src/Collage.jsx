// The collage pieces: halftone cut-outs, hand-drawn marks that draw themselves in as they scroll into view, tape,
// and notes in the margin. Cut-outs live in public/collage (made from photos with scripts/halftone.py).
const base = `${import.meta.env.BASE_URL}collage/`;

export function Cut({ name, className = "", alt = "", depth = 0 }) {
  return (
    <img className={`cut ${className}`} src={`${base}${name}.webp`} alt={alt} aria-hidden={alt ? undefined : "true"}
      loading="lazy" decoding="async" data-scroll={depth ? "" : undefined}
      style={depth ? { "--depth": depth } : undefined} />
  );
}

const marks = {
  circle: { box: "0 0 200 84", d: "M18 44C14 22 60 8 108 8c48 0 84 12 82 34-2 24-52 36-96 34C48 74 10 62 12 40 14 26 34 16 58 12" },
  underline: { box: "0 0 200 16", d: "M4 11C48 4 118 14 196 6" },
  arrow: { box: "0 0 160 90", d: "M8 10c22 44 64 70 132 64M122 58l20 16-24 12" },
  arrowDown: { box: "0 0 90 120", d: "M30 6c-22 40-14 80 30 102M42 92l18 16 8-24" },
  star: { box: "0 0 60 60", d: "M30 4l6 18 20 2-16 12 6 20-16-12-16 12 6-20L4 24l20-2z" },
  squiggle: { box: "0 0 200 20", d: "M4 12c12-10 22 10 34 0s22 10 34 0 22 10 34 0 22 10 34 0 22 10 34 0 22 10 22 2" },
};

// A mark drawn in pen. It draws itself when its parent scrolls into view (data-reveal).
export function Mark({ kind = "underline", className = "" }) {
  const m = marks[kind];
  return (
    <svg className={`mark mark-${kind} ${className}`} viewBox={m.box} preserveAspectRatio="none" aria-hidden="true">
      <path d={m.d} pathLength="1" />
    </svg>
  );
}

// A note in the margin, in handwriting.
export function Note({ children, className = "" }) {
  return <span className={`note-hand ${className}`} aria-hidden="true">{children}</span>;
}

// A highlighter stroke behind some words; it sweeps across when the heading scrolls in.
export function Hi({ children }) {
  return <mark className="hi">{children}</mark>;
}
