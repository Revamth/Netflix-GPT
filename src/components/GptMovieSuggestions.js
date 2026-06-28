// Renders AI recommendation results: a shimmer while loading, an inline error,
// or one row per suggested movie (with its reason and TMDB matches).
import React from "react";
import { useSelector } from "react-redux";
import Shimmer from "../Pages/Shimmer";
import MovieList from "./MovieList";

const GptMovieSuggestions = () => {
  const loading = useSelector((state) => state.gptSlice.gptLoading);
  const error = useSelector((state) => state.gptSlice.gptError);
  const moviesList = useSelector((state) => state.gptSlice.moviesList);
  const moviesResult = useSelector((state) => state.gptSlice.moviesResult);

  if (loading) {
    return <Shimmer />;
  }

  // Inline error message instead of a native alert().
  if (error) {
    return (
      <div className="p-4 mt-24 text-center text-red-400">{error}</div>
    );
  }

  if (!moviesList || moviesList.length === 0) {
    return null;
  }

  return (
    <div className="p-4 mt-24 bg-black text-white bg-opacity-90">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended Movies
      </h2>
      <div className="max-w-7xl mx-auto">
        {moviesList.map((movie, index) => {
          const results = moviesResult[index] || [];
          return (
            // Key by index — AI can return duplicate titles.
            <div key={`${movie.title}-${index}`} className="mb-4">
              {movie.reason && (
                <p className="text-sm text-gray-400 pl-2 md:pl-6 mb-1 italic">
                  {movie.reason}
                </p>
              )}
              {results.length > 0 ? (
                <MovieList title={movie.title} movies={results} />
              ) : (
                <p className="pl-2 md:pl-6 text-gray-500">
                  {movie.title} — no poster found on TMDB.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
