import "@videojs/react/video/skin.css";
import { selectError, selectTime, usePlayer } from "@videojs/react";
import { HlsVideo } from "@videojs/react/media/hls-video";
import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";
import { useCallback, useEffect, useRef, useState } from "react";

// The launch film in Video.js: streamed (HLS, four sizes from 360p to 1080p, picked for the connection and the player's
// size, or by hand in the settings menu), with its chapters on the timeline and a frame under the pointer while
// scrubbing. Loaded only when the visitor gets near the film (see Film in App.jsx), so the page itself stays light.
// Full addresses: the HLS engine resolves the playlist's parts against the playlist's own address.
const media = new URL(`${import.meta.env.BASE_URL}media/`, typeof window === "undefined" ? "http://localhost/" : window.location.href).href;
const film = {
  stream: `${media}film/master.m3u8`,
  file: `${media}murmur-launch.mp4`,
  poster: `${media}murmur-launch.jpg`,
  chapters: `${media}film/chapters.vtt`,
  storyboard: `${media}film/storyboard.vtt`,
};

// Streaming needs Media Source Extensions (Safari on iPhone calls it ManagedMediaSource). Without them, the MP4.
const canStream = () => typeof window !== "undefined" && Boolean(window.MediaSource || window.ManagedMediaSource);

// The film's tracks: its chapters, and the storyboard the timeline previews come from. The captions are in the
// picture itself.
function Tracks() {
  return (
    <>
      <track kind="chapters" src={film.chapters} srcLang="en" label="Chapters" default />
      <track kind="metadata" label="thumbnails" src={film.storyboard} default />
    </>
  );
}

// When the stream fails (a network that blocks it, a browser that can't decode it), the MP4 takes over from where the
// film had got to: on a player error, when the playlist can't be fetched, or when a frame hasn't come within 12 seconds
// of asking (the engine reports some failures only in the console).
function OnFailure({ onFail, media }) {
  const failure = usePlayer(selectError);
  const time = usePlayer(selectTime);
  const at = useRef(0);
  at.current = time?.currentTime ?? at.current;
  useEffect(() => {
    if (failure?.error) onFail(at.current);
  }, [failure?.error, onFail]);
  useEffect(() => {
    let cancelled = false;
    fetch(film.stream, { cache: "force-cache" }).then((response) => {
      if (!cancelled && !response.ok) onFail(0);
    }, () => { if (!cancelled) onFail(0); });
    const late = setTimeout(() => {
      const video = media.current;
      if (!cancelled && !(video instanceof HTMLMediaElement && video.readyState >= 2)) onFail(at.current);
    }, 12000);
    return () => { cancelled = true; clearTimeout(late); };
  }, [onFail, media]);
  return null;
}

export default function FilmPlayer({ label, onReady }) {
  const [stream, setStream] = useState(canStream);
  const resume = useRef(0);
  const media = useRef(null);
  useEffect(() => { onReady?.(); }, [onReady]);
  const fail = useCallback((at) => {
    resume.current = at;
    setStream(false);
  }, []);
  const common = {
    playsInline: true,
    autoPlay: true,
    preload: "auto",
    crossOrigin: "anonymous",
    "aria-label": label,
    fallback: <a href={film.file}>Download the film (MP4)</a>,
  };
  return (
    <VideoPlayer poster={film.poster} title="Murmur, the launch film">
      <VideoSkin className="film-player">
        {stream ? (
          <HlsVideo key="stream" ref={media} src={film.stream} {...common}><Tracks /></HlsVideo>
        ) : (
          <Video key="file" src={film.file} {...common}
            onLoadedMetadata={(event) => { if (resume.current) event.currentTarget.currentTime = resume.current; }}>
            <Tracks />
          </Video>
        )}
      </VideoSkin>
      {stream && <OnFailure onFail={fail} media={media} />}
    </VideoPlayer>
  );
}
