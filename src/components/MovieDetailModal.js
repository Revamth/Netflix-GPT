import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMovie } from "../utils/movieSlice";
import { API_OPTIONS, buildTmdbUrl, TMDB_IMG } from "../utils/constants";

// Detail modal shown when a movie card is clicked. Fetches a trailer for the
// selected title and renders it over a dimmed backdrop. Closes on backdrop
// click, the × button, or the Escape key.
const MovieDetailModal = () => {
  const dispatch = useDispatch();
  const movie = useSelector((state) => state.movies.selectedMovie);
  const [trailerKey, setTrailerKey] = useState(null);
  // Trailer plays only after the user clicks "Play Trailer" — no autoplay.
  const [showTrailer, setShowTrailer] = useState(false);

  const closeModal = useCallback(() => {
    dispatch(setSelectedMovie(null));
  }, [dispatch]);

  // movie items may be either /movie or /tv entries (GPT search returns movies).
  const isTV = movie && !movie.title && !!movie.name;
  const mediaType = isTV ? "tv" : "movie";

  // Fetch a trailer for the selected movie whenever the selection changes.
  useEffect(() => {
    if (!movie?.id) return;
    let active = true;
    setTrailerKey(null);
    setShowTrailer(false); // reset to poster view for each newly opened movie

    (async () => {
      try {
        const res = await fetch(
          buildTmdbUrl(`/${mediaType}/${movie.id}/videos`, {
            language: "en-US",
          }),
          API_OPTIONS
        );
        if (!res.ok) return;
        const data = await res.json();
        const yt = (data.results || []).filter((v) => v.site === "YouTube");
        const trailer = yt.find((v) => v.type === "Trailer") || yt[0];
        if (active && trailer) setTrailerKey(trailer.key);
      } catch (error) {
        console.error("Error fetching trailer for modal:", error);
      }
    })();

    return () => {
      active = false;
    };
  }, [movie, mediaType]);

  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    if (!movie) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [movie, closeModal]);

  if (!movie) return null;

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : null;
  const rating = movie.vote_average
    ? Number(movie.vote_average).toFixed(1)
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={closeModal}
    >
      {/* Stop propagation so clicks inside the card don't close the modal. */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
          onClick={closeModal}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Poster by default; trailer plays only after the user opts in. */}
        <div className="relative w-full aspect-video bg-black">
          {showTrailer && trailerKey ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {(movie.backdrop_path || movie.poster_path) && (
                <img
                  className="w-full h-full object-cover"
                  src={TMDB_IMG + (movie.backdrop_path || movie.poster_path)}
                  alt={title}
                />
              )}
              {/* Play Trailer button overlay — only when a trailer exists. */}
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  aria-label="Play trailer"
                >
                  <span className="flex items-center gap-2 bg-white/90 hover:bg-white text-black px-6 py-3 rounded-full font-semibold">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Trailer
                  </span>
                </button>
              )}
            </>
          )}
        </div>

        <div className="p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
            {year && <span>{year}</span>}
            {rating && <span className="text-green-400">★ {rating}</span>}
            <span className="uppercase tracking-wide">{mediaType}</span>
          </div>
          <p className="text-gray-200 leading-relaxed">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
