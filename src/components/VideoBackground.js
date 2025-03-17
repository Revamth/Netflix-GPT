const VideoBackground = ({ backdropUrl }) => {
  if (!backdropUrl) return null;

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center top-0 left-0"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        filter: "brightness(0.9)",
      }}
    ></div>
  );
};

export default VideoBackground;
