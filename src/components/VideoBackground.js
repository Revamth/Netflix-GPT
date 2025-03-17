const VideoBackground = ({ backdropUrl }) => {
  if (!backdropUrl) return null;

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backdropUrl})`,
        filter: "brightness(0.9)", // Darken the background a bit (adjust as needed)
      }}
    ></div>
  );
};

export default VideoBackground;
