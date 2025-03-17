import React from "react";
import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

const GPTSearchPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="pt-24 pb-4 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Movie Recommendations
          </h1>
          <p className="text-gray-300">
            Discover new movies based on your preferences
          </p>
        </div>
        <GptSearchBar />
      </div>
      <GptMovieSuggestions />
    </div>
  );
};

export default GPTSearchPage;
