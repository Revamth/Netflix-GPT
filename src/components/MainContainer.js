import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((state) => state.movies?.nowPlayingMovies);
  if (!movies) return null;

  const mainMovie = movies?.[0];
  const { original_title, overview, poster_path, id } = mainMovie;

  return (
    <div className="relative">
      <VideoTitle
        title={original_title}
        overview={overview}
        poster_path={poster_path}
        movieId={id}
      />
    </div>
  );
};

export default MainContainer;
