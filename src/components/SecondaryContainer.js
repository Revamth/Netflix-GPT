import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const SecondaryContainer = () => {
  const movies = useSelector((state) => state.movies);

  return (
    <div className="bg-black -mt-16 md:-mt-32 lg:-mt-40 relative z-20">
      <div className="pb-12">
        <MovieList title={"Trending Now"} movies={movies?.trendingMovies} />
        <MovieList title={"New Releases"} movies={movies?.upcomingMovies} />
        <MovieList
          title={"Popular on Netflix"}
          movies={movies?.popularMovies?.slice(5)}
        />
        <MovieList title={"Upcoming Movies"} movies={movies?.upcomingMovies} />
        <MovieList title={"Top Rated Movies"} movies={movies?.topRatedMovies} />
      </div>
    </div>
  );
};

export default SecondaryContainer;
