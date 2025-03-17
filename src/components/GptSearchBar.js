import React from "react";
import useGptSearch from "../hooks/useGptSearch";

const GptSearchBar = () => {
  const { inputValue, setInputValue, getResponseForGivenPrompt } =
    useGptSearch();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        className="flex items-center gap-3"
        onSubmit={getResponseForGivenPrompt}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
          placeholder="What would you like to watch today?"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
