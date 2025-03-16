import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((state) => state.movies?.trailerVideo);
  useMovieTrailer(movieId);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {trailerVideo ? (
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${trailerVideo}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=${trailerVideo}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : null}
    </div>
  );
};

export default VideoBackground;
