import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// All of the page's scroll motion lives here, so the components only mark what moves:
// - data-reveal: fades and rises into place the first time it scrolls into view (data-delay staggers it, in ms).
// - data-scroll: gets --p, its progress through the viewport, from 0 (its top meets the bottom of the screen) to 1
//   (its bottom leaves the top). CSS turns that into parallax, the film growing, the language rows sliding.
// - document: --page, the whole page's progress, for the bar along the top.
// With reduced motion, nothing moves: everything is shown in place and scrolling is the browser's own.
export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reveals = [...document.querySelectorAll("[data-reveal]")];
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("in"));
      root.classList.add("still");
      return undefined;
    }
    root.classList.add("moving");
    reveals.forEach((el) => {
      if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}ms`;
    });
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));

    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -72 }, autoRaf: false });
    const tracked = [...document.querySelectorAll("[data-scroll]")];
    let frame = 0;
    const update = () => {
      const vh = window.innerHeight;
      for (const el of tracked) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.setProperty("--p", p.toFixed(4));
      }
      const max = root.scrollHeight - vh;
      root.style.setProperty("--page", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    lenis.on("scroll", update);
    window.addEventListener("resize", update);
    update();
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      io.disconnect();
      window.removeEventListener("resize", update);
      root.classList.remove("moving");
    };
  }, []);
}
