import Header from "./Header";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRated from "../hooks/useTopRated";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import useTrendingMovies from "../hooks/useTrendingMovies";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularTVSeries from "../hooks/usePopularTVSeries";
import useTopRatedTVSeries from "../hooks/useTopRatedTVSeries";
import GPTSearch from "./GPTSearch";

const Browse = () => {
  useNowPlayingMovies();
  usePopularMovies();
  useTopRated();
  useUpcomingMovies();
  useTrendingMovies();
  usePopularTVSeries();
  useTopRatedTVSeries();

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <GPTSearch />
      <MainContainer />
      <SecondaryContainer />
    </div>
  );
};

export default Browse;
