import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { film } from "./launch";

// The launch film. Until it's played, only its poster and a button: the player (Video.js, src/FilmPlayer.jsx) starts
// loading when the visitor nears the film and takes over on the click, playing from the start with sound.
//
// On the film's own page (`asVideo`), the poster is the film itself, an MP4 <video> that loads nothing until played,
// so search engines find a video on the page and can index it. `startAt` starts the film from a point (a chapter
// link, or ?t= in the address), and `request` ({ t }) starts it, or moves it, to a chapter.
const FilmPlayer = lazy(() => import("./FilmPlayer"));
const media = `${import.meta.env.BASE_URL}media/`;

export default function Film({ asVideo = false, startAt = 0, request = null }) {
  const figure = useRef(null);
  const seekTo = useRef(0);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  // Near the film (or on the first hover or focus), fetch the player so the click plays at once; never before the
  // page itself has loaded, and only when the browser is idle.
  const warm = () => { import("./FilmPlayer"); };
  useEffect(() => {
    const element = figure.current;
    if (!element || !("IntersectionObserver" in window)) return undefined;
    const idle = (run) => {
      const later = () => (window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500));
      if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
    };
    const watch = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { idle(warm); watch.disconnect(); }
    }, { rootMargin: "300px 0px" });
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  // Move the player to a point once it's there (it may still be loading).
  const seek = useCallback((t) => {
    let tries = 0;
    const timer = setInterval(() => {
      const video = figure.current?.querySelector("video:not(.film-poster)");
      tries += 1;
      if (video && video.readyState >= 1) {
        clearInterval(timer);
        video.currentTime = t;
        video.play?.().catch(() => {});
      } else if (tries > 100) clearInterval(timer);
    }, 100);
  }, []);
  const play = useCallback((t) => {
    seekTo.current = t || 0;
    if (started) seek(seekTo.current);
    else setStarted(true);
  }, [started, seek]);
  useEffect(() => { if (request) play(request.t); }, [request]); // eslint-disable-line react-hooks/exhaustive-deps
  const onReady = useCallback(() => {
    setReady(true);
    if (seekTo.current) seek(seekTo.current);
  }, [seek]);

  const facade = (busy) => (
    <>
      {asVideo ? (
        <video className="film-poster" src={`${media}murmur-launch.mp4`} poster={`${media}murmur-launch.jpg`} preload="none"
          muted playsInline tabIndex={-1} aria-hidden="true" />
      ) : (
        <img className="film-poster" src={`${media}murmur-launch.jpg`} alt="" decoding="async" />
      )}
      <button type="button" className="film-play" onClick={() => play(startAt)} onPointerEnter={warm} onFocus={warm}
        aria-label="Play the film, 1 minute 28 seconds, with sound" aria-busy={busy || undefined} disabled={busy}>
        <span className="film-icon" aria-hidden="true">
          {busy ? <span className="film-spinner" /> : <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>}
        </span>
        <span>{busy ? "Starting the film" : "Watch Murmur at work"} <small>1:28</small></span>
      </button>
    </>
  );
  return (
    <figure ref={figure} className={`film taped${started ? " playing" : ""}`}>
      {started ? (
        <Suspense fallback={facade(true)}>
          <FilmPlayer label={film.label} onReady={onReady} />
          {!ready && facade(true)}
        </Suspense>
      ) : facade(false)}
    </figure>
  );
}
