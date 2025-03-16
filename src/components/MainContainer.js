import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector((state) => state.movies?.nowPlayingMovies);
  if (!movies) return null;

  const { original_title, overview, poster_path, id } = movies[0];

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
