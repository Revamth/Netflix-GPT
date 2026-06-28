// A single poster tile. Hover reveals the title; clicking opens the detail modal.
import { useDispatch } from "react-redux";
import { TMDB_IMG } from "../utils/constants";
import { setSelectedMovie } from "../utils/movieSlice";

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();

  if (!movie?.poster_path) return null;

  const openModal = () => dispatch(setSelectedMovie(movie));

  return (
    <div
      className="group relative flex-shrink-0 w-[180px] h-[260px] rounded-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
      onClick={openModal}
    >
      <img
        className="w-full h-full object-cover"
        src={TMDB_IMG + movie.poster_path}
        alt={movie.title || movie.name || "Movie poster"}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
        <span className="text-white text-sm font-semibold line-clamp-2">
          {movie.title || movie.name}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
