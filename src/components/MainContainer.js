import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((state) => state.movies?.trendingMovies);
  if (!movies) return null;

  const { original_title, overview, id } = movies[0];

  return (
    <div className="relative pt-16 w-full">
      <VideoBackground movieId={id} />
      <VideoTitle title={original_title} overview={overview} />
    </div>
  );
};

export default MainContainer;
