const VideoTitle = ({ title, overview }) => {
  const truncatedOverview =
    overview?.length > 200 ? overview.slice(0, 200) + "..." : overview;

  return (
    <div className="absolute bottom-[130px] left-0 w-full px-6 md:px-12 py-10 bg-gradient-to-t from-black to-transparent">
      <div className="max-w-xl mb-24 md:mb-40">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg text-white mb-6">{truncatedOverview}</p>
        <div className="flex gap-4">
          <button className="bg-white hover:bg-opacity-80 text-black px-8 py-3 rounded font-semibold flex items-center justify-center transition-all duration-200">
            <svg
              className="w-6 h-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <button className="bg-gray-600 bg-opacity-70 hover:bg-opacity-50 text-white px-8 py-3 rounded font-semibold flex items-center justify-center transition-all duration-200">
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
  );
};

export default VideoTitle;
