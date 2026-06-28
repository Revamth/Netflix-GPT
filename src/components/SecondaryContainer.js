// The stacked, horizontally-scrolling content rows below the hero.
import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const SecondaryContainer = () => {
  const movies = useSelector((state) => state.movies);

  return (
    <div className="bg-black">
      <div className="relative -mt-[310px] left-0 w-full z-20 ">
        <div className="pb-12">
          <MovieList title={"Trending Now"} movies={movies?.trendingMovies} />
          {/* Now Playing was fetched but never displayed — surface it here. */}
          <MovieList title={"Now Playing"} movies={movies?.nowPlayingMovies} />
          <MovieList
            title={"Popular on Netflix"}
            movies={movies?.popularMovies}
          />
          <MovieList
            title={"Upcoming Movies"}
            movies={movies?.upcomingMovies}
          />
          <MovieList
            title={"Top Rated Movies"}
            movies={movies?.topRatedMovies}
          />
          <MovieList
            title={"Popular TV Series"}
            movies={movies?.popularTVSeries}
          />
          <MovieList
            title={"Top Rated TV Series"}
            movies={movies?.topRatedTVSeries}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondaryContainer;
