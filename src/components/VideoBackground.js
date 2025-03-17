import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ id }) => {
  const trailerVideo = useSelector((state) => state.movies?.trailerVideo);
  useMovieTrailer(id);

  console.log("Trailer Video:", trailerVideo);

  if (!trailerVideo || !trailerVideo.key) return null;

  return (
    <div className="w-screen aspect-video">
      <iframe
        className="w-full h-full absolute -mt-[150px] left-0"
        src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=${trailerVideo.key}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          filter: "brightness(2.3)",
        }}
      ></iframe>
    </div>
  );
};

export default VideoBackground;
