// Renders the hero's autoplaying YouTube trailer, muted by default with a
// Netflix-style toggle. Unmounts when `paused` (e.g. while the detail modal
// is open) so two videos never play at once.
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ id, paused = false }) => {
  const trailerVideo = useSelector((state) => state.movies?.trailerVideo);
  useMovieTrailer(id);
  const iframeRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const videoKey = trailerVideo?.key;

  // The iframe always (re)mounts muted (its `src` hardcodes mute=1), whether
  // because the movie changed or because the detail modal closed and the
  // video came back. Keep `muted` state in sync so the toggle button never
  // lies about what's actually playing.
  useEffect(() => {
    setMuted(true);
  }, [videoKey, paused]);

  const toggleMute = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    // YouTube's postMessage JS API — requires enablejsapi=1 on the iframe src.
    win.postMessage(
      JSON.stringify({ event: "command", func: muted ? "unMute" : "mute" }),
      "*"
    );
    setMuted(!muted);
  };

  if (!videoKey) return null;

  if (paused) return <div className="w-screen aspect-video bg-black" />;

  return (
    <div className="relative w-screen aspect-video">
      <iframe
        key={videoKey}
        ref={iframeRef}
        className="w-full h-full absolute -mt-[150px] left-0"
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=${videoKey}&enablejsapi=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          filter: "brightness(2.3)",
        }}
      ></iframe>

      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute right-6 md:right-12 bottom-[190px] z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/40 bg-black/40 text-white hover:bg-black/60 hover:border-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {muted ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 8.03v1.68l2.4 2.4c.06-.36.1-.72.1-1.1Zm2.5 0c0 .94-.2 1.82-.55 2.63l1.51 1.51A8.75 8.75 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71ZM4.27 3 3 4.27l6 6H3v3.46h4l5 5v-6.71l4.18 4.18c-.65.5-1.38.87-2.18 1.11v2.06a8.99 8.99 0 0 0 3.61-1.63L19.73 21 21 19.73 4.27 3ZM12 4l-2.17 2.17L12 8.34V4Z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8.03v7.94A4.48 4.48 0 0 0 16.5 12ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default VideoBackground;
