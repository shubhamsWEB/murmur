import { useEffect, useRef } from "react";

// A murmuration that gathers into the words you say, letter by letter, the way Murmur writes them,
// then lets them go. Each cycle: the flock wheels while "listening", settles into the phrase, holds, disperses.
const LISTEN = 2600;
const FORM = 1700;
const HOLD = 2600;
const CYCLE = LISTEN + FORM + HOLD;

function wrap(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function targetsFor(text, w, h, count) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const narrow = w < 720;
  // Typed text, so the typed face: bold enough that a few birds per stroke still read.
  let size = Math.round(Math.min(190, Math.max(52, w / (narrow ? 5.2 : 8))));
  let lines;
  const room = h * (narrow ? 0.36 : 0.44);
  for (;;) {
    ctx.font = `400 ${size}px "Young Serif", Georgia, serif`;
    lines = wrap(ctx, text, Math.min(1240, w * (narrow ? 0.92 : 0.9)));
    if (lines.length * size * 1.02 <= room || size <= 36) break;
    size -= 4;
  }
  const lineHeight = size * 1.02;
  const top = h * (narrow ? 0.1 : 0.11);
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => {
    const width = ctx.measureText(line).width;
    const gutter = Math.min(56, Math.max(16, w * 0.04));
    const x = Math.max(gutter, (w - 1240) / 2);
    ctx.fillText(line, x, top + i * lineHeight);
  });
  const data = ctx.getImageData(0, 0, w, h).data;
  const step = 3;
  const points = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 140) points.push([x + Math.random() * 2.5, y + Math.random() * 2.5]);
    }
  }
  // Shuffle, then take one point per bird (reusing points if the phrase is small).
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }
  const out = [];
  for (let i = 0; i < count; i++) out.push(points.length ? points[i % points.length] : [w / 2, h / 2]);
  let minX = Infinity, maxX = -Infinity;
  for (const [x] of out) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  return { points: out, minX, span: Math.max(1, maxX - minX) };
}

export default function Flock({ phrases, onPhase }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef(onPhase);
  phaseRef.current = onPhase;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, birds = [], targets = [], frame = 0, start = 0, cycle = -1, phase = "";
    let visible = true;

    const count = () => (w < 720 ? 1300 : 3000);

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = count();
      birds = Array.from({ length: n }, () => ({
        x: w * (0.3 + Math.random() * 0.5),
        y: h * (0.15 + Math.random() * 0.35),
        vx: 0, vy: 0,
        r: Math.pow(Math.random(), 0.7),
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 1000,
      }));
      targets = phrases.map((p) => targetsFor(p.said, w, h, n));
    }

    function setPhase(next, index) {
      if (next === phase) return;
      phase = next;
      phaseRef.current?.(next, index);
    }

    function draw(points) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(23, 25, 30, 0.88)";
      ctx.lineWidth = w < 720 ? 1.5 : 1.7;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const b of points) {
        // A bird is a short stroke along its heading; a settled one is a small perched dash.
        let tx = b.vx * 1.4, ty = b.vy * 1.4;
        const len = Math.hypot(tx, ty);
        if (len > 7) { tx *= 7 / len; ty *= 7 / len; }
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - tx - 1.2, b.y - ty - 0.5);
      }
      ctx.stroke();
    }

    let last = 0;
    function tick(now) {
      frame = requestAnimationFrame(tick);
      if (!visible) { last = now; return; }
      if (!start) start = now;
      const k = Math.min(4, last ? (now - last) / 16.67 : 1);
      last = now;
      const elapsed = now - start;
      const index = Math.floor(elapsed / CYCLE) % phrases.length;
      const local = elapsed % CYCLE;
      if (Math.floor(elapsed / CYCLE) !== cycle) {
        cycle = Math.floor(elapsed / CYCLE);
        // Release: scatter outward from wherever the words were.
        for (const b of birds) { b.vx += (Math.random() - 0.5) * 6; b.vy += (Math.random() - 0.8) * 5; }
      }
      setPhase(local < LISTEN + FORM ? "listening" : "done", index);
      const t = elapsed / 1000;
      const target = targets[index];
      const cx = w * 0.56 + Math.sin(t * 0.31) * w * 0.17 + Math.sin(t * 0.83) * w * 0.04;
      const cy = h * 0.32 + Math.cos(t * 0.27) * h * 0.08;
      const rx = w * (w < 720 ? 0.34 : 0.2);
      const ry = h * 0.11;
      const turn = t * 0.45;
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        const [tx, ty] = target.points[i];
        // Letters fill in left to right, like text being typed.
        const formAt = LISTEN + ((tx - target.minX) / target.span) * (FORM * 0.75);
        if (local >= formAt) {
          const ease = 1 - Math.pow(0.88, k);
          b.vx = (tx - b.x) * ease;
          b.vy = (ty - b.y) * ease;
        } else {
          const angle = b.a + turn + Math.sin(t * 0.5 + b.s) * 0.4;
          const ox = cx + Math.cos(angle) * rx * b.r;
          const oy = cy + Math.sin(angle * 1.3) * ry * b.r;
          const damp = Math.pow(0.965, k);
          b.vx = (b.vx + ((ox - b.x) * 0.0045 + Math.sin(b.y * 0.012 + t * 1.1 + b.s) * 0.12) * k) * damp;
          b.vy = (b.vy + ((oy - b.y) * 0.0045 + Math.cos(b.x * 0.01 + t * 0.9 + b.s) * 0.12) * k) * damp;
          const speed = Math.hypot(b.vx, b.vy);
          if (speed > 5) { b.vx *= 5 / speed; b.vy *= 5 / speed; }
        }
        const moving = local < formAt;
        b.x += moving ? b.vx * k : b.vx;
        b.y += moving ? b.vy * k : b.vy;
      }
      draw(birds);
    }

    function still() {
      build();
      const target = targets[0];
      draw(target.points.map(([x, y]) => ({ x, y, vx: 0, vy: 0 })));
      setPhase("done", 0);
    }

    const ready = document.fonts?.load ? document.fonts.load('400 64px "Young Serif"').catch(() => {}) : Promise.resolve();
    let observer;
    ready.then(() => {
      if (reduced) {
        still();
        observer = new ResizeObserver(still);
      } else {
        build();
        frame = requestAnimationFrame(tick);
        observer = new ResizeObserver(() => {
          const rect = canvas.getBoundingClientRect();
          if (Math.abs(rect.width - w) > 1 || Math.abs(rect.height - h) > 120) build();
        });
      }
      observer.observe(canvas);
    });
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(canvas);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); io.disconnect(); };
  }, [phrases]);

  return <canvas ref={canvasRef} className="flock" aria-hidden="true" />;
}
