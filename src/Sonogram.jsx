import { useEffect, useRef, useState } from "react";

// A sonogram of a spoken sentence, drawn the way field guides print a bird's call: time across, pitch up.
// Vowels show as stacked harmonics, s/f/th/sh as high hiss, stops as short gaps. As the playhead passes
// each word, the word is typed underneath, which is what Murmur does with your voice.
const WORDS = "Thursday works for me, could you send the agenda?".split(" ");
const VOWELS = "aeiouy";
const HISS = { s: [0.45, 1], z: [0.45, 1], f: [0.35, 1], h: [0.2, 0.8], c: [0.4, 1], x: [0.4, 1] };
const STOPS = "ptkbdg";

function rand(seed) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

function layout() {
  // Width of each word in "frames", from its letters, plus gaps for pauses.
  let at = 4;
  return WORDS.map((word) => {
    const letters = word.toLowerCase().replace(/[^a-z]/g, "");
    const span = Math.max(6, letters.length * 3.4);
    const item = { word, letters, from: at, to: at + span };
    at += span + (/[,?]$/.test(word) ? 7 : 2.5);
    return item;
  });
}

const WORD_LAYOUT = layout();
const TOTAL = WORD_LAYOUT[WORD_LAYOUT.length - 1].to + 4;

function paint(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.round(rect.width), h = Math.round(rect.height);
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const r = rand(11);
  // Intensity on a coarse grid, then drawn softened, like ink on a printed sonogram.
  const cw = 2, ch = 2;
  const cols = Math.ceil(w / cw), rows = Math.ceil(h / ch);
  const grid = new Float32Array(cols * rows);
  const unit = cols / TOTAL;
  for (const item of WORD_LAYOUT) {
    const c0 = Math.floor(item.from * unit), c1 = Math.floor(item.to * unit);
    const n = item.letters.length;
    const base = 0.05 + r() * 0.012;
    for (let c = c0; c < c1; c++) {
      const p = (c - c0) / Math.max(1, c1 - c0);
      const letter = item.letters[Math.min(n - 1, Math.floor(p * n))];
      const local = (p * n) % 1;
      // Loud in the middle of the word, a slight dip between letters.
      const env = Math.pow(Math.sin(Math.PI * p), 0.35) * (0.78 + 0.22 * Math.sin(Math.PI * local));
      if (STOPS.includes(letter) && local < 0.7) continue;
      if (STOPS.includes(letter)) {
        if (local < 0.78) for (let y = 0; y < rows; y++) grid[y * cols + c] += 0.25 * r();
        continue;
      }
      if (HISS[letter]) {
        const [lo, hi] = HISS[letter];
        for (let y = 0; y < rows; y++) {
          const f = 1 - y / rows;
          const mid = (lo + hi) / 2, half = (hi - lo) / 2;
          const band = Math.max(0, 1 - Math.abs(f - mid) / half);
          grid[y * cols + c] += band * band * (0.15 + r() * 0.45) * env;
        }
        continue;
      }
      const vowel = VOWELS.includes(letter);
      const f0 = base * (1.12 - p * 0.22 + Math.sin(p * 3) * 0.03);
      const code = letter.charCodeAt(0);
      const formants = vowel ? [0.09 + (code % 5) * 0.012, 0.2 + (code % 7) * 0.022, 0.36] : [0.07, 0.16];
      for (let k = 1; k * f0 < 0.6; k++) {
        const f = k * f0;
        let gain = 0.12;
        for (const fm of formants) gain += Math.exp(-((f - fm) ** 2) / 0.0016);
        const a = Math.min(1, gain * (vowel ? 0.85 : 0.45) * env);
        const yc = (1 - f) * rows;
        for (let dy = -2; dy <= 2; dy++) {
          const y = Math.round(yc + dy);
          if (y < 0 || y >= rows) continue;
          grid[y * cols + c] += a * Math.exp(-(dy * dy) / 1.4) * (0.85 + r() * 0.3);
        }
      }
    }
  }
  const off = document.createElement("canvas");
  off.width = cols;
  off.height = rows;
  const octx = off.getContext("2d");
  const image = octx.createImageData(cols, rows);
  for (let i = 0; i < grid.length; i++) {
    const v = Math.min(1, grid[i]);
    image.data[i * 4] = 23; image.data[i * 4 + 1] = 25; image.data[i * 4 + 2] = 30;
    image.data[i * 4 + 3] = Math.round(Math.pow(v, 0.85) * 235);
  }
  octx.putImageData(image, 0, 0);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  ctx.filter = "blur(0.6px)";
  ctx.drawImage(off, 0, 0, w, h);
  ctx.filter = "none";
}

export default function Sonogram() {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const draw = () => paint(canvas);
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setProgress(1); return; }
    let frame = 0, start = 0, started = false;
    const duration = 4200;
    const step = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        setProgress(0);
        frame = requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    io.observe(boxRef.current);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [run]);

  const at = progress * TOTAL;
  return (
    <figure className="sonogram" ref={boxRef}>
      <div className="sono-plot">
        <div className="sono-axis" aria-hidden="true"><span>8 kHz</span><span>4</span><span>0</span></div>
        <div className="sono-canvas">
          <canvas ref={canvasRef} aria-hidden="true" />
          <span className="playhead" style={{ left: `${progress * 100}%`, opacity: progress > 0 && progress < 1 ? 1 : 0 }} aria-hidden="true" />
          <div className="sono-words">
            {WORD_LAYOUT.map((item) => (
              <span key={item.from} style={{ left: `${(item.from / TOTAL) * 100}%`, width: `${((item.to - item.from) / TOTAL) * 100}%` }}
                className={at >= item.to - 1 ? "typed" : ""}>
                {item.word}
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        <span><b>Spoken into Mail.</b> The picture is your voice; the words beneath are what Murmur typed when you let go of fn.</span>
        <button type="button" onClick={() => setRun((n) => n + 1)}>Play again</button>
      </figcaption>
    </figure>
  );
}
