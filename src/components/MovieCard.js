import { useState } from "react";
import { TMDB_IMG } from "../utils/constants";

const MovieCard = ({ poster_path }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!poster_path) return null;

  return (
    <div
      className="relative flex-shrink-0 transition-all duration-300 cursor-pointer rounded-sm overflow-hidden"
      style={{
        width: "180px",
        height: "260px",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
        zIndex: isHovered ? 10 : "auto",
        transitionDelay: isHovered ? "0.3s" : "0s",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="w-full h-full object-cover"
        src={TMDB_IMG + poster_path}
        alt="Movie Card"
        loading="lazy"
      />
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="rounded-full bg-white text-black p-1 w-8 h-8 flex items-center justify-center hover:bg-opacity-80">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <button className="rounded-full border border-white text-white p-1 w-8 h-8 flex items-center justify-center hover:bg-white hover:bg-opacity-20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <button className="rounded-full border border-white text-white p-1 w-8 h-8 flex items-center justify-center hover:bg-white hover:bg-opacity-20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
