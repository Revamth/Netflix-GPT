import React from "react";
import { useSelector } from "react-redux";
import useGptSearch from "../hooks/useGptSearch";

// Example prompts so users know the kind of query that works well.
const SUGGESTIONS = [
  "Mind-bending thrillers",
  "Feel-good 90s comedies",
  "Underrated sci-fi",
  "Movies like Inception",
];

const GptSearchBar = () => {
  const { inputValue, setInputValue, getResponseForGivenPrompt } =
    useGptSearch();
  const loading = useSelector((state) => state.gptSlice.gptLoading);

  return (
    <div className="max-w-4xl mx-auto">
      <form
        className="flex items-center gap-3"
        onSubmit={getResponseForGivenPrompt}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-4 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
          placeholder="What would you like to watch today?"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Quick-start suggestion chips. */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInputValue(s)}
            className="text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full px-4 py-1 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GptSearchBar;
