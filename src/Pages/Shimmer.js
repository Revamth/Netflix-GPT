import React from "react";

const Shimmer = () => {
  return (
    <div className="w-full mx-auto mt-24 p-4">
      <div className="w-full h-12 bg-gray-800 rounded animate-pulse mb-8"></div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="p-2 bg-gray-800 rounded-lg animate-pulse flex flex-col gap-3"
            >
              <div className="w-full aspect-[2/3] bg-gray-700 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Shimmer;
