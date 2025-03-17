import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";
import { TMDB_IMG } from "../utils/constants";

const MainContainer = () => {
  const movies = useSelector((state) => state.movies?.trendingMovies);
  if (!movies) return null;

  const mainMovie = movies[0];
  const { original_title, overview, backdrop_path } = mainMovie;

  const backdropUrl = TMDB_IMG + backdrop_path;

  return (
    <div className="relative pt-16 w-full">
      <VideoBackground backdropUrl={backdropUrl} />
      <VideoTitle title={original_title} overview={overview} />
    </div>
  );
};

export default MainContainer;
