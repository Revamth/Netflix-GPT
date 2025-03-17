import React from "react";
import { useSelector } from "react-redux";
import Shimmer from "../Pages/Shimmer";
import MovieList from "./MovieList";

const GptMovieSuggestions = () => {
  const gptInputBtn = useSelector((state) => state.gptSlice.gptInputBtn);
  const movieNames = useSelector((state) => state.gptSlice.moviesList);
  const moviesResult = useSelector((state) => state.gptSlice.moviesResult);

  if (gptInputBtn && (!movieNames || !moviesResult)) {
    return <Shimmer />;
  }

  if (!movieNames || movieNames.length === 0) {
    return null;
  }

  return (
    <div className="p-4 mt-24 bg-black text-white bg-opacity-90">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended Movies
      </h2>
      <div className="max-w-7xl mx-auto">
        {movieNames.map((movieName, index) => (
          <MovieList
            key={movieName}
            title={movieName}
            movies={moviesResult[index] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
