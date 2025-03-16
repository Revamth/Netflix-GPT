import { TMDB_IMG } from "../utils/constants";
import VideoBackground from "./VideoBackground";

const VideoTitle = ({ title, overview, poster_path, movieId }) => {
  return (
    <div className="relative h-screen">
      <VideoBackground movieId={movieId} />

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-80"></div>

      {/* Content */}
      <div className="absolute bottom-12 left-0 w-full px-6 sm:px-12 lg:px-24 text-white">
        <div className="flex flex-col items-start space-y-6">
          {/* Poster */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={TMDB_IMG + poster_path}
              alt="Movie Poster"
            />
          </div>

          {/* Title and Overview */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-yellow-400">
              {title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl">
              {overview}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-md font-semibold flex items-center justify-center border-2 border-white hover:bg-white hover:text-black transition duration-300">
              <svg
                className="w-6 h-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3l14 9-14 9V3z"
                />
              </svg>
              Play
            </button>

            <button className="bg-gray-700 bg-opacity-75 text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center hover:bg-gray-600 transition duration-300">
              <svg
                className="w-6 h-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTitle;
