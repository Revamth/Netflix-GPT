// Hero section: features the first trending movie with its trailer + title overlay.
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((state) => state.movies?.trendingMovies);
  const isModalOpen = useSelector((state) => !!state.movies?.selectedMovie);

  if (!movies || movies.length === 0) return null;

  const mainMovie = movies[0];
  const { original_title, overview, id } = mainMovie || {};

  return (
    <div className="relative pt-16 w-full">
      <VideoBackground id={id} paused={isModalOpen} />
      <VideoTitle title={original_title} overview={overview} movie={mainMovie} />
    </div>
  );
};

export default MainContainer;
