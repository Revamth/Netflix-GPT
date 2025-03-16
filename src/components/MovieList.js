import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="py-2 px-2">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-white pl-2 md:pl-6">
        {title}
      </h2>
      <div className="relative group">
        <div className="flex overflow-x-auto scrollbar-hide scroll-smooth py-2 gap-2 md:px-6">
          {movies.map(
            (movie) =>
              movie?.poster_path && (
                <MovieCard key={movie.id} poster_path={movie.poster_path} />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
