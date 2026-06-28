// Main authenticated page: runs all TMDB data hooks and toggles between the
// normal browse view (hero + rows) and the GPT search view.
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
import GPTSearchPage from "./GPTSearchPage";
import MovieDetailModal from "./MovieDetailModal";
import { useSelector } from "react-redux";

const Browse = () => {
  const showGptSearch = useSelector((state) => state.gptSlice.showGptSearch);
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
      {showGptSearch ? (
        <GPTSearchPage />
      ) : (
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
      <MovieDetailModal />
    </div>
  );
};

export default Browse;
