import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((state) => state.movies?.trailerVideo);
  useMovieTrailer(movieId);

  if (!trailerVideo) return null;

  return (
    <div className="w-screen aspect-video relative">
      <iframe
        className="w-full h-full absolute top-0 left-0"
        src={`https://www.youtube.com/embed/${trailerVideo}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=${trailerVideo}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-40"></div>
    </div>
  );
};

export default VideoBackground;
