// A titled, horizontally-scrolling row of MovieCards, with hover-to-reveal
// arrow buttons for scrolling by mouse (mirrors Netflix's row navigation).
// Renders nothing when empty.
import { useRef } from "react";
import MovieCard from "./MovieCard";

const SCROLL_AMOUNT = 800;

const ArrowButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
    className={`hidden md:flex absolute ${
      direction === "left" ? "left-0" : "right-0"
    } top-0 h-full w-12 items-center justify-center bg-gradient-to-${
      direction === "left" ? "r" : "l"
    } from-black/70 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white z-20`}
  >
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      {direction === "left" ? (
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      ) : (
        <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
      )}
    </svg>
  </button>
);

const MovieList = ({ title, movies }) => {
  const rowRef = useRef(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  const scrollBy = (amount) => {
    rowRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="py-2 px-2">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-white pl-2 md:pl-6">
        {title}
      </h2>
      <div className="relative group">
        <ArrowButton direction="left" onClick={() => scrollBy(-SCROLL_AMOUNT)} />
        <div
          ref={rowRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth py-2 gap-2 md:px-6"
        >
          {movies.map(
            (movie) =>
              movie?.poster_path && (
                <MovieCard key={movie.id} movie={movie} />
              )
          )}
        </div>
        <ArrowButton direction="right" onClick={() => scrollBy(SCROLL_AMOUNT)} />
      </div>
    </div>
  );
};

export default MovieList;
